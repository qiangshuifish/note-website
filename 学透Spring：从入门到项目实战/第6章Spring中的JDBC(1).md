# 第6章Spring中的JDBC(1)

- 本章内容常见的数据库连接池配置

- 在 Spring 中使用 JDBC 操作数据库

- Spring 中的事务抽象

- Spring 中的异常抽象

JDBC 的全称是 Java Database Connectivity，是一套面向关系型数据库的规范。虽然数据库各有不同，但这些数据库都提供了基于 JDBC 规范实现的 JDBC 驱动。开发者只需要面向JDBC 接口编程，就能在很大程度上规避数据库差异带来的问题。Java 应用程序基本上是通过 JDBC 来连接并操作数据库的，哪怕我们使用了对象关系映射框架（例如 Hibernate），其底层也是用 JDBC 来与数据库进行交互的。

## 6.1　配置数据源

无论是简单的增删改查操作，还是复杂的数据分析任务，都需要先提供一个数据源

```
（DataSource）。顾名思义，数据源就是数据的源头，即可以从中获取数据的地方。数据源
```

的常见实现是连接池，开发者能通过连接池来管理 JDBC 连接。由于 JDBC 操作都是基于连接的，因而在本章的第一部分中，我们先来了解一下连接池。

### 6.1.1　数据库连接池

```
在学习 Java 时，大家可能学习过 JDBC 的基础知识。JDBC 通过 java.sql 包中的
Connection 来连接数据库，随后创建 Statement 或 PreparedStatement 执行 SQL 语
句。如果是查询操作，在 JDBC 中会用 ResultSet 来代表返回的结果集。一个普通的查询
```

- 1

操作可能如代码示例 6-1 所示。

- 代码示例 6-1　基础的 JDBC 查询操作示例片段

```sql
Class.forName("org.h2.Driver");
// 此处使用了try-with-resource的语法，因此不用在finally语法段中关闭资源
try (Connection connection = DriverManager.getConnection("jdbc:h2:mem:test_db");
   Statement statement = connection.createStatement();
    ResultSet resultSet = statement.executeQuery("SELECT X FROM SYSTEM_RANGE(1,
   while (resultSet.next()) {
       log.info("取值：{}", resultSet.getInt(1));
   }
} catch (Exception e) {
   log.error("出错啦", e);
}
```

这样的代码虽然不复杂，但是在真实的生产环境中，并不推荐大家自己来创建并管理数据库连接，主要原因是创建一个 JDBC 连接的成本非常高。我们建议通过数据库连接池来管理连接，它的主要功能有：

- 根据配置，事先创建一定数量的连接放在连接池中，以便在需要的时候直接返回现成的连接；

- 维护连接池中的连接，根据配置，清理已存在的连接。

```
我们常用的数据库连接池都实现了 DataSource 接口，通过其中的 getConnection() 方
```

法即可获得一个连接。本节将介绍目前比较流行的两个连接池——HikariCP 和 Druid。此外，业界还有其他一些连接池的出镜率也比较高，比如 DBCP2 和 C3P0 等。

1. HikariCPSpring Boot 2.x 项目的默认数据库连接池是 HikariCP，Hikari 这个词在日语中的意思是“光”，也许作者起这个名字是为了突出它“速度快”的这个特点。在工程中引入数据库相关的Spring Boot Starter，默认就会引入 HikariCP 的依赖。例如，在 Spring Initializr 上选中H2、JDBC API 和 Lombok 三个组件，生成一个工程，其中的依赖就包括如下内容：

```xml
<dependency>
1
   <groupId>org.springframework.boot</groupId>
2
   <artifactId>spring-boot-starter-jdbc</artifactId>
3
</dependency>
4
<dependency>
5
   <groupId>com.h2database</groupId>
6
   <artifactId>h2</artifactId>
7
   <scope>runtime</scope>
8
</dependency>
9
<dependency>
10
   <groupId>org.projectlombok</groupId>
11
   <artifactId>lombok</artifactId>
12
   <optional>true</optional>
13
</dependency>
14
<dependency>
15
   <groupId>org.springframework.boot</groupId>
16
   <artifactId>spring-boot-starter-test</artifactId>
17
   <scope>test</scope>
18
</dependency>
19
```

- Spring Boot 的自动配置机制在检测到 CLASSPATH 中存在 H2 数据库的依赖，且没有配置

```
过 DataSource 时，会进行自动配置，提供一个基于内存数据库的数据源。在下一节中我
们还会看到不用 Spring Boot 自动配置，而是手动配置一个 DataSource 的例子。我们可
```

- 2以通过一段测试代码来验证一下，如代码示例 6-2 所示。

```
代码示例 6-2　DatasourceDemoApplicationTests 测试类代码片段
```

```python
@SpringBootTest
1
class DatasourceDemoApplicationTests {
2
   @Autowired
3
   private ApplicationContext applicationContext;
4
5
   @Test
6
   void testDataSource() throws SQLException {
7
       assertTrue(applicationContext.containsBean("dataSource"));
8
       DataSource dataSource = applicationContext.getBean("dataSource", DataSo
9
       assertTrue(dataSource instanceof HikariDataSource);
10
11
       Connection connection = dataSource.getConnection();
12
       assertTrue(connection instanceof HikariProxyConnection);
13
       connection.close();
14
15
       assertEquals(10, ((HikariDataSource) dataSource).getMaximumPoolSize())
16
   }
17
}
18
在 testDataSource() 方法中，我们做了如下一些动作：
(1) 先判断上下文中是否存在名为 dataSource 的 Bean；
(2) 如果存在，则取出该 Bean，同时要求这个 Bean 是实现了 DataSource 接口的；
(3) 判断取出的 dataSource 是 HikariDataSource 类型的；
(4) 从 dataSource 中取出一个连接，判断它是否为 HikariProxyConnection 类型；
```

- (5) 判断连接池的最大连接数是否为 10，这是一个默认值。

- 运行后，这个单元测试能够顺利通过。

```
在实际使用时，可以直接注入 DataSource Bean，但在更多的情况下，我们并不会直接
去操作 DataSource，而是使用更上层的 API。在后文中我们会看到 Spring Framework
```

