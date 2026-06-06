import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"39 | Django：搭建监控平台","description":"","frontmatter":{},"headers":[{"level":2,"title":"Django 简介和安装","slug":"django-简介和安装","link":"#django-简介和安装","children":[]},{"level":2,"title":"MVC 架构","slug":"mvc-架构","link":"#mvc-架构","children":[{"level":3,"title":"设计模型 Model","slug":"设计模型-model","link":"#设计模型-model","children":[]},{"level":3,"title":"设计视图 Views","slug":"设计视图-views","link":"#设计视图-views","children":[]},{"level":3,"title":"设计模板Templates","slug":"设计模板templates","link":"#设计模板templates","children":[]},{"level":3,"title":"设计链接 Urls","slug":"设计链接-urls","link":"#设计链接-urls","children":[]},{"level":3,"title":"测试","slug":"测试","link":"#测试","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/39-Django：搭建监控平台.md","filePath":"Python核心技术与实战/39-Django：搭建监控平台.md","lastUpdated":1779816143000}'),t={name:"Python核心技术与实战/39-Django：搭建监控平台.md"};function i(l,s,o,c,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_39-django-搭建监控平台" tabindex="-1">39 | Django：搭建监控平台 <a class="header-anchor" href="#_39-django-搭建监控平台" aria-label="Permalink to &quot;39 | Django：搭建监控平台&quot;">​</a></h1><p>你好，我是景霄。</p><p>通过前几节课的学习，相信你对量化交易系统已经有了一个最基本的认知，也能通过自己的代码，搭建一个简单的量化交易系统来进行盈利。</p><p>前面几节课，我们的重点在后台代码、中间件、分布式系统和设计模式上。这节课，我们重点来看前端交互。</p><p>监控和运维，是互联网工业链上非常重要的一环。监控的目的就是防患于未然。通过监控，我们能够及时了解到企业网络的运行状态。一旦出现安全隐患，你就可以及时预警，或者是以其他方式通知运维人员，让运维监控人员有时间处理和解决隐患，避免影响业务系统的正常使用，将一切问题的根源扼杀在摇篮当中。</p><p>在硅谷互联网大公司中，监控和运维被称为 SRE，是公司正常运行中非常重要的一环。作为 billion 级别的 Facebook，内部自然也有着大大小小、各种各样的监控系统和运维工具，有的对标业务数据，有的对标服务器的健康状态，有的则是面向数据库和微服务的控制信息。</p><p>不过，万变不离其宗，运维工作最重要的就是维护系统的稳定性。除了熟悉运用各种提高运维效率的工具来辅助工作外，云资源费用管理、安全管理、监控等，都需要耗费不少精力和时间。运维监控不是一朝一夕得来的，而是随着业务发展的过程中同步和发展的。</p><p>作为量化实践内容的最后一节，今天我们就使用 Django 这个 Web 框架，来搭建一个简单的量化监控平台。</p><h2 id="django-简介和安装" tabindex="-1">Django 简介和安装 <a class="header-anchor" href="#django-简介和安装" aria-label="Permalink to &quot;Django 简介和安装&quot;">​</a></h2><p>Django 是用 Python 开发的一个免费开源的 Web 框架，可以用来快速搭建优雅的高性能网站。它采用的是“MVC”的框架模式，即模型 M、视图 V 和控制器 C。</p><p>Django 最大的特色，在于将网页和数据库中复杂的关系，转化为 Python 中对应的简单关系。它的设计目的，是使常见的Web开发任务变得快速而简单。Django是开源的，不是商业项目或者科研项目，并且集中力量解决Web开发中遇到的一系列问题。所以，Django 每天都会在现有的基础上进步，以适应不断更迭的开发需求。这样既节省了开发时间，也提高了后期维护的效率。</p><p>说了这么多，接下来，我们通过上手使用进一步来了解。先来看一下，如何安装和使用 Django。你可以先按照下面代码块的内容来操作，安装Django ：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip3 install Django</span></span>
<span class="line"><span>django-admin --version</span></span>
<span class="line"><span></span></span>
<span class="line"><span>########## 输出 ##########</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2.2.3</span></span></code></pre></div><p>接着，我们来创建一个新的 Django 项目：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>django-admin startproject TradingMonitor</span></span>
<span class="line"><span>cd TradingMonitor/</span></span>
<span class="line"><span>python3 manage.py migrate</span></span>
<span class="line"><span></span></span>
<span class="line"><span>########## 输出 ##########</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  Applying contenttypes.0001_initial... OK</span></span>
<span class="line"><span>  Applying auth.0001_initial... OK</span></span>
<span class="line"><span>  Applying admin.0001_initial... OK</span></span>
<span class="line"><span>  Applying admin.0002_logentry_remove_auto_add... OK</span></span>
<span class="line"><span>  Applying admin.0003_logentry_add_action_flag_choices... OK</span></span>
<span class="line"><span>  Applying contenttypes.0002_remove_content_type_name... OK</span></span>
<span class="line"><span>  Applying auth.0002_alter_permission_name_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0003_alter_user_email_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0004_alter_user_username_opts... OK</span></span>
<span class="line"><span>  Applying auth.0005_alter_user_last_login_null... OK</span></span>
<span class="line"><span>  Applying auth.0006_require_contenttypes_0002... OK</span></span>
<span class="line"><span>  Applying auth.0007_alter_validators_add_error_messages... OK</span></span>
<span class="line"><span>  Applying auth.0008_alter_user_username_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0009_alter_user_last_name_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0010_alter_group_name_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0011_update_proxy_permissions... OK</span></span>
<span class="line"><span>  Applying sessions.0001_initial... OK</span></span></code></pre></div><p>这时，你能看到文件系统大概是下面这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TradingMonitor/</span></span>
<span class="line"><span>├── TradingMonitor</span></span>
<span class="line"><span>│   ├── __init__.py</span></span>
<span class="line"><span>│   ├── settings.py</span></span>
<span class="line"><span>│   ├── urls.py</span></span>
<span class="line"><span>│   └── wsgi.py</span></span>
<span class="line"><span>├── db.sqlite3</span></span>
<span class="line"><span>└── manage.py</span></span></code></pre></div><p>我简单解释一下它的意思：</p><ul><li>TradingMonitor/TradingMonitor，表示项目最初的 Python 包；</li><li>TradingMonitor/init.py，表示一个空文件，声明所在目录的包为一个 Python 包；</li><li>TradingMonitor/settings.py，管理项目的配置信息；</li><li>TradingMonitor/urls.py，声明请求 URL 的映射关系；</li><li>TradingMonitor/wsgi.py，表示Python 程序和 Web 服务器的通信协议；</li><li>manage.py，表示一个命令行工具，用来和 Django 项目进行交互；</li><li>Db.sqlite3，表示默认的数据库，可以在设置中替换成其他数据库。</li></ul><p>另外，你可能注意到了上述命令中的 <code>python3 manage.py migrate</code>，这个命令表示创建或更新数据库模式。每当 model 源代码被改变后，如果我们要将其应用到数据库上，就需要执行一次这个命令。</p><p>接下来，我们为这个系统添加管理员账户：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python3 manage.py createsuperuser</span></span>
<span class="line"><span></span></span>
<span class="line"><span>########## 输出 ##########</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Username (leave blank to use &#39;ubuntu&#39;): admin</span></span>
<span class="line"><span>Email address:</span></span>
<span class="line"><span>Password:</span></span>
<span class="line"><span>Password (again):</span></span>
<span class="line"><span>Superuser created successfully.</span></span></code></pre></div><p>然后，我们来启动 Django 的 debugging 模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python3 manage.py runserver</span></span></code></pre></div><p>最后，打开浏览器输入： <code>http://127.0.0.1:8000</code>。如果你能看到下面这个画面，就说明 Django 已经部署成功了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/6d8244a8016c97139b3de4680ae2e802.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/6d8244a8016c97139b3de4680ae2e802.png" alt=""></a></p><p>Django 的安装是不是非常简单呢？这其实也是 Python 一贯的理念，简洁，并简化入门的门槛。</p><p>OK，现在我们再定位到 <code>http://127.0.0.1:8000/admin</code>，你会看到 Django 的后台管理网页，这里我就不过多介绍了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/ef29a801bd367263aa4792131eeae093.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/ef29a801bd367263aa4792131eeae093.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/311b3ebf2b0801e84de60d36a81c6925.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/311b3ebf2b0801e84de60d36a81c6925.png" alt=""></a></p><p>到此，Django 就已经成功安装，并且正常启动啦。</p><h2 id="mvc-架构" tabindex="-1">MVC 架构 <a class="header-anchor" href="#mvc-架构" aria-label="Permalink to &quot;MVC 架构&quot;">​</a></h2><p>刚刚我说过，MVC 架构是 Django 设计模式的精髓。接下来，我们就来具体看一下这个架构，并通过 Django 动手搭建一个服务端。</p><h3 id="设计模型-model" tabindex="-1">设计模型 Model <a class="header-anchor" href="#设计模型-model" aria-label="Permalink to &quot;设计模型 Model&quot;">​</a></h3><p>在之前的日志和存储系统这节课中，我介绍过 peewee 这个库，它能避开通过繁琐的 SQL 语句来操作 MySQL，直接使用 Python 的 class 来进行转换。事实上，这也是 Django 采取的方式。</p><p>Django 无需数据库就可以使用，它通过对象关系映射器（object-relational mapping），仅使用Python代码就可以描述数据结构。</p><p>我们先来看下面这段 Model 代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#  TradingMonitor/models.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from django.db import models</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Position(models.Model):</span></span>
<span class="line"><span>    asset = models.CharField(max_length=10)</span></span>
<span class="line"><span>    timestamp = models.DateTimeField()</span></span>
<span class="line"><span>    amount = models.DecimalField(max_digits=10, decimal_places=3)</span></span></code></pre></div><p>models.py 文件主要用一个 Python 类来描述数据表，称为模型 。运用这个类，你可以通过简单的 Python 代码来创建、检索、更新、删除数据库中的记录，而不用写一条又一条的SQL语句，这也是我们之前所说的避免通过 SQL 操作数据库。</p><p>在这里，我们创建了一个 Position 模型，用来表示我们的交易仓位信息。其中，</p><ul><li>asset 表示当前持有资产的代码，例如 btc；</li><li>timestamp 表示时间戳；</li><li>amount 则表示时间戳时刻的持仓信息。</li></ul><h3 id="设计视图-views" tabindex="-1">设计视图 Views <a class="header-anchor" href="#设计视图-views" aria-label="Permalink to &quot;设计视图 Views&quot;">​</a></h3><p>在模型被定义之后，我们便可以在视图中引用模型了。通常，视图会根据参数检索数据，加载一个模板，并使用检索到的数据呈现模板。</p><p>设计视图，则是我们用来实现业务逻辑的地方。我们来看 render_positions 这个代码，它接受 request 和 asset 两个参数，我们先不用管 request。这里的 asset 表示指定一个资产名称，例如 btc，然后这个函数返回一个渲染页面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#  TradingMonitor/views.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from django.shortcuts import render</span></span>
<span class="line"><span>from .models import Position</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def render_positions(request, asset):</span></span>
<span class="line"><span>    positions = Position.objects.filter(asset = asset)</span></span>
<span class="line"><span>    context = {&#39;asset&#39;: asset, &#39;positions&#39;: positions}</span></span>
<span class="line"><span>    return render(request, &#39;positions.html&#39;, context)</span></span></code></pre></div><p>不过，这个函数具体是怎么工作的呢？我们一行行来看。</p><p><code>positions = Position.objects.filter(asset = asset)</code>，这行代码向数据库中执行一个查询操作，其中， filter 表示筛选，意思是从数据库中选出所有我们需要的 asset 的信息。不过，这里我只是为你举例做示范；真正做监控的时候，我们一般会更有针对性地从数据库中筛选读取信息，而不是一口气读取出所有的信息。</p><p><code>context = &amp;#123;&#39;asset&#39;: asset, &#39;positions&#39;: positions&amp;#125;</code>，这行代码没什么好说的，封装一个字典。至于这个字典的用处，下面的内容中可以体现。</p><p><code>return render(request, &#39;positions.html&#39;, context)</code>，最后这行代码返回一个页面。这里我们采用的模板设计，这也是 Django 非常推荐的开发方式，也就是让模板和数据分离，这样，数据只需要向其中填充即可。</p><p>最后的模板文件是 <code>position.html</code>，你应该注意到了， context 作为变量传给了模板，下面我们就来看一下设计模板的内容。</p><h3 id="设计模板templates" tabindex="-1">设计模板Templates <a class="header-anchor" href="#设计模板templates" aria-label="Permalink to &quot;设计模板Templates&quot;">​</a></h3><p>模板文件，其实就是 HTML 文件和部分代码的综合。你可以想象成，这个HTML 在最终送给用户之前，需要被我们预先处理一下，而预先处理的方式就是找到对应的地方进行替换。</p><p>我们来看下面这段示例代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#  TradingMonitor/templates/positions.html</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;!DOCTYPE html&amp;gt;</span></span>
<span class="line"><span>&amp;lt;html lang=&quot;en-US&quot;&amp;gt;</span></span>
<span class="line"><span>&amp;lt;head&amp;gt;</span></span>
<span class="line"><span>&amp;lt;title&amp;gt;Positions for {​{asset}​}&amp;lt;/title&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/head&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;h1&amp;gt;Positions for {​{asset}​}&amp;lt;/h1&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;table&amp;gt;</span></span>
<span class="line"><span>&amp;lt;tr&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;th&amp;gt;Time&amp;lt;/th&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;th&amp;gt;Amount&amp;lt;/th&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/tr&amp;gt;</span></span>
<span class="line"><span>{% for position in positions %}</span></span>
<span class="line"><span>&amp;lt;tr&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;th&amp;gt;{​{position.timestamp}​}&amp;lt;/th&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;th&amp;gt;{​{position.amount}​}&amp;lt;/th&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/tr&amp;gt;</span></span>
<span class="line"><span>{% endfor %}</span></span>
<span class="line"><span>&amp;lt;/table&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span></code></pre></div><p>我重点说一下几个地方。首先是 <code>&amp;lt;title&gt;Positions for {​{asset}​}&amp;lt;/title&gt;</code>，这里双大括号括住 asset 这个变量，这个变量对应的正是前面 context 字典中的 asset key。Django 的渲染引擎会将 asset ，替换成 context 中 asset 对应的内容，此处是替换成了 btc。</p><p>再来看 <code>{% for position in positions %}</code>，这是个很关键的地方。我们需要处理一个列表的情况，用 for 对 positions 进行迭代就行了。这里的 positions ，同样对应的是 context 中的 positions。</p><p>末尾的 <code>{% endfor %}</code>，自然就表示结束了。这样，我们就将数据封装到了一个列表之中。</p><h3 id="设计链接-urls" tabindex="-1">设计链接 Urls <a class="header-anchor" href="#设计链接-urls" aria-label="Permalink to &quot;设计链接 Urls&quot;">​</a></h3><p>最后，我们需要为我们的操作提供 URL 接口，具体操作我放在了下面的代码中，内容比较简单，我就不详细展开讲解了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#  TradingMonitor/urls.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from django.contrib import admin</span></span>
<span class="line"><span>from django.urls import path</span></span>
<span class="line"><span>from . import views</span></span>
<span class="line"><span></span></span>
<span class="line"><span>urlpatterns = [</span></span>
<span class="line"><span>    path(&#39;admin/&#39;, admin.site.urls),</span></span>
<span class="line"><span>    path(&#39;positions/&amp;lt;str:asset&amp;gt;&#39;, views.render_positions),</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>到这里，我们就可以通过 <code>http://127.0.0.1:8000/positions/btc</code> 来访问啦！</p><h3 id="测试" tabindex="-1">测试 <a class="header-anchor" href="#测试" aria-label="Permalink to &quot;测试&quot;">​</a></h3><p>当然，除了主要流程外，我还需要强调几个很简单但非常关键的细节，不然，我们这些改变就不能被真正地应用。</p><p>第一步，在 <code>TradingMonitor/TradingMonitor</code> 下，新建一个文件夹 migrations；并在这个文件夹中，新建一个空文件 <code>__init__.py</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mkdir TradingMonitor/migrations</span></span>
<span class="line"><span>touch TradingMonitor/migrations/__init__.py</span></span></code></pre></div><p>此时，你的目录结构应该长成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TradingMonitor/</span></span>
<span class="line"><span>├── TradingMonitor</span></span>
<span class="line"><span>│   ├── migrations</span></span>
<span class="line"><span>│       └── __init__.py</span></span>
<span class="line"><span>│   ├── templates</span></span>
<span class="line"><span>│       └── positions.html</span></span>
<span class="line"><span>│   ├── __init__.py</span></span>
<span class="line"><span>│   ├── settings.py</span></span>
<span class="line"><span>│   ├── urls.py</span></span>
<span class="line"><span>│   ├── models.py</span></span>
<span class="line"><span>│   ├── views.py</span></span>
<span class="line"><span>│   └── wsgi.py</span></span>
<span class="line"><span>├── db.sqlite3</span></span>
<span class="line"><span>└── manage.py</span></span></code></pre></div><p>第二步，修改 <code>TradingMonitor/settings.py</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSTALLED_APPS = [</span></span>
<span class="line"><span>    &#39;django.contrib.admin&#39;,</span></span>
<span class="line"><span>    &#39;django.contrib.auth&#39;,</span></span>
<span class="line"><span>    &#39;django.contrib.contenttypes&#39;,</span></span>
<span class="line"><span>    &#39;django.contrib.sessions&#39;,</span></span>
<span class="line"><span>    &#39;django.contrib.messages&#39;,</span></span>
<span class="line"><span>    &#39;django.contrib.staticfiles&#39;,</span></span>
<span class="line"><span>    &#39;TradingMonitor&#39;,  # 这里把我们的 app 加上</span></span>
<span class="line"><span>]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TEMPLATES = [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        &#39;BACKEND&#39;: &#39;django.template.backends.django.DjangoTemplates&#39;,</span></span>
<span class="line"><span>        &#39;DIRS&#39;: [os.path.join(BASE_DIR, &#39;TradingMonitor/templates&#39;)],  # 这里把 templates 的目录加上</span></span>
<span class="line"><span>        &#39;APP_DIRS&#39;: True,</span></span>
<span class="line"><span>        &#39;OPTIONS&#39;: {</span></span>
<span class="line"><span>            &#39;context_processors&#39;: [</span></span>
<span class="line"><span>                &#39;django.template.context_processors.debug&#39;,</span></span>
<span class="line"><span>                &#39;django.template.context_processors.request&#39;,</span></span>
<span class="line"><span>                &#39;django.contrib.auth.context_processors.auth&#39;,</span></span>
<span class="line"><span>                &#39;django.contrib.messages.context_processors.messages&#39;,</span></span>
<span class="line"><span>            ],</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>第三步，运行 <code>python manage.py makemigrations</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python manage.py makemigrations</span></span>
<span class="line"><span></span></span>
<span class="line"><span>########## 输出 ##########</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Migrations for &#39;TradingMonitor&#39;:</span></span>
<span class="line"><span>  TradingMonitor/migrations/0001_initial.py</span></span>
<span class="line"><span>    - Create model Position</span></span></code></pre></div><p>第四步，运行 <code>python manage.py migrate</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python manage.py migrate</span></span>
<span class="line"><span></span></span>
<span class="line"><span>########## 输出 ##########</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Operations to perform:</span></span>
<span class="line"><span>  Apply all migrations: TradingMonitor, admin, auth, contenttypes, sessions</span></span>
<span class="line"><span>Running migrations:</span></span>
<span class="line"><span>  Applying TradingMonitor.0001_initial... OK</span></span></code></pre></div><p>这几步的具体操作，我都用代码和注释表示了出来，你完全可以同步进行操作。操作完成后，现在，我们的数据结构就已经被成功同步到数据库中了。</p><p>最后，输入 <code>python manage.py runserver</code>，然后打开浏览器输入 <code>http://127.0.0.1:8000/positions/btc</code>，你就能看到效果啦。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/abb5a9aaf8016f485d38552f4291784a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/abb5a9aaf8016f485d38552f4291784a.png" alt=""></a></p><p>现在，我们再回过头来看一下 MVC 模式，通过我画的这张图，你可以看到，M、V、C这三者，以一种插件似的、松耦合的方式连接在一起：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/c7ff058064e869d6da652805c29263bc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/113533/c7ff058064e869d6da652805c29263bc.png" alt=""></a></p><p>当然，我带你写的只是一个简单的 Django 应用程序，对于真正的量化平台监控系统而言，这还只是一个简单的开始。</p><p>除此之外，对于监控系统来说，其实还有着非常多的开源插件可以使用。有一些界面非常酷炫，有一些可以做到很高的稳定性和易用性，它们很多都可以结合 Django 做出很好的效果来。比较典型的有：</p><ul><li>Graphite 是一款存储时间序列数据，并通过 Django Web 应用程序在图形中显示的插件；</li><li>Vimeo 则是一个基于 Graphite 的仪表板，具有附加功能和平滑的设计；</li><li>Scout 监控 Django和Flask应用程序的性能，提供自动检测视图、SQL查询、模板等。</li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这一节课的内容更靠近上游应用层，我们以 Django 这个 Python 后端为例，讲解了搭建一个服务端的过程。你应该发现了，使用 RESTful Framework 搭建服务器，是一个如此简单的过程，你可以去开一个自己的交易所了（笑）。相比起具体的技术，今天我所讲的 MVC 框架和 Django 的思想，更值得你去深入学习和领会。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>今天我想给你留一个难度比较高的作业。RESTful API 在 Django 中是如何实现安全认证的？你能通过搜索和自学掌握这个知识点吗？希望可以在留言区看到你的认真学习记录和总结，我会一一给出建议。也欢迎你把这篇文章分享给你的朋友、同事，一起交流、一起进步。</p>`,87)])])}const m=a(t,[["render",i]]);export{h as __pageData,m as default};
