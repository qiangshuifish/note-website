# 第22章Docker容器

在本章开头，阿铭先来介绍一个场景：如果一个软件（阿铭给它起了一个名字：NiuBys）想在Linux 操作系统上运行，需要搭建超过 20 个依赖的环境包，而且这些环境包有很多只能编译安装，所以要想成功运行 NiuBys，至少要花费 5 个小时。那么有没有一种方法可以将这些依赖环境包和 NiuBys 打包成一个综合体，下次再安装时直接安装这个综合体，这样不就简单多了吗？事实上，还真有类似的技术，那就是本章要介绍的容器技术。

容器技术中的典型代表就是 Docker，毫不夸张地说，如果你不会用 Docker，就不算一名合格的运维人员。在没有真正接触容器之前，无论阿铭说多少容器的优势，你可能都无法理解，因为你还没有亲自体验过它。接下来，阿铭要带你一步一步了解 Docker。

## 22.1 在 CentOS 8 上安装 Docker

作为时下比较流行的一种容器技术，Docker 必然支持在多个操作系统上安装，比如Windows、macOS 以及 Unix 等，也就是说 Docker 支持跨平台，所以我们可以将阿铭介绍的NiuBys 很方便地移植到 Windows 或者 macOS 上。在本章中，阿铭的演示将基于 CentOS8。

### 22.1.1 下载 Docker

你可以通过 yum 安装 Docker，不过暂时 Docker 官方并没有提供 CentOS 8 的 yum 源，网上有很多资料是在 CentOS 8 上使用基于 CentOS 7 的 yum 源，但阿铭觉得并不合适。所以，阿铭给出的方法是使用二进制包来安装 Docker。相关命令如下：

```
# wget https://download.docker.com/linux/static/stable/x86_64/docker-19.03.12.tgz
```

### 22.1.2 在 CentOS 8 上安装 Docker

对于二进制的 Docker 安装包，解压后就可以直接使用了，步骤如下：

```
# tar zxf docker-19.03.12.tgz // 解压
# cp docker/* /usr/bin/
此时就可以使用docker命令了：
# docker -v // 如果正常的话，会出现如下内容
Docker version 19.03.12, build 48a66213fe
```

Docker 也是一个服务，所以我们还需要编辑启动脚本：

```
# vim /usr/lib/systemd/system/docker.service // 加入如下内容
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target
[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s
[Install]
WantedBy=multi-user.target
```

然后启动 Docker 服务：

```
# systemctl daemon-reload
# systemctl start docker
# systemctl enable docker
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr
system/docker.service.
```

查看进程：

```bash
# ps aux |grep docker
root 24427 1.5 2.8 751780 53556 ? Ssl 22:14 0:00 /usr/bin/dockerd
root 24434 1.5 1.4 723528 26288 ? Ssl 22:14 0:00 containerd --config /var/run/
docker/containerd/containerd.toml --log-level info
```

到此，Docker 安装结束，下面阿铭会逐一介绍与 Docker 相关的概念。

## 22.2 Docker 镜像

Docker 镜像类似于安装操作系统的 ISO 文件，我们通过 ISO 文件安装一个操作系统，同样可以使用 Docker 镜像启动一个容器（对容器的解释，阿铭会在 22.3 节中详细介绍）。那么Docker 镜像从哪里来呢？如何获取呢？先来看下面的例子：

```
# docker pull busybox // 获取一个叫作busybox的镜像
Using default tag: latest
Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: TLS h
```

结果是报错了，它告诉我们 https://registry-1.docker.io/v2/ 无法访问，超时了。这个链接其实是 Docker 镜像的存放地址（也就是后面要跟大家介绍的 Docker 仓库），由于网络受限，所以下载失败了。但是大家不必担心，阿铭教你设置一个国内的加速器，这样就可以使用国内的资源站来下载 Docker 镜像了，具体步骤如下：

```bash
# vim /etc/docker/daemon.json // 写入如下内容
{
"registry-mirrors": ["https://dhq9bx4f.mirror.aliyuncs.com"]
}
# systemctl restart docker
# docker pull busybox
Using default tag: latest
latest: Pulling from library/busybox
91f30d776fb2: Pull complete
Digest: sha256:9ddee63a712cea977267342e8750ecbc60d3aab25f04ceacfa795e6fce341793
Status: Downloaded newer image for busybox:latest
docker.io/library/busybox:latest
```

要重启 Docker，此设置才会生效，之后再次下载镜像就会非常快了，使用如下命令查看下载的镜像：

```
# docker image ls
REPOSITORY TAG IMAGE ID CREATED SIZE
busybox latest c7c37e472d31 2 weeks ago 1.22MB
```

