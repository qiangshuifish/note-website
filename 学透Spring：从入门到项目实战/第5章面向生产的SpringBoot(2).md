# 第5章面向生产的SpringBoot(2)

## 5.3　部署 Spring Boot 应用程序

在 Spring Boot Actuator 的帮助下，我们早早地就准备好了一些手段来掌握系统在运行时的各种指标，现在就差临门一脚，让系统在服务器上跑起来了，而这也是一门学问，在这一节里就让我们一同来了解一下其中的秘诀。

### 5.3.1　可执行 Jar 及其原理

放到以前，要运行 Java EE 的应用程序需要一个应用容器，比如 JBoss 或者 Tomcat。但随着技术的发展，外置容器已经不再是必选项了，Spring Boot 可以内嵌 Tomcat、Jetty 等容器，

```
一句简单的 java -jar 命令就能让我们的工程像个普通进程一样运行起来。
```

1. 通过 Maven 打包整个工程在用 Maven 命令打包前，先来回顾一下 pom.xml 中配置的插件：

```xml
<build>
1
   <plugins>
2
       <plugin>
3
           <groupId>org.springframework.boot</groupId>
4
           <artifactId>spring-boot-maven-plugin</artifactId>
5
       </plugin>
6
   </plugins>
7
</build>
8
spring-boot-maven-plugin 会在 Maven 的打包过程中自动介入，除了生成普通的
```

- Jar 包外，还会生成一个包含所有依赖的 Fat Jar。以上一节用到的 ch5/binarytea-export 为例，打开一个终端（macOS 中的终端，对应 Windows 中的 CMD 或者 PowerShell），在工16程目录中（即 pom.xml 的目录）键入如下命令：

```
▸ mvn clean package -Dmaven.test.skip
1
随后，查看 target 目录的内容，大致会是下面这样的：
total 38712
1
-rw-r--r--  1 digitalsonic  staff    19M  2  7 22:43 binarytea-0.0.1-SNAPSHOT.j
2
-rw-r--r--  1 digitalsonic  staff   8.3K  2  7 22:43 binarytea-0.0.1-SNAPSHOT.j
3
drwxr-xr-x  5 digitalsonic  staff   160B  2  7 22:43 classes
4
drwxr-xr-x  3 digitalsonic  staff    96B  2  7 22:43 generated-sources
5
drwxr-xr-x  3 digitalsonic  staff    96B  2  7 22:43 maven-archiver
6
drwxr-xr-x  3 digitalsonic  staff    96B  2  7 22:43 maven-status
7
其中的 binarytea-0.0.1-SNAPSHOT.jar.original 是原始的 Jar 包，仅包含工程代
码编译后的内容，大小只有 8.3KB；而 binarytea-0.0.1-SNAPSHOT.jar 则有
```

- 19MB，这就是生成的可执行 Jar 包。只需简单的一条命令就能将工程运行起来：

```
▸ java -jar target/binarytea-0.0.1-SNAPSHOT.jar
1
```

2. 可执行 Jar 背后的原理

```
binarytea-0.0.1-SNAPSHOT.jar 相比 binarytea-0.0.1-
SNAPSHOT.jar.original 而言，简直就是一个庞然大物，通过 unzip 命令查看 Jar 包
```

- 内容，我们可以看到它基本由以下几部分组成：

```
META-INF，工程的元数据，例如 Maven 的描述文件与 spring.factories 文件；
```

- org/springframework/boot/loader，Spring Boot 用来引导工程启动的 Loader相关类；

- BOOT-INF/classes，工程自身的类与资源文件；

- BOOT-INF/lib，工程所依赖的各种其他 Jar 文件。

- 大概就像下面这样：

