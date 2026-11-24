# 第16章NFS服务配置

你会经常用到 NFS 服务，它用于在网络上共享存储。举例来说，假如有 3 台机器 A、B 和C，它们需要访问同一个目录，且目录中都是图片。传统的做法是把这些图片分别放到 A、B、C 中，但若使用 NFS，只需要把图片放到 A 上，然后 A 再共享给 B 和 C 即可。访问 B 和C 时，是通过网络的方式去访问 A 上那个目录的。

## 16.1 服务端配置 NFS

```
在 CentOS 上使用 NFS 服务需要安装两个包（nfs-utils和rpcbind），不过当使用yum工
具安装nfs-utils时，也会一并安装rpcbind，如下所示：
# yum install -y nfs-utils
早期的 CentOS 版本是需要安装portmap包的，从 CentOS 6 开始，就改为安装rpcbind包
```

了。配置 NFS 比较简单，只需要编辑配置文件 /etc/exports。下面阿铭就先创建一个简单的NFS 服务器。

首先修改配置文件（默认该文件为空），如下所示：

```
# vim /etc/exports // 写入如下内容:
/home/nfstestdir 192.168.72.0/24(rw,sync,all_squash,anonuid=1000,anongid=1000)
```

这个配置文件就一行，共分为三部分。第一部分是本地要共享出去的目录，第二部分是允许访问的主机（可以是一个 IP，也可以是一个 IP 段），第三部分就是小括号里面的一些权限选项。关于第三部分，阿铭简单介绍一下。

- rw：表示读 / 写。

- ro：表示只读。

- sync：同步模式，表示把内存中的数据实时写入磁盘。

- async：非同步模式，表示把内存中的数据定期写入磁盘。

- no_root_squash：加上这个选项后，root 用户就会对共享的目录拥有至高的权限控制，就像是对本机的目录操作一样。但这样安全性降低。

```
root_squash：与no_root_squash选项对应，表示 root 用户对共享目录的权限不高，
```

- 只有普通用户的权限，即限制了 root。

- all_squash：表示不管使用 NFS 的用户是谁，其身份都会被限定为一个指定的普通用户身份。

```
anonuid/anongid：要和root_squash以及all_squash选项一同使用，用于指定使用
NFS 的用户被限定后的uid和gid，但前提是本机的 /etc/passwd 中存在相应的uid和
gid。
```

介绍了 NFS 的相关权限选项后，阿铭再来分析一下刚刚配置的 /etc/exports 文件。假设要共享的目录为 /home/nfstestdir，信任的主机为 192.168.72.0/24 这个网段，权限为读 / 写，同步

```
模式，限定所有使用者，并且限定的uid和gid都为1000。
```

编辑好配置文件后创建相关目录并启动 NFS 服务，如下所示：

```
# mkdir /home/nfstestdir
# systemctl start rpcbind
# systemctl start nfs-server
# systemctl enable rpcbind
# systemctl enable nfs-server
在启动 NFS 服务之前，需要先启动rpcbind服务（CentOS 的老版本中为portmap）。
```

## 16.2 客户端挂载 NFS

做本节试验最好是打开另外一台虚拟机，如果你的计算机资源吃紧，也可以在一台机器上操作，即客户端、服务端同用一台机器。阿铭的两台虚拟机 IP 地址分别为 192.168.72.128 和192.168.72.129，其中提供 NFS 服务的是 192.168.72.128。在客户端挂载 NFS 之前，我们

```
需要先查看服务端共享了哪些目录。客户端（192.168.72.129）安装nfs-utils包后，可以
使用showmount命令查看，如下所示：
# showmount -e 192.168.72.128
Export list for 192.168.72.128:
/home/nfstestdir 192.168.72.0/24
使用命令showmount -e IP就可以查看 NFS 的共享情况，从上例我们可以看到
```

192.168.72.128 的共享目录为 /home/nfstestdir，信任主机为 192.168.72.0/24 这个网段。

然后在客户端上（192.168.72.129）挂载 NFS，如下所示：

```
# mount -t nfs 192.168.72.128:/home/nfstestdir /mnt/
# df -h
文件系统 容量 已用 可用 已用% 挂载点
devtmpfs 888M 0 888M 0% /dev
tmpfs 904M 0 904M 0% /dev/shm
tmpfs 904M 8.7M 895M 1% /run
tmpfs 904M 0 904M 0% /sys/fs/cgroup
/dev/sda3 28G 6.2G 22G 23% /
/dev/sda1 190M 127M 49M 73% /boot
tmpfs 181M 0 181M 0% /run/user/0
192.168.72.128:/home/nfstestdir 28G 6.2G 22G 23% /mnt
使用命令df -h可以看到增加了一个 /mnt 分区，它就是 NFS 共享的目录了。进入 /mnt/ 目录
```

