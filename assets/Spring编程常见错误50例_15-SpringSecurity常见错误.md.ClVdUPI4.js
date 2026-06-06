import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"15 | Spring Security 常见错误","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：遗忘 PasswordEncoder","slug":"案例-1-遗忘-passwordencoder","link":"#案例-1-遗忘-passwordencoder","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：ROLE_ 前缀与角色","slug":"案例-2-role-前缀与角色","link":"#案例-2-role-前缀与角色","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/15-SpringSecurity常见错误.md","filePath":"Spring编程常见错误50例/15-SpringSecurity常见错误.md","lastUpdated":1779817075000}'),i={name:"Spring编程常见错误50例/15-SpringSecurity常见错误.md"};function t(l,s,r,o,c,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_15-spring-security-常见错误" tabindex="-1">15 | Spring Security 常见错误 <a class="header-anchor" href="#_15-spring-security-常见错误" aria-label="Permalink to &quot;15 | Spring Security 常见错误&quot;">​</a></h1><p>你好，我是傅健。前面几节课我们学习了 Spring Web 开发中请求的解析以及过滤器的使用。这一节课，我们接着讲 Spring Security 的应用。</p><p>实际上，在 Spring 中，对于 Security 的处理基本都是借助于过滤器来协助完成的。粗略使用起来不会太难，但是 Security 本身是个非常庞大的话题，所以这里面遇到的错误自然不会少。好在使用 Spring Security 的应用和开发者实在是太多了，以致于时至今日，也没有太多明显的坑了。</p><p>在今天的课程里，我会带着你快速学习下两个典型的错误，相信掌握它们，关于 Spring Security 的雷区你就不需要太担心了。不过需要说明的是，授权的种类千千万，这里为了让你避免纠缠于业务逻辑实现，我讲解的案例都将直接基于 Spring Boot 使用默认的 Spring Security 实现来讲解。接下来我们正式进入课程的学习。</p><h2 id="案例-1-遗忘-passwordencoder" tabindex="-1">案例 1：遗忘 PasswordEncoder <a class="header-anchor" href="#案例-1-遗忘-passwordencoder" aria-label="Permalink to &quot;案例 1：遗忘 PasswordEncoder&quot;">​</a></h2><p>当我们第一次尝试使用 Spring Security 时，我们经常会忘记定义一个 PasswordEncoder。因为这在 Spring Security 旧版本中是允许的。而一旦使用了新版本，则必须要提供一个 PasswordEncoder。这里我们可以先写一个反例来感受下：</p><p>首先我们在 Spring Boot 项目中直接开启 Spring Security：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;spring-boot-starter-security&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>添加完这段依赖后，Spring Security 就已经生效了。然后我们配置下安全策略，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>public class MyWebSecurityConfig extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//    &amp;#64;Bean</span></span>
<span class="line"><span>//    public PasswordEncoder passwordEncoder() {</span></span>
<span class="line"><span>//        return new PasswordEncoder() {</span></span>
<span class="line"><span>//            &amp;#64;Override</span></span>
<span class="line"><span>//            public String encode(CharSequence charSequence) {</span></span>
<span class="line"><span>//                return charSequence.toString();</span></span>
<span class="line"><span>//            }</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//            &amp;#64;Override</span></span>
<span class="line"><span>//            public boolean matches(CharSequence charSequence, String</span><span> //            s) {</span></span>
<span class="line"><span>//                return Objects.equals(charSequence.toString(), s);</span></span>
<span class="line"><span>//            }</span></span>
<span class="line"><span>//        };</span></span>
<span class="line"><span>//    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(AuthenticationManagerBuilder auth) throws Exception {</span></span>
<span class="line"><span>        auth.inMemoryAuthentication()</span></span>
<span class="line"><span>                .withUser(&quot;admin&quot;).password(&quot;pass&quot;).roles(&quot;ADMIN&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 配置 URL 对应的访问权限</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>        http.authorizeRequests()</span></span>
<span class="line"><span>                .antMatchers(&quot;/admin/**&quot;).hasRole(&quot;ADMIN&quot;)</span></span>
<span class="line"><span>                .anyRequest().authenticated()</span></span>
<span class="line"><span>                .and()</span></span>
<span class="line"><span>                .formLogin().loginProcessingUrl(&quot;/login&quot;).permitAll()</span></span>
<span class="line"><span>                .and().csrf().disable();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里，我们故意“注释”掉 PasswordEncoder 类型 Bean 的定义。然后我们定义一个 SpringApplication 启动程序来启动服务，我们会发现启动成功了：</p><blockquote><p>INFO 8628 --- [ restartedMain] c.s.p.web.security.example1.Application : Started Application in 3.637 seconds (JVM running for 4.499)</p></blockquote><p>但是当我们发送一个请求时（例如 <a href="http://localhost:8080/admin" target="_blank" rel="noreferrer">http://localhost:8080/admin</a> ），就会报错java.lang.IllegalArgumentException: There is no PasswordEncoder mapped for the id &quot;null&quot;，具体错误堆栈信息如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/c89d57f20fd152dc3a224e9c16025131.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/c89d57f20fd152dc3a224e9c16025131.png" alt=""></a></p><p>所以，如果我们不按照最新版本的 Spring Security 教程操作，就很容易忘记 PasswordEncoder 这件事。那么为什么缺少它就会报错，它的作用又在哪？接下来我们具体解析下。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们可以反思下，为什么需要一个 PasswordEncoder。实际上，这是安全保护的范畴。</p><p>假设我们没有这样的一个东西，那么当用户输入登录密码之后，我们如何判断密码和内存或数据库中存储的密码是否一致呢？假设就是简单比较下是否相等，那么必然要求存储起来的密码是非加密的，这样其实就存在密码泄露的风险了。</p><p>反过来思考，为了安全，我们一般都会将密码加密存储起来。那么当用户输入密码时，我们就不是简单的字符串比较了。我们需要根据存储密码的加密算法来比较用户输入的密码和存储的密码是否一致。所以我们需要一个 PasswordEncoder 来满足这个需求。这就是为什么我们需要自定义一个 PasswordEncoder 的原因。</p><p>再看下它的两个关键方法 encode() 和 matches()，相信你就能理解它们的作用了。</p><p>思考下，假设我们默认提供一个出来并集成到 Spring Security 里面去，那么很可能隐藏错误，所以还是强制要求起来比较合适。</p><p>我们再从源码上看下 &quot;no PasswordEncoder&quot; 异常是如何被抛出的？当我们不指定PasswordEncoder去启动我们的案例程序时，我们实际指定了一个默认的PasswordEncoder，这点我们可以从构造器DaoAuthenticationProvider看出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public DaoAuthenticationProvider() {</span></span>
<span class="line"><span>setPasswordEncoder(PasswordEncoderFactories.createDelegatingPasswordEncoder());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看下PasswordEncoderFactories.createDelegatingPasswordEncoder()的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static PasswordEncoder createDelegatingPasswordEncoder() {</span></span>
<span class="line"><span>   String encodingId = &quot;bcrypt&quot;;</span></span>
<span class="line"><span>   Map&amp;lt;String, PasswordEncoder&amp;gt; encoders = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>   encoders.put(encodingId, new BCryptPasswordEncoder());</span></span>
<span class="line"><span>   encoders.put(&quot;ldap&quot;, new org.springframework.security.crypto.password.LdapShaPasswordEncoder());</span></span>
<span class="line"><span>   encoders.put(&quot;MD4&quot;, new org.springframework.security.crypto.password.Md4PasswordEncoder());</span></span>
<span class="line"><span>   encoders.put(&quot;MD5&quot;, new org.springframework.security.crypto.password.MessageDigestPasswordEncoder(&quot;MD5&quot;));</span></span>
<span class="line"><span>   encoders.put(&quot;noop&quot;, org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance());</span></span>
<span class="line"><span>   encoders.put(&quot;pbkdf2&quot;, new Pbkdf2PasswordEncoder());</span></span>
<span class="line"><span>   encoders.put(&quot;scrypt&quot;, new SCryptPasswordEncoder());</span></span>
<span class="line"><span>   encoders.put(&quot;SHA-1&quot;, new org.springframework.security.crypto.password.MessageDigestPasswordEncoder(&quot;SHA-1&quot;));</span></span>
<span class="line"><span>   encoders.put(&quot;SHA-256&quot;, new org.springframework.security.crypto.password.MessageDigestPasswordEncoder(&quot;SHA-256&quot;));</span></span>
<span class="line"><span>   encoders.put(&quot;sha256&quot;, new org.springframework.security.crypto.password.StandardPasswordEncoder());</span></span>
<span class="line"><span>   encoders.put(&quot;argon2&quot;, new Argon2PasswordEncoder());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   return new DelegatingPasswordEncoder(encodingId, encoders);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以换一个视角来看下这个DelegatingPasswordEncoder长什么样：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/2ebd57419d485223700db471c7d2fd7c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/2ebd57419d485223700db471c7d2fd7c.png" alt=""></a></p><p>通过上图可以看出，其实它是多个内置的 PasswordEncoder 集成在了一起。</p><p>当我们校验用户时，我们会通过下面的代码来匹配，参考DelegatingPasswordEncoder#matches：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private PasswordEncoder defaultPasswordEncoderForMatches = new UnmappedIdPasswordEncoder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public boolean matches(CharSequence rawPassword, String prefixEncodedPassword) {</span></span>
<span class="line"><span>   if (rawPassword == null &amp;&amp; prefixEncodedPassword == null) {</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   String id = extractId(prefixEncodedPassword);</span></span>
<span class="line"><span>   PasswordEncoder delegate = this.idToPasswordEncoder.get(id);</span></span>
<span class="line"><span>   if (delegate == null) {</span></span>
<span class="line"><span>      return this.defaultPasswordEncoderForMatches</span></span>
<span class="line"><span>         .matches(rawPassword, prefixEncodedPassword);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   String encodedPassword = extractEncodedPassword(prefixEncodedPassword);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   return delegate.matches(rawPassword, encodedPassword);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String extractId(String prefixEncodedPassword) {</span></span>
<span class="line"><span>   if (prefixEncodedPassword == null) {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //{</span></span>
<span class="line"><span>   int start = prefixEncodedPassword.indexOf(PREFIX);</span></span>
<span class="line"><span>   if (start != 0) {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //}</span></span>
<span class="line"><span>   int end = prefixEncodedPassword.indexOf(SUFFIX, start);</span></span>
<span class="line"><span>   if (end &amp;lt; 0) {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return prefixEncodedPassword.substring(start + 1, end);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，假设我们的 prefixEncodedPassword 中含有 id，则根据 id 到 DelegatingPasswordEncoder 的 idToPasswordEncoder 找出合适的 Encoder；假设没有 id，则使用默认的UnmappedIdPasswordEncoder。我们来看下它的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private class UnmappedIdPasswordEncoder implements PasswordEncoder {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public String encode(CharSequence rawPassword) {</span></span>
<span class="line"><span>      throw new UnsupportedOperationException(&quot;encode is not supported&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public boolean matches(CharSequence rawPassword,</span></span>
<span class="line"><span>      String prefixEncodedPassword) {</span></span>
<span class="line"><span>      String id = extractId(prefixEncodedPassword);</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;There is no PasswordEncoder mapped for the id \\&quot;&quot; + id + &quot;\\&quot;&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码可以看出，no PasswordEncoder for the id &quot;null&quot; 异常就是这样被 UnmappedIdPasswordEncoder 抛出的。那么这个可能含有 id 的 prefixEncodedPassword 是什么？其实它就是存储的密码，在我们的案例中由下面代码行中的 password() 指定：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auth.inMemoryAuthentication()        .withUser(&quot;admin&quot;).password(&quot;pass&quot;).roles(&quot;ADMIN&quot;);</span></span></code></pre></div><p>这里我们不妨测试下，修改下上述代码行，给密码指定一个加密方式，看看之前的异常还存在与否：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auth.inMemoryAuthentication()        .withUser(&quot;admin&quot;).password(&quot;{MD5}pass&quot;).roles(&quot;ADMIN&quot;);</span></span></code></pre></div><p>此时，以调试方式运行程序，你会发现，这个时候已经有了 id，且取出了合适的 PasswordEncoder。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/9d08d66e3f11be275998712bdd44847c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/9d08d66e3f11be275998712bdd44847c.png" alt=""></a></p><p>说到这里，相信你已经知道问题的来龙去脉了。问题的根源还是在于我们需要一个PasswordEncoder，而当前案例没有给我们指定出来。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>那么通过分析，你肯定知道如何解决这个问题了，无非就是自定义一个 PasswordEncoder。具体修正代码你可以参考之前给出的代码，这里不再重复贴出。</p><p>另外，通过案例解析，相信你也想到了另外一种解决问题的方式，就是在存储的密码上做文章。具体到我们案例，可以采用下面的修正方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auth.inMemoryAuthentication()        .withUser(&quot;admin&quot;).password(&quot;{noop}pass&quot;).roles(&quot;ADMIN&quot;);</span></span></code></pre></div><p>然后定位到这个方式，实际上就等于指定 PasswordEncoder 为NoOpPasswordEncoder了，它的实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class NoOpPasswordEncoder implements PasswordEncoder {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public String encode(CharSequence rawPassword) {</span></span>
<span class="line"><span>      return rawPassword.toString();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public boolean matches(CharSequence rawPassword, String encodedPassword) {</span></span>
<span class="line"><span>      return rawPassword.toString().equals(encodedPassword);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //省略部分非关键代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，这种修正方式比较麻烦，毕竟每个密码都加个前缀也不合适。所以综合比较来看，还是第一种修正方式更普适。当然如果你的需求是不同的用户有不同的加密，或许这种方式也是不错的。</p><h2 id="案例-2-role-前缀与角色" tabindex="-1">案例 2：ROLE_ 前缀与角色 <a class="header-anchor" href="#案例-2-role-前缀与角色" aria-label="Permalink to &quot;案例 2：ROLE\\_ 前缀与角色&quot;">​</a></h2><p>我们再来看一个 Spring Security 中关于权限角色的案例，ROLE_ 前缀加还是不加？不过这里我们需要提供稍微复杂一些的功能，即模拟授权时的角色相关控制。所以我们需要完善下案例，这里我先提供一个接口，这个接口需要管理的操作权限：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;admin&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String admin(){</span></span>
<span class="line"><span>         return &quot;admin operation&quot;;</span></span>
<span class="line"><span>    };</span></span></code></pre></div><p>然后我们使用 Spring Security 默认的内置授权来创建一个授权配置类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>public class MyWebSecurityConfig extends WebSecurityConfigurerAdapter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public PasswordEncoder passwordEncoder() {</span></span>
<span class="line"><span>      //同案例1，这里省略掉</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(AuthenticationManagerBuilder auth) throws Exception {</span></span>
<span class="line"><span>        auth.inMemoryAuthentication()</span></span>
<span class="line"><span>                .withUser(&quot;fujian&quot;).password(&quot;pass&quot;).roles(&quot;USER&quot;)</span></span>
<span class="line"><span>                .and()</span></span>
<span class="line"><span>                .withUser(&quot;admin1&quot;).password(&quot;pass&quot;).roles(&quot;ADMIN&quot;)</span></span>
<span class="line"><span>                .and()</span></span>
<span class="line"><span>                .withUser(new UserDetails() {</span></span>
<span class="line"><span>                    &amp;#64;Override</span></span>
<span class="line"><span>                    public Collection&amp;lt;? extends GrantedAuthority&amp;gt; getAuthorities() {</span></span>
<span class="line"><span>                        return Arrays.asList(new SimpleGrantedAuthority(&quot;ADMIN&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    //省略其他非关键“实现”方法</span></span>
<span class="line"><span>                    public String getUsername() {</span></span>
<span class="line"><span>                        return &quot;admin2&quot;;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 配置 URL 对应的访问权限</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void configure(HttpSecurity http) throws Exception {</span></span>
<span class="line"><span>    http.authorizeRequests()</span></span>
<span class="line"><span>              .antMatchers(&quot;/admin/**&quot;).hasRole(&quot;ADMIN&quot;)</span></span>
<span class="line"><span>              .anyRequest().authenticated()</span></span>
<span class="line"><span>              .and()</span></span>
<span class="line"><span>              .formLogin().loginProcessingUrl(&quot;/login&quot;).permitAll()</span></span>
<span class="line"><span>              .and().csrf().disable();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上述代码，我们添加了 3 个用户：</p><ol><li>用户 fujian：角色为 USER</li><li>用户 admin1：角色为 ADMIN</li><li>用户 admin2：角色为 ADMIN</li></ol><p>然后我们从浏览器访问我们的接口 <a href="http://localhost:8080/admin" target="_blank" rel="noreferrer">http://localhost:8080/admin</a>，使用上述 3 个用户登录，你会发现用户 admin1 可以登录，而 admin2 设置了同样的角色却不可以登陆，并且提示下面的错误：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/8e5a626c0c5600c1e98d9caf4408aaaf.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/8e5a626c0c5600c1e98d9caf4408aaaf.png" alt=""></a></p><p>如何理解这个现象？</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>要了解这个案例出现的原因，其实是需要我们对 Spring 安全中的 Role 前缀有一个深入的认识。不过，在这之前，你可能想不到案例出错的罪魁祸首就是它，所以我们得先找到一些线索。</p><p>对比 admin1 和 admin2 用户的添加，你会发现，这仅仅是两种添加内置用户的风格而已。但是为什么前者可以正常工作，后者却不可以？本质就在于 Role 的设置风格，可参考下面的这两段关键代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//admin1 的添加</span></span>
<span class="line"><span>.withUser(&quot;admin&quot;).password(&quot;pass&quot;).roles(&quot;ADMIN&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//admin2 的添加</span></span>
<span class="line"><span>.withUser(new UserDetails() {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Collection&amp;lt;? extends GrantedAuthority&amp;gt; getAuthorities() {</span></span>
<span class="line"><span>        return Arrays.asList(new SimpleGrantedAuthority(&quot;ADMIN&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String getUsername() {</span></span>
<span class="line"><span>        return &quot;admin2&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>查看上面这两种添加方式，你会发现它们真的仅仅是两种风格而已，所以最终构建出用户的代码肯定是相同的。我们先来查看下 admin1 的添加最后对 Role 的处理（参考 User.UserBuilder#roles）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public UserBuilder roles(String... roles) {</span></span>
<span class="line"><span>   List&amp;lt;GrantedAuthority&amp;gt; authorities = new ArrayList&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>         roles.length);</span></span>
<span class="line"><span>   for (String role : roles) {</span></span>
<span class="line"><span>      Assert.isTrue(!role.startsWith(&quot;ROLE_&quot;), () -&amp;gt; role</span></span>
<span class="line"><span>            + &quot; cannot start with ROLE_ (it is automatically added)&quot;);</span></span>
<span class="line"><span>      //添加“ROLE_”前缀</span></span>
<span class="line"><span>      authorities.add(new SimpleGrantedAuthority(&quot;ROLE_&quot; + role));</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return authorities(authorities);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public UserBuilder authorities(Collection&amp;lt;? extends GrantedAuthority&amp;gt; authorities) {</span></span>
<span class="line"><span>   this.authorities = new ArrayList&amp;lt;&amp;gt;(authorities);</span></span>
<span class="line"><span>   return this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，当 admin1 添加 ADMIN 角色时，实际添加进去的是 ROLE_ADMIN。但是我们再来看下 admin2 的角色设置，最终设置的方法其实就是 User#withUserDetails：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static UserBuilder withUserDetails(UserDetails userDetails) {</span></span>
<span class="line"><span>   return withUsername(userDetails.getUsername())</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>      .authorities(userDetails.getAuthorities())</span></span>
<span class="line"><span>      .credentialsExpired(!userDetails.isCredentialsNonExpired())</span></span>
<span class="line"><span>      .disabled(!userDetails.isEnabled());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public UserBuilder authorities(Collection&amp;lt;? extends GrantedAuthority&amp;gt; authorities) {</span></span>
<span class="line"><span>   this.authorities = new ArrayList&amp;lt;&amp;gt;(authorities);</span></span>
<span class="line"><span>   return this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，admin2 的添加，最终设置进的 Role 就是 ADMIN。</p><p>此时我们可以得出一个结论：通过上述两种方式设置的相同 Role（即 ADMIN），最后存储的 Role 却不相同，分别为 ROLE_ADMIN 和 ADMIN。那么为什么只有 ROLE_ADMIN 这种用户才能通过授权呢？这里我们不妨通过调试视图看下授权的调用栈，截图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/63cd862a979cbb5452b0c39d0de3941c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/63cd862a979cbb5452b0c39d0de3941c.png" alt=""></a></p><p>对于案例的代码，最终是通过 &quot;UsernamePasswordAuthenticationFilter&quot; 来完成授权的。而且从调用栈信息可以大致看出，授权的关键其实就是查找用户，然后校验权限。查找用户的方法可参考 InMemoryUserDetailsManager#loadUserByUsername，即根据用户名查找已添加的用户：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public UserDetails loadUserByUsername(String username)</span></span>
<span class="line"><span>      throws UsernameNotFoundException {</span></span>
<span class="line"><span>   UserDetails user = users.get(username.toLowerCase());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   if (user == null) {</span></span>
<span class="line"><span>      throw new UsernameNotFoundException(username);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   return new User(user.getUsername(), user.getPassword(), user.isEnabled(),</span></span>
<span class="line"><span>         user.isAccountNonExpired(), user.isCredentialsNonExpired(),</span></span>
<span class="line"><span>         user.isAccountNonLocked(), user.getAuthorities());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成账号是否过期、是否锁定等检查后，我们会把这个用户转化为下面的 Token（即 UsernamePasswordAuthenticationToken）供后续使用，关键信息如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/7a2254400c83055cf07785be119dc65c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/7a2254400c83055cf07785be119dc65c.png" alt=""></a></p><p>最终在判断角色时，我们会通过 UsernamePasswordAuthenticationToken 的父类方法 AbstractAuthenticationToken#getAuthorities 来取到上述截图中的 ADMIN。而判断是否具备某个角色时，使用的关键方法是 SecurityExpressionRoot#hasAnyAuthorityName：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean hasAnyAuthorityName(String prefix, String... roles) {</span></span>
<span class="line"><span>   //通过 AbstractAuthenticationToken#getAuthorities 获取“role”</span></span>
<span class="line"><span>   Set&amp;lt;String&amp;gt; roleSet = getAuthoritySet();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   for (String role : roles) {</span></span>
<span class="line"><span>      String defaultedRole = getRoleWithDefaultPrefix(prefix, role);</span></span>
<span class="line"><span>      if (roleSet.contains(defaultedRole)) {</span></span>
<span class="line"><span>         return true;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//尝试添加“prefix”,即“ROLE_”</span></span>
<span class="line"><span>private static String getRoleWithDefaultPrefix(String defaultRolePrefix, String role) {</span></span>
<span class="line"><span>   if (role == null) {</span></span>
<span class="line"><span>      return role;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (defaultRolePrefix == null || defaultRolePrefix.length() == 0) {</span></span>
<span class="line"><span>      return role;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (role.startsWith(defaultRolePrefix)) {</span></span>
<span class="line"><span>      return role;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return defaultRolePrefix + role;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述代码中，prefix 是 ROLE_（默认值，即 SecurityExpressionRoot#defaultRolePrefix），Roles 是待匹配的角色 ROLE_ADMIN，产生的 defaultedRole 是 ROLE_ADMIN，而我们的 role-set 是从 UsernamePasswordAuthenticationToken 中获取到 ADMIN，所以最终判断的结果是 false。</p><p>最终这个结果反映给上层来决定是否通过授权，可参考 WebExpressionVoter#vote：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int vote(Authentication authentication, FilterInvocation fi,</span></span>
<span class="line"><span>      Collection&amp;lt;ConfigAttribute&amp;gt; attributes) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   return ExpressionUtils.evaluateAsBoolean(weca.getAuthorizeExpression(), ctx) ? ACCESS_GRANTED</span></span>
<span class="line"><span>         : ACCESS_DENIED;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>很明显，当是否含有某个角色（表达式 Expression：hasRole(&#39;ROLE_ADMIN&#39;)）的判断结果为 false 时，返回的结果是 ACCESS_DENIED。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>针对这个案例，有了源码的剖析，可以看出： <strong>ROLE_ 前缀在 Spring Security 前缀中非常重要。</strong> 而要解决这个问题，也非常简单，我们直接在添加 admin2 时，给角色添加上 ROLE_ 前缀即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//admin2 的添加</span></span>
<span class="line"><span>.withUser(new UserDetails() {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Collection&amp;lt;? extends GrantedAuthority&amp;gt; getAuthorities() {</span></span>
<span class="line"><span>        return Arrays.asList(new SimpleGrantedAuthority(&quot;ROLE_ADMIN&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String getUsername() {</span></span>
<span class="line"><span>        return &quot;admin2&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>参考上述代码，我们给 Role 添加了前缀，重新运行程序后，结果符合预期。</p><p>反思这个案例，我们可以总结出：有时候，不同的 API 提供了不同的设置 Role 的方式，但是我们一定要注意是否需要添加 ROLE_ 这个前缀。而如何判断，这里我也没有更好的办法，只能通过经验或者查看源码来核实了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>最后我们梳理下课程中所提及的重点。</p><ol><li>PasswordEncoder</li></ol><p>在新版本的 Spring Security 中，你一定不要忘记指定一个PasswordEncoder，因为出于安全考虑，我们肯定是要对密码加密的。至于如何指定，其实有多种方式。常见的方式是自定义一个PasswordEncoder类型的Bean。还有一种不常见的方式是通过存储密码时加上加密方法的前缀来指定，例如密码原来是password123，指定前缀后可能是 {MD5}password123。我们可以根据需求来采取不同的解决方案。</p><ol start="2"><li>Role</li></ol><p>在使用角色相关的授权功能时，你一定要注意这个角色是不是加了前缀 ROLE_。</p><p>虽然 Spring 在很多角色的设置上，已经尽量尝试加了前缀，但是仍然有许多接口是可以随意设置角色的。所以有时候你没意识到这个问题去随意设置的话，在授权检验时就会出现角色控制不能生效的情况。从另外一个角度看，当你的角色设置失败时，你一定要关注下是不是忘记加前缀了。</p><p>以上即为这节课的重点，希望你能有所收获。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>通过案例 1 的学习，我们知道在 Spring Boot 开启 Spring Security 时，访问需要授权的 API 会自动跳转到如下登录页面，你知道这个页面是如何产生的么？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/a948174fbef26106068ece39068ba4af.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378170/a948174fbef26106068ece39068ba4af.png" alt=""></a></p><p>期待你的思考，我们留言区见！</p>`,94)])])}const h=n(i,[["render",t]]);export{g as __pageData,h as default};