- ▸ unzip -l binarytea-0.0.1-SNAPSHOT.jarArchive: binarytea-0.0.1-SNAPSHOT.jarLength Date Time Name--------- ---------- ----- ----0 02-07-2022 22:43 META-INF/472 02-07-2022 22:43 META-INF/MANIFEST.MF103 02-07-2022 22:43 META-INF/spring.factories# 省略大量 META-INF/ 下的文件0 02-01-1980 00:00 org/0 02-01-1980 00:00 org/springframework/0 02-01-1980 00:00 org/springframework/boot/0 02-01-1980 00:00 org/springframework/boot/loader/5871 02-01-1980 00:00 org/springframework/boot/loader/ClassPathIndexFile.class# 省略大量 org/ 下的文件0 02-07-2022 22:43 BOOT-INF/0 02-07-2022 22:43 BOOT-INF/classes/

- 242 02-07-2022 22:43 BOOT-INF/classes/application.properties0 02-07-2022 22:43 BOOT-INF/classes/learning/0 02-07-2022 22:43 BOOT-INF/classes/learning/spring/# 省略大量 BOOT-INF/classes/ 下的文件0 02-07-2022 22:43 BOOT-INF/lib/1423985 01-20-2022 14:03 BOOT-INF/lib/spring-boot-2.6.3.jar1627754 01-20-2022 14:02 BOOT-INF/lib/spring-boot-autoconfigure-2.6.3.jar# 省略大量 BOOT-INF/lib/ 下的文件--------- -------19930105 141 files

```
运行这个 Jar 所需要的信息都记录在了 META-INF/MANIFEST.MF 中，具体内容如下所
```

- 示：

```
Manifest-Version: 1.0
1
Created-By: Maven JAR Plugin 3.2.2
2
Build-Jdk-Spec: 11
3
Implementation-Title: BinaryTea
4
Implementation-Version: 0.0.1-SNAPSHOT
5
Main-Class: org.springframework.boot.loader.JarLauncher
6
Start-Class: learning.spring.binarytea.BinaryTeaApplication
7
Spring-Boot-Version: 2.6.3
8
Spring-Boot-Classes: BOOT-INF/classes/
9
Spring-Boot-Lib: BOOT-INF/lib/
10
Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx
11
Spring-Boot-Layers-Index: BOOT-INF/layers.idx
12
java 命令会找到 Main-Class 作为启动类，Spring Boot 提供了三种不同的
Launcher，可以从内嵌文件中加载启动所需的资源：
JarLauncher，从 Jar 包的固定位置加载内嵌资源，即 BOOT-INF/lib/；
WarLauncher，从 War 包的固定位置加载内嵌资源，分别为 WEB-INF/lib/ 和 WEB-
INF/lib-provided/；
```

- 17

```
，默认从 BOOT-INF/lib/ 加载资源，但可以通过环境变量
```

- PropertiesLauncher来指定额外的位置。

```
默认生成的工程会使用 JarLauncher 生成可执行 Jar 包，而启动后执行的具体代码则由
StartClass 指定，我们可以看到这个类就是添加了 @SpringBootApplication 注解
```

- 的类。

- 用这种方式打包有两个局限。

- Jar 文件其实就是一个 ZIP 文件，ZIP 文件可以设置压缩力度，从仅存储（不压缩）到最

```
大化压缩，在内嵌 Jar 的情况下，我们只能使用 ZipEntry.STORED，即仅存储，不压
```

- 缩的方式。

```
要获取 ClassLoader 时必须使用 Thread.getContextClassLoader()，而不能使
用 ClassLoader.getSystemClassLoader()。
```

- Spring Boot 中还有一种更激进的方式，生成可以直接在 Linux 中运行的 Jar 文件，不再需

```xml
要 java -jar 命令（当然，这个文件中不包含 JRE），具体修改 spring-boot-maven-
plugin 配置的方式如下：
<build>
1
   <plugins>
2
       <plugin>
3
           <groupId>org.springframework.boot</groupId>
4
           <artifactId>spring-boot-maven-plugin</artifactId>
5
           <configuration>
6
               <executable>true</executable>
7
           </configuration>
8
       </plugin>
9
   </plugins>
10
</build>
11
这样通过 mvn package 打出的 Jar 包会更特殊一些，用文本编辑器或者 less 命令查看
```

