# 第4章从SpringFramework到SpringBoot(1)

- 本章内容为什么需要 Spring Boot

- 起步依赖的使用及实现原理

- 自动配置的使用及实现原理

- 定制自动配置及起步依赖

通过前面几个章节的介绍，相信大家已经对 Spring Framework 有了一个基本的认识，相比早期那些没有 Spring Framework 加持的项目而言，它让生产力产生了质的飞跃。但人们的追求是无止境的，这也驱动着技术的发展。开发者认为 Spring 还可以更好，于是 Spring Boot 诞生了。本章我们将一起了解一下 Spring Boot 的基础知识，还有它的两个重要功能——起步依赖与自动配置。

## 4.1　Spring Boot 基础知识

Spring Framework 提供了 IoC 容器、AOP、MVC 等众多功能，让开发者可以从烦琐的工作中抽离出来，只关注在自己的业务逻辑上。Perl 语言发明人 Larry Wal 说过一句名言：“懒惰，

- 1

是程序员的第一大美德。”

- 当我们得到了一样东西，总会想着去追求更好的。而这个更好的东

西就是 Spring Boot。有了 Spring Framework，为什么还需要搞出一个 Spring Boot？SpringBoot 又包含哪些东西呢？本节的内容将会回答这些问题。

### 4.1.1　为什么需要 Spring Boot

随着时间的推移，什么是烦琐的工作，这个定义也在发生变化。原先的参照物是 EJB 1.x 和EJB 2.x，是徒手开发的 JSP 甚至是 CGI 程序；现在，创建一个基于 Spring 的项目本身变成了一件麻烦事——无论使用 Maven 还是 Gradle，要管理清楚这一堆依赖，避免出现冲突，已经是一场灾难了，我们永远都不知道哪个包里的同名类会带来什么“惊喜”。好不容易搞定了依赖，Spring Framework 的配置又该让人抓狂了，等到 Bean 的自动扫描和自动织入稍稍安抚

- 2

了一下大家几近奔溃的内心，一大堆与业务逻辑没有太多关系的“模板”配置

- 又“补了一刀”。

当这些东西耗费的心智和开发业务逻辑相当，甚至超过业务逻辑时，开发者就该做点什么了。

就在广大开发者们快要接受这个事实，打算认命的时候，Spring 团队推出了一款代码生成器，

- 3

它就是 Spring Roo 项目

- ，官方介绍它是新一代的 Java 快速应用开发工具，在几分钟内就

能构建一个完整的 Java 应用。但现实情况是大家不太买账，Spring Roo 一直都没能成为主流，截至本书写作之时，它的最新版本还是末次修改停留在 2017 年的 2.0.0 版本。虽然Spring Roo 能帮忙生成各种代码和配置，但它们的数量并未减少。后来在笔者与 Spring 团队的 Josh Long 的一次交流过程中，他一语道破了真相，大意是：“如果一个东西可以生成出来，那为什么还要生成它呢？”

另一方面，Spring Framework 虽然解决了开发和测试的问题，但在整个系统的生命周期中，上线后的运维也占据了很大的比重，怎么样让系统具备更好的可运维性也是个重要的任务。怎么配置、怎么监控、怎么部署，都是要考虑的事情。

出于这些原因，Spring Boot 横空出世了，它解决了上面说到的各种痛点，再一次将生产力提

- 4

升了一个台阶。正如 Spring Boot 项目首页

- 上写的那样，Spring Boot 可以轻松创建独立的

生产级 Spring 应用程序，拿来就能用了。这次，Spring Boot 站到了聚光灯下，成了新的主角。

### 4.1.2　Spring Boot 的组成部分

Spring Boot 提供了大量的功能，但其本身的核心主要是以下几点：

- 起步依赖

- 自动配置Spring Boot Actuator 5

- 命令行 CLI

在实际使用时，最后那项命令行 CLI 用得相对较少，因此本书并不会介绍它。此外，Spring

- 6

Boot 同时支持 Java 与 Groovy，但在本书中，我们也不会涉及 Groovy 的内容。

1. 起步依赖起步依赖（starter dependency）的目的就是解决 4.1.1 节中提到的依赖管理难题：针对一个功能，需要引入哪些依赖、它们的版本又是什么、互相之间是否存在冲突、它们的间接依赖项之间是否存在冲突……现在我们可以把这些麻烦都交给 Spring Boot 的起步依赖来解决。

