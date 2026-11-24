# 第17章配置FTP服务

FTP 是 File Transfer Protocol（文件传输协议，简称“文传协议”）的英文简写形式，用于在因特网上控制文件的双向传输。它同时也是一个应用程序，用户可以通过它把自己的 PC 机与世界各地所有运行 FTP 协议的服务器相连，以访问这些服务器上的大量程序和信息。FTP 的主要作用就是让用户连接一个远程计算机（这些计算机上运行着 FTP 服务器程序），并查看远程计算机中的文件，然后把文件从远程计算机复制到本地计算机，或把本地计算机的文件传送到远程计算机。FTP 方便传输数据，所以个人用户很多，但在企业里用得越来越少，因为 FTP有一定的安全隐患。在本章，阿铭将会介绍两种 FTP 软件。

## 17.1 使用vsftpd搭建 FTP 服务

```
CentOS 或者 Red Hat Linux 上有自带的 FTP 软件 vsftpd，默认并没有安装，需要用yum安
```

装，安装后不用配置，启动后便可以使用，但本节介绍的是它的高级用法。

### 17.1.1 安装vsftpd

```
使用 yum 工具安装vsftpd包，如下所示：
# yum install -y vsftpd
```

### 17.1.2 建立账号

```
vsftpd默认支持使用系统账号体系登录，但那样不太安全，所以阿铭建议你使用虚拟账号体
```

系登录。

首先建立与虚拟账号相关联的系统账号，如下所示：

```
# useradd virftp -s /sbin/nologin
```

接着建立与虚拟账户相关的文件，如下所示：

```
# vim /etc/vsftpd/vsftpd_login // 内容如下
test1
123456
test2
abcdef
```

需要说明的是，该文件的奇数行为用户名，偶数行为其上一行的用户密码。

然后更改该文件的权限，提升安全级别，如下所示：

```
# chmod 600 /etc/vsftpd/vsftpd_login
```

vsfptd 使用的密码文件不是明文的，需要生成对应的库文件，如下所示：

```
# db_load -T -t hash -f /etc/vsftpd/vsftpd_login /etc/vsftpd/vsftpd_login.db
```

最后建立与虚拟账号相关的目录以及配置文件，如下所示：

```
# mkdir /etc/vsftpd/vsftpd_user_conf
# cd /etc/vsftpd/vsftpd_user_conf
```

### 17.1.3 创建和用户对应的配置文件

用户的配置文件是单独存在的，每一个用户都有一个自己的配置文件，文件名和用户名一致，如下所示：

```bash
# vim test1 // 内容如下
local_root=/home/virftp/test1
anonymous_enable=NO
write_enable=YES
local_umask=022
anon_upload_enable=NO
anon_mkdir_write_enable=NO
idle_session_timeout=600
data_connection_timeout=120
max_clients=10
max_per_ip=5
local_max_rate=50000
其中，local root为 test1 账号的家目录，anonymous enable用来限制是否允许匿名账
号登录（若为NO，表示不允许匿名账号登录），write enable=YES表示可写，local
umask指定umask值，anon upload enable表示是否允许匿名账号上传文件，anon
mkdir write enable表示是否允许匿名账号可写。以上为关键配置参数，其他参数暂时不
```

用关心。

创建 test2 账号的步骤和 test1 一样，如下所示：

```
# mkdir /home/virftp/test1
# touch /home/virftp/test1/aminglinux.txt
# chown -R virftp:virftp /home/virftp
# vim /etc/pam.d/vsftpd // 在该文件最上面添加两行
auth sufficient /lib64/security/pam_userdb.so db=/etc/vsftpd/vsftpd_login
account sufficient /lib64/security/pam_userdb.so db=/etc/vsftpd/vsftpd_login
```

### 17.1.4 修改全局配置文件 /etc/vsftpd/vsftpd.conf

修改用户的配置文件后 vsftpd 还不可用，还需要修改它的一些全局配置文件。

首先编辑 vsftpd.conf 文件，如下所示：

```
# vim /etc/vsftpd/vsftpd.conf
```

修改如下内容：

```
将#anon_upload_enable=YES改为anon_upload_enable=NO；
将#anon_mkdir_write_enable=YES改为anon_mkdir_write_enable=NO。
```

再增加如下内容：

```
chroot_local_user=YES
guest_enable=YES
guest_username=virftp
virtual_use_local_privs=YES
user_config_dir=/etc/vsftpd/vsftpd_user_conf
allow_writeable_chroot=YES
然后启动vsftpd服务，执行如下命令：
# systemctl start vsftpd
```

整个配置过程的步骤虽然有点烦琐，但是并不复杂。下面我们来做一下测试：

```
# ps aux |grep vsftp // 查看进程是否存在
root 71785 0.0 0.0 26984 408 ? Ss 22:31 0:00 /usr/sbin/vsftpd /etc/vsftpd/vsftpd.
# yum install lftp // 安装lftp客户端软件
# lftp test1@127.0.0.1
口令:
lftp test1@127.0.0.1:~> ls
-rw-r--r-- 1 1002 1002 0 Jul 01 14:27 aminglinux.txt
test1 用户密码为 123456，成功登录vsftpd后，使用ls列出 test1 用户家目录下面的
aming.txt，其中1002为virftp用户的uid和gid。在这一步，很多同学会遇到问题，遇到问
```

