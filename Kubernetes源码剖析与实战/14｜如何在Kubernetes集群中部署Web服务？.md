# 14 | 如何在Kubernetes集群中部署Web服务？

你好，我是孔令飞。

之前我们的软件会部署在物理机、虚拟机上或者直接用 Docker 来部署。但是在云原生时代，软件的部署模式发生了很大的变化。得益于 Kubernetes 强大的功能，越来越多的软件选择在Kubernetes 上部署，这几乎已经成为事实上的标准。因此，在本课程中，OneX 项目也选择部署在了 Kubernetes 中。

本节课的核心目标是带你在 Kubernetes 上快速部署 OneX 项目，准备好一个开发测试环境。为了降低学习门槛，我们会从最简单的 YAML 文件部署入手（后续本课程会进阶到 Helm 部署）。

## 创建 OneX Kind 集群

要在 Kubernetes 上部署 OneX，首先我们要创建一个开发、测试用的 Kubernetes 集群。这里，我使用 Kind 工具来快速创建一个 Kind 集群。具体步骤如下：

1. 安装 Kind 工具

2. 创建 Kind 集群配置

3. 创建 Kind 集群

4. 访问 Kind 集群

- 提示：在实际的项目开发中，我们通常称 Kind 创建的集群为 Kind 集群。

### 步骤 1：安装 Kind 工具

如果你已经安装了 Kind 工具，可以跳过此步。如果没有安装，可以使用 2 种方式来安装。

我们可以使用 OneX Makefile 中的安装规则：

```
$ make tools.install.kind
```

也可以直接下载官方提供的二进制安装文件来安装：

```
$ curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.19.0/kind-linux-amd64
$ chmod +x ./kind
$ sudo mv ./kind /usr/local/bin/kind
$ ${ONEX_ROOT}/scripts/add-completion.sh kind bash
$ kind version # 验证 kind
kind v0.19.0 go1.21.4 linux/amd64
我们要注意，这里安装的 Kind 工具版本为 v0.19.0，这个版本的工具我安装测试过，可以比
较顺利地创建 Kind 集群。而 v0.20.0、v0.21.0、v0.22.0 版本的 Kind 工具，在创建集
```

群时会遇到一些错误。如果你感兴趣，后面也可以升级 Kind 工具，自行测试安装。

### 步骤 2：创建 Kind 集群配置

创建一个 Kind 集群通常需要配置集群的服务 CIDR、Pod CIDR、集群域名等。Kind 提供了–config 命令行选项，可以使我们指定一个配置文件，来配置 Kind 集群。你可以阅读 Kind 官方文档来了解这些配置项。

为了简化操作，OneX 项目仓库中包含了一个预定义的 Kind 集群配置 kind-onex.yaml，配置文件中包含了常用的配置项设置及说明，你只需要稍加修改便可以使用，修改命令如下：

