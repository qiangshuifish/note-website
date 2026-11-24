# 第13章Linux系统管理技巧(3)

## 13.8 Linux 系统日志

日志记录了系统每天发生的各种各样的事情，比如监测系统状况、排查系统故障等。你可以通过日志来检查错误发生的原因，或者受到攻击时攻击者留下的痕迹。日志的主要功能是审计和监测，还可以实时地监测系统状态，监测和追踪侵入者等。

### 13.8.1 /var/log/messages

阿铭常查看的日志文件为 /var/log/messages，它是核心系统日志文件，包含了系统启动时的引导消息，以及系统运行时的其他状态消息。I/O 错误、网络错误和其他系统错误都会记录到这个文件中。其他信息，比如某个人的身份切换为 root，以及用户自定义安装的软件（如Apache）的日志也会在这里列出。

通常情况下，/var/log/messages 是做故障诊断时首先要查看的文件。那你肯定会说，这么多日志都记录到这个文件中，如果服务器上有很多服务，岂不是这个文件很快就会写得很大？没错，但是系统有一个日志轮询的机制，每星期切换一个日志，切换后的日志名字类似于messages-20200301，会存放在 /var/log/ 目录下面，连同 messages 一共有 5 个这样的日志文件。这里的 20200301 就是日期，它表示日志切割的年月日。这是通过 logrotate 工具的控制来实现的，它的配置文件是 /etc/logrotate.conf（如果没有特殊需求，请不要修改这个配置文件），如下所示：

```
# cat /etc/logrotate.conf
# see "man logrotate" for details
# rotate log files weekly
weekly
# keep 4 weeks worth of backlogs
rotate 4
# create new (empty) log files after rotating old ones
create
# use date as a suffix of the rotated file
dateext
# uncomment this if you want your log files compressed
#compress
# RPM packages drop log rotation information into this directory
include /etc/logrotate.d
# system-specific logs may be also be configured here.
```

这个配置文件里面的内容还是很容易明白的，都带有解释。除了 logrotate.conf 外，在/etc/logrotate.d/ 下面还有一些子配置文件，如下所示：

```javascript
# ls /etc/logrotate.d
bootlog btmp chrony dnf sssd syslog up2date wtmp.
# cat /etc/logrotate.d/syslog
/var/log/cron
/var/log/maillog
/var/log/messages
/var/log/secure
/var/log/spooler
{
missingok
sharedscripts
postrotate
/usr/bin/systemctl kill -s HUP rsyslog.service >/dev/null 2>&1 || true
endscript
}
其中 syslog 就是 messages 日志相关的配置文件了。/var/log/messages 是由rsyslogd这个
```

守护进程产生的，其服务为 rsyslog.service，如果停止这个服务则系统不会产生

```javascript
/var/log/messages，所以这个服务不要停止。rsyslog服务的配置文件为 /etc/rsyslog.conf，
```

这个文件定义了日志的级别。若没有特殊需求，这个配置文件是不需要修改的，详细内容阿铭

```
不再阐述。如果你感兴趣，请使用命令man rsyslog.conf获得更多关于它的信息。
```

### 13.8.2 dmesg

```javascript
除了关注 /var/log/messages 外，你还应该多关注一下dmesg这个命令，它可以显示硬件
```

（如，磁盘、网卡等）相关信息。如果你的某个硬件有问题（比如网卡），用这个命令也是可以看到的：

```
# dmesg |tail
[ 8.671924] RAPL PMU: hw unit of domain pp0-core 2^-0 Joules
[ 8.671925] RAPL PMU: hw unit of domain package 2^-0 Joules
[ 8.671926] RAPL PMU: hw unit of domain dram 2^-0 Joules
[ 8.671927] RAPL PMU: hw unit of domain pp1-gpu 2^-0 Joules
[ 10.555690] NET: Registered protocol family 40
[ 14.545496] IPv6: ADDRCONF(NETDEV_UP): ens33: link is not ready
[ 14.551791] e1000: ens33 NIC Link is Up 1000 Mbps Full Duplex, Flow Control: Non
[ 14.557466] IPv6: ADDRCONF(NETDEV_UP): ens33: link is not ready
[ 14.557477] IPv6: ADDRCONF(NETDEV_CHANGE): ens33: link becomes ready
[ 4202.922934] hrtimer: interrupt took 19983639 ns
```

