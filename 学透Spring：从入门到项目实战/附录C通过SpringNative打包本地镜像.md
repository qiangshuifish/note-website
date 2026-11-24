# 附录C通过SpringNative打包本地镜像

在云原生应用越来越广泛的今天，大家对服务提出了很多新的要求。以前的服务只要跑起来，就长时间运行，启动慢一点、占用资源多一点都不是问题。在弹性伸缩，按量计费的云平台下，平时保持最小实例数，甚至 0 实例，请求到来后快速拉起一个新的服务实例，这就要求系统要能快速启动，必须是毫秒级；如果按 CPU 与内存的用量来计费，那服务占用的内存就要尽可能少，要在尽可能短的时间内达到性能峰值……

- 1

面对这些新挑战，Quarkus 和 Micronaut 这样的后起之秀

- 都能轻装上阵，直接面向云原生

应用提供支持，而运行在传统 JVM 上的 Spring 系统多少有些力不从心，好在 Spring 家族也给出了自己的解决方案——Spring Native。

## C.1　GraalVM 与 Spring Native

在开始介绍 Spring Native 之前，先让我们来了解一下 GraalVM，无论 Spring Native，还是Quarkus，都需要依托于 GraalVM 来实现一些特定的功能。

### C.1.1　GraalVM 简介

- 2

GraalVM 是 Oracle 开发的一款高性能 JDK 发行版

- ，官网上罗列了它的几个重要特性。

- 高性能，GraalVM 提供了经过优化的 Graal 编译器，这是一款 JIT（Just in Time）编译器，可以生成更快、更精简、占用资源更少的代码。

- AOT（Ahead of Time）本地镜像编译，事先把 Java 应用编译为本地镜像，做到启动迅速，无须预热就能达到性能峰值。

- 多语言支持，能够轻松地支持多种语言，不仅能为 Java 应用提速，还支持基于 JVM 的其3他语言，例如 Ruby 和 Python。

- 高级工具，提供了包含调试、监控、编译等多种工具。

GraalVM 本地镜像是个利器，虽然好处很多，但受限于其静态特性，也带来了一些不变与局限，例如：

```
无法进行动态类加载，需要在编译期间提供大量的类信息（例如 Class.forName() 和
ServiceLoader.load() 中的类），而且这些类都需要进行额外配置才能编译到镜像里；
```

- 运行过程中的反射内容，需要在编译时用配置明确下来；

- 动态代理的类信息，有一部分可以自动推断，但仍有不少情况需要事先在编译时进行配置；

```
invokedynamic 的使用会受到限制，类似 Lambda 表达式这样的内容仍能继续使用，但
```

- 在运行时会引入不确定性的功能则无法支持。

上面还只是罗列了一部分问题，在下文中，我们会用 GraalVM 来生成一个静态的本地镜像，届时大家就会看到我们在有了 Spring Native 的帮助后，仍然需要进行不少编译时配置和代码调整才能顺利让程序运行起来。总之，一切的好处都是有代价的。

### C.1.2　Spring Native 简介

Spring Framework 中大量使用了动态代理技术，尤其是 AOP 增强的部分，都是由 JDK 动态代理或者 CGLIB 代码增强来实现的。而在工程中用到的各种类库也同样存在有悖“静态”原则的地方，没有底层框架的加持，完全依靠人来进行编译期的配置将是一个巨大的工程。特别是Spring 发展了这么多年，有着复杂的生态，生态内的成员之间彼此交错，虽然 SpringFramework 从 5.3 版本开始对 GraalVM 提供了较为完整的支持，但要让一个 Spring 工程“静态化”还是很困难。

- 4

出于上述原因，Spring Native

- 项目诞生了，它的目的就是为那些想通过 GraalVM 将 Spring

应用编译为本地镜像的项目提供支持。它由多个模块构成，主要包括：

- spring-native 与 spring-native-configuration，Spring Native 的相关依赖与配置；

- spring-aot、spring-aot-test、spring-aot-maven-plugin 与 spring-aot-gradle-plugin，AOT生成相关的基础设施与插件；

