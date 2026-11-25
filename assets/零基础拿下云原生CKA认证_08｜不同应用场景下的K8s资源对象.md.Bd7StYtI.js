import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"08 | 不同应用场景下的K8s资源对象","description":"","frontmatter":{},"headers":[{"level":2,"title":"Namespace","slug":"namespace","link":"#namespace","children":[]},{"level":2,"title":"Job","slug":"job","link":"#job","children":[]},{"level":2,"title":"CronJob","slug":"cronjob","link":"#cronjob","children":[]},{"level":2,"title":"Daemonset","slug":"daemonset","link":"#daemonset","children":[]},{"level":2,"title":"ConfigMap 和 Secret","slug":"configmap-和-secret","link":"#configmap-和-secret","children":[{"level":3,"title":"第一步：创建 ConfigMap 和 Secret","slug":"第一步-创建-configmap-和-secret","link":"#第一步-创建-configmap-和-secret","children":[]},{"level":3,"title":"第二步：使用 ConfigMap 和 Secret","slug":"第二步-使用-configmap-和-secret","link":"#第二步-使用-configmap-和-secret","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"零基础拿下云原生CKA认证/08｜不同应用场景下的K8s资源对象.md","filePath":"零基础拿下云原生CKA认证/08｜不同应用场景下的K8s资源对象.md","lastUpdated":1795561650000}'),i={name:"零基础拿下云原生CKA认证/08｜不同应用场景下的K8s资源对象.md"};function l(t,s,o,c,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_08-不同应用场景下的k8s资源对象" tabindex="-1">08 | 不同应用场景下的K8s资源对象 <a class="header-anchor" href="#_08-不同应用场景下的k8s资源对象" aria-label="Permalink to &quot;08 | 不同应用场景下的K8s资源对象&quot;">​</a></h1><p>你好，我是雪飞。</p><p>上节课我介绍了 Deployment，这节课我们来聊聊其他几种资源对象。命名空间 Namespace用来对 K8s 中的资源对象进行分组隔离管理，Job 和 CronJob 用来部署任务和定时任务类应用，DaemonSet 用来部署节点守护应用，ConfigMap 和 Secret 用来配置 Pod 用到的环境变量和配置文件。这些资源对象都是围绕 Pod 部署单元提供了更多强大的功能。</p><p>现在就跟我来学习今天的第一个资源对象 Namespace。</p><h2 id="namespace" tabindex="-1">Namespace <a class="header-anchor" href="#namespace" aria-label="Permalink to &quot;Namespace&quot;">​</a></h2><p>之前的课程中提到过命名空间 Namespace，它用于创建 K8s 资源对象的逻辑隔离分区。对于命名空间可以设置不同的访问权限和资源配额，所以你在 K8s 集群中部署资源对象之前，就需要规划好命名空间。K8s 搭建好之后就已经自动创建了几个初始的命名空间，例如 default是默认命名空间，kube-system 是 K8s 组件的命名空间。</p><p>命名空间常用于以下的应用场景：</p><ul><li><p>集群按照不同的项目划分命名空间：项目 1 命名空间 project1-ns 和项目 2 命名空间project2-ns，项目 1 的相关资源对象部署到 project1-ns 命名空间，项目 2 的相关资源对象部署到 project2-ns 命名空间，这样在某个命名空间下查看和管理资源对象时，都不会影响到另一个项目。</p></li><li><p>集群按照不同的部署环境划分命名空间：例如开发环境命名空间 dev-ns 和测试环境命名空间 test-ns（命名空间可以划分开发环境和测试环境，但是对于生产环境和测试环境还是建议部署两套集群，从硬件方面就做到完全隔离）。</p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/1.png" alt=""></a></p><p>可以通过 kubectl 命令来管理命名空间。</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">查看命名空间：kubectl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">get</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> namespace</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">创建命名空间：kubectl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> namespace</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​namespace名称</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">删除命名空间：kubectl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">delete</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> namespace</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​namespace名称</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span></code></pre></div><p>注意：删除命名空间时，所有该命名空间中的资源对象也会被自动删除，因此请谨慎操作。</p><p>如果我们想在创建资源对象的 YAML 文件中设定它的命名空间，需要先确保 K8s 中已有这个命名空间，然后在 YAML 文件的 metadata 属性中加入一行 namespace 的属性来指定命名空间，这样资源对象就会部署到相应的命名空间中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: nginx-pod</span></span>
<span class="line"><span> namespace: my-namespace # 先创建命名空间，然后在这里指定命名空间</span></span>
<span class="line"><span> labels:</span></span>
<span class="line"><span>   app: nginx</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>你如果把资源对象部署到了某个命名空间中，记得在任何使用该资源对象的命令中都要加上 “-n &lt;​namespace 名称 &gt;” 参数，否则会提示无法找到。</p><h2 id="job" tabindex="-1">Job <a class="header-anchor" href="#job" aria-label="Permalink to &quot;Job&quot;">​</a></h2><p>在 K8s 集群中，我们通常需要执行一些一次性或定时的任务，例如数据处理、报表生成、定时备份等。这时，我们可以使用 Job 和 CronJob。顾名思义，Job 用于处理一次性任务，而CronJob 则用于处理周期性的定时任务。</p><p>Job 的工作原理是创建一个或者多个 Pod 来执行一次性指定任务，如果是多个 Pod 副本，就会同时并发创建多个 Pod 执行任务。一旦所有 Pod 都成功完成，Job 的状态就会更新为成功。</p><p>Job 通过 YAML 文件进行定义，下面我们看一个 Job 的 YAML 文件（my-job.yaml）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># my-job.yaml</span></span>
<span class="line"><span>apiVersion: batch/v1</span></span>
<span class="line"><span>kind: Job</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-job</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> backoffLimit: 3  # Pod 失败重启次数</span></span>
<span class="line"><span> completions: 2   # Pod 副本数量</span></span>
<span class="line"><span> template:</span></span>
<span class="line"><span>   spec:</span></span>
<span class="line"><span>     containers:</span></span>
<span class="line"><span>     - image: busybox</span></span>
<span class="line"><span>       name: my-job-c</span></span>
<span class="line"><span>       command: [&quot;/bin/sh&quot;, &quot;-c&quot;, &quot;sleep 30 &amp;&amp; echo &#39;do my job&#39;&quot;]</span></span></code></pre></div><ul><li><p>backoffLimit：设置 Pod 的失败重试次数。</p></li><li><p>completions：指定完成 Job 需要运行多少个 Pod，就是 Pod 副本数的意思。默认是 1个，如果设置多个，Job 将并发地运行这些 Pod，直到达到指定的数量，这也是 Job 的并发执行的特性。</p></li><li><p>template：定义了一个 Pod 模板，与 Deployment 中的 Pod 模板字段一样，里面定义了一个 Pod，这样 Job 就可以从这个模板中创建出 Pod。Job 不需要通过匹配标签来管理Pod，所以 Job 中的 Pod 不需要有标签属性。</p></li></ul><p>部署 Job 的 YAML 文件，然后我们查看一下运行结果，可以看到 Job 的状态信息，包括成功完成的任务数量和失败的任务数量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-job.yaml</span></span>
<span class="line"><span>job.batch/my-job created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get job</span></span>
<span class="line"><span>NAME     COMPLETIONS   DURATION   AGE</span></span>
<span class="line"><span>my-job   2/2           99s        2m5s</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get pod</span></span>
<span class="line"><span>NAME             READY   STATUS      RESTARTS       AGE</span></span>
<span class="line"><span>my-job-h2sdr     0/1     Completed   0              81s</span></span>
<span class="line"><span>my-job-xng26     0/1     Completed   0              2m10s</span></span></code></pre></div><h2 id="cronjob" tabindex="-1">CronJob <a class="header-anchor" href="#cronjob" aria-label="Permalink to &quot;CronJob&quot;">​</a></h2><p>CronJob 是通过管理 Job 来实现对 Pod 的管理，它允许你按照预定的时间（Cron 格式）来创建和运行 Job。这种关系也体现在了 CronJob 的 YAML 文件格式中。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/2.png" alt=""></a></p><p>我们来看一下 CronJob 的 YAML 文件（my-cronjob.yaml）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># my-cronjob.yaml</span></span>
<span class="line"><span>apiVersion: batch/v1</span></span>
<span class="line"><span>kind: CronJob</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-cronjob</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> schedule: &quot;*/1 * * * *&quot;</span></span>
<span class="line"><span> jobTemplate:</span></span>
<span class="line"><span>   spec:</span></span>
<span class="line"><span>     template:</span></span>
<span class="line"><span>       spec:</span></span>
<span class="line"><span>         restartPolicy: OnFailure</span></span>
<span class="line"><span>         containers:</span></span>
<span class="line"><span>         - image: busybox</span></span>
<span class="line"><span>           name: my-job-c</span></span>
<span class="line"><span>           command: [&quot;/bin/sh&quot;, &quot;-c&quot;, &quot;sleep 30 &amp;&amp; echo &#39;do my job&#39;&quot;]</span></span></code></pre></div><ul><li>schedule：该字段用来设置 cron 定时表达式，用来指定任务的执行时间。</li></ul><p>CronJob 的定时任务仅支持 5 位，表达式写法如下：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">*/1       *        *       *         *</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">分钟</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;   &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">小时</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">日</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">月份</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;     &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">星期</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 分钟：值从 0 到 59</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 小时：值从 0 到 23</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 日：值从 1 到 31</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 月：值从 1 到 12</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 星期：值从 0 到 6, 0 代表星期日</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># “*” 可以作为通配符，“/” 表示间隔</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 例如 “*/1 * * * *” 表示每隔1分钟，“* */2 * * *” 表示每隔2小时</span></span></code></pre></div><p>部署 CronJob 的 YAML 文件，然后我们查看一下运行结果，可以看到 CronJob 每分钟会创建一个 Job，同时这个 Job 会创建一个 Pod 来执行任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-cronjob.yaml</span></span>
<span class="line"><span>cronjob.batch/my-cronjob created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get cronjob</span></span>
<span class="line"><span>NAME         SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE</span></span>
<span class="line"><span>my-cronjob   */1 * * * *   False     1        0s              2m53s</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get job</span></span>
<span class="line"><span>NAME                  COMPLETIONS   DURATION   AGE</span></span>
<span class="line"><span>my-cronjob-28646564   1/1           51s        3m5s</span></span>
<span class="line"><span>my-cronjob-28646566   1/1           49s        65s</span></span>
<span class="line"><span>my-cronjob-28646567   0/1           5s         5s</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get pod</span></span>
<span class="line"><span>NAME                          READY   STATUS      RESTARTS       AGE</span></span>
<span class="line"><span>my-cronjob-28646564-jl4nv     0/1     Completed   0              2m26s</span></span>
<span class="line"><span>my-cronjob-28646565-6qvwb     0/1     Completed   0              86s</span></span>
<span class="line"><span>my-cronjob-28646566-dvbcm     1/1     Running     0              26s</span></span></code></pre></div><h2 id="daemonset" tabindex="-1">Daemonset <a class="header-anchor" href="#daemonset" aria-label="Permalink to &quot;Daemonset&quot;">​</a></h2><p>在 K8s 中，DaemonSet 能够确保所有节点上都运行同一个 Pod 的副本，并且当有新节点加入时，也会自动运行这个 Pod 副本，这类似于在每个节点上自动安装了一个守护应用。DaemonSet 适用于部署日志采集、系统监控和网络代理等组件，这些组件要求在每个节点上都要运行一个自己的 Pod 副本。例如，我们之前介绍过的 kube-proxy 网络代理组件就是通过DaemonSet 进行部署的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/3.png" alt=""></a></p><p>我们来看一个 DaemonSet 的 YAML 文件（my-daemonset.yaml）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: apps/v1</span></span>
<span class="line"><span>kind: DaemonSet</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-daemonset</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> selector:</span></span>
<span class="line"><span>   matchLabels:</span></span>
<span class="line"><span>     name: my-daemonset-pod</span></span>
<span class="line"><span> template:</span></span>
<span class="line"><span>   metadata:</span></span>
<span class="line"><span>     labels:</span></span>
<span class="line"><span>       name: my-daemonset-pod</span></span>
<span class="line"><span>   spec:</span></span>
<span class="line"><span>     containers:</span></span>
<span class="line"><span>     - name: nginx</span></span>
<span class="line"><span>       image: nginx</span></span></code></pre></div><p>DaemonSet 与 Deployment 的 YAML 文件非常相似。它也是通过匹配 Pod 的标签 Label 来管理 Pod。不过，需要注意的是，DaemonSet 不需要 “replicas” 字段，它的 Pod 副本数量通常等于集群可用节点的数量（通过污点来阻止 Pod 部署的节点除外）。</p><p>部署 DaemonSet 的 YAML 文件，然后我们查看一下运行结果，可以看到 Daemonset 在两个工作节点上都创建了一个 Pod。（因为管理节点上有污点，所以管理节点上没有运行DaemonSet 的 Pod）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-daemonset.yaml</span></span>
<span class="line"><span>daemonset.apps/my-daemonset created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get daemonset</span></span>
<span class="line"><span>NAME           DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR</span></span>
<span class="line"><span>my-daemonset   2         2         0       2            0           &lt;​none&gt;</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get pod -o wide</span></span>
<span class="line"><span>NAME                  READY   STATUS   RESTARTS   AGE   IP             NODE</span></span>
<span class="line"><span>my-daemonset-7xfvk    1/1     Running  0          33s   10.244.126.36   k8s-worke</span></span>
<span class="line"><span>my-daemonset-pr66z    1/1     Running  0          33s   10.244.194.92   k8s-worke</span></span></code></pre></div><h2 id="configmap-和-secret" tabindex="-1">ConfigMap 和 Secret <a class="header-anchor" href="#configmap-和-secret" aria-label="Permalink to &quot;ConfigMap 和 Secret&quot;">​</a></h2><p>我们来看一个开发经常遇到的场景，写代码的时候经常会用到一些配置参数，这些参数通常是Key-Value 键值对，我们不希望写死到代码里，而是希望能有一个配置文件去存储这些配置，程序运行的时候会自动读取这些文件。</p><p>在 K8s 中，提供了 ConfigMap 和 Secret 这两种资源对象来实现这个需求。ConfigMap 是一种明文的配置参数，比如记录环境变量、文件路径、运行参数等。Secret 是使用了 base64 编码的配置参数，通常保存数据库密码、第三方的一些秘钥等。需要注意，base64 编码并非一种安全的加密方式，它仅仅是一种编码格式的转换。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/08/4.png" alt=""></a></p><p>使用 ConfigMap 和 Secret 主要是两步：</p><ol><li><p>第一步是在集群中创建好 ConfigMap 和 Secret。</p></li><li><p>第二步是在 Pod 的 YAML 文件中使用 ConfigMap 和 Secret。</p></li></ol><p>下面，我通过一个实验给你演示一下 ConfigMap 和 Secret 的用法。</p><h3 id="第一步-创建-configmap-和-secret" tabindex="-1">第一步：创建 ConfigMap 和 Secret <a class="header-anchor" href="#第一步-创建-configmap-和-secret" aria-label="Permalink to &quot;第一步：创建 ConfigMap 和 Secret&quot;">​</a></h3><p>使用 kubectl 命令和 YAML 文件都可以创建 ConfigMap 和 Secret。</p><p>使用 “kubectl create” 命令创建 ConfigMap 和 Secret。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 创建名称为 my-configmap 的 ConfigMap</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 包含 count=10 和 path=&quot;/data&quot; 两个参数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kubectl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> configmap</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> my-configmap</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --from-literal=count=10</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --from-literal=path</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 创建名称为 my-secret 的 Secret</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 包含 username=admin 和 password=123456 两个参数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kubectl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> secret</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> generic</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> my-secret</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --from-literal=username=admin</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --from-lite</span></span></code></pre></div><p>–from-literal：表示 ConfigMap 和 Secret 中存放的配置参数的键值对。</p><p>在创建 Secret 时，多使用了一个 generic 参数。这个参数表示 Secret 的类型，有以下三种类型：</p><ul><li><p>generic：存放普通配置参数的 Secret 类型, 会自动对 Value 值进行 base64 编码。</p></li><li><p>tls：存放 TLS 证书的 Secret 类型，通常用于配置 HTTPS 请求证书。</p></li><li><p>docker-registry：存放私有镜像仓库凭证的 Secret 类型。在课程中，我们使用的镜像都是来自 Docker Hub 公开仓库的镜像，因此不需要配置凭证。但是，如果我们使用私有镜像仓库中的镜像（例如自己搭建的 Harbor 镜像仓库），就需要配置私有镜像仓库的凭证了。</p></li></ul><p>使用 YAML 文件创建 ConfigMap 和 Secret。</p><p>ConfigMap 的 YAML 文件（my-configmap.yaml）如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># my-configmap.yaml</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: ConfigMap</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-configmap</span></span>
<span class="line"><span>data:</span></span>
<span class="line"><span> count: 10</span></span>
<span class="line"><span> path: &quot;/data&quot;</span></span></code></pre></div><p>Secret 的 YAML 文件中的参数值需要先进行 base64 编码，可以使用 “base64” 命令对数据进行编码，然后使用编码后的值作为 YAML 文件中的参数值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# echo -n &quot;admin&quot; | base64</span></span>
<span class="line"><span>YWRtaW4=</span></span>
<span class="line"><span>[root@k8s-master ~]# echo -n &quot;123456&quot; | base64</span></span>
<span class="line"><span>MTIzNDU2</span></span></code></pre></div><p>Secret 的 YAML 文件（my-secret.yaml）如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># my-secret.yaml</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Secret</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-secret</span></span>
<span class="line"><span>type: Opaque  # 对应命令中的 generic 类型</span></span>
<span class="line"><span>data:</span></span>
<span class="line"><span> username: YWRtaW4=</span></span>
<span class="line"><span> password: MTIzNDU2</span></span></code></pre></div><p>部署 ConfigMap 和 Secret，然后查看结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-configmap.yaml</span></span>
<span class="line"><span>configmap/my-configmap created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-secret.yaml</span></span>
<span class="line"><span>secret/my-secret created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get configmap   #查看 ConfigMap</span></span>
<span class="line"><span>NAME               DATA   AGE</span></span>
<span class="line"><span>my-configmap       2      10s</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get secret  # 查看 Secret</span></span>
<span class="line"><span>NAME        TYPE     DATA   AGE</span></span>
<span class="line"><span>my-secret   Opaque   2      10s</span></span></code></pre></div><h3 id="第二步-使用-configmap-和-secret" tabindex="-1">第二步：使用 ConfigMap 和 Secret <a class="header-anchor" href="#第二步-使用-configmap-和-secret" aria-label="Permalink to &quot;第二步：使用 ConfigMap 和 Secret&quot;">​</a></h3><p>部署了 ConfigMap 和 Secret，我们需要在 Pod 中去使用这两种参数。有两种方式：一种是通过环境变量的方式，另一种是通过数据卷 Volume 挂载成配置文件的方式。</p><p>通过环境变量使用 ConfigMap 和 Secret。</p><p>我们编写一个 busybox 镜像的 Pod 的 YAML 文件（my-pod-env.yaml），来使用刚才部署好的ConfigMap 和 Secret。环境变量是加载到 Pod 的容器中，所以在 YAML 文件的容器层级中需要增加 env 属性，把 ConfigMap 和 Secret 的参数都引入到容器的环境变量中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># my-pod-env.yaml</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Pod</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-pod-env</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> containers:</span></span>
<span class="line"><span> - name: busybox-c</span></span>
<span class="line"><span>   image: busybox</span></span>
<span class="line"><span>   command: [&quot;/bin/sleep&quot;, &quot;3600&quot;]</span></span>
<span class="line"><span>   env:</span></span>
<span class="line"><span>   - name: COUNT   # 最终 Pod 里的环境变量名称</span></span>
<span class="line"><span>     valueFrom:</span></span>
<span class="line"><span>       configMapKeyRef:</span></span>
<span class="line"><span>         name: my-configmap  # 部署的 ConfigMap 名称</span></span>
<span class="line"><span>         key: count   # ConfigMap 中定义的参数名</span></span>
<span class="line"><span>   - name: PATH    # 最终 Pod 里的环境变量名称</span></span>
<span class="line"><span>     valueFrom:</span></span>
<span class="line"><span>       configMapKeyRef:</span></span>
<span class="line"><span>         name: my-configmap  # 部署的 ConfigMap 名称</span></span>
<span class="line"><span>         key: path   # ConfigMap 中定义的参数名</span></span>
<span class="line"><span>   - name: USERNAME   # 最终 Pod 里的环境变量名称</span></span>
<span class="line"><span>     valueFrom:</span></span>
<span class="line"><span>       secretKeyRef:</span></span>
<span class="line"><span>         name: my-secret  # 部署的 Secret 名称</span></span>
<span class="line"><span>         key: username   # Secret 中定义的参数名</span></span>
<span class="line"><span>   - name: PASSWORD    # 最终 Pod 里的环境变量名称</span></span>
<span class="line"><span>     valueFrom:</span></span>
<span class="line"><span>       secretKeyRef:</span></span>
<span class="line"><span>         name: my-secret  # 部署的 Secret 名称</span></span>
<span class="line"><span>         key: password   # Secret 中定义的参数名</span></span></code></pre></div><p>部署这个 Pod 资源对象，然后查看部署结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-pod-env.yaml</span></span>
<span class="line"><span>pod/my-pod-env created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get pod</span></span>
<span class="line"><span>NAME            READY   STATUS    RESTARTS         AGE</span></span>
<span class="line"><span>my-pod-env      1/1     Running   1 (36s ago)      2m32s</span></span></code></pre></div><p>Pod 部署成功后，通过 “kubectl exec” 命令进入 Pod，然后输入 “printenv” 命令查看环境变量。此时，可以看到 ConfigMap 和 Secret 中的参数已经成功加载到环境变量中，可以直接使用了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl exec -it my-pod-env -- sh</span></span>
<span class="line"><span>/ # printenv</span></span>
<span class="line"><span>COUNT=10</span></span>
<span class="line"><span>PATH=/data</span></span>
<span class="line"><span>USERNAME=admin</span></span>
<span class="line"><span>PASSWORD=123456</span></span>
<span class="line"><span>KUBERNETES_SERVICE_PORT=443</span></span>
<span class="line"><span>KUBERNETES_PORT=tcp://10.96.0.1:443</span></span>
<span class="line"><span>HOSTNAME=my-configmap-pod</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>这里你可能会发现一个问题，我们创建 Secret 的时候使用的是 base64 编码后的数据，为什么在 Pod 的容器里看到的却是明文呢？这个问题就留给你课后思考吧。</p><p>通过 Volume 挂载配置文件的方式使用 ConfigMap 和 Secret。</p><p>我们同样也编写一个 busybox 镜像的 Pod 的 YAML 文件（my-pod-volume.yaml），来挂载刚才部署好的 ConfigMap 和 Secret。在讲 Pod 共享存储的时候我们已经使用过数据卷，在 Pod里通过 volume 属性定义 configMap 和 secret 的数据卷，然后在 Pod 的容器中通过volumeMounts 属性把这两个数据卷挂载到容器的文件目录下使用。具体的属性说明我写在YAML 文件的注释中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># my-pod-volume.yaml</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Pod</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: my-pod-volume</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> containers:</span></span>
<span class="line"><span> - name: busybox-c</span></span>
<span class="line"><span>   image: busybox</span></span>
<span class="line"><span>   command: [&quot;/bin/sleep&quot;, &quot;3600&quot;] # 执行程序休眠100秒</span></span>
<span class="line"><span>   volumeMounts:</span></span>
<span class="line"><span>   - name: my-configmap-vol   # 要挂载到本地目录的 Volume 的名称</span></span>
<span class="line"><span>     mountPath: /data/config  # 本地目录地址</span></span>
<span class="line"><span>   - name: my-secret-vol      # 要挂载到本地目录的 Volume 的名称</span></span>
<span class="line"><span>     mountPath: /data/secret  # 本地目录地址</span></span>
<span class="line"><span> volumes:</span></span>
<span class="line"><span> - name: my-configmap-vol  # 定义一个 Volume</span></span>
<span class="line"><span>   configMap:</span></span>
<span class="line"><span>     name: my-configmap  # 部署的 ConfigMap 名称</span></span>
<span class="line"><span> - name: my-secret-vol  # 定义一个 Volume</span></span>
<span class="line"><span>   secret:</span></span>
<span class="line"><span>     secretName: my-secret  # 部署的 Secret 名称</span></span></code></pre></div><p>部署这个 Pod ，然后查看部署结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f my-pod-volume.yaml</span></span>
<span class="line"><span>pod/my-pod-volume created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl get pod</span></span>
<span class="line"><span>NAME                READY   STATUS    RESTARTS       AGE</span></span>
<span class="line"><span>my-pod-volume       1/1     Running   0              73s</span></span></code></pre></div><p>Pod 部署成功后，通过 “kubectl exec” 命令进入 Pod，可以在 “/data/config” 目录下看到ConfigMap 的两个配置参数；在 “/data/secret” 目录下看到 Secret 的两个配置参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl exec -it my-pod-volume -- sh</span></span>
<span class="line"><span>/ # cd /data/config</span></span>
<span class="line"><span>/data/config # ls</span></span>
<span class="line"><span>count  path</span></span>
<span class="line"><span>/data/config # cat count</span></span>
<span class="line"><span>10</span></span>
<span class="line"><span>/data/config # cat path</span></span>
<span class="line"><span>/data</span></span>
<span class="line"><span>/ # cd /data/secret</span></span>
<span class="line"><span>/data/secret # ls</span></span>
<span class="line"><span>password  username</span></span>
<span class="line"><span>/data/secret # cat username</span></span>
<span class="line"><span>admin</span></span>
<span class="line"><span>/data/secret # cat password</span></span>
<span class="line"><span>123456</span></span></code></pre></div><p>总结一下 ConfigMap 和 Secret 作为环境变量和作为文件挂载这两种方式。</p><p>作为环境变量时，每个键值对会转换为容器的一个环境变量。这种方式适用于不需要频繁修改的配置参数，如 API 端口、数据库连接字符串等。作为文件挂载时，参数被加载到容器的文件目录中，每个键值对表现为一个文件，其中文件的内容是参数值。与环境变量相比，文件挂载的方式不受键值对数量的限制，并且能够处理更大量的数据。这使它非常适合于需要定期检查和重新加载配置参数的应用场景，如日志配置、缓存设置等。</p><p>ConfigMap 和 Secret 是 K8s 中的一种简单易用的管理配置参数的资源对象。它支持通过命名空间隔离，同一命名空间内的多个 Pod 可以共享访问该命名空间下的 ConfigMap 和 Secret 资源对象。这种特性可以在某种程度上替代传统的配置管理中心，实现配置文件的共享和实时更新。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天我介绍了 K8s 中几种常见资源对象，包括 Namespace、Job、CronJob、Daemonset、ConfigMap 和 Secret。</p><p>Namespace 可以帮助我们方便的对 K8s 中的资源对象进行分组隔离管理。通常会使用命名空间来分割不同项目的资源对象，或者分割不同的部署环境。</p><p>Job 用于执行一次性任务，可指定任务失败后的重试次数，以及并发运行的 Pod 任务数量。CronJob 在 Job 的基础上提供了定时任务的功能，可以根据 Cron 定时表达式定期运行任务，如每天备份、每小时生成报表等。</p><p>Daemonset 用于在集群的每个节点上都运行一个 Pod，适用于需要在每个节点都部署的系统应用，如日志采集、监控等。</p><p>ConfigMap 和 Secret 是 K8s 中两种存储配置参数的资源对象，ConfigMap 用于存储明文配置，Secret 用于存储 Base64 编码后的敏感信息，它们可以通过环境变量或挂载文件的方式被Pod 中的容器使用。环境变量这种方式适用于启动时需要的少量配置；而挂载文件适合于需要定期检查和重新加载配置的大量参数的应用场景。</p><p>我给你展示了这些资源对象的相关命令和部署文件，希望你可以自己动手尝试部署它们，了解它们的使用场景，帮你实现更多样的部署需求。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这就是今天的全部内容，这节课内容比较多，我也给你留一道思考题。</p><p>我们创建 Secret 的时候使用的是 base64 编码后的数据，为什么在 Pod 的容器里看到的就是明文的参数值呢？</p><p>相信经过思考，会让你对知识的理解更加深刻。</p>`,95)])])}const g=a(i,[["render",l]]);export{m as __pageData,g as default};
