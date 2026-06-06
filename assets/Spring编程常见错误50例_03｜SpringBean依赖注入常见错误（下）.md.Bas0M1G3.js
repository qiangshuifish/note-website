import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"03｜Spring Bean 依赖注入常见错误（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例1：@Value没有注入预期的值","slug":"案例1-value没有注入预期的值","link":"#案例1-value没有注入预期的值","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例2：错乱的注入集合","slug":"案例2-错乱的注入集合","link":"#案例2-错乱的注入集合","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/03｜SpringBean依赖注入常见错误（下）.md","filePath":"Spring编程常见错误50例/03｜SpringBean依赖注入常见错误（下）.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/03｜SpringBean依赖注入常见错误（下）.md"};function l(i,n,r,c,o,u){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_03-spring-bean-依赖注入常见错误-下" tabindex="-1">03｜Spring Bean 依赖注入常见错误（下） <a class="header-anchor" href="#_03-spring-bean-依赖注入常见错误-下" aria-label="Permalink to &quot;03｜Spring Bean 依赖注入常见错误（下）&quot;">​</a></h1><p>你好，我是傅健，这节课我们接着聊Spring的自动注入。</p><p>上一讲我们介绍了3个Spring编程中关于依赖注入的错误案例，这些错误都是比较常见的。如果你仔细分析的话，你会发现它们大多都是围绕着@Autowired、@Qualifier的使用而发生，而且自动注入的类型也都是普通对象类型。</p><p>那在实际应用中，我们也会使用@Value等不太常见的注解来完成自动注入，同时也存在注入到集合、数组等复杂类型的场景。这些情况下，我们也会遇到一些问题。所以这一讲我们不妨来梳理下。</p><h2 id="案例1-value没有注入预期的值" tabindex="-1">案例1：@Value没有注入预期的值 <a class="header-anchor" href="#案例1-value没有注入预期的值" aria-label="Permalink to &quot;案例1：@Value没有注入预期的值&quot;">​</a></h2><p>在装配对象成员属性时，我们常常会使用@Autowired来装配。但是，有时候我们也使用@Value进行装配。不过这两种注解使用风格不同，使用@Autowired一般都不会设置属性值，而@Value必须指定一个字符串值，因为其定义做了要求，定义代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public &amp;#64;interface Value {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   /**</span></span>
<span class="line"><span>    * The actual value expression &amp;mdash; for example, &amp;lt;code&amp;gt;#{systemProperties.myProp}&amp;lt;/code&amp;gt;.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>   String value();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外在比较这两者的区别时， <strong>我们一般都会因为@Value常用于String类型的装配而误以为@Value不能用于非内置对象的装配，实际上这是一个常见的误区</strong>。例如，我们可以使用下面这种方式来Autowired一个属性成员：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Value(&quot;#{student}&quot;)</span></span>
<span class="line"><span>private Student student;</span></span></code></pre></div><p>其中student这个Bean定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public Student student(){</span></span>
<span class="line"><span>    Student student = createStudent(1, &quot;xie&quot;);</span></span>
<span class="line"><span>    return student;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，正如前面提及，我们使用@Value更多是用来装配String，而且它支持多种强大的装配方式，典型的方式参考下面的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//注册正常字符串</span></span>
<span class="line"><span>&amp;#64;Value(&quot;我是字符串&quot;)</span></span>
<span class="line"><span>private String text;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//注入系统参数、环境变量或者配置文件中的值</span></span>
<span class="line"><span>&amp;#64;Value(&quot;\${ip}&quot;)</span></span>
<span class="line"><span>private String ip</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//注入其他Bean属性，其中student为bean的ID，name为其属性</span></span>
<span class="line"><span>&amp;#64;Value(&quot;#{student.name}&quot;)</span></span>
<span class="line"><span>private String name;</span></span></code></pre></div><p>上面我给你简单介绍了@Value的强大功能，以及它和@Autowired的区别。那么在使用@Value时可能会遇到那些错误呢？这里分享一个最为典型的错误，即使用@Value可能会注入一个不是预期的值。</p><p>我们可以模拟一个场景，我们在配置文件application.properties配置了这样一个属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>username=admin</span></span>
<span class="line"><span>password=pass</span></span></code></pre></div><p>然后我们在一个Bean中，分别定义两个属性来引用它们：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class ValueTestController {</span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${username}&quot;)</span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${password}&quot;)</span></span>
<span class="line"><span>    private String password;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;user&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String getUser(){</span></span>
<span class="line"><span>       return username + &quot;:&quot; + password;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当我们去打印上述代码中的username和password时，我们会发现password正确返回了，但是username返回的并不是配置文件中指明的admin，而是运行这段程序的计算机用户名。很明显，使用@Value装配的值没有完全符合我们的预期。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>通过分析运行结果，我们可以知道@Value的使用方式应该是没有错的，毕竟password这个字段装配上了，但是为什么username没有生效成正确的值？接下来我们就来具体解析下。</p><p>我们首先了解下对于@Value，Spring是如何根据@Value来查询“值”的。我们可以先通过方法DefaultListableBeanFactory#doResolveDependency来了解@Value的核心工作流程，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>public Object doResolveDependency(DependencyDescriptor descriptor, &amp;#64;Nullable String beanName,</span></span>
<span class="line"><span>      &amp;#64;Nullable Set&amp;lt;String&amp;gt; autowiredBeanNames, &amp;#64;Nullable TypeConverter typeConverter) throws BeansException {</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>    Class&amp;lt;?&amp;gt; type = descriptor.getDependencyType();</span></span>
<span class="line"><span>      //寻找&amp;#64;Value</span></span>
<span class="line"><span>      Object value = getAutowireCandidateResolver().getSuggestedValue(descriptor);</span></span>
<span class="line"><span>      if (value != null) {</span></span>
<span class="line"><span>         if (value instanceof String) {</span></span>
<span class="line"><span>            //解析Value值</span></span>
<span class="line"><span>            String strVal = resolveEmbeddedValue((String) value);</span></span>
<span class="line"><span>            BeanDefinition bd = (beanName != null &amp;&amp; containsBean(beanName) ?</span></span>
<span class="line"><span>                  getMergedBeanDefinition(beanName) : null);</span></span>
<span class="line"><span>            value = evaluateBeanDefinitionString(strVal, bd);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>         //转化Value解析的结果到装配的类型</span></span>
<span class="line"><span>         TypeConverter converter = (typeConverter != null ? typeConverter : getTypeConverter());</span></span>
<span class="line"><span>         try {</span></span>
<span class="line"><span>            return converter.convertIfNecessary(value, type, descriptor.getTypeDescriptor());</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         catch (UnsupportedOperationException ex) {</span></span>
<span class="line"><span>            //异常处理</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>​可以看到，@Value的工作大体分为以下三个核心步骤。</p><p><strong>1. 寻找@Value</strong></p><p>在这步中，主要是判断这个属性字段是否标记为@Value，依据的方法参考QualifierAnnotationAutowireCandidateResolver#findValue：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>protected Object findValue(Annotation[] annotationsToSearch) {</span></span>
<span class="line"><span>   if (annotationsToSearch.length &amp;gt; 0) {</span></span>
<span class="line"><span>      AnnotationAttributes attr = AnnotatedElementUtils.getMergedAnnotationAttributes(</span></span>
<span class="line"><span>            AnnotatedElementUtils.forAnnotations(annotationsToSearch), this.valueAnnotationType);</span></span>
<span class="line"><span>      //valueAnnotationType即为&amp;#64;Value</span></span>
<span class="line"><span>      if (attr != null) {</span></span>
<span class="line"><span>         return extractValue(attr);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>2. 解析@Value的字符串值</strong></p><p>如果一个字段标记了@Value，则可以拿到对应的字符串值，然后就可以根据字符串值去做解析，最终解析的结果可能是一个字符串，也可能是一个对象，这取决于字符串怎么写。</p><p><strong>3. 将解析结果转化为要装配的对象的类型</strong></p><p>当拿到第二步生成的结果后，我们会发现可能和我们要装配的类型不匹配。假设我们定义的是UUID，而我们获取的结果是一个字符串，那么这个时候就会根据目标类型来寻找转化器执行转化，字符串到UUID的转化实际上发生在UUIDEditor中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UUIDEditor extends PropertyEditorSupport {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public void setAsText(String text) throws IllegalArgumentException          {</span></span>
<span class="line"><span>      if (StringUtils.hasText(text)) {</span></span>
<span class="line"><span>         //转化操作</span></span>
<span class="line"><span>         setValue(UUID.fromString(text.trim()));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>         setValue(null);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略其他非关代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过对上面几个关键步骤的解析，我们大体了解了@Value的工作流程。结合我们的案例，很明显问题应该发生在第二步，即解析Value指定字符串过程，执行过程参考下面的关键代码行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String strVal = resolveEmbeddedValue((String) value);</span></span></code></pre></div><p>这里其实是在解析嵌入的值，实际上就是“替换占位符”工作。具体而言，它采用的是PropertySourcesPlaceholderConfigurer根据PropertySources来替换。不过当使用 \${username} 来获取替换值时，其最终执行的查找并不是局限在application.property文件中的。通过调试，我们可以看到下面的这些“源”都是替换依据：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/366930/25d4242bc0dae8fa730663b9122b7840.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/366930/25d4242bc0dae8fa730663b9122b7840.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[ConfigurationPropertySourcesPropertySource {name=&#39;configurationProperties&#39;},</span></span>
<span class="line"><span>StubPropertySource {name=&#39;servletConfigInitParams&#39;}, ServletContextPropertySource {name=&#39;servletContextInitParams&#39;}, PropertiesPropertySource {name=&#39;systemProperties&#39;}, OriginAwareSystemEnvironmentPropertySource {name=&#39;systemEnvironment&#39;}, RandomValuePropertySource {name=&#39;random&#39;},</span></span>
<span class="line"><span>OriginTrackedMapPropertySource {name=&#39;applicationConfig: classpath:/application.properties]&#39;},</span></span>
<span class="line"><span>MapPropertySource {name=&#39;devtools&#39;}]</span></span></code></pre></div><p>而具体的查找执行，我们可以通过下面的代码（PropertySourcesPropertyResolver#getProperty）来获取它的执行方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>protected &amp;lt;T&amp;gt; T getProperty(String key, Class&amp;lt;T&amp;gt; targetValueType, boolean resolveNestedPlaceholders) {</span></span>
<span class="line"><span>   if (this.propertySources != null) {</span></span>
<span class="line"><span>      for (PropertySource&amp;lt;?&amp;gt; propertySource : this.propertySources) {</span></span>
<span class="line"><span>         Object value = propertySource.getProperty(key);</span></span>
<span class="line"><span>         if (value != null) {</span></span>
<span class="line"><span>         //查到value即退出</span></span>
<span class="line"><span>         return convertValueIfNecessary(value, targetValueType);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从这可以看出，在解析Value字符串时，其实是有顺序的（查找的源是存在CopyOnWriteArrayList中，在启动时就被有序固定下来），一个一个“源”执行查找，在其中一个源找到后，就可以直接返回了。</p><p>如果我们查看systemEnvironment这个源，会发现刚好有一个username和我们是重合的，且值不是pass。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/366930/eb48b0d27dc7d0dyy32a548934edc728.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/366930/eb48b0d27dc7d0dyy32a548934edc728.png" alt=""></a></p><p>所以，讲到这里，你应该知道问题所在了吧？这是一个误打误撞的例子，刚好系统环境变量（systemEnvironment）中含有同名的配置。实际上，对于系统参数（systemProperties）也是一样的，这些参数或者变量都有很多，如果我们没有意识到它的存在，起了一个同名的字符串作为@Value的值，则很容易引发这类问题。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>针对这个案例，有了源码的剖析，我们就可以很快地找到解决方案了。例如我们可以避免使用同一个名称，具体修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>user.name=admin</span></span>
<span class="line"><span>user.password=pass</span></span></code></pre></div><p>但是如果我们这么改的话，其实还是不行的。实际上，通过之前的调试方法，我们可以找到类似的原因，在systemProperties这个PropertiesPropertySource源中刚好存在user.name，真是无巧不成书。所以命名时，我们一定要注意 <strong>不仅要避免和环境变量冲突，也要注意避免和系统变量等其他变量冲突</strong>，这样才能从根本上解决这个问题。</p><p>通过这个案例，我们可以知道：Spring给我们提供了很多好用的功能，但是这些功能交织到一起后，就有可能让我们误入一些坑，只有了解它的运行方式，我们才能迅速定位问题、解决问题。</p><h2 id="案例2-错乱的注入集合" tabindex="-1">案例2：错乱的注入集合 <a class="header-anchor" href="#案例2-错乱的注入集合" aria-label="Permalink to &quot;案例2：错乱的注入集合&quot;">​</a></h2><p>前面我们介绍了很多自动注入的错误案例，但是这些案例都局限在单个类型的注入，对于集合类型的注入并无提及。实际上， <strong>集合类型的自动注入是Spring提供的另外一个强大功能。</strong></p><p>假设我们存在这样一个需求：存在多个学生Bean，我们需要找出来，并存储到一个List里面去。多个学生Bean的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public Student student1(){</span></span>
<span class="line"><span>    return createStudent(1, &quot;xie&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public Student student2(){</span></span>
<span class="line"><span>    return createStudent(2, &quot;fang&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Student createStudent(int id, String name) {</span></span>
<span class="line"><span>    Student student = new Student();</span></span>
<span class="line"><span>    student.setId(id);</span></span>
<span class="line"><span>    student.setName(name);</span></span>
<span class="line"><span>    return student;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了集合类型的自动注入后，我们就可以把零散的学生Bean收集起来了，代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class StudentController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private List&amp;lt;Student&amp;gt; students;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public StudentController(List&amp;lt;Student&amp;gt; students){</span></span>
<span class="line"><span>        this.students = students;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;students&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String listStudents(){</span></span>
<span class="line"><span>       return students.toString();</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上述代码，我们就可以完成集合类型的注入工作，输出结果如下：</p><blockquote><p>[Student(id=1, name=xie), Student(id=2, name=fang)]</p></blockquote><p>然而，业务总是复杂的，需求也是一直变动的。当我们持续增加一些student时，可能就不喜欢用这种方式来注入集合类型了，而是倾向于用下面的方式去完成注入工作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public List&amp;lt;Student&amp;gt; students(){</span></span>
<span class="line"><span>    Student student3 = createStudent(3, &quot;liu&quot;);</span></span>
<span class="line"><span>    Student student4 = createStudent(4, &quot;fu&quot;);</span></span>
<span class="line"><span>    return Arrays.asList(student3, student4);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了好记，这里我们不妨将上面这种方式命名为“直接装配方式”，而将之前的那种命名为“收集方式”。</p><p>实际上，如果这两种方式是非此即彼的存在，自然没有任何问题，都能玩转。但是如果我们不小心让这2种方式同时存在了，结果会怎样？</p><p>这时候很多人都会觉得Spring很强大，肯定会合并上面的结果，或者认为肯定是以直接装配结果为准。然而，当我们运行起程序，就会发现后面的注入方式根本没有生效。即依然返回的是前面定义的2个学生。为什么会出现这样的错误呢？</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>要了解这个错误的根本原因，你就得先清楚这两种注入风格在Spring中是如何实现的。对于收集装配风格，Spring使用的是DefaultListableBeanFactory#resolveMultipleBeans来完成装配工作，针对本案例关键的核心代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Object resolveMultipleBeans(DependencyDescriptor descriptor, &amp;#64;Nullable String beanName,</span></span>
<span class="line"><span>      &amp;#64;Nullable Set&amp;lt;String&amp;gt; autowiredBeanNames, &amp;#64;Nullable TypeConverter typeConverter) {</span></span>
<span class="line"><span>   final Class&amp;lt;?&amp;gt; type = descriptor.getDependencyType();</span></span>
<span class="line"><span>   if (descriptor instanceof StreamDependencyDescriptor) {</span></span>
<span class="line"><span>      //装配stream</span></span>
<span class="line"><span>      return stream;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (type.isArray()) {</span></span>
<span class="line"><span>      //装配数组</span></span>
<span class="line"><span>      return result;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (Collection.class.isAssignableFrom(type) &amp;&amp; type.isInterface()) {</span></span>
<span class="line"><span>      //装配集合</span></span>
<span class="line"><span>      //获取集合的元素类型</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; elementType = descriptor.getResolvableType().asCollection().resolveGeneric();</span></span>
<span class="line"><span>      if (elementType == null) {</span></span>
<span class="line"><span>         return null;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //根据元素类型查找所有的bean</span></span>
<span class="line"><span>      Map&amp;lt;String, Object&amp;gt; matchingBeans = findAutowireCandidates(beanName, elementType,</span></span>
<span class="line"><span>            new MultiElementDescriptor(descriptor));</span></span>
<span class="line"><span>      if (matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>         return null;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (autowiredBeanNames != null) {</span></span>
<span class="line"><span>         autowiredBeanNames.addAll(matchingBeans.keySet());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //转化查到的所有bean放置到集合并返回</span></span>
<span class="line"><span>      TypeConverter converter = (typeConverter != null ? typeConverter : getTypeConverter());</span></span>
<span class="line"><span>      Object result = converter.convertIfNecessary(matchingBeans.values(), type);</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>      return result;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (Map.class == type) {</span></span>
<span class="line"><span>      //解析map</span></span>
<span class="line"><span>      return matchingBeans;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这，我们就不难概括出这种收集式集合装配方式的大体过程了。</p><p><strong>1. 获取集合类型的元素类型</strong></p><p>针对本案例，目标类型定义为List&lt;Student&gt; students，所以元素类型为Student，获取的具体方法参考代码行：</p><blockquote><p>Class&lt;?&gt; elementType = descriptor.getResolvableType().asCollection().resolveGeneric();</p></blockquote><p><strong>2. 根据元素类型，找出所有的Bean</strong></p><p>有了上面的元素类型，即可根据元素类型来找出所有的Bean，关键代码行如下：</p><blockquote><p>Map&lt;String, Object&gt; matchingBeans = findAutowireCandidates(beanName, elementType, new MultiElementDescriptor(descriptor));</p></blockquote><p><strong>3. 将匹配的所有的Bean按目标类型进行转化</strong></p><p>经过步骤2，我们获取的所有的Bean都是以java.util.LinkedHashMap.LinkedValues形式存储的，和我们的目标类型大概率不同，所以最后一步需要做的是 <strong>按需转化</strong>。在本案例中，我们就需要把它转化为List，转化的关键代码如下：</p><blockquote><p>Object result = converter.convertIfNecessary(matchingBeans.values(), type);</p></blockquote><p>如果我们继续深究执行细节，就可以知道最终是转化器CollectionToCollectionConverter来完成这个转化过程。</p><p>学习完收集方式的装配原理，我们再来看下直接装配方式的执行过程，实际上这步在前面的课程中我们就提到过（即DefaultListableBeanFactory#findAutowireCandidates方法执行），具体的执行过程这里就不多说了。</p><p>知道了执行过程，接下来无非就是根据目标类型直接寻找匹配的Bean。在本案例中，就是将Bean名称为students的List&lt;Student&gt;装配给StudentController#students属性。</p><p>了解了这两种方式，我们再来思考这两种方式的关系：当同时满足这两种装配方式时，Spring是如何处理的？这里我们可以参考方法DefaultListableBeanFactory#doResolveDependency的几行关键代码，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Object multipleBeans = resolveMultipleBeans(descriptor, beanName, autowiredBeanNames, typeConverter);</span></span>
<span class="line"><span>if (multipleBeans != null) {</span></span>
<span class="line"><span>   return multipleBeans;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>Map&amp;lt;String, Object&amp;gt; matchingBeans = findAutowireCandidates(beanName, type, descriptor);</span></span></code></pre></div><p>很明显，这两种装配集合的方式是 <strong>不能同存</strong> 的，结合本案例，当使用收集装配方式来装配时，能找到任何一个对应的Bean，则返回，如果一个都没有找到，才会采用直接装配的方式。说到这里，你大概能理解为什么后期以List方式直接添加的Student Bean都不生效了吧。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>现在如何纠正这个问题就变得简单多了，就是你一定要下意识地避免这2种方式共存去装配集合，只用一个这个问题就迎刃而解了。例如，在这里，我们可以使用直接装配的方式去修正问题，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public List&amp;lt;Student&amp;gt; students(){</span></span>
<span class="line"><span>    Student student1 = createStudent(1, &quot;xie&quot;);</span></span>
<span class="line"><span>    Student student2 = createStudent(2, &quot;fang&quot;);</span></span>
<span class="line"><span>    Student student3 = createStudent(3, &quot;liu&quot;);</span></span>
<span class="line"><span>    Student student4 = createStudent(4, &quot;fu&quot;);</span></span>
<span class="line"><span>    return Arrays.asList(student1，student2，student3, student4);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>也可以使用收集方式来修正问题时，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public Student student1(){</span></span>
<span class="line"><span>        return createStudent(1, &quot;xie&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public Student student2(){</span></span>
<span class="line"><span>        return createStudent(2, &quot;fang&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public Student student3(){</span></span>
<span class="line"><span>        return createStudent(3, &quot;liu&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public Student student4(){</span></span>
<span class="line"><span>        return createStudent(4, &quot;fu&quot;);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>总之，都是可以的。还有一点要注意： <strong>在对于同一个集合对象的注入上，混合多种注入方式是不可取的，这样除了错乱，别无所得。</strong></p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天我们又学习了关于Spring自动注入的两个典型案例。</p><p>通过案例1的学习，我们了解到@Value不仅可以用来注入String类型，也可以注入自定义对象类型。同时在注入String时，你一定要意识到它不仅仅可以用来引用配置文件里配置的值，也可能引用到环境变量、系统参数等。</p><p>而通过案例2的学习，我们了解到集合类型的注入支持两种常见的方式，即上文中我们命名的收集装配式和直接装配式。这两种方式共同装配一个属性时，后者就会失效。</p><p>综合上一讲的内容，我们一共分析了5个问题以及背后的原理，通过这些案例的分析，我们不难看出Spring的自动注入非常强大，围绕@Autowired、@Qualifier、@Value等内置注解，我们可以完成不同的注入目标和需求。不过这种强大，正如我在 <a href="https://time.geekbang.org/column/article/364661" target="_blank" rel="noreferrer">开篇词</a> 中提及的，它建立在很多隐性的规则之上。只有你把这些规则都烂熟于心了，才能很好地去规避问题。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在案例2中，我们初次运行程序获取的结果如下：</p><blockquote><p>[Student(id=1, name=xie), Student(id=2, name=fang)]</p></blockquote><p>那么如何做到让学生2优先输出呢？</p><p>我们留言区见！</p>`,96)])])}const h=s(t,[["render",l]]);export{g as __pageData,h as default};