```
$ HOSTIP=`ip -o -4 addr show eth0 | ip -o -4 addr show eth0 | awk '{split($4, a,
$ sed "s/apiServerAddress.*/apiServerAddress: ${HOSTIP}/g" manifests/installation
```

上述命令将 apiServerAddress 修改为你的宿主机 eth0 网卡的 IP 地址，这样我们才能在宿主机上访问 Kind 集群的 kube-apiserver。如果宿主机没有 eth0 网卡，或者 eth0 网卡 IP 地址不可访问，需要你自行获取 IP 地址并替换。

### 步骤 3：创建 Kind 集群

有了 Kind 集群配置之后，我们就可以使用该配置来快速创建一个开发、测试用的 Kind 集群，创建命令如下：

```
$ kind create cluster --config=/tmp/kind-onex.yaml # 创建一个名为 onex 的 Kind 集群
$ kind get clusters # 查询 Kind 集群列表
onex
```

上述命令会成功创建一个有 3 个节点的 Kind 集群，并将 kubectl 命令的 context 设置为新创建的 Kind 集群。

另外，一个开发、测试用的 Kubernetes 节点，最好具有 2 个及以上的节点。多个节点有利于观察调度器的行为，方便我们后续对调度器进行观察、测试等操作。

你可以通过以下命令来检查 Kind 集群是否正常运行：

```sql
$ kubectl -n kube-system get pods --no-headers | grep -v Running # 确保所有的 Pod 都
$ kubectl get nodes # 确保所有的 Node 都处在 Ready 状态
NAME                 STATUS   ROLES           AGE     VERSION
onex-control-plane   Ready    control-plane   3m29s   v1.27.3
onex-worker          Ready    <none>          3m10s   v1.27.3
onex-worker2         Ready    <none>          3m11s   v1.27.3
onex-worker3         Ready    <none>          3m11s   v1.27.3
如果你想删除 OneX 集群，可以通过 kind delete cluster --name=onex 命令来删
```

除。

### 步骤 4：访问 Kind 集群

```
我们通过 kubectl cluster-info 来访问新建的 Kind 集群，以验证集群成功创建。访问
```

命令如下：

```
$ kubectl config use-context kind-onex
$ kubectl cluster-info --context kind-onex
Kubernetes control plane is running at https://10.37.83.200:16443
CoreDNS is running at https://10.37.83.200:16443/api/v1/namespaces/kube-system/se
To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
这里要注意，如果我们创建的 Kind 集群名字为 xxx，那么在 $HOME/.kube/config 文件
中的 context 名字为 kind-xxx。如果我们有多个 Kind 集群，在使用 kubectl config
use-context 命令切换 context 时，不要搞错 context 名字。
```

## 部署存储服务

创建完开发、测试用的 Kind 集群之后，就可以在集群中部署需要的组件了。首先，我们需要部署 OneX 项目组件依赖的一些存储服务，主要有（部署不分顺序）：

1. MariaDB 安装和配置

2. Redis 安装和配置

3. etcd 安装和配置

4. MongoDB 安装和配置

因为存储服务是有状态服务，所以我们需要使用 Kubernetes 的 StatefulSet 资源来部署。

### MariaDB 安装和配置

MariaDB 的具体安装步骤如下：

```
$ ls manifests/installation/storage/mariadb
service.yaml  statefulset.yaml
$ kubectl create ns infra # 如果 kube-apiserver 开启了NamespaceAutoProvision admins
$ kubectl -n infra create secret generic mariadb --from-literal=MYSQL_ROOT_PASSWO
$ kubectl -n infra apply -f manifests/installation/storage/mariadb
上述安装命令会在 Kubernetes 集群中 infra 命名空间下创建以下 3 个资源：
名为 mariadb 的 Secret 资源，Secret 中会保存 MariaDB 的用户名和密码，该 Secret 会
```

- 在 StatefulSet 中被挂载为 Pod 的环境变量。

```
名为 mariadb 的 StatefulSet 资源，StatefulSet 会创建一个有状态的 Pod：mariadb-
0。
名为 mariadb的 Service 资源，Kubernetes 集群内的通信可以通过 Service 来做服务发
```

- 现。一个 Service 其实就是一个域名，Kubernetes 的 DNS 服务会解析 Service 名为真正的Pod IP。

我们重点来看几个资源的资源定义文件内容。

首先，创建 StatefulSet 资源的资源定义文件为：statefulset.yaml，内容如下：

```javascript
# 指定了使用的Kubernetes API版本
apiVersion: apps/v1
# 指定了要创建的Kubernetes资源类型，这里是StatefulSet，表示要创建一个有状态的副本集
kind: StatefulSet
# 包含关于StatefulSet的元数据信息，如名称等
metadata:
 # 指定StatefulSet的名称为mariadb
 name: mariadb
 # 指定了 Statefulset 的标签
 labels:
   app: mariadb
# 指定StatefulSet的规格，包括副本数量、选择器、Pod模板等信息
spec:
 # 指定了要创建的Pod副本数量为1
 replicas: 1
 # 指定了用于选择Pod的标签
 selector:
   matchLabels:
     app: mariadb
 # 指定了要创建的Pod的模板信息
 template:
   # 指定了Pod的元数据信息，包括标签等
   metadata:
     # 指定了Pod的标签
     labels:
       app: mariadb
   # 指定了Pod的规格，包括容器、端口、存储卷挂载、环境变量等信息
   spec:
     # 指定了Pod中的容器信息
     containers:
     # 指定了容器的名称为mariadb
     - name: mariadb
       # 指定了要使用的镜像为mariadb:11.2.2
       image: mariadb:11.2.2
       # 指定了容器需要暴露的端口
       ports:
       - containerPort: 3306
         name: mariadb
       # 指定了要挂载的存储卷信息
       volumeMounts:
       # 指定了要挂载的存储卷的名称为mariadb-persistent-storage
       - name: mariadb-persistent-storage
         # 指定了存储卷在容器中的挂载路径
         mountPath: /var/lib/mysql
       # 指定了容器的环境变量
       env:
       - name: MYSQL_ROOT_PASSWORD
         value: "onex(#)666"
       - name: MYSQL_DATABASE
         value: "onex"
       - name: MYSQL_USER
         value: "onex"
       - name: MYSQL_PASSWORD
         value: "onex(#)666"
 # 指定了要创建的持久化存储卷模板信息
 volumeClaimTemplates:
 # 指定了存储卷模板的元数据信息
 - metadata:
     # 指定了存储卷模板的名称
     name: mariadb-persistent-storage
   # 指定了存储卷的规格信息，包括访问模式和资源请求等
   spec:
     # 指定了存储卷的访问模式为"ReadWriteOnce"，表示可以被单个节点挂载为读写模式
     accessModes: [ "ReadWriteOnce" ]
     # 指定了存储卷的资源请求信息
     resources:
       # 指定了存储卷的请求资源
       requests:
         # 指定了存储卷的容量为1GB
         storage: 1Gi
