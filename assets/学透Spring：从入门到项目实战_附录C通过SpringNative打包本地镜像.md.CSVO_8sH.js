import{_ as i,H as a,f as n,i as l}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"附录C通过SpringNative打包本地镜像","description":"","frontmatter":{},"headers":[{"level":2,"title":"C.1　GraalVM 与 Spring Native","slug":"c-1-graalvm-与-spring-native","link":"#c-1-graalvm-与-spring-native","children":[{"level":3,"title":"C.1.1　GraalVM 简介","slug":"c-1-1-graalvm-简介","link":"#c-1-1-graalvm-简介","children":[]},{"level":3,"title":"C.1.2　Spring Native 简介","slug":"c-1-2-spring-native-简介","link":"#c-1-2-spring-native-简介","children":[]}]},{"level":2,"title":"C.2　编译打包本地镜像","slug":"c-2-编译打包本地镜像","link":"#c-2-编译打包本地镜像","children":[{"level":3,"title":"C.2.1　准备工作","slug":"c-2-1-准备工作","link":"#c-2-1-准备工作","children":[]},{"level":3,"title":"C.2.2　调整编译打包配置","slug":"c-2-2-调整编译打包配置","link":"#c-2-2-调整编译打包配置","children":[]},{"level":3,"title":"C.2.3　修改代码","slug":"c-2-3-修改代码","link":"#c-2-3-修改代码","children":[]},{"level":3,"title":"C.2.4　其他优化","slug":"c-2-4-其他优化","link":"#c-2-4-其他优化","children":[]}]}],"relativePath":"学透Spring：从入门到项目实战/附录C通过SpringNative打包本地镜像.md","filePath":"学透Spring：从入门到项目实战/附录C通过SpringNative打包本地镜像.md","lastUpdated":1795556072000}'),p={name:"学透Spring：从入门到项目实战/附录C通过SpringNative打包本地镜像.md"};function t(e,s,h,k,r,E){return a(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="附录c通过springnative打包本地镜像" tabindex="-1">附录C通过SpringNative打包本地镜像 <a class="header-anchor" href="#附录c通过springnative打包本地镜像" aria-label="Permalink to &quot;附录C通过SpringNative打包本地镜像&quot;">​</a></h1><p>在云原生应用越来越广泛的今天，大家对服务提出了很多新的要求。以前的服务只要跑起来，就长时间运行，启动慢一点、占用资源多一点都不是问题。在弹性伸缩，按量计费的云平台下，平时保持最小实例数，甚至 0 实例，请求到来后快速拉起一个新的服务实例，这就要求系统要能快速启动，必须是毫秒级；如果按 CPU 与内存的用量来计费，那服务占用的内存就要尽可能少，要在尽可能短的时间内达到性能峰值……</p><ul><li>1</li></ul><p>面对这些新挑战，Quarkus 和 Micronaut 这样的后起之秀</p><ul><li>都能轻装上阵，直接面向云原生</li></ul><p>应用提供支持，而运行在传统 JVM 上的 Spring 系统多少有些力不从心，好在 Spring 家族也给出了自己的解决方案——Spring Native。</p><h2 id="c-1-graalvm-与-spring-native" tabindex="-1">C.1　GraalVM 与 Spring Native <a class="header-anchor" href="#c-1-graalvm-与-spring-native" aria-label="Permalink to &quot;C.1　GraalVM 与 Spring Native&quot;">​</a></h2><p>在开始介绍 Spring Native 之前，先让我们来了解一下 GraalVM，无论 Spring Native，还是Quarkus，都需要依托于 GraalVM 来实现一些特定的功能。</p><h3 id="c-1-1-graalvm-简介" tabindex="-1">C.1.1　GraalVM 简介 <a class="header-anchor" href="#c-1-1-graalvm-简介" aria-label="Permalink to &quot;C.1.1　GraalVM 简介&quot;">​</a></h3><ul><li>2</li></ul><p>GraalVM 是 Oracle 开发的一款高性能 JDK 发行版</p><ul><li><p>，官网上罗列了它的几个重要特性。</p></li><li><p>高性能，GraalVM 提供了经过优化的 Graal 编译器，这是一款 JIT（Just in Time）编译器，可以生成更快、更精简、占用资源更少的代码。</p></li><li><p>AOT（Ahead of Time）本地镜像编译，事先把 Java 应用编译为本地镜像，做到启动迅速，无须预热就能达到性能峰值。</p></li><li><p>多语言支持，能够轻松地支持多种语言，不仅能为 Java 应用提速，还支持基于 JVM 的其3他语言，例如 Ruby 和 Python。</p></li><li><p>高级工具，提供了包含调试、监控、编译等多种工具。</p></li></ul><p>GraalVM 本地镜像是个利器，虽然好处很多，但受限于其静态特性，也带来了一些不变与局限，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>无法进行动态类加载，需要在编译期间提供大量的类信息（例如 Class.forName() 和</span></span>
<span class="line"><span>ServiceLoader.load() 中的类），而且这些类都需要进行额外配置才能编译到镜像里；</span></span></code></pre></div><ul><li><p>运行过程中的反射内容，需要在编译时用配置明确下来；</p></li><li><p>动态代理的类信息，有一部分可以自动推断，但仍有不少情况需要事先在编译时进行配置；</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>invokedynamic 的使用会受到限制，类似 Lambda 表达式这样的内容仍能继续使用，但</span></span></code></pre></div><ul><li>在运行时会引入不确定性的功能则无法支持。</li></ul><p>上面还只是罗列了一部分问题，在下文中，我们会用 GraalVM 来生成一个静态的本地镜像，届时大家就会看到我们在有了 Spring Native 的帮助后，仍然需要进行不少编译时配置和代码调整才能顺利让程序运行起来。总之，一切的好处都是有代价的。</p><h3 id="c-1-2-spring-native-简介" tabindex="-1">C.1.2　Spring Native 简介 <a class="header-anchor" href="#c-1-2-spring-native-简介" aria-label="Permalink to &quot;C.1.2　Spring Native 简介&quot;">​</a></h3><p>Spring Framework 中大量使用了动态代理技术，尤其是 AOP 增强的部分，都是由 JDK 动态代理或者 CGLIB 代码增强来实现的。而在工程中用到的各种类库也同样存在有悖“静态”原则的地方，没有底层框架的加持，完全依靠人来进行编译期的配置将是一个巨大的工程。特别是Spring 发展了这么多年，有着复杂的生态，生态内的成员之间彼此交错，虽然 SpringFramework 从 5.3 版本开始对 GraalVM 提供了较为完整的支持，但要让一个 Spring 工程“静态化”还是很困难。</p><ul><li>4</li></ul><p>出于上述原因，Spring Native</p><ul><li>项目诞生了，它的目的就是为那些想通过 GraalVM 将 Spring</li></ul><p>应用编译为本地镜像的项目提供支持。它由多个模块构成，主要包括：</p><ul><li><p>spring-native 与 spring-native-configuration，Spring Native 的相关依赖与配置；</p></li><li><p>spring-aot、spring-aot-test、spring-aot-maven-plugin 与 spring-aot-gradle-plugin，AOT生成相关的基础设施与插件；</p></li><li><p>spring-native-tools，一些编译过程中会用到的工具组合。</p></li></ul><p>Spring Native 为大家处理了很多繁琐的工作，而这些内容会随着实际使用的框架版本和GraalVM 版本发生变化，因此 Spring Native 的版本会与 Spring Boot（与其底层的 SpringFramework）和 GraalVM 版本强相关，以本附录中将用到的 0.11.5 为例，它与其他框架及相关内容的对应及版本关系如表 C-1 所示。</p><p>表 C-1　Spring Native 与其他框架及相关内容的对应及版本关系</p><p>内容</p><ul><li>版本</li></ul><p>Spring Native</p><ul><li>0.11.5</li></ul><p>Java</p><ul><li>11 与 17</li></ul><p>GraalVM</p><ul><li>22.0.0</li></ul><p>Spring Boot</p><ul><li><p>2.6.7</p></li><li><p>5</p></li></ul><p>Spring Cloud</p><ul><li>2021.0.1</li></ul><p>在 Spring Native 的帮助下，原先遥不可及的目标，变得跳一跳就能得到了。接下来，让我们</p><ul><li>6</li></ul><p>继续用第 10 章的 binarytea-jwt-auth 作为例子</p><ul><li>，演示一下如何将一个相对复杂的 Spring 工7</li></ul><p>程编译为本地镜像。</p><ul><li>请注意　这里要再次强调一下，虽然有 Spring Native，但这并不代表将一个已有的 Spring项目编译为本地镜像就很容易。这个过程中不仅需要调整依赖组件的版本，还有可能要调整代码，有时还不得不放弃一些功能。如果一个工程跑得好好的，没有非用 GraalVM 本地镜像不可的理由，那还是让它维持现状吧。</li></ul><h2 id="c-2-编译打包本地镜像" tabindex="-1">C.2　编译打包本地镜像 <a class="header-anchor" href="#c-2-编译打包本地镜像" aria-label="Permalink to &quot;C.2　编译打包本地镜像&quot;">​</a></h2><p>要将一个 Spring 项目编译打包为 GraalVM 本地镜像，整体上分为三个步骤：</p><p>(1) 前期的环境准备，主要是安装 GraalVM 相关的内容；</p><p>(2) 调整 Maven 或者 Gradle 编译打包的配置；</p><ul><li>8</li></ul><p>(3) 根据打包产物执行的情况调整代码</p><ul><li>。</li></ul><p>下面我们会详细拆解这三个步骤，仔细看看每步都要做些什么事情。</p><h3 id="c-2-1-准备工作" tabindex="-1">C.2.1　准备工作 <a class="header-anchor" href="#c-2-1-准备工作" aria-label="Permalink to &quot;C.2.1　准备工作&quot;">​</a></h3><p>这里的准备主要是指准备编译打包的环境，也就是安装符合版本要求的 GraalVM。在 macOS下可以使用 SDKMAN，Windows 环境则从官网下载安装包即可。下面是 SDKMAN 的安装命</p><ul><li>9</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>令，先用 sdk list java 找到合适的 GraalVM 版本，例如这里就是 22.0.0.2.r11-grl</span></span></code></pre></div><ul><li>，然</li></ul><p>后执行如下命令安装：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>▸ sdk install java 22.0.0.2.r11-grl</span></span>
<span class="line"><span>随后将 Java 切换到刚才安装的 GraalVM，或者直接将它作为默认的 Java 环境，然后用 gu</span></span></code></pre></div><p>命令安装 native-image 工具。具体命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>▸ sdk use java 22.0.0.2.r11-grl</span></span>
<span class="line"><span>Using java version 22.0.0.2.r11-grl in this shell.</span></span>
<span class="line"><span>▸ gu install native-image</span></span>
<span class="line"><span>Downloading: Release index file from oca.opensource.oracle.com</span></span>
<span class="line"><span>Downloading: Component catalog for GraalVM Enterprise Edition 22.0.0 on jdk11 fro</span></span>
<span class="line"><span>Downloading: Component catalog for GraalVM Enterprise Edition 22.0.0.1 on jdk11 f</span></span>
<span class="line"><span>Downloading: Component catalog from www.graalvm.org</span></span>
<span class="line"><span>Processing Component: Native Image</span></span>
<span class="line"><span>Downloading: Component native-image: Native Image from github.com</span></span>
<span class="line"><span>Installing new component: Native Image (org.graalvm.native-image, version 22.0.0.</span></span></code></pre></div><h3 id="c-2-2-调整编译打包配置" tabindex="-1">C.2.2　调整编译打包配置 <a class="header-anchor" href="#c-2-2-调整编译打包配置" aria-label="Permalink to &quot;C.2.2　调整编译打包配置&quot;">​</a></h3><p>现在来调整 Maven 配置。前面介绍过，我们这里使用 Spring Native 0.11.5 需要搭配 Spring</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Boot 2.6.7，因此需要更换 &lt;​parent/&gt; 里 spring-boot-starter-parent 的版本，将它调整为</span></span></code></pre></div><p>2.6.7，并在依赖中增加 Spring Native 的依赖，具体如代码示例 C-1 所示。Spring Boot 2.6.7里 Jackson JSON 的版本升级到了 2.13.2，所以还需要同步调整 jackson-datatype-joda-money 和 jackson-datatype-hibernate5 的版本，此处就不再赘述了。</p><ul><li>代码示例 C-1　调整 Spring Boot 版本并增加 Spring Native 依赖</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;?</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">xml</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> encoding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;UTF-8&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">?&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 https://maven.apache.or</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​modelVersion&gt;4.0.0&lt;​/modelVersion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​parent&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​groupId&gt;org.springframework.boot&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​artifactId&gt;spring-boot-starter-parent&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​version&gt;2.6.7&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​relativePath/&gt; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- lookup parent from repository --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/parent&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​dependencies&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;org.springframework.experimental&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;spring-native&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​version&gt;0.11.5&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       &lt;!-- 省略其他内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/dependencies&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   &lt;!-- 省略其他内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/project&gt;</span></span></code></pre></div><p>在 Maven 构建的插件部分，需要增加两个插件，具体如代码示例 C-2 所示。</p><ul><li><p>spring-aot-maven-plugin，增加 AOT 相关能力的支持。</p></li><li><p>hibernate-enhance-maven-plugin，在工程中使用了 Hibernate，它会引入一些字节码增强，通过这个插件可以实现构建时的字节码增强，而非运行时。</p></li><li><p>代码示例 C-2　增加两个构建项目的插件</p></li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​build&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​plugins&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;org.springframework.boot&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;spring-boot-maven-plugin&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;org.springframework.experimental&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;spring-aot-maven-plugin&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​version&gt;0.11.5&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​executions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​id&gt;generate&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​goal&gt;generate&lt;​/goal&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​/goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/executions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;org.hibernate.orm.tooling&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;hibernate-enhance-maven-plugin&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​version&gt;$&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​executions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​failOnError&gt;true&lt;​/failOnError&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​enableLazyInitialization&gt;true&lt;​/enableLazyInitialization&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​enableDirtyTracking&gt;true&lt;​/enableDirtyTracking&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​enableAssociationManagement&gt;true&lt;​/enableAssociationManag</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​enableExtendedEnhancement&gt;false&lt;​/enableExtendedEnhanceme</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​/configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​goal&gt;enhance&lt;​/goal&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​/goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/executions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/plugins&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/build&gt;</span></span></code></pre></div><p>这里用到的一些 Spring 依赖和插件可能还未发布到公共 Maven 仓库，所以我们还需要额外添加 Spring 的仓库，可以增加代码示例 C-3 中的配置。</p><ul><li>代码示例 C-3　额外增加 Spring 的 Maven 仓库</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​repositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​repository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​id&gt;spring-release&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​name&gt;Spring release&lt;​/name&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​url&gt;https://repo.spring.io/release&lt;​/url&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/repository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/repositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pluginRepositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​pluginRepository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​id&gt;spring-release&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​name&gt;Spring release&lt;​/name&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​url&gt;https://repo.spring.io/release&lt;​/url&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/pluginRepository&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/pluginRepositories&gt;</span></span></code></pre></div><p>最后一步，增加 GraalVM 构建本地镜像的构建动作。spring-boot-maven-plugin 本身在构建过</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>程中会创建 Fat Jar，为了加以区分，我们增加一个 nativeProfile，把 native-maven-plugin</span></span>
<span class="line"><span>配置在这个 Profile 里。同时，为 spring-boot-maven-plugin 配置 classifier，它的值为</span></span>
<span class="line"><span>exec。具体如代码示例 C-4 所示。</span></span></code></pre></div><ul><li>代码示例 C-4　增加编译本地镜像的 Maven Profile</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​profiles&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​profile&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​id&gt;native&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​build&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​plugins&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​groupId&gt;org.graalvm.buildtools&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​artifactId&gt;native-maven-plugin&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​version&gt;0.9.11&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​extensions&gt;true&lt;​/extensions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​executions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​id&gt;build-native&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                               &lt;​goal&gt;build&lt;​/goal&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​/goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​phase&gt;package&lt;​/phase&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​/execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​id&gt;test-native&lt;​/id&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                               &lt;​goal&gt;test&lt;​/goal&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​/goals&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                           &lt;​phase&gt;test&lt;​/phase&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       &lt;​/execution&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​/executions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               &lt;!-- Avoid a clash between Spring Boot repackaging and native-mav</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               &lt;​plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                   &lt;​groupId&gt;org.springframework.boot&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                   &lt;​artifactId&gt;spring-boot-maven-plugin&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                   &lt;​configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                       &lt;​classifier&gt;exec&lt;​/classifier&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                   &lt;​/configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               &lt;​/plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           &lt;​/plugins&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       &lt;​/build&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       &lt;​pluginRepositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       &lt;!</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">--</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 此处省略，内容同前文Spring的pluginRepositories --&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       &lt;​/pluginRepositories&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   &lt;​/profile&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;​/profiles&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">完成上述 pom.xml 调整后，就能执行下面的 Maven 命令进行构建了，其中的 -P 参数指定了</span></span></code></pre></div><p>具体使用的 Profile，这里跳过了测试。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>▸ mvn -Pnative -DskipTests clean package</span></span></code></pre></div><p>执行过程中，可以观察到如下输出（分为 7 个步骤，内容为部分截取）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GraalVM Native Image: Generating &#39;binarytea&#39; (executable)...</span></span>
<span class="line"><span>[1/7] Initializing...</span></span>
<span class="line"><span>[2/7] Performing analysis... [************]</span></span>
<span class="line"><span> 27,820 (94.62%) of 29,401 classes reachable</span></span>
<span class="line"><span> 47,951 (74.49%) of 64,373 fields reachable</span></span>
<span class="line"><span>145,804 (67.90%) of 214,724 methods reachable</span></span>
<span class="line"><span>  1,572 classes,   975 fields, and 8,529 methods registered for reflection</span></span>
<span class="line"><span>     69 classes,    91 fields, and    55 methods registered for JNI access</span></span>
<span class="line"><span>[3/7] Building universe...</span></span>
<span class="line"><span>[4/7] Parsing methods...      [****]</span></span>
<span class="line"><span>[5/7] Inlining methods...     [*****]</span></span>
<span class="line"><span>[6/7] Compiling methods...    [********]</span></span>
<span class="line"><span>[7/7] Creating image...</span></span>
<span class="line"><span> 59.22MB (45.37%) for code area:   95,488 compilation units</span></span>
<span class="line"><span> 60.22MB (46.13%) for image heap:  19,281 classes and 623,707 objects</span></span>
<span class="line"><span> 11.09MB ( 8.50%) for other data</span></span>
<span class="line"><span>130.53MB in total</span></span>
<span class="line"><span>Finished generating &#39;binarytea&#39; in 3m 56s.</span></span></code></pre></div><p>相比传统的 Fat Jar，本地镜像的构建可谓相当耗时，以此处使用的 BinaryTea 工程为例，在</p><ul><li>10</li></ul><p>M1 芯片 16G 内存的 MacBook Pro 上需要大概 4 分钟。</p><ul><li>构建后的产物名为 binarytea，大</li></ul><p>小在 120MB 左右，是个可执行文件。虽然构建能够成功，但构建的产物并不能正确运行，还需要根据错误提示信息进一步修改。</p><h3 id="c-2-3-修改代码" tabindex="-1">C.2.3　修改代码 <a class="header-anchor" href="#c-2-3-修改代码" aria-label="Permalink to &quot;C.2.3　修改代码&quot;">​</a></h3><p>不出所料，BinaryTea 工程无法在不变动代码的情况下编译为正确的本地镜像，遇到的问题总结如下。</p><ul><li><p>依赖的类库中存在动态加载类的情况，而且数量不少，Jadira UserType、JWT 和 JodaMoney 都有。</p></li><li><p>Spring Security 中有代码使用了反射机制获取属性。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Java 配置类中的 @Bean 方法本来使用了 CGLIB 字节码增强，现在等于变成了</span></span>
<span class="line"><span>@Configuration(proxyBeanMethods=false)，配置需要调整。11</span></span></code></pre></div><ul><li>有些注解需要动态代理增强，但构建时并未正确识别，需要提供一些配置。</li></ul><p>针对这些问题，让我们看看怎样逐一解决。</p><ol><li>解决类加载和反射问题</li></ol><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Jadira UserType 里使用了 ServiceLoader.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">load</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 来加载类的情况，数量多到已经不</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">想用 @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 来配置的地步了。考虑到我们其实只用了处理 Money 类的</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PersistentMoneyMinorAmount，可以去掉 usertype.core 这个依赖，自己编写一</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">个简单的 UserType 类就行了，如代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 所示。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">　处理 Money 类型转换的 Hibernate UserType 类代码片段</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MoneyType</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sqlTypes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] { Types.BIGINT };</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Class </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">returnedClass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Money.class;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nullSafeGet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ResultSet </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">rs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">names</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">13</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       SharedSessionContractImplementor </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">session</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Object </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">owner</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">throws</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Hibernat</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">14</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       Long val = rs.getLong(names[0]);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       return Money.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ofMinor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">CurrencyUnit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;CNY&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">18</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">19</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> nullSafeSet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(PreparedStatement st, Object value, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> index, Sha</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">session) throws HibernateException, SQLException {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">21</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> value) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">22</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           st.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setNull</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(index, Types.BIGINT);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">23</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">24</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           st.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setLong</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(index, ((Money) value).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAmountMinorLong</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">25</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">26</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">27</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 省略其他代码</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">28</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">29</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">随后，把原本配置了 PersistentMoneyMinorAmount 的地方调整为 MoneyType。以</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Amount 类为例，可以改为代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 那样，MenuItem 类的调整也是类似的。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">　使用 MoneyType 代替 PersistentMoneyMinorAmount</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Builder</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Data</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AllArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NoArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Embeddable</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Amount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;amount_discount&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> discount;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;amount_total&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;learning.spring.binarytea.support.MoneyType&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Money totalAmount;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">13</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;amount_pay&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;learning.spring.binarytea.support.MoneyType&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Money payAmount;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">JodaMoney 通过 Class.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 加载了 DefaultCurrencyUnitDataProvider</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">类，还读取了 CurrencyData.csv 和 CountryData.csv 两个资源文件，可以用 @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">和 @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ResourceHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 在 Java 配置类中添加提示，告诉 GraalVM 的插件把这些内容打包进</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">镜像。JWT 也有类似的问题，有 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 个类是用 Class.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 加载的，在 pom.xml 中</span></span></code></pre></div><ul><li>我们把 jjwt-impl 和 jjwt-jackson 声明为运行时才需要的，现在编译时就需要了，因此需要去</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>掉 &lt;​scope&gt;runtime&lt;​/scope&gt; 的配置。Spring Security 会通过反射读取</span></span>
<span class="line"><span>AuthenticationManagerBuilder 中的属性，也许要进行声明，@TypeHint 里的</span></span>
<span class="line"><span>access 可以指定访问类型，TypeAccess.DECLARED_FIELDS 就是允许访问所有声明了</span></span></code></pre></div><ul><li>的属性。我们把上述所有提示信息集中到一个配置类里，具体如代码示例 C-7 所示。</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">　用于配置 Spring Native 注解的 HintConfig 类</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Configuration</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHints</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> MoneyType.class),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // JWT</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DefaultJwtParserBuilder.class),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DefaultJwtBuilder.class),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DefaultClaims.class),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DefaultHeader.class),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DefaultJwsHeader.class),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // Joda Money</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">typeNames</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;org.joda.money.DefaultCurrencyUnitDataProvider&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // Spring</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">TypeHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">types</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AuthenticationManagerBuilder.class, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">access</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> TypeAccess.D</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">13</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ResourcesHints</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ResourceHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">patterns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;org/joda/money/CurrencyData.csv&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ResourceHint</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">patterns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;org/joda/money/CountryData.csv&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">18</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> HintConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">19</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">运行过程中，我们还会发现 MenuService 类的 </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getByNameAndSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 在</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Cacheable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 注解里配置了 SpEL 表达式，其中的 #root.methodName 无法正常解析，</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">这里我们就把这个方法的 @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Cacheable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 缓存去掉。如果在项目里没有用 SpEL 表达式，可</span></span></code></pre></div><ul><li><p>以告诉 spring-aot-maven-plugin，去掉相应的 SpEL 支持。类似地，还有一些其他配置，如表 C-2 所示。</p></li><li><p>表 C-2　spring-aot-maven-plugin 的一些配置</p></li><li><p>配置项默认值说明</p></li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">在具体使用时，可以在 &lt;​plugin/&gt; 中增加下面的配置：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​removeSpelSupport&gt;true&lt;​/removeSpelSupport&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">3</span></span></code></pre></div><ol start="2"><li>调整 Java 配置类在 BinaryTea 中需要调整的 Java 配置类主要是 Spring Security 相关的</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WebSecurityConfiguration。原先其中的很多 Bean 引用都是通过方法调用实现的，</span></span></code></pre></div><ul><li>在 CGLIB 的帮助下，多次调用方法实际只会执行一次，但现在调用一次就执行一次，尤其</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">是 </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">userDetailsService</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 还会往数据库里插入记录，第二次执行就会违反唯一性约</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">束。为此，我们可以尽可能将 Bean 配置从 WebSecurityConfiguration 中移出去，用</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Autowired</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 将 Spring 上下文里的 Bean 注入进来。同时，在定义 Bean 的时候把依赖变</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">为传参，可以将 WebSecurityConfiguration 里的 loginController、</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">jwtPreAuthenticatedAuthenticationProvider、</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">persistentTokenRepository 和 userDetailsService Bean 定义移到</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BinaryTeaApplication 里，具体如代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 所示。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">代码示例 C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">　增加了 Bean 定义的 BinaryTeaApplication 类</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SpringBootApplication</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">EnableCaching</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BinaryTeaApplication</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 省略原先已存在的方法</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Bean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/login&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UrlFilenameViewController </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">loginController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       UrlFilenameViewController controller </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UrlFilenameViewController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       controller.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSupportedMethods</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(HttpMethod.GET.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       controller.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSuffix</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;.html&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> controller;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">13</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Bean</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PreAuthenticatedAuthenticationProvider jwtPreAuthenticatedAuthentica</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">DataSource</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; dataSources,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    UserDetailsService userDetailsService) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       PreAuthenticatedAuthenticationProvider provider </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PreAuthenticatedA</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">18</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       provider.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPreAuthenticatedUserDetailsService</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">19</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserDetailsByNameServiceWrapper&lt;&gt;(userDetailsService));</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> provider;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">21</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">22</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">23</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Bean</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">24</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PersistentTokenRepository </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">persistentTokenRepository</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ObjectProvider&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">D</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">25</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       JdbcTokenRepositoryImpl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> tokenRepository</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> = </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> JdbcTokenRepositoryImpl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">26</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       tokenRepository</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">setDataSource</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dataSources.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getIfAvailable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">27</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       tokenRepository</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">setCreateTableOnStartup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">28</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> tokenRepository</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">29</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">30</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">31</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Bean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">32</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> UserDetailsService</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> userDetailsService</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ObjectProvider</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​DataSource</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dat</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">33</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       RoleBasedJdbcUserDetailsManager userDetailsManager </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RoleBasedJdbcU</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">34</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       userDetailsManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setDataSource</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dataSources.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getIfAvailable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">35</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       UserDetails manager </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> User.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">builder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">36</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">username</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;HanMeimei&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">37</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">password</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;$2a$10$iAty2GrJu9WfpksIen6qX.vczLmXlp.1q1OHBxWEX8BIldtwx</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">38</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           .roles(&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">MANAGER</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">39</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           .build();</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">40</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       userDetailsManager.createUser(manager);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">41</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return userDetailsManager;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">42</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">43</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">44</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">WebSecurityConfiguration 里也要做对应的调整。用 @Autowired 注入其他地方声</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">明的 Bean，authenticationManagerBean() 内部调用了父类的方法，所以不能移出</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">去。jwtAuthenticationFilter() 又依赖了 authenticationManagerBean()，所</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">以也要保留。jwtAuthenticationFilter() 在 configure (HttpSecurity</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">http) 里又被调用了一次，那次等于不是依赖 Bean 的，因此里面的 @Autowired 注解没</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">有生效。为了避免执行中缺少 JwtTokenHelper，抛出 NullPointerException，为</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">JwtAuthenticationFilter 增加 setJwtTokenHelper() 方法，手动将</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">jwtTokenHelper 注入进去。具体如代码示例 C-9 所示。</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">代码示例 C-9　调整后的 WebSecurityConfiguration 类</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">@Configuration</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">@EnableWebSecurity</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">@EnableGlobalMethodSecurity(securedEnabled = true,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">3</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                           prePostEnabled = true,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">4</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                           jsr250Enabled = true)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">5</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">6</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Autowired</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">7</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   private UserDetailsService userDetailsService;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">8</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Autowired</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">9</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   private PersistentTokenRepository persistentTokenRepository;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">10</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Autowired</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">11</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   private PreAuthenticatedAuthenticationProvider jwtPreAuthenticatedAuthentic</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">12</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Autowired</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">13</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   private JwtTokenHelper jwtTokenHelper;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">14</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">15</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Bean</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">16</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">17</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       JwtAuthenticationFilter filter = new JwtAuthenticationFilter();</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">18</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       filter.setJwtTokenHelper(jwtTokenHelper); // 手动注入依赖</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">19</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       filter.setAuthenticationManager(authenticationManagerBean());</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">20</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return filter;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">21</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">22</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">23</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Override</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">24</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   protected void configure(AuthenticationManagerBuilder auth) throws Exceptio</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">25</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       auth.authenticationProvider(jwtPreAuthenticatedAuthenticationProvider)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">26</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">(userDetailsService);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">27</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">28</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">29</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   @Override</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">30</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">31</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       // 这部分代码可以参考示例文件，此处省略</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">32</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">33</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   // 省略其他代码</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">34</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">35</span></span></code></pre></div><ol start="3"><li>配置动态代理类型在 BinaryTea 工程运行过程中，我们在日志中看到了不少类似下面这样的信息：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INFO 9628 --- [main] o.s.core.annotation.MergedAnnotation : Failed to introspec</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>java.util.Optional learning.spring.binarytea.controller.MenuController.createBy</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>binarytea.controller.request.NewMenuItemForm,org.springframework.validation.Bin</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>http.HttpServletResponse): com.oracle.svm.core.jdk.UnsupportedFeatureError: Pro</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span>interfaces [interface org.springframework.web.bind.annotation.PostMapping, inte</span></span>
<span class="line"><span>6</span></span>
<span class="line"><span>core.annotation.SynthesizedAnnotation] not found. Generating proxy classes at</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span>Proxy classes need to be defined at image build time by specifying the list of</span></span>
<span class="line"><span>8</span></span>
<span class="line"><span>implement. To define proxy classes use -H:DynamicProxyConfigurationFiles=&lt;​comma</span></span>
<span class="line"><span>9</span></span>
<span class="line"><span>and -H:DynamicProxyConfigurationResources=&lt;​comma-separated-config-resources&gt; op</span></span>
<span class="line"><span>大意是不支持在运行时生成代理类，可以在构建时将代理类的信息定义好，用 -</span></span>
<span class="line"><span>H:DynamicProxyConfigurationFiles 从文件中读取配置信息，或者用 -</span></span>
<span class="line"><span>H:DynamicProxyConfigurationResources 从 CLASSPATH 资源中读取配置信息。</span></span></code></pre></div><ul><li><p>我们可以在 resources 中新增一个 dynamic-proxy.json 文件，内容如代码示例 C-10 所示。里面的内容是一个 JSON 数组，数组中的每个元素都是一个代理类涉及的接口，接口的顺序要和上面日志中的接口顺序一致。</p></li><li><p>代码示例 C-10　dynamic-proxy.json 文件的内容</p></li></ul><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.springframework.web.bind.annotation.PostMapping&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;o</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">annotation.SynthesizedAnnotation&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ] },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.springframework.web.bind.annotation.GetMapping&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;o</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">4</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">annotation.SynthesizedAnnotation&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ] },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;org.springframework.boot.autoconfigure.web.servlet.Condi</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">6</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">org.springframework.core.annotation.SynthesizedAnnotation</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot; ] }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">7</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">8</span></span></code></pre></div><ul><li><p>随后，调整 pom.xml 中 native-maven-plugin 插件的配置，增加构建参数，具体如代码示例C-11 所示。</p></li><li><p>代码示例 C-11　调整 native-maven-plugin</p></li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​groupId&gt;org.graalvm.buildtools&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​artifactId&gt;native-maven-plugin&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​version&gt;0.9.11&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">4</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   &lt;!-- 省略部分内容 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​buildArgs&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​buildArg&gt;-H:DynamicProxyConfigurationResources=dynamic-proxy.json&lt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/buildArgs&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/configuration&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/plugin&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">11</span></span></code></pre></div><h3 id="c-2-4-其他优化" tabindex="-1">C.2.4　其他优化 <a class="header-anchor" href="#c-2-4-其他优化" aria-label="Permalink to &quot;C.2.4　其他优化&quot;">​</a></h3><p>在解决问题之余，我们还可以做一些优化，让生成的本地镜像跑得更快，占用资源更少，例如：</p><ul><li><p>可以用 tomcat-embed-programmatic 来代替 tomcat-embed-core 和 tomcat-embed-websocket；12</p></li><li><p>如果不用 Micrometer 来输出度量信息，可以从 spring-boot-starter-actuator 中去掉Micrometer 的依赖；</p></li><li><p>如前文提到的，去除不必要的 SpEL、XML 和 YAML 支持，但前提是明确自己确实不需要。13</p></li></ul><p>这些优化都放在 pom.xml 中（前两个都是对依赖的调整），具体如代码示例 C-12 所示。</p><ul><li>代码示例 C-12　对依赖的一些优化</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​groupId&gt;org.springframework.boot&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​artifactId&gt;spring-boot-starter-web&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​exclusions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​exclusion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;org.apache.tomcat.embed&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;tomcat-embed-core&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/exclusion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​exclusion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;org.apache.tomcat.embed&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;tomcat-embed-websocket&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/exclusion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/exclusions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​groupId&gt;org.apache.tomcat.experimental&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​artifactId&gt;tomcat-embed-programmatic&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​version&gt;$&lt;​/version&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​groupId&gt;org.springframework.boot&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​artifactId&gt;spring-boot-starter-actuator&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​exclusions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​exclusion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​groupId&gt;io.micrometer&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​artifactId&gt;micrometer-core&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/exclusion&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/exclusions&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span></code></pre></div><p>在完成了上述所有改动后，我们可以重新构建项目的本地镜像，然后通过浏览器访问 Web 界面，或者用 Customer 工程访问 REST 服务，系统应该能正常响应。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>对比一下现在使用的本地镜像与传统的 Fat Jar，在启动日志里找到 Started</span></span>
<span class="line"><span>BinaryTeaApplication in XXX seconds 那行，两者有着天壤之别。本地镜像启动仅</span></span></code></pre></div><p>需 0.434 秒，也就是 434 毫秒，内存占用大约在 94MB。而用 java -jar 方式运行 Fat Jar，启</p><ul><li>14</li></ul><p>动需要 3.544 秒，内存占用大约是 577MB，大约分别是前者的 8 倍与 6 倍。</p><ul><li>可见 Spring</li></ul><p>Native 与 GraalVM 还是为我们的二进制奶茶店项目带来了很大的性能提升的，无论是否运行在容器中，这种提升都是很可观的。</p><p>[1]：Quarkus 是由 RedHat 开发的微服务框架；Micronaut 则是由 ObjectComputing 维护的，这也是 Grails 的开发团队。[2]：JDK 中不仅包含编译器，也包含了 JVM 虚拟机。[3]：Ruby 有基于 JVM 的 JRuby，Python 则有 Jython。</p><p>[4]：项目早期的名字为 Spring GraalVM Native，后来改为 Spring Native。后续 Spring Native 的部分功能也有可能会合并到 Spring</p><ul><li>Framework 中，例如 AOT 相关的内容。</li></ul><p>[5]：这里的 Spring Boot 和 Spring Cloud 都不是完整支持的，有些可以无须额外配置直接支持，有的却不行。具体可以参考 Spring</p><ul><li>Native 官方文档了解详细的支持和配置信息。</li></ul><p>[6]：这个例子在 app3/binarytea 项目中。[7]：网上有些介绍 Spring Native 的文章，其中使用的例子就是 Hello World 级别的，没有太多依赖。相比之下，我们的 binarytea-</p><ul><li>jwt-auth 已经是复杂的了。但这个例子和实际的工程之间依然有很大差别，实际情况通常会更复杂。</li></ul><p>[8]：这里真的是需要根据实际打包后产物的执行情况来看的，反复尝试，打包后需要把所有的测试案例都执行一下，避免边边角角</p><ul><li>的功能出问题。越是复杂的项目越有可能需要调整代码，有时是用到的库不支持，还需要自己来调整库里的东西。</li></ul><p>[9]：如果使用了苹果 M1 芯片的电脑，支持 macOS ARM 64 位的 GraalVM 版本是从 22.1.0 开始的。经尝试，Spring Native 0.11.5</p><ul><li>也可以使用 GraalVM 22.1.0.r11-grl。</li></ul><p>[10]：在构建本地镜像时，尽量预留足够的内存，运行的电脑建议至少配置 8GB 内存。[11]：为了方便排查哪里的 Bean 定义存在问题，可以考虑在正常开发时就在 配置类中使用 ，关闭 CGLIB 增强，或者使用方法参数</p><ul><li>注入依赖。</li></ul><p>[12]：目前的 Spring Native 仅支持 Tomcat，还不支持其他的 Web 容器。[13]：在本例中我们没有去除 SpEL 和 YAML 的支持。[14]：两种方式都未做任何 JVM 参数配置或相关优化，都是命令行下的默认值。</p>`,138)])])}const c=i(p,[["render",t]]);export{d as __pageData,c as default};
