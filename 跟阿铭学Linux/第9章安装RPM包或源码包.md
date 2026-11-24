# 第9章安装RPM包或源码包

在 Windows 系统下安装软件很简单，只要双击后缀为.exe 的文件，然后根据提示连续单击“下一步”按钮即可。然而在 Linux 系统下安装软件就没那么容易了，因为我们不是在图形界面下操作。所以，你必须学会如何在 Linux 下安装软件。

```
前面我们多次提到了yum命令，它是 Red Hat 所特有的安装 RPM 程序包的工具。使用 RPM
```

工具安装某一个程序包时，有可能会因为该程序包依赖另一个程序包而无法安装；而使用 yum工具时，就可以连同依赖的程序包也一起安装，很方便。在 CentOS 里使用 yum 工具是免费的，但在 Red Hat 里，使用 yum 工具需要付费。在介绍 yum 工具之前，我们先来了解一下RPM。

## 9.1 RPM 工具

RPM 是 Red Hat Package Manager 的缩写，由 Red Hat 公司开发。它是以一种数据库记录的方式将我们所需要的套件安装到 Linux 主机的一套管理程序。也就是说，你的 Linux 系统中存在着一个关于 RPM 的数据库，它记录了安装的包以及包与包之间的依赖关系。RPM 包是预先在 Linux 机器上编译并打包的文件，安装非常快捷。但它也有一些缺点，比如安装环境必须要与编译时的环境一致或者相当、包与包之间存在着相互依赖的情况、卸载包时需要先把依赖的包卸载。如果依赖的包是系统所必需的，就不能卸载这个包，否则系统会崩溃。

由于我们在安装 CentOS 8 时下载的 ISO 镜像文件为 boot 版，所以我们无法在该 ISO 镜像文件里找到 RPM 包。需要自己下载。

每个 RPM 包的名称都被 - 和. 分成了若干部分。比如在 acl-2.2.53-1.el8.x86_64.rpm 包中，acl 为包名、2.2.53 为版本信息、1.el8 为发布版本号、x86_64 为运行平台。常见的运行平台有 i386、i586、i686 和 x86_64。需要注意的是，CPU 目前分 32 位和 64 位，i386、i586 和i686 都为 32 位平台，x86_64 则为 64 位平台。另外，有些 RPM 包并没有写具体的平台而是noarch（如 adcli-doc-0.8.2-3.el8.noarch.rpm），这说明这个 RPM 包没有硬件平台限制。

下面介绍一下 RPM 工具常用的命令。

### 9.1.1 安装 RPM 包

安装 RPM 包的命令如下：

```
# yum install –y wget // 安装wget命令，wget为下载工具
# wget http://mirrors.aliyun.com/centos/8/BaseOS/x86_64/os/Packages/at-3.1.20-11.
# rpm -ivh at-3.1.20-11.el8.x86_64.rpm
Verifying... ################################# [100%]
准备中... ################################# [100%]
正在升级/安装...
1:at-3.1.20-11.el8 ################################# [100%]
```

其中各个选项的含义如下。

- -i：表示安装。

- -v：表示可视化。

- -h：表示显示安装进度。

当然，RPM 工具也支持直接通过网络安装 RPM 包，如下所示：

```
# rpm -ivh http://mirrors.aliyun.com/centos/8/BaseOS/x86_64/os/Packages/bc-1.07.1
获取http://mirrors.aliyun.com/centos/8/BaseOS/x86_64/os/Packages/bc-1.07.1-5.el8.x
Verifying... ################################# [100%]
准备中... ################################# [100%]
正在升级/安装...
1:bc-1.07.1-5.el8 ################################# [100%]
```

另外，在安装 RPM 包时，常用的附带参数还包括如下几项。

- --force：表示强制安装，即使覆盖属于其他包的文件也要安装。

- --nodeps：表示当要安装的 RPM 包依赖于其他包时，即使其依赖他包没有安装，也要安装这个包。

### 9.1.2 升级 RPM 包

```
升级 RPM 包的命令为rpm -Uvh filename，其中-U选项表示升级。
```

### 9.1.3 卸载 RPM 包

```
卸载 RPM 包的命令为rpm -e filename，这里的filename是通过rpm的查询功能所查询
到的，稍后会进行介绍。下面先查找一个已经安装的包，然后使用-e选项卸载它。示例命令
```

