import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"第14章LNMP环境配置(1)","description":"","frontmatter":{},"headers":[{"level":2,"title":"第 14 章 LNMP 环境配置","slug":"第-14-章-lnmp-环境配置","link":"#第-14-章-lnmp-环境配置","children":[]},{"level":2,"title":"14.1 安装 MySQL","slug":"_14-1-安装-mysql","link":"#_14-1-安装-mysql","children":[{"level":3,"title":"14.1.1 下载软件包","slug":"_14-1-1-下载软件包","link":"#_14-1-1-下载软件包","children":[]},{"level":3,"title":"14.1.2 初始化","slug":"_14-1-2-初始化","link":"#_14-1-2-初始化","children":[]},{"level":3,"title":"14.1.3 MySQL 配置文件","slug":"_14-1-3-mysql-配置文件","link":"#_14-1-3-mysql-配置文件","children":[]}]},{"level":2,"title":"14.2 安装 PHP","slug":"_14-2-安装-php","link":"#_14-2-安装-php","children":[]},{"level":2,"title":"14.3 安装 Nginx","slug":"_14-3-安装-nginx","link":"#_14-3-安装-nginx","children":[]}],"relativePath":"跟阿铭学Linux/第14章LNMP环境配置(1).md","filePath":"跟阿铭学Linux/第14章LNMP环境配置(1).md","lastUpdated":1795561067000}'),e={name:"跟阿铭学Linux/第14章LNMP环境配置(1).md"};function l(t,s,c,h,o,d){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="第14章lnmp环境配置-1" tabindex="-1">第14章LNMP环境配置(1) <a class="header-anchor" href="#第14章lnmp环境配置-1" aria-label="Permalink to &quot;第14章LNMP环境配置(1)&quot;">​</a></h1><h2 id="第-14-章-lnmp-环境配置" tabindex="-1">第 14 章 LNMP 环境配置 <a class="header-anchor" href="#第-14-章-lnmp-环境配置" aria-label="Permalink to &quot;第 14 章 LNMP 环境配置&quot;">​</a></h2><p>如果你想成为一名合格的系统管理员，仅掌握 Linux 的基础知识是远远不够的，你还需要长时间积累一定的工作经验。所谓的工作经验就是对一些运行在 Linux 系统上的软件的配置和应用，以及解决在工作中遇到的问题。这就好比 Windows 上的 Office 软件，大部分人都会安装，但是真正会用的人却不多。究其原因，不是因为 Office 软件太难，而是因为很少有人花费很长的时间去使用和研究。</p><p>LNMP 中的 L 指的是 Linux，N 指的是 Nginx（一种 Web 服务软件），M 指的是 MySQL，P指的是 PHP，目前对这种环境的应用非常多。Nginx 的设计初衷是提供一种快速、高效、多并发的 Web 服务软件。MySQL 是最为流行的一款关系型数据库，几乎所有的互联网或者技术型公司都会用到。PHP 是一种脚本语言，与 C 语言类似，是常用的网站编程语言。本章将带着大家搭建一个 Linux+Nginx+MySQL+PHP 的环境，用来运行 PHP 语言编写的网站程序。</p><h2 id="_14-1-安装-mysql" tabindex="-1">14.1 安装 MySQL <a class="header-anchor" href="#_14-1-安装-mysql" aria-label="Permalink to &quot;14.1 安装 MySQL&quot;">​</a></h2><p>我们平时是通过源码包安装 MySQL 的，但是由于它的编译时间比较长，因此阿铭建议你安装二进制免编译包，前文也介绍过源码包，所以相信你应该不会太陌生。源码包都是可以更改的由 C 或者 C++ 语言编写的源码文件，而免编译的二进制包就是把已经编译过的文件再打包后提供给我们。其实 Windows 上的安装程序（比如 QQ、360 安全卫士等）就是类似的安装包。你可以到 MySQL 的官方网站下载，具体下载哪个版本根据你的平台和需求而定。目前MySQL 主流版本为 5.7 和 8.0，但使用 8.0 版本的应用占比还是比较少的，所以本章阿铭以5.7 版本作为演示。</p><h3 id="_14-1-1-下载软件包" tabindex="-1">14.1.1 下载软件包 <a class="header-anchor" href="#_14-1-1-下载软件包" aria-label="Permalink to &quot;14.1.1 下载软件包&quot;">​</a></h3><p>你可以到 MySQL 官方网站去下载 MySQL 的包，也可以到阿铭指定的网站下载，这个地址里面会提供本书中用到的所有软件包的下载地址，而且是在不断更新的。随着时间的推移，有的软件包更新了，下载地址也会变更。</p><p>在本节，阿铭使用的是免编译二进制包。需要注意，这个软件包是区分平台的。CentOS 7 之前的版本都有区分 32 位和 64 位，但如果你使用的是 CentOS 7 或者 CentOS 8，那么直接选择 64 的包下载。在阿铭提供的下载地址中，带有 x86_64 字样的就是 64 位的包，带有 i686字样的就是 32 位的包。要想查看你的 Linux 是多少位的，方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># uname -i</span></span>
<span class="line"><span>x86_64</span></span></code></pre></div><p>然后下载源码包，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/src/</span><span> // 建议你以后把所有软件包都放到这个目录下面</span></span>
<span class="line"><span># wget http://mirrors.163.com/mysql/Downloads/MySQL-5.7/mysql-5.7.29-linux-glibc2</span></span></code></pre></div><h3 id="_14-1-2-初始化" tabindex="-1">14.1.2 初始化 <a class="header-anchor" href="#_14-1-2-初始化" aria-label="Permalink to &quot;14.1.2 初始化&quot;">​</a></h3><p>初始化过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># tar zxf mysql-5.7.29-linux-glibc2.12-x86_64.tar.gz</span><span> // 解压</span></span>
<span class="line"><span># [ -d /usr/local/mysql ] &amp;&amp; mv /usr/local/mysql /usr/local/mysql_old</span></span>
<span class="line"><span># mv mysql-5.7.29-linux-glibc2.12-x86_64 /usr/local/mysql</span><span> // 挪动位置</span></span>
<span class="line"><span># useradd -s /sbin/nologin mysql</span><span> // 建立MySQL用户，因为启动MySQL需要该用户</span></span>
<span class="line"><span># cd /usr/local/mysql</span></span>
<span class="line"><span># mkdir -p /data/mysql</span><span> // 创建datadir，数据库文件会放到这里面</span></span>
<span class="line"><span># chown -R mysql:mysql /data/mysql</span><span> // 更改权限，不更改后续操作就会出问题</span></span>
<span class="line"><span># vim /etc/my.cnf</span><span> //写入如下内容</span></span>
<span class="line"><span>[mysqld]</span></span>
<span class="line"><span>innodb_buffer_pool_size = 128M</span></span>
<span class="line"><span>log_bin = aminglinux</span></span>
<span class="line"><span>basedir = /usr/local/mysql</span></span>
<span class="line"><span>datadir = /data/mysql</span></span>
<span class="line"><span>port = 3306</span></span>
<span class="line"><span>server_id = 128</span></span>
<span class="line"><span>socket = /tmp/mysql.sock</span></span>
<span class="line"><span>join_buffer_size = 128M</span></span>
<span class="line"><span>sort_buffer_size = 2M</span></span>
<span class="line"><span>read_rnd_buffer_size = 2M</span></span>
<span class="line"><span>sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES</span></span>
<span class="line"><span># /usr/local/mysql/bin/mysqld --initialize --user=mysql</span><span> //初始化，如果有libaio.so.1</span></span>
<span class="line"><span># yum install –y libaio</span></span>
<span class="line"><span>在上例的第二条命令中，阿铭用到了一个特殊符号&amp;&amp;，它在这里的意思是当前面的命令执行</span></span>
<span class="line"><span>成功时，才会执行后面，类似于一条if判断。意思是，如果 /usr/local/mysql 目录已经存在，</span></span></code></pre></div><p>就要改一下它的名字，以免影响后面的操作，因为如果 /usr/local/mysql 目录存在，那么后面</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>的步骤就会失败。Mysqld --initialize命令是用来初始化数据的，会在 /data/mysql 下</span></span></code></pre></div><p>面生成一堆目录和文件。在该命令执行时会输出一些信息，其中有一行一定要记下来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>A temporary password is generated for root@localhost: y,aK3!ouXm6t</span></span></code></pre></div><p>这是在告诉我们，它生成了一个临时的密码，等会我们需要使用该密码登录 MySQL。</p><h3 id="_14-1-3-mysql-配置文件" tabindex="-1">14.1.3 MySQL 配置文件 <a class="header-anchor" href="#_14-1-3-mysql-配置文件" aria-label="Permalink to &quot;14.1.3 MySQL 配置文件&quot;">​</a></h3><p>在上一节初始化时提供了一个配置文件 my.cnf，下面阿铭简单解释一下其含义。其中，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>basedir是 MySQL 包所在的路径；datadir是定义的存放数据的地方，在默认情况下，错</span></span>
<span class="line"><span>误日志也会记录在这个目录下面；port定义 MySQL 服务监听的端口，如果不定义就是默认</span></span>
<span class="line"><span>的 3306；server_id定义该 MySQL 服务的 ID 号，这个参数在做主从配置的时候会用到，</span></span>
<span class="line"><span>后续会介绍；socket定义 MySQL 服务监听的套接字地址，在 Linux 系统下面，很多服务除</span></span></code></pre></div><p>了可以监听一个端口（通过 TCP/IP 的方式通信），还可以监听套接字，两个进程就可以通过这个套接字文件通信。</p><p>复制启动脚本文件并修改其属性，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cp support-files/mysql.server /etc/init.d/mysqld</span></span>
<span class="line"><span># chmod 755 /etc/init.d/mysqld</span></span></code></pre></div><p>然后修改启动脚本，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim /etc/init.d/mysqld</span></span>
<span class="line"><span>需要修改的地方有datadir=/data/mysql（前面初始化数据库时定义的目录）。把启动脚本</span></span></code></pre></div><p>加入系统服务项，设定开机启动并启动 MySQL，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># chkconfig --add mysqld</span><span> // 把mysqld服务加入到系统服务列表中，第13章已经介绍过</span></span>
<span class="line"><span># chkconfig mysqld on</span><span> // 使其开机就启动</span></span>
<span class="line"><span># service mysqld start</span><span> // 启动服务</span></span>
<span class="line"><span>Starting MySQL.Logging to &#39;/data/mysql/aminglinux-123.err&#39;.</span></span>
<span class="line"><span>SUCCESS!</span></span></code></pre></div><p>如果启动不了，请到 /data/mysql/ 目录下查看错误日志，这个日志名通常是“主机名.err”，比如阿铭演示的这个错误日志名为 /data/mysql/aminglinux-123.err。检查 MySQL 是否启动的命令为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ps aux |grep mysqld</span><span> // 结果应该大于2行</span></span>
<span class="line"><span># netstat –lnp|grep 3306</span><span> // 看看有没有监听3306端口</span></span></code></pre></div><p>此时的 MySQL 还不能用，还需要设置一个新的 root 密码，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/mysql/bin/mysqladmin -uroot -p&#39;y,aK3!ouXm6t&#39; password &#39;aminglinux.co</span></span>
<span class="line"><span>mysqladmin: [Warning] Using a password on the command line interface can be insec</span></span>
<span class="line"><span>Warning: Since password will be sent to server in plain text, use ssl connection</span></span>
<span class="line"><span>它的输出为一个警告，不用在意。-p后面为临时密码，password后面为新密码。</span></span></code></pre></div><h2 id="_14-2-安装-php" tabindex="-1">14.2 安装 PHP <a class="header-anchor" href="#_14-2-安装-php" aria-label="Permalink to &quot;14.2 安装 PHP&quot;">​</a></h2><p>早些年的 PHP 5.x 版本至少流行了有十年之久，但该版本已经于 2019 年 1 月停止更新，所以不再建议使用，除非网站程序必须要求 5.x。阿铭编写此书时主流版本为 7.2、7.3 和 7.4，所以将以 7.4 版本作为演示对象，其安装过程如下所示。</p><p>(1) 下载 PHP 源码包，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/src</span></span>
<span class="line"><span># wget http://cn2.php.net/distributions/php-7.4.7.tar.gz</span></span></code></pre></div><p>(2) 解压源码包，创建账号，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># tar zxf php-7.4.7.tar.gz</span></span>
<span class="line"><span># useradd -s /sbin/nologin php-fpm</span></span>
<span class="line"><span>该账号用来运行php-fpm服务。在 LNMP 环境中，PHP 以php-fpm服务的形式出现，独立</span></span></code></pre></div><p>存在于 Linux 系统中，方便管理。</p><p>(3) 配置编译选项，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd php-7.4.7</span></span>
<span class="line"><span># ./configure --prefix=/usr/local/php-fpm --with-config-file-path=/usr/local/php-</span></span></code></pre></div><p>由于 PHP 的编译参数比较多，阿铭觉得暂时也不需要解释太多，大体意思就是：编译 PHP可以指定我们需要的功能模块，跟前面的 httpd 类似，至于需要哪些，这取决于你所在的公司需要什么功能。阿铭提供的这些功能模块比较常用，如果没有特殊要求，直接使用这些参数即可。执行这一步时阿铭遇到了几个错误，如下所示。</p><ul><li>错误 1</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>configure: error: Package requirements (libxml-2.0 &gt;= 2.7.6) were not met</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>其解决办法如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># yum install -y libxml2-devel</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>错误 2</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>error: Package requirements (openssl &gt;= 1.0.1) were not met</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>其解决办法如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># yum install -y openssl openssl-devel</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>错误 3</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>error: Package requirements (sqlite3 &gt; 3.7.4) were not met</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>其解决办法如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># yum install -y sqlite-devel</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>错误 4</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>error: Package requirements (libcurl &gt;= 7.15.5) were not met</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>其解决办法如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># yum install -y libcurl-devel</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>错误 5</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>error: Package requirements (oniguruma) were not met</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>其解决办法如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/src/</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span># wget https://github.com/kkos/oniguruma/archive/v6.9.4.tar.gz -O oniguruma-6.9</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span># yum install -y autoconf automake libtool libtool-ltdl-devel</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span># tar -zxf oniguruma-6.9.4.tar.gz</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span># cd oniguruma-6.9.4</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span># ./autogen.sh</span></span>
<span class="line"><span>6</span></span>
<span class="line"><span># ./autogen.sh</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span># ./configure --prefix=/usr</span></span>
<span class="line"><span>8</span></span>
<span class="line"><span># make &amp;&amp; make install</span></span>
<span class="line"><span>9</span></span>
<span class="line"><span>解决以上所有错误后，最终./configure运行结束，出现如下提示：</span></span>
<span class="line"><span>+--------------------------------------------------------------------+</span></span>
<span class="line"><span>| License: |</span></span>
<span class="line"><span>| This software is subject to the PHP License, available in this |</span></span>
<span class="line"><span>| distribution in the file LICENSE. By continuing this installation |</span></span>
<span class="line"><span>| process, you are bound by the terms of this license agreement. |</span></span>
<span class="line"><span>| If you do not agree with the terms of this license, you must abort |</span></span>
<span class="line"><span>| the installation process at this point. |</span></span>
<span class="line"><span>+--------------------------------------------------------------------+</span></span>
<span class="line"><span>Thank you for using PHP.</span></span></code></pre></div><p>然后编译和安装，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># make</span></span>
<span class="line"><span># make install</span></span>
<span class="line"><span>执行make命令的时间会在 5 分钟以上，请耐心等待。对于以上的每一个步骤，如果没有完全</span></span>
<span class="line"><span>执行正确，那么其下一步是无法进行的。判断执行是否正确的方法为：使用命令echo $?查</span></span>
<span class="line"><span>看结果是否为0，如果不是则表示没有正确执行。</span></span></code></pre></div><p>(4) 修改配置文件，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cp php.ini-production /usr/local/php-fpm/etc/php.ini</span></span>
<span class="line"><span># vim /usr/local/php-fpm/etc/php-fpm.conf</span></span></code></pre></div><p>把如下内容写入该文件：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[global]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> /</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/run/php-fpm.pid</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">error_log </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> /</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/log/php-fpm.log</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[www]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">listen </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> /</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tmp</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fcgi.sock</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">listen.mode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 666</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">group </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> php</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fpm</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dynamic</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pm.max_children </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 50</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pm.start_servers </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 20</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pm.min_spare_servers </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pm.max_spare_servers </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 35</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pm.max_requests </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 500</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rlimit_files </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1024</span></span></code></pre></div><p>保存配置文件后，检验配置是否正确的方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/php-fpm/sbin/php-fpm -t</span></span>
<span class="line"><span>如果显示test is successful，则说明配置没有问题，否则就要根据提示检查配置文件。</span></span>
<span class="line"><span>(5) 启动php-fpm，命令如下：</span></span>
<span class="line"><span># cp ./sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm</span></span>
<span class="line"><span># chmod 755 /etc/init.d/php-fpm</span></span>
<span class="line"><span># service php-fpm start</span></span>
<span class="line"><span>设置php-fpm开机启动的命令如下：</span></span>
<span class="line"><span># chkconfig php-fpm on</span></span>
<span class="line"><span>检测php-fpm是否启动的命令如下：</span></span>
<span class="line"><span># ps aux |grep php-fpm</span></span></code></pre></div><p>执行这条命令后，可以看到启动了很多个进程（大概二十多个）。</p><h2 id="_14-3-安装-nginx" tabindex="-1">14.3 安装 Nginx <a class="header-anchor" href="#_14-3-安装-nginx" aria-label="Permalink to &quot;14.3 安装 Nginx&quot;">​</a></h2><p>从官方网站可以看到 Nginx 更新速度很快，这说明目前使用 Nginx 的用户越来越多了。但阿铭不建议你安装最新版本的 Nginx，因为新版本难免会有一些 Bug 或者漏洞。阿铭建议你安装最近发布的 stable 版本，阿铭写作本书时，最近的 stable 版本为 1.18。具体的下载安装步骤如下所示。</p><p>(1) 下载和解压 Nginx，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd /usr/local/src/</span></span>
<span class="line"><span># wget http://nginx.org/download/nginx-1.18.0.tar.gz</span></span>
<span class="line"><span># tar zxvf nginx-1.18.0.tar.gz</span></span></code></pre></div><p>(2) 配置编译选项，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd nginx-1.18.0</span></span>
<span class="line"><span># ./configure --prefix=/usr/local/nginx</span></span></code></pre></div><p>(3) 编译和安装 Nginx，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># make</span></span>
<span class="line"><span># make install</span></span></code></pre></div><p>因为 Nginx 的安装文件比较小，所以可以很快安装完，而且也不会出什么错误。</p><p>(4) 编写 Nginx 启动脚本，并加入系统服务，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim /usr/lib/systemd/system/nginx.service</span><span> // 写入如下内容</span></span>
<span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=nginx - high performance web server</span></span>
<span class="line"><span>After=network.target remote-fs.target nss-lookup.target</span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>Type=forking</span></span>
<span class="line"><span>ExecStart=/usr/local/nginx/sbin/nginx</span></span>
<span class="line"><span>ExecReload=/usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span>ExecStop=/usr/local/nginx/sbin/nginx -s stop</span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=multi-user.target</span></span></code></pre></div><p>载入系统服务列表：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># systemctl daemon-reload</span></span></code></pre></div><p>使 Nginx 开机启动，请执行如下命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># systemctl enable nginx.service</span></span></code></pre></div><p>(5) 更改 Nginx 的配置文件。</p><p>首先把原来的配置文件清空，操作方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># &gt; /usr/local/nginx/conf/nginx.conf</span></span>
<span class="line"><span>重定向符号&gt;之前就介绍过，单独使用该符号时，可以把一个文本文档快速清空。然后编辑配</span></span></code></pre></div><p>置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim /usr/local/nginx/conf/nginx.conf</span><span> // 写入如下内容</span></span>
<span class="line"><span>user nobody nobody;</span></span>
<span class="line"><span>worker_processes 2;</span></span>
<span class="line"><span>error_log /usr/local/nginx/logs/nginx_error.log crit;</span></span>
<span class="line"><span>pid /usr/local/nginx/logs/nginx.pid;</span></span>
<span class="line"><span>worker_rlimit_nofile 51200;</span></span>
<span class="line"><span>events</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>use epoll;</span></span>
<span class="line"><span>worker_connections 6000;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>http</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>include mime.types;</span></span>
<span class="line"><span>default_type application/octet-stream;</span></span>
<span class="line"><span>server_names_hash_bucket_size 3526;</span></span>
<span class="line"><span>server_names_hash_max_size 4096;</span></span>
<span class="line"><span>log_format combined_realip &#39;$remote_addr $http_x_forwarded_for [$time_local]&#39;</span></span>
<span class="line"><span>&#39; $host &quot;$request_uri&quot; $status&#39;</span></span>
<span class="line"><span>&#39; &quot;$http_referer&quot; &quot;$http_user_agent&quot;&#39;;</span></span>
<span class="line"><span>sendfile on;</span></span>
<span class="line"><span>tcp_nopush on;</span></span>
<span class="line"><span>keepalive_timeout 30;</span></span>
<span class="line"><span>client_header_timeout 3m;</span></span>
<span class="line"><span>client_body_timeout 3m;</span></span>
<span class="line"><span>send_timeout 3m;</span></span>
<span class="line"><span>connection_pool_size 256;</span></span>
<span class="line"><span>client_header_buffer_size 1k;</span></span>
<span class="line"><span>large_client_header_buffers 8 4k;</span></span>
<span class="line"><span>request_pool_size 4k;</span></span>
<span class="line"><span>output_buffers 4 32k;</span></span>
<span class="line"><span>postpone_output 1460;</span></span>
<span class="line"><span>client_max_body_size 10m;</span></span>
<span class="line"><span>client_body_buffer_size 256k;</span></span>
<span class="line"><span>client_body_temp_path /usr/local/nginx/client_body_temp;</span></span>
<span class="line"><span>proxy_temp_path /usr/local/nginx/proxy_temp;</span></span>
<span class="line"><span>fastcgi_temp_path /usr/local/nginx/fastcgi_temp;</span></span>
<span class="line"><span>fastcgi_intercept_errors on;</span></span>
<span class="line"><span>tcp_nodelay on;</span></span>
<span class="line"><span>gzip on;</span></span>
<span class="line"><span>gzip_min_length 1k;</span></span>
<span class="line"><span>gzip_buffers 4 8k;</span></span>
<span class="line"><span>gzip_comp_level 5;</span></span>
<span class="line"><span>gzip_http_version 1.1;</span></span>
<span class="line"><span>gzip_types text/plain application/x-javascript text/css text/htm</span></span>
<span class="line"><span>application/xml;</span></span>
<span class="line"><span>server</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>listen 80;</span></span>
<span class="line"><span>server_name localhost;</span></span>
<span class="line"><span>index index.html index.htm index.php;</span></span>
<span class="line"><span>root /usr/local/nginx/html;</span></span>
<span class="line"><span>location ~ \\.php$</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>include fastcgi_params;</span></span>
<span class="line"><span>fastcgi_pass unix:/tmp/php-fcgi.sock;</span></span>
<span class="line"><span>fastcgi_index index.php;</span></span>
<span class="line"><span>fastcgi_param SCRIPT_FILENAME /usr/local/nginx/html$fastcgi_script_name;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于配置文件各个参数的含义，阿铭就不再多解释了，很多配置可以根据字面意思猜到含义。保存配置文件后，需要先检验一下其是否有错误，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /usr/local/nginx/sbin/nginx -t</span></span></code></pre></div><p>如果显示如下内容，则说明配置正确：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful</span></span></code></pre></div><p>否则，需要根据错误提示修改配置文件。</p><p>(6) 启动 Nginx，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># systemctl start nginx.service</span></span></code></pre></div><p>如果不能启动，请查看 /usr/local/nginx/logs/error.log 文件，检查 Nginx 是否已启动，命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ps aux |grep nginx</span></span></code></pre></div><p>(7) 测试是否正确解析 PHP。</p><p>首先创建测试文件，操作方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># vim /usr/local/nginx/html/2.php</span></span></code></pre></div><p>其内容如下：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">php</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;test php scripts.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>执行如下命令测试文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># curl localhost/2.php</span></span>
<span class="line"><span>test php scripts.</span></span></code></pre></div><p>这说明 PHP 解析正常。</p>`,110)])])}const u=a(e,[["render",l]]);export{g as __pageData,u as default};
