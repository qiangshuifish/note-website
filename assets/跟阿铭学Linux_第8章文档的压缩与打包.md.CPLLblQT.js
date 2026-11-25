import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"第8章文档的压缩与打包","description":"","frontmatter":{},"headers":[{"level":2,"title":"8.1 gzip 压缩工具","slug":"_8-1-gzip-压缩工具","link":"#_8-1-gzip-压缩工具","children":[]},{"level":2,"title":"8.2 bzip2 压缩工具","slug":"_8-2-bzip2-压缩工具","link":"#_8-2-bzip2-压缩工具","children":[]},{"level":2,"title":"8.3 xz 压缩工具","slug":"_8-3-xz-压缩工具","link":"#_8-3-xz-压缩工具","children":[]},{"level":2,"title":"8.4 tar 打包工具","slug":"_8-4-tar-打包工具","link":"#_8-4-tar-打包工具","children":[{"level":3,"title":"8.4.1 打包的同时使用 gzip 压缩","slug":"_8-4-1-打包的同时使用-gzip-压缩","link":"#_8-4-1-打包的同时使用-gzip-压缩","children":[]},{"level":3,"title":"8.4.2 打包的同时使用 bzip2 压缩","slug":"_8-4-2-打包的同时使用-bzip2-压缩","link":"#_8-4-2-打包的同时使用-bzip2-压缩","children":[]}]},{"level":2,"title":"8.5 使用 zip 压缩","slug":"_8-5-使用-zip-压缩","link":"#_8-5-使用-zip-压缩","children":[]},{"level":2,"title":"8.6 zcat、bzcat命令的使用","slug":"_8-6-zcat、bzcat命令的使用","link":"#_8-6-zcat、bzcat命令的使用","children":[]},{"level":2,"title":"8.7 课后习题","slug":"_8-7-课后习题","link":"#_8-7-课后习题","children":[]}],"relativePath":"跟阿铭学Linux/第8章文档的压缩与打包.md","filePath":"跟阿铭学Linux/第8章文档的压缩与打包.md","lastUpdated":1795561067000}'),t={name:"跟阿铭学Linux/第8章文档的压缩与打包.md"};function l(e,s,h,c,d,r){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="第8章文档的压缩与打包" tabindex="-1">第8章文档的压缩与打包 <a class="header-anchor" href="#第8章文档的压缩与打包" aria-label="Permalink to &quot;第8章文档的压缩与打包&quot;">​</a></h1><p>在 Windows 下，我们接触最多的压缩文件是.rar 格式的；但在 Linux 下，不能识别.rar 格式，它有自己独特的压缩工具。.zip 格式的文件在 Windows 和 Linux 下都能使用。使用压缩文件，不仅能节省磁盘空间，而且在传输时还能节省网络带宽。</p><p>Linux 下最常见的压缩文件通常都是.tar.gz 格式的，除此之外，还有.tar、.gz、.bz2、.zip 等格式。阿铭曾介绍过 Linux 下的文件后缀名可加可不加，但压缩文件最好加上后缀名。这是为了判断压缩文件是由哪种压缩工具压缩的，而后才能正确地解压缩这个文件。下面介绍 Linux 下常见的后缀名所对应的压缩工具。</p><ul><li><p>.gz：表示由 gzip 压缩工具压缩的文件。</p></li><li><p>.bz2：表示由 bzip2 压缩工具压缩的文件。</p></li><li><p>.tar：表示由 tar 打包程序打包的文件（tar 并没有压缩功能，只是把一个目录合并成一个文件）。</p></li><li><p>.tar.gz：可以理解为先由 tar 打包，然后再由 gzip 压缩。</p></li><li><p>.tar.bz2：可以理解为先由 tar 打包，然后再由 bzip2 压缩。</p></li><li><p>.tar.xz：可以理解为先由 tar 打包，然后再 xz 压缩。</p></li></ul><h2 id="_8-1-gzip-压缩工具" tabindex="-1">8.1 gzip 压缩工具 <a class="header-anchor" href="#_8-1-gzip-压缩工具" aria-label="Permalink to &quot;8.1 gzip 压缩工具&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>gzip命令的格式为gzip [-d#] filename，其中#为 1~9 的数字。</span></span></code></pre></div><ul><li>-d：该参数在解压缩时使用。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-#：这里的#为数字，表示压缩等级。-1为最差，-9为最好，-6为默认。</span></span>
<span class="line"><span>下面阿铭通过一个小例子来说明gzip的用法，示例命令如下：</span></span>
<span class="line"><span># mkdir /tmp/8</span></span>
<span class="line"><span># cd /tmp/8</span></span>
<span class="line"><span># mkdir test</span></span>
<span class="line"><span># mv /tmp/1.txt test/</span></span>
<span class="line"><span># cd test</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt</span></span>
<span class="line"><span># gzip 1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt.gz</span></span>
<span class="line"><span>gzip后面直接跟文件名，表示在当前目录下压缩该文件，而原文件也会消失。解压该压缩文</span></span></code></pre></div><p>件的方法如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># gzip -d 1.txt.gz</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt</span></span>
<span class="line"><span>命令gzip -d后面跟压缩文件表示解压压缩文件。gzip不支持压缩目录，压缩目录时会报</span></span></code></pre></div><p>错，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd ..</span></span>
<span class="line"><span># gzip test</span></span>
<span class="line"><span>gzip: test is a directory -- ignored</span></span>
<span class="line"><span># ls test</span></span>
<span class="line"><span>1.txt</span></span>
<span class="line"><span>关于-#选项，我们平时很少用到，使用默认的压缩级别足够了。</span></span></code></pre></div><h2 id="_8-2-bzip2-压缩工具" tabindex="-1">8.2 bzip2 压缩工具 <a class="header-anchor" href="#_8-2-bzip2-压缩工具" aria-label="Permalink to &quot;8.2 bzip2 压缩工具&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bzip2命令的格式为bzip2 [-dz] filename，它只有-z（压缩）和-d（解压缩）两个常</span></span>
<span class="line"><span>用选项。压缩级别有 1~9，默认级别是 9。压缩时，加或不加-z选项都可以压缩文件。示例命</span></span></code></pre></div><p>令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># cd test</span></span>
<span class="line"><span># bzip2 1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt.bz2</span></span>
<span class="line"><span># bzip2 -d 1.txt.bz2</span></span>
<span class="line"><span># bzip2 -z 1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt.bz2</span></span>
<span class="line"><span>bzip2命令也不支持压缩目录，压缩目录时会报错，如下所示：</span></span>
<span class="line"><span># cd ..</span></span>
<span class="line"><span># bzip2 test</span></span>
<span class="line"><span>bzip2: Input file test is a directory.</span></span></code></pre></div><h2 id="_8-3-xz-压缩工具" tabindex="-1">8.3 xz 压缩工具 <a class="header-anchor" href="#_8-3-xz-压缩工具" aria-label="Permalink to &quot;8.3 xz 压缩工具&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xz命令的格式为xz [-dz] filename，和bzip2类似，阿铭只介绍-z（压缩）和-d（解</span></span>
<span class="line"><span>压缩）这两个常用选项。压缩时，加或不加-z选项都可以压缩文件。示例命令如下：</span></span>
<span class="line"><span># bzip2 –d 1.txt.bz2</span></span>
<span class="line"><span># xz 1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt.xz</span></span>
<span class="line"><span># xz -d 1.txt.xz</span></span>
<span class="line"><span># xz -z 1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt.xz</span></span>
<span class="line"><span>xz命令同样也不支持压缩目录，压缩目录时会报错，如下所示：</span></span>
<span class="line"><span># cd ..</span></span>
<span class="line"><span># xz test</span></span>
<span class="line"><span>xz: test: Is a directory, skipping</span></span></code></pre></div><h2 id="_8-4-tar-打包工具" tabindex="-1">8.4 tar 打包工具 <a class="header-anchor" href="#_8-4-tar-打包工具" aria-label="Permalink to &quot;8.4 tar 打包工具&quot;">​</a></h2><p>tar 本身就是一个打包工具，可以把目录打包成一个文件，会把所有文件整合成一个大文件，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>方便复制或者移动。该命令的格式为tar [-zjxcvfpP] filename tar，它有多个选项，</span></span></code></pre></div><p>如下所示，其中不常用的阿铭在括号里做了标注。</p><ul><li><p>-z：表示同时用 gzip 压缩。</p></li><li><p>-j：表示同时用 bzip2 压缩。</p></li><li><p>-J：表示同时用 xz 压缩。</p></li><li><p>-x：表示解包或者解压缩。</p></li><li><p>-t：表示查看 tar 包里的文件。</p></li><li><p>-c：表示建立一个 tar 包或者压缩文件包。</p></li><li><p>-v：表示可视化。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-f：后面跟文件名（即-f filename，表示压缩后的文件名为filename，或者解压文件</span></span>
<span class="line"><span>filename。）需要注意的是，在多个参数组合的情况下，请把-f参数写到最后面。</span></span></code></pre></div><ul><li><p>-p：表示使用原文件的属性，即压缩前文件是什么属性压缩后就还什么属性。（不常用）</p></li><li><p>-P：表示可以使用绝对路径。（不常用）</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--exclude filename：表示在打包或压缩时，不要将filename文件包括在内。（不常</span></span></code></pre></div><ul><li>用）</li></ul><p>具体操作过程如下：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># cd test</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># xz –d 1.txt.xz</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># mkdir test111</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># touch test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># echo &quot;nihao&quot; &gt; !$</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;nihao&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># cp 1.txt test111/</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># yum install tree</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 安装tree命令，用来查看目录树形结构</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># tree .</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">--</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1.txt</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">--</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">--</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 1.txt</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">--</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 2.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> directory,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> files</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># tar -cvf test111.tar test111</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/1.txt</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ls</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111.tar</span></span></code></pre></div><p>首先，在 test 目录下建立 test111 目录，然后在 test111 目录下建立 2.txt 文件，并将 nihao</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>写入到 2.txt 中。接着，用tar命令把 test111 打包成 test111.tar（请记住，-f参数后紧跟打</span></span>
<span class="line"><span>包后的文件名，然后再跟需要打包的目录或者文件）。使用tar命令打包后，原文件不会消</span></span>
<span class="line"><span>失。在上例中，阿铭使用了一个特殊符号!$，它表示上一条命令的最后一个参数，这里指</span></span></code></pre></div><p>test111/2.txt。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tar命令不仅可以打包目录，还可以打包文件，打包时可以不加-v选项，表示不可视化。示</span></span></code></pre></div><p>例命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># rm -f test111.tar</span></span>
<span class="line"><span># tar -cf test.tar test111 1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt test111 test.tar</span></span></code></pre></div><p>其实不管是打包还是解包，是不会删除原来的文件的，而且原来的文件会覆盖当前已经存在的文件或者目录。下面我们先删除原来的 test111 目录，然后解包 test.tar，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># rm -rf test111</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt test.tar</span></span>
<span class="line"><span># tar -xvf test.tar</span></span>
<span class="line"><span>test111/</span></span>
<span class="line"><span>test111/2.txt</span></span>
<span class="line"><span>test111/1.txt</span></span>
<span class="line"><span>1.txt</span></span>
<span class="line"><span>在日常管理工作中，你也许会用到--exclude选项，下面就来简单介绍一下它的用法，示例</span></span></code></pre></div><p>命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># tar -cvf test111.tar --exclude 1.txt test111</span><span> // 不用删除test111.tar，会自动覆盖</span></span>
<span class="line"><span>test111/</span></span>
<span class="line"><span>test111/2.txt</span></span>
<span class="line"><span>请注意，上例中 test111.tar 放到了--exclude选项的前面。该选项除了可以排除文件，也可</span></span></code></pre></div><p>以排除目录，示例命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># mkdir test111/test222</span></span>
<span class="line"><span># tar -cvf test111.tar --exclude test222 test111</span></span>
<span class="line"><span>test111/</span></span>
<span class="line"><span>test111/2.txt</span></span>
<span class="line"><span>test111/1.txt</span></span></code></pre></div><h3 id="_8-4-1-打包的同时使用-gzip-压缩" tabindex="-1">8.4.1 打包的同时使用 gzip 压缩 <a class="header-anchor" href="#_8-4-1-打包的同时使用-gzip-压缩" aria-label="Permalink to &quot;8.4.1 打包的同时使用 gzip 压缩&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tar命令非常好用的一个功能就是可以在打包时直接压缩，它支持</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gzip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 压缩、bzip2</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 压缩和</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">xz</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 压缩。若使用-z选项，则可以压缩成</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gzip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 格式的文件，示例命令如下：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># tar -czvf test111.tar.gz test111</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/1.txt</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ls</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111.tar.gz</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test.tar</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">使用-tf选项，可以查看包或者压缩包的文件列表，示例命令如下：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># tar -tf test111.tar.gz</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/1.txt</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># tar -tf test.tar</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/1.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">使用-zxvf选项，可以解压.tar.gz</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 格式的压缩包，示例命令如下：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># rm -rf test111</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ls</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111.tar.gz</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test.tar</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># tar -zxvf test111.tar.gz</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/2.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test111/1.txt</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ls</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test111.tar.gz</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> test.tar</span></span></code></pre></div><h3 id="_8-4-2-打包的同时使用-bzip2-压缩" tabindex="-1">8.4.2 打包的同时使用 bzip2 压缩 <a class="header-anchor" href="#_8-4-2-打包的同时使用-bzip2-压缩" aria-label="Permalink to &quot;8.4.2 打包的同时使用 bzip2 压缩&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>和 gzip 压缩不同的是，这里使用-cjvf选项来压缩，压缩过程如下：</span></span>
<span class="line"><span># tar -cjvf test111.tar.bz2 test111</span></span>
<span class="line"><span>test111/</span></span>
<span class="line"><span>test111/2.txt</span></span>
<span class="line"><span>test111/1.txt</span></span>
<span class="line"><span># ls</span></span>
<span class="line"><span>1.txt test111 test111.tar.bz2 test111.tar.gz test.tar</span></span>
<span class="line"><span>使用-tf选项来查看压缩包的文件列表，示例命令如下：</span></span>
<span class="line"><span># tar -tf test111.tar.bz2</span></span>
<span class="line"><span>test111/</span></span>
<span class="line"><span>test111/2.txt</span></span>
<span class="line"><span>test111/1.txt</span></span>
<span class="line"><span>使用-jxvf选项来解压 .tar.bz2 格式的压缩包，示例命令如下：</span></span>
<span class="line"><span># tar -jxvf test111.tar.bz2</span></span>
<span class="line"><span>test111/</span></span>
<span class="line"><span>test111/2.txt</span></span>
<span class="line"><span>test111/1.txt</span></span></code></pre></div><p>关于打包的同时使用 xz 压缩工具压缩，阿铭不再介绍，方法同 8.4.1 节和 8.4.2 节。</p><h2 id="_8-5-使用-zip-压缩" tabindex="-1">8.5 使用 zip 压缩 <a class="header-anchor" href="#_8-5-使用-zip-压缩" aria-label="Permalink to &quot;8.5 使用 zip 压缩&quot;">​</a></h2><p>zip 压缩包在 Windows 和 Linux 中都比较常用，它可以压缩目录和文件。压缩目录时，需要指定目录下的文件。示例命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># zip 1.txt.zip 1.txt</span></span>
<span class="line"><span>adding: 1.txt (deflated 64%)</span></span>
<span class="line"><span># zip test111.zip test111/*</span></span>
<span class="line"><span>adding: test111/1.txt (deflated 64%)</span></span>
<span class="line"><span>adding: test111/2.txt (stored 0%)</span></span>
<span class="line"><span>adding: test111/test222/ (stored 0%)</span></span>
<span class="line"><span>说明 zip后面先跟目标文件名，即压缩后的自定义压缩包名，然后跟要压缩的文件或者目</span></span></code></pre></div><ul><li>录。若你的 CentOS 没有该命令，需要使用 yum 工具安装它，如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># yum install -y zip</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>思考题 在压缩目录时，如果只写目录名，会发生什么？若目录下还有二级目录甚至更多级目录时，能否也一并压缩二级目录下的文件呢？</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>做完试验后就会发现，当目录下还有二级目录甚至更多级目录时，zip命令仅仅是把二级目录</span></span>
<span class="line"><span>本身压缩而已。如果想要一并压缩二级目录下的文件，必须加上-r选项，如下所示：</span></span>
<span class="line"><span># zip -r test111.zip test111/</span></span>
<span class="line"><span>updating: test111/ (stored 0%)</span></span>
<span class="line"><span>updating: test111/1.txt (deflated 64%)</span></span>
<span class="line"><span>updating: test111/2.txt (stored 0%)</span></span>
<span class="line"><span>updating: test111/test222/ (stored 0%)</span></span></code></pre></div><p>这样就不需要用 test111/* 了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>解压.zip 格式的文件时并不使用zip命令，而是用unzip命令。例如，解压 1.txt.zip 的命令</span></span></code></pre></div><p>为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># unzip 1.txt.zip</span></span>
<span class="line"><span>若系统中没有unzip命令，则需要使用 yum 工具安装它，如下所示：</span></span>
<span class="line"><span># yum install -y unzip</span></span></code></pre></div><h2 id="_8-6-zcat、bzcat命令的使用" tabindex="-1">8.6 zcat、bzcat命令的使用 <a class="header-anchor" href="#_8-6-zcat、bzcat命令的使用" aria-label="Permalink to &quot;8.6 zcat、bzcat命令的使用&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>上面介绍了使用-t选项可以查看 tar 压缩包的文件列表。对于 gzip2 或者 bzip2 压缩格式的文</span></span>
<span class="line"><span>本文档，我们也可以使用zcat、bzcat命令直接查看文档内容。示例命令如下：</span></span>
<span class="line"><span># cp /etc/passwd ./11.txt</span></span>
<span class="line"><span># cp 11.txt 22.txt</span></span>
<span class="line"><span># gzip 11.txt</span></span>
<span class="line"><span># bzip2 22.txt</span></span>
<span class="line"><span># zcat 11.txt.gz</span></span>
<span class="line"><span># bzcat 22.txt.bz2</span></span></code></pre></div><p>这样就可以查看 11.txt 或 22.txt 文件的内容了，大家猜一猜用什么命令可以查看 xz 压缩文件的内容呢？</p><h2 id="_8-7-课后习题" tabindex="-1">8.7 课后习题 <a class="header-anchor" href="#_8-7-课后习题" aria-label="Permalink to &quot;8.7 课后习题&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(1) gzip命令和bzip2命令能否直接压缩目录呢？</span></span>
<span class="line"><span>(2) 请快速写出使用gzip和bzip2压缩和解压一个文件的命令。</span></span></code></pre></div><p>(3) tar 在打包时，如果想排除多个文件或者目录，该如何操作？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(4) 请试验：如果不加 - 是否正确，如tar zcvf 1.tar.gz 1.txt 2.txt？</span></span></code></pre></div><p>(5) 如何使用 tar 打包和解包格式为.tar.gz 和.tar.bz2 的压缩包？</p><p>(6) 找一个大点的文件，使用 tar 分别把这个文件打成.tar.gz 和.tar.bz2 格式的压缩包，比较一下哪个包会更小，并由此判断是 gzip 压缩效果好还是 bzip2 压缩效果好。</p><p>(7) 使用 tar 打包并压缩时，默认压缩级别为几？如何能够改变压缩级别呢？（提示：tar 本身没有这个功能，可以尝试拆分打包和压缩。）</p>`,67)])])}const o=a(t,[["render",l]]);export{g as __pageData,o as default};