- spring-native-tools，一些编译过程中会用到的工具组合。

Spring Native 为大家处理了很多繁琐的工作，而这些内容会随着实际使用的框架版本和GraalVM 版本发生变化，因此 Spring Native 的版本会与 Spring Boot（与其底层的 SpringFramework）和 GraalVM 版本强相关，以本附录中将用到的 0.11.5 为例，它与其他框架及相关内容的对应及版本关系如表 C-1 所示。

表 C-1　Spring Native 与其他框架及相关内容的对应及版本关系

内容

- 版本

Spring Native

- 0.11.5

Java

- 11 与 17

GraalVM

- 22.0.0

Spring Boot

- 2.6.7

- 5

Spring Cloud

- 2021.0.1

在 Spring Native 的帮助下，原先遥不可及的目标，变得跳一跳就能得到了。接下来，让我们

- 6

继续用第 10 章的 binarytea-jwt-auth 作为例子

- ，演示一下如何将一个相对复杂的 Spring 工7

程编译为本地镜像。

- 请注意　这里要再次强调一下，虽然有 Spring Native，但这并不代表将一个已有的 Spring项目编译为本地镜像就很容易。这个过程中不仅需要调整依赖组件的版本，还有可能要调整代码，有时还不得不放弃一些功能。如果一个工程跑得好好的，没有非用 GraalVM 本地镜像不可的理由，那还是让它维持现状吧。

## C.2　编译打包本地镜像

要将一个 Spring 项目编译打包为 GraalVM 本地镜像，整体上分为三个步骤：

(1) 前期的环境准备，主要是安装 GraalVM 相关的内容；

(2) 调整 Maven 或者 Gradle 编译打包的配置；

- 8

(3) 根据打包产物执行的情况调整代码

- 。

下面我们会详细拆解这三个步骤，仔细看看每步都要做些什么事情。

### C.2.1　准备工作

这里的准备主要是指准备编译打包的环境，也就是安装符合版本要求的 GraalVM。在 macOS下可以使用 SDKMAN，Windows 环境则从官网下载安装包即可。下面是 SDKMAN 的安装命

- 9

```
令，先用 sdk list java 找到合适的 GraalVM 版本，例如这里就是 22.0.0.2.r11-grl
```

- ，然

后执行如下命令安装：

```
▸ sdk install java 22.0.0.2.r11-grl
随后将 Java 切换到刚才安装的 GraalVM，或者直接将它作为默认的 Java 环境，然后用 gu
```

命令安装 native-image 工具。具体命令如下：

```
▸ sdk use java 22.0.0.2.r11-grl
Using java version 22.0.0.2.r11-grl in this shell.
▸ gu install native-image
Downloading: Release index file from oca.opensource.oracle.com
Downloading: Component catalog for GraalVM Enterprise Edition 22.0.0 on jdk11 fro
Downloading: Component catalog for GraalVM Enterprise Edition 22.0.0.1 on jdk11 f
Downloading: Component catalog from www.graalvm.org
Processing Component: Native Image
Downloading: Component native-image: Native Image from github.com
Installing new component: Native Image (org.graalvm.native-image, version 22.0.0.
```

### C.2.2　调整编译打包配置

现在来调整 Maven 配置。前面介绍过，我们这里使用 Spring Native 0.11.5 需要搭配 Spring

```
Boot 2.6.7，因此需要更换 <parent/> 里 spring-boot-starter-parent 的版本，将它调整为
```

2.6.7，并在依赖中增加 Spring Native 的依赖，具体如代码示例 C-1 所示。Spring Boot 2.6.7里 Jackson JSON 的版本升级到了 2.13.2，所以还需要同步调整 jackson-datatype-joda-money 和 jackson-datatype-hibernate5 的版本，此处就不再赘述了。