- 的一些 JDBC 封装操作。

- HikariCP 有不少配置项，用于调整连接池的大小和各种超时设置，可以直接配置在连接池

```
对象上。Spring Boot 为我们提供了方便的配置方式，在 application.properties 中
```

- 就可以修改自动配置的连接池，具体的参数如表 6-1 所示。

- 表 6-1　HikariCP 的常用配置项

- Spring Boot 配置属性配置项配置含义

- `jdbcUrl``spring.datasource.url`用于连接数据库的

- `username``spring.datasource.username`连接数据库使用的用

- `password``spring.datasource.password`连接数据库使用的密

- `maximumPoolSize``spring.datasource.hikari.maximum-pool-size`连接池中的最大连接

- `minimumIdle``spring.datasource.hikari.minimum-idle`连接池中保持的最小

- `connectionTimeout``spring.datasource.hikari.connection-timeout`建立连接时的超时时

- `idleTimeout``spring.datasource.hikari.idle-timeout`连接清理前的空闲时

- `maxLifetime``spring.datasource.hikari.max-lifetime`连接池中连接的最大

- 茶歇时间：HikariCP 为什么说自己比别人快HikariCP 官方一直将“快”作为自己的亮点。从官方性能测试的结果来看，HikariCP 的性能数倍于 DBCP2、C3P0 和 Tomcat 连接池。官方有一篇“Down the Rabbit Hole”的文章，简单说明了 HikariCP 性能出众的原因：

```
通过字节码进行加速，JavassistProxyFactory 中使用 Javassist 直接生成了
大量字节码塞到了 ProxyFactory 中，同时还对字节码进行了精确地优化；
使用 FastList 代替了 JDK 内置的 ArrayList；
从 .NET 中借鉴了无锁集合 ConcurrentBag。
```

- 由此可见，HikariCP 的作者还是在连接池的性能调优方面下了很多功夫的，甚至可以说用上了不少“奇技淫巧”。

2. Druid阿里巴巴开源的 Druid 数据库连接池在阿里巴巴集团内部得到了广泛的应用，在国内也有大量的使用者。暂且不论 Druid 是否是 Java 语言中最好的数据库连接池，但其官方宣称它是面向监控而生的数据库连接池倒是一个不争的事实。在监控能力之外，Druid 还提供了很丰富的功能，例如：

- 针对主流数据库的适配，包含驱动、连接检查、异常等；

- 内置 SQL 注入防火墙功能；

- 内置数据库密码非对称加密功能；

```
内置针对数据库异常的 ExceptionSorter，可对不同的异常进行区别对待；
```

- 内置丰富的日志信息；

- 提供了强大的扩展能力，可在 JDBC 连接操作的各个阶段注入自己的逻辑。

- 如果用一个字来形容 HikariCP 的特点，那就是“快”，它需要配合其他的一些组件才能实现某些功能。Druid 的特点应该就是“全”，仅其内置的功能就已经能满足绝大部分生产环境中的苛刻要求了，更不用说我们还能对它进行扩展。

- Druid 提供了一个 Spring Boot Starter 来适配 Spring Boot 的自动配置功能。也就是说，除

```
了自己动手配置一个 DruidDataSource Bean 以外，我们也可以通过自动配置的方式来
```

- 提供数据源的 Bean。

```
仍旧以上面的 DataSourceDemo 为例，在 pom.xml 中添加如下依赖（版本可通过官方主
```

- 页查询）即可引入 Druid 的支持。如果可以的话，建议从 spring-boot-starter-jdbc 中排除掉HikariCP 的依赖，因为项目中不再需要它了：

```xml
<dependency>
1
   <groupId>com.alibaba</groupId>
2
   <artifactId>druid-spring-boot-starter</artifactId>
3
   <version>1.2.8</version>
4
</dependency>
5
```

- 对于测试代码，我们也稍作调整，将判断的条件替换为 Druid 的类，具体如代码示例 6-3 所3示。

```python
代码示例 6-3　DatasourceDemoApplicationTests 测试类代码片段
@SpringBootTest
1
class DatasourceDemoApplicationTests {
2
   @Autowired
3
   private ApplicationContext applicationContext;
4
5
   @Test
6
   void testDataSource() throws SQLException {
7
       assertTrue(applicationContext.containsBean("dataSource"));
8
       DataSource dataSource = applicationContext.getBean("dataSource", DataSo
9
       assertTrue(dataSource instanceof DruidDataSource);
10
11
       Connection connection = dataSource.getConnection();
12
       assertTrue(connection instanceof DruidPooledConnection);
13
       connection.close();
14
15
       assertEquals(DruidDataSource.DEFAULT_MAX_ACTIVE_SIZE,((DruidDataSource)
16
   }
17
}
18
```

- 在判断出使用了 H2 内嵌数据库后，通过 druid-spring-boot-starter 也能自动创建数据源的Bean。我们对其类型和一些默认配置做了判断。与 HikariCP 类似，Druid 也提供了很多配置项，其中常用的内容如表 6-2 所示，关于 Druid 的高阶功能，我们会在后续的章节中再展开讨论。

- 表 6-2　Druid 的常用配置项

- Spring Boot 配置属性配置项配置含义

- `url``spring.datasource.url`用于连接数据库的 JDBC URL

- `username``spring.datasource.username`连接数据库使用的用户名

- `password``spring.datasource.password`连接数据库使用的密码

- `initialSize``spring.datasource.druid.initial-size`初始化连接池时建立的连接数

- `maxActive``spring.datasource.druid.max-active`连接池中的最大连接数

- `minIdle``spring.datasource.druid.min-idle`连接池中保持的最小空闲连接

- `maxWait``spring.datasource.druid.max-wait`获取连接的最大等待时间，单

- `testOnBorrow``spring.datasource.druid.test-on-borrow`获取连接时检查连接，会影响

- `testOnReturn``spring.datasource.druid.test-on-return`归还连接时检查连接，会影响

- 检查空闲的连接，具体的检查`testWhileIdle``spring.datasource.druid.test-while-idle`几乎无影响

### 6.1.2　数据源配置详解

Spring Boot 为了减少数据源的配置工作，做了大量的基础工作，比如：