```
以我们在 1.2 节中创建的 HelloWorld 为例（即代码示例 1-1），我们只需在 Maven 的
POM 文件中引入 org.springframework.boot:spring-boot-starter-web 这个
```

- 依赖，Spring Boot 就知道我们的项目需要 Web 这个功能，它实际上为我们引入了大量相7

```
关的依赖项。通过 mvn dependency:tree 可以查看 Maven 的依赖信息
```

- ，其中就有如下的内容：

```
+- org.springframework.boot:spring-boot-starter-web:jar:2.6.3:compile
1
|  +- org.springframework.boot:spring-boot-starter:jar:2.6.3:compile
2
|  |  +- org.springframework.boot:spring-boot:jar:2.6.3:compile
3
|  |  +- org.springframework.boot:spring-boot-autoconfigure:jar:2.6.3:compile
4
|  |  +- org.springframework.boot:spring-boot-starter-logging:jar:2.6.3:compile
5
|  |  |  +- ch.qos.logback:logback-classic:jar:1.2.10:compile
6
|  |  |  |  \- ch.qos.logback:logback-core:jar:1.2.10:compile
7
|  |  |  +- org.apache.logging.log4j:log4j-to-slf4j:jar:2.17.1:compile
8
|  |  |  |  \- org.apache.logging.log4j:log4j-api:jar:2.17.1:compile
9
|  |  |  \- org.slf4j:jul-to-slf4j:jar:1.7.33:compile
10
|  |  +- jakarta.annotation:jakarta.annotation-api:jar:1.3.5:compile
11
|  |  \- org.yaml:snakeyaml:jar:1.29:compile
12
|  +- org.springframework.boot:spring-boot-starter-json:jar:2.6.3:compile
13
|  |  +- com.fasterxml.jackson.core:jackson-databind:jar:2.13.1:compile
14
|  |  |  +- com.fasterxml.jackson.core:jackson-annotations:jar:2.13.1:compile
15
|  |  |  \- com.fasterxml.jackson.core:jackson-core:jar:2.13.1:compile
16
|  |  +- com.fasterxml.jackson.datatype:jackson-datatype-jdk8:jar:2.13.1:compil
17
|  |  +- com.fasterxml.jackson.datatype:jackson-datatype-jsr310:jar:2.13.1:comp
18
|  |  \- com.fasterxml.jackson.module:jackson-module-parameter-names:jar:2.13.1
19
|  +- org.springframework.boot:spring-boot-starter-tomcat:jar:2.6.3:compile
20
|  |  +- org.apache.tomcat.embed:tomcat-embed-core:jar:9.0.56:compile
21
|  |  +- org.apache.tomcat.embed:tomcat-embed-el:jar:9.0.56:compile
22
|  |  \- org.apache.tomcat.embed:tomcat-embed-websocket:jar:9.0.56:compile
23
|  +- org.springframework:spring-web:jar:5.3.15:compile
24
|  |  \- org.springframework:spring-beans:jar:5.3.15:compile
25
|  \- org.springframework:spring-webmvc:jar:5.3.15:compile
26
|     +- org.springframework:spring-aop:jar:5.3.15:compile
27
|     +- org.springframework:spring-context:jar:5.3.15:compile
28
|     \- org.springframework:spring-expression:jar:5.3.15:compile
29
```

- 可以看到，起步依赖是以功能为单位来组织依赖的。要实现某个功能，一共需要哪些依赖，我们自己不清楚，但 Spring Boot 知道。我们会在 4.2 节详细讲解起步依赖。

2. 自动配置

```
在没有使用 Spring Boot 时，对于一个 Web 项目，我们需要配置 DispatcherServlet
```

- 来处理请求，需要配置 Jackson JSON 来处理 JSON 的序列化，需要配置 Log4j2 或者

```
Logback 来打印日志……而在 1.2 节的 HelloWorld 例子中，我们并没有配置这些东西，
Spring Boot 自己完成了所有的配置，我们只需要编写 REST 接口的逻辑就好了。
```

