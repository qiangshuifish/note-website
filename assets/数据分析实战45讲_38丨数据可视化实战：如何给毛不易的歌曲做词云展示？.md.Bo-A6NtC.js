import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"38丨数据可视化实战：如何给毛不易的歌曲做词云展示？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何制作词云","slug":"如何制作词云","link":"#如何制作词云","children":[]},{"level":2,"title":"给毛不易的歌词制作词云","slug":"给毛不易的歌词制作词云","link":"#给毛不易的歌词制作词云","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"数据分析实战45讲/38丨数据可视化实战：如何给毛不易的歌曲做词云展示？.md","filePath":"数据分析实战45讲/38丨数据可视化实战：如何给毛不易的歌曲做词云展示？.md","lastUpdated":1779820717000}'),l={name:"数据分析实战45讲/38丨数据可视化实战：如何给毛不易的歌曲做词云展示？.md"};function t(i,s,o,c,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_38丨数据可视化实战-如何给毛不易的歌曲做词云展示" tabindex="-1">38丨数据可视化实战：如何给毛不易的歌曲做词云展示？ <a class="header-anchor" href="#_38丨数据可视化实战-如何给毛不易的歌曲做词云展示" aria-label="Permalink to &quot;38丨数据可视化实战：如何给毛不易的歌曲做词云展示？&quot;">​</a></h1><p>今天我们做一个数据可视化的项目。</p><p>我们经常需要对分析的数据提取常用词，做词云展示。比如一些互联网公司会抓取用户的画像，或者每日讨论话题的关键词，形成词云并进行展示。再或者，假如你喜欢某个歌手，想了解这个歌手创作的歌曲中经常用到哪些词语，词云就是个很好的工具。最后，只需要将词云生成一张图片就可以直观地看到结果。</p><p>那么在今天的实战项目里，有3个目标需要掌握：</p><ol><li><p>掌握词云分析工具，并进行可视化呈现；</p></li><li><p>掌握Python爬虫，对网页的数据进行爬取；</p></li><li><p>掌握XPath工具，分析提取想要的元素 。</p></li></ol><h2 id="如何制作词云" tabindex="-1">如何制作词云 <a class="header-anchor" href="#如何制作词云" aria-label="Permalink to &quot;如何制作词云&quot;">​</a></h2><p>首先我们需要了解什么是词云。词云也叫文字云，它帮助我们统计文本中高频出现的词，过滤掉某些常用词（比如“作曲”“作词”），将文本中的重要关键词进行可视化，方便分析者更好更快地了解文本的重点，同时还具有一定的美观度。</p><p>Python提供了词云工具WordCloud，使用pip install wordcloud安装后，就可以创建一个词云，构造方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wc = WordCloud(</span></span>
<span class="line"><span>    background_color=&#39;white&#39;,# 设置背景颜色</span></span>
<span class="line"><span>    mask=backgroud_Image,# 设置背景图片</span></span>
<span class="line"><span>    font_path=&#39;./SimHei.ttf&#39;,  # 设置字体，针对中文的情况需要设置中文字体，否则显示乱码</span></span>
<span class="line"><span>    max_words=100, # 设置最大的字数</span></span>
<span class="line"><span>    stopwords=STOPWORDS,# 设置停用词</span></span>
<span class="line"><span>	max_font_size=150,# 设置字体最大值</span></span>
<span class="line"><span>	width=2000,# 设置画布的宽度</span></span>
<span class="line"><span>	height=1200,# 设置画布的高度</span></span>
<span class="line"><span>    random_state=30# 设置多少种随机状态，即多少种颜色</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>实际上WordCloud还有更多的构造参数，代码里展示的是一些主要参数，我在代码中都有注释，你可以自己看下。</p><p>创建好WordCloud类之后，就可以使用wordcloud=generate(text)方法生成词云，传入的参数text代表你要分析的文本，最后使用wordcloud.tofile(“a.jpg”)函数，将得到的词云图像直接保存为图片格式文件。</p><p>你也可以使用Python的可视化工具Matplotlib进行显示，方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import matplotlib.pyplot as plt</span></span>
<span class="line"><span>plt.imshow(wordcloud)</span></span>
<span class="line"><span>plt.axis(&quot;off&quot;)</span></span>
<span class="line"><span>plt.show()</span></span></code></pre></div><p>需要注意的是，我们不需要显示X轴和Y轴的坐标，使用plt.axis(“off”)可以将坐标轴关闭。</p><p>了解了如何使用词云工具WordCloud之后，我们将专栏前15节的标题进行词云可视化，具体的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#-*- coding:utf-8 -*-</span></span>
<span class="line"><span>from wordcloud import WordCloud</span></span>
<span class="line"><span>import matplotlib.pyplot as plt</span></span>
<span class="line"><span>import jieba</span></span>
<span class="line"><span>from PIL import Image</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span># 生成词云</span></span>
<span class="line"><span>def create_word_cloud(f):</span></span>
<span class="line"><span>     print(&#39;根据词频计算词云&#39;)</span></span>
<span class="line"><span>     text = &quot; &quot;.join(jieba.cut(f,cut_all=False, HMM=True))</span></span>
<span class="line"><span>     wc = WordCloud(</span></span>
<span class="line"><span>           font_path=&quot;./SimHei.ttf&quot;,</span></span>
<span class="line"><span>           max_words=100,</span></span>
<span class="line"><span>           width=2000,</span></span>
<span class="line"><span>           height=1200,</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>     wordcloud = wc.generate(text)</span></span>
<span class="line"><span>     # 写词云图片</span></span>
<span class="line"><span>     wordcloud.to_file(&quot;wordcloud.jpg&quot;)</span></span>
<span class="line"><span>     # 显示词云文件</span></span>
<span class="line"><span>     plt.imshow(wordcloud)</span></span>
<span class="line"><span>     plt.axis(&quot;off&quot;)</span></span>
<span class="line"><span>     plt.show()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>f = &#39;数据分析全景图及修炼指南\\</span></span>
<span class="line"><span>学习数据挖掘的最佳学习路径是什么？\\</span></span>
<span class="line"><span>Python基础语法：开始你的Python之旅\\</span></span>
<span class="line"><span>Python科学计算：NumPy\\</span></span>
<span class="line"><span>Python科学计算：Pandas\\</span></span>
<span class="line"><span>学习数据分析要掌握哪些基本概念？\\</span></span>
<span class="line"><span>用户画像：标签化就是数据的抽象能力\\</span></span>
<span class="line"><span>数据采集：如何自动化采集数据？\\</span></span>
<span class="line"><span>数据采集：如何用八爪鱼采集微博上的“D&amp;G”评论？\\</span></span>
<span class="line"><span>Python爬虫：如何自动化下载王祖贤海报？\\</span></span>
<span class="line"><span>数据清洗：数据科学家80%时间都花费在了这里？\\</span></span>
<span class="line"><span>数据集成：这些大号一共20亿粉丝？\\</span></span>
<span class="line"><span>数据变换：大学成绩要求正态分布合理么？\\</span></span>
<span class="line"><span>数据可视化：掌握数据领域的万金油技能\\</span></span>
<span class="line"><span>一次学会Python数据可视化的10种技能&#39;</span></span></code></pre></div><p>运行结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/49b2c6a27345777922db4b6e31110434.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/49b2c6a27345777922db4b6e31110434.png" alt=""></a></p><p>你能从结果中看出，还是有一些常用词显示出来了，比如“什么”“要求”“这些”等，我们可以把这些词设置为停用词，编写remove_stop_words函数，从文本中去掉：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 去掉停用词</span></span>
<span class="line"><span>def remove_stop_words(f):</span></span>
<span class="line"><span>     stop_words = [&#39;学会&#39;, &#39;就是&#39;, &#39;什么&#39;]</span></span>
<span class="line"><span>     for stop_word in stop_words:</span></span>
<span class="line"><span>           f = f.replace(stop_word, &#39;&#39;)</span></span>
<span class="line"><span>     return f</span></span></code></pre></div><p>然后在结算词云前调用f = remove_stop_words(f)方法，最后运行可以得到如下的结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/d0bd9cde1e1c0638976cef26b519fded.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/d0bd9cde1e1c0638976cef26b519fded.png" alt=""></a></p><p>你能看出，去掉停用词之后的词云更加清晰，更能体现前15章的主要内容。</p><h2 id="给毛不易的歌词制作词云" tabindex="-1">给毛不易的歌词制作词云 <a class="header-anchor" href="#给毛不易的歌词制作词云" aria-label="Permalink to &quot;给毛不易的歌词制作词云&quot;">​</a></h2><p>假设我们现在要给毛不易的歌词做个词云，那么需要怎么做呢？我们先把整个项目的流程梳理下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/7cff33b392cec653ca2e68fbecd4ef97.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/7cff33b392cec653ca2e68fbecd4ef97.jpg" alt=""></a></p><ol><li><p>在准备阶段：我们主要使用Python爬虫获取HTML，用XPath对歌曲的ID、名称进行解析，然后通过网易云音乐的API接口获取每首歌的歌词，最后将所有的歌词合并得到一个变量。</p></li><li><p>在词云分析阶段，我们需要创建WordCloud词云类，分析得到的歌词文本，最后可视化。</p></li></ol><p>基于上面的流程，编写代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding:utf-8 -*-</span></span>
<span class="line"><span># 网易云音乐 通过歌手ID，生成该歌手的词云</span></span>
<span class="line"><span>import requests</span></span>
<span class="line"><span>import sys</span></span>
<span class="line"><span>import re</span></span>
<span class="line"><span>import os</span></span>
<span class="line"><span>from wordcloud import WordCloud</span></span>
<span class="line"><span>import matplotlib.pyplot as plt</span></span>
<span class="line"><span>import jieba</span></span>
<span class="line"><span>from PIL import Image</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>from lxml import etree</span></span>
<span class="line"><span></span></span>
<span class="line"><span>headers = {</span></span>
<span class="line"><span>       &#39;Referer&#39;  :&#39;http://music.163.com&#39;,</span></span>
<span class="line"><span>       &#39;Host&#39;     :&#39;music.163.com&#39;,</span></span>
<span class="line"><span>       &#39;Accept&#39;   :&#39;text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8&#39;,</span></span>
<span class="line"><span>       &#39;User-Agent&#39;:&#39;Chrome/10&#39;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 得到某一首歌的歌词</span></span>
<span class="line"><span>def get_song_lyric(headers,lyric_url):</span></span>
<span class="line"><span>    res = requests.request(&#39;GET&#39;, lyric_url, headers=headers)</span></span>
<span class="line"><span>    if &#39;lrc&#39; in res.json():</span></span>
<span class="line"><span>       lyric = res.json()[&#39;lrc&#39;][&#39;lyric&#39;]</span></span>
<span class="line"><span>       new_lyric = re.sub(r&#39;[\\d:.[\\]]&#39;,&#39;&#39;,lyric)</span></span>
<span class="line"><span>       return new_lyric</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>       return &#39;&#39;</span></span>
<span class="line"><span>       print(res.json())</span></span>
<span class="line"><span># 去掉停用词</span></span>
<span class="line"><span>def remove_stop_words(f):</span></span>
<span class="line"><span>    stop_words = [&#39;作词&#39;, &#39;作曲&#39;, &#39;编曲&#39;, &#39;Arranger&#39;, &#39;录音&#39;, &#39;混音&#39;, &#39;人声&#39;, &#39;Vocal&#39;, &#39;弦乐&#39;, &#39;Keyboard&#39;, &#39;键盘&#39;, &#39;编辑&#39;, &#39;助理&#39;, &#39;Assistants&#39;, &#39;Mixing&#39;, &#39;Editing&#39;, &#39;Recording&#39;, &#39;音乐&#39;, &#39;制作&#39;, &#39;Producer&#39;, &#39;发行&#39;, &#39;produced&#39;, &#39;and&#39;, &#39;distributed&#39;]</span></span>
<span class="line"><span>    for stop_word in stop_words:</span></span>
<span class="line"><span>       f = f.replace(stop_word, &#39;&#39;)</span></span>
<span class="line"><span>    return f</span></span>
<span class="line"><span># 生成词云</span></span>
<span class="line"><span>def create_word_cloud(f):</span></span>
<span class="line"><span>    print(&#39;根据词频，开始生成词云!&#39;)</span></span>
<span class="line"><span>    f = remove_stop_words(f)</span></span>
<span class="line"><span>    cut_text = &quot; &quot;.join(jieba.cut(f,cut_all=False, HMM=True))</span></span>
<span class="line"><span>    wc = WordCloud(</span></span>
<span class="line"><span>       font_path=&quot;./wc.ttf&quot;,</span></span>
<span class="line"><span>       max_words=100,</span></span>
<span class="line"><span>       width=2000,</span></span>
<span class="line"><span>       height=1200,</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    print(cut_text)</span></span>
<span class="line"><span>    wordcloud = wc.generate(cut_text)</span></span>
<span class="line"><span>    # 写词云图片</span></span>
<span class="line"><span>    wordcloud.to_file(&quot;wordcloud.jpg&quot;)</span></span>
<span class="line"><span>    # 显示词云文件</span></span>
<span class="line"><span>    plt.imshow(wordcloud)</span></span>
<span class="line"><span>    plt.axis(&quot;off&quot;)</span></span>
<span class="line"><span>    plt.show()</span></span>
<span class="line"><span># 得到指定歌手页面 热门前50的歌曲ID，歌曲名</span></span>
<span class="line"><span>def get_songs(artist_id):</span></span>
<span class="line"><span>    page_url = &#39;https://music.163.com/artist?id=&#39; + artist_id</span></span>
<span class="line"><span>    # 获取网页HTML</span></span>
<span class="line"><span>    res = requests.request(&#39;GET&#39;, page_url, headers=headers)</span></span>
<span class="line"><span>    # 用XPath解析 前50首热门歌曲</span></span>
<span class="line"><span>    html = etree.HTML(res.text)</span></span>
<span class="line"><span>    href_xpath = &quot;//*[@id=&#39;hotsong-list&#39;]//a/@href&quot;</span></span>
<span class="line"><span>    name_xpath = &quot;//*[@id=&#39;hotsong-list&#39;]//a/text()&quot;</span></span>
<span class="line"><span>    hrefs = html.xpath(href_xpath)</span></span>
<span class="line"><span>    names = html.xpath(name_xpath)</span></span>
<span class="line"><span>    # 设置热门歌曲的ID，歌曲名称</span></span>
<span class="line"><span>    song_ids = []</span></span>
<span class="line"><span>    song_names = []</span></span>
<span class="line"><span>    for href, name in zip(hrefs, names):</span></span>
<span class="line"><span>       song_ids.append(href[9:])</span></span>
<span class="line"><span>       song_names.append(name)</span></span>
<span class="line"><span>       print(href, &#39;  &#39;, name)</span></span>
<span class="line"><span>    return song_ids, song_names</span></span>
<span class="line"><span># 设置歌手ID，毛不易为12138269</span></span>
<span class="line"><span>artist_id = &#39;12138269&#39;</span></span>
<span class="line"><span>[song_ids, song_names] = get_songs(artist_id)</span></span>
<span class="line"><span># 所有歌词</span></span>
<span class="line"><span>all_word = &#39;&#39;</span></span>
<span class="line"><span># 获取每首歌歌词</span></span>
<span class="line"><span>for (song_id, song_name) in zip(song_ids, song_names):</span></span>
<span class="line"><span>    # 歌词API URL</span></span>
<span class="line"><span>    lyric_url = &#39;http://music.163.com/api/song/lyric?os=pc&amp;id=&#39; + song_id + &#39;&amp;lv=-1&amp;kv=-1&amp;tv=-1&#39;</span></span>
<span class="line"><span>    lyric = get_song_lyric(headers, lyric_url)</span></span>
<span class="line"><span>    all_word = all_word + &#39; &#39; + lyric</span></span>
<span class="line"><span>    print(song_name)</span></span>
<span class="line"><span>#根据词频 生成词云</span></span>
<span class="line"><span>create_word_cloud(all_word)</span></span></code></pre></div><p>运行结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/ee24610141c2722660f2e4cb5824802c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/ee24610141c2722660f2e4cb5824802c.png" alt=""></a></p><p>这个过程里有一些模块，我需要说明下。</p><p>首先我编写get_songs函数，可以得到指定歌手页面中热门前50的歌曲ID，歌曲名。在这个函数里，我使用requests.request函数获取毛不易歌手页面的HTML。这里需要传入指定的请求头（headers），否则获取不到完整的信息。然后用XPath解析并获取指定的内容，这个模块中，我想获取的是歌曲的链接和名称。</p><p>其中歌曲的链接类似 /song?id=536099160 这种形式，你能看到字符串第9位之后，就是歌曲的ID。</p><p>有关XPath解析的内容，我在 <a href="https://time.geekbang.org/column/article/76001" target="_blank" rel="noreferrer">第10节</a> 讲到过，如果你忘记了，可以看一下。一般来说，XPath解析 99%的可能都是以//开头，因为你需要获取所有符合这个XPath的内容。我们通过分析HTML代码，能看到一个关键的部分：id=‘hotsong-list’。这个代表热门歌曲列表，也正是我们想要解析的内容。我们想要获取这个热门歌曲列表下面所有的链接，XPath解析就可以写成//*[@id=‘hotsong-list’]//a。然后你能看到歌曲链接是href属性，歌曲名称是这个链接的文本。</p><p>获得歌曲ID之后，我们还需要知道这个歌曲的歌词，对应代码中的get_song_lyric函数，在这个函数里调用了网易云的歌词API接口，比如 <a href="http://music.163.com/api/song/lyric?os=pc&amp;id=536099160&amp;lv=-1&amp;kv=-1&amp;tv=-1" target="_blank" rel="noreferrer">http://music.163.com/api/song/lyric?os=pc&amp;id=536099160&amp;lv=-1&amp;kv=-1&amp;tv=-1</a>。</p><p>你能看到歌词文件里面还保存了时间信息，我们需要去掉这部分。因此我使用了re.sub函数，通过正则表达式匹配，将[]中数字信息去掉，方法为re.sub(r’[\\d:.[]]’,’’,lyric)。</p><p>最后我们还需要设置一些歌词中常用的停用词，比如“作词”“作曲”“编曲”等，编写remove_stop_words函数，将歌词文本中的停用词去掉。</p><p>最后编写create_word_cloud函数，通过歌词文本生成词云文件。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我给你讲了词云的可视化。在这个实战中，你能看到前期的数据准备在整个过程中占了很大一部分。如果你用Python作为数据采集工具，就需要掌握Python爬虫和XPath解析，掌握这两个工具最好的方式就是多做练习。</p><p>我们今天讲到了词云工具WordCloud，它是一个很好用的Python工具，可以将复杂的文本通过词云图的方式呈现。需要注意的是，当我们需要使用中文字体的时候，比如黑体SimHei，就可以将WordCloud中的font_path属性设置为SimHei.ttf，你也可以设置其他艺术字体，在给毛不易的歌词做词云展示的时候，我们就用到了艺术字体。</p><p>你可以从GitHub上下载字体和代码： <a href="https://github.com/cystanford/word_cloud" target="_blank" rel="noreferrer">https://github.com/cystanford/word_cloud</a>。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/0cbc5f3e4ecd41af9a872fd9b4aed06d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/85158/0cbc5f3e4ecd41af9a872fd9b4aed06d.png" alt=""></a></p><p>最后给你留一道思考题吧。我抓取了毛不易主页的歌词，是以歌手主页为粒度进行的词云可视化。实际上网易云音乐也有歌单的API，比如 <a href="http://music.163.com/api/playlist/detail?id=753776811" target="_blank" rel="noreferrer">http://music.163.com/api/playlist/detail?id=753776811</a>。你能不能编写代码对歌单做个词云展示（比如歌单ID为753776811）呢？</p><p>欢迎你在评论区与我分享你的答案，也欢迎点击“请朋友读”，把这篇文章分享给你的朋友或者同事。</p>`,46)])])}const m=n(l,[["render",t]]);export{u as __pageData,m as default};
