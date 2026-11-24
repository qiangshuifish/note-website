# 16 | 自动化注入神器（三）：sqlmap的核心实现拆解

你好，我是王昊天。

在上节课，我们学习了 sqlmap 中一个非常重要的函数——start 函数。我们了解到，它既可以为每个目标配置请求参数，也会对目标进行一些必要的检测，例如判断目标是否存在 waf 的保护等。

在讲到如何检测 waf 时，我们遇到了一个比较陌生的概念，页面相似度。上节课，我给出了一个简单的示例，来帮助你理解它的含义，但是并没有告诉你，页面相似度是如何计算出来的。相信经过这节课的学习，你就可以解决这个问题。

## 再看 checkWaf 函数

为了研究页面相似度算法，我们首先需要找到计算页面相似度的代码。回顾一下上节课的内容，我们在 checkwaf 函数中学习了页面相似度的概念，但是并未深入研究这一点。现在让我们回到 sqlmap 的 checkWaf 函数，着重观察下面这段代码。在这段代码中，系统会判断Request.queryPage 函数的返回值是否小于 sqlmap 设定的默认页面相似度阈值（IPS_WAF_CHECK_RATIO），如果小于，那么就认为存在 waf，否则就会认为不存在 waf。

```
我们可以从lib.core.settings.py中得出该阈值的大小为 0.5。
try:
   retVal = (Request.queryPage(place=place, value=value, getRatioValue=True, not
```

经过上述分析，我们可以知道，函数 Request.queryPage 的返回值就是页面相似度。所以我们只需要对它进行分析，就可以知道页面相似度的算法了。在进入到该函数之前，我们首先需要关注，传入该函数的参数。理解这些参数，会帮助你理解 sqlmap 页面相似度算法的实际运算过程。

```
#传入到该函数的参数
place=place
value=value
getRatioValue=True
noteResponseTime=False
silent=True
raise404=False
disableTampering=True
```

### Request.queryPage 函数

列举完传入到 Request.queryPage 函数的参数后，我们可以专心地进入到函数内部进行分析。

```python
def queryPage(value=None, place=None, content=False, getRatioValue=False, silent=
# ...
# 对参数进行定义
   get = None
   post = None
   cookie = None
   ua = None
   referer = None
   host = None
   page = None
   pageLength = None
   uri = None
   code = None
# ...
     payload = agent.extractPayload(value)
# 请求参数的配置。
   if PLACE.GET in conf.parameters:
       get = conf.parameters[PLACE.GET] if place != PLACE.GET or not value else
# ...
# 用配置好的请求参数获取页面信息。
           page, headers, code = Connect.getPage(url=conf.csrfUrl or conf.url, d
# ...
# 由于传入的参数中getRatioValue为真，进入到if条件中，它会返回两个comparsion的结果，所以返回的
   if getRatioValue:
       return comparison(page, headers, code, getRatioValue=False, pageLength=pa
   else:
return comparison(page, headers, code, getRatioValue, pageLength
```

这里我将 queryPage 中，关键部分的代码展示出来，你可以结合代码中的注释学习和理解。该函数首先会定义需要的参数，然后用定义好的参数来配置请求信息。

```
配置好请求信息之后，我们就可以用Connect.getPage函数获得目标页面的内容。这样我们
```

就获得了在计算页面相似度中需要的第一个参数，即用易于引起 waf 拦截的 payload 获取到的页面响应内容。

```
由于传入的参数getRatioValue的值为True，所以接下来，函数会进入到if条件中运行，
```

我们看到，系统会返回两个 comparison 的运行结果，所以这里 queryPage 的返回的是一个元

```
组类型，即(comparison1,comparison2)。
通过公式retVal=request.querypage()[1] or 0 < IPS_WAF_CHECK_RATIO，我们
知道这里 retVal 的值就等于comparison2 or 0 < 0.5。你需要特别注意这里的
comparison2 or 0，这是因为 comparison 函数有可能会返回 None，这时候就会将 0 作
```

为 retVal 的值。

### Comparison 函数

从 retVal 的结果可以发现，comparison2 的数值很重要，下面让我们重点观察