busybox 是一个非常小的 Docker 镜像，常被人用作测试或者演示。那么，Docker 到底都有啥镜像呢？像 CentOS、Ubuntu、MySQL、Nginx、Tomcat 等，只要是你接触过的软件，几乎

```
都有相关镜像。当然，你还可以使用docker search命令进行搜索，如下：
# docker search nginx
NAME DESCRIPTION STARS OFFICIAL AUTOMATED
nginx Official build of Nginx. 13469 [OK]
jwilder/nginx-proxy Automated Nginx reverse proxy for docker con… 1839 [OK]
richarvey/nginx-php-fpm Container running Nginx + PHP-FPM capable of… 780 [OK]
linuxserver/nginx An Nginx container, brought to you by LinuxS… 121
bitnami/nginx Bitnami nginx Docker Image 87 [OK]
tiangolo/nginx-rtmp Docker image with Nginx using the nginx-rtmp… 83 [OK]
jc21/nginx-proxy-manager Docker container for managing Nginx proxy ho… 70
alfg/nginx-rtmp NGINX, nginx-rtmp-module and FFmpeg from sou… 70 [OK]
nginxdemos/hello NGINX webserver that serves a simple page co… 56 [OK]
jlesage/nginx-proxy-manager Docker container for Nginx Proxy Manager 51 [OK]
nginx/nginx-ingress NGINX Ingress Controller for Kubernetes 37
privatebin/nginx-fpm-alpine PrivateBin running on an Nginx, php-fpm & Al… 29 [OK]
schmunk42/nginx-redirect A very simple container to redirect HTTP tra… 18 [OK]
排在第一行的肯定是STARS（类似于点赞、收藏，表示喜欢）最多的，也是官方（权威）的镜
```

像。你也可以制作自己的镜像，然后上传到 Docker 仓库，这样其他人也可以搜索到。那么如

```bash
何下载一个指定的镜像呢？比如，要下载第四个linuxserver/nginx，相关命令如下：
# docker pull linuxserver/nginx
Using default tag: latest
latest: Pulling from linuxserver/nginx
6eb1af1a521f: Pull complete
66fa287bda10: Pull complete
7de41abee0a4: Pull complete
998ccb56172f: Pull complete
179b46cdbdd8: Pull complete
a0108804ba5c: Pull complete
e63a05ec8abf: Pull complete
Digest: sha256:dc5429ae4a1b5ae329fb64c18f5cd47fbdf152099dca9335f4b46d944bc5c508
Status: Downloaded newer image for linuxserver/nginx:latest
docker.io/linuxserver/nginx:latest
在使用docker命令拉取镜像的时候，会发现一句提示Using default tag: latest，这
```

是告诉我们下载的镜像使用了默认的 TAG（latest），那么 TAG 又是什么呢？使用如下命令查看 Docker 镜像：

```
# docker images // 等同于docker image ls
REPOSITORY TAG IMAGE ID CREATED SIZE
linuxserver/nginx latest 75cc19404b34 3 days ago 165MB
busybox latest c7c37e472d31 2 weeks ago 1.22MB
```

其中第二列就是 TAG 啦。TAG 常用作标记一个镜像的版本，比如我们可以下载一个老版本的Nginx：

```bash
# docker pull nginx:1.16.0
1.16.0: Pulling from library/nginx
9fc222b64b0a: Pull complete
30e9fc7d9c5b: Pull complete
4b3a8aeaa40e: Pull complete
Digest: sha256:3e373fd5b8d41baeddc24be311c5c6929425c04cabf893b874ac09b72a798010
Status: Downloaded newer image for nginx:1.16.0
docker.io/library/nginx:1.16.0
[root@centos8_1 ~]# docker images
REPOSITORY TAG IMAGE ID CREATED SIZE
linuxserver/nginx latest 75cc19404b34 3 days ago 165MB
busybox latest c7c37e472d31 2 weeks ago 1.22MB
nginx 1.16.0 ae893c58d83f 11 months ago 109MB
使用docker images命令看到的这些镜像都是已经下载到本地的哦，我们可以对某个镜像修
```

改 TAG：

```
# docker tag c7c37e472d31 busybox:123
# docker images busybox
REPOSITORY TAG IMAGE ID CREATED SIZE
busybox 123 c7c37e472d31 2 weeks ago 1.22MB
busybox latest c7c37e472d31 2 weeks ago 1.22MB
你会发现，两个 busybox 镜像的IMAGE ID是一样的，其实这个IMAGE ID才是某个镜像的唯
一标识，镜像名字并不能完全标识某一个镜像，但镜像名字（REPOSITORY）和TAG组合在一
```