下，并创建测试文件：

```
# cd /mnt/
# touch aminglinux.txt
touch: 无法创建"aminglinux.txt": 权限不够
```

这是因为在服务端（192.168.72.128）上创建的 /home/nfstestdir 目录权限不合适，挂载后相

```
当于被限制为uid为 1000 的用户，解决该问题需要在服务端（192.168.72.128）上修改
```

/home/nfstestdir 目录权限：

```
# chmod 777 /home/nfstestdir/
```

然后再到客户端上（192.168.72.129）创建测试文件：

```
# cd /mnt/
# touch aminglinux.txt
# ls -l
总用量 0
-rw-r--r-- 1 mysql mysql 0 7月 1 22:16 aminglinux.txt
# id aming
uid=1000(mysql) gid=1000(mysql) 组=1000(mysql)
可以看到创建的新文件 aminglinux.txt 的所有者和所属组为 mysql，其uid和gid都为1000。
```

## 16.3 命令exportfs

```bash
exportfs命令的常用选项为-a、-r、-u和-v，这些选项的含义如下。
```

- -a：表示全部挂载或者卸载。

- -r：表示重新挂载。

- -u：表示卸载某一个目录。

- -v：表示显示共享的目录。

```
当改变 /etc/exports 配置文件后，使用exportfs命令挂载时不需要重启 NFS 服务。接下来
```

阿铭做一个试验，首先修改服务端（192.168.72.128）的配置文件，如下所示：

```
# vim /etc/exports // 增加一行
/tmp/ 192.168.72.0/24(rw,sync,no_root_squash)
```

然后在服务端（192.168.72.128）上执行如下命令：

```bash
# exportfs -arv
exporting 192.168.72.0/24:/tmp
exporting 192.168.72.0/24:/home/nfstestdir
在上一节用到了mount命令。其实用mount命令来挂载 NFS 服务是有讲究的，它要用-t
nfs来指定挂载的类型为nfs。另外在挂载 NFS 服务时，常用-o nolock选项（即不加
```

锁）。例如，在客户端（192.168.72.129）上执行如下命令：

```
# mkdir /aminglinux
# mount -t nfs -o nolock 192.168.72.128:/tmp/ /aminglinux/
你还可以把要挂载的 NFS 目录写到客户端上的 /etc/fstab 文件中，挂载时只需要执行mount
-a命令。例如在 /etc/fstab 文件里增加一行，如下所示：
192.168.72.128:/tmp/ /aminglinux nfs defaults,nolock 0 0
```

由于刚刚已挂载了 NFS，需要先卸载，执行如下命令：

```
# umount /aminglinux
```

然后重新挂载，执行如下命令：

```
# mount -a
```

这样操作的好处是以后开机会自动挂载 NFS。刚刚挂载的 /aminglinux/ 目录在服务端设置为了

```
no_root_squash，它并不会限制 root 用户，也就是说使用 root 用户创建文件时，跟在客户
```

端本机上创建的一样。下面是实验过程：

```
# cd /aminglinux/
# touch 1.txt
# ls -l 1.txt
-rw-r--r-- 1 root root 1113 7月 1 22:19 1.txt
```

可以看到 1.txt 的所有者和所属组全部为 root。关于 NFS 阿铭就讲这么多，相信你很快就能掌握！

## 16.4 课后习题

(1) 配置 NFS 需要安装哪些包？

```
(2) 如果不开启rpcbind服务就启动 NFS 会怎么样？
(3) 在 NFS 配置文件中，no_root_squash、all_squash和root_squash分别表示什么
```

含义？

(4) 用什么命令来查看某个服务器上的 NFS 共享信息？

(5) 如何把远程的共享 NFS 挂载到本地？如何查看本机已经共享的 NFS 资源？

(6) 在 NFS 服务器上，假如更改了配置文件，如何不重启 NFS 服务使配置生效？

```
(7) 挂载 NFS 时，经常加上-o nolock选项，它的作用是什么？
```

(8) 请按要求修改配置：把 /data/123/ 目录共享，针对 192.168.10.0/24 网段，限制客户端上

```
的所有用户，并限定为uid=800，gid=800。
```

(9) 用哪两种方法可以让客户端开机后自动挂载 NFS？