```python
comparison2，它的值为comparison(page, headers, code,
getRatioValue=True, pageLength=pageLength)，那么接下来我们进入到
comparison函数中。
def comparison(page, headers, code=None, getRatioValue=False, pageLength=None):
   _ = _adjust(_comparison(page, headers, code, getRatioValue, pageLength), getR
   return _
可以看到，该函数将_comparison函数的运行结果作为_adjust函数的参数，然后返回
_adjust函数的运行结果_。
那么下面我们先进入到_comparison函数中，看看它在不同情况下的返回值是什么。
def _comparison(page, headers, code, getRatioValue, pageLength):
# ...
# 当 page 和 pagelength 信息都没有时，返回None。
   if page is None and pageLength is None:
       return None
# ...
# 如果使用者利用了-string/-not-string/-regexp等参数配置了特征文本，那么程序就会使用用户指定
   if any((conf.string, conf.notString, conf.regexp)):
       rawResponse = "%s%s" % (listToStrValue(_ for _ in headers.headers if not
       if conf.string:
           return conf.string in rawResponse
       if conf.notString:
           if conf.notString in rawResponse:
               return False
# ...
       if conf.regexp:
           return re.search(conf.regexp, rawResponse, re.I | re.M) is not None
# 如果使用者配置了code信息，那么就会判断设置的code是否和返回的code一致，若一致就返回1，否则返回
   if conf.code:
       return conf.code == code
```

从上面的代码中，我们可以知道，如果使用者配置了响应的参数，那么 _comparison 函数就会将该参数和获取到的实际响应内容进行比较，直接返回比较的结果。

当用户没有配置响应参数时，sqlmap 就会创建一个比较函数，与页面响应进行比较，计算出页面相似比。你可能会觉得 seqMatcher 有些眼熟，事实上它就是我们的老熟人，

```
difflib.SequenceMatcher()这个函数在介绍 sqlmap 时有提到。
   seqMatcher = threadData.seqMatcher
# 将之前测试目标的连通性时获取到的标准响应内容放入到比较函数中，这样只需要再把使用payload之后获取
   seqMatcher.set_seq1(kb.pageTemplate)
# 当响应为系统的报错信息后，这样比较页面相似度就没有意义，所以返回None。
   if page:
       if kb.errorIsNone and (wasLastResponseDBMSError() or wasLastResponseHTTPE
           if not (wasLastResponseHTTPError() and getLastRequestHTTPError() in (
               return None
# 当配置中没有设置空连接时，需要删除页面中的动态内容，否则会影响页面相似度的计算。
       if not kb.nullConnection:
           page = removeDynamicContent(page)
  seqMatcher.set_seq1(removeDynamicContent(kb.pageTemplate))
       if not pageLength:
           pageLength = len(page)
# 当配置中设置空连接后，系统就不会获得页面的响应内容，而仅仅获得响应的长度，这时候就需要根据响应长
   if kb.nullConnection and pageLength:
       if not seqMatcher.a:
           errMsg = "problem occurred while retrieving original page content "
           errMsg += "which prevents sqlmap from continuation. Please rerun, "
           errMsg += "and if the problem persists turn off any optimization swit
           raise SqlmapNoneDataException(errMsg)
# 此处的seqMatcher.a，就是之前放入到比较函数中的标准页面响应。
       ratio = 1. * pageLength / len(seqMatcher.a)
       if ratio > 1.:
           ratio = 1. / ratio
# 当不配置空链接时，就需要对响应的内容进行比较，需要考虑响应页面的格式不一样（pdf/html），为了防
   else:
       if isinstance(seqMatcher.a, six.binary_type) and isinstance(page, six.tex
           page = getBytes(page, kb.pageEncoding or DEFAULT_PAGE_ENCODING, "igno
       elif isinstance(seqMatcher.a, six.text_type) and isinstance(page, six.bin
           seqMatcher.a = getBytes(seqMatcher.a, kb.pageEncoding or DEFAULT_PAGE
# 转化之后，当使用payload获取到的响应和标准响应有一个不存在，就无法比较页面相似度，返回None。
       if any(_ is None for _ in (page, seqMatcher.a)):
           return None
# 当它们都存在且相等时，内容完全一致，页面相似度为1。
       elif seqMatcher.a and page and seqMatcher.a == page:
           ratio = 1.
# 当无法根据页面内容来计算页面相似度时，会选择用其他方法计算页面相似度。
       elif kb.skipSeqMatcher or seqMatcher.a and page and any(len(_) > MAX_DIFF
           if not page or not seqMatcher.a:
               return float(seqMatcher.a == page)
           else:
               ratio = 1. * len(seqMatcher.a) / len(page)
               if ratio > 1:
                   ratio = 1. / ratio
       else:
           seq1, seq2 = None, None
# 当配置中设置根据页面的标题比较时，会进入到下面的语句中。
           if conf.titles:
               seq1 = extractRegexResult(HTML_TITLE_REGEX, seqMatcher.a)
               seq2 = extractRegexResult(HTML_TITLE_REGEX, page)
           else:
# 当配置中设置有仅比较文本内容时，就会利用`getFilteredPageContent`来提取其中的文本信息。
               seq1 = getFilteredPageContent(seqMatcher.a, True) if conf.textOnl
               seq2 = getFilteredPageContent(page, True) if conf.textOnly else p
# 当在上述操作中获得的seq1或者seq2的值为None时，就无法判断页面相似度，返回 None。
           if seq1 is None or seq2 is None:
               return None
```