```

然后，创建 Service 资源的资源定义文件为：service.yaml，内容如下：

```bash
# 指定了使用的Kubernetes API版本，这里是v1，表示使用了核心API的v1版本
apiVersion: v1
# 指定了要创建的Kubernetes资源类型，这里是Service，表示要创建一个服务
kind: Service
metadata:
 # 指定了服务名
 name: mariadb
 # 指定了 Service 的标签
 labels:
   app: mariadb
# 指定Service的规格，包括服务类型、选择器、端口等信息
spec:
 # 指定了Service的类型为NodePort，表示将会为该服务在每个节点上分配一个端口，通过该端口可以访
 type: NodePort
 # 指定了用于选择后端Pod的标签
 selector:
   app: mariadb
 # 指定了Service需要暴露的端口信息
 ports:
   # 指定了端口的协议为TCP
   - protocol: TCP
     # 指定了Service监听的端口为3306
     port: 3306
     # 指定了要转发到的后端Pod的端口为3306
     targetPort: 3306
     # 指定了分配给Service的节点端口号为30000，表示可以通过节点的IP地址和该端口号来访问Serv
     nodePort: 30000
部署完成后，Kubernetes 新建的 mariadb 资源如下：
$ kubectl -n infra get statefulset -l app=mariadb
NAME      READY   AGE
mariadb   1/1     4h44m
$ kubectl -n infra get pods -l app=mariadb
NAME        READY   STATUS    RESTARTS   AGE
mariadb-0   1/1     Running   0          4h40m
$ kubectl -n infra get service -l app=mariadb
NAME      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
mariadb   NodePort   10.98.235.114   <none>        3306:30000/TCP   44s
在 kubectl get statefulset -l app=mariadb 命令中，-l 参数是标签选择器，用于
```

获取具有特定标签的资源。

部署完成之后，我们可以使用以下命令来验证是否安装成功：

```
$ mariadb -h 127.0.0.1 -P 30000 -uroot -p'onex(#)666'
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| onex               |
| performance_schema |
| sys                |
+--------------------+
如果命令成功执行，并且 MariaDB 中有 onex 数据库，说明 MariaDB 部署成功。这里你可能
会问，MariaDB 的访问端口是 3306，为什么访问的却是 30000？这个问题后面会解释，我
```

们先把存储组件部署完。

Redis、etcd、MongoDB 的部署方式跟 MariaDB 是类似的，后面会简单介绍部署的指令，不再详述类似的内容。

### Redis 安装和配置

Redis 的具体安装步骤如下：

```
$ kubectl -n infra apply -f manifests/installation/storage/redis
```

安装完成之后，可以使用以下命令来验证是否安装成功：

```
$ redis-cli -h 127.0.0.1 -p 30001 -a 'onex(#)666'
```

如果命令成功执行，说明 Redis 部署成功。

### etcd 安装和配置

etcd 的具体安装步骤如下：

```
$ kubectl -n infra apply -f manifests/installation/storage/etcd
```

安装完成之后，可以使用以下命令来验证是否安装成功：

```
$ etcdctl --endpoints=127.0.0.1:30002  member list
```

如果命令成功执行，说明 etcd 部署成功。

### MongoDB 安装和配置

MongoDB 的具体安装步骤如下：

```
$ kubectl create secret generic mongo --from-literal=MONGO_INITDB_ROOT_USERNAME=r
$ kubectl -n infra apply -f manifests/installation/storage/mongo
```

安装完成之后，可以使用以下命令来验证是否安装成功：

```
$ mongosh mongodb://127.0.0.1:30004
Current Mongosh Log ID:        65cc6e89ecfe1e93f6d18b83
Connecting to:                mongodb://127.0.0.1:30004/?directConnection=true&se
Using MongoDB:                7.0.3
Using Mongosh:                2.1.3
For mongosh info see: https://docs.mongodb.com/mongodb-shell/
test>
```

如果命令成功执行，说明 MongoDB 部署成功。

## 服务网络访问路径

在部署存储服务的时候你会发现，我们在宿主机上访问的服务端口并不是服务的端口，例如

```
3306、6379、2379、27017 这些端口，而是 3000X 端口，这是为什么呢？
```

接下来，我就以访问 MariaDB 的网络访问路径为例，来给你详细介绍下：

```
$ mariadb -h 127.0.0.1 -P 30000 -uroot -p'onex(#)666'
```

我们在宿主机上部署了一个 Kubernetes 集群，集群中包含了 4 个 Node 节点：

```
$ kubectl get nodes
NAME                 STATUS   ROLES           AGE     VERSION
onex-control-plane   Ready    control-plane   5h26m   v1.28.0
onex-worker          Ready    <none>          5h26m   v1.28.0
onex-worker2         Ready    <none>          5h26m   v1.28.0
onex-worker3         Ready    <none>          5h26m   v1.28.0
```

这 4 个 Node 节点其实是一个容器，在宿主机上执行以下命令可以验证：

```
$ docker ps|egrep 'onex-[cw]'
44cacbcfd432   kindest/node:v1.28.0   "/usr/local/bin/entr…"   5 hours ago   Up 5
2bf6cc9606ec   kindest/node:v1.28.0   "/usr/local/bin/entr…"   5 hours ago   Up 5
0a47365ccbe7   kindest/node:v1.28.0   "/usr/local/bin/entr…"   5 hours ago   Up 5
acbd941c3a8d   kindest/node:v1.28.0   "/usr/local/bin/entr…"   5 hours ago   Up 5
在 Kubernetes 节点上，其实就是容器中，我们创建了一个名为 mariadb-0 的 Kubernetes
```

Pod，执行以下命令可以验证：

```
$ docker exec -it onex-worker3 bash
root@onex-worker3:/# crictl pods|grep mariadb
eb2572a60fb18       5 hours ago         Ready               mariadb-0           i
在上述命令中，首先通过执行 docker exec -it onex-worker3 bash 登录到名为
onex-worker3 的 Kubernetes Node 中，接着在 Kubernetes Node 中执行 crictl ps
|grep mariadb，查看已创建的名为 mariadb-0 的 Kubernetes Pod。
```

总的来说，如果想访问 Kubernetes Pod 中的服务，具体的网络访问路径是从宿主机到 Node容器，再到 Pod 容器。具体的网络访问路径图如下：

![](images/14/1.png)

```
首先，访问宿主机上的 30000 端口，宿主机的 30000 端口会将流量转发到 Kubernetes
Node 容器中的 30000 端口，Kubernetes Node 容器中的 30000 端口，再将流量转发到
Kubernetes Pod 容器的 3306 端口。
```

那么，这些端口是何时开启监听的呢？首先，我们启动了一个 Kubernetes Pod 容器，容器中

```
运行了 mariadbd 进程，mariadbd 进程会监听 Kubernetes Pod 容器中的 3306 端口。接
着，我们创建了名为 mariadb NodePort 类型的 Service，其定义如下：
```

```bash
apiVersion: v1
kind: Service
metadata:
 name: mariadb
 labels:
   app: mariadb
