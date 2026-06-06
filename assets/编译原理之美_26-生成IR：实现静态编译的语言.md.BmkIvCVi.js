import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"26 | 生成IR：实现静态编译的语言","description":"","frontmatter":{},"headers":[{"level":2,"title":"LLVM IR的对象模型","slug":"llvm-ir的对象模型","link":"#llvm-ir的对象模型","children":[]},{"level":2,"title":"尝试生成LLVM IR","slug":"尝试生成llvm-ir","link":"#尝试生成llvm-ir","children":[]},{"level":2,"title":"支持if语句","slug":"支持if语句","link":"#支持if语句","children":[]},{"level":2,"title":"支持本地变量","slug":"支持本地变量","link":"#支持本地变量","children":[]},{"level":2,"title":"编译并运行程序","slug":"编译并运行程序","link":"#编译并运行程序","children":[]},{"level":2,"title":"课程小结","slug":"课程小结","link":"#课程小结","children":[]},{"level":2,"title":"一课一思","slug":"一课一思","link":"#一课一思","children":[]}],"relativePath":"编译原理之美/26-生成IR：实现静态编译的语言.md","filePath":"编译原理之美/26-生成IR：实现静态编译的语言.md","lastUpdated":1779821665000}'),l={name:"编译原理之美/26-生成IR：实现静态编译的语言.md"};function i(t,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_26-生成ir-实现静态编译的语言" tabindex="-1">26 | 生成IR：实现静态编译的语言 <a class="header-anchor" href="#_26-生成ir-实现静态编译的语言" aria-label="Permalink to &quot;26 | 生成IR：实现静态编译的语言&quot;">​</a></h1><p>目前来讲，你已经初步了解了LLVM和它的IR，也能够使用它的命令行工具。 <strong>不过，我们还是要通过程序生成LLVM的IR，</strong> 这样才能复用LLVM的功能，从而实现一门完整的语言。</p><p>不过，如果我们要像前面生成汇编语言那样，通过字符串拼接来生成LLVM的IR，除了要了解LLVM IR的很多细节之外，代码一定比较啰嗦和复杂，因为字符串拼接不是结构化的方法，所以，最好用一个定义良好的数据结构来表示IR。</p><p>好在LLVM项目已经帮我们考虑到了这一点，它提供了代表LLVM IR的一组对象模型，我们只要生成这些对象，就相当于生成了IR，这个难度就低多了。而且，LLVM还提供了一个工具类，IRBuilder，我们可以利用它，进一步提升创建LLVM IR的对象模型的效率，让生成IR的过程变得更加简单！</p><p>接下来，就让我们先来了解LLVM IR的对象模型。</p><h2 id="llvm-ir的对象模型" tabindex="-1">LLVM IR的对象模型 <a class="header-anchor" href="#llvm-ir的对象模型" aria-label="Permalink to &quot;LLVM IR的对象模型&quot;">​</a></h2><p>LLVM在内部有用C++实现的对象模型，能够完整表示LLVM IR，当我们把字节码读入内存时，LLVM就会在内存中构建出这个模型。只有基于这个对象模型，我们才可以做进一步的工作，包括代码优化，实现即时编译和运行，以及静态编译生成目标文件。 <strong>所以说，这个对象模型是LLVM运行时的核心。</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/154438/ced8f09e66d4bbd60eb524456d165e9f.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/154438/ced8f09e66d4bbd60eb524456d165e9f.jpg" alt=""></a></p><p>IR对象模型的头文件在 <a href="https://github.com/llvm/llvm-project/tree/master/llvm/include/llvm/IR" target="_blank" rel="noreferrer">include/llvm/IR</a> 目录下，其中最重要的类包括：</p><ul><li>Module（模块）</li></ul><p>Module类聚合了一个模块中的所有数据，它可以包含多个函数。你可以通过Model::iterator来遍历模块中所有的函数。它也包含了一个模块的全局变量。</p><ul><li>Function（函数）</li></ul><p>Function包含了与函数定义（definition）或声明（declaration）有关的所有对象。函数定义包含了函数体，而函数声明，则仅仅包含了函数的原型，它是在其他模块中定义的，在本模块中使用。</p><p>你可以通过getArgumentList()方法来获得函数参数的列表，也可以遍历函数体中的所有基本块，这些基本块会形成一个CFG（控制流图）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//函数声明，没有函数体。这个函数是在其他模块中定义的，在本模块中使用</span></span>
<span class="line"><span>declare void &amp;#64;foo(i32)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//函数定义，包含函数体</span></span>
<span class="line"><span>define i32 &amp;#64;fun3(i32 %a) {</span></span>
<span class="line"><span>  %calltmp1 = call void &amp;#64;foo(i32 %a)</span><span>  //调用外部函数</span></span>
<span class="line"><span>  ret i32 10</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>BasicBlock（基本块）</li></ul><p>BasicBlock封装了一系列的LLVM指令，你可以借助bigin()/end()模式遍历这些指令，还可以通过getTerminator()方法获得最后一条指令（也就是终结指令）。你还可以用到几个辅助方法在CFG中导航，比如获得某个基本块的前序基本块。</p><ul><li>Instruction（指令）</li></ul><p>Instruction类代表了LLVM IR的原子操作（也就是一条指令），你可以通过getOpcode()来获得它代表的操作码，它是一个llvm::Instruction枚举值，你可以通过op_begin()和op_end()方法对获得这个指令的操作数。</p><ul><li>Value（值）</li></ul><p>Value类代表一个值。在LLVM的内存IR中，如果一个类是从Value继承的，意味着它定义了一个值，其他方可以去使用。函数、基本块和指令都继承了Value。</p><ul><li>LLVMContext（上下文）</li></ul><p>这个类代表了LLVM做编译工作时的一个上下文，包含了编译工作中的一些全局数据，比如各个模块用到的常量和类型。</p><p>这些内容是LLVM IR对象模型的主要部分，我们生成IR的过程，就是跟这些类打交道，其他一些次要的类，你可以在阅读和编写代码的过程中逐渐熟悉起来。</p><p>接下来，就让我们用程序来生成LLVM的IR。</p><h2 id="尝试生成llvm-ir" tabindex="-1">尝试生成LLVM IR <a class="header-anchor" href="#尝试生成llvm-ir" aria-label="Permalink to &quot;尝试生成LLVM IR&quot;">​</a></h2><p>我刚刚提到的每个LLVM IR类，都可以通过程序来构建。那么，为下面这个fun1()函数生成IR，应该怎么办呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int fun1(int a, int b){</span></span>
<span class="line"><span>    return a+b;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第一步，</strong> 我们可以来生成一个LLVM模块，也就是顶层的IR对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Module *mod = new Module(&quot;fun1.ll&quot;, TheModule);</span></span></code></pre></div><p><strong>第二步，</strong> 我们继续在模块中定义函数fun1，因为模块最主要的构成要素就是各个函数。</p><p>不过在定义函数之前，要先定义函数的原型（或者叫函数的类型）。函数的类型，我们在前端讲过：如果两个函数的返回值相同，并且参数也相同，这两个函数的类型是相同的，这样就可以做函数指针或函数型变量的赋值。示例代码的函数原型是：返回值是32位整数，参数是两个32位整数。</p><p>有了函数原型以后，就可以使用这个函数原型定义一个函数。我们还可以为每个参数设置一个名称，便于后面引用这个参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//函数原型</span></span>
<span class="line"><span>vector&amp;lt;Type *&amp;gt; argTypes(2, Type::getInt32Ty(TheContext));</span></span>
<span class="line"><span>FunctionType *fun1Type = FunctionType::get(Type::getInt32Ty(TheContext), //返回值是整数</span></span>
<span class="line"><span>      argTypes, //两个整型参数</span></span>
<span class="line"><span>      false);   //不是变长参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//函数对象</span></span>
<span class="line"><span>Function *fun = Function::Create(fun1Type,</span></span>
<span class="line"><span>      Function::ExternalLinkage,   //链接类型</span></span>
<span class="line"><span>      &quot;fun2&quot;,</span><span>                      //函数名称</span></span>
<span class="line"><span>      TheModule.get());            //所在模块</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//设置参数名称</span></span>
<span class="line"><span>string argNames[2] = {&quot;a&quot;, &quot;b&quot;};</span></span>
<span class="line"><span>unsigned i = 0;</span></span>
<span class="line"><span>for (auto &amp;arg : fun-&amp;gt;args()){</span></span>
<span class="line"><span>    arg.setName(argNames[i++]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>这里你需要注意，代码中是如何使用变量类型的。</strong> 所有的基础类型都是提前定义好的，可以通过Type类的getXXXTy()方法获得（我们使用的是Int32类型，你还可以获得其他类型）。</p><p><strong>第三步，</strong> 创建一个基本块。</p><p>这个函数只有一个基本块，你可以把它命名为“entry”，也可以不给它命名。在创建了基本块之后，我们用了一个辅助类IRBuilder，设置了一个插入点，后序生成的指令会插入到这个基本块中（IRBuilder是LLVM为了简化IR生成过程所提供的一个辅助类）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//创建一个基本块</span></span>
<span class="line"><span>BasicBlock *BB = BasicBlock::Create(TheContext,//上下文</span></span>
<span class="line"><span>               &quot;&quot;,</span><span>     //基本块名称</span></span>
<span class="line"><span>               fun);  //所在函数</span></span>
<span class="line"><span>Builder.SetInsertPoint(BB);   //设置指令的插入点</span></span></code></pre></div><p><strong>第四步，</strong> 生成&quot;a+b&quot;表达式所对应的IR，插入到基本块中。</p><p>a和b都是函数fun的参数，我们把它取出来，分别赋值给L和R（L和R是Value）。然后用IRBuilder的CreateAdd()方法，生成一条add指令。这个指令的计算结果存放在addtemp中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//把参数变量存到NamedValues里面备用</span></span>
<span class="line"><span>NamedValues.clear();</span></span>
<span class="line"><span>for (auto &amp;Arg : fun-&amp;gt;args())</span></span>
<span class="line"><span>    NamedValues[Arg.getName()] = &amp;Arg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//做加法</span></span>
<span class="line"><span>Value *L = NamedValues[&quot;a&quot;];</span></span>
<span class="line"><span>Value *R = NamedValues[&quot;b&quot;];</span></span>
<span class="line"><span>Value *addtmp = Builder.CreateAdd(L, R);</span></span></code></pre></div><p><strong>第五步，</strong> 利用刚才获得的addtmp创建一个返回值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//返回值</span></span>
<span class="line"><span>Builder.CreateRet(addtmp);</span></span></code></pre></div><p><strong>最后一步，</strong> 检查这个函数的正确性。这相当于是做语义检查，比如，基本块的最后一个语句就必须是一个正确的返回指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//验证函数的正确性</span></span>
<span class="line"><span>verifyFunction(*fun);</span></span></code></pre></div><p>完整的代码我也提供给你，放在 <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/lab/26-llvmdemo/main.cpp#L49" target="_blank" rel="noreferrer">codegen_fun1()</a> 里了，你可以看一下。我们可以调用这个方法，然后打印输出生成的IR：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Function *fun1 = codegen_fun1();     //在模块中生成Function对象</span></span>
<span class="line"><span>TheModule-&amp;gt;print(errs(), nullptr);   //在终端输出IR</span></span></code></pre></div><p>生成的IR如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>; ModuleID = &#39;llvmdemo&#39;</span></span>
<span class="line"><span>source_filename = &quot;llvmdemo&quot;</span></span>
<span class="line"><span>define i32 &amp;#64;fun1(i32 %a, i32 %b) {</span></span>
<span class="line"><span>  %1 = add i32 %a, %b</span></span>
<span class="line"><span>  ret i32 %1</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子简单，过程直观，只有一个加法运算，而我建议你在这个过程中注意每个IR对象都是怎样被创建的，在大脑中想象出整个对象结构。</p><p>为了熟悉更多的API，接下来，我再带你生成一个稍微复杂一点儿的，带有if语句的IR。然后来看一看，函数中包含多个基本块的情况。</p><h2 id="支持if语句" tabindex="-1">支持if语句 <a class="header-anchor" href="#支持if语句" aria-label="Permalink to &quot;支持if语句&quot;">​</a></h2><p>具体说，我们要为下面的一个函数生成IR（函数有一个参数a，当a大于2的时候，返回2；否则返回3）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int fun_ifstmt(int a)</span></span>
<span class="line"><span>  if (a &amp;gt; 2)</span></span>
<span class="line"><span>    return 2;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    return 3；</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样的一个函数，需要包含4个基本块： <strong>入口基本块、Then基本块、Else基本块和Merge基本块。</strong> 控制流图（CFG）是先分开，再合并，像下面这样：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/154438/ce96ecd42b4b4e095d4671e1b658582a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/154438/ce96ecd42b4b4e095d4671e1b658582a.jpg" alt=""></a></p><p><strong>在入口基本块中，</strong> 我们要计算“a&gt;2”的值，并根据这个值，分别跳转到ThenBB和ElseBB。这里，我们用到了IRBuilder的CreateICmpUGE()方法（UGE的意思，是”不大于等于“，也就是小于）。这个指令的返回值是一个1位的整型，也就是int1。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//计算a&amp;gt;2</span></span>
<span class="line"><span>Value * L = NamedValues[&quot;a&quot;];</span></span>
<span class="line"><span>Value * R = ConstantInt::get(TheContext, APInt(32, 2, true));</span></span>
<span class="line"><span>Value * cond = Builder.CreateICmpUGE(L, R, &quot;cmptmp&quot;);</span></span></code></pre></div><p>接下来，我们创建另外3个基本块，并用IRBuilder的CreateCondBr()方法创建条件跳转指令：当cond是1的时候，跳转到ThenBB，0的时候跳转到ElseBB。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BasicBlock *ThenBB =BasicBlock::Create(TheContext, &quot;then&quot;, fun);</span></span>
<span class="line"><span>BasicBlock *ElseBB = BasicBlock::Create(TheContext, &quot;else&quot;);</span></span>
<span class="line"><span>BasicBlock *MergeBB = BasicBlock::Create(TheContext, &quot;ifcont&quot;);</span></span>
<span class="line"><span>Builder.CreateCondBr(cond, ThenBB, ElseBB);</span></span></code></pre></div><p><strong>如果你细心的话，</strong> 可能会发现，在创建ThenBB的时候，指定了其所在函数是fun，而其他两个基本块没有指定。这是因为，我们接下来就要为ThenBB生成指令，所以先加到fun中。之后，再顺序添加ElseBB和MergeBB到fun中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//ThenBB</span></span>
<span class="line"><span>Builder.SetInsertPoint(ThenBB);</span></span>
<span class="line"><span>Value *ThenV = ConstantInt::get(TheContext, APInt(32, 2, true));</span></span>
<span class="line"><span>Builder.CreateBr(MergeBB);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//ElseBB</span></span>
<span class="line"><span>fun-&amp;gt;getBasicBlockList().push_back(ElseBB);  //把基本块加入到函数中</span></span>
<span class="line"><span>Builder.SetInsertPoint(ElseBB);</span></span>
<span class="line"><span>Value *ElseV = ConstantInt::get(TheContext, APInt(32, 3, true));</span></span>
<span class="line"><span>Builder.CreateBr(MergeBB);</span></span></code></pre></div><p><strong>在ThenBB和ElseBB</strong> 这两个基本块的代码中，我们分别计算出了两个值：ThenV和ElseV。它们都可能是最后的返回值，但具体采用哪个，还要看实际运行时，控制流走的是ThenBB还是ElseBB。这就需要用到phi指令，它完成了根据控制流来选择合适的值的任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//MergeBB</span></span>
<span class="line"><span>fun-&amp;gt;getBasicBlockList().push_back(MergeBB);</span></span>
<span class="line"><span>Builder.SetInsertPoint(MergeBB);</span></span>
<span class="line"><span>//PHI节点：整型，两个候选值</span></span>
<span class="line"><span>PHINode *PN = Builder.CreatePHI(Type::getInt32Ty(TheContext), 2);</span></span>
<span class="line"><span>PN-&amp;gt;addIncoming(ThenV, ThenBB);  //前序基本块是ThenBB时，采用ThenV</span></span>
<span class="line"><span>PN-&amp;gt;addIncoming(ElseV, ElseBB);  //前序基本块是ElseBB时，采用ElseV</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//返回值</span></span>
<span class="line"><span>Builder.CreateRet(PN);</span></span></code></pre></div><p>从上面这段代码中你能看出， <strong>在if语句中，phi指令是关键。</strong> 因为当程序的控制流经过多个基本块，每个基本块都可能改变某个值的时候，通过phi指令可以知道运行时实际走的是哪条路径，从而获得正确的值。</p><p>最后生成的IR如下，其中的phi指令指出，如果前序基本块是then，取值为2，是else的时候取值为3。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>define i32 &amp;#64;fun_ifstmt(i32 %a) {</span></span>
<span class="line"><span>  %cmptmp = icmp uge i32 %a, 2</span></span>
<span class="line"><span>  br i1 %cmptmp, label %then, label %else</span></span>
<span class="line"><span></span></span>
<span class="line"><span>then:                                             ; preds = %0</span></span>
<span class="line"><span>  br label %ifcont</span></span>
<span class="line"><span></span></span>
<span class="line"><span>else:                                             ; preds = %0</span></span>
<span class="line"><span>  br label %ifcont</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ifcont:                                           ; preds = %else, %then</span></span>
<span class="line"><span>  %1 = phi i32 [ 2, %then ], [ 3, %else ]</span></span>
<span class="line"><span>  ret i32 %1</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实循环语句也跟if语句差不多，因为它们都是要涉及到多个基本块，要用到phi指令， <strong>所以一旦你会写if语句，肯定就会写循环语句的。</strong></p><h2 id="支持本地变量" tabindex="-1">支持本地变量 <a class="header-anchor" href="#支持本地变量" aria-label="Permalink to &quot;支持本地变量&quot;">​</a></h2><p>在写程序的时候，本地变量是必不可少的一个元素，所以，我们趁热打铁，把刚才的示例程序变化一下，用本地变量b保存ThenBB和ElseBB中计算的值，借此学习一下LLVM IR是如何支持本地变量的。</p><p>改变后的示例程序如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int fun_localvar(int a)</span></span>
<span class="line"><span>  int b = 0;</span></span>
<span class="line"><span>  if (a &amp;gt; 2)</span></span>
<span class="line"><span>     b = 2;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>     b = 3;</span></span>
<span class="line"><span>  return b;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，函数有一个参数a，一个本地变量b：如果a大于2，那么给b赋值2；否则，给b赋值3。最后的返回值是b。</p><p><strong>现在挑战来了，</strong> 在这段代码中，b被声明了一次，赋值了3次。我们知道，LLVM IR采用的是SSA形式，也就是每个变量只允许被赋值一次，那么对于多次赋值的情况，我们该如何生成IR呢？</p><p>其实，LLVM规定了对寄存器只能做单次赋值，而对内存中的变量，是可以多次赋值的。对于“int b = 0;”，我们用下面几条语句生成IR：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//本地变量b</span></span>
<span class="line"><span>AllocaInst *b = Builder.CreateAlloca(Type::getInt32Ty(TheContext), nullptr, &quot;b&quot;);</span></span>
<span class="line"><span>Value* initValue = ConstantInt::get(TheContext, APInt(32, 0, true));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Builder.CreateStore(initValue, b);</span></span></code></pre></div><p>上面这段代码的含义是：首先用CreateAlloca()方法，在栈中申请一块内存，用于保存一个32位的整型，接着，用CreateStore()方法生成一条store指令，给b赋予初始值。</p><p>上面几句生成的IR如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%b = alloca i32</span></span>
<span class="line"><span> store i32 0, i32* %b</span></span></code></pre></div><p>接着，我们可以在ThenBB和ElseBB中，分别对内存中的b赋值：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//ThenBB</span></span>
<span class="line"><span>Builder.SetInsertPoint(ThenBB);</span></span>
<span class="line"><span>Value *ThenV = ConstantInt::get(TheContext, APInt(32, 2, true));</span></span>
<span class="line"><span>Builder.CreateStore(ThenV, b);</span></span>
<span class="line"><span>Builder.CreateBr(MergeBB);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//ElseBB</span></span>
<span class="line"><span>fun-&amp;gt;getBasicBlockList().push_back(ElseBB);</span></span>
<span class="line"><span>Builder.SetInsertPoint(ElseBB);</span></span>
<span class="line"><span>Value *ElseV = ConstantInt::get(TheContext, APInt(32, 3, true));</span></span>
<span class="line"><span>Builder.CreateStore(ElseV, b);</span></span>
<span class="line"><span>Builder.CreateBr(MergeBB);</span></span></code></pre></div><p>最后，在MergeBB中，我们只需要返回b就可以了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//MergeBB</span></span>
<span class="line"><span>fun-&amp;gt;getBasicBlockList().push_back(MergeBB);</span></span>
<span class="line"><span>Builder.SetInsertPoint(MergeBB);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//返回值</span></span>
<span class="line"><span>Builder.CreateRet(b);</span></span></code></pre></div><p>最后生成的IR如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>define i32 &amp;#64;fun_ifstmt.1(i32 %a) {</span></span>
<span class="line"><span>  %b = alloca i32</span></span>
<span class="line"><span>  store i32 0, i32* %b</span></span>
<span class="line"><span>  %cmptmp = icmp uge i32 %a, 2</span></span>
<span class="line"><span>  br i1 %cmptmp, label %then, label %else</span></span>
<span class="line"><span></span></span>
<span class="line"><span>then:                                             ; preds = %0</span></span>
<span class="line"><span>  store i32 2, i32* %b</span></span>
<span class="line"><span>  br label %ifcont</span></span>
<span class="line"><span></span></span>
<span class="line"><span>else:                                             ; preds = %0</span></span>
<span class="line"><span>  store i32 3, i32* %b</span></span>
<span class="line"><span>  br label %ifcont</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ifcont:                                           ; preds = %else, %then</span></span>
<span class="line"><span>  ret i32* %b</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，使用内存保存临时变量的性能比较低，但我们可以很容易通过优化算法，把上述代码从使用内存的版本，优化成使用寄存器的版本。</p><p>通过上面几个示例，现在你已经学会了生成基本的IR，包括能够支持本地变量、加法运算、if语句。那么这样生成的IR能否正常工作呢？我们需要把这些IR编译和运行一下才知道。</p><h2 id="编译并运行程序" tabindex="-1">编译并运行程序 <a class="header-anchor" href="#编译并运行程序" aria-label="Permalink to &quot;编译并运行程序&quot;">​</a></h2><p>现在已经能够在内存中建立LLVM的IR对象了，包括模块、函数、基本块和各种指令。LLVM可以即时编译并执行这个IR模型。</p><p>我们先创建一个不带参数的__main()函数作为入口。同时，我会借这个例子延伸讲一下函数的调用。我们在前面声明了函数fun1，现在在__main()函数中演示如何调用它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Function * codegen_main(){</span></span>
<span class="line"><span>    //创建main函数</span></span>
<span class="line"><span>    FunctionType *mainType = FunctionType::get(Type::getInt32Ty(TheContext), false);</span></span>
<span class="line"><span>    Function *main = Function::Create(mainType, Function::ExternalLinkage, &quot;__main&quot;, TheModule.get());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建一个基本块</span></span>
<span class="line"><span>    BasicBlock *BB = BasicBlock::Create(TheContext, &quot;&quot;, main);</span></span>
<span class="line"><span>    Builder.SetInsertPoint(BB);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //设置参数的值</span></span>
<span class="line"><span>    int argValues[2] = {2, 3};</span></span>
<span class="line"><span>    std::vector&amp;lt;Value *&amp;gt; ArgsV;</span></span>
<span class="line"><span>    for (unsigned i = 0; i&amp;lt;2; ++i) {</span></span>
<span class="line"><span>        Value * value = ConstantInt::get(TheContext, APInt(32,argValues[i],true));</span></span>
<span class="line"><span>        ArgsV.push_back(value);</span></span>
<span class="line"><span>        if (!ArgsV.back())</span></span>
<span class="line"><span>            return nullptr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //调用函数fun1</span></span>
<span class="line"><span>    Function *callee = TheModule-&amp;gt;getFunction(&quot;fun1&quot;);</span></span>
<span class="line"><span>    Value * rtn = Builder.CreateCall(callee, ArgsV, &quot;calltmp&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回值</span></span>
<span class="line"><span>    Builder.CreateRet(rtn);</span></span>
<span class="line"><span>    return main;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用函数时，我们首先从模块中查找出名称为fun1的函数，准备好参数值，然后通过IRBuilder的CreateCall()方法来生成函数调用指令。最后生成的IR如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>define i32 &amp;#64;__main() {</span></span>
<span class="line"><span>  %calltmp = call i32 &amp;#64;fun1(i32 2, i32 3)</span></span>
<span class="line"><span>  ret i32 %calltmp3</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们调用即时编译的引擎来运行__main函数（与JIT引擎有关的代码，放到了DemoJIT.h中，你现在可以暂时不关心它的细节，留到以后再去了解）。使用这个JIT引擎，我们需要做几件事情：</p><p>1.初始化与目标硬件平台有关的设置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>InitializeNativeTarget();</span></span>
<span class="line"><span>InitializeNativeTargetAsmPrinter();</span></span>
<span class="line"><span>InitializeNativeTargetAsmParser();</span></span></code></pre></div><p>2.把创建的模型加入到JIT引擎中，找到__main()函数的地址（整个过程跟C语言中使用函数指针来执行一个函数没有太大区别）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto H = TheJIT-&amp;gt;addModule(std::move(TheModule));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//查找__main函数</span></span>
<span class="line"><span>auto main = TheJIT-&amp;gt;findSymbol(&quot;__main&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//获得函数指针</span></span>
<span class="line"><span>int32_t (*FP)() = (int32_t (*)())(intptr_t)cantFail(main.getAddress());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//执行函数</span></span>
<span class="line"><span>int rtn = FP();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//打印执行结果</span></span>
<span class="line"><span>fprintf(stderr, &quot;__main: %d\\n&quot;, rtn);</span></span></code></pre></div><p>3.程序可以成功执行，并打印__main函数的返回值。</p><p><strong>既然已经演示了如何调用函数，在这里，我给你揭示LLVM的一个惊人的特性：</strong> 我们可以在LLVM IR里，调用本地编写的函数，比如编写一个foo()函数，用来打印输出一些信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void foo(int a){</span></span>
<span class="line"><span>    printf(&quot;in foo: %d\\n&quot;,a);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后我们就可以在__main里直接调用这个foo函数，就像调用fun1函数一样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//调用一个外部函数foo</span></span>
<span class="line"><span>vector&amp;lt;Type *&amp;gt; argTypes(1, Type::getInt32Ty(TheContext));</span></span>
<span class="line"><span>FunctionType *fooType = FunctionType::get(Type::getVoidTy(TheContext), argTypes, false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Function *foo = Function::Create(fooType, Function::ExternalLinkage, &quot;foo&quot;, TheModule.get());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>std::vector&amp;lt;Value *&amp;gt; ArgsV2;</span></span>
<span class="line"><span>ArgsV2.push_back(rtn);</span></span>
<span class="line"><span>if (!ArgsV2.back())</span></span>
<span class="line"><span>    return nullptr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Builder.CreateCall(foo, ArgsV2, &quot;calltmp2&quot;);</span></span></code></pre></div><p>注意，我们在这里只对foo函数做了声明，并没有定义它的函数体，这时LLVM会在外部寻找foo的定义，它会找到用C++编写的foo函数，然后调用并执行；如果foo函数在另一个目标文件中，它也可以找到。</p><p>刚才讲的是即时编译和运行，你也可以生成目标文件，然后再去链接和执行。生成目标文件的代码参见 <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/lab/26-llvmdemo/main.cpp#L298" target="_blank" rel="noreferrer">emitObject()</a> 方法，基本上就是打开一个文件，然后写入生成的二进制目标代码。针对目标机器生成目标代码的大量工作，就用这么简单的几行代码就实现了，是不是帮了你的大忙了？</p><h2 id="课程小结" tabindex="-1">课程小结 <a class="header-anchor" href="#课程小结" aria-label="Permalink to &quot;课程小结&quot;">​</a></h2><p>本节课，我们我们完成了从生成IR到编译执行的完整过程，同时，也初步熟悉了LLVM的接口。当然了，完全熟悉LLVM的接口还需要多做练习，掌握更多的细节。就本节课而言，我希望你掌握的重点如下：</p><ul><li><p>LLVM用一套对象模型在内存中表示IR，包括模块、函数、基本块和指令，你可以通过API来生成这些对象。这些对象一旦生成，就可以编译和执行。</p></li><li><p>对于if语句和循环语句，需要生成多个基本块，并通过跳转指令形成正确的控制流图（CFG）。当存在多个前序节点可能改变某个变量的值的时候，使用phi指令来确定正确的值。</p></li><li><p>存储在内存中的本地变量，可以多次赋值。</p></li><li><p>LLVM能够把外部函数和IR模型中的函数等价对待。</p></li></ul><p>另外，为了降低学习难度，本节课，我没有做从AST翻译成IR的工作，而是针对一个目标功能（比如一个C语言的函数），硬编码调用API来生成IR。你理解各种功能是如何生成IR以后，再从AST来翻译，就更加容易了。</p><h2 id="一课一思" tabindex="-1">一课一思 <a class="header-anchor" href="#一课一思" aria-label="Permalink to &quot;一课一思&quot;">​</a></h2><p>既然我带你演示了if语句如何生成IR，那么你能思考一下，对于for循环和while循环语句，它对应的CFG应该是什么样的？应该如何生成IR？欢迎你在留言区分享你的看法。</p><p>最后，感谢你的阅读，如果这篇文章让你有所收获，也欢迎你将它分享给更多的朋友。</p>`,112)])])}const g=n(l,[["render",i]]);export{h as __pageData,g as default};