起可以标识一个镜像。

如果某一天你发现服务器上的本地镜像太多了，想删除一些，该如何做呢？此时需要用到下面

```
的这个rmi选项：
```

```
# docker rmi nginx:1.16.0
Untagged: nginx:1.16.0
Untagged: nginx@sha256:3e373fd5b8d41baeddc24be311c5c6929425c04cabf893b874ac09b72a
Deleted: sha256:ae893c58d83fe2bd391fbec97f5576c9a34fea55b4ee9daf15feb9620b14b226
Deleted: sha256:9987b8be475d96bc466b978b64b54af9e556884e78007caa19c065c6723f40e4
Deleted: sha256:5d7e4cc1668a0ce9764e7dad91cfbe594eea3a5b3ac6f4ec229d549cac20fff0
Deleted: sha256:8fa655db5360a336ddd0256f573e27975628668063732ef91f820d4770db737c
```

但如果该镜像已经启动了容器，那么删除时会报错。由于阿铭还没有介绍容器，所以具体的操

```
作暂时先不演示。遇到此类情况，只能是先停止容器，再删除。删除镜像时，如果指定IMAGE
ID，则会把该IMAGE ID对应的所有镜像都删除，但需要加-f选项，命令如下所示：
# docker rmi -f c7c37e472d31
Untagged: busybox:123
Untagged: busybox:latest
Untagged: busybox@sha256:9ddee63a712cea977267342e8750ecbc60d3aab25f04ceacfa795e6f
Deleted: sha256:c7c37e472d31c1685b48f7004fd6a64361c95965587a951692c5f298c6685998
Deleted: sha256:50761fe126b6e4d90fa0b7a6e195f6030fe250c016c2fc860ac40f2e8d2f2615
```

## 22.3 容器

容器就是用镜像运行起来的进程，比如你可以使用 Nginx 的镜像运行一个 Nginx 的容器，设置可以使用 CentOS 的镜像运行一个 CentOS 系统的容器，这就类似于虚拟机了。阿铭先运行一个 busybox 的容器，如下所示：

```
# docker pull busybox
# docker run -itd busybox
需要说明的是，如果事先不把镜像下载下来，当运行docker run的时候，镜像也会自动下
```

载，例如：

```
# docker run -itd redis
Unable to find image 'redis:latest' locally
latest: Pulling from library/redis
8559a31e96f4: Already exists
85a6a5c53ff0: Pull complete
b69876b7abed: Pull complete
a72d84b9df6a: Pull complete
5ce7b314b19c: Pull complete
04c4bfb0b023: Pull complete
Digest: sha256:800f2587bf3376cb01e6307afe599ddce9439deafbd4fb8562829da96085c9c5
Status: Downloaded newer image for redis:latest
e9cd29ea23dc304430fc216b30f8188f64953f6ad76fbee41f1fd496a7c25f27
它会先将镜像拉取下来，然后运行。其中-i参数表示交互式，等会阿铭会进入到容器里敲命
令；-t参数表示分配一个伪终端，可以让我们登录进去然后敲命令；-d参数表示将容器丢到
```

后台，如果不丢到后台，那么当命令结束时容器也就停止运行了，这不是我们想要的。所以阿铭建议你启动容器时必带上述三个参数。下面我们进入容器内部看看：

```
# docker ps // 查看已经运行的容器，可以带-a参数，它会列出所有容器（包括已经停止的容器）
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
e9cd29ea23dc redis "docker-entrypoint.s…" 5 minutes ago Up 5 minutes 6379/tcp thi
d436a7c129ea busybo "sh" 8 minutes ag Up 8 minutes elated_thompson
```

由于显示出来的行内容比较长，所以自动换行了，下面简要介绍各列的含义。

```
CONTAINER ID：这一列为容器的 ID，它是唯一标识容器的属性值。
IMAGE：这一列表示该容器是由哪个镜像启动来的。
COMMAND：这一列为容器启动时运行的命令。
CREATED：这一列为容器启动时间。
STATUS：这一列为该容器运行状态。
PORTS：这一列为该容器监听的端口。
NAMES：这一列为该容器的名字，它的作用跟CONTAINER ID类似，用来标记一个容器。
```

下面进入容器里看看：