题后请检查 /var/log/secure 日志，此日志通常会记录一些错误信息。

## 17.2 安装配置 pure-ftpd

pure-ftpd 为另外一款比较小巧实用的 FTP 软件，阿铭平时用得比较多。

### 17.2.1 安装 pure-ftpd

```
默认的 CentOS yum源并不包含 pure-ftpd，因此需要安装epel扩展源，具体过程如下：
# yum instll –y epel-release
# yum install -y pure-ftpd
```

### 17.2.2 配置 pure-ftpd

在启动 pure-ftpd 之前，需要先修改配置文件 /etc/pure-ftpd/pure-ftpd.conf。请查看该配置文

```
件，里面的内容很多。找到PureDB那一行，将其修改为PureDB /etc/pure-
ftpd/pureftpd.pdb，然后启动 pure-ftpd，启动之前需要先关闭 vsftpd，因为有端口冲
```

突，过程如下所示：

```javascript
# systemctl stop vsftpd
# systemctl start pure-ftpd
# ps aux |grep pure-ftp
r oot 72453 0.0 0.0 78916 864 ? Ss 23:05 0:00 /usr/sbin/pure-ftpd /etc/pure-ftpd/
启动成功的话，ps aux可以看到相关的进程，如果没有正常启动，需通过 /var/log/messages
```

日志查看原因。

### 17.2.3 建立账号

为了安全，pure-ftpd 使用的账号并非 Linux 的系统账号，而是虚拟账号。首先创建一个账号，如下所示：

```
# mkdir /data/ftp/
# useradd -u 1010 pure-ftp
# chown -R pure-ftp:pure-ftp /data/ftp
# pure-pw useradd ftp_user1 -u pure-ftp -d /data/ftp/
Password:
Enter it again:
其中，-u选项将虚拟用户ftp_user1与系统用户pure-ftp关联在一起，也就是说，使用
ftp_user1账号登录 FTP 后，会以pure-ftp的身份来读取和下载文件，-d选项后面的目
录为ftp_user1用户的家目录，这样可以使ftp_user1只能访问其家目录/data/ftp/。
```

然后创建用户信息数据库文件，这一步最关键。执行如下命令：

```
# pure-pw mkdb
```

```
其中，pure-pw还可以列出当前的 FTP 账号以及删除某个账号。例如，我们再创建一个账
```

号，如下所示：

```
# pure-pw useradd ftp_user2 -u pure-ftp -d /tmp
# pure-pw mkdb
```

列出当前账号，执行如下命令：

```
# pure-pw list
ftp_user1 /data/ftp/./
ftp_user2 /tmp/./
```

如果想删除账号，执行如下命令：

```
# pure-pw userdel ftp_user2
```

### 17.2.4 测试 pure-ftpd

测试过程如下：

```
# lftp ftp_user1@127.0.0.1
口令:
lftp ftp_user1@127.0.0.1:~> ls
drwxr-xr-x 2 1010 pure-ftp 6 Jul 1 23:05 .
drwxr-xr-x 2 1010 pure-ftp 6 Jul 1 23:05 ..
lftp ftp_user1@127.0.0.1:/> put /etc/passwd
1419 bytes transferred
lftp ftp_user1@127.0.0.1:/> ls
drwxr-xr-x 2 1010 pure-ftp 20 Jul 1 23:07 .
drwxr-xr-x 2 1010 pure-ftp 20 Jul 1 23:07 ..
-rw-r--r-- 1 1010 pure-ftp 1419 Jul 1 23:05 passwd
```

```
登录后，使用ls命令可以查看当前目录都有什么文件，使用put命令可以把系统的文件上传
```

到 FTP 服务器上。你还可以在 Windows 机器里安装一个 FTP 客户端软件（阿铭推荐开源的FileZilla），然后远程连接测试。

## 17.3 课后习题

(1) FTP 服务默认监听哪个端口？我们是否可以更改它？

(2) 搭建 FTP 服务的常用软件有哪些？系统自带的是哪一种？

(3) 如何使用 pure-ftpd 软件创建一个用户？如何删除一个用户？

(4) 如何使用 pure-ftpd 软件更改用户的密码？

(5) 如何使用 pure-ftpd 软件查看当前有几个用户？

(6) 使用 vsftpd 软件搭建一个 FTP 服务器。要求：创建三个用户 user1、user2 和 user3，这3 个用户都可以访问同一个目录，但是 user1 可读 / 写，而 user2 和 user3 只读。

(7) 使用 vsftpd 软件搭建一个 FTP 服务器。要求：创建三个用户，user1、user2 和 user3，这三个用户都可以访问同一个目录，每个用户都可以读取其他用户的文件，但只能更改自己的文件，不能更改其他用户的文件。

(8) 使用 vsftpd 软件搭建一个 FTP 服务器。要求：任何人都可以登录（匿名登录），并且匿名用户可以读 / 写。
