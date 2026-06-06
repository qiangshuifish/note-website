import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"60 | 架构分解：边界，不断重新审视边界","description":"","frontmatter":{},"headers":[{"level":2,"title":"IO 子系统的需求与初始架构","slug":"io-子系统的需求与初始架构","link":"#io-子系统的需求与初始架构","children":[]},{"level":2,"title":"Visitor 模式","slug":"visitor-模式","link":"#visitor-模式","children":[]},{"level":2,"title":"IO DOM 模式","slug":"io-dom-模式","link":"#io-dom-模式","children":[]},{"level":2,"title":"回到最初的需求","slug":"回到最初的需求","link":"#回到最初的需求","children":[]},{"level":2,"title":"不断重新审视边界","slug":"不断重新审视边界","link":"#不断重新审视边界","children":[]},{"level":2,"title":"结语","slug":"结语","link":"#结语","children":[]}],"relativePath":"许式伟的架构课/60-架构分解：边界，不断重新审视边界.md","filePath":"许式伟的架构课/60-架构分解：边界，不断重新审视边界.md","lastUpdated":1779821983000}'),l={name:"许式伟的架构课/60-架构分解：边界，不断重新审视边界.md"};function i(o,s,t,r,c,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_60-架构分解-边界-不断重新审视边界" tabindex="-1">60 | 架构分解：边界，不断重新审视边界 <a class="header-anchor" href="#_60-架构分解-边界-不断重新审视边界" aria-label="Permalink to &quot;60 | 架构分解：边界，不断重新审视边界&quot;">​</a></h1><p>你好，我是七牛云许式伟。</p><p>在上一讲 “ <a href="https://time.geekbang.org/column/article/169113" target="_blank" rel="noreferrer">59 | 少谈点框架，多谈点业务</a>” 中，我们强调：</p><blockquote><p>架构就是业务的正交分解。每个模块都有它自己的业务。</p></blockquote><p>这里我们说的模块是一种泛指，它包括：函数、类、接口、包、子系统、网络服务程序、桌面程序等等。</p><p>接口是业务的抽象，同时也是它与使用方的耦合方式。在业务分解的过程中，我们需要认真审视模块的接口，发现其中 “过度的（或多余的）” 约束条件，把它提高到足够通用的、普适的场景来看。</p><h2 id="io-子系统的需求与初始架构" tabindex="-1">IO 子系统的需求与初始架构 <a class="header-anchor" href="#io-子系统的需求与初始架构" aria-label="Permalink to &quot;IO 子系统的需求与初始架构&quot;">​</a></h2><p>这样说太抽象了，今天我们拿一个实际的例子来说明我们在审视模块的业务边界时，需要用什么样的思维方式来思考。</p><p>我们选的例子，是办公软件的 IO 子系统。从需求来说，我们首先考虑支持的是：</p><ul><li>读盘、存盘；</li><li>剪贴板的拷贝（存盘）、粘贴（读盘）。</li></ul><p>读盘功能不只是要能够加载自定义格式的文件，也要支持业界主流的文件格式，如：</p><ul><li>Word 文档、RTF 文档；</li><li>HTML 文档、纯文本文档。</li></ul><p>存盘功能更复杂一些，它不只是要支持保存为以上基于文本逻辑的流式文档，还要支持基于分页显示的文档格式，如：</p><ul><li>PDF 文档；</li><li>PS 文档。</li></ul><p>对于这样的业务需求，我们应该怎么做架构设计？</p><p>我第一次看到的设计大概是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Span struct {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SaveWord(ctx *SaveWordContext) error</span></span>
<span class="line"><span>  SaveRTF(ctx *SaveRTFContext) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  LoadWord(ctx *LoadWordContext) error</span></span>
<span class="line"><span>  LoadRTF(ctx *LoadRTFContext) error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Paragraph struct {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  SpanCount() int</span></span>
<span class="line"><span>  GetSpan(i int) *Span</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SaveWord(ctx *SaveWordContext) error</span></span>
<span class="line"><span>  SaveRTF(ctx *SaveRTFContext) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  LoadWord(ctx *LoadWordContext) error</span></span>
<span class="line"><span>  LoadRTF(ctx *LoadRTFContext) error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type TextPool struct {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  ParagraphCount() int</span></span>
<span class="line"><span>  GetParagraph(i int) *Paragraph</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SaveWord(ctx *SaveWordContext) error</span></span>
<span class="line"><span>  SaveRTF(ctx *SaveRTFContext) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  LoadWord(ctx *LoadWordContext) error</span></span>
<span class="line"><span>  LoadRTF(ctx *LoadRTFContext) error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Document struct {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  TextPool() *TextPool</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SaveWord(stg IStorage) error</span></span>
<span class="line"><span>  SaveRTF(f *os.File) error</span></span>
<span class="line"><span>  SaveFile(file string, format string) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  LoadWord(stg IStorage) error</span></span>
<span class="line"><span>  LoadRTF(f *os.File) error</span></span>
<span class="line"><span>  LoadFile(file string) error</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面的设计可以看出，读盘存盘的代码散落在核心系统的各处，几乎每个类都需要进行相关的修改。这类功能我们把它叫做 “全局性功能”。我们下一讲将专门讨论全局性功能怎么做设计。</p><p>全局性功能的架构设计要非常小心。如果按上面这种设计，我们无法称之为一个独立的子系统，它完完全全是核心系统的一部分。</p><p>某种程度上来说，这个架构是受了 OOP 思想的毒害，以为一切都应该以对象为中心，况且在微软的 MFC 框架里面有 Serialization 机制支持，进一步加剧了写这类存盘读盘代码的倾向。</p><p>这当然是不太好的。在良好的设计中，一方面核心系统功能要少，少到只有最小子集；另一方面核心功能要能够收敛，不能越加越多。</p><p>但读盘存盘的需求是开放的，今天支持 Word 和 RTF 文档，明天支持 HTML，后天微软又出来新的 docx 格式。文件格式总是层出不穷，难以收敛。</p><h2 id="visitor-模式" tabindex="-1">Visitor 模式 <a class="header-anchor" href="#visitor-模式" aria-label="Permalink to &quot;Visitor 模式&quot;">​</a></h2><p>所以，以上读盘存盘的架构设计不是一个好的架构设计。那么应该怎么办呢？可能有人会想到设计模式中的 Visitor 模式。</p><p>什么是 Visitor 模式？简单来说，它的目的是为核心系统的 Model 层提供一套遍历数据的接口，数据最终是通过事件的方式接收。如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Visitor interface {</span></span>
<span class="line"><span>  StartDocument(attrs *DocumentAttrs) error</span></span>
<span class="line"><span>  StartParagraph(attrs *ParagraphAttrs) error</span></span>
<span class="line"><span>  StartSpan(attrs *SpanAttrs) error</span></span>
<span class="line"><span>  Characters(chars []byte) error</span></span>
<span class="line"><span>  EndSpan() error</span></span>
<span class="line"><span>  EndParagraph() error</span></span>
<span class="line"><span>  EndDocument() error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type VisitableDoc interface {</span></span>
<span class="line"><span>  Visit(visitor Visitor) error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Document struct {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  Visit(visitor Visitor) error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewDocument() *Document</span></span>
<span class="line"><span>func LoadDocument(doc VisitableDoc) (*Document, error)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func SaveWord(stg IStorage, doc VisitableDoc) error</span></span>
<span class="line"><span>func SaveRTF(f *os.File, doc VisitableDoc) error</span></span>
<span class="line"><span>func SaveFile(file string, format string, doc VisitableDoc) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func LoadWord(stg IStorage) (VisitableDoc, error)</span></span>
<span class="line"><span>func LoadRTF(f *os.File) (VisitableDoc, error)</span></span>
<span class="line"><span>func LoadFile(file string) (VisitableDoc, error)</span></span></code></pre></div><p>这样做的好处是显然的。</p><p>一方面，核心系统为 IO 系统提供了统一的数据访问接口。这样 IO 子系统就从核心系统中抽离出来了。</p><p>另一方面，Word 文档的支持、RTF 文档的支持这些模块在 IO 子系统中也彼此完全独立，却又相互可以非常融洽地进行配合。比如我们可以很方便将 RTF 文件转为 Word 文件，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func ConvRTF2Word(rtf *os.File, word IStorage) error {</span></span>
<span class="line"><span>  doc, err := LoadRTF(rtf)</span></span>
<span class="line"><span>  if err != nil {</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return SaveWord(word, doc)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类似地，加载一个 Word 文件的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func LoadWordDocument(stg IStorage) (*Document, error) {</span></span>
<span class="line"><span>  vdoc, err := LoadWord(stg)</span></span>
<span class="line"><span>  if err != nil {</span></span>
<span class="line"><span>    return nil, err</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return LoadDocument(vdoc)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么这个设计有什么问题？</p><p>如果你对比上一讲 “ <a href="/note-website/https:/time.geekbang.org/column/article/169113">59 | 少谈点框架，多谈点业务</a>” 提到的 SAX 和 DOM 模式，很容易看出这里的 Visitor 模式本质上就是 SAX 模式，只不过数据源不再是磁盘中的文件，而是换成了核心系统的 Model 层而已。</p><p>所以我前面讲的 SAX 模式的缺点它一样有。它最大的问题是有预设的数据访问逻辑，其客户未必期望以相同的逻辑访问数据。</p><p>基于事件模型是一个非常简陋的编程框架，与大部分 IO 子系统的需求方，比如我们这里的 Word 文档存盘、RTF 文档存盘的诉求并不那么匹配。解决这种不匹配的常规做法是把数据先缓存下来，等到我当前步骤所有需要的数据都已经发送过来了，再进行处理。</p><p>这个设计并不是假想的，实际上我当年在做 WPS Office IO 子系统第一版本的架构设计时，就采用了这个架构。但最终实践下来，我自己总结的时候认为它是一个非常失败的设计。</p><p>一方面，虽然 Visitor 或者 SAX 模式看起来是 “简洁而高效” 的，但是实际编码中程序员的心智负担比较大，有大量的冗余代码纯粹就是为了缓存数据，等待更多有效的数据。</p><p>另一方面，这个接口仍然是抽象而难以理解的。比如，不同事件的次序是什么样的，需要较长的文档说明。</p><p>这也是给架构师们提了个醒，我们架构设计的 KISS 原则提倡的简单，并不是接口外观上的简洁，而是业务语义表达上的准确无歧义。</p><h2 id="io-dom-模式" tabindex="-1">IO DOM 模式 <a class="header-anchor" href="#io-dom-模式" aria-label="Permalink to &quot;IO DOM 模式&quot;">​</a></h2><p>所以第二次的架构迭代，我们调整为基于 DOM 模式，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type IoSpan interface {</span></span>
<span class="line"><span>  Text() []byte</span></span>
<span class="line"><span>  Attributes() IoSpanAttrs</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type IoSpans interface {</span></span>
<span class="line"><span>  Len() int</span></span>
<span class="line"><span>  Elem(i int) IoSpan</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type IoParagraph interface {</span></span>
<span class="line"><span>  Spans() IoSpans</span></span>
<span class="line"><span>  Attributes() IoParagraphAttrs</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type IoParagraphs interface {</span></span>
<span class="line"><span>  Len() int</span></span>
<span class="line"><span>  Elem(i int) IoParagraph</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type IoDocument interface {</span></span>
<span class="line"><span>  Paragraphs() IoParagraphs</span></span>
<span class="line"><span>  Attributes() IoDocumentAttrs</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewIoDocument() IoDocument</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Document struct {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  Io() IoDocument</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewDocument() *Document</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func SaveWord(stg IStorage, doc IoDocument) error</span></span>
<span class="line"><span>func SaveRTF(f *os.File, doc IoDocument) error</span></span>
<span class="line"><span>func SaveFile(file string, format string, doc IoDocument) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func LoadWord(stg IStorage, doc IoDocument) error</span></span>
<span class="line"><span>func LoadRTF(f *os.File, doc IoDocument) error</span></span>
<span class="line"><span>func LoadFile(file string, doc IoDocument) error</span></span></code></pre></div><p>在这个架构，我们认为有两套 DOM，一套是 IO DOM，即 IoDocument 接口及其相关的接口。一套是核心系统自己的 DOM，也就是 Document 类及其相关的接口。这两套接口几乎是雷同的，理论上 Document 只是 IoDocument 这个 DOM 的超集。</p><p>那么为什么不是直接在接口上体现出超集关系？从语法表达上很难，毕竟这是一个接口族，而不是一个接口。这里我们通过在 Document 类引入 Io() 函数来将其转为 IoDocument 接口，以体现双方的超集关系。</p><p>在这个方案下，将 RTF 文件转为 Word 文件的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func ConvRTF2Word(rtf *os.File, word IStorage) error {</span></span>
<span class="line"><span>  doc := NewIoDocument()</span></span>
<span class="line"><span>  err := LoadRTF(rtf, doc)</span></span>
<span class="line"><span>  if err != nil {</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return SaveWord(word, doc)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类似地，加载一个 Word 文件的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func LoadWordDocument(stg IStorage) (*Document, error) {</span></span>
<span class="line"><span>  doc := NewDocument()</span></span>
<span class="line"><span>  err := LoadWord(stg, doc.Io())</span></span>
<span class="line"><span>  if err != nil {</span></span>
<span class="line"><span>    return nil, err</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return doc, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>相比前面的 Visitor 模式，采用 IO DOM 除了让所有存盘读盘的模块代码工程量变低，接口的理解一致性更好外，还有一个额外的好处，是 IO DOM 更自然，避免了惊异。因为核心系统的 Model 层通常就是通过 DOM 接口暴露的，而 IO DOM 从概念上只是一个子集关系，显然对客户的理解成本来说是最低的。而 Visitor 模式你可以理解为它是核心系统 Model 层为 IO 子系统提供的专用插件机制，它对核心系统来说是额外的成本。</p><p>事实上，在 DOM 模式基础上提供 Visitor 模式是有点多余的。DOM 模式通常提供了极度灵活的数据访问接口，可以适应几乎所有的数据读取场景。</p><h2 id="回到最初的需求" tabindex="-1">回到最初的需求 <a class="header-anchor" href="#回到最初的需求" aria-label="Permalink to &quot;回到最初的需求&quot;">​</a></h2><p>我们是否解决了最初 IO 子系统的所有需求？</p><p>我们简单分析下各类用户故事（User Story）就能够发现其实并没有。我们解决了所有流式文档的存盘读盘，但是没有解决基于分页显示的文档格式支持，如：</p><ul><li>PDF 文档；</li><li>PS 文档。</li></ul><p>因为从核心系统 DOM 得到的文档，或者我们抽象的 IO DOM，都是流式文档，并没有分页信息。如果我们 PDF、PS 文档的存盘接口是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func SavePDF(f *os.File, doc IoDocument) error</span></span>
<span class="line"><span>func SavePS(f *os.File, doc IoDocument) error</span></span></code></pre></div><p>那么意味着这些存盘模块的实现者需要对 IO DOM 进行排版（Render），得到具备分页信息的数据结构，然后以此进行存盘。</p><p>这意味着 IO 子系统在特定的场景下，其实与排版与绘制子系统相关，包括：</p><ul><li>屏幕绘制（onPaint）；</li><li>打印（onPrint）。</li></ul><p>可能有些人能够回忆起来，前面在 “ <a href="https://time.geekbang.org/column/article/105356" target="_blank" rel="noreferrer">22 | 桌面程序的架构建议</a>” 一讲介绍 Model 和 ViewModel 之间的关系时，我也是拿 Office 文档举例。核心系统的 DOM，或者 IO 子系统的 IO DOM，通过排版（Render）功能，可以渲染出 View 层所需的显示数据，我们不妨称之为 View DOM。</p><p>而有了 View DOM，我们就不只是可以进行屏幕绘制和打印，也可以支持 PDF/PS 文档的存盘了。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Render(doc IoDocument) (ViewDocument, error)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func SavePDF(f *os.File, doc ViewDocument) error</span></span>
<span class="line"><span>func SavePS(f *os.File, doc ViewDocument) error</span></span></code></pre></div><p>如果你做需求分析的时候，没有把这些需求关联性找到，那就不是一次合格的需求分析过程。</p><h2 id="不断重新审视边界" tabindex="-1">不断重新审视边界 <a class="header-anchor" href="#不断重新审视边界" aria-label="Permalink to &quot;不断重新审视边界&quot;">​</a></h2><p>到此为止，我们的分析是否已经足够细致，把所有关键细节都想得足够清楚？</p><p>其实并没有，我们在理需求时，我们首先要考虑支持的是：</p><ul><li>剪贴板的拷贝（存盘）、粘贴（读盘）。</li></ul><p>但是我们在整理用户故事（User Story）的时候仍然把它给漏了。当然，剪贴板带来的影响没有 PDF/PS 文档大，它只是意味着我们的数据流不再是 *os.File 可以表达，而是需要用更抽象的 io.Reader/Writer 来表示。也就是说，以下接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func SaveRTF(f *os.File, doc IoDocument) error</span></span>
<span class="line"><span>func LoadRTF(f *os.File, doc IoDocument) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func SavePDF(f *os.File, doc ViewDocument) error</span></span>
<span class="line"><span>func SavePS(f *os.File, doc ViewDocument) error</span></span></code></pre></div><p>要改为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func SaveRTF(f io.Writer, doc IoDocument) error</span></span>
<span class="line"><span>func LoadRTF(f io.Reader, doc IoDocument) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func SavePDF(f io.Writer, doc ViewDocument) error</span></span>
<span class="line"><span>func SavePS(f io.Writer, doc ViewDocument) error</span></span></code></pre></div><p>这其实就是我前面强调的 “发现模块接口中多余的约束”的一种典型表现。在我们模块提高到足够通用的、普适的场景来看时，实际上并不需要剪贴板这样具体的用户场景，也能够及时地发现这种过度约束。</p><p>另外，我们的 IO 子系统的入口级的接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func SaveFile(file string, format string, doc IoDocument) error</span></span>
<span class="line"><span>func LoadFile(file string, doc IoDocument) error</span></span></code></pre></div><p>我们且不说这里面怎么实现插件机制，以便于我们非常方便就能够不修改任何代码，就增加一种新的文件格式的读写支持。我们单就它的边界来看，也需要进一步探讨。</p><p>其一，LoadFile 方法我们可能希望知道加载的文件具体是文档格式，所以应该改为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func LoadFile(file string, doc IoDocument) (format string, err error)</span></span></code></pre></div><p>其二，考虑到剪贴板的支持，我们输入的数据源不一定是文件，还可能是 io.Reader、IStorage 等，在 Windows 平台下有 STGMEDIUM 结构体来表达通用的介质类型，可以参考。从跨平台的角度，也可以考虑直接用 Go 语言中的任意类型。如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Save(src interface{}, format string, doc IoDocument) error</span></span>
<span class="line"><span>func Load(src interface{}, doc IoDocument) (format string, err error)</span></span></code></pre></div><p>既然用了 interface{} 这样的任意类型，就意味着我们需要在文档层面上补充清楚我们都支持些什么，不支持些什么，避免在团队共识上遇到麻烦。</p><p>其三，考虑 PDF/PS 这类非流式文档的支持，我们不能用 IoDocument 作为输入文档的类型。也就是说，以下接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Save(dest interface{}, format string, doc IoDocument) error</span></span></code></pre></div><p>需要作出适当的调整。具体应该怎么调？欢迎留言发表你的观点。</p><h2 id="结语" tabindex="-1">结语 <a class="header-anchor" href="#结语" aria-label="Permalink to &quot;结语&quot;">​</a></h2><p>这一讲我们通过一个实际的例子，来剖析架构设计过程中我们如何在思考模块边界。</p><p>最重要的，当然是职责。不同的业务模块，分别做什么，它们之间通过什么样的方式耦合在一起。这种耦合方式的需求适应性如何，开发人员实现上的心智负担如何，是我们决策的影响因素。</p><p>为了避免留下难以调整的架构缺陷，我们强烈建议你认真细致做好需求分析，并且在架构设计时，认真细致地过一遍所有的用户故事（User Story），以确认我们的架构适应性。</p><p>最后，我们在具体接口的每个输入输出参数的类型选择上，一样要非常考究，尽可能去发现其中 “过度的（或多余的）” 约束。</p><p>如果你对今天的内容有什么思考与解读，欢迎给我留言，我们一起讨论。下一讲我们的话题按照大纲是 “全局性功能的架构设计”，但我计划做一篇加餐，内容是架构思维实战，把前面我们的实战案例 “画图程序” 和这几讲的理论知识结合起来。</p><p>大家可以提前思考以下内容：对画图程序进行子系统的划分，我们的哪些代码是核心系统，哪些是周边系统？从判断架构设计的优劣的角度，我们如何评判它好还是不好？</p><p>如果你自己也实现了一个 “画图程序”，可以根据这几讲的内容，对比一下我们给出的样例，和自己写的有哪些架构思想上的不同，怎么评价它们的好坏？</p><p>如果你觉得有所收获，也欢迎把文章分享给你的朋友。感谢你的收听，我们下期再见。</p>`,93)])])}const g=n(l,[["render",i]]);export{h as __pageData,g as default};