```
提供了方便的 spring.datasource 通用配置参数；
```

- 提供了针对多种连接池的单数据源自动配置；

- 提供了针对内嵌数据库的特殊自动配置。

接下来就让我们分别来了解这些特性以及它们的实现原理。在本节的最后，会以 MySQL 为例，配置一个数据源。

1. 数据源配置参数详解

```java
Spring Boot 为数据源配置提供了一个 DataSourceProperties，用于绑定
spring.datasource 的配置内容。它的类定义如下：
@ConfigurationProperties(prefix = "spring.datasource")
1
public class DataSourceProperties implements BeanClassLoaderAware, Initializing
2
```

- 之前在介绍 HikariCP 和 Druid 时，我们已经看到过一些配置项了，现在再跟着

```
DataSourceProperties 重新认识一下 Spring Boot 提供的配置项，具体如表 6-3 所
```

- 示。

- 表 6-3　Spring Boot 提供的部分常用 spring.datasource 配置项

- 配置项默认值说明

```
spring.datasource.url
```

- 数据

```
spring.datasource.username
```

- 连接

```
spring.datasource.password
```

- 连接

```
spring.datasource.name
使用内嵌数据库时为 testdb
```

- 数据

```
spring.datasource.jndi-name
```

- 获取

```
spring.datasource.type
```

- 根据 CLASSPATH 自动探测连接

```
spring.datasource.driver-class-name
```

- 根据 URL 自动探测JDB

```
spring.datasource.generate-unique-name
true
```

- 是否

- 我们一般会配置表 6-3 中的前三个配置项，再结合一些连接池的配置（Spring Boot 内置了对 HikariCP、DBCP2 和 Tomcat 连接池的支持），还有其他对应的配置，分别放在了如下前缀的配置项中：

```
spring.datasource.hikari.*（在之前的章节中已经见过一些了）；
spring.datasource.dbcp2.*；
spring.datasource.tomcat.*。
```

- 还有一些与初始化相关的配置，稍后再做说明。

2. 数据源自动配置详解Spring Boot 的数据源自动配置，是一个很好的自动配置实现示范。我们通过

```
DataSourceAutoConfiguration 类可以学习到很多自动配置的技巧，例如条件控制、
```

- 内嵌配置类、导入其他配置等。

```
DataSourceAutoConfiguration 会先判断是否存在 DataSource 和
EmbeddedDatabaseType，满足条件则导入
DataSourcePoolMetadataProvidersConfiguration 和
DataSourceInitializationConfiguration 两个配置类，前者配置连接池元数据提
```

- 供者，后者进行数据源初始化配置。

```
整个 DataSourceAutoConfiguration 分为两个内嵌配置类——内嵌数据库配置类
EmbeddedDatabaseConfiguration 和连接池数据源配置类
PooledDataSourceConfiguration。下面来看一下连接池数据源的配置。
PooledDataSourceConfiguration 会直接导入 DataSourceConfiguration 中关
```

- 于 HikariCP、DBCP2、Tomcat 和通用数据源的配置，随后这些配置类再根据自己的条件

```
决定是否生效；此外 DataSourceJmxConfiguration 配置类也会根据条件将不同数据
```

- 库连接池的信息发布到 JMX 端点上。

```
我们以 HikariCP 的自动配置 DataSourceConfiguration.Hikari 为例，来看一下
Spring Boot 是如何为我们自动配置 DataSource 的。其他类型数据库连接池的配置与它
```

- 大同小异，下面是具体的代码：

```
@Configuration(proxyBeanMethods = false)
1
@ConditionalOnClass(HikariDataSource.class)
2
@ConditionalOnMissingBean(DataSource.class)
3
@ConditionalOnProperty(name = "spring.datasource.type", havingValue = "com.zaxx
4
HikariDataSource", matchIfMissing = true)
5
static class Hikari {
6
   @Bean
7
   @ConfigurationProperties(prefix = "spring.datasource.hikari")
8
   HikariDataSource dataSource(DataSourceProperties properties) {
9
       HikariDataSource dataSource = createDataSource(properties, HikariDataSo
10
       if (StringUtils.hasText(properties.getName())) {
11
           dataSource.setPoolName(properties.getName());
12
       }
13
       return dataSource;
14
   }
15
}
16
首先，判断 CLASSPATH 中存在 HikariDataSource 类，并且尚未配置
DataSource。如果配置了 spring.datasource.type 并且是 HikariCP 的类，或者这
```

- 个属性为空，则配置生效。

```
接着，创建一个 HikariDataSource 数据源对象，如果指定了数据源名称，则进行赋
```

- 值。

```
最后，通过 @ConfigurationProperties 将 spring.datasource.hikari.* 的属
性都绑定到返回的 HikariDataSource 对象上，这个对象就是 Spring 上下文中的
DataSource Bean 了。
```

3. 内嵌数据库的特殊逻辑在之前的示例中，我们使用了 H2 内嵌数据库，它可以轻松地将所有数据保存在本机内存中4，程序关闭后，内存中的数据就消失了。因此，H2 用来作为测试数据库非常合适。我们在后续的示例中也会大量地使用 H2。

```
EmbeddedDatabaseType 定义了 Spring Boot 内置支持的三种数据库，即 HSQL、H2 和
Derby，EmbeddedDatabaseConnection 则分别定义了三者的 JDBC 驱动类和用来创建
```

- 内存数据库的 JDBC URL。系统启动时会根据 CLASSPATH 来判断是否存在对应的驱动

```
类。随后，EmbeddedDataSourceConfiguration.dataSource() 方法会根据前面的
信息来创建 DataSource 对象。
```

```
创建完内嵌数据库的 DataSource 后，Spring Boot 还会为我们进行数据库的初始化工
```

- 作，我们可以在这个过程中建表，并导入初始的数据。初始化动作是由

```
DataSourceInitializer 类来实现的，它会根据 spring.sql.init.schema-
locations 和 spring.sql.init.data-locations 这两个属性来初始化数据库中的
```

- 表和数据，默认通过读取 CLASSPATH 中的 schema.sql 和 data.sql 文件来进行初始化。5表 6-4 罗列了一些与数据源初始化相关的配置项。