### 13.8.3 安全日志

关于安全方面的日志，阿铭简单介绍几个命令或者日志。

```
last命令用来查看登录 Linux 的历史信息，具体用法如下：
# last |head
root pts/1 192.168.72.128 Fri Jun 26 17:41 still logged in
root pts/0 192.168.72.1 Fri Jun 26 15:46 still logged in
reboot system boot 4.18.0-147.3.1.e Fri Jun 26 15:41 still running
root pts/3 192.168.72.1 Fri Jun 26 15:33 - 15:40 (00:06)
root pts/2 192.168.72.1 Fri Jun 26 15:30 - 15:40 (00:10)
root pts/0 192.168.72.1 Fri Jun 26 15:13 - 15:40 (00:27)
root pts/2 192.168.72.1 Fri Jun 26 15:07 - 15:13 (00:05)
root pts/1 192.168.72.1 Fri Jun 26 09:39 - 15:40 (06:01)
root pts/0 192.168.120.106 Fri Jun 26 08:54 - 15:08 (06:14)
root tty1 Fri Jun 26 08:33 - 15:40 (07:07)
```

```
上例中，从左至右依次为用户名称、登录终端、登录客户端 IP、登录日期及时长。last命令
```

输出的信息实际上是读取了二进制日志文件 /var/log/wtmp，只是这个文件不能直接使用 cat、Vim、head、tail 等工具查看。

另外 /var/log/secure 也是和登录信息有关的日志文件。该日志文件记录验证和授权等方面的信息，比如 ssh 登录系统成功或者失败时，相关的信息都会记录在这个日志里。

最后，阿铭建议你以后在日常的管理工作中，要养成多看日志的习惯，尤其是一些应用软件的日志。比如 Nginx、MySQL、PHP（后续内容会讲到）等常用的软件，看它们的错误日志，可以帮助你排查问题以及监控它们的运行状况是否良好。

## 13.9 xargs与exec

```
xargs和exec可以实现相同的功能，exec主要是和find一起配合使用，而xargs比exec
```

的用处更多。

### 13.9.1 xargs应用

```
阿铭平时也经常使用xargs，很方便。在前面的例子中阿铭曾经使用过这个命令，现在就来详
```

细介绍一下：

```
# echo "121212121212" > 123.txt
# ls 123.txt | xargs cat
121212121212
上例表示把管道符前面的输出作为xargs后面的命令的输入。它的好处在于可以把原本两步或
者多步才能完成的任务仅用一步完成。xargs常常和find命令一起使用，比如查找当前目录
```

创建时间大于 10 天的文件，然后再删除，如下所示：

```
# find . -mtime +10 |xargs rm
这种应用是最为常见的。xargs后面的rm也可以加选项，当为目录时，就需要加-r选项了。
xargs还有一个神奇的功能，比如我现在要查找当前目录下所有后缀为.txt 的文件，然后把这
些文件变成.txt_bak。正常情况下必须写脚本才能实现，但是使用xargs就能一步完成，如下
```

所示：

```
# mkdir test
# cd test
# touch 1.txt 2.txt 3.txt 4.txt 5.txt
# ls
1.txt 2.txt 3.txt 4.txt 5.txt
# ls *.txt |xargs -n1 -i{} mv {} {}_bak
# ls
1.txt_bak 2.txt_bak 3.txt_bak 4.txt_bak 5.txt_bak
上例中，xargs -n1 -i{}类似于for循环，-n1表示逐个对象进行处理，-i{}表示用{}
取代前面的对象，mv {} {}_bak相当于mv 1.txt 1.txt_bak。刚开始接触这个命令
```

