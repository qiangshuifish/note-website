# 33 | 环境：基于GraalVM的JVM云原生环境搭建

你好，我是康杨。

在这个时代，云计算正如早晨的太阳一般，照耀着每个现代企业。而今天，我们要探讨的GraalVM，则是伴随云原生概念而生的新星。它不仅仅是能高效执行 Java 程序的 JVM，更是一种多语言平台，能帮助我们在构建云原生应用时，实现更快启动、更小的内存占用，甚至是跨语言的即时编译能力。今天就让我们基于 GraalVM 来搭建一个 JVM 云原生环境搭建，从头开始探索这一技术的奥秘。

## 云原生与 GraalVM

GraalVM 是一个非常酷的技术，也是 Java 界的一个明星产品。每一个使用 Java 编写代码的人都希望它跑得跟闪电一样快。而这就是 GraalVM 正在做的事情，让 Java 代码运行得更快、更高效。而且，不只是 Java，其他语言也可以享受这种高速体验。下面，我们先来认识下GraalVM 的三个核心组件。

### GraalVM 核心组件

### 超级编译器：Graal 编译器

首先来说说 Graal 编译器。你写的 Java 代码在运行前需要被编译成字节码，JVM 再把字节码转换成机器能懂的语言，也就是本地代码。这个过程有点像翻译，你的代码是英文书，而机器需要的是中文版。想象一下如果你问个问题，Graal 编译器可以边听边给出答案，而不是等你说完所有话才开始翻译。而这就是 Graal 编译器动态编译的能力。

传统的 JVM 在编译时效率有点慢，而 Graal 编译器像是一位翻译高手，能够在你的程序运行时边翻译边交流，大幅提升速度，它支持 AOT 和 JIT 两种编译方式，前面第 4 讲我们详细讲解过这两种编译方式，你可以回顾一下。

Graal 编译器非常聪明，能在各种不同的电脑和操作系统上工作。无论你在 Windows 上，还是 Mac 甚至是别的平台，Graal 编译器都能确保你的程序以最优秀的状态运行。

### 语言的搭档：Truffle 框架

接下来是 Truffle 框架。Truffle 框架让 JVM 能够理解和优化多种编程语言。它使用 AST（Abstract Syntax Tree，抽象语法树）来表示程序的语法结构，并将其转化为中间表示。在运行时，Truffle 根据实际情况动态优化和编译代码，以提高执行性能。这就意味着你可以用不同的语言如 Scala、Kotlin 来写在 JVM 上运行的程序，因为 Truffle 框架能够将它们转化为JVM 能够理解和优化的形式。它的灵活性和性能优化可以让你轻松地使用不同的编程语言与JVM 进行交互。

Truffle 像是一个翻译器的翻译器，让 JVM 懂得怎么去运行这些不同的语言。如果你擅长某种语言，不必非得跳槽到 Java 才能写出高效代码。用你自己擅长的语言编写，让 Truffle 来做后面的转换工作就可以。

### 构建大师：SubstrateVM

SubstrateVM 是构建 GraalVM 剧场的幕后英雄，提供了一个稳固的基础，让整个 GraalVM 能在不同的硬件和操作系统上运行。你可以把 SubstrateVM 看作是一个特殊的 Java 运行时，它首先会启动并加载你的应用程序，接着通过调用 Graal 编译器把这个应用程序和它依赖的所有类库都编译成机器代码。这个过程会生成一个包含了应用程序和所有类库的静态链接的本地执行体，并且这个执行体可以在不需要 Java 运行时环境的情况下直接运行。

在编译过程中，SubstrateVM 会移除应用程序不会用到的代码和数据，包括未使用的类、方法和字段等，这被叫做“死代码消除”，这样可以让生成的代码更加高效，占用的内存更小。

在运行时，SubstrateVM 会创建一个轻量级的运行时环境，它包含了 Java 线程管理、垃圾收集器和一些基本的 Java 类库。这个轻量级运行时让你可以在没有 JVM 的情况下运行 Java 代码，因此可以把 SubstrateVM 生成的程序运行在任何支持的硬件和操作系统上。

SubstrateVM 就像乐高积木，让你可以根据需要组装自己的 GraalVM，不管是小玩具项目，还是大型企业级应用，SubstrateVM 都能让它稳扎稳打，运行无忧。

