import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"37 | systemtap-toolkit和stapxx：如何用数据搞定“疑难杂症”？","description":"","frontmatter":{},"headers":[{"level":2,"title":"以共享字典为例","slug":"以共享字典为例","link":"#以共享字典为例","children":[]},{"level":2,"title":"on CPU 和 off CPU","slug":"on-cpu-和-off-cpu","link":"#on-cpu-和-off-cpu","children":[]},{"level":2,"title":"上游和阶段跟踪","slug":"上游和阶段跟踪","link":"#上游和阶段跟踪","children":[]},{"level":2,"title":"写在最后","slug":"写在最后","link":"#写在最后","children":[]}],"relativePath":"OpenResty从入门到实战/37-systemtap-toolkit和stapxx：如何用数据搞定“疑难杂症”？.md","filePath":"OpenResty从入门到实战/37-systemtap-toolkit和stapxx：如何用数据搞定“疑难杂症”？.md","lastUpdated":1779816093000}'),t={name:"OpenResty从入门到实战/37-systemtap-toolkit和stapxx：如何用数据搞定“疑难杂症”？.md"};function l(i,s,c,o,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_37-systemtap-toolkit和stapxx-如何用数据搞定-疑难杂症" tabindex="-1">37 | systemtap-toolkit和stapxx：如何用数据搞定“疑难杂症”？ <a class="header-anchor" href="#_37-systemtap-toolkit和stapxx-如何用数据搞定-疑难杂症" aria-label="Permalink to &quot;37 | systemtap-toolkit和stapxx：如何用数据搞定“疑难杂症”？&quot;">​</a></h1><p>你好，我是温铭。</p><p>正如上节课介绍过的，作为服务端开发工程师，我们并不会对动态调试的工具集做深入的学习，大都是停留在使用的这个层面上，最多去编写一些简单的 stap 脚本。更底层的，比如 CPU 缓存、体系结构、编译器等，那就是性能工程师的领域了。</p><p>在 OpenResty 中有两个开源项目： <code>openresty-systemtap-toolkit</code> 和 <code>stapxx</code> 。它们是基于 Systemtap 封装好的工具集，用于 Nginx 和 OpenResty 的实时分析和诊断。它们可以覆盖 on CPU、off CPU、共享字典、垃圾回收、请求延迟、内存池、连接池、文件访问等常用的功能和调试场景。</p><p>在今天这节课中，我会带你浏览下这些工具和对应的使用方法，目的是帮你在遇到 Nginx 和 OpenResty 的疑难杂症时，可以快速找到定位问题的工具。在 OpenResty 的世界中，学会使用这些工具是你进阶的必经之路，也是和其他开发者沟通的非常有效的方式——毕竟，工具产生的数据，会比你用文字描述更加准确和详尽。</p><p>不过，需要特别注意的是，OpenResty 的最新版本 1.15.8 默认开启了 LuaJIT GC64 模式，但是 <code>openresty-systemtap-toolkit</code> 和 <code>stapxx</code> 并没有跟着做对应的修改，这就会导致里面的工具都无法正常使用。所以，你最好在 OpenResty 旧的 1.13 版本中来使用这些工具。</p><p>开源项目的贡献者大都是兼职身份，他们并没有义务来保证这些工具可以一直正常使用，这也是你在使用开源项目时候需要意识到的一点。</p><h2 id="以共享字典为例" tabindex="-1">以共享字典为例 <a class="header-anchor" href="#以共享字典为例" aria-label="Permalink to &quot;以共享字典为例&quot;">​</a></h2><p>按照惯例，我先用一个你最熟悉的、也是上手最简单的工具 <code>ngx-lua-shdict</code>，来作为今天开篇的示例。</p><p><code>ngx-lua-shdict</code> 这个工具，可以分析 Nginx 的共享内存字典，并且追踪字典的操作。你可以用 <code>-f</code> 选项指定 dict 和 key，来获取共享内存字典里面的数据。 <code>--raw</code> 选项可以导出指定 key 的原始值。</p><p>下面是一个从共享内存字典中获取数据的命令行示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 假设 nginx worker pid 是 5050</span></span>
<span class="line"><span>$ ./ngx-lua-shdict -p 5050 -f --dict dogs --key Jim --luajit20</span></span>
<span class="line"><span>Tracing 5050 (/opt/nginx/sbin/nginx)...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type: LUA_TBOOLEAN</span></span>
<span class="line"><span>value: true</span></span>
<span class="line"><span>expires: 1372719243270</span></span>
<span class="line"><span>flags: 0xa</span></span></code></pre></div><p>类似的，你可以用 <code>-w</code> 选项，来追踪指定 key 的字典写操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$./ngx-lua-shdict -p 5050 -w --key Jim --luajit20</span></span>
<span class="line"><span>Tracing 5050 (/opt/nginx/sbin/nginx)...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Hit Ctrl-C to end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set Jim exptime=4626322717216342016</span></span>
<span class="line"><span>replace Jim exptime=4626322717216342016</span></span>
<span class="line"><span>^C</span></span></code></pre></div><p>让我们看看这个工具是怎么实现的吧。 <code>ngx-lua-shdict</code> 是一个 perl 的脚本，但具体的实现和 perl 并没有关系，perl 只是被用来生成了 stap 脚本并运行起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>open my $in, &quot;|stap $stap_args -x $pid -&quot; or die &quot;Cannot run stap: $!\\n&quot;;</span></span></code></pre></div><p>你完全可以用 Python、PHP、Go 或者你喜欢的任何语言来编写。stap 脚本中，比较关键的地方是下面这行代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>probe process(&quot;$nginx_path&quot;).function(&quot;ngx_http_lua_shdict_set_helper&quot;)</span></span></code></pre></div><p>这就是我们在上节课中提到的探针 <code>probe</code>，探测的是 <code>ngx_http_lua_shdict_set_helper</code> 这个函数。而这个函数的调用，都是在 <code>lua-nginx-module</code> 模块的 <code>lua-nginx-module/src/ngx_http_lua_shdict.c</code> 文件中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int</span></span>
<span class="line"><span>ngx_http_lua_shdict_add(lua_State *L)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>return ngx_http_lua_shdict_set_helper(L, NGX_HTTP_LUA_SHDICT_ADD);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int</span></span>
<span class="line"><span>ngx_http_lua_shdict_safe_add(lua_State *L)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>return ngx_http_lua_shdict_set_helper(L, NGX_HTTP_LUA_SHDICT_ADD</span></span>
<span class="line"><span>|NGX_HTTP_LUA_SHDICT_SAFE_STORE);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int</span></span>
<span class="line"><span>ngx_http_lua_shdict_replace(lua_State *L)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>return ngx_http_lua_shdict_set_helper(L, NGX_HTTP_LUA_SHDICT_REPLACE);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，我们只要探测这个函数，就可以追踪到共享字典的所有操作了。</p><h2 id="on-cpu-和-off-cpu" tabindex="-1">on CPU 和 off CPU <a class="header-anchor" href="#on-cpu-和-off-cpu" aria-label="Permalink to &quot;on CPU 和 off CPU&quot;">​</a></h2><p>在使用 OpenResty 的过程中，你最常遇到的应该就是性能问题了把。性能比较差，也就是 QPS 很低的表现主要有两类，CPU 占用过高和 CPU 占用过低。前者的瓶颈，可能是没有使用我们之前介绍过的性能优化的方法；而后者可能是因为使用了阻塞函数。相对应的，on CPU 和 off CPU 火焰图，可以帮助我们确认最终的根源所在。</p><p>要生成 C 级别的 on CPU 火焰图，你需要使用 systemtap-toolkit 中的 <code>sample-bt</code>；而 Lua 级别的 on CPU 火焰图，则是由 stapxx 中的 <code>lj-lua-stacks</code> 来生成的。</p><p>我们以 <code>sample-bt</code> 为例来介绍下如何使用。 <code>sample-bt</code> 这个脚本，可以对你指定的任意用户进程（不仅限于 Nginx 和 OpenResty 进程），来进行调用栈的采样。</p><p>例如，我们可以用下列代码，对一个正在运行的 Nginx worker 进程（PID 是 8736）采样 5 秒钟：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ./sample-bt -p 8736 -t 5 -u &amp;gt; a.bt</span></span>
<span class="line"><span>WARNING: Tracing 8736 (/opt/nginx/sbin/nginx) in user-space only...</span></span>
<span class="line"><span>WARNING: Missing unwind data for module, rerun with &#39;stap -d stap_df60590ce8827444bfebaf5ea938b5a_11577&#39;</span></span>
<span class="line"><span>WARNING: Time&#39;s up. Quitting now...(it may take a while)</span></span>
<span class="line"><span>WARNING: Number of errors: 0, skipped probes: 24</span></span></code></pre></div><p>它输出的结果文件 a.bt， 可以使用 FlameGraph 工具集来生成火焰图:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>stackcollapse-stap.pl a.bt &amp;gt; a.cbt</span></span>
<span class="line"><span>flamegraph.pl a.cbt &amp;gt; a.svg</span></span></code></pre></div><p>这里的 <code>a.svg</code> ，就是生成的火焰图，你可以用浏览器打开查看。不过要注意，在采样期间，我们需要保持一定的请求压力，否则采样数为 0 的话，就没办法生成火焰图了。</p><p>接着我们再来看下如何采样 off CPU，你需要使用的脚本是 systemtap-toolkit 中的 <code>sample-bt-off-cpu</code>。它的使用方法和 <code>sample-bt</code> 类似，我也写在了下面的代码中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ./sample-bt-off-cpu -p 10901 -t 5 &amp;gt; a.bt</span></span>
<span class="line"><span>WARNING: Tracing 10901 (/opt/nginx/sbin/nginx)...</span></span>
<span class="line"><span>WARNING: _stp_read_address failed to access memory location</span></span>
<span class="line"><span>WARNING: Time&#39;s up. Quitting now...(it may take a while)</span></span>
<span class="line"><span>WARNING: Number of errors: 0, skipped probes: 23</span></span></code></pre></div><p>在stapxx 中，分析延迟的工具是 <code>epoll-loop-blocking-distr</code>，它会对指定的用户进程进行采样，并输出连续的 <code>epoll_wait</code> 系统调用之间的延迟分布：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ./samples/epoll-loop-blocking-distr.sxx -x 19647 --arg time=60</span></span>
<span class="line"><span>Start tracing 19647...</span></span>
<span class="line"><span>Please wait for 60 seconds.</span></span>
<span class="line"><span>Distribution of epoll loop blocking latencies (in milliseconds)</span></span>
<span class="line"><span>max/avg/min: 1097/0/0</span></span>
<span class="line"><span>value |-------------------------------------------------- count</span></span>
<span class="line"><span>    0 |&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;  18471</span></span>
<span class="line"><span>    1 |&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;&amp;#64;                                            3273</span></span>
<span class="line"><span>    2 |&amp;#64;                                                    473</span></span>
<span class="line"><span>    4 |                                                     119</span></span>
<span class="line"><span>    8 |                                                      67</span></span>
<span class="line"><span>   16 |                                                      51</span></span>
<span class="line"><span>   32 |                                                      35</span></span>
<span class="line"><span>   64 |                                                      20</span></span>
<span class="line"><span>  128 |                                                      23</span></span>
<span class="line"><span>  256 |                                                       9</span></span>
<span class="line"><span>  512 |                                                       2</span></span>
<span class="line"><span> 1024 |                                                       2</span></span>
<span class="line"><span> 2048 |                                                       0</span></span>
<span class="line"><span> 4096 |                                                       0</span></span></code></pre></div><p>你可以看到，这个输出结果显示，绝大部分延迟都小于 1 毫秒，但也有少数是在 200 毫秒以上的，这些就是需要关注的。</p><h2 id="上游和阶段跟踪" tabindex="-1">上游和阶段跟踪 <a class="header-anchor" href="#上游和阶段跟踪" aria-label="Permalink to &quot;上游和阶段跟踪&quot;">​</a></h2><p>除了 OpenResty 的代码本身可能出现性能问题外，当 OpenResty 通过 <code>cosocket</code> 或者 <code>proxy_pass</code> 这样的上游模块，与上游服务进行通信时，如果上游服务自身的延时比较大，也会对整体的性能带来很大的影响。</p><p>这个时候，你可以使用 <code>ngx-lua-tcp-recv-time</code>、 <code>ngx-lua-udp-recv-time</code> 和 <code>ngx-single-req-latency</code> 这几个工具来进行分析，这里我以 <code>ngx-single-req-latency</code> 为例解释下。</p><p>这个工具和工具集里面的大部分工具并不太一样。其他工具，多是基于大量的采样和统计分析，得出一个数学上的分布结论。而 <code>ngx-single-req-latency</code> 分析的却是单个的请求，跟踪出单个请求在 OpenResty 中各个阶段的耗时，比如 rewrite、access、content 阶段以及上游的耗时。</p><p>我们可以来看一个具体的示例代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># making the ./stap++ tool visible in PATH:</span></span>
<span class="line"><span>    $ export PATH=$PWD:$PATH</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # assuming an nginx worker process&#39;s pid is 27327</span></span>
<span class="line"><span>    $ ./samples/ngx-single-req-latency.sxx -x 27327</span></span>
<span class="line"><span>    Start tracing process 27327 (/opt/nginx/sbin/nginx)...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    POST /api_json</span></span>
<span class="line"><span>        total: 143596us, accept() ~ header-read: 43048us, rewrite: 8us, pre-access: 7us, access: 6us, content: 100507us</span></span>
<span class="line"><span>        upstream: connect=29us, time-to-first-byte=99157us, read=103us</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    $ ./samples/ngx-single-req-latency.sxx -x 27327</span></span>
<span class="line"><span>    Start tracing process 27327 (/opt/nginx/sbin/nginx)...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GET /robots.txt</span></span>
<span class="line"><span>        total: 61198us, accept() ~ header-read: 33410us, rewrite: 7us, pre-access: 7us, access: 5us, content: 27750us</span></span>
<span class="line"><span>        upstream: connect=30us, time-to-first-byte=18955us, read=96us</span></span></code></pre></div><p>这个工具会跟踪它启动后遇到的第一个请求。输出的内容和 opentracing 非常类似，你甚至可以把 systemtap-toolkit 和 stapxx ，当作是 OpenResty 中 APM（应用性能管理）的非侵入版本。</p><h2 id="写在最后" tabindex="-1">写在最后 <a class="header-anchor" href="#写在最后" aria-label="Permalink to &quot;写在最后&quot;">​</a></h2><p>除了今天我讲到的这些常用工具，OpenResty 自然还提供了更多的工具，它们就交给你自己去探索和学习了。</p><p>其实，在追踪技术方面，OpenResty 和其他的开发语言、平台相比，还有一个比较大的不同之处，希望你可以慢慢体会：</p><blockquote><p>保持代码基的简洁和稳定，不要在其中增加探针，而是通过外部动态跟踪的技术来进行采样。</p></blockquote><p>最后给你留一个问题，你在使用 OpenResty 的时候，使用过哪些工具来进行跟踪和分析问题呢？欢迎留言和我探讨这个问题，也欢迎你把这篇文章分享出去，我们一起交流和进步。</p>`,47)])])}const g=a(t,[["render",l]]);export{m as __pageData,g as default};
