import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"15｜音画同步：如何让声音和画面手拉手前进？","description":"","frontmatter":{},"headers":[{"level":2,"title":"PTS和DTS","slug":"pts和dts","link":"#pts和dts","children":[]},{"level":2,"title":"时间基","slug":"时间基","link":"#时间基","children":[]},{"level":2,"title":"音视频同步的类型","slug":"音视频同步的类型","link":"#音视频同步的类型","children":[]},{"level":2,"title":"视频同步到音频","slug":"视频同步到音频","link":"#视频同步到音频","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"攻克视频技术/15｜音画同步：如何让声音和画面手拉手前进？.md","filePath":"攻克视频技术/15｜音画同步：如何让声音和画面手拉手前进？.md","lastUpdated":1779820653000}'),l={name:"攻克视频技术/15｜音画同步：如何让声音和画面手拉手前进？.md"};function i(t,s,r,c,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_15-音画同步-如何让声音和画面手拉手前进" tabindex="-1">15｜音画同步：如何让声音和画面手拉手前进？ <a class="header-anchor" href="#_15-音画同步-如何让声音和画面手拉手前进" aria-label="Permalink to &quot;15｜音画同步：如何让声音和画面手拉手前进？&quot;">​</a></h1><p>你好，我是李江。</p><p>在上节课中，我们讲述了音视频封装以及音视频数据是如何装到FLV和MP4文件里面的。这节课我们来讲讲播放这些文件的时候需要用到的一个非常重要的技术——音视频同步，也叫 <strong>音画同步</strong>。</p><p>音视频同步是什么呢？它就是指在音视频数据播放的时候，播放的画面和声音是需要同步的，是能对得上的。相信你一定遇到过这种情况，就是看电视、电影或者直播的时候，人的口型和声音是对不上的，这样看起来会让人非常难受，这种问题就是音视频不同步导致的。因此做好音视频同步是非常重要的，当然也会有一定的难度，我们不妨先从一些基础知识讲起。</p><h2 id="pts和dts" tabindex="-1">PTS和DTS <a class="header-anchor" href="#pts和dts" aria-label="Permalink to &quot;PTS和DTS&quot;">​</a></h2><p>首先就是PTS和DTS这两个概念。其实，我们在讲音视频封装的时候已经提到过了。</p><p><strong>PTS表示的是视频帧的显示时间，DTS表示的是视频帧的解码时间。</strong> 对于同一帧来说，DTS和PTS可能是不一样的。</p><p>为什么呢？主要的原因是B帧，因为B帧可以双向参考，可以参考后面的P帧，那么就需要将后面用作参考的P帧先编码或解码，然后才能进行B帧的编码和解码。所以就会导致一个现象，后面显示的帧需要先编码或解码，这样就有解码时间和显示时间不同的问题了。如果说没有B帧的话，只有I帧和P帧就不会有PTS和DTS不同的问题了。</p><p>具体如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%94%BB%E5%85%8B%E8%A7%86%E9%A2%91%E6%8A%80%E6%9C%AF/images/472533/7c23be3f62ba07f0ba61f1603afe5a86.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%94%BB%E5%85%8B%E8%A7%86%E9%A2%91%E6%8A%80%E6%9C%AF/images/472533/7c23be3f62ba07f0ba61f1603afe5a86.jpeg" alt="图片"></a></p><h2 id="时间基" tabindex="-1">时间基 <a class="header-anchor" href="#时间基" aria-label="Permalink to &quot;时间基&quot;">​</a></h2><p>另外一个很重要的概念是时间基。这是面试中经常会问到的知识点，你一定要掌握。</p><p>时间基是什么呢？很简单， <strong>它就是时间的单位</strong>。比如说，编程的时候我们经常使用ms（毫秒）这个时间单位，毫秒是1/1000秒，如果你用毫秒表示时间的话，时间基就是1/1000。再比如说RTP的时间戳，它的单位是1/90000秒，也就是说RTP时间戳的时间基是1/90000。意思是RTP的时间戳每增加1，就是指时间增加了1/90000秒。</p><p>而对于FLV封装，时间基是1/1000，意思是FLV里面的DTS和PTS的单位都是ms。MP4的话，时间基就是在box中的time_scale，是需要从box中读取解析出来的，不是固定的，具体可以参考 <a href="https://time.geekbang.org/column/article/471074" target="_blank" rel="noreferrer">第14讲</a>。这就是时间基的概念。</p><h2 id="音视频同步的类型" tabindex="-1">音视频同步的类型 <a class="header-anchor" href="#音视频同步的类型" aria-label="Permalink to &quot;音视频同步的类型&quot;">​</a></h2><p>好，了解了基础知识以后，我们就可以开始学习音视频同步了。音视频同步主要的类型有三种： <strong>视频同步到音频、音频同步到视频、音频和视频都做调整同步</strong>。我们逐一看下。</p><p>首先，视频同步到音频是指音频按照自己的节奏播放，不需要调节。如果视频相对音频快了的话，就延长当前播放视频帧的时间，以此来减慢视频帧的播放速度。如果视频相对音频慢了的话，就加快视频帧的播放速度，甚至通过丢帧的方式来快速赶上音频。</p><p>这种方式是 <strong>最常用的音视频同步方式</strong>，也是我们今天讲述的重点，后面我们就会以这种方式来深入探讨其原理。</p><p>其次，音频同步到视频是指视频按照自己的节奏播放，不需要调节。如果音频相对视频快了的话，就降低音频播放的速度，比如说重采样音频增加音频的采样点，延长音频的播放时间。如果音频相对视频慢了，就加快音频的播放速度，比如说重采样音频数据减少音频的采样点，缩短音频的播放时间。</p><p>这里需要格外注意的是，当音频的播放速度发生变化，音调也会改变，所以我们需要做到变速不变调，这个你可以参考另外一个专栏 <a href="https://time.geekbang.org/column/intro/100098801?tab=intro" target="_blank" rel="noreferrer">《搞定音频技术》</a>，里面有详细的讲解。</p><p><strong>一般来说这种方式是不常用的</strong>，因为人耳的敏感度很高，相对于视频来说，音频的调整更容易被人耳发现。因此对音频做调节，要做好的话，难度要高于调节视频的速度，所以我们一般不太会使用这种同步方法。</p><p>最后一种是音频和视频都做调整，具体是指音频和视频都需要为音视频同步做出调整。比如说WebRTC里面的音视频同步就是音频和视频都做调整，如果前一次调节的是视频的话，下一次就调节音频，相互交替进行， <strong>整体的思路还是跟前面两种方法差不多</strong>。音频快了就将音频的速度调低一些或者将视频的速度调高一些，视频快了就将视频的速度调低一些或者将音频的速度调高一些。 <strong>这种一般在非RTC场景也不怎么使用。</strong></p><h2 id="视频同步到音频" tabindex="-1">视频同步到音频 <a class="header-anchor" href="#视频同步到音频" aria-label="Permalink to &quot;视频同步到音频&quot;">​</a></h2><p>那么接下来我们就深入学习一下最常用的音视频同步，即视频同步到音频，它是怎么工作的。这里我们 <strong>参考FFplay的代码实现来讲解其原理</strong>。</p><p>首先，我们使用的时间戳是PTS，因为播放视频的时间我们应该使用显示时间。而且我们需要先通过时间基将对应的时间戳转换到常用的时间单位，一般是秒或者毫秒。</p><p>然后，我们有一个视频时钟和一个音频时钟来记录当前视频播放到的PTS和音频播放到的PTS。注意这里的PTS还不是实际视频帧的PTS或者音频帧的PTS，稍微有点区别。</p><p><strong>区别是什么呢？</strong> 比如说一帧视频的PTS的100s，这一帧视频已经在渲染到屏幕上了，并且播放了0.02s的时间，那么当前的视频时钟是100.02s。也就是说视频时钟和音频时钟不仅仅需要考虑当前正在播放的帧的PTS，还要考虑当前正在播放的这一帧播放了多长时间，这个值才是最准确的时钟。</p><p>而视频时钟和音频时钟的差值就是不同步的时间差。这个时间差我们记为diff，表示了当前音频和视频的不同步程度。 <strong>我们需要做的就是尽量调节来减小这个时间差的绝对值。</strong></p><p>那怎么调节呢？我们知道，我们可以通过计算得到当前正在播放的视频帧理论上应该播放多长时间（不考虑音视频同步的话）。计算方法就是用还没有播放但是紧接着要播放的帧的PTS减去正在播放的帧的PTS，我们记为last_duration。</p><p>如果说当前视频时钟相比音频时钟要大，也就是diff大于0，说明视频快了。这个时候我们就可以延长正在播放的视频帧的播放时间，也就是增加last_duration的值，是不是视频的播放画面就会慢下来了？因为后面的待播放帧需要等更长的时间才会播放，而音频的播放速度不变，是不是就相当于待播放的视频帧在等音频了？</p><p>反之，如果说当前的视频时钟相比音频时钟要小，也就是diff小于0，说明视频慢了。这个时候我们就缩短正在播放的视频帧的播放时间，也就是减小last_duration的值，是不是视频的播放画面就会加快速度渲染，就相当于待播放的视频帧在加快脚步赶上前面的音频了？</p><p>这里略有点绕，你可以停下来理一理，总之还是很好理解的。</p><p>那具体到底对last_duration加多少或者减多少呢？我们来看看FFplay的代码是怎么做的。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* called to display each frame */</span></span>
<span class="line"><span>static void video_refresh(void *opaque, double *remaining_time)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    if (is-&gt;video_st) {</span></span>
<span class="line"><span>retry:</span></span>
<span class="line"><span>        if (frame_queue_nb_remaining(&amp;is-&gt;pictq) == 0) {</span></span>
<span class="line"><span>            // nothing to do, no picture to display in the queue</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            double last_duration, duration, delay;</span></span>
<span class="line"><span>            Frame *vp, *lastvp;</span></span>
<span class="line"><span>            /* dequeue the picture */</span></span>
<span class="line"><span>            lastvp = frame_queue_peek_last(&amp;is-&gt;pictq); // lastvp是指当前正在播放的视频帧</span></span>
<span class="line"><span>            vp = frame_queue_peek(&amp;is-&gt;pictq); // vp是指接下来紧接着要播放的视频帧</span></span>
<span class="line"><span>            if (vp-&gt;serial != is-&gt;videoq.serial) {</span></span>
<span class="line"><span>                frame_queue_next(&amp;is-&gt;pictq);</span></span>
<span class="line"><span>                goto retry;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (lastvp-&gt;serial != vp-&gt;serial)</span></span>
<span class="line"><span>                is-&gt;frame_timer = av_gettime_relative() / 1000000.0;</span></span>
<span class="line"><span>            if (is-&gt;paused)</span></span>
<span class="line"><span>                goto display;</span></span>
<span class="line"><span>            /* compute nominal last_duration */</span></span>
<span class="line"><span>            // last_duration是lastvp也就是当前正在播放的视频帧的理论应该播放的时间，</span></span>
<span class="line"><span>            // last_duration = vp-&gt;pts - lastvp-&gt;pts。</span></span>
<span class="line"><span>            last_duration = vp_duration(is, lastvp, vp);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // compute_target_delay根据视频和音频的不同步情况，调整当前正在播放的视频帧的播放时间last_duration，</span></span>
<span class="line"><span>            // 得到实际应该播放的时间delay。</span></span>
<span class="line"><span>            // 这个函数是音视频同步的重点。</span></span>
<span class="line"><span>            delay = compute_target_delay(last_duration, is);</span></span>
<span class="line"><span>            time= av_gettime_relative()/1000000.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // is-&gt;frame_timer是当前正在播放视频帧应该开始播放的时间，</span></span>
<span class="line"><span>            // is-&gt;frame_timer + delay是当前正在播放视频帧经过音视频同步之后应该结束播放的时间，也就是下一帧应该开始播放的时间，</span></span>
<span class="line"><span>            // 如果当前时间time还没有到当前播放视频帧的结束时间的话，继续播放当前帧，并计算当前帧还需要播放多长时间remaining_time。</span></span>
<span class="line"><span>            if (time &lt; is-&gt;frame_timer + delay) {</span></span>
<span class="line"><span>                *remaining_time = FFMIN(is-&gt;frame_timer + delay - time, *remaining_time);</span></span>
<span class="line"><span>                goto display;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 如果当前正在播放的视频帧的播放时间已经足够了，那就播放下一帧，并更新is-&gt;frame_timer的值。</span></span>
<span class="line"><span>            is-&gt;frame_timer += delay;</span></span>
<span class="line"><span>            if (delay &gt; 0 &amp;&amp; time - is-&gt;frame_timer &gt; AV_SYNC_THRESHOLD_MAX)</span></span>
<span class="line"><span>                is-&gt;frame_timer = time;</span></span>
<span class="line"><span>            SDL_LockMutex(is-&gt;pictq.mutex);</span></span>
<span class="line"><span>            if (!isnan(vp-&gt;pts))</span></span>
<span class="line"><span>                // 用当前视频帧的pts更新视频时钟</span></span>
<span class="line"><span>                update_video_pts(is, vp-&gt;pts, vp-&gt;pos, vp-&gt;serial);</span></span>
<span class="line"><span>            SDL_UnlockMutex(is-&gt;pictq.mutex);</span></span>
<span class="line"><span>            if (frame_queue_nb_remaining(&amp;is-&gt;pictq) &gt; 1) {</span></span>
<span class="line"><span>                Frame *nextvp = frame_queue_peek_next(&amp;is-&gt;pictq);</span></span>
<span class="line"><span>                // duration是当前要播放帧的理论播放时间</span></span>
<span class="line"><span>                duration = vp_duration(is, vp, nextvp);</span></span>
<span class="line"><span>                // 如果视频时钟落后音频时钟太多，视频帧队列里面待播放的帧的播放结束时间已经小于当前时间了的话，就直接丢弃掉，快速赶上音频时钟</span></span>
<span class="line"><span>                if(!is-&gt;step &amp;&amp; (framedrop&gt;0 || (framedrop &amp;&amp; get_master_sync_type(is) != AV_SYNC_VIDEO_MASTER)) &amp;&amp; time &gt; is-&gt;frame_timer + duration){</span></span>
<span class="line"><span>                    is-&gt;frame_drops_late++;</span></span>
<span class="line"><span>                    frame_queue_next(&amp;is-&gt;pictq);</span></span>
<span class="line"><span>                    goto retry;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            ......</span></span>
<span class="line"><span>            frame_queue_next(&amp;is-&gt;pictq);</span></span>
<span class="line"><span>            is-&gt;force_refresh = 1;</span></span>
<span class="line"><span>            if (is-&gt;step &amp;&amp; !is-&gt;paused)</span></span>
<span class="line"><span>                stream_toggle_pause(is);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>display:</span></span>
<span class="line"><span>        /* display picture */</span></span>
<span class="line"><span>        if (!display_disable &amp;&amp; is-&gt;force_refresh &amp;&amp; is-&gt;show_mode == SHOW_MODE_VIDEO &amp;&amp; is-&gt;pictq.rindex_shown)</span></span>
<span class="line"><span>            video_display(is);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再来看看最重要的函数compute_target_delay具体是怎么实现的。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static double compute_target_delay(double delay, VideoState *is)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    double sync_threshold, diff = 0;</span></span>
<span class="line"><span>    /* update delay to follow master synchronisation source */</span></span>
<span class="line"><span>    if (get_master_sync_type(is) != AV_SYNC_VIDEO_MASTER) {</span></span>
<span class="line"><span>        /* if video is slave, we try to correct big delays by duplicating or deleting a frame */</span></span>
<span class="line"><span>        // get_clock(&amp;is-&gt;vidclk)是获取到当前的视频时钟，视频时钟 = 当前正在播放帧的pts + 当前播放帧已经播放了的时间。</span></span>
<span class="line"><span>        // get_master_clock(is)是获取到当前的音频时钟（在视频同步到音频方法的时候），</span></span>
<span class="line"><span>       // 音频时钟 = 当前正在播放音频帧的播放结束时间 - 还未播放完的音频时长。</span></span>
<span class="line"><span>       // diff等于视频时钟相比音频时钟的差值；</span></span>
<span class="line"><span>       // diff &gt; 0 表示视频快了；</span></span>
<span class="line"><span>       // diff &lt; 0 表示视频慢了。</span></span>
<span class="line"><span>        diff = get_clock(&amp;is-&gt;vidclk) - get_master_clock(is);</span></span>
<span class="line"><span>        /* skip or repeat frame. We take into account the delay to compute the threshold. I still don&#39;t know if it is the best guess */</span></span>
<span class="line"><span>        // delay就是last_duration，也就是当前播放帧理论应该播放的时长。</span></span>
<span class="line"><span>        // sync_threshold是视频时钟和音频时钟不同步的阈值，就取为delay也就是last_duration的值，并且在0.04到0.1秒之间。</span></span>
<span class="line"><span>        // 如果-sync_threshold &lt; diff &lt; sync_threshold的话就不需要调整last_duration了。</span></span>
<span class="line"><span>        // AV_SYNC_THRESHOLD_MIN是0.04秒，也就是40ms，</span></span>
<span class="line"><span>        // AV_SYNC_THRESHOLD_MAX是0.1秒，也就是100ms，也就是说音视频同步中，最大不同步程度不能超过100ms。</span></span>
<span class="line"><span>        sync_threshold = FFMAX(AV_SYNC_THRESHOLD_MIN, FFMIN(AV_SYNC_THRESHOLD_MAX, delay));</span></span>
<span class="line"><span>        if (!isnan(diff) &amp;&amp; fabs(diff) &lt; is-&gt;max_frame_duration) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 如果视频时钟比音频时钟慢了的时间超过了sync_threshold，则将delay（也就是last_duration）减小diff，加快视频的速度。</span></span>
<span class="line"><span>            if (diff &lt;= -sync_threshold)</span></span>
<span class="line"><span>                delay = FFMAX(0, delay + diff);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 如果视频时钟比音频时钟快了的时间超过了sync_threshold，并且delay（也就是last_duration）太长了，</span></span>
<span class="line"><span>            // 大于0.1秒（AV_SYNC_FRAMEDUP_THRESHOLD）的话，</span></span>
<span class="line"><span>            // 我们就直接将delay（也就是last_duration）增加一个diff，减慢视频的速度。</span></span>
<span class="line"><span>            else if (diff &gt;= sync_threshold &amp;&amp; delay &gt; AV_SYNC_FRAMEDUP_THRESHOLD)</span></span>
<span class="line"><span>                delay = delay + diff;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 如果视频时钟比音频时钟快了的时间超过了sync_threshold，并且delay（也就是last_duration）不怎么长的话，</span></span>
<span class="line"><span>            // 我们就将delay（也就是last_duration）增加一倍，减慢视频的速度。</span></span>
<span class="line"><span>            // 这里和前一个条件处理的不同就在于delay（也就是last_duration）是不是大于AV_SYNC_FRAMEDUP_THRESHOLD，</span></span>
<span class="line"><span>            // 上面不直接将delay翻倍应该是delay太大，大于了0.1秒了，超过了不同步阈值的最大值0.1秒了，还不如diff有多少就加多少。</span></span>
<span class="line"><span>            // 而这个条件里面delay翻倍而直接不增加diff的原因应该是一般帧率大概在20fps左右，last_duration差不多就0.05秒，</span></span>
<span class="line"><span>            // 增加一倍也不会太大，毕竟音视频同步本来就是动态同步。</span></span>
<span class="line"><span>            else if (diff &gt;= sync_threshold)</span></span>
<span class="line"><span>                delay = 2 * delay;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    av_log(NULL, AV_LOG_TRACE, &quot;video: delay=%0.3f A-V=%f\\n&quot;,</span></span>
<span class="line"><span>            delay, -diff);</span></span>
<span class="line"><span>    return delay;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合代码我们可以看出，音视频同步并不是完完全全同步的，而是 <strong>通过调整正在播放的视频帧的播放时间来尽量达到一个动态的同步状态</strong>，这个状态里面的视频时钟和音频时钟并不是完全相等的，只是相差得比较少，人眼的敏感度看不出来而已。这就是音视频同步的原理。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我们讲述了音视频同步的相关知识。音视频同步主要的任务就是使播放的声音和画面能够对齐同步，防止出现声音和画面对不上的问题。主要的类型有三种，分别是视频同步到音频、音频同步到视频、音频和视频都做调整同步。</p><p>视频同步到音频是指音频的播放速度不需要调节，只调节视频的播放速度。如果视频相对音频快了的话，就减慢视频的播放速度；如果视频相对音频慢了的话，就加快视频帧的播放速度。这种方式是最常用的音视频同步方式。</p><p>音频同步到视频是指视频的播放速度不需要调节，只调节音频的播放速度。如果音频相对视频快了的话，就降低音频播放的速度；如果音频相对视频慢了的话，就加快音频的播放速度。但是需要注意的是，音频速度变化会导致音调改变，所以要保证变速不变调。可由于人耳的敏感度很高，音频的调整更容易被发现，因此这种同步方式难度很高，所以一般不建议你使用它。</p><p>音频和视频都做调整是指音频和视频都需要为音视频的同步做出调整。比如说WebRTC里面的音视频同步就是音频和视频都做调整。整体的思路跟前面两种差不多，音频快了就将音频的速度调低一些或者将视频的速度调高一些，视频快了就将视频的速度调低一些或者将音频的速度调高一些。</p><p>之后，我们对视频同步到音频这种方式做了深入讲解。我们主要是通过计算视频时钟和音频时间之间的差值diff，来调节当前播放视频帧的播放时间last_duration。如果diff大于0，则加大last_duration的值，让视频速度慢下来，等等后面的音频；如果diff小于0，则减小last_duration的值，让视频播放的速度快起来，赶上前面的音频。这就是音视频同步的原理。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这节课我们开放讨论，谈谈你在这门课程中的收获吧？或者你还有哪些不懂的知识点都可以说给我听听，如果有必要的话我们还可以做一些针对性的讲解。</p><p>不妨大胆直言，我们畅快交流，留言区见！</p>`,46)])])}const m=a(l,[["render",i]]);export{g as __pageData,m as default};