这就是 GraalVM 的神奇之处：一个高速、灵活、多才多艺的 Java 虚拟机。通过 Graal 编译器、Truffle 框架和 SubstrateVM 这三个超能力组件的组合，让开发者像运用自己的母语一样编程，打造出更快、更高效的应用程序。而且，这种速度和灵活性不仅限于 Java，其他编程语言也同样可以享受。

### 云原生和 GraalVM 的结合

GraalVM 可以优化云原生应用程序的性能和资源使用，它主要通过 3 种方式实现。

- 通过动态编译技术，GraalVM 可以在运行时将字节码编译成本地代码，从而提高程序的执行速度。

- GraalVM 支持多种编程语言，包括 Java、Scala、Kotlin 等，这样开发人员就可以选择最适合他们项目的编程语言。

- GraalVM 还提供了一个用于实现 JVM 语言的框架 Truffle，这使开发人员可以更轻松地编写云原生应用程序。

## 搭建 GraalVM 云原生环境

### GraalVM 安装

要在云原生环境中使用 GraalVM，我们需要搭建一个 GraalVM 环境。下面让我们从零开始搭建。

### 下载并安装 GraalVM

首先，我们需要从 GraalVM 的官方网站下载 GraalVM 的二进制文件。根据你的操作系统选择相应的版本进行下载。下载完成后，解压缩下载的文件，然后将其移动到合适的位置。

### 配置环境变量

为了能在命令行中使用 GraalVM，我们需要将其添加到环境变量中。你可以看一下具体操作。

对于 macOS 系统，在终端中执行以下命令：

```bash
export PATH=$PATH:/path/to/graalvm/bin
```

对于 Windows 系统，在命令提示符中执行以下命令：

```
set PATH=%PATH%;C:\path\to\graalvm\bin
```

### 验证安装

为了验证 GraalVM 是否安装成功，我们可以执行以下命令：

```
graalvm-version
```

如果安装成功，你将看到 GraalVM 的版本信息。

在搭建好 GraalVM 环境后，我们需要搭建一个云原生环境。下面是一个基于 GraalVM 的云原生环境搭建步骤，我们一起来看一下。

### 安装 Docker

Docker 是一个容器化技术，它能够让应用程序在不同的环境中运行，不需要重新配置环境。首先，我们需要在 GraalVM 环境中安装 Docker。根据你的操作系统选择相应的版本进行安装。下面我分别整理了在 Windows、macOS 上安装 Docker 的方法，我们一起看一下。

### Windows 系统

1. 前往 Docker 官方网站下载适用于 Windows 系统的 Docker Desktop 安装程序。

2. 下载完成后，双击运行安装程序，按照安装向导的提示进行操作。

3. 安装过程中，Docker 会要求你登录。如果你没有 Docker 账户，就注册一个。如果你已有Docker 账户，就使用你的账户登录。

4. 安装完成后，启动 Docker Desktop。

5. 在 Docker Desktop 的主界面中，单击“设置”按钮，然后选择“Docker 守护程序”选项卡。

6. 在“Docker 守护程序”选项卡中，确保“Docker 守护程序”和“Docker 注册表”的地址设置为你的主机 IP 地址。

7. 保存设置并关闭 Docker Desktop。

### macOS 系统

1. 前往 Docker 官方网站下载适用于 macOS 系统的 Docker 安装程序。

2. 下载完成后，双击运行安装程序，按照安装向导的提示进行操作。

3. 安装完成后，启动 Docker。

4. 在 Docker 命令行中，输入以下命令来验证 Docker 是否正常工作。

```bash
docker run hello-world
```

如果 Docker 工作正常，你会看到一条来自 Docker 的欢迎消息。

### 安装 Kubernetes

首先，需要确保你的电脑满足安装 Kubernetes 的环境要求。Kubernetes 支持多种操作系统，包括 Windows 和 Mac。但是，你需要确保你的系统版本满足 Kubernetes 的要求。

### Windows 系统

请确保你的 Windows 版本是 Windows 10 Pro 或 Enterprise，并且系统上安装了最新的安全补丁。

1. 下载 Kubernetes 安装文件。你可以从Kubernetes 官方网站下载最新版本的安装文件。

2. 解压安装文件。

3. 以管理员身份运行命令提示符。

4. 切换到解压后的目录。

```
运行 .\kubernetes-install.ps1命令来安装 Kubernetes 组件。
```