```bash
# docker exec -it e9cd29ea23dc bash
root@e9cd29ea23dc:/data# ls
root@e9cd29ea23dc:/data# pwd
/data
使用exec指令可以进入容器里，注意这里的e9cd29ea23dc为CONTAINER ID，其实也可以
换成name，这要看你更习惯使用哪个。当然，在启动容器时也可以定义name：
# docker run -itd --name aminglinux busybox
576dd165fa1e36d086b600dc876ac4f66f915ff35000db322283022f39bbe723
# docker ps
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
576dd165fa1e busybox "sh" 3 seconds ago Up 2 seconds aminglinux
e9cd29ea23dc redis "docker-entrypoint.s..." 15 minutes ago Up 15 minutes 6379/tcp
d436a7c129ea busybox "sh" 18 minutes ago Up 18 minutes elated_thompson
然后就可以使用name来操作容器了：
# docker exec -it aminglinux sh
/ # ls
bin dev etc home proc root sys tmp usr var
/ #
上述命令中后面跟的sh为进入容器要运行的指令，sh其实就是打开一个 shell 终端，这样就
可以在里面敲命令了。创建容器时，除了可以使用docker run命令之外，还可以使用
docker create命令，如下：
# docker create -it nginx:1.8
Unable to find image 'nginx:1.8' locally
1.8: Pulling from library/nginx
Image docker.io/library/nginx:1.8 uses outdated schema1 manifest format. Please u
efd26ecc9548: Pull complete
a3ed95caeb02: Pull complete
24941909ea54: Pull complete
7e605cb95896: Pull complete
Digest: sha256:c97ee70c4048fe79765f7c2ec0931957c2898f47400128f4f3640d0ae5d60d10
Status: Downloaded newer image for nginx:1.8
db5522bde518c6a4af86b26219efe65db9a00bbf64223b010a3357c7f61f3d71
使用docker create命令仅仅是创建了一个容器，如果本地没有镜像，则会从远程下载。创
建后，可以使用start命令来启动容器：
# docker start db5522bde518
docker run命令还有一个常用的选项--rm，它可以让容器在停止或者退出时直接被删除
```

掉：

```
# docker run -itd --rm busybox sh
# docker ps
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
673e45d336ec busybox "sh" 3 seconds ago Up 2 seconds adoring_williams
db5522bde518 nginx:1.8 "bash" 11 minutes ago Up 9 minutes 80/tcp, 443/tcp sleepy_
576dd165fa1e busybox "sh" 3 days ago Up 3 days aminglinux
e9cd29ea23dc redis "docker-entrypoint.s..." 3 days ago Up 3 days 6379/tcp thirsty
d436a7c129ea busybox "sh" 3 days ago Up 3 days elated_thompson
```

然后将刚刚创建的容器停止：

```
# docker stop 673e45d336ec
```

现在再查看刚才的容器，已经找不到了：

```bash
# docker ps |grep 673e45d336ec
docker logs用于查看容器的日志，具体如下：
# docker run -itd busybox sh -c "while :; do echo 123; sleep 5; done"
c2d2f4c9f2b1bb5e7f204a48af3bb31217904db5f564af6db84c5a00ba8e0e21
# docker logs c2d2f4c9f2b
123
123
123
有时候，如果容器启动不起来，就可以使用docker logs命令查看具体的错误日志。在日常
的工作中，阿铭也会经常使用另外两个选项-v和-p，其中-v用来将宿主机上的目录或文件映
射到容器中，而-p用来把容器内的端口映射到宿主机上。比如：
# docker run -itd –v /data/:/mnt/ busybox sh // 将宿主机的/data/目录映射到容器的/mnt目
# docker run –itd –p 10001:80 busybox sh // 将容器的80端口映射到宿主机的10001端口，也就
```

其他选项由于使用不多，阿铭就不再介绍了。

## 22.4 创建镜像

作为新手，我们用得最多的就是下载一个现成的镜像，然后直接拿来用，但是官网上的镜像并不一定适合我们的应用场景，此时就需要自定义镜像。在本节中，阿铭会介绍三种创建镜像的方法。

### 22.4.1 通过容器创建镜像

目前有个需求：制作一个基于 CentOS 7 系统的 Nginx 服务器镜像。对于这个需求，首先要有一个 CentOS 7 的系统，然后在此系统中安装 Nginx 即可。具体步骤如下：

```
# docker run -itd --name centos7 centos:7 bash
# docker exec –it centos7 bash
```

进入容器里，安装 Nginx，命令如下：

```
# vi /etc/yum.repos.d/nginx.repo // 内容如下
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=0
enabled=1
# yum install –y nginx
```

输入 exit 或者按 Ctrl＋D 快捷键，退出该容器，然后将 CentOS 7 容器导出为镜像即可，命令如下：

```
# docker commit -m "centos7 with nginx" -a "aminglinux" centos7 centos7_with_ngin
其中-m后面为描述文字，-a后面为作者，centos7为容器名字或容器 id，最后面为新镜像的
名字。导出镜像后，使用docker images命令查看镜像：
# docker images |grep centos7
centos7_with_nginx 1.0 1c865b3ce672 2 minutes ago 290MB
```

