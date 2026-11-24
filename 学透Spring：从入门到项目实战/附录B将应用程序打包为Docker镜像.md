# 附录B将应用程序打包为Docker镜像

```
在 5.3 节中，我们详细介绍了 Spring Boot 应用的打包过程，打包的 Fat Jar 可以直接用 java
-jar 命令运行。但在实际生产过程中，Fat Jar 未必是最终交付物，在广泛使用 Kubernetes
```

的今天，交付一个 Docker 镜像也许会更合适一些。接下来，就让我们来了解下如何将 SpringBoot 应用打包成 Docker 镜像。

传统的打包运行就三步：

- 编写 Dockerfile

- 使用打包命令构建镜像

- 运行镜像

## B.1　编写 Dockerfile

先来看看最简单的方式，直接编写一个 Dockfile，将打包好的 Fat Jar 文件复制到镜像中，然

- 1

```
后通过 docker 命令执行构建。此处，我们仍然以第 10 章的 binarytea-jwt-auth 作为例子
```

，在项目目录中添加一个 Dockerfile 文件，具体内容如代码示例 B-1 所示。

- 代码示例 B-1　一个简单的 Dockerfile 示例

```
FROM openjdk:11
ARG JAR_FILE
COPY $ app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

在这个文件中，我们一共做了四件事：

(1) 指定了基础镜像，这里选择了 OpenJDK 11 的官方镜像；

```
(2) 声明了一个 JAR_FILE 参数，代表我们要复制到镜像中的 Jar 文件；
```

(3) 将指定的 Jar 文件复制到 app.jar；

- 2

```
(4) 指定镜像启动的入口，使用命令 java -jar /app.jar
```

- 。

这只是一个很简单的 Dockerfile，感兴趣的同学可以参考官方文档，了解更多的指令，表 B-1中罗列了一些常用的内容。

表 B-1　一些常用的 Dockerfile 指令

- 3格式

指令

- 说明

```
ARG
ARG <name>[=<default value>]
```

- 定义构建时可在命令

- 指定容器的默认执行

```
CMD
CMD ["executable","param1","param2"]
有效的 CMD 指令，如
COPY [--chown=<user>:<group>] <src>...
```

- 将文件复制到目标位

```xml
COPY
<dest>
也可以是相对于WOR
```

- 茶歇时间：如何选择基础 Java Docker 镜像在构建镜像时，需要选择基础镜像，一般公司都会维护一个内部的基础镜像，提供最基本的功能。作为一个 Java 程序，自然在运行时需要 Java 环境，通常会安装 JDK。有些场景下，出于安全考虑，也会限制只安装 JRE。在 Docker Hub 上，我们能找到不同 Java 发行版的镜像，如果没有强制要求，也可以考虑用表 B-2 中的镜像作为基础，再进行定制。例如，运行在 AWS 上，可以选择 Amazon 的Corretto；要用来跑 SAP 的服务，则可以考虑 SapMachine。表 B-2　一些不同 Java 发行版的镜像

- 镜像名称发行版供应商

- openjdkOpenJDKOracle

- amazoncorrettoCorrettoAmazon

- eclipse-temurinTemurinEclipse

- ibm-semeru-runtimesSemeruIBM

- sapmachineSapMachineSAP

- azul/zulu-openjdkZuluAzul

- 4dragonwell/dragonwellDragonwell（龙井）阿里巴巴

- konajdk/konajdkKonaJDK腾讯

- 5表中的镜像都提供了不同 Java 版本的镜像，通过 Tag 可以选择版本。此外，不少镜像

```
的标签中还有 -alpine 字样，这是基于 Alpine Linux 打包的镜像。Alpine Linux 的镜像会
```

- 比一般 Linux 要小不少，但由于它使用的是 musl C 库而不是 glibc 库，所以有些软件的运行可能会有问题。OpenJDK 中的 Portola 项目就是专门用来支持 OpenJDK 的 Alpine 移植

```
的，该项目尚处于早期阶段，还不能用于生产环境，所以建议大家慎重选择带 -alpine 字
```

- 样的标签。假设要用 Amazon Corretto 17 的版本，在 Dockerfile 中可以这样来写：

```
FROM amazoncorretto:17
1
```

- 要直接拉取镜像，则可以执行：

```bash
docker pull amazoncorretto:17
1
```

## B.2　构建并运行镜像

```
通过 Dockerfile 构建镜像的方法十分简单，直接利用 docker build 命令即可，在项目目录
```

中，执行如下命令：

```
▸ docker build --build-arg JAR_FILE=target/binarytea-0.0.1-SNAPSHOT.jar -t learni
```

命令执行后会看到类似下面的输出（如果是第一次执行，还需要等待各种镜像的下载，会花一

- 6

些时间

- ）：

```
[+] Building 0.6s (7/7) FINISHED
=> [internal] load build definition from Dockerfile
=> => transferring dockerfile: 36B
=> [internal] load .dockerignore
=> => transferring context: 2B
=> [internal] load metadata for docker.io/library/openjdk:11
=> [1/2] FROM docker.io/library/openjdk:11@sha256:33c346c637ebb17823cbeda4d4e560
c66262752dadcae559a03b090f6505a47
=> [internal] load build context
=> => transferring context: 85B
=> CACHED [2/2] COPY target/binarytea-0.0.1-SNAPSHOT.jar app.jar
=> exporting to image
=> => exporting layers
=> => writing image sha256:1ead3f3b24e24d2ab9d3dbe76b85b8c20db7574935a1b688924e7
=> => naming to learning.spring/binarytea
表 B-3 罗列了 build 命令的一些常用参数，更多信息可以查看 Docker 的官方文档。
```

表 B-3　docker build 命令的一些常用参数

参数

- 默认值说明

```
--tag 或 -t
指定镜像的名称与标签，格式是 name:tag
--file 或 -f
```

- 当前位置的 Dockerfile指定要用于构建的 Dockerfile

```
--build-arg
```

- 设置构建时使用的参数

```
--label
```

- 设置镜像的元数据

```
--quiet 或 -q
```

- 抑制构建时的输出信息

```
--no-cache
```

- 构建时不使用缓存

完成构建后，通过下面的命令就能在本地启动一个 BinaryTea 服务了：

```
▸ docker run -d -p 8080:8080 --name binarytea learning.spring/binarytea
```

## B.3　构建分层镜像

把 Fat Jar 作为一个整体打包在镜像里，意味着后续每次更新都需要完整拉取基础镜像以外的内容。但实际上，应用系统的发布更多时候只是调整了代码，对其依赖的调整相对较少，而升级 Spring 相关版本的情况就更少了。如果我们能把这些内容分成镜像中的不同层来存放，那在更新时，很有可能就只需要拉取业务代码部分。

Spring Boot 为我们提供了一个简单的分层工具 spring-boot-jarmode-layertools，它默认会将Fat Jar 展开，分成如下四层：

- dependencies，放置已正式发布的各种依赖，都在 BOOT-INF/lib 下；

- spring-boot-loader，放置 Spring Boot 启动相关的内容，都在org/springframework/boot/loader 下；

- snapshot-dependencies，放置快照版本的各种依赖，都在 BOOT-INF/lib 下；

- application，放置应用的各种类和资源，都在 META-INF 和 BOOT-INF/classes 下。

```
在 Dockerfile 中每执行一次 COPY 指令，都会新建一层，可以自己把 Fat Jar 展开复制多次，
```

有了 spring-boot-jarmode-layertools，我们可以通过它来展开 Fat Jar。通过如下命令可以展开：

```
▸ java -Djarmode=layertools -jar target/binarytea-0.0.1-SNAPSHOT.jar extract
```

我们对 Dockerfile 稍作调整，将构建动作分成两部分，先展开 Fat Jar，然后分四层复制文件，将这个文件命名为 Dockerfile-layering，具体如代码示例 B-2 所示。

- 代码示例 B-2　Dockerfile-layering 文件内容

```
FROM openjdk:11 as builder
WORKDIR application
ARG JAR_FILE
COPY $ app.jar
RUN java -Djarmode=layertools -jar app.jar extract
FROM openjdk:11
WORKDIR application
COPY --from=builder application/dependencies/ ./
COPY --from=builder application/spring-boot-loader/ ./
COPY --from=builder application/snapshot-dependencies/ ./
COPY --from=builder application/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
该文件对应的构建命令如下（通过 -f 指定了要使用的 Dockerfile）：
▸ docker build --build-arg JAR_FILE=target/binarytea-0.0.1-SNAPSHOT.jar -f Docker
learning.spring/binarytea .
```

在运行镜像后，可以用如下命令进入运行时的容器，可以看到文件系统里的内容。连接进入容

```
器后，我们已经在 /application 目录里了，这就是 WORKDIR 指定的位置，展开后的内容全在
```

/application 目录里。

```
▸ docker run -p 8080:8080 -d --name binarytea learning.spring/binarytea
c22898aa9901cd9909dd07515d62c8256c07a7b3e951c7da25541c4a854e7613
▸ docker exec -it binarytea /bin/bash
root@c22898aa9901:/application# ls
BOOT-INF META-INF org
root@c22898aa9901:/application# ls BOOT-INF/
classes classpath.idx layers.idx lib
```

## B.4　其他打包方式

Spring Boot 还支持使用 Spring Boot Maven Plugin 的方式进行 Docker 镜像构建，无须编写Dockerfile，直接通过如下的命令就能构建出一个 Docker 镜像：

```
▸ mvn spring-boot:build-image
```

所有与镜像构建相关的配置，都可以放在 pom.xml 中 spring-boot-maven-plugin 的

```xml
<configuration/> 中。该插件会通过 Cloud Native Buildpacks 完成打包工作，在这个过
```

程中会通过网络下载很多内容，默认用的是 BellSoft 的 Liberica OpenJDK。不得不提的是在当前的网络环境下，整个的下载和构建过程可能非常的慢，而且极容易出问题。此外，该插件的自定义配置也不够灵活，可能不是构建的最佳选择。

我们也可以选择 Spotify 的 dockerfile-maven-plugin 来进行构建，它依然需要编写Dockerfile，但可以实现一些自动化的构建与发布工作，感兴趣的同学可以通过官方文档了解更多信息。

```
综合来看，编写 Dockerfile 随后通过 docker build 命令构建镜像，基本能够应付大部分场
```

景。通过持续集成设施能够将应用构建、Docker 镜像构建、镜像发布与部署等动作完整地集成到一起。

[1]：这个例子在 app2/binarytea 项目中。虽然打包 Docker 镜像并没有什么特殊要求，我们也可以用第 16 章最后的例子，但为了保

- 持附录部分的统一，还是选择了第 10 章的例子。

[2]：这里只是最简单的一条启动命令，实际的命令可以很复杂，其中需要指定各种 JVM 参数。[3]：注意，这里的格式并不完整，有的指令有多种格式，表格中只列出了其中的一种。[4]：阿里的 Dragonwell 并未官方发布在 Docker Hub 上，而是官方发布在阿里云的 Docker Registry 上，拉取镜像时需要在镜像前

- 添加前缀 。具体可参考 Dragonwell 官方文档。

[5]：截至本书编写时，阿里的 Dragonwell 和腾讯的 KonaJDK 镜像只有 Java 8 和 11 可供选择，其他的几个发行版则支持 8、11、

- 17 等不同版本。

[6]：直接从 Docker Hub 下载有时速度很慢，可以考虑配置阿里云、腾讯云或中科大的国内镜像站点。
