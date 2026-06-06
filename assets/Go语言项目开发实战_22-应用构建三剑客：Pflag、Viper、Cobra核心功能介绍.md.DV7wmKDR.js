import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"22 | 应用构建三剑客：Pflag、Viper、Cobra 核心功能介绍","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何构建应用框架","slug":"如何构建应用框架","link":"#如何构建应用框架","children":[]},{"level":2,"title":"命令行参数解析工具：Pflag使用介绍","slug":"命令行参数解析工具-pflag使用介绍","link":"#命令行参数解析工具-pflag使用介绍","children":[{"level":3,"title":"Pflag包Flag定义","slug":"pflag包flag定义","link":"#pflag包flag定义","children":[]},{"level":3,"title":"Pflag包FlagSet定义","slug":"pflag包flagset定义","link":"#pflag包flagset定义","children":[]},{"level":3,"title":"Pflag使用方法","slug":"pflag使用方法","link":"#pflag使用方法","children":[]}]},{"level":2,"title":"配置解析神器：Viper使用介绍","slug":"配置解析神器-viper使用介绍","link":"#配置解析神器-viper使用介绍","children":[{"level":3,"title":"读入配置","slug":"读入配置","link":"#读入配置","children":[]},{"level":3,"title":"读取配置","slug":"读取配置","link":"#读取配置","children":[]}]},{"level":2,"title":"现代化的命令行框架：Cobra全解","slug":"现代化的命令行框架-cobra全解","link":"#现代化的命令行框架-cobra全解","children":[{"level":3,"title":"使用Cobra库创建命令","slug":"使用cobra库创建命令","link":"#使用cobra库创建命令","children":[]},{"level":3,"title":"使用标志","slug":"使用标志","link":"#使用标志","children":[]},{"level":3,"title":"非选项参数验证","slug":"非选项参数验证","link":"#非选项参数验证","children":[]},{"level":3,"title":"PreRun and PostRun Hooks","slug":"prerun-and-postrun-hooks","link":"#prerun-and-postrun-hooks","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/22-应用构建三剑客：Pflag、Viper、Cobra核心功能介绍.md","filePath":"Go语言项目开发实战/22-应用构建三剑客：Pflag、Viper、Cobra核心功能介绍.md","lastUpdated":1779815754000}'),l={name:"Go语言项目开发实战/22-应用构建三剑客：Pflag、Viper、Cobra核心功能介绍.md"};function t(i,a,o,c,r,u){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_22-应用构建三剑客-pflag、viper、cobra-核心功能介绍" tabindex="-1">22 | 应用构建三剑客：Pflag、Viper、Cobra 核心功能介绍 <a class="header-anchor" href="#_22-应用构建三剑客-pflag、viper、cobra-核心功能介绍" aria-label="Permalink to &quot;22 | 应用构建三剑客：Pflag、Viper、Cobra 核心功能介绍&quot;">​</a></h1><p>你好，我是孔令飞。这一讲我们来聊聊构建应用时常用的Go包。</p><p>因为IAM项目使用了Pflag、Viper和Cobra包来构建IAM的应用框架，为了让你后面学习更加容易，这里简单介绍下这3个包的核心功能和使用方式。其实如果单独讲每个包的话，还是有很多功能可讲的，但我们这一讲的目的是减小你后面学习IAM源码的难度，所以我会主要介绍跟IAM相关的功能。</p><p>在正式介绍这三个包之前，我们先来看下如何构建应用的框架。</p><h2 id="如何构建应用框架" tabindex="-1">如何构建应用框架 <a class="header-anchor" href="#如何构建应用框架" aria-label="Permalink to &quot;如何构建应用框架&quot;">​</a></h2><p>想知道如何构建应用框架，首先你要明白，一个应用框架包含哪些部分。在我看来，一个应用框架需要包含以下3个部分：</p><ul><li>命令行参数解析：主要用来解析命令行参数，这些命令行参数可以影响命令的运行效果。</li><li>配置文件解析：一个大型应用，通常具有很多参数，为了便于管理和配置这些参数，通常会将这些参数放在一个配置文件中，供程序读取并解析。</li><li>应用的命令行框架：应用最终是通过命令来启动的。这里有3个需求点，一是命令需要具备Help功能，这样才能告诉使用者如何去使用；二是命令需要能够解析命令行参数和配置文件；三是命令需要能够初始化业务代码，并最终启动业务进程。也就是说，我们的命令需要具备框架的能力，来纳管这3个部分。</li></ul><p>这3个部分的功能，你可以自己开发，也可以借助业界已有的成熟实现。跟之前的想法一样，我不建议你自己开发，更建议你采用业界已有的成熟实现。命令行参数可以通过 <a href="https://github.com/spf13/pflag" target="_blank" rel="noreferrer">Pflag</a> 来解析，配置文件可以通过 <a href="https://github.com/spf13/viper" target="_blank" rel="noreferrer">Viper</a> 来解析，应用的命令行框架则可以通过 <a href="https://github.com/spf13/cobra" target="_blank" rel="noreferrer">Cobra</a> 来实现。这3个包目前也是最受欢迎的包，并且这3个包不是割裂的，而是有联系的，我们可以有机地组合这3个包，从而实现一个非常强大、优秀的应用命令行框架。</p><p>接下来，我们就来详细看下，这3个包在Go项目开发中是如何使用的。</p><h2 id="命令行参数解析工具-pflag使用介绍" tabindex="-1">命令行参数解析工具：Pflag使用介绍 <a class="header-anchor" href="#命令行参数解析工具-pflag使用介绍" aria-label="Permalink to &quot;命令行参数解析工具：Pflag使用介绍&quot;">​</a></h2><p>Go服务开发中，经常需要给开发的组件加上各种启动参数来配置服务进程，影响服务的行为。像kube-apiserver就有多达200多个启动参数，而且这些参数的类型各不相同（例如：string、int、ip类型等），使用方式也不相同（例如：需要支持 <code>--</code> 长选项， <code>-</code> 短选项等），所以我们需要一个强大的命令行参数解析工具。</p><p>虽然Go源码中提供了一个标准库Flag包，用来对命令行参数进行解析，但在大型项目中应用更广泛的是另外一个包：Pflag。Pflag提供了很多强大的特性，非常适合用来构建大型项目，一些耳熟能详的开源项目都是用Pflag来进行命令行参数解析的，例如：Kubernetes、Istio、Helm、Docker、Etcd等。</p><p>接下来，我们就来介绍下如何使用Pflag。Pflag主要是通过创建Flag和FlagSet来使用的。我们先来看下Flag。</p><h3 id="pflag包flag定义" tabindex="-1">Pflag包Flag定义 <a class="header-anchor" href="#pflag包flag定义" aria-label="Permalink to &quot;Pflag包Flag定义&quot;">​</a></h3><p>Pflag可以对命令行参数进行处理，一个命令行参数在Pflag包中会解析为一个Flag类型的变量。Flag是一个结构体，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Flag struct {</span></span>
<span class="line"><span>    Name                string // flag长选项的名称</span></span>
<span class="line"><span>    Shorthand           string // flag短选项的名称，一个缩写的字符</span></span>
<span class="line"><span>    Usage               string // flag的使用文本</span></span>
<span class="line"><span>    Value               Value  // flag的值</span></span>
<span class="line"><span>    DefValue            string // flag的默认值</span></span>
<span class="line"><span>    Changed             bool // 记录flag的值是否有被设置过</span></span>
<span class="line"><span>    NoOptDefVal         string // 当flag出现在命令行，但是没有指定选项值时的默认值</span></span>
<span class="line"><span>    Deprecated          string // 记录该flag是否被放弃</span></span>
<span class="line"><span>    Hidden              bool // 如果值为true，则从help/usage输出信息中隐藏该flag</span></span>
<span class="line"><span>    ShorthandDeprecated string // 如果flag的短选项被废弃，当使用flag的短选项时打印该信息</span></span>
<span class="line"><span>    Annotations         map[string][]string // 给flag设置注解</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Flag的值是一个Value类型的接口，Value定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Value interface {</span></span>
<span class="line"><span>    String() string // 将flag类型的值转换为string类型的值，并返回string的内容</span></span>
<span class="line"><span>    Set(string) error // 将string类型的值转换为flag类型的值，转换失败报错</span></span>
<span class="line"><span>    Type() string // 返回flag的类型，例如：string、int、ip等</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过将Flag的值抽象成一个interface接口，我们就可以自定义Flag的类型了。只要实现了Value接口的结构体，就是一个新类型。</p><h3 id="pflag包flagset定义" tabindex="-1">Pflag包FlagSet定义 <a class="header-anchor" href="#pflag包flagset定义" aria-label="Permalink to &quot;Pflag包FlagSet定义&quot;">​</a></h3><p>Pflag除了支持单个的Flag之外，还支持FlagSet。FlagSet是一些预先定义好的Flag的集合，几乎所有的Pflag操作，都需要借助FlagSet提供的方法来完成。在实际开发中，我们可以使用两种方法来获取并使用FlagSet：</p><ul><li>方法一，调用NewFlagSet创建一个FlagSet。</li><li>方法二，使用Pflag包定义的全局FlagSet：CommandLine。实际上CommandLine也是由NewFlagSet函数创建的。</li></ul><p>先来看下第一种方法，自定义FlagSet。下面是一个自定义FlagSet的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var version bool</span></span>
<span class="line"><span>flagSet := pflag.NewFlagSet(&quot;test&quot;, pflag.ContinueOnError)</span></span>
<span class="line"><span>flagSet.BoolVar(&amp;version, &quot;version&quot;, true, &quot;Print version information and quit.&quot;)</span></span></code></pre></div><p>我们可以通过定义一个新的FlagSet来定义命令及其子命令的Flag。</p><p>再来看下第二种方法，使用全局FlagSet。下面是一个使用全局FlagSet的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;github.com/spf13/pflag&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pflag.BoolVarP(&amp;version, &quot;version&quot;, &quot;v&quot;, true, &quot;Print version information and quit.&quot;)</span></span></code></pre></div><p>这其中，pflag.BoolVarP函数定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func BoolVarP(p *bool, name, shorthand string, value bool, usage string) {</span></span>
<span class="line"><span>    flag := CommandLine.VarPF(newBoolValue(value, p), name, shorthand, usage)</span></span>
<span class="line"><span>    flag.NoOptDefVal = &quot;true&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到pflag.BoolVarP最终调用了CommandLine，CommandLine是一个包级别的变量，定义为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// CommandLine is the default set of command-line flags, parsed from os.Args.</span></span>
<span class="line"><span>var CommandLine = NewFlagSet(os.Args[0], ExitOnError)</span></span></code></pre></div><p>在一些不需要定义子命令的命令行工具中，我们可以直接使用全局的FlagSet，更加简单方便。</p><h3 id="pflag使用方法" tabindex="-1">Pflag使用方法 <a class="header-anchor" href="#pflag使用方法" aria-label="Permalink to &quot;Pflag使用方法&quot;">​</a></h3><p>上面，我们介绍了使用Pflag包的两个核心结构体。接下来，我来详细介绍下Pflag的常见使用方法。Pflag有很多强大的功能，我这里介绍7个常见的使用方法。</p><ol><li>支持多种命令行参数定义方式。</li></ol><p>Pflag支持以下4种命令行参数定义方式：</p><ul><li>支持长选项、默认值和使用文本，并将标志的值存储在指针中。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var name = pflag.String(&quot;name&quot;, &quot;colin&quot;, &quot;Input Your Name&quot;)</span></span></code></pre></div><ul><li>支持长选项、短选项、默认值和使用文本，并将标志的值存储在指针中。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var name = pflag.StringP(&quot;name&quot;, &quot;n&quot;, &quot;colin&quot;, &quot;Input Your Name&quot;)</span></span></code></pre></div><ul><li>支持长选项、默认值和使用文本，并将标志的值绑定到变量。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var name string</span></span>
<span class="line"><span>pflag.StringVar(&amp;name, &quot;name&quot;, &quot;colin&quot;, &quot;Input Your Name&quot;)</span></span></code></pre></div><ul><li>支持长选项、短选项、默认值和使用文本，并将标志的值绑定到变量。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var name string</span></span>
<span class="line"><span>pflag.StringVarP(&amp;name, &quot;name&quot;, &quot;n&quot;,&quot;colin&quot;, &quot;Input Your Name&quot;)</span></span></code></pre></div><p>上面的函数命名是有规则的：</p><ul><li>函数名带 <code>Var</code> 说明是将标志的值绑定到变量，否则是将标志的值存储在指针中。</li><li>函数名带 <code>P</code> 说明支持短选项，否则不支持短选项。</li></ul><ol start="2"><li>使用 <code>Get&amp;lt;Type&gt;</code> 获取参数的值。</li></ol><p>可以使用 <code>Get&amp;lt;Type&gt;</code> 来获取标志的值， <code>&amp;lt;Type&gt;</code> 代表Pflag所支持的类型。例如：有一个pflag.FlagSet，带有一个名为flagname的int类型的标志，可以使用 <code>GetInt()</code> 来获取int值。需要注意flagname必须存在且必须是int，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>i, err := flagset.GetInt(&quot;flagname&quot;)</span></span></code></pre></div><ol start="3"><li>获取非选项参数。</li></ol><p>代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/spf13/pflag&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    flagvar = pflag.Int(&quot;flagname&quot;, 1234, &quot;help message for flagname&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    pflag.Parse()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fmt.Printf(&quot;argument number is: %v\\n&quot;, pflag.NArg())</span></span>
<span class="line"><span>    fmt.Printf(&quot;argument list is: %v\\n&quot;, pflag.Args())</span></span>
<span class="line"><span>    fmt.Printf(&quot;the first argument is: %v\\n&quot;, pflag.Arg(0))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行上述代码，输出如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run example1.go arg1 arg2</span></span>
<span class="line"><span>argument number is: 2</span></span>
<span class="line"><span>argument list is: [arg1 arg2]</span></span>
<span class="line"><span>the first argument is: arg1</span></span></code></pre></div><p>在定义完标志之后，可以调用 <code>pflag.Parse()</code> 来解析定义的标志。解析后，可通过 <code>pflag.Args()</code> 返回所有的非选项参数，通过 <code>pflag.Arg(i)</code> 返回第i个非选项参数。参数下标0到pflag.NArg() - 1。</p><ol start="4"><li>指定了选项但是没有指定选项值时的默认值。</li></ol><p>创建一个Flag后，可以为这个Flag设置 <code>pflag.NoOptDefVal</code>。如果一个Flag具有NoOptDefVal，并且该Flag在命令行上没有设置这个Flag的值，则该标志将设置为NoOptDefVal指定的值。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var ip = pflag.IntP(&quot;flagname&quot;, &quot;f&quot;, 1234, &quot;help message&quot;)</span></span>
<span class="line"><span>pflag.Lookup(&quot;flagname&quot;).NoOptDefVal = &quot;4321&quot;</span></span></code></pre></div><p>上面的代码会产生结果，具体你可以参照下表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/395705/fe76a52906c35b49b890225d1f5fc93f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/395705/fe76a52906c35b49b890225d1f5fc93f.png" alt="图片"></a></p><ol start="5"><li>弃用标志或者标志的简写。</li></ol><p>Pflag可以弃用标志或者标志的简写。弃用的标志或标志简写在帮助文本中会被隐藏，并在使用不推荐的标志或简写时打印正确的用法提示。例如，弃用名为logmode的标志，并告知用户应该使用哪个标志代替：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// deprecate a flag by specifying its name and a usage message</span></span>
<span class="line"><span>pflag.CommandLine.MarkDeprecated(&quot;logmode&quot;, &quot;please use --log-mode instead&quot;)</span></span></code></pre></div><p>这样隐藏了帮助文本中的logmode，并且当使用logmode时，打印了 <code>Flag --logmode has been deprecated, please use --log-mode instead</code>。</p><ol start="6"><li>保留名为port的标志，但是弃用它的简写形式。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pflag.IntVarP(&amp;port, &quot;port&quot;, &quot;P&quot;, 3306, &quot;MySQL service host port.&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// deprecate a flag shorthand by specifying its flag name and a usage message</span></span>
<span class="line"><span>pflag.CommandLine.MarkShorthandDeprecated(&quot;port&quot;, &quot;please use --port only&quot;)</span></span></code></pre></div><p>这样隐藏了帮助文本中的简写P，并且当使用简写P时，打印了 <code>Flag shorthand -P has been deprecated, please use --port only</code>。usage message在此处必不可少，并且不应为空。</p><ol start="7"><li>隐藏标志。</li></ol><p>可以将Flag标记为隐藏的，这意味着它仍将正常运行，但不会显示在usage/help文本中。例如：隐藏名为secretFlag的标志，只在内部使用，并且不希望它显示在帮助文本或者使用文本中。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// hide a flag by specifying its name</span></span>
<span class="line"><span>pflag.CommandLine.MarkHidden(&quot;secretFlag&quot;)</span></span></code></pre></div><p>至此，我们介绍了Pflag包的重要用法。接下来，我们再来看下如何解析配置文件。</p><h2 id="配置解析神器-viper使用介绍" tabindex="-1">配置解析神器：Viper使用介绍 <a class="header-anchor" href="#配置解析神器-viper使用介绍" aria-label="Permalink to &quot;配置解析神器：Viper使用介绍&quot;">​</a></h2><p>几乎所有的后端服务，都需要一些配置项来配置我们的服务，一些小型的项目，配置不是很多，可以选择只通过命令行参数来传递配置。但是大型项目配置很多，通过命令行参数传递就变得很麻烦，不好维护。标准的解决方案是将这些配置信息保存在配置文件中，由程序启动时加载和解析。Go生态中有很多包可以加载并解析配置文件，目前最受欢迎的是Viper包。</p><p>Viper是Go应用程序现代化的、完整的解决方案，能够处理不同格式的配置文件，让我们在构建现代应用程序时，不必担心配置文件格式。Viper也能够满足我们对应用配置的各种需求。</p><p>Viper可以从不同的位置读取配置，不同位置的配置具有不同的优先级，高优先级的配置会覆盖低优先级相同的配置，按优先级从高到低排列如下：</p><ol><li>通过viper.Set函数显示设置的配置</li><li>命令行参数</li><li>环境变量</li><li>配置文件</li><li>Key/Value存储</li><li>默认值</li></ol><p>这里需要注意，Viper配置键不区分大小写。</p><p>Viper有很多功能，最重要的两类功能是读入配置和读取配置，Viper提供不同的方式来实现这两类功能。接下来，我们就来详细介绍下Viper如何读入配置和读取配置。</p><h3 id="读入配置" tabindex="-1">读入配置 <a class="header-anchor" href="#读入配置" aria-label="Permalink to &quot;读入配置&quot;">​</a></h3><p>读入配置，就是将配置读入到Viper中，有如下读入方式：</p><ul><li>设置默认的配置文件名。</li><li>读取配置文件。</li><li>监听和重新读取配置文件。</li><li>从io.Reader读取配置。</li><li>从环境变量读取。</li><li>从命令行标志读取。</li><li>从远程Key/Value存储读取。</li></ul><p>这几个方法的具体读入方式，你可以看下面的展示。</p><ol><li>设置默认值。</li></ol><p>一个好的配置系统应该支持默认值。Viper支持对key设置默认值，当没有通过配置文件、环境变量、远程配置或命令行标志设置key时，设置默认值通常是很有用的，可以让程序在没有明确指定配置时也能够正常运行。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.SetDefault(&quot;ContentDir&quot;, &quot;content&quot;)</span></span>
<span class="line"><span>viper.SetDefault(&quot;LayoutDir&quot;, &quot;layouts&quot;)</span></span>
<span class="line"><span>viper.SetDefault(&quot;Taxonomies&quot;, map[string]string{&quot;tag&quot;: &quot;tags&quot;, &quot;category&quot;: &quot;categories&quot;})</span></span></code></pre></div><ol start="2"><li>读取配置文件。</li></ol><p>Viper可以读取配置文件来解析配置，支持JSON、TOML、YAML、YML、Properties、Props、Prop、HCL、Dotenv、Env格式的配置文件。Viper 支持搜索多个路径，并且默认不配置任何搜索路径，将默认决策留给应用程序。</p><p>以下是如何使用 Viper 搜索和读取配置文件的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/spf13/pflag&quot;</span></span>
<span class="line"><span>	&quot;github.com/spf13/viper&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>	cfg  = pflag.StringP(&quot;config&quot;, &quot;c&quot;, &quot;&quot;, &quot;Configuration file.&quot;)</span></span>
<span class="line"><span>	help = pflag.BoolP(&quot;help&quot;, &quot;h&quot;, false, &quot;Show this help message.&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	pflag.Parse()</span></span>
<span class="line"><span>	if *help {</span></span>
<span class="line"><span>		pflag.Usage()</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 从配置文件中读取配置</span></span>
<span class="line"><span>	if *cfg != &quot;&quot; {</span></span>
<span class="line"><span>		viper.SetConfigFile(*cfg)   // 指定配置文件名</span></span>
<span class="line"><span>		viper.SetConfigType(&quot;yaml&quot;) // 如果配置文件名中没有文件扩展名，则需要指定配置文件的格式，告诉viper以何种格式解析文件</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		viper.AddConfigPath(&quot;.&quot;)          // 把当前目录加入到配置文件的搜索路径中</span></span>
<span class="line"><span>		viper.AddConfigPath(&quot;$HOME/.iam&quot;) // 配置文件搜索路径，可以设置多个配置文件搜索路径</span></span>
<span class="line"><span>		viper.SetConfigName(&quot;config&quot;)     // 配置文件名称（没有文件扩展名）</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if err := viper.ReadInConfig(); err != nil { // 读取配置文件。如果指定了配置文件名，则使用指定的配置文件，否则在注册的搜索路径中搜索</span></span>
<span class="line"><span>		panic(fmt.Errorf(&quot;Fatal error config file: %s \\n&quot;, err))</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	fmt.Printf(&quot;Used configuration file is: %s\\n&quot;, viper.ConfigFileUsed())</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Viper支持设置多个配置文件搜索路径，需要注意添加搜索路径的顺序，Viper会根据添加的路径顺序搜索配置文件，如果找到则停止搜索。如果调用SetConfigFile直接指定了配置文件名，并且配置文件名没有文件扩展名时，需要显式指定配置文件的格式，以使Viper能够正确解析配置文件。</p><p>如果通过搜索的方式查找配置文件，则需要注意，SetConfigName设置的配置文件名是不带扩展名的，在搜索时Viper会在文件名之后追加文件扩展名，并尝试搜索所有支持的扩展类型。</p><ol start="3"><li>监听和重新读取配置文件。</li></ol><p>Viper支持在运行时让应用程序实时读取配置文件，也就是热加载配置。可以通过WatchConfig函数热加载配置。在调用WatchConfig函数之前，需要确保已经添加了配置文件的搜索路径。另外，还可以为Viper提供一个回调函数，以便在每次发生更改时运行。这里我也给你个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.WatchConfig()</span></span>
<span class="line"><span>viper.OnConfigChange(func(e fsnotify.Event) {</span></span>
<span class="line"><span>   // 配置文件发生变更之后会调用的回调函数</span></span>
<span class="line"><span>	fmt.Println(&quot;Config file changed:&quot;, e.Name)</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>我不建议在实际开发中使用热加载功能，因为即使配置热加载了，程序中的代码也不一定会热加载。例如：修改了服务监听端口，但是服务没有重启，这时候服务还是监听在老的端口上，会造成不一致。</p><ol start="4"><li>设置配置值。</li></ol><p>我们可以通过viper.Set()函数来显式设置配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.Set(&quot;user.username&quot;, &quot;colin&quot;)</span></span></code></pre></div><ol start="5"><li>使用环境变量。</li></ol><p>Viper还支持环境变量，通过如下5个函数来支持环境变量：</p><ul><li>AutomaticEnv()</li><li>BindEnv(input …string) error</li><li>SetEnvPrefix(in string)</li><li>SetEnvKeyReplacer(r *strings.Replacer)</li><li>AllowEmptyEnv(allowEmptyEnv bool)</li></ul><p>这里要注意：Viper读取环境变量是区分大小写的。Viper提供了一种机制来确保Env变量是唯一的。通过使用SetEnvPrefix，可以告诉Viper在读取环境变量时使用前缀。BindEnv和AutomaticEnv都将使用此前缀。比如，我们设置了viper.SetEnvPrefix(“VIPER”)，当使用viper.Get(“apiversion”)时，实际读取的环境变量是 <code>VIPER_APIVERSION</code>。</p><p>BindEnv需要一个或两个参数。第一个参数是键名，第二个是环境变量的名称，环境变量的名称区分大小写。如果未提供Env变量名，则Viper将假定Env变量名为： <code>环境变量前缀_键名全大写</code>。例如：前缀为VIPER，key为username，则Env变量名为 <code>VIPER_USERNAME</code>。当显示提供Env变量名（第二个参数）时，它不会自动添加前缀。例如，如果第二个参数是ID，Viper将查找环境变量ID。</p><p>在使用Env变量时，需要注意的一件重要事情是：每次访问该值时都将读取它。Viper在调用BindEnv时不固定该值。</p><p>还有一个魔法函数SetEnvKeyReplacer，SetEnvKeyReplacer允许你使用strings.Replacer对象来重写Env键。如果你想在Get()调用中使用 <code>-</code> 或者 <code>.</code>，但希望你的环境变量使用 <code>_</code> 分隔符，可以通过SetEnvKeyReplacer来实现。比如，我们设置了环境变量 <code>USER_SECRET_KEY=bVix2WBv0VPfrDrvlLWrhEdzjLpPCNYb</code>，但我们想用 <code>viper.Get(&quot;user.secret-key&quot;)</code>，那我们就调用函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.SetEnvKeyReplacer(strings.NewReplacer(&quot;.&quot;, &quot;_&quot;, &quot;-&quot;, &quot;_&quot;))</span></span></code></pre></div><p>上面的代码，在调用viper.Get()函数时，会用_替换 <code>.</code> 和 <code>-</code>。默认情况下，空环境变量被认为是未设置的，并将返回到下一个配置源。若要将空环境变量视为已设置，可以使用AllowEmptyEnv方法。使用环境变量示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用环境变量</span></span>
<span class="line"><span>os.Setenv(&quot;VIPER_USER_SECRET_ID&quot;, &quot;QLdywI2MrmDVjSSv6e95weNRvmteRjfKAuNV&quot;)</span></span>
<span class="line"><span>os.Setenv(&quot;VIPER_USER_SECRET_KEY&quot;, &quot;bVix2WBv0VPfrDrvlLWrhEdzjLpPCNYb&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>viper.AutomaticEnv()                                             // 读取环境变量</span></span>
<span class="line"><span>viper.SetEnvPrefix(&quot;VIPER&quot;)                                      // 设置环境变量前缀：VIPER_，如果是viper，将自动转变为大写。</span></span>
<span class="line"><span>viper.SetEnvKeyReplacer(strings.NewReplacer(&quot;.&quot;, &quot;_&quot;, &quot;-&quot;, &quot;_&quot;)) // 将viper.Get(key) key字符串中&#39;.&#39;和&#39;-&#39;替换为&#39;_&#39;</span></span>
<span class="line"><span>viper.BindEnv(&quot;user.secret-key&quot;)</span></span>
<span class="line"><span>viper.BindEnv(&quot;user.secret-id&quot;, &quot;USER_SECRET_ID&quot;) // 绑定环境变量名到key</span></span></code></pre></div><ol start="6"><li>使用标志。</li></ol><p>Viper支持Pflag包，能够绑定key到Flag。与BindEnv类似，在调用绑定方法时，不会设置该值，但在访问它时会设置。对于单个标志，可以调用BindPFlag()进行绑定：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.BindPFlag(&quot;token&quot;, pflag.Lookup(&quot;token&quot;)) // 绑定单个标志</span></span></code></pre></div><p>还可以绑定一组现有的pflags（pflag.FlagSet）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.BindPFlags(pflag.CommandLine)             //绑定标志集</span></span></code></pre></div><h3 id="读取配置" tabindex="-1">读取配置 <a class="header-anchor" href="#读取配置" aria-label="Permalink to &quot;读取配置&quot;">​</a></h3><p>Viper提供了如下方法来读取配置：</p><ul><li>Get(key string) interface{}</li><li>Get <code>&amp;lt;Type&gt;</code>(key string) <code>&amp;lt;Type&gt;</code></li><li>AllSettings() map[string]interface{}</li><li>IsSet(key string) : bool</li></ul><p>每一个Get方法在找不到值的时候都会返回零值。为了检查给定的键是否存在，可以使用IsSet()方法。 <code>&amp;lt;Type&gt;</code> 可以是Viper支持的类型，首字母大写：Bool、Float64、Int、IntSlice、String、StringMap、StringMapString、StringSlice、Time、Duration。例如：GetInt()。</p><p>常见的读取配置方法有以下几种。</p><ol><li>访问嵌套的键。</li></ol><p>例如，加载下面的JSON文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;host&quot;: {</span></span>
<span class="line"><span>        &quot;address&quot;: &quot;localhost&quot;,</span></span>
<span class="line"><span>        &quot;port&quot;: 5799</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;datastore&quot;: {</span></span>
<span class="line"><span>        &quot;metric&quot;: {</span></span>
<span class="line"><span>            &quot;host&quot;: &quot;127.0.0.1&quot;,</span></span>
<span class="line"><span>            &quot;port&quot;: 3099</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        &quot;warehouse&quot;: {</span></span>
<span class="line"><span>            &quot;host&quot;: &quot;198.0.0.1&quot;,</span></span>
<span class="line"><span>            &quot;port&quot;: 2112</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Viper可以通过传入 <code>.</code> 分隔的路径来访问嵌套字段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.GetString(&quot;datastore.metric.host&quot;) // (返回 &quot;127.0.0.1&quot;)</span></span></code></pre></div><p>如果 <code>datastore.metric</code> 被直接赋值覆盖（被Flag、环境变量、set()方法等等），那么 <code>datastore.metric</code> 的所有子键都将变为未定义状态，它们被高优先级配置级别覆盖了。</p><p>如果存在与分隔的键路径匹配的键，则直接返回其值。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;datastore.metric.host&quot;: &quot;0.0.0.0&quot;,</span></span>
<span class="line"><span>    &quot;host&quot;: {</span></span>
<span class="line"><span>        &quot;address&quot;: &quot;localhost&quot;,</span></span>
<span class="line"><span>        &quot;port&quot;: 5799</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;datastore&quot;: {</span></span>
<span class="line"><span>        &quot;metric&quot;: {</span></span>
<span class="line"><span>            &quot;host&quot;: &quot;127.0.0.1&quot;,</span></span>
<span class="line"><span>            &quot;port&quot;: 3099</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        &quot;warehouse&quot;: {</span></span>
<span class="line"><span>            &quot;host&quot;: &quot;198.0.0.1&quot;,</span></span>
<span class="line"><span>            &quot;port&quot;: 2112</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过viper.GetString获取值：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viper.GetString(&quot;datastore.metric.host&quot;) // 返回 &quot;0.0.0.0&quot;</span></span></code></pre></div><ol start="2"><li>反序列化。</li></ol><p>Viper可以支持将所有或特定的值解析到结构体、map等。可以通过两个函数来实现：</p><ul><li>Unmarshal(rawVal interface{}) error</li><li>UnmarshalKey(key string, rawVal interface{}) error</li></ul><p>一个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type config struct {</span></span>
<span class="line"><span>	Port int</span></span>
<span class="line"><span>	Name string</span></span>
<span class="line"><span>	PathMap string \`mapstructure:&quot;path_map&quot;\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var C config</span></span>
<span class="line"><span></span></span>
<span class="line"><span>err := viper.Unmarshal(&amp;C)</span></span>
<span class="line"><span>if err != nil {</span></span>
<span class="line"><span>	t.Fatalf(&quot;unable to decode into struct, %v&quot;, err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果想要解析那些键本身就包含 <code>.</code>(默认的键分隔符）的配置，则需要修改分隔符：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>v := viper.NewWithOptions(viper.KeyDelimiter(&quot;::&quot;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>v.SetDefault(&quot;chart::values&quot;, map[string]interface{}{</span></span>
<span class="line"><span>    &quot;ingress&quot;: map[string]interface{}{</span></span>
<span class="line"><span>        &quot;annotations&quot;: map[string]interface{}{</span></span>
<span class="line"><span>            &quot;traefik.frontend.rule.type&quot;:                 &quot;PathPrefix&quot;,</span></span>
<span class="line"><span>            &quot;traefik.ingress.kubernetes.io/ssl-redirect&quot;: &quot;true&quot;,</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type config struct {</span></span>
<span class="line"><span>	Chart struct{</span></span>
<span class="line"><span>        Values map[string]interface{}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var C config</span></span>
<span class="line"><span></span></span>
<span class="line"><span>v.Unmarshal(&amp;C)</span></span></code></pre></div><p>Viper在后台使用 <code>github.com/mitchellh/mapstructure</code> 来解析值，其默认情况下使用 <code>mapstructure tags</code>。当我们需要将Viper读取的配置反序列到我们定义的结构体变量中时，一定要使用mapstructure tags。</p><ol start="3"><li>序列化成字符串。</li></ol><p>有时候我们需要将Viper中保存的所有设置序列化到一个字符串中，而不是将它们写入到一个文件中，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import (</span></span>
<span class="line"><span>    yaml &quot;gopkg.in/yaml.v2&quot;</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func yamlStringSettings() string {</span></span>
<span class="line"><span>    c := viper.AllSettings()</span></span>
<span class="line"><span>    bs, err := yaml.Marshal(c)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatalf(&quot;unable to marshal config to YAML: %v&quot;, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return string(bs)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="现代化的命令行框架-cobra全解" tabindex="-1">现代化的命令行框架：Cobra全解 <a class="header-anchor" href="#现代化的命令行框架-cobra全解" aria-label="Permalink to &quot;现代化的命令行框架：Cobra全解&quot;">​</a></h2><p>Cobra既是一个可以创建强大的现代CLI应用程序的库，也是一个可以生成应用和命令文件的程序。有许多大型项目都是用Cobra来构建应用程序的，例如 Kubernetes、Docker、etcd、Rkt、Hugo等。</p><p>Cobra建立在commands、arguments和flags结构之上。commands代表命令，arguments代表非选项参数，flags代表选项参数（也叫标志）。一个好的应用程序应该是易懂的，用户可以清晰地知道如何去使用这个应用程序。应用程序通常遵循如下模式： <code>APPNAME VERB NOUN --ADJECTIVE或者APPNAME COMMAND ARG --FLAG</code>，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>git clone URL --bare # clone 是一个命令，URL是一个非选项参数，bare是一个选项参数</span></span></code></pre></div><p>这里，VERB代表动词，NOUN代表名词，ADJECTIVE代表形容词。</p><p>Cobra提供了两种方式来创建命令：Cobra命令和Cobra库。Cobra命令可以生成一个Cobra命令模板，而命令模板也是通过引用Cobra库来构建命令的。所以，这里我直接介绍如何使用Cobra库来创建命令。</p><h3 id="使用cobra库创建命令" tabindex="-1">使用Cobra库创建命令 <a class="header-anchor" href="#使用cobra库创建命令" aria-label="Permalink to &quot;使用Cobra库创建命令&quot;">​</a></h3><p>如果要用Cobra库编码实现一个应用程序，需要首先创建一个空的main.go文件和一个rootCmd文件，之后可以根据需要添加其他命令。具体步骤如下：</p><ol><li>创建rootCmd。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ mkdir -p newApp2 &amp;&amp; cd newApp2</span></span></code></pre></div><p>通常情况下，我们会将rootCmd放在文件cmd/root.go中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var rootCmd = &amp;cobra.Command{</span></span>
<span class="line"><span>  Use:   &quot;hugo&quot;,</span></span>
<span class="line"><span>  Short: &quot;Hugo is a very fast static site generator&quot;,</span></span>
<span class="line"><span>  Long: \`A Fast and Flexible Static Site Generator built with</span></span>
<span class="line"><span>                love by spf13 and friends in Go.</span></span>
<span class="line"><span>                Complete documentation is available at http://hugo.spf13.com\`,</span></span>
<span class="line"><span>  Run: func(cmd *cobra.Command, args []string) {</span></span>
<span class="line"><span>    // Do Stuff Here</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Execute() {</span></span>
<span class="line"><span>  if err := rootCmd.Execute(); err != nil {</span></span>
<span class="line"><span>    fmt.Println(err)</span></span>
<span class="line"><span>    os.Exit(1)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>还可以在init()函数中定义标志和处理配置，例如cmd/root.go。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;fmt&quot;</span></span>
<span class="line"><span>  &quot;os&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  homedir &quot;github.com/mitchellh/go-homedir&quot;</span></span>
<span class="line"><span>  &quot;github.com/spf13/cobra&quot;</span></span>
<span class="line"><span>  &quot;github.com/spf13/viper&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    cfgFile     string</span></span>
<span class="line"><span>	  projectBase string</span></span>
<span class="line"><span>    userLicense string</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func init() {</span></span>
<span class="line"><span>  cobra.OnInitialize(initConfig)</span></span>
<span class="line"><span>  rootCmd.PersistentFlags().StringVar(&amp;cfgFile, &quot;config&quot;, &quot;&quot;, &quot;config file (default is $HOME/.cobra.yaml)&quot;)</span></span>
<span class="line"><span>  rootCmd.PersistentFlags().StringVarP(&amp;projectBase, &quot;projectbase&quot;, &quot;b&quot;, &quot;&quot;, &quot;base project directory eg. github.com/spf13/&quot;)</span></span>
<span class="line"><span>  rootCmd.PersistentFlags().StringP(&quot;author&quot;, &quot;a&quot;, &quot;YOUR NAME&quot;, &quot;Author name for copyright attribution&quot;)</span></span>
<span class="line"><span>  rootCmd.PersistentFlags().StringVarP(&amp;userLicense, &quot;license&quot;, &quot;l&quot;, &quot;&quot;, &quot;Name of license for the project (can provide \`licensetext\` in config)&quot;)</span></span>
<span class="line"><span>  rootCmd.PersistentFlags().Bool(&quot;viper&quot;, true, &quot;Use Viper for configuration&quot;)</span></span>
<span class="line"><span>  viper.BindPFlag(&quot;author&quot;, rootCmd.PersistentFlags().Lookup(&quot;author&quot;))</span></span>
<span class="line"><span>  viper.BindPFlag(&quot;projectbase&quot;, rootCmd.PersistentFlags().Lookup(&quot;projectbase&quot;))</span></span>
<span class="line"><span>  viper.BindPFlag(&quot;useViper&quot;, rootCmd.PersistentFlags().Lookup(&quot;viper&quot;))</span></span>
<span class="line"><span>  viper.SetDefault(&quot;author&quot;, &quot;NAME HERE &amp;lt;EMAIL ADDRESS&amp;gt;&quot;)</span></span>
<span class="line"><span>  viper.SetDefault(&quot;license&quot;, &quot;apache&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func initConfig() {</span></span>
<span class="line"><span>  // Don&#39;t forget to read config either from cfgFile or from home directory!</span></span>
<span class="line"><span>  if cfgFile != &quot;&quot; {</span></span>
<span class="line"><span>    // Use config file from the flag.</span></span>
<span class="line"><span>    viper.SetConfigFile(cfgFile)</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    // Find home directory.</span></span>
<span class="line"><span>    home, err := homedir.Dir()</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>      fmt.Println(err)</span></span>
<span class="line"><span>      os.Exit(1)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Search config in home directory with name &quot;.cobra&quot; (without extension).</span></span>
<span class="line"><span>    viper.AddConfigPath(home)</span></span>
<span class="line"><span>    viper.SetConfigName(&quot;.cobra&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if err := viper.ReadInConfig(); err != nil {</span></span>
<span class="line"><span>    fmt.Println(&quot;Can&#39;t read config:&quot;, err)</span></span>
<span class="line"><span>    os.Exit(1)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>创建main.go。</li></ol><p>我们还需要一个main函数来调用rootCmd，通常我们会创建一个main.go文件，在main.go中调用rootCmd.Execute()来执行命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;{pathToYourApp}/cmd&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>  cmd.Execute()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要注意，main.go中不建议放很多代码，通常只需要调用cmd.Execute()即可。</p><ol start="3"><li>添加命令。</li></ol><p>除了rootCmd，我们还可以调用AddCommand添加其他命令，通常情况下，我们会把其他命令的源码文件放在cmd/目录下，例如，我们添加一个version命令，可以创建cmd/version.go文件，内容为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package cmd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &quot;github.com/spf13/cobra&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func init() {</span></span>
<span class="line"><span>  rootCmd.AddCommand(versionCmd)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var versionCmd = &amp;cobra.Command{</span></span>
<span class="line"><span>  Use:   &quot;version&quot;,</span></span>
<span class="line"><span>  Short: &quot;Print the version number of Hugo&quot;,</span></span>
<span class="line"><span>  Long:  \`All software has versions. This is Hugo&#39;s\`,</span></span>
<span class="line"><span>  Run: func(cmd *cobra.Command, args []string) {</span></span>
<span class="line"><span>    fmt.Println(&quot;Hugo Static Site Generator v0.9 -- HEAD&quot;)</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本示例中，我们通过调用 <code>rootCmd.AddCommand(versionCmd)</code> 给rootCmd命令添加了一个versionCmd命令。</p><ol start="4"><li>编译并运行。</li></ol><p>将main.go中 <code>{pathToYourApp}</code> 替换为对应的路径，例如本示例中pathToYourApp为 <code>github.com/marmotedu/gopractise-demo/cobra/newApp2</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go mod init github.com/marmotedu/gopractise-demo/cobra/newApp2</span></span>
<span class="line"><span>$ go build -v .</span></span>
<span class="line"><span>$ ./newApp2 -h</span></span>
<span class="line"><span>A Fast and Flexible Static Site Generator built with</span></span>
<span class="line"><span>love by spf13 and friends in Go.</span></span>
<span class="line"><span>Complete documentation is available at http://hugo.spf13.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Usage:</span></span>
<span class="line"><span>hugo [flags]</span></span>
<span class="line"><span>hugo [command]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Available Commands:</span></span>
<span class="line"><span>help Help about any command</span></span>
<span class="line"><span>version Print the version number of Hugo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Flags:</span></span>
<span class="line"><span>-a, --author string Author name for copyright attribution (default &quot;YOUR NAME&quot;)</span></span>
<span class="line"><span>--config string config file (default is $HOME/.cobra.yaml)</span></span>
<span class="line"><span>-h, --help help for hugo</span></span>
<span class="line"><span>-l, --license licensetext Name of license for the project (can provide licensetext in config)</span></span>
<span class="line"><span>-b, --projectbase string base project directory eg. github.com/spf13/</span></span>
<span class="line"><span>--viper Use Viper for configuration (default true)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Use &quot;hugo [command] --help&quot; for more information about a command.</span></span></code></pre></div><p>通过步骤一、步骤二、步骤三，我们就成功创建和添加了Cobra应用程序及其命令。</p><p>接下来，我再来详细介绍下Cobra的核心特性。</p><h3 id="使用标志" tabindex="-1">使用标志 <a class="header-anchor" href="#使用标志" aria-label="Permalink to &quot;使用标志&quot;">​</a></h3><p>Cobra可以跟Pflag结合使用，实现强大的标志功能。使用步骤如下：</p><ol><li>使用持久化的标志。</li></ol><p>标志可以是“持久的”，这意味着该标志可用于它所分配的命令以及该命令下的每个子命令。可以在rootCmd上定义持久标志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rootCmd.PersistentFlags().BoolVarP(&amp;Verbose, &quot;verbose&quot;, &quot;v&quot;, false, &quot;verbose output&quot;)</span></span></code></pre></div><ol start="2"><li>使用本地标志。</li></ol><p>也可以分配一个本地标志，本地标志只能在它所绑定的命令上使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rootCmd.Flags().StringVarP(&amp;Source, &quot;source&quot;, &quot;s&quot;, &quot;&quot;, &quot;Source directory to read from&quot;)</span></span></code></pre></div><p><code>--source</code> 标志只能在rootCmd上引用，而不能在rootCmd的子命令上引用。</p><ol start="3"><li>将标志绑定到Viper。</li></ol><p>我们可以将标志绑定到Viper，这样就可以使用viper.Get()获取标志的值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var author string</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func init() {</span></span>
<span class="line"><span>  rootCmd.PersistentFlags().StringVar(&amp;author, &quot;author&quot;, &quot;YOUR NAME&quot;, &quot;Author name for copyright attribution&quot;)</span></span>
<span class="line"><span>  viper.BindPFlag(&quot;author&quot;, rootCmd.PersistentFlags().Lookup(&quot;author&quot;))</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="4"><li>设置标志为必选。</li></ol><p>默认情况下，标志是可选的，我们也可以设置标志为必选，当设置标志为必选，但是没有提供标志时，Cobra会报错。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rootCmd.Flags().StringVarP(&amp;Region, &quot;region&quot;, &quot;r&quot;, &quot;&quot;, &quot;AWS region (required)&quot;)</span></span>
<span class="line"><span>rootCmd.MarkFlagRequired(&quot;region&quot;)</span></span></code></pre></div><h3 id="非选项参数验证" tabindex="-1">非选项参数验证 <a class="header-anchor" href="#非选项参数验证" aria-label="Permalink to &quot;非选项参数验证&quot;">​</a></h3><p>在命令的过程中，经常会传入非选项参数，并且需要对这些非选项参数进行验证，Cobra提供了机制来对非选项参数进行验证。可以使用Command的Args字段来验证非选项参数。Cobra也内置了一些验证函数：</p><ul><li>NoArgs：如果存在任何非选项参数，该命令将报错。</li><li>ArbitraryArgs：该命令将接受任何非选项参数。</li><li>OnlyValidArgs：如果有任何非选项参数不在Command的ValidArgs字段中，该命令将报错。</li><li>MinimumNArgs(int)：如果没有至少N个非选项参数，该命令将报错。</li><li>MaximumNArgs(int)：如果有多于N个非选项参数，该命令将报错。</li><li>ExactArgs(int)：如果非选项参数个数不为N，该命令将报错。</li><li>ExactValidArgs(int)：如果非选项参数的个数不为N，或者非选项参数不在Command的ValidArgs字段中，该命令将报错。</li><li>RangeArgs(min, max)：如果非选项参数的个数不在min和max之间，该命令将报错。</li></ul><p>使用预定义验证函数，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var cmd = &amp;cobra.Command{</span></span>
<span class="line"><span>  Short: &quot;hello&quot;,</span></span>
<span class="line"><span>  Args: cobra.MinimumNArgs(1), // 使用内置的验证函数</span></span>
<span class="line"><span>  Run: func(cmd *cobra.Command, args []string) {</span></span>
<span class="line"><span>    fmt.Println(&quot;Hello, World!&quot;)</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然你也可以自定义验证函数，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var cmd = &amp;cobra.Command{</span></span>
<span class="line"><span>  Short: &quot;hello&quot;,</span></span>
<span class="line"><span>  // Args: cobra.MinimumNArgs(10),</span><span> // 使用内置的验证函数</span></span>
<span class="line"><span>  Args: func(cmd *cobra.Command, args []string) error { // 自定义验证函数</span></span>
<span class="line"><span>    if len(args) &amp;lt; 1 {</span></span>
<span class="line"><span>      return errors.New(&quot;requires at least one arg&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if myapp.IsValidColor(args[0]) {</span></span>
<span class="line"><span>      return nil</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return fmt.Errorf(&quot;invalid color specified: %s&quot;, args[0])</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  Run: func(cmd *cobra.Command, args []string) {</span></span>
<span class="line"><span>    fmt.Println(&quot;Hello, World!&quot;)</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="prerun-and-postrun-hooks" tabindex="-1">PreRun and PostRun Hooks <a class="header-anchor" href="#prerun-and-postrun-hooks" aria-label="Permalink to &quot;PreRun and PostRun Hooks&quot;">​</a></h3><p>在运行Run函数时，我们可以运行一些钩子函数，比如PersistentPreRun和PreRun函数在Run函数之前执行，PersistentPostRun和PostRun在Run函数之后执行。如果子命令没有指定 <code>Persistent*Run</code> 函数，则子命令将会继承父命令的 <code>Persistent*Run</code> 函数。这些函数的运行顺序如下：</p><ol><li>PersistentPreRun</li><li>PreRun</li><li>Run</li><li>PostRun</li><li>PersistentPostRun</li></ol><p>注意，父级的PreRun只会在父级命令运行时调用，子命令是不会调用的。</p><p>Cobra还支持很多其他有用的特性，比如：自定义Help命令；可以自动添加 <code>--version</code> 标志，输出程序版本信息；当用户提供无效标志或无效命令时，Cobra可以打印出usage信息；当我们输入的命令有误时，Cobra会根据注册的命令，推算出可能的命令，等等。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在开发Go项目时，我们可以通过Pflag来解析命令行参数，通过Viper来解析配置文件，用Cobra来实现命令行框架。你可以通过pflag.String()、 pflag.StringP()、pflag.StringVar()、pflag.StringVarP()方法来设置命令行参数，并使用Get <code>&amp;lt;Type&gt;</code> 来获取参数的值。</p><p>同时，你也可以使用Viper从命令行参数、环境变量、配置文件等位置读取配置项。最常用的是从配置文件中读取，可以通过viper.AddConfigPath来设置配置文件搜索路径，通过viper.SetConfigFile和viper.SetConfigType来设置配置文件名，通过viper.ReadInConfig来读取配置文件。读取完配置文件，然后在程序中使用Get/Get <code>&amp;lt;Type&gt;</code> 来读取配置项的值。</p><p>最后，你可以使用Cobra来构建一个命令行框架，Cobra可以很好地集成Pflag和Viper。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li><p>研究下Cobra的代码，看下Cobra是如何跟Pflag和Viper进行集成的。</p></li><li><p>思考下，除了Pflag、Viper、Cobra，你在开发过程中还遇到哪些优秀的包，来处理命令行参数、配置文件和启动命令行框架的呢？欢迎在留言区分享。</p></li></ol><p>欢迎你在留言区与我交流讨论，我们下一讲见！</p>`,200)])])}const h=s(l,[["render",t]]);export{d as __pageData,h as default};
