# 第14章LNMP环境配置(1)

## 第 14 章 LNMP 环境配置

如果你想成为一名合格的系统管理员，仅掌握 Linux 的基础知识是远远不够的，你还需要长时间积累一定的工作经验。所谓的工作经验就是对一些运行在 Linux 系统上的软件的配置和应用，以及解决在工作中遇到的问题。这就好比 Windows 上的 Office 软件，大部分人都会安装，但是真正会用的人却不多。究其原因，不是因为 Office 软件太难，而是因为很少有人花费很长的时间去使用和研究。

LNMP 中的 L 指的是 Linux，N 指的是 Nginx（一种 Web 服务软件），M 指的是 MySQL，P指的是 PHP，目前对这种环境的应用非常多。Nginx 的设计初衷是提供一种快速、高效、多并发的 Web 服务软件。MySQL 是最为流行的一款关系型数据库，几乎所有的互联网或者技术型公司都会用到。PHP 是一种脚本语言，与 C 语言类似，是常用的网站编程语言。本章将带着大家搭建一个 Linux+Nginx+MySQL+PHP 的环境，用来运行 PHP 语言编写的网站程序。

## 14.1 安装 MySQL

我们平时是通过源码包安装 MySQL 的，但是由于它的编译时间比较长，因此阿铭建议你安装二进制免编译包，前文也介绍过源码包，所以相信你应该不会太陌生。源码包都是可以更改的由 C 或者 C++ 语言编写的源码文件，而免编译的二进制包就是把已经编译过的文件再打包后提供给我们。其实 Windows 上的安装程序（比如 QQ、360 安全卫士等）就是类似的安装包。你可以到 MySQL 的官方网站下载，具体下载哪个版本根据你的平台和需求而定。目前MySQL 主流版本为 5.7 和 8.0，但使用 8.0 版本的应用占比还是比较少的，所以本章阿铭以5.7 版本作为演示。

### 14.1.1 下载软件包

你可以到 MySQL 官方网站去下载 MySQL 的包，也可以到阿铭指定的网站下载，这个地址里面会提供本书中用到的所有软件包的下载地址，而且是在不断更新的。随着时间的推移，有的软件包更新了，下载地址也会变更。

在本节，阿铭使用的是免编译二进制包。需要注意，这个软件包是区分平台的。CentOS 7 之前的版本都有区分 32 位和 64 位，但如果你使用的是 CentOS 7 或者 CentOS 8，那么直接选择 64 的包下载。在阿铭提供的下载地址中，带有 x86_64 字样的就是 64 位的包，带有 i686字样的就是 32 位的包。要想查看你的 Linux 是多少位的，方法如下：

```
# uname -i
x86_64
```

然后下载源码包，如下所示：

```
# cd /usr/local/src/ // 建议你以后把所有软件包都放到这个目录下面
# wget http://mirrors.163.com/mysql/Downloads/MySQL-5.7/mysql-5.7.29-linux-glibc2
```

### 14.1.2 初始化

初始化过程如下：

```
# tar zxf mysql-5.7.29-linux-glibc2.12-x86_64.tar.gz // 解压
# [ -d /usr/local/mysql ] && mv /usr/local/mysql /usr/local/mysql_old
# mv mysql-5.7.29-linux-glibc2.12-x86_64 /usr/local/mysql // 挪动位置
# useradd -s /sbin/nologin mysql // 建立MySQL用户，因为启动MySQL需要该用户
# cd /usr/local/mysql
# mkdir -p /data/mysql // 创建datadir，数据库文件会放到这里面
# chown -R mysql:mysql /data/mysql // 更改权限，不更改后续操作就会出问题
# vim /etc/my.cnf //写入如下内容
[mysqld]
innodb_buffer_pool_size = 128M
log_bin = aminglinux
basedir = /usr/local/mysql
datadir = /data/mysql
port = 3306
server_id = 128
socket = /tmp/mysql.sock
join_buffer_size = 128M
sort_buffer_size = 2M
read_rnd_buffer_size = 2M
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
# /usr/local/mysql/bin/mysqld --initialize --user=mysql //初始化，如果有libaio.so.1
# yum install –y libaio
在上例的第二条命令中，阿铭用到了一个特殊符号&&，它在这里的意思是当前面的命令执行
成功时，才会执行后面，类似于一条if判断。意思是，如果 /usr/local/mysql 目录已经存在，
```

