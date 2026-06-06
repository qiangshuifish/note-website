import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"19 | 场景联动：智能电灯如何感知光线？（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"网关系统架构","slug":"网关系统架构","link":"#网关系统架构","children":[]},{"level":2,"title":"南向蓝牙通信","slug":"南向蓝牙通信","link":"#南向蓝牙通信","children":[{"level":3,"title":"通过终端登录树莓派","slug":"通过终端登录树莓派","link":"#通过终端登录树莓派","children":[]},{"level":3,"title":"通过图形化窗口软件登录树莓派","slug":"通过图形化窗口软件登录树莓派","link":"#通过图形化窗口软件登录树莓派","children":[]},{"level":3,"title":"在树莓派开发蓝牙程序","slug":"在树莓派开发蓝牙程序","link":"#在树莓派开发蓝牙程序","children":[]}]},{"level":2,"title":"北向MQTT对接云平台","slug":"北向mqtt对接云平台","link":"#北向mqtt对接云平台","children":[{"level":3,"title":"MQTT开发环境准备","slug":"mqtt开发环境准备","link":"#mqtt开发环境准备","children":[]},{"level":3,"title":"云平台创建光照传感器设备","slug":"云平台创建光照传感器设备","link":"#云平台创建光照传感器设备","children":[]},{"level":3,"title":"产品联网开发","slug":"产品联网开发","link":"#产品联网开发","children":[]},{"level":3,"title":"在树莓派上部署软件","slug":"在树莓派上部署软件","link":"#在树莓派上部署软件","children":[]}]},{"level":2,"title":"设置场景联动","slug":"设置场景联动","link":"#设置场景联动","children":[{"level":3,"title":"场景联动任务分解","slug":"场景联动任务分解","link":"#场景联动任务分解","children":[]},{"level":3,"title":"联动设备准备","slug":"联动设备准备","link":"#联动设备准备","children":[]},{"level":3,"title":"联动任务创建","slug":"联动任务创建","link":"#联动任务创建","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"物联网开发实战/19-场景联动：智能电灯如何感知光线？（下）.md","filePath":"物联网开发实战/19-场景联动：智能电灯如何感知光线？（下）.md","lastUpdated":1779821215000}'),t={name:"物联网开发实战/19-场景联动：智能电灯如何感知光线？（下）.md"};function i(l,s,c,o,r,u){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_19-场景联动-智能电灯如何感知光线-下" tabindex="-1">19 | 场景联动：智能电灯如何感知光线？（下） <a class="header-anchor" href="#_19-场景联动-智能电灯如何感知光线-下" aria-label="Permalink to &quot;19 | 场景联动：智能电灯如何感知光线？（下）&quot;">​</a></h1><p>你好，我是郭朝斌。</p><p>在上一讲，我们基于NodeMCU ESP32开发板，开发了一款光照传感器。考虑到低功耗的需求，它是基于低功耗蓝牙技术来实现的。但是蓝牙设备本身无法直接联网上报数据，那么我们要怎么根据光照强度数据来联动控制智能电灯呢？</p><p>不知道你还记不记得 <a href="https://time.geekbang.org/column/article/313631" target="_blank" rel="noreferrer">第9讲</a> 的内容？对于蓝牙设备，我们需要借助 <strong>网关</strong> 来实现联网的目的。所以在这一讲中，我会带你用树莓派打造蓝牙网关，最终实现光照传感器和智能电灯的场景联动（如有需要，你可以根据 <a href="https://shimo.im/sheets/D3VVPdwcYRhhQRXh/MODOC" target="_blank" rel="noreferrer">这份文档</a> 自行采购相关硬件）。</p><h2 id="网关系统架构" tabindex="-1">网关系统架构 <a class="header-anchor" href="#网关系统架构" aria-label="Permalink to &quot;网关系统架构&quot;">​</a></h2><p>首先，我们先看一下网关的系统架构。</p><p>网关的主要功能是 <strong>协议转换</strong>，一方面它需要接收低功耗蓝牙技术的光照传感器的广播数据，另一方面，它需要把解析的数据上传到云平台。</p><p>具体的架构图如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/e44a8bfe765e535f320568f57a3cfa44.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/e44a8bfe765e535f320568f57a3cfa44.jpg" alt="19.01"></a></p><h2 id="南向蓝牙通信" tabindex="-1">南向蓝牙通信 <a class="header-anchor" href="#南向蓝牙通信" aria-label="Permalink to &quot;南向蓝牙通信&quot;">​</a></h2><p>在树莓派上进行蓝牙开发，你可以使用 <a href="https://github.com/IanHarvey/bluepy" target="_blank" rel="noreferrer">bluepy</a> 软件包。它提供了一个Python语言版本的低功耗蓝牙API接口，而且对树莓派的适配非常好。</p><h3 id="通过终端登录树莓派" tabindex="-1">通过终端登录树莓派 <a class="header-anchor" href="#通过终端登录树莓派" aria-label="Permalink to &quot;通过终端登录树莓派&quot;">​</a></h3><p>在学习 <a href="https://time.geekbang.org/column/article/320675" target="_blank" rel="noreferrer">第15讲</a> 的时候，你应该已经在树莓派上部署好了包含Gladys Assistant系统的Raspbian操作系统，现在你可以直接使用这个系统。安装软件包之前，我们在电脑终端上输入下面的命令，通过SSH协议登录到树莓派系统中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ssh pi@gladys.local</span></span></code></pre></div><p>其中，pi就是默认的登录用户名，gladys.local是树莓派开发板的本地域名。</p><p>当提示输入密码时，我们输入默认密码raspberry，然后回车，就登录到了树莓派系统中。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/9171ef2f8a94c6ee8d1869d571677781.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/9171ef2f8a94c6ee8d1869d571677781.png" alt="19.02"></a></p><h3 id="通过图形化窗口软件登录树莓派" tabindex="-1">通过图形化窗口软件登录树莓派 <a class="header-anchor" href="#通过图形化窗口软件登录树莓派" aria-label="Permalink to &quot;通过图形化窗口软件登录树莓派&quot;">​</a></h3><p>当然，你也可以使用提供图形化窗口的软件来登录树莓派，比如 <strong>SecureCRT</strong>，它除了支持串口协议，同时也支持SSH协议。你只需要新建一个连接会话，按照下图所示的内容填写就行了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/f39028873bb6ce7d99f411881f4a3357.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/f39028873bb6ce7d99f411881f4a3357.png" alt="19.03"></a></p><p>第一次登录时，SecureCRT会弹窗提示我们查看“Host Key”，这时点击“Accept Once”即可。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/786bd55b06ea8c11d3171fb57ddec459.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/786bd55b06ea8c11d3171fb57ddec459.png" alt="19.04"></a></p><p>然后我们输入密码“raspberry”，同时勾选“Save password”，省去以后重复输入密码的麻烦。点击“OK”后，就进入树莓派系统了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/4af7047e2d3yy7a2dfa511628708a1ee.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/4af7047e2d3yy7a2dfa511628708a1ee.png" alt="19.05"></a></p><h3 id="在树莓派开发蓝牙程序" tabindex="-1">在树莓派开发蓝牙程序 <a class="header-anchor" href="#在树莓派开发蓝牙程序" aria-label="Permalink to &quot;在树莓派开发蓝牙程序&quot;">​</a></h3><p>我们在树莓派的终端上输入下面命令，就可以完成bluepy的安装：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ sudo apt-get install python3-pip libglib2.0-dev</span></span>
<span class="line"><span>$ sudo pip3 install bluepy</span></span></code></pre></div><p>另外，我们还需要安装interruptingcow软件包。它主要是便于编写定时任务。它的安装命令是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ sudo pip3 install interruptingcow</span></span></code></pre></div><p>具体代码如下，供参考：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#File: blescan.py</span></span>
<span class="line"><span>import time</span></span>
<span class="line"><span>from threading import Thread</span></span>
<span class="line"><span>from interruptingcow import timeout</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from bluepy.btle import DefaultDelegate, Peripheral, Scanner, UUID, capitaliseName, BTLEInternalError</span></span>
<span class="line"><span>from bluepy.btle import BTLEDisconnectError, BTLEManagementError, BTLEGattError</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class LightScanner():</span></span>
<span class="line"><span>    SCAN_TIMEOUT = 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __init__(self, name):</span></span>
<span class="line"><span>        self._name = name</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def status_update(self):</span></span>
<span class="line"><span>        results = self._get_data()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # messages = [</span></span>
<span class="line"><span>        #     MqttMessage(</span></span>
<span class="line"><span>        #         topic=self.format_topic(&quot;property/light&quot;),</span></span>
<span class="line"><span>        #         payload=results.lightlevel,</span></span>
<span class="line"><span>        #     )</span></span>
<span class="line"><span>        # ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def _get_data(self):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        scan_processor = ScanProcessor(self._name)</span></span>
<span class="line"><span>        scanner = Scanner().withDelegate(scan_processor)</span></span>
<span class="line"><span>        scanner.scan(self.SCAN_TIMEOUT, passive=True)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        with timeout(</span></span>
<span class="line"><span>            self.SCAN_TIMEOUT,</span></span>
<span class="line"><span>            exception=Exception(</span></span>
<span class="line"><span>                &quot;Retrieving data from {} device {} timed out after {} seconds&quot;.format(</span></span>
<span class="line"><span>                    repr(self), self._name, self.SCAN_TIMEOUT</span></span>
<span class="line"><span>                )</span></span>
<span class="line"><span>            ),</span></span>
<span class="line"><span>        ):</span></span>
<span class="line"><span>            while not scan_processor.ready:</span></span>
<span class="line"><span>                time.sleep(1)</span></span>
<span class="line"><span>            return scan_processor.results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return scan_processor.results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ScanProcessor:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ADV_TYPE_SERVICE_DATA = 0x16</span></span>
<span class="line"><span>    def __init__(self, name):</span></span>
<span class="line"><span>        self._ready = False</span></span>
<span class="line"><span>        self._name = name</span></span>
<span class="line"><span>        self._results = MiBeaconData()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def handleDiscovery(self, dev, isNewDev, _):</span></span>
<span class="line"><span>        is_nodemcu = False</span></span>
<span class="line"><span>        if isNewDev:</span></span>
<span class="line"><span>            for (adtype, desc, value) in dev.getScanData():</span></span>
<span class="line"><span>                #Service Data UUID == 0xFE95 according to MiBeacon</span></span>
<span class="line"><span>                if adtype == self.ADV_TYPE_SERVICE_DATA and value.startswith(&quot;95fe&quot;):</span></span>
<span class="line"><span>                    print(&quot;FOUND service Data:&quot;,adtype, desc, value)</span></span>
<span class="line"><span>                    #Object ID == 0x1007 according to MiBeacon</span></span>
<span class="line"><span>                    if len(value) == 38 and value[26:30] == &#39;0710&#39;:</span></span>
<span class="line"><span>                        light_den = int((value[-2:] + value[-4:-2]), 16)</span></span>
<span class="line"><span>                        mac = value[14:26]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                        self._results.lightlevel = light_den</span></span>
<span class="line"><span>                        self._results.mac = mac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                        self.ready = True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @property</span></span>
<span class="line"><span>    def mac(self):</span></span>
<span class="line"><span>        return self._mac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @property</span></span>
<span class="line"><span>    def ready(self):</span></span>
<span class="line"><span>        return self._ready</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ready.setter</span></span>
<span class="line"><span>    def ready(self, var):</span></span>
<span class="line"><span>        self._ready = var</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @property</span></span>
<span class="line"><span>    def results(self):</span></span>
<span class="line"><span>        return self._results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MiBeaconData:</span></span>
<span class="line"><span>    def __init__(self):</span></span>
<span class="line"><span>        self._lightlevel = None</span></span>
<span class="line"><span>        self._mac = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @property</span></span>
<span class="line"><span>    def lightlevel(self):</span></span>
<span class="line"><span>        return self._lightlevel</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @lightlevel.setter</span></span>
<span class="line"><span>    def lightlevel(self, var):</span></span>
<span class="line"><span>        self._lightlevel = var</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @property</span></span>
<span class="line"><span>    def mac(self):</span></span>
<span class="line"><span>        return self._mac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @mac.setter</span></span>
<span class="line"><span>    def mac(self, var):</span></span>
<span class="line"><span>        self._mac = var</span></span></code></pre></div><h2 id="北向mqtt对接云平台" tabindex="-1">北向MQTT对接云平台 <a class="header-anchor" href="#北向mqtt对接云平台" aria-label="Permalink to &quot;北向MQTT对接云平台&quot;">​</a></h2><p>接下来，我们要实现网关和云平台的对接。</p><h3 id="mqtt开发环境准备" tabindex="-1">MQTT开发环境准备 <a class="header-anchor" href="#mqtt开发环境准备" aria-label="Permalink to &quot;MQTT开发环境准备&quot;">​</a></h3><ol><li><strong>安装软件包</strong></li></ol><p>蓝牙网关与云平台交互的通信协议也是使用MQTT协议，所以我们需要安装MQTT的软件包。</p><p>使用哪个软件包呢？在 <a href="https://time.geekbang.org/column/article/312691" target="_blank" rel="noreferrer">第8讲</a> 中我介绍过几个常用的MQTT软件包，这里我们选择支持Python语言开发的 <a href="http://www.eclipse.org/paho/" target="_blank" rel="noreferrer">Eclipse Paho</a> 软件包。我们在树莓派的终端上输入下面的命令来安装。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ sudo pip3 install paho-mqtt</span></span></code></pre></div><p>安装成功后，我们可以写一个demo程序测试一下。下面是我测试的代码，你可以参考。和第8讲一样，这段代码仍然会连接到 test.mosquitto.org，并且订阅“/geektime/iot”的主题消息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#File: mqttdemo.py</span></span>
<span class="line"><span>import paho.mqtt.client as mqtt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def on_connect(client, userdata, flags, rc):</span></span>
<span class="line"><span>    print(&quot;Connected with result code &quot;+str(rc))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    client.subscribe(&quot;/geektime/iot&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def on_message(client, userdata, msg):</span></span>
<span class="line"><span>    print(msg.topic+&quot; &quot;+str(msg.payload))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>client = mqtt.Client()</span></span>
<span class="line"><span>client.on_connect = on_connect</span></span>
<span class="line"><span>client.on_message = on_message</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#Still connect to mqtt.eclipse.org</span></span>
<span class="line"><span>client.connect(&quot;test.mosquitto.org&quot;, 1883, 60)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>client.loop_forever()</span></span></code></pre></div><ol start="2"><li><strong>部署文件到树莓派</strong></li></ol><p>现在，我们把测试文件 mqttdemo.py 上传到树莓派上。</p><p>你可以在电脑终端上，运行下面的命令。（注意，你需要先在树莓派上创建 pi-gateway 这个目录。）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ scp mqttdemo.py pi@gladys.local:/home/pi/pi-gateway/</span></span></code></pre></div><p>其中这个scp命令是基于SSH协议实现的安全文档传输功能。</p><p>当然，你也可能更习惯图形化的软件，所以我再介绍一个能实现scp功能的软件 <a href="https://filezilla-project.org/download.php?type=client" target="_blank" rel="noreferrer">FileZilla</a>。它支持MacOS、Windows和Linux操作系统，操作界面也非常直观。</p><p>打开“站点管理器”，创建“新站点”。你可以按照下图设置具体配置参数，然后点击“连接”，登录到树莓派系统。为了方便之后的使用，你可以勾选“保存密码”选项。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/29db1ea1b71c06b0845b82bbefc72190.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/29db1ea1b71c06b0845b82bbefc72190.png" alt="19.06"></a></p><p>在软件界面的左半部分是你的电脑上的文件目录，右半部分是树莓派上的目录。你只需要双击左边的某个文件，就可以将文件传输到树莓派上。当然你也可以双击右边树莓派上的文件，将它传输到你的电脑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/aa1b5c0538b4f62f33ce6ed22c77a469.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/aa1b5c0538b4f62f33ce6ed22c77a469.png" alt="19.07"></a></p><p>把文件传输到树莓派之后，我们就可以在树莓派的终端上输入下面的命令，运行上面的demo程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ sudo python3 mqttdemo.py</span></span></code></pre></div><p>这时我们把 <a href="https://time.geekbang.org/column/article/312691" target="_blank" rel="noreferrer">第8讲</a> 中的发布消息命令再执行一次，如果一切顺利执行，那么就可以在树莓派的终端上看到这个消息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>hbmqtt_pub --url mqtt://test.mosquitto.org:1883 -t /geektime/iot -m Hello,World!</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/16e0b2312275956965643dc825ff17b7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/16e0b2312275956965643dc825ff17b7.png" alt="19.08"></a></p><h3 id="云平台创建光照传感器设备" tabindex="-1">云平台创建光照传感器设备 <a class="header-anchor" href="#云平台创建光照传感器设备" aria-label="Permalink to &quot;云平台创建光照传感器设备&quot;">​</a></h3><p>现在，我们已经做好了对接云平台的准备工作。在树莓派上开发与云平台的通信代码之前，我们还需要在腾讯云平台上创建对应的光照传感器设备。</p><p>创建的过程与第17讲智能电灯的过程类似。我快速介绍一下，你重点关注不同的地方就可以了。</p><p>在“新建产品”中，产品类别选择“智慧生活”--&gt;“安防报警”--&gt;“光照度传感器”。数据协议仍然选择“数据模板”，其他的保持默认值即可。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/a15fc960131a83818be3f979044b0037.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/a15fc960131a83818be3f979044b0037.png" alt="19.09"></a></p><p>创建成功后，我们点击进入数据模板的设置界面。为了尽量简单，我只定义了一个属性“光照度”，而且是只读类型。你可以直接导入下面的JSON文件完成数据模板的设置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;version&quot;: &quot;1.0&quot;,</span></span>
<span class="line"><span>  &quot;profile&quot;: {</span></span>
<span class="line"><span>    &quot;ProductId&quot;: &quot;你的ProductID&quot;,</span></span>
<span class="line"><span>    &quot;CategoryId&quot;: &quot;112&quot;</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  &quot;properties&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;id&quot;: &quot;Illuminance&quot;,</span></span>
<span class="line"><span>      &quot;name&quot;: &quot;光照度&quot;,</span></span>
<span class="line"><span>      &quot;desc&quot;: &quot;光照度检测&quot;,</span></span>
<span class="line"><span>      &quot;mode&quot;: &quot;r&quot;,</span></span>
<span class="line"><span>      &quot;define&quot;: {</span></span>
<span class="line"><span>        &quot;type&quot;: &quot;float&quot;,</span></span>
<span class="line"><span>        &quot;min&quot;: &quot;0&quot;,</span></span>
<span class="line"><span>        &quot;max&quot;: &quot;6000&quot;,</span></span>
<span class="line"><span>        &quot;start&quot;: &quot;0&quot;,</span></span>
<span class="line"><span>        &quot;step&quot;: &quot;1&quot;,</span></span>
<span class="line"><span>        &quot;unit&quot;: &quot;Lux&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  &quot;events&quot;: [],</span></span>
<span class="line"><span>  &quot;actions&quot;: []</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/779d9d3f3c5f35a1490bbe91f2f4b7da.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/779d9d3f3c5f35a1490bbe91f2f4b7da.png" alt="19.10"></a></p><p>在“交互开发”标签页中，和智能电灯一样，我们仍然保持“使用官方小程序控制产品”选项是打开状态。另外，还有一个配置项需要关注，那就是“智能联动配置”，因为后面我们要为光照传感器设置联动场景。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/76c20e82ae392b96e52a0467381fbc7a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/76c20e82ae392b96e52a0467381fbc7a.png" alt="19.11"></a></p><p>我们点击“配置”，在设置页面中，就可以看到“光照度”这个属性，因为它是只读属性，所以只能作为联动的触发条件。我们勾选“作为条件”的选项，完成配置。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/395790a876a9e616dafc107dcf872177.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/395790a876a9e616dafc107dcf872177.png" alt="19.12"></a></p><p>下一步，在“设备调试”界面中，我们创建一个测试设备。点击“新建设备”，输入设备名称“Lightsensor_1”。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/ff73e5da081e581cb8cb1229e08e302a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/ff73e5da081e581cb8cb1229e08e302a.png" alt="19.13"></a></p><p>创建成功后，在测试设备列表中，点击“Lightsensor_1”，进入设备的详情页面，我们可以看到设备三元组的信息。你需要将这些信息记录下来，因为后面的开发中需要使用。</p><p>在测试设备列表中，我们点击“二维码”操作，获取测试设备的二维码，以便在小程序“腾讯连连”中添加这个设备。</p><p>到这里，腾讯云平台上的产品创建工作就完成了。</p><h3 id="产品联网开发" tabindex="-1">产品联网开发 <a class="header-anchor" href="#产品联网开发" aria-label="Permalink to &quot;产品联网开发&quot;">​</a></h3><p>在腾讯云平台准备好产品的配置工作之后，我们继续在树莓派上完成北向的通信交互的开发工作。</p><p>在 <a href="https://time.geekbang.org/column/article/322528" target="_blank" rel="noreferrer">第17讲</a> 中，我们已经了解了MQTT通信的主题 Topic ，以及 Broker 服务器地址、端口号、设备ID（ClientID）、用户名（UserName）和密码（Password）等连接参数的知识。</p><p>我们还是可以使用 <strong>sign.html</strong> 这个网页工具生产用户名和密码，然后就能得到所有的参数。这时，把这些参数替换到下面这段代码的对应位置就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#File: gateway.py</span></span>
<span class="line"><span>from blescan import LightScanner, MiBeaconData</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import time</span></span>
<span class="line"><span>import asyncio</span></span>
<span class="line"><span>import json</span></span>
<span class="line"><span>import uuid</span></span>
<span class="line"><span>import paho.mqtt.client as MQTTClient</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>QCloud Device Info</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>DEVICE_NAME = &quot;Lightsensor_1&quot;</span></span>
<span class="line"><span>PRODUCT_ID = &quot;MAO3SVUCFO&quot;</span></span>
<span class="line"><span>DEVICE_KEY = &quot;TYjuKNc2GpDykXUv4MWBOA==&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>MQTT topic</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>MQTT_CONTROL_TOPIC = &quot;$thing/down/property/&quot;+PRODUCT_ID+&quot;/&quot;+DEVICE_NAME</span></span>
<span class="line"><span>MQTT_CONTROL_REPLY_TOPIC = &quot;$thing/up/property/&quot;+PRODUCT_ID+&quot;/&quot;+DEVICE_NAME</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def mqtt_callback(client, userdata, msg):</span></span>
<span class="line"><span>    # Callback</span></span>
<span class="line"><span>    print(f&quot;Received \`{msg.payload.decode()}\` from \`{msg.topic}\` topic&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def mqtt_connect():</span></span>
<span class="line"><span>    #connect callback</span></span>
<span class="line"><span>    def on_connect(client, userdata, flags, rc):</span></span>
<span class="line"><span>        if rc == 0:</span></span>
<span class="line"><span>            print(&quot;Connected to MQTT Broker!&quot;)</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            print(&quot;Failed to connect, return code %d\\n&quot;, rc)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mqtt_client = None</span></span>
<span class="line"><span>    MQTT_SERVER = PRODUCT_ID + &quot;.iotcloud.tencentdevices.com&quot;</span></span>
<span class="line"><span>    MQTT_PORT = 1883</span></span>
<span class="line"><span>    MQTT_CLIENT_ID = PRODUCT_ID+DEVICE_NAME</span></span>
<span class="line"><span>    MQTT_USER_NAME = &quot;MAO3SVUCFOLightsensor_1;12010126;2OYA5;1609057368&quot;</span></span>
<span class="line"><span>    MQTTT_PASSWORD = &quot;8f79b7f1b0bef9cde7fd9652383b6ff8bfeb8003cc994c64f3c8e069c11fd4c7;hmacsha256&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mqtt_client = MQTTClient.Client(MQTT_CLIENT_ID)</span></span>
<span class="line"><span>    mqtt_client.username_pw_set(MQTT_USER_NAME, MQTTT_PASSWORD)</span></span>
<span class="line"><span>    mqtt_client.on_connect = on_connect</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mqtt_client.connect(MQTT_SERVER, MQTT_PORT, 60)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return mqtt_client</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def mqtt_report(client, light_level):</span></span>
<span class="line"><span>    client_token = &quot;clientToken-&quot; + str(uuid.uuid4())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    msg = {</span></span>
<span class="line"><span>        &quot;method&quot;: &quot;report&quot;,</span></span>
<span class="line"><span>        &quot;clientToken&quot;: client_token,</span></span>
<span class="line"><span>        &quot;params&quot;: {</span></span>
<span class="line"><span>            &quot;Illuminance&quot;: light_level</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    client.publish(MQTT_CONTROL_REPLY_TOPIC, json.dumps(msg))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def light_loop(mclient):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bles = LightScanner(&#39;Nodemcu&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mclient.subscribe(MQTT_CONTROL_TOPIC)</span></span>
<span class="line"><span>    mclient.on_message = mqtt_callback</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mclient.loop_start()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while True:</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            data = bles.status_update()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(&quot;BLE SCAN error:&quot;, e)</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        print(&quot;Light Level:&quot;, data.lightlevel)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        mqtt_report(mclient, data.lightlevel)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        time.sleep(0.1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def main():</span></span>
<span class="line"><span>    mqtt_client = None</span></span>
<span class="line"><span>    # MQTT connection</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        mqtt_client = await asyncio.wait_for(mqtt_connect(), 20)</span></span>
<span class="line"><span>    except asyncio.TimeoutError:</span></span>
<span class="line"><span>        print(&quot;mqtt connected timeout!&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if mqtt_client is not None:</span></span>
<span class="line"><span>        await asyncio.gather(light_loop(mqtt_client))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.run(main())</span></span></code></pre></div><h3 id="在树莓派上部署软件" tabindex="-1">在树莓派上部署软件 <a class="header-anchor" href="#在树莓派上部署软件" aria-label="Permalink to &quot;在树莓派上部署软件&quot;">​</a></h3><p>接下来，我们把代码文件gateway.py 和 blescan.py 两个文件也上传到树莓派的/home/pi/pi-gateway目录中。</p><p>同时，为了让程序作为后台服务运行，并且能够开机自启动，我们来做一个Pi Gateway Service。</p><p>首先，你需要新建一个service.sh脚本文件，内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span>SCRIPT_DIR=$( cd &quot;$( dirname &quot;$0&quot; )&quot; &gt;/dev/null 2&gt;&amp;1 &amp;&amp; pwd )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cd &quot;$SCRIPT_DIR&quot;</span></span>
<span class="line"><span>sudo python3 ./gateway.py &quot;$@&quot;</span></span></code></pre></div><p>然后，创建我们service的配置文件，内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=Pi Gateway</span></span>
<span class="line"><span>Documentation=https://time.geekbang.org/column/intro/100063601</span></span>
<span class="line"><span>After=network.target</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>Type=simple</span></span>
<span class="line"><span>WorkingDirectory=/home/pi/pi-gateway</span></span>
<span class="line"><span>ExecStart=/home/pi/pi-gateway/service.sh</span></span>
<span class="line"><span>Restart=always</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=multi-user.target</span></span></code></pre></div><p>接着，把这两个文件上传到树莓派系统的/home/pi/pi-gateway目录中，并且运行下面命令，修改文件的属性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ sudo chmod a+x service.sh</span></span>
<span class="line"><span>$ sudo chmod a+x pi-gateway.service</span></span></code></pre></div><p>最后，执行下面的几条命令，为树莓派系统增添上 Pi Gateway 这个服务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ sudo cp /home/pi/pi-gateway/pi-gateway.service /etc/systemd/system/</span></span>
<span class="line"><span>$ sudo systemctl daemon-reload</span></span>
<span class="line"><span>$ sudo systemctl start pi-gateway</span></span>
<span class="line"><span>$ sudo systemctl status pi-gateway</span></span>
<span class="line"><span>$ sudo systemctl enable pi-gateway</span></span></code></pre></div><p>到这里，网关程序已经在树莓派上运行起来。我们在腾讯云物联网平台上可以看到，光照传感器变为“在线”状态。</p><h2 id="设置场景联动" tabindex="-1">设置场景联动 <a class="header-anchor" href="#设置场景联动" aria-label="Permalink to &quot;设置场景联动&quot;">​</a></h2><p>在第17讲和第18讲的实战中，我们分别完成了智能电灯和光照传感器的开发，现在终于可以为它们设置场景联动了。</p><h3 id="场景联动任务分解" tabindex="-1">场景联动任务分解 <a class="header-anchor" href="#场景联动任务分解" aria-label="Permalink to &quot;场景联动任务分解&quot;">​</a></h3><p>我们希望实现的联动场景是，基于环境的光照强度自动控制电灯的开和关。具体来说，这个目标可以拆解为3个自动触发任务：</p><ol><li>当光照强度大于1024Lux时，关闭电灯。</li><li>当光照强度小于1024Lux时，打开电灯。</li><li>至于光照强度等于1024Lux时，也打开电灯。</li></ol><p>注意，这里的1024Lux是我自己选择的一个值，你可以根据房屋情况自己调整。</p><h3 id="联动设备准备" tabindex="-1">联动设备准备 <a class="header-anchor" href="#联动设备准备" aria-label="Permalink to &quot;联动设备准备&quot;">​</a></h3><p>如果你还没有在小程序中添加光照传感器设备，这时可以打开微信中的腾讯连连小程序，扫描上面云平台“设备调试”中保存的那个二维码，添加光照传感器测试设备“Lightsensor_1”。</p><p>现在你的小程序里面已经有了两个设备，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/6c9d5793b7b42e26151315bfc4865ea2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/6c9d5793b7b42e26151315bfc4865ea2.png" alt="19.14"></a></p><p>刚才我们已经在腾讯云物联网平台上，为光照传感器设置了“智能联动配置”。现在，我们来为智能电灯配置智能联动能力。</p><p>我们进入智能电灯的“交互开发”页面，打开下面的“智能联动配置”页面，然后，像下图显示的那样，把“电灯开关”的“作为任务”条件勾选上。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/0ef30835ec3fa62c4968117c3f81372e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/0ef30835ec3fa62c4968117c3f81372e.png" alt="19.15"></a></p><h3 id="联动任务创建" tabindex="-1">联动任务创建 <a class="header-anchor" href="#联动任务创建" aria-label="Permalink to &quot;联动任务创建&quot;">​</a></h3><p>然后，我们进入腾讯连连小程序，点击下面的“+”，选择“添加智能”，开始配置工作。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/965f2898374796898f59bd8ff4774b89.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/965f2898374796898f59bd8ff4774b89.png" alt="19.16"></a></p><p>我们从弹框里选择“自动智能”，可以看到下图的配置界面：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/4112709af28b0a9a20f340035f85a09f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/4112709af28b0a9a20f340035f85a09f.png" alt="19.17"></a></p><p>首先，我们添加条件，选择光照传感器设备，然后就会看到光照度属性。我们先设置大于1024Lux的条件。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/f23b76ed4df0352295754d09845a384e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/f23b76ed4df0352295754d09845a384e.png" alt="19.18"></a></p><p>然后，我们添加任务，选择智能电灯设备后，可以看到电灯开关的属性，选择“关”，点击保存。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/6bd677fe4e4d404ce547d47446c3f4eb.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/6bd677fe4e4d404ce547d47446c3f4eb.png" alt="19.19"></a></p><p>这时，我们可以看到这个智能联动的条件和任务已经配置完成。腾讯连连小程序还支持配置“生效时间段”，可以限定智能联动在选定的时间段内运行。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/9cdc8bb22865540b5148572a1698d0b5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/9cdc8bb22865540b5148572a1698d0b5.png" alt="19.20"></a></p><p>接下来，我们还可以设置一个主题图片和名称，这个根据喜好来就行了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/856b5cc93cf8c90c22be43e5986ca69d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/856b5cc93cf8c90c22be43e5986ca69d.png" alt=""></a></p><p>按照相同的方法，我们可以设置其他两个条件，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/fa1649f112046da7d44f0c5f5ede0c97.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/fa1649f112046da7d44f0c5f5ede0c97.png" alt=""></a></p><p>最终的智能联动，包括了刚才提到的3个不同的触发条件。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/e35a3byybe3148926bfe228e200f759d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/324155/e35a3byybe3148926bfe228e200f759d.png" alt=""></a></p><p>现在，你可以通过控制光照传感器的光照明暗（比如用手遮挡光敏元器件然后再把手拿开），来观察智能电灯的打开和关闭，检验功能是否正常。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>总结一下，在这一讲中，我介绍了利用树莓派打造网关，让光照传感器接入物联网平台的办法，并且带你实现了光照传感器和智能电灯的场景联动。你需要重点关注的内容有：</p><ol><li>为了实现协议转换，树莓派的南向接口，也就是蓝牙功能，你可以基于bluepy软件包开发。这里实现的功能是扫描光照传感器的广播包，并按照MiBeacon蓝牙协议解析出光照强度的数值。</li><li>北向接口要实现对接云平台的功能，这是基于MQTT协议实现的。你可以基于Eclipse paho的Python语言版本来开发MQTT Client的功能。</li><li>场景联动一般由条件和任务组成。其中，条件和任务是从我们的设备中定义的智能联动配置中选择的。</li></ol><p>为了避免光照的短暂变化，导致智能电灯的忽明忽暗，我将光照传感器的数据上报间隔设置得比较长。如果你有特殊的需求，可以修改光照传感器和网关程序中的参数来实现。</p><p>下一讲，我将讲解智能音箱的实现，并通过智能音箱控制智能电灯的开关。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留一个动手实践题。</p><p>在这一讲的场景联动中，我们实现了光照强度对电灯打开和关闭的自动控制。你可以通过光照强度的不同数值实现对智能电灯亮度，或者颜色的控制吗？</p><p>你可以动手设置一下，并且在留言区和我分享你的成果，同时，也欢迎你将这一讲分享给你的朋友，大家一起讨论学习。</p>`,129)])])}const E=n(t,[["render",i]]);export{g as __pageData,E as default};
