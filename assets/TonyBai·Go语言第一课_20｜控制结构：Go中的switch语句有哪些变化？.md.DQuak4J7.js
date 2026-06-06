import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"20｜控制结构：Go中的switch语句有哪些变化？","description":"","frontmatter":{},"headers":[{"level":2,"title":"认识switch语句","slug":"认识switch语句","link":"#认识switch语句","children":[]},{"level":2,"title":"switch语句的灵活性","slug":"switch语句的灵活性","link":"#switch语句的灵活性","children":[]},{"level":2,"title":"type switch","slug":"type-switch","link":"#type-switch","children":[]},{"level":2,"title":"跳不出循环的break","slug":"跳不出循环的break","link":"#跳不出循环的break","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/20｜控制结构：Go中的switch语句有哪些变化？.md","filePath":"TonyBai·Go语言第一课/20｜控制结构：Go中的switch语句有哪些变化？.md","lastUpdated":1779817248000}'),i={name:"TonyBai·Go语言第一课/20｜控制结构：Go中的switch语句有哪些变化？.md"};function l(t,s,c,o,h,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_20-控制结构-go中的switch语句有哪些变化" tabindex="-1">20｜控制结构：Go中的switch语句有哪些变化？ <a class="header-anchor" href="#_20-控制结构-go中的switch语句有哪些变化" aria-label="Permalink to &quot;20｜控制结构：Go中的switch语句有哪些变化？&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>经过前两节课的学习，我们已经掌握了控制结构中的分支结构以及循环结构。前面我们也提到过，在计算机世界中，再复杂的算法都可以通过顺序、分支和循环这三种基本的控制结构构造出来。所以，理论上讲，我们现在已经具备了实现任何算法的能力了。</p><p>不过理论归理论，我们还是要回到现实中来，继续学习Go语言中的控制结构，现在我们还差一种分支控制结构没讲。除了if语句之外，Go语言还提供了一种更适合多路分支执行的分支控制结构，也就是 <strong>switch语句</strong>。</p><p>今天这一节课，我们就来系统学习一下switch语句。Go语言中的switch语句继承自它的先祖C语言，所以我们这一讲的重点是Go switch语句相较于C语言的switch，有哪些重要的改进与创新。</p><p>在讲解改进与创新之前，我们先来认识一下switch语句。</p><h2 id="认识switch语句" tabindex="-1">认识switch语句 <a class="header-anchor" href="#认识switch语句" aria-label="Permalink to &quot;认识switch语句&quot;">​</a></h2><p>我们先通过一个例子来直观地感受一下switch语句的优点。在一些执行分支较多的场景下，使用switch分支控制语句可以让代码更简洁，可读性更好。</p><p>比如下面例子中的readByExt函数会根据传入的文件扩展名输出不同的日志，它使用了if语句进行分支控制：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func readByExt(ext string) {</span></span>
<span class="line"><span>    if ext == &quot;json&quot; {</span></span>
<span class="line"><span>        println(&quot;read json file&quot;)</span></span>
<span class="line"><span>    } else if ext == &quot;jpg&quot; || ext == &quot;jpeg&quot; || ext == &quot;png&quot; || ext == &quot;gif&quot; {</span></span>
<span class="line"><span>        println(&quot;read image file&quot;)</span></span>
<span class="line"><span>    } else if ext == &quot;txt&quot; || ext == &quot;md&quot; {</span></span>
<span class="line"><span>        println(&quot;read text file&quot;)</span></span>
<span class="line"><span>    } else if ext == &quot;yml&quot; || ext == &quot;yaml&quot; {</span></span>
<span class="line"><span>        println(&quot;read yaml file&quot;)</span></span>
<span class="line"><span>    } else if ext == &quot;ini&quot; {</span></span>
<span class="line"><span>        println(&quot;read ini file&quot;)</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        println(&quot;unsupported file extension:&quot;, ext)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果用switch改写上述例子代码，我们可以这样来写：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func readByExtBySwitch(ext string) {</span></span>
<span class="line"><span>    switch ext {</span></span>
<span class="line"><span>    case &quot;json&quot;:</span></span>
<span class="line"><span>        println(&quot;read json file&quot;)</span></span>
<span class="line"><span>    case &quot;jpg&quot;, &quot;jpeg&quot;, &quot;png&quot;, &quot;gif&quot;:</span></span>
<span class="line"><span>        println(&quot;read image file&quot;)</span></span>
<span class="line"><span>    case &quot;txt&quot;, &quot;md&quot;:</span></span>
<span class="line"><span>        println(&quot;read text file&quot;)</span></span>
<span class="line"><span>    case &quot;yml&quot;, &quot;yaml&quot;:</span></span>
<span class="line"><span>        println(&quot;read yaml file&quot;)</span></span>
<span class="line"><span>    case &quot;ini&quot;:</span></span>
<span class="line"><span>        println(&quot;read ini file&quot;)</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;unsupported file extension:&quot;, ext)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码呈现的角度来看，针对这个例子，使用switch语句的实现要比if语句的实现更加简洁紧凑。并且，即便你这个时候还没有系统学过switch语句，相信你也能大致读懂上面readByExtBySwitch的执行逻辑。</p><p>简单来说，readByExtBySwitch函数就是将输入参数ext与每个case语句后面的表达式做比较，如果相等，就执行这个case语句后面的分支，然后函数返回。这里具体的执行逻辑，我们在后面再分析，现在你有个大概认识就好了。</p><p>接下来，我们就来进入正题，来看看Go语言中switch语句的一般形式：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>switch initStmt; expr {</span></span>
<span class="line"><span>    case expr1:</span></span>
<span class="line"><span>        // 执行分支1</span></span>
<span class="line"><span>    case expr2:</span></span>
<span class="line"><span>        // 执行分支2</span></span>
<span class="line"><span>    case expr3_1, expr3_2, expr3_3:</span></span>
<span class="line"><span>        // 执行分支3</span></span>
<span class="line"><span>    case expr4:</span></span>
<span class="line"><span>        // 执行分支4</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>    case exprN:</span></span>
<span class="line"><span>        // 执行分支N</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        // 执行默认分支</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们按语句顺序来分析一下。首先看这个switch语句一般形式中的第一行，这一行由switch关键字开始，它的后面通常接着一个表达式（expr），这句中的initStmt是一个可选的组成部分。和if、for语句一样，我们可以在initStmt中通过短变量声明定义一些在switch语句中使用的临时变量。</p><p>接下来，switch后面的大括号内是一个个代码执行分支，每个分支以case关键字开始，每个case后面是一个表达式或是一个逗号分隔的表达式列表。这里还有一个以default关键字开始的特殊分支，被称为 <strong>默认分支</strong>。</p><p>最后，我们再来看switch语句的执行流程。其实也很简单，switch语句会用expr的求值结果与各个case中的表达式结果进行比较，如果发现匹配的case，也就是case后面的表达式，或者表达式列表中任意一个表达式的求值结果与expr的求值结果相同，那么就会执行该case对应的代码分支，分支执行后，switch语句也就结束了。如果所有case表达式都无法与expr匹配，那么程序就会执行default默认分支，并且结束switch语句。</p><p>那么问题就来了！在有多个case执行分支的switch语句中， <strong>Go是按什么次序对各个case表达式进行求值，并且与switch表达式（expr）进行比较的</strong>？</p><p>我们通过一段示例代码来回答这个问题。这是一个一般形式的switch语句，为了能呈现switch语句的执行次序，我以多个输出特定日志的函数作为switch表达式以及各个case表达式：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func case1() int {</span></span>
<span class="line"><span>    println(&quot;eval case1 expr&quot;)</span></span>
<span class="line"><span>    return 1</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func case2_1() int {</span></span>
<span class="line"><span>    println(&quot;eval case2_1 expr&quot;)</span></span>
<span class="line"><span>    return 0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func case2_2() int {</span></span>
<span class="line"><span>    println(&quot;eval case2_2 expr&quot;)</span></span>
<span class="line"><span>    return 2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func case3() int {</span></span>
<span class="line"><span>    println(&quot;eval case3 expr&quot;)</span></span>
<span class="line"><span>    return 3</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func switchexpr() int {</span></span>
<span class="line"><span>    println(&quot;eval switch expr&quot;)</span></span>
<span class="line"><span>    return 2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    switch switchexpr() {</span></span>
<span class="line"><span>    case case1():</span></span>
<span class="line"><span>        println(&quot;exec case1&quot;)</span></span>
<span class="line"><span>    case case2_1(), case2_2():</span></span>
<span class="line"><span>        println(&quot;exec case2&quot;)</span></span>
<span class="line"><span>    case case3():</span></span>
<span class="line"><span>        println(&quot;exec case3&quot;)</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;exec default&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行一下这个示例程序，我们得到如下结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>eval switch expr</span></span>
<span class="line"><span>eval case1 expr</span></span>
<span class="line"><span>eval case2_1 expr</span></span>
<span class="line"><span>eval case2_2 expr</span></span>
<span class="line"><span>exec case2</span></span></code></pre></div><p>从输出结果中我们看到，Go先对switch expr表达式进行求值，然后再按case语句的出现顺序，从上到下进行逐一求值。在带有表达式列表的case语句中，Go会从左到右，对列表中的表达式进行求值，比如示例中的case2_1函数就执行于case2_2函数之前。</p><p>如果switch表达式匹配到了某个case表达式，那么程序就会执行这个case对应的代码分支，比如示例中的“exec case2”。这个分支后面的case表达式将不会再得到求值机会，比如示例不会执行case3函数。这里要注意一点，即便后面的case表达式求值后也能与switch表达式匹配上，Go也不会继续去对这些表达式进行求值了。</p><p>除了这一点外，你还要注意default分支。 <strong>无论default分支出现在什么位置，它都只会在所有case都没有匹配上的情况下才会被执行的。</strong></p><p>不知道你有没有发现，这里其实有一个优化小技巧，考虑到switch语句是按照case出现的先后顺序对case表达式进行求值的，那么如果我们将匹配成功概率高的case表达式排在前面，就会有助于提升switch语句执行效率。这点对于case后面是表达式列表的语句同样有效，我们可以将匹配概率最高的表达式放在表达式列表的最左侧。</p><p>到这里，我们已经了解了switch语句的一般形式以及执行次序。有了这个基础后，接下来我们就来看看这节课重点：Go语言的switch语句和它的“先祖”C语言中的Switch语句相比，都有哪些优化与创新？</p><h2 id="switch语句的灵活性" tabindex="-1">switch语句的灵活性 <a class="header-anchor" href="#switch语句的灵活性" aria-label="Permalink to &quot;switch语句的灵活性&quot;">​</a></h2><p>为方便对比，我们先来简单了解一下C语言中的switch语句。C语言中的switch语句对表达式类型有限制，每个case语句只可以有一个表达式。而且，除非你显式使用break跳出，程序默认总是执行下一个case语句。这些特性开发人员带来了使用上的心智负担。</p><p>相较于C语言中switch语句的“死板”，Go的switch语句表现出极大的灵活性，主要表现在如下几方面：</p><p><strong>首先，switch语句各表达式的求值结果可以为各种类型值，只要它的类型支持比较操作就可以了。</strong></p><p>C语言中，switch语句中使用的所有表达式的求值结果只能是int或枚举类型，其他类型都会被C编译器拒绝。</p><p>Go语言就宽容得多了，只要类型支持比较操作，都可以作为switch语句中的表达式类型。比如整型、布尔类型、字符串类型、复数类型、元素类型都是可比较类型的数组类型，甚至字段类型都是可比较类型的结构体类型，也可以。下面就是一个使用自定义结构体类型作为switch表达式类型的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type person struct {</span></span>
<span class="line"><span>    name string</span></span>
<span class="line"><span>    age  int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    p := person{&quot;tom&quot;, 13}</span></span>
<span class="line"><span>    switch p {</span></span>
<span class="line"><span>    case person{&quot;tony&quot;, 33}:</span></span>
<span class="line"><span>        println(&quot;match tony&quot;)</span></span>
<span class="line"><span>    case person{&quot;tom&quot;, 13}:</span></span>
<span class="line"><span>        println(&quot;match tom&quot;)</span></span>
<span class="line"><span>    case person{&quot;lucy&quot;, 23}:</span></span>
<span class="line"><span>        println(&quot;match lucy&quot;)</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;no match&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，实际开发过程中，以结构体类型为switch表达式类型的情况并不常见，这里举这个例子仅是为了说明Go switch语句对各种类型支持的广泛性。</p><p>而且，当switch表达式的类型为布尔类型时，如果求值结果始终为true，那么我们甚至可以省略switch后面的表达式，比如下面例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 带有initStmt语句的switch语句</span></span>
<span class="line"><span>switch initStmt; {</span></span>
<span class="line"><span>    case bool_expr1:</span></span>
<span class="line"><span>    case bool_expr2:</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 没有initStmt语句的switch语句</span></span>
<span class="line"><span>switch {</span></span>
<span class="line"><span>    case bool_expr1:</span></span>
<span class="line"><span>    case bool_expr2:</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，这里要注意，在带有initStmt的情况下，如果我们省略switch表达式，那么initStmt后面的分号不能省略，因为initStmt是一个语句。</p><p><strong>第二点：switch语句支持声明临时变量。</strong></p><p>在前面介绍switch语句的一般形式中，我们看到，和if、for等控制结构语句一样，switch语句的initStmt可用来声明只在这个switch隐式代码块中使用的变量，这种就近声明的变量最大程度地缩小了变量的作用域。</p><p><strong>第三点：case语句支持表达式列表。</strong></p><p>在C语言中，如果要让多个case分支的执行相同的代码逻辑，我们只能通过下面的方式实现：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void check_work_day(int a) {</span></span>
<span class="line"><span>    switch(a) {</span></span>
<span class="line"><span>        case 1:</span></span>
<span class="line"><span>        case 2:</span></span>
<span class="line"><span>        case 3:</span></span>
<span class="line"><span>        case 4:</span></span>
<span class="line"><span>        case 5:</span></span>
<span class="line"><span>            printf(&quot;it is a work day\\n&quot;);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case 6:</span></span>
<span class="line"><span>        case 7:</span></span>
<span class="line"><span>            printf(&quot;it is a weekend day\\n&quot;);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            printf(&quot;do you live on earth?\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这段C代码中，case 1~case 5匹配成功后，执行的都是case 5中的代码逻辑，case 6~case 7匹配成功后，执行的都是case 7中的代码逻辑。</p><p>之所以可以实现这样的逻辑，是因为当C语言中的switch语句匹配到某个case后，如果这个case对应的代码逻辑中没有break语句，那么代码将继续执行下一个case。比如当a = 3时，case 3后面的代码为空逻辑，并且没有break语句，那么C会继续向下执行case4、case5，直到在case 5中调用了break，代码执行流才离开switch语句。</p><p>这样看，虽然C也能实现多case语句执行同一逻辑的功能，但在case分支较多的情况下，代码会显得十分冗长。</p><p>Go语言中的处理要好得多。Go语言中，switch语句在case中支持表达式列表。我们可以用表达式列表实现与上面的示例相同的处理逻辑：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func checkWorkday(a int) {</span></span>
<span class="line"><span>    switch a {</span></span>
<span class="line"><span>    case 1, 2, 3, 4, 5:</span></span>
<span class="line"><span>        println(&quot;it is a work day&quot;)</span></span>
<span class="line"><span>    case 6, 7:</span></span>
<span class="line"><span>        println(&quot;it is a weekend day&quot;)</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;are you live on earth&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据前面我们讲过的switch语句的执行次序，理解上面这个例子应该不难。和C语言实现相比，使用case表达式列表的Go实现简单、清晰、易懂。</p><p><strong>第四点：取消了默认执行下一个case代码逻辑的语义。</strong></p><p>在前面的描述和check_work_day这个C代码示例中，你都能感受到，在C语言中，如果匹配到的case对应的代码分支中没有显式调用break语句，那么代码将继续执行下一个case的代码分支，这种“隐式语义”并不符合日常算法的常规逻辑，这也经常被诟病为C语言的一个缺陷。要修复这个缺陷，我们只能在每个case执行语句中都显式调用break。</p><p>Go语言中的Swith语句就修复了C语言的这个缺陷，取消了默认执行下一个case代码逻辑的“非常规”语义，每个case对应的分支代码执行完后就结束switch语句。</p><p>如果在少数场景下，你需要执行下一个case的代码逻辑，你可以显式使用Go提供的关键字fallthrough来实现，这也是Go“显式”设计哲学的一个体现。下面就是一个使用fallthrough的switch语句的例子，我们简单来看一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func case1() int {</span></span>
<span class="line"><span>    println(&quot;eval case1 expr&quot;)</span></span>
<span class="line"><span>    return 1</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func case2() int {</span></span>
<span class="line"><span>    println(&quot;eval case2 expr&quot;)</span></span>
<span class="line"><span>    return 2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func switchexpr() int {</span></span>
<span class="line"><span>    println(&quot;eval switch expr&quot;)</span></span>
<span class="line"><span>    return 1</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    switch switchexpr() {</span></span>
<span class="line"><span>    case case1():</span></span>
<span class="line"><span>        println(&quot;exec case1&quot;)</span></span>
<span class="line"><span>        fallthrough</span></span>
<span class="line"><span>    case case2():</span></span>
<span class="line"><span>        println(&quot;exec case2&quot;)</span></span>
<span class="line"><span>        fallthrough</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;exec default&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行一下这个示例程序，我们得到这样的结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>eval switch expr</span></span>
<span class="line"><span>eval case1 expr</span></span>
<span class="line"><span>exec case1</span></span>
<span class="line"><span>exec case2</span></span>
<span class="line"><span>exec default</span></span></code></pre></div><p>我们看到，switch expr的求值结果与case1匹配成功，Go执行了case1对应的代码分支。而且，由于case1代码分支中显式使用了fallthrough，执行完case1后，代码执行流并没有离开switch语句，而是继续执行下一个case，也就是case2的代码分支。</p><p>这里有一个注意点，由于fallthrough的存在，Go不会对case2的表达式做求值操作，而会直接执行case2对应的代码分支。而且，在这里case2中的代码分支也显式使用了fallthrough，于是最后一个代码分支，也就是default分支对应的代码也被执行了。</p><p>另外，还有一点要注意的是，如果某个case语句已经是switch语句中的最后一个case了，并且它的后面也没有default分支了，那么这个case中就不能再使用fallthrough，否则编译器就会报错。</p><p>到这里，我们看到Go的switch语句不仅修复了C语言switch的缺陷，还为Go开发人员提供了更大的灵活性，我们可以使用更多类型表达式作为switch表达式类型，也可以使用case表达式列表简化实现逻辑，还可以自行根据需要，确定是否使用fallthrough关键字继续向下执行下一个case的代码分支。</p><p>除了这些之外，Go语言的switch语句还支持求值结果为类型信息的表达式，也就是type switch语句，接下来我们就详细分析一下。</p><h2 id="type-switch" tabindex="-1">type switch <a class="header-anchor" href="#type-switch" aria-label="Permalink to &quot;type switch&quot;">​</a></h2><p>“type switch”这是一种特殊的switch语句用法，我们通过一个例子来看一下它具体的使用形式：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var x interface{} = 13</span></span>
<span class="line"><span>    switch x.(type) {</span></span>
<span class="line"><span>    case nil:</span></span>
<span class="line"><span>        println(&quot;x is nil&quot;)</span></span>
<span class="line"><span>    case int:</span></span>
<span class="line"><span>        println(&quot;the type of x is int&quot;)</span></span>
<span class="line"><span>    case string:</span></span>
<span class="line"><span>        println(&quot;the type of x is string&quot;)</span></span>
<span class="line"><span>    case bool:</span></span>
<span class="line"><span>        println(&quot;the type of x is string&quot;)</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;don&#39;t support the type&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，这个例子中switch语句的形式与前面是一致的，不同的是switch与case两个关键字后面跟着的表达式。</p><p>switch关键字后面跟着的表达式为 <code>x.(type)</code> ，这种表达式形式是switch语句专有的，而且也只能在switch语句中使用。这个表达式中的 <strong>x必须是一个接口类型变量</strong>，表达式的求值结果是这个接口类型变量对应的动态类型。</p><p>什么是一个接口类型的动态类型呢？我们简单解释一下。以上面的代码 <code>var x interface{} = 13</code> 为例，x是一个接口类型变量，它的静态类型为 <code>interface{}</code> ，如果我们将整型值13赋值给x，x这个接口变量的动态类型就为int。关于接口类型变量的动态类型，我们后面还会详细讲，这里先简单了解一下就可以了。</p><p>接着，case关键字后面接的就不是普通意义上的表达式了，而是一个个具体的类型。这样，Go就能使用变量x的动态类型与各个case中的类型进行匹配，之后的逻辑就都是一样的了。</p><p>现在我们运行上面示例程序，输出了x的动态变量类型：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>the type of x is int</span></span></code></pre></div><p>不过，通过 <code>x.(type)</code> ，我们除了可以获得变量x的动态类型信息之外，也能获得其动态类型对应的值信息，现在我们把上面的例子改造一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var x interface{} = 13</span></span>
<span class="line"><span>    switch v := x.(type) {</span></span>
<span class="line"><span>    case nil:</span></span>
<span class="line"><span>        println(&quot;v is nil&quot;)</span></span>
<span class="line"><span>    case int:</span></span>
<span class="line"><span>        println(&quot;the type of v is int, v =&quot;, v)</span></span>
<span class="line"><span>    case string:</span></span>
<span class="line"><span>        println(&quot;the type of v is string, v =&quot;, v)</span></span>
<span class="line"><span>    case bool:</span></span>
<span class="line"><span>        println(&quot;the type of v is bool, v =&quot;, v)</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        println(&quot;don&#39;t support the type&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们将switch后面的表达式由 <code>x.(type)</code> 换成了 <code>v := x.(type)</code> 。对于后者，你千万不要认为变量v存储的是类型信息，其实 <strong>v存储的是变量x的动态类型对应的值信息</strong>，这样我们在接下来的case执行路径中就可以使用变量v中的值信息了。</p><p>然后，我们运行上面示例，可以得到v的动态类型和值：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>the type of v is int, v = 13</span></span></code></pre></div><p>另外，你可以发现，在前面的type switch演示示例中，我们一直使用interface{}这种接口类型的变量，Go中所有类型都实现了interface{}类型，所以case后面可以是任意类型信息。</p><p>但如果在switch后面使用了某个特定的接口类型I，那么case后面就只能使用实现了接口类型I的类型了，否则Go编译器会报错。你可以看看这个例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  type I interface {</span></span>
<span class="line"><span>      M()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  type T struct {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> func (T) M() {</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> func main() {</span></span>
<span class="line"><span>     var t T</span></span>
<span class="line"><span>     var i I = t</span></span>
<span class="line"><span>     switch i.(type) {</span></span>
<span class="line"><span>     case T:</span></span>
<span class="line"><span>         println(&quot;it is type T&quot;)</span></span>
<span class="line"><span>     case int:</span></span>
<span class="line"><span>         println(&quot;it is type int&quot;)</span></span>
<span class="line"><span>     case string:</span></span>
<span class="line"><span>         println(&quot;it is type string&quot;)</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>在这个例子中，我们在type switch中使用了自定义的接口类型I。那么，理论上所有case后面的类型都只能是实现了接口I的类型。但在这段代码中，只有类型T实现了接口类型I，Go原生类型int与string都没有实现接口I，于是在编译上述代码时，编译器会报出如下错误信息：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>19:2: impossible type switch case: i (type I) cannot have dynamic type int (missing M method)</span></span>
<span class="line"><span>21:2: impossible type switch case: i (type I) cannot have dynamic type string (missing M method)</span></span></code></pre></div><p>好了，到这里，关于switch语句语法层面的知识就都学习完了。Go对switch语句的优化与增强使得我们在日常使用switch时很少遇到坑，但这也并不意味着没有，最后我们就来看在Go编码过程中，我们可能遇到的一个与switch使用有关的问题，跳不出循环的break。</p><h2 id="跳不出循环的break" tabindex="-1">跳不出循环的break <a class="header-anchor" href="#跳不出循环的break" aria-label="Permalink to &quot;跳不出循环的break&quot;">​</a></h2><p>在上一节课讲解break语句的时候，我们曾举了一个找出整型切片中第一个偶数的例子，当时我们是把for与if语句结合起来实现的。现在，我们把那个例子中if分支结构换成这节课学习的switch分支结构试试看。我们这里直接看改造后的代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var sl = []int{5, 19, 6, 3, 8, 12}</span></span>
<span class="line"><span>    var firstEven int = -1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // find first even number of the interger slice</span></span>
<span class="line"><span>    for i := 0; i &amp;lt; len(sl); i++ {</span></span>
<span class="line"><span>        switch sl[i] % 2 {</span></span>
<span class="line"><span>        case 0:</span></span>
<span class="line"><span>            firstEven = sl[i]</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        case 1:</span></span>
<span class="line"><span>            // do nothing</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    println(firstEven)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们运行一下这个修改后的程序，得到结果为12。</p><p>奇怪，这个输出的值与我们的预期的好像不太一样。这段代码中，切片中的第一个偶数是6，而输出的结果却成了切片的最后一个偶数12。为什么会出现这种结果呢？</p><p>这就是Go中 break语句与switch分支结合使用会出现一个“小坑”。和我们习惯的C家族语言中的break不同，Go语言规范中明确规定， <strong>不带label的break语句中断执行并跳出的，是同一函数内break语句所在的最内层的for、switch或select</strong>。所以，上面这个例子的break语句实际上只跳出了switch语句，并没有跳出外层的for循环，这也就是程序未按我们预期执行的原因。</p><p>要修正这一问题，我们可以利用上节课学到的带label的break语句试试。这里我们也直接看看改进后的代码:</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var sl = []int{5, 19, 6, 3, 8, 12}</span></span>
<span class="line"><span>    var firstEven int = -1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // find first even number of the interger slice</span></span>
<span class="line"><span>loop:</span></span>
<span class="line"><span>    for i := 0; i &amp;lt; len(sl); i++ {</span></span>
<span class="line"><span>        switch sl[i] % 2 {</span></span>
<span class="line"><span>        case 0:</span></span>
<span class="line"><span>            firstEven = sl[i]</span></span>
<span class="line"><span>            break loop</span></span>
<span class="line"><span>        case 1:</span></span>
<span class="line"><span>            // do nothing</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    println(firstEven) // 6</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在改进后的例子中，我们定义了一个label：loop，这个label附在for循环的外面，指代for循环的执行。当代码执行到“break loop”时，程序将停止label loop所指代的for循环的执行。关于带有label的break语句，你可以再回顾一下第19讲，这里就不多说了。</p><p>和switch语句一样能阻拦break跳出的还有一个语句，那就是select，我们后面讲解并发程序设计的时候再来详细分析。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天的课讲到这里就结束了，现在我们一起来回顾一下吧。</p><p>在这一讲中，我们讲解了Go语言提供的另一种分支控制结构：switch语句。和if分支语句相比，在一些执行分支较多的场景下，使用switch分支控制语句可以让代码更简洁、可读性更好。</p><p>Go语言的switch语句继承自C语言，但“青出于蓝而胜于蓝”，Go不但修正了C语言中switch语句默认执行下一个case的“坑”，还对switch语句进行了改进与创新，包括支持更多类型、支持表达式列表等，让switch的表达力得到进一步提升。</p><p>除了使用常规表达式作为switch表达式和case表达式之外，Go switch语句又创新性地支持type switch，也就是用类型信息作为分支条件判断的操作数。在Go中，这种使用方式也是switch所独有的。这里，我们要注意的是只有接口类型变量才能使用type switch，并且所有case语句中的类型必须实现switch关键字后面变量的接口类型。</p><p>最后还需要你记住的是switch会阻拦break语句跳出for循环，就像我们这节课最后那个例子中那样，对于初学者来说，这是一个很容易掉下去的坑，你一定不要走弯路。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>为了验证在多分支下基于switch语句实现的分支控制更为简洁，你可以尝试将这节课中的那些稍复杂一点的例子，改写为基于if条件分支的实现，然后再对比一下两种实现的复杂性，直观体会一下switch语句的优点。</p><p>欢迎你把这节课分享给更多对Go语言中的switch语句感兴趣的朋友。我是Tony Bai，我们下节课见。</p>`,102)])])}const g=n(i,[["render",l]]);export{d as __pageData,g as default};