如下：

```
# rpm -qa at
at-3.1.20-11.el8.x86_64
# rpm -e at
卸载时，-e选项后面的filename和安装时是有区别的。安装时，是把一个存在的文件作为
```

参数，而卸载时只需要包名即可。

### 9.1.4 查询一个包是否已安装

```
查询一个包的命令为rpm -q RPM包名，这里的“包名”是不带平台信息和后缀名的。示例命令
```

如下：

```
# rpm -q at
未安装软件包 at
# rpm -ivh at-3.1.20-11.el8.x86_64.rpm
Verifying... ################################# [100%]
准备中... ################################# [100%]
正在升级/安装...
1:at-3.1.20-11.el8 ################################# [100%]
# rpm -q at
at-3.1.20-11.el8.x86_64
我们可以使用命令rpm -qa查询当前系统所有已安装的 RPM 包，限于篇幅，这里只列出前
```

10 个，如下所示：

```
# rpm -qa |head
libevent-2.1.8-5.el8.x86_64
geolite2-city-20180605-1.el8.noarch
rpm-plugin-selinux-4.14.2-25.el8.x86_64
centos-gpg-keys-8.1-1.1911.0.8.el8.noarch
python3-unbound-1.7.3-8.el8.x86_64
filesystem-3.8-2.el8.x86_64
python3-dateutil-2.6.1-6.el8.noarch
ncurses-base-6.1-7.20180224.el8.noarch
python3-libselinux-2.9-2.1.el8.x86_64
glibc-langpack-zh-2.28-72.el8.x86_64
```

### 9.1.5 得到一个已安装的 RPM 包的相关信息

```
要得到一个已安装 RPM 包的相关信息，可以使用命令rpm -qi 包名，这里也不需要加平台
```

信息和后缀名。示例命令如下：

```
# # rpm -qi at
Name : at
Version : 3.1.20
Release : 11.el8
Architecture: x86_64
Install Date: 2020年02月06日 星期四 03时12分20秒
Group : System Environment/Daemons
Size : 131790
License : GPLv3+ and GPLv2+ and ISC and MIT and Public Domain
Signature : RSA/SHA256, 2019年07月01日 星期一 16时40分54秒, Key ID 05b555b38483c65d
Source RPM : at-3.1.20-11.el8.src.rpm
Build Date : 2019年05月11日 星期六 09时12分23秒
Build Host : x86-02.mbox.centos.org
Relocations : (not relocatable)
Packager : CentOS Buildsys <bugs@centos.org>
Vendor : CentOS
URL : http://ftp.debian.org/debian/pool/main/a/at
Summary : Job spooling tools
Description :
At and batch read commands from standard input or from a specified
file. At allows you to specify that a command will be run at a
particular time. Batch will execute commands when the system load
levels drop to a particular level. Both commands use user's shell.
You should install the at package if you need a utility for
time-oriented job control. Note: If it is a recurring job that will
need to be repeated at the same time every day/week, etc. you should
use crontab instead.
```

### 9.1.6 列出一个 RPM 包的安装文件

```javascript
列出一个 RPM 包的安装文件的命令为rpm -ql 包名，示例命令如下：
# # rpm -ql at
/etc/at.deny
/etc/pam.d/atd
/etc/sysconfig/atd
/usr/bin/at
/usr/bin/atq
/usr/bin/atrm
/usr/bin/batch
/usr/lib/.build-id
/usr/lib/.build-id/5b
/usr/lib/.build-id/5b/62f43486550b03dd4fc8620421cdb5a191ddcf
/usr/lib/.build-id/83
/usr/lib/.build-id/83/49b3653cd2bee7e0d8c391862f7c0dd2de32c9
/usr/lib/systemd/system/atd.service
/usr/sbin/atd
/usr/sbin/atrun
/usr/share/doc/at
/usr/share/doc/at/ChangeLog
/usr/share/doc/at/README
/usr/share/doc/at/timespec
/usr/share/licenses/at
/usr/share/licenses/at/COPYING
/usr/share/licenses/at/Copyright
/usr/share/man/man1/at.1.gz
/usr/share/man/man1/atq.1.gz
/usr/share/man/man1/atrm.1.gz
/usr/share/man/man1/batch.1.gz
/usr/share/man/man5/at.allow.5.gz
/usr/share/man/man5/at.deny.5.gz
/usr/share/man/man8/atd.8.gz
/usr/share/man/man8/atrun.8.gz
/var/spool/at
/var/spool/at/.SEQ
/var/spool/at/spool
```

