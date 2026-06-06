import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"07 | 修炼基本功：条件与循环","description":"","frontmatter":{},"headers":[{"level":2,"title":"条件语句","slug":"条件语句","link":"#条件语句","children":[]},{"level":2,"title":"循环语句","slug":"循环语句","link":"#循环语句","children":[]},{"level":2,"title":"条件与循环的复用","slug":"条件与循环的复用","link":"#条件与循环的复用","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/07-修炼基本功：条件与循环.md","filePath":"Python核心技术与实战/07-修炼基本功：条件与循环.md","lastUpdated":1779816143000}'),i={name:"Python核心技术与实战/07-修炼基本功：条件与循环.md"};function l(t,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_07-修炼基本功-条件与循环" tabindex="-1">07 | 修炼基本功：条件与循环 <a class="header-anchor" href="#_07-修炼基本功-条件与循环" aria-label="Permalink to &quot;07 | 修炼基本功：条件与循环&quot;">​</a></h1><p>你好，我是景霄。</p><p>前面几节，我们一起学习了列表、元组、字典、集合和字符串等一系列Python的基本数据类型。但是，如何把这一个个基本的数据结构类型串接起来，组成一手漂亮的代码呢？这就是我们今天所要讨论的“条件与循环”。</p><p>我习惯把“条件与循环”，叫做编程中的基本功。为什么称它为基本功呢？因为它控制着代码的逻辑，可以说是程序的中枢系统。如果把写程序比作盖楼房，那么条件与循环就是楼房的根基，其他所有东西都是在此基础上构建而成。</p><p>毫不夸张地说，写一手简洁易读的条件与循环代码，对提高程序整体的质量至关重要。</p><h2 id="条件语句" tabindex="-1">条件语句 <a class="header-anchor" href="#条件语句" aria-label="Permalink to &quot;条件语句&quot;">​</a></h2><p>首先，我们一起来看一下Python的条件语句，用法很简单。比如，我想要表示y=|x|这个函数，那么相应的代码便是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># y = |x|</span></span>
<span class="line"><span>if x &amp;lt; 0:</span></span>
<span class="line"><span>    y = -x</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>    y = x</span></span></code></pre></div><p>和其他语言不一样，我们不能在条件语句中加括号，写成下面这样的格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (x &amp;lt; 0)</span></span></code></pre></div><p>但需要注意的是，在条件语句的末尾必须加上冒号（:），这是Python特定的语法规范。</p><p>由于Python不支持switch语句，因此，当存在多个条件判断时，我们需要用else if来实现，这在Python中的表达是 <strong>elif</strong>。语法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if condition_1:</span></span>
<span class="line"><span>    statement_1</span></span>
<span class="line"><span>elif condition_2:</span></span>
<span class="line"><span>    statement_2</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>elif condition_i:</span></span>
<span class="line"><span>    statement_i</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>    statement_n</span></span></code></pre></div><p>整个条件语句是顺序执行的，如果遇到一个条件满足，比如condition_i满足时，在执行完statement_i后，便会退出整个if、elif、else条件语句，而不会继续向下执行。这个语句在工作中很常用，比如下面的这个例子。</p><p>实际工作中，我们经常用ID表示一个事物的属性，然后进行条件判断并且输出。比如，在integrity的工作中，通常用0、1、2分别表示一部电影的色情暴力程度。其中，0的程度最高，是red级别；1其次，是yellow级别；2代表没有质量问题，属于green。</p><p>如果给定一个ID，要求输出某部电影的质量评级，则代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if id == 0:</span></span>
<span class="line"><span>    print(&#39;red&#39;)</span></span>
<span class="line"><span>elif id == 1:</span></span>
<span class="line"><span>    print(&#39;yellow&#39;)</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>    print(&#39;green&#39;)</span></span></code></pre></div><p>不过要注意，if语句是可以单独使用的，但elif、else都必须和if成对使用。</p><p>另外，在我们进行条件判断时， 不少人喜欢省略判断的条件，比如写成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if s: # s is a string</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>if l: # l is a list</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>if i: # i is an int</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>关于省略判断条件的常见用法，我大概总结了一下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/96597/949742df36600c086c31e399ce515f45.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/96597/949742df36600c086c31e399ce515f45.png" alt=""></a></p><p>不过，切记，在实际写代码时，我们鼓励，除了boolean类型的数据，条件判断最好是显性的。比如，在判断一个整型数是否为0时，我们最好写出判断的条件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if i != 0:</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>而不是只写出变量名：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if i:</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><h2 id="循环语句" tabindex="-1">循环语句 <a class="header-anchor" href="#循环语句" aria-label="Permalink to &quot;循环语句&quot;">​</a></h2><p>讲完了条件语句，我们接着来看循环语句。所谓循环，顾名思义，本质上就是遍历集合中的元素。和其他语言一样，Python中的循环一般通过for循环和while循环实现。</p><p>比如，我们有一个列表，需要遍历列表中的所有元素并打印输出，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4]</span></span>
<span class="line"><span>for item in l:</span></span>
<span class="line"><span>    print(item)</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>4</span></span></code></pre></div><p>你看，是不是很简单呢？</p><p>其实，Python中的数据结构只要是可迭代的（iterable），比如列表、集合等等，那么都可以通过下面这种方式遍历：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for item in &amp;lt;iterable&amp;gt;:</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>这里需要单独强调一下字典。字典本身只有键是可迭代的，如果我们要遍历它的值或者是键值对，就需要通过其内置的函数values()或者items()实现。其中，values()返回字典的值的集合，items()返回键值对的集合。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, &#39;dob&#39;: &#39;2000-01-01&#39;, &#39;gender&#39;: &#39;male&#39;}</span></span>
<span class="line"><span>for k in d: # 遍历字典的键</span></span>
<span class="line"><span>    print(k)</span></span>
<span class="line"><span>name</span></span>
<span class="line"><span>dob</span></span>
<span class="line"><span>gender</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for v in d.values(): # 遍历字典的值</span></span>
<span class="line"><span>    print(v)</span></span>
<span class="line"><span>jason</span></span>
<span class="line"><span>2000-01-01</span></span>
<span class="line"><span>male</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for k, v in d.items(): # 遍历字典的键值对</span></span>
<span class="line"><span>    print(&#39;key: {}, value: {}&#39;.format(k, v))</span></span>
<span class="line"><span>key: name, value: jason</span></span>
<span class="line"><span>key: dob, value: 2000-01-01</span></span>
<span class="line"><span>key: gender, value: male</span></span></code></pre></div><p>看到这里你也许会问，有没有办法通过集合中的索引来遍历元素呢？当然可以，其实这种情况在实际工作中还是很常见的，甚至很多时候，我们还得根据索引来做一些条件判断。</p><p>我们通常通过range()这个函数，拿到索引，再去遍历访问集合中的元素。比如下面的代码，遍历一个列表中的元素，当索引小于5时，打印输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4, 5, 6, 7]</span></span>
<span class="line"><span>for index in range(0, len(l)):</span></span>
<span class="line"><span>    if index &amp;lt; 5:</span></span>
<span class="line"><span>        print(l[index])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>5</span></span></code></pre></div><p>当我们同时需要索引和元素时，还有一种更简洁的方式，那就是通过Python内置的函数enumerate()。用它来遍历集合，不仅返回每个元素，并且还返回其对应的索引，这样一来，上面的例子就可以写成:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4, 5, 6, 7]</span></span>
<span class="line"><span>for index, item in enumerate(l):</span></span>
<span class="line"><span>    if index &amp;lt; 5:</span></span>
<span class="line"><span>        print(item)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>5</span></span></code></pre></div><p>在循环语句中，我们还常常搭配continue和break一起使用。所谓continue，就是让程序跳过当前这层循环，继续执行下面的循环；而break则是指完全跳出所在的整个循环体。在循环中适当加入continue和break，往往能使程序更加简洁、易读。</p><p>比如，给定两个字典，分别是产品名称到价格的映射，和产品名称到颜色列表的映射。我们要找出价格小于1000，并且颜色不是红色的所有产品名称和颜色的组合。如果不用continue，代码应该是下面这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># name_price: 产品名称(str)到价格(int)的映射字典</span></span>
<span class="line"><span># name_color: 产品名字(str)到颜色(list of str)的映射字典</span></span>
<span class="line"><span>for name, price in name_price.items():</span></span>
<span class="line"><span>    if price &amp;lt; 1000:</span></span>
<span class="line"><span>        if name in name_color:</span></span>
<span class="line"><span>            for color in name_color[name]:</span></span>
<span class="line"><span>                if color != &#39;red&#39;:</span></span>
<span class="line"><span>                    print(&#39;name: {}, color: {}&#39;.format(name, color))</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            print(&#39;name: {}, color: {}&#39;.format(name, &#39;None&#39;))</span></span></code></pre></div><p>而加入continue后，代码显然清晰了很多：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># name_price: 产品名称(str)到价格(int)的映射字典</span></span>
<span class="line"><span># name_color: 产品名字(str)到颜色(list of str)的映射字典</span></span>
<span class="line"><span>for name, price in name_price.items():</span></span>
<span class="line"><span>    if price &amp;gt;= 1000:</span></span>
<span class="line"><span>        continue</span></span>
<span class="line"><span>    if name not in name_color:</span></span>
<span class="line"><span>        print(&#39;name: {}, color: {}&#39;.format(name, &#39;None&#39;))</span></span>
<span class="line"><span>        continue</span></span>
<span class="line"><span>    for color in name_color[name]:</span></span>
<span class="line"><span>        if color == &#39;red&#39;:</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        print(&#39;name: {}, color: {}&#39;.format(name, color))</span></span></code></pre></div><p>我们可以看到，按照第一个版本的写法，从开始一直到打印输出符合条件的产品名称和颜色，共有5层for或者if的嵌套；但第二个版本加入了continue后，只有3层嵌套。</p><p>显然，如果代码中出现嵌套里还有嵌套的情况，代码便会变得非常冗余、难读，也不利于后续的调试、修改。因此，我们要尽量避免这种多层嵌套的情况。</p><p>前面讲了for循环，对于while循环，原理也是一样的。它表示当condition满足时，一直重复循环内部的操作，直到condition不再满足，就跳出循环体。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while condition:</span></span>
<span class="line"><span>    ....</span></span></code></pre></div><p>很多时候，for循环和while循环可以互相转换，比如要遍历一个列表，我们用while循环同样可以完成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4]</span></span>
<span class="line"><span>index = 0</span></span>
<span class="line"><span>while index &amp;lt; len(l):</span></span>
<span class="line"><span>    print(l[index])</span></span>
<span class="line"><span>    index += 1</span></span></code></pre></div><p>那么，两者的使用场景又有什么区别呢？</p><p>通常来说，如果你只是遍历一个已知的集合，找出满足条件的元素，并进行相应的操作，那么使用for循环更加简洁。但如果你需要在满足某个条件前，不停地重复某些操作，并且没有特定的集合需要去遍历，那么一般则会使用while循环。</p><p>比如，某个交互式问答系统，用户输入文字，系统会根据内容做出相应的回答。为了实现这个功能，我们一般会使用while循环，大致代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while True:</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        text = input(&#39;Please enter your questions, enter &quot;q&quot; to exit&#39;)</span></span>
<span class="line"><span>        if text == &#39;q&#39;:</span></span>
<span class="line"><span>            print(&#39;Exit system&#39;)</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        print(response)</span></span>
<span class="line"><span>    except Exception as err:</span></span>
<span class="line"><span>        print(&#39;Encountered error: {}&#39;.format(err))</span></span>
<span class="line"><span>        break</span></span></code></pre></div><p>同时需要注意的是，for循环和while循环的效率问题。比如下面的while循环：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>i = 0</span></span>
<span class="line"><span>while i &amp;lt; 1000000:</span></span>
<span class="line"><span>    i += 1</span></span></code></pre></div><p>和等价的for循环：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for i in range(0, 1000000):</span></span>
<span class="line"><span>    pass</span></span></code></pre></div><p>究竟哪个效率高呢？</p><p>要知道，range()函数是直接由C语言写的，调用它速度非常快。而while循环中的“i += 1”这个操作，得通过Python的解释器间接调用底层的C语言；并且这个简单的操作，又涉及到了对象的创建和删除（因为i是整型，是immutable，i += 1相当于i = new int(i + 1)）。所以，显然，for循环的效率更胜一筹。</p><h2 id="条件与循环的复用" tabindex="-1">条件与循环的复用 <a class="header-anchor" href="#条件与循环的复用" aria-label="Permalink to &quot;条件与循环的复用&quot;">​</a></h2><p>前面两部分讲了条件与循环的一些基本操作，接下来，我们重点来看它们的进阶操作，让程序变得更简洁高效。</p><p>在阅读代码的时候，你应该常常会发现，有很多将条件与循环并做一行的操作，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>expression1 if condition else expression2 for item in iterable</span></span></code></pre></div><p>将这个表达式分解开来，其实就等同于下面这样的嵌套结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for item in iterable:</span></span>
<span class="line"><span>    if condition:</span></span>
<span class="line"><span>        expression1</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        expression2</span></span></code></pre></div><p>而如果没有else语句，则需要写成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>expression for item in iterable if condition</span></span></code></pre></div><p>举个例子，比如我们要绘制y = 2*|x| + 5 的函数图像，给定集合x的数据点，需要计算出y的数据集合，那么只用一行代码，就可以很轻松地解决问题了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>y = [value * 2 + 5 if value &amp;gt; 0 else -value * 2 + 5 for value in x]</span></span></code></pre></div><p>再比如我们在处理文件中的字符串时，常常遇到的一个场景：将文件中逐行读取的一个完整语句，按逗号分割单词，去掉首位的空字符，并过滤掉长度小于等于3的单词，最后返回由单词组成的列表。这同样可以简洁地表达成一行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>text = &#39; Today,  is, Sunday&#39;</span></span>
<span class="line"><span>text_list = [s.strip() for s in text.split(&#39;,&#39;) if len(s.strip()) &amp;gt; 3]</span></span>
<span class="line"><span>print(text_list)</span></span>
<span class="line"><span>[&#39;Today&#39;, &#39;Sunday&#39;]</span></span></code></pre></div><p>当然，这样的复用并不仅仅局限于一个循环。比如，给定两个列表x、y，要求返回x、y中所有元素对组成的元组，相等情况除外。那么，你也可以很容易表示出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[(xx, yy) for xx in x for yy in y if xx != yy]</span></span></code></pre></div><p>这样的写法就等价于：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = []</span></span>
<span class="line"><span>for xx in x:</span></span>
<span class="line"><span>    for yy in y:</span></span>
<span class="line"><span>        if xx != yy:</span></span>
<span class="line"><span>            l.append((xx, yy))</span></span></code></pre></div><p>熟练之后，你会发现这种写法非常方便。当然，如果遇到逻辑很复杂的复用，你可能会觉得写成一行难以理解、容易出错。那种情况下，用正常的形式表达，也不失为一种好的规范和选择。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天这节课，我们一起学习了条件与循环的基本概念、进阶用法以及相应的应用。这里，我重点强调几个易错的地方。</p><ul><li><p>在条件语句中，if可以单独使用，但是elif和else必须和if同时搭配使用；而If条件语句的判断，除了boolean类型外，其他的最好显示出来。</p></li><li><p>在for循环中，如果需要同时访问索引和元素，你可以使用enumerate()函数来简化代码。</p></li><li><p>写条件与循环时，合理利用continue或者break来避免复杂的嵌套，是十分重要的。</p></li><li><p>要注意条件与循环的复用，简单功能往往可以用一行直接完成，极大地提高代码质量与效率。</p></li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后给你留一个思考题。给定下面两个列表attributes和values，要求针对values中每一组子列表value，输出其和attributes中的键对应后的字典，最后返回字典组成的列表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>attributes = [&#39;name&#39;, &#39;dob&#39;, &#39;gender&#39;]</span></span>
<span class="line"><span>values = [[&#39;jason&#39;, &#39;2000-01-01&#39;, &#39;male&#39;],</span></span>
<span class="line"><span>[&#39;mike&#39;, &#39;1999-01-01&#39;, &#39;male&#39;],</span></span>
<span class="line"><span>[&#39;nancy&#39;, &#39;2001-02-01&#39;, &#39;female&#39;]</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># expected output:</span></span>
<span class="line"><span>[{&#39;name&#39;: &#39;jason&#39;, &#39;dob&#39;: &#39;2000-01-01&#39;, &#39;gender&#39;: &#39;male&#39;},</span></span>
<span class="line"><span>{&#39;name&#39;: &#39;mike&#39;, &#39;dob&#39;: &#39;1999-01-01&#39;, &#39;gender&#39;: &#39;male&#39;},</span></span>
<span class="line"><span>{&#39;name&#39;: &#39;nancy&#39;, &#39;dob&#39;: &#39;2001-02-01&#39;, &#39;gender&#39;: &#39;female&#39;}]</span></span></code></pre></div><p>你能分别用一行和多行条件循环语句，来实现这个功能吗？</p><p>欢迎在留言区写下你的答案，还有你今天学习的心得和疑惑，也欢迎你把这篇文章分享给你的同事、朋友。</p>`,86)])])}const g=n(i,[["render",l]]);export{u as __pageData,g as default};