有了这个镜像，就可以直接使用该镜像创建新容器了：

```
# docker run -it --rm --name nginx_test centos7_with_nginx:1.0 bash -c "rpm -qa n
nginx-1.18.0-1.el7.ngx.x86_64
```

可以看到，Nginx 的版本为 1.18.0。

### 22.4.2 使用模板创建镜像

模板又是什么？简单来讲，模板就是把事先做好的系统以及系统里面的各种文件、服务、配置、数据等制作成一种特殊的文件（这个文件就是模板），然后我们使用该模板文件直接安装系统，这样做出来的系统和先前的系统是一样的。这样做的好处是，可以省掉安装软件、配置服务的时间，这不就类似于 Docker 镜像嘛。

在 OpenVZ 的官网下载一个 Ubuntu 的模板。下载完后，导入该模板：

```
# cat ubuntu-12.04-x86-minimal.tar.gz | docker import - ubuntu:12.04
# docker images |grep Ubuntu
ubuntu 12.04 c84a97eb1893 37 seconds ago 146MB
```

然后使用该镜像启动容器：

```
# docker run -itd --name ubuntu1204 ubuntu:12.04 bash
46cceeda838d9c3c4075b6eecfb62e34f08796f457bc767875546e8df25a0142
# docker ps |grep ubuntu
46cceeda838d ubuntu:12.04 "bash" 7 seconds ago Up 5 seconds ubuntu1204
```

其实对于导入的镜像，还可以再把它导出：

```
# docker save -o aminglinux.tar ubuntu:12.04
# du -sh aminglinux.tar
148M aminglinux.tar
```

这个 aminglinux.tar 文件就是导出的镜像文件，大小为 148MB，跟刚下载的 ubuntu-12.04-x86-minimal.tar.gz 文件相比大了很多，其实它们俩是一样的，只不过 aminglinux.tar 这个文件

```
还没有压缩，压缩完后就跟 ubuntu-12.04-x86-minimal.tar.gz 的大小一样了。而save导出的
```

镜像如何导入？命令如下：

```
# docker load --input aminglinux.tar // 或者
# docker load < aminglinux.tar
```

那我们是否可以自己制作模板呢？也就是说将运行的容器导出为模板，比如将我们上面做的CentOS 7 制作为一个模板。答案是必须可以啊，过程如下：

```
# docker ps |grep centos7
eea48f5e7f53 centos:7 "bash" 24 hours ago Up 24 hours centos7
[root@centos8_1 ~]# docker export eea48f5e7f53 > centos7.tar
```

然后我们再把它导入，并启动为容器：

```
# cat centos7.tar |docker import - centos7:new
# docker run –itd --name centos7_new centos7:new bash
```

注意整个过程：先由容器导出为模板→再由模板导入为镜像→再由镜像启动容器。在本节中，

```
阿铭介绍了两种导出镜像的方法，一种是docker save，一种是docker export，它们的
```

区别在于，前者的操作对象是镜像，而后者的操作对象是容器。

### 22.4.3 使用 Dockerfile 创建镜像

Dockerfile 类似于 Linux 系统里面的 shell 脚本，它可以基于已存在的镜像创建新的镜像。比如，基于 CentOS 7，安装一个 MySQL 服务，就可以使用 Dockerfile 来实现。Dockerfile 是一个用来构建镜像的文本文件，其中包含了一条条构建镜像所需的指令和说明，下面简要介绍各个指令的作用。

```
FROM用于指定基于哪个镜像。
```

- 命令格式：

```
FROM <image> 或者FROM <image>:<tag>
```

- 命令举例：

```
FROM centos
1
FROM centos:7
2
MAINTAINER用于指定作者信息。
```

- 命令格式：

```
MAINTAINER <name>
1
```

- 命令举例：

```
MAINTAINER aming aming@aminglinux.com
1
RUN表示运行镜像操作指令。
```

- 命令格式：

```
RUN <command> 或者 RUN ["executable", "param1", "param2"]
1
```

- 命令举例：

```
RUN yum install httpd
1
RUN ["/bin/bash", "-c", "echo hello"]
2
CMD为启动容器时运行的指令。
CMD ["executable", "param1", "param2"]
1
CMD command param1 param2
2
CMD ["param1", "param2"]
3
虽然RUN和CMD看起来挺像，但是CMD用于指定容器启动时用到的命令，只能有一条。比
```

- 如：

```
CMD ["/bin/bash", "/usr/local/nginx/sbin/nginx", "-c", "/usr/local/nginx/conf/n
1
EXPOSE用于定义映射端口。
```

- 命令格式：