通过上面的命令可以看出，文件 /usr/sbin/atrun 是通过安装 at 这个 RPM 包得来的。那么，如何通过文件去查找它的 RPM 包呢？

### 9.1.7 列出某个文件属于哪个 RPM 包

```
列出某个文件属于哪个 RPM 包的命令为rpm -qf 文件的绝对路径，示例命令如下：
# rpm -qf /usr/sbin/atrun
at-3.1.20-11.el8.x86_64
```

## 9.2 yum 工具

如果你使用的 Linux 系统支持 yum 工具，那么使用该工具比使用 RPM 工具更加方便。yum工具最大的优势在于可以联网去下载所需要的 RPM 包，然后自动安装。如果要安装的 RPM包有依赖关系，yum 工具会帮我们依次安装所有相关的 RPM 包。下面阿铭介绍一下常用的

```bash
yum命令。
```

### 9.2.1 列出所有可用的 RPM 包

```
使用yum list命令，可以列出所有的 RPM 包资源，如下所示：
# yum list |head -20
上次元数据过期检查：0:18:34 前，执行于 2020年02月06日 星期四 02时56分59秒。
```

- 已安装的软件包

```
NetworkManager.x86_64 1:1.20.0-3.el8 @anaconda
NetworkManager-libnm.x86_64 1:1.20.0-3.el8 @anaconda
NetworkManager-team.x86_64 1:1.20.0-3.el8 @anaconda
NetworkManager-tui.x86_64 1:1.20.0-3.el8 @anaconda
acl.x86_64 2.2.53-1.el8 @anaconda
at.x86_64 3.1.20-11.el8 @System
audit.x86_64 3.0-0.10.20180831git0047a6c.el8 @anaconda
audit-libs.x86_64 3.0-0.10.20180831git0047a6c.el8 @anaconda
authselect.x86_64 1.1-2.el8 @anaconda
authselect-libs.x86_64 1.1-2.el8 @anaconda
basesystem.noarch 11-5.el8 @anaconda
bash.x86_64 4.4.19-10.el8 @anaconda
bc.x86_64 1.07.1-5.el8 @System
bind-export-libs.x86_64 32:9.11.4-26.P2.el8 @anaconda
biosdevname.x86_64 0.7.3-2.el8 @anaconda
brotli.x86_64 1.0.6-1.el8 @anaconda
bzip2-libs.x86_64 1.0.6-26.el8 @anaconda
c-ares.x86_64 1.13.0-5.el8 @anaconda
```

限于篇幅，阿铭只列举了 18 个 RPM 包的信息。如上例所示，最左侧是 RPM 包名，中间是

```
版本信息，最右侧是安装信息。如果已安装，最右侧就显示@AppStream或者@
anaconda，它们前面都会有一个 @ 符号，这很好区分。如果未安装，则显示AppStream、
BaseOS。如果你仔细看看，就会发现yum list命令会先列出已安装的包（installed
```

package），然后再列出可安装的包（available package）。

### 9.2.2 搜索 RPM 包

```
搜索 RPM 包的命令为yum search [相关关键词]，示例命令如下：
# yum search vim
上次元数据过期检查：0:25:30 前，执行于 2020年02月06日 星期四 02时56分59秒。
============================== 名称 和 概况 匹配：vim ==============================
vim-filesystem.noarch : VIM filesystem layout
vim-minimal.x86_64 : A minimal version of the VIM editor
vim-minimal.x86_64 : A minimal version of the VIM editor
vim-common.x86_64 : The common files needed by any version of the VIM editor
vim-X11.x86_64 : The VIM version of the vi editor for the X Window System - GVim
vim-enhanced.x86_64 : A version of the VIM editor which includes recent enhanceme
除了这样的搜索方法外，阿铭还常通过grep来过滤，从而找到相应的 RPM 包，如下所示：
# yum list |grep vim
vim-common.x86_64 2:8.0.1763-13.el8 @AppStream
vim-enhanced.x86_64 2:8.0.1763-13.el8 @AppStream
vim-filesystem.noarch 2:8.0.1763-13.el8 @AppStream
vim-minimal.x86_64 2:8.0.1763-13.el8 @anaconda
vim-X11.x86_64 2:8.0.1763-13.el8 AppStream
```

