# 附录A从SpringBoot2.升级到3.0

截至本书编写时，Spring Framework 和 Spring Boot 都分别发布了 6.0.0-M3 和 3.0.0-M2 版本，这是大版本正式发布前的里程碑版本，预计正式版本将在 2022 年底发布。届时，我们将会面临是否要使用新版本进行开发，或者是否要对现有系统进行升级的问题。所以在本书的附录部分，介绍一下与升级有关的内容。

## A.1 升级判断标准

先来回答第一个问题——要不要使用新版本呢？我们可以从以下几个角度来衡量。

- 能否使用 Java 17 版本。从 Spring Framework 6 开始，支持的最低版本就是 Java 17，如果无法满足这条硬性要求，那就不用考虑其他问题了。1

- 组织上是否有统一的安排。例如很多公司都有负责框架等组件的中间件团队，对于内部使用的框架都有一定要求，那应该遵循公司标准进行版本选型。

- 框架及系统周边的生态是否提供了完整的支持。在开发过程中除了 Spring 家族的一系列组件，还会用到很多东西，这些组件或设施是否能够满足新版本的最低要求，能否提供一定的兼容性是需要进行评估的。

- 是否有比较重的技术债。大版本升级不是没有成本的，此次升级就涉及了不少代码的修改。一些老系统本身就非常复杂，再对系统进行基础组件升级会带来很多不确定性。

对于大部分系统来说，满足业务需求会比使用新技术重要得多，所以如果没有很强烈的诉求，可以不用急着去升级。但如果条件允许，又有使用新版本的意愿，那可以按照官方的指引，结合实际系统情况进行升级或者从零开始搭建新系统。

## A.2 升级操作

这部分我们仍然会用二进制奶茶店的例子来做演示，将它从 Spring Boot 2.6.3 升级到 SpringBoot 3.0.0-M2，同时将 Spring Boot 底层依赖的 Spring Framework 从 5.3.15 升级到 6.0.0-

- 2

M3。在开始项目升级之前，记得先安装好 JDK 17。

- 请注意 目前 Spring Cloud 2021.0.x 还只能兼容到 Spring Boot 2.6.x 版本，相关组件还不能完全适配 Spring Boot 3.0.0-M2。这是上文提到的周边生态的支持尚不完善的例子。所以我们在演示时会使用第 10 章的 binarytea-jwt-auth 和 customer-jwt-auth 作为基础来进行升级。

### A.2.1 依赖组件升级

升级的第一步就是在 pom.xml 中升级所依赖的各个组件的版本，其实主要是升级 Spring Boot

- 3

```
，我们将 <parent/>
```

的版本，这样就能间接完成大部分依赖的升级，如代码示例 A-1 所示中的版本修改为 3.0.0-M2。由于 Spring Framework 6.0 的最低 Java 版本要求是 17，所以将

```
java.version 改为 17。
```

- 代码示例 A-1 pom.xml 中的 Spring Boot 版本配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/x
<modelVersion>4.0.0</modelVersion>
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>3.0.0-M2</version>
<relativePath/> <!-- lookup parent from repository -->
</parent>
<groupId>learning.spring</groupId>
<artifactId>binarytea</artifactId>
<version>0.0.1-SNAPSHOT</version>
<name>BinaryTea</name>
<description>BinaryTea Service</description>
<properties>
<java.version>17</java.version>
</properties>
<!-- 省略部分内容 -->
</project>
```

第二步是调整非 Spring Boot 管理依赖项的版本，在 BinaryTea 工程中，主要是我们用到的Jadira UserType 和 Jackson DataType，如代码示例 A-2 所示。

- 代码示例 A-2 pom.xml 中的依赖版本

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/x
<!-- 省略部分内容 -->
<dependencies>
<dependency>
<groupId>org.jadira.usertype</groupId>
<artifactId>usertype.core</artifactId>
<version>7.0.0.CR1</version>
</dependency>
<dependency>
<groupId>com.fasterxml.jackson.datatype</groupId>
<artifactId>jackson-datatype-joda-money</artifactId>
<version>2.13.2</version>
</dependency>
<dependency>
<groupId>com.fasterxml.jackson.datatype</groupId>
<artifactId>jackson-datatype-hibernate5-jakarta</artifactId>
<version>2.13.2</version>
</dependency>
<!-- 省略部分内容 -->
</dependencies>
<!-- 省略部分内容 -->
</project>
```

usertype.core 6.0.1.GA 不支持 Java 17，启动时就会报错，需要升级到 7.0.0.CR1。此外，老版本中还会依赖 Hibernate，在 Jakarta EE 9 下，需要排除这个依赖，不过 7.0.0.CR1 中没有这个依赖。Jackson DataType 的版本主要跟随 Spring Boot 中的 Jackson JSON 版本而定，这里就需要升级到 2.13.2。

- 请注意 由于 Jakarta EE 9 中更换了大量 API 和注解的包名，所以在这次版本升级后，很多

```
组件都要做针对性的适配，至少也要适配 javax 包名到 jakarta 包名的变化。很多组件
给出了带 -jakarta 后缀的 ArtifactId，例如 Hibernate Core 就有 hibernate-core-
```

- jakarta，Spring Boot Data JPA 已经调整了依赖项，而对应的 Jackson DataType 就有jackson-datatype-hibernate5-jakarta。Tomcat 10 支持 Jakarta EE 9，tomcat-embed-core

```
的 10.0.18 包里就直接内置了 jakarta.servlet 的包。
```

最后，由于我们还在使用 Milestone 版本的 Spring Boot，所以需要额外配置 Spring 的 Maven仓库，具体如代码示例 A-3 所示。

