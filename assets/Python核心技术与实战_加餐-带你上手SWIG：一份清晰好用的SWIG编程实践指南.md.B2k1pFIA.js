import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"加餐 | 带你上手SWIG：一份清晰好用的SWIG编程实践指南","description":"","frontmatter":{},"headers":[{"level":2,"title":"SWIG 是什么？","slug":"swig-是什么","link":"#swig-是什么","children":[]},{"level":2,"title":"使用Python实现PCA算法","slug":"使用python实现pca算法","link":"#使用python实现pca算法","children":[]},{"level":2,"title":"准备SWIG","slug":"准备swig","link":"#准备swig","children":[]},{"level":2,"title":"通过SWIG封装基于C++编写的Python模块","slug":"通过swig封装基于c-编写的python模块","link":"#通过swig封装基于c-编写的python模块","children":[]},{"level":2,"title":"SWIG C++常用工具","slug":"swig-c-常用工具","link":"#swig-c-常用工具","children":[{"level":3,"title":"1.全局变量","slug":"_1-全局变量","link":"#_1-全局变量","children":[]},{"level":3,"title":"2.常量","slug":"_2-常量","link":"#_2-常量","children":[]},{"level":3,"title":"3.Enumeration","slug":"_3-enumeration","link":"#_3-enumeration","children":[]},{"level":3,"title":"4.指针和引用","slug":"_4-指针和引用","link":"#_4-指针和引用","children":[]},{"level":3,"title":"5.字符串","slug":"_5-字符串","link":"#_5-字符串","children":[]},{"level":3,"title":"6.向量","slug":"_6-向量","link":"#_6-向量","children":[]},{"level":3,"title":"7. 映射","slug":"_7-映射","link":"#_7-映射","children":[]}]},{"level":2,"title":"学习路径","slug":"学习路径","link":"#学习路径","children":[]}],"relativePath":"Python核心技术与实战/加餐-带你上手SWIG：一份清晰好用的SWIG编程实践指南.md","filePath":"Python核心技术与实战/加餐-带你上手SWIG：一份清晰好用的SWIG编程实践指南.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/加餐-带你上手SWIG：一份清晰好用的SWIG编程实践指南.md"};function t(i,s,c,o,r,m){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="加餐-带你上手swig-一份清晰好用的swig编程实践指南" tabindex="-1">加餐 | 带你上手SWIG：一份清晰好用的SWIG编程实践指南 <a class="header-anchor" href="#加餐-带你上手swig-一份清晰好用的swig编程实践指南" aria-label="Permalink to &quot;加餐 | 带你上手SWIG：一份清晰好用的SWIG编程实践指南&quot;">​</a></h1><p>你好，我是卢誉声，Autodesk 数据平台和计算平台资深软件工程师，也是《移动平台深度神经网络实战》和《分布式实时处理系统：原理架构与实现》的作者，主要从事C/C++、JavaScript开发工作和平台架构方面的研发工作，对SWIG也有比较深的研究。很高兴受极客时间邀请来做本次分享，今天，我们就来聊一聊SWIG这个话题。</p><p>我们都知道，Python 是一门易于上手并实验友好的胶水语言。现在有很多机器学习开发或研究人员，都选择Python作为主力编程语言；流行的机器学习框架也都会提供Python语言的支持作为调用接口和工具。因此，相较于学习成本更高的C++来说，把Python作为进入机器学习世界的首选编程语言，就再合适不过了。</p><p>不过，像TensorFlow或PyTorch这样的机器学习框架的核心，是使用Python编写的吗？</p><p>显然不是。这里面的原因比较多，但最为显著的一个原因就是“性能”。通过C++编写的机器学习框架内核，加上编译器的优化能力，为系统提供了接近于机器码执行的效率。这种得天独厚的优势，让C++在机器学习的核心领域站稳了脚跟。我们前面所说的TensorFlow和PyTorch的核心，便都是使用C/C++开发的。其中，TensorFlow的内核，就是由高度优化的C++代码和CUDA编写而成。</p><p>因此，我们可以理解为，TensorFlow通过Python来描述模型，而实际的运算则是由高性能C++代码执行的。而且，在绝大多数情况下，不同操作之间传递的数据，并不会拷贝回Python代码的执行空间。机器学习框架，正是通过这样的方式确保了计算性能，同时兼顾了对框架易用性方面的考虑。</p><p>因此，当Python和C++结合使用的时候，Python本身的性能瓶颈就不那么重要了。它足够胜任我们给它的任务就可以了，至于对计算有更高要求的任务，就交给C++来做吧！</p><p>今天，我们就来讨论下，如何通过SWIG对C++程序进行Python封装。我会先带你编写一段Python脚本，来执行一个简单的机器学习任务；接着，尝试将计算密集的部分改写成C++程序，再通过SWIG对其进行封装。最后的结果就是，Python把计算密集的任务委托给C++执行。</p><p>我们会对性能做一个简单比较，并在这个过程中，讲解使用SWIG的方法。同时，在今天这节课的最后，我会为你提供一个学习路径，作为日后提高的参考。</p><p>明确了今天的学习目的，也就是使用SWIG来实现Python对C++代码的调用，那么，我们今天的内容，其实可以看成一份 <strong>关于SWIG的编程实践指南</strong>。学习这份指南之前，我们先来简单了解一下SWIG。</p><h2 id="swig-是什么" tabindex="-1">SWIG 是什么？ <a class="header-anchor" href="#swig-是什么" aria-label="Permalink to &quot;SWIG 是什么？&quot;">​</a></h2><p>SWIG，是一款能够连接C/C++与多种高级编程语言（我们在这里特别强调Python）的软件开发工具。SWIG支持多种不同类型的目标语言，这其中，支持的常见脚本语言包括JavaScript、Perl、PHP、Tcl、Ruby和Python等，支持的高级编程语言则包括C#、D、Go语言、Java（包括对Android的支持）、Lua、OCaml、Octave、Scilab和R。</p><p>我们通常使用SWIG来创建高级解释或编译型的编程环境和接口，它也常被用来当作C/C++编写原型的测试工具。一个典型的应用场景，便是解析和创建C/C++接口，生成胶水代码供像Python这样的高级编程语言调用。近期发布的4.0.0版本，更是带来了对C++的显著改进和支持，这其中包括（不局限于）下面几点。</p><ul><li>针对C#、Java和Ruby而改进的STL包装器。</li><li>针对Java、Python和Ruby，增加C++11标准下的STL容器的支持。</li><li>改进了对C++11和C++14代码的支持。</li><li>修正了C++中对智能指针shared_ptr的一系列bug修复。</li><li>一系列针对C预处理器的极端case修复。</li><li>一系列针对成员函数指针问题的修复。</li><li>低支持的Python版本为2.7、3.2-3.7。</li></ul><h2 id="使用python实现pca算法" tabindex="-1">使用Python实现PCA算法 <a class="header-anchor" href="#使用python实现pca算法" aria-label="Permalink to &quot;使用Python实现PCA算法&quot;">​</a></h2><p>借助于SWIG，我们可以简单地实现用Python调用C/C++库，甚至可以用Python继承和使用C++类。接下来，我们先来看一个你十分熟悉的使用Python编写的PCA（Principal Component Analysis，主成分分析）算法。</p><p>因为我们今天的目标不是讲解PCA算法，所以如果你对这个算法还不是很熟悉，也没有关系，我会直接给出具体的代码，我们把焦点放在如何使用SWIG上就可以了。下面，我先给出代码清单1。</p><p>代码清单1，基于Python编写的PCA算法 <code>testPCAPurePython.py</code> ：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import numpy as np</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def compute_pca(data):</span></span>
<span class="line"><span>    m = np.mean(data, axis=0)</span></span>
<span class="line"><span>    datac = np.array([obs - m for obs in data])</span></span>
<span class="line"><span>    T = np.dot(datac, datac.T)</span></span>
<span class="line"><span>    [u,s,v] = np.linalg.svd(T)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pcs = [np.dot(datac.T, item) for item in u.T ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     pcs = np.array([d / np.linalg.norm(d) for d in pcs])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     return pcs, m, s, T, u</span></span>
<span class="line"><span></span></span>
<span class="line"><span> def compute_projections(I,pcs,m):</span></span>
<span class="line"><span>     projections = []</span></span>
<span class="line"><span>     for i in I:</span></span>
<span class="line"><span>         w = []</span></span>
<span class="line"><span>         for p in pcs:</span></span>
<span class="line"><span>             w.append(np.dot(i - m, p))</span></span>
<span class="line"><span>         projections.append(w)</span></span>
<span class="line"><span>     return projections</span></span>
<span class="line"><span></span></span>
<span class="line"><span> def reconstruct(w, X, m,dim = 5):</span></span>
<span class="line"><span>     return np.dot(w[:dim],X[:dim,:]) + m</span></span>
<span class="line"><span></span></span>
<span class="line"><span> def normalize(samples, maxs = None):</span></span>
<span class="line"><span>     if not maxs:</span></span>
<span class="line"><span>         maxs = np.max(samples)</span></span>
<span class="line"><span>     return np.array([np.ravel(s) / maxs for s in samples])</span></span></code></pre></div><p>现在，我们保存这段编写好的代码，并通过下面的命令来执行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python3 testPCAPurePython.py</span></span></code></pre></div><h2 id="准备swig" tabindex="-1">准备SWIG <a class="header-anchor" href="#准备swig" aria-label="Permalink to &quot;准备SWIG&quot;">​</a></h2><p>这样，我们已经获得了一些进展——使用Python编写了一个PCA算法，并得到了一些结果。接下来，我们看一下如何开始SWIG的开发工作。我会先从编译相关组件开始，再介绍一个简单使用的例子，为后续内容做准备。</p><p>首先，我们从SWIG的网站（ <a href="http://swig.org/download.html" target="_blank" rel="noreferrer">http://swig.org/download.html</a>）下载源代码包，并开始构建：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ wget https://newcontinuum.dl.sourceforge.net/project/swig/swig/swig-4.0.0/swig-4.0.0.tar.gz # 下载路径可能会有所变化</span></span>
<span class="line"><span>$ tar -xvf swig-4.0.0.tar.gz</span></span>
<span class="line"><span>$ cd swig-4.0.0</span></span>
<span class="line"><span>$ wget https://ftp.pcre.org/pub/pcre/pcre-8.43.tar.gz # SWIG需要依赖pcre工作</span></span>
<span class="line"><span>$ sh ./Tools/pcre-build.sh # 该脚本会将pcre自动构建成SWIG使用的静态库</span></span>
<span class="line"><span>$ ./configure # 注意需要安装bison，如果没有安装需要读者手动安装</span></span>
<span class="line"><span>$ make</span></span>
<span class="line"><span>$ sudo make install</span></span></code></pre></div><p>一切就绪后，我们就来编写一个简单的例子吧。这个例子同样来源于SWIG网站（ <a href="http://swig.org/tutorial.html" target="_blank" rel="noreferrer">http://swig.org/tutorial.html</a>）。我们先来创建一个简单的c文件，你可以通过你习惯使用的文本编辑器（比如vi），创建一个名为 <code>example.c</code> 的文件，并编写代码。代码内容我放在了代码清单2中。</p><p>代码清单2， <code>example.c</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;time.h&amp;gt;</span></span>
<span class="line"><span>double My_variable = 3.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int fact(int n) {</span></span>
<span class="line"><span>    if (n &amp;lt;= 1) return 1;</span></span>
<span class="line"><span>    else return n*fact(n-1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int my_mod(int x, int y) {</span></span>
<span class="line"><span>    return (x%y);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>char *get_time()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    time_t ltime;</span></span>
<span class="line"><span>    time(&amp;ltime);</span></span>
<span class="line"><span>    return ctime(&amp;ltime);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们编写一个名为 <code>example.i</code> 的接口定义文件，和稍后用作测试的Python脚本，内容如代码清单3和代码清单4所示。</p><p>代码清单3， <code>example.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%module example</span></span>
<span class="line"><span>%{</span></span>
<span class="line"><span>/* Put header files here or function declarations like below */</span></span>
<span class="line"><span>extern double My_variable;</span></span>
<span class="line"><span>extern int fact(int n);</span></span>
<span class="line"><span>extern int my_mod(int x, int y);</span></span>
<span class="line"><span>extern char *get_time();</span></span>
<span class="line"><span>%}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern double My_variable;</span></span>
<span class="line"><span>extern int fact(int n);</span></span>
<span class="line"><span>extern int my_mod(int x, int y);</span></span>
<span class="line"><span>extern char *get_time();</span></span></code></pre></div><p>我来解释下清单3这段代码。第1行，我们定义了模块的名称为example。第2-8行，我们直接指定了 <code>example.c</code> 中的函数定义，也可以定义一个 <code>example.h</code> 头文件，并将这些定义加入其中；然后，在 <code>%{ … %}</code> 结构体中包含 <code>example.h</code>，来实现相同的功能。第 <code>10-13</code> 行，则是定义了导出的接口，以便你在Python中直接调用这些接口。</p><p>代码清单4， <code>testExample.py</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import example</span></span>
<span class="line"><span>print(example.fact(5))</span></span>
<span class="line"><span>print(example.my_mod(7,3))</span></span>
<span class="line"><span>print(example.get_time())</span></span></code></pre></div><p>好了， 到现在为止，我们已经准备就绪了。现在，我们来执行下面的代码，创建目标文件和最后链接的文件吧：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>swig -python example.i</span></span>
<span class="line"><span>gcc -c -fPIC example.c example_wrap.c -I/usr/include/python3.6</span></span>
<span class="line"><span>gcc -shared example.o example_wrap.o -o _example.so</span></span>
<span class="line"><span>python3 testExample.py # 测试调用</span></span></code></pre></div><p>其实，从代码清单4中你也能够看到，通过导入example，我们可以直接在Python脚本中，调用使用C实现的函数接口，并获得返回值。</p><h2 id="通过swig封装基于c-编写的python模块" tabindex="-1">通过SWIG封装基于C++编写的Python模块 <a class="header-anchor" href="#通过swig封装基于c-编写的python模块" aria-label="Permalink to &quot;通过SWIG封装基于C++编写的Python模块&quot;">​</a></h2><p>到这一步，我们已经准备好了一份使用C++编写的PCA算法，接下来，我们就要对其进行一个简单的封装。由于C++缺少线性代数的官方支持，因此，为了简化线性代数运算，我这里用了一个第三方库Armadillo。在Ubuntu下，它可以使用 <code>apt-get install libarmadillo-dev</code> 安装支持。</p><p>另外，还是要再三说明一下，我们今天这节课的重点并不是讲解PCA算法本身，所以希望你不要困于此处，而错过了真正的使用方法。当然，为了完整性考虑，我还是会对代码做出最基本的解释。</p><p>封装正式开始。我们先来编写一个名为 <code>pca.h</code> 的头文件定义，内容我放在了代码清单5中。</p><p>代码清单5， <code>pca.h</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#pragma once</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &amp;lt;vector&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;armadillo&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class pca {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    pca();</span></span>
<span class="line"><span>    explicit pca(long num_vars);</span></span>
<span class="line"><span>    virtual ~pca();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool operator==(const pca&amp; other);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void set_num_variables(long num_vars);</span></span>
<span class="line"><span>    long get_num_variables() const;</span></span>
<span class="line"><span>    void add_record(const std::vector&amp;lt;double&amp;gt;&amp; record);</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; get_record(long record_index) const;</span></span>
<span class="line"><span>    long get_num_records() const;</span></span>
<span class="line"><span>    void set_do_normalize(bool do_normalize);</span></span>
<span class="line"><span>    bool get_do_normalize() const;</span></span>
<span class="line"><span>    void set_solver(const std::string&amp; solver);</span></span>
<span class="line"><span>    std::string get_solver() const;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void solve();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    double check_eigenvectors_orthogonal() const;</span></span>
<span class="line"><span>    double check_projection_accurate() const;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void save(const std::string&amp; basename) const;</span></span>
<span class="line"><span>    void load(const std::string&amp; basename);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void set_num_retained(long num_retained);</span></span>
<span class="line"><span>    long get_num_retained() const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; to_principal_space(const std::vector&amp;lt;double&amp;gt;&amp; record) const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; to_variable_space(const std::vector&amp;lt;double&amp;gt;&amp; data) const;</span></span>
<span class="line"><span>    double get_energy() const;</span></span>
<span class="line"><span>    double get_eigenvalue(long eigen_index) const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; get_eigenvalues() const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; get_eigenvector(long eigen_index) const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; get_principal(long eigen_index) const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; get_mean_values() const;</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; get_sigma_values() const;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected:</span></span>
<span class="line"><span>    long num_vars_;</span></span>
<span class="line"><span>    long num_records_;</span></span>
<span class="line"><span>    long record_buffer_;</span></span>
<span class="line"><span>    std::string solver_;</span></span>
<span class="line"><span>    bool do_normalize_;</span></span>
<span class="line"><span>    long num_retained_;</span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; data_;</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; energy_;</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; eigval_;</span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; eigvec_;</span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; proj_eigvec_;</span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; princomp_;</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; mean_;</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; sigma_;</span></span>
<span class="line"><span>    void initialize_();</span></span>
<span class="line"><span>    void assert_num_vars_();</span></span>
<span class="line"><span>    void resize_data_if_needed_();</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>接着，我们再来编写具体实现 <code>pca.cpp</code>，也就是代码清单6的内容。</p><p>代码清单6， <code>pca.cpp</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;pca.h&quot;</span></span>
<span class="line"><span>#include &quot;utils.h&quot;</span></span>
<span class="line"><span>#include &amp;lt;stdexcept&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;random&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pca::pca()</span></span>
<span class="line"><span>    : num_vars_(0),</span></span>
<span class="line"><span>      num_records_(0),</span></span>
<span class="line"><span>      record_buffer_(1000),</span></span>
<span class="line"><span>      solver_(&quot;dc&quot;),</span></span>
<span class="line"><span>      do_normalize_(false),</span></span>
<span class="line"><span>      num_retained_(1),</span></span>
<span class="line"><span>      energy_(1)</span></span>
<span class="line"><span>{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pca::pca(long num_vars)</span></span>
<span class="line"><span>    : num_vars_(num_vars),</span></span>
<span class="line"><span>      num_records_(0),</span></span>
<span class="line"><span>      record_buffer_(1000),</span></span>
<span class="line"><span>      solver_(&quot;dc&quot;),</span></span>
<span class="line"><span>      do_normalize_(false),</span></span>
<span class="line"><span>      num_retained_(num_vars_),</span></span>
<span class="line"><span>      data_(record_buffer_, num_vars_),</span></span>
<span class="line"><span>      energy_(1),</span></span>
<span class="line"><span>      eigval_(num_vars_),</span></span>
<span class="line"><span>      eigvec_(num_vars_, num_vars_),</span></span>
<span class="line"><span>      proj_eigvec_(num_vars_, num_vars_),</span></span>
<span class="line"><span>      princomp_(record_buffer_, num_vars_),</span></span>
<span class="line"><span>      mean_(num_vars_),</span></span>
<span class="line"><span>      sigma_(num_vars_)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    assert_num_vars_();</span></span>
<span class="line"><span>    initialize_();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pca::~pca()</span></span>
<span class="line"><span>{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool pca::operator==(const pca&amp; other) {</span></span>
<span class="line"><span>    const double eps = 1e-5;</span></span>
<span class="line"><span>    if (num_vars_ == other.num_vars_ &amp;&amp;</span></span>
<span class="line"><span>        num_records_ == other.num_records_ &amp;&amp;</span></span>
<span class="line"><span>        record_buffer_ == other.record_buffer_ &amp;&amp;</span></span>
<span class="line"><span>        solver_ == other.solver_ &amp;&amp;</span></span>
<span class="line"><span>        do_normalize_ == other.do_normalize_ &amp;&amp;</span></span>
<span class="line"><span>        num_retained_ == other.num_retained_ &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(eigval_, other.eigval_, eps) &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(eigvec_, other.eigvec_, eps) &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(princomp_, other.princomp_, eps) &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(energy_, other.energy_, eps) &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(mean_, other.mean_, eps) &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(sigma_, other.sigma_, eps) &amp;&amp;</span></span>
<span class="line"><span>        utils::is_approx_equal_container(proj_eigvec_, other.proj_eigvec_, eps))</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::resize_data_if_needed_() {</span></span>
<span class="line"><span>    if (num_records_ == record_buffer_) {</span></span>
<span class="line"><span>        record_buffer_ += record_buffer_;</span></span>
<span class="line"><span>        data_.resize(record_buffer_, num_vars_);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::assert_num_vars_() {</span></span>
<span class="line"><span>    if (num_vars_ &amp;lt; 2)</span></span>
<span class="line"><span>        throw std::invalid_argument(&quot;Number of variables smaller than two.&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::initialize_() {</span></span>
<span class="line"><span>    data_.zeros();</span></span>
<span class="line"><span>    eigval_.zeros();</span></span>
<span class="line"><span>    eigvec_.zeros();</span></span>
<span class="line"><span>    princomp_.zeros();</span></span>
<span class="line"><span>    mean_.zeros();</span></span>
<span class="line"><span>    sigma_.zeros();</span></span>
<span class="line"><span>    energy_.zeros();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::set_num_variables(long num_vars) {</span></span>
<span class="line"><span>    num_vars_ = num_vars;</span></span>
<span class="line"><span>    assert_num_vars_();</span></span>
<span class="line"><span>    num_retained_ = num_vars_;</span></span>
<span class="line"><span>    data_.resize(record_buffer_, num_vars_);</span></span>
<span class="line"><span>    eigval_.resize(num_vars_);</span></span>
<span class="line"><span>    eigvec_.resize(num_vars_, num_vars_);</span></span>
<span class="line"><span>    mean_.resize(num_vars_);</span></span>
<span class="line"><span>    sigma_.resize(num_vars_);</span></span>
<span class="line"><span>    initialize_();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::add_record(const std::vector&amp;lt;double&amp;gt;&amp; record) {</span></span>
<span class="line"><span>    assert_num_vars_();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (num_vars_ != long(record.size()))</span></span>
<span class="line"><span>        throw std::domain_error(utils::join(&quot;Record has the wrong size: &quot;, record.size()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    resize_data_if_needed_();</span></span>
<span class="line"><span>    arma::Row&amp;lt;double&amp;gt; row(&amp;record.front(), record.size());</span></span>
<span class="line"><span>    data_.row(num_records_) = std::move(row);</span></span>
<span class="line"><span>    ++num_records_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::get_record(long record_index) const {</span></span>
<span class="line"><span>    return std::move(utils::extract_row_vector(data_, record_index));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::set_do_normalize(bool do_normalize) {</span></span>
<span class="line"><span>    do_normalize_ = do_normalize;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::set_solver(const std::string&amp; solver) {</span></span>
<span class="line"><span>    if (solver!=&quot;standard&quot; &amp;&amp; solver!=&quot;dc&quot;)</span></span>
<span class="line"><span>        throw std::invalid_argument(utils::join(&quot;No such solver available: &quot;, solver));</span></span>
<span class="line"><span>    solver_ = solver;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::solve() {</span></span>
<span class="line"><span>    assert_num_vars_();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (num_records_ &amp;lt; 2)</span></span>
<span class="line"><span>        throw std::logic_error(&quot;Number of records smaller than two.&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    data_.resize(num_records_, num_vars_);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mean_ = utils::compute_column_means(data_);</span></span>
<span class="line"><span>    utils::remove_column_means(data_, mean_);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sigma_ = utils::compute_column_rms(data_);</span></span>
<span class="line"><span>    if (do_normalize_) utils::normalize_by_column(data_, sigma_);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; eigval(num_vars_);</span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; eigvec(num_vars_, num_vars_);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; cov_mat = utils::make_covariance_matrix(data_);</span></span>
<span class="line"><span>    arma::eig_sym(eigval, eigvec, cov_mat, solver_.c_str());</span></span>
<span class="line"><span>    arma::uvec indices = arma::sort_index(eigval, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (long i=0; i&amp;lt;num_vars_; ++i) {</span></span>
<span class="line"><span>        eigval_(i) = eigval(indices(i));</span></span>
<span class="line"><span>        eigvec_.col(i) = eigvec.col(indices(i));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    utils::enforce_positive_sign_by_column(eigvec_);</span></span>
<span class="line"><span>    proj_eigvec_ = eigvec_;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    princomp_ = data_ * eigvec_;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    energy_(0) = arma::sum(eigval_);</span></span>
<span class="line"><span>    eigval_ *= 1./energy_(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::set_num_retained(long num_retained) {</span></span>
<span class="line"><span>    if (num_retained&amp;lt;=0 || num_retained&amp;gt;num_vars_)</span></span>
<span class="line"><span>        throw std::range_error(utils::join(&quot;Value out of range: &quot;, num_retained));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    num_retained_ = num_retained;</span></span>
<span class="line"><span>    proj_eigvec_ = eigvec_.submat(0, 0, eigvec_.n_rows-1, num_retained_-1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::to_principal_space(const std::vector&amp;lt;double&amp;gt;&amp; data) const {</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; column(&amp;data.front(), data.size());</span></span>
<span class="line"><span>    column -= mean_;</span></span>
<span class="line"><span>    if (do_normalize_) column /= sigma_;</span></span>
<span class="line"><span>    const arma::Row&amp;lt;double&amp;gt; row(column.t() * proj_eigvec_);</span></span>
<span class="line"><span>    return std::move(utils::extract_row_vector(row, 0));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::to_variable_space(const std::vector&amp;lt;double&amp;gt;&amp; data) const {</span></span>
<span class="line"><span>    const arma::Row&amp;lt;double&amp;gt; row(&amp;data.front(), data.size());</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; column(arma::trans(row * proj_eigvec_.t()));</span></span>
<span class="line"><span>    if (do_normalize_) column %= sigma_;</span></span>
<span class="line"><span>    column += mean_;</span></span>
<span class="line"><span>    return std::move(utils::extract_column_vector(column, 0));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double pca::get_energy() const {</span></span>
<span class="line"><span>    return energy_(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double pca::get_eigenvalue(long eigen_index) const {</span></span>
<span class="line"><span>    if (eigen_index &amp;gt;= num_vars_)</span></span>
<span class="line"><span>        throw std::range_error(utils::join(&quot;Index out of range: &quot;, eigen_index));</span></span>
<span class="line"><span>    return eigval_(eigen_index);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::get_eigenvalues() const {</span></span>
<span class="line"><span>    return std::move(utils::extract_column_vector(eigval_, 0));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::get_eigenvector(long eigen_index) const {</span></span>
<span class="line"><span>    return std::move(utils::extract_column_vector(eigvec_, eigen_index));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::get_principal(long eigen_index) const {</span></span>
<span class="line"><span>    return std::move(utils::extract_column_vector(princomp_, eigen_index));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double pca::check_eigenvectors_orthogonal() const {</span></span>
<span class="line"><span>    return std::abs(arma::det(eigvec_));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double pca::check_projection_accurate() const {</span></span>
<span class="line"><span>    if (data_.n_cols!=eigvec_.n_cols || data_.n_rows!=princomp_.n_rows)</span></span>
<span class="line"><span>        throw std::runtime_error(&quot;No proper data matrix present that the projection could be compared with.&quot;);</span></span>
<span class="line"><span>    const arma::Mat&amp;lt;double&amp;gt; diff = (princomp_ * arma::trans(eigvec_)) - data_;</span></span>
<span class="line"><span>    return 1 - arma::sum(arma::sum( arma::abs(diff) )) / diff.n_elem;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool pca::get_do_normalize() const {</span></span>
<span class="line"><span>    return do_normalize_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::string pca::get_solver() const {</span></span>
<span class="line"><span>    return solver_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::get_mean_values() const {</span></span>
<span class="line"><span>    return std::move(utils::extract_column_vector(mean_, 0));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; pca::get_sigma_values() const {</span></span>
<span class="line"><span>    return std::move(utils::extract_column_vector(sigma_, 0));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long pca::get_num_variables() const {</span></span>
<span class="line"><span>    return num_vars_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long pca::get_num_records() const {</span></span>
<span class="line"><span>    return num_records_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long pca::get_num_retained() const {</span></span>
<span class="line"><span>    return num_retained_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::save(const std::string&amp; basename) const {</span></span>
<span class="line"><span>    const std::string filename = basename + &quot;.pca&quot;;</span></span>
<span class="line"><span>    std::ofstream file(filename.c_str());</span></span>
<span class="line"><span>    utils::assert_file_good(file.good(), filename);</span></span>
<span class="line"><span>    utils::write_property(file, &quot;num_variables&quot;, num_vars_);</span></span>
<span class="line"><span>    utils::write_property(file, &quot;num_records&quot;, num_records_);</span></span>
<span class="line"><span>    utils::write_property(file, &quot;solver&quot;, solver_);</span></span>
<span class="line"><span>    utils::write_property(file, &quot;num_retained&quot;, num_retained_);</span></span>
<span class="line"><span>    utils::write_property(file, &quot;do_normalize&quot;, do_normalize_);</span></span>
<span class="line"><span>    file.close();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    utils::write_matrix_object(basename + &quot;.eigval&quot;, eigval_);</span></span>
<span class="line"><span>    utils::write_matrix_object(basename + &quot;.eigvec&quot;, eigvec_);</span></span>
<span class="line"><span>    utils::write_matrix_object(basename + &quot;.princomp&quot;, princomp_);</span></span>
<span class="line"><span>    utils::write_matrix_object(basename + &quot;.energy&quot;, energy_);</span></span>
<span class="line"><span>    utils::write_matrix_object(basename + &quot;.mean&quot;, mean_);</span></span>
<span class="line"><span>    utils::write_matrix_object(basename + &quot;.sigma&quot;, sigma_);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void pca::load(const std::string&amp; basename) {</span></span>
<span class="line"><span>    const std::string filename = basename + &quot;.pca&quot;;</span></span>
<span class="line"><span>    std::ifstream file(filename.c_str());</span></span>
<span class="line"><span>    utils::assert_file_good(file.good(), filename);</span></span>
<span class="line"><span>    utils::read_property(file, &quot;num_variables&quot;, num_vars_);</span></span>
<span class="line"><span>    utils::read_property(file, &quot;num_records&quot;, num_records_);</span></span>
<span class="line"><span>    utils::read_property(file, &quot;solver&quot;, solver_);</span></span>
<span class="line"><span>    utils::read_property(file, &quot;num_retained&quot;, num_retained_);</span></span>
<span class="line"><span>    utils::read_property(file, &quot;do_normalize&quot;, do_normalize_);</span></span>
<span class="line"><span>    file.close();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    utils::read_matrix_object(basename + &quot;.eigval&quot;, eigval_);</span></span>
<span class="line"><span>    utils::read_matrix_object(basename + &quot;.eigvec&quot;, eigvec_);</span></span>
<span class="line"><span>    utils::read_matrix_object(basename + &quot;.princomp&quot;, princomp_);</span></span>
<span class="line"><span>    utils::read_matrix_object(basename + &quot;.energy&quot;, energy_);</span></span>
<span class="line"><span>    utils::read_matrix_object(basename + &quot;.mean&quot;, mean_);</span></span>
<span class="line"><span>    utils::read_matrix_object(basename + &quot;.sigma&quot;, sigma_);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    set_num_retained(num_retained_);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里要注意了，代码清单6中用到了 <code>utils.h</code> 这个文件，它是对部分矩阵和数学计算的封装，内容我放在了代码清单7中。</p><p>代码清单7， <code>utils.h</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#pragma once</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &amp;lt;armadillo&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sstream&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace utils {</span></span>
<span class="line"><span>arma::Mat&amp;lt;double&amp;gt; make_covariance_matrix(const arma::Mat&amp;lt;double&amp;gt;&amp; data);</span></span>
<span class="line"><span>arma::Mat&amp;lt;double&amp;gt; make_shuffled_matrix(const arma::Mat&amp;lt;double&amp;gt;&amp; data);</span></span>
<span class="line"><span>arma::Col&amp;lt;double&amp;gt; compute_column_means(const arma::Mat&amp;lt;double&amp;gt;&amp; data);</span></span>
<span class="line"><span>void remove_column_means(arma::Mat&amp;lt;double&amp;gt;&amp; data, const arma::Col&amp;lt;double&amp;gt;&amp; means);</span></span>
<span class="line"><span>arma::Col&amp;lt;double&amp;gt; compute_column_rms(const arma::Mat&amp;lt;double&amp;gt;&amp; data);</span></span>
<span class="line"><span>void normalize_by_column(arma::Mat&amp;lt;double&amp;gt;&amp; data, const arma::Col&amp;lt;double&amp;gt;&amp; rms);</span></span>
<span class="line"><span>void enforce_positive_sign_by_column(arma::Mat&amp;lt;double&amp;gt;&amp; data);</span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; extract_column_vector(const arma::Mat&amp;lt;double&amp;gt;&amp; data, long index);</span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; extract_row_vector(const arma::Mat&amp;lt;double&amp;gt;&amp; data, long index);</span></span>
<span class="line"><span>void assert_file_good(const bool&amp; is_file_good, const std::string&amp; filename);</span></span>
<span class="line"><span>template&amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>void write_matrix_object(const std::string&amp; filename, const T&amp; matrix) {</span></span>
<span class="line"><span>    assert_file_good(matrix.quiet_save(filename, arma::arma_ascii), filename);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template&amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>void read_matrix_object(const std::string&amp; filename, T&amp; matrix) {</span></span>
<span class="line"><span>    assert_file_good(matrix.quiet_load(filename), filename);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>template&amp;lt;typename T, typename U, typename V&amp;gt;</span></span>
<span class="line"><span>bool is_approx_equal(const T&amp; value1, const U&amp; value2, const V&amp; eps) {</span></span>
<span class="line"><span>    return std::abs(value1-value2)&amp;lt;eps ? true : false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>template&amp;lt;typename T, typename U, typename V&amp;gt;</span></span>
<span class="line"><span>bool is_approx_equal_container(const T&amp; container1, const U&amp; container2, const V&amp; eps) {</span></span>
<span class="line"><span>    if (container1.size()==container2.size()) {</span></span>
<span class="line"><span>        bool equal = true;</span></span>
<span class="line"><span>        for (size_t i=0; i&amp;lt;container1.size(); ++i) {</span></span>
<span class="line"><span>            equal = is_approx_equal(container1[i], container2[i], eps);</span></span>
<span class="line"><span>            if (!equal) break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return equal;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>double get_mean(const std::vector&amp;lt;double&amp;gt;&amp; iter);</span></span>
<span class="line"><span>double get_sigma(const std::vector&amp;lt;double&amp;gt;&amp; iter);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct join_helper {</span></span>
<span class="line"><span>    static void add_to_stream(std::ostream&amp; stream) {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    template&amp;lt;typename T, typename... Args&amp;gt;</span></span>
<span class="line"><span>    static void add_to_stream(std::ostream&amp; stream, const T&amp; arg, const Args&amp;... args) {</span></span>
<span class="line"><span>        stream &amp;lt;&amp;lt; arg;</span></span>
<span class="line"><span>        add_to_stream(stream, args...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template&amp;lt;typename T, typename... Args&amp;gt;</span></span>
<span class="line"><span>std::string join(const T&amp; arg, const Args&amp;... args) {</span></span>
<span class="line"><span>    std::ostringstream stream;</span></span>
<span class="line"><span>    stream &amp;lt;&amp;lt; arg;</span></span>
<span class="line"><span>    join_helper::add_to_stream(stream, args...);</span></span>
<span class="line"><span>    return stream.str();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template&amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>void write_property(std::ostream&amp; file, const std::string&amp; key, const T&amp; value) {</span></span>
<span class="line"><span>    file &amp;lt;&amp;lt; key &amp;lt;&amp;lt; &quot;\\t&quot; &amp;lt;&amp;lt; value &amp;lt;&amp;lt; std::endl;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template&amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>void read_property(std::istream&amp; file, const std::string&amp; key, T&amp; value) {</span></span>
<span class="line"><span>    std::string tmp;</span></span>
<span class="line"><span>    bool found = false;</span></span>
<span class="line"><span>    while (file.good()) {</span></span>
<span class="line"><span>        file &amp;gt;&amp;gt; tmp;</span></span>
<span class="line"><span>        if (tmp==key) {</span></span>
<span class="line"><span>            file &amp;gt;&amp;gt; value;</span></span>
<span class="line"><span>            found = true;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!found)</span></span>
<span class="line"><span>        throw std::domain_error(join(&quot;No such key available: &quot;, key));</span></span>
<span class="line"><span>    file.seekg(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} //utils</span></span></code></pre></div><p>至于具体的实现代码，我放在了在代码清单8 <code>utils.cpp</code> 中。</p><p>代码清单8， <code>utils.cpp</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;utils.h&quot;</span></span>
<span class="line"><span>#include &amp;lt;stdexcept&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sstream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;numeric&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace utils {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>arma::Mat&amp;lt;double&amp;gt; make_covariance_matrix(const arma::Mat&amp;lt;double&amp;gt;&amp; data) {</span></span>
<span class="line"><span>    return std::move( (data.t()*data) * (1./(data.n_rows-1)) );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>arma::Mat&amp;lt;double&amp;gt; make_shuffled_matrix(const arma::Mat&amp;lt;double&amp;gt;&amp; data) {</span></span>
<span class="line"><span>    const long n_rows = data.n_rows;</span></span>
<span class="line"><span>    const long n_cols = data.n_cols;</span></span>
<span class="line"><span>    arma::Mat&amp;lt;double&amp;gt; shuffle(n_rows, n_cols);</span></span>
<span class="line"><span>    for (long j=0; j&amp;lt;n_cols; ++j) {</span></span>
<span class="line"><span>        for (long i=0; i&amp;lt;n_rows; ++i) {</span></span>
<span class="line"><span>            shuffle(i, j) = data(std::rand()%n_rows, j);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return std::move(shuffle);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>arma::Col&amp;lt;double&amp;gt; compute_column_means(const arma::Mat&amp;lt;double&amp;gt;&amp; data) {</span></span>
<span class="line"><span>    const long n_cols = data.n_cols;</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; means(n_cols);</span></span>
<span class="line"><span>    for (long i=0; i&amp;lt;n_cols; ++i)</span></span>
<span class="line"><span>        means(i) = arma::mean(data.col(i));</span></span>
<span class="line"><span>    return std::move(means);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void remove_column_means(arma::Mat&amp;lt;double&amp;gt;&amp; data, const arma::Col&amp;lt;double&amp;gt;&amp; means) {</span></span>
<span class="line"><span>    if (data.n_cols != means.n_elem)</span></span>
<span class="line"><span>        throw std::range_error(&quot;Number of elements of means is not equal to the number of columns of data&quot;);</span></span>
<span class="line"><span>    for (long i=0; i&amp;lt;long(data.n_cols); ++i)</span></span>
<span class="line"><span>        data.col(i) -= means(i);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>arma::Col&amp;lt;double&amp;gt; compute_column_rms(const arma::Mat&amp;lt;double&amp;gt;&amp; data) {</span></span>
<span class="line"><span>    const long n_cols = data.n_cols;</span></span>
<span class="line"><span>    arma::Col&amp;lt;double&amp;gt; rms(n_cols);</span></span>
<span class="line"><span>    for (long i=0; i&amp;lt;n_cols; ++i) {</span></span>
<span class="line"><span>        const double dot = arma::dot(data.col(i), data.col(i));</span></span>
<span class="line"><span>        rms(i) = std::sqrt(dot / (data.col(i).n_rows-1));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return std::move(rms);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void normalize_by_column(arma::Mat&amp;lt;double&amp;gt;&amp; data, const arma::Col&amp;lt;double&amp;gt;&amp; rms) {</span></span>
<span class="line"><span>    if (data.n_cols != rms.n_elem)</span></span>
<span class="line"><span>        throw std::range_error(&quot;Number of elements of rms is not equal to the number of columns of data&quot;);</span></span>
<span class="line"><span>    for (long i=0; i&amp;lt;long(data.n_cols); ++i) {</span></span>
<span class="line"><span>        if (rms(i)==0)</span></span>
<span class="line"><span>            throw std::runtime_error(&quot;At least one of the entries of rms equals to zero&quot;);</span></span>
<span class="line"><span>        data.col(i) *= 1./rms(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void enforce_positive_sign_by_column(arma::Mat&amp;lt;double&amp;gt;&amp; data) {</span></span>
<span class="line"><span>    for (long i=0; i&amp;lt;long(data.n_cols); ++i) {</span></span>
<span class="line"><span>        const double max = arma::max(data.col(i));</span></span>
<span class="line"><span>        const double min = arma::min(data.col(i));</span></span>
<span class="line"><span>        bool change_sign = false;</span></span>
<span class="line"><span>        if (std::abs(max)&amp;gt;=std::abs(min)) {</span></span>
<span class="line"><span>            if (max&amp;lt;0) change_sign = true;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            if (min&amp;lt;0) change_sign = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (change_sign) data.col(i) *= -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; extract_column_vector(const arma::Mat&amp;lt;double&amp;gt;&amp; data, long index) {</span></span>
<span class="line"><span>    if (index&amp;lt;0 || index &amp;gt;= long(data.n_cols))</span></span>
<span class="line"><span>        throw std::range_error(join(&quot;Index out of range: &quot;, index));</span></span>
<span class="line"><span>    const long n_rows = data.n_rows;</span></span>
<span class="line"><span>    const double* memptr = data.colptr(index);</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; result(memptr, memptr + n_rows);</span></span>
<span class="line"><span>    return std::move(result);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;double&amp;gt; extract_row_vector(const arma::Mat&amp;lt;double&amp;gt;&amp; data, long index) {</span></span>
<span class="line"><span>    if (index&amp;lt;0 || index &amp;gt;= long(data.n_rows))</span></span>
<span class="line"><span>        throw std::range_error(join(&quot;Index out of range: &quot;, index));</span></span>
<span class="line"><span>    const arma::Row&amp;lt;double&amp;gt; row(data.row(index));</span></span>
<span class="line"><span>    const double* memptr = row.memptr();</span></span>
<span class="line"><span>    std::vector&amp;lt;double&amp;gt; result(memptr, memptr + row.n_elem);</span></span>
<span class="line"><span>    return std::move(result);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void assert_file_good(const bool&amp; is_file_good, const std::string&amp; filename) {</span></span>
<span class="line"><span>    if (!is_file_good)</span></span>
<span class="line"><span>        throw std::ios_base::failure(join(&quot;Cannot open file: &quot;, filename));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double get_mean(const std::vector&amp;lt;double&amp;gt;&amp; iter) {</span></span>
<span class="line"><span>    const double init = 0;</span></span>
<span class="line"><span>    return std::accumulate(iter.begin(), iter.end(), init) / iter.size();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>double get_sigma(const std::vector&amp;lt;double&amp;gt;&amp; iter) {</span></span>
<span class="line"><span>    const double mean = get_mean(iter);</span></span>
<span class="line"><span>    double sum = 0;</span></span>
<span class="line"><span>    for (auto v=iter.begin(); v!=iter.end(); ++v)</span></span>
<span class="line"><span>        sum += std::pow(*v - mean, 2.);</span></span>
<span class="line"><span>    return std::sqrt(sum/(iter.size()-1));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} //utils</span></span></code></pre></div><p>最后，我们来编写 <code>pca.i</code> 接口文件，也就是代码清单9的内容。</p><p>代码清单9， <code>pca.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%module pca</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;std_string.i&quot;</span></span>
<span class="line"><span>%include &quot;std_vector.i&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace std {</span></span>
<span class="line"><span>  %template(DoubleVector) vector&amp;lt;double&amp;gt;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%{</span></span>
<span class="line"><span>#include &quot;pca.h&quot;</span></span>
<span class="line"><span>#include &quot;utils.h&quot;</span></span>
<span class="line"><span>%}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;pca.h&quot;</span></span>
<span class="line"><span>%include &quot;utils.h&quot;</span></span></code></pre></div><p>这里需要注意的是，我们在C++代码中使用了熟悉的顺序容器 <code>std::vector</code>，但由于模板类比较特殊，我们需要用 <code>%template</code> 声明一下。</p><p>一切就绪后，我们执行下面的命令行，生成 <code>_pca.so</code> 库供Python使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swig -c++ -python pca.i # 解释接口定义生成包SWIG装器代码</span></span>
<span class="line"><span>$ g++ -fPIC -c pca.h pca.cpp utils.h utils.cpp pca_wrap.cxx -I/usr/include/python3.7 # 编译源代码</span></span>
<span class="line"><span>$ g++ -shared pca.o pca_wrap.o utils.o -o _pca.so -O2 -Wall -std=c++11 -pthread -shared -fPIC -larmadillo # 链接</span></span></code></pre></div><p>接着，我们使用Python脚本，导入我们创建好的so动态库；然后，调用相应的类的函数。这部分内容，我写在了代码清单10中。</p><p>代码清单10， <code>testPCA.py</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import pca</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pca_inst = pca.pca(2)</span></span>
<span class="line"><span>pca_inst.add_record([1.0, 1.0])</span></span>
<span class="line"><span>pca_inst.add_record([2.0, 2.0])</span></span>
<span class="line"><span>pca_inst.add_record([4.0, 1.0])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pca_inst.solve()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>energy = pca_inst.get_energy()</span></span>
<span class="line"><span>eigenvalues = pca_inst.get_eigenvalues()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(energy)</span></span>
<span class="line"><span>print(eigenvalues)</span></span></code></pre></div><p>最后，我们分别对纯Python实现的代码，和使用SWIG封装的版本来进行测试，各自都执行1,000,000次，然后对比执行时间。我用一张图表示了我的机器上得到的结果，你可以对比看看。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118140/d4729298aa565d7216720f9d5ededde2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118140/d4729298aa565d7216720f9d5ededde2.png" alt=""></a></p><p>虽然这样粗略的比较并不够严谨，比如我们没有认真考虑SWIG接口类型转换的耗时，也没有考虑在不同编程语言下实现算法的逻辑等等。但是，通过这个粗略的结果，你仍然可以看出执行类似运算时，两者性能的巨大差异。</p><h2 id="swig-c-常用工具" tabindex="-1">SWIG C++常用工具 <a class="header-anchor" href="#swig-c-常用工具" aria-label="Permalink to &quot;SWIG C++常用工具&quot;">​</a></h2><p>到这里，你应该已经可以开始动手操作了，把上面的代码清单当作你的工具进行实践。不过，SWIG本身非常丰富，所以这里我也再给你总结介绍几个常用的工具。</p><h3 id="_1-全局变量" tabindex="-1"><strong>1.全局变量</strong> <a class="header-anchor" href="#_1-全局变量" aria-label="Permalink to &quot;**1.全局变量**&quot;">​</a></h3><p>在Python 中，我们可以通过cvar，来访问C++代码中定义的全局变量。</p><p>比如说，我们在头文件 <code>sample.h</code> 中定义了一个全局变量，并在 <code>sample.i</code> 中对其进行引用，也就是代码清单 11和12的内容。</p><p>代码清单11， <code>sample.h</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;cstdint&amp;gt;</span></span>
<span class="line"><span>int32_t score = 100;</span></span></code></pre></div><p>代码清单12， <code>sample.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%module sample</span></span>
<span class="line"><span>%{</span></span>
<span class="line"><span>#include &quot;sample.h&quot;</span></span>
<span class="line"><span>%}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;sample.h&quot;</span></span></code></pre></div><p>这样，我们就可以直接在Python脚本中，通过cvar来访问对应的全局变量，如代码清单13所示，输出结果为100。</p><p>代码清单13， <code>sample.py</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import sample</span></span>
<span class="line"><span>print sample.cvar.score</span></span></code></pre></div><h3 id="_2-常量" tabindex="-1"><strong>2.常量</strong> <a class="header-anchor" href="#_2-常量" aria-label="Permalink to &quot;**2.常量**&quot;">​</a></h3><p>我们可以在接口定义文件中，使用 <code>%constant</code> 来设定常量，如代码清单14所示。</p><p>代码清单14， <code>sample.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%constant int foo = 100;</span></span>
<span class="line"><span>%constant const char* bar = &quot;foobar2000&quot;;</span></span></code></pre></div><h3 id="_3-enumeration" tabindex="-1"><strong>3.Enumeration</strong> <a class="header-anchor" href="#_3-enumeration" aria-label="Permalink to &quot;**3.Enumeration**&quot;">​</a></h3><p>我们可以在接口文件中，使用enum关键字来定义enum。</p><h3 id="_4-指针和引用" tabindex="-1"><strong>4.指针和引用</strong> <a class="header-anchor" href="#_4-指针和引用" aria-label="Permalink to &quot;**4.指针和引用**&quot;">​</a></h3><p>在C++世界中，指针是永远也绕不开的一个概念。它无处不在，我们也无时无刻不需要使用它。因此，在这里，我认为很有必要介绍一下，如何对C++中的指针和引用进行操作。</p><p>SWIG对指针有着较为不错的支持，对智能指针也有一定的支持，而且在近期的更新日志中，我发现它对智能指针的支持一直在更新。下面的代码清单15和16，就展示了针对指针和引用的使用方法。</p><p>代码清单15， <code>sample.h</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;cstdint&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void passPointer(ClassA* ptr) {</span></span>
<span class="line"><span>   printf(&quot;result= %d&quot;, ptr-&amp;gt;result);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void passReference(const ClassA&amp; ref) {</span></span>
<span class="line"><span>   printf(&quot;result= %d&quot;, ref.result);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void passValue(ClassA obj) {</span></span>
<span class="line"><span>   printf(&quot;result= %d&quot;, obj.result);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码清单16， <code>sample.py</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import sample</span></span>
<span class="line"><span></span></span>
<span class="line"><span>a = ClassA() # 创建 ClassA实例</span></span>
<span class="line"><span>passPointer(a)</span></span>
<span class="line"><span>passReference(a)</span></span>
<span class="line"><span>passValue(a)</span></span></code></pre></div><h3 id="_5-字符串" tabindex="-1"><strong>5.字符串</strong> <a class="header-anchor" href="#_5-字符串" aria-label="Permalink to &quot;**5.字符串**&quot;">​</a></h3><p>我们在工业级代码中，时常使用 <code>std::string</code>。而在SWIG的环境下，使用标准库中的字符串，需要你在接口文件中声明 <code>%include “std_stirng.i”</code>，来确保实现C++ <code>std::string</code> 到Python <code>str</code> 的自动转换。具体内容我放在了代码清单17中。</p><p>代码清单17， <code>sample.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%module sample</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;std_string.i&quot;</span></span></code></pre></div><h3 id="_6-向量" tabindex="-1"><strong>6.向量</strong> <a class="header-anchor" href="#_6-向量" aria-label="Permalink to &quot;**6.向量**&quot;">​</a></h3><p><code>std::vector</code> 是STL中最常见也是使用最频繁的顺序容器，模板类比较特殊，因此，它的使用也比字符串稍微复杂一些，需要使用 <code>%template</code> 进行声明。详细内容我放在了代码清单18中。</p><p>代码清单18， <code>sample.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%module sample</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;std_string.i&quot;</span></span>
<span class="line"><span>%include &quot;std_vector.i&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace std {</span></span>
<span class="line"><span> %template(DoubleVector) vector&amp;lt;double&amp;gt;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_7-映射" tabindex="-1"><strong>7. 映射</strong> <a class="header-anchor" href="#_7-映射" aria-label="Permalink to &quot;**7\\. 映射**&quot;">​</a></h3><p><code>std::map</code> 同样是STL中最常见也是使用最频繁的容器。同样的，它的模板类也比较特殊，需要使用 <code>%template</code> 进行声明，详细内容可见代码清单19。</p><p>代码清单19， <code>sample.i</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%module sample</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;std_string.i&quot;</span></span>
<span class="line"><span>%include &quot;std_map.i&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace std {</span></span>
<span class="line"><span> %template(Int2strMap) map&amp;lt;int, string&amp;gt;;</span></span>
<span class="line"><span> %template(Str2intMap) map&amp;lt;string, int&amp;gt;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="学习路径" tabindex="-1">学习路径 <a class="header-anchor" href="#学习路径" aria-label="Permalink to &quot;学习路径&quot;">​</a></h2><p>到此，SWIG入门这个小目标，我们就已经实现了。今天内容可以当作一份SWIG的编程实践指南，我给你提供了19个代码清单，利用它们，你就可以上手操作了。当然，如果在这方面你还想继续精进，该怎么办呢？别着急，今天这节课的最后，我再和你分享下，我觉得比较高效的一条SWIG学习路径。</p><p>首先，任何技术的学习不要脱离官方文档。SWIG网站上提供了难以置信的详尽文档，通过文档掌握SWIG的用法，显然是最好的一个途径。</p><p>其次，要深入SWIG，对C++有一个较为全面的掌握，就显得至关重要了。对于高性能计算来说，C++总是绕不开的一个主题，特别是对内存管理、指针和虚函数的应用，需要你实际上手编写C++代码后，才能逐渐掌握。退一步讲，即便你只是为了封装其他C++库供Python调用，也需要对C++有一个基本了解，以便未来遇到编译或链接错误时，可以找到方向来解决问题。</p><p>最后，我再罗列一些学习素材，供你进一步学习参考。</p><p>第一便是SWIG文档。</p><ul><li>a. <a href="http://www.swig.org/doc.html" target="_blank" rel="noreferrer">http://www.swig.org/doc.html</a></li><li>b. <a href="http://www.swig.org/Doc4.0/SWIGPlus.html" target="_blank" rel="noreferrer">http://www.swig.org/Doc4.0/SWIGPlus.html</a></li><li>c. PDF版本： <a href="http://www.swig.org/Doc4.0/SWIGDocumentation.pdf" target="_blank" rel="noreferrer">http://www.swig.org/Doc4.0/SWIGDocumentation.pdf</a></li></ul><p>第二是《C++ Primer》这本书。作为C++领域的经典书籍，这本书对你全面了解C++有极大帮助。</p><p>第三则是《高级C/C++编译技术》这本书。这本书的内容更为进阶，你可以把它作为学习C++的提高和了解。</p><p>好了，今天的内容就到此结束了。关于SWIG，你有哪些收获，或者还有哪些问题，都欢迎你留言和我分享讨论。也欢迎你把这篇文章分享给你的同事、朋友，我们一起学习和进步。</p>`,111)])])}const _=a(l,[["render",t]]);export{u as __pageData,_ as default};