### 9.2.3 安装 RPM 包

```
安装 RPM 包的命令为yum install [-y] [RPM包名]，如果不加-y选项，则会以与用户
```

交互的方式安装。示例命令如下：

```
# # yum install -y psmisc
上次元数据过期检查：0:30:11 前，执行于 2020年02月06日 星期四 02时56分59秒。
```

- 依赖关系解决。

```
=================================================================================
软件包 架构 版本 仓库 大小
=================================================================================
安装:
psmisc x86_64 23.1-3.el8 BaseOS 151 k
```

- 事务概要

```
=================================================================================
总下载：151 k
安装大小：487 k
```

- 下载软件包：

```
psmisc-23.1-3.el8.x86_64.rpm 420 kB/s | 151 kB 00:00
---------------------------------------------------------------------------------
总计 101 kB/s | 151 kB 00:01
```

- 运行事务检查事务检查成功。运行事务测试事务测试成功。运行事务

```
准备中 : 1/1
安装 : psmisc-23.1-3.el8.x86_64 1/1
运行脚本: psmisc-23.1-3.el8.x86_64 1/1
验证 : psmisc-23.1-3.el8.x86_64 1/1
已安装:
psmisc-23.1-3.el8.x86_64
```

- 完毕！

在这个过程中，首先会把需要安装的 RPM 包列出来，如果有依赖关系，也会把所有依赖的包列出来。然后询问用户是否需要安装，输入 y 则安装，输入 n 则不安装。但阿铭觉得这样太麻

```
烦，所以会直接加上-y选项，这样就省略了询问用户是否安装的那一步。
```

### 9.2.4 卸载 RPM 包

```
卸载 RPM 包的命令为yum remove [-y] [RPM包名]，示例命令如下：
# yum remove psmisc
```

- 依赖关系解决

```
================================================================================
软件包 架构 版本 仓库 大小
================================================================================
移除::
psmisc x86_64 23.1-3.el8 @BaseOS 487k
```

- 事务概要

```
================================================================================
移除 1 软件包
将会释放空间：487 k
确定吗？[y/N]： y
```

- 运行事务检查事务检查成功。运行事务测试事务测试成功。

- 运行事务

```
准备中 : 1/1
删除 : psmisc-23.1-3.el8.x86_64 1/1
运行脚本: psmisc-23.1-3.el8.x86_64 1/1
验证 : psmisc-23.1-3.el8.x86_64 1/1
已移除:
psmisc-23.1-3.el8.x86_64
```

- 完毕！

```
卸载和安装一样，也可以直接加上-y选项，从而省略与用户交互的那一步。这里阿铭需要提
```

醒一下，卸载某个 RPM 包时一定要看清楚，不要连其他重要的 RPM 包也一起卸载了，以免

```
影响正常的业务，所以使用yum remove命令卸载包时，还是不要加-y选项了。
```

### 9.2.5 升级 RPM 包

```sql
升级 RPM 包的命令为yum update [-y] [RPM包]，示例命令如下：
# yum update bash
上次元数据过期检查：0:37:08 前，执行于 2020年02月06日 星期四 02时56分59秒。
```

- 依赖关系解决。无须任何处理。完毕！

只不过阿铭的系统目前没有任何可以升级的 RPM 包。前面介绍了如何使用 yum 工具搜索、安装、卸载以及升级 RPM 包，如果你掌握了这些技能，基本上就可以解决日常工作中遇到的与 RPM 包相关的问题了。当然，yum 工具还有好多其他好用的命令，阿铭不再一一举出，如

```
果你感兴趣，可以使用man命令查阅帮助信息。除此之外，阿铭还会教你一些关于 yum 工具
```

的小应用。

### 9.2.6 更改 yum 仓库为国内镜像站

上面也提到，yum 是从网络获取 RPM 包的，那么它是去哪里下载的 RPM 包呢？大家可以通过查看配置文件 /etc/yum.repos.d/CentOS-Base.repo 获得下载地址：

```sql
# cat /etc/yum.repos.d/CentOS-Base.repo
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client. You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the
# remarked out baseurl= line instead.
#
#
[BaseOS]
name=CentOS-$releasever - Base
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=
#baseurl=http://mirror.centos.org/$contentdir/$releasever/BaseOS/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
```