- 这个文件，我们会发现这个文件的头部其实是个 Shell 脚本，后面才是压缩的 Jar 包内容。这背后的“魔法”正是利用了 Shell 脚本是从前往后解析，而 Jar 文件则是从后往前解析的特性。

```
现在要运行这个文件只需简单的 ./target/binarytea-0.0.1-SNAPSHOT.jar 就可以
了。对应的一些类似 JVM 参数和运行的参数，可以放在同名的 .conf 配置文件中，一些
```

- 基本的执行配置项见表 5-12。

- 表 5-12　一些基本的执行配置项

- 配置项说明

- `.conf` 文件的目录位置，因为要靠它加载配置文件，所以这个参`CONF_FOLDER`数必须放在环境变量里

```
这样一来就可以把这个 Jar 文件放在 init.d 或 systemd 里运行了，但不得不说，相比 java
-jar，这种用法还是很少见的。此外，更新的技术出现了，不仅能代替这种方式，而且还
```

- 18带来了更好的体验，这就是 GraalVM。GraalVM 能把 Java 程序编译为 Linux 二进制，系统启动速度更快，所占内存更小。

### 5.3.2　构建启动代码

```
在之前的例子中我们已经多次看到过带有 @SpringBootApplication 注解的主类，其中用
SpringApplication.run() 方法来运行我们的代码。Spring Boot 为我们预留了很多自定
```

义工程启动的扩展点，比如可以设置启动的各种参数，能针对失败进行各种处理、还能定制自己的 Banner 栏等。

1. 自定义 SpringApplication

```
通过 Spring Initializr 生成的工程，其中的 main() 方法应该是下面这样的，它可以满足绝
```

- 大部分的需求：

```java
public static void main(String[] args) {
1
   SpringApplication.run(BinaryTeaApplication.class, args);
2
}
3
我们也完全可以自己新建一个 SpringApplication 对象，设置各种属性，例如
bannerMode 和 lazyInitialization 等，随后再调用它的 run() 方法。
```

- 当然，这样的操作略显繁琐，Spring Boot 贴心地提供了一个

```
SpringApplicationBuilder 构造器，通过它我们可以流畅地编写类似代码示例 5-10
```

- 19这样的代码。

```java
代码示例 5-10　通过 SpringApplicationBuilder 启动应用程序
public static void main(String[] args) {
1
   new SpringApplicationBuilder()
2
       .sources(BinaryTeaApplication.class)
3
       .main(BinaryTeaApplication.class)
4
       .bannerMode(Banner.Mode.OFF)
5
       .web(WebApplicationType.SERVLET)
6
       .run(args);
7
}
8
上面的一些设置代码，也可以改用配置文件的方式，在 application.properties 或
application.yml 里进行设置，例如在 application.properties 里可以像下面这
```

- 样来关闭 Web 容器和 Banner 栏：

```
spring.main.web-application-type=none
1
spring.main.banner-mode=off
2
```

2. 通过 FailureAnalyzer 提供失败原因分析程序启动时，如果遇到异常就会退出，这时需要查看日志，分析原因，那有没有可能让系统自己分析原因，然后告诉我们为什么失败了呢？答案是肯定的，因为 Spring Boot 可以通过

```
FailureAnalyzer 来分析失败，并打印分析出的原因。表 5-13 罗列了一些内置的
FailureAnalyzer 实现类，Spring Boot 内置了近 20 种不同的分析器，表 5-13 里展示
```

- 的只是其中的一小部分。

- 表 5-13　Spring Boot 的部分内置 FailureAnalyzer 实现类

- `FailureAnalyzer` 实现类功能

- `BindFailureAnalyzer`提示属性绑定相关异常

- `DataSourceBeanCreationFailureAnalyzer`提示数据源创建相关异常

```
我们也可以根据实际情况，提供自己的 FailureAnalyzer 实现类。方便起见，Spring
Boot 提供了一个 AbstractFailureAnalyzer<T extends Throwable> 抽象类，其
中的泛型 T 就是要分析的异常，实现这个抽象类会更简单，框架内置的大部分实现都是基
于这个抽象类来开发的。我们以 Spring Boot 的 PortInUseFailureAnalyzer 为例，看
到传入待分析的异常是 PortInUseException 就能知道端口已经被占用了，从而直观地
```