- 代码示例 C-1　调整 Spring Boot 版本并增加 Spring Native 依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2
   xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.or
   <modelVersion>4.0.0</modelVersion>
   <parent>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-parent</artifactId>
       <version>2.6.7</version>
       <relativePath/> <!-- lookup parent from repository -->
   </parent>
   <dependencies>
       <dependency>
           <groupId>org.springframework.experimental</groupId>
           <artifactId>spring-native</artifactId>
           <version>0.11.5</version>
       </dependency>
       <!-- 省略其他内容 -->
   </dependencies>
   <!-- 省略其他内容 -->
</project>
```

在 Maven 构建的插件部分，需要增加两个插件，具体如代码示例 C-2 所示。

- spring-aot-maven-plugin，增加 AOT 相关能力的支持。

- hibernate-enhance-maven-plugin，在工程中使用了 Hibernate，它会引入一些字节码增强，通过这个插件可以实现构建时的字节码增强，而非运行时。

- 代码示例 C-2　增加两个构建项目的插件

```xml
<build>
   <plugins>
       <plugin>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-maven-plugin</artifactId>
       </plugin>
       <plugin>
           <groupId>org.springframework.experimental</groupId>
           <artifactId>spring-aot-maven-plugin</artifactId>
           <version>0.11.5</version>
           <executions>
               <execution>
                   <id>generate</id>
                   <goals>
                       <goal>generate</goal>
                   </goals>
               </execution>
           </executions>
       </plugin>
       <plugin>
           <groupId>org.hibernate.orm.tooling</groupId>
           <artifactId>hibernate-enhance-maven-plugin</artifactId>
           <version>$</version>
           <executions>
               <execution>
                   <configuration>
                       <failOnError>true</failOnError>
                       <enableLazyInitialization>true</enableLazyInitialization>
                       <enableDirtyTracking>true</enableDirtyTracking>
                       <enableAssociationManagement>true</enableAssociationManag
                       <enableExtendedEnhancement>false</enableExtendedEnhanceme
                   </configuration>
                   <goals>
                       <goal>enhance</goal>
                   </goals>
               </execution>
           </executions>
       </plugin>
   </plugins>
</build>
```

这里用到的一些 Spring 依赖和插件可能还未发布到公共 Maven 仓库，所以我们还需要额外添加 Spring 的仓库，可以增加代码示例 C-3 中的配置。

- 代码示例 C-3　额外增加 Spring 的 Maven 仓库

```xml
<repositories>
   <repository>
       <id>spring-release</id>
       <name>Spring release</name>
       <url>https://repo.spring.io/release</url>
   </repository>
</repositories>
<pluginRepositories>
   <pluginRepository>
       <id>spring-release</id>
       <name>Spring release</name>
       <url>https://repo.spring.io/release</url>
   </pluginRepository>
</pluginRepositories>
```

最后一步，增加 GraalVM 构建本地镜像的构建动作。spring-boot-maven-plugin 本身在构建过

```
程中会创建 Fat Jar，为了加以区分，我们增加一个 nativeProfile，把 native-maven-plugin
配置在这个 Profile 里。同时，为 spring-boot-maven-plugin 配置 classifier，它的值为
exec。具体如代码示例 C-4 所示。
```

- 代码示例 C-4　增加编译本地镜像的 Maven Profile

```xml
<profiles>
   <profile>
       <id>native</id>
       <build>
           <plugins>
               <plugin>
                   <groupId>org.graalvm.buildtools</groupId>
                   <artifactId>native-maven-plugin</artifactId>
                   <version>0.9.11</version>
                   <extensions>true</extensions>
                   <executions>
                       <execution>
                           <id>build-native</id>
                           <goals>
                               <goal>build</goal>
                           </goals>
                           <phase>package</phase>
                       </execution>
                       <execution>
                           <id>test-native</id>
                           <goals>
                               <goal>test</goal>
                           </goals>
                           <phase>test</phase>
                       </execution>
                   </executions>
               </plugin>
               <!-- Avoid a clash between Spring Boot repackaging and native-mav
               <plugin>
                   <groupId>org.springframework.boot</groupId>
                   <artifactId>spring-boot-maven-plugin</artifactId>
                   <configuration>
                       <classifier>exec</classifier>
                   </configuration>
               </plugin>
           </plugins>
       </build>
       <pluginRepositories>
       <!-- 此处省略，内容同前文Spring的pluginRepositories -->
       </pluginRepositories>
   </profile>
