import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"17 | 自动化注入神器（四）：sqlmap的核心功能解析","description":"","frontmatter":{},"headers":[{"level":2,"title":"注入点检测","slug":"注入点检测","link":"#注入点检测","children":[{"level":3,"title":"动态参数检测","slug":"动态参数检测","link":"#动态参数检测","children":[]},{"level":3,"title":"启发式注入测试","slug":"启发式注入测试","link":"#启发式注入测试","children":[]}]},{"level":2,"title":"checkSqlInjection 函数","slug":"checksqlinjection-函数","link":"#checksqlinjection-函数","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考","slug":"思考","link":"#思考","children":[]}],"relativePath":"Web漏洞挖掘实战/17｜自动化注入神器（四）：sqlmap的核心功能解析.md","filePath":"Web漏洞挖掘实战/17｜自动化注入神器（四）：sqlmap的核心功能解析.md","lastUpdated":1795536081000}'),e={name:"Web漏洞挖掘实战/17｜自动化注入神器（四）：sqlmap的核心功能解析.md"};function l(t,s,h,k,r,c){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_17-自动化注入神器-四-sqlmap的核心功能解析" tabindex="-1">17 | 自动化注入神器（四）：sqlmap的核心功能解析 <a class="header-anchor" href="#_17-自动化注入神器-四-sqlmap的核心功能解析" aria-label="Permalink to &quot;17 | 自动化注入神器（四）：sqlmap的核心功能解析&quot;">​</a></h1><p>你好，我是王昊天。</p><p>在上节课中，我们重点学习了 sqlmap 中一个非常重要的算法——页面相似度算法。相信你对页面相似度这个概念会有更加清晰的认知，不但知道它是什么含义，而且知道它是如何计算出来的。解决了这个大难点之后，我在上节课的结尾提出了一个空连接检测功能，有了它，sqlmap 就可以大大提高执行效率。完成了检测，sqlmap 就进入到实际的 SQL 注入测试阶段了。</p><p>在 SQL 注入测试阶段，系统首先会检测有哪些注入点，然后对这些注入点逐一发送合适的payload，检测注入是否成功。如果注入成功，那么系统会将注入点存储下来，最后对它们进行输出。</p><p>这节课，我们就来正式学习 sqlmap 的 SQL 注入测试过程。</p><h2 id="注入点检测" tabindex="-1">注入点检测 <a class="header-anchor" href="#注入点检测" aria-label="Permalink to &quot;注入点检测&quot;">​</a></h2><p>在 SQL 正式注入测试之前，sqlmap 会对每个目标的参数进行过滤。将那些非动态的，不存在注入可能的参数剔除掉，留下可能的注入点。这样 sqlmap 仅需要对这些可能的注入点进行正式的注入测试即可。</p><h3 id="动态参数检测" tabindex="-1">动态参数检测 <a class="header-anchor" href="#动态参数检测" aria-label="Permalink to &quot;动态参数检测&quot;">​</a></h3><p>我们首先来看 sqlmap 是如何检测动态参数的。这部分代码依旧在 start 函数中，紧接着空连接检测出现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># sqlmap首先对所有可用于注入测试的参数进行简单的优先级排序。</span></span>
<span class="line"><span>  parameters = list(conf.parameters.keys())</span></span>
<span class="line"><span># 定义测试列表的顺序。（从后到前）</span></span>
<span class="line"><span>  orderList = (PLACE.CUSTOM_POST, PLACE.CUSTOM_HEADER, PLACE.URI, PLACE.POST, PL</span></span>
<span class="line"><span># 对测试参数排好序之后，系统开始对参数进行过滤操作。</span></span>
<span class="line"><span>  proceed = True</span></span>
<span class="line"><span>  for place in parameters:</span></span>
<span class="line"><span>      skip = # ...</span></span>
<span class="line"><span>      if skip:</span></span>
<span class="line"><span>          continue</span></span>
<span class="line"><span>      if place not in conf.paramDict:</span></span>
<span class="line"><span>          continue</span></span>
<span class="line"><span>      paramDict = conf.paramDict[place]</span></span>
<span class="line"><span>      paramType = conf.method if conf.method not in (None, HTTPMETHOD.GET, HTTPM</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span>      for parameter, value in paramDict.items():</span></span>
<span class="line"><span>          if not proceed:</span></span>
<span class="line"><span>              break</span></span>
<span class="line"><span># 经过过滤，将该参数加入到测试过的参数中，防止重复测试。</span></span>
<span class="line"><span>          kb.testedParams.add(paramKey)</span></span></code></pre></div><p>我们可以结合代码中的注释，来理解参数的过滤。首先 sqlmap 会对待测参数进行一个优先级排序。在排序完成之后，系统会根据用户的配置信息，对这些参数进行过滤操作。这里我举一个例子来让你更加容易理解这一步骤。例如，当用户配置的检测 level 小于 2 时，那么系统就会跳过对 cookie 参数的检测过程。</p><p>过滤完成之后，我们就会进入到你最熟悉的一步——SQL 注入测试过程。让我们结合代码，分析 sqlmap 是如何进行 SQL 注入测试的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if testSqlInj:</span></span>
<span class="line"><span># 开始注入测试</span></span>
<span class="line"><span>   try:</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span># 进入启发式注入测试。</span></span>
<span class="line"><span>       check = heuristicCheckSqlInjection(place, parameter)</span></span>
<span class="line"><span># 当启发式注入测试失败，就跳过该参数。</span></span>
<span class="line"><span>       if check != HEURISTIC_TEST.POSITIVE:</span></span>
<span class="line"><span>           if conf.smart or (kb.ignoreCasted and check == HEURISTIC_TEST.CASTED)</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span>              continue</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span># 通过启发式注入测试后，就会进入到SQL注入测试阶段。</span></span>
<span class="line"><span>       injection = checkSqlInjection(place, parameter, value)</span></span></code></pre></div><h3 id="启发式注入测试" tabindex="-1">启发式注入测试 <a class="header-anchor" href="#启发式注入测试" aria-label="Permalink to &quot;启发式注入测试&quot;">​</a></h3><p>如果一个参数被检测为注入点，那我们就可以对它进行注入测试。为了提高注入测试的效率，系统会过滤一些注入成功率较低的注入点，这需要首先对它进行一个启发式注入测试。下面让我们结合代码，对启发式注入测试有个更具体的理解。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> heuristicCheckSqlInjection</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(place, parameter):</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 如果配置中设置了跳过启发式注入测试，就返回结果None，当使用者没有特殊配置conf.start这个配置项</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.skipHeuristics:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> None</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 初始化参数，并根据用户设置的偏好制作payload。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   origValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.paramDict[place][parameter]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   paramType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">not</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">None</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HTTPMETHOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">GET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HTTPMETH</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   prefix = </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   suffix = </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   randStr = </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.prefix </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">or</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.suffix:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.prefix:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           prefix = conf.prefix</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.suffix:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           suffix = conf.suffix</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   while</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> randStr.count(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> or</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> randStr.count(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       randStr = randomStr(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">length</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">alphabet</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HEURISTIC_CHECK_ALPHABET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   kb.heuristicMode = </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   payload = </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%s%s%s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> %</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (prefix, randStr, suffix)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   payload = agent.payload(place, parameter, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">newValue</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">payload)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 利用payload 请求目标页面的响应内容。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   page, _, _ = Request.queryPage(payload, place, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">content</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">raise404</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">False</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   kb.heuristicPage = page</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kb.heuristicMode = </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">False</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">系统首先会判断，用户是否设置跳过启发式注入测试，如果设置了，则返回None。如果没有</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">设置，那么系统就会获取到用户设置的偏好prefix以及suffix，然后据此构造出合适的</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">payload，并发送给目标，获取到响应内容page。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 检测请求目标的响应中是否有数据库错误。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  parseFilePaths(page)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  result = wasLastResponseDBMSError()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  infoMsg = </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;heuristic (basic) test shows that </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">parameter &#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39; might &quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> %</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 检测page中是否有。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  def</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _(page):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> any</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(_ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (page </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">or</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> FORMAT_EXCEPTION_STRINGS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  casting = _(page) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">and</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> not</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _(kb.originalPage)</span></span></code></pre></div><p>系统会根据获取到的内容，判断其中的报错信息。其中，如果为数据库报错信息，那么</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>result的值为True。如果是设置在</span></span>
<span class="line"><span>sqlmap/lib/core/settings.py文件中FORMAT_EXCEPTION_SRTINGS配置项中定义的</span></span>
<span class="line"><span>类型转化错误信息，那么就会用casting来储存错误内容。</span></span>
<span class="line"><span>#     ...</span></span>
<span class="line"><span># 当存在定义的问题时，发出报错信息。</span></span>
<span class="line"><span>   if casting:</span></span>
<span class="line"><span>       errMsg = &quot;possible %s casting detected (e.g. &#39;&quot; % (&quot;integer&quot; if origValue</span></span>
<span class="line"><span>       platform = conf.url.split(&#39;.&#39;)[-1].lower()</span></span>
<span class="line"><span>       if platform == WEB_PLATFORM.ASP:</span></span>
<span class="line"><span>           errMsg += &quot;%s=CInt(request.querystring(\\&quot;%s\\&quot;))&quot; % (parameter, parame</span></span>
<span class="line"><span>       elif platform == WEB_PLATFORM.ASPX:</span></span>
<span class="line"><span>           errMsg += &quot;int.TryParse(Request.QueryString[\\&quot;%s\\&quot;], out %s)&quot; % (para</span></span>
<span class="line"><span>       elif platform == WEB_PLATFORM.JSP:</span></span>
<span class="line"><span>           errMsg += &quot;%s=Integer.parseInt(request.getParameter(\\&quot;%s\\&quot;))&quot; % (para</span></span>
<span class="line"><span>       else:</span></span>
<span class="line"><span>           errMsg += &quot;$%s=intval($_REQUEST[\\&quot;%s\\&quot;])&quot; % (parameter, parameter)</span></span>
<span class="line"><span>       errMsg += &quot;&#39;) at the back-end web application&quot;</span></span>
<span class="line"><span>       logger.error(errMsg)</span></span>
<span class="line"><span>       if kb.ignoreCasted is None:</span></span>
<span class="line"><span>           message = &quot;do you want to skip those kind of cases (and save scanning</span></span>
<span class="line"><span>           kb.ignoreCasted = readInput(message, default=&#39;Y&#39; if conf.multipleTarg</span></span>
<span class="line"><span># 当数据库报错时，判断出注入漏洞很可能存在。</span></span>
<span class="line"><span>   elif result:</span></span>
<span class="line"><span>       infoMsg += &quot;be injectable&quot;</span></span>
<span class="line"><span>       if Backend.getErrorParsedDBMSes():</span></span>
<span class="line"><span>           infoMsg += &quot; (possible DBMS: &#39;%s&#39;)&quot; % Format.getErrorParsedDBMSes()</span></span>
<span class="line"><span>       logger.info(infoMsg)</span></span>
<span class="line"><span># 否则判定为不存在注入漏洞。</span></span>
<span class="line"><span>   else:</span></span>
<span class="line"><span>       infoMsg += &quot;not be injectable&quot;</span></span>
<span class="line"><span>       logger.warn(infoMsg)</span></span>
<span class="line"><span>   kb.heuristicMode = True</span></span>
<span class="line"><span>   kb.disableHtmlDecoding = True</span></span>
<span class="line"><span>最后，函数会根据casting以及result中的内容进行输出。我在这里画了一个它的流程图，</span></span></code></pre></div><p>帮助你对它的作用进行理解。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Web%E6%BC%8F%E6%B4%9E%E6%8C%96%E6%8E%98%E5%AE%9E%E6%88%98/images/17/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Web%E6%BC%8F%E6%B4%9E%E6%8C%96%E6%8E%98%E5%AE%9E%E6%88%98/images/17/1.png" alt=""></a></p><p>图中启发式注入结果分为三种，其中阳性代表该参数大概率可以注入，类型转换和阴性都代表了该参数大概率不可以注入。我们会发现，想要判断是否可以注入，只需要判断有无数据库报错信息就可以了，有的话就认为该参数可注入，否则就认为不可注入。</p><p>除了进行启发式 SQL 注入检测之外，sqlmap 还会做一些不属于它的工作，包括进行简单的xss 检测和文件包含检测。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 更换payload，检测xss以及文件包含。</span></span>
<span class="line"><span>randStr1, randStr2 = randomStr(NON_SQLI_CHECK_PREFIX_SUFFIX_LENGTH), randomStr(NO</span></span>
<span class="line"><span>value = &quot;%s%s%s&quot; % (randStr1, DUMMY_NON_SQLI_CHECK_APPENDIX, randStr2)</span></span>
<span class="line"><span>payload = &quot;%s%s%s&quot; % (prefix, &quot;&#39;%s&quot; % value, suffix)</span></span>
<span class="line"><span>payload = agent.payload(place, parameter, newValue=payload)</span></span>
<span class="line"><span>page, _, _ = Request.queryPage(payload, place, content=True, raise404=False)</span></span>
<span class="line"><span>paramType = conf.method if conf.method not in (None, HTTPMETHOD.GET, HTTPMETHOD.P</span></span>
<span class="line"><span># 进行xss检测。</span></span>
<span class="line"><span>if value.upper() in (page or &quot;&quot;).upper():</span></span>
<span class="line"><span>   infoMsg = &quot;heuristic (XSS) test shows that %sparameter &#39;%s&#39; might be vulnerab</span></span>
<span class="line"><span>   logger.info(infoMsg)</span></span>
<span class="line"><span>   if conf.beep:</span></span>
<span class="line"><span>       beep()</span></span>
<span class="line"><span># 进行文件包含检测。</span></span>
<span class="line"><span>for match in re.finditer(FI_ERROR_REGEX, page or &quot;&quot;):</span></span>
<span class="line"><span>   if randStr1.lower() in match.group(0).lower():</span></span>
<span class="line"><span>       infoMsg = &quot;heuristic (FI) test shows that %sparameter &#39;%s&#39; might be vulne</span></span>
<span class="line"><span>       logger.info(infoMsg)</span></span>
<span class="line"><span>       if conf.beep:</span></span>
<span class="line"><span>           beep()</span></span>
<span class="line"><span>       break</span></span>
<span class="line"><span>kb.disableHtmlDecoding = False</span></span>
<span class="line"><span>kb.heuristicMode = False</span></span>
<span class="line"><span>return kb.heuristicTest</span></span>
<span class="line"><span>最终的检测结果都会在全局变量kb中保存起来，这个全局变量我们在之前的课程中学习过。</span></span></code></pre></div><p>到此，启发式注入检测的函数已经完成，接下来会进入真正的 SQL 注入检测，这是 sqlmap最核心的功能，没有之一！</p><h2 id="checksqlinjection-函数" tabindex="-1">checkSqlInjection 函数 <a class="header-anchor" href="#checksqlinjection-函数" aria-label="Permalink to &quot;checkSqlInjection 函数&quot;">​</a></h2><p>sqlmap 对启发式注入的检测结果进行简单地判断后，程序就会进入 sqlmap 最核心的函数checkSqlInjection 中。这个函数用于实现注入检测的核心功能，包括布尔注入、联合注入、报错注入、堆注入等检测。</p><p>下面让我们观察它的代码来理解这个注入检测功能。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> checkSqlInjection</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(place, parameter, value):</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 根据参数的类型选择 boundary 。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   injection </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> InjectionDict()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   threadData </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> getCurrentThreadData()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> isDigit(value):</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       kb.cache.intBoundaries </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kb.cache.intBoundaries </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">or</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sorted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(copy.deepcopy(c</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       boundaries</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kb.cache.intBoundaries</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   elif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> value.isalpha():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       kb.cache.alphaBoundaries </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kb.cache.alphaBoundaries </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">or</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sorted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(copy.deepco</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       boundaries</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kb.cache.alphaBoundaries</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       boundaries</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> conf.boundaries</span></span></code></pre></div><p>这个函数首先会判断参数的类型，然后根据参数的不同类型设置合适的闭合方式。解决完寻找注入点以及闭合参数这个问题后，下面让我们进入到 payload 的选择中。</p><p>我们知道，payload 的选择和数据库的类型有很大的关系，所以 sqlmap 在构造 payload 前，会先尝试探测目标数据库的类型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 判断是否配置数据库类型。</span></span>
<span class="line"><span>if conf.dbms is None:</span></span>
<span class="line"><span># 探测目标数据库类型。</span></span>
<span class="line"><span>   if not injection.dbms and PAYLOAD.TECHNIQUE.BOOLEAN in injection.data:</span></span>
<span class="line"><span>       if not Backend.getIdentifiedDbms() and kb.heuristicDbms is None and not k</span></span>
<span class="line"><span>           kb.heuristicDbms = heuristicCheckDbms(injection)</span></span>
<span class="line"><span># 根据探测结果输出提示信息。</span></span>
<span class="line"><span>   if kb.reduceTests is None and not conf.testFilter and (intersect(Backend.getE</span></span>
<span class="line"><span>       msg = &quot;it looks like the back-end DBMS is &#39;%s&#39;. &quot; % (Format.getErrorParse</span></span>
<span class="line"><span>       msg += &quot;Do you want to skip test payloads specific for other DBMSes? [Y/n</span></span>
<span class="line"><span>       kb.reduceTests = (Backend.getErrorParsedDBMSes() or [kb.heuristicDbms]) i</span></span></code></pre></div><p>如果用户在配置中指定了目标数据库的类型，那么就无需探测，用指定类型即可。否则需要用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>heuristicCheckDbms(injection)函数来判断目标数据库类型。它的判断方法是，发送</span></span></code></pre></div><p>一些 payload 给测试目标，然后根据获得的响应判断数据库的类型。</p><p>判断出目标数据库的类型之后，系统会根据获得的数据库类型以及用户的配置，挑选适合的测试用例，然后根据这些测试用例以及之前配置的 boundary，构造适合的 payload。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 配置联合查询的信息。</span></span>
<span class="line"><span>if stype == PAYLOAD.TECHNIQUE.UNION:</span></span>
<span class="line"><span>   configUnion(test.request.char)</span></span>
<span class="line"><span>   if &quot;[CHAR]&quot; in title:</span></span>
<span class="line"><span>       if conf.uChar is None:</span></span>
<span class="line"><span>           continue</span></span>
<span class="line"><span>       else:</span></span>
<span class="line"><span>           title = title.replace(&quot;[CHAR]&quot;, conf.uChar)</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span># 用户指定了测试方法的配置。</span></span>
<span class="line"><span>if conf.technique and isinstance(conf.technique, list) and stype not in conf.tech</span></span>
<span class="line"><span>   debugMsg = &quot;skipping test &#39;%s&#39; because user &quot; % title</span></span>
<span class="line"><span>   debugMsg += &quot;specified testing of only &quot;</span></span>
<span class="line"><span>   debugMsg += &quot;%s techniques&quot; % &quot; &amp; &quot;.join(PAYLOAD.SQLINJECTION[_] for _ in con</span></span>
<span class="line"><span>   logger.debug(debugMsg)</span></span>
<span class="line"><span>   continue</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span># 根据指定的数据库以及用户的配置信息，对payload进行筛选。</span></span>
<span class="line"><span>if conf.technique and isinstance(conf.technique, list) and stype not in conf.tech</span></span>
<span class="line"><span>   debugMsg = &quot;skipping test &#39;%s&#39; because user &quot; % title</span></span>
<span class="line"><span>   debugMsg += &quot;specified testing of only &quot;</span></span>
<span class="line"><span>   debugMsg += &quot;%s techniques&quot; % &quot; &amp; &quot;.join(PAYLOAD.SQLINJECTION[_] for _ in con</span></span>
<span class="line"><span>   logger.debug(debugMsg)</span></span>
<span class="line"><span>   continue</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span># 对payload去重。</span></span>
<span class="line"><span>if fstPayload:</span></span>
<span class="line"><span>   boundPayload = agent.prefixQuery(fstPayload, prefix, where, clause)</span></span>
<span class="line"><span>   boundPayload = agent.suffixQuery(boundPayload, comment, suffix, where)</span></span>
<span class="line"><span>   reqPayload = agent.payload(place, parameter, newValue=boundPayload, where=whe</span></span></code></pre></div><p>sqlmap 准备完 payload 之后，就到了你最期待的注入测试环节，这个过程和我们手动测试类似，系统会使用不同的注入测试方法，包括布尔注入、报错注入、时延注入以及联合注入。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 布尔注入</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> PAYLOAD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">METHOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">COMPARISON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> genCmpPayload</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       sndPayload </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> agent.cleanupPayload(test.response.comparison, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">origValue</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">val</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ...</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 报错注入</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">elif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> PAYLOAD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">METHOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">GREP</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   try</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       page, headers, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">_</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Request.queryPage(reqPayload, place, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">content</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, rai</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       output</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> extractRegexResult(check, page, re.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DOTALL</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> re.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">IGNORECASE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       output</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> output </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">or</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> extractRegexResult(check, threadData.lastHTTPError[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ...</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 时延注入</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">elif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> PAYLOAD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">METHOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">TIME</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   trueResult</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Request.queryPage(reqPayload, place, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timeBasedCompare</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, rais</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   trueCode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> threadData.lastCode</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ...</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 联合注入</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">elif</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> PAYLOAD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">METHOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">UNION</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   configUnion(test.request.char, test.request.columns)</span></span></code></pre></div><p>做完这些注入测试后，系统会收到响应。我们平时会通过观察响应来判断注入是否成功，但是系统要如何判断呢？聪明的你或许想到了，这就是之前我们学习的页面相似度，我们在学习sqlmap 判断 waf 时就用到了它。其实，根据注入方式的不同，sqlmap 对于注入结果的判断方式也是不同的。</p><p>在报错注入中，系统会通过对页面的响应结果进行正则匹配，判断响应中是否有报错信息，如果有就判断注入成功，否则判断注入失败。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 报错注入判断注入是否成功。</span></span>
<span class="line"><span>page, headers, _ = Request.queryPage(reqPayload, place, content=True, raise404=Fa</span></span>
<span class="line"><span>output = extractRegexResult(check, page, re.DOTALL | re.IGNORECASE)</span></span>
<span class="line"><span>output = output or extractRegexResult(check, threadData.lastHTTPError[2] if wasLa</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span>injectable = True</span></span></code></pre></div><p>在布尔注入中，系统会判断返回页面的相似度，如果结果为假，那么说明系统会根据错误结果进行不同的响应，这就意味着布尔注入是成功的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>falseResult = Request.queryPage(genCmpPayload(), place, raise404=False)</span></span>
<span class="line"><span>if not falseResult:</span></span>
<span class="line"><span>   # ...</span></span>
<span class="line"><span>   injectable = True</span></span>
<span class="line"><span>在时延注入中，sqlmap 会发送sleep([random])的请求，判断请求时间是否大于“平均时间</span></span></code></pre></div><p>+7* 标准差”，注意这里的标准差是一个时间阈值，如果大于就认为存在时延注入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if trueResult:</span></span>
<span class="line"><span>   if SLEEP_TIME_MARKER in reqPayload:</span></span>
<span class="line"><span>       falseResult = Request.queryPage(reqPayload.replace(SLEEP_TIME_MARKER, &quot;0&quot;</span></span>
<span class="line"><span>       if falseResult:</span></span>
<span class="line"><span>           continue</span></span>
<span class="line"><span># ...</span></span>
<span class="line"><span>       injectable = True</span></span></code></pre></div><p>在联合注入中，系统会通过 unionTest 函数来判断联合注入是否存在。它的实现原理比较复杂，我们可以将它简化一下，只需要比较联合注入得到的响应和原本内容是否一致，就可以做出判断，如果不一致，则说明存在联合注入问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>reqPayload, vector = unionTest(comment, place, parameter, value, prefix, suffix)</span></span>
<span class="line"><span>if isinstance(reqPayload, six.string_types):</span></span>
<span class="line"><span>   infoMsg = &quot;%sparameter &#39;%s&#39; is &#39;%s&#39; injectable&quot; % (&quot;%s &quot; % paramType if param</span></span>
<span class="line"><span>   logger.info(infoMsg)</span></span>
<span class="line"><span>   injectable = True</span></span></code></pre></div><p>最后系统将结果记录下来，并且输出给使用者，这就是我们在使用 sqlmap 时看到的结果信息。</p><p>至此，经过四讲的学习，我们终于学完了这款自动化注入测试神器，希望你可以了解 sqlmap的底层原理，从而更好的使用这款工具。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在这节课里，我们深入研究了 sqlmap 的真正 SQL 注入过程。为了你能更好的理解，我们主要通过观察它的源代码对它进行学习。</p><p>在这个过程中，我们首先学习了 sqlmap 对于注入点的检测，其中包括了动态参数的检测以及启发式注入测试。在实际注入测试的过程中，我们只会对通过检测的参数进行注入的探测。通过这个过程筛选参数，可以提高 sqlmap 的运行效率。</p><p>最后我们进入到最重要的一步中，即真正的注入测试，我们了解了它的测试过程。其中有payload 的配置、对目标数据库信息的探测、筛选合适的 payload 以及实际的注入测试过程。完成测试，系统会根据页面相似度来判断注入结果，而对于不同的注入方式，sqlmap 的判断方式也是不同的。我们将联合注入、报错注入、时延注入以及布尔注入的判断方法一一展开，对它们分别进行了介绍。</p><p>截止到目前，你已经完成了对 SQL 注入原理、攻击方式、防御方案以及自动化注入工具sqlmap 的学习，结合对 sqlmap 原理的学习，快去自己尝试一下自动化注入的威力吧！</p><h2 id="思考" tabindex="-1">思考 <a class="header-anchor" href="#思考" aria-label="Permalink to &quot;思考&quot;">​</a></h2><p>sqlmap 在实现中有什么值得改进的地方吗？</p><p>欢迎在评论区留下你的思考，我们下节课再见。</p>`,57)])])}const E=a(e,[["render",l]]);export{o as __pageData,E as default};