- 提示 Web 服务器端口已被占用：

```python
class PortInUseFailureAnalyzer extends AbstractFailureAnalyzer<PortInUseExcepti
1
   @Override
2
   protected FailureAnalysis analyze(Throwable rootFailure, PortInUseException
3
       return new FailureAnalysis("Web server failed to start. Port " + cause
4
              "Identify and stop the process that's listening on port " + caus
5
              + "application to listen on another port.", cause);
6
   }
7
}
8
```

3. 自定义 Banner 栏启动程序时，默认会打出 Spring 的字样，这是由 ASCII 字符组成的图案，看起来非常的酷

```
炫。我们可以通过 spring.main.banner-mode 属性来控制 Banner 的输出方式：
Banner.Mode.OFF（属性值为 off），关闭输出；
Banner.Mode.CONSOLE（属性值为 console），输出到控制台，即标准输出
```

- STDOUT；

```
Banner.Mode.LOG（属性值为 log），输出到日志。
```

- 20如果要自定义输出的内容，可以在 CLASSPATH 中放置一个 banner.txt，也可以通过

```
spring.banner.location 指定文件位置，文件中除了 ASCII 图案，还可以写一些占位
```

- 符，例如，可以从 MANIFEST.MF 文件中获取一些信息：

```
$，对应 Implementation-Title；
$，对应 Implementation-Version；
$，同样对应 Implementation-Version，但会添加 v 前缀，再将版本放在括号内。
```

- 当然，如果还希望做得更彻底，我们可以直接写一个自己的

```
org.springframework.boot.Banner 接口实现，在其中的 printBanner() 方法里
```

- 打印 Banner。

- 茶歇时间：如何优雅地关闭系统系统有启动，自然就会有关闭的时候。如果说异常宕机时损失一个实例对整个集群的服务造成部分影响还情有可原，那常规的系统升级发布就不应该对整体服务有任何影响。在我们打算关闭系统时，可能会遇到如下的情况（不仅限于此）：系统仍在接收同步请求，例如，在处理 HTTP 请求；

- 系统仍在消费消息，例如，在消费 Kafka 消息；

- 系统有定时任务在运行，可能是分布式调度，也可能是单机的调度任务。

- 当系统处于处理中的状态时，直接关闭系统可能会影响当前的处理。为此，我们要针对性地做一些处理，例如，将当前节点从负载均衡中剔除，如果使用

```
Nginx 进行负载均衡，就调整 upstream 的配置；如果是动态发现的，就让健康检查失
败（可以使用 5.1 节中提到的 health 端点），让服务注册中心将节点下线。（在第 13
```

- 章中我们还会聊到服务的注册中心。）消息的消费要力争做到可重复消费，因为消费本身就要考虑到消息的乱序和重发等情况。如果一条消息消费到一半，进程被杀掉了，那么消息中间件会认为该消息未被正常处理，会再重新发送。当然，我们也可以做些优化，在停止进程前，不再接收新消息，针对拉（PULL）模式的客户端，不再从服务端拉取新消息，推（PUSH）模式的则不再处理新消息，等待或拒绝也不失为一个好办法。

- 对调度任务也是一样的，任务需要能够支持“重跑”，高频任务不必多说，低频任务万一被中断，需要有补偿机制，能够快速恢复。例如，分布式调度（诸如 ElasticJob 之类的调度）可以设置故障转移。

```
Spring Boot 提供了优雅关闭的能力，通过 server.shutdown=graceful 这个配置可
```

- 以开启 Web 服务器优雅关闭的支持，让系统在收到关闭信号时等待一段时间（通过

```
spring.lifecycle.timeout-per-shutdown-phase 设置），以便等待当前正在处
```