```
EXPOSE <port> [<port>...]
1
```

- 命令举例：

```
EXPOSE 22 80 8443
1
```

- 这个用来指定要映射出去的端口，比如我们在容器内部启动了 sshd 和 Nginx，所以需要把

```
22 和 80 端口暴露出去。这个需要配合-P（大写）来工作，也就是说在启动容器时，需要
加上-P，让它自动分配。如果想指定具体的端口，也可以使用-p（小写）来指定。
ENV用于定义容器内的环境变量。
```

- 命令格式：

```
ENV <key> <value>
1
```

- 命令举例：

```
ENV PATH /usr/local/mysql/bin:$PATH
1
它主要是为后续的RUN指令提供一个环境变量。我们也可以定义一些自定义的变量，比如：
ENV MYSQL_version 5.6
1
ADD用于将文件或目录复制到镜像里，支持 HTTP 连接。
```

- 命令格式：

```
ADD <src> <dest>
1
将本地的一个文件或目录复制到容器的某个目录里。其中src为 Dockerfile 所在目录的相对
```

- 路径，它也可以是一个 URL。比如：

```
ADD <conf/vhosts> </usr/local/nginx/conf>
1
COPY用于将文件或目录复制到镜像。
```

- 命令格式：

```
COPY <src> <dest>
1
使用方法和ADD一样，不同之处是它不支持 URL。
ENTRYPOINT用于定义容器启动时运行的指令。
格式类似CMD，也是只有一条生效，如果写多个，则只有最后一条有效。和CMD不同的是：
CMD是可以被docker run指令覆盖的，而ENTRYPOINT不能。比如，容器名字为
aming，我们在 Dockerfile 中指定如下CMD：
CMD ["/bin/echo", "test"]
1
```

```bash
启动容器的命令是docker run aming，这样会输出test。假如启动容器的命令是
docker run -it aming  /bin/bash，最终它什么都不会输出，因为这里
的/bin/bash指令将CMD的/bin/echo test覆盖了。
而ENTRYPOINT不会被覆盖，且会比CMD或者docker run指定的命令要靠前执行，比
```

- 如：

```bash
ENTRYPOINT ["echo", "test"]
1
docker run -it aming 123
2
会输出test 123，这相当于要执行命令echo test  123，也就是说docker run提供
的指令叠加在了ENTRYPOINT提供指令的后面。
VOLUME用于指定映射目录。
```

- 命令格式：

```
VOLUME ["/data"]
1
```

- 它的作用是创建一个可以从本地主机或其他容器挂载的挂载点，这个挂载点会映射到宿主机的某个目录下，这里不能指定，是自动生成的。

```
USER用于定义运行容器的用户。
```

- 命令格式：

```
USER USERNAME
1
```

- 命令举例：

```
USER user1
1
WORKDIR用于定义工作目录。
```

- 命令格式：

```
WORKDIR /path/to/workdir
1
它的作用是为后续的RUN、CMD或者ENTRYPOINT指定工作目录。
```

### 22.4.4 Dockerfile 实践

接下来，阿铭写一个具体的 Dockerfile 示例，帮你理解各个参数的含义，如下所示：

```
# vi /root/dockerfile // 写入如下内容
## 设置基础镜像为CentOS
FROM centos:7
# 设置作者
MAINTAINER aming aming@aminglinux.com
# 安装必要工具
RUN yum install -y pcre-devel wget net-tools gcc zlib zlib-devel make openssl-dev
# 安装Nginx
ADD http://nginx.org/download/nginx-1.8.0.tar.gz .
RUN tar zxvf nginx-1.8.0.tar.gz
RUN mkdir -p /usr/local/nginx
RUN cd nginx-1.8.0 && ./configure --prefix=/usr/local/nginx && make && make insta
RUN rm -fv /usr/local/nginx/conf/nginx.conf
ADD http://www.apelearn.com/study_v2/.nginx_conf /usr/local/nginx/conf/nginx.conf
# 映射端口
EXPOSE 80
# 设置挂载点
VOLUME ["/usr/local/nginx/html"]
# 设置容器启动时要执行的指令
ENTRYPOINT /usr/local/nginx/sbin/nginx && tail -f /usr/local/nginx/logs/nginx_err
```

保存该文件后，执行如下命令进行编译：

```
# docker build –f /root/dockerfile -t centos7_nginx:0.1 .
其中，build命令用来编译 Dockerfile，-f指定要编译的 Dockerfile，注意名字和路径都可以
自定义。-t指定生成的镜像名字和 TAG，后面还有个.表示在当前目录下来做这个事情。因
为 Dockerfile 里有可能会添加一些文件到镜像里，所以它会到这里的.（也就是当前目录下）
```

