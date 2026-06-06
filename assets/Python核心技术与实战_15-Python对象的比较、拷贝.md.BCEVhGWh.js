import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse(`{"title":"15 | Python对象的比较、拷贝","description":"","frontmatter":{},"headers":[{"level":2,"title":"'==' VS 'is'","slug":"vs-is","link":"#vs-is","children":[]},{"level":2,"title":"浅拷贝和深度拷贝","slug":"浅拷贝和深度拷贝","link":"#浅拷贝和深度拷贝","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/15-Python对象的比较、拷贝.md","filePath":"Python核心技术与实战/15-Python对象的比较、拷贝.md","lastUpdated":1779816143000}`),l={name:"Python核心技术与实战/15-Python对象的比较、拷贝.md"};function i(c,s,t,o,d,h){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_15-python对象的比较、拷贝" tabindex="-1">15 | Python对象的比较、拷贝 <a class="header-anchor" href="#_15-python对象的比较、拷贝" aria-label="Permalink to &quot;15 | Python对象的比较、拷贝&quot;">​</a></h1><p>你好，我是景霄。</p><p>在前面的学习中，我们其实已经接触到了很多 Python对象比较和复制的例子，比如下面这个，判断a和b是否相等的if语句：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if a == b:</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>再比如第二个例子，这里l2就是l1的拷贝。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l1 = [1, 2, 3]</span></span>
<span class="line"><span>l2 = list(l1)</span></span></code></pre></div><p>但你可能并不清楚，这些语句的背后发生了什么。比如，</p><ul><li>l2是l1的浅拷贝（shallow copy）还是深度拷贝（deep copy）呢？</li><li><code>a == b</code> 是比较两个对象的值相等，还是两个对象完全相等呢？</li></ul><p>关于这些的种种知识，我希望通过这节课的学习，让你有个全面的了解。</p><h2 id="vs-is" tabindex="-1"><code>&#39;==&#39;</code> VS <code>&#39;is&#39;</code> <a class="header-anchor" href="#vs-is" aria-label="Permalink to &quot;\`&#39;==&#39;\` VS \`&#39;is&#39;\`&quot;">​</a></h2><p>等于（==）和is是Python中对象比较常用的两种方式。简单来说， <code>&#39;==&#39;</code> 操作符比较对象之间的值是否相等，比如下面的例子，表示比较变量a和b所指向的值是否相等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a == b</span></span></code></pre></div><p>而 <code>&#39;is&#39;</code> 操作符比较的是对象的身份标识是否相等，即它们是否是同一个对象，是否指向同一个内存地址。</p><p>在Python中，每个对象的身份标识，都能通过函数id(object)获得。因此， <code>&#39;is&#39;</code> 操作符，相当于比较对象之间的ID是否相等，我们来看下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a = 10</span></span>
<span class="line"><span>b = 10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>a == b</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>id(a)</span></span>
<span class="line"><span>4427562448</span></span>
<span class="line"><span></span></span>
<span class="line"><span>id(b)</span></span>
<span class="line"><span>4427562448</span></span>
<span class="line"><span></span></span>
<span class="line"><span>a is b</span></span>
<span class="line"><span>True</span></span></code></pre></div><p>这里，首先Python会为10这个值开辟一块内存，然后变量a和b同时指向这块内存区域，即a和b都是指向10这个变量，因此a和b的值相等，id也相等， <code>a == b</code> 和 <code>a is b</code> 都返回True。</p><p>不过，需要注意，对于整型数字来说，以上 <code>a is b</code> 为True的结论，只适用于-5到256范围内的数字。比如下面这个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a = 257</span></span>
<span class="line"><span>b = 257</span></span>
<span class="line"><span></span></span>
<span class="line"><span>a == b</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>id(a)</span></span>
<span class="line"><span>4473417552</span></span>
<span class="line"><span></span></span>
<span class="line"><span>id(b)</span></span>
<span class="line"><span>4473417584</span></span>
<span class="line"><span></span></span>
<span class="line"><span>a is b</span></span>
<span class="line"><span>False</span></span></code></pre></div><p>这里我们把257同时赋值给了a和b，可以看到 <code>a == b</code> 仍然返回True，因为a和b指向的值相等。但奇怪的是， <code>a is b</code> 返回了false，并且我们发现，a和b的ID不一样了，这是为什么呢？</p><p>事实上，出于对性能优化的考虑，Python内部会对-5到256的整型维持一个数组，起到一个缓存的作用。这样，每次你试图创建一个-5到256范围内的整型数字时，Python都会从这个数组中返回相对应的引用，而不是重新开辟一块新的内存空间。</p><p>但是，如果整型数字超过了这个范围，比如上述例子中的257，Python则会为两个257开辟两块内存区域，因此a和b的ID不一样， <code>a is b</code> 就会返回False了。</p><p>通常来说，在实际工作中，当我们比较变量时，使用 <code>&#39;==&#39;</code> 的次数会比 <code>&#39;is&#39;</code> 多得多，因为我们一般更关心两个变量的值，而不是它们内部的存储地址。但是，当我们比较一个变量与一个单例（singleton）时，通常会使用 <code>&#39;is&#39;</code>。一个典型的例子，就是检查一个变量是否为None：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if a is None:</span></span>
<span class="line"><span>      ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if a is not None:</span></span>
<span class="line"><span>      ...</span></span></code></pre></div><p>这里注意，比较操作符 <code>&#39;is&#39;</code> 的速度效率，通常要优于 <code>&#39;==&#39;</code>。因为 <code>&#39;is&#39;</code> 操作符不能被重载，这样，Python就不需要去寻找，程序中是否有其他地方重载了比较操作符，并去调用。执行比较操作符 <code>&#39;is&#39;</code>，就仅仅是比较两个变量的ID而已。</p><p>但是 <code>&#39;==&#39;</code> 操作符却不同，执行 <code>a == b</code> 相当于是去执行 <code>a.__eq__(b)</code>，而Python大部分的数据类型都会去重载 <code>__eq__</code> 这个函数，其内部的处理通常会复杂一些。比如，对于列表， <code>__eq__</code> 函数会去遍历列表中的元素，比较它们的顺序和值是否相等。</p><p>不过，对于不可变（immutable）的变量，如果我们之前用 <code>&#39;==&#39;</code> 或者 <code>&#39;is&#39;</code> 比较过，结果是不是就一直不变了呢？</p><p>答案自然是否定的。我们来看下面一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>t1 = (1, 2, [3, 4])</span></span>
<span class="line"><span>t2 = (1, 2, [3, 4])</span></span>
<span class="line"><span>t1 == t2</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>t1[-1].append(5)</span></span>
<span class="line"><span>t1 == t2</span></span>
<span class="line"><span>False</span></span></code></pre></div><p>我们知道元组是不可变的，但元组可以嵌套，它里面的元素可以是列表类型，列表是可变的，所以如果我们修改了元组中的某个可变元素，那么元组本身也就改变了，之前用 <code>&#39;is&#39;</code> 或者 <code>&#39;==&#39;</code> 操作符取得的结果，可能就不适用了。</p><p>这一点，你在日常写程序时一定要注意，在必要的地方请不要省略条件检查。</p><h2 id="浅拷贝和深度拷贝" tabindex="-1">浅拷贝和深度拷贝 <a class="header-anchor" href="#浅拷贝和深度拷贝" aria-label="Permalink to &quot;浅拷贝和深度拷贝&quot;">​</a></h2><p>接下来，我们一起来看看Python中的浅拷贝（shallow copy）和深度拷贝（deep copy）。</p><p>对于这两个熟悉的操作，我并不想一上来先抛概念让你死记硬背来区分，我们不妨先从它们的操作方法说起，通过代码来理解两者的不同。</p><p>先来看浅拷贝。常见的浅拷贝的方法，是使用数据类型本身的构造器，比如下面两个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l1 = [1, 2, 3]</span></span>
<span class="line"><span>l2 = list(l1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l2</span></span>
<span class="line"><span>[1, 2, 3]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1 == l2</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1 is l2</span></span>
<span class="line"><span>False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s1 = set([1, 2, 3])</span></span>
<span class="line"><span>s2 = set(s1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s2</span></span>
<span class="line"><span>{1, 2, 3}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s1 == s2</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s1 is s2</span></span>
<span class="line"><span>False</span></span></code></pre></div><p>这里，l2就是l1的浅拷贝，s2是s1的浅拷贝。当然，对于可变的序列，我们还可以通过切片操作符 <code>&#39;:&#39;</code> 完成浅拷贝，比如下面这个列表的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l1 = [1, 2, 3]</span></span>
<span class="line"><span>l2 = l1[:]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1 == l2</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1 is l2</span></span>
<span class="line"><span>False</span></span></code></pre></div><p>当然，Python中也提供了相对应的函数copy.copy()，适用于任何数据类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import copy</span></span>
<span class="line"><span>l1 = [1, 2, 3]</span></span>
<span class="line"><span>l2 = copy.copy(l1)</span></span></code></pre></div><p>不过，需要注意的是，对于元组，使用tuple()或者切片操作符 <code>&#39;:&#39;</code> 不会创建一份浅拷贝，相反，它会返回一个指向相同元组的引用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>t1 = (1, 2, 3)</span></span>
<span class="line"><span>t2 = tuple(t1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>t1 == t2</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>t1 is t2</span></span>
<span class="line"><span>True</span></span></code></pre></div><p>这里，元组(1, 2, 3)只被创建一次，t1和t2同时指向这个元组。</p><p>到这里，对于浅拷贝你应该很清楚了。浅拷贝，是指重新分配一块内存，创建一个新的对象，里面的元素是原对象中子对象的引用。因此，如果原对象中的元素不可变，那倒无所谓；但如果元素可变，浅拷贝通常会带来一些副作用，尤其需要注意。我们来看下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l1 = [[1, 2], (30, 40)]</span></span>
<span class="line"><span>l2 = list(l1)</span></span>
<span class="line"><span>l1.append(100)</span></span>
<span class="line"><span>l1[0].append(3)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1</span></span>
<span class="line"><span>[[1, 2, 3], (30, 40), 100]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l2</span></span>
<span class="line"><span>[[1, 2, 3], (30, 40)]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1[1] += (50, 60)</span></span>
<span class="line"><span>l1</span></span>
<span class="line"><span>[[1, 2, 3], (30, 40, 50, 60), 100]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l2</span></span>
<span class="line"><span>[[1, 2, 3], (30, 40)]</span></span></code></pre></div><p>这个例子中，我们首先初始化了一个列表l1，里面的元素是一个列表和一个元组；然后对l1执行浅拷贝，赋予l2。因为浅拷贝里的元素是对原对象元素的引用，因此l2中的元素和l1指向同一个列表和元组对象。</p><p>接着往下看。 <code>l1.append(100)</code>，表示对l1的列表新增元素100。这个操作不会对l2产生任何影响，因为l2和l1作为整体是两个不同的对象，并不共享内存地址。操作过后l2不变，l1会发生改变：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[[1, 2, 3], (30, 40), 100]</span></span></code></pre></div><p>再来看， <code>l1[0].append(3)</code>，这里表示对l1中的第一个列表新增元素3。因为l2是l1的浅拷贝，l2中的第一个元素和l1中的第一个元素，共同指向同一个列表，因此l2中的第一个列表也会相对应的新增元素3。操作后l1和l2都会改变：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l1: [[1, 2, 3], (30, 40), 100]</span></span>
<span class="line"><span>l2: [[1, 2, 3], (30, 40)]</span></span></code></pre></div><p>最后是 <code>l1[1] += (50, 60)</code>，因为元组是不可变的，这里表示对l1中的第二个元组拼接，然后重新创建了一个新元组作为l1中的第二个元素，而l2中没有引用新元组，因此l2并不受影响。操作后l2不变，l1发生改变：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l1: [[1, 2, 3], (30, 40, 50, 60), 100]</span></span></code></pre></div><p>通过这个例子，你可以很清楚地看到使用浅拷贝可能带来的副作用。因此，如果我们想避免这种副作用，完整地拷贝一个对象，你就得使用深度拷贝。</p><p>所谓深度拷贝，是指重新分配一块内存，创建一个新的对象，并且将原对象中的元素，以递归的方式，通过创建新的子对象拷贝到新对象中。因此，新对象和原对象没有任何关联。</p><p>Python中以copy.deepcopy()来实现对象的深度拷贝。比如上述例子写成下面的形式，就是深度拷贝：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import copy</span></span>
<span class="line"><span>l1 = [[1, 2], (30, 40)]</span></span>
<span class="line"><span>l2 = copy.deepcopy(l1)</span></span>
<span class="line"><span>l1.append(100)</span></span>
<span class="line"><span>l1[0].append(3)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l1</span></span>
<span class="line"><span>[[1, 2, 3], (30, 40), 100]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l2</span></span>
<span class="line"><span>[[1, 2], (30, 40)]</span></span></code></pre></div><p>我们可以看到，无论l1如何变化，l2都不变。因为此时的l1和l2完全独立，没有任何联系。</p><p>不过，深度拷贝也不是完美的，往往也会带来一系列问题。如果被拷贝对象中存在指向自身的引用，那么程序很容易陷入无限循环：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import copy</span></span>
<span class="line"><span>x = [1]</span></span>
<span class="line"><span>x.append(x)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>x</span></span>
<span class="line"><span>[1, [...]]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>y = copy.deepcopy(x)</span></span>
<span class="line"><span>y</span></span>
<span class="line"><span>[1, [...]]</span></span></code></pre></div><p>上面这个例子，列表x中有指向自身的引用，因此x是一个无限嵌套的列表。但是我们发现深度拷贝x到y后，程序并没有出现stack overflow的现象。这是为什么呢？</p><p>其实，这是因为深度拷贝函数deepcopy中会维护一个字典，记录已经拷贝的对象与其ID。拷贝过程中，如果字典里已经存储了将要拷贝的对象，则会从字典直接返回，我们来看相对应的源码就能明白：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def deepcopy(x, memo=None, _nil=[]):</span></span>
<span class="line"><span>    &quot;&quot;&quot;Deep copy operation on arbitrary Python objects.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	See the module&#39;s __doc__ string for more info.</span></span>
<span class="line"><span>	&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if memo is None:</span></span>
<span class="line"><span>        memo = {}</span></span>
<span class="line"><span>    d = id(x) # 查询被拷贝对象x的id</span></span>
<span class="line"><span>	y = memo.get(d, _nil) # 查询字典里是否已经存储了该对象</span></span>
<span class="line"><span>	if y is not _nil:</span></span>
<span class="line"><span>	    return y # 如果字典里已经存储了将要拷贝的对象，则直接返回</span></span>
<span class="line"><span>        ...</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天这节课，我们一起学习了Python中对象的比较和拷贝，主要有下面几个重点内容。</p><ul><li>比较操作符 <code>&#39;==&#39;</code> 表示比较对象间的值是否相等，而 <code>&#39;is&#39;</code> 表示比较对象的标识是否相等，即它们是否指向同一个内存地址。</li><li>比较操作符 <code>&#39;is&#39;</code> 效率优于 <code>&#39;==&#39;</code>，因为 <code>&#39;is&#39;</code> 操作符无法被重载，执行 <code>&#39;is&#39;</code> 操作只是简单的获取对象的ID，并进行比较；而 <code>&#39;==&#39;</code> 操作符则会递归地遍历对象的所有值，并逐一比较。</li><li>浅拷贝中的元素，是原对象中子对象的引用，因此，如果原对象中的元素是可变的，改变其也会影响拷贝后的对象，存在一定的副作用。</li><li>深度拷贝则会递归地拷贝原对象中的每一个子对象，因此拷贝后的对象和原对象互不相关。另外，深度拷贝中会维护一个字典，记录已经拷贝的对象及其ID，来提高效率并防止无限递归的发生。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我为你留下一道思考题。这节课我曾用深度拷贝，拷贝过一个无限嵌套的列表。那么。当我们用等于操作符 <code>&#39;==&#39;</code> 进行比较时，输出会是什么呢？是True或者False还是其他？为什么呢？建议你先自己动脑想一想，然后再实际跑一下代码，来检验你的猜想。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import copy</span></span>
<span class="line"><span>x = [1]</span></span>
<span class="line"><span>x.append(x)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>y = copy.deepcopy(x)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 以下命令的输出是？</span></span>
<span class="line"><span>x == y</span></span></code></pre></div><p>欢迎在留言区写下你的答案和学习感想，也欢迎你把这篇文章分享给你的同事、朋友。我们一起交流，一起进步。</p>`,68)])])}const r=a(l,[["render",i]]);export{b as __pageData,r as default};