- 表 6-4　与数据源初始化相关的配置项

- 当前配置项旧配置项

- 6DDL 是数据定义语言，一般对应与表结构相关的内容；DML 是数据操作语言，一般对应与表数据库增删改查相关的操作内容。

- 第一个配置项就告诉我们，Spring Boot 只是默认为内嵌数据库做初始化，其实，我们也可以对任意数据库进行初始化。不过在实际生产中，这种初始化工作很少由系统来实现，更多的是通过一定的流程，经 DBA 审批后自动或人工进行变更的。

4. 配置一个连接 MySQL 的数据源在工作中，我们的系统一般都会连接类似 MySQL、Oracle 这样的数据库，很少会用 H2、Derby，所以在本节的最后，我们以 MySQL 为例，看看 Spring Boot 程序该如何来连接生产数据库。

```
要连接数据库，首先需要在 pom.xml 的 <dependencies/> 中加入 MySQL 的 JDBC 驱
```

- 动，可以像下面这样添加依赖：

```xml
<dependency>
1
   <groupId>mysql</groupId>
2
   <artifactId>mysql-connector-java</artifactId>
3
</dependency>
4
```

- spring-boot-dependencies 会自动为我们管理 mysql-connector-java 的版本。例如，SpringBoot 2.6.3 中用的就是 mysql-connector-java 8.0.28。随后，我们在7

```
application.properties 中添加与数据源相关的配置，如代码示例 6-4
```

- 所示。

```
代码示例 6-4　application.properties 中 MySQL 数据源的配置
spring.datasource.url=jdbc:mysql://localhost/binary-tea?useUnicode=true&charact
1
spring.datasource.username=binary-tea
2
spring.datasource.password=binary-tea
3
spring.datasource.hikari.maximum-pool-size=20
4
spring.datasource.hikari.minimum-idle=10
5
这个配置会连接本机安装的 MySQL，端口是默认的 3306，连接的数据库是 binary-
tea，用户名和密码也是 binary-tea。
```

- 请注意　在生产环境请不要使用这样的“弱密码”，而且密码不要用明文配置在文件中。

- 随后，对测试代码稍作修改，让它检查一下我们是否成功连接了 MySQL。具体见代码示例6-5。

```python
代码示例 6-5　DatasourceDemoApplicationTests 测试类代码片段
@SpringBootTest
1
class DatasourceDemoApplicationTests {
2
   @Autowired
3
   private ApplicationContext applicationContext;
4
   @Value("$")
5
   private String jdbcUrl;
6
7
   @Test
8
   void testDataSource() throws SQLException {
9
       assertTrue(applicationContext.containsBean("dataSource"));
10
       DataSource dataSource = applicationContext.getBean("dataSource", DataSo
11
       assertTrue(dataSource instanceof HikariDataSource);
12
13
       HikariDataSource hikari = (HikariDataSource) dataSource;
14
       assertEquals(20, hikari.getMaximumPoolSize());
15
       assertEquals(10, hikari.getMinimumIdle());
16
       assertEquals("com.mysql.cj.jdbc.Driver", hikari.getDriverClassName());
17
       assertEquals(jdbcUrl, hikari.getJdbcUrl());
18
19
       Connection connection = hikari.getConnection();
20
       assertNotNull(connection);
21
       connection.close();
22
   }
23
}
24
```

- 通过这个测试，我们可以看到 Spring Boot 根据我们的 JDBC URL 和 CLASSPATH 自动推

```
断出了所需的 JDBC 驱动类，并将其设置为了 com.mysql.cj.jdbc.Driver。我们也可
以自己来创建 DataSource Bean，HikariCP 本身也能自己来选择驱动，但如果此时
driverClassName 为空，则可以去掉那个判断。代码示例 6-6 是自己创建 Bean 的代
```

- 码。

```
代码示例 6-6　自己配置 HikariDataSource Bean 的代码
@Bean
1
@ConfigurationProperties("spring.datasource.hikari")
2
public DataSource dataSource(DataSourceProperties properties) {
3
   HikariDataSource dataSource = new HikariDataSource();
4
   dataSource.setJdbcUrl(properties.getUrl());
5
   dataSource.setUsername(properties.getUsername());
6
   dataSource.setPassword(properties.getPassword());
7
   return dataSource;
8
}
9
```

- 如果使用 XML 的方式，可能会像下面这样：

```xml
<?xml version="1.0" encoding="UTF-8"?>
1
<beans xmlns="http://www.springframework.org/schema/beans"
2
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
3
   xsi:schemaLocation="http://www.springframework.org/schema/beans
4
   https://www.springframework.org/schema/beans/spring-beans.xsd">
5
6
   <bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource">
7
       <property name="jdbcUrl" ref="$"/>
8
       <property name="username" ref="$"/>
9
       <property name="password" ref="$"/>
10
       <property name="maxPoolSize" ref="$"/>
11
       <property name="minIdle" ref="$"/>
12
       <!-- 其他配置省略 -->
13
   </bean>
14
</beans>
15
```

- 茶歇时间：使用 Docker 简化本地开发环境的准备工作随着容器技术的普及，在生产和测试环境使用 Kubernetes 早已不是什么新鲜事了。容器中不仅包含了我们的工程，还包含了工程运行所需的整个环境。而且，容器技术相比传统的虚拟机更节省资源，运行效率更高，是交付与运行的理想之选。Docker 是目前比较常用的容器，它提供了针对不同操作系统的支持，可以非常方便地在本地搭建起一套环境。在开发时，我们经常需要搭建各种基础设施，比如，MySQL 数据库、Redis、Zookeeper 等。有了 Docker，搭建这些基础设施就变成了简单的几条命令。以上面提到的 MySQL 为例，要在本机从头开始搭建一套 MySQL，只需简单的两句命令。8

```
首先，通过 docker pull 命令从仓库
```

- 中获取 MySQL 的镜像：

```
▸ docker pull mysql
1
```

- 接着，根据官方镜像的说明运行 MySQL，并进行相应的初始化：

