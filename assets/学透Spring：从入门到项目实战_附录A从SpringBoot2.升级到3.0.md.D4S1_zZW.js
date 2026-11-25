import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"附录A从SpringBoot2.升级到3.0","description":"","frontmatter":{},"headers":[{"level":2,"title":"A.1 升级判断标准","slug":"a-1-升级判断标准","link":"#a-1-升级判断标准","children":[]},{"level":2,"title":"A.2 升级操作","slug":"a-2-升级操作","link":"#a-2-升级操作","children":[{"level":3,"title":"A.2.1 依赖组件升级","slug":"a-2-1-依赖组件升级","link":"#a-2-1-依赖组件升级","children":[]},{"level":3,"title":"A.2.2 代码修改","slug":"a-2-2-代码修改","link":"#a-2-2-代码修改","children":[]}]}],"relativePath":"学透Spring：从入门到项目实战/附录A从SpringBoot2.升级到3.0.md","filePath":"学透Spring：从入门到项目实战/附录A从SpringBoot2.升级到3.0.md","lastUpdated":1795556072000}'),t={name:"学透Spring：从入门到项目实战/附录A从SpringBoot2.升级到3.0.md"};function e(l,s,r,o,h,c){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="附录a从springboot2-升级到3-0" tabindex="-1">附录A从SpringBoot2.升级到3.0 <a class="header-anchor" href="#附录a从springboot2-升级到3-0" aria-label="Permalink to &quot;附录A从SpringBoot2.升级到3.0&quot;">​</a></h1><p>截至本书编写时，Spring Framework 和 Spring Boot 都分别发布了 6.0.0-M3 和 3.0.0-M2 版本，这是大版本正式发布前的里程碑版本，预计正式版本将在 2022 年底发布。届时，我们将会面临是否要使用新版本进行开发，或者是否要对现有系统进行升级的问题。所以在本书的附录部分，介绍一下与升级有关的内容。</p><h2 id="a-1-升级判断标准" tabindex="-1">A.1 升级判断标准 <a class="header-anchor" href="#a-1-升级判断标准" aria-label="Permalink to &quot;A.1 升级判断标准&quot;">​</a></h2><p>先来回答第一个问题——要不要使用新版本呢？我们可以从以下几个角度来衡量。</p><ul><li><p>能否使用 Java 17 版本。从 Spring Framework 6 开始，支持的最低版本就是 Java 17，如果无法满足这条硬性要求，那就不用考虑其他问题了。1</p></li><li><p>组织上是否有统一的安排。例如很多公司都有负责框架等组件的中间件团队，对于内部使用的框架都有一定要求，那应该遵循公司标准进行版本选型。</p></li><li><p>框架及系统周边的生态是否提供了完整的支持。在开发过程中除了 Spring 家族的一系列组件，还会用到很多东西，这些组件或设施是否能够满足新版本的最低要求，能否提供一定的兼容性是需要进行评估的。</p></li><li><p>是否有比较重的技术债。大版本升级不是没有成本的，此次升级就涉及了不少代码的修改。一些老系统本身就非常复杂，再对系统进行基础组件升级会带来很多不确定性。</p></li></ul><p>对于大部分系统来说，满足业务需求会比使用新技术重要得多，所以如果没有很强烈的诉求，可以不用急着去升级。但如果条件允许，又有使用新版本的意愿，那可以按照官方的指引，结合实际系统情况进行升级或者从零开始搭建新系统。</p><h2 id="a-2-升级操作" tabindex="-1">A.2 升级操作 <a class="header-anchor" href="#a-2-升级操作" aria-label="Permalink to &quot;A.2 升级操作&quot;">​</a></h2><p>这部分我们仍然会用二进制奶茶店的例子来做演示，将它从 Spring Boot 2.6.3 升级到 SpringBoot 3.0.0-M2，同时将 Spring Boot 底层依赖的 Spring Framework 从 5.3.15 升级到 6.0.0-</p><ul><li>2</li></ul><p>M3。在开始项目升级之前，记得先安装好 JDK 17。</p><ul><li>请注意 目前 Spring Cloud 2021.0.x 还只能兼容到 Spring Boot 2.6.x 版本，相关组件还不能完全适配 Spring Boot 3.0.0-M2。这是上文提到的周边生态的支持尚不完善的例子。所以我们在演示时会使用第 10 章的 binarytea-jwt-auth 和 customer-jwt-auth 作为基础来进行升级。</li></ul><h3 id="a-2-1-依赖组件升级" tabindex="-1">A.2.1 依赖组件升级 <a class="header-anchor" href="#a-2-1-依赖组件升级" aria-label="Permalink to &quot;A.2.1 依赖组件升级&quot;">​</a></h3><p>升级的第一步就是在 pom.xml 中升级所依赖的各个组件的版本，其实主要是升级 Spring Boot</p><ul><li>3</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>，我们将 &lt;​parent/&gt;</span></span></code></pre></div><p>的版本，这样就能间接完成大部分依赖的升级，如代码示例 A-1 所示中的版本修改为 3.0.0-M2。由于 Spring Framework 6.0 的最低 Java 版本要求是 17，所以将</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java.version 改为 17。</span></span></code></pre></div><ul><li>代码示例 A-1 pom.xml 中的 Spring Boot 版本配置</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;?</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">xml</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> encoding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;UTF-8&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">?&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 https://maven.apache.org/x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​modelVersion&gt;4.0.0&lt;​/modelVersion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​parent&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​groupId&gt;org.springframework.boot&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​artifactId&gt;spring-boot-starter-parent&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​version&gt;3.0.0-M2&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​relativePath/&gt; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- lookup parent from repository --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/parent&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​groupId&gt;learning.spring&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​artifactId&gt;binarytea&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​version&gt;0.0.1-SNAPSHOT&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​name&gt;BinaryTea&lt;​/name&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​description&gt;BinaryTea Service&lt;​/description&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​properties&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​java.version&gt;17&lt;​/java.version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/properties&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 省略部分内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/project&gt;</span></span></code></pre></div><p>第二步是调整非 Spring Boot 管理依赖项的版本，在 BinaryTea 工程中，主要是我们用到的Jadira UserType 和 Jackson DataType，如代码示例 A-2 所示。</p><ul><li>代码示例 A-2 pom.xml 中的依赖版本</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;?</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">xml</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> encoding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;UTF-8&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">?&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 https://maven.apache.org/x</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 省略部分内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependencies&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​groupId&gt;org.jadira.usertype&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​artifactId&gt;usertype.core&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​version&gt;7.0.0.CR1&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​groupId&gt;com.fasterxml.jackson.datatype&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​artifactId&gt;jackson-datatype-joda-money&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​version&gt;2.13.2&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​groupId&gt;com.fasterxml.jackson.datatype&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​artifactId&gt;jackson-datatype-hibernate5-jakarta&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​version&gt;2.13.2&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 省略部分内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependencies&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 省略部分内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/project&gt;</span></span></code></pre></div><p>usertype.core 6.0.1.GA 不支持 Java 17，启动时就会报错，需要升级到 7.0.0.CR1。此外，老版本中还会依赖 Hibernate，在 Jakarta EE 9 下，需要排除这个依赖，不过 7.0.0.CR1 中没有这个依赖。Jackson DataType 的版本主要跟随 Spring Boot 中的 Jackson JSON 版本而定，这里就需要升级到 2.13.2。</p><ul><li>请注意 由于 Jakarta EE 9 中更换了大量 API 和注解的包名，所以在这次版本升级后，很多</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>组件都要做针对性的适配，至少也要适配 javax 包名到 jakarta 包名的变化。很多组件</span></span>
<span class="line"><span>给出了带 -jakarta 后缀的 ArtifactId，例如 Hibernate Core 就有 hibernate-core-</span></span></code></pre></div><ul><li>jakarta，Spring Boot Data JPA 已经调整了依赖项，而对应的 Jackson DataType 就有jackson-datatype-hibernate5-jakarta。Tomcat 10 支持 Jakarta EE 9，tomcat-embed-core</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>的 10.0.18 包里就直接内置了 jakarta.servlet 的包。</span></span></code></pre></div><p>最后，由于我们还在使用 Milestone 版本的 Spring Boot，所以需要额外配置 Spring 的 Maven仓库，具体如代码示例 A-3 所示。</p><ul><li>代码示例 A-3 pom.xml 中的仓库配置</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 https://maven.apache.org/x</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 省略部分内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​repositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​repository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​id&gt;spring-milestones&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​name&gt;Spring Milestones&lt;​/name&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​url&gt;https://repo.spring.io/milestone&lt;​/url&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​snapshots&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​enabled&gt;false&lt;​/enabled&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/snapshots&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/repository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/repositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pluginRepositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pluginRepository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​id&gt;spring-milestones&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​name&gt;Spring Milestones&lt;​/name&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​url&gt;https://repo.spring.io/milestone&lt;​/url&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​snapshots&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​enabled&gt;false&lt;​/enabled&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/snapshots&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/pluginRepository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/pluginRepositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/project&gt;</span></span></code></pre></div><h3 id="a-2-2-代码修改" tabindex="-1">A.2.2 代码修改 <a class="header-anchor" href="#a-2-2-代码修改" aria-label="Permalink to &quot;A.2.2 代码修改&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在升级到了 Jakarta EE 9 的前提下，原先很多以 javax 打头的包名都需要调整为以</span></span>
<span class="line"><span>jakarta 打头的包名，虽然 Spring Boot 兼容了一部分新老包名，但仍有一些代码需要调</span></span>
<span class="line"><span>整，至少需要重新 import 代码。例如，JSR 202 Java Persistence API（JPA）的注解需要</span></span></code></pre></div><p>调整，JSR 303 Java Validation API 的注解也需要调整。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我们从 Web 层开始往下逐层调整代码。在 Controller 类中，我们用到了 JSR 315 Java</span></span>
<span class="line"><span>Servlet 和 JSR 303 Java Validation API，以 MenuController 和 NewOrderForm 为例，</span></span>
<span class="line"><span>再加上 JwtAuthenticationFilter 中涉及的代码，需要改动的 import 内容如表 A-1 所</span></span></code></pre></div><ul><li>4</li></ul><p>示。</p><p>表 A-1 Web 层要调整的 import 内容</p><p>调整前</p><ul><li>调整后</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>javax.servlet.http.HttpServletRequest</span></span>
<span class="line"><span>jakarta.servlet.http.HttpSer</span></span>
<span class="line"><span>jakarta.servlet.http.HttpSer</span></span>
<span class="line"><span>javax.servlet.http.HttpServletResponse</span></span>
<span class="line"><span>e</span></span>
<span class="line"><span>javax.validation.Valid</span></span>
<span class="line"><span>jakarta.validation.Valid</span></span>
<span class="line"><span>javax.validation.constraints.Max</span></span>
<span class="line"><span>jakarta.validation.constrain</span></span>
<span class="line"><span>javax.validation.constraints.Min</span></span>
<span class="line"><span>jakarta.validation.constrain</span></span>
<span class="line"><span>javax.validation.constraints.NotEmpty</span></span>
<span class="line"><span>jakarta.validation.constrain</span></span>
<span class="line"><span>在 Service 层里，主要添加了 @Transactional 注解，它属于 JSR 907 Java Transaction</span></span>
<span class="line"><span>API（JTA），import 需要从 javax.transaction.Transactional 调整为</span></span>
<span class="line"><span>jakarta.transaction.Transactional。</span></span>
<span class="line"><span>到了 Model 层的 MenuItem、Order 和 Amount 类上，我们使用了大量的 JPA 注解，具体</span></span></code></pre></div><p>的对应关系如表 A-2 所示。在单元测试中也有用到 JPA 注解，需要一并调整。</p><p>表 A-2 Model 层要调整的 import 内容调整前</p><ul><li>调整后</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>javax.persistence.Column</span></span>
<span class="line"><span>jakarta.persistence.Column</span></span>
<span class="line"><span>javax.persistence.Embeddable</span></span>
<span class="line"><span>jakarta.persistence.Embeddable</span></span>
<span class="line"><span>javax.persistence.Entity</span></span>
<span class="line"><span>jakarta.persistence.Entity</span></span>
<span class="line"><span>javax.persistence.EnumType</span></span>
<span class="line"><span>jakarta.persistence.EnumType</span></span>
<span class="line"><span>javax.persistence.Enumerated</span></span>
<span class="line"><span>jakarta.persistence.Enumerated</span></span>
<span class="line"><span>javax.persistence.FetchType</span></span>
<span class="line"><span>jakarta.persistence.FetchType</span></span>
<span class="line"><span>javax.persistence.GeneratedValue</span></span>
<span class="line"><span>jakarta.persistence.GeneratedValue</span></span>
<span class="line"><span>javax.persistence.GenerationType</span></span>
<span class="line"><span>jakarta.persistence.GenerationType</span></span>
<span class="line"><span>javax.persistence.Id</span></span>
<span class="line"><span>jakarta.persistence.Id</span></span>
<span class="line"><span>javax.persistence.JoinColumn</span></span>
<span class="line"><span>jakarta.persistence.JoinColumn</span></span>
<span class="line"><span>javax.persistence.JoinTable</span></span>
<span class="line"><span>jakarta.persistence.JoinTable</span></span>
<span class="line"><span>javax.persistence.ManyToMany</span></span>
<span class="line"><span>jakarta.persistence.ManyToMany</span></span>
<span class="line"><span>javax.persistence.ManyToOne</span></span>
<span class="line"><span>jakarta.persistence.ManyToOne</span></span>
<span class="line"><span>javax.persistence.OneToMany</span></span>
<span class="line"><span>jakarta.persistence.OneToMany</span></span>
<span class="line"><span>javax.persistence.OrderBy</span></span>
<span class="line"><span>jakarta.persistence.OrderBy</span></span>
<span class="line"><span>javax.persistence.Table</span></span>
<span class="line"><span>jakarta.persistence.Table</span></span>
<span class="line"><span>javax.persistence.Temporal</span></span>
<span class="line"><span>jakarta.persistence.Temporal</span></span>
<span class="line"><span>javax.persistence.TemporalType</span></span>
<span class="line"><span>jakarta.persistence.TemporalType</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在 Customer 项目中也要做类似的调整，在 JwtClientHttpRequestInitializer 中还用</span></span>
<span class="line"><span>到了 @PostConstruct 注解，它属于 JSR 250，需要从</span></span>
<span class="line"><span>javax.annotation.PostConstruct 调整为</span></span>
<span class="line"><span>jakarta.annotation.PostConstruct。</span></span>
<span class="line"><span>请注意 在 BinaryTea 的 OrderRepositoryTest 测试类中，执行到</span></span>
<span class="line"><span>testFindByMaker_NameLikeOrderByUpdateTimeDescId() 测试时会抛出如下的异</span></span></code></pre></div><ul><li>常：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>org.springframework.dao.InvalidDataAccessApiUsageException: Parameter value [%l</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>这是 Hibernate 5.6.6 和 5.6.7 中的一个已知缺陷，Hibernate 官方问题号是 HHH-15142，</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Spring Data JPA 的问题号是 2472。在 CriteriaQuery 中包含 like 谓语，且带有模式</span></span>
<span class="line"><span>参数和转义符时，重复执行 entityManager.createQuery() 来创建该</span></span>
<span class="line"><span>CriteriaQuery 就会抛出 IllegalArgumentException。</span></span></code></pre></div><ul><li>由于本书的示例选择了 Spring Boot 3.0.0-M2 来做演示，spring-boot-starter-data-jpa 依赖了 5.6.7.Final 的 hibernate-core-jakarta，所以有机会遇到这个缺陷，可以考虑将 Hibernate5降级到 5.6.5，或者等待官方提供补丁，升级到新版本。</li></ul><p>[1]：根据 JetBrains 的《2021 年开发人员生态系统》报告，2021 年使用占比最高的 Java 版本仍然是 Java 8，其次是 Java 11。[2]：通过 SDKMAN 就可以方便地选择不同发行版的 Java 17 进行安装，也可以选择从网上下载安装包进行安装。[3]：附录 A 中的例子都在 app1/binarytea 和 app1/customer 项目中。[4]：这里列出的并不是 JSR 涉及的所有内容，只是我们二进制奶茶店项目中用到的内容，如果在工作中遇到 包里的其他东西，也请</p><ul><li>一并调整为 包的。</li></ul><p>[5]：也许到了 Spring Boot 3.0.0 正式版发布时就已经不存在该问题了。</p>`,53)])])}const d=a(t,[["render",e]]);export{g as __pageData,d as default};