- 代码示例 A-3 pom.xml 中的仓库配置

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/x
<!-- 省略部分内容 -->
<repositories>
<repository>
<id>spring-milestones</id>
<name>Spring Milestones</name>
<url>https://repo.spring.io/milestone</url>
<snapshots>
<enabled>false</enabled>
</snapshots>
</repository>
</repositories>
<pluginRepositories>
<pluginRepository>
<id>spring-milestones</id>
<name>Spring Milestones</name>
<url>https://repo.spring.io/milestone</url>
<snapshots>
<enabled>false</enabled>
</snapshots>
</pluginRepository>
</pluginRepositories>
</project>
```

### A.2.2 代码修改

```
在升级到了 Jakarta EE 9 的前提下，原先很多以 javax 打头的包名都需要调整为以
jakarta 打头的包名，虽然 Spring Boot 兼容了一部分新老包名，但仍有一些代码需要调
整，至少需要重新 import 代码。例如，JSR 202 Java Persistence API（JPA）的注解需要
```

调整，JSR 303 Java Validation API 的注解也需要调整。

```
我们从 Web 层开始往下逐层调整代码。在 Controller 类中，我们用到了 JSR 315 Java
Servlet 和 JSR 303 Java Validation API，以 MenuController 和 NewOrderForm 为例，
再加上 JwtAuthenticationFilter 中涉及的代码，需要改动的 import 内容如表 A-1 所
```

- 4

示。

表 A-1 Web 层要调整的 import 内容

调整前

- 调整后

```
javax.servlet.http.HttpServletRequest
jakarta.servlet.http.HttpSer
jakarta.servlet.http.HttpSer
javax.servlet.http.HttpServletResponse
e
javax.validation.Valid
jakarta.validation.Valid
javax.validation.constraints.Max
jakarta.validation.constrain
javax.validation.constraints.Min
jakarta.validation.constrain
javax.validation.constraints.NotEmpty
jakarta.validation.constrain
在 Service 层里，主要添加了 @Transactional 注解，它属于 JSR 907 Java Transaction
API（JTA），import 需要从 javax.transaction.Transactional 调整为
jakarta.transaction.Transactional。
到了 Model 层的 MenuItem、Order 和 Amount 类上，我们使用了大量的 JPA 注解，具体
```

的对应关系如表 A-2 所示。在单元测试中也有用到 JPA 注解，需要一并调整。

表 A-2 Model 层要调整的 import 内容调整前

- 调整后

```
javax.persistence.Column
jakarta.persistence.Column
javax.persistence.Embeddable
jakarta.persistence.Embeddable
javax.persistence.Entity
jakarta.persistence.Entity
javax.persistence.EnumType
jakarta.persistence.EnumType
javax.persistence.Enumerated
jakarta.persistence.Enumerated
javax.persistence.FetchType
jakarta.persistence.FetchType
javax.persistence.GeneratedValue
jakarta.persistence.GeneratedValue
javax.persistence.GenerationType
jakarta.persistence.GenerationType
javax.persistence.Id
jakarta.persistence.Id
javax.persistence.JoinColumn
jakarta.persistence.JoinColumn
javax.persistence.JoinTable
jakarta.persistence.JoinTable
javax.persistence.ManyToMany
jakarta.persistence.ManyToMany
javax.persistence.ManyToOne
jakarta.persistence.ManyToOne
javax.persistence.OneToMany
jakarta.persistence.OneToMany
javax.persistence.OrderBy
jakarta.persistence.OrderBy
javax.persistence.Table
jakarta.persistence.Table
javax.persistence.Temporal
jakarta.persistence.Temporal
javax.persistence.TemporalType
jakarta.persistence.TemporalType
```

```
在 Customer 项目中也要做类似的调整，在 JwtClientHttpRequestInitializer 中还用
到了 @PostConstruct 注解，它属于 JSR 250，需要从
javax.annotation.PostConstruct 调整为
jakarta.annotation.PostConstruct。
请注意 在 BinaryTea 的 OrderRepositoryTest 测试类中，执行到
testFindByMaker_NameLikeOrderByUpdateTimeDescId() 测试时会抛出如下的异
```

- 常：

```
org.springframework.dao.InvalidDataAccessApiUsageException: Parameter value [%l
1
```

- 这是 Hibernate 5.6.6 和 5.6.7 中的一个已知缺陷，Hibernate 官方问题号是 HHH-15142，

```
Spring Data JPA 的问题号是 2472。在 CriteriaQuery 中包含 like 谓语，且带有模式
参数和转义符时，重复执行 entityManager.createQuery() 来创建该
CriteriaQuery 就会抛出 IllegalArgumentException。
```

- 由于本书的示例选择了 Spring Boot 3.0.0-M2 来做演示，spring-boot-starter-data-jpa 依赖了 5.6.7.Final 的 hibernate-core-jakarta，所以有机会遇到这个缺陷，可以考虑将 Hibernate5降级到 5.6.5，或者等待官方提供补丁，升级到新版本。

[1]：根据 JetBrains 的《2021 年开发人员生态系统》报告，2021 年使用占比最高的 Java 版本仍然是 Java 8，其次是 Java 11。[2]：通过 SDKMAN 就可以方便地选择不同发行版的 Java 17 进行安装，也可以选择从网上下载安装包进行安装。[3]：附录 A 中的例子都在 app1/binarytea 和 app1/customer 项目中。[4]：这里列出的并不是 JSR 涉及的所有内容，只是我们二进制奶茶店项目中用到的内容，如果在工作中遇到 包里的其他东西，也请

- 一并调整为 包的。

[5]：也许到了 Spring Boot 3.0.0 正式版发布时就已经不存在该问题了。