```
▸ docker run --name binary-tea-mysql -d -p 3306:3306 -v ~/docker-data/mysql/
1
这里，我们简单说明一下 docker run 的命令，命令最后的 mysql 是镜像名，前面几
```

- 个参数的作用见表 6-5。表 6-5　docker run 命令中几个参数的作用

- 参数作用

```bash
除了 docker run，常用的命令还有 docker stop、docker start 和 docker ps。
docker stop 用来停止运行中的容器，docker start 则是将停止运行的容器再启动起
来，例如，可以用 docker stop binary-tea-mysql 来停止刚才由 docker run 创
建的容器。docker ps 命令可以查看当前正在运行的容器。
```

- Docker 涉及的内容非常多，如果大家感兴趣的话，可以前往其官方网站了解更多信息。

## 6.2　使用 JDBC 操作数据库

在建立了数据源之后，想要操作数据，最简单的办法就是使用 JDBC 提供的接口，正如 6.1 节开头那样。但使用原生 API 需要做很多模板化的工作，而且在一些细节上如果处理不当也会造成一些麻烦。Spring Framework 为我们提供了一整套关于 JDBC 的封装，Spring Boot 更是贴心地提供了相关的自动配置。在本节中，我们就来了解一些与数据操作相关的内容。

说起 JDBC 操作，最基本的就是增删改查操作，但无论是什么操作，都遵循一个基本的流程：

```
(1) 获取 Connection 连接；
(2) 通过 Connection 创建 Statement 或者 PreparedStatement；
```

(3) 执行具体的 SQL 操作；

```
(4) 关闭 Statement 或者 PreparedStatement；
(5) 关闭 Connection。
```

可以看到，其中只有第 (3) 步是与我们的逻辑有关的，其他的步骤都是基本一样的，GoF 23中的模板模式就非常适用这种情况。实际上，Spring Framework 也是这么做的，它为我们提

```
供了 JdbcTemplate 和 NamedParameterJdbcTemplate 两个模板类，我们可以通过它们
```

进行各种 SQL 操作。

```
接下来，让我们以 JdbcTemplate 为例来了解下如何通过模板类进行增删改查操作。
```

### 6.2.1　查询类操作

```
JdbcTemplate 中提供了很多参数与返回类型的 query 前缀方法，其中，比较常用的是
query() 和 queryForObject()。它们也有很多参数和返回类型，本节中只会介绍其中的
几个，其他的可以通过 JavaDoc 或者 JdbcTemplate 的代码来了解。现在，继续以我们的
```

奶茶店系统为例，演示一下 JDBC 相关的操作。

- 需求描述　假设，顾客进店点饮品，我们需要准备一份菜单，其中包含饮品的名称和价格。此处，需要提供两个查询方法，一个用来查询菜单中的条目总数，当条目总数多的时候，可以让顾客感觉我们店内饮品选择多样化，条目总数少的时候，可以说我们只做精品；另一个用来查询菜单的明细，在启动时打印一下店里的菜单。

```
以第 5 章的 binarytea-endpoint 例子作为基础，我们新建一个 binarytea-jdbc 项目，菜单
```

- 9

```
信息会被保存在名为 t_menu 的表中，并提供相应的接口。
```

- 在项目的 pom.xml 文件依赖中

增加如下内容，分别是 Spring Boot 的 JDBC 依赖、H2 数据库依赖以及 Lombok。

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
   <groupId>com.h2database</groupId>
   <artifactId>h2</artifactId>
   <scope>runtime</scope>
</dependency>
<dependency>
   <groupId>org.projectlombok</groupId>
   <artifactId>lombok</artifactId>
   <optional>true</optional>