就要改一下它的名字，以免影响后面的操作，因为如果 /usr/local/mysql 目录存在，那么后面

```
的步骤就会失败。Mysqld --initialize命令是用来初始化数据的，会在 /data/mysql 下
```

面生成一堆目录和文件。在该命令执行时会输出一些信息，其中有一行一定要记下来：

```
A temporary password is generated for root@localhost: y,aK3!ouXm6t
```

这是在告诉我们，它生成了一个临时的密码，等会我们需要使用该密码登录 MySQL。

### 14.1.3 MySQL 配置文件

在上一节初始化时提供了一个配置文件 my.cnf，下面阿铭简单解释一下其含义。其中，

```
basedir是 MySQL 包所在的路径；datadir是定义的存放数据的地方，在默认情况下，错
误日志也会记录在这个目录下面；port定义 MySQL 服务监听的端口，如果不定义就是默认
的 3306；server_id定义该 MySQL 服务的 ID 号，这个参数在做主从配置的时候会用到，
后续会介绍；socket定义 MySQL 服务监听的套接字地址，在 Linux 系统下面，很多服务除
```

了可以监听一个端口（通过 TCP/IP 的方式通信），还可以监听套接字，两个进程就可以通过这个套接字文件通信。

复制启动脚本文件并修改其属性，如下所示：

```
# cp support-files/mysql.server /etc/init.d/mysqld
# chmod 755 /etc/init.d/mysqld
```

然后修改启动脚本，如下所示：

```
# vim /etc/init.d/mysqld
需要修改的地方有datadir=/data/mysql（前面初始化数据库时定义的目录）。把启动脚本
```

加入系统服务项，设定开机启动并启动 MySQL，如下所示：

```
# chkconfig --add mysqld // 把mysqld服务加入到系统服务列表中，第13章已经介绍过
# chkconfig mysqld on // 使其开机就启动
# service mysqld start // 启动服务
Starting MySQL.Logging to '/data/mysql/aminglinux-123.err'.
SUCCESS!
```

如果启动不了，请到 /data/mysql/ 目录下查看错误日志，这个日志名通常是“主机名.err”，比如阿铭演示的这个错误日志名为 /data/mysql/aminglinux-123.err。检查 MySQL 是否启动的命令为：

```
# ps aux |grep mysqld // 结果应该大于2行
# netstat –lnp|grep 3306 // 看看有没有监听3306端口
```

此时的 MySQL 还不能用，还需要设置一个新的 root 密码，如下所示：

```
# /usr/local/mysql/bin/mysqladmin -uroot -p'y,aK3!ouXm6t' password 'aminglinux.co
mysqladmin: [Warning] Using a password on the command line interface can be insec
Warning: Since password will be sent to server in plain text, use ssl connection
它的输出为一个警告，不用在意。-p后面为临时密码，password后面为新密码。
```

## 14.2 安装 PHP

早些年的 PHP 5.x 版本至少流行了有十年之久，但该版本已经于 2019 年 1 月停止更新，所以不再建议使用，除非网站程序必须要求 5.x。阿铭编写此书时主流版本为 7.2、7.3 和 7.4，所以将以 7.4 版本作为演示对象，其安装过程如下所示。

(1) 下载 PHP 源码包，命令如下：

```
# cd /usr/local/src
# wget http://cn2.php.net/distributions/php-7.4.7.tar.gz
```

(2) 解压源码包，创建账号，命令如下：

```
# tar zxf php-7.4.7.tar.gz
# useradd -s /sbin/nologin php-fpm
该账号用来运行php-fpm服务。在 LNMP 环境中，PHP 以php-fpm服务的形式出现，独立
```

存在于 Linux 系统中，方便管理。

(3) 配置编译选项，命令如下：

```
# cd php-7.4.7
# ./configure --prefix=/usr/local/php-fpm --with-config-file-path=/usr/local/php-
```

