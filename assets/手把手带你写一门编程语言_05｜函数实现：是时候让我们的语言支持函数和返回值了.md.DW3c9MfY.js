import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"05｜函数实现：是时候让我们的语言支持函数和返回值了","description":"","frontmatter":{},"headers":[{"level":2,"title":"增强语法分析功能","slug":"增强语法分析功能","link":"#增强语法分析功能","children":[]},{"level":2,"title":"语义分析：作用域","slug":"语义分析-作用域","link":"#语义分析-作用域","children":[]},{"level":2,"title":"解释器：实现栈桢","slug":"解释器-实现栈桢","link":"#解释器-实现栈桢","children":[]},{"level":2,"title":"彩蛋：在函数内部声明的函数","slug":"彩蛋-在函数内部声明的函数","link":"#彩蛋-在函数内部声明的函数","children":[]},{"level":2,"title":"课程小结","slug":"课程小结","link":"#课程小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"资源链接","slug":"资源链接","link":"#资源链接","children":[]}],"relativePath":"手把手带你写一门编程语言/05｜函数实现：是时候让我们的语言支持函数和返回值了.md","filePath":"手把手带你写一门编程语言/05｜函数实现：是时候让我们的语言支持函数和返回值了.md","lastUpdated":1779820057000}'),l={name:"手把手带你写一门编程语言/05｜函数实现：是时候让我们的语言支持函数和返回值了.md"};function i(t,n,c,r,o,u){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_05-函数实现-是时候让我们的语言支持函数和返回值了" tabindex="-1">05｜函数实现：是时候让我们的语言支持函数和返回值了 <a class="header-anchor" href="#_05-函数实现-是时候让我们的语言支持函数和返回值了" aria-label="Permalink to &quot;05｜函数实现：是时候让我们的语言支持函数和返回值了&quot;">​</a></h1><p>你好，我是宫文学。</p><p>不知道你还记不记得，我们在 <a href="https://time.geekbang.org/column/article/406179" target="_blank" rel="noreferrer">第一节课</a> 就支持了函数功能。不过那个版本的函数功能是被高度简化了的，比如，它不支持声明函数的参数，也不支持函数的返回值。</p><p>在上一节课实现了对变量的支持以后，我们终于可以进一步升级我们的函数功能了。为什么要等到这个时候呢？因为其实函数的参数的实现机制跟变量是很类似的。</p><p>为了升级我们的函数功能，我们需要完成几项任务：</p><ol><li><strong>参考变量的机制实现函数的参数机制</strong>；</li><li><strong>支持在函数内部声明和使用本地变量</strong>，这个时候，我们需要能够区分函数作用域和全局作用域，还要能够在退出函数的时候，让本地变量的生命期随之结束；</li><li><strong>要支持函数的返回值</strong>。</li></ol><p>你可以想象到，在实现了这节课的功能以后，我们的语言就越来像样了。你甚至可以用这个语言来实现一点复杂的功能了，比如设计个函数，用来计算圆的周长、面积什么的。</p><p>好吧，让我们赶紧动手吧。首先，像上节课一样，我们还是要增强一下语法分析功能，以便解析函数的参数和返回值，并支持在函数内部声明本地变量。</p><h2 id="增强语法分析功能" tabindex="-1">增强语法分析功能 <a class="header-anchor" href="#增强语法分析功能" aria-label="Permalink to &quot;增强语法分析功能&quot;">​</a></h2><p>我们原来的函数声明的语法比较简陋，现在我们采用一下TypeScript完整的函数声明语法。采用这个语法，函数可以有0到多个参数，每个参数都可以指定类型，就像变量一样，还可以指定函数返回值的类型。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//函数声明，由&#39;function&#39;关键字、函数名、函数签名和函数体构成。</span></span>
<span class="line"><span>functionDeclaration</span></span>
<span class="line"><span>    : &#39;function&#39; Identifier callSignature &#39;{&#39; functionBody &#39;}&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//函数签名，也就是参数数量和类型正确，以及函数的返回值类型正确</span></span>
<span class="line"><span>callSignature</span></span>
<span class="line"><span>    : &#39;(&#39; parameterList? &#39;)&#39; typeAnnotation?</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//参数列表，由1到多个参数声明构成。</span></span>
<span class="line"><span>parameterList : parameter (&#39;,&#39; parameter)* ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//参数，由参数名称和可选的类型标注构成</span></span>
<span class="line"><span>parameter : Identifier typeAnnotation? ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//返回语句</span></span>
<span class="line"><span>returnStatement: &#39;return&#39; expression? &#39;;&#39; ;</span></span></code></pre></div><p>采用该规则以后，你可以声明一个像下面的函数，比如，你给这个函数传入圆的半径的值，它会给你计算出圆的面积：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//计算圆的面积</span></span>
<span class="line"><span>function circleArea(r : number):number{</span></span>
<span class="line"><span>  let area : number = 3.14*r*r;</span></span>
<span class="line"><span>  return area;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>let r:number =4;</span></span>
<span class="line"><span>println(&quot;r=&quot; + r +&quot;, area=&quot;+circleArea(r));</span></span>
<span class="line"><span>r = 5;</span></span>
<span class="line"><span>println(&quot;r=&quot; + r +&quot;, area=&quot;+circleArea(r));</span></span></code></pre></div><p>好了，修改好语法规则以后，我们就按照该语法规则来升级一下语法分析程序，跟 <a href="https://time.geekbang.org/column/article/407731" target="_blank" rel="noreferrer">04讲</a> 一样，我们同样需要计算一下相关元素的First和Follow集合。在这里，我就不再演示计算First集合和Follow集合了，而是把它们留到了思考题的部分，让你自己来计算一个语法成分的Follow集合，这样能让你对LL算法理解得更加深入。</p><p>这里，我贴上几个代码片段，如果你想看更完整的代码，你可以阅读 <a href="https://gitee.com/richard-gong/craft-a-language/blob/master/05/parser.ts" target="_blank" rel="noreferrer">parser.ts</a>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//解析语句</span></span>
<span class="line"><span>parseStatement():Statement{</span></span>
<span class="line"><span>    let t = this.scanner.peek();</span></span>
<span class="line"><span>    //根据&#39;function&#39;关键字，去解析函数声明</span></span>
<span class="line"><span>    if (t.code == Keyword.Function){</span></span>
<span class="line"><span>        return this.parseFunctionDecl();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //根据&#39;return&#39;关键字，解析return语句</span></span>
<span class="line"><span>    else if (t.code == Keyword.Return){</span></span>
<span class="line"><span>        return this.parseReturnStatement();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//解析函数签名</span></span>
<span class="line"><span>parseCallSignature():CallSignature{</span></span>
<span class="line"><span>    let beginPos = this.scanner.getNextPos();</span></span>
<span class="line"><span>    //跳过&#39;(&#39;</span></span>
<span class="line"><span>    let t = this.scanner.next();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let paramList = null;</span></span>
<span class="line"><span>    if (this.scanner.peek().code != Seperator.CloseParen){  //&#39;)&#39;</span></span>
<span class="line"><span>        paramList = this.parseParameterList();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //看看后面是不是&#39;)&#39;</span></span>
<span class="line"><span>    t = this.scanner.peek();</span></span>
<span class="line"><span>    if (t.code == Seperator.CloseParen){  //&#39;)&#39;</span></span>
<span class="line"><span>        //跳过&#39;)&#39;</span></span>
<span class="line"><span>        this.scanner.next();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //解析typeAnnotation</span></span>
<span class="line"><span>        let theType:string = &#39;any&#39;;</span></span>
<span class="line"><span>        if (this.scanner.peek().code == Seperator.Colon){  //&#39;:&#39;</span></span>
<span class="line"><span>            theType = this.parseTypeAnnotation();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return new CallSignature(beginPos,this.scanner.getLastPos(),paramList, theType);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else{</span></span>
<span class="line"><span>        console.log(&quot;Expecting a &#39;)&#39; after for a call signature&quot;);</span></span>
<span class="line"><span>        return new CallSignature(beginPos,this.scanner.getLastPos(),paramList, &#39;unknown&#39;, true);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>做完语法分析后，按照惯例，我们还是要再迭代一下语义分析程序。在这一节课里，我们会在语义分析环节，开始接触作用域的概念。</p><h2 id="语义分析-作用域" tabindex="-1">语义分析：作用域 <a class="header-anchor" href="#语义分析-作用域" aria-label="Permalink to &quot;语义分析：作用域&quot;">​</a></h2><p>我们在学习任何一门语言的时候，都会涉及到作用域的概念。</p><p>作用域就是变量能够起作用的代码范围。当我们声明一个变量的时候，这个变量起作用的范围是有限的，比如，在一个函数体内声明的变量，在函数之外就不能引用了。区分了作用域，我们就能保护函数内部的变量的值不会被外部的代码所改变。同时，我们在函数外面使用变量的时候，也不用担心跟函数内部的变量名称冲突。</p><p>上一节课，我们已经建立了符号表，并且能够存储每个变量的值。可是，我们当时并没有区分变量的作用域，也没有限制局部变量的生存期。所以，对于下面的程序，由于函数内部和外部都有一个相同名称的变量a，可能就会出现错误：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function foo(){</span></span>
<span class="line"><span>  //局部变量a</span></span>
<span class="line"><span>  let a:number = 3;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//全局变量a</span></span>
<span class="line"><span>let a:number;</span></span>
<span class="line"><span>println(a);   //打印出3来。</span></span></code></pre></div><p>所以，在语义分析阶段，我们要区分开不同变量的作用域。目前我们只需要支持全局作用域和函数内部的作用域两种就可以了，我们后面还会针对语句块、类等引入更多的作用域。</p><p>在具体实现上，我们需要修改符号表的设计，引入一个作用域类，也就是Scope。这样，全局的符号和和每个函数的符号就可以分别保存在各自的Scope对象中，也就不会冲突了。</p><p>另外，你要注意，作用域是一层套一层，形成一个树状结构的，比如，函数的作用域就是全局作用域的子作用域。所以，我们在Scope的属性中，能够发现作用域所形成的层级结构。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export class Scope{</span></span>
<span class="line"><span>    //以名称为key存储符号</span></span>
<span class="line"><span>    name2sym:Map&lt;​string,Symbol&gt; = new Map();</span></span>
<span class="line"><span>    //上级作用域</span></span>
<span class="line"><span>    enclosingScope: Scope|null; //顶级作用域的上一级是null</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再把建立符号表的程序更新一下（参见 <a href="https://gitee.com/richard-gong/craft-a-language/blob/master/05/semantic.ts#L77" target="_blank" rel="noreferrer">Enter类</a>），重点看一下visitBlock方法。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>visitBlock(block:Block):any{</span></span>
<span class="line"><span>    //创建下一级scope</span></span>
<span class="line"><span>    let currentScope = new Scope(this.scope);</span></span>
<span class="line"><span>    block.scope = currentScope;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 修改当前的Scope</span></span>
<span class="line"><span>    this.scope = currentScope;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //调用父类的方法，遍历所有的语句</span></span>
<span class="line"><span>    super.visitBlock(block);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //重新设置当前的Scope</span></span>
<span class="line"><span>    if (this.scope.enclosingScope != null){</span></span>
<span class="line"><span>        this.scope = this.scope.enclosingScope;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return currentScope;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意，我们创建新的作用域，都是在遇到Block的时候。因为每个函数的函数体都是一个Block，所以会确保每个函数都对应一个新的Scope。这样的话，在函数体中声明的变量，就会添加到函数的作用域中，而不是全局作用域。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 把变量声明加入符号表</span></span>
<span class="line"><span> * @param functionDecl</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>visitVariableDecl(variableDecl : VariableDecl):any{</span></span>
<span class="line"><span>    //重复变量声明的检查</span></span>
<span class="line"><span>    if (this.scope.hasSymbol(variableDecl.name)){</span></span>
<span class="line"><span>        console.log(&quot;Dumplicate symbol: &quot;+ variableDecl.name);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //把变量加入当前的符号表</span></span>
<span class="line"><span>    let sym = new VarSymbol(variableDecl.name, variableDecl.theType, variableDecl);</span></span>
<span class="line"><span>    this.scope.enter(variableDecl.name, sym);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //把本地变量也加入函数符号中，可用于后面生成代码</span></span>
<span class="line"><span>    this.functionSym?.vars.push(sym);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>更新了建立符号表的程序以后，我们再更新一下引用消解的程序（参见 <a href="https://gitee.com/richard-gong/craft-a-language/blob/master/05/semantic.ts#L185" target="_blank" rel="noreferrer">RefResolver类</a>）。在下面的示例程序中，你会注意到，程序是沿着作用域的层级结构，逐级查找符号的。这是因为，TypeScript或JavaScript中的函数，允许访问函数外面声明的变量。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 变量引用消解</span></span>
<span class="line"><span> * @param variable</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>visitVariable(variable: Variable):any{</span></span>
<span class="line"><span>    //从当前作用域逐级向上查找，确定该变量的符号</span></span>
<span class="line"><span>    let symbol = (this.scope as Scope).getSymbolCascade(variable.name);</span></span>
<span class="line"><span>    if (symbol != null &amp;&amp; symbol.kind == SymKind.Variable){</span></span>
<span class="line"><span>        variable.sym = symbol as VarSymbol;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else{</span></span>
<span class="line"><span>        console.log(&quot;Error: cannot find declaration of variable &quot; + variable.name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>好了，通过更新建立符号表的程序和引用消解的程序，我们可以把函数的作用域跟全局作用域区分开了。我们现在可以针对这节课一开篇的那个circleArea示例程序运行一下语义分析程序，会输出下面的符号表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/febc62ba728be664cdcb8af9992bfcd8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/febc62ba728be664cdcb8af9992bfcd8.png" alt="图片"></a></p><p>你会看到，现在作用域已经分成了两级：主函数(_main)和circleArea函数。两级作用域都有一个本地变量r，其中circleArea中的r是函数参数。这证明我们划分不同变量的作用域的努力是成功的。</p><p>不过，虽然区分了变量的作用域，我们还需要给函数内的本地变量设置正确的生存期。在函数运行结束以后，它的本地变量所占据的内存就应该被回收，避免造成内存使用上的浪费，甚至导致内存泄漏。</p><p>为了正确管理本地变量的生存期，我们需要更新当前的解释器，并引入一个栈桢（Stack Frame）的机制。</p><h2 id="解释器-实现栈桢" tabindex="-1">解释器：实现栈桢 <a class="header-anchor" href="#解释器-实现栈桢" aria-label="Permalink to &quot;解释器：实现栈桢&quot;">​</a></h2><p>在现代语言中，本地变量基本上都是通过栈来管理的，栈又是由一个个的栈桢组成的，所以函数的调用层次，就体现在了栈桢上。</p><p>每个函数对应着一个栈桢，在调用一个函数时，就会往栈里压入一个新的栈桢，用来保存支撑该函数运行的相关信息。在退出函数时，该栈桢就会被弹出。这样，随着函数的调用和退出，栈就会不停地伸缩。</p><p>我们以下面的示例程序为例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function foo(){</span></span>
<span class="line"><span>  some statement</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function bar(){</span></span>
<span class="line"><span>  foo();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>bar();</span></span></code></pre></div><p>当我们在主程序中调用bar的时候，bar又会调用foo，在程序运行过程中栈桢的变化如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/e9cb45964787b526927b090c8f8c7933.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/e9cb45964787b526927b090c8f8c7933.jpg" alt="图片"></a></p><p>栈桢保存着与一个函数正确运行有关的各种信息，其中最重要的就是本地变量的值以及参数的值，其他还有返回值等信息。不过，对于不同的语言来说，栈桢的具体设计可以是不同的，但基本原理是一样的。</p><p>在某些编译原理的教科书上，你还会看到“活动记录（Activation Record）”这样一个概念。它跟栈桢的意思是差不多的。</p><p>只不过，栈桢有时候指的是更加物理层面的设计。当程序以本地代码的形式运行时，为了提高性能，我们会把尽量多的数据放在寄存器，而不是放在内存的栈桢里。</p><p>而相对来说，活动记录是逻辑意义上一个函数运行过程中所需要维护的状态信息，不管放在栈桢里还是寄存器里，它们都属于该函数的活动记录。</p><p>好，回到我们自己的解释器上来。我们通过引入栈桢这么一个数据结构（参见 <a href="https://gitee.com/richard-gong/craft-a-language/blob/master/05/play.ts#L380" target="_blank" rel="noreferrer">StackFrame类</a>），通过动态的构建和释放栈桢，我们就能管理好本地变量的生存期。栈桢的设计也很简单，包括变量的值和返回值，你可以看看下面这个代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 栈桢</span></span>
<span class="line"><span> * 每个函数对应一级栈桢.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>class StackFrame{</span></span>
<span class="line"><span>    //存储变量的值</span></span>
<span class="line"><span>    values:Map&lt;​string, any&gt; = new Map();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回值，当调用函数的时候，返回值放在这里</span></span>
<span class="line"><span>    retVal:any = undefined;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于我们目前的运行时是基于node.js实现的，所以当我们释放栈桢时，实际上是通过V8的垃圾收集机制回收内存的。如果我们把运行时改为用C语言单独实现，就可以实时释放了。</p><p>接着再修改我们的解释器（参见 <a href="https://gitee.com/richard-gong/craft-a-language/blob/master/05/play.ts#L23" target="_blank" rel="noreferrer">Interprator类</a>），让它支持栈桢。这其中，最关键的就是调用函数的程序，它要负责栈桢的创建和释放。请看下面的参考实现：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 运行函数调用。</span></span>
<span class="line"><span> * 原理：根据函数定义，执行其函数体。</span></span>
<span class="line"><span> * @param functionCall</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>visitFunctionCall(functionCall:FunctionCall):any{</span></span>
<span class="line"><span>    if (functionCall.name == &quot;println&quot;){ //内置函数</span></span>
<span class="line"><span>        return this.println(functionCall);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(functionCall.sym != null){</span></span>
<span class="line"><span>        //清空返回值</span></span>
<span class="line"><span>        this.currentFrame.retVal = undefined;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //1.创建新栈桢</span></span>
<span class="line"><span>        let frame = new StackFrame();</span></span>
<span class="line"><span>        //2.计算参数值，并保存到新创建的栈桢</span></span>
<span class="line"><span>        let functionDecl = functionCall.sym.node as FunctionDecl;</span></span>
<span class="line"><span>        if (functionDecl.callSignature.paramList != null){</span></span>
<span class="line"><span>            let params = functionDecl.callSignature.paramList.params;</span></span>
<span class="line"><span>            for (let i = 0; i&lt; params.length; i++){</span></span>
<span class="line"><span>                let variableDecl = params[i];</span></span>
<span class="line"><span>                let val = this.needLeftValue(this.visit(functionCall.arguments[i]));</span></span>
<span class="line"><span>                frame.values.set(variableDecl.name, val);  //设置到新的frame里。</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //3.把新栈桢入栈</span></span>
<span class="line"><span>        this.pushFrame(frame);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //4.执行函数</span></span>
<span class="line"><span>        this.visit(functionDecl.body);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //5.弹出当前的栈桢</span></span>
<span class="line"><span>        this.popFrame();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //6.函数的返回值</span></span>
<span class="line"><span>        return this.currentFrame.retVal;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else{</span></span>
<span class="line"><span>        console.log(&quot;Runtime error, cannot find declaration of &quot; + functionCall.name +&quot;.&quot;);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这个示例程序中，你会看到调用一个函数的完整的过程，包括传递参数的过程，以及在调用函数前后将栈桢入栈和出栈的过程。</p><p>并且，在退出函数的时候，如果我们执行了一个Return语句，并且带有返回值，那么该返回值就会被设置到上一级栈桢中。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 处理Return语句时，要把返回值封装成一个特殊的对象，用于中断后续程序的执行。</span></span>
<span class="line"><span> * @param returnStatement</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>visitReturnStatement(returnStatement: ReturnStatement):any{</span></span>
<span class="line"><span>    let retVal:any;</span></span>
<span class="line"><span>    if (returnStatement.exp != null){</span></span>
<span class="line"><span>        retVal = this.needLeftValue(this.visit(returnStatement.exp));</span></span>
<span class="line"><span>        this.setReturnValue(retVal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return new ReturnValue(retVal);  //这里是传递一个信号，让Block和for循环等停止执行。</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//把返回值设置到上一级栈桢中（也就是调用者的栈桢）</span></span>
<span class="line"><span>private setReturnValue(retVal:any){</span></span>
<span class="line"><span>    let frame = this.callStack[this.callStack.length-2];</span></span>
<span class="line"><span>    frame.retVal = retVal;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，关于Return语句，我们还有一个重要的机制需要注意。当程序遇到Return语句的时候，后面的代码就不执行了，直接退出函数。</p><p>可是，我们当前的解释器，是通过遍历AST来实现的。那么，缺省我们是会遍历每棵子树，也就是执行每个语句。可是，return语句又要求程序跳过某些语句，这应该如何实现呢？</p><p>我给你一个解决方案。上面的示例代码中，在visitReturnStatement方法的最后一句，你会看到示例代码中返回了一个ReturnValue对象。这里，我相当于做了一个特殊的标记。在遍历树的时候，告诉上一级函数，这里遇到了一个return语句，这样就可以跳过后面的语句了。</p><p>我们再来看一下visitBlock中的代码，当检测出某个语句返回的是ReturnValue对象的时候，就会中断该Block的执行。并且，你还看到，visitBlock接着把这个ReturnValue对象往外抛，这是考虑到Block会嵌套的情况。在下一节，当我们使用if语句和for循环语句的时候，就会遇到这种情况。但是，不管嵌套了多少个Block，程序的执行流程都会一直往外跳，直到整个当前函数停止运行。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 遍历一个块</span></span>
<span class="line"><span> * @param block</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>visitBlock(block:Block):any{</span></span>
<span class="line"><span>    let retVal:any;</span></span>
<span class="line"><span>    for(let x of block.stmts){</span></span>
<span class="line"><span>        retVal = this.visit(x);</span></span>
<span class="line"><span>        //如果当前执行了一个返回语句，那么就直接返回，不再执行后面的语句。</span></span>
<span class="line"><span>        //如果存在上一级Block，也是中断执行，直接返回。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (typeof retVal == &#39;object&#39; &amp;&amp;</span></span>
<span class="line"><span>            ReturnValue.isReturnValue(retVal)){</span></span>
<span class="line"><span>            return retVal;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return retVal;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，你也会看到，基于AST的解释器在处理像return这样的流程跳转语句的时候，其实是比较困难的。其他流程跳转语句还包括break、continue这种，处理起来也都比较麻烦。这也是后面我们会引入一个新的解释器——基于字节码的解释器的原因之一。</p><p>好了，到目前为止，我们这节课的任务就完成了。我们的函数可以支持参数和返回值了，成为了真正意义上的函数。现在，你就可以试着写几个函数，来验证一下我们语言的功能了，比如，我运行了一下下面的示例程序，用来打印不同半径的圆的面积：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function circleArea(r : number):number{</span></span>
<span class="line"><span>  let area : number = 3.14*r*r;</span></span>
<span class="line"><span>  return area;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>let r:number =4;</span></span>
<span class="line"><span>println(&quot;r=&quot; + r +&quot;, area=&quot;+circleArea(r));</span></span>
<span class="line"><span>r = 5;</span></span>
<span class="line"><span>println(&quot;r=&quot; + r +&quot;, area=&quot;+circleArea(r));</span></span></code></pre></div><p>运行该程序，可以得到下面的输出结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/2822bb05c8c46a99aa9d3dde2cd47b0c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/2822bb05c8c46a99aa9d3dde2cd47b0c.png" alt="图片"></a></p><p>看来，函数的传参功能和返回值功能运行都正常。</p><p>如果你喜欢动手，还可以在解释器里加一些调试代码，打印程序运行期间栈和栈桢的情况，加深对栈桢机制的理解。</p><p>最后，我们再加一个小彩蛋。也就是不知不觉间，其实我们的语言已经支持在函数内部声明函数了。</p><h2 id="彩蛋-在函数内部声明的函数" tabindex="-1">彩蛋：在函数内部声明的函数 <a class="header-anchor" href="#彩蛋-在函数内部声明的函数" aria-label="Permalink to &quot;彩蛋：在函数内部声明的函数&quot;">​</a></h2><p>仔细审视我们当前的语法规则，你会发现，函数声明是一种语句。而我们在任何一个Block里面，包括函数体里面，允许各种类型的语句，那当然也就允许声明函数。在下面的示例代码中，我把circleArea函数改写了一下，里面声明了一个inner函数：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function circleArea(a:number):number{</span></span>
<span class="line"><span>    function inner(b:number):number{</span></span>
<span class="line"><span>        return b*b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 3.14*inner(a);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>let r:number =4;</span></span>
<span class="line"><span>println(&quot;r=&quot; + r +&quot;, area=&quot;+circleArea(r));</span></span>
<span class="line"><span>r = 5;</span></span>
<span class="line"><span>println(&quot;r=&quot; + r +&quot;, area=&quot;+circleArea(r));</span></span></code></pre></div><p>下图是circleArea对应的AST，你看到，函数声明内部又嵌套了另一个函数声明。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/548ayy7d8d68d9bbdb4ca5f499ee1816.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/548ayy7d8d68d9bbdb4ca5f499ee1816.png" alt="图片"></a></p><p>在函数体内部声明的函数，其作用域只在函数内部，这在程序输出的符号表中能够看出来。inner函数是circleArea中的一个符号，整个程序形成了三级作用域，分别是主函数(_main)、circleArea和inner。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/6913e71yy01642480e5759e58762549a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%89%8B%E6%8A%8A%E6%89%8B%E5%B8%A6%E4%BD%A0%E5%86%99%E4%B8%80%E9%97%A8%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/images/408912/6913e71yy01642480e5759e58762549a.png" alt="图片"></a></p><p>你可以运行一下使用内部函数版本的circleArea，它也完全能正常运行，我们并不需要为支持内部函数而做什么特殊的事情！从这里，你也能看出在我们实现计算机语言的过程中，有一个很有魔力的地方： <strong>只要你制定</strong> <strong>了规则，你的语言就会遵守该规则运行，哪怕有些运行场景你自己都没有意识到。</strong> 你在后面也会越来越多地体会到这一点。</p><p>不过，目前我们只是支持了内部函数而已，还没有高级函数的特性，也就是把函数本身当做参数和返回值来传递。这个过程中，通常又会涉及到闭包特性，我们会在后面的课程中涉及到这个知识点。那个时候，我们会在已经编译成本地代码的版本中讨论实现函数式编程涉及的知识点。</p><h2 id="课程小结" tabindex="-1">课程小结 <a class="header-anchor" href="#课程小结" aria-label="Permalink to &quot;课程小结&quot;">​</a></h2><p>好了，到这里我们今天的课就结束了，让我们来简单回顾一下吧。</p><p>这节课我们继续迭代和增强了我们的语言，让它支持了完整的函数功能。在这个过程中，我们仍然要把语法分析功能、语义分析功能和基于AST的解释器都升级一遍。</p><p>在这个过程中，比较重要的知识点有三个。</p><p>首先是作用域。通过Scope对象，我们让符号表变成了一个层次结构，让不同的变量和函数归属到不同层次的作用域。在现代语言中，符号表通常都是采用类似的层次结构来保存的。</p><p>第二个知识点是栈桢。在运行期，通过采用栈桢，我们可以让函数的本地变量的生存期与函数的生存期相一致，从而达到节省内存的目的。</p><p>最后，我们也讨论了return语句的实现机制。返回值是被保存到上一级栈桢的返回值字段的。并且，通过特殊设计的机制，我们保证了在遇到return语句的时候，程序会跳过其他的语句，直接从函数中退回。</p><p>在下一节课里，我们借助if语句和for循环语句，会进一步加深你对作用域的理解。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>今天，我给你留了两个思考题：</p><p>1.在函数声明相关的语法规则中，parameter的Follow集合是什么？有什么作用？</p><p>2.在这节课中，我们是同等看待参数和本地变量的。但是，它们在使用起来真的没有差别吗？请你试着分析一下。</p><p>欢迎在留言区给我留言。感谢你和我一起学习，如果你觉得这节课讲得还不错，也欢迎分享给更多感兴趣的朋友。我是宫文学，我们下节课见。</p><h2 id="资源链接" tabindex="-1">资源链接 <a class="header-anchor" href="#资源链接" aria-label="Permalink to &quot;资源链接&quot;">​</a></h2><p><a href="https://gitee.com/richard-gong/craft-a-language/tree/master/05" target="_blank" rel="noreferrer">这节课的代码在这里！</a></p>`,93)])])}const b=a(l,[["render",i]]);export{g as __pageData,b as default};