这里的 mirrorlist.centos.org 为下载 RPM 的地址，该站点在国外，相对来说访问比较慢，我们可以将其更改为国内的镜像站点，比如阿里云的，具体方法如下。

(1) 更改 /etc/yum.repos.d/CentOS-Base.repo 文件：

```
# vim /etc/yum.repos.d/CentOS-Base.repo //改为如下内容
[BaseOS]
name=CentOS-$releasever - Base
baseurl=http://mirrors.aliyun.com/centos/$releasever/BaseOS/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
```

(2) 更改 /etc/yum.repos.d/CentOS-AppStream.repo 文件：

```
# vim /etc/yum.repos.d/CentOS-AppStream.repo // 改为如下内容
[AppStream]
name=CentOS-$releasever - AppStream
baseurl=http://mirrors.aliyun.com/centos/$releasever/AppStream/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
```

(3) 刷新 repos 生成缓存，命令如下所示：

```
# yum clean all
# yum makecache
然后就可以使用yum命令安装所需要的软件包了，比如我们可以安装一个 tftp 的 RPM 包，命
```

令如下所示：

```
# yum install –y tftp
```

### 9.2.7 利用 yum 工具下载 RPM 包

有时我们需要下载 RPM 包但不安装，而仅仅是复制给其他机器使用。其实，通过 yum 安装RPM 包时，它需要先下载这个 RPM 包，然后再去安装，所以使用 yum 工具完全可以做到只下载而不安装。

首先需要安装一个 yum 的工具：

```
# yum install -y yum-utils
```

```
然后使用yumdownloader命令就可以直接下载 RPM 包了，它会将 RPM 包下载到当前目录
```

下，当然如果不指定任何选项，它会只下载指定的 RPM 包，而不下载依赖的包。要想连同依

```
赖的包一起下载，还需要指定--resolve选项，命令如下：
# mkdir /tmp/rmps
# cd /tmp/rmps
# yumdownloader --resolve zlib-devel
上次元数据过期检查：0:02:01 前，执行于 2020年02月06日 星期四 05时59分10秒。
(1/8): libpkgconf-1.4.2-1.el8.x86_64.rpm 106 kB/s | 35 kB 00:00
(2/8): pkgconf-m4-1.4.2-1.el8.noarch.rpm 234 kB/s | 17 kB 00:00
(3/8): pkgconf-1.4.2-1.el8.x86_64.rpm 93 kB/s | 38 kB 00:00
(4/8): zlib-1.2.11-10.el8.i686.rpm 795 kB/s | 103 kB 00:00
(5/8): pkgconf-pkg-config-1.4.2-1.el8.x86_64.rpm 107 kB/s | 15 kB 00:00
(6/8): zlib-devel-1.2.11-10.el8.i686.rpm 324 kB/s | 56 kB 00:00
(7/8): zlib-devel-1.2.11-10.el8.x86_64.rpm 326 kB/s | 56 kB 00:00
(8/8): glibc32-2.28-42.1.el8.x86_64.rpm 1.8 MB/s | 1.5 MB 00:00
# ls
glibc32-2.28-42.1.el8.x86_64.rpm pkgconf-m4-1.4.2-1.el8.noarch.rpm zlib-devel-1.2
libpkgconf-1.4.2-1.el8.x86_64.rpm pkgconf-pkg-config-1.4.2-1.el8.x86_64.rpm zlib-
pkgconf-1.4.2-1.el8.x86_64.rpm zlib-1.2.11-10.el8.i686.rpm
```

## 9.3 安装源码包

在 Linux 下安装源码包是最常用的。在日常的管理工作中，阿铭的大部分软件都是通过源码安装的。安装源码包需要我们把源代码编译成可执行的二进制文件。如果你能读懂这些源代码，就可以修改其中的自定义功能，然后再按自己的需求编译。使用源码包除了可以自定义修改源代码外，还可以定制相关的功能，因为源码包在编译时可以附加额外的选项。

源码包的编译用到了 Linux 系统里的编译器。常见的源码包一般都是用 C 语言开发的，因为C 语言是 Linux 上最标准的程序语言。Linux 上的 C 语言编译器称为 gcc，利用它可以把 C 语言编译成可执行的二进制文件。所以，如果你的机器上没有安装 gcc，就无法编译源码，你可