spec:
 type: NodePort
 selector:
   app: mariadb
 ports:
   - protocol: TCP
     port: 3306
     targetPort: 3306
     nodePort: 30000
通过上述 Service 资源，我们在每个 Kubernetes Node 容器中，启动了一个 30000 端口，该
端口会映射到该 Node 容器中部署的 3306 端口。在我们创建 Kind 集群时，kind-
onex.yaml 文件中，有以下一段配置：
nodes:
 extraPortMappings:
 - containerPort: 30000 # MariaDB 3306
   hostPort: 30000
   listenAddress: "0.0.0.0"
   protocol: TCP
kind 工具会根据上述配置，在宿主机上开启一个 30000 端口，该端口用来映射 Kubernetes
Node 容器中的 30000 端口。其他 Kubernetes Node 容器端口和宿主机端口映射，具体可以
查看 kind-onex.yaml 文件。
```

至此，建立了以下端口映射关系：

![](images/14/2.png)

```
这样，我们就可以通过访问宿主机上的 30000 端口，来访问 Kubernetes Pod 容器中
MariaDB 的 3306 端口。
kind-onex.yaml 文件中定义了需要的存储服务和中间件服务的端口映射，具体内容你可以
```

看看我给出的表格：

![](images/14/3.png)

## 中间件安装

部署完存储服务，OneX 组件还依赖 Jaeger 和 Kafka 2 个中间件来实现调用链追踪和消息转存的功能。所以，我们还需要部署这 2 个组件。

首先我们来安装 Jaeger 中间件，具体的安装步骤如下：

```
$ kubectl -n infra apply -f manifests/installation/middleware/jaeger
```

安装完成之后，可以使用以下命令来验证是否安装成功：

```
$ telnet 127.0.0.1 30005
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
```

```
如果端口 30005 能 telnet 通，说明安装成功。然后，我们来安装 Kafka，具体安装步骤如
```

下：

```
$ kubectl -n infra apply -f manifests/installation/middleware/kafka
```

安装完成之后，可以使用以下命令来验证是否安装成功：

```
$ telnet 127.0.0.1 30006
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
如果端口 30006 能 telnet 通，说明安装成功。
```

## 安装 Traefik

如果想从集群外访问集群内部的服务，还需要安装一个 Ingress。社区有多重 Ingress 实现方案，例如 Nginx、Haproxy、Traefik 等。我们选择使用 Traefik 作为 Kubernetes 集群的Ingress 选型，所以在部署 OneX 组件前，还需要在集群中安装 Traefik。

Traefik 安装配置比较复杂，官方提供了 Helm 的安装方式，那这里我也选择使用 Helm 来安装 Traefik。具体安装步骤如下：

1. 安装 Helm 命令行工具

2. 安装 Traefik

3. 访问 Traefik dashbaord

4. 测试 Traefik

接下来我们详细说说每一步都是怎么操作的。

### 1. 安装 Helm 命令行工具

你可以执行以下命令来快捷安装 Helm ：

```
$ make tools.install.helm
```

### 2. 安装 Traefik

Traefik 的安装命令如下：

```sql
$ helm repo add traefik https://traefik.github.io/charts
$ helm repo update
$ helm install traefik traefik/traefik --version 26.0.0 --namespace kube-system -
$ kubectl -n kube-system get pods|grep traefik # 检查 traefik pod 处于 Running 状态
traefik-b7cd5d5df-m74bg                      1/1     Running   0          46s
traefik-values.yaml 配置解析：
asDefault： 如果一个服务没有明确指定入口点，那么启用此入口点作为默认入口点。
port： traefik 后端服务监听的端口。
hostPort： hostPort 是将 Pod 的端口映射到宿主机上。
hostIP： traefik 后端服务监听端口。
expose: 将入口点公开到外部网络。
exposedPort： Kubernetes 集群中 traefik 服务的端口。
nodePort： nodePort 是将 service 的端口映射到集群中的每个宿主机上。
```

### 3. 访问 Traefik dashbaord

在宿主机和 Traefik Kubernetes Pod 之间建立端口转发，命令如下：

```
$ kubectl port-forward -n kube-system --address 0.0.0.0 $(kubectl get pods -n kub
```

然后我们打开浏览器，访问 http://127.0.0.1:7000/dashboard/ 即可，控制台截图如下：

![](images/14/4.png)

该控制台可以进行一些简单的配置和流量观测。

### 4. 测试 Traefik

这里，我们使用一个测试 Pod ，来测试下 Traefik 是否被成功部署。创建测试 Pod 的命令如下：

```
$ kubectl apply -f ${ONEX_ROOT}/manifests/installation/traefik/whoami.yaml
```

- 提示：这里使用的是官网的测试用例：https://doc.traefik.io/traefik-enterprise/installing/kubernetes/teectl/#deploying-an-ingress-test-service

部署好测试程序之后，可以执行以下命令来测试是否能够从集群外访问集群内的服务：

```
$ curl -H "Host: whoami.com" http://127.0.0.1:18080
Hostname: whoami-5dbbfd8f55-sw8ts
IP: 127.0.0.1
IP: ::1
IP: 10.244.2.8
IP: fe80::e833:85ff:fe74:ed6
RemoteAddr: 10.244.2.6:48228
GET / HTTP/1.1
Host: whoami.com
User-Agent: curl/7.64.0
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 172.17.0.5
X-Forwarded-Host: whoami.com
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: traefik-b7cd5d5df-m74bg
X-Real-Ip: 172.17.0.5
```

上述命令成功执行，说明 Traefik 部署成功。

- 提示：这里的 18080 端口是在 kind-onex.yaml 文件中配置的。

从集群内的 Pod 中访问 whoami Pod：

```
$ kubectl -n default exec -it pod/client -- curl whoami
Hostname: whoami-5dbbfd8f55-sw8ts
IP: 127.0.0.1
IP: ::1
IP: 10.244.2.8
IP: fe80::e833:85ff:fe74:ed6
RemoteAddr: 10.244.1.9:43934
GET / HTTP/1.1
Host: whoami
User-Agent: curl/7.64.0
Accept: */*
```

这里要注意，要在 Traefik deployment args 中添加以下参数：

```
- --serversTransport.insecureSkipVerify=true
```

否则会出现以下错误：

```
500 Internal Server Error' caused by: tls: failed to verify certificate: x509: ce
```

## 安装 OneX 组件

上面，我们安装完了 OneX 组件依赖的存储服务和中间件服务，接下来就可以部署 OneX 组件了。

### 初始化数据库

首先，我们需要初始化用到的数据库，也就是要初始化 MariaDB 和 MongoDB。

### MariaDB 初始化

首先是初始化 MariaDB。

第一步，创建具有普通权限的 MariaDB 用户，命令如下：

```
$ mariadb -h127.0.0.1 -P30000 -u"root" -p"onex(#)666" << EOF
GRANT ALL PRIVILEGES ON *.* TO onex@'%' identified by "onex(#)666";
FLUSH PRIVILEGES;
EOF
```

第二步，执行以下命令，初始化 MariaDB 表：

```sql
$ mariadb -h127.0.0.1 -P30000 -u"root" -p"onex(#)666" << 'EOF'
source configs/onex.sql;
use onex;
INSERT INTO `uc_user` VALUES (0,'user-admin','admin',1,'admin','$2a$10$KeHjeGtHOu
EOF
```

上述命令会初始化 OneX 表，并在 uc_user 表中创建一个默认的 admin 用户，其用户 ID 为user-admin，具体信息你可以登录数据库查看：

```
$ mariadb -h localhost -P 30000 -uonex -p'onex(#)666'
MariaDB [(none)]> use onex;
MariaDB [onex]> show tables;
+----------------+
| Tables_in_onex |
+----------------+
| api_chain      |
| api_miner      |
| api_minerset   |
| casbin_rule    |
| fs_order       |
| order          |
| roles          |
| routers        |
| uc_secret      |
| uc_user        |
+----------------+
```

### MongoDB 初始化

因为在安装 MongoDB 时，创建的 admin 用户具有 MongoDB 的 root 权限，权限过大安全性会降低。为了提高安全性，我们还需要创建一个 OneX 普通用户来连接和操作 MongoDB。创建命令如下：

```
$ encoded=$(echo -n "onex(#)666"|jq -sRr @uri)
$ mongosh --quiet mongodb://root:${encoded}@127.0.0.1:30004/onex?authSource=admin
db.createUser({user:"onex",pwd:"onex(#)666",roles:["dbOwner"]})
db.auth("onex", "onex(#)666")
quit;
EOF
```

在 MongoDB 连接字符串中，如果密码中包含特殊字符（如 @、/ 等），需要对其进行转义，比如 # 的 URL 编码为 %23，我们可以使用 URL 编码 / 解码 工具进行转义，也可以使用以下命令来转义：

```
encoded=$(echo -n "${ONEX_MONGO_ADMIN_PASSWORD}"|jq -sRr @uri)
```

mongodb://root:‘onex(%23)666’@127.0.0.1:27017/onex?authSource=admin 各部分含义如下：

- mongodb://：指示使用 MongoDB 协议连接。

- root:‘onex(#)666’：这是用于身份验证的用户名和密码。在这种情况下，用户名是 root，密码是 onex(#)666。请注意，密码中的特殊字符 # 在 URL 中需要进行 URL 编码，因此被替换为 %23。

- 127.0.0.1:30004：这是 MongoDB 服务器的主机和端口。在这种情况下，MongoDB 服务器位于本地主机（即 127.0.0.1）的 30004 端口上。

- OneX：这是要连接的数据库的名称。在这种情况下，数据库名称是 OneX。

- authSource=onex：这是指定身份验证数据库的选项。在这种情况下，身份验证数据库也是OneX。

创建完 OneX 普通用户后，我们就可以通过 OneX 用户登录 MongoDB 了：

```
$ mongosh --quiet mongodb://onex:'onex(%23)666'@127.0.0.1:30004/onex?authSource=o
```

### 安装前准备

在部署 OneX 组件前，除了需要初始化数据库外，还需要进行以下前置操作：

- 创建部署用的文件

- 创建共用的 Kubernetes 资源

- 配置 Linux hosts 文件

接下来我们详细说说每一步的具体操作。

首先，创建部署用的文件：

```
# 设置一些环境变量
$ cd ${ONEX_ROOT} # 后续操作都需要在 ${ONEX_ROOT} 目录下进行
$ source manifests/env.k8s
# 生成构建Dockerfile需要的构建产物
$ ./scripts/installation/onex.sh onex::onex::build_artifacts
$ save_dir=$HOME/onex-save.$(date +%F)
$ mkdir -p ${save_dir}
$ cp -a _output/{appconfig,cert,config} ${save_dir}
```

OneX 所有的组件都会创建在 onex 命名空间中，所以服务的名字和容器名，就没必要起名为onex-xxx 这样的名字。同时，kakfa 容器启动时，如果发现有名为 kafka 的 kubernetesservice 会 crash，所以 kafka service 名字叫 onex-kafka。

另外，我们最好将构建产物备份一下，这样当我们将 _output 目录清理后，仍然可以获取到访问 OneX 组件的配置和 CA 证书等文件。

然后创建共用的 Kubernetes 资源：

```
# 创建密钥。这些密钥会被挂载到 OneX 项目中各个组件中，加载使用
$ kubectl -n onex create secret generic onex-tls --from-file=_output/cert
# 创建 onex configmap，onex configmap 中会包含一些 OneX 组件都会用到的配置，例如：config。
$ kubectl -n onex create configmap onex --from-file=_output/config
```

最后，配置 Linux hosts 文件：

```
$ sudo tee -a /etc/hosts <<'EOF'
# host configs for onex project
127.0.0.1 onex.usercenter.superproj.com
127.0.0.1 onex.gateway.superproj.com
127.0.0.1 onex.apiserver.superproj.com
127.0.0.1 onex.controllermanager.superproj.com
127.0.0.1 onex.nightwatch.superproj.com
127.0.0.1 onex.miner.superproj.com
127.0.0.1 onex.minerset.superproj.com
127.0.0.1 onex.toyblc.superproj.com
127.0.0.1 onex.fakeserver.superproj.com
127.0.0.1 onex.cacheserver.superproj.com
EOF
```

如果上述域名已经配置过，可以不用再配置。

### 构建 OneX 组件

接下来，我们还需要构建 OneX 镜像，并将镜像导入到 Kind 集群中，命令如下：

```
# OneX 项目仓库中，包含了创建 OneX 组件需要的 Kubernetes 资源定义文件，文件中使用的镜像 Tag
# 所以，这里我们要指定镜像 Tag 为 v0.1.0
$ mksuger.sh -i --load -v v0.1.0
```

上面，我使用了一个封装的脚本，来创建 OneX 组件镜像，并将镜像导入到 OneX 集群节点中。如果你想构建某个组件的镜像，并导入到 OneX 集群节点中，你可以执行以下命令：

```
# 1. 先构建 onex-usercenter 镜像
$ make image IMAGES=onex-usercenter VERSION=v0.1.0
# 2. 将镜像导入到集群节点中
$ kind load docker-image -n onex ccr.ccs.tencentyun.com/superproj/onex-usercenter
```

kind load docker-image 提供的其他有用参数为：

- -n, --name string：集群上下文名称（默认为 kind）。

- –nodes strings：要加载镜像的节点的逗号分隔列表，默认为所有 Node，例如：

```
$ kind load docker-image --name onex --nodes onex-worker,onex-worker2 ccr.ccs.ten
```

- 官方文档：Loading an Image Into Your Cluster

### 安装 OneX 各组件

上面我们创建了需要的部署文件，并安装了依赖的存储和中间件服务。接下来，我们就可以在Kubernetes 集群中部署 OneX 组件。我们根据组件依赖顺序，依次部署 OneX 组件：

1. onex-usercenter

2. onex-apiserver

3. onex-gateway

4. onex-nightwatch

5. onex-pump

6. onex-toyblc

7. onex-controller-manager

8. onex-minerset-controller

9. onex-miner-controller

10. onexctl

接下来我会列出每个组件的安装命令，以及测试是否部署成功的命令，你可以跟着我一起操作。

1. 安装 onex-usercenter 组件，命令如下：

```
$ kubectl -n onex create configmap onex-usercenter --from-file _output/appconfig/
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-usercenter
```

测试是否部署成功：

```
$ curl -H "Host: onex.usercenter.superproj.com" http://127.0.0.1:18080/metrics
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collecti
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 2.3698e-05
go_gc_duration_seconds{quantile="0.25"} 7.0796e-05
go_gc_duration_seconds{quantile="0.5"} 9.9051e-05
go_gc_duration_seconds{quantile="0.75"} 0.000146083
go_gc_duration_seconds{quantile="1"} 0.000237999
go_gc_duration_seconds_sum 0.001654366
...
```

2. 安装 onex-apiserver 组件的命令如下：

```
$ kubectl -n onex create secret tls onex-apiserver --key ${ONEX_ROOT}/_output/cer
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-apiserver
```

测试是否部署成功：

```
$ mkdir -p $HOME/.onex
$ sed 's/server: .*/server: https://onex.apiserver.superproj.com:18443/g' _output
$ kubectl -s https://onex.apiserver.superproj.com:18443 --kubeconfig=$HOME/.onex/
```

为了，方便访问 zero-apiserver，这里可以将以上命令配置成 alias：

```
alias kz='kubectl --kubeconfig=$HOME/.onex/config'
```

3. 安装 onex-gateway 组件的命令如下：

```
$ kubectl -n onex create configmap onex-gateway --from-file _output/appconfig/one
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-gateway
```

测试是否部署成功：

```
$ curl -H "Host: onex.gateway.superproj.com" http://127.0.0.1:18080/metrics
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collecti
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 3.744e-05
go_gc_duration_seconds{quantile="0.25"} 4.9097e-05
go_gc_duration_seconds{quantile="0.5"} 6.7377e-05
...
```

4. 安装 onex-nightwatch 组件的命令如下：

```
$ kubectl -n onex create configmap onex-nightwatch --from-file _output/appconfig/
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-nightwatch
```

测试是否部署成功：

```
$ curl -H "Host: onex.nightwatch.superproj.com" http://127.0.0.1:18080/healthz
{"status": "ok"}
```

5. 安装 onex-pump 组件，命令如下：

```
$ kubectl -n onex create configmap onex-pump --from-file _output/appconfig/onex-p
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-pump
```

测试是否部署成功：

```
$ curl -H "Host: onex.pump.superproj.com" http://127.0.0.1:18080/healthz
{"status": "ok"}
```

6. 安装 onex-toyblc 组件，命令如下：

```
$ kubectl -n onex create configmap onex-toyblc --from-file _output/appconfig/onex
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-toyblc
```

测试是否部署成功：

```
$ curl -H "Host: onex.toyblc.superproj.com" -uonex:'onex(#)666' http://127.0.0.1:
[{"index":0,"previousHash":"0","timestamp":1465154705,"data":"genesis block","has
```

7. 安装 onex-controller-manager 组件的命令如下：

```
$ kubectl -n onex create configmap onex-controller-manager --from-file _output/ap
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-controller-manag
```

测试是否部署成功：

```
$ curl -H "Host: onex.controllermanager.superproj.com" -uonex:'onex(#)666' http:/
ok
```

8. 安装 onex-minerset-controller 组件的命令如下：

```
$ kubectl -n onex create configmap onex-minerset-controller --from-file _output/a
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-minerset-control
```

测试是否部署成功：

```
$ curl -H "Host: onex.minerset.superproj.com" -uonex:'onex(#)666' http://127.0.0.
ok
```

9. 安装 onex-miner-controller 组件，命令如下：

```
$ kubectl -n onex create configmap onex-miner-controller --from-file _output/appc
$ kubectl -n onex apply -f manifests/installation/bare/onex/onex-miner-controller
```

测试是否部署成功：

```
$ curl -H "Host: onex.miner.superproj.com" -uonex:'onex(#)666' http://127.0.0.1:1
ok
```

10. 安装 onexctl 组件，命令如下：

```
$ cp _output/appconfig/onexctl.yaml ~/.onex/
$ _output/platforms/linux/amd64/onexctl minerset list
NAME   REPLICAS   DISPLAYNAME   CREATED
```

如果执行 output/platforms/linux/amd64/onexctl minerset list 没有报错，说明 onexctl 安装成功。

现在我们安装好了 OneX 的各个组件，一共有 10 个，数量比较多，安装后你可以再检查一下。

## Kind 集群安装排障和常用操作

最后，我们再简单聊聊 Kind 集群安装过程中一些可能出现的错误如何解决，以及 Kubernetes开发过程中的一些常用操作。

如果在执行 kubectl exec 时报了.*scope/cgroup.procs: no such file or directory: unknown 错误，例如：

```
error: Internal error occurred: error executing command in container: failed to e
```

在创建集群，指定 kindest/node 镜像 TAG 时，要指定 @sha256 来指定具体的镜像版本，例如：kindest/node:v1.28.0@sha256:dad5a6238c5e41d7cac405fae3b5eda2ad1de6f1190fa8bfc64ff5bb86173213。详细可参考：Kind Release 页面的 NOTE 提示。

如果你遇到 [kubelet-check] It seems like the kubelet isn’t running or healthy. 报错，说明安装Kind 集群失败，kube-apiserver 没有启动。主要原因可能是以下几个点：

- 可能是宿主机开启了 swap。

- 可能是 kubelet 和 Docker 的 cgroup driver 不一致导致的。

- 可能是已安装的组件有 Bug，建议你优先尝试更换 Kind 的版本。

在使用 Kubernetes 开发的过程中，如果你要登录 Kind Node 进行一些操作、排障，可以使用以下命令：

```
$ docker exec -it onex-worker bash
root@zero-worker:/# crictl img
```

如果 Kubernetes Node 容器中的镜像占用了很大的空间，你可以使用以下命令来清理：

```
$ docker exec -it onex-worker bash
# ctr -n k8s.io i rm `ctr -n k8s.io i ls|awk '{print $1}'`
# crictl img ls # 虽然仍然能够看到 dangling 镜像，但是实际上宿主机硬盘空间已经被释放
```

## 课程总结

本节课我们快速在 Kubernetes 集群中部署了 OneX 项目。在真正的企业生产中，通常是使用Helm 来部署一个复杂的应用，但 Helm 封装了太多的细节，不利于我们的学习，所以我没有带你用 Helm 进行部署。不过在课程的最后，我还会使用 Helm 的方式为你展示具体的部署过程，在这之前，你也可以自己探索一下。

## 课后练习

```
我们课程中使用的 Kind 版本为 v0.19.0，你可以尝试将 Kind 升级为最新的 v0.22.0 版
```

- 本，更改 kindest/node 镜像 Tag 为v1.29.2@sha256:51a1434a5397193442f0be2a297b488b6c919ce8a3931be0ce822606ea5ca245，并重新部署 OneX 项目，看看是什么效果。

2. 请参考 onex-usercenter 组件的部署方式，部署 onex-fakeserver、onex-cacheserver 组件。

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