</profiles>
完成上述 pom.xml 调整后，就能执行下面的 Maven 命令进行构建了，其中的 -P 参数指定了
```

具体使用的 Profile，这里跳过了测试。

```
▸ mvn -Pnative -DskipTests clean package
```

执行过程中，可以观察到如下输出（分为 7 个步骤，内容为部分截取）：

```
GraalVM Native Image: Generating 'binarytea' (executable)...
[1/7] Initializing...
[2/7] Performing analysis... [************]
 27,820 (94.62%) of 29,401 classes reachable
 47,951 (74.49%) of 64,373 fields reachable
145,804 (67.90%) of 214,724 methods reachable
  1,572 classes,   975 fields, and 8,529 methods registered for reflection
     69 classes,    91 fields, and    55 methods registered for JNI access
[3/7] Building universe...
[4/7] Parsing methods...      [****]
[5/7] Inlining methods...     [*****]
[6/7] Compiling methods...    [********]
[7/7] Creating image...
 59.22MB (45.37%) for code area:   95,488 compilation units
 60.22MB (46.13%) for image heap:  19,281 classes and 623,707 objects
 11.09MB ( 8.50%) for other data
130.53MB in total
Finished generating 'binarytea' in 3m 56s.
```

相比传统的 Fat Jar，本地镜像的构建可谓相当耗时，以此处使用的 BinaryTea 工程为例，在

- 10

M1 芯片 16G 内存的 MacBook Pro 上需要大概 4 分钟。

- 构建后的产物名为 binarytea，大

小在 120MB 左右，是个可执行文件。虽然构建能够成功，但构建的产物并不能正确运行，还需要根据错误提示信息进一步修改。

### C.2.3　修改代码

不出所料，BinaryTea 工程无法在不变动代码的情况下编译为正确的本地镜像，遇到的问题总结如下。

- 依赖的类库中存在动态加载类的情况，而且数量不少，Jadira UserType、JWT 和 JodaMoney 都有。

- Spring Security 中有代码使用了反射机制获取属性。

```
Java 配置类中的 @Bean 方法本来使用了 CGLIB 字节码增强，现在等于变成了
@Configuration(proxyBeanMethods=false)，配置需要调整。11
```

- 有些注解需要动态代理增强，但构建时并未正确识别，需要提供一些配置。

针对这些问题，让我们看看怎样逐一解决。

1. 解决类加载和反射问题

```java
Jadira UserType 里使用了 ServiceLoader.load() 来加载类的情况，数量多到已经不
想用 @TypeHint 来配置的地步了。考虑到我们其实只用了处理 Money 类的
PersistentMoneyMinorAmount，可以去掉 usertype.core 这个依赖，自己编写一
个简单的 UserType 类就行了，如代码示例 C-5 所示。
代码示例 C-5　处理 Money 类型转换的 Hibernate UserType 类代码片段
public class MoneyType implements UserType {
1
   @Override
2
   public int[] sqlTypes() {
3
       return new int[] { Types.BIGINT };
4
   }
5
6
   @Override
7
   public Class returnedClass() {
8
       return Money.class;
9
   }
10
11
   @Override
12
   public Object nullSafeGet(ResultSet rs, String[] names,
13
       SharedSessionContractImplementor session, Object owner) throws Hibernat
14
       Long val = rs.getLong(names[0]);
15
       return Money.ofMinor(CurrencyUnit.of("CNY"), val);
16
   }
17
18
   @Override
19
   public void nullSafeSet(PreparedStatement st, Object value, int index, Sha
20
session) throws HibernateException, SQLException {
21
       if (null == value) {
22
           st.setNull(index, Types.BIGINT);
23
       } else {
24
           st.setLong(index, ((Money) value).getAmountMinorLong());
25
       }
26
   }
