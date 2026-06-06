import{_ as s,H as t,f as n,i as e}from"./chunks/framework.BH2BK_3i.js";const c=JSON.parse('{"title":"11 | 服务发布和引用的实践","description":"","frontmatter":{},"headers":[{"level":2,"title":"XML配置方式的服务发布和引用流程","slug":"xml配置方式的服务发布和引用流程","link":"#xml配置方式的服务发布和引用流程","children":[]},{"level":2,"title":"服务发布和引用的那些坑","slug":"服务发布和引用的那些坑","link":"#服务发布和引用的那些坑","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"从0开始学微服务/11-服务发布和引用的实践.md","filePath":"从0开始学微服务/11-服务发布和引用的实践.md","lastUpdated":1779818389000}'),p={name:"从0开始学微服务/11-服务发布和引用的实践.md"};function o(u,a,i,r,l,m){return t(),n("div",null,[...a[0]||(a[0]=[e(`<h1 id="_11-服务发布和引用的实践" tabindex="-1">11 | 服务发布和引用的实践 <a class="header-anchor" href="#_11-服务发布和引用的实践" aria-label="Permalink to &quot;11 | 服务发布和引用的实践&quot;">​</a></h1><p>在 <a href="http://time.geekbang.org/column/article/14425" target="_blank" rel="noreferrer">专栏第4期</a>，我给你讲解了服务发布和引用常见的三种方式：Restful API、XML配置以及IDL文件。今天我将以XML配置方式为例，给你讲解服务发布和引用的具体实践以及可能会遇到的问题。</p><p>首先我们一起来看下XML配置方式，服务发布和引用的具体流程是什么样的。</p><h2 id="xml配置方式的服务发布和引用流程" tabindex="-1">XML配置方式的服务发布和引用流程 <a class="header-anchor" href="#xml配置方式的服务发布和引用流程" aria-label="Permalink to &quot;XML配置方式的服务发布和引用流程&quot;">​</a></h2><p><strong>1. 服务提供者定义接口</strong></p><p>服务提供者发布服务之前首先要定义接口，声明接口名、传递参数以及返回值类型，然后把接口打包成JAR包发布出去。</p><p>比如下面这段代码，声明了接口UserLastStatusService，包含两个方法getLastStatusId和getLastStatusIds，传递参数一个是long值、一个是long数组，返回值一个是long值、一个是map。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.weibo.api.common.status.service;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface UserLastStatusService {</span></span>
<span class="line"><span>     * &amp;#64;param uids</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public long getLastStatusId(long uid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;param uids</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public Map&amp;lt;Long, Long&amp;gt; getLastStatusIds(long[] uids);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>2. 服务提供者发布接口</strong></p><p>服务提供者发布的接口是通过在服务发布配置文件中定义接口来实现的。</p><p>下面我以一个具体的服务发布配置文件user-last-status.xml来给你讲解，它定义了要发布的接口userLastStatusLocalService，对外暴露的协议是Motan协议，端口是8882。并且针对两个方法getLastStatusId和getLastStatusIds，通过requestTimeout=&quot;300&quot;单独定义了超时时间是300ms，通过retries=&quot;0&quot;单独定义了调用失败后重试次数为0，也就是不重试。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>      xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>      xmlns:context=&quot;http://www.springframework.org/schema/context&quot;</span></span>
<span class="line"><span>      xmlns:aop=&quot;http://www.springframework.org/schema/aop&quot;</span></span>
<span class="line"><span>     xsi:schemaLocation=&quot;http://www.springframework.org/schema/context</span></span>
<span class="line"><span>            http://www.springframework.org/schema/context/spring-context-2.5.xsd</span></span>
<span class="line"><span>http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.5.xsd</span></span>
<span class="line"><span>http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-2.5.xsd</span></span>
<span class="line"><span>&quot;&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;lt;motan:service ref=&quot;userLastStatusLocalService&quot;</span></span>
<span class="line"><span>            requestTimeout=&quot;50&quot; retries=&quot;2&quot;    interface=&quot;com.weibo.api.common.status.service.UserLastStatusService&quot;</span></span>
<span class="line"><span>            basicService=&quot;serviceBasicConfig&quot; export=&quot;motan:8882&quot;&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;motan:method name=&quot;getLastStatusId&quot; requestTimeout=&quot;300&quot;</span></span>
<span class="line"><span>              retries=&quot;0&quot; /&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;motan:method name=&quot;getLastStatusIds&quot; requestTimeout=&quot;300&quot;</span></span>
<span class="line"><span>              retries=&quot;0&quot; /&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/motan:service&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;/beans&amp;gt;</span></span></code></pre></div><p>然后服务发布者在进程启动的时候，会加载配置文件user-last-status.xml，把接口对外暴露出去。</p><p><strong>3. 服务消费者引用接口</strong></p><p>服务消费者引用接口是通过在服务引用配置文件中定义要引用的接口，并把包含接口定义的JAR包引入到代码依赖中。</p><p>下面我再以一个具体的服务引用配置文件user-last-status-client.xml来给你讲解，它定义服务消费者引用了接口commonUserLastStatusService，接口通信协议是Motan。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>      xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>      xmlns:context=&quot;http://www.springframework.org/schema/context&quot;</span></span>
<span class="line"><span>      xmlns:aop=&quot;http://www.springframework.org/schema/aop&quot;</span></span>
<span class="line"><span>     xsi:schemaLocation=&quot;http://www.springframework.org/schema/context</span></span>
<span class="line"><span>            http://www.springframework.org/schema/context/spring-context-2.5.xsd</span></span>
<span class="line"><span>http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.5.xsd</span></span>
<span class="line"><span>http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-2.5.xsd</span></span>
<span class="line"><span>&quot;&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;motan:protocol name=&quot;motan&quot; default=&quot;true&quot; loadbalance=&quot;\${service.loadbalance.name}&quot; /&amp;gt;</span></span>
<span class="line"><span>&amp;lt;motan:basicReferer id=&quot;userLastStatusServiceClientBasicConfig&quot;</span></span>
<span class="line"><span>               protocol=&quot;motan&quot;  /&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;!-- 导出接口 --&amp;gt;</span></span>
<span class="line"><span>&amp;lt;motan:referer id=&quot;commonUserLastStatusService&quot; interface=&quot;com.weibo.api.common.status.service.UserLastStatusService&quot;</span></span>
<span class="line"><span>            basicReferer=&quot;userLastStatusServiceClientBasicConfig&quot; /&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;/beans&amp;gt;</span></span></code></pre></div><p>然后服务消费者在进程启动时，会加载配置文件user-last-status-client.xml来完成服务引用。</p><p>上面所讲的服务发布和引用流程看似比较简单，但在实际使用过程中，还是有很多坑的，比如在实际项目中经常会遇到这个问题：一个服务包含了多个接口，可能有上行接口也可能有下行接口，每个接口都有超时控制以及是否重试等配置，如果有多个服务消费者引用这个服务，是不是每个服务消费者都必须在服务引用配置文件中定义？</p><p>你可以先思考一下这个问题，联系自己的实践经验，是否有理想的解决方案呢？</p><h2 id="服务发布和引用的那些坑" tabindex="-1">服务发布和引用的那些坑 <a class="header-anchor" href="#服务发布和引用的那些坑" aria-label="Permalink to &quot;服务发布和引用的那些坑&quot;">​</a></h2><p>根据我的项目经验，在一个服务被多个服务消费者引用的情况下，由于业务经验的参差不齐，可能不同的服务消费者对服务的认知水平不一，比如某个服务可能调用超时了，最好可以重试来提供调用成功率。但可能有的服务消费者会忽视这一点，并没有在服务引用配置文件中配置接口调用超时重试的次数， <strong>因此最好是可以在服务发布的配置文件中预定义好类似超时重试次数</strong>，即使服务消费者没有在服务引用配置文件中定义，也能继承服务提供者的定义。这就是下面要讲的服务发布预定义配置。</p><p><strong>1. 服务发布预定义配置</strong></p><p>以下面的服务发布配置文件server.xml为例，它提供了一个服务contentSliceRPCService，并且明确了其中三个方法的调用超时时间为500ms以及超时重试次数为3。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;motan:service ref=&quot;contentSliceRPCService&quot;       interface=&quot;cn.sina.api.data.service.ContentSliceRPCService&quot;</span></span>
<span class="line"><span>            basicService=&quot;serviceBasicConfig&quot; export=&quot;motan:8882&quot; &amp;gt;</span></span>
<span class="line"><span>   &amp;lt;motan:method name=&quot;saveContent&quot; requestTimeout=&quot;500&quot;</span></span>
<span class="line"><span>              retries=&quot;3&quot; /&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;motan:method name=&quot;deleteContent&quot; requestTimeout=&quot;500&quot;</span></span>
<span class="line"><span>              retries=&quot;3&quot; /&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;motan:method name=&quot;updateContent&quot; requestTimeout=&quot;500&quot;</span></span>
<span class="line"><span>              retries=&quot;3&quot; /&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/motan:service&amp;gt;</span></span></code></pre></div><p>假设服务引用的配置文件client.xml的内容如下，那么服务消费者就会默认继承服务发布配置文件中设置的方法调用的超时时间以及超时重试次数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;motan:referer id=&quot;contentSliceRPCService&quot; interface=&quot;cn.sina.api.data.service.ContentSliceRPCService&quot;     basicReferer=&quot;contentSliceClientBasicConfig&quot; &amp;gt;</span></span>
<span class="line"><span>&amp;lt;/motan:referer&amp;gt;</span></span></code></pre></div><p>通过服务发布预定义配置可以解决多个服务消费者引用服务可能带来的配置复杂的问题，这样是不是最优的解决方案呢？</p><p>实际上我还遇到过另外一种极端情况，一个服务提供者发布的服务有上百个方法，并且每个方法都有各自的超时时间、重试次数等信息。服务消费者引用服务时，完全继承了服务发布预定义的各项配置。这种情况下，服务提供者所发布服务的详细配置信息都需要存储在注册中心中，这样服务消费者才能在实际引用时从服务发布预定义配置中继承各种配置。</p><p>这里就存在一种风险，当服务提供者发生节点变更，尤其是在网络频繁抖动的情况下，所有的服务消费者都会从注册中心拉取最新的服务节点信息，就包括了服务发布配置中预定的各项接口信息，这个信息不加限制的话可能达到1M以上，如果同时有上百个服务消费者从注册中心拉取服务节点信息，在注册中心机器部署为百兆带宽的情况下，很有可能会导致网络带宽打满的情况发生。</p><p>面对这种情况， <strong>最好的办法是把服务发布端的详细服务配置信息转移到服务引用端</strong>，这样的话注册中心中就不需要存储服务提供者发布的详细服务配置信息了。这就是下面要讲的服务引用定义配置。</p><p><strong>2. 服务引用定义配置</strong></p><p>以下面的服务发布配置文件为例，它详细定义了服务userInfoService的各个方法的配置信息，比如超时时间和重试次数等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;motan:service ref=&quot;userInfoService&quot; requestTimeout=&quot;50&quot; retries=&quot;2&quot;                   interface=&quot;cn.sina.api.user.service.UserInfoService&quot; basicService=&quot;serviceBasicConfig&quot;&amp;gt;</span></span>
<span class="line"><span>&amp;lt;motan:method name=&quot;addUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;updateUserPortrait&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;modifyUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;addUserTags&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;delUserTags&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;processUserCacheByNewMyTriggerQ&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;modifyObjectUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;addObjectUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;updateObjectUserPortrait&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;updateObjectManager&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;add&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;deleteObjectManager&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getUserAttr&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getUserAttrList&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getAllUserAttr&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getUserAttr2&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;/motan:service&amp;gt;</span></span></code></pre></div><p>可以像下面一样，把服务userInfoService的详细配置信息转移到服务引用配置文件中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;motan:referer id=&quot;userInfoService&quot; interface=&quot;cn.sina.api.user.service.UserInfoService&quot; basicReferer=&quot;userClientBasicConfig&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;addUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;updateUserPortrait&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;modifyUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;addUserTags&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;delUserTags&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;processUserCacheByNewMyTriggerQ&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;modifyObjectUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;addObjectUserInfo&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;updateObjectUserPortrait&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;updateObjectManager&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;add&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;deleteObjectManager&quot; requestTimeout=&quot;300&quot; retries=&quot;0&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getUserAttr&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getUserAttrList&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getAllUserAttr&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:method name=&quot;getUserAttr2&quot; requestTimeout=&quot;300&quot; retries=&quot;1&quot; /&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/motan:referer&amp;gt;</span></span></code></pre></div><p>这样的话，服务发布配置文件可以简化为下面这段代码，是不是信息精简了许多。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;motan:service ref=&quot;userInfoService&quot; requestTimeout=&quot;50&quot; retries=&quot;2&quot;                   interface=&quot;cn.sina.api.user.service.UserInfoService&quot; basicService=&quot;serviceBasicConfig&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/motan:service&amp;gt;</span></span></code></pre></div><p>在进行类似的服务详细信息配置，由服务发布配置文件迁移到服务引用配置文件的过程时，尤其要注意迁移步骤问题，这就是接下来我要给你讲的服务配置升级问题。</p><p><strong>3. 服务配置升级</strong></p><p>实际项目中，我就经历过一次服务配置升级的过程。由于引用服务的服务消费者众多，并且涉及多个部门，升级步骤就显得异常重要，通常可以按照下面步骤操作。</p><ul><li><p>各个服务消费者在服务引用配置文件中添加服务详细信息。</p></li><li><p>服务提供者升级两台服务器，在服务发布配置文件中删除服务详细信息，并观察是否所有的服务消费者引用时都包含服务详细信息。</p></li><li><p>如果都包含，说明所有服务消费者均完成升级，那么服务提供者就可以删除服务发布配置中的服务详细信息。</p></li><li><p>如果有不包含服务详细信息的服务消费者，排查出相应的业务方进行升级，直至所有业务方完成升级。</p></li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我给你介绍了XML配置方式的服务发布和引用的具体流程，简单来说就是服务提供者定义好接口，并且在服务发布配置文件中配置要发布的接口名，在进程启动时加载服务发布配置文件就可以对外提供服务了。而服务消费者通过在服务引用配置文件中定义相同的接口名，并且在服务引用配置文件中配置要引用的接口名，在进程启动时加载服务引用配置文件就可以引用服务了。</p><p>在业务具体实践过程中可能会遇到引用服务的服务消费者众多，对业务的敏感度参差不齐的问题，所以在服务发布的时候，最好预定义好接口的各种配置。在服务规模不大，业务比较简单的时候，这样做比较合适。但是对于复杂业务，虽然服务发布时预定义好接口的各种配置，但在引用的服务消费者众多且同时访问的时候，可能会引起网络风暴。这种情况下，比较保险的方式是，把接口的各种配置放在服务引用配置文件里。</p><p>在进行服务配置升级过程时，要考虑好步骤，在所有服务消费者完成升级之前，服务提供者还不能把服务的详细信息去掉，否则可能会导致没有升级的服务消费者引用异常。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>如果你在实际项目中采用过XML配置的服务发布和应用方式，是否还遇到过其他问题？你是如何解决的呢？</p><p>欢迎你在留言区写下自己的思考，与我一起讨论。</p>`,49)])])}const g=s(p,[["render",o]]);export{c as __pageData,g as default};