- 理的请求处理结束。但通过前面的描述，我们不难发现，仅提供这些能力并不足以在生产环境中做到无损的节点下线，还有大量的工作需要我们自己来实现。

### 5.3.3　启动后的一次性执行逻辑

在系统启动时，可能会有些初始化后需要立即执行的逻辑，也有可能这就是一个命令行程序21

- ，执行完特定逻辑后程序就该退出了。这时我们该怎么办？写一个 Bean，在它的

```java
@PostConstruct 方法中执行逻辑么？其实，在 Spring Boot 中有更好的选择。
Spring Boot 为我们提供了两个接口，分别是 ApplicationRunner 与
CommandLineRunner，它们的功能基本是相同的，只是方法的参数不同，具体如下所示：
public interface ApplicationRunner {
   void run(ApplicationArguments args) throws Exception;
}
public interface CommandLineRunner {
   void run(String... args) throws Exception;
}
CommandLineRunner 的 run(String... args) 传入的参数与 main(String...
args) 方法一样，就是命令行的所有参数。而通过 ApplicationArguments，我们可以更
方便灵活地控制命令行中的参数。如果 Spring 上下文中存在多个 ApplicationRunner 或
CommandLineRunner Bean，可以通过 @Order 注解或 Ordered 接口来指定运行的顺序。
```

接下来，让我们看个例子。

- 需求描述　有奶茶店，自然就会有顾客，每次都让顾客跑到门店找服务员点单多少有些不方便，我们需要一个程序让顾客可以自己下单。所以，为顾客开发一个程序吧。

为了方便演示，建立一个新的 Customer 工程，代表二进制奶茶店的顾客，放在 ch5/customer项目中，其详细信息如表 5-14 所示。

表 5-14　Customer 工程的详细信息

条目

- 内容

- Maven Project

项目

- Java

语言

Spring Boot 版本

- 2.6.3

```
learning.spring
```

Group

```
customer
```

Artifact

- Customer

名称

```
learning.spring.customer
```

Java 包名

- Jar

打包方式

Java 版本

- 11

- Lombok

依赖

这个项目会模拟顾客的操作，目前我们的奶茶店还没开门营业，可以让顾客选择等待奶茶店开门，还是直接离开。

- 22

```
 是一个 CommandLineRunner 的实现，它的作用是打印所有的命令行参
```

代码示例 5-11

```java
数，其中的日志输出通过 Lombok 的 @Slf4j 指定了使用 SLF4J 日志框架，无须我们自己定
义 log 成员变量。
代码示例 5-11　ArgsPrinterRunner 代码片段
@Component
@Slf4j
@Order(1)
public class ArgsPrinterRunner implements CommandLineRunner {
   @Override
   public void run(String... args) throws Exception {
       log.info("共传入了{}个参数。分别是：{}", args.length, StringUtils.arrayToComm
   }
}
代码示例 5-12 是一个 ApplicationRunner 的实现，它会根据命令行上传入的参数来决定
是否等待，如果我们通过 wait 选项设置了等待时间，则等待时间即为程序里 sleep 对应的
秒数，没有 wait 就直接结束。其中演示了几个方法：
containsOption()，是否包含指定选项（所谓选项，其形式是 -- 选项名 = 值）；
getOptionValues()，获取指定选项的值，返回的是一个 List，因为可以多次设值，
例如 --wait=5--wait=6；
```

- getNonOptionArgs()，获取非选项类型的其他参数。

```java
代码示例 5-12　WaitForOpenRunner 代码片段
@Component
@Slf4j
@Order(2)
public class WaitForOpenRunner implements ApplicationRunner {
   @Override
   public void run(ApplicationArguments args) throws Exception {
       boolean needWait = args.containsOption("wait");
       if (!needWait) {
           log.info("如果没开门，就不用等了。");
           return;
       }
       List<String> waitSeconds = args.getOptionValues("wait");
       if (!waitSeconds.isEmpty()) {
           int seconds = NumberUtils.parseNumber(waitSeconds.get(0), Integer.cla
           log.info("还没开门，先等{}秒。", seconds);
           Thread.sleep(seconds * 1000);
       }
       log.info("其他参数：{}",StringUtils.collectionToCommaDelimitedString(args.g
   }
}
使用 mvn clean package -Dmaven.test.skip 命令打包后，通过如下命令启动程序：
▸ java -jar target/customer-0.0.1-SNAPSHOT.jar --wait=3 Hello
```