```
以使用命令yum install -y gcc来安装 gcc。
```

安装源码包通常需要以下 3 个步骤。

(1) ./configure。这一步可以定制功能，加上相应的选项即可，具体有什么选项可以通过

```
命令./configure --help来查看。这一步会自动检测你的 Linux 系统与相关的套件是否有
```

编译该源码包时所需要的库，因为一旦缺少某个库，就不能完成编译。只有检测通过后，才会生成 Makefile 文件。

(2) make。使用这个命令，会根据 Makefile 文件中预设的参数进行编译，这一步其实就是 gcc在工作。

(3) make install。这一步是安装步骤，用于创建相关软件的存放目录和配置文件。

对于以上这 3 个步骤，并不是所有的源码包软件都一样，也就是说，源码包的安装并没有标准的安装步骤。这就需要你拿到源码包解压后，进入目录，找到相关的帮助文档（通常，会以INSTALL 或者 README 为文件名）。下面阿铭会编译安装一个源码包来帮助你更深刻地理解安装源码包的过程。

### 9.3.1 下载源码包

下载源码包一定要去官方站点，因为你从其他网站下载的源码包很有可能是被修改过的。我们先把 Nginx 的源码包下载到 /usr/local/src/ 目录下，命令如下所示：

```
# cd /usr/local/src/
# wget http://nginx.org/download/nginx-1.17.8.tar.gz`
```

`在下载之前，阿铭先进入 /usr/local/src 目录，这是因为阿铭习惯把源码包都放到这个目录下。这样做的好处是方便自己和其他管理员维护。所以，阿铭建议你将下载的源码包都统一放到这个目录下。

### 9.3.2 解压源码包

解压 .tar.gz 格式的压缩包，这在前面已经介绍过，示例命令如下：

```
# tar -zxvf nginx-1.17.8.tar.gz
```

### 9.3.3 配置相关的选项并生成 Makefile

首先，进入解压后的源码目录，在配置之前可以查看可用的配置参数，如下所示：

```
# cd nginx-1.17.8
# ./configure --help |less
--help print this message
--prefix=PATH set installation prefix
--sbin-path=PATH set nginx binary pathname
--modules-path=PATH set modules path
--conf-path=PATH set nginx.conf pathname
--error-log-path=PATH set error log pathname
--pid-path=PATH set nginx.pid pathname
--lock-path=PATH set nginx.lock pathname
--user=USER set non-privileged user for
worker processes
--group=GROUP set non-privileged group for
worker processes
限于篇幅，后面的内容阿铭省略了。常用的配置选项有--prefix=PREFIX，它的意思是定义
软件包的安装路径。如果你想了解其他配置选项，也可以使用命令./configure --help查
看详情。这里阿铭把 Nginx 安装在 /usr/local/nginx 目录下，该选项的配置为--
prefix=/usr/local/nginx。配置过程如下所示：
# ./configure --prefix=/usr/local/nginx
checking for OS
+ Linux 4.18.0-147.3.1.el8_1.x86_64 x86_64
checking for C compiler ... found
+ using GNU C compiler
+ gcc version: 8.3.1 20190507 (Red Hat 8.3.1-4) (GCC)
checking for gcc -pipe switch ... found
checking for -Wl,-E switch ... found
checking for gcc builtin atomic operations ... found
checking for C99 variadic macros ... found
checking for gcc variadic macros ... found
checking for gcc builtin 64 bit byteswap ... found
checking for unistd.h ... found
checking for inttypes.h ... found
checking for limits.h ... found
```

- 中间省略

```
./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
```

不幸的是配置刚开始就报错了，因为 Nginx 需要 pcre 库，该系统并未安装。安装命令如下：

```
# yum install -y pcre-devel
```

安装后再继续上面的步骤，如下所示：

```
# ./configure --prefix=/usr/local/nginx // 有诸多信息输入，阿铭不再提供
```

此时又有新的错误：

```
./configure: error: the HTTP gzip module requires the zlib library.
You can either disable the module by using --without-http_gzip_module
option, or install the zlib library into the system, or build the zlib library
statically from the source with nginx by using --with-zlib=<path> option.
```

根据提示，很容易解决此问题，安装 zlib 即可：

