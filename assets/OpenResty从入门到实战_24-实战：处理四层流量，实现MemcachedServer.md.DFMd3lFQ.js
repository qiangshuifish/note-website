import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"24 | 实战：处理四层流量，实现Memcached Server","description":"","frontmatter":{},"headers":[{"level":2,"title":"原始需求和技术方案","slug":"原始需求和技术方案","link":"#原始需求和技术方案","children":[]},{"level":2,"title":"测试驱动开发","slug":"测试驱动开发","link":"#测试驱动开发","children":[]},{"level":2,"title":"搭建框架","slug":"搭建框架","link":"#搭建框架","children":[]},{"level":2,"title":"填充代码","slug":"填充代码","link":"#填充代码","children":[]},{"level":2,"title":"写在最后","slug":"写在最后","link":"#写在最后","children":[]}],"relativePath":"OpenResty从入门到实战/24-实战：处理四层流量，实现MemcachedServer.md","filePath":"OpenResty从入门到实战/24-实战：处理四层流量，实现MemcachedServer.md","lastUpdated":1779816093000}'),l={name:"OpenResty从入门到实战/24-实战：处理四层流量，实现MemcachedServer.md"};function c(t,s,i,o,r,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_24-实战-处理四层流量-实现memcached-server" tabindex="-1">24 | 实战：处理四层流量，实现Memcached Server <a class="header-anchor" href="#_24-实战-处理四层流量-实现memcached-server" aria-label="Permalink to &quot;24 | 实战：处理四层流量，实现Memcached Server&quot;">​</a></h1><p>你好，我是温铭。</p><p>在前面几节课中，我们介绍了不少处理请求的 Lua API ，不过它们都是和七层相关的。除此之外，OpenResty 其实还提供了 <code>stream-lua-nginx-module</code> 模块来处理四层的流量。它提供的指令和 API ，与 <code>lua-nginx-module</code> 基本一致。</p><p>今天，我就带你一起用 OpenResty 来实现一个 memcached server，而且大概只需要 100 多行代码就可以完成。在这个小的实战中，我们会用到不少前面学过的内容，也会带入一些后面测试和性能优化章节的内容。</p><p>所以，我希望你能够明确一点，我们这节课的重点，不在于你必须读懂每一行代码的具体作用，而是你要从需求、测试、开发等角度，把 OpenResty 如何从零开发一个项目的全貌了然于心。</p><h2 id="原始需求和技术方案" tabindex="-1">原始需求和技术方案 <a class="header-anchor" href="#原始需求和技术方案" aria-label="Permalink to &quot;原始需求和技术方案&quot;">​</a></h2><p>在开发之前，我们都需要明白需求是什么，到底是用来解决什么问题的，否则就会在迷失在技术选择中。比如看到我们今天的主题，你就应该先反问一下自己，为什么要实现一个 memcached server 呢？直接安装一个原版的 memcached 或者 redis 不就行了吗？</p><p>我们知道，HTTPS 流量逐渐成为主流，但一些比较老的浏览器并不支持 session ticket，那么我们就需要在服务端把 session ID 存下来。如果本地存储空间不够，就需要一个集群进行存放，而这个数据又是可以丢弃的，所以选用 memcached 就比较合适。</p><p>这时候，直接引入 memcached ，应该是最简单直接的方案。但出于以下几个方面的考虑，我还是选择使用 OpenResty 来造一个轮子：</p><ul><li>第一，直接引入会多引入一个进程，增加部署和维护成本；</li><li>第二，这个需求足够简单，只需要 get 和 set 操作，并且支持过期即可；</li><li>第三，OpenResty 有 stream 模块，可以很快地实现这个需求。</li></ul><p>既然要实现 memcached server，我们就需要先弄明白它的协议。memcached 的协议可以支持 TCP 和 UDP，这里我选择 TCP，下面是 get 和 set 命令的具体协议：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Get</span></span>
<span class="line"><span>根据 key 获取 value</span></span>
<span class="line"><span>Telnet command: get &amp;lt;key&amp;gt;*\\r\\n</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：</span></span>
<span class="line"><span>get key</span></span>
<span class="line"><span>VALUE key 0 4 data END</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Set</span></span>
<span class="line"><span>存储键值对到 memcached 中</span></span>
<span class="line"><span>Telnet command：set &amp;lt;key&amp;gt; &amp;lt;flags&amp;gt; &amp;lt;exptime&amp;gt; &amp;lt;bytes&amp;gt; [noreply]\\r\\n&amp;lt;value&amp;gt;\\r\\n</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：</span></span>
<span class="line"><span>set key 0 900 4 data</span></span>
<span class="line"><span>STORED</span></span></code></pre></div><p>除了 get 和 set 外，我们还需要知道 memcached 的协议的“错误处理”是怎么样做的。“错误处理”对于服务端的程序是非常重要的，我们在编写程序时，除了要处理正常的请求，也要考虑到各种异常。比如下面这样的场景：</p><ul><li>memcached 发送了一个get、set 之外的请求，我要怎么处理呢？</li><li>服务端出错，我要给 memcached 的客户端一个什么样的反馈呢？</li></ul><p>同时，我们希望写出能够兼容 memcached 的客户端程序。这样，使用者就不用区分这是 memcached 官方的版本，还是 OpenResty 实现的版本了。</p><p>下面这张图出自memcached 的文档，描述了出错的时候，应该返回什么内容和具体的格式，你可以用做参考：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenResty%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E5%AE%9E%E6%88%98/images/107937/3767ed0047e34aabaa7bf7d568438ab0.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenResty%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E5%AE%9E%E6%88%98/images/107937/3767ed0047e34aabaa7bf7d568438ab0.png" alt=""></a></p><p>现在，再来确定下技术方案。我们知道，OpenResty 的 shared dict 可以跨各个 worker 来使用，把数据放在 shared dict 里面，和放在 memcached 里面非常类似——它们都支持 get 和 set 操作，并且在进程重启后数据就丢失了。所以，使用 shared dict 来模拟 memcached 是非常合适的，它们的原理和行为都是一致的。</p><h2 id="测试驱动开发" tabindex="-1">测试驱动开发 <a class="header-anchor" href="#测试驱动开发" aria-label="Permalink to &quot;测试驱动开发&quot;">​</a></h2><p>接下来就要开始动工了。不过，基于测试驱动开发的思想，在写具体的代码之前，让我们先来构造一个最简单的测试案例。这里我们不用 <code>test::nginx</code> 框架，毕竟它的上手难度也不低，我们不妨先用熟悉的 <code>resty</code> 来手动测试下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local memcached = require &quot;resty.memcached&quot;</span></span>
<span class="line"><span>    local memc, err = memcached:new()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    memc:set_timeout(1000) -- 1 sec</span></span>
<span class="line"><span>    local ok, err = memc:connect(&quot;127.0.0.1&quot;, 11212)</span></span>
<span class="line"><span>    local ok, err = memc:set(&quot;dog&quot;, 32)</span></span>
<span class="line"><span>    if not ok then</span></span>
<span class="line"><span>        ngx.say(&quot;failed to set dog: &quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    local res, flags, err = memc:get(&quot;dog&quot;)</span></span>
<span class="line"><span>    ngx.say(&quot;dog: &quot;, res)&#39;</span></span></code></pre></div><p>这段测试代码，使用 <code>lua-rety-memcached</code> 客户端库发起 connect 和 set 操作，并假设 memcached 的服务端监听本机的 11212 端口。</p><p>看起来应该没有问题了吧。你可以在自己的机器上执行一下这段代码，不出意外的话，会返回 <code>failed to set dog: closed</code> 这样的错误提示，因为此时服务并没有启动。</p><p>到现在为止，你的技术方案就已经明确了，那就是使用 stream 模块来接收和发送数据，同时使用 shared dict 来存储数据。</p><p>衡量需求是否完成的指标也很明确，那就是跑通上面这段代码，并把 dog 的实际值给打印出来。</p><h2 id="搭建框架" tabindex="-1">搭建框架 <a class="header-anchor" href="#搭建框架" aria-label="Permalink to &quot;搭建框架&quot;">​</a></h2><p>那还等什么，开始动手写代码吧！</p><p>我个人的习惯，是先搭建一个最小的可以运行的代码框架，然后再逐步地去填充代码。这样的好处是，在编码过程中，你可以给自己设置很多小目标；而且在完成一个小目标后，测试案例也会给你正反馈。</p><p>让我们先来设置好 Nginx 的配置文件，因为stream 和 shared dict 要在其中预设。下面是我设置的配置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>stream {</span></span>
<span class="line"><span>    lua_shared_dict memcached 100m;</span></span>
<span class="line"><span>    lua_package_path &#39;lib/?.lua;;&#39;;</span></span>
<span class="line"><span>    server {</span></span>
<span class="line"><span>        listen 11212;</span></span>
<span class="line"><span>        content_by_lua_block {</span></span>
<span class="line"><span>            local m = require(&quot;resty.memcached.server&quot;)</span></span>
<span class="line"><span>            m.run()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以看到，这段配置文件中有几个关键的信息：</p><ul><li>首先，代码运行在 Nginx 的 stream 上下文中，而非 HTTP 上下文中，并且监听了 11212 端口；</li><li>其次，shared dict 的名字为 memcached，大小是 100M，这些在运行期是不可以修改的；</li><li>另外，代码所在目录为 <code>lib/resty/memcached</code>, 文件名为 <code>server.lua</code>, 入口函数为 <code>run()</code>，这些信息你都可以从 <code>lua_package_path</code> 和 <code>content_by_lua_block</code> 中找到。</li></ul><p>接着，就该搭建代码框架了。你可以自己先动手试试，然后我们一起来看下我的框架代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local new_tab = require &quot;table.new&quot;</span></span>
<span class="line"><span>local str_sub = string.sub</span></span>
<span class="line"><span>local re_find = ngx.re.find</span></span>
<span class="line"><span>local mc_shdict = ngx.shared.memcached</span></span>
<span class="line"><span></span></span>
<span class="line"><span>local _M = { _VERSION = &#39;0.01&#39; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>local function parse_args(s, start)</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function _M.get(tcpsock, keys)</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function _M.set(tcpsock, res)</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function _M.run()</span></span>
<span class="line"><span>    local tcpsock = assert(ngx.req.socket(true))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while true do</span></span>
<span class="line"><span>        tcpsock:settimeout(60000) -- 60 seconds</span></span>
<span class="line"><span>        local data, err = tcpsock:receive(&quot;*l&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        local command, args</span></span>
<span class="line"><span>        if data then</span></span>
<span class="line"><span>            local from, to, err = re_find(data, [[(\\S+)]], &quot;jo&quot;)</span></span>
<span class="line"><span>            if from then</span></span>
<span class="line"><span>                command = str_sub(data, from, to)</span></span>
<span class="line"><span>                args = parse_args(data, to + 1)</span></span>
<span class="line"><span>            end</span></span>
<span class="line"><span>        end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if args then</span></span>
<span class="line"><span>            local args_len = #args</span></span>
<span class="line"><span>            if command == &#39;get&#39; and args_len &amp;gt; 0 then</span></span>
<span class="line"><span>                _M.get(tcpsock, args)</span></span>
<span class="line"><span>            elseif command == &quot;set&quot; and args_len == 4 then</span></span>
<span class="line"><span>                _M.set(tcpsock, args)</span></span>
<span class="line"><span>            end</span></span>
<span class="line"><span>        end</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return _M</span></span></code></pre></div><p>这段代码，便实现了入口函数 <code>run()</code> 的主要逻辑。虽然我还没有做异常处理，依赖的 <code>parse_args</code>、 <code>get</code> 和 <code>set</code> 也都是空函数，但这个框架已经完整表达了memcached server 的逻辑。</p><h2 id="填充代码" tabindex="-1">填充代码 <a class="header-anchor" href="#填充代码" aria-label="Permalink to &quot;填充代码&quot;">​</a></h2><p>接下来，让我们按照代码的执行顺序，逐个实现这几个空函数。</p><p>首先，我们可以根据 memcached <a href="https://github.com/memcached/memcached/blob/master/doc/protocol.txt" target="_blank" rel="noreferrer">的协议</a> <a href="https://github.com/memcached/memcached/blob/master/doc/protocol.txt" target="_blank" rel="noreferrer">文档</a>，解析 memcached 命令的参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local function parse_args(s, start)</span></span>
<span class="line"><span>    local arr = {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while true do</span></span>
<span class="line"><span>        local from, to = re_find(s, [[\\S+]], &quot;jo&quot;, {pos = start})</span></span>
<span class="line"><span>        if not from then</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        table.insert(arr, str_sub(s, from, to))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        start = to + 1</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return arr</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>这里，我的建议是，先用最直观的方式来实现一个版本，不用考虑任何性能的优化。毕竟，完成总是比完美更重要，而且，基于完成的逐步优化才可以趋近完美。</p><p>接下来，我们就来实现下 <code>get</code> 函数。它可以一次查询多个键，所以下面代码中我用了一个 for 循环：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function _M.get(tcpsock, keys)</span></span>
<span class="line"><span>    local reply = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for i = 1, #keys do</span></span>
<span class="line"><span>        local key = keys[i]</span></span>
<span class="line"><span>        local value, flags = mc_shdict:get(key)</span></span>
<span class="line"><span>        if value then</span></span>
<span class="line"><span>            local flags  = flags or 0</span></span>
<span class="line"><span>            reply = reply .. &quot;VALUE&quot; .. key .. &quot; &quot; .. flags .. &quot; &quot; .. #value .. &quot;\\r\\n&quot; .. value .. &quot;\\r\\n&quot;</span></span>
<span class="line"><span>        end</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span>    reply = reply ..  &quot;END\\r\\n&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tcpsock:settimeout(1000)  -- one second timeout</span></span>
<span class="line"><span>    local bytes, err = tcpsock:send(reply)</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>其实，这里最核心的代码只有一行： <code>local value, flags = mc_shdict:get(key)</code>，也就是从 shared dict 中查询到数据；至于其余的代码，都在按照 memcached 的协议拼接字符串，并最终 send 到客户端。</p><p>最后，我们再来看下 <code>set</code> 函数。它将接收到的参数转换为 shared dict API 的格式，把数据储存了起来；并在出错的时候，按照 memcached 的协议做出处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function _M.set(tcpsock, res)</span></span>
<span class="line"><span>    local reply =  &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    local key = res[1]</span></span>
<span class="line"><span>    local flags = res[2]</span></span>
<span class="line"><span>    local exptime = res[3]</span></span>
<span class="line"><span>    local bytes = res[4]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    local value, err = tcpsock:receive(tonumber(bytes) + 2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if str_sub(value, -2, -1) == &quot;\\r\\n&quot; then</span></span>
<span class="line"><span>        local succ, err, forcible = mc_shdict:set(key, str_sub(value, 1, bytes), exptime, flags)</span></span>
<span class="line"><span>        if succ then</span></span>
<span class="line"><span>            reply = reply .. “STORED\\r\\n&quot;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            reply = reply .. &quot;SERVER_ERROR &quot; .. err .. “\\r\\n”</span></span>
<span class="line"><span>        end</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        reply = reply .. &quot;ERROR\\r\\n&quot;</span></span>
<span class="line"><span>    end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tcpsock:settimeout(1000)  -- one second timeout</span></span>
<span class="line"><span>    local bytes, err = tcpsock:send(reply)</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>另外，在填充上面这几个函数的过程中，你可以用测试案例来做检验，并用 <code>ngx.log</code> 来做 debug。比较遗憾的是，OpenResty 中并没有断点调试的工具，所以我们都是使用 <code>ngx.say</code> 和 <code>ngx.log</code> 来调试的，在这方面可以说是还处于刀耕火种的时代。</p><h2 id="写在最后" tabindex="-1">写在最后 <a class="header-anchor" href="#写在最后" aria-label="Permalink to &quot;写在最后&quot;">​</a></h2><p>这个实战项目到现在就接近尾声了，最后，我想留一个动手作业。你可以把上面 memcached server 的实现代码，完整地运行起来，并通过测试案例吗？</p><p>今天的作业题估计要花费你不少的精力了，不过，这还是一个原始的版本，还没有错误处理、性能优化和自动化测试，这些就要放在后面继续完善了。我也希望通过后面内容的学习，你最终能够完成一个完善的版本。</p><p>如果对于今天的讲解或者自己的实践有什么疑惑，欢迎你留言和我讨论。也欢迎你把这篇文章转发给你的同事朋友，我们一起实战，一起进步。</p>`,51)])])}const h=a(l,[["render",c]]);export{u as __pageData,h as default};