运行的结果应该与下面的输出类似：

```
INFO 85578 --- [main] l.spring.customer.CustomerApplication : Started CustomerApp
seconds (JVM running for 1.482)
INFO 85578 --- [main] l.spring.customer.ArgsPrinterRunner : 共传入了2个参数。分别是：
INFO 85578 --- [main] l.spring.customer.WaitForOpenRunner : 准备等待3秒。
INFO 85578 --- [main] l.spring.customer.WaitForOpenRunner : 其他参数：Hello
程序退出时可以指定一个退出码，在 Linux 或 macOS 操作系统中，可以用 echo $? 命令看
到上一条命令的退出码。通常，退出码 0 表示正常结束，其他的退出码都表示非正常结束。
```

在 Shell 脚本中往往都会根据某条命令的退出码决定后续的动作。

```
在 Java 里，可以调用 System.exit() 退出程序，这个方法能够传入需要返回的退出码。
Spring Boot 为我们提供了 ExitCodeGenerator 接口，通过实现该接口我们可以加入自己
的逻辑来控制退出码，如果存在多个 Bean，可以和前文一样用 @Order 注解或 Ordered 接
口来控制顺序。调用 SpringApplication.exit() 方法即可获得最终计算出的退出码，把
它传入 System.exit() 就可以了。
```

作为经营者，我们当然是希望顾客来自己店里，而且如果顾客愿意等我们开门最好了，为此，

```
我们编写一个自己的 ExitCodeGenerator 实现，命令行里提供了 wait 选项则视为正常，
```

否则不正常，具体代码如代码示例 5-13 所示。

```java
代码示例 5-13　直接在 @Bean 方法中实现 ExitCodeGenerator
@SpringBootApplication
public class CustomerApplication {
   public static void main(String[] args) {
       SpringApplication.run(CustomerApplication.class, args);
   }
   /**
    * 如果命令行里给了wait选项，返回0，否则返回1
   */
   @Bean
   public ExitCodeGenerator waitExitCodeGenerator(ApplicationArguments args) {
       return () -> (args.containsOption("wait") ? 0 : 1);
   }
}
```

框架会自动把上下文中的 ApplicationArguments 作为参数传入 waitExitCodeGenerator()，这里取到的值和我们在 ApplicationRunner 里取到的值是一样的。

```java
随后，简单调整一下 WaitForOpenRunner，在执行完日志输出后调用退出逻辑，如代码示
例 5-14 所示。SpringApplication.exit() 需要传入 ApplicationContext，因此我
们让 WaitForOpenRunner 实现 ApplicationContextAware，这里的 Setter 方法直
接通过 Lombok 的 @Setter 来实现。
代码示例 5-14　调整后的 WaitForOpenRunner 代码片段
@Component
@Slf4j
@Order(2)
public class WaitForOpenRunner implements ApplicationRunner, ApplicationContextAw
   @Setter
   private ApplicationContext applicationContext;
   @Override
   public void run(ApplicationArguments args) throws Exception {
       boolean needWait = args.containsOption("wait");
       if (!needWait) {
           log.info("如果没开门，就不用等了。");
       } else {
           List<String> waitSeconds = args.getOptionValues("wait");
           if (!waitSeconds.isEmpty()) {
               int seconds = NumberUtils.parseNumber(waitSeconds.get(0), Integer
               log.info("还没开门，先等{}秒。", seconds);
               Thread.sleep(seconds * 1000);
           }
           log.info("其他参数：{}", StringUtils.collectionToCommaDelimitedString(a
       }
       System.exit(SpringApplication.exit(applicationContext));
   }
}
现在重新打包运行我们的程序，如果命令行里没有 --wait，退出码就是 1。
```