6. 根据提示完成安装过程。

7. 配置 Kubernetes 环境变量，将 Kubernetes 的安装目录添加到系统环境变量中。

```bash
export PATH=$PATH:C:\path\to\your\kubernetes\installation\bin
source %USERPROFILE%\AppData\Roaming\npm\etc\profile.d\kube.sh
```

8. 配置 Kubernetes 命令行工具，将 Kubernetes 命令行工具的路径添加到系统环境变量中。

### Mac 系统

先确保你的 Mac 版本是 macOS 10.12 或更高版本。

1. 安装 Homebrew，这是一个用于管理软件包的命令行工具。你可以通过运行以下命令来安装 Homebrew：

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEA
```

2. 安装 Kubernetes 组件。你可以通过运行以下命令来安装 Kubernetes 组件：

```
brew install kubernetes-cli
```

3. 安装 Kubernetes 命令行工具。你可以通过运行以下命令来安装 Kubernetes 命令行工具：

```
brew install kubectl
```

4. 安装 Kubernetes Dashboard。你可以通过运行以下命令来安装 Kubernetes Dashboard：

```
brew install kubernetes-dashboard
```

5. 配置 Kubernetes 命令行工具，将 Kubernetes 命令行工具的路径添加到系统环境变量中。

6. 配置 Kubernetes Dashboard，将 Kubernetes Dashboard 的路径添加到系统环境变量中。

## 创建 GraalVM 应用

在完成上述步骤后 ，我们可以创建一个基于 GraalVM 的云原生应用。我们一步一步操作。先创建一个名为“my-graalvm-app”的命名空间。

```bash
kubectl create namespace my-graalvm-app
```

然后创建一个名为“my-graalvm-pod”的 Pod，其中包含一个 GraalVM 运行时和一个应用程序容器。你使用下面的命令创建 Pod 配置文件：

```
apiVersion: v1
kind: Pod
metadata:
 name: my-graalvm-pod
 namespace: my-graalvm-app
spec:
 containers:
  - name: graalvm-runtime
    image: graalvm/graalvm-ce:latest
    ports:
    - containerPort: 8080
  - name: my-app
    image: my-app-image
    ports:
    - containerPort: 8081
```

使用下面这行命令应用 Pod 配置文件：

```bash
kubectl apply -f my-graalvm-pod.yaml
```

现在，你的 GraalVM 云原生环境已经搭建完成。

```
>> kubectl get pods  -n my-graalvm-app
```

![](images/33/1.png)

### 使用 GraalVM 运行应用程序

在成功创建并部署了基于 GraalVM 的应用程序后，我们可以使用 GraalVM 运行这个应用程序。我们看下具体操作。

使用 kubectl 命令获取 Pod 的 IP 地址。

```bash
kubectl get pods -n my-graalvm-app
获取 Pod 的 IP 地址后，我们可以使用 JDK 自带的jps命令查看 GraalVM 运行时和应用程序
```

容器中的进程。

如果你看到 GraalVM 运行时和应用程序容器的进程，说明你的应用程序已经在 GraalVM 环境中成功运行了。

## 重点回顾

GraalVM 为云原生应用的时代带来了一种高性能的多语言平台，让你编写的代码像丝绸一样顺滑地在各种硬件和操作系统上运转。这款革命性的 JVM 在提升启动速度、节省内存使用方面做得非常出色，它不仅支持 Java，还有 Scala、Kotlin 等语言，非常适合现代企业在构建弹性和自动管理能力极强的云原生应用时使用。而且，通过 Graal 编译器、Truffle 框架和SubstrateVM，GraalVM 能够让开发变得更灵活、高效，真正做到让你用最喜欢的语言来表达逻辑，同时又能享受极致的性能。

通过今天的介绍，我们成功搭建了一个基于 GraalVM 的云原生环境，并运行了一个简单的应用程序。在实际生产环境中，你可能需要根据具体需求对 GraalVM 进行更复杂的配置，例如，配置资源限制、设置安全性等。

## 思考题

学而不思则罔，学完这节课之后，你也来说一说 GraalVM 的核心组件有哪些？此外你可以自己动手搭建一个 GraalVM 的云原生应用，然后把自己的代码分享到评论区，如果有收获的话，也欢迎你把这节课的内容分享给需要的朋友，我们下节课再见！