由于 PHP 的编译参数比较多，阿铭觉得暂时也不需要解释太多，大体意思就是：编译 PHP可以指定我们需要的功能模块，跟前面的 httpd 类似，至于需要哪些，这取决于你所在的公司需要什么功能。阿铭提供的这些功能模块比较常用，如果没有特殊要求，直接使用这些参数即可。执行这一步时阿铭遇到了几个错误，如下所示。

- 错误 1

```
configure: error: Package requirements (libxml-2.0 >= 2.7.6) were not met
1
```

- 其解决办法如下：

```
# yum install -y libxml2-devel
1
```

- 错误 2

```
error: Package requirements (openssl >= 1.0.1) were not met
1
```

- 其解决办法如下：

```
# yum install -y openssl openssl-devel
1
```

- 错误 3

```
error: Package requirements (sqlite3 > 3.7.4) were not met
1
```

- 其解决办法如下：

```
# yum install -y sqlite-devel
1
```

- 错误 4

```
error: Package requirements (libcurl >= 7.15.5) were not met
1
```

- 其解决办法如下：

```
# yum install -y libcurl-devel
1
```

- 错误 5

```
error: Package requirements (oniguruma) were not met
1
```

- 其解决办法如下：

```
# cd /usr/local/src/
1
# wget https://github.com/kkos/oniguruma/archive/v6.9.4.tar.gz -O oniguruma-6.9
2
# yum install -y autoconf automake libtool libtool-ltdl-devel
3
# tar -zxf oniguruma-6.9.4.tar.gz
4
# cd oniguruma-6.9.4
5
# ./autogen.sh
6
# ./autogen.sh
7
# ./configure --prefix=/usr
8
# make && make install
9
解决以上所有错误后，最终./configure运行结束，出现如下提示：
+--------------------------------------------------------------------+
| License: |
| This software is subject to the PHP License, available in this |
| distribution in the file LICENSE. By continuing this installation |
| process, you are bound by the terms of this license agreement. |
| If you do not agree with the terms of this license, you must abort |
| the installation process at this point. |
+--------------------------------------------------------------------+
Thank you for using PHP.
```

然后编译和安装，如下所示：

```
# make
# make install
执行make命令的时间会在 5 分钟以上，请耐心等待。对于以上的每一个步骤，如果没有完全
执行正确，那么其下一步是无法进行的。判断执行是否正确的方法为：使用命令echo $?查
看结果是否为0，如果不是则表示没有正确执行。
```

(4) 修改配置文件，命令如下：

```
# cp php.ini-production /usr/local/php-fpm/etc/php.ini
# vim /usr/local/php-fpm/etc/php-fpm.conf
```

把如下内容写入该文件：

```javascript
[global]
pid = /usr/local/php-fpm/var/run/php-fpm.pid
error_log = /usr/local/php-fpm/var/log/php-fpm.log
[www]
listen = /tmp/php-fcgi.sock
listen.mode = 666
user = php-fpm
group = php-fpm
pm = dynamic
pm.max_children = 50
pm.start_servers = 20
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
rlimit_files = 1024
```

保存配置文件后，检验配置是否正确的方法如下：

```
# /usr/local/php-fpm/sbin/php-fpm -t
如果显示test is successful，则说明配置没有问题，否则就要根据提示检查配置文件。
(5) 启动php-fpm，命令如下：
# cp ./sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
# chmod 755 /etc/init.d/php-fpm
# service php-fpm start
设置php-fpm开机启动的命令如下：
# chkconfig php-fpm on
检测php-fpm是否启动的命令如下：
# ps aux |grep php-fpm
```

执行这条命令后，可以看到启动了很多个进程（大概二十多个）。

## 14.3 安装 Nginx

从官方网站可以看到 Nginx 更新速度很快，这说明目前使用 Nginx 的用户越来越多了。但阿铭不建议你安装最新版本的 Nginx，因为新版本难免会有一些 Bug 或者漏洞。阿铭建议你安装最近发布的 stable 版本，阿铭写作本书时，最近的 stable 版本为 1.18。具体的下载安装步骤如下所示。