寻找指定文件。这个过程比较慢，而且输出的内容太多，所以阿铭就不再展示了，等它编译完

```
成后，要记得使用echo $?看看是否是 0（0 说明没问题），否则就有问题。如果是 0，接着
```

检查生成的镜像：

```
# docker images |grep centos7_nginx
centos7_nginx 0.1 b266018e6298 58 seconds ago 356MB
```

然后使用该镜像运行容器：

```javascript
# docker run -itd --name aming123 centos7_nginx:0.1 bash
a01a5885888f23299a93c7917b77d7a2dd08c0f0ea409daef390d59c4e532ef8
# docker exec -it aming123 bash
# ps aux |grep nginx // 在容器内查看nginx进程
root 1 0.0 0.1 11700 2592 pts/0 Ss+ 15:06 0:00 /bin/sh -c /usr/local/nginx/sbin/n
root 7 0.0 0.0 24904 572 ? Ss 15:06 0:00 nginx: master process /usr/local/nginx/s
root 8 0.0 0.0 4412 732 pts/0 S+ 15:06 0:00 tail -f /usr/local/nginx/logs/nginx_e
nobody 9 0.0 0.2 27348 4796 ? S 15:06 0:00 nginx: worker process
nobody 10 0.0 0.2 27348 4796 ? S 15:06 0:00 nginx: worker process
root 28 0.0 0.0 9104 872 pts/1 S+ 15:07 0:00 grep --color=auto nginx
在 Dockerfile 中阿铭有定义VOLUME，其实它映射到了宿主机的 /var/lib/docker/volumes/ 下的
某个目录，具体可以通过docker inspect aming123查看：
# docker inspect aming123 |grep -A10 'Mounts'
"Mounts": [
{
"Type": "volume",
"Name": "d7b1915410f51bdcd78e855c06230600fd622be420939277dedeaf694601c680",
"Source": "/var/lib/docker/volumes/
d7b1915410f51bdcd78e855c06230600fd622be420939277dedeaf694601c680/_data",
"Destination": "/usr/local/nginx/html",
"Driver": "local",
"Mode": "",
"RW": true,
"Propagation": ""
}
这里的Source对应的目录就是宿主机上映射的目录。
```

## 22.5 Docker 私人仓库

```
使用docker images命令查看到的所有镜像都存储在本机磁盘里，如果想把其中某个镜像给
```

其他机器使用，还得先导出镜像，然后将其传到其他机器上，这样十分不方便。那有没有比较好的方式来专门存储镜像，使之可以供所有机器使用呢？当然有，下面阿铭介绍一个业界使用非常多的私人镜像仓库工具 harbor。

### 22.5.1 部署 harbor 前的准备工作

1) 购买一个自己的域名。阿铭在这里推荐购买.xyz 的域名，因为.xyz 的域名比较便宜，你可以到新网、dnspod、阿里云等网站购买。

2) 申请一个免费的 SSL 证书。阿铭推荐的网站为 freessl.cn，首先注册一个账号，然后填写自己刚刚注册的域名，比如 harbor.aminglinux.xyz，单击右侧的创建免费的 SSL 证书。具体操作步骤阿铭不在这里展开了，最终需要获得两个文件：.crt 和.key 后缀的文件。

### 22.5.2 部署 harbor

1) 下载 docker-composedocker-compose 是一个 Docker 容器编排工具，它可以轻松地将多个容器一键启动或停止。我们使用的 harbor 其实就是由多个容器组成的一个容器组，所以使用 docker-compose 去管理非常方便。下面的命令会下载 docker-compose 文件，并将其保存到 /usr/local/bin/ 下面：

