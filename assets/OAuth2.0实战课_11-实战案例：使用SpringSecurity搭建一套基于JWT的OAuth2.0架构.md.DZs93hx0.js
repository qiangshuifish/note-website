import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"11 | 实战案例：使用Spring Security搭建一套基于JWT的OAuth 2.0架构","description":"","frontmatter":{},"headers":[{"level":2,"title":"项目准备工作","slug":"项目准备工作","link":"#项目准备工作","children":[]},{"level":2,"title":"搭建授权服务器","slug":"搭建授权服务器","link":"#搭建授权服务器","children":[]},{"level":2,"title":"搭建受保护资源服务器","slug":"搭建受保护资源服务器","link":"#搭建受保护资源服务器","children":[]},{"level":2,"title":"初始化数据配置","slug":"初始化数据配置","link":"#初始化数据配置","children":[]},{"level":2,"title":"演示三种授权许可类型","slug":"演示三种授权许可类型","link":"#演示三种授权许可类型","children":[{"level":3,"title":"资源拥有者凭据许可类型","slug":"资源拥有者凭据许可类型","link":"#资源拥有者凭据许可类型","children":[]},{"level":3,"title":"客户端授权许可类型","slug":"客户端授权许可类型","link":"#客户端授权许可类型","children":[]},{"level":3,"title":"授权码许可类型","slug":"授权码许可类型","link":"#授权码许可类型","children":[]}]},{"level":2,"title":"演示权限控制","slug":"演示权限控制","link":"#演示权限控制","children":[]},{"level":2,"title":"搭建客户端程序","slug":"搭建客户端程序","link":"#搭建客户端程序","children":[]},{"level":2,"title":"演示单点登录","slug":"演示单点登录","link":"#演示单点登录","children":[]},{"level":2,"title":"演示客户端请求资源服务器资源","slug":"演示客户端请求资源服务器资源","link":"#演示客户端请求资源服务器资源","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"OAuth2.0实战课/11-实战案例：使用SpringSecurity搭建一套基于JWT的OAuth2.0架构.md","filePath":"OAuth2.0实战课/11-实战案例：使用SpringSecurity搭建一套基于JWT的OAuth2.0架构.md","lastUpdated":1779816079000}'),t={name:"OAuth2.0实战课/11-实战案例：使用SpringSecurity搭建一套基于JWT的OAuth2.0架构.md"};function l(i,a,c,o,r,u){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_11-实战案例-使用spring-security搭建一套基于jwt的oauth-2-0架构" tabindex="-1">11 | 实战案例：使用Spring Security搭建一套基于JWT的OAuth 2.0架构 <a class="header-anchor" href="#_11-实战案例-使用spring-security搭建一套基于jwt的oauth-2-0架构" aria-label="Permalink to &quot;11 | 实战案例：使用Spring Security搭建一套基于JWT的OAuth 2.0架构&quot;">​</a></h1><p>你好，我朱晔，是 <a href="https://time.geekbang.org/column/intro/294" target="_blank" rel="noreferrer">《Java业务开发常见错误100例》</a> 专栏课程的作者。</p><p>《OAuth 2.0实战课》上线之后，我也第一时间关注了这门课。在开篇词中，我看到有一些同学留言问道：“如何使用Spring Security来实现OAuth 2.0？”这时，我想到之前自己写过一篇相关的文章，于是就直接在开篇词下留了言。后面我很快收到了不少用户的点赞和肯定，紧接着极客时间编辑也邀请我从自己的角度为专栏写篇加餐。好吧，功不唐捐，于是我就将之前我写的那篇老文章再次迭代、整理为今天的这一讲内容，希望可以帮助你掌握OAuth 2.0。</p><p>如果你熟悉Spring Security的话，肯定知道它因为功能多、组件抽象程度高、配置方式多样，导致了强大且复杂的特性。也因此，Spring Security的学习成本几乎是Spring家族中最高的。但不仅于此，在结合实际的复杂业务场景使用Spring Security时，我们还要去理解一些组件的工作原理和流程，不然需要自定义和扩展框架的时候就会手足无措。这就让使用Spring Security的门槛更高了。</p><p>因此，在决定使用Spring Security搭建整套安全体系（授权、认证、权限、审计）之前，我们还需要考虑的是：将来我们的业务会多复杂，徒手写一套安全体系来得划算，还是使用Spring Security更好？我相信，这也是王老师给出课程配套代码中，并没有使用Spring Security来演示OAuth 2.0流程的原因之一。</p><p>反过来说，如果你的应用已经使用了Spring Security来做鉴权、认证和权限管理的话，那么仍然使用Spring Security来实现OAuth的成本是很低的。而且，在学习了OAuth 2.0的流程打下扎实的基础之后，我们再使用Spring Security来配置OAuth 2.0就不会那么迷茫了。这也是我在工作中使用Spring Security来实现OAuth 2.0的直观感受。</p><p>所以，我就结合自己的实践和积累，带你使用Spring Security来一步一步地搭建一套基于JWT的OAuth 2.0授权体系。这些内容会涉及OAuth 2.0的三角色（客户端、授权服务、受保护资源），以及资源拥有者凭据许可、客户端凭据许可和授权码许可这三种常用的授权许可类型（隐式许可类型，不太安全也不太常用）。同时，我还会演示OAuth 2.0的权限控制，以及使用OAuth 2.0实现SSO单点登录体系。</p><p>这样一来，今天这一讲涉及到的流程就会比较多，内容也会很长。不过不用担心，我会手把手带你从零开始，完成整个程序的搭建，并给出所有流程的演示。</p><h2 id="项目准备工作" tabindex="-1">项目准备工作 <a class="header-anchor" href="#项目准备工作" aria-label="Permalink to &quot;项目准备工作&quot;">​</a></h2><p>实战之前，我们先来搭建项目父依赖和初始化数据库结构，为后面具体的编码做准备。</p><p>首先，我们来创建一个父POM，内含三个模块：</p><ul><li>springsecurity101-cloud-oauth2-client，用来扮演客户端角色；</li><li>springsecurity101-cloud-oauth2-server，用来扮演授权服务器角色；</li><li>springsecurity101-cloud-oauth2-userservice，是用户服务，用来扮演资源提供者角色。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;project xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;modelVersion&amp;gt;4.0.0&amp;lt;/modelVersion&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;me.josephzhu&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;springsecurity101&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;packaging&amp;gt;pom&amp;lt;/packaging&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;version&amp;gt;1.0-SNAPSHOT&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;parent&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;artifactId&amp;gt;spring-boot-starter-parent&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;version&amp;gt;2.2.1.RELEASE&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;relativePath/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/parent&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;modules&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;module&amp;gt;springsecurity101-cloud-oauth2-client&amp;lt;/module&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;module&amp;gt;springsecurity101-cloud-oauth2-server&amp;lt;/module&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;module&amp;gt;springsecurity101-cloud-oauth2-userservice&amp;lt;/module&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/modules&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;properties&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;project.build.sourceEncoding&amp;gt;UTF-8&amp;lt;/project.build.sourceEncoding&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;project.reporting.outputEncoding&amp;gt;UTF-8&amp;lt;/project.reporting.outputEncoding&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;java.version&amp;gt;1.8&amp;lt;/java.version&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/properties&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;dependencies&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.projectlombok&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;lombok&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;optional&amp;gt;true&amp;lt;/optional&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/dependencies&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;dependencyManagement&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependencies&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;groupId&amp;gt;org.springframework.cloud&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;artifactId&amp;gt;spring-cloud-dependencies&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;version&amp;gt;Greenwich.SR4&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;type&amp;gt;pom&amp;lt;/type&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;scope&amp;gt;import&amp;lt;/scope&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependencies&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/dependencyManagement&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;build&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;plugins&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;plugin&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;artifactId&amp;gt;spring-boot-maven-plugin&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/plugin&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/plugins&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/build&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/project&amp;gt;</span></span></code></pre></div><p>然后，我们来创建一个oauth数据库，初始化将来会用到的5个表。</p><ul><li>authorities表：记录账号的权限，需要我们在后面配置。</li><li>oauth_approvals表：记录授权批准的状态。</li><li>oauth_client_details表：记录OAuth的客户端，需要我们在后面做配置。</li><li>oauth_code表：记录授权码。</li><li>users表：记录账号，需要我们在后面做初始化。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SET NAMES utf8mb4;</span></span>
<span class="line"><span>SET FOREIGN_KEY_CHECKS = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>-- Table structure for authorities</span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`authorities\`;</span></span>
<span class="line"><span>CREATE TABLE \`authorities\` (</span></span>
<span class="line"><span>  \`username\` varchar(50) NOT NULL,</span></span>
<span class="line"><span>  \`authority\` varchar(50) NOT NULL,</span></span>
<span class="line"><span>  UNIQUE KEY \`ix_auth_username\` (\`username\`,\`authority\`),</span></span>
<span class="line"><span>  CONSTRAINT \`fk_authorities_users\` FOREIGN KEY (\`username\`) REFERENCES \`users\` (\`username\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>-- Table structure for oauth_approvals</span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`oauth_approvals\`;</span></span>
<span class="line"><span>CREATE TABLE \`oauth_approvals\` (</span></span>
<span class="line"><span>  \`userId\` varchar(256) DEFAULT NULL,</span></span>
<span class="line"><span>  \`clientId\` varchar(256) DEFAULT NULL,</span></span>
<span class="line"><span>  \`partnerKey\` varchar(32) DEFAULT NULL,</span></span>
<span class="line"><span>  \`scope\` varchar(256) DEFAULT NULL,</span></span>
<span class="line"><span>  \`status\` varchar(10) DEFAULT NULL,</span></span>
<span class="line"><span>  \`expiresAt\` datetime DEFAULT NULL,</span></span>
<span class="line"><span>  \`lastModifiedAt\` datetime DEFAULT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>-- Table structure for oauth_client_details</span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`oauth_client_details\`;</span></span>
<span class="line"><span>CREATE TABLE \`oauth_client_details\` (</span></span>
<span class="line"><span>  \`client_id\` varchar(255) NOT NULL,</span></span>
<span class="line"><span>  \`resource_ids\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`client_secret\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`scope\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`authorized_grant_types\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`web_server_redirect_uri\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`authorities\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`access_token_validity\` int(11) DEFAULT NULL,</span></span>
<span class="line"><span>  \`refresh_token_validity\` int(11) DEFAULT NULL,</span></span>
<span class="line"><span>  \`additional_information\` varchar(4096) DEFAULT NULL,</span></span>
<span class="line"><span>  \`autoapprove\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`client_id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>-- Table structure for oauth_code</span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`oauth_code\`;</span></span>
<span class="line"><span>CREATE TABLE \`oauth_code\` (</span></span>
<span class="line"><span>  \`code\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  \`authentication\` blob</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>-- Table structure for users</span></span>
<span class="line"><span>-- ----------------------------</span></span>
<span class="line"><span>DROP TABLE IF EXISTS \`users\`;</span></span>
<span class="line"><span>CREATE TABLE \`users\` (</span></span>
<span class="line"><span>  \`username\` varchar(50) NOT NULL,</span></span>
<span class="line"><span>  \`password\` varchar(100) NOT NULL,</span></span>
<span class="line"><span>  \`enabled\` tinyint(1) NOT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`username\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SET FOREIGN_KEY_CHECKS = 1;</span></span></code></pre></div><p>这5个表是Spring Security OAuth需要用到的存储表，我们不要去修改既有的表结构。这里可以看到，我们并没有在数据库中创建相应的表，来存放访问令牌和刷新令牌。这是因为，我们之后的实现会使用JWT来传输令牌信息，以便进行本地校验，所以并不一定要将其存放到数据库中。基本上所有的这些表都是可以自己扩展的，只需要继承实现Spring的一些既有类即可，这里不做展开。</p><p>接下来，我们开始搭建授权服务器和受保护资源服务器。</p><h2 id="搭建授权服务器" tabindex="-1">搭建授权服务器 <a class="header-anchor" href="#搭建授权服务器" aria-label="Permalink to &quot;搭建授权服务器&quot;">​</a></h2><p>我们先创建第一个模块，也就是授权服务器。首先创建POM，配置依赖：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;project xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;parent&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;artifactId&amp;gt;springsecurity101&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;me.josephzhu&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;version&amp;gt;1.0-SNAPSHOT&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/parent&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;modelVersion&amp;gt;4.0.0&amp;lt;/modelVersion&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;springsecurity101-cloud-oauth2-server&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;dependencies&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.cloud&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-cloud-starter-oauth2&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-jdbc&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;mysql&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;mysql-connector-java&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-thymeleaf&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/dependencies&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/project&amp;gt;</span></span></code></pre></div><p>这里，我们使用了Spring Cloud的spring-cloud-starter-oauth2组件，而不是直接使用的Spring Security，因为前者做了一些自动化配置的工作，使用起来会更方便。</p><p>此外，我们还在POM中加入了数据访问、Web等依赖，因为我们的受保护资源服务器需要使用数据库来保存客户端的信息、用户信息等数据，同时也会引入thymeleaf模板引擎依赖，来稍稍美化一下登录页面。</p><p>然后创建一个配置文件application.yml实现程序配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server:</span></span>
<span class="line"><span>  port: 8080</span></span>
<span class="line"><span></span></span>
<span class="line"><span>spring:</span></span>
<span class="line"><span>  application:</span></span>
<span class="line"><span>    name: oauth2-server</span></span>
<span class="line"><span>  datasource:</span></span>
<span class="line"><span>    url: jdbc:mysql://localhost:6657/oauth?useSSL=false</span></span>
<span class="line"><span>    username: root</span></span>
<span class="line"><span>    password: kIo9u7Oi0eg</span></span>
<span class="line"><span>    driver-class-name: com.mysql.jdbc.Driver</span></span></code></pre></div><p>可以看到，我们配置了oauth数据库的连接字符串，定义了授权服务器的监听端口是8080。</p><p>最后，使用keytool工具生成密钥对，把密钥文件jks保存到资源目录下，并要导出一个公钥留作以后使用。</p><p>以上完成了项目框架搭建工作，接下来，我们正式开始编码。</p><p>第一步，创建一个最核心的类用于配置授权服务器。我把每段代码的作用放在了注释里，你可以直接看下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;EnableAuthorizationServer //开启授权服务器</span></span>
<span class="line"><span>public class OAuth2ServerConfiguration extends AuthorizationServerConfigurerAdapter {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private DataSource dataSource;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private AuthenticationManager authenticationManager;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 我们配置了使用数据库来维护客户端信息。虽然在各种Demo中我们经常看到的是在内存中维护客户端信息，通过配置直接写死在这里。</span></span>
<span class="line"><span>     * 但是，对于实际的应用我们一般都会用数据库来维护这个信息，甚至还会建立一套工作流来允许客户端自己申请ClientID，实现OAuth客户端接入的审批。</span></span>
<span class="line"><span>     * &amp;#64;param clients</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {</span></span>
<span class="line"><span>        clients.jdbc(dataSource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 这里干了两件事儿。首先，打开了验证Token的访问权限（以便之后我们演示）。</span></span>
<span class="line"><span>     * 然后，允许ClientSecret明文方式保存，并且可以通过表单提交（而不仅仅是Basic Auth方式提交），之后会演示到这个。</span></span>
<span class="line"><span>     * &amp;#64;param security</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {</span></span>
<span class="line"><span>        security.checkTokenAccess(&quot;permitAll()&quot;)</span></span>
<span class="line"><span>                .allowFormAuthenticationForClients().passwordEncoder(NoOpPasswordEncoder.getInstance());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 干了以下4件事儿：</span></span>
<span class="line"><span>     * 1. 配置我们的令牌存放方式为JWT方式，而不是内存、数据库或Redis方式。</span></span>
<span class="line"><span>     * JWT是Json Web Token的缩写，也就是使用JSON数据格式包装的令牌，由.号把整个JWT分隔为头、数据体、签名三部分。</span></span>
<span class="line"><span>     * JWT保存Token虽然易于使用但是不是那么安全，一般用于内部，且需要走HTTPS并配置比较短的失效时间。</span></span>
<span class="line"><span>     * 2. 配置JWT Token的非对称加密来进行签名</span></span>
<span class="line"><span>     * 3. 配置一个自定义的Token增强器，把更多信息放入Token中</span></span>
<span class="line"><span>     * 4. 配置使用JDBC数据库方式来保存用户的授权批准记录</span></span>
<span class="line"><span>     * &amp;#64;param endpoints</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {</span></span>
<span class="line"><span>        TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();</span></span>
<span class="line"><span>        tokenEnhancerChain.setTokenEnhancers(</span></span>
<span class="line"><span>                Arrays.asList(tokenEnhancer(), jwtTokenEnhancer()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        endpoints.approvalStore(approvalStore())</span></span>
<span class="line"><span>                .authorizationCodeServices(authorizationCodeServices())</span></span>
<span class="line"><span>                .tokenStore(tokenStore())</span></span>
<span class="line"><span>                .tokenEnhancer(tokenEnhancerChain)</span></span>
<span class="line"><span>                .authenticationManager(authenticationManager);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 使用JDBC数据库方式来保存授权码</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public AuthorizationCodeServices authorizationCodeServices() {</span></span>
<span class="line"><span>        return new JdbcAuthorizationCodeServices(dataSource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 使用JWT存储</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public TokenStore tokenStore() {</span></span>
<span class="line"><span>        return new JwtTokenStore(jwtTokenEnhancer());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 使用JDBC数据库方式来保存用户的授权批准记录</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public JdbcApprovalStore approvalStore() {</span></span>
<span class="line"><span>        return new JdbcApprovalStore(dataSource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 自定义的Token增强器，把更多信息放入Token中</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public TokenEnhancer tokenEnhancer() {</span></span>
<span class="line"><span>        return new CustomTokenEnhancer();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置JWT使用非对称加密方式来验证</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    protected JwtAccessTokenConverter jwtTokenEnhancer() {</span></span>
<span class="line"><span>        KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(new ClassPathResource(&quot;jwt.jks&quot;), &quot;mySecretKey&quot;.toCharArray());</span></span>
<span class="line"><span>        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();</span></span>
<span class="line"><span>        converter.setKeyPair(keyStoreKeyFactory.getKeyPair(&quot;jwt&quot;));</span></span>
<span class="line"><span>        return converter;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置登录页面的视图信息（其实可以独立一个配置类，这样会更规范）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Configuration</span></span>
<span class="line"><span>    static class MvcConfig implements WebMvcConfigurer {</span></span>
<span class="line"><span>        &amp;#64;Override</span></span>
<span class="line"><span>        public void addViewControllers(ViewControllerRegistry registry) {</span></span>
<span class="line"><span>            registry.addViewController(&quot;login&quot;).setViewName(&quot;login&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二步，还记得吗，刚才在第一步的代码中我们还用到了一个自定义的Token增强器，把用户信息嵌入到JWT Token中去（如果使用的是客户端凭据许可类型，这段代码无效，因为和用户没关系）。</p><p>这是一个常见需求。因为，默认情况下Token中只会有用户名这样的基本信息，我们往往需要把关于用户的更多信息返回给客户端（在实际应用中，你可能会从数据库或外部服务查询更多的用户信息加入到JWT Token中去）。这个时候，我们就可以自定义增强器来丰富Token的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CustomTokenEnhancer implements TokenEnhancer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {</span></span>
<span class="line"><span>        Authentication userAuthentication = authentication.getUserAuthentication();</span></span>
<span class="line"><span>        if (userAuthentication != null) {</span></span>
<span class="line"><span>            Object principal = authentication.getUserAuthentication().getPrincipal();</span></span>
<span class="line"><span>            //把用户标识嵌入JWT Token中去(Key是userDetails)</span></span>
<span class="line"><span>            Map&amp;lt;String, Object&amp;gt; additionalInfo = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>            additionalInfo.put(&quot;userDetails&quot;, principal);</span></span>
<span class="line"><span>            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return accessToken;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第三步，实现安全方面的配置。你可以直接看下代码注释，来了解关键代码的作用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>public class WebSecurityConfig extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private DataSource dataSource;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public AuthenticationManager authenticationManagerBean() throws Exception {</span></span>
<span class="line"><span>        return super.authenticationManagerBean();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置用户账户的认证方式。显然，我们把用户存在了数据库中希望配置JDBC的方式。</span></span>
<span class="line"><span>     * 此外，我们还配置了使用BCryptPasswordEncoder哈希来保存用户的密码（生产环境中，用户密码肯定不能是明文保存的）</span></span>
<span class="line"><span>     * &amp;#64;param auth</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(AuthenticationManagerBuilder auth) throws Exception {</span></span>
<span class="line"><span>        auth.jdbcAuthentication()</span></span>
<span class="line"><span>                .dataSource(dataSource)</span></span>
<span class="line"><span>                .passwordEncoder(new BCryptPasswordEncoder());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 开放/login和/oauth/authorize两个路径的匿名访问。前者用于登录，后者用于换授权码，这两个端点访问的时机都在登录之前。</span></span>
<span class="line"><span>     * 设置/login使用表单验证进行登录。</span></span>
<span class="line"><span>     * &amp;#64;param http</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http.authorizeRequests()</span></span>
<span class="line"><span>                .antMatchers(&quot;/login&quot;, &quot;/oauth/authorize&quot;)</span></span>
<span class="line"><span>                .permitAll()</span></span>
<span class="line"><span>                .anyRequest().authenticated()</span></span>
<span class="line"><span>                .and()</span></span>
<span class="line"><span>                .formLogin().loginPage(&quot;/login&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第四步，在资源目录下创建一个templates文件夹，然后创建一个login.html登录页：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;body class=&quot;uk-height-1-1&quot;&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;div class=&quot;uk-vertical-align uk-text-center uk-height-1-1&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&quot;uk-vertical-align-middle&quot; style=&quot;width: 250px;&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;h1&amp;gt;Login Form&amp;lt;/h1&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &amp;lt;p class=&quot;uk-text-danger&quot; th:if=&quot;\${param.error}&quot;&amp;gt;</span></span>
<span class="line"><span>            用户名或密码错误...</span></span>
<span class="line"><span>        &amp;lt;/p&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &amp;lt;form class=&quot;uk-panel uk-panel-box uk-form&quot; method=&quot;post&quot; th:action=&quot;&amp;#64;{/login}&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;div class=&quot;uk-form-row&quot;&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;input class=&quot;uk-width-1-1 uk-form-large&quot; type=&quot;text&quot; placeholder=&quot;Username&quot; name=&quot;username&quot;</span></span>
<span class="line"><span>                       value=&quot;reader&quot;/&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;div class=&quot;uk-form-row&quot;&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;input class=&quot;uk-width-1-1 uk-form-large&quot; type=&quot;password&quot; placeholder=&quot;Password&quot; name=&quot;password&quot;</span></span>
<span class="line"><span>                       value=&quot;reader&quot;/&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;div class=&quot;uk-form-row&quot;&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;button class=&quot;uk-width-1-1 uk-button uk-button-primary uk-button-large&quot;&amp;gt;Login&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/form&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span></code></pre></div><p>至此，授权服务器的编码工作就完成了。</p><h2 id="搭建受保护资源服务器" tabindex="-1">搭建受保护资源服务器 <a class="header-anchor" href="#搭建受保护资源服务器" aria-label="Permalink to &quot;搭建受保护资源服务器&quot;">​</a></h2><p>接下来，我们搭建一个用户服务模拟资源提供者（受保护资源服务器）。我们先看看项目初始化工作。</p><p>这次创建的POM没有什么特殊，依赖了spring-cloud-starter-oauth2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;project xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;parent&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;artifactId&amp;gt;springsecurity101&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;me.josephzhu&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;version&amp;gt;1.0-SNAPSHOT&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/parent&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;modelVersion&amp;gt;4.0.0&amp;lt;/modelVersion&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;springsecurity101-cloud-oauth2-userservice&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;dependencies&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.cloud&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-cloud-starter-oauth2&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/dependencies&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/project&amp;gt;</span></span></code></pre></div><p>配置文件非常简单，只是声明了资源服务端口为8081：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server:</span></span>
<span class="line"><span>  port: 8081</span></span></code></pre></div><p>同时，还要记得把我们之前在项目准备工作时生成的密钥对的公钥命名为public.cert，并放到资源文件下。这样，资源服务器可以本地校验JWT的合法性。内容大概是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-----BEGIN PUBLIC KEY-----</span></span>
<span class="line"><span>MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwR84LFHwnK5GXErnwkmD</span></span>
<span class="line"><span>mPOJl4CSTtYXCqmCtlbF+5qVOosu0YsM2DsrC9O2gun6wVFKkWYiMoBSjsNMSI3Z</span></span>
<span class="line"><span>w5JYgh+ldHvA+MIex2QXfOZx920M1fPUiuUPgmnTFS+Z3lmK3/T6jJnmciUPY1pe</span></span>
<span class="line"><span>h4MXL6YzeI0q4W9xNBBeKT6FDGpduc0FC3OlXHfLbVOThKmAUpAWFDwf9/uUA//l</span></span>
<span class="line"><span>3PLchmV6VwTcUaaHp5W8Af/GU4lPGZbTAqOxzB9ukisPFuO1DikacPhrOQgdxtqk</span></span>
<span class="line"><span>LciRTa884uQnkFwSguOEUYf3ni8GNRJauIuW0rVXhMOs78pKvCKmo53M0tqeC6ul</span></span>
<span class="line"><span>+QIDAQAB</span></span>
<span class="line"><span>-----END PUBLIC KEY-----</span></span></code></pre></div><p>好了，让我们正式开始编码吧。</p><p>第一步，创建一个可以匿名访问的接口GET /hello，用来测试无需登录就可以访问的服务端资源：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloController {</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;hello&quot;)</span></span>
<span class="line"><span>    public String hello() {</span></span>
<span class="line"><span>        return &quot;Hello&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二步，创建三个需要登录+授权才能访问到的接口。我们通过@PreAuthorize在方法执行前进行权限控制：</p><ul><li>GET /user/name接口，读权限或写权限可访问，返回登录用户名；</li><li>GET /user接口，读权限或写权限可访问，返回登录用户信息；</li><li>POST /user接口，只有写权限可以访问，返回访问令牌中的额外信息（也就是自定义的Token增强器CustomTokenEnhancer加入到访问令牌中的额外信息，Key是userDetails），这里也演示了使用TokenStore来解析Token的方式。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;user&quot;)</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private TokenStore tokenStore;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /***</span></span>
<span class="line"><span>     * 读权限或写权限可访问，返回登录用户名</span></span>
<span class="line"><span>     * &amp;#64;param authentication</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;PreAuthorize(&quot;hasAuthority(&#39;READ&#39;) or hasAuthority(&#39;WRITE&#39;)&quot;)</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;name&quot;)</span></span>
<span class="line"><span>    public String name(OAuth2Authentication authentication) {</span></span>
<span class="line"><span>        return authentication.getName();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 读权限或写权限可访问，返回登录用户信息</span></span>
<span class="line"><span>     * &amp;#64;param authentication</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;PreAuthorize(&quot;hasAuthority(&#39;READ&#39;) or hasAuthority(&#39;WRITE&#39;)&quot;)</span></span>
<span class="line"><span>    &amp;#64;GetMapping</span></span>
<span class="line"><span>    public OAuth2Authentication read(OAuth2Authentication authentication) {</span></span>
<span class="line"><span>        return authentication;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 只有写权限可以访问，返回访问令牌中的额外信息</span></span>
<span class="line"><span>     * &amp;#64;param authentication</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;PreAuthorize(&quot;hasAuthority(&#39;WRITE&#39;)&quot;)</span></span>
<span class="line"><span>    &amp;#64;PostMapping</span></span>
<span class="line"><span>    public Object write(OAuth2Authentication authentication) {</span></span>
<span class="line"><span>        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();</span></span>
<span class="line"><span>        OAuth2AccessToken accessToken = tokenStore.readAccessToken(details.getTokenValue());</span></span>
<span class="line"><span>        return accessToken.getAdditionalInformation().getOrDefault(&quot;userDetails&quot;, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第三步，创建核心的资源服务器配置类。这里我们需要注意下面两点：</p><ul><li>我们硬编码了资源服务器的ID为userservice；</li><li>现在我们使用的是不落数据库的JWT方式+非对称加密，需要通过本地公钥进行验证，因此在这里我们配置了公钥的路径。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;EnableResourceServer //启用资源服务器</span></span>
<span class="line"><span>&amp;#64;EnableGlobalMethodSecurity(prePostEnabled = true) //启用方法注解方式来进行权限控制</span></span>
<span class="line"><span>public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 声明了资源服务器的ID是userservice，声明了资源服务器的TokenStore是JWT</span></span>
<span class="line"><span>     * &amp;#64;param resources</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {</span></span>
<span class="line"><span>        resources.resourceId(&quot;userservice&quot;).tokenStore(tokenStore());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置TokenStore</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public TokenStore tokenStore() {</span></span>
<span class="line"><span>        return new JwtTokenStore(jwtAccessTokenConverter());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置公钥</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    protected JwtAccessTokenConverter jwtAccessTokenConverter() {</span></span>
<span class="line"><span>        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();</span></span>
<span class="line"><span>        Resource resource = new ClassPathResource(&quot;public.cert&quot;);</span></span>
<span class="line"><span>        String publicKey = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            publicKey = new String(FileCopyUtils.copyToByteArray(resource.getInputStream()));</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        converter.setVerifierKey(publicKey);</span></span>
<span class="line"><span>        return converter;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置了除了/user路径之外的请求可以匿名访问</span></span>
<span class="line"><span>     * &amp;#64;param http</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http.authorizeRequests()</span></span>
<span class="line"><span>                .antMatchers(&quot;/user/**&quot;).authenticated()</span></span>
<span class="line"><span>                .anyRequest().permitAll();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，我们来想一下，如果授权服务器产生Token的话，受保护资源服务器必须要有一种办法来验证Token，那如果这里的Token不是JWT的方式，我们可以怎么办呢？</p><p>我来说下我的方法吧：</p><ul><li>首先，Token可以保存在数据库或Redis中，资源服务器和授权服务器共享底层的TokenStore来验证；</li><li>然后，资源服务器可以使用RemoteTokenServices，来从授权服务器的/oauth/check_token端点进行Token校验。</li></ul><p>到这里，资源服务器就配置完成了，我们还在资源服务器中分别创建了两个控制器HelloController和UserController，用于分别测试可以匿名访问以及受到权限保护的资源。</p><h2 id="初始化数据配置" tabindex="-1">初始化数据配置 <a class="header-anchor" href="#初始化数据配置" aria-label="Permalink to &quot;初始化数据配置&quot;">​</a></h2><p>在实现了授权服务器和受保护资源服务器代码后，我们再来初始化oauth数据库的数据就非常容易理解了。总结起来，我们需要配置用户、权限和客户端三部分。</p><ol><li>配置两个用户。其中，读用户reader具有读权限，密码为reader；写用户writer具有读写权限，密码为writer。还记得吗，密码我们使用的是BCryptPasswordEncoder加密（准确说是哈希）？</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSERT INTO \`users\` VALUES (&#39;reader&#39;, &#39;$2a$04$C6pPJvC1v6.enW6ZZxX.luTdpSI/1gcgTVN7LhvQV6l/AfmzNU/3i&#39;, 1);</span></span>
<span class="line"><span>INSERT INTO \`users\` VALUES (&#39;writer&#39;, &#39;$2a$04$M9t2oVs3/VIreBMocOujqOaB/oziWL0SnlWdt8hV4YnlhQrORA0fS&#39;, 1);</span></span></code></pre></div><ol start="2"><li>配置两个权限，也就是配置reader用户具有读权限，writer用户具有写权限：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSERT INTO \`authorities\` VALUES (&#39;reader&#39;, &#39;READ&#39;);</span></span>
<span class="line"><span>INSERT INTO \`authorities\` VALUES (&#39;writer&#39;, &#39;READ,WRITE&#39;);</span></span></code></pre></div><ol start="3"><li>配置三个客户端，其中客户端userservice1使用资源拥有者凭据许可类型，客户端userservice2使用客户端凭据许可类型，客户端userservice3使用授权码许可类型。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSERT INTO \`oauth_client_details\` VALUES (&#39;userservice1&#39;, &#39;userservice&#39;, &#39;1234&#39;, &#39;FOO&#39;, &#39;password,refresh_token&#39;, &#39;&#39;, &#39;READ,WRITE&#39;, 7200, NULL, NULL, &#39;true&#39;);</span></span>
<span class="line"><span>INSERT INTO \`oauth_client_details\` VALUES (&#39;userservice2&#39;, &#39;userservice&#39;, &#39;1234&#39;, &#39;FOO&#39;, &#39;client_credentials,refresh_token&#39;, &#39;&#39;, &#39;READ,WRITE&#39;, 7200, NULL, NULL, &#39;true&#39;);</span></span>
<span class="line"><span>INSERT INTO \`oauth_client_details\` VALUES (&#39;userservice3&#39;, &#39;userservice&#39;, &#39;1234&#39;, &#39;FOO&#39;, &#39;authorization_code,refresh_token&#39;, &#39;https://baidu.com,http://localhost:8082/ui/login,http://localhost:8083/ui/login,http://localhost:8082/ui/remoteCall&#39;, &#39;READ,WRITE&#39;, 7200, NULL, NULL, &#39;false&#39;);</span></span></code></pre></div><p>值得说明的是：</p><ul><li>三个客户端账号能使用的资源ID都是userservice，对应我们受保护资源服务器刚才配置的资源ID，也就是userservice，这两者需要一致。</li><li>三个客户端账号的密码都是1234。</li><li>三个客户端账号的授权范围都是FOO（并不是关键信息），它们可以拿到的权限是读写。不过，对于和用户相关的授权许可类型（比如资源拥有者凭据许可、授权码许可），最终拿到的权限还取决于客户端权限和用户权限的交集。</li><li>通过grant_types字段配置支持不同的授权许可类型。这里为了便于测试观察，我们给三个客户端账号各自配置了一种授权许可类型；在实际业务场景中，你完全可以为同一个客户端配置支持OAuth 2.0的四种授权许可类型。</li><li>userservice1和userservice2我们配置了用户自动批准授权（不会弹出一个页面要求用户进行授权）。</li></ul><h2 id="演示三种授权许可类型" tabindex="-1">演示三种授权许可类型 <a class="header-anchor" href="#演示三种授权许可类型" aria-label="Permalink to &quot;演示三种授权许可类型&quot;">​</a></h2><p>到这里，授权服务器和受保护资源服务器程序都搭建完成了，数据库也配置了用于测试的用户、权限和客户端。接下来，我们就使用Postman来手工测试一下OAuth 2.0的授权码许可、资源拥有者凭据许可、客户端凭据许可这三种授权许可类型吧。</p><h3 id="资源拥有者凭据许可类型" tabindex="-1">资源拥有者凭据许可类型 <a class="header-anchor" href="#资源拥有者凭据许可类型" aria-label="Permalink to &quot;资源拥有者凭据许可类型&quot;">​</a></h3><p>首先，我们测试的是资源拥有者凭据许可，POST请求地址是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8080/oauth/token?grant_type=password&amp;client_id=userservice1&amp;client_secret=1234&amp;username=writer&amp;password=writer</span></span></code></pre></div><p>得到如下图所示结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/18cd7b24ff152e28806b1176b0a560e4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/18cd7b24ff152e28806b1176b0a560e4.png" alt=""></a></p><p>再使用 <a href="http://jwt.io/" target="_blank" rel="noreferrer">JWT解析工具</a> 看下请求Token中的信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/8e4c2dd1931a31197df55cc251b2a07e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/8e4c2dd1931a31197df55cc251b2a07e.png" alt=""></a></p><p>可以看到，Token中果然包含了Token增强器加入的userDetails自定义信息。如果我们把公钥粘贴到页面的话，可以看到这个JWT校验成功了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/4d701319144d3de7c5d743f59e4991ae.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/4d701319144d3de7c5d743f59e4991ae.png" alt=""></a></p><p>除了本地校验外，还可以访问授权服务器来校验JWT：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8080/oauth/check_token?client_id=userservice1&amp;client_secret=1234&amp;token=...</span></span></code></pre></div><p>得到如下结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/2835c0d2b49ac515c9f6c537dd2f7195.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/2835c0d2b49ac515c9f6c537dd2f7195.png" alt=""></a></p><h3 id="客户端授权许可类型" tabindex="-1">客户端授权许可类型 <a class="header-anchor" href="#客户端授权许可类型" aria-label="Permalink to &quot;客户端授权许可类型&quot;">​</a></h3><p>我们再来测试下客户端授权许可类型。POST请求地址：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8080/oauth/token?grant_type=client_credentials&amp;client_id=userservice2&amp;client_secret=1234</span></span></code></pre></div><p>如下图所示，可以直接拿到Token：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/81722855fd6935aea594ec62b64bf0e9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/81722855fd6935aea594ec62b64bf0e9.png" alt=""></a></p><p>这里需要注意的是，并没有提供刷新令牌。这是因为，刷新令牌用于避免访问令牌失效后需要用户再次登录的问题，而客户端授权许可类型没有用户的概念，因此没有刷新令牌，也无法注入额外的userDetails信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/fcf2b1c1a53ecc33d3a0abc72b6d83da.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/fcf2b1c1a53ecc33d3a0abc72b6d83da.png" alt=""></a></p><p>也可以试一下，如果我们的授权服务器没有开启allowFormAuthenticationForClients参数（允许表单提交认证）的话，客户端的凭证需要通过Basic Auth传过去而不是通过Post：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/ce391c3c93e2131e1cf8fb4e3324b66f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/ce391c3c93e2131e1cf8fb4e3324b66f.png" alt=""></a></p><h3 id="授权码许可类型" tabindex="-1">授权码许可类型 <a class="header-anchor" href="#授权码许可类型" aria-label="Permalink to &quot;授权码许可类型&quot;">​</a></h3><p>最后，我们来测试下比较复杂的授权码许可。</p><p><strong>第一步</strong>，打开浏览器访问地址：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8080/oauth/authorize?response_type=code&amp;client_id=userservice3&amp;redirect_uri=https://baidu.com</span></span></code></pre></div><p>注意，客户端跳转地址需要和数据库中配置的一致（百度的URL <a href="https://baidu.com" target="_blank" rel="noreferrer">https://baidu.com</a></p><p>我们之前已经在数据库中有配置了）。访问后页面会直接跳转到登录界面，我们使用用户名“reader”、密码“reader”来登录：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/73c3bd926e4e350b220447cd8b97d811.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/73c3bd926e4e350b220447cd8b97d811.png" alt=""></a></p><p>由于我们在数据库中设置的是禁用自动批准授权的模式，所以登录后来到了批准界面：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/9cac3b06b632220166d7e43607da4901.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/9cac3b06b632220166d7e43607da4901.png" alt=""></a></p><p>点击同意后可以看到，数据库中也会产生授权通过记录：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/9e942cc7c22ff8b4540e9f6736d56b6f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/9e942cc7c22ff8b4540e9f6736d56b6f.png" alt=""></a></p><p><strong>第二步，</strong> 我们可以看到浏览器转到了百度并且提供给了我们授权码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>https://www.baidu.com/?code=XKkHGY</span></span></code></pre></div><p>数据库中也记录了授权码：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/eff235ff90aafb559d6e45b07a4d173e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/eff235ff90aafb559d6e45b07a4d173e.png" alt=""></a></p><p>然后POST访问下面的地址（code参数替换为刚才获得的授权码）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8080/oauth/token?grant_type=authorization_code&amp;client_id=userservice3&amp;client_secret=1234&amp;code=XKkHGY&amp;redirect_uri=https://baidu.com</span></span></code></pre></div><p>可以通过授权码换取访问令牌：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/ea401694bf55f83353f7db65d17ab6d7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/ea401694bf55f83353f7db65d17ab6d7.png" alt=""></a></p><p>虽然userservice3客户端可以有读权限和写权限，但是因为我们登录的用户reader只有读权限，所以最后拿到也只有读权限。</p><h2 id="演示权限控制" tabindex="-1">演示权限控制 <a class="header-anchor" href="#演示权限控制" aria-label="Permalink to &quot;演示权限控制&quot;">​</a></h2><p>现在我们来测试一下之前定义的两个账号，也就是读账号和写账号，看看它们的权限控制是否有效。</p><p>首先，测试一下我们的安全配置，访问/hello端点不需要认证可以匿名访问：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/7646fe1e6e4cc9914f79881576126459.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/7646fe1e6e4cc9914f79881576126459.png" alt=""></a></p><p>访问/user需要身份认证：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/3b22a89392c92187960aecd4bc3cf8f6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/3b22a89392c92187960aecd4bc3cf8f6.png" alt=""></a></p><p>不管以哪种模式拿到访问令牌，我们用具有读权限的访问令牌访问资源服务器的如下地址</p><p>（请求头加入Authorization: Bearer XXXXXXXXXX，其中XXXXXXXXXX代表访问令牌）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8081/user/</span></span></code></pre></div><p>可以得到如下结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/0606fbb094de245d346ed17d9yycd6d5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/0606fbb094de245d346ed17d9yycd6d5.png" alt=""></a></p><p>以POST方式访问<a href="http://localhost:8081/user/%EF%BC%8C%E6%98%BE%E7%84%B6%E6%98%AF%E5%A4%B1%E8%B4%A5%E7%9A%84%EF%BC%9A" target="_blank" rel="noreferrer">http://localhost:8081/user/，显然是失败的：</a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/a71bcef74da7577aa1529bf2d9546588.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/a71bcef74da7577aa1529bf2d9546588.png" alt=""></a></p><p>因为这个接口要求有写权限：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PreAuthorize(&quot;hasAuthority(&#39;WRITE&#39;)&quot;)</span></span>
<span class="line"><span>&amp;#64;PostMapping</span></span>
<span class="line"><span>public Object write(OAuth2Authentication authentication) {</span></span></code></pre></div><p>我们换一个具有读写权限的访问令牌来试试：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/a754a6fdcb9666e07f1b820052a4e2fc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/a754a6fdcb9666e07f1b820052a4e2fc.png" alt=""></a></p><p>可以发现，果然访问成功了。这里输出的内容是Token中的userDetails额外信息，说明资源服务器的权限控制有效。</p><h2 id="搭建客户端程序" tabindex="-1">搭建客户端程序 <a class="header-anchor" href="#搭建客户端程序" aria-label="Permalink to &quot;搭建客户端程序&quot;">​</a></h2><p>在上面的演示中，我们使用的是Postman，也就是手动HTTP请求的方式来申请和使用Token。最后，我们来搭建一个OAuth客户端程序自动实现这个过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;project xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;parent&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;artifactId&amp;gt;springsecurity101&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;me.josephzhu&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;version&amp;gt;1.0-SNAPSHOT&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/parent&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;springsecurity101-cloud-oauth2-client&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;modelVersion&amp;gt;4.0.0&amp;lt;/modelVersion&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;dependencies&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.cloud&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-cloud-starter-oauth2&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-thymeleaf&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;/dependencies&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/project&amp;gt;</span></span></code></pre></div><p>配置文件如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server:</span></span>
<span class="line"><span>  port: 8083</span></span>
<span class="line"><span>  servlet:</span></span>
<span class="line"><span>    context-path: /ui</span></span>
<span class="line"><span>security:</span></span>
<span class="line"><span>  oauth2:</span></span>
<span class="line"><span>    client:</span></span>
<span class="line"><span>      clientId: userservice3</span></span>
<span class="line"><span>      clientSecret: 1234</span></span>
<span class="line"><span>      accessTokenUri: http://localhost:8080/oauth/token</span></span>
<span class="line"><span>      userAuthorizationUri: http://localhost:8080/oauth/authorize</span></span>
<span class="line"><span>      scope: FOO</span></span>
<span class="line"><span>    resource:</span></span>
<span class="line"><span>      jwt:</span></span>
<span class="line"><span>        key-value: |</span></span>
<span class="line"><span>          -----BEGIN PUBLIC KEY-----</span></span>
<span class="line"><span>          ***</span></span>
<span class="line"><span>          -----END PUBLIC KEY-----</span></span>
<span class="line"><span>spring:</span></span>
<span class="line"><span>  thymeleaf:</span></span>
<span class="line"><span>    cache: false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#logging:</span></span>
<span class="line"><span>#  level:</span></span>
<span class="line"><span>#    ROOT: DEBUG</span></span></code></pre></div><p>客户端项目端口8082，几个需要说明的地方：</p><ul><li>本地测试的时候有一个坑，也就是我们需要配置context-path，否则可能会出现客户端和授权服务器服务端Cookie干扰，导致CSRF防御触发的问题。这个问题出现后程序没有任何错误日志输出，只有开启DEBUG模式后才能看到DEBUG日志里有提示，因此这个问题非常难以排查。说实话，我也不知道Spring为什么不把这个信息作为WARN级别的日志输出。</li><li>作为OAuth客户端，我们需要配置OAuth服务端获取Token的地址、授权（获取授权码）的地址，需要配置客户端的ID、密码和授权范围。</li><li>因为使用的是JWT Token，我们需要配置公钥（当然，如果不在这里直接配置公钥的话，也可以配置从授权服务器服务端获取公钥）。</li></ul><p>接下来，我们可以开始编码了。</p><p>第一步，实现MVC的配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;EnableWebMvc</span></span>
<span class="line"><span>public class WebMvcConfig implements WebMvcConfigurer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置RequestContextListener用于启用session scope的Bean</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public RequestContextListener requestContextListener() {</span></span>
<span class="line"><span>        return new RequestContextListener();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置index路径的首页Controller</span></span>
<span class="line"><span>     * &amp;#64;param registry</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void addViewControllers(ViewControllerRegistry registry) {</span></span>
<span class="line"><span>        registry.addViewController(&quot;/&quot;)</span></span>
<span class="line"><span>                .setViewName(&quot;forward:/index&quot;);</span></span>
<span class="line"><span>        registry.addViewController(&quot;/index&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里做了两件事情：</p><ol><li>配置RequestContextListener，用于启用session scope的Bean；</li><li>配置了index路径的首页Controller。</li></ol><p>第二步，实现安全方面的配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;Order(200)</span></span>
<span class="line"><span>public class WebSecurityConfig extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * /路径和/login路径允许访问，其它路径需要身份认证后才能访问</span></span>
<span class="line"><span>     * &amp;#64;param http</span></span>
<span class="line"><span>     * &amp;#64;throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http</span></span>
<span class="line"><span>                .authorizeRequests()</span></span>
<span class="line"><span>                .antMatchers(&quot;/&quot;, &quot;/login**&quot;)</span></span>
<span class="line"><span>                .permitAll()</span></span>
<span class="line"><span>                .anyRequest()</span></span>
<span class="line"><span>                .authenticated();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们实现的是/路径和/login路径允许访问，其它路径需要身份认证后才能访问。</p><p>第三步，我们来创建一个控制器：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class DemoController {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    OAuth2RestTemplate restTemplate;</span></span>
<span class="line"><span>    //演示登录后才能访问的安全页面</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;/securedPage&quot;)</span></span>
<span class="line"><span>    public ModelAndView securedPage(OAuth2Authentication authentication) {</span></span>
<span class="line"><span>        return new ModelAndView(&quot;securedPage&quot;).addObject(&quot;authentication&quot;, authentication);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //演示通过OAuth2RestTemplate调用受保护资源</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;/remoteCall&quot;)</span></span>
<span class="line"><span>    public String remoteCall() {</span></span>
<span class="line"><span>        ResponseEntity&amp;lt;String&amp;gt; responseEntity = restTemplate.getForEntity(&quot;http://localhost:8081/user/name&quot;, String.class);</span></span>
<span class="line"><span>        return responseEntity.getBody();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们实现了两个功能：</p><ol><li>securedPage页面，实现的功能是，把用户信息作为模型传入了视图，这样打开页面后就能显示用户名和权限。</li><li>remoteCall接口，实现的功能是，通过引入OAuth2RestTemplate，在登录后就可以使用凭据直接从受保护资源服务器拿资源，不需要繁琐地实现获得访问令牌、在请求头里加入访问令牌的过程。</li></ol><p>第四步，配置一下刚才用到的OAuth2RestTemplate Bean，并启用OAuth2Sso功能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;EnableOAuth2Sso //这个注解包含了&amp;#64;EnableOAuth2Client</span></span>
<span class="line"><span>public class OAuthClientConfig {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 定义了OAuth2RestTemplate，网上一些比较老的资料给出的是手动读取配置文件来实现，最新版本已经可以自动注入OAuth2ProtectedResourceDetails</span></span>
<span class="line"><span>     * &amp;#64;param oAuth2ClientContext</span></span>
<span class="line"><span>     * &amp;#64;param details</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public OAuth2RestTemplate oauth2RestTemplate(OAuth2ClientContext oAuth2ClientContext,</span></span>
<span class="line"><span>                                                 OAuth2ProtectedResourceDetails details) {</span></span>
<span class="line"><span>        return new OAuth2RestTemplate(details, oAuth2ClientContext);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第五步，实现首页：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;div class=&quot;container&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&quot;col-sm-12&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;h1&amp;gt;Spring Security SSO Client&amp;lt;/h1&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;a class=&quot;btn btn-primary&quot; href=&quot;securedPage&quot;&amp;gt;Login&amp;lt;/a&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span></code></pre></div><p>以及登录后才能访问的securedPage页面：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;div class=&quot;container&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;div class=&quot;col-sm-12&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;h1&amp;gt;Secured Page&amp;lt;/h1&amp;gt;</span></span>
<span class="line"><span>        Welcome, &amp;lt;span th:text=&quot;\${authentication.name}&quot;&amp;gt;Name&amp;lt;/span&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;br/&amp;gt;</span></span>
<span class="line"><span>        Your authorities are &amp;lt;span th:text=&quot;\${authentication.authorities}&quot;&amp;gt;authorities&amp;lt;/span&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span></code></pre></div><h2 id="演示单点登录" tabindex="-1">演示单点登录 <a class="header-anchor" href="#演示单点登录" aria-label="Permalink to &quot;演示单点登录&quot;">​</a></h2><p>好，客户端程序搭建好之后，我们先来测试一下单点登录的功能。启动客户端项目，打开浏览器访问：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8082/ui/securedPage</span></span></code></pre></div><p>可以看到，页面自动转到了授权服务器（8080端口）的登录页面：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/05b76f316304e3ef2d1494bae501c381.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/05b76f316304e3ef2d1494bae501c381.png" alt=""></a></p><p>登录后显示了当前用户名和权限：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/7d24bc73267506c15f9feyy546557237.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/7d24bc73267506c15f9feyy546557237.png" alt=""></a></p><p>我们再启动另一个客户端网站，端口改为8083，然后访问同样的地址：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/7a50619ace3e40c8ff7c0aa860f11246.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/7a50619ace3e40c8ff7c0aa860f11246.png" alt=""></a></p><p>可以看到直接是登录状态，单点登录测试成功。是不是很方便？其实，为了达成单点登录的效果，程序在背后自动实现了多次302重定向，整个流程为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8083/ui/securedPage -&amp;gt;</span></span>
<span class="line"><span>http://localhost:8083/ui/login -&amp;gt;</span></span>
<span class="line"><span>http://localhost:8080/oauth/authorize?client_id=userservice3&amp;redirect_uri=http://localhost:8083/ui/login&amp;response_type=code&amp;scope=FOO&amp;state=Sobjqe -&amp;gt;</span></span>
<span class="line"><span>http://localhost:8083/ui/login?code=CDdvHa&amp;state=Sobjqe -&amp;gt;</span></span>
<span class="line"><span>http://localhost:8083/ui/securedPage</span></span></code></pre></div><h2 id="演示客户端请求资源服务器资源" tabindex="-1">演示客户端请求资源服务器资源 <a class="header-anchor" href="#演示客户端请求资源服务器资源" aria-label="Permalink to &quot;演示客户端请求资源服务器资源&quot;">​</a></h2><p>还记得吗，在上一节“搭建客户端程序”中，我们还定义了一个remoteCall接口，直接使用OAuth2RestTemplate来访问远程资源服务器的资源。现在，我们来测试一下这个接口是否可以实现自动的OAuth流程。访问：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:8082/ui/remoteCall</span></span></code></pre></div><p>会先转到授权服务器登录，登录后自动跳转回来：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/016f28b7161d2c600197aa2392b0de27.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/016f28b7161d2c600197aa2392b0de27.png" alt=""></a></p><p>可以看到输出了用户名，对应的资源服务器服务端接口是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PreAuthorize(&quot;hasAuthority(&#39;READ&#39;) or hasAuthority(&#39;WRITE&#39;)&quot;)</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;name&quot;)</span></span>
<span class="line"><span>public String name(OAuth2Authentication authentication) {</span></span>
<span class="line"><span>    return authentication.getName();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>换一个writer用户登录试试，也能得到正确的输出：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/yy2bca66c45cefa56d2d727c3a136a84.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OAuth2.0%E5%AE%9E%E6%88%98%E8%AF%BE/images/264179/yy2bca66c45cefa56d2d727c3a136a84.png" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天这一讲，我们完整演示了如何使用Spring Cloud的OAuth 2.0组件基于三个程序角色（授权服务器、受保护资源服务器和客户端）实现三种OAuth 2.0的授权许可类型（资源拥有者凭据许可、客户端凭据许可和授权码许可）。</p><p>我们先演示了三种授权许可类型的手动流程，然后也演示了如何实现权限控制和单点登录，以及如何使用客户端程序来实现自动的OAuth 2.0流程。</p><p>我把今天用到的所有代码都放到了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/SpringSecurity101" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><p>最后，我再提一下，将来Spring对于OAuth 2.0的支持可能会转移到 <a href="https://spring.io/blog/2020/04/15/announcing-the-spring-authorization-server" target="_blank" rel="noreferrer">由社区推进的Spring Authorization Server项目上来继续运作</a>。如果你感兴趣的话，可以及时关注这个项目的进展。</p>`,181)])])}const m=s(t,[["render",l]]);export{g as __pageData,m as default};