</dependency>
```

先为菜单条目创建一个对应的模型（Model）类，其中的内容与数据表结构一一对应。在后续操作时，它可以将查询所得结果转换为这个类型，这样更便于使用，也易于理解，具体见代码示例 6-7。其中，我们通过 Lombok 注解减少了大量方法代码的编写工作。

- 请注意　请务必事先在 IDEA 中安装 Lombok 插件。

```java
代码示例 6-7　MenuItem 类的声明
package learning.spring.binarytea.model;
// 省略 import
@Builder
@Getter
@Setter
@ToString
public class MenuItem {
   private Long id;
   private String name;
   private String size;
   private BigDecimal price; // 暂时用BigDecimal表示金额
   private Date createTime;
   private Date updateTime;
}
主要的查询逻辑都会放在 MenuRepository 中，这个类上添加了 @Repository 注解，用
```

来告诉 Spring 容器这个类要创建 Bean 实例，并且它代表了一个数据仓库（Repository）。容

```
器会自动注入构造方法所需的 JdbcTemplate 实例，我们也可以提供空构造方法，在
jdbcTemplate 的声明上添加 @Autowired，效果是一样的。具体的类声明见代码示例 6-
```

8。

```java
代码示例 6-8　MenuRepository 类的声明
package learning.spring.binarytea.repository;
// 省略import
@Repository
public class MenuRepository {
   private JdbcTemplate jdbcTemplate;
   public MenuRepository(JdbcTemplate jdbcTemplate) {
       this.jdbcTemplate = jdbcTemplate;
   }
   // 几个查询方法待说明
}
要查询的 SQL 只返回一个值，那么可以使用 queryForObject(String sql, Class<T>
requiredType) 方法，例如，代码示例 6-9 会返回表中记录的总数。
代码示例 6-9　统计总数的 countMenuItems() 方法
public long countMenuItems() {
   return jdbcTemplate.queryForObject("select count(*) from t_menu", Long.class)
}
返回的结果有多个字段，可以用 queryForMap() 将它们都放到一个 Map<String,
Object> 中，也可以通过 RowMapper 将字段映射到某个对象上。例如，代码示例 6-10 用
queryForObject(String sql, RowMapper<T> rowMapper, @Nullable
Object... args) 方法查询单条记录，并将字段内容填充进 MenuItem 里。
代码示例 6-10　查询单条记录的 queryForItem() 方法
public MenuItem queryForItem(Long id) {
   return jdbcTemplate.queryForObject("select * from t_menu where id = ?", rowMa
}
private RowMapper<MenuItem> rowMapper() {
   return (resultSet, rowNum) -> {
       return MenuItem.builder()
               .id(resultSet.getLong("id"))
               .name(resultSet.getString("name"))
               .size(resultSet.getString("size"))
               .price(BigDecimal.valueOf(resultSet.getLong("price") / 100.0d))
               .createTime(new Date(resultSet.getDate("create_time").getTime()))
               .updateTime(new Date(resultSet.getDate("update_time").getTime()))
               .build();
   };
}
其中的 RowMapper<MenuItem> 可以直接通过 Lambda 的方式写在方法调用里，但为了能
够复用这个 RowMapper，我们将它单独“抽”了出来。
一个查询操作如果要求返回多条记录，可以使用 query(String sql, RowMapper<T>
rowMapper)。代码示例 6-11 的 queryAllItems() 可以返回全部的菜单内容，其中还用
到了上面定义的 rowMapper()。
代码示例 6-11　返回全部菜单的 queryAllItems()
public List<MenuItem> queryAllItems() {
   return jdbcTemplate.query("select * from t_menu", rowMapper());
}
```

- 10

为了让查询能够正常执行，我们需要为 H2 数据库建表并添加一些初始数据

- ，它们被分别放

在工程 src/resources 目录的 schema.sql 和 data.sql 中，具体内容见代码示例 6-12 与代码示例 6-13。

- 代码示例 6-12　包含表结构定义的 schema.sql

```sql
drop table t_menu if exists;
create table t_menu (
   id bigint auto_increment,
   name varchar(128),
   size varchar(16),
   price bigint,
   create_time timestamp,
   update_time timestamp,
   primary key (id)
);
```

- 代码示例 6-13　包含初始数据的 data.sql

```sql
insert into t_menu (name, size, price, create_time, update_time) values ('Java咖啡
insert into t_menu (name, size, price, create_time, update_time) values ('Java咖啡
为了保证 MenuRepository 类的功能正确，我们需要添加一些单元测试，根据上面构造的数
```

据对方法的调用结果进行判断，就像代码示例 6-14 中演示的那样。

```java
代码示例 6-14　MenuRepositoryTest 中的测试代码
@SpringBootTest
class MenuRepositoryTest {
   @Autowired
   private MenuRepository menuRepository;
   @Test
   void testCountMenuItems() {
       assertEquals(2, menuRepository.countMenuItems());
   }
   @Test
   void testQueryAllItems() {
       List<MenuItem> items = menuRepository.queryAllItems();
       assertNotNull(items);
       assertFalse(items.isEmpty());
       assertEquals(2, items.size());
   }
   @Test
   void testQueryForItem() {
       MenuItem item = menuRepository.queryForItem(1L);
       assertItem(item, 1L, "Java咖啡", "中杯", BigDecimal.valueOf(10.00));
   }
   private void assertItem(MenuItem item, Long id, String name, String size, Big
       assertNotNull(item);
       assertEquals(id, item.getId());
       assertEquals(name, item.getName());
       assertEquals(size, item.getSize());
       assertEquals(price, item.getPrice());
   }
}
```

单元测试中，我们通过各种断言自动验证了方法的返回内容，在自动化测试过程中无须人的介入，并且可以反复执行。断言是单元测试中必不可少的部分，千万不要用“日志输出＋人工观察”的方式。

```
最后，编写启动后输出菜单的逻辑。我们可以通过 ApplicationRunner 来执行打印动作，
如代码示例 6-15 所示。在 MenuPrinterRunner 上添加 Lombok 的 @Slf4j 注解，会自动
生成一个 log 对象，即可用它来打印日志。
代码示例 6-15　MenuPrinterRunner 类代码片段
```

```java
package learning.spring.binarytea.runner;
// 省略import
@Component
@Slf4j
public class MenuPrinterRunner implements ApplicationRunner {
   private final MenuRepository menuRepository;
   public MenuPrinterRunner(MenuRepository menuRepository) {
       this.menuRepository = menuRepository;
   }
   @Override
   public void run(ApplicationArguments args) throws Exception {
       log.info("共有{}个饮品可选。", menuRepository.countMenuItems());
       menuRepository.queryAllItems().forEach(i -> log.info("饮品：{}", i));
   }
}
```

整个程序在运行后，能在日志中找到类似下面这样的内容：

```
2022-02-13 00:01:48.838  INFO 70291 --- [main] l.s.binarytea.runner.MenuPrinterRu
2022-02-13 00:01:48.841  INFO 70291 --- [main] l.s.binarytea.runner.MenuPrinterRu
MenuItem(id=1, name=Java咖啡, size=中杯, price=10.0, createTime=Sun Feb 13 00:00:0
updateTime=Sun Feb 13 00:00:00 CST 2022)
2022-02-13 00:01:48.849 INFO 70291 --- [main] l.s.binarytea.runner.MenuPrinterRun
MenuItem(id=2, name=Java咖啡, size=大杯, price=15.0, createTime=Sun Feb 13 00:00:0
updateTime=Sun Feb 13 00:00:00 CST 2022)
```

### 6.2.2　变更类操作

```sql
JdbcTemplate 的 update() 方法可以用来执行修改类的 SQL 语句，比如 INSERT、
UPDATE 和 DELETE 语句。以插入数据为例，大家可以简单地使用 update(String sql,
@Nullable Object... args) 方法，这个方法的返回值是更新到的记录条数。插入一条
```

菜单内容的代码大概是代码示例 6-16 这样的。

- 代码示例 6-16　插入一条记录

```java
public static final String INSERT_SQL =
       "insert into t_menu (name, size, price, create_time, update_time) values
public int insertItem(MenuItem item) {
   return jdbcTemplate.update(INSERT_SQL, item.getName(),
           item.getSize(), item.getPrice().multiply(BigDecimal.valueOf(100)).lon
}
其中，SQL 语句后的参数顺序对应了 SQL 中 ? 占位符的顺序。在很多时候，数据的 ID 是自
增长的主键，如果我们希望在插入记录后能取得生成的 ID，这时可以使用 KeyHolder 类来
```

持有生成的键。代码类似代码示例 6-17。

- 代码示例 6-17　插入一条记录并填充主键

```sql
public int insertItemAndFillId(MenuItem item) {
   KeyHolder keyHolder = new GeneratedKeyHolder();
   int affected = jdbcTemplate.update(con -> {
       PreparedStatement preparedStatement =
               con.prepareStatement(INSERT_SQL, PreparedStatement.RETURN_GENERAT
       // 也可以用PreparedStatement preparedStatement =
       //            con.prepareStatement(INSERT_SQL, new String[] { "id" });
       preparedStatement.setString(1, item.getName());
       preparedStatement.setString(2, item.getSize());
       preparedStatement.setLong(3, item.getPrice().multiply(BigDecimal.valueOf(
       return preparedStatement;
   }, keyHolder);
   if (affected == 1) {
       item.setId(keyHolder.getKey().longValue());
   }
   return affected;
}
```

```sql
更新与删除操作使用的也是类似的手法，同样也是 update() 方法，例如，代码示例 6-18 将
```

根据主键删除一条菜单项记录。

- 代码示例 6-18　删除一条菜单项记录

```sql
public int deleteItem(Long id) {
   return jdbcTemplate.update("delete from t_menu where id = ?", id);
}
```

上述增加和删除方法的测试会影响表中的记录数量，随机运行会导致对结果判断的不准确，因

```
此需要指定测试的运行顺序。JUnit 5 提供了 @TestMethodOrder 注解来指定操作的执行顺
```

序，可以选择字母序、注解顺序和随机三种。以注解顺序为例，代码大概会是代码示例 6-19这样的。

- 代码示例 6-19　指定了注解顺序的测试代码

```java
@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MenuRepositoryTest {
   @Autowired
   private MenuRepository menuRepository;
   // 省略了其他测试方法
   @Test
   @Order(1)
   void testInsertItem() {
       MenuItem item = MenuItem.builder().name("Go橙汁").size("中杯").price(BigDe
       assertEquals(1, menuRepository.insertItem(item));
       assertNull(item.getId());
       MenuItem queryItem = menuRepository.queryForItem(3L);
       assertItem(queryItem, 3L, "Go橙汁", "中杯", BigDecimal.valueOf(12.00));
       assertEquals(1, menuRepository.insertItemAndFillId(item));
       queryItem = menuRepository.queryForItem(item.getId());
       assertItem(queryItem, 4L, "Go橙汁", "中杯", BigDecimal.valueOf(12.00));
   }
   @Test
   @Order(2)
   void testDelete() {
       assertEquals(1, menuRepository.deleteItem(3L));
       assertEquals(1, menuRepository.deleteItem(2L));
   }
   private void assertItem(MenuItem item, Long id, String name, String size, Big
       assertNotNull(item);
       assertEquals(id, item.getId());
       assertEquals(name, item.getName());
       assertEquals(size, item.getSize());
       assertEquals(price, item.getPrice());
   }
}
在上面的例子里，我们的 SQL 中用到了很多 ?，? 的数量一多，就容易在传参时搞错位置。
Spring Framework 为我们提供了一个 NamedParameterJdbcTemplate 类，其中封装了很
多 JdbcTemplate 的操作。NamedParameterJdbcTemplate 可以为 SQL 中的参数设定
```

名称，然后根据名称进行赋值。Spring Boot 同样为它进行了自动配置，在只有一个或指定了

```
主 JdbcTemplate 的 Bean 时，Spring Boot 就会自动配置一个
NamedParameterJdbcTemplate Bean。我们可以把上面的 insertItem() 修改成代码
```

示例 6-20 这样。

```sql
代码示例 6-20　使用了 NamedParameterJdbcTemplate 的 insertItem() 方法
public int insertItem(MenuItem item) {
   String sql = "insert into t_menu (name, size, price, create_time, update_time
           "(:name, :size, :price, now(), now())";
   MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
   sqlParameterSource.addValue("name", item.getName());
   sqlParameterSource.addValue("size", item.getSize());
   sqlParameterSource.addValue("price", item.getPrice().multiply(BigDecimal.valu
   return namedParameterJdbcTemplate.update(sql, sqlParameterSource);
}
```

在代码示例 6-20 中可以看到，SQL 中的占位符被替换为了具体的参数名称。在执行语句时，

```
通过 SqlParameterSource 来传入参数，这个接口有多种实现，比如上面例子中的
MapSqlParameterSource 会以 Map 的形式来提供参数，
BeanPropertySqlParameterSource 会从 Bean 属性中提取参数。
```

### 6.2.3　批处理操作

在数据处理时，我们经常会遇到需要插入或更新一大批数据的情况。大多数 JDBC 驱动针对批

```
量调用相同 PreparedStatement 的情况都做了特殊优化，所以在 Spring Framework 中也
为批处理操作提供了多个 batchUpdate() 方法，方法的返回是一个 int[]，代表每次执行
```

语句的更新条数。

- 需求描述　二进制奶茶店目前的菜单内容还比较少，一条一条地添加勉强也可以接受，但内容多了之后，完整的操作过程就太慢了，效率也不高。为何不一次性添加一批菜单条目呢？搞个批量操作多好呀！

```
我们可以设计一个批量插入数据的接口，像代码示例 6-21 那样，在 batchUpdate() 方法
中，传入 BatchPreparedStatementSetter 来设置 PreparedStatement 占位符的内
```

容。

- 代码示例 6-21　批量插入方法

```java
public int insertItems(List<MenuItem> items) {
   int[] count = jdbcTemplate.batchUpdate(INSERT_SQL, new BatchPreparedStatement
       @Override
       public void setValues(PreparedStatement ps, int i) throws SQLException {
           MenuItem item = items.get(i);
           ps.setString(1, item.getName());
           ps.setString(2, item.getSize());
           ps.setLong(3, item.getPrice().multiply(BigDecimal.valueOf(100)).longV
       }
       @Override
       public int getBatchSize() {
           return items.size();
       }
   });
   return Arrays.stream(count).sum();
}
```

上述方法的测试代码如代码示例 6-22 所示。我们通过 Java 8 的流式代码创建了 3 个菜单条

```
目，将它们放在一个 List<MenuItem> 中，随后调用 insertItems() 方法，判断是否成
功插入 3 条记录，并逐条验证了每条插入记录的内容。这里设置了 @Order(3) 来控制测试
用例的执行顺序，因为上面插入过几条记录，所以本次新增的记录 ID 从 5 开始。如果是单独
运行 testInsertItems()，那么 ID 要从 3 开始。
代码示例 6-22　MenuRepositoryTest 中关于 insertItems() 的测试代码
@Test
@Order(3)
void testInsertItems() {
   List<MenuItem> items = Stream.of("Go橙汁", "Python气泡水", "JavaScript苏打水")
           .map(n -> MenuItem.builder().name(n).size("中杯").price(BigDecimal.val
           .collect(Collectors.toList());
   assertEquals(3, menuRepository.insertItems(items));
   assertItem(menuRepository.queryForItem(3L), 3L, "Go橙汁", "中杯", BigDecimal.v
   assertItem(menuRepository.queryForItem(4L), 4L, "Python气泡水", "中杯", BigDeci
   assertItem(menuRepository.queryForItem(5L), 5L, "JavaScript苏打水", "中杯", Big
}
batchUpdate() 方法还有其他几种形式，用起来也相对容易些，例如
batchUpdate(String sql, List<Object[]> batchArgs)，Object[] 就是按给定
的顺序替换内容。insertItems() 可以改写成下面这样：
```

```sql
public int insertItems(List<MenuItem> items) {
   List<Object[]> batchArgs = items.stream().map(item -> new Object[]{
           item.getName(), item.getSize(), item.getPrice().multiply(BigDecimal.v
           .collect(Collectors.toList());
   int[] count = jdbcTemplate.batchUpdate(INSERT_SQL, batchArgs);
   return Arrays.stream(count).sum();
}
NamedParameterJdbcTemplate 中也提供了 batchUpdate() 方法，我们能使用
SqlParameterSource 来代表一条对应的内容。辅助类 SqlParameterSourceUtils 中
有一些方法，可以帮我们把一批对象转换为 SqlParameterSource[]。同样的，我们可以
用 NamedParameterJdbcTemplate 来改写 insertItems() 方法：
public int insertItems(List<MenuItem> items) {
   String sql = "insert into t_menu (name, size, price, create_time, update_time
           "(:name, :size, :price * 100, now(), now())";
   int[] count = namedParameterJdbcTemplate.batchUpdate(sql, SqlParameterSourceU
   return Arrays.stream(count).sum();
}
这里我们实际使用的是 BeanPropertySqlParameterSource，从对象中提取属性对应到
SQL 中的命名参数上，price 的类型是 BigDecimal，单位是元，而数据库中我们的单位是
```

分，所以在 SQL 语句中做了些小调整。

### 6.2.4　自动配置说明

```
上文提到 Spring Boot 提供了 JdbcTemplate 和 NamedParameterJdbcTemplate 的自动
```

配置，接下来让我们详细看一下它的具体配置：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass({ DataSource.class, JdbcTemplate.class })
@ConditionalOnSingleCandidate(DataSource.class)
@AutoConfigureAfter(DataSourceAutoConfiguration.class)
@EnableConfigurationProperties(JdbcProperties.class)
@Import({ DatabaseInitializationDependencyConfigurer.class, JdbcTemplateConfigura
NamedParameterJdbcTemplateConfiguration.class })
public class JdbcTemplateAutoConfiguration {}
当 CLASSPATH 中存在 DataSource 和 JdbcTemplate，同时能明确一个主要的
DataSource Bean 时，JdbcTemplateAutoConfiguration 才会生效，而它的配置内容
要看 DatabaseInitializationDependencyConfigurer、
JdbcTemplateConfiguration 和
NamedParameterJdbcTemplateConfiguration，重点是后面两个。
JdbcTemplateConfiguration 会在没有配置 JdbcOperations 的实现 Bean 时生效，
它的作用是提供一个 JdbcTemplate Bean，这个 Bean 会自动注入现有的 DataSource，
并将 spring.jdbc.template.* 的配置项内容设置进来，相关配置及其说明见表 6-6。
```

表 6-6　spring.jdbc.template.* 的配置项

配置项

- 默认值说明

```
每次从数据库获取的记录条数，-1
spring.jdbc.template.fetch-size
-1
```

- 默认值

- 一次查询可获取的最大记录条数，

```
spring.jdbc.template.max-rows
-1
```

- 的默认值

- 查询的超时时间，没有配置的话使用

```
spring.jdbc.template.query-timeout
```

- 认值，如果没有加时间单位，默认为

```
NamedParameterJdbcTemplateConfiguration 则比较简单，在能确定一个主要的
JdbcTemplate，同时又没有手动配置 NamedParameterJdbcOperations Bean 时，自
动创建一个 NamedParameter-JdbcTemplate Bean，并将 JdbcTemplate 注入其中。
```

```
如果我们不希望 Spring Boot 为我们做自动配置，只需要自己创建一个 JdbcTemplate 就可
```

以了，比如像下面这样：

```
@Bean
public JdbcTemplate jdbcTemplate(DataSource dataSource) {
   return new JdbcTemplate(dataSource);
}
```

[1]：这个示例位于 ch6/raw-jdbc-demo 项目中。[2]：这个示例位于 ch6/datasource-demo 项目中。[3]：这个示例位于 ch6/druid-datasource-demo 项目中。[4]：H2 也支持将数据保存在文件中，或者以独立进程的方式提供服务。[5]：从 Spring Boot 2.5 开始，与初始化相关的配置项都移到了 下，表 6-4 中列出了新旧配置项。[7]：这个部分的示例在 ch6/mysql-datasource-demo 项目中。[8]：Docker 有一个官方的仓库，即 Docker Hub，我们可以在其中找到所需的镜像，一般由软件官方提供的镜像在页面上都会有一

- 些使用说明，比如 MySQL（_/mysql）的官方仓库中就有详细的命令解释。从 Docker Hub 下载镜像（image）有时会比较慢，在国内可以考虑使用阿里云、腾讯云或中科大的国内镜像（mirror）站点。

[9]：整个例子放在 ch6/binarytea-jdbc 项目中。[10]：这里用的都是 H2 的 SQL 语法，会与标准 SQL 有细微差异。