27
   // 省略其他代码
28
}
29
随后，把原本配置了 PersistentMoneyMinorAmount 的地方调整为 MoneyType。以
Amount 类为例，可以改为代码示例 C-6 那样，MenuItem 类的调整也是类似的。
代码示例 C-6　使用 MoneyType 代替 PersistentMoneyMinorAmount
@Builder
1
@Data
2
@AllArgsConstructor
3
@NoArgsConstructor
4
@Embeddable
5
public class Amount {
6
   @Column(name = "amount_discount")
7
   private int discount;
8
9
   @Column(name = "amount_total")
10
   @Type(type = "learning.spring.binarytea.support.MoneyType")
11
   private Money totalAmount;
12
13
   @Column(name = "amount_pay")
14
   @Type(type = "learning.spring.binarytea.support.MoneyType")
15
   private Money payAmount;
16
}
17
JodaMoney 通过 Class.forName() 加载了 DefaultCurrencyUnitDataProvider
类，还读取了 CurrencyData.csv 和 CountryData.csv 两个资源文件，可以用 @TypeHint
和 @ResourceHint 在 Java 配置类中添加提示，告诉 GraalVM 的插件把这些内容打包进
镜像。JWT 也有类似的问题，有 5 个类是用 Class.forName() 加载的，在 pom.xml 中
```

- 我们把 jjwt-impl 和 jjwt-jackson 声明为运行时才需要的，现在编译时就需要了，因此需要去

```
掉 <scope>runtime</scope> 的配置。Spring Security 会通过反射读取
AuthenticationManagerBuilder 中的属性，也许要进行声明，@TypeHint 里的
access 可以指定访问类型，TypeAccess.DECLARED_FIELDS 就是允许访问所有声明了
```

- 的属性。我们把上述所有提示信息集中到一个配置类里，具体如代码示例 C-7 所示。

```java
代码示例 C-7　用于配置 Spring Native 注解的 HintConfig 类
@Configuration
1
@TypeHints({
2
   @TypeHint(types = MoneyType.class),
3
   // JWT
4
   @TypeHint(types = DefaultJwtParserBuilder.class),
5
   @TypeHint(types = DefaultJwtBuilder.class),
6
   @TypeHint(types = DefaultClaims.class),
7
   @TypeHint(types = DefaultHeader.class),
8
   @TypeHint(types = DefaultJwsHeader.class),
9
   // Joda Money
10
   @TypeHint(typeNames = "org.joda.money.DefaultCurrencyUnitDataProvider"),
11
   // Spring
12
   @TypeHint(types = AuthenticationManagerBuilder.class, access = TypeAccess.D
13
})
14
@ResourcesHints({
15
   @ResourceHint(patterns = "org/joda/money/CurrencyData.csv"),
16
   @ResourceHint(patterns = "org/joda/money/CountryData.csv"),
17
})
18
public class HintConfig {
19
}
20
运行过程中，我们还会发现 MenuService 类的 getByNameAndSize() 在
@Cacheable 注解里配置了 SpEL 表达式，其中的 #root.methodName 无法正常解析，
这里我们就把这个方法的 @Cacheable 缓存去掉。如果在项目里没有用 SpEL 表达式，可
```

- 以告诉 spring-aot-maven-plugin，去掉相应的 SpEL 支持。类似地，还有一些其他配置，如表 C-2 所示。

- 表 C-2　spring-aot-maven-plugin 的一些配置

- 配置项默认值说明

```xml
在具体使用时，可以在 <plugin/> 中增加下面的配置：
<configuration>
1
   <removeSpelSupport>true</removeSpelSupport>
2
</configuration>
3
```

2. 调整 Java 配置类在 BinaryTea 中需要调整的 Java 配置类主要是 Spring Security 相关的

```
WebSecurityConfiguration。原先其中的很多 Bean 引用都是通过方法调用实现的，
```

- 在 CGLIB 的帮助下，多次调用方法实际只会执行一次，但现在调用一次就执行一次，尤其

```java
是 userDetailsService() 还会往数据库里插入记录，第二次执行就会违反唯一性约
束。为此，我们可以尽可能将 Bean 配置从 WebSecurityConfiguration 中移出去，用
@Autowired 将 Spring 上下文里的 Bean 注入进来。同时，在定义 Bean 的时候把依赖变
为传参，可以将 WebSecurityConfiguration 里的 loginController、
jwtPreAuthenticatedAuthenticationProvider、
persistentTokenRepository 和 userDetailsService Bean 定义移到
BinaryTeaApplication 里，具体如代码示例 C-8 所示。
代码示例 C-8　增加了 Bean 定义的 BinaryTeaApplication 类
@SpringBootApplication
1
@EnableCaching
2
public class BinaryTeaApplication {
3
   // 省略原先已存在的方法
4
5
   @Bean("/login")
6
   public UrlFilenameViewController loginController() {
7
       UrlFilenameViewController controller = new UrlFilenameViewController()
8
       controller.setSupportedMethods(HttpMethod.GET.name());
9
       controller.setSuffix(".html");
10
       return controller;
11
   }
12
13
   @Bean
14
   public PreAuthenticatedAuthenticationProvider jwtPreAuthenticatedAuthentica
15
<DataSource> dataSources,
16
                    UserDetailsService userDetailsService) {
17
       PreAuthenticatedAuthenticationProvider provider = new PreAuthenticatedA
18
       provider.setPreAuthenticatedUserDetailsService(
19
           new UserDetailsByNameServiceWrapper<>(userDetailsService));
20
       return provider;
21
   }
22
23
   @Bean
24
   public PersistentTokenRepository persistentTokenRepository(ObjectProvider<D
25
       JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl()
26
       tokenRepository.setDataSource(dataSources.getIfAvailable());
27
       tokenRepository.setCreateTableOnStartup(false);
28
       return tokenRepository;
29
   }
30
31
   @Bean
32
   public UserDetailsService userDetailsService(ObjectProvider<DataSource> dat
33
       RoleBasedJdbcUserDetailsManager userDetailsManager = new RoleBasedJdbcU
34
       userDetailsManager.setDataSource(dataSources.getIfAvailable());
35
       UserDetails manager = User.builder()
36
           .username("HanMeimei")
37
           .password("$2a$10$iAty2GrJu9WfpksIen6qX.vczLmXlp.1q1OHBxWEX8BIldtwx
38
           .roles("MANAGER")
39
           .build();
40
       userDetailsManager.createUser(manager);
41
       return userDetailsManager;
42
   }
43
}
44
WebSecurityConfiguration 里也要做对应的调整。用 @Autowired 注入其他地方声
明的 Bean，authenticationManagerBean() 内部调用了父类的方法，所以不能移出
去。jwtAuthenticationFilter() 又依赖了 authenticationManagerBean()，所
以也要保留。jwtAuthenticationFilter() 在 configure (HttpSecurity
http) 里又被调用了一次，那次等于不是依赖 Bean 的，因此里面的 @Autowired 注解没
有生效。为了避免执行中缺少 JwtTokenHelper，抛出 NullPointerException，为
JwtAuthenticationFilter 增加 setJwtTokenHelper() 方法，手动将
jwtTokenHelper 注入进去。具体如代码示例 C-9 所示。
代码示例 C-9　调整后的 WebSecurityConfiguration 类
@Configuration
1
@EnableWebSecurity
2
@EnableGlobalMethodSecurity(securedEnabled = true,
3
                           prePostEnabled = true,
4
                           jsr250Enabled = true)
5
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
6
   @Autowired
7
   private UserDetailsService userDetailsService;
8
   @Autowired
9
   private PersistentTokenRepository persistentTokenRepository;
10
   @Autowired
11
   private PreAuthenticatedAuthenticationProvider jwtPreAuthenticatedAuthentic
12
   @Autowired
13
   private JwtTokenHelper jwtTokenHelper;
14
15
   @Bean
16
   public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {
17
       JwtAuthenticationFilter filter = new JwtAuthenticationFilter();
18
       filter.setJwtTokenHelper(jwtTokenHelper); // 手动注入依赖
19
       filter.setAuthenticationManager(authenticationManagerBean());
20
       return filter;
21
   }
22
23
   @Override
24
   protected void configure(AuthenticationManagerBuilder auth) throws Exceptio
25
       auth.authenticationProvider(jwtPreAuthenticatedAuthenticationProvider)
26
(userDetailsService);
27
   }