(1) 下载和解压 Nginx，命令如下：

```
# cd /usr/local/src/
# wget http://nginx.org/download/nginx-1.18.0.tar.gz
# tar zxvf nginx-1.18.0.tar.gz
```

(2) 配置编译选项，命令如下：

```
# cd nginx-1.18.0
# ./configure --prefix=/usr/local/nginx
```

(3) 编译和安装 Nginx，命令如下：

```
# make
# make install
```

因为 Nginx 的安装文件比较小，所以可以很快安装完，而且也不会出什么错误。

(4) 编写 Nginx 启动脚本，并加入系统服务，命令如下：

```
# vim /usr/lib/systemd/system/nginx.service // 写入如下内容
[Unit]
Description=nginx - high performance web server
After=network.target remote-fs.target nss-lookup.target
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
[Install]
WantedBy=multi-user.target
```

载入系统服务列表：

```
# systemctl daemon-reload
```

使 Nginx 开机启动，请执行如下命令：

```
# systemctl enable nginx.service
```

(5) 更改 Nginx 的配置文件。

首先把原来的配置文件清空，操作方法如下：

```
# > /usr/local/nginx/conf/nginx.conf
重定向符号>之前就介绍过，单独使用该符号时，可以把一个文本文档快速清空。然后编辑配
```

置文件：

```
# vim /usr/local/nginx/conf/nginx.conf // 写入如下内容
user nobody nobody;
worker_processes 2;
error_log /usr/local/nginx/logs/nginx_error.log crit;
pid /usr/local/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;
events
{
use epoll;
worker_connections 6000;
}
http
{
include mime.types;
default_type application/octet-stream;
server_names_hash_bucket_size 3526;
server_names_hash_max_size 4096;
log_format combined_realip '$remote_addr $http_x_forwarded_for [$time_local]'
' $host "$request_uri" $status'
' "$http_referer" "$http_user_agent"';
sendfile on;
tcp_nopush on;
keepalive_timeout 30;
client_header_timeout 3m;
client_body_timeout 3m;
send_timeout 3m;
connection_pool_size 256;
client_header_buffer_size 1k;
large_client_header_buffers 8 4k;
request_pool_size 4k;
output_buffers 4 32k;
postpone_output 1460;
client_max_body_size 10m;
client_body_buffer_size 256k;
client_body_temp_path /usr/local/nginx/client_body_temp;
proxy_temp_path /usr/local/nginx/proxy_temp;
fastcgi_temp_path /usr/local/nginx/fastcgi_temp;
fastcgi_intercept_errors on;
tcp_nodelay on;
gzip on;
gzip_min_length 1k;
gzip_buffers 4 8k;
gzip_comp_level 5;
gzip_http_version 1.1;
gzip_types text/plain application/x-javascript text/css text/htm
application/xml;
server
{
listen 80;
server_name localhost;
index index.html index.htm index.php;
root /usr/local/nginx/html;
location ~ \.php$
{
include fastcgi_params;
fastcgi_pass unix:/tmp/php-fcgi.sock;
fastcgi_index index.php;
fastcgi_param SCRIPT_FILENAME /usr/local/nginx/html$fastcgi_script_name;
}
}
}
```

关于配置文件各个参数的含义，阿铭就不再多解释了，很多配置可以根据字面意思猜到含义。保存配置文件后，需要先检验一下其是否有错误，命令如下：

```
# /usr/local/nginx/sbin/nginx -t
```

如果显示如下内容，则说明配置正确：

```
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

否则，需要根据错误提示修改配置文件。

(6) 启动 Nginx，命令如下：

```
# systemctl start nginx.service
```

如果不能启动，请查看 /usr/local/nginx/logs/error.log 文件，检查 Nginx 是否已启动，命令如下：

```
# ps aux |grep nginx
```

(7) 测试是否正确解析 PHP。

首先创建测试文件，操作方法如下：

```
# vim /usr/local/nginx/html/2.php
```

其内容如下：

```bash
<?php
echo "test php scripts.";
?>
```

执行如下命令测试文件：

```
# curl localhost/2.php
test php scripts.
```

这说明 PHP 解析正常。