```
# curl -L https://github.com/docker/compose/releases/1.26.2/docker-compose-`uname
```

由于我们的系统为 CentOS 8，所以需要选择 docker-compose-Linux-x86_64，然后给它赋予可执行权限：

```bash
# chmod a+x /usr/local/bin/docker-compose
# docker-compose -v
docker-compose version 1.26.2, build eefe0d31
```

如果你的执行结果不显示其版本，则说明你的系统某处有问题。

2) 下载 harbor 离线包

阿铭在写本书时，harbor 的最新版本为 1.10.4，所以这就是阿铭下载的版本。和 docker-compose 一样，harbor 的下载速度简直慢如蜗牛，所以阿铭把已经下载好的文件保存在百度云盘，如果你不觉得版本老，就使用阿铭（微信 81677956）提供的软件包吧。

3) 安装和配置 harbor

首先，将刚下载的离线包解压到 /opt 下：

```
# tar zxf harbor-offline-installer-v1.10.4.tgz -C /opt/
# cd /opt/harbor
# vim harbor.yml // 做如下更改
hostname: harbor.aminglinux.cc // 这里填写你自己的域名，注意要和你申请的SSL证书一致
certificate: /etc/harbor.aminglinux.cc_chain.crt // 这为申请的SSL证书中的crt文件
private_key: /etc/harbor.aminglinux.cc_key.key // 这为申请的SSL证书中的key文件
harbor_admin_password: Harbor-12345 // 定义管理员密码
```

更改完配置文件后，保存该文件，然后开始安装：

```
# sh install.sh
整个过程会持续大约 1 分钟左右，如果成功，则会看到提示：----Harbor has been
installed and started successfully.----。在安装过程中，你可以看到它安装了
好多镜像，这些都是 harbor 服务所用到的，我们还可以使用docker-compose命令查看所有
```

容器的状态，如下所示：

```
# docker-compose -f /opt/harbor/docker-compose.yml ps
Name Command State Ports
---------------------------------------------------------------------------------
harbor-core /harbor/harbor_core Up (healthy)
harbor-db /docker-entrypoint.sh Up (healthy) 5432/tcp
harbor-jobservice /harbor/harbor_jobservice ... Up (healthy)
harbor-log /bin/sh -c /usr/local/bin/ ... Up (healthy) 127.0.0.1:1514->10514/tcp
harbor-portal nginx -g daemon off; Up (healthy) 8080/tcp
nginx nginx -g daemon off; Up (healthy) 0.0.0.0:80->8080/tcp,
0.0.0.0:443->8443/tcp
redis redis-server /etc/redis.conf Up (healthy) 6379/tcp
registry /home/harbor/entrypoint.sh Up (healthy) 5000/tcp
registryctl /home/harbor/start.sh Up (healthy)
```

可以看到，总共有 9 个容器，映射的端口有 10514、8080 以及 8443。记得把在配置文件中配置的域名做一下解析，然后就可以通过浏览器访问 harbor 了，用户名为 admin，密码为Harbor-12345。

### 22.5.3 使用 harbor

登录 harbor 后，可以看到左侧有项目、日志、系统管理等功能。要想把镜像存储到 harbor，还得做一些准备工作。

1) 创建项目

默认情况下，harbor 有一个 library 项目，而生成环境中则会根据不同的使用场景创建多个项目。下面阿铭来创建一个测试的项目。单击“新建项目”，项目名称填写“aming”，其他保持默认设置，单击“确定”按钮。

2) 创建用户

创建用户的目的是针对不同的项目设置不同的用户和权限。具体步骤为：在左侧系统管理下面单击“用户管理”，然后单击“创建用户”，接着自定义用户名（比如 user1），设置邮箱、全名、密码。要注意的是，设置的密码必须包含大小写字母和数字，并且长度在 8 和 20 之间。

3) 设置项目

再次单击左侧的项目，选择刚刚创建的项目“aming”，单击项目名，进入项目设置界面。单击“成员”，单击“+ 用户”，“姓名”这里填写“user1”，它会自动显示出 user1，选中它，角色保持默认设置即可，最后单击“确定”按钮。

做好以上三个准备工作后，就可以正式使用 harbor 了。回到 Linux 命令行界面，执行如下命令：

```
# docker login https://harbor.aminglinux.cc
Username: user1
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store
Login Succeeded
```

```
注意，必须要显示Login Succeeded才算正常，如果不正常，请检查域名是否解析对、SSL
```

证书是否配置对、用户名以及密码是否输入对。上面的操作其实是在命令行下面登录 harbor，后面就可以将镜像存入到 harbor 了。下面阿铭将 busybox 存入到 harbor，操作步骤如下：

```
# docker tag busybox:latest harbor.aminglinux.cc/aming/busybox:123
# docker push harbor.aminglinux.cc/aming/busybox:123
The push refers to repository [harbor.aminglinux.cc/aming/busybox]
50761fe126b6: Pushed
123: digest: sha256:2131f09e4044327fd101ca1fd4043e6f3ad921ae7ee901e9142e6e36b354a
```

这样就可以将 busybox 镜像推送到 harbor 了，再到浏览器查看 aming 项目，依次单击项目→aming→镜像仓库，就可以看到刚刚上传的 aming/busybox 了，再单击进去会发现里面有个123。

私有镜像仓库搭建完，这样企业中内网所有的 Docker 服务器就都可以将镜像上传到该 harbor服务器了。当然，也可以使用如下命令轻松下载：

```
# docker pull harbor.aminglinux.cc/aming/busybox:123
可以正常拉取下来的前提是，首先要运行docker login
https://harbor.aminglinux.cc。
```