时，你也许觉得难以理解，多练习一下就会熟悉了。阿铭建议你记住这个应用，非常实用。

### 13.9.2 exec应用

```
使用find命令时，阿铭经常使用-exec选项，它可以达到和xargs同样的效果。比如查找当
```

前目录创建时间大于 10 天的文件并删除，如下所示：

```
# find . -mtime +10 -exec rm -rf {} \;
这个命令中也是用{}替代前面find出来的文件。后面的\作为;的转义符，否则 shell 会把分
```

号作为该行命令的结尾。

```
-exec同样可以实现上面批量更改文件名的需求，如下所示：
```

```
# ls
1.txt_bak 2.txt_bak 3.txt_bak 4.txt_bak 5.txt_bak
# find ./*_bak -exec mv {} {}_bak \;
# ls
1.txt_bak_bak 2.txt_bak_bak 3.txt_bak_bak 4.txt_bak_bak 5.txt_bak_bak
```

## 13.10 screen 工具介绍

有时我们要执行一个命令或者脚本，需要几小时甚至几天，在这个过程中，如果中途断网或出现其他意外情况怎么办？当然，你可以把命令或者脚本放到后台运行，不过也不保险。下面阿铭就介绍两种方法来避免这类状况发生。

### 13.10.1 使用nohup

首先写一个 sleep.sh 脚本，然后把它放到后台执行，如下所示：

```
# vim /usr/local/sbin/sleep.sh // 内容如下
#! /bin/bash
sleep 1000
[root@localhost ~]# nohup sh /usr/local/sbin/sleep.sh &
[1] 19997
上例中，直接在 sleep.sh 后面加&虽然可以在后台运行，但是当退出该终端时，这个脚本很有
可能也会退出。所以在前面加上nohup就没有问题了，执行后会在当前目录下生成一个
nohup的文件，该脚本所有相关的输出信息都会写到 nohup 文件里。它的作用就是防止进程
```

意外中断。

### 13.10.2 screen 工具的使用

简单来说，screen 是一个可以在多个进程之间多路复用一个物理终端的窗口管理器。screen中有会话的概念，用户可以在一个 screen 会话中创建多个 screen 窗口，在每一个 screen 窗口中就像操作一个真实的 SSH 连接窗口一样。下面阿铭介绍 screen 的一个简单应用。

```
首先打开一个会话，直接输入screen命令，然后回车进入 screen 会话窗口。如果你的系统
中没有screen命令，请用命令yum install -y epel-release; yum install -y
screen安装。它的使用也很简单，直接输入如下命令，就可以进入一个虚拟终端：
# screen
```

接着查看已经打开的 screen 会话，如下所示：

```
# screen -ls
There is a screen on:
5567.pts-1.aminglinux-123 (Attached)
1 Socket in /run/screen/S-root.
```

然后按 Ctrl+A 键，再按 d 退出该 screen 会话（只是退出，并没有结束，结束 screen 会话要

```
按 Ctrl+D 键或者输入exit）。退出后如果还想再次登录某个 screen 会话，可以使用命令
sreen -r [screen 编号]，这个编号就是上例中那个 5567。如果当前只打开了一个
```

screen 会话，后面的编号是可以省略的。当你有某个需要长时间运行的命令, 或者脚本时，就打开一个 screen 会话，然后运行该任务，按 Ctrl+A 键，再按 d 退出会话。这样不影响终端窗口上的任何操作。

## 13.11 课后习题

(1) 如何查看当前 Linux 系统有几颗物理 CPU 以及每颗 CPU 的核数？

```
(2) 查看系统负载有两个常用的命令，是哪两个？查看到的结果中load average后面的 3 个
```

数值表示什么含义呢？