```
# yum install -y zlib-devel
```

然后继续 ./configure 那一步，最终通过，验证这一步是否成功的命令是：

```
# echo $?
0
```

这里返回值是 0，说明执行成功，否则就没有成功。此时就成功生成 Makefile 了。查看结果如下：

```
# ls -l Makefile
-rw-r--r--. 1 root root 376 2月 6 06:16 Makefile
```

### 9.3.4 进行编译

生成 Makefile 后，需要进行编译，如下所示：

```
# make
-bash: make: 未找到命令
说明：这是因为我们的系统还未安装make命令，安装即可
# yum install –y make
# make
# make
make -f objs/Makefile
make[1]: 进入目录“/usr/local/src/nginx-1.17.8”
cc -c -pipe -O -W -Wall -Wpointer-arith -Wno-unused-parameter -Werror -g -I src/c
-o objs/src/core/nginx.o \
src/core/nginx.c
cc -c -pipe -O -W -Wall -Wpointer-arith -Wno-unused-parameter -Werror -g -I src/c
```

编译时会出现类似这样杂乱的信息。限于篇幅，阿铭只列出一小部分内容。编译的时间会比较

```
长，这是因为 CPU 高速计算时的使用率很高。编译后再使用命令echo $?验证是否编译成
```

功，如下所示：

```
# echo $?
0
```

如果验证结果是 0，就可以执行最后一步了。

### 9.3.5 安装

```
安装源码包的命令为make install，如下所示：
# make install
make -f objs/Makefile install
make[1]: 进入目录“/usr/local/src/nginx-1.17.8”
test -d '/usr/local/nginx' || mkdir -p '/usr/local/nginx'
test -d '/usr/local/nginx/sbin' \
|| mkdir -p '/usr/local/nginx/sbin'
test ! -f '/usr/local/nginx/sbin/nginx' \
|| mv '/usr/local/nginx/sbin/nginx' \
'/usr/local/nginx/sbin/nginx.old'
cp objs/nginx '/usr/local/nginx/sbin/nginx'
test -d '/usr/local/nginx/conf' \
|| mkdir -p '/usr/local/nginx/conf'
cp conf/koi-win '/usr/local/nginx/conf'
cp conf/koi-utf '/usr/local/nginx/conf'
cp conf/win-utf '/usr/local/nginx/conf'
当然，你也可以使用命令echo $?验证是否已正确安装。执行完这一步，则会在
/usr/local/nginx 目录下增加很多目录。使用ls命令查看该目录，如下所示：
# ls /usr/local/nginx/
conf html logs sbin
```

到此，Nginx 源码的安装就完成了。其实在日常的源码安装过程中，遇到错误不能完成安装的情况很多，这些错误通常是因为缺少某一个库文件。这需要你仔细琢磨报错信息或者查看当前目录下的 config.log 以得到相关的信息。如果你实在不能解决，请联系阿铭。

## 9.4 课后习题

```
(1) 区分rpm与-qi、-qf、-ql和-qa这 4 个不同选项组合的作用。
(2) rpm -qi后面如果跟一个未安装的包名，会显示什么信息？
(3) vim命令是由哪个 RPM 包安装来的？
```

(4) 使用 RPM 工具安装和卸载某个包的命令是什么？

(5) 当安装某个有依赖关系的 RPM 包时，如何忽略依赖关系，强制安装该包？

(6) 如何使用 RPM 工具升级包？

(7) 请使用 yum 工具搜索包含关键词 tidy 的 RPM 包并安装，安装后再使用 yum 工具将其卸载。

(8) 如何使用 yum 工具来下载 RPM 包？

(9) 请到 PHP 的官方网站下载 PHP 的源码包，并动手试试编译安装它。

```
(10) 查资料指出yum upgrade与yum update的区别，它们在什么情况下使用？
```

(11) 如何查看 Linux 系统中（CentOS）是否安装过某个包？

(12) ./configure 完成后，我们并不知道有没有成功，用什么命令可以验证呢？

(13) 如果在./configure 这一步出现这样的错误：configure: error: no acceptable C compilerfound in $PATH，我们该怎么办？

(14) 有时你会忘记某个编译参数是如何写的，你怎么办？

(15) 查资料使用 iso 镜像文件或者系统安装盘构建 yum 仓库。
