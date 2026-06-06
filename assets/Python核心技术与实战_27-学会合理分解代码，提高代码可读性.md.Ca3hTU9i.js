import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"27 | 学会合理分解代码，提高代码可读性","description":"","frontmatter":{},"headers":[{"level":2,"title":"PEP 8 规范","slug":"pep-8-规范","link":"#pep-8-规范","children":[{"level":3,"title":"缩进规范","slug":"缩进规范","link":"#缩进规范","children":[]},{"level":3,"title":"空行规范","slug":"空行规范","link":"#空行规范","children":[]},{"level":3,"title":"空格规范","slug":"空格规范","link":"#空格规范","children":[]},{"level":3,"title":"换行规范","slug":"换行规范","link":"#换行规范","children":[]},{"level":3,"title":"文档规范","slug":"文档规范","link":"#文档规范","children":[]},{"level":3,"title":"注释规范","slug":"注释规范","link":"#注释规范","children":[]},{"level":3,"title":"文档描述","slug":"文档描述","link":"#文档描述","children":[]},{"level":3,"title":"命名规范","slug":"命名规范","link":"#命名规范","children":[]}]},{"level":2,"title":"代码分解技巧","slug":"代码分解技巧","link":"#代码分解技巧","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/27-学会合理分解代码，提高代码可读性.md","filePath":"Python核心技术与实战/27-学会合理分解代码，提高代码可读性.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/27-学会合理分解代码，提高代码可读性.md"};function i(t,s,c,o,r,h){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_27-学会合理分解代码-提高代码可读性" tabindex="-1">27 | 学会合理分解代码，提高代码可读性 <a class="header-anchor" href="#_27-学会合理分解代码-提高代码可读性" aria-label="Permalink to &quot;27 | 学会合理分解代码，提高代码可读性&quot;">​</a></h1><p>你好，我是景霄。今天我们不讲任何技术知识点，继续来一起聊聊代码哲学。</p><p>有句话说得好，好的代码本身就是一份文档。同样功能的一份程序，一个组件，一套系统，让不同的人来写，写出来的代码却是千差万别。</p><p>有些人的设计风格和代码风格犹如热刀切黄油，从顶层到底层的代码看下来酣畅淋漓，注释详尽而又精简；深入到细节代码，无需注释也能理解清清楚楚。</p><p>而有些人，代码勉勉强强能跑起来，遇到稍微复杂的情况可能就会出 bug；深入到代码中 debug，则发现处处都是魔术数、函数堆在一起。一个文件上千行，设计模式又是混淆不堪，让人实在很难阅读，更别提修改和迭代开发。</p><p>Guido van Rossum（吉多·范罗苏姆，Python创始人 ）说过，代码的阅读频率远高于编写代码的频率。毕竟，即使是在编写代码的时候，你也需要对代码进行反复阅读和调试，来确认代码能够按照期望运行。</p><p>话不多说，进入正题。</p><h2 id="pep-8-规范" tabindex="-1">PEP 8 规范 <a class="header-anchor" href="#pep-8-规范" aria-label="Permalink to &quot;PEP 8 规范&quot;">​</a></h2><p>上节课我们简单提起过 PEP 8 ，今天我们继续来详细解读。</p><p>PEP是 Python Enhancement Proposal 的缩写，翻译过来叫“Python 增强规范”。正如我们写文章，会有句式、标点、段落格式、开头缩进等标准的规范一样，Python 书写自然也有一套较为官方的规范。PEP 8 就是这样一种规范，它存在的意义，就是让 Python 更易阅读，换句话，增强代码可读性。</p><p>事实上，Pycharm 已经内置了 PEP 8 规范检测器，它会自动对编码不规范的地方进行检查，然后指出错误，并推荐修改方式。下面这张图就是其界面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/104689/23f0288a5ba4388f69e5a1c3a59eb55f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/104689/23f0288a5ba4388f69e5a1c3a59eb55f.png" alt=""></a></p><p>因此，在学习今天的内容时，我推荐你使用 Pycharm IDE 进行代码检查，看一下自己的代码格式哪里有问题。尤其对于初学者，从某些程度来说，代码规范甚至是比代码准确更重要的事情，因为实际工作中，代码可读性的重要性一定比你想象的多得多。</p><h3 id="缩进规范" tabindex="-1">缩进规范 <a class="header-anchor" href="#缩进规范" aria-label="Permalink to &quot;缩进规范&quot;">​</a></h3><p>首先，我们来看代码块内的缩进。</p><p>Python 和 C++ / Java 最大的不同在于，后者完全使用大括号来区分代码块，而前者依靠不同行和不同的缩进来进行分块。有一个很有名的比赛，叫作 <a href="http://www.ioccc.org/years-spoiler.html" target="_blank" rel="noreferrer">C 语言混乱代码大赛</a>，其中有很多非常精彩的作品，你能看到书写的代码排成各种形状，有的是一幅画，或者一个卡通头像，但是能执行出惊人的结果。</p><p>而放到 Python ，显然就不能实现同样的技巧了。不过，以小换大，我们有了“像阅读英语”一样清晰的 Python 代码，也还是可以接受的。</p><p>话说回来，Python 的缩进其实可以写成很多种，Tab、双空格、四空格、空格和 Tab 混合等。而PEP 8 规范告诉我们， <strong>请选择四个空格的缩进，不要使用 Tab，更不要 Tab 和空格混着用。</strong></p><p>第二个要注意的是， <strong>每行最大长度请限制在 79 个字符。</strong></p><p>这个原则主要有两个优点，第一个优点比较好理解。很多工程师在编程的时候，习惯一个屏幕并列竖排展示多个源代码。如果某个源代码的某些行过长，你就需要拖动横向滚动条来阅读，或者需要软回车将本行内容放入下一行，这就极大地影响了编码和阅读效率。</p><p>至于第二个优点，需要有一定经验的编程经验后更容易理解：因为当代码的嵌套层数过高，比如超过三层之后，一行的内容就很容易超过 79 个字符了。所以，这条规定另一方面也在制约着程序员，不要写迭代过深的代码，而是要思考继续把代码分解成其他函数或逻辑块，来优化自己的代码结构。</p><h3 id="空行规范" tabindex="-1">空行规范 <a class="header-anchor" href="#空行规范" aria-label="Permalink to &quot;空行规范&quot;">​</a></h3><p>接着我们来看代码块之间的空行。</p><p>我们知道，Python 中的空行对 Python 解释器的执行没有影响，但对阅读体验有很深刻的影响。</p><p>PEP 8 规定， <strong>全局的类和函数的上方需要空两个空行，而类的函数之间需要空一个空行</strong>。当然，函数内部也可以使用空行，和英语的段落一样，用来区分不同意群之间的代码块。但是记住最多空一行，千万不要滥用。</p><p>另外，Python 本身允许把多行合并为一行，使用分号隔开，但这是 PEP 8 不推荐的做法。所以，即使是使用控制语句 if / while / for，你的执行语句哪怕只有一行命令，也请另起一行，这样可以更大程度提升阅读效率。</p><p>至于代码的尾部，每个代码文件的最后一行为空行，并且只有这一个空行。</p><h3 id="空格规范" tabindex="-1">空格规范 <a class="header-anchor" href="#空格规范" aria-label="Permalink to &quot;空格规范&quot;">​</a></h3><p>我们再来看一下，代码块中，每行语句中空格的使用。</p><p>函数的参数列表中，调用函数的参数列表中会出现逗号，请注意逗号后要跟一个空格，这是英语的使用习惯，也能让每个参数独立阅读，更清晰。</p><p>同理，冒号经常被用来初始化字典，冒号后面也要跟一个空格。</p><p>另外，Python 中我们可以使用 <code>#</code> 进行单独注释，请记得要在 <code>#</code> 后、注释前加一个空格。</p><p>对于操作符，例如 <code>+</code>， <code>-</code>， <code>*</code>， <code>/</code>， <code>&amp;</code>， <code>|</code>， <code>=</code>， <code>==</code>， <code>!=</code>，请在两边都保留空格。不过与此对应，括号内的两端并不需要空格。</p><h3 id="换行规范" tabindex="-1">换行规范 <a class="header-anchor" href="#换行规范" aria-label="Permalink to &quot;换行规范&quot;">​</a></h3><p>现在再回到缩进规范，注意我们提到的第二点，控制每行的最大长度不超过 79 个字符，但是有时候，函数调用逻辑过长而不得不超过这个数字时，该怎么办呢？</p><p>请看下面这段代码，建议你先自己阅读并总结其特点：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def solve1(this_is_the_first_parameter, this_is_the_second_parameter, this_is_the_third_parameter,</span></span>
<span class="line"><span>           this_is_the_forth_parameter, this_is_the_fifth_parameter, this_is_the_sixth_parameter):</span></span>
<span class="line"><span>    return (this_is_the_first_parameter + this_is_the_second_parameter + this_is_the_third_parameter +</span></span>
<span class="line"><span>            this_is_the_forth_parameter + this_is_the_fifth_parameter + this_is_the_sixth_parameter)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def solve2(this_is_the_first_parameter, this_is_the_second_parameter, this_is_the_third_parameter,</span></span>
<span class="line"><span>           this_is_the_forth_parameter, this_is_the_fifth_parameter, this_is_the_sixth_parameter):</span></span>
<span class="line"><span>    return this_is_the_first_parameter + this_is_the_second_parameter + this_is_the_third_parameter + \\</span></span>
<span class="line"><span>           this_is_the_forth_parameter + this_is_the_fifth_parameter + this_is_the_sixth_parameter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>(top_secret_func(param1=12345678, param2=12345678, param3=12345678, param4=12345678, param5=12345678).check()</span></span>
<span class="line"><span>    .launch_nuclear_missile().wait())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>top_secret_func(param1=12345678, param2=12345678, param3=12345678, param4=12345678, param5=12345678).check() \\</span></span>
<span class="line"><span>    .launch_nuclear_missile().wait()</span></span></code></pre></div><p>事实上，这里有两种经典做法。</p><p>第一种，通过括号来将过长的运算进行封装，此时虽然跨行，但是仍处于一个逻辑引用之下。solve1 函数的参数过多，直接换行，不过请注意，要考虑第二行参数和第一行第一个参数对齐，这样可以让函数变得非常美观的同时，更易于阅读。当然，函数调用也可以使用类似的方式，只需要用一对括号将其包裹起来。</p><p>第二种，则是通过换行符来实现。这个方法更为直接，你可以从 solve2 和第二个函数调用看出来。</p><p>关于代码细节方面的规范，我主要强调这四个方面。习惯不是一天养成的，但一定需要你特别留心和刻意练习。我能做的，便是告诉你这些需要留心的地方，并带你感受实际项目的代码风格。</p><p>下面的代码选自开源库 Google TensorFlow Keras，为了更加直观突出重点，我删去了注释和大部分代码，你意会即可。我希望，通过阅读这段代码，你能更真实地了解到，前沿的项目是怎么在增强阅读性上下功夫的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Model(network.Network):</span></span>
<span class="line"><span>    def fit(self,</span></span>
<span class="line"><span>            x=None,</span></span>
<span class="line"><span>            y=None,</span></span>
<span class="line"><span>            batch_size=None,</span></span>
<span class="line"><span>            epochs=1,</span></span>
<span class="line"><span>            verbose=1,</span></span>
<span class="line"><span>            callbacks=None,</span></span>
<span class="line"><span>            validation_split=0.,</span></span>
<span class="line"><span>            validation_data=None,</span></span>
<span class="line"><span>            shuffle=True,</span></span>
<span class="line"><span>            class_weight=None,</span></span>
<span class="line"><span>            sample_weight=None,</span></span>
<span class="line"><span>            initial_epoch=0,</span></span>
<span class="line"><span>            steps_per_epoch=None,</span></span>
<span class="line"><span>            validation_steps=None,</span></span>
<span class="line"><span>            validation_freq=1,</span></span>
<span class="line"><span>            max_queue_size=10,</span></span>
<span class="line"><span>            workers=1,</span></span>
<span class="line"><span>            use_multiprocessing=False,</span></span>
<span class="line"><span>            **kwargs):</span></span>
<span class="line"><span>        # Legacy support</span></span>
<span class="line"><span>        if &#39;nb_epoch&#39; in kwargs:</span></span>
<span class="line"><span>            logging.warning(</span></span>
<span class="line"><span>                &#39;The \`nb_epoch\` argument in \`fit\` has been renamed \`epochs\`.&#39;)</span></span>
<span class="line"><span>            epochs = kwargs.pop(&#39;nb_epoch&#39;)</span></span>
<span class="line"><span>        if kwargs:</span></span>
<span class="line"><span>            raise TypeError(&#39;Unrecognized keyword arguments: &#39; + str(kwargs))</span></span>
<span class="line"><span>        self._assert_compile_was_called()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        func = self._select_training_loop(x)</span></span>
<span class="line"><span>        return func.fit(</span></span>
<span class="line"><span>            self,</span></span>
<span class="line"><span>            x=x,</span></span>
<span class="line"><span>            y=y,</span></span>
<span class="line"><span>            batch_size=batch_size,</span></span>
<span class="line"><span>            epochs=epochs,</span></span>
<span class="line"><span>            verbose=verbose,</span></span>
<span class="line"><span>            callbacks=callbacks,</span></span>
<span class="line"><span>            validation_split=validation_split,</span></span>
<span class="line"><span>            validation_data=validation_data,</span></span>
<span class="line"><span>            shuffle=shuffle,</span></span>
<span class="line"><span>            class_weight=class_weight,</span></span>
<span class="line"><span>            sample_weight=sample_weight,</span></span>
<span class="line"><span>            initial_epoch=initial_epoch,</span></span>
<span class="line"><span>            steps_per_epoch=steps_per_epoch,</span></span>
<span class="line"><span>            validation_steps=validation_steps,</span></span>
<span class="line"><span>            validation_freq=validation_freq,</span></span>
<span class="line"><span>            max_queue_size=max_queue_size,</span></span>
<span class="line"><span>            workers=workers,</span></span>
<span class="line"><span>            use_multiprocessing=use_multiprocessing)</span></span></code></pre></div><h3 id="文档规范" tabindex="-1">文档规范 <a class="header-anchor" href="#文档规范" aria-label="Permalink to &quot;文档规范&quot;">​</a></h3><p>接下来我们说说文档规范。先来看看最常用的 import 函数。</p><p>首先，所有 import 尽量放在开头，这个没什么说的，毕竟到处 import 会让人很难看清楚文件之间的依赖关系，运行时 import 也可能会导致潜在的效率问题和其他风险。</p><p>其次，不要使用 import 一次导入多个模块。虽然我们可以在一行中 import 多个模块，并用逗号分隔，但请不要这么做。 <code>import time, os</code> 是 PEP 8 不推荐的做法。</p><p>如果你采用 <code>from module import func</code> 这样的语句，请确保 func 在本文件中不会出现命名冲突。不过，你其实可以通过 <code>from module import func as new_func</code> 来进行重命名，从而避免冲突。</p><h3 id="注释规范" tabindex="-1">注释规范 <a class="header-anchor" href="#注释规范" aria-label="Permalink to &quot;注释规范&quot;">​</a></h3><p>有句话这么说：错误的注释，不如没有注释。所以，当你改动代码的时候，一定要注意检查周围的注释是否需要更新。</p><p>对于大的逻辑块，我们可以在最开始相同的缩进处以 <code>#</code> 开始写注释。即使是注释，你也应该把它当成完整的文章来书写。如果英文注释，请注意开头大写及结尾标点，注意避免语法错误和逻辑错误，同时精简要表达的意思。中文注释也是同样的要求。一份优秀的代码，离不开优秀的注释。</p><p>至于行注释，如空格规范中所讲，我们可以在一行后面跟两个空格，然后以 <code>#</code> 开头加入注释。不过，请注意，行注释并不是很推荐的方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># This is an example to demonstrate how to comment.</span></span>
<span class="line"><span># Please note this function must be used carefully.</span></span>
<span class="line"><span>def solve(x):</span></span>
<span class="line"><span>    if x == 1:  # This is only one exception.</span></span>
<span class="line"><span>        return False</span></span>
<span class="line"><span>    return True</span></span></code></pre></div><h3 id="文档描述" tabindex="-1">文档描述 <a class="header-anchor" href="#文档描述" aria-label="Permalink to &quot;文档描述&quot;">​</a></h3><p>再来说说文档描述，我们继续以 TensorFlow 的代码为例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SpatialDropout2D(Dropout):</span></span>
<span class="line"><span>    &quot;&quot;&quot;Spatial 2D version of Dropout.</span></span>
<span class="line"><span>    This version performs the same function as Dropout, however it drops</span></span>
<span class="line"><span>    entire 2D feature maps instead of individual elements. If adjacent pixels</span></span>
<span class="line"><span>    within feature maps are strongly correlated (as is normally the case in</span></span>
<span class="line"><span>    early convolution layers) then regular dropout will not regularize the</span></span>
<span class="line"><span>    activations and will otherwise just result in an effective learning rate</span></span>
<span class="line"><span>    decrease. In this case, SpatialDropout2D will help promote independence</span></span>
<span class="line"><span>    between feature maps and should be used instead.</span></span>
<span class="line"><span>    Arguments:</span></span>
<span class="line"><span>        rate: float between 0 and 1. Fraction of the input units to drop.</span></span>
<span class="line"><span>        data_format: &#39;channels_first&#39; or &#39;channels_last&#39;.</span></span>
<span class="line"><span>            In &#39;channels_first&#39; mode, the channels dimension</span></span>
<span class="line"><span>            (the depth) is at index 1,</span></span>
<span class="line"><span>            in &#39;channels_last&#39; mode is it at index 3.</span></span>
<span class="line"><span>            It defaults to the \`image_data_format\` value found in your</span></span>
<span class="line"><span>            Keras config file at \`~/.keras/keras.json\`.</span></span>
<span class="line"><span>            If you never set it, then it will be &quot;channels_last&quot;.</span></span>
<span class="line"><span>    Input shape:</span></span>
<span class="line"><span>        4D tensor with shape:</span></span>
<span class="line"><span>        \`(samples, channels, rows, cols)\` if data_format=&#39;channels_first&#39;</span></span>
<span class="line"><span>        or 4D tensor with shape:</span></span>
<span class="line"><span>        \`(samples, rows, cols, channels)\` if data_format=&#39;channels_last&#39;.</span></span>
<span class="line"><span>    Output shape:</span></span>
<span class="line"><span>        Same as input</span></span>
<span class="line"><span>    References:</span></span>
<span class="line"><span>        - [Efficient Object Localization Using Convolutional</span></span>
<span class="line"><span>          Networks](https://arxiv.org/abs/1411.4280)</span></span>
<span class="line"><span>  &quot;&quot;&quot;</span></span>
<span class="line"><span>    def __init__(self, rate, data_format=None, **kwargs):</span></span>
<span class="line"><span>        super(SpatialDropout2D, self).__init__(rate, **kwargs)</span></span>
<span class="line"><span>        if data_format is None:</span></span>
<span class="line"><span>            data_format = K.image_data_format()</span></span>
<span class="line"><span>        if data_format not in {&#39;channels_last&#39;, &#39;channels_first&#39;}:</span></span>
<span class="line"><span>            raise ValueError(&#39;data_format must be in &#39;</span></span>
<span class="line"><span>                           &#39;{&quot;channels_last&quot;, &quot;channels_first&quot;}&#39;)</span></span>
<span class="line"><span>        self.data_format = data_format</span></span>
<span class="line"><span>        self.input_spec = InputSpec(ndim=4)</span></span></code></pre></div><p>你应该可以发现，类和函数的注释，为的是让读者快速理解这个函数做了什么，它输入的参数和格式，输出的返回值和格式，以及其他需要注意的地方。</p><p>至于docstring 的写法，它是用三个双引号开始、三个双引号结尾。我们首先用一句话简单说明这个函数做什么，然后跟一段话来详细解释；再往后是参数列表、参数格式、返回值格式。</p><h3 id="命名规范" tabindex="-1">命名规范 <a class="header-anchor" href="#命名规范" aria-label="Permalink to &quot;命名规范&quot;">​</a></h3><p>接下来，我来讲一讲命名。你应该听过这么一句话，“计算机科学的两件难事：缓存失效和命名。”命名对程序员来说，是一个不算省心的事。一个具有误导性的名字，极有可能在项目中埋下潜在的 bug。这里我就不从命名分类方法来给你划分了，我们只讲一些最实用的规范。</p><p>先来看变量命名。变量名请拒绝使用 a b c d 这样毫无意义的单字符，我们应该使用能够代表其意思的变量名。一般来说，变量使用小写，通过下划线串联起来，例如： <code>data_format</code>、 <code>input_spec</code>、 <code>image_data_set</code>。唯一可以使用单字符的地方是迭代，比如 <code>for i in range(n)</code> 这种，为了精简可以使用。如果是类的私有变量，请记得前面增加两个下划线。</p><p>对于常量，最好的做法是全部大写，并通过下划线连接，例如： <code>WAIT_TIME</code>、 <code>SERVER_ADDRESS</code>、 <code>PORT_NUMBER</code>。</p><p>对于函数名，同样也请使用小写的方式，通过下划线连接起来，例如： <code>launch_nuclear_missile()</code>、 <code>check_input_validation()</code>。</p><p>对于类名，则应该首字母大写，然后合并起来，例如： <code>class SpatialDropout2D()</code>、 <code>class FeatureSet()</code>。</p><p>总之，还是那句话，不要过于吝啬一个变量名的长度。当然，在合理描述这个变量背后代表的对象后，一定的精简能力也是必要的。</p><h2 id="代码分解技巧" tabindex="-1">代码分解技巧 <a class="header-anchor" href="#代码分解技巧" aria-label="Permalink to &quot;代码分解技巧&quot;">​</a></h2><p>最后，我们再讲一些很实用的代码优化技巧。</p><p>编程中一个核心思想是，不写重复代码。重复代码大概率可以通过使用条件、循环、构造函数和类来解决。而另一个核心思想则是，减少迭代层数，尽可能让 Python 代码扁平化，毕竟，人的大脑无法处理过多的栈操作。</p><p>所以，在很多业务逻辑比较复杂的地方，就需要我们加入大量的判断和循环。不过，这些一旦没写好，程序看起来就是地狱了。</p><p>我们来看下面几个示例，来说说写好判断、循环的细节问题。先来看第一段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if i_am_rich:</span></span>
<span class="line"><span>    money = 100</span></span>
<span class="line"><span>    send(money)</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>    money = 10</span></span>
<span class="line"><span>    send(money)</span></span></code></pre></div><p>这段代码中，同样的send语句出现了两次，所以我们完全可以合并一下，把代码改造成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if i_am_rich:</span></span>
<span class="line"><span>    money = 100</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>    money = 10</span></span>
<span class="line"><span>send(money)</span></span></code></pre></div><p>再来看一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def send(money):</span></span>
<span class="line"><span>    if is_server_dead:</span></span>
<span class="line"><span>        LOG(&#39;server dead&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        if is_server_timed_out:</span></span>
<span class="line"><span>            LOG(&#39;server timed out&#39;)</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            result = get_result_from_server()</span></span>
<span class="line"><span>            if result == MONEY_IS_NOT_ENOUGH:</span></span>
<span class="line"><span>                LOG(&#39;you do not have enough money&#39;)</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            else:</span></span>
<span class="line"><span>                if result == TRANSACTION_SUCCEED:</span></span>
<span class="line"><span>                    LOG(&#39;OK&#39;)</span></span>
<span class="line"><span>                    return</span></span>
<span class="line"><span>                else:</span></span>
<span class="line"><span>                    LOG(&#39;something wrong&#39;)</span></span>
<span class="line"><span>                    return</span></span></code></pre></div><p>这段代码层层缩进，显而易见的难看。我们来改一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def send(money):</span></span>
<span class="line"><span>    if is_server_dead:</span></span>
<span class="line"><span>        LOG(&#39;server dead&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if is_server_timed_out:</span></span>
<span class="line"><span>        LOG(&#39;server timed out&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    result = get_result_from_server()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if result == MONET_IS_NOT_ENOUGH:</span></span>
<span class="line"><span>        LOG(&#39;you do not have enough money&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if result == TRANSACTION_SUCCEED:</span></span>
<span class="line"><span>        LOG(&#39;OK&#39;)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    LOG(&#39;something wrong&#39;)</span></span></code></pre></div><p>新的代码是不是就清晰多了？</p><p>另外，我们知道，一个函数的粒度应该尽可能细，不要让一个函数做太多的事情。所以，对待一个复杂的函数，我们需要尽可能地把它拆分成几个功能简单的函数，然后合并起来。那么，应该如何拆分函数呢？</p><p>这里，我以一个简单的二分搜索来举例说明。我给定一个非递减整数数组，和一个 target，要求你找到数组中最小的一个数 x，可以满足 <code>x*x &gt; target</code>。一旦不存在，则返回 -1。</p><p>这个功能应该不难写吧。你不妨先自己写一下，写完后再对照着来看下面的代码，找出自己的问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def solve(arr, target):</span></span>
<span class="line"><span>    l, r = 0, len(arr) - 1</span></span>
<span class="line"><span>    ret = -1</span></span>
<span class="line"><span>    while l &amp;lt;= r:</span></span>
<span class="line"><span>        m = (l + r) // 2</span></span>
<span class="line"><span>        if arr[m] * arr[m] &amp;gt; target:</span></span>
<span class="line"><span>            ret = m</span></span>
<span class="line"><span>            r = m - 1</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            l = m + 1</span></span>
<span class="line"><span>    if ret == -1:</span></span>
<span class="line"><span>        return -1</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        return arr[ret]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 8))</span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 9))</span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 0))</span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 40))</span></span></code></pre></div><p>我给出的第一段代码这样的写法，在算法比赛和面试中已经 OK 了。不过，从工程角度来说，我们还能继续优化一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def comp(x, target):</span></span>
<span class="line"><span>    return x * x &amp;gt; target</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def binary_search(arr, target):</span></span>
<span class="line"><span>    l, r = 0, len(arr) - 1</span></span>
<span class="line"><span>    ret = -1</span></span>
<span class="line"><span>    while l &amp;lt;= r:</span></span>
<span class="line"><span>        m = (l + r) // 2</span></span>
<span class="line"><span>        if comp(arr[m], target):</span></span>
<span class="line"><span>            ret = m</span></span>
<span class="line"><span>            r = m - 1</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            l = m + 1</span></span>
<span class="line"><span>    return ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def solve(arr, target):</span></span>
<span class="line"><span>    id = binary_search(arr, target)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if id != -1:</span></span>
<span class="line"><span>        return arr[id]</span></span>
<span class="line"><span>    return -1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 8))</span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 9))</span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 0))</span></span>
<span class="line"><span>print(solve([1, 2, 3, 4, 5, 6], 40))</span></span></code></pre></div><p>你可以看出，第二段代码中，我把不同功能的代码拿了出来。其中，comp() 函数作为核心判断，拿出来后可以让整个程序更清晰；同时，我也把二分搜索的主程序拿了出来，只负责二分搜索；最后的 solve() 函数拿到结果，决定返回不存在，还是返回值。这样一来，每个函数各司其职，阅读性也能得到一定提高。</p><p>最后，我们再来看一下如何拆分类。老规矩，先看代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person:</span></span>
<span class="line"><span>    def __init__(self, name, sex, age, job_title, job_description, company_name):</span></span>
<span class="line"><span>        self.name = name</span></span>
<span class="line"><span>        self.sex = sex</span></span>
<span class="line"><span>        self.age = age</span></span>
<span class="line"><span>        self.job_title = job_title</span></span>
<span class="line"><span>        self.job_description = description</span></span>
<span class="line"><span>        self.company_name = company_name</span></span></code></pre></div><p>你应该能看得出来，job 在其中出现了很多次，而且它们表达的是一个意义实体，这种情况下，我们可以考虑将这部分分解出来，作为单独的类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Person:</span></span>
<span class="line"><span>    def __init__(self, name, sex, age, job_title, job_description, company_name):</span></span>
<span class="line"><span>        self.name = name</span></span>
<span class="line"><span>        self.sex = sex</span></span>
<span class="line"><span>        self.age = age</span></span>
<span class="line"><span>        self.job = Job(job_title, job_description, company_name)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Job:</span></span>
<span class="line"><span>    def __init__(self, job_title, job_description, company_name):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self.job_title = job_title</span></span>
<span class="line"><span>        self.job_description = description</span></span>
<span class="line"><span>        self.company_name = company_name</span></span></code></pre></div><p>你看，改造后的代码，瞬间就清晰了很多。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天这节课，我们简单讲述了如何提高 Python 代码的可读性，主要介绍了PEP 8 规范，并通过实例的说明和改造，让你清楚如何对 Python 程序进行可读性优化。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我想留一个思考题。这次的思考题开放一些，希望你在评论区讲一讲，你自己在初学编程时，不注意规范问题而犯下的错误，和这些错误会导致什么样的后果，比如对后来读代码的人有严重的误导，或是埋下了潜在的 bug 等等。</p><p>希望你在留言区分享你的经历，你也可以把这篇文章分享出去，让更多的人互相交流心得体会，留下真实的经历，并在经历中进步成长。</p>`,95)])])}const u=a(l,[["render",i]]);export{_ as __pageData,u as default};
