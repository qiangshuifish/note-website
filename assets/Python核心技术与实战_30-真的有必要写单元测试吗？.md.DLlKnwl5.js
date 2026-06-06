import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"30 | 真的有必要写单元测试吗？","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是单元测试？","slug":"什么是单元测试","link":"#什么是单元测试","children":[]},{"level":2,"title":"单元测试的几个技巧","slug":"单元测试的几个技巧","link":"#单元测试的几个技巧","children":[{"level":3,"title":"mock","slug":"mock","link":"#mock","children":[]},{"level":3,"title":"Mock Side Effect","slug":"mock-side-effect","link":"#mock-side-effect","children":[]},{"level":3,"title":"patch","slug":"patch","link":"#patch","children":[]}]},{"level":2,"title":"高质量单元测试的关键","slug":"高质量单元测试的关键","link":"#高质量单元测试的关键","children":[{"level":3,"title":"Test Coverage","slug":"test-coverage","link":"#test-coverage","children":[]},{"level":3,"title":"模块化","slug":"模块化","link":"#模块化","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/30-真的有必要写单元测试吗？.md","filePath":"Python核心技术与实战/30-真的有必要写单元测试吗？.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/30-真的有必要写单元测试吗？.md"};function t(i,s,c,r,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_30-真的有必要写单元测试吗" tabindex="-1">30 | 真的有必要写单元测试吗？ <a class="header-anchor" href="#_30-真的有必要写单元测试吗" aria-label="Permalink to &quot;30 | 真的有必要写单元测试吗？&quot;">​</a></h1><p>你好，我是景霄。</p><p>说到unit test（即单元测试，下文统一用中文称呼），大部分人的反应估计有这么两种：要么就是，单元测试啊，挺简单的呀，做不做无所谓吧；要么就是，哎呀，项目进度太赶，单元测试拖一拖之后再来吧。</p><p>显然，这两种人，都没有正确认识到单元测试的价值，也没能掌握正确的单元测试方法。你是不是觉得自己只要了解Python的各个feature，能够编写出符合规定功能的程序就可以了呢？</p><p>其实不然，完成产品的功能需求只是很基础的一部分，如何保证所写代码的稳定、高效、无误，才是我们工作的关键。而学会合理地使用单元测试，正是帮助你实现这一目标的重要路径。</p><p>我们总说，测试驱动开发（TDD）。今天我就以Python为例，教你设计编写Python的单元测试代码，带你熟悉并掌握这一重要技能。</p><h2 id="什么是单元测试" tabindex="-1">什么是单元测试？ <a class="header-anchor" href="#什么是单元测试" aria-label="Permalink to &quot;什么是单元测试？&quot;">​</a></h2><p>单元测试，通俗易懂地讲，就是编写测试来验证某一个模块的功能正确性，一般会指定输入，验证输出是否符合预期。</p><p>实际生产环境中，我们会对每一个模块的所有可能输入值进行测试。这样虽然显得繁琐，增加了额外的工作量，但是能够大大提高代码质量，减小bug发生的可能性，也更方便系统的维护。</p><p>说起单元测试，就不得不提 <a href="https://docs.python.org/3/library/unittest.html" target="_blank" rel="noreferrer">Python unittest库</a>，它提供了我们需要的大多数工具。我们来看下面这个简单的测试，从代码中了解其使用方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import unittest</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将要被测试的排序函数</span></span>
<span class="line"><span>def sort(arr):</span></span>
<span class="line"><span>    l = len(arr)</span></span>
<span class="line"><span>    for i in range(0, l):</span></span>
<span class="line"><span>        for j in range(i + 1, l):</span></span>
<span class="line"><span>            if arr[i] &amp;gt;= arr[j]:</span></span>
<span class="line"><span>                tmp = arr[i]</span></span>
<span class="line"><span>                arr[i] = arr[j]</span></span>
<span class="line"><span>                arr[j] = tmp</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 编写子类继承unittest.TestCase</span></span>
<span class="line"><span>class TestSort(unittest.TestCase):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   # 以test开头的函数将会被测试</span></span>
<span class="line"><span>   def test_sort(self):</span></span>
<span class="line"><span>        arr = [3, 4, 1, 5, 6]</span></span>
<span class="line"><span>        sort(arr)</span></span>
<span class="line"><span>        # assert 结果跟我们期待的一样</span></span>
<span class="line"><span>        self.assertEqual(arr, [1, 3, 4, 5, 6])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    ## 如果在Jupyter下，请用如下方式运行单元测试</span></span>
<span class="line"><span>    unittest.main(argv=[&#39;first-arg-is-ignored&#39;], exit=False)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ## 如果是命令行下运行，则：</span></span>
<span class="line"><span>    ## unittest.main()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 输出</span></span>
<span class="line"><span>..</span></span>
<span class="line"><span>----------------------------------------------------------------------</span></span>
<span class="line"><span>Ran 2 tests in 0.002s</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OK</span></span></code></pre></div><p>这里，我们创建了一个排序函数的单元测试，来验证排序函数的功能是否正确。代码里我做了非常详细的注释，相信你能够大致读懂，我再来介绍一些细节。</p><p>首先，我们需要创建一个类 <code>TestSort</code>，继承类 <code>‘unittest.TestCase’</code>；然后，在这个类中定义相应的测试函数test_sort()，进行测试。注意，测试函数要以 <code>‘test’</code> 开头，而测试函数的内部，通常使用assertEqual()、assertTrue()、assertFalse()和assertRaise()等assert语句对结果进行验证。</p><p>最后运行时，如果你是在IPython或者Jupyter环境下，请使用下面这行代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unittest.main(argv=[&#39;first-arg-is-ignored&#39;], exit=False)</span></span></code></pre></div><p>而如果你用的是命令行，直接使用unittest.main()就可以了。你可以看到，运行结果输出 <code>’OK‘</code>，这就表示我们的测试通过了。</p><p>当然，这个例子中的被测函数相对简单一些，所以写起对应的单元测试来也非常自然，并不需要很多单元测试的技巧。但实战中的函数往往还是比较复杂的，遇到复杂问题，高手和新手的最大差别，便是单元测试技巧的使用。</p><h2 id="单元测试的几个技巧" tabindex="-1">单元测试的几个技巧 <a class="header-anchor" href="#单元测试的几个技巧" aria-label="Permalink to &quot;单元测试的几个技巧&quot;">​</a></h2><p>接下来，我将会介绍Python单元测试的几个技巧，分别是mock、side_effect和patch。这三者用法不一样，但都是一个核心思想，即 <strong>用虚假的实现，来替换掉被测试函数的一些依赖项，让我们能把更多的精力放在需要被测试的功能上。</strong></p><h3 id="mock" tabindex="-1">mock <a class="header-anchor" href="#mock" aria-label="Permalink to &quot;mock&quot;">​</a></h3><p>mock是单元测试中最核心重要的一环。mock的意思，便是通过一个虚假对象，来代替被测试函数或模块需要的对象。</p><p>举个例子，比如你要测一个后端API逻辑的功能性，但一般后端API都依赖于数据库、文件系统、网络等。这样，你就需要通过mock，来创建一些虚假的数据库层、文件系统层、网络层对象，以便可以简单地对核心后端逻辑单元进行测试。</p><p>Python mock则主要使用mock或者MagicMock对象，这里我也举了一个代码示例。这个例子看上去比较简单，但是里面的思想很重要。下面我们一起来看下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import unittest</span></span>
<span class="line"><span>from unittest.mock import MagicMock</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class A(unittest.TestCase):</span></span>
<span class="line"><span>    def m1(self):</span></span>
<span class="line"><span>        val = self.m2()</span></span>
<span class="line"><span>        self.m3(val)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def m2(self):</span></span>
<span class="line"><span>        pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def m3(self, val):</span></span>
<span class="line"><span>        pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def test_m1(self):</span></span>
<span class="line"><span>        a = A()</span></span>
<span class="line"><span>        a.m2 = MagicMock(return_value=&quot;custom_val&quot;)</span></span>
<span class="line"><span>        a.m3 = MagicMock()</span></span>
<span class="line"><span>        a.m1()</span></span>
<span class="line"><span>        self.assertTrue(a.m2.called) #验证m2被call过</span></span>
<span class="line"><span>        a.m3.assert_called_with(&quot;custom_val&quot;) #验证m3被指定参数call过</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    unittest.main(argv=[&#39;first-arg-is-ignored&#39;], exit=False)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 输出</span></span>
<span class="line"><span>..</span></span>
<span class="line"><span>----------------------------------------------------------------------</span></span>
<span class="line"><span>Ran 2 tests in 0.002s</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OK</span></span></code></pre></div><p>这段代码中，我们定义了一个类的三个方法m1()、m2()、m3()。我们需要对m1()进行单元测试，但是m1()取决于m2()和m3()。如果m2()和m3()的内部比较复杂, 你就不能只是简单地调用m1()函数来进行测试，可能需要解决很多依赖项的问题。</p><p>这一听就让人头大了吧？但是，有了mock其实就很好办了。我们可以把m2()替换为一个返回具体数值的value，把m3()替换为另一个mock（空函数）。这样，测试m1()就很容易了，我们可以测试m1()调用m2()，并且用m2()的返回值调用m3()。</p><p>可能你会疑惑，这样测试m1()不是基本上毫无意义吗？看起来只是象征性地测了一下逻辑呀？</p><p>其实不然，真正工业化的代码，都是很多层模块相互逻辑调用的一个树形结构。单元测试需要测的是某个节点的逻辑功能，mock掉相关的依赖项是非常重要的。这也是为什么会被叫做单元测试unit test，而不是其他的integration test、end to end test这类。</p><h3 id="mock-side-effect" tabindex="-1">Mock Side Effect <a class="header-anchor" href="#mock-side-effect" aria-label="Permalink to &quot;Mock Side Effect&quot;">​</a></h3><p>第二个我们来看Mock Side Effect，这个概念很好理解，就是 mock的函数，属性是可以根据不同的输入，返回不同的数值，而不只是一个return_value。</p><p>比如下面这个示例，例子很简单，测试的是输入参数是否为负数，输入小于0则输出为1 ，否则输出为2。代码很简短，你一定可以看懂，这便是Mock Side Effect的用法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from unittest.mock import MagicMock</span></span>
<span class="line"><span>def side_effect(arg):</span></span>
<span class="line"><span>    if arg &amp;lt; 0:</span></span>
<span class="line"><span>        return 1</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        return 2</span></span>
<span class="line"><span>mock = MagicMock()</span></span>
<span class="line"><span>mock.side_effect = side_effect</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mock(-1)</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mock(1)</span></span>
<span class="line"><span>2</span></span></code></pre></div><h3 id="patch" tabindex="-1">patch <a class="header-anchor" href="#patch" aria-label="Permalink to &quot;patch&quot;">​</a></h3><p>至于patch，给开发者提供了非常便利的函数mock方法。它可以应用Python的decoration模式或是context manager概念，快速自然地mock所需的函数。它的用法也不难，我们来看代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from unittest.mock import patch</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;patch(&#39;sort&#39;)</span></span>
<span class="line"><span>def test_sort(self, mock_sort):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>在这个test里面，mock_sort 替代sort函数本身的存在，所以，我们可以像开始提到的mock object一样，设置return_value和side_effect。</p><p>另一种patch的常见用法，是mock类的成员函数，这个技巧我们在工作中也经常会用到，比如说一个类的构造函数非常复杂，而测试其中一个成员函数并不依赖所有初始化的object。它的用法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>with patch.object(A, &#39;__init__&#39;, lambda x: None):</span></span>
<span class="line"><span>      …</span></span></code></pre></div><p>代码应该也比较好懂。在with语句里面，我们通过patch，将A类的构造函数mock为一个do nothing的函数，这样就可以很方便地避免一些复杂的初始化（initialization）。</p><p>其实，综合前面讲的这几点来看，你应该感受到了，单元测试的核心还是mock，mock掉依赖项，测试相应的逻辑或算法的准确性。在我看来，虽然Python unittest库还有很多层出不穷的方法，但只要你能掌握了MagicMock和patch，编写绝大部分工作场景的单元测试就不成问题了。</p><h2 id="高质量单元测试的关键" tabindex="-1">高质量单元测试的关键 <a class="header-anchor" href="#高质量单元测试的关键" aria-label="Permalink to &quot;高质量单元测试的关键&quot;">​</a></h2><p>这节课的最后，我想谈一谈高质量的单元测试。我很理解，单元测试这个东西，哪怕是正在使用的人也是“百般讨厌”的，不少人很多时候只是敷衍了事。我也嫌麻烦，但从来不敢松懈，因为在大公司里，如果你写一个很重要的模块功能，不写单元测试是无法通过code review的。</p><p>低质量的单元测试，可能真的就是摆设，根本不能帮我们验证代码的正确性，还浪费时间。那么，既然要做单元测试，与其浪费时间糊弄自己，不如追求高质量的单元测试，切实提高代码品质。</p><p>那该怎么做呢？结合工作经验，我认为一个高质量的单元测试，应该特别关注下面两点。</p><h3 id="test-coverage" tabindex="-1">Test Coverage <a class="header-anchor" href="#test-coverage" aria-label="Permalink to &quot;Test Coverage&quot;">​</a></h3><p>首先我们要关注Test Coverage，它是衡量代码中语句被cover的百分比。可以说，提高代码模块的Test Coverage，基本等同于提高代码的正确性。</p><p>为什么呢？</p><p>要知道，大多数公司代码库的模块都非常复杂。尽管它们遵从模块化设计的理念，但因为有复杂的业务逻辑在，还是会产生逻辑越来越复杂的模块。所以，编写高质量的单元测试，需要我们cover模块的每条语句，提高Test Coverage。</p><p>我们可以用Python的coverage tool 来衡量Test Coverage，并且显示每个模块为被coverage的语句。如果你想了解更多更详细的使用，可以点击这个链接来学习： <a href="https://coverage.readthedocs.io/en/v4.5.x/" target="_blank" rel="noreferrer">https://coverage.readthedocs.io/en/v4.5.x/</a> 。</p><h3 id="模块化" tabindex="-1">模块化 <a class="header-anchor" href="#模块化" aria-label="Permalink to &quot;模块化&quot;">​</a></h3><p>高质量单元测试，不仅要求我们提高Test Coverage，尽量让所写的测试能够cover每个模块中的每条语句；还要求我们从测试的角度审视codebase，去思考怎么模块化代码，以便写出高质量的单元测试。</p><p>光讲这段话可能有些抽象，我们来看这样的场景。比如，我写了一个下面这个函数，对一个数组进行处理，并返回新的数组：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def work(arr):</span></span>
<span class="line"><span>    # pre process</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    # sort</span></span>
<span class="line"><span>    l = len(arr)</span></span>
<span class="line"><span>    for i in range(0, l):</span></span>
<span class="line"><span>        for j in range(i + 1, j):</span></span>
<span class="line"><span>            if arr[i] &amp;gt;= arr[j]:</span></span>
<span class="line"><span>                tmp = arr[i]</span></span>
<span class="line"><span>                arr[i] = arr[j]</span></span>
<span class="line"><span>                arr[j] = tmp</span></span>
<span class="line"><span>    # post process</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    Return arr</span></span></code></pre></div><p>这段代码的大概意思是，先有个预处理，再排序，最后再处理一下然后返回。如果现在要求你，给这个函数写个单元测试，你是不是会一筹莫展呢？</p><p>毕竟，这个函数确实有点儿复杂，以至于你都不知道应该是怎样的输入，并要期望怎样的输出。这种代码写单元测试是非常痛苦的，更别谈cover每条语句的要求了。</p><p>所以，正确的测试方法，应该是先模块化代码，写成下面的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def preprocess(arr):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return arr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def sort(arr):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return arr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def postprocess(arr):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return arr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def work(self):</span></span>
<span class="line"><span>    arr = preprocess(arr)</span></span>
<span class="line"><span>    arr = sort(arr)</span></span>
<span class="line"><span>    arr = postprocess(arr)</span></span>
<span class="line"><span>    return arr</span></span></code></pre></div><p>接着再进行相应的测试，测试三个子函数的功能正确性；然后通过mock子函数，调用work()函数，来验证三个子函数被call过。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from unittest.mock import patch</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_preprocess(self):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_sort(self):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_postprocess(self):</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;patch(&#39;%s.preprocess&#39;)</span></span>
<span class="line"><span>&amp;#64;patch(&#39;%s.sort&#39;)</span></span>
<span class="line"><span>&amp;#64;patch(&#39;%s.postprocess&#39;)</span></span>
<span class="line"><span>def test_work(self,mock_post_process, mock_sort, mock_preprocess):</span></span>
<span class="line"><span>    work()</span></span>
<span class="line"><span>    self.assertTrue(mock_post_process.called)</span></span>
<span class="line"><span>    self.assertTrue(mock_sort.called)</span></span>
<span class="line"><span>    self.assertTrue(mock_preprocess.called)</span></span></code></pre></div><p>你看，这样一来，通过重构代码就可以使单元测试更加全面、精确，并且让整体架构、函数设计都美观了不少。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>回顾下这节课，整体来看，单元测试的理念是先模块化代码设计，然后针对每个作用单元，编写单独的测试去验证其准确性。更好的模块化设计和更多的Test Coverage，是提高代码质量的核心。而单元测试的本质就是通过mock，去除掉不影响测试的依赖项，把重点放在需要测试的代码核心逻辑上。</p><p>讲了这么多，还是想告诉你，单元测试是个非常非常重要的技能，在实际工作中是保证代码质量和准确性必不可少的一环。同时，单元测试的设计技能，不只是适用于Python，而是适用于任何语言。所以，单元测试必不可少。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>那么，你在平时的学习工作中，曾经写过单元测试吗？在编写单元测试时，用到过哪些技巧或者遇到过哪些问题吗？欢迎留言与我交流，也欢迎你把这篇文章分享出去。</p>`,65)])])}const u=a(l,[["render",t]]);export{m as __pageData,u as default};