- 这就是 Spring Boot 的自动配置，它能根据 CLASSPATH 中存在的类判断出引入了哪些依赖，并为这些依赖提供常规的默认配置，以此来消除模板化的配置。与此同时，SpringBoot 仍然给我们留下了很大的自由度，可以对配置进行各种定制，甚至能够排除自动配置。我们会在 4.3 节详细讲解自动配置。

3. Spring Boot Actuator如果说前两项的目的是简化 Spring 项目的开发，那 Spring Boot Actuator 的目的则是提供一系列在生产环境运行时所需的特性，帮助大家监控并管理应用程序。通过 HTTP 端点或者 JMX，Spring Boot Actuator 可以实现健康检查、度量收集、审计、配置管理等功能。我们会在 5.1 节和 5.2 节详细讲解 Spring Boot Actuator。

### 4.1.3　解析 Spring Boot 工程

一个使用了 Spring Boot 的项目工程，本质上来说和只使用 Spring Framework 的工程是一样的，如果使用 Maven 来管理，那它就是个标准的 Maven 工程，大概的结构就像下面这样。

```
|-pom.xml
|-src
 |-main
   |-java
   |-resources
 |-test
   |-java
   |-resources
```

具体内容如下：

- pom.xml 中管理了整个项目的依赖和构建相关的信息；

- src/main 中是生产的 Java 代码和相关资源文件；

- src/test 中是测试的 Java 代码和相关资源文件。

如果通过 Spring Initializr 来生成工程，它还会为我们生成用来启动项目的启动类，比如

```
HelloWorld 中的 Application 类，以及测试用的 ApplicationTest 类（这是个空的
JUnit 测试类）。其中 Application 类上加了 @SpringBootApplication 注解，表示这
```

- 8

```
 会去调用这个主类的 main() 方
```

是应用的主类，在打包成可执行 Jar 包后，运行 Jar 包时法。

这里需要展开说明一下 POM 文件的内容，分为以下几个部分：

- 工程自身的 GroupId、ArtifactId 与 Version 等内容定义；

```xml
工程继承的 org.springframework.boot:spring-boot-starter-parent 定义；
<dependencies/> 依赖项定义；
<build/> 构建相关的配置定义。
org.springframework.boot:spring-boot-starter-parent 又继承了
org.springframework.boot:spring-boot-dependencies，它通过
<dependencyManagement/> 定义了大量的依赖项，有了 <dependencyManagement/>
的加持，在我们自己的工程中，只需要在 <dependencies/> 中写入依赖项的 <groupId>
和 <artifactId> 就好了，无须指定版本，有冲突的依赖项也在
<dependencyManagement/> 中排除了，无须重复排除。
在 <build/> 中的 org.springframework.boot:spring-boot-maven-plugin 在打
包时能够生成可执行 Jar 包，它也是在 org.springframework.boot:spring-boot-
starter-parent 中定义的。
在一些特殊情况下，我们的工程无法直接继承 org.springframework.boot:spring-
boot-starter-parent，这时就可能失去 Spring Boot 的很多便利之处。为此，我们需要
```

自己在 pom.xml 中做些额外的工作。

```
首先，增加 <dependencyManagement/>，导入 org.springframework.boot:spring-boot-
```

- 9

dependencies 中的依赖项

- ，这样就能利用其中定义的依赖了：

```xml
<dependencyManagement>
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-dependencies</artifactId>
           <version>2.6.3</version>
           <type>pom</type>
           <scope>import</scope>
       </dependency>
   </dependencies>
</dependencyManagement>
接着，在 <build/> 中增加 org.springframework.boot:spring-boot-maven-
plugin，这样打包时就能用上 Spring Boot 的插件，打出可执行的 Jar 包：
<build>
   <plugins>
       <plugin>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-maven-plugin</artifactId>
           <version>2.6.3</version>
           <executions>
               <execution>
                   <goals>
                       <goal>repackage</goal>
                   </goals>
               </execution>
           </executions>
       </plugin>
   </plugins>
</build>
通过上述修改，我们就能在不继承 org.springframework.boot:spring-boot-
starter-parent 的情况下继续让 Spring Boot 替我们管理依赖并构建可执行 Jar 包了。
```

## 4.2　起步依赖