```
(3) vmstat r, b, si, so, bi, bo这几列表示什么含义呢？
(4) Linux 系统里，你知道如何区分buffer和cache吗？
(5) 使用top查看系统资源占用情况时，哪一列表示内存占用呢？
```

(6) 如何实时查看网卡流量？如何查看历史网卡流量？

(7) 如何查看当前系统都有哪些进程？

```
(8) 用ps命令查看系统进程时，有一列为STAT，如果当前进程的stat为Ss表示什么含义？如
果为Z又表示什么含义？
```

(9) 如何查看系统都开启了哪些端口？

(10) 如何查看网络连接状况？

(11) 如果想修改 IP，需要编辑哪个配置文件？修改完配置文件后，如何重启网卡使配置生效？

(12) 能否给一个网卡配置多个 IP？如果能，怎么配置？

(13) 如何查看某个网卡是否连接着交换机？

(14) 如何查看当前主机的主机名？如何修改主机名？如果想重启后修改依旧生效，需要修改哪个配置文件呢？

(15) 设置 DNS 需要修改哪个配置文件？

(16) 使用 iptables 写一条规则，把来源 IP 为 192.168.1.11 访问本机 80 端口的包拒绝。

(17) 如何把 iptable 的规则保存到一个文件中做？如何恢复？

(18) 如何备份某个用户的任务计划？

(19) 任务计划格式中，前面 5 个数字分别表示什么含义？

(20) 怎样才能把系统中不用的服务关掉？

```
(21) 如何让某个服务（假如服务名为nginx）只在 3、5 两个运行级别开启（其他级别关
```

闭）？

```
(22) rsync的同步命令中，下面两种方式有什么不同呢？
rsync -av /dira/ ip:/dirb/
rsync -av /dira/ ip::dirb
(23) 使用rsync同步数据时，如果要同步的源中有软连接，如何把软连接的目标文件或者目录
```

同步？

(24) 某个账号登录 Linux 后，系统会在哪些日志文件中记录相关信息？

(25) 网卡或者硬盘有问题时，我们可以通过哪个命令查看相关信息？

```
(26) 分别使用xargs和exec，把当前目录下所有后缀名为.txt 的文件的权限修改为777。
```

(27) 有一个脚本的运行时间可能超过 2 天，如何做才能使其不间断地运行，并随时观察该脚本运行时的输出信息？

(28) 在 Linux 系统下如何按照下列要求抓包：只过滤出访问 HTTP 服务的、目标 IP 为192.168.0.111 的包，一共抓 1000 个包，并且保存到 1.cap 文件中。

```
(29) 使用rsync同步数据时，如何过滤出所有后缀名为.txt 的文件？
(30) 使用rsync同步数据时，如果目标文件比源文件还新，则忽略该文件，如何做？
```

(31) 在 Linux 命令行模式下如果想要访问某个网站，并且该网站域名还没有解析，如何做？

(32) 自定义解析域名时，我们可以编辑哪个文件？一个 IP 是否可以对应多个域名？一个域名z 是否对应多个 IP？

(33) 我们可以使用哪个命令查看系统的历史负载（比如说两天前的）？

(34) 在 Linux 下如何指定 DNS 服务器来解析某个域名？

```
(35) 使用rsync同步数据时，假如我们采用的是 ssh 方式，并且目标机器的 sshd 端口并不是
```

默认的 22 端口，那我们如何做？

```
(36) rsync同步时，如何删除目标数据多出来的数据，即源上不存在，但目标却存在的文件或
```

者目录？

```
(37) 使用free查看内存使用情况时，哪个数值表示真正可用的内存量？
```

(38) 有一天你突然发现公司网站访问速度变得非常慢，你该怎么办呢？（提示：服务器可以登录，你可以从系统负载和网卡流量入手。）

```
(39) rsync使用服务模式时，如果我们指定了一个密码文件，那么这个密码文件的权限应该设
```

置成多少？
