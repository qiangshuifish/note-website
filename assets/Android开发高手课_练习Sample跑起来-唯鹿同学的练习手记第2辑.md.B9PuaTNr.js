import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"练习Sample跑起来 | 唯鹿同学的练习手记 第2辑","description":"","frontmatter":{},"headers":[],"relativePath":"Android开发高手课/练习Sample跑起来-唯鹿同学的练习手记第2辑.md","filePath":"Android开发高手课/练习Sample跑起来-唯鹿同学的练习手记第2辑.md","lastUpdated":1779815315000}'),t={name:"Android开发高手课/练习Sample跑起来-唯鹿同学的练习手记第2辑.md"};function l(i,a,o,c,r,d){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="练习sample跑起来-唯鹿同学的练习手记-第2辑" tabindex="-1">练习Sample跑起来 | 唯鹿同学的练习手记 第2辑 <a class="header-anchor" href="#练习sample跑起来-唯鹿同学的练习手记-第2辑" aria-label="Permalink to &quot;练习Sample跑起来 | 唯鹿同学的练习手记 第2辑&quot;">​</a></h1><p>你好，我是唯鹿。</p><p>接着上篇 <a href="https://time.geekbang.org/column/article/83742" target="_blank" rel="noreferrer">练习手记</a>，今天练习6～8、12、17、19这六期内容（主要针对有课后Sample练习的），相比1～5期轻松了很多。</p><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter06" target="_blank" rel="noreferrer"><strong>Chapter06</strong></a></p><blockquote><p>该项目展示了使用PLT Hook技术来获取Atrace的日志，可以学习到systrace的一些底层机制。</p></blockquote><p>没有什么问题，项目直接可以运行起来。运行项目后点击开启Atrace日志，然后就可以在Logcat日志中查看到捕获的日志，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>11:40:07.031 8537-8552/com.dodola.atrace I/HOOOOOOOOK: ========= install systrace hoook =========</span></span>
<span class="line"><span>11:40:07.034 8537-8537/com.dodola.atrace I/HOOOOOOOOK: ========= B|8537|Record View#draw()</span></span>
<span class="line"><span>11:40:07.034 8537-8552/com.dodola.atrace I/HOOOOOOOOK: ========= B|8537|DrawFrame</span></span>
<span class="line"><span>11:40:07.035 8537-8552/com.dodola.atrace I/HOOOOOOOOK: ========= B|8537|syncFrameState</span></span>
<span class="line"><span>    ========= B|8537|prepareTree</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>    ========= B|8537|eglBeginFrame</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>    ========= B|8537|computeOrdering</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>    ========= B|8537|flush drawing commands</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>11:40:07.036 8537-8552/com.dodola.atrace I/HOOOOOOOOK: ========= B|8537|eglSwapBuffersWithDamageKHR</span></span>
<span class="line"><span>    ========= B|8537|setSurfaceDamage</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>11:40:07.042 8537-8552/com.dodola.atrace I/HOOOOOOOOK: ========= B|8537|queueBuffer</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>11:40:07.043 8537-8552/com.dodola.atrace I/HOOOOOOOOK: ========= B|8537|dequeueBuffer</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>    ========= E</span></span>
<span class="line"><span>    ========= E</span></span></code></pre></div><p>通过B|事件和E|事件是成对出现的，这样就可以计算出应用执行每个事件使用的时间。那么上面的Log中View的draw()方法显示使用了9ms。</p><p>这里实现方法是使用了 <a href="https://github.com/facebookincubator/profilo" target="_blank" rel="noreferrer">Profilo</a> 的PLT Hook来hook libc.so的 <code>write</code> 与 <code>__write_chk</code> 方法。libc是C的基础库函数，为什么要hook这些方法，需要我们补充C、Linux相关知识。</p><p>同理 <a href="https://github.com/AndroidAdvanceWithGeektime/Chapter06-plus" target="_blank" rel="noreferrer">Chapter06-plus</a> 展示了如何使用 PLT Hook技术来获取线程创建的堆栈，README有详细的实现步骤介绍，我就不赘述了。</p><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter07" target="_blank" rel="noreferrer"><strong>Chapter07</strong></a></p><blockquote><p>这个Sample是学习如何给代码加入Trace Tag，大家可以将这个代码运用到自己的项目中，然后利用systrace查看结果。这就是所谓的systrace + 函数插桩。</p></blockquote><p>操作步骤：</p><ul><li><p>使用Android Studio打开工程Chapter07。</p></li><li><p>运行Gradle Task <code>:systrace-gradle-plugin:buildAndPublishToLocalMaven</code> 编译plugin插件。</p></li><li><p>使用Android Studio单独打开工程systrace-sample-android。</p></li><li><p>编译运行App（插桩后的class文件在目录 <code>Chapter07/systrace-sample-android/app/build/systrace_output/classes</code> 中查看）。</p></li></ul><p>对比一下插桩效果，插桩前：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/6587c2a9e0d4cae3b5336cbf9ef91da5.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/6587c2a9e0d4cae3b5336cbf9ef91da5.jpeg" alt=""></a></p><p>插桩后:</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/0895158565b8548d86d2e076325c0713.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/0895158565b8548d86d2e076325c0713.jpeg" alt=""></a></p><p>可以看到在方法执行前后插入了TraceTag，这样的话 <code>beginSection</code> 方法和 <code>endSection</code> 方法之间的代码就会被追踪。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TraceTag {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)</span></span>
<span class="line"><span>    public static void i(String name) {</span></span>
<span class="line"><span>        Trace.beginSection(name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)</span></span>
<span class="line"><span>    public static void o() {</span></span>
<span class="line"><span>        Trace.endSection();</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>其实Support-Compat库中也有类似的一个 <a href="https://developer.android.google.cn/reference/android/support/v4/os/TraceCompat" target="_blank" rel="noreferrer">TraceCompat</a>，项目中可以直接使用。</p><p>然后运行项目，打开systrace：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python $ANDROID_HOME/platform-tools/systrace/systrace.py gfx view wm am pm ss dalvik app sched -b 90960 -a com.sample.systrace  -o test.log.html</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/d17230ca7e70b399101b1ce66dd35e0e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/d17230ca7e70b399101b1ce66dd35e0e.jpeg" alt=""></a></p><p>最后打开生成的test.log.html文件就可以查看systrace记录：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/e093fc650bfeafd053eb845a1b1d9c4b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/e093fc650bfeafd053eb845a1b1d9c4b.jpeg" alt=""></a></p><p>当然，这一步我们也可以使用SDK中的Monitor，效果是一样的。</p><p>使用systrace + 函数插桩的方式，我们就可以很方便地观察每个方法的耗时，从而针对耗时的方法进行优化，尤其是Application的启动优化。</p><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter08" target="_blank" rel="noreferrer"><strong>Chapter08</strong></a></p><blockquote><p>该项目展示了关闭掉虚拟机的class verify后对性能的影响。</p></blockquote><p>在加载类的过程有一个verify class的步骤，它需要校验方法的每一个指令，是一个比较耗时的操作。这个例子就是通过Hook去掉verify这个步骤。该例子尽量在Dalvik下执行，在ART下的效果并不明显。</p><p>去除校验代码（可以参看阿里的 <a href="https://github.com/alibaba/atlas" target="_blank" rel="noreferrer">Atlas</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    AndroidRuntime runtime = AndroidRuntime.getInstance();</span></span>
<span class="line"><span>    runtime.init(this.getApplicationContext(), true);</span></span>
<span class="line"><span>    runtime.setVerificationEnabled(false);</span></span></code></pre></div><p>具体运行效果这里我就不展示了，直接运行体验就可以了。</p><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter12" target="_blank" rel="noreferrer"><strong>Chapter12</strong></a></p><blockquote><p>通过复写Application的 <code>getSharedPreferences</code> 替换系统 <code>SharedPreferences</code> 的实现，核心的优化在于修改了Apply的实现，将多个Apply方法在内存中合并，而不是多次提交。</p></blockquote><p>修改 <code>SharedPreferencesImpl</code> 的Apply部分如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>       public void apply() {</span></span>
<span class="line"><span>			// 先调用commitToMemory()</span></span>
<span class="line"><span>            final MemoryCommitResult mcr = commitToMemory();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            boolean hasDiskWritesInFlight = false;</span></span>
<span class="line"><span>            synchronized (SharedPreferencesImpl.this) {</span></span>
<span class="line"><span>            	// mDiskWritesInFlight大于0说明之前已经有调用过commitToMemory()了</span></span>
<span class="line"><span>                hasDiskWritesInFlight = mDiskWritesInFlight &amp;gt; 0;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 源码没有这层判断，直接提交。</span></span>
<span class="line"><span>            if (!hasDiskWritesInFlight) {</span></span>
<span class="line"><span>                final Runnable awaitCommit = new Runnable() {</span></span>
<span class="line"><span>                    public void run() {</span></span>
<span class="line"><span>                        try {</span></span>
<span class="line"><span>                            mcr.writtenToDiskLatch.await();</span></span>
<span class="line"><span>                        } catch (InterruptedException ignored) {</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                QueuedWork.add(awaitCommit);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                Runnable postWriteRunnable = new Runnable() {</span></span>
<span class="line"><span>                    public void run() {</span></span>
<span class="line"><span>                        awaitCommit.run();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                        QueuedWork.remove(awaitCommit);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                SharedPreferencesImpl.this.enqueueDiskWrite(mcr, postWriteRunnable);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // Okay to notify the listeners before it&#39;s hit disk</span></span>
<span class="line"><span>            // because the listeners should always get the same</span></span>
<span class="line"><span>            // SharedPreferences instance back, which has the</span></span>
<span class="line"><span>            // changes reflected in memory.</span></span>
<span class="line"><span>            notifyListeners(mcr);</span></span></code></pre></div><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter14" target="_blank" rel="noreferrer"><strong>Chapter14</strong></a></p><p>这个是全面解析SQLite的资料，有兴趣的可以下载看看。</p><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter17" target="_blank" rel="noreferrer"><strong>Chapter17</strong></a></p><blockquote><p>该项目展示了如何使用PLT Hook技术来获取网络请求相关信息。</p></blockquote><p>通过PLT Hook，代理Socket相关的几个重要函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* 直接 hook 内存中的所有so，但是需要排除掉socket相关方法本身定义的libc(不然会出现循坏)</span></span>
<span class="line"><span>* plt hook</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>void hookLoadedLibs() {</span></span>
<span class="line"><span>    ALOG(&quot;hook_plt_method&quot;);</span></span>
<span class="line"><span>    hook_plt_method_all_lib(&quot;libc.so&quot;, &quot;send&quot;, (hook_func) &amp;socket_send_hook);</span></span>
<span class="line"><span>    hook_plt_method_all_lib(&quot;libc.so&quot;, &quot;recv&quot;, (hook_func) &amp;socket_recv_hook);</span></span>
<span class="line"><span>    hook_plt_method_all_lib(&quot;libc.so&quot;, &quot;sendto&quot;, (hook_func) &amp;socket_sendto_hook);</span></span>
<span class="line"><span>    hook_plt_method_all_lib(&quot;libc.so&quot;, &quot;recvfrom&quot;, (hook_func) &amp;socket_recvfrom_hook);</span></span>
<span class="line"><span>    hook_plt_method_all_lib(&quot;libc.so&quot;, &quot;connect&quot;, (hook_func) &amp;socket_connect_hook);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int hook_plt_method_all_lib(const char* exclueLibname, const char* name, hook_func hook) {</span></span>
<span class="line"><span>  if (refresh_shared_libs()) {</span></span>
<span class="line"><span>    // Could not properly refresh the cache of shared library data</span></span>
<span class="line"><span>    return -1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int failures = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for (auto const&amp; lib : allSharedLibs()) {</span></span>
<span class="line"><span>      if (strcmp(lib.first.c_str(), exclueLibname) != 0) {</span></span>
<span class="line"><span>        failures += hook_plt_method(lib.first.c_str(), name, hook);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return failures;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行项目，访问百度的域名 <a href="https://www.baidu.com" target="_blank" rel="noreferrer">https://www.baidu.com</a>，输出如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>17:08:28.347 12145-12163/com.dodola.socket E/HOOOOOOOOK: socket_connect_hook sa_family: 10</span></span>
<span class="line"><span>17:08:28.349 12145-12163/com.dodola.socket E/HOOOOOOOOK: stack:com.dodola.socket.SocketHook.getStack(SocketHook.java:13)</span></span>
<span class="line"><span>    java.net.PlainSocketImpl.socketConnect(Native Method)</span></span>
<span class="line"><span>    java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:334)</span></span>
<span class="line"><span>    java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:196)</span></span>
<span class="line"><span>    java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:178)</span></span>
<span class="line"><span>    java.net.SocksSocketImpl.connect(SocksSocketImpl.java:356)</span></span>
<span class="line"><span>    java.net.Socket.connect(Socket.java:586)</span></span>
<span class="line"><span>    com.android.okhttp.internal.Platform.connectSocket(Platform.java:113)</span></span>
<span class="line"><span>    com.android.okhttp.Connection.connectSocket(Connection.java:196)</span></span>
<span class="line"><span>    com.android.okhttp.Connection.connect(Connection.java:172)</span></span>
<span class="line"><span>    com.android.okhttp.Connection.connectAndSetOwner(Connection.java:367)</span></span>
<span class="line"><span>    com.android.okhttp.OkHttpClient$1.connectAndSetOwner(OkHttpClient.java:130)</span></span>
<span class="line"><span>    com.android.okhttp.internal.http.HttpEngine.connect(HttpEngine.java:329)</span></span>
<span class="line"><span>    com.android.okhttp.internal.http.HttpEngine.sendRequest(HttpEngine.java:246)</span></span>
<span class="line"><span>    com.android.okhttp.internal.huc.HttpURLConnectionImpl.execute(HttpURLConnection</span></span>
<span class="line"><span>    AF_INET6 ipv6 IP===&amp;gt;183.232.231.173:443</span></span>
<span class="line"><span>    socket_connect_hook sa_family: 1</span></span>
<span class="line"><span>    Ignore local socket connect</span></span>
<span class="line"><span>02-07 17:08:28.637 12145-12163/com.dodola.socket E/HOOOOOOOOK: respond:\uFEFF&amp;lt;!DOCTYPE html&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;html&amp;gt;&amp;lt;!--STATUS OK--&amp;gt;&amp;lt;head&amp;gt;&amp;lt;meta charset=&quot;utf-8&quot;&amp;gt;&amp;lt;title&amp;gt;百度一下,你就知道&amp;lt;/title&amp;gt;</span></span></code></pre></div><p>可以看到我们获取到了网络请求的相关信息。</p><p>最后，我们可以通过Connect函数的hook，实现很多需求，例如：</p><ul><li>禁用应用网络访问</li><li>过滤广告IP</li><li>禁用定位功能</li></ul><p><a href="https://github.com/AndroidAdvanceWithGeektime/Chapter19" target="_blank" rel="noreferrer"><strong>Chapter19</strong></a></p><blockquote><p>使用Java Hook实现Alarm、WakeLock与GPS的耗电监控。</p></blockquote><p>实现原理</p><p>根据老师提供的提示信息，动态代理对应的 <a href="http://androidxref.com/7.0.0_r1/xref/frameworks/base/core/java/android/os/PowerManager.java" target="_blank" rel="noreferrer">PowerManager</a>、 <a href="http://androidxref.com/7.0.0_r1/xref/frameworks/base/core/java/android/app/AlarmManager.java" target="_blank" rel="noreferrer">AlarmManager</a>、 <a href="http://androidxref.com/7.0.0_r1/xref/frameworks/base/location/java/android/location/LocationManager.java" target="_blank" rel="noreferrer">LocationManager</a> 的 <code>mService</code> 实现，要拦截的方法在 <a href="http://androidxref.com/7.0.0_r1/xref/frameworks/base/services/core/java/com/android/server/power/PowerManagerService.java" target="_blank" rel="noreferrer">PowerManagerService</a>、 <a href="http://androidxref.com/7.0.0_r1/xref/frameworks/base/services/core/java/com/android/server/AlarmManagerService.java" target="_blank" rel="noreferrer">AlarmManagerService</a>、 <a href="http://androidxref.com/7.0.0_r1/xref/frameworks/base/services/core/java/com/android/server/LocationManagerService.java" target="_blank" rel="noreferrer">LocationManagerService</a> 中。</p><p>实现核心代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>        Object oldObj = mHostContext.getSystemService(Context.XXX_SERVICE);</span></span>
<span class="line"><span>	Class&amp;lt;?&amp;gt; clazz = oldObj.getClass();</span></span>
<span class="line"><span>	Field field = clazz.getDeclaredField(&quot;mService&quot;);</span></span>
<span class="line"><span>	field.setAccessible(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	final Object mService = field.get(oldObj);</span></span>
<span class="line"><span>	setProxyObj(mService);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	Object newObj = Proxy.newProxyInstance(this.getClass().getClassLoader(), mService.getClass().getInterfaces(), this);</span></span>
<span class="line"><span>	field.set(oldObj, newObj)</span></span></code></pre></div><p>写了几个调用方法去触发，通过判断对应的方法名来做堆栈信息的输出。</p><p>输出的堆栈信息如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/43e081eacdef050b78b71043c87acdb7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/43e081eacdef050b78b71043c87acdb7.png" alt=""></a></p><p>当然，强大的Studio在3.2后也有了强大的耗电量分析器，同样可以监测到这些信息，如下图所示（我使用的Studio版本为3.3）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/82b2939991e4c9c729017255fb1cb73d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Android%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/84405/82b2939991e4c9c729017255fb1cb73d.png" alt=""></a></p><p>实现不足之处：</p><ul><li>可能兼容性上不是特别完善（期待老师的标准答案）。</li><li>没有按照耗电监控的规则去做一些业务处理。</li></ul><p>心得体会：</p><ul><li>本身并不复杂，只是为了找到Hook点，看了对应的Service源码耗费了一些时间，对于它们的工作流程有了更深的认识。</li><li>平时也很少使用动态代理，这回查漏补缺，一次用了个爽。</li></ul><p>这个作业前前后后用了一天时间，之前作业还有一些同学提供PR，所以相对轻松些，但这次没有参考，走了点弯路，不过收获也是巨大的。我就不细说了，感兴趣的话可以参考我的实现。完整代码参见 <a href="https://github.com/simplezhli/Chapter19" target="_blank" rel="noreferrer">GitHub</a>，仅供参考。</p><p><strong>参考</strong></p><ul><li><a href="https://time.geekbang.org/column/article/76413" target="_blank" rel="noreferrer">练习Sample跑起来 | 热点问题答疑第3期</a></li><li><a href="https://time.geekbang.org/column/article/79331" target="_blank" rel="noreferrer">练习Sample跑起来 | 热点问题答疑第4期</a></li></ul>`,68)])])}const g=n(t,[["render",l]]);export{m as __pageData,g as default};