在不同的情况下，seqMatcher 的结果有不同的计算方式，我们可以结合代码中的注释进行深入的了解。

当我们需要比较两个页面中的内容，来计算页面相似度时，我们需要删除页面中的

```
REFLECTED_VALUE_MARKER，防止它干扰计算。想要知道REFLECTED_VALUE_MARKER是
```

什么，我们需要回顾下之前获取页面响应内容的参数配置。

在一些情况下，比如，当页面将输入的参数显示在页面上时，payload 会回显在页面上。这些payload 显然会影响我们计算页面相似度。那么 sqlmap 是如何解决这个问题的呢？

```
在之前 queryPage 的函数中，参数removeReflection的值被设置为True，所以 sqlmap
在获取页面的时候，会将 payload 的值替换为REFLECTED_VALUE_MARKER的值。下面这段
代码，会去除页面内容中的REFLECTED_VALUE_MARKER，防止它的存在影响页面相似度的
```

判断。

```
           seq1 = seq1.replace(REFLECTED_VALUE_MARKER, "")
           seq2 = seq2.replace(REFLECTED_VALUE_MARKER, "")
# ...
# 将它们计算出一个哈希元组，并在缓存中查找是否存在这个元组，如果存在则无需再次计算，否则需要计算出
           else:
               key = (hash(seq1), hash(seq2))
           seqMatcher.set_seq1(seq1)
           seqMatcher.set_seq2(seq2)
           if key in kb.cache.comparison:
               ratio = kb.cache.comparison[key]
           else:
               ratio = round(seqMatcher.quick_ratio() if not kb.heavilyDynamic e
           if key:
               kb.cache.comparison[key] = ratio
# ...
# 最后会返回页面相似度的值。
   if getRatioValue:
       return ratio
这样我们就获得了_comparison函数的返回值，也就是传入到 adjust 函数中的参数的值。
```

下面让我们一起进入到 adjust 函数内，对获取到的页面相似度做一些处理，获取最终的页面相似度的值。我们可以将它简单理解为，如果 sqlmap 携带了攻击的载荷，但是响应内容和没有攻击载荷的 sqlmap 是相同的，就可以判定出目标应用不存在 waf。

```python
def _adjust(condition, getRatioValue):
   if not any((conf.string, conf.notString, conf.regexp, conf.code)):
       retVal = not condition if kb.negativeLogic and condition is not None and
   else:
       retVal = condition if not getRatioValue else (MAX_RATIO if condition else
   return retVal
```

这样 checkwaf 函数就执行完成了，让我们再次回到 start 函数内部，继续学习它的运行流程。我们可以发现，检测完 waf 之后，系统会判断是否配置了空连接。

如果配置了空连接，在与标准响应进行比较的环节，就不再需要获得完整的页面响应内容，仅仅需要获得页面响应内容的长度，将它的长度和标准响应页面的长度进行比较，就能获得页面相似度。

那么在判断页面相似度的时候，就不需要获得完整的页面的响应内容和标准响应进行比较，而仅仅需要获得页面响应内容的长度，将它的长度和标准响应页面的长度进行比较即可获得页面相似度。

```
if conf.nullConnection:
   checkNullConnection()
```

做完上述工作后，sqlmap 就进入到了下一个阶段，即注入点检测阶段。这部分的内容我们会在下一节课中学习。

## 总结

这节课，我们详细学习了 sqlmap 中的页面相似度算法。

我们首先回顾了之前学过的 checkwaf 函数，通过对这个函数进行分析，我们找到了计算页面相似度的函数 Request.querypage。

为了更好地理解它，我们进入到函数内部进行观察。经过对它代码的分析，我们知道，它首先对测试目标做了请求的参数的配置，然后给目标发送请求信息，在获取到页面的内容之后，将内容传递给 comparison 函数进行比较。

根据用户配置的不同情况，comparison 函数会采用不同的页面相似度算法来进行计算。值得一提的是，该函数会在比较两个页面的内容时，删掉其中的 payload 内容，避免存在影响计算结果的因素。

截止目前，你已经掌握了 sqlmap 对 waf 检测的方法原理，下节课我们将学习，如何对目标进行自动化的多种 SQL 注入攻击。

## 思考

sqlmap 的页面相似度算法有什么值得改进的地方吗？

欢迎在评论区留下你的思考，我们下节课再见。
