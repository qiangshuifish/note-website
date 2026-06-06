import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"09 | 不可或缺的自定义函数","description":"","frontmatter":{},"headers":[{"level":2,"title":"函数基础","slug":"函数基础","link":"#函数基础","children":[]},{"level":2,"title":"函数变量作用域","slug":"函数变量作用域","link":"#函数变量作用域","children":[]},{"level":2,"title":"闭包","slug":"闭包","link":"#闭包","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/09-不可或缺的自定义函数.md","filePath":"Python核心技术与实战/09-不可或缺的自定义函数.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/09-不可或缺的自定义函数.md"};function i(t,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_09-不可或缺的自定义函数" tabindex="-1">09 | 不可或缺的自定义函数 <a class="header-anchor" href="#_09-不可或缺的自定义函数" aria-label="Permalink to &quot;09 | 不可或缺的自定义函数&quot;">​</a></h1><p>你好，我是景霄。</p><p>实际工作生活中，我曾见到不少初学者编写的Python程序，他们长达几百行的代码中，却没有一个函数，通通按顺序堆到一块儿，不仅让人读起来费时费力，往往也是错误连连。</p><p>一个规范的值得借鉴的Python程序，除非代码量很少（比如10行、20行以下），基本都应该由多个函数组成，这样的代码才更加模块化、规范化。</p><p>函数是Python程序中不可或缺的一部分。事实上，在前面的学习中，我们已经用到了很多Python的内置函数，比如sorted()表示对一个集合序列排序，len()表示返回一个集合序列的长度大小等等。这节课，我们主要来学习Python的自定义函数。</p><h2 id="函数基础" tabindex="-1">函数基础 <a class="header-anchor" href="#函数基础" aria-label="Permalink to &quot;函数基础&quot;">​</a></h2><p>那么，到底什么是函数，如何在Python程序中定义函数呢？</p><p>说白了，函数就是为了实现某一功能的代码段，只要写好以后，就可以重复利用。我们先来看下面一个简单的例子:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_func(message):</span></span>
<span class="line"><span>    print(&#39;Got a message: {}&#39;.format(message))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 调用函数 my_func()</span></span>
<span class="line"><span>my_func(&#39;Hello World&#39;)</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Got a message: Hello World</span></span></code></pre></div><p>其中：</p><ul><li><p>def是函数的声明；</p></li><li><p>my_func是函数的名称；</p></li><li><p>括号里面的message则是函数的参数；</p></li><li><p>而print那行则是函数的主体部分，可以执行相应的语句；</p></li><li><p>在函数最后，你可以返回调用结果（return或yield），也可以不返回。</p></li></ul><p>总结一下，大概是下面的这种形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def name(param1, param2, ..., paramN):</span></span>
<span class="line"><span>    statements</span></span>
<span class="line"><span>    return/yield value # optional</span></span></code></pre></div><p>和其他需要编译的语言（比如C语言）不一样的是，def是可执行语句，这意味着函数直到被调用前，都是不存在的。当程序调用函数时，def语句才会创建一个新的函数对象，并赋予其名字。</p><p>我们一起来看几个例子，加深你对函数的印象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_sum(a, b):</span></span>
<span class="line"><span>    return a + b</span></span>
<span class="line"><span></span></span>
<span class="line"><span>result = my_sum(3, 5)</span></span>
<span class="line"><span>print(result)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>8</span></span></code></pre></div><p>这里，我们定义了my_sum()这个函数，它有两个参数a和b，作用是相加；随后，调用my_sum()函数，分别把3和5赋于a和b；最后，返回其相加的值，赋于变量result，并输出得到8。</p><p>再来看一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def find_largest_element(l):</span></span>
<span class="line"><span>    if not isinstance(l, list):</span></span>
<span class="line"><span>        print(&#39;input is not type of list&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    if len(l) == 0:</span></span>
<span class="line"><span>        print(&#39;empty input&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    largest_element = l[0]</span></span>
<span class="line"><span>    for item in l:</span></span>
<span class="line"><span>        if item &amp;gt; largest_element:</span></span>
<span class="line"><span>            largest_element = item</span></span>
<span class="line"><span>    print(&#39;largest element is: {}&#39;.format(largest_element))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>find_largest_element([8, 1,-3, 2, 0])</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>largest element is: 8</span></span></code></pre></div><p>这个例子中，我们定义了函数find_largest_element，作用是遍历输入的列表，找出最大的值并打印。因此，当我们调用它，并传递列表 [8, 1, -3, 2, 0] 作为参数时，程序就会输出 <code>largest element is: 8</code>。</p><p>需要注意，主程序调用函数时，必须保证这个函数此前已经定义过，不然就会报错，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>my_func(&#39;hello world&#39;)</span></span>
<span class="line"><span>def my_func(message):</span></span>
<span class="line"><span>    print(&#39;Got a message: {}&#39;.format(message))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>NameError: name &#39;my_func&#39; is not defined</span></span></code></pre></div><p>但是，如果我们在函数内部调用其他函数，函数间哪个声明在前、哪个在后就无所谓，因为def是可执行语句，函数在调用之前都不存在，我们只需保证调用时，所需的函数都已经声明定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_func(message):</span></span>
<span class="line"><span>    my_sub_func(message) # 调用my_sub_func()在其声明之前不影响程序执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def my_sub_func(message):</span></span>
<span class="line"><span>    print(&#39;Got a message: {}&#39;.format(message))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>my_func(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Got a message: hello world</span></span></code></pre></div><p>另外，Python函数的参数可以设定默认值，比如下面这样的写法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def func(param = 0):</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>这样，在调用函数func()时，如果参数param没有传入，则参数默认为0；而如果传入了参数param，其就会覆盖默认值。</p><p>前面说过，Python和其他语言相比的一大特点是，Python是dynamically typed的，可以接受任何数据类型（整型，浮点，字符串等等）。对函数参数来说，这一点同样适用。比如还是刚刚的my_sum函数，我们也可以把列表作为参数来传递，表示将两个列表相连接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>print(my_sum([1, 2], [3, 4]))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>[1, 2, 3, 4]</span></span></code></pre></div><p>同样，也可以把字符串作为参数传递，表示字符串的合并拼接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>print(my_sum(&#39;hello &#39;, &#39;world&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>hello world</span></span></code></pre></div><p>当然，如果两个参数的数据类型不同，比如一个是列表、一个是字符串，两者无法相加，那就会报错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>print(my_sum([1, 2], &#39;hello&#39;))</span></span>
<span class="line"><span>TypeError: can only concatenate list (not &quot;str&quot;) to list</span></span></code></pre></div><p>我们可以看到，Python不用考虑输入的数据类型，而是将其交给具体的代码去判断执行，同样的一个函数（比如这边的相加函数my_sum()），可以同时应用在整型、列表、字符串等等的操作中。</p><p>在编程语言中，我们把这种行为称为 <strong>多态</strong>。这也是Python和其他语言，比如Java、C等很大的一个不同点。当然，Python这种方便的特性，在实际使用中也会带来诸多问题。因此，必要时请你在开头加上数据的类型检查。</p><p>Python函数的另一大特性，是Python支持函数的嵌套。所谓的函数嵌套，就是指函数里面又有函数，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def f1():</span></span>
<span class="line"><span>    print(&#39;hello&#39;)</span></span>
<span class="line"><span>    def f2():</span></span>
<span class="line"><span>        print(&#39;world&#39;)</span></span>
<span class="line"><span>    f2()</span></span>
<span class="line"><span>f1()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>hello</span></span>
<span class="line"><span>world</span></span></code></pre></div><p>这里函数f1()的内部，又定义了函数f2()。在调用函数f1()时，会先打印字符串 <code>&#39;hello&#39;</code>，然后f1()内部再调用f2()，打印字符串 <code>&#39;world&#39;</code>。你也许会问，为什么需要函数嵌套？这样做有什么好处呢？</p><p>其实，函数的嵌套，主要有下面两个方面的作用。</p><p>第一，函数的嵌套能够保证内部函数的隐私。内部函数只能被外部函数所调用和访问，不会暴露在全局作用域，因此，如果你的函数内部有一些隐私数据（比如数据库的用户、密码等），不想暴露在外，那你就可以使用函数的的嵌套，将其封装在内部函数中，只通过外部函数来访问。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def connect_DB():</span></span>
<span class="line"><span>    def get_DB_configuration():</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        return host, username, password</span></span>
<span class="line"><span>    conn = connector.connect(get_DB_configuration())</span></span>
<span class="line"><span>    return conn</span></span></code></pre></div><p>这里的函数get_DB_configuration，便是内部函数，它无法在connect_DB()函数以外被单独调用。也就是说，下面这样的外部直接调用是错误的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>get_DB_configuration()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>NameError: name &#39;get_DB_configuration&#39; is not defined</span></span></code></pre></div><p>我们只能通过调用外部函数connect_DB()来访问它，这样一来，程序的安全性便有了很大的提高。</p><p>第二，合理的使用函数嵌套，能够提高程序的运行效率。我们来看下面这个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def factorial(input):</span></span>
<span class="line"><span>    # validation check</span></span>
<span class="line"><span>    if not isinstance(input, int):</span></span>
<span class="line"><span>        raise Exception(&#39;input must be an integer.&#39;)</span></span>
<span class="line"><span>    if input &amp;lt; 0:</span></span>
<span class="line"><span>        raise Exception(&#39;input must be greater or equal to 0&#39; )</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def inner_factorial(input):</span></span>
<span class="line"><span>        if input &amp;lt;= 1:</span></span>
<span class="line"><span>            return 1</span></span>
<span class="line"><span>        return input * inner_factorial(input-1)</span></span>
<span class="line"><span>    return inner_factorial(input)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(factorial(5))</span></span></code></pre></div><p>这里，我们使用递归的方式计算一个数的阶乘。因为在计算之前，需要检查输入是否合法，所以我写成了函数嵌套的形式，这样一来，输入是否合法就只用检查一次。而如果我们不使用函数嵌套，那么每调用一次递归便会检查一次，这是没有必要的，也会降低程序的运行效率。</p><p>实际工作中，如果你遇到相似的情况，输入检查不是很快，还会耗费一定的资源，那么运用函数的嵌套就十分必要了。</p><h2 id="函数变量作用域" tabindex="-1">函数变量作用域 <a class="header-anchor" href="#函数变量作用域" aria-label="Permalink to &quot;函数变量作用域&quot;">​</a></h2><p>Python函数中变量的作用域和其他语言类似。如果变量是在函数内部定义的，就称为局部变量，只在函数内部有效。一旦函数执行完毕，局部变量就会被回收，无法访问，比如下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def read_text_from_file(file_path):</span></span>
<span class="line"><span>    with open(file_path) as file:</span></span>
<span class="line"><span>        ...</span></span></code></pre></div><p>我们在函数内部定义了file这个变量，这个变量只在read_text_from_file这个函数里有效，在函数外部则无法访问。</p><p>相对应的，全局变量则是定义在整个文件层次上的，比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MIN_VALUE = 1</span></span>
<span class="line"><span>MAX_VALUE = 10</span></span>
<span class="line"><span>def validation_check(value):</span></span>
<span class="line"><span>    if value &amp;lt; MIN_VALUE or value &amp;gt; MAX_VALUE:</span></span>
<span class="line"><span>        raise Exception(&#39;validation check fails&#39;)</span></span></code></pre></div><p>这里的MIN_VALUE和MAX_VALUE就是全局变量，可以在文件内的任何地方被访问，当然在函数内部也是可以的。不过，我们 <strong>不能在函数内部随意改变全局变量的值</strong>。比如，下面的写法就是错误的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MIN_VALUE = 1</span></span>
<span class="line"><span>MAX_VALUE = 10</span></span>
<span class="line"><span>def validation_check(value):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    MIN_VALUE += 1</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>validation_check(5)</span></span></code></pre></div><p>如果运行这段代码，程序便会报错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UnboundLocalError: local variable &#39;MIN_VALUE&#39; referenced before assignment</span></span></code></pre></div><p>这是因为，Python的解释器会默认函数内部的变量为局部变量，但是又发现局部变量MIN_VALUE并没有声明，因此就无法执行相关操作。所以，如果我们一定要在函数内部改变全局变量的值，就必须加上global这个声明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MIN_VALUE = 1</span></span>
<span class="line"><span>MAX_VALUE = 10</span></span>
<span class="line"><span>def validation_check(value):</span></span>
<span class="line"><span>    global MIN_VALUE</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    MIN_VALUE += 1</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>validation_check(5)</span></span></code></pre></div><p>这里的global关键字，并不表示重新创建了一个全局变量MIN_VALUE，而是告诉Python解释器，函数内部的变量MIN_VALUE，就是之前定义的全局变量，并不是新的全局变量，也不是局部变量。这样，程序就可以在函数内部访问全局变量，并修改它的值了。</p><p>另外，如果遇到函数内部局部变量和全局变量同名的情况，那么在函数内部，局部变量会覆盖全局变量，比如下面这种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MIN_VALUE = 1</span></span>
<span class="line"><span>MAX_VALUE = 10</span></span>
<span class="line"><span>def validation_check(value):</span></span>
<span class="line"><span>    MIN_VALUE = 3</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>在函数validation_check()内部，我们定义了和全局变量同名的局部变量MIN_VALUE，那么，MIN_VALUE在函数内部的值，就应该是3而不是1了。</p><p>类似的，对于嵌套函数来说，内部函数可以访问外部函数定义的变量，但是无法修改，若要修改，必须加上nonlocal这个关键字：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def outer():</span></span>
<span class="line"><span>    x = &quot;local&quot;</span></span>
<span class="line"><span>    def inner():</span></span>
<span class="line"><span>        nonlocal x # nonlocal关键字表示这里的x就是外部函数outer定义的变量x</span></span>
<span class="line"><span>        x = &#39;nonlocal&#39;</span></span>
<span class="line"><span>        print(&quot;inner:&quot;, x)</span></span>
<span class="line"><span>    inner()</span></span>
<span class="line"><span>    print(&quot;outer:&quot;, x)</span></span>
<span class="line"><span>outer()</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>inner: nonlocal</span></span>
<span class="line"><span>outer: nonlocal</span></span></code></pre></div><p>如果不加上nonlocal这个关键字，而内部函数的变量又和外部函数变量同名，那么同样的，内部函数变量会覆盖外部函数的变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def outer():</span></span>
<span class="line"><span>    x = &quot;local&quot;</span></span>
<span class="line"><span>    def inner():</span></span>
<span class="line"><span>        x = &#39;nonlocal&#39; # 这里的x是inner这个函数的局部变量</span></span>
<span class="line"><span>        print(&quot;inner:&quot;, x)</span></span>
<span class="line"><span>    inner()</span></span>
<span class="line"><span>    print(&quot;outer:&quot;, x)</span></span>
<span class="line"><span>outer()</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>inner: nonlocal</span></span>
<span class="line"><span>outer: local</span></span></code></pre></div><h2 id="闭包" tabindex="-1">闭包 <a class="header-anchor" href="#闭包" aria-label="Permalink to &quot;闭包&quot;">​</a></h2><p>这节课的第三个重点，我想再来介绍一下闭包（closure）。闭包其实和刚刚讲的嵌套函数类似，不同的是，这里外部函数返回的是一个函数，而不是一个具体的值。返回的函数通常赋于一个变量，这个变量可以在后面被继续执行调用。</p><p>举个例子你就更容易理解了。比如，我们想计算一个数的n次幂，用闭包可以写成下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def nth_power(exponent):</span></span>
<span class="line"><span>    def exponent_of(base):</span></span>
<span class="line"><span>        return base ** exponent</span></span>
<span class="line"><span>    return exponent_of # 返回值是exponent_of函数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>square = nth_power(2) # 计算一个数的平方</span></span>
<span class="line"><span>cube = nth_power(3) # 计算一个数的立方</span></span>
<span class="line"><span>square</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>&amp;lt;function __main__.nth_power.&amp;lt;locals&amp;gt;.exponent(base)&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cube</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>&amp;lt;function __main__.nth_power.&amp;lt;locals&amp;gt;.exponent(base)&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(square(2))  # 计算2的平方</span></span>
<span class="line"><span>print(cube(2)) # 计算2的立方</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>4 # 2^2</span></span>
<span class="line"><span>8 # 2^3</span></span></code></pre></div><p>这里外部函数nth_power()返回值，是函数exponent_of()，而不是一个具体的数值。需要注意的是，在执行完 <code>square = nth_power(2)</code> 和 <code>cube = nth_power(3)</code> 后，外部函数nth_power()的参数exponent，仍然会被内部函数exponent_of()记住。这样，之后我们调用square(2)或者cube(2)时，程序就能顺利地输出结果，而不会报错说参数exponent没有定义了。</p><p>看到这里，你也许会思考，为什么要闭包呢？上面的程序，我也可以写成下面的形式啊！</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def nth_power_rewrite(base, exponent):</span></span>
<span class="line"><span>    return base ** exponent</span></span></code></pre></div><p>确实可以，不过，要知道，使用闭包的一个原因，是让程序变得更简洁易读。设想一下，比如你需要计算很多个数的平方，那么你觉得写成下面哪一种形式更好呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 不适用闭包</span></span>
<span class="line"><span>res1 = nth_power_rewrite(base1, 2)</span></span>
<span class="line"><span>res2 = nth_power_rewrite(base2, 2)</span></span>
<span class="line"><span>res3 = nth_power_rewrite(base3, 2)</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 使用闭包</span></span>
<span class="line"><span>square = nth_power(2)</span></span>
<span class="line"><span>res1 = square(base1)</span></span>
<span class="line"><span>res2 = square(base2)</span></span>
<span class="line"><span>res3 = square(base3)</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>显然是第二种，是不是？首先直观来看，第二种形式，让你每次调用函数都可以少输入一个参数，表达更为简洁。</p><p>其次，和上面讲到的嵌套函数优点类似，函数开头需要做一些额外工作，而你又需要多次调用这个函数时，将那些额外工作的代码放在外部函数，就可以减少多次调用导致的不必要的开销，提高程序的运行效率。</p><p>另外还有一点，我们后面会讲到，闭包常常和装饰器（decorator）一起使用。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我们一起学习了Python函数的概念及其应用，有这么几点你需要注意:</p><ol><li><p>Python中函数的参数可以接受任意的数据类型，使用起来需要注意，必要时请在函数开头加入数据类型的检查；</p></li><li><p>和其他语言不同，Python中函数的参数可以设定默认值；</p></li><li><p>嵌套函数的使用，能保证数据的隐私性，提高程序运行效率；</p></li><li><p>合理地使用闭包，则可以简化程序的复杂度，提高可读性。</p></li></ol><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后给你留一道思考题。在实际的学习工作中，你遇到过哪些使用嵌套函数或者是闭包的例子呢？欢迎在下方留言，与我讨论，也欢迎你把这篇文章分享给你的同事、朋友。</p>`,85)])])}const g=n(l,[["render",i]]);export{u as __pageData,g as default};
