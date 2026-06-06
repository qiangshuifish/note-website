import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"16 | 秒杀大多数开发问题的两个利器：文档和测试案例","description":"","frontmatter":{},"headers":[{"level":2,"title":"shdict get API","slug":"shdict-get-api","link":"#shdict-get-api","children":[]},{"level":2,"title":"哪些阶段不能使用共享内存相关的 API ？","slug":"哪些阶段不能使用共享内存相关的-api","link":"#哪些阶段不能使用共享内存相关的-api","children":[]},{"level":2,"title":"get 函数何时会有多个返回值？","slug":"get-函数何时会有多个返回值","link":"#get-函数何时会有多个返回值","children":[]},{"level":2,"title":"get 函数的入参是什么类型？","slug":"get-函数的入参是什么类型","link":"#get-函数的入参是什么类型","children":[]},{"level":2,"title":"写在最后","slug":"写在最后","link":"#写在最后","children":[]}],"relativePath":"OpenResty从入门到实战/16-秒杀大多数开发问题的两个利器：文档和测试案例.md","filePath":"OpenResty从入门到实战/16-秒杀大多数开发问题的两个利器：文档和测试案例.md","lastUpdated":1779816093000}'),l={name:"OpenResty从入门到实战/16-秒杀大多数开发问题的两个利器：文档和测试案例.md"};function t(i,s,o,c,d,g){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_16-秒杀大多数开发问题的两个利器-文档和测试案例" tabindex="-1">16 | 秒杀大多数开发问题的两个利器：文档和测试案例 <a class="header-anchor" href="#_16-秒杀大多数开发问题的两个利器-文档和测试案例" aria-label="Permalink to &quot;16 | 秒杀大多数开发问题的两个利器：文档和测试案例&quot;">​</a></h1><p>你好，我是温铭。在学习了 OpenResty 的原理和几个重要概念后，我们终于要开始 API 的学习了。</p><p>从我个人的经验来看，学习 OpenResty 的 API 是相对容易的，所以并没有占用本专栏太多的篇幅。你可以会疑惑：API 不是最常用、最重要的部分吗，为什么花的笔墨不多？</p><p>其实，这主要是出于两个方面的考虑。</p><p>第一，OpenResty 提供了非常详尽的文档。和很多其他的开发语言或者平台相比，OpenResty 除了会提供 API 的参数、返回值定义，还会提供完整的、可运行的代码示例，清楚地告诉你API 是如何处理各种边界条件的。</p><p>这种在 API 定义下面紧跟着示例代码和注意事项的做法，就是 OpenResty 文档的一贯风格。这样一来，在看完 API 描述后，你就可以立即在自己的环境下运行示例代码，并修改参数来和文档互相印证，加深记忆和理解。</p><p>第二，在文档之外，OpenResty还提供了高覆盖度的测试案例集。刚刚我提到过，OpenResty文档中提供了 API 的代码示例，但终究篇幅有限，多个 API 之间如何配合使用、各种异常情况下的报错和处理等，在文档中并没有呈现。</p><p>不过，不用担心，这些内容你大都可以在测试案例集里找到。</p><p>对于 OpenResty 的开发者来说，最好的 API 学习资料就是官方文档和测试案例，它们足够专业和友好。在这个前提下，如果我单纯地把文档翻译成中文再放在专栏中来讲，就没有太大意义了。</p><p>授人以鱼不如授之以渔，我更希望教给你的是通用的方法和经验。让我们用一个真实的例子来体验下，在 OpenResty 的开发中，如何让文档和测试案例集发挥更大的威力。</p><h2 id="shdict-get-api" tabindex="-1">shdict get API <a class="header-anchor" href="#shdict-get-api" aria-label="Permalink to &quot;shdict get API&quot;">​</a></h2><p>shared dict（共享字典）是基于 NGINX 共享内存区的 Lua 字典对象，它可以跨多个 worker 来存取数据，一般用来存放限流、限速、缓存等数据。shared dict 相关的 API 有 20 多个，是 OpenResty 中最常用也是最重要的一组 API。</p><p>我们以最简单的 get 操作为例，你可以点开 <a href="https://github.com/openresty/lua-nginx-module/#ngxshareddictget" target="_blank" rel="noreferrer">文档链接</a> 做为对照。下面的最小化的代码示例，正是由官方文档改编而来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  http {</span></span>
<span class="line"><span>      lua_shared_dict dogs 10m;</span></span>
<span class="line"><span>      server {</span></span>
<span class="line"><span>          location /demo {</span></span>
<span class="line"><span>              content_by_lua_block {</span></span>
<span class="line"><span>                  local dogs = ngx.shared.dogs</span></span>
<span class="line"><span>         dogs:set(&quot;Jim&quot;, 8)</span></span>
<span class="line"><span>         local v = dogs:get(&quot;Jim&quot;)</span></span>
<span class="line"><span>                  ngx.say(v)</span></span>
<span class="line"><span>              }</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>简单说明一下，在Lua 代码中使用 shared dict 之前，我们需要在 nginx.conf 中用 <code>lua_shared_dict</code> 指令增加一块内存空间，它的名字是 dogs，大小为 10M。修改完 nginx.conf后，你还需要重启进程，用浏览器或者 curl 访问才能看到结果。</p><p>这步骤看起来是不是有些繁琐呢？让我们用一种更直接的方式改造一下。你可以看到，使用 resty CLI 的这种方式，和在 nginx.conf 中嵌入代码的效果是一致的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty --shdict &#39;dogs 10m&#39; -e &#39;local dogs = ngx.shared.dogs</span></span>
<span class="line"><span> dogs:set(&quot;Jim&quot;, 8)</span></span>
<span class="line"><span> local v = dogs:get(&quot;Jim&quot;)</span></span>
<span class="line"><span> ngx.say(v)</span></span>
<span class="line"><span> &#39;</span></span></code></pre></div><p>你现在已经知道 nginx.conf 和 Lua 代码是如何配合的，也成功运行了 shared dict 的 set 和 get 方法。一般来说，大部分开发者也就此止步，不再深究了。</p><p>事实上，这里还是有几个值得注意的地方，比如：</p><ol><li>哪些阶段不能使用共享内存相关的 API 呢？</li><li>我们在示例代码中看到 get 函数只有一个返回值，那什么情况下会有多个返回值呢？</li><li>get 函数的入参是什么类型？是否有长度限制？</li></ol><p>不要小看这几个问题，窥一斑而见全豹，它们可以帮助我们更好的深入 OpenResty。接下来我就带你一一解读。</p><h2 id="哪些阶段不能使用共享内存相关的-api" tabindex="-1">哪些阶段不能使用共享内存相关的 API ？ <a class="header-anchor" href="#哪些阶段不能使用共享内存相关的-api" aria-label="Permalink to &quot;哪些阶段不能使用共享内存相关的 API ？&quot;">​</a></h2><p>先来看第一个问题，答案很直接，文档中专门有一个 <code>context</code> （即上下文部分），里面列出了在什么环境下可以使用这个 API：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>context: set_by_lua*, rewrite_by_lua*, access_by_lua*, content_by_lua*, header_filter_by_lua*, body_filter_by_lua*, log_by_lua*, ngx.timer.*, balancer_by_lua*, ssl_certificate_by_lua*, ssl_session_fetch_by_lua*, ssl_session_store_by_lua*</span></span></code></pre></div><p>可以看出， <code>init</code> 和 <code>init_worker</code> 两个阶段不在其中，也就是说，共享内存的 get API 不能在这两个阶段使用。需要注意的是，每个共享内存的 API 可以使用的阶段并不完全相同，比如 set API 就可以在 <code>init</code> 阶段使用。</p><p>所以，千万不要想当然，还是那句话，使用时多翻阅文档。当然了，尽信书不如无书，OpenResty 的文档有时候也会出现错漏，这时候你就需要用实际的测试来验证了。</p><p>接下来，让我们修改下测试案例集，来确定下 <code>init</code> 阶段是否可以运行 shared dict 的 get API。</p><p>那该如何找到和共享内存相关的测试案例集呢？事实上，OpenResty 的测试案例都放在 <code>/t</code> 目录下，并且命名也是有规律的，即 <code>自增数字-功能名.t</code>。搜索 <code>shdict</code>，你可以找到 <code>043-shdict.t</code>，而这就是共享内存的测试案例集了，它里面有接近 100 个测试案例，包含各种正常和异常情况的测试。</p><p>我们来试着修改下第一个测试案例。</p><p>你可以把 content 阶段改为 init 阶段，并精简掉无关代码，看看 get 接口能否运行。这里我需要提醒一点，在现阶段，你不用非得搞明白测试案例是如何编写、组织和运行的，你只要知道它是在测试 get 接口就可以了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>=== TEST 1: string key, int value</span></span>
<span class="line"><span> --- http_config</span></span>
<span class="line"><span>     lua_shared_dict dogs 1m;</span></span>
<span class="line"><span> --- config</span></span>
<span class="line"><span>     location = /test {</span></span>
<span class="line"><span>         init_by_lua &#39;</span></span>
<span class="line"><span>             local dogs = ngx.shared.dogs</span></span>
<span class="line"><span>             local val = dogs:get(&quot;foo&quot;)</span></span>
<span class="line"><span>             ngx.say(val)</span></span>
<span class="line"><span>         &#39;;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> --- request</span></span>
<span class="line"><span> GET /test</span></span>
<span class="line"><span> --- response_body</span></span>
<span class="line"><span> 32</span></span>
<span class="line"><span> --- no_error_log</span></span>
<span class="line"><span> [error]</span></span>
<span class="line"><span> --- ONLY</span></span></code></pre></div><p>你应该注意到了，在测试案例的最后，我加了 <code>--ONLY</code> 标记，这表示忽略其他所有测试案例，只运行这一个测试案例，以提高运行速度。后面在测试部分中，我会专门讲解各种各样的标记，你先记住这里就可以了。</p><p>修改完以后，我们用 prove 命令，就可以运行这个测试案例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ prove t/043-shdict.t</span></span></code></pre></div><p>然后，你会得到一个报错，这也就印证了文档中描述的阶段限制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nginx: [emerg] &quot;init_by_lua&quot; directive is not allowed here</span></span></code></pre></div><h2 id="get-函数何时会有多个返回值" tabindex="-1">get 函数何时会有多个返回值？ <a class="header-anchor" href="#get-函数何时会有多个返回值" aria-label="Permalink to &quot;get 函数何时会有多个返回值？&quot;">​</a></h2><p>我们再来看第二个问题，它可以从官方文档中总结出来。文档最开始就是这个接口的 <code>syntax</code> 语法描述部分：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>value, flags = ngx.shared.DICT:get(key)</span></span></code></pre></div><p>正常情况下，</p><ul><li>第一个参数 <code>value</code> 返回的是字典中 key 对应的值；但当 key 不存在或者过期时， <code>value</code> 的值为 nil。</li><li>第二个参数 <code>flags</code> 就稍微复杂一些了，如果 set 接口设置了 flags，就返回，否则不返回。</li></ul><p>一旦 API 调用出错， <code>value</code> 返回 nil， <code>flags</code> 返回具体的错误信息。</p><p>从文档总结的信息我们可以看出， <code>local v = dogs:get(&quot;Jim&quot;)</code> 这种只有一个接收参数的写法并不完善，因为它只覆盖了普通的使用场景，没有接收第二个参数，也没有做异常处理。我们可以把它修改为下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local data, err = dogs:get(&quot;Jim&quot;)</span></span>
<span class="line"><span>if data == nil and err then</span></span>
<span class="line"><span>    ngx.say(&quot;get not ok: &quot;, err)</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>和第一个问题一样，我们可以到测试案例集里搜索一下，印证下我们对文档的理解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>=== TEST 65: get nil key</span></span>
<span class="line"><span> --- http_config</span></span>
<span class="line"><span>     lua_shared_dict dogs 1m;</span></span>
<span class="line"><span> --- config</span></span>
<span class="line"><span>     location = /test {</span></span>
<span class="line"><span>         content_by_lua &#39;</span></span>
<span class="line"><span>             local dogs = ngx.shared.dogs</span></span>
<span class="line"><span>             local ok, err = dogs:get(nil)</span></span>
<span class="line"><span>             if not ok then</span></span>
<span class="line"><span>                 ngx.say(&quot;not ok: &quot;, err)</span></span>
<span class="line"><span>                 return</span></span>
<span class="line"><span>             end</span></span>
<span class="line"><span>             ngx.say(&quot;ok&quot;)</span></span>
<span class="line"><span>         &#39;;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> --- request</span></span>
<span class="line"><span> GET /test</span></span>
<span class="line"><span> --- response_body</span></span>
<span class="line"><span> not ok: nil key</span></span>
<span class="line"><span> --- no_error_log</span></span>
<span class="line"><span> [error]</span></span></code></pre></div><p>在这个测试案例中，get 接口的入参为 nil，返回的 err 信息是 <code>nil key</code>。这一方面验证了我们对文档的分析是正确的，另一方面，也为第三个问题提供了部分答案——起码，get 的入参不能是 nil。</p><h2 id="get-函数的入参是什么类型" tabindex="-1">get 函数的入参是什么类型？ <a class="header-anchor" href="#get-函数的入参是什么类型" aria-label="Permalink to &quot;get 函数的入参是什么类型？&quot;">​</a></h2><p>至于第三个问题， get 的入参可以是什么类型的呢？我们按照老规矩先查看文档，不过很可惜，你会发现，文档里并没有注明 key 的合法类型有哪些。这时该怎么办呢？</p><p>别着急，至少我们知道 key 可以是字符串类型，并且不能为 nil。不知道你还记得 Lua 中的数据类型吗？除了字符串和 nil，还有数字、数组、布尔类型和函数。后面两个显然没有作为 key 的必要性，我们只需要验证前两个。不妨先去测试文件中搜索一下，是否有数字作为 key 的案例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>=== TEST 4: number keys, string values</span></span></code></pre></div><p>通过这个测试案例，你可以清楚看到，数字也可以作为 key ，内部会将数字转为字符串。那么数组呢？很遗憾，测试案例并没有覆盖到，我们需要自己动手试一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty --shdict &#39;dogs 10m&#39; -e &#39;local dogs = ngx.shared.dogs</span></span>
<span class="line"><span> dogs:get({})</span></span>
<span class="line"><span> &#39;</span></span></code></pre></div><p>不出意料，果然报错了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ERROR: (command line -e):2: bad argument #1 to &#39;get&#39; (string expected, got table)</span></span></code></pre></div><p>综上，我们可以得出结论：get API 接受的 key 类型为字符串和数字。</p><p>那么入参 key 的长度是否有限制呢？这里其实也有一个对应的测试案例，我们一起来看一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>=== TEST 67: get a too-long key</span></span>
<span class="line"><span> --- http_config</span></span>
<span class="line"><span>     lua_shared_dict dogs 1m;</span></span>
<span class="line"><span> --- config</span></span>
<span class="line"><span>     location = /test {</span></span>
<span class="line"><span>         content_by_lua &#39;</span></span>
<span class="line"><span>             local dogs = ngx.shared.dogs</span></span>
<span class="line"><span>             local ok, err = dogs:get(string.rep(&quot;a&quot;, 65536))</span></span>
<span class="line"><span>             if not ok then</span></span>
<span class="line"><span>                 ngx.say(&quot;not ok: &quot;, err)</span></span>
<span class="line"><span>                 return</span></span>
<span class="line"><span>             end</span></span>
<span class="line"><span>             ngx.say(&quot;ok&quot;)</span></span>
<span class="line"><span>         &#39;;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> --- request</span></span>
<span class="line"><span> GET /test</span></span>
<span class="line"><span> --- response_body</span></span>
<span class="line"><span> not ok: key too long</span></span>
<span class="line"><span> --- no_error_log</span></span>
<span class="line"><span> [error]</span></span></code></pre></div><p>很显然，字符串长度为 65536 的时候，就会被提示 key 太长了。你可以试下把长度改为 65535，虽然只少了1个字节，却不会再报错了。这就说明，key 的最大长度正是 65535。</p><h2 id="写在最后" tabindex="-1">写在最后 <a class="header-anchor" href="#写在最后" aria-label="Permalink to &quot;写在最后&quot;">​</a></h2><p>OpenResty 现在的官方文档只有英文版本，国内工程师在阅读时，难免会因为语言问题，抓不住重点，甚至误解其中的内容。但越是这样，越没有捷径可走，你更应该仔细地把文档从头到尾读完，并在有疑问时，结合测试案例集和自己的尝试，去确定出答案。这才是辅助我们学习 OpenResty 的正确途径。</p><p>最后，我想提醒一下，在 OpenResty 的 API 中，凡是返回值中带有错误信息的，都必须有变量来接收并做错误处理，否则前方一定会有坑等你跳进去。比如把出错的连接放入了连接池，或者在 API 调用失败的情况下继续后面的逻辑，总之一定让人叫苦不迭。</p><p>那么，你在写 OpenResty 代码的时候，如果遇到问题，一般是通过什么方式来解决的？是文档、邮件列表、QQ 群，还是其他渠道呢？</p><p>欢迎留言一起探讨，也欢迎你把这篇文章分享给你的同事、朋友，我们一起交流，一起进步。</p>`,64)])])}const u=a(l,[["render",t]]);export{h as __pageData,u as default};