28
29
   @Override
30
   protected void configure(HttpSecurity http) throws Exception {
31
       // 这部分代码可以参考示例文件，此处省略
32
   }
33
   // 省略其他代码
34
}
35
```

3. 配置动态代理类型在 BinaryTea 工程运行过程中，我们在日志中看到了不少类似下面这样的信息：

```
INFO 9628 --- [main] o.s.core.annotation.MergedAnnotation : Failed to introspec
1
2
java.util.Optional learning.spring.binarytea.controller.MenuController.createBy
3
binarytea.controller.request.NewMenuItemForm,org.springframework.validation.Bin
4
http.HttpServletResponse): com.oracle.svm.core.jdk.UnsupportedFeatureError: Pro
5
interfaces [interface org.springframework.web.bind.annotation.PostMapping, inte
6
core.annotation.SynthesizedAnnotation] not found. Generating proxy classes at
7
Proxy classes need to be defined at image build time by specifying the list of
8
implement. To define proxy classes use -H:DynamicProxyConfigurationFiles=<comma
9
and -H:DynamicProxyConfigurationResources=<comma-separated-config-resources> op
大意是不支持在运行时生成代理类，可以在构建时将代理类的信息定义好，用 -
H:DynamicProxyConfigurationFiles 从文件中读取配置信息，或者用 -
H:DynamicProxyConfigurationResources 从 CLASSPATH 资源中读取配置信息。
```

- 我们可以在 resources 中新增一个 dynamic-proxy.json 文件，内容如代码示例 C-10 所示。里面的内容是一个 JSON 数组，数组中的每个元素都是一个代理类涉及的接口，接口的顺序要和上面日志中的接口顺序一致。

- 代码示例 C-10　dynamic-proxy.json 文件的内容

```json
[
1
   { "interfaces": [ "org.springframework.web.bind.annotation.PostMapping", "o
2
annotation.SynthesizedAnnotation" ] },
3
   { "interfaces": [ "org.springframework.web.bind.annotation.GetMapping", "o
4
annotation.SynthesizedAnnotation" ] },
5
   { "interfaces": [ "org.springframework.boot.autoconfigure.web.servlet.Condi
6
"org.springframework.core.annotation.SynthesizedAnnotation" ] }
7
]
8
```

- 随后，调整 pom.xml 中 native-maven-plugin 插件的配置，增加构建参数，具体如代码示例C-11 所示。

- 代码示例 C-11　调整 native-maven-plugin

```xml
<plugin>
1
   <groupId>org.graalvm.buildtools</groupId>
2
   <artifactId>native-maven-plugin</artifactId>
3
   <version>0.9.11</version>
4
   <!-- 省略部分内容 -->
5
   <configuration>
6
       <buildArgs>
7
           <buildArg>-H:DynamicProxyConfigurationResources=dynamic-proxy.json<
8
       </buildArgs>
9
   </configuration>
10
</plugin>
11
```

### C.2.4　其他优化

在解决问题之余，我们还可以做一些优化，让生成的本地镜像跑得更快，占用资源更少，例如：

- 可以用 tomcat-embed-programmatic 来代替 tomcat-embed-core 和 tomcat-embed-websocket；12

- 如果不用 Micrometer 来输出度量信息，可以从 spring-boot-starter-actuator 中去掉Micrometer 的依赖；

- 如前文提到的，去除不必要的 SpEL、XML 和 YAML 支持，但前提是明确自己确实不需要。13

这些优化都放在 pom.xml 中（前两个都是对依赖的调整），具体如代码示例 C-12 所示。

- 代码示例 C-12　对依赖的一些优化

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-web</artifactId>
   <exclusions>
       <exclusion>
           <groupId>org.apache.tomcat.embed</groupId>
           <artifactId>tomcat-embed-core</artifactId>
       </exclusion>
       <exclusion>
           <groupId>org.apache.tomcat.embed</groupId>
           <artifactId>tomcat-embed-websocket</artifactId>
       </exclusion>
   </exclusions>
</dependency>
<dependency>
   <groupId>org.apache.tomcat.experimental</groupId>
   <artifactId>tomcat-embed-programmatic</artifactId>
   <version>$</version>
</dependency>
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-actuator</artifactId>
   <exclusions>
       <exclusion>
           <groupId>io.micrometer</groupId>
           <artifactId>micrometer-core</artifactId>
       </exclusion>
   </exclusions>
</dependency>
```

在完成了上述所有改动后，我们可以重新构建项目的本地镜像，然后通过浏览器访问 Web 界面，或者用 Customer 工程访问 REST 服务，系统应该能正常响应。

```
对比一下现在使用的本地镜像与传统的 Fat Jar，在启动日志里找到 Started
BinaryTeaApplication in XXX seconds 那行，两者有着天壤之别。本地镜像启动仅
```

需 0.434 秒，也就是 434 毫秒，内存占用大约在 94MB。而用 java -jar 方式运行 Fat Jar，启

- 14

动需要 3.544 秒，内存占用大约是 577MB，大约分别是前者的 8 倍与 6 倍。

- 可见 Spring

Native 与 GraalVM 还是为我们的二进制奶茶店项目带来了很大的性能提升的，无论是否运行在容器中，这种提升都是很可观的。

[1]：Quarkus 是由 RedHat 开发的微服务框架；Micronaut 则是由 ObjectComputing 维护的，这也是 Grails 的开发团队。[2]：JDK 中不仅包含编译器，也包含了 JVM 虚拟机。[3]：Ruby 有基于 JVM 的 JRuby，Python 则有 Jython。

[4]：项目早期的名字为 Spring GraalVM Native，后来改为 Spring Native。后续 Spring Native 的部分功能也有可能会合并到 Spring

- Framework 中，例如 AOT 相关的内容。

[5]：这里的 Spring Boot 和 Spring Cloud 都不是完整支持的，有些可以无须额外配置直接支持，有的却不行。具体可以参考 Spring

- Native 官方文档了解详细的支持和配置信息。

[6]：这个例子在 app3/binarytea 项目中。[7]：网上有些介绍 Spring Native 的文章，其中使用的例子就是 Hello World 级别的，没有太多依赖。相比之下，我们的 binarytea-

- jwt-auth 已经是复杂的了。但这个例子和实际的工程之间依然有很大差别，实际情况通常会更复杂。

[8]：这里真的是需要根据实际打包后产物的执行情况来看的，反复尝试，打包后需要把所有的测试案例都执行一下，避免边边角角

- 的功能出问题。越是复杂的项目越有可能需要调整代码，有时是用到的库不支持，还需要自己来调整库里的东西。

[9]：如果使用了苹果 M1 芯片的电脑，支持 macOS ARM 64 位的 GraalVM 版本是从 22.1.0 开始的。经尝试，Spring Native 0.11.5

- 也可以使用 GraalVM 22.1.0.r11-grl。

[10]：在构建本地镜像时，尽量预留足够的内存，运行的电脑建议至少配置 8GB 内存。[11]：为了方便排查哪里的 Bean 定义存在问题，可以考虑在正常开发时就在 配置类中使用 ，关闭 CGLIB 增强，或者使用方法参数

- 注入依赖。

[12]：目前的 Spring Native 仅支持 Tomcat，还不支持其他的 Web 容器。[13]：在本例中我们没有去除 SpEL 和 YAML 的支持。[14]：两种方式都未做任何 JVM 参数配置或相关优化，都是命令行下的默认值。
