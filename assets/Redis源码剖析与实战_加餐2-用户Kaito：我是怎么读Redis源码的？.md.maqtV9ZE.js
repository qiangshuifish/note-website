import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"加餐2 | 用户Kaito：我是怎么读Redis源码的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"找到地图","slug":"找到地图","link":"#找到地图","children":[]},{"level":2,"title":"前置知识准备","slug":"前置知识准备","link":"#前置知识准备","children":[]},{"level":2,"title":"从基础模块开始读","slug":"从基础模块开始读","link":"#从基础模块开始读","children":[]},{"level":2,"title":"找到核心主线","slug":"找到核心主线","link":"#找到核心主线","children":[]},{"level":2,"title":"先整体后细节","slug":"先整体后细节","link":"#先整体后细节","children":[]},{"level":2,"title":"先主线后支线","slug":"先主线后支线","link":"#先主线后支线","children":[]},{"level":2,"title":"查漏补缺","slug":"查漏补缺","link":"#查漏补缺","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"Redis源码剖析与实战/加餐2-用户Kaito：我是怎么读Redis源码的？.md","filePath":"Redis源码剖析与实战/加餐2-用户Kaito：我是怎么读Redis源码的？.md","lastUpdated":1779816274000}'),l={name:"Redis源码剖析与实战/加餐2-用户Kaito：我是怎么读Redis源码的？.md"};function i(t,s,c,r,o,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="加餐2-用户kaito-我是怎么读redis源码的" tabindex="-1">加餐2 | 用户Kaito：我是怎么读Redis源码的？ <a class="header-anchor" href="#加餐2-用户kaito-我是怎么读redis源码的" aria-label="Permalink to &quot;加餐2 | 用户Kaito：我是怎么读Redis源码的？&quot;">​</a></h1><p>你好，我是Kaito，也是两季Redis课程的课代表。今天，我想来和你分享一下我读源码的经验，希望能助力你更好地学习Redis源码。</p><p>首先，一提到读源码，很多人都会比较畏惧，认为读源码是高手才会做的事情。可能遇到问题时，他们更倾向于去找别人分享的答案。但往往很多时候，自己查到的资料并不能帮助解决所有问题，尤其是比较细节的问题。</p><p>那么从我的实践经验来看，遇到这种情况，通常就需要去源码中寻找答案了，因为在源码面前，这些细节会变得一览无余。而且我认为，掌握读源码的能力，是从只懂得如何使用Redis，到精通Redis实现原理的成长之路上，必须跨越的门槛。可是， <strong>面对庞大复杂的项目，我们怎样读源码才能更高效呢？</strong></p><p>所以下面，我就来和你聊一聊我在读源码时的经验和心得。</p><h2 id="找到地图" tabindex="-1">找到地图 <a class="header-anchor" href="#找到地图" aria-label="Permalink to &quot;找到地图&quot;">​</a></h2><p>很多开源项目的源码，代码量一般都比较庞大，如果在读代码之前，我们没有制定合理的方法，就一头扎进去读代码，势必会把自己搞晕。</p><p>所以，我在拿到一个项目的代码之后，并不会马上着手去读，而是会先对整个项目结构进行梳理，划分出项目具体包含的模块。这样，我就对整个项目有了一个宏观的了解。</p><p>因为读代码就好比去一个陌生城市旅行，这个旅途过程充满着未知。如果在出发之前，我们手里能有一张地图，那我们对自己的行程就可以有一个非常清晰的规划，我们就知道，如果想要到达目的地，需要从哪里出发、经过哪些地方、通过什么方式才能到达， <strong>有了地图就有了行进方向</strong>，否则很容易迷失。</p><p>因此，提前花一些时间梳理整个项目的结构和目录，对于后面更好地阅读代码是非常有必要的。就拿Redis来举例，在读Redis源码之前，我们可以先梳理出整个项目的功能模块，以及每个模块对应的代码文件，以下给出的就是src下的代码结构：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/419664/8de27eda5312b45e70f80e8d534ecafc.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/419664/8de27eda5312b45e70f80e8d534ecafc.jpg" alt="图片"></a></p><p>这样，有了这张地图之后，我们再去看代码的时候，就可以有重点地阅读了。</p><h2 id="前置知识准备" tabindex="-1">前置知识准备 <a class="header-anchor" href="#前置知识准备" aria-label="Permalink to &quot;前置知识准备&quot;">​</a></h2><p>在梳理完整个项目结构之后，我们就可以正式进入阅读环节当中了。</p><p>不过，在阅读代码之前，我们其实还需要预先掌握一些前置知识。因为一个完整的项目，必然综合了各个领域的技术知识点，比如数据结构、操作系统、网络协议、编程语言等，如果我们提前做好一些功课，在读源码的过程中就会轻松很多。以下是根据我在阅读Redis书籍和实战过程中，提取的读源码必备前置知识点，给你参考一下。</p><ul><li>常用数据结构：数组、链表、哈希表、跳表。</li><li>网络协议：TCP协议。</li><li>网络IO模型：IO多路复用、非阻塞IO、Reactor网络模型。</li><li>操作系统：写时复制（Copy On Write）、常见系统调用、磁盘IO机制。</li><li>C语言基础：循环、分支、结构体、指针。</li></ul><p>当然，在阅读源码的过程中，我们也可以根据实际问题再去查阅相关资料，但不管怎样，提前熟悉这些方面的知识，在真正读代码时就会省下不少时间。</p><h2 id="从基础模块开始读" tabindex="-1">从基础模块开始读 <a class="header-anchor" href="#从基础模块开始读" aria-label="Permalink to &quot;从基础模块开始读&quot;">​</a></h2><p>好，有了地图并掌握了前置知识之后，接下来我们就要进入主题了： <strong>读代码</strong>。但具体要从哪个地方开始读起呢？我认为要先从最基础的模块开始读起。</p><p>我在前面也分析了，一个完整的项目会划分很多的功能模块，但这些模块并不是孤立的，而很可能是有依赖关系的。比如说，Redis中的networking.c文件，表示处理网络IO的具体实现。而如果我们能在理解事件驱动模块ae.c的基础上，再去阅读网络IO模块，效率就会更高。</p><p>那么在Redis源码中，哪些是最基础的模块呢？想一下，我们在使用Redis时，接触最频繁的是哪些功能？</p><p>答案是 <strong>各种数据类型</strong>。</p><p><strong>一切操作的基础，其实都是基于这些最常用的数据类型来做的</strong>，比如String、List、Hash、Set、Sorted Set等。所以，我们就可以从这些基础模块开始读起，也就是从t_string.c、t_list.c、t_hash.c、t_set.c、t_zset.c代码入手。</p><p>如果你对Redis的数据类型有所了解，就会看到这些数据类型在实现时，底层都对应了不同的数据结构。比如，String的底层是SDS，List的底层是ziplist + quicklist，Hash底层可能是ziplist，也可能是哈希表，等等。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/419664/7cf142081a43bba5ee84904c80ec3635.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/419664/7cf142081a43bba5ee84904c80ec3635.jpg" alt="图片"></a></p><p>而由此一来，我们会发现，这些数据结构又是更为底层的模块，所以我们在阅读数据类型模块时，就需要重点聚焦在这些模块上，也就是sds.c、ziplist.c、quicklist.c、dict.c、intset.c文件，而且这些文件都是比较独立的，阅读起来就可以更加集中。</p><p>这样，当我们真正掌握了这些底层数据结构的实现后，就能更好地理解基于它们实现的各种数据类型了。 <strong>这些基础模块就相当于一座大厦的地基，地基打好了，才能做到高楼耸立。</strong></p><h2 id="找到核心主线" tabindex="-1">找到核心主线 <a class="header-anchor" href="#找到核心主线" aria-label="Permalink to &quot;找到核心主线&quot;">​</a></h2><p>接着，掌握了数据结构模块之后，这时我们的重点就需要放在核心主线上来了。</p><p>在这个阶段，我们需要找到一个明确的目标，以这个目标为主线去读代码。因为读源码其实是一个很常见的需求，就是为了了解这个项目最核心功能的实现细节，我们只有以此为目标，找到这条主线去读代码，才能达到最终目的。</p><p>那么在读Redis源码时，什么才是它的核心主线呢？这里我分享一个非常好用的技巧，就是根据“ <strong>Redis究竟是怎么处理客户端发来的命令的？</strong>”来梳理。</p><p>举个例子，当我们在执行SET testkey testval EX 60这样一条命令时，就需要搞清楚Redis是怎么执行这条命令的。也就是要明确，Redis从收到客户端请求，到把数据存到Redis中、设置过期时间，最后把响应结果返回给客户端，整个过程的每一个环节，到底是如何处理的。</p><p>有了这条主线，我们就有了非常明确的目标，而且沿着这条主线去读代码，我们还可以很清晰地把多个模块串联起来。比如从前面的例子中，我们会看到一条命令的执行，主要包含了这样几个阶段。</p><ul><li><strong>Redis Server初始化</strong>：加载配置、监听端口、注册连接建立事件、启动事件循环（server.c、anet.c）。</li><li><strong>接收、解析客户端请求</strong>：初始化Client、注册读事件、读客户端Socket（networking.c）。</li><li><strong>处理具体的命令</strong>：找到对应的命令函数、执行命令（server.c、t_string.c、t_list.c、t_hash.c、t_set.c、t_zset.c）。</li><li><strong>返回响应给客户端</strong>：写客户端缓冲区、注册写事件、写客户端Socket（networking.c）。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/419664/87e8563785353f4947ef70283842573e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/419664/87e8563785353f4947ef70283842573e.jpg" alt="图片"></a></p><p>沿着这条主线去读代码，我们就可以掌握一条命令的执行全过程。而且，由于这条主线的代码逻辑，已经覆盖了所有命令的执行流程，我们下次再去读其他命令时，比如SADD，就只需要关注处理命令部分的逻辑即可，其他逻辑有80%都是相同的。</p><h2 id="先整体后细节" tabindex="-1">先整体后细节 <a class="header-anchor" href="#先整体后细节" aria-label="Permalink to &quot;先整体后细节&quot;">​</a></h2><p>当然，在阅读主线代码的过程中，肯定也会遇到过于复杂的函数，第一次在读这种函数时，很容易就会陷进去，导致整个主线代码的阅读，无法继续推进下去。遇到这种情况其实是很正常的，可这时我们应该怎么办呢？</p><p>这里我的做法是，前期读到这种逻辑时，不要马上陷入到细节中去，而是要 <strong>先抓整体</strong>。具体来说，对于复杂的函数逻辑，我们刚开始并不需要知道它的每一个细节是如何实现的，而是只需知道这个函数大致做了几件事情即可。</p><p>举个例子，在执行HSET命令时，有一段代码很复杂，其中包括了很多分支判断，一次很难读懂：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int hashTypeSet(robj *o, sds field, sds value, int flags) {</span></span>
<span class="line"><span>    int update = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (o-&amp;gt;encoding == OBJ_ENCODING_ZIPLIST) {</span></span>
<span class="line"><span>        unsigned char *zl, *fptr, *vptr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        zl = o-&amp;gt;ptr;</span></span>
<span class="line"><span>        fptr = ziplistIndex(zl, ZIPLIST_HEAD);</span></span>
<span class="line"><span>        if (fptr != NULL) {</span></span>
<span class="line"><span>            fptr = ziplistFind(fptr, (unsigned char*)field, sdslen(field), 1);</span></span>
<span class="line"><span>            if (fptr != NULL) {</span></span>
<span class="line"><span>                /* Grab pointer to the value (fptr points to the field) */</span></span>
<span class="line"><span>                vptr = ziplistNext(zl, fptr);</span></span>
<span class="line"><span>                serverAssert(vptr != NULL);</span></span>
<span class="line"><span>                update = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                /* Delete value */</span></span>
<span class="line"><span>                zl = ziplistDelete(zl, &amp;vptr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                /* Insert new value */</span></span>
<span class="line"><span>                zl = ziplistInsert(zl, vptr, (unsigned char*)value,</span></span>
<span class="line"><span>                        sdslen(value));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!update) {</span></span>
<span class="line"><span>            /* Push new field/value pair onto the tail of the ziplist */</span></span>
<span class="line"><span>            zl = ziplistPush(zl, (unsigned char*)field, sdslen(field),</span></span>
<span class="line"><span>                    ZIPLIST_TAIL);</span></span>
<span class="line"><span>            zl = ziplistPush(zl, (unsigned char*)value, sdslen(value),</span></span>
<span class="line"><span>                    ZIPLIST_TAIL);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        o-&amp;gt;ptr = zl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* Check if the ziplist needs to be converted to a hash table */</span></span>
<span class="line"><span>        if (hashTypeLength(o) &amp;gt; server.hash_max_ziplist_entries)</span></span>
<span class="line"><span>            hashTypeConvert(o, OBJ_ENCODING_HT);</span></span>
<span class="line"><span>    } else if (o-&amp;gt;encoding == OBJ_ENCODING_HT) {</span></span>
<span class="line"><span>        dictEntry *de = dictFind(o-&amp;gt;ptr,field);</span></span>
<span class="line"><span>        if (de) {</span></span>
<span class="line"><span>            sdsfree(dictGetVal(de));</span></span>
<span class="line"><span>            if (flags &amp; HASH_SET_TAKE_VALUE) {</span></span>
<span class="line"><span>                dictGetVal(de) = value;</span></span>
<span class="line"><span>                value = NULL;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                dictGetVal(de) = sdsdup(value);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            update = 1;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            sds f,v;</span></span>
<span class="line"><span>            if (flags &amp; HASH_SET_TAKE_FIELD) {</span></span>
<span class="line"><span>                f = field;</span></span>
<span class="line"><span>                field = NULL;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                f = sdsdup(field);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (flags &amp; HASH_SET_TAKE_VALUE) {</span></span>
<span class="line"><span>                v = value;</span></span>
<span class="line"><span>                value = NULL;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                v = sdsdup(value);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            dictAdd(o-&amp;gt;ptr,f,v);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        serverPanic(&quot;Unknown hash encoding&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Free SDS strings we did not referenced elsewhere if the flags</span></span>
<span class="line"><span>     * want this function to be responsible. */</span></span>
<span class="line"><span>    if (flags &amp; HASH_SET_TAKE_FIELD &amp;&amp; field) sdsfree(field);</span></span>
<span class="line"><span>    if (flags &amp; HASH_SET_TAKE_VALUE &amp;&amp; value) sdsfree(value);</span></span>
<span class="line"><span>    return update;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么，我在读这段代码时，就可以先简化逻辑，把握整体思路：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 执行 HSET 命令</span></span>
<span class="line"><span>int hashTypeSet(robj *o, sds field, sds value, int flags) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 如果当前是 ziplist 编码存储</span></span>
<span class="line"><span>    if (o-&amp;gt;encoding == OBJ_ENCODING_ZIPLIST) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    // 如果是 hashtable 编码存储</span></span>
<span class="line"><span>    } else if (o-&amp;gt;encoding == OBJ_ENCODING_HT) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        serverPanic(&quot;Unknown hash encoding&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>之后，再了解每个分支大致做了哪些事情：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 如果当前是 ziplist 编码存储</span></span>
<span class="line"><span>if (o-&amp;gt;encoding == OBJ_ENCODING_ZIPLIST) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // field 在 ziplist 中，从 ziplist 中删除，在插入新值</span></span>
<span class="line"><span>    if (fptr != NULL) {</span></span>
<span class="line"><span>        fptr = ziplistFind(fptr, (unsigned char*)field, sdslen(field), 1);</span></span>
<span class="line"><span>        zl = ziplistDelete(zl, &amp;vptr);</span></span>
<span class="line"><span>        zl = ziplistInsert(zl, vptr, (unsigned char*)value, sdslen(value));</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // field 不在 ziplist 中，则插入到 ziplist</span></span>
<span class="line"><span>    if (!update) {</span></span>
<span class="line"><span>        zl = ziplistPush(zl, (unsigned char*)field, sdslen(field),</span></span>
<span class="line"><span>                    ZIPLIST_TAIL);</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ziplist 元素超过阈值，转为 hashtable</span></span>
<span class="line"><span>    if (hashTypeLength(o) &amp;gt; server.hash_max_ziplist_entries) {</span></span>
<span class="line"><span>        hashTypeConvert(o, OBJ_ENCODING_HT);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样做的 <strong>好处</strong>，一是不会被复杂的细节逻辑搞晕，打击自己的自信心；二是可以有效避免阅读的连贯性被打断，从而能持续推进我们把整个主线逻辑读完。</p><p>所以，这里的重点就是：先把复杂代码的主逻辑搞清楚，知道涉及的每个方法完成了什么事，心里要先搭建一个简单的框架，等有了框架之后，我们再去给框架填充细节。这样通过 <strong>先整体后细节</strong> 的方式，我们就可以不再畏惧代码中的复杂逻辑。</p><h2 id="先主线后支线" tabindex="-1">先主线后支线 <a class="header-anchor" href="#先主线后支线" aria-label="Permalink to &quot;先主线后支线&quot;">​</a></h2><p>不过，在阅读主线代码的过程中，我们肯定还会遇到各种支线逻辑，比如数据过期、替换淘汰、持久化、主从复制等。</p><p>其实，在阅读主线逻辑的时候，我们并不需要去重点关注这些支线，而当整个主线逻辑清晰起来之后，我们再去读这些支线模块，就会容易很多了。这时，我们就可以从这些支线中，选取下一个目标，带着这个目标去阅读，比如说：</p><ul><li>过期策略是怎么实现的？（expire.c、lazyfree.c）</li><li>淘汰策略是如何实现的？（evict.c）</li><li>持久化 RDB、AOF 是怎么做的？（rdb.c、aof.c）</li><li>主从复制是怎么做的？（replication.c）</li><li>哨兵如何完成故障自动切换？（sentinel.c）</li><li>分片逻辑如何实现？（cluster.c）</li><li>….</li></ul><p>有了新的支线目标后，我们依旧可以采用前面提到的先整体后细节的思路阅读相关模块，这样下来，整个项目的每个模块，就可以被逐一击破了。</p><h2 id="查漏补缺" tabindex="-1">查漏补缺 <a class="header-anchor" href="#查漏补缺" aria-label="Permalink to &quot;查漏补缺&quot;">​</a></h2><p>最后，我们还需要查漏补缺。</p><p>按照前面提到的方法，基本就可以把整个项目的主要模块读得七七八八了，这时我们基本已经对整个项目有了整体的把控。</p><p>不过，当我们在工作中遇到问题时，很有可能会发现，在当时读代码的过程中，有很多并不在意的细节被忽略了。所以这时，我们就可以 <strong>再带着具体问题出发，聚焦这个问题相关的模块，再一次去读源码</strong>。这样一来，我们就可以填补当时阅读源码的空白区。</p><p>举个例子，当我们在阅读String底层数据结构SDS（简单动态字符串）的实现时，我们会看到当 SDS 需要追加新内容时会进行扩容，而我们之前阅读这部分代码时， <strong>很有可能只是了解到有这样的逻辑存在，但并没有在意扩容的相关细节（一次扩容多大）</strong>。</p><p>所以，当我们在工作中遇到这个细节问题后，就可以把目光聚焦在 SDS 的扩容逻辑上（sds.c 的sdsMakeRoomFor函数），而此时我们会发现，当需要申请的新内存小于1MB时，Redis就会翻倍申请内存，否则按1MB申请新内存。</p><p>采用这个方法进行查漏补缺，我们就可以对整个项目了解得更深入、更全面，真正把项目吃透。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，以上就是我在阅读Redis源码时，总结出来的经验体会，这里我也把这七个步骤梳理总结下。</p><ol><li><strong>找到地图</strong>：拿到项目代码后，提前梳理整个项目结构，知晓整个项目的模块划分，以及对应的代码文件。</li><li><strong>前置知识准备</strong>：提前掌握项目中用到的前置知识，比如数据结构、操作系统原理、网络协议、网络 IO 模型、编程语言语法等等。</li><li><strong>从基础模块开始读</strong>：从最底层的基础模块开始入手，先掌握了这些模块，之后基于它们构建的模块读起来会更加高效。</li><li><strong>找到核心主线</strong>：找到整个项目中最核心的主线逻辑，以此为目标，了解各模块为了完成这个功能，是如何协作和组织的。</li><li><strong>先整体后细节</strong>：对于复杂函数，不要上来就陷入细节，前期阅读只需了解这个函数大致做了什么事情，建立框架，等搭建起框架之后，再去填充细节。</li><li><strong>先主线后支线</strong>：整个主线逻辑清晰之后，再去延伸阅读支线逻辑，因为支线逻辑肯定是服务主线逻辑的，读完主线后再去读这些支线，也会变得更简单。</li><li><strong>查漏补缺</strong>：在工作中遇到具体问题，带着这些实际的问题出发再次去读源码，进行查漏补缺，填补之前读源码时没有注意到的地方。</li></ol><p>当然，这个阅读源码的方法也并不局限于Redis，如果你在开发过程中，也有读源码的需要，希望这个方法能帮助你更好地吃透它。</p><p>最后，如果你也有自己的阅读源码的实践经验和方法，欢迎在留言区分享出来，我们一起交流，共同进步！</p>`,64)])])}const u=n(l,[["render",i]]);export{g as __pageData,u as default};
