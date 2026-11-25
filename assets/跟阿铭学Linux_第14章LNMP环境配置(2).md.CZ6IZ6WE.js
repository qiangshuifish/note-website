import{_ as n,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"第14章LNMP环境配置(2)","description":"","frontmatter":{},"headers":[{"level":2,"title":"14.4 Nginx 配置","slug":"_14-4-nginx-配置","link":"#_14-4-nginx-配置","children":[{"level":3,"title":"14.4.1 默认虚拟主机","slug":"_14-4-1-默认虚拟主机","link":"#_14-4-1-默认虚拟主机","children":[]},{"level":3,"title":"14.4.2 用户认证","slug":"_14-4-2-用户认证","link":"#_14-4-2-用户认证","children":[]},{"level":3,"title":"14.4.3 域名或链接重定向","slug":"_14-4-3-域名或链接重定向","link":"#_14-4-3-域名或链接重定向","children":[]},{"level":3,"title":"14.4.4 Nginx 的访问日志","slug":"_14-4-4-nginx-的访问日志","link":"#_14-4-4-nginx-的访问日志","children":[]},{"level":3,"title":"14.4.5 配置静态文件不记录日志并添加过期时间","slug":"_14-4-5-配置静态文件不记录日志并添加过期时间","link":"#_14-4-5-配置静态文件不记录日志并添加过期时间","children":[]},{"level":3,"title":"14.4.6 Nginx 防盗链","slug":"_14-4-6-nginx-防盗链","link":"#_14-4-6-nginx-防盗链","children":[]},{"level":3,"title":"14.4.7 访问控制","slug":"_14-4-7-访问控制","link":"#_14-4-7-访问控制","children":[]},{"level":3,"title":"14.4.8 Nignx 解析 PHP","slug":"_14-4-8-nignx-解析-php","link":"#_14-4-8-nignx-解析-php","children":[]},{"level":3,"title":"14.4.9 Nginx 代理","slug":"_14-4-9-nginx-代理","link":"#_14-4-9-nginx-代理","children":[]},{"level":3,"title":"14.4.10 Nignx 配置 SSL","slug":"_14-4-10-nignx-配置-ssl","link":"#_14-4-10-nignx-配置-ssl","children":[]}]},{"level":2,"title":"14.5 php-fpm配置","slug":"_14-5-php-fpm配置","link":"#_14-5-php-fpm配置","children":[{"level":3,"title":"14.5.1 php-fpm的pool","slug":"_14-5-1-php-fpm的pool","link":"#_14-5-1-php-fpm的pool","children":[]},{"level":3,"title":"14.5.2 php-fpm的慢执行日志","slug":"_14-5-2-php-fpm的慢执行日志","link":"#_14-5-2-php-fpm的慢执行日志","children":[]},{"level":3,"title":"14.5.3 php-fpm定义open_basedir","slug":"_14-5-3-php-fpm定义open-basedir","link":"#_14-5-3-php-fpm定义open-basedir","children":[]},{"level":3,"title":"14.5.4 php-fpm进程管理","slug":"_14-5-4-php-fpm进程管理","link":"#_14-5-4-php-fpm进程管理","children":[]}]},{"level":2,"title":"14.6 课后习题","slug":"_14-6-课后习题","link":"#_14-6-课后习题","children":[]}],"relativePath":"跟阿铭学Linux/第14章LNMP环境配置(2).md","filePath":"跟阿铭学Linux/第14章LNMP环境配置(2).md","lastUpdated":1795561067000}'),e={name:"跟阿铭学Linux/第14章LNMP环境配置(2).md"};function l(t,s,c,o,h,r){return a(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="第14章lnmp环境配置-2" tabindex="-1">第14章LNMP环境配置(2) <a class="header-anchor" href="#第14章lnmp环境配置-2" aria-label="Permalink to &quot;第14章LNMP环境配置(2)&quot;">​</a></h1><h2 id="_14-4-nginx-配置" tabindex="-1">14.4 Nginx 配置 <a class="header-anchor" href="#_14-4-nginx-配置" aria-label="Permalink to &quot;14.4 Nginx 配置&quot;">​</a></h2><p>这一节所讲述的内容为工作中使用较多的部分，你一开始学起来会比较吃力，因为不太明白很多概念是什么意思。阿铭的建议是，一定要跟着去动手操作，根据结果来理解需求的本质，只要理解了自然就明白了。</p><h3 id="_14-4-1-默认虚拟主机" tabindex="-1">14.4.1 默认虚拟主机 <a class="header-anchor" href="#_14-4-1-默认虚拟主机" aria-label="Permalink to &quot;14.4.1 默认虚拟主机&quot;">​</a></h3><p>先来解释“虚拟主机”。早期的 Linux 服务器上，一个服务器只能运行一个网站，也就是说只能跑一个域名。但随着技术的发展，一个服务器上可以跑多个域名，这样就帮我们节省了成本。其实，这里的服务器就叫作主机，早期一个主机对应一个站点。现在不同了，一个主机可以跑多个站点，所以就有了虚拟主机的概念。我们可以把一台服务器虚拟出多个主机出来，这样就实现了一台服务器跑多个站点。</p><p>既然一台服务器上可以有多个虚拟主机，每个虚拟主机都会定义一个域名（当然也可以定义多个），那么只要把这个域名解析指向到该台服务器，我们自然就可以访问这个站点了。说到这儿，你可能又有新的问题：什么叫解析指向？如果你会用浏览器访问一个站点，那么肯定不难理解下面阿铭的解释。咱们访问一个网站，需要先在浏览器里输入域名，然后就能访问到网站内容了。这个过程是需要浏览器和远程服务器通信的，网站内容就是从服务器上读取到的。而这个服务器在哪儿是由你访问的域名来决定的，而域名之所以能决定服务器在哪里，就是因为这个域名做了解析指向。对服务器的 IP 地址做域名解析，这个行为是由 DNS 服务器来完成的。</p><p>假如你访问的域名指向了你的服务器，而你又在这台服务器上做了配置标记了这个域名（接下来阿铭会讲解如何标记），这样这个域名就能被正常访问。但如果没有在服务器上给这个域名做标记，会发生什么呢？按理说，没有做标记的域名是不合法的，是不能正常返回结果的。</p><p>上面讲了那么多关于域名的东西，阿铭的目的就是让你更容易理解“默认虚拟主机”的概念。Nginx 是支持多个虚拟主机的，也就是说可以在一个服务器上运行多个站点，标记多个域名。但如果没有标记的域名也指向了这台服务器，那总得有处理这个域名的一个虚拟主机吧，这个虚拟主机就叫作“默认虚拟主机”。通俗点讲，你的服务器上有很多域名，很多站点，很多虚拟主机，这些域名是在 Nginx 的配置文件中做过标记的，是“名花有主”、一一对应的，每个域名都能对应着自己的虚拟主机。但是，有一个特殊的域名也指向了服务器，却没有跟它对应的虚拟主机。这时候，Nginx 就会把这个域名直接丢给一个特殊的虚拟主机来处理，这个特殊的虚拟主机就是“默认虚拟主机”。</p><p>在 Nginx 中第一个被加载的虚拟主机就是默认主机。当然，我们也可以用一个配置来标记默认虚拟主机。也就是说，如果没有这个标记，第一个虚拟主机就为默认虚拟主机。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>修改主配置文件 nginx.conf，在结束符号}前面加入一行配置，修改内容如下：</span></span>
<span class="line"><span>include vhost/*.conf;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>意思是会加载 /usr/local/nginx/conf/vhost/ 下面的所有以 .conf 结尾的文件，这样我们就可以把所有虚拟主机配置文件都放到 vhost 目录下面了。执行如下命令创建虚拟主机配置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># mkdir /usr/local/nginx/conf/vhost</span></span>
<span class="line"><span># cd /usr/local/nginx/conf/vhost</span></span>
<span class="line"><span># vim default.conf</span><span> // 写入如下内容</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80 default_server; # 有这个default_server标记的就是默认虚拟主机</span></span>
<span class="line"><span>server_name aaa.com;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /data/nginx/default;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span><span> // 更改配置文件后，重载</span></span>
<span class="line"><span># mkdir -p /data/nginx/default</span></span>
<span class="line"><span># echo &quot;default_server&quot; &gt; /data/nginx/default/index.html</span><span> // 创建索引页</span></span>
<span class="line"><span># curl -x127.0.0.1:80 aaa.com</span><span> // 访问aaa.com</span></span>
<span class="line"><span>default_server</span></span>
<span class="line"><span># curl -x127.0.0.1:80 1212.com</span><span> // 访问一个没有定义过的域名，也会访问到aaa.com</span></span>
<span class="line"><span>default_server</span></span></code></pre></div><h3 id="_14-4-2-用户认证" tabindex="-1">14.4.2 用户认证 <a class="header-anchor" href="#_14-4-2-用户认证" aria-label="Permalink to &quot;14.4.2 用户认证&quot;">​</a></h3><p>再来创建一个新的虚拟主机：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/nginx/conf/vhost/</span></span>
<span class="line"><span># vim test.com.conf</span><span> // 加入如下内容</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name test.com;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /data/nginx/test.com;</span></span>
<span class="line"><span>location /</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>auth_basic &quot;Auth&quot;;</span></span>
<span class="line"><span>auth_basic_user_file /usr/local/nginx/conf/htpasswd;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span># yum install -y httpd-tools</span><span> // 安装httpd-tools，目的是为了安装下面的htpasswd命令</span></span>
<span class="line"><span># htpasswd -cm /usr/local/nginx/conf/htpasswd aming</span><span> // 创建aming用户</span></span>
<span class="line"><span>New password:</span></span>
<span class="line"><span>Re-type new password:</span></span>
<span class="line"><span>Adding password for user aming</span></span>
<span class="line"><span>// htpasswd命令为创建用户的工具，-c为create（创建），-m指定密码加密方式为MD5，</span></span>
<span class="line"><span>// / usr/local/nginx/conf/htpasswd为密码文件，aming为要创建的用户。第一次执行该命令需要加</span></span>
<span class="line"><span>// 第二次再创建新的用户时，就不用加-c了，否则密码文件会被重置，之前的用户被清空</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>核心配置语句就两行，auth_basic打开认证，auth_basic_user_file指定用户密码文</span></span></code></pre></div><p>件，当然前提是这个用户密码文件存在。而生成用户密码文件的工具需要借助 httpd 的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>htpasswd，Nginx 不自带这个工具。下面可以使用curl命令来验证：</span></span>
<span class="line"><span># mkdir /data/nginx/test.com</span></span>
<span class="line"><span># echo &quot;test.com&quot; &gt; /data/nginx/test.com/index.html</span></span>
<span class="line"><span># curl -I -x127.0.0.1:80 test.com</span></span>
<span class="line"><span>HTTP/1.1 401 Unauthorized</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sat, 27 Jun 2020 02:07:38 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 179</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>WWW-Authenticate: Basic realm=&quot;Auth&quot;</span></span>
<span class="line"><span>说明：状态码为401说明，该网站需要验证。</span></span>
<span class="line"><span># curl -uaming:lishiming -x127.0.0.1:80 test.com</span><span> // 使用curl的-u指定用户名密码就可以正</span></span>
<span class="line"><span>test.com</span></span></code></pre></div><p>下面我们在 Windows 上来访问并验证用户认证。首先打开 Windows 的 hosts 文件，该文件类似 Linux 上的 /etc/hosts。Windows 上的 hosts 文件所在路径为C:\\Windows\\System32\\drivers\\etc\\hosts，第一次编辑它会提示用什么方式打开，选择“记事本”或者“写字板”都可以。在最下面增加一行：并加入一行（你的 IP 地址可能和阿铭的不一样，请自行更改）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>192.168.72.128 test.com</span></span></code></pre></div><p>然后在浏览器中访问 test.com，出现如图 14-1 所示的验证对话框。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/1.png" alt=""></a></p><p>图 14-1 验证</p><p>输入用户名 aming 和其密码，就可以访问了。如果是针对某个目录做用户认证，需要修改</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location后面的路径：</span></span>
<span class="line"><span>location /admin/</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>auth_basic &quot;Auth&quot;;</span></span>
<span class="line"><span>auth_basic_user_file /usr/local/nginx/conf/htpasswd;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_14-4-3-域名或链接重定向" tabindex="-1">14.4.3 域名或链接重定向 <a class="header-anchor" href="#_14-4-3-域名或链接重定向" aria-label="Permalink to &quot;14.4.3 域名或链接重定向&quot;">​</a></h3><p>重定向也可以叫作跳转，这个用法比较普遍，一个网站可能会有多个域名，比如小明公司的网站可以通过两个域名访问：域名 A 和域名 B。用域名 A 访问的时候，浏览器里面的网址直接变成了域名 B，这其实就是域名跳转的过程。域名跳转有什么作用呢？在阿铭看来主要有两方面：第一，一个站点有多个域名会对 SEO 有影响，说白了就是对百度搜索关键词的排名有影响，如果把多个域名全部跳转到一个指定的域名，这样以这个域名为中心，就可以把权重集中在这个域名上，搜索关键词的排名也就靠前了；第二，如果之前的某个域名不再使用了，但是搜索引擎还留着之前老域名的链接，这意味着用户可能会搜到我们的网站并且单击老的域名，故需要把老域名做个跳转跳到新域名，这样用户搜索的时候，也可以访问到网站。</p><p>下面阿铭将 test1.com 和 test2.com 重定向到 test.com，配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vi test.com.conf</span><span> // 更改为如下内容</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name test.com test1.com test2.com;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /data/nginx/test.com;</span></span>
<span class="line"><span>if ($host != &#39;test.com&#39; ) {</span></span>
<span class="line"><span>rewrite ^/(.*)$ http://test.com/$1 permanent;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>在 Nginx 配置中，server_name后面可以跟多个域名，permanent为永久重定向，状态码</span></span>
<span class="line"><span>为 301。另外还有一个常用的redirect，叫作临时重定向，状态码为 302。那么什么时候使</span></span></code></pre></div><p>用 301 或者 302 呢？阿铭给你一个简单的法则：如果跳转域名就用 301，如果仅跳转链接就用 302。测试过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span># curl -x127.0.0.1:80 test1.com/123.txt -I</span></span>
<span class="line"><span>HTTP/1.1 301 Moved Permanently</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sat, 27 Jun 2020 02:32:05 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 169</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>Location: http://test.com/123.txt</span></span></code></pre></div><p>下面再来看看链接跳转。有一个需求，需要将 <a href="http://test.com/a.html" target="_blank" rel="noreferrer">http://test.com/a.html</a> 跳转到<a href="http://test.com/b.html%EF%BC%8C%E7%9C%8B%E7%9C%8B%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%90%A7%E3%80%82%E6%B5%8B%E8%AF%95%E8%BF%87%E7%A8%8B%E5%A6%82%E4%B8%8B%EF%BC%9A" target="_blank" rel="noreferrer">http://test.com/b.html，看看如何实现吧。测试过程如下：</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vi test.com.conf</span><span> // 更改为如下内容</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name test.com;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /data/nginx/test.com;</span></span>
<span class="line"><span>rewrite /a.html /b.html redirect;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx –t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span># curl -I -x127.0.0.1:80 test.com/a.html</span></span>
<span class="line"><span>HTTP/1.1 302 Moved Temporarily</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sat, 27 Jun 2020 02:38:07 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 145</span></span>
<span class="line"><span>Location: http://test.com/b.html</span></span>
<span class="line"><span>Connection: keep-alive</span></span></code></pre></div><p>如果是相同域名的链接跳转，可以省略域名，只写链接，比如本例中阿铭只写了 /a.html 和</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/b.html。最终测试出来状态码为 302，这是因为我们使用了临时重定向的控制flag</span></span>
<span class="line"><span>rediect。</span></span></code></pre></div><h3 id="_14-4-4-nginx-的访问日志" tabindex="-1">14.4.4 Nginx 的访问日志 <a class="header-anchor" href="#_14-4-4-nginx-的访问日志" aria-label="Permalink to &quot;14.4.4 Nginx 的访问日志&quot;">​</a></h3><p>访问日志作用很大，不仅可以记录网站的访问情况，还可以在网站有异常发生时帮助我们定位问题，比如网站被攻击时，可以通过查看日志看到一些规律。先来看看 Nginx 的日志格式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># grep -A2 log_format /usr/local/nginx/conf/nginx.conf</span></span>
<span class="line"><span>log_format combined_realip &#39;$remote_addr $http_x_forwarded_for [$time_local]&#39;</span></span>
<span class="line"><span>&#39; $host &quot;$request_uri&quot; $status&#39;</span></span>
<span class="line"><span>&#39; &quot;$http_referer&quot; &quot;$http_user_agent&quot;&#39;;</span></span></code></pre></div><p>Nginx 需要在主配置文件中定义日志格式，然后在虚拟主机里面调用。配置文件中的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>combined_realip为日志格式的名字，后面可以调用它；$remote_addr为访问网站的用</span></span>
<span class="line"><span>户的出口 IP；$http_x_forwarded_for为代理服务器的 IP，如果使用了代理，则会记录代</span></span>
<span class="line"><span>理的 IP；$time_local为当前的时间；$host为访问的主机名；$request_uri为访问的</span></span>
<span class="line"><span>URL 地址；$status为状态码；$http_referer为referer地址；$http_user_agent</span></span>
<span class="line"><span>为user_agent。</span></span></code></pre></div><p>然后再到虚拟主机配置文件中指定访问日志的路径：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># vi test.com.conf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 修改配置文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">server</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">listen 80;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">server_name test.com test1.com test2.com;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">index index.html index.htm index.php;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">root /data/nginx/test.com;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">if ($host != &#39;test.com&#39; ) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rewrite ^/(.*)$ http://test.com/$1 permanent;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">access_log /tmp/1.log combined_realip;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">使用access_log来指定日志的存储路径，最后面指定日志的格式名字，测试过程如下：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># /usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># curl -x127.0.0.1:80 test.com/111</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​html&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​head&gt;&lt;​title&gt;404 Not Found&lt;​/title&gt;&lt;​/head&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​body&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​center&gt;&lt;​h1&gt;404 Not Found&lt;​/h1&gt;&lt;​/center&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​hr&gt;&lt;​center&gt;nginx/1.18.0&lt;​/center&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/body&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/html&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># cat /tmp/1.log</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">127.0.0.1 - [27/Jun/2020:10:47:10 +0800] test.com &quot;/111&quot; 404 &quot;-&quot; &quot;curl/7.61.1&quot;</span></span></code></pre></div><p>在 13.8.1 节中，阿铭介绍系统日志 /var/log/messages 时，提到过其支持日志切割，即每周一个日志，这样做的目的是为了防止日志无限制增大。同样地，Nginx 的日志也需要做切割，要想切割 Nginx 日志需要借助系统的切割工具或者自定义脚本。在这里，阿铭提供一个 Nginx的日志切割脚本：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># vim /usr/local/sbin/nginx_log_rotate.sh</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 写入如下内容</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#! /bin/bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 假设nginx的日志存放路径为/data/logs/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">d</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">date</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;-1 day&quot; +%Y%m%d\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">logdir</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/data/logs&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">nginx_pid</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/usr/local/nginx/logs/nginx.pid&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $logdir</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> log </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.log\`</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">do</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mv</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $log $log</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$d</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">done</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/bin/kill</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -HUP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $nginx_pid</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span></span></code></pre></div><p>写完脚本后，还需要增加任务计划：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0 0 * * * /bin/bash /usr/local/sbin/nginx_log_rotate.sh</span></span></code></pre></div><p>该脚本会在 0 点 0 分执行，其大概的意思是：修改 /data/logs/ 下所有访问日志的名字，改为以昨天日期为后缀的名字，比如 test.com.log-20200530，改完名字后还要重新生成新的日志，这里使用 kill -HUP pid 来完成。</p><h3 id="_14-4-5-配置静态文件不记录日志并添加过期时间" tabindex="-1">14.4.5 配置静态文件不记录日志并添加过期时间 <a class="header-anchor" href="#_14-4-5-配置静态文件不记录日志并添加过期时间" aria-label="Permalink to &quot;14.4.5 配置静态文件不记录日志并添加过期时间&quot;">​</a></h3><p>一个网站会有很多元素，尤其是图片、JS、CSS 等静态的文件非常多，用户每请求一个页面就会访问诸多的图片、JS 等静态元素，这些元素的请求会被记录在日志中。如果一个站点访问量很大，那么访问日志文件增长会非常快，一天就可以达到几吉字节（GB）。这不仅会对服务器的磁盘空间造成影响，更重要的是会影响磁盘的读写速度。阿铭一开始也说了，访问日志很重要，我们又不能不记录。还好把这些巨量的静态元素请求记录到日志里的意义并不大，所以可以限制记录这些静态元素，并且把日志按天归档，一天一个日志，这样也可以防止单个日志文件过大。Nginx 的日志如果不记录静态文件，那么其配置并不复杂，虚拟主机配置文件改写如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vi</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name test.com test1.com test2.com;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /data/nginx/test.com;</span></span>
<span class="line"><span>if ($host != &#39;test.com&#39; ) {</span></span>
<span class="line"><span>rewrite ^/(.*)$ http://test.com/$1 permanent;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>expires 7d;</span></span>
<span class="line"><span>access_log off;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>location ~ .*\\.(js|css)$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>expires 12h;</span></span>
<span class="line"><span>access_log off;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>access_log /tmp/1.log combined_realip;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>使用location ~可以指定对应的静态文件，expires配置过期时间，而access_log配置</span></span>
<span class="line"><span>为off就可以不记录访问日志了。平时我们访问一个网站时，很多元素为静态的小图片，那这</span></span></code></pre></div><p>些小图片完全可以缓存在咱们的计算机里，这样再次访问该站点时，速度就会很快。那到底能缓存多久呢？如果服务器上的某个图片更改了，那么应该访问新的图片才对。这就涉及一个静态文件缓存时长的问题，也叫作“缓存过期时间”。下面阿铭来模拟一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># echo &quot;111111111111&quot; &gt; /data/nginx/test.com/1.js</span><span> // 创建JS文件</span></span>
<span class="line"><span># echo &quot;2222222222222&quot; &gt; /data/nginx/test.com/2.jpg</span><span> // 创建JPG文件</span></span>
<span class="line"><span># touch /data/nginx/test.com/1.jss</span><span> // 创建一个对比的文件</span></span>
<span class="line"><span># curl -I -x127.0.0.1:80 test.com/1.js</span><span> // 访问JS类型的文件，缓存过期时间为12小时</span></span>
<span class="line"><span>HTTP/1.1 200 OK</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 13:44:07 GMT</span></span>
<span class="line"><span>Content-Type: application/javascript</span></span>
<span class="line"><span>Content-Length: 13</span></span>
<span class="line"><span>Last-Modified: Sun, 28 Jun 2020 13:43:51 GMT</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>ETag: &quot;5ef89e97-d&quot;</span></span>
<span class="line"><span>Expires: Mon, 29 Jun 2020 01:44:07 GMT</span></span>
<span class="line"><span>Cache-Control: max-age=43200</span></span>
<span class="line"><span>Accept-Ranges: bytes</span></span>
<span class="line"><span># curl -I -x127.0.0.1:80 test.com/2.jpg</span><span> // 访问JPG类型的文件，缓存过期时间为7小时</span></span>
<span class="line"><span>HTTP/1.1 200 OK</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 13:44:21 GMT</span></span>
<span class="line"><span>Content-Type: image/jpeg</span></span>
<span class="line"><span>Content-Length: 14</span></span>
<span class="line"><span>Last-Modified: Sun, 28 Jun 2020 13:43:56 GMT</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>ETag: &quot;5ef89e9c-e&quot;</span></span>
<span class="line"><span>Expires: Sun, 05 Jul 2020 13:44:21 GMT</span></span>
<span class="line"><span>Cache-Control: max-age=604800</span></span>
<span class="line"><span>Accept-Ranges: bytes</span></span>
<span class="line"><span># curl -I -x127.0.0.1:80 test.com/1.jss</span></span>
<span class="line"><span>HTTP/1.1 200 OK</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 13:44:38 GMT</span></span>
<span class="line"><span>Content-Type: application/octet-stream</span></span>
<span class="line"><span>Content-Length: 0</span></span>
<span class="line"><span>Last-Modified: Sun, 28 Jun 2020 13:44:01 GMT</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>ETag: &quot;5ef89ea1-0&quot;</span></span>
<span class="line"><span>Accept-Ranges: bytes</span></span>
<span class="line"><span>可以很清楚地看到Cache-control对应着缓存过期时间，另外也可以看一下访问日志：</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cat /tmp/1.log</span></span>
<span class="line"><span>127.0.0.1 - [27/Jun/2020:10:47:10 +0800] test.com &quot;/111&quot; 404 &quot;-&quot; &quot;curl/7.61.1&quot;</span></span>
<span class="line"><span>127.0.0.1 - [28/Jun/2020:21:44:38 +0800] test.com &quot;/1.jss&quot; 200 &quot;-&quot; &quot;curl/7.61.1&quot;</span></span></code></pre></div><p>虽然阿铭访问了 JS 以及 JPG，但都没有记录到访问日志中，效果实现了。</p><h3 id="_14-4-6-nginx-防盗链" tabindex="-1">14.4.6 Nginx 防盗链 <a class="header-anchor" href="#_14-4-6-nginx-防盗链" aria-label="Permalink to &quot;14.4.6 Nginx 防盗链&quot;">​</a></h3><p>我们先来聊一个案例。2009 年的时候，阿铭负责运维的一个业务 5d6d（早已经死翘翘了）为免费论坛，谁都可以申请，期间有一个站长申请了一个站点专门来存放图片。由于缺少经验，阿铭并没有给该业务做防盗链，导致这个网站的图片随便被别的网站借用，以致该网站访问量巨大，最终业务带宽在一个月内飙升了 300MB/s。当发现带宽异常时，我们通过抓包找到了对应的站点，随后给服务器做了防盗链，并且删除了有问题的图片，这样才把带宽恢复到正常值。但那个月的带宽费用确实让公司出血了。</p><p>通过这个真实案例，你可以体会到做防盗链是多么有价值。防盗链，通俗讲，就是不让别人盗用你网站上的资源。这个资源，通常指的是图片、视频、歌曲、文档等。讲解防盗链配置之前，阿铭再给你讲述一下 referer 的概念，上面讲解日志格式时曾提到过它。你通过 A 网站的一个页面 <a href="http://a.com/a.html" target="_blank" rel="noreferrer">http://a.com/a.html</a> 里面的链接去访问 B 网站的一个页面 <a href="http://b.com/b.html%EF%BC%8C%E9%82%A3%E4%B9%88%E8%BF%99%E4%B8%AA" target="_blank" rel="noreferrer">http://b.com/b.html，那么这个</a> B 网站页面的 referer 就是 <a href="http://a.com/a.html%E3%80%82%E4%B9%9F%E5%B0%B1%E6%98%AF%E8%AF%B4%EF%BC%8C%E4%B8%80%E4%B8%AA" target="_blank" rel="noreferrer">http://a.com/a.html。也就是说，一个</a> referer 其实就是一个网址。Nginx 配置防盗链由于和过期时间、不记录日志有部分重合，因此可以把两部分组合在一起：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location ~* ^.+\\.(gif|jpg|png|swf|flv|rar|zip|doc|pdf|gz|bz2|jpeg|bmp|xls)$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>expires 7d;</span></span>
<span class="line"><span>valid_referers none blocked server_names *.test.com ;</span></span>
<span class="line"><span>if ($invalid_referer) {</span></span>
<span class="line"><span>return 403;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>access_log off;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span># curl -x127.0.0.1:80 -I -e &quot;http://aaa.com/1.txt&quot; test.com/2.jpg</span></span>
<span class="line"><span>HTTP/1.1 403 Forbidden</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:06:14 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 153</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>// 使用-e来定义referer，这个referer一定要以http://开头，否则不管用</span></span>
<span class="line"><span># curl -x127.0.0.1:80 -I -e &quot;http://test.com/1.txt&quot; test.com/2.jpg</span></span>
<span class="line"><span>HTTP/1.1 200 OK</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:06:30 GMT</span></span>
<span class="line"><span>Content-Type: image/jpeg</span></span>
<span class="line"><span>Content-Length: 14</span></span>
<span class="line"><span>Last-Modified: Sun, 28 Jun 2020 13:43:56 GMT</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>ETag: &quot;5ef89e9c-e&quot;</span></span>
<span class="line"><span>Expires: Sun, 05 Jul 2020 14:06:30 GMT</span></span>
<span class="line"><span>Cache-Control: max-age=604800</span></span>
<span class="line"><span>Accept-Ranges: bytes</span></span></code></pre></div><p>可以看到不仅仅有过期时间，还有防盗链的功能。</p><h3 id="_14-4-7-访问控制" tabindex="-1">14.4.7 访问控制 <a class="header-anchor" href="#_14-4-7-访问控制" aria-label="Permalink to &quot;14.4.7 访问控制&quot;">​</a></h3><p>对于一些比较重要的网站内容，除了可以使用用户认证限制访问之外，还可以通过其他一些方</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>法做到限制，比如限制 IP，或者限制user_agent。限制 IP 指的是限制访问网站的来源 IP，</span></span>
<span class="line"><span>而限制user_agent通常用来限制恶意或者不正常的请求。</span></span>
<span class="line"><span>下面再来介绍一下user_agent。user_agent翻译为中文叫作“用户代理”，其实可以理解为</span></span>
<span class="line"><span>浏览器标识，当用curl访问时，user_agent为“curl/7.29.0”，用 Chrome 浏览器访问时，</span></span>
<span class="line"><span>user_agent为“Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML,</span></span>
<span class="line"><span>like Gecko) Chrome/83.0.4103.116 Safari/537.36”。阿铭在工作中经常针对user_agent来</span></span></code></pre></div><p>限制一些访问，比如限制一些不太友好的搜索引擎“爬虫”，你之所以能在百度搜到阿铭的论坛，就是因为百度会派一些“蜘蛛爬虫”来抓取网站数据。“蜘蛛爬虫”抓取数据类似于用户用浏览器访问网站，当“蜘蛛爬虫”太多或者访问太频繁时，就会浪费服务器资源。另外，也可以限制恶意请求，这种恶意请求我们通常称作 cc 攻击，它的原理很简单，就是用很多用户的计算机同时访问同一个站点，当访问量或者频率达到一定层次，就会耗尽服务器资源，从而使之不</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>能正常提供服务。这种 cc 攻击其实有很明显的规律，其中发起这些恶意请求的user_agent</span></span>
<span class="line"><span>相同或者相似，那我们就可以通过限制user_agent来起到防攻击的作用。</span></span></code></pre></div><p>Nginx 也需要限制某些 IP 不能访问或者只允许某些 IP 访问。比如，我们有个需求是只允许192.168.72.1 和 127.0.0.1 访问 admin 目录，配置文件如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location /admin/</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>allow 192.168.72.1;</span></span>
<span class="line"><span>allow 127.0.0.1;</span></span>
<span class="line"><span>deny all;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假如来源 IP 为 192.168.72.129，它会从上到下逐一去匹配，第一个 IP（192.168.72.1）不匹</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">配，第二个 IP（127.0.0.1）不匹配，直到第三行（all）的时候才匹配到，匹配的这条规则</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">为deny（也就是拒绝访问），所以最终会返回一个 403 的状态码。测试过程如下：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># mkdir /data/nginx/test.com/admin/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># echo &quot;123&quot; &gt; /data/nginx/test.com/admin/1.html</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># curl -x127.0.0.1:80 test.com/admin/1.html</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">123</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># curl -x192.168.72.128:80 test.com/admin/1.html</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​html&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​head&gt;&lt;​title&gt;403 Forbidden&lt;​/title&gt;&lt;​/head&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​body&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​center&gt;&lt;​h1&gt;403 Forbidden&lt;​/h1&gt;&lt;​/center&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​hr&gt;&lt;​center&gt;nginx/1.18.0&lt;​/center&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/body&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/html&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">配置文件中的 IP 也可以为 IP 段，比如可以写成allow 192.168.72.0/24。如果只拒绝某</span></span></code></pre></div><p>几个 IP，就可以写成这样了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location /admin/</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>deny 192.168.72.1;</span></span>
<span class="line"><span>deny 127.0.0.1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>如果是黑名单的形式，就不需要写allow all了，因为默认就是允许所有。除了这种简单地</span></span></code></pre></div><p>限制目录外，也可以根据正则匹配来限制。对于使用 PHP 语言编写的网站，有一些目录是有上传文件需求的，比如阿铭在前面列举的那个防盗链案例，因为服务器可以上传图片，并且没有做防盗链，所以被人家当成了一个图片存储服务器，并且盗用带宽流量。如果网站代码有漏洞，让黑客上传了一个用 PHP 代码写的木马，由于网站可以执行 PHP 程序，最终就会让黑客拿到服务器权限。为了避免这种情况发生，我们需要把能上传文件的目录直接禁止解析PHP 代码（不用担心会影响网站访问，若这种目录也需要解析 PHP，那说明程序员不合格），Nginx 禁止某个目录解析 PHP 的配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location ~ .*(abc|image)/.*\\.php$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>deny all;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>小括号里面的竖线为分隔符，是“或者”的意思，把该分隔符放在 abc 和 image 之间就可以使</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>URL 中带有abc或者image字符串，并且是 PHP 的请求拒绝访问网站。</span></span>
<span class="line"><span>在 Nginx 配置里，也可以针对user_agent做一些限制，阿铭平时用得非常多。配置如下：</span></span>
<span class="line"><span>if ($http_user_agent ~ &#39;Spider/3.0|YoudaoBot|Tomato&#39;)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>return 403;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>其中~为匹配符号，只要user_agent中含有Spider/3.0、YoudaoBot、Tomato字符</span></span>
<span class="line"><span>串，都会被拒绝，return 403为直接返回 403 状态码，当然也可以把它替换为deny</span></span>
<span class="line"><span>all。</span></span></code></pre></div><h3 id="_14-4-8-nignx-解析-php" tabindex="-1">14.4.8 Nignx 解析 PHP <a class="header-anchor" href="#_14-4-8-nignx-解析-php" aria-label="Permalink to &quot;14.4.8 Nignx 解析 PHP&quot;">​</a></h3><p>前面阿铭讲了很多 Nginx 的配置，一直都还没有提到和 PHP 相关的东西。在 LNMP 中，PHP</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>是以一个服务（php-fpm）的形式存在的，首先要启动php-fpm服务，然后 Nginx 再和</span></span>
<span class="line"><span>php-fpm通信。也就是说，处理 PHP 脚本解析的工作是由php-fpm来完成的，Nginx 仅仅是</span></span>
<span class="line"><span>一个“搬运工”，它把用户的请求传递给php-fpm，php-fpm处理完成后把结果传递给 Nginx，</span></span></code></pre></div><p>Nginx 再把结果返回给用户。那么 Nginx 是如何和 PHP 联系起来的呢？其实，在上面阿铭给大家的 nginx.conf 中已经有所展示。下面是 test.com.conf 的内容，其中包含了 PHP 相关的配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name test.com test1.com test2.com;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /data/nginx/test.com;</span></span>
<span class="line"><span>if ($host != &#39;test.com&#39; ) {</span></span>
<span class="line"><span>rewrite ^/(.*)$ http://test.com/$1 permanent;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>location ~ \\.php$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>include fastcgi_params;</span></span>
<span class="line"><span>fastcgi_pass unix:/tmp/php-fcgi.sock;</span></span>
<span class="line"><span>fastcgi_index index.php;</span></span>
<span class="line"><span>fastcgi_param SCRIPT_FILENAME /data/nginx/test.com$fastcgi_script_name;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>access_log /tmp/1.log combined_realip;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>其中fastcgi_pass用来指定php-fpm的地址，如果php-fpm监听的是一个tcp:port的地</span></span>
<span class="line"><span>址（比如 127.0.0.1:9000），那么也需要在这里改成fastcgi_pass 127.0.0.1:9000。这</span></span>
<span class="line"><span>个地址一定要和php-fpm服务监听的地址匹配，否则会报 502 错误。</span></span>
<span class="line"><span>还有一个地方也需要注意，factcgi_param SCRIPT_FILENAME后面跟的路径为该站点的</span></span></code></pre></div><p>根目录，和前面定义的 root 那个路径保持一致。如果这里配置不对，访问 PHP 页面会出现404 错误。</p><h3 id="_14-4-9-nginx-代理" tabindex="-1">14.4.9 Nginx 代理 <a class="header-anchor" href="#_14-4-9-nginx-代理" aria-label="Permalink to &quot;14.4.9 Nginx 代理&quot;">​</a></h3><p>Nginx 的代理功能非常实用，这也是 Nginx 越来越受欢迎的一个原因。一家公司有很多台服务器，为了节省成本，不能为所有服务器都分配公网 IP，而如果一个没有公网 IP 的服务器要提供 Web 服务，就可以通过代理来实现，其代理过程如图 14-2 所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/2.png" alt=""></a></p><p>图 14-2 Nginx 代理</p><p>如果 Nginx 后面有多台 Web 服务器，并且 Nginx 同时代理这些服务器，那么 Nginx 就起到一个负载均衡的作用，这个功能在生产环境中用得也特别多。先来看一下如何配置 Nginx 的代理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/nginx/conf/vhost</span></span>
<span class="line"><span># vim proxy.conf</span><span> // 写入如下内容</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name ask.apelearn.com;</span></span>
<span class="line"><span>location /</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>proxy_pass http://47.104.7.242/;</span></span>
<span class="line"><span>proxy_set_header Host $host;</span></span>
<span class="line"><span>proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span>proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>前两行不用解释，和普通的虚拟主机是一样的，不同的是后面proxy相关的语句。</span></span>
<span class="line"><span>proxy_pass指定要代理的域名所在的服务器 IP，这里的 IP 就是阿铭的论坛所在服务器 IP。</span></span></code></pre></div><p>后面的三行为定义发往后端 Web 服务器的请求头，第二行必须有，否则代理不成功，它表示</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>后端 Web 服务器的域名和当前配置文件中的server_name保持一致；第三行和第四行可以</span></span></code></pre></div><p>省略，前面在讲述 Nginx 日志格式的时候介绍过这两个参数，表示的含义是一样的。配置文件保存后，重新加载 Nginx 服务并验证，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span># curl -x127.0.0.1:80 ask.apelearn.com -I</span></span>
<span class="line"><span>HTTP/1.1 200 OK</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:20:43 GMT</span></span>
<span class="line"><span>Content-Type: text/html; charset=UTF-8</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>X-Powered-By: PHP/5.4.16</span></span>
<span class="line"><span>P3P: CP=&quot;CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI</span></span>
<span class="line"><span>Set-Cookie: ape__Session=jio8hb84ods47012d88tviti27; expires=Sun, 28-Jun-2020 14:</span></span>
<span class="line"><span>Expires: Thu, 19 Nov 1981 08:52:00 GMT</span></span>
<span class="line"><span>Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0</span></span>
<span class="line"><span>Pragma: no-cache</span></span>
<span class="line"><span>Vary: Accept-Encoding</span></span>
<span class="line"><span># curl ask.apelearn.com -I</span></span>
<span class="line"><span>HTTP/1.1 200 OK</span></span>
<span class="line"><span>Server: nginx</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:19:31 GMT</span></span>
<span class="line"><span>Content-Type: text/html; charset=UTF-8</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>X-Powered-By: PHP/5.4.16</span></span>
<span class="line"><span>P3P: CP=&quot;CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI</span></span>
<span class="line"><span>Set-Cookie: ape__Session=976hk1s873jdbdn8iq2v6jhge2; expires=Sun, 28-Jun-2020 14:</span></span>
<span class="line"><span>Expires: Thu, 19 Nov 1981 08:52:00 GMT</span></span>
<span class="line"><span>Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0</span></span>
<span class="line"><span>Pragma: no-cache</span></span>
<span class="line"><span>Vary: Accept-Encoding</span></span></code></pre></div><p>这样看是没有问题的，阿铭虚拟机上的 Nginx 版本为 1.18.0，而阿铭论坛服务器上用的 Nginx版本并没有显示。把服务器上的环境版本暴露出来并不安全，因为这样别有用心的人会直接获取到服务器上的软件版本信息，如果正好该版本有漏洞，那么他就可以直接攻击了。关于如何关掉版本信息，阿铭不在本章描述。下面阿铭再提供一个负载均衡的示例，在编写 Nginx 虚拟</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>主机配置文件之前，先来查看一下 www.qq.com 域名对应的 IP，使用dig命令（使用yum</span></span>
<span class="line"><span>install bind-utils安装）：</span></span>
<span class="line"><span># dig @8.8.8.8 www.qq.com</span></span>
<span class="line"><span>; &lt;&lt;&gt;&gt; DiG 9.11.13-RedHat-9.11.13-3.el8 &lt;&lt;&gt;&gt; @8.8.8.8 www.qq.com</span></span>
<span class="line"><span>; (1 server found)</span></span>
<span class="line"><span>;; global options: +cmd</span></span>
<span class="line"><span>;; Got answer:</span></span>
<span class="line"><span>;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: NOERROR, id: 59151</span></span>
<span class="line"><span>;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1</span></span>
<span class="line"><span>;; OPT PSEUDOSECTION:</span></span>
<span class="line"><span>; EDNS: version: 0, flags:; udp: 512</span></span>
<span class="line"><span>;; QUESTION SECTION:</span></span>
<span class="line"><span>;www.qq.com. IN A</span></span>
<span class="line"><span>;; ANSWER SECTION:</span></span>
<span class="line"><span>www.qq.com. 159 IN CNAME public-v6.sparta.mig.tencent-cloud.net.</span></span>
<span class="line"><span>public-v6.sparta.mig.tencent-cloud.net. 98 IN A 111.30.164.236</span></span>
<span class="line"><span>public-v6.sparta.mig.tencent-cloud.net. 98 IN A 111.30.171.191</span></span>
<span class="line"><span>public-v6.sparta.mig.tencent-cloud.net. 98 IN A 111.30.171.194</span></span>
<span class="line"><span>;; Query time: 147 msec</span></span>
<span class="line"><span>;; SERVER: 8.8.8.8#53(8.8.8.8)</span></span>
<span class="line"><span>;; WHEN: 日 6月 28 22:29:01 CST 2020</span></span>
<span class="line"><span>;; MSG SIZE rcvd: 139</span></span></code></pre></div><p>可以看到有三个 IP，这三个 IP 都可以访问到 www.qq.com。先来验证一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># curl -x111.30.164.236:80 www.qq.com -I</span></span>
<span class="line"><span>HTTP/1.1 302 Moved Temporarily</span></span>
<span class="line"><span>Server: nginx</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:30:26 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 154</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>Location: https://www.qq.com/</span></span>
<span class="line"><span># curl -x111.30.171.191:80 www.qq.com -I</span></span>
<span class="line"><span>HTTP/1.1 302 Moved Temporarily</span></span>
<span class="line"><span>Server: nginx</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:30:42 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 154</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>Location: https://www.qq.com/</span></span>
<span class="line"><span># curl -x111.30.171.194:80 www.qq.com -I</span></span>
<span class="line"><span>HTTP/1.1 302 Moved Temporarily</span></span>
<span class="line"><span>Server: nginx</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:30:53 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 154</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>Location: https://www.qq.com/</span></span></code></pre></div><p>可以看到三个 IP 返回的结果一样，它使用的 Web 服务器软件也是 nginx。有三个 IP 就可以做负载均衡了，配置过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim /usr/local/nginx/conf/vhost/load.conf</span><span> // 写入如下内容</span></span>
<span class="line"><span>upstream qq_com</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>ip_hash;</span></span>
<span class="line"><span>server 111.30.171.194:80;</span></span>
<span class="line"><span>server 111.30.171.191:80;</span></span>
<span class="line"><span>server 111.30.164.236:80;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name www.qq.com;</span></span>
<span class="line"><span>location /</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>proxy_pass http://qq_com;</span></span>
<span class="line"><span>proxy_set_header Host $host;</span></span>
<span class="line"><span>proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span>proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>和简单的代理有所不同，负载均衡多了一个upstream，这里定义后端的 Web 服务器，可以</span></span>
<span class="line"><span>是一个，也可以是多个。其中ip_hash为负载均衡的算法，它表示根据 IP 地址把请求分发到</span></span></code></pre></div><p>不同的服务器上。比如用户 A 的 IP 为 1.1.1.1，用户 B 的 IP 为 2.2.2.2，则 A 访问的时候会把请求转发到第一个 Web 服务器上，而 B 访问的时候会转发到第二个 Web Server 上。这种算法用在把 session 存到本机磁盘上的情况，至于什么是 session，阿铭大概说一下。你访问猿课看课程需要登录，那么你一旦登录，服务器上就会记录你的 session 信息，这个 session会保存一段时间。比如，你看了一个 10 分钟的课程，然后去开会了，过去半小时再打开网站，你依然是登录的状态，这就是因为 session 还存在这台服务器上。下面是测试结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span># /usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span># curl -x127.0.0.1:80 www.qq.com -I</span></span>
<span class="line"><span>HTTP/1.1 302 Moved Temporarily</span></span>
<span class="line"><span>Server: nginx/1.18.0</span></span>
<span class="line"><span>Date: Sun, 28 Jun 2020 14:33:53 GMT</span></span>
<span class="line"><span>Content-Type: text/html</span></span>
<span class="line"><span>Content-Length: 154</span></span>
<span class="line"><span>Connection: keep-alive</span></span>
<span class="line"><span>Location: https://www.qq.com/</span></span></code></pre></div><p>神奇吗？阿铭的虚拟机竟然也可以访问 www.qq.com 了，这其实就是代理的作用！</p><h3 id="_14-4-10-nignx-配置-ssl" tabindex="-1">14.4.10 Nignx 配置 SSL <a class="header-anchor" href="#_14-4-10-nignx-配置-ssl" aria-label="Permalink to &quot;14.4.10 Nignx 配置 SSL&quot;">​</a></h3><p>2016 年底苹果公司就开始要求各个企业的 iOS APP 必须使用 HTTPS 通信，原因很简单，就是保证安全。而目前 Chrome、Firefox 等各大浏览器，也开始针对 HTTPS 做调整。你有没有发现，使用百度搜问题时，百度的网址前面是 HTTPS。</p><p>这说明 HTTPS 已经成为一种趋势，阿铭相信过不了 10 年，整个互联网都会强制使用 HTTPS通信，而废弃目前主流的 HTTP。那到底什么是 HTTPS 呢？简单讲，它就是一种加密的HTTP 协议。如果 HTTP 通信的数据包在传输过程中被截获，那么截获者就可以破译这些数据包里面的信息，其中不乏用户名、密码、手机号等敏感信息。而如果使用 HTTPS 通信，即使数据包被截获，截获者也无法破译里面的内容。图 14-3 给出了 HTTPS 的通信过程。</p><p>其通信过程大致如下。</p><p>(1) 浏览器发送一个 HTTPS 请求给服务器。</p><p>(2) 服务器要有一套数字证书，这个证书可以自己制作（后面的操作就是阿铭自己制作的证书），也可以向组织申请，区别就是自己颁发的证书需要客户端验证通过后才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面。这套证书其实就是一对公钥和私钥。</p><p>(3) 服务器会把公钥传输给客户端。</p><p>(4) 客户端（浏览器）收到公钥后，会验证其是否合法有效，若无效会有警告提醒，有效则会生成一串随机字符串，并用收到的公钥加密。</p><p>(5) 客户端把加密后的随机字符串传输给服务器。</p><p>(6) 服务器收到加密随机字符串后，先用私钥解密（公钥加密，私钥解密），获取到这一串随机字符串后，再用这串随机字符串加密传输的数据（该加密为“对称加密”；所谓对称加密，就是将数据和私钥，也就是这个随机字符串通过某种算法混合在一起，这样除非知道私钥，否则无法获取数据内容）。</p><p>(7) 服务器把加密后的数据传输给客户端。</p><p>(8) 客户端收到数据后，再用自己的私钥（也就是那个随机字符串）解密。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/3.png" alt=""></a></p><p>图 14-3 HTTPS 通信过程</p><p>通过上文的简要分析，我们可以确定服务器上必须有一对公钥和私钥，也就是后文提到的 SSL证书。如果是公司的网站对外提供服务，则需要购买被各大浏览器厂商认可的 SSL 证书。阿铭曾经在沃通购买过 SSL 证书，你可以做个参考。目前各大 SSL 证书服务商已经不再提供免费的 SSL 证书服务，所以做本实验的时候，阿铭只能在 Linux 机器上生成一对自定义的 SSL证书，这个证书只能我们自己用一下，不能使用在生产环境中。具体配置过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/nginx/conf</span></span>
<span class="line"><span># openssl genrsa -des3 -out tmp.key 2048</span></span>
<span class="line"><span>Generating RSA private key, 2048 bit long modulus (2 primes)</span></span>
<span class="line"><span>...........................+++++</span></span>
<span class="line"><span>.......................................................+++++</span></span>
<span class="line"><span>e is 65537 (0x010001)</span></span>
<span class="line"><span>Enter pass phrase for tmp.key:</span></span>
<span class="line"><span>Verifying - Enter pass phrase for tmp.key:</span></span>
<span class="line"><span>// openssl命令如果没有，使用yum install –y openssl安装。这一步是生成key文件（通常称为“私钥</span></span>
<span class="line"><span>//为加密字符串长度，会让我们输入一个密码，密码不能太短，否则不成功</span></span>
<span class="line"><span># openssl rsa -in tmp.key -out aminglinux.key</span></span>
<span class="line"><span>Enter pass phrase for tmp.key:</span></span>
<span class="line"><span>writing RSA key</span></span>
<span class="line"><span>// 这一步是把刚刚生成的tmp.key再转换成aminglinux.key，目的是删除刚才设置的密码，如果key文件有</span></span>
<span class="line"><span>// 则必须在Nginx加载它的时候输入它的密码，因此很不方便</span></span>
<span class="line"><span># rm -f tmp.key</span></span>
<span class="line"><span># openssl req -new -key aminglinux.key -out aminglinux.csr</span></span>
<span class="line"><span>You are about to be asked to enter information that will be incorporated</span></span>
<span class="line"><span>into your certificate request.</span></span>
<span class="line"><span>What you are about to enter is what is called a Distinguished Name or a DN.</span></span>
<span class="line"><span>There are quite a few fields but you can leave some blank</span></span>
<span class="line"><span>For some fields there will be a default value,</span></span>
<span class="line"><span>If you enter &#39;.&#39;, the field will be left blank.</span></span>
<span class="line"><span>-----</span></span>
<span class="line"><span>Country Name (2 letter code) [XX]:</span></span>
<span class="line"><span>State or Province Name (full name) []:</span></span>
<span class="line"><span>Locality Name (eg, city) [Default City]:</span></span>
<span class="line"><span>Organization Name (eg, company) [Default Company Ltd]:</span></span>
<span class="line"><span>Organizational Unit Name (eg, section) []:</span></span>
<span class="line"><span>Common Name (eg, your name or your server&#39;s hostname) []:aming.com</span></span>
<span class="line"><span>Email Address []:</span></span>
<span class="line"><span>Please enter the following &#39;extra&#39; attributes</span></span>
<span class="line"><span>to be sent with your certificate request</span></span>
<span class="line"><span>A challenge password []:123456</span></span>
<span class="line"><span>An optional company name []:</span></span>
<span class="line"><span>// 除了Common Name和Challenge password有设置外，其他都是直接按回车。</span></span>
<span class="line"><span>// 这一步是生成证书请求文件，这个并不是上文提到的公钥，但这个文件是必须要有的，我们要拿key文件和</span></span>
<span class="line"><span>// 个CSR文件一起生成最终的公钥文件。其中Common Name为后面配置Nginx配置文件的server_name</span></span>
<span class="line"><span># openssl x509 -req -days 365 -in aminglinux.csr -signkey aminglinux.key -out ami</span></span>
<span class="line"><span>Signature ok</span></span>
<span class="line"><span>subject=/C=XX/L=Default City/O=Default Company Ltd/CN=aming.com</span></span>
<span class="line"><span>Getting Private key</span></span>
<span class="line"><span>// 说明：这样最终才生成了CRT证书文件，也就是图14-3中的公钥</span></span></code></pre></div><p>以上操作的最终目的是生成 aminglinux.key 和 aminglinux.crt 两个文件。其实购买的 SSL 证书主要是得到这两个文件，有了这两个文件就可以配置 Nginx 了。配置过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim /usr/local/nginx/conf/vhost/ssl.conf</span><span> // 写入如下内容</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 443 ssl;</span></span>
<span class="line"><span>server_name aming.com;</span></span>
<span class="line"><span>index index.html index.php;</span></span>
<span class="line"><span>root /data/nginx/aming.com;</span></span>
<span class="line"><span>ssl on;</span></span>
<span class="line"><span>ssl_certificate aminglinux.crt;</span></span>
<span class="line"><span>ssl_certificate_key aminglinux.key;</span></span>
<span class="line"><span>ssl_protocols TLSv1 TLSv1.1 TLSv1.2;</span></span>
<span class="line"><span>location ~ \\.php$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>include fastcgi_params;</span></span>
<span class="line"><span>fastcgi_pass unix:/tmp/php-fcgi.sock;</span></span>
<span class="line"><span>fastcgi_index index.php;</span></span>
<span class="line"><span>fastcgi_param SCRIPT_FILENAME /data/nginx/aming.com$fastcgi_script_name;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>access_log /tmp/1.log combined_realip;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>保存配置文件后，检查配置是否有问题。阿铭在检查配置时，发现了问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span>
<span class="line"><span>nginx: [emerg] unknown directive &quot;ssl&quot; in /usr/local/nginx/conf/vhost/ssl.conf:8</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test failed</span></span></code></pre></div><p>这说明，当前的 Nginx 并不支持 SSL，这是因为阿铭在先前的 Nginx 编译时，并没有额外配置支持 SSL 的参数，要解决该问题只能重新编译一遍 Nginx。操作过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/src/nginx-1.18.0/</span></span>
<span class="line"><span># ./configure --prefix=/usr/local/nginx --with-http_ssl_module</span></span>
<span class="line"><span># make</span></span>
<span class="line"><span># make install</span></span></code></pre></div><p>编译完成后，再来检验一次：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx –t</span></span>
<span class="line"><span>nginx: [warn] the &quot;ssl&quot; directive is deprecated, use the &quot;listen ... ssl&quot; directi</span></span>
<span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span>
<span class="line"><span>有个warn的提示，这个倒不是错误，并不影响。要想去除此告警，可以将配置文件的第 8 行</span></span></code></pre></div><p>删除掉。然后创建对应的目录和测试文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># mkdir /data/nginx/aming.com</span></span>
<span class="line"><span># echo &quot;&lt;?php phpinfo(); ?&gt;&quot; &gt; /data/nginx/aming.com/1.php</span></span>
<span class="line"><span># systemctl restart nginx.service</span></span></code></pre></div><p>再编辑 hosts 文件，写入一行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>192.168.72.128 aming.com</span></span></code></pre></div><p>用浏览器访问 <a href="https://aming.com/1.php" target="_blank" rel="noreferrer">https://aming.com/1.php</a> 会提示不安全，如图 14-4 所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E9%98%BF%E9%93%AD%E5%AD%A6Linux/images/%25E7%25AC%25AC14%25E7%25AB%25A0LNMP%25E7%258E%25AF%25E5%25A2%2583%25E9%2585%258D%25E7%25BD%25AE-2-/4.png" alt=""></a></p><p>图 14-4 不安全的连接</p><p>这是因为该证书为我们自己制作的，并没有得到浏览器的认可，如果想继续访问，可以单击“高级”按钮，然后单击“添加例外”，在弹出的对话框单击“确认安全例外”，然后就可以访问网站内容了。此时，你还可以看到浏览器的地址栏左侧有一个灰色的小锁，并且带有黄色三角形，这意味着该链接不安全。这是因为该站点的 SSL 证书是我们自己颁发的，因而不能被浏览器承认。</p><h2 id="_14-5-php-fpm配置" tabindex="-1">14.5 php-fpm配置 <a class="header-anchor" href="#_14-5-php-fpm配置" aria-label="Permalink to &quot;14.5 php-fpm配置&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>和 LAMP 不同的是，在 LNMP 架构中，php-fpm是作为一个独立的服务存在。既然是独立服</span></span>
<span class="line"><span>务，那么它必然有自己的配置文件。php-fpm的配置文件为 /usr/local/php-fpm/etc/php-</span></span>
<span class="line"><span>fpm.conf，该文件同样支持include语句，类似于 nginx.conf 里面的include。</span></span></code></pre></div><h3 id="_14-5-1-php-fpm的pool" tabindex="-1">14.5.1 php-fpm的pool <a class="header-anchor" href="#_14-5-1-php-fpm的pool" aria-label="Permalink to &quot;14.5.1 php-fpm的pool&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Nignx 可以配置多个虚拟主机，php-fpm也支持配置多个 pool，每一个 pool 可以监听一个端</span></span></code></pre></div><p>口，也可以监听一个 socket，这个概念阿铭已经在前面已经有所阐述。阿铭把 php-fpm.conf做一个更改，内容如下：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[global]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> /</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/run/php-fpm.pid</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">error_log </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> /</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/log/php-fpm.log</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">include </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> etc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm.d</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*.conf</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">include的这一行比较特殊，请注意等号后面的路径，必须先写上etc目录，再写需要创建</span></span></code></pre></div><p>的配置文件目录和子配置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># mkdir /usr/local/php-fpm/etc/php-fpm.d</span></span>
<span class="line"><span># cd /usr/local/php-fpm/etc/php-fpm.d</span></span>
<span class="line"><span># vim www.conf</span><span> // 内容如下</span></span>
<span class="line"><span>[www]</span></span>
<span class="line"><span>listen = /tmp/www.sock</span></span>
<span class="line"><span>listen.mode=666</span></span>
<span class="line"><span>user = php-fpm</span></span>
<span class="line"><span>group = php-fpm</span></span>
<span class="line"><span>pm = dynamic</span></span>
<span class="line"><span>pm.max_children = 50</span></span>
<span class="line"><span>pm.start_servers = 20</span></span>
<span class="line"><span>pm.min_spare_servers = 5</span></span>
<span class="line"><span>pm.max_spare_servers = 35</span></span>
<span class="line"><span>pm.max_requests = 500</span></span>
<span class="line"><span>rlimit_files = 1024</span></span></code></pre></div><p>保存后，再编辑另外的配置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim aming.conf</span><span> // 写入如下内容</span></span>
<span class="line"><span>[aming]</span></span>
<span class="line"><span>listen = /tmp/aming.sock</span></span>
<span class="line"><span>listen.mode=666</span></span>
<span class="line"><span>user = php-fpm</span></span>
<span class="line"><span>group = php-fpm</span></span>
<span class="line"><span>pm = dynamic</span></span>
<span class="line"><span>pm.max_children = 50</span></span>
<span class="line"><span>pm.start_servers = 20</span></span>
<span class="line"><span>pm.min_spare_servers = 5</span></span>
<span class="line"><span>pm.max_spare_servers = 35</span></span>
<span class="line"><span>pm.max_requests = 500</span></span>
<span class="line"><span>rlimit_files = 1024</span></span></code></pre></div><p>这样就有两个子配置文件，也就是说有两个 pool 了，第一个 pool 监听了 /tmp/www.sock，第二个 pool 监听了 /tmp/aming.sock。这样，就可以在 Nginx 不同的虚拟主机中调用不同的pool，从而达到相互隔离的目的，两个 pool 互不影响。下面来验证一下配置是否有问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/php-fpm/sbin/php-fpm -t</span></span>
<span class="line"><span>[28-Jun-2020 22:48:39] NOTICE: configuration file /usr/local/php-fpm/etc/php-fpm.</span></span>
<span class="line"><span>然后重启一下php-fpm服务：</span></span>
<span class="line"><span># /etc/init.d/php-fpm restart</span></span>
<span class="line"><span>Gracefully shutting down php-fpm . done</span></span>
<span class="line"><span>Starting php-fpm done</span></span></code></pre></div><p>再来查看 /tmp/ 目录下面的 sock 文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ls /tmp/*.sock</span></span>
<span class="line"><span>/tmp/aming.sock /tmp/mysql.sock /tmp/php-fcgi.sock</span></span></code></pre></div><h3 id="_14-5-2-php-fpm的慢执行日志" tabindex="-1">14.5.2 php-fpm的慢执行日志 <a class="header-anchor" href="#_14-5-2-php-fpm的慢执行日志" aria-label="Permalink to &quot;14.5.2 php-fpm的慢执行日志&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>这一节非常重要，请务必认真看完并理解。php-fpm的慢执行日志阿铭用得非常多，它可以</span></span>
<span class="line"><span>帮助你快速地追踪到问题点。为了更容易理解php-fpm的慢执行日志，阿铭先来举一个小例</span></span></code></pre></div><p>子。</p><p>小明是一个运维工程师，他维护的网站是用 PHP 语言编写的，运行环境为 LNMP，网站访问量不算大，一直都很稳定。但有一天，网站突然很卡，打开一个页面需要十几秒，小明发现问</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>题后，马上登录服务器排查问题。他做的操作有：使用w命令查看服务器负载，使用free命</span></span>
<span class="line"><span>令查看内存，使用top命令查看哪个进程占用 CPU，使用nload命令查看网卡流量……总之</span></span>
<span class="line"><span>小明做了很多操作，种种迹象表明php-fpm进程占用了很多资源。</span></span>
<span class="line"><span>但php-fpm进程究竟在干什么？为什么耗费了很多资源呢？小明很想知道，只有找到问题</span></span>
<span class="line"><span>点，才能解决php-fpm耗费资源的问题，然后网站自然就快了。小明的经验有限，不知道怎</span></span>
<span class="line"><span>么去查看php-fpm在干什么。在哪一步卡住了呢？小明开始到 Google 上去搜文档，找啊找，</span></span></code></pre></div><p>找啊找，找了很久，也尝试了许多方法，终于“皇天不负有心人”，小明找到了一个很有效的方</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>法，其实就是阿铭要介绍的php-fpm慢执行日志。</span></span>
<span class="line"><span>通过php-fpm的慢执行日志，我们可以非常清晰地了解到 PHP 的脚本在哪里执行时间长，它</span></span>
<span class="line"><span>可以定位到具体的行。在上例中，小明就是通过查看php-fpm的慢执行日志最终得到结论：</span></span></code></pre></div><p>是因为 PHP 调用了一个远程的网站接口，而这个接口网络出现故障，访问它需要十几秒的时</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">间，所以php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm也会等十几秒，最终导致网站访问很卡。说了这么多，你肯定很想知道如</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">何开启和查看php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm的慢执行日志，操作步骤如下：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># vim </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">etc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm.d</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">www.conf </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 在最后面加入如下内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">request_slowlog_timeout </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">slowlog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> /</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/log/www-slow.log</span></span></code></pre></div><p>第一行定义超时时间，即 PHP 的脚本执行时间只要超过 1 秒就会记录日志，第二行定义慢执行日志的路径和名字。以后，你遇到 PHP 网站访问卡顿的问题时，要记得去查看这个慢执行日志，一定会帮到你！</p><h3 id="_14-5-3-php-fpm定义open-basedir" tabindex="-1">14.5.3 php-fpm定义open_basedir <a class="header-anchor" href="#_14-5-3-php-fpm定义open-basedir" aria-label="Permalink to &quot;14.5.3 php-fpm定义open_basedir&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>open_basedir的作用是将网站限定在指定目录里，就算该站点被黑了，黑客只能在该目录</span></span></code></pre></div><p>下面有所作为，而不能左右其他目录。如果你的服务器上只有一个站点，那么可以直接在</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>php.ini 中设置open_basedir参数。但如果服务器上运行的站点比较多，那在 php.ini 中设置</span></span></code></pre></div><p>就不合适了，因为在 php.ini 中只能定义一次，也就是说所有站点都一起定义限定的目录，这</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>样似乎起不到隔离多个站点的作用。php-fpm可以针对不同的 pool 设置不同的</span></span>
<span class="line"><span>open_basedir：</span></span>
<span class="line"><span># vim /usr/local/php-fpm/etc/php-fpm.d/aming.conf</span><span> // 在最后面加入</span></span>
<span class="line"><span>php_admin_value[open_basedir]=/data/www/:/tmp/</span></span>
<span class="line"><span>只要在对应的 Nginx 虚拟主机配置文件中调用对应的 pool，就可以使用open_basedir来物</span></span></code></pre></div><p>理隔离多个站点了，从而达到安全的目的。</p><h3 id="_14-5-4-php-fpm进程管理" tabindex="-1">14.5.4 php-fpm进程管理 <a class="header-anchor" href="#_14-5-4-php-fpm进程管理" aria-label="Permalink to &quot;14.5.4 php-fpm进程管理&quot;">​</a></h3><p>来看这一段配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pm = dynamic</span></span>
<span class="line"><span>pm.max_children = 50</span></span>
<span class="line"><span>pm.start_servers = 20</span></span>
<span class="line"><span>pm.min_spare_servers = 5</span></span>
<span class="line"><span>pm.max_spare_servers = 35</span></span>
<span class="line"><span>pm.max_requests = 500</span></span>
<span class="line"><span>第一行，定义php-fpm的子进程启动模式，dynamic为动态模式；一开始只启动少量的子进</span></span>
<span class="line"><span>程，根据实际需求，动态地增加或者减少子进程，最多不会超过pm.max_children定义的数</span></span>
<span class="line"><span>值。另外一种模式为static，这种模式下子进程数量由pm.max_children决定，一次性启</span></span></code></pre></div><p>动这么多，之后不会减少也不会增加。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pm.start_servers针对dynamic模式，定义php-fpm服务在启动时产生的子进程数量。</span></span>
<span class="line"><span>pm.min_spare_servers针对dynamic模式，定义在空闲时段子进程数的最少数量，如果</span></span>
<span class="line"><span>达到这个数值，php-fpm服务会自动派生新的子进程。pm.max_spare_servers也是针对</span></span>
<span class="line"><span>dynamic模式的，定义在空闲时段子进程数的最大值，如果高于这个数值就开始清理空闲的</span></span>
<span class="line"><span>子进程。pm.max_requests针对dynamic模式，定义一个子进程最多处理的请求数，也就</span></span>
<span class="line"><span>是说在一个php-fpm的子进程中最多可以处理pm.max_requests个请求，当达到这个数值</span></span></code></pre></div><p>时，进程会自动退出。</p><h2 id="_14-6-课后习题" tabindex="-1">14.6 课后习题 <a class="header-anchor" href="#_14-6-课后习题" aria-label="Permalink to &quot;14.6 课后习题&quot;">​</a></h2><p>(1) 到 MySQL 官网下载一个源码包，尝试编译安装，编译参数可以参考我们已经安装过的MySQL 的编译参数。</p><p>(2) MySQL 的配置文件 my.cnf 是否可以放到 /etc/ 目录外的其他目录下？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(3) PHP 的配置文件是什么？php-fpm的配置文件是什么？</span></span>
<span class="line"><span>(4) 如何检测 Nginx 配置文件是否有错？如何检测php-fpm的配置文件是否有错？</span></span>
<span class="line"><span>(5) 本章中出现了两次chmod 755 /etc/init.d/xxx，其中xxx为mysql、php-fpm。为</span></span></code></pre></div><p>什么要更改它们的权限？如果不改会有什么问题？</p><p>(6) Nginx 是如何做到解析 PHP 文件的？它是如何和 PHP 联系在一起的？</p><p>(7) 请配置 Nginx 的访问日志，并编写日志切割脚本（按天切割）。</p><p>(8) 请配置 Nginx 域名重定向，比如一个虚拟主机支持多个域名访问 abc.com 和 123.com，那么如何让 123.com 的访问跳转到 abc.com？</p><p>(9) 请配置 Nginx 的用户验证。</p><p>(10) 请针对 Nginx 站点，设置禁止某个目录下的 PHP 程序解析。</p><p>(11) 请使用 Nginx 代理一个站点。</p><p>(12) 请配置 Nginx，限制只让某个 IP 访问网站。</p><p>(13) 请设置 Nginx 防盗链，比如只让 A 域名的 referer 访问，其他站点不能访问。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(14) 请设置 Nginx 根据user_agent来限制访问，比如禁止百度的蜘蛛访问站点。</span></span></code></pre></div><p>(15) 请配置 Nginx 的虚拟目录。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(16) php-fpm.conf 中配置有多个 pool，如何针对每一个 pool 配置open_basedir以及</span></span>
<span class="line"><span>slow_log？</span></span></code></pre></div>`,186)])])}const u=n(e,[["render",l]]);export{g as __pageData,u as default};