- 茶歇时间：通过 Lombok 简化代码

```
相信只要是写过 Java 的人都会写过 Getter 和 Setter 方法，虽然绝大多数人会选择让
```

- IDE 来自动生成，但本着“懒惰是程序员的第一大美德”的理念，能不要这些代码，我们还是

```
希望就不出现这些代码。与之类似的还有简单的用于成员变量赋值的构造方法、Logger 对
```

- 象的定义语句等。23Lombok就是这样一个解放生产力的利器，它通过一系列注解消灭了上述冗长繁琐的语句。常用的一些注解如表 5-15 所示。表 5-15　常用的 Lombok 注解

注解

- 作用

```
@Getter / @Setter
自动生成成员属性的 Getter 和 Set
自动生成 toString() 方法，默认拼
@ToString
```

- 属性，也可以排除指定的属性

```
@NoArgsConstructor /
```

- 自动生成无参数的构造方法，必要参数

```
@RequiredArgsConstructor /
```

- 及包含全部参数的构造方法

```
@AllArgsConstructor
@EqualsAndHashCode
自动生成 equals() 与 hashCode(
相当于添加了 @ToString、
@Data
@EqualsAndHashCode、@Getter
@RequiredArgsConstructor 注解
```

- 提供了一个灵活的构造器，能够设置各

需要注意的是，虽然编译时没有什么特殊设置，但在 IDE 中，为了开启对 Lombok 的支持，我们需要安装对应 IDE 的 Lombok 插件，例如，IDEA 中要安装 IntelliJ Lombok plugin。

## 5.4　小结

本章我们学习了 Spring Boot 提供的面向生产环境的诸多功能，例如，Spring Boot Actuator的各种端点，如何自己定制健康检查信息。还学习了生产环境中所必不可少的度量方法，通过Micrometer 输出各种内容，帮助我们了解系统的运行情况。最后，把开发好的代码打包成了实际可以部署的 Jar 包，Spring Boot 的 Jar 包可以直接执行，我们对这背后的原理也做了说

```
明。除此之外，还聊了聊怎么编写用来启动整个工程的 SpringAppliation 代码，控制整
```

个启动和运行的逻辑。

在代码示例中，我们第一次引入了 Lombok，它可以在很大程度上简化我们的代码，在日常工作中也强烈建议大家使用。

全书的第一部分到此就告一段落了，我们学习了 Spring Framework 与 Spring Boot 的一些基础知识和用法，从下一章开始，我们将进入新的环节，编写与数据库交互的系统。

- 二进制奶茶店项目开发进度本章我们为二进制奶茶店的程序增加了一些面向生产环境的功能：添加了可在运行时了解营业情况的健康检查项和端点；

- 添加了可获得累计营收情况的监控项。

- 此外，我们还初始化了代表顾客的 Customer 工程，它目前可以接受一些命令行参数，判断是否等待店铺开门。

[16]：命令后的 代表清理目标目录， 是执行打包动作， 是为了加速打包过程，跳过测试。[17]：关于 的用法可以参考 Spring Boot 官方文档“PropertiesLauncher Features”部分的内容，本书不做详细展开了。[18]：Oracle 推出的一款高性能通用虚拟机，可以运行多种语言，它消除了语言间的隔阂，通过共享运行时增强了互操作性。官方宣

- 称，相比传统 JVM，GraalVM 的启动时间更短，占用内存更少，是微服务的理想选择。

[19]：这个例子在 ch5/binarytea-start 项目里。[20]：从 Spring Boot 3.0.0-M2 开始，Banner 不再支持图片类型，系统会忽略 banner.gif、banner.jpg 和 banner.png 文件。要定制

- 漂亮的 Banner，还是用 banner.txt 文本方式吧。

[21]：如果是纯命令行的程序，不引入 Web 相关依赖即可；如果 CLASSPATH 里存在 Web 的依赖，也可以配置 ，或者设置 的 为

- 。

[22]：这个例子在 ch5/customer 项目中。[23]：官方首页地址 。
