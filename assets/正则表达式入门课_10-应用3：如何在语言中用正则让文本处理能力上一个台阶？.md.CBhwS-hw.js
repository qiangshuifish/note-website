import{_ as e,H as t,f as l,i as p,b as a,j as s}from"./chunks/framework.BH2BK_3i.js";const q=JSON.parse('{"title":"10 | 应用3：如何在语言中用正则让文本处理能力上一个台阶？","description":"","frontmatter":{},"headers":[{"level":2,"title":"1.校验文本内容","slug":"_1-校验文本内容","link":"#_1-校验文本内容","children":[{"level":3,"title":"Python","slug":"python","link":"#python","children":[]},{"level":3,"title":"Go","slug":"go","link":"#go","children":[]},{"level":3,"title":"JavaScript","slug":"javascript","link":"#javascript","children":[]},{"level":3,"title":"Java","slug":"java","link":"#java","children":[]}]},{"level":2,"title":"2.提取文本内容","slug":"_2-提取文本内容","link":"#_2-提取文本内容","children":[{"level":3,"title":"Python","slug":"python-1","link":"#python-1","children":[]},{"level":3,"title":"Go","slug":"go-1","link":"#go-1","children":[]},{"level":3,"title":"JavaScript","slug":"javascript-1","link":"#javascript-1","children":[]},{"level":3,"title":"Java","slug":"java-1","link":"#java-1","children":[]}]},{"level":2,"title":"3.替换文本内容","slug":"_3-替换文本内容","link":"#_3-替换文本内容","children":[{"level":3,"title":"Python","slug":"python-2","link":"#python-2","children":[]},{"level":3,"title":"Go","slug":"go-2","link":"#go-2","children":[]},{"level":3,"title":"JavaScript","slug":"javascript-2","link":"#javascript-2","children":[]},{"level":3,"title":"Java","slug":"java-2","link":"#java-2","children":[]}]},{"level":2,"title":"4.切割文本内容","slug":"_4-切割文本内容","link":"#_4-切割文本内容","children":[{"level":3,"title":"Python","slug":"python-3","link":"#python-3","children":[]},{"level":3,"title":"Go","slug":"go-3","link":"#go-3","children":[]},{"level":3,"title":"JavaScript","slug":"javascript-3","link":"#javascript-3","children":[]},{"level":3,"title":"Java","slug":"java-3","link":"#java-3","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"正则表达式入门课/10-应用3：如何在语言中用正则让文本处理能力上一个台阶？.md","filePath":"正则表达式入门课/10-应用3：如何在语言中用正则让文本处理能力上一个台阶？.md","lastUpdated":1779820924000}'),i={name:"正则表达式入门课/10-应用3：如何在语言中用正则让文本处理能力上一个台阶？.md"};function o(c,n,r,u,d,h){return t(),l("div",null,[...n[0]||(n[0]=[p(`<h1 id="_10-应用3-如何在语言中用正则让文本处理能力上一个台阶" tabindex="-1">10 | 应用3：如何在语言中用正则让文本处理能力上一个台阶？ <a class="header-anchor" href="#_10-应用3-如何在语言中用正则让文本处理能力上一个台阶" aria-label="Permalink to &quot;10 | 应用3：如何在语言中用正则让文本处理能力上一个台阶？&quot;">​</a></h1><p>你好，我是伟忠。今天要和你分享的内容是如何在编程语言中使用正则，让文本处理能力上一个台阶。</p><p>现代主流的编程语言几乎都内置了正则模块，很少能见到不支持正则的编程语言。学会在编程语言中使用正则，可以极大地提高文本的处理能力。</p><p>在进行文本处理时，正则解决的问题大概可以分成四类，分别是校验文本内容、提取文本内容、替换文本内容、切割文本内容。在这一节里，我会从功能分类出发，给你讲解在一些常见的编程语言中，如何正确地实现这些功能。</p><h2 id="_1-校验文本内容" tabindex="-1">1.校验文本内容 <a class="header-anchor" href="#_1-校验文本内容" aria-label="Permalink to &quot;1.校验文本内容&quot;">​</a></h2><p>我们先来看一下数据验证，通常我们在网页上输入的手机号、邮箱、日期等，都需要校验。校验的特点在于，整个文本的内容要符合正则，比如要求输入6位数字的时候，输入123456abc 就是不符合要求的。</p><p>下面我们以验证日期格式年月日为例子来讲解，比如2020-01-01，我们使用正则\\d{4}-\\d{2}-\\d{2} 来验证。</p><h3 id="python" tabindex="-1">Python <a class="header-anchor" href="#python" aria-label="Permalink to &quot;Python&quot;">​</a></h3><p>在 Python 中，正则的包名是 re，验证文本可以使用 re.match 或 re.search 的方法，这两个方法的区别在于，re.match 是从开头匹配的，re.search是从文本中找子串。下面是详细的解释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 测试环境 Python3</span></span>
<span class="line"><span>&gt;&gt;&gt; import re</span></span>
<span class="line"><span>&gt;&gt;&gt; re.match(r&#39;\\d{4}-\\d{2}-\\d{2}&#39;, &#39;2020-06-01&#39;)</span></span>
<span class="line"><span>&lt;​re.Match object; span=(0, 10), match=&#39;2020-06-01&#39;&gt;</span></span>
<span class="line"><span># 这个输出是匹配到了，范围是从下标0到下标10，匹配结果是2020-06-01</span></span>
<span class="line"><span># re.search 输出结果也是类似的</span></span></code></pre></div><p><strong>在Python中，校验文本是否匹配的正确方式如下所示：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 测试环境 Python3</span></span>
<span class="line"><span>&gt;&gt;&gt; import re</span></span>
<span class="line"><span>&gt;&gt;&gt; reg = re.compile(r&#39;\\A\\d{4}-\\d{2}-\\d{2}\\Z&#39;)  # 建议先编译，提高效率</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.search(&#39;2020-06-01&#39;) is not None</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.match(&#39;2020-06-01&#39;) is not None  # 使用match时\\A可省略</span></span>
<span class="line"><span>True</span></span></code></pre></div><p>如果不添加 \\A 和 \\Z 的话，我们就可能得到错误的结果。而造成这个错误的主要原因就是，没有完全匹配，而是部分匹配。至于为什么不推荐用 <code>^</code> 和 <code>$</code>，因为在多行模式下，它们的匹配行为会发现变化，相关内容在前面匹配模式中讲解过，要是忘记了你可以返回去回顾一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 错误示范</span></span>
<span class="line"><span>&gt;&gt;&gt; re.match(r&#39;\\d{4}-\\d{2}-\\d{2}&#39;, &#39;2020-06-01abc&#39;) is not None</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span>&gt;&gt;&gt; re.search(r&#39;\\d{4}-\\d{2}-\\d{2}&#39;, &#39;abc2020-06-01&#39;) is not None</span></span>
<span class="line"><span>True</span></span></code></pre></div><h3 id="go" tabindex="-1">Go <a class="header-anchor" href="#go" aria-label="Permalink to &quot;Go&quot;">​</a></h3><p>Go语言（又称Golang）是Google开发的一种静态强类型、编译型、并发型，并具有垃圾回收功能的编程语言。在Go语言中，正则相关的包是 regexp，下面是一个完整可运行的示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>   &quot;fmt&quot;</span></span>
<span class="line"><span>   &quot;regexp&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>   re := regexp.MustCompile(\`\\A\\d{4}-\\d{2}-\\d{2}\\z\`)</span></span>
<span class="line"><span>   // 输出 true</span></span>
<span class="line"><span>   fmt.Println(re.MatchString(&quot;2020-06-01&quot;))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>保存成 main.go ，在配置好go环境的前提下，直接使用命令 go run main.go 运行。不方便本地搭建Go环境的同学，可以点击 <a href="https://play.golang.org/p/bTQJe0mT839" target="_blank" rel="noreferrer">这里</a> 或 <a href="https://repl.it/@twz915/learn-regex#%E6%A0%A1%E9%AA%8C/date.go" target="_blank" rel="noreferrer">这里</a> 进行在线运行测试。</p><p>另外，需要注意的是，和 Python 语言不同，在 Go 语言中，正则尾部断言使用的是 \\z，而不是 \\Z。</p><h3 id="javascript" tabindex="-1">JavaScript <a class="header-anchor" href="#javascript" aria-label="Permalink to &quot;JavaScript&quot;">​</a></h3><p>在JavaScript中没有 \\A 和 \\z，我们可以使用 <code>^</code> 和 <code>$</code> 来表示每行的开头和结尾，默认情况下它们是匹配整个文本的开头或结尾（默认不是多行匹配模式）。在 JavaScript 中校验文本的时候，不要使用多行匹配模式，因为使用多行模式会改变 <code>^</code> 和 <code>$</code> 的匹配行为。</p><p>JavaScript代码可以直接在浏览器的Console中很方便地测试。（进入方式：任意网页上点击鼠标右键，检查，Console）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 方法1</span></span>
<span class="line"><span>/^\\d{4}-\\d{2}-\\d{2}$/.test(&quot;2020-06-01&quot;)  // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 方法2</span></span>
<span class="line"><span>var regex = /^\\d{4}-\\d{2}-\\d{2}$/</span></span>
<span class="line"><span>&quot;2020-06-01&quot;.search(regex) == 0</span><span>  // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 方法3</span></span>
<span class="line"><span>var regex = new RegExp(/^\\d{4}-\\d{2}-\\d{2}$/)</span></span>
<span class="line"><span>regex.test(&quot;2020-01-01&quot;) // tru</span></span></code></pre></div><p>方法3本质上和方法1是一样的，方法1写起来更简洁。需要注意的是，在使用 RegExp 对象时，如果使用 g 模式，可能会有意想不到的结果，连续调用会出现第二次返回 false 的情况，就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var r = new RegExp(/^\\d{4}-\\d{2}-\\d{2}$/, &quot;g&quot;)</span></span>
<span class="line"><span>r.test(&quot;2020-01-01&quot;) // true</span></span>
<span class="line"><span>r.test(&quot;2020-01-01&quot;) // false</span></span></code></pre></div><p>这是因为 RegExp 在全局模式下，正则会找出文本中的所有可能的匹配，找到一个匹配时会记下 lastIndex，在下次再查找时找不到，lastIndex变为0，所以才有上面现象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var regex = new RegExp(/^\\d{4}-\\d{2}-\\d{2}$/, &quot;g&quot;)</span></span>
<span class="line"><span>regex.test(&quot;2020-01-01&quot;) // true</span></span>
<span class="line"><span>regex.lastIndex // 10</span></span>
<span class="line"><span>regex.test(&quot;2020-01-01&quot;) // false</span></span>
<span class="line"><span>regex.lastIndex // 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 为了加深理解，你可以看下面这个例子</span></span>
<span class="line"><span>var regex = new RegExp(/\\d{4}-\\d{2}-\\d{2}/, &quot;g&quot;)</span></span>
<span class="line"><span>regex.test(&quot;2020-01-01 2020-02-02&quot;) // true</span></span>
<span class="line"><span>regex.lastIndex // 10</span></span>
<span class="line"><span>regex.test(&quot;2020-01-01 2020-02-02&quot;) // true</span></span>
<span class="line"><span>regex.lastIndex // 21</span></span>
<span class="line"><span>regex.test(&quot;2020-01-01 2020-02-02&quot;) // false</span></span></code></pre></div><p>由于我们这里是文本校验，并不需要找出所有的。所以要记住，JavaScript中文本校验在使用 RegExp 时不要设置 g 模式。</p><p>另外在ES6中添加了匹配模式 u，如果要在 JavaScript 中匹配中文等多字节的 Unicode 字符，可以指定匹配模式 u，比如测试是否为一个字符，可以是任意Unicode字符，详情可以参考下面的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/^\\u{1D306}$/u.test(&quot;𝌆&quot;) // true</span></span>
<span class="line"><span>/^\\u{1D306}$/.test(&quot;𝌆&quot;) // false</span></span>
<span class="line"><span>/^.$/u.test(&quot;好&quot;) // true</span></span>
<span class="line"><span>/^.$/u.test(&quot;好人&quot;) // false</span></span>
<span class="line"><span>/^.$/u.test(&quot;a&quot;) // true</span></span>
<span class="line"><span>/^.$/u.test(&quot;ab&quot;) // false</span></span></code></pre></div><h3 id="java" tabindex="-1">Java <a class="header-anchor" href="#java" aria-label="Permalink to &quot;Java&quot;">​</a></h3><p>在 Java 中，正则相关的类在 java.util.regex 中，其中最常用的是 Pattern 和 Matcher， Pattern 是正则表达式对象，Matcher是匹配到的结果对象，Pattern 和 字符串对象关联，可以得到一个 Matcher。下面是 Java 中匹配的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.regex.Matcher;</span></span>
<span class="line"><span>import java.util.regex.Pattern;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Main {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    //方法1，可以不加 \\A 和 \\z</span></span>
<span class="line"><span>    System.out.println(Pattern.matches(&quot;\\\\d{4}-\\\\d{2}-\\\\d{2}&quot;, &quot;2020-06-01&quot;)); // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //方法2，可以不加 \\A 和 \\z</span></span>
<span class="line"><span>    System.out.println(&quot;2020-06-01&quot;.matches(&quot;\\\\d{4}-\\\\d{2}-\\\\d{2}&quot;)); // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //方法3，必须加上 \\A 和 \\z</span></span>
<span class="line"><span>    Pattern pattern = Pattern.compile(&quot;\\\\A\\\\d{4}-\\\\d{2}-\\\\d{2}\\\\z&quot;);</span></span>
<span class="line"><span>    System.out.println(pattern.matcher(&quot;2020-06-01&quot;).find()); // true</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Java 中目前还没有原生字符串，在之前转义一节讲过，正则需要经过字符串转义和正则转义两个步骤，因此在用到反斜扛的地方，比如表示数字的 <code>\\d</code>，就得在字符串中表示成 <code>\\\\d</code>，转义会让书写正则变得稍微麻烦一些，在使用的时候需要留意一下。</p><p>部分常见编程语言校验文本方式，你可以参考下面的表。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/e97814862f1943b59cf341728f789813.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/e97814862f1943b59cf341728f789813.jpg" alt=""></a></p><h2 id="_2-提取文本内容" tabindex="-1">2.提取文本内容 <a class="header-anchor" href="#_2-提取文本内容" aria-label="Permalink to &quot;2.提取文本内容&quot;">​</a></h2><p>我们再来看一下文本内容提取，所谓内容提取，就是从大段的文本中抽取出我们关心的内容。比较常见的例子是网页爬虫，或者说从页面上提取邮箱、抓取需要的内容等。如果要抓取的是某一个网站，页面样式是一样的，要提取的内容都在同一个位置，可以使用 <a href="https://lxml.de/xpathxslt.html" target="_blank" rel="noreferrer">xpath</a> 或 <a href="https://pypi.org/project/pyquery/" target="_blank" rel="noreferrer">jquery选择器</a> 等方式，否则就只能使用正则来做了。</p><p>下面我们来讲解一下具体的例子，让你了解一下正则提取文本在一些常见的编程语言中的使用。</p><h3 id="python-1" tabindex="-1">Python <a class="header-anchor" href="#python-1" aria-label="Permalink to &quot;Python&quot;">​</a></h3><p>在 Python 中提取内容最简单的就是使用 re.findall 方法了，当有子组的时候，会返回子组的内容，没有子组时，返回整个正则匹配到的内容。下面我以查找日志的年月为例进行讲解，年月可以用正则 \\d{4}-\\d{2} 来表示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 没有子组时</span></span>
<span class="line"><span>&gt;&gt;&gt; import re</span></span>
<span class="line"><span>&gt;&gt;&gt; reg = re.compile(r&#39;\\d{4}-\\d{2}&#39;)</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.findall(&#39;2020-05 2020-06&#39;)</span></span>
<span class="line"><span>[&#39;2020-05&#39;, &#39;2020-06&#39;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 有子组时</span></span>
<span class="line"><span>&gt;&gt;&gt; reg = re.compile(r&#39;(\\d{4})-(\\d{2})&#39;)</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.findall(&#39;2020-05 2020-06&#39;)</span></span>
<span class="line"><span>[(&#39;2020&#39;, &#39;05&#39;), (&#39;2020&#39;, &#39;06&#39;)]</span></span></code></pre></div><p>通过上面的示例你可以看到，直接使用 findall 方法时，它会把结果存储到一个列表（数组）中，一下返回所有匹配到的结果。如果想节约内存，可以采用迭代器的方式来处理，就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&gt;&gt;&gt; import re</span></span>
<span class="line"><span>&gt;&gt;&gt; reg = re.compile(r&#39;(\\d{4})-(\\d{2})&#39;)</span></span>
<span class="line"><span>&gt;&gt;&gt; for match in reg.finditer(&#39;2020-05 2020-06&#39;):</span></span>
<span class="line"><span>...     print(&#39;date: &#39;, match[0])  # 整个正则匹配到的内容</span></span>
<span class="line"><span>...     print(&#39;year: &#39;, match[1])  # 第一个子组</span></span>
<span class="line"><span>...     print(&#39;month:&#39;, match[2])  # 第二个子组</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>date:  2020-05</span></span>
<span class="line"><span>year:  2020</span></span>
<span class="line"><span>month: 05</span></span>
<span class="line"><span>date:  2020-06</span></span>
<span class="line"><span>year:  2020</span></span>
<span class="line"><span>month: 06</span></span></code></pre></div><p>这样我们就可以实现正则找到一个，在程序中处理一个，不需要将找到的所有结果构造成一个数组（Python中的列表）。</p><h3 id="go-1" tabindex="-1">Go <a class="header-anchor" href="#go-1" aria-label="Permalink to &quot;Go&quot;">​</a></h3><p>在 Go语言里面，查找也非常简洁，可以直接使用 FindAllString 方法。如果我们想捕获子组，可以使用 FindAllStringSubmatch 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;fmt&quot;</span></span>
<span class="line"><span>  &quot;regexp&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>  re := regexp.MustCompile(\`\\d{4}-\\d{2}\`)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 返回一个切片(可动态扩容的数组) [2020-06 2020-07]</span></span>
<span class="line"><span>  fmt.Println(re.FindAllString(&quot;2020-06 2020-07&quot;, -1))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 捕获子组的查找示例</span></span>
<span class="line"><span>  re2 := regexp.MustCompile(\`(\\d{4})-(\\d{2})\`)</span></span>
<span class="line"><span>  // 返回结果和上面 Python 类似</span></span>
<span class="line"><span>  for _, match := range re2.FindAllStringSubmatch(&quot;2020-06 2020-07&quot;, -1) {</span></span>
<span class="line"><span>     fmt.Println(&quot;date: &quot;, match[0])</span></span>
<span class="line"><span>     fmt.Println(&quot;year: &quot;, match[1])</span></span>
<span class="line"><span>     fmt.Println(&quot;month:&quot;, match[2])</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="javascript-1" tabindex="-1">JavaScript <a class="header-anchor" href="#javascript-1" aria-label="Permalink to &quot;JavaScript&quot;">​</a></h3><p>在 JavaScript 中，想要提取文本中所有符合要求的内容，正则必须使用 g 模式，否则找到第一个结果后，正则就不会继续向后查找了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用g模式，查找所有符合要求的内容</span></span>
<span class="line"><span>&quot;2020-06 2020-07&quot;.match(/\\d{4}-\\d{2}/g)</span></span>
<span class="line"><span>// 输出：[&quot;2020-06&quot;, &quot;2020-07&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 不使用g模式，找到第一个就会停下来</span></span>
<span class="line"><span>&quot;2020-06 2020-07&quot;.match(/\\d{4}-\\d{2}/)</span></span>
<span class="line"><span>// 输出：[&quot;2020-06&quot;, index: 0, input: &quot;2020-06 2020-07&quot;, groups: undefined]</span></span></code></pre></div><p>如果要查找中文等Unicode字符，可以使用 u 匹配模式，下面是具体的示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&#39;𝌆&#39;.match(/\\u{1D306}/ug)</span><span> // 使用匹配模式u</span></span>
<span class="line"><span>[&quot;𝌆&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&#39;𝌆&#39;.match(/\\u{1D306}/g)</span><span> // 不使用匹配模式u</span></span>
<span class="line"><span>null</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 如果你对这个符号感兴趣，可以参考 https://unicode-table.com/cn/1D306</span></span></code></pre></div><h3 id="java-1" tabindex="-1">Java <a class="header-anchor" href="#java-1" aria-label="Permalink to &quot;Java&quot;">​</a></h3><p>在 Java 中，可以使用 Matcher 的 find 方法来获取查找到的内容，就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.regex.Matcher;</span></span>
<span class="line"><span>import java.util.regex.Pattern;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Main {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    Pattern pattern = Pattern.compile(&quot;\\\\d{4}-\\\\d{2}&quot;);</span></span>
<span class="line"><span>    Matcher match = pattern.matcher(&quot;2020-06 2020-07&quot;);</span></span>
<span class="line"><span>    while (match.find()) {</span></span>
<span class="line"><span>      System.out.println(match.group());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>部分常见编程语言提取文本方式，你可以参考下面的表。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/b14435e91df9454f6fa361b1510ff2c9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/b14435e91df9454f6fa361b1510ff2c9.jpg" alt=""></a></p><h2 id="_3-替换文本内容" tabindex="-1">3.替换文本内容 <a class="header-anchor" href="#_3-替换文本内容" aria-label="Permalink to &quot;3.替换文本内容&quot;">​</a></h2><p>我们接着来看一下文本内容替换，替换通常用于对原来的文本内容进行一些调整。之前我们也讲解过一些使用正则进行替换的例子，今天我们再来了解一下在部分常见的编程语言中，使用正则进行文本替换的方法。</p><h3 id="python-2" tabindex="-1">Python <a class="header-anchor" href="#python-2" aria-label="Permalink to &quot;Python&quot;">​</a></h3><p>在 Python 中替换相关的方法有 re.sub 和 re.subn，后者会返回替换的次数。下面我以替换年月的格式为例进行讲解，假设原始的日期格式是月日年，我们要将其处理成 xxxx年xx月xx日的格式。你可以看到，在Python中正则替换操作相关的方法，使用起来非常地简单。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&gt;&gt;&gt; import re</span></span>
<span class="line"><span>&gt;&gt;&gt; reg = re.compile(r&#39;(\\d{2})-(\\d{2})-(\\d{4})&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt;&gt;&gt; reg.sub(r&#39;\\3年\\1月\\2日&#39;, &#39;02-20-2020 05-21-2020&#39;)</span></span>
<span class="line"><span>&#39;2020年02月20日 2020年05月21日&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 可以在替换中使用 \\g&lt;数字&gt;，如果分组多于10个时避免歧义</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.sub(r&#39;\\g&lt;3&gt;年\\g&lt;1&gt;月\\g&lt;2&gt;日&#39;, &#39;02-20-2020 05-21-2020&#39;)</span></span>
<span class="line"><span>&#39;2020年02月20日 2020年05月21日&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 返回替换次数</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.subn(r&#39;\\3年\\1月\\2日&#39;, &#39;02-20-2020 05-21-2020&#39;)</span></span>
<span class="line"><span>(&#39;2020年02月20日 2020年05月21日&#39;, 2)</span></span></code></pre></div><h3 id="go-2" tabindex="-1">Go <a class="header-anchor" href="#go-2" aria-label="Permalink to &quot;Go&quot;">​</a></h3><p>在 Go语言里面，替换和Python也非常类似，只不过子组是使用 \${num} 的方式来表示的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;fmt&quot;</span></span>
<span class="line"><span>  &quot;regexp&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>  re := regexp.MustCompile(\`(\\d{2})-(\\d{2})-(\\d{4})\`)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 示例一，返回 2020年02月20日 2020年05月21日</span></span>
<span class="line"><span>  fmt.Println(re.ReplaceAllString(&quot;02-20-2020 05-21-2020&quot;, &quot;\${3}年\${1}月\${2}日&quot;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 示例二，返回空字符串，因为&quot;3年&quot;，&quot;1月&quot;，&quot;2日&quot; 这样的子组不存在</span></span>
<span class="line"><span>  fmt.Println(re.ReplaceAllString(&quot;02-20-2020 05-21-2020&quot;, &quot;$3年$1月$2日&quot;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 示例三，返回 2020-02-20 2020-05-21</span></span>
<span class="line"><span>  fmt.Println(re.ReplaceAllString(&quot;02-20-2020 05-21-2020&quot;, &quot;$3-$1-$2&quot;))</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,66),a("p",null,[s("需要你注意的是，不建议把 "),a("code",{num:""},"$"),s(" 写成不带花括号的 "),a("code",null,"$"),s(" num，比如示例二中的错误，会让人很困惑，Go认为子组是 "),a("code",null,"“3年”，“1月”，“2日”"),s("。 由于这样的子组不存在，最终替换成了空字符串，所以使用的时候要注意这一点。")],-1),p(`<h3 id="javascript-2" tabindex="-1">JavaScript <a class="header-anchor" href="#javascript-2" aria-label="Permalink to &quot;JavaScript&quot;">​</a></h3><p>在 JavaScript 中替换和查找类似，需要指定 g 模式，否则只会替换第一个，就像下面这样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用g模式，替换所有的</span></span>
<span class="line"><span>&quot;02-20-2020 05-21-2020&quot;.replace(/(\\d{2})-(\\d{2})-(\\d{4})/g, &quot;$3年$1月$2日&quot;)</span></span>
<span class="line"><span>// 输出 &quot;2020年02月20日 2020年05月21日&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 不使用 g 模式时，只替换一次</span></span>
<span class="line"><span>&quot;02-20-2020 05-21-2020&quot;.replace(/(\\d{2})-(\\d{2})-(\\d{4})/, &quot;$3年$1月$2日&quot;)</span></span>
<span class="line"><span>// 输出 &quot;2020年02月20日 05-21-2020&quot;</span></span></code></pre></div><h3 id="java-2" tabindex="-1">Java <a class="header-anchor" href="#java-2" aria-label="Permalink to &quot;Java&quot;">​</a></h3><p>在 Java 中，一般是使用 replaceAll 方法进行替换，一次性替换所有的匹配到的文本。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.regex.Matcher;</span></span>
<span class="line"><span>import java.util.regex.Pattern;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Main {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    //方法1，输出 2020年02月20日 2020年05月21日</span></span>
<span class="line"><span>    System.out.println(&quot;02-20-2020 05-21-2020&quot;.replaceAll(&quot;(\\\\d{2})-(\\\\d{2})-(\\\\d{4})&quot;, &quot;$3年$1月$2日&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //方法2，输出 2020年02月20日 2020年05月21日</span></span>
<span class="line"><span>    final Pattern pattern = Pattern.compile(&quot;(\\\\d{2})-(\\\\d{2})-(\\\\d{4})&quot;);</span></span>
<span class="line"><span>    Matcher match = pattern.matcher(&quot;02-20-2020 05-21-2020&quot;);</span></span>
<span class="line"><span>    System.out.println(match.replaceAll(&quot;$3年$1月$2日&quot;));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>部分常见编程语言替换文本方式，你可以参考下面的表。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/98603bb41c59dac186bab6dc12a494yy.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/98603bb41c59dac186bab6dc12a494yy.jpg" alt=""></a></p><h2 id="_4-切割文本内容" tabindex="-1">4.切割文本内容 <a class="header-anchor" href="#_4-切割文本内容" aria-label="Permalink to &quot;4.切割文本内容&quot;">​</a></h2><p>我们最后再来看一下文本内容切割，通常切割用于变长的空白符号，多变的标点符号等。</p><p>下面我们来讲解一下具体的例子，让你了解一下正则切割文本在部分常见编程语言中的使用。</p><h3 id="python-3" tabindex="-1">Python <a class="header-anchor" href="#python-3" aria-label="Permalink to &quot;Python&quot;">​</a></h3><p>在 Python 中切割相关的方法是 re.split。如果我们有按照任意空白符切割的需求，可以直接使用字符串的 split 方法，不传任何参数时就是按任意连续一到多个空白符切割。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 使用字符串的切割方法</span></span>
<span class="line"><span>&gt;&gt;&gt; &quot;a b  c\\n\\nd\\t\\n \\te&quot;.split()</span></span>
<span class="line"><span>[&#39;a&#39;, &#39;b&#39;, &#39;c&#39;, &#39;d&#39;, &#39;e&#39;]</span></span></code></pre></div><p>使用正则进行切割，比如我们要通过标点符号切割，得到所有的单词（这里简单使用非单词组成字符来表示）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&gt;&gt;&gt; import re</span></span>
<span class="line"><span>&gt;&gt;&gt; reg = re.compile(r&#39;\\W+&#39;)</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.split(&quot;apple, pear! orange; tea&quot;)</span></span>
<span class="line"><span>[&#39;apple&#39;, &#39;pear&#39;, &#39;orange&#39;, &#39;tea&#39;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 限制切割次数，比如切一刀，变成两部分</span></span>
<span class="line"><span>&gt;&gt;&gt; reg.split(&quot;apple, pear! orange; tea&quot;, 1)</span></span>
<span class="line"><span>[&#39;apple&#39;, &#39;pear! orange; tea&#39;]</span></span></code></pre></div><h3 id="go-3" tabindex="-1">Go <a class="header-anchor" href="#go-3" aria-label="Permalink to &quot;Go&quot;">​</a></h3><p>在 Go语言里面，切割是 Split 方法，和 Python 非常地类似，只不过Go语言中这个方法的第二个参数是必传的，如果不限制次数，我们传入 -1 即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;fmt&quot;</span></span>
<span class="line"><span>  &quot;regexp&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>  re := regexp.MustCompile(\`\\W+\`)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 返回 []string{&quot;apple&quot;, &quot;pear&quot;, &quot;orange&quot;, &quot;tea&quot;}</span></span>
<span class="line"><span>  fmt.Printf(&quot;%#v&quot;, re.Split(&quot;apple, pear! orange; tea&quot;, -1)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但在Go语言中，有个地方和 Python 不太一样，就是传入的第二个参数代表切割成几个部分，而不是切割几刀。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 返回 []string{&quot;apple&quot;, &quot;pear! orange; tea&quot;}</span></span>
<span class="line"><span>fmt.Printf(&quot;%#v\\n&quot;, re.Split(&quot;apple, pear! orange; tea&quot;, 2))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 返回 []string{&quot;apple&quot;}</span></span>
<span class="line"><span>fmt.Printf(&quot;%#v\\n&quot;, re.Split(&quot;apple&quot;, 2))</span></span></code></pre></div><p>这里有一个 <a href="https://play.golang.org/p/4VsBKxxXzYp" target="_blank" rel="noreferrer">在线测试链接</a>，你可以尝试一下。</p><h3 id="javascript-3" tabindex="-1">JavaScript <a class="header-anchor" href="#javascript-3" aria-label="Permalink to &quot;JavaScript&quot;">​</a></h3><p>在 JavaScript 中，正则的切割和刚刚讲过的 Python 和 Go 有些类似，但又有区别。当第二个参数是2的时候，表示切割成2个部分，而不是切2刀（Go和Java也是类似的），但数组的内容不是 apple 后面的剩余部分，而是全部切割之后的 pear，你可以注意比较一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;apple, pear! orange; tea&quot;.split(/\\W+/)</span></span>
<span class="line"><span>// 输出：[&quot;apple&quot;, &quot;pear&quot;, &quot;orange&quot;, &quot;tea&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 传入第二个参数的情况</span></span>
<span class="line"><span>&quot;apple, pear! orange; tea&quot;.split(/\\W+/, 1)</span></span>
<span class="line"><span>// 输出 [&quot;apple&quot;]</span></span>
<span class="line"><span>&quot;apple, pear! orange; tea&quot;.split(/\\W+/, 2)</span></span>
<span class="line"><span>// 输出 [&quot;apple&quot;, &quot;pear&quot;]</span></span>
<span class="line"><span>&quot;apple, pear! orange; tea&quot;.split(/\\W+/, 10)</span></span>
<span class="line"><span>// 输出 [&quot;apple&quot;, &quot;pear&quot;, &quot;orange&quot;, &quot;tea&quot;]</span></span></code></pre></div><h3 id="java-3" tabindex="-1">Java <a class="header-anchor" href="#java-3" aria-label="Permalink to &quot;Java&quot;">​</a></h3><p>Java中切割也是类似的，由于没有原生字符串，转义稍微麻烦点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.regex.Matcher;</span></span>
<span class="line"><span>import java.util.regex.Pattern;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Main {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    Pattern pattern = Pattern.compile(&quot;\\\\W+&quot;);</span></span>
<span class="line"><span>    for(String s : pattern.split(&quot;apple, pear! orange; tea&quot;)) {</span></span>
<span class="line"><span>      System.out.println(s);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 Java 中，也可以传入第二个参数，类似于 Go 的结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pattern.split(&quot;apple, pear! orange; tea&quot;, 2)</span></span>
<span class="line"><span>// 返回 &quot;apple&quot; 和 &quot;pear! orange; tea&quot;</span></span></code></pre></div><p>部分常见编程语言切割文本方式，你可以参考下面的表。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/6708a65e269e645abb9c6ca85b5a4b56.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/6708a65e269e645abb9c6ca85b5a4b56.jpg" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的内容讲完了，我来带你总结回顾一下。</p><p>今天我们学习了正则解决的问题大概可以分成四类，分别是校验文本内容、提取文本内容、替换文本内容、切割文本内容。从这四个功能出发，我们学习了在一些常见的编程语言中，如何正确地使用相应的方法来实现这些功能。这些方法都比较详细，希望你能够认真练习，掌握好这些方法。</p><p>我给你总结了一个今天所讲内容的详细脑图，你可以长按保存下来，经常回顾一下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/f1d925e4795e1310886aaf82caf42325.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%85%A5%E9%97%A8%E8%AF%BE/images/257533/f1d925e4795e1310886aaf82caf42325.png" alt=""></a></p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>最后，我们来做一个小练习吧。很多网页为了防止爬虫，喜欢把邮箱里面的 @ 符号替换成 # 符号，你可以写一个正则，兼容一下这种情况么？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>例如网页的底部可能是这样的：</span></span>
<span class="line"><span>联系邮箱：xxx#163.com (请把#换成@)</span></span></code></pre></div><p>你可以试试自己动手，使用你熟悉的编程语言，测试一下你写的正则能不能提取出这种“防爬”的邮箱。</p><p>好，今天的课程就结束了，希望可以帮助到你，也希望你在下方的留言区和我参与讨论，并把文章分享给你的朋友或者同事，一起交流一下。</p>`,42)])])}const b=e(i,[["render",o]]);export{q as __pageData,b as default};