在自己管理依赖时，我们要为工程引入 Web 相关的支持，需要配置一堆依赖，但我们常常会搞不清楚哪些是必需的，哪些是多余的，最后只能不管三七二十一从某个现在能跑的工程里胡乱复制一通。

有了 Spring Boot，情况就不一样了。Spring Boot 按照功能划分了很多起步依赖，大家只需要知道自己要什么功能，比如要实现 Web 功能、需要 JPA 支持等，具体引入什么依赖、分别是什么版本，都可以交给起步依赖来管理。

此外，管理依赖时不仅要避免出现 GroupId 和 ArtifactId 相同但 Version 不同的依赖，还要注

- 10

意同一个依赖项因为版本升级替换了 GroupId 或 ArtifactId 的情况。

- 对于前者 Maven 会仅

保留一个依赖，但它未必是你想要的那个，而对于后者则更糟糕，Maven 会认为这是两个不同的依赖，它们都会被保留下来。但用了 Spring Boot 的起步依赖之后，此类问题就能得到缓

- 11

解

- ，同一版本的 Spring Boot 中的各个起步依赖所引入的依赖不会产生冲突，因为官方对这

些依赖进行了严格的测试。

所以说起步依赖是帮助大家摆脱依赖管理困局的一大利器，这节就让我们来了解一下 SpringBoot 都提供了哪些起步依赖，它背后的实现原理又是什么样的。

### 4.2.1　Spring Boot 内置的起步依赖

```
Spring Boot 官方的起步依赖都遵循一样的命名规范，即都以 spring-boot-starter- 开
```

头，其他第三方的起步依赖都应该避免使用这个前缀，以免引起混淆。

- 12

Spring Boot 内置了超过 50 个不同的起步依赖

- ，表 4-1 罗列了其中 10 个常用的起步依赖。

表 4-1　一些常用的 Spring Boot 起步依赖

名称

- 描述

```
spring-boot-starter
```

- Spring Boot 的核心功能，比如自动配置、配置加

```
spring-boot-starter-actuator
```

- Spring Boot 提供的各种生产级特性

```
spring-boot-starter-aop
```

- Spring AOP 相关支持

- Spring Data JPA 相关支持，默认使用 Hibernate 作

```
spring-boot-starter-data-jpa
```

- JPA 实现

- Spring Data Redis 相关支持，默认使用 Lettuce 作

```
spring-boot-starter-data-redis
```

- Redis 客户端

```
spring-boot-starter-jdbc
```

- Spring 的 JDBC 支持

```
spring-boot-starter-logging
```

- 日志依赖，默认使用 Logback

后续大家还会接触到很多起步依赖，比如 Spring Cloud 的各种组件，也有第三方的，比如

```
MyBatis 的 mybatis-spring-boot-starter 和 Druid 的 druid-spring-boot-
starter。
```

在引入了起步依赖后，如果我们希望修改某些依赖的版本，如何操作呢？可以在 Maven 的

```xml
<properties/> 中指定对应依赖的版本。通常这种情况是想要升级某些依赖、修复安全漏
```

洞或使用新功能，但 Spring Boot 的依赖并未升级。例如，想要指定 Jackson 的版本来升级Jackson Databind，就可以像下面这样：

```xml
<properties>
   <jackson-bom.version>2.11.0</jackson-bom.version>
</properties>
具体的属性可以在 org.springframework.boot:spring-boot-dependencies 的
pom.xml 中寻找。当然，也可以再彻底一些，在项目 POM 文件的 <dependencies/> 中直
```

接引入自己所需要的依赖，同时，在引入的起步依赖中排除刚才你所加的依赖。

Spring Boot 本身也提供了一些可以互相替换的起步依赖，例如，Log4j2 可以代替 Logback，Jetty 和 Netty 可以代替 Tomcat，如代码示例 4-1 所示。

- 代码示例 4-1　用 Log4j2 代替 Logback

```xml
<dependencies>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
       <exclusions>
           <exclusion>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-logging</artifactId>
           </exclusion>
       </exclusions>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-log4j2</artifactId>
   </dependency>
</dependencies>
```

### 4.2.2　起步依赖的实现原理

如果熟悉 Maven，那么相信大家已经猜到了，起步依赖背后使用的其实就是 Maven 的传递依

- 13

赖机制

