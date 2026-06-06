import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"34 | 特别放送：OpenResty编码指南","description":"","frontmatter":{},"headers":[{"level":2,"title":"缩进","slug":"缩进","link":"#缩进","children":[]},{"level":2,"title":"空格","slug":"空格","link":"#空格","children":[]},{"level":2,"title":"空行","slug":"空行","link":"#空行","children":[]},{"level":2,"title":"每行最大长度","slug":"每行最大长度","link":"#每行最大长度","children":[]},{"level":2,"title":"变量","slug":"变量","link":"#变量","children":[]},{"level":2,"title":"数组","slug":"数组","link":"#数组","children":[]},{"level":2,"title":"字符串","slug":"字符串","link":"#字符串","children":[]},{"level":2,"title":"函数","slug":"函数","link":"#函数","children":[]},{"level":2,"title":"模块","slug":"模块","link":"#模块","children":[]},{"level":2,"title":"错误处理","slug":"错误处理","link":"#错误处理","children":[]},{"level":2,"title":"写在最后","slug":"写在最后","link":"#写在最后","children":[]}],"relativePath":"OpenResty从入门到实战/34-特别放送：OpenResty编码指南.md","filePath":"OpenResty从入门到实战/34-特别放送：OpenResty编码指南.md","lastUpdated":1779816093000}'),l={name:"OpenResty从入门到实战/34-特别放送：OpenResty编码指南.md"};function i(t,s,c,o,d,h){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_34-特别放送-openresty编码指南" tabindex="-1">34 | 特别放送：OpenResty编码指南 <a class="header-anchor" href="#_34-特别放送-openresty编码指南" aria-label="Permalink to &quot;34 | 特别放送：OpenResty编码指南&quot;">​</a></h1><p>你好，我是温铭。</p><p>很多开发语言都有自己的编码规范，来告诉开发者这个领域内一些约定俗成的东西，让大家写的代码风格保持一致，并且避免一些常见的陷阱。这对于新手来说是非常友好的，可以让初学者快速准确地上手。比如 Python 的 PEP 80，就是其中的典范，几乎所有的 Python 开发者都阅读过这份 Python 作者执笔的编码规范。</p><p><strong>让开发者统一思想，按照规范来写代码，是一件非常重要的事情</strong>。OpenResty 还没有自己的编码规范，有些开发者在提交 PR 后，会在代码风格上被反复 review 和要求修改，消耗了大量本可避免的时间和精力。</p><p>其实，在 OpenResty 中，也有两个可以帮你自动化检测代码风格的工具：luacheck 和 lj-releng。前者是 Lua 和 OpenResty 世界通用的检测工具，后者则是 OpenResty 自己用 perl 写的代码检测工具。</p><p>对我自己来说，我会在 VS Code 编辑器中安装 luacheck 的插件，这样在我写代码的时候就有工具来自动提示；而在项目的 CI 中，则是会把这两个工具都运行一遍，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>luacheck -q lua</span></span>
<span class="line"><span></span></span>
<span class="line"><span>./utils/lj-releng lua/*.lua lua/apisix/*.lua</span></span></code></pre></div><p>毕竟，多一个工具的检测总不是坏事。</p><p>但是，这两个工具更多的是检测全局变量、每行长度等这些最基础的代码风格，离 Python PEP 80 的详细程度还有遥远的距离，并且也没有文档给你参考。</p><p>所以今天，我就根据自己在OpenResty 相关开源项目中的经验，总结了一下 OpenResty 的编码风格文档，这个规范也和一些常见的 API 网关比如 Kong、APISIX 的代码风格是一致的。</p><h2 id="缩进" tabindex="-1">缩进 <a class="header-anchor" href="#缩进" aria-label="Permalink to &quot;缩进&quot;">​</a></h2><p>在 OpenResty 中，我们使用 4 个空格作为缩进的标记，虽然 Lua 并没有这样的语法要求。下面是错误和正确的两段代码示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>if a then</span></span>
<span class="line"><span>ngx.say(&quot;hello&quot;)</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--yes</span></span>
<span class="line"><span>if a then</span></span>
<span class="line"><span>    ngx.say(&quot;hello&quot;)</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>为了方便，你可以在使用的编辑器中，把 tab 改为 4 个空格，来简化操作。</p><h2 id="空格" tabindex="-1">空格 <a class="header-anchor" href="#空格" aria-label="Permalink to &quot;空格&quot;">​</a></h2><p>在操作符的两边，都需要用一个空格来做分隔。下面是错误和正确的两段代码示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local i=1</span></span>
<span class="line"><span>local s    =    &quot;apisix&quot;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local i = 1</span></span>
<span class="line"><span>local s = &quot;apisix&quot;</span></span></code></pre></div><h2 id="空行" tabindex="-1">空行 <a class="header-anchor" href="#空行" aria-label="Permalink to &quot;空行&quot;">​</a></h2><p>不少开发者会把其他语言的开发习惯带到 OpenResty 中来，比如在行尾增加一个分号：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>if a then</span></span>
<span class="line"><span>    ngx.say(&quot;hello&quot;);</span></span>
<span class="line"><span>end;</span></span></code></pre></div><p>但事实上，增加分号会让 Lua 代码显得非常丑陋，也是没有必要的。同时，你也不要为了节省代码的行数，追求所谓的“简洁”，而把多行代码变为一行。这样做会让你在定位错误的时候，不知道到底是哪一段代码出了问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>if a then ngx.say(&quot;hello&quot;) end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--yes</span></span>
<span class="line"><span>if a then</span></span>
<span class="line"><span>    ngx.say(&quot;hello&quot;)</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>另外，函数之间需要用两个空行来做分隔：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span> local function bar()</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span> local function bar()</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>如果有多个 if elseif 的分支，它们之间也需要一个空行来做分隔：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>if a == 1 then</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span>elseif a== 2 then</span></span>
<span class="line"><span>    bar()</span></span>
<span class="line"><span>elseif a == 3 then</span></span>
<span class="line"><span>    run()</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    error()</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>if a == 1 then</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>elseif a== 2 then</span></span>
<span class="line"><span>    bar()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>elseif a == 3 then</span></span>
<span class="line"><span>    run()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    error()</span></span>
<span class="line"><span>end</span></span></code></pre></div><h2 id="每行最大长度" tabindex="-1">每行最大长度 <a class="header-anchor" href="#每行最大长度" aria-label="Permalink to &quot;每行最大长度&quot;">​</a></h2><p>每行不能超过 80 个字符，如果超过的话，需要你换行并对齐。并且，在换行对齐的时候，我们要体现出上下两行的对应关系。就下面的示例而言，第二行函数的参数，要在第一行左括号的右边。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>return limit_conn_new(&quot;plugin-limit-conn&quot;, conf.conn, conf.burst, conf.default_conn_delay)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>return limit_conn_new(&quot;plugin-limit-conn&quot;, conf.conn, conf.burst,</span></span>
<span class="line"><span>                    conf.default_conn_delay)</span></span></code></pre></div><p>如果是字符串拼接问题的对齐，则需要把 <code>..</code> 放到下一行中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>return limit_conn_new(&quot;plugin-limit-conn&quot; ..  &quot;plugin-limit-conn&quot; ..</span></span>
<span class="line"><span>                    &quot;plugin-limit-conn&quot;)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>return limit_conn_new(&quot;plugin-limit-conn&quot; .. &quot;plugin-limit-conn&quot;</span></span>
<span class="line"><span>                    .. &quot;plugin-limit-conn&quot;)</span></span></code></pre></div><h2 id="变量" tabindex="-1">变量 <a class="header-anchor" href="#变量" aria-label="Permalink to &quot;变量&quot;">​</a></h2><p>这一点我前面也多次强调过，我们应该永远使用局部变量，不要使用全局变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>i = 1</span></span>
<span class="line"><span>s = &quot;apisix&quot;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local i = 1</span></span>
<span class="line"><span>local s = &quot;apisix&quot;</span></span></code></pre></div><p>至于变量的命名，应该使用 <code>snake_case</code> 风格：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local IndexArr = 1</span></span>
<span class="line"><span>local str_Name = &quot;apisix&quot;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local index_arr = 1</span></span>
<span class="line"><span>local str_name = &quot;apisix&quot;</span></span></code></pre></div><p>而对于常量，则是要使用全部大写的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local max_int = 65535</span></span>
<span class="line"><span>local server_name = &quot;apisix&quot;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local MAX_INT = 65535</span></span>
<span class="line"><span>local SERVER_NAME = &quot;apisix&quot;</span></span></code></pre></div><h2 id="数组" tabindex="-1">数组 <a class="header-anchor" href="#数组" aria-label="Permalink to &quot;数组&quot;">​</a></h2><p>在OpenResty中，我们使用 <code>table.new</code> 来预先分配数组：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local t = {}</span></span>
<span class="line"><span>for i = 1, 100 do</span></span>
<span class="line"><span>   t[i] = i</span></span>
<span class="line"><span> end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local new_tab = require &quot;table.new&quot;</span></span>
<span class="line"><span> local t = new_tab(100, 0)</span></span>
<span class="line"><span> for i = 1, 100 do</span></span>
<span class="line"><span>   t[i] = i</span></span>
<span class="line"><span> end</span></span></code></pre></div><p>另外注意，一定不要在数组中使用 nil：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local t = {1, 2, nil, 3}</span></span></code></pre></div><p>如果一定要使用空值，请用 ngx.null 来表示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local t = {1, 2, ngx.null, 3}</span></span></code></pre></div><h2 id="字符串" tabindex="-1">字符串 <a class="header-anchor" href="#字符串" aria-label="Permalink to &quot;字符串&quot;">​</a></h2><p>千万不要在热代码路径上拼接字符串：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local s = &quot;&quot;</span></span>
<span class="line"><span>for i = 1, 100000 do</span></span>
<span class="line"><span>    s = s .. &quot;a&quot;</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local t = {}</span></span>
<span class="line"><span>for i = 1, 100000 do</span></span>
<span class="line"><span>    t[i] = &quot;a&quot;</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span>local s =  table.concat(t, &quot;&quot;)</span></span></code></pre></div><h2 id="函数" tabindex="-1">函数 <a class="header-anchor" href="#函数" aria-label="Permalink to &quot;函数&quot;">​</a></h2><p>函数的命名也同样遵循 <code>snake_case</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local function testNginx()</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local function test_nginx()</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>并且，函数应该尽可能早地返回：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local function check(age, name)</span></span>
<span class="line"><span>    local ret = true</span></span>
<span class="line"><span>    if age &amp;lt; 20 then</span></span>
<span class="line"><span>        ret = false</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if name == &quot;a&quot; then</span></span>
<span class="line"><span>        ret = false</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    -- do something else</span></span>
<span class="line"><span>    return ret</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local function check(age, name)</span></span>
<span class="line"><span>    if age &amp;lt; 20 then</span></span>
<span class="line"><span>        return false</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if name == &quot;a&quot; then</span></span>
<span class="line"><span>        return false</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    -- do something else</span></span>
<span class="line"><span>    return true</span></span></code></pre></div><h2 id="模块" tabindex="-1">模块 <a class="header-anchor" href="#模块" aria-label="Permalink to &quot;模块&quot;">​</a></h2><p>所有 require 的库都要 local 化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = ngx.timer.at(delay, handler)</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local timer_at = ngx.timer.at</span></span>
<span class="line"><span></span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = timer_at(delay, handler)</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>为了风格的统一，require 和 ngx 也需要 local 化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local core = require(&quot;apisix.core&quot;)</span></span>
<span class="line"><span>local timer_at = ngx.timer.at</span></span>
<span class="line"><span></span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = timer_at(delay, handler)</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local ngx = ngx</span></span>
<span class="line"><span>local require = require</span></span>
<span class="line"><span>local core = require(&quot;apisix.core&quot;)</span></span>
<span class="line"><span>local timer_at = ngx.timer.at</span></span>
<span class="line"><span></span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = timer_at(delay, handler)</span></span>
<span class="line"><span>end</span></span></code></pre></div><h2 id="错误处理" tabindex="-1">错误处理 <a class="header-anchor" href="#错误处理" aria-label="Permalink to &quot;错误处理&quot;">​</a></h2><p>对于有错误信息返回的函数，我们必须对错误信息进行判断和处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local sock = ngx.socket.tcp()</span></span>
<span class="line"><span> local ok = sock:connect(&quot;www.google.com&quot;, 80)</span></span>
<span class="line"><span> ngx.say(&quot;successfully connected to google!&quot;)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local sock = ngx.socket.tcp()</span></span>
<span class="line"><span> local ok, err = sock:connect(&quot;www.google.com&quot;, 80)</span></span>
<span class="line"><span> if not ok then</span></span>
<span class="line"><span>     ngx.say(&quot;failed to connect to google: &quot;, err)</span></span>
<span class="line"><span>     return</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span> ngx.say(&quot;successfully connected to google!&quot;)</span></span></code></pre></div><p>而如果是自己编写的函数，错误信息要作为第二个参数，用字符串的格式返回：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = func()</span></span>
<span class="line"><span>    if not ok then</span></span>
<span class="line"><span>        return false</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    return true</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--No</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = func()</span></span>
<span class="line"><span>    if not ok then</span></span>
<span class="line"><span>        return false, {msg = err}</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    return true</span></span>
<span class="line"><span>end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--Yes</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>    local ok, err = func()</span></span>
<span class="line"><span>    if not ok then</span></span>
<span class="line"><span>        return false, &quot;failed to call func(): &quot; .. err</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    return true</span></span>
<span class="line"><span>end</span></span></code></pre></div><h2 id="写在最后" tabindex="-1">写在最后 <a class="header-anchor" href="#写在最后" aria-label="Permalink to &quot;写在最后&quot;">​</a></h2><p>这个编程规范算是一个最初版本，我会公开到 <a href="https://github.com/apache/incubator-apisix/blob/v1.3/CODE_STYLE.md" target="_blank" rel="noreferrer">GitHub</a> 中来持续更新和维护。如果文中没有包含到你想知道的规范，非常欢迎你留言提问，我来给你解答。也欢迎你把这篇规范分享出去，让更多的OpenResty使用者参与进来。</p>`,84)])])}const g=a(l,[["render",i]]);export{r as __pageData,g as default};