- 。看似只添加了一个依赖，但实际上通过传递依赖，我们已经引入了一堆的依赖。

```
我们可以在 Maven 的 <dependencyManagement/> 中统一定义依赖的信息，比如版本、排
除的传递依赖项等，随后在 <dependencies/> 中添加这个依赖时就不用再重复配置这些信
```

息了。起步依赖与其中定义的依赖项都是通过这种方式定义的，所以使用了起步依赖后就不用再考虑版本和应该排除哪些东西了。

```
以 2.3.0.RELEASE 版本的 org.springframework.boot:spring-boot-starter-web
```

为例，它的 POM 文件分为如下三部分：

- 起步依赖本身的描述信息

- 导入依赖管理项

- 具体依赖项

```
在 <dependencyManagement/> 中用 import 的方式导入
org.springframework.boot:spring-boot-dependencies 里配置的依赖信息，具体
```

如下所示：

```xml
<dependencyManagement>
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-dependencies</artifactId>
           <version>2.3.0.RELEASE</version>
           <type>pom</type>
           <scope>import</scope>
       </dependency>
   </dependencies>
</dependencyManagement>
随后，在 <dependencies/> 中配置具体要引入的依赖，而这些依赖所间接依赖的内容也会
```

被传递进来，具体如下所示：

```xml
<dependencies>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter</artifactId>
       <version>2.3.0.RELEASE</version>
       <scope>compile</scope>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-json</artifactId>
       <version>2.3.0.RELEASE</version>
       <scope>compile</scope>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-tomcat</artifactId>
       <version>2.3.0.RELEASE</version>
       <scope>compile</scope>
   </dependency>
   <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-web</artifactId>
       <scope>compile</scope>
   </dependency>
   <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-webmvc</artifactId>
       <scope>compile</scope>
   </dependency>
</dependencies>
```

而到了后面的版本，Spring Boot Starter 的内容变得更直接了，以 2.6.3 版本的

```xml
org.springframework.boot:spring-boot-starter-web 为例，其中去掉了
<dependencyManagement/> 的部分，所有依赖的版本信息直接硬编码写死在了
<dependencies/> 里。这两种方式对使用 Spring Boot 的开发者而言，在使用体验上并没有
```

什么差异，所以我们不用在意这些细节。

[1]：懒惰、急躁和傲慢是程序员的三大美德。原文是：Most of you are familiar with the virtues of a programmer.There are three, of

- course: laziness, impatience, and hubris.

[2]：例如，Spring 事务配置和 Spring MVC 中的各种配置。[3]：项目官方首页 。[4]：项目官方首页 。[5]：Actuator 意为执行机构，是一个机械术语，指将控制信号转换成相应动作的机构，可以理解为一个驱动或控制设施的机械装

- 置。Spring Boot Actuator 指的是它提供的一系列生产级特性。

[6]：《Spring Boot 实战》中用了两章的篇幅来介绍 Groovy、Grails 和 CLI 的内容，但这些在国内实际用到的比较少。至于为什么

- Spring Boot 会支持 Groovy，可能在技术的原因之外，也有些商业的考虑，因为 Groovy 的背后支持者也是 Pivotal，它与Spring 同属一家公司，Spring 希望能够更多地支持自家的产品也无可厚非。

[7]：如果是在 IDEA 中，也可以使用 MavenHelper 插件来查看依赖关系。

[8]：可以通过 命令来直接运行这个 Jar 包。[9]：这里导入的是 Maven 的 BOM（Bill of Materials）文件，其中管理了大量依赖。[10]：这种情况并不少见，比如 Java 字节码操作框架 ASM 的依赖就从 升级为了 ，知名的 Java 网络框架 Netty 也从 升级为了 。[11]：因为不能避免我们自己引入起步依赖以外的东西与起步依赖中的依赖项发生冲突，或者我们覆盖了起步依赖中的依赖项，对版

- 本做了升级等，都会产生新的问题，所以这里只能说是缓解。

[12]：完整的官方起步依赖列表，可以访问 GitHub（/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-

- starters）。

[13]：举个例子说明下什么是传递依赖，假设 B 依赖于 C，而 A 又依赖于 B，那么 A 无须明确声明对 C 的依赖，而是通过 B 依赖于

- C。
