import{_ as n,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"30 | 应用间通信（二）：详解Linux进程IPC","description":"","frontmatter":{},"headers":[{"level":3,"title":"消息队列","slug":"消息队列","link":"#消息队列","children":[]},{"level":3,"title":"共享内存","slug":"共享内存","link":"#共享内存","children":[]},{"level":3,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":3,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"计算机基础实战课/30｜应用间通信（二）：详解Linux进程IPC.md","filePath":"计算机基础实战课/30｜应用间通信（二）：详解Linux进程IPC.md","lastUpdated":1795560006000}'),l={name:"计算机基础实战课/30｜应用间通信（二）：详解Linux进程IPC.md"};function e(t,s,h,c,d,r){return a(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_30-应用间通信-二-详解linux进程ipc" tabindex="-1">30 | 应用间通信（二）：详解Linux进程IPC <a class="header-anchor" href="#_30-应用间通信-二-详解linux进程ipc" aria-label="Permalink to &quot;30 | 应用间通信（二）：详解Linux进程IPC&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>上节课，我们学习了信号和管道这两种通信方法，这节课我们接着看看消息队列和共享内存这两种通信方式。在大型商业系统中，通常会把功能拆分成几大模块，模块以应用形式存在，就需要消息队列和内存共享来使模块之间进行通信和协作，这就是利用通信机制将应用解耦。</p><p>这节课的配套代码，你可以从这里下载。话不多说，我们正式开讲吧！</p><h3 id="消息队列" tabindex="-1">消息队列 <a class="header-anchor" href="#消息队列" aria-label="Permalink to &quot;消息队列&quot;">​</a></h3><p>消息队列是 Linux 提供的一种进程间通信方法，它能让进程之间互相发送消息。这些消息的形式由进程自己决定，可以是文本，也可以是二进制的，格式可以随意，只要另一个进程认识就行。</p><p>你可以把消息想象成一个数据记录，并且这个记录具有特定的格式以及特定的顺序。消息队列实质就是一个“收纳”消息的链表，消息会依次挂入这个叫做队列的链表中，一个链表节点就对应着一个消息。</p><p>接下来的问题就是，谁有权操作这个消息队列？答案是对这个消息队列有写权限的进程可以向其中插入新的消息；对消息队列有读权限的进程，则可以从其中读出消息。逻辑结构如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/1.png" alt=""></a></p><p>Linux 采用消息队列来实现消息传递，新的消息总是放在队列的末尾，但接收的时候通常是从队列头开始，也可以从中间抽取。发送消息的方式可以是同步的，也可以是异步的。在同步方式的情况下，发送方在消息队列为满时，要进入等待状态。接收方在消息队列为空时，也要进入等待状态；而异步方式中，发送方和接收方都不必等待，而是直接返回。</p><p>Linux 系统下进程间传输消息要分三步走：建立消息队列、发送消息、接收消息。</p><p>我猜，聪明的你已经发现了，这三步正好就对应着三个接口函数， 代码如下所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//获取已经存在的消息队列，或者建立一个新的消息队列</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __key是一个整数，可以自己定义</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgflg是建立消息队列的标志和权限</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//返回-1 表示失败，其他正整数为消息队列标识，像文件句柄一样</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">msgget</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (key_t __key, int __msgflg);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//向__msqid表示的消息队列，发送一个新的消息</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msqid表示消息队列</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgp表示消息结构</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgsz表示消息大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgflg同步、异步等标志</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//返回-1 表示失败，其他表示发送成功</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">msgsnd</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (int __msqid, const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">__msgp, size_t __msgsz, int __msgflg);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//在__msqid表示的消息队列，接收消息</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msqid表示消息队列</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgp表示消息结构，用于接收消息内容</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgsz表示接收消息大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgtyp表示接收消息类型</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __msgflg同步、异步等标志</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//返回-1 表示失败，其他表示成功接收消息的大小</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ssize_t </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">msgrcv</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (int __msqid, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">__msgp, size_t __msgsz, long int __msgtyp, int</span></span></code></pre></div><p>Linux 内核运行过程中缓存了所有的消息队列，这也是为什么 msgget 函数能打开一个已经存在的消息队列。只有在 Linux 内核重启或者显示删除一个消息队列时，这个消息队列才会真正被删除。记录消息队列的数据结构（struct ipc_ids）位于 Linux 内核中，Linux 系统中的所有消息队列都能在该结构中访问。</p><p>在最新版本（2.6 以上的版本）的 Linux 中，ipc_ids 包含在 ipc_namespace 结构体中，而且Linux 又定义了一个 ipc_namespace 结构的全局变量 init_ipc_ns，用来保存 ipc_namespace结构的实例。这里我就不再往下展开了，你有兴趣可以自行研究。</p><p>现在我们结合实战练练手，试着用 Linux 消息队列机制，建立一个“自说自话”的聊天软件。这个聊天软件是这样设计的：首先在主进程中建立一个消息队列；然后建立一个子进程，在子进程中等待主进程发过来的消息，并显示出来；最后，主进程等待用户输入消息，并将消息发送给消息队列。</p><p>按照这个设计，看上去要分成这样三步去实现：首先我们需要建立消息队列。具体就是调用msgget 函数，还要提供一个消息队列的键，这个键用于表示该消息队列的唯一名字。当这个键对应的消息队列存在的时候，msgget 函数将返回该消息队列的标识；如果这个队列不存在，就创建一个消息队列，然后返回这个消息队列的标识。</p><p>代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//消息类型</span></span>
<span class="line"><span>#define MSG_TYPE (041375)</span></span>
<span class="line"><span>//消息队列键</span></span>
<span class="line"><span>#define MSG_KEY (752364)</span></span>
<span class="line"><span>//消息大小</span></span>
<span class="line"><span>#define MSG_SIZE (256)</span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> pid_t pid;</span></span>
<span class="line"><span> msgid = msgget(MSG_KEY, IPC_CREAT | 0666);</span></span>
<span class="line"><span> if (msgid &lt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   perror(&quot;建立消息队列出错\\n&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 建立子进程</span></span>
<span class="line"><span> pid = fork();</span></span>
<span class="line"><span> if (pid &gt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else if (pid == 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合代码我们可以看到，msgget 函数的 __mflg 参数是 IPC_CREAT | 0666，其中的IPC_CREAT 表示没有 MSG_KEY 对应的消息队列就新建一个，0666 则表示该消息队列对应的权限，即所有用户可读写。</p><p>接着是第二步实现，成功建立消息队列后，开始调用 fork 函数建立子进程。在子进程里什么也没干，我们这就来写写子进程的代码，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//消息体</span></span>
<span class="line"><span>typedef struct Msg</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> long type;</span></span>
<span class="line"><span> char body[MSG_SIZE];</span></span>
<span class="line"><span>} msg_t;</span></span>
<span class="line"><span>//子进程运行的函数 用于接收消息</span></span>
<span class="line"><span>int receive_main(int mid)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> msg_t msg;</span></span>
<span class="line"><span> while (1)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   ssize_t sz = msgrcv(mid, &amp;msg, MSG_SIZE, MSG_TYPE, MSG_NOERROR);</span></span>
<span class="line"><span>   if (sz &lt; 0)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     perror(&quot;获取消息失败&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   printf(&quot;新消息:%s\\n&quot;, msg.body);</span></span>
<span class="line"><span>   //判断是exit就退出</span></span>
<span class="line"><span>   if (strncmp(&quot;exit&quot;, msg.body, 4) == 0)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     printf(&quot;结束聊天\\n&quot;);</span></span>
<span class="line"><span>     exit(0);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我来描述一下这段代码的内容。子进程中，在一个循环里调用了 msgrcv 函数，接收 mid 标识的消息队列中的消息，存放在 msg 结构体中，消息的大小和类型都与发送消息一样，MSG_NOERROR 表示消息太大也不会出错。随后打印出消息内容，如果是 exit 的消息内容，则结束子进程。</p><p>最后，我们来完成第三步，有了接收消息的代码，还得有发送代码的程序，我们马上写好它，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int send_main(int mid)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> msg_t msg;</span></span>
<span class="line"><span> while (1)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>       // 设置消息类型</span></span>
<span class="line"><span>   msg.type = MSG_TYPE;</span></span>
<span class="line"><span>       // 获取用户输入并放在消息体中</span></span>
<span class="line"><span>   scanf(&quot;%[^\\n]%*c&quot;, msg.body);</span></span>
<span class="line"><span>       // 发送消息</span></span>
<span class="line"><span>   msgsnd(mid, &amp;msg, MSG_SIZE, 0);</span></span>
<span class="line"><span>   //判断是exit就退出</span></span>
<span class="line"><span>   if (strncmp(&quot;exit&quot;, msg.body, 4) == 0)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     return 0;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对照代码可以看到，发送代码的就是 send_main 函数，这个函数由主进程调用，它会在一个循环中设置消息类型后，获取用户输入的消息内容并放入 msg 消息结构体中。然后，调用msgsnd 函数向 mid 标识的消息队列发送消息，消息来自于 msg 结构体变量，指定MSG_SIZE 为消息大小，并且以同步方式发送消息。</p><p>现在我们调试一下，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/2.png" alt=""></a></p><p>你也可以动手验证一下，如果出现跟我截图中相同的结果，就说明调试成功。</p><p>这就是 Linux 系统提供给消息队列机制，其作用就是方便进程之间通信，让我们轻松地实现一个简单的聊天软件。不过，聊天是一种特例，更多的时候是进程互相发送消息，通知对方记录数据或者要求对方完成某些工作。</p><p>现在，我们已经明白了消息队列机制是怎么回事，Linux 的进程间通信机制中还有共享内存这种机制，我们继续往下看。</p><h3 id="共享内存" tabindex="-1">共享内存 <a class="header-anchor" href="#共享内存" aria-label="Permalink to &quot;共享内存&quot;">​</a></h3><p>进程间通信实则是进程间传输数据，为了实现更高效率的通信，Linux 实现了共享内存这一机制。</p><p>共享内存其实是把同一块物理内存映射到不同进程的虚拟地址空间当中，不同的进程直接通过修改各自虚拟地址空间当中的内容，就可以完成通信。共享内存几乎不需要进行内存数据拷贝就能实现，即数据从进程 A 的虚拟内存空间中写入数据，立即就能被进程 B 感知。其它的进程间通信机制，需要经过 Linux 内核这种中转站进行多次的数据拷贝操作才可以。因此，使用共享内存通信比较高效。</p><p>Linux 内核提供了两种共享内存的实现，一种是基于物理内存映射，另一种是基于 mmap 文件映射，这个 mmap 函数我们在前面的课程中多次见过了，你可以回顾之前的课程。</p><p>这里，我们仅仅讨论基于物理内存映射的实现，它与消息队列很像。Linux 内核会建立一个shmid_kernel 结构，通过 ipc_namespace 结构的全局变量 init_ipc_ns 结构，就能找到系统中所有的 shmid_kernel 结构。该 shmid_kernel 结构会关联到一组物理内存页面，最后这组物理内存页面，会映射到各自进程虚拟内存空间中的相关区域。</p><p>基于物理内存映射的实现方式，大致逻辑如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/3.png" alt=""></a></p><p>Linux 系统下进程间共享内存也分两步：分别是建立共享内存区和绑定进程内存区，然后就可以读写共享内存了。</p><p>这两步对应两个接口函数，代码如下所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//获取已经存在的共享内存，或者建立一个新的共享内存</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __key是一个整数可以自己定义</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __size是建立共享内存的大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __shmflg是建立共享内存的标志和权限</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//返回-1 表示失败，其他正整数为共享内存标识，像文件句柄一样</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">shmget</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (key_t __key, size_t __size, int __shmflg);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 绑定进程内存地址到__shmid的共享内存</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __shmid表示建立的共享内存</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __shmaddr绑定的地址，传NULL则系统自动分配</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __shmflg是绑定地址区间的读写权限</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 返回-1,表示失败，其它是成功绑定的地址</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">shmat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (int __shmid, const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">__shmaddr, int __shmflg);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 解除绑定内存地址</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// __shmaddr为之前绑定的地址</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 返回-1,表示失败</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">shmdt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">__shmaddr)；</span></span></code></pre></div><p>有了几个接口，我们就来写代码测试一下。我们依然采用建立两个进程的方式，在主进程中写入共享内存，在子进程中读取共享内存，但是我们首先要在主进程中建立共享内存。</p><p>我们马上写代码实现它们，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define SHM_KEY (752364)</span></span>
<span class="line"><span>#define SHM_BODY_SIZE (4096-8)</span></span>
<span class="line"><span>#define SHM_STATUS (SHM_BODY_SIZE)</span></span>
<span class="line"><span>typedef struct SHM</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> long status;</span></span>
<span class="line"><span> char body[SHM_BODY_SIZE];</span></span>
<span class="line"><span>} shm_t;</span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> pid_t pid;</span></span>
<span class="line"><span>   // 建立共享内存</span></span>
<span class="line"><span> shmid = shmget(SHM_KEY, sizeof(shm_t), IPC_CREAT | 0666);</span></span>
<span class="line"><span> if (shmid &lt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   perror(&quot;建立共享内存出错\\n&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 建立子进程</span></span>
<span class="line"><span> pid = fork();</span></span>
<span class="line"><span> if (pid &gt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   // 主进程</span></span>
<span class="line"><span>   send_main(shmid);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else if (pid == 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   // 新的子进程</span></span>
<span class="line"><span>   receive_main(shmid);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中调用了 shmget 函数传入了 IPC_CREAT，表示没有 SHM_KEY 对应的共享内存，就建立一块共享内存，大小为 shm 结构体的大小。</p><p>建立好共享内存就可以开始创建子进程了，创建成功后主进程开始执行 send_main 函数，子进程运行 receive_main 函数。下面我们开始编写这两个函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int receive_main(int mid)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 绑定共享内存</span></span>
<span class="line"><span> int ok = 0;</span></span>
<span class="line"><span> shm_t* addr = shmat(mid, NULL, 0);</span></span>
<span class="line"><span> if ((long)addr &lt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   perror(&quot;绑定共享内存失败\\n&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> printf(&quot;子进程访问共享内存的地址:%p\\n&quot;, addr);</span></span>
<span class="line"><span> while (1)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   if(addr-&gt;status == SHM_STATUS)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     for (int i = 0; i &lt; SHM_BODY_SIZE; i++)</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>       if (addr-&gt;body[i] != (char)0xff)</span></span>
<span class="line"><span>       {</span></span>
<span class="line"><span>         printf(&quot;检查共享数据失败:%x\\n&quot;, addr-&gt;body[i]);</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else</span></span>
<span class="line"><span>       {</span></span>
<span class="line"><span>         ok++;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     printf(&quot;检查共享数据成功:%d\\n&quot;, ok);</span></span>
<span class="line"><span>     return 0;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   sleep(2);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>int send_main(int mid)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 绑定共享内存</span></span>
<span class="line"><span> shm_t* addr = shmat(mid, NULL, 0);</span></span>
<span class="line"><span> if ((long)addr &lt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   perror(&quot;绑定共享内存失败\\n&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> printf(&quot;主进程访问共享内存的地址:%p\\n&quot;, addr);</span></span>
<span class="line"><span> memset(addr, 0xff, sizeof(shm_t));</span></span>
<span class="line"><span> // 相当于同步通知子进程数据已经写入</span></span>
<span class="line"><span> addr-&gt;status = SHM_STATUS;</span></span>
<span class="line"><span> // 等待子进程退出</span></span>
<span class="line"><span> wait(NULL);</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对照代码可以看到，两个函数都是调用 shmat 函数，它们为各自进程绑定了一个虚拟内存地址，并基于该地址访问共享内存。</p><p>在 send_main 函数中，先把共享的内存写入 0xff。最后，设置 status 字段用来同步，因为Linux 对共享不提供任何同步机制，所以需要我们自己处理。receive_main 函数中会循环检查status 字段，如果是 SHM_STATUS，就对 addr-&gt;body 中的数据进行一个个检查，并且记录检查结果。</p><p>我们来看看执行结果，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/4.png" alt=""></a></p><p>上图中的结果证明了我们的设计和预期相符，我们只要往共享内存中写入数据，其它进程立马就感知到了，并且得到了数据。</p><p>这就是共享内存的妙处，通过把物理内存页面映射到多个进程的虚拟内存中，使其访问相同的物理内存，数据不需要在各进程之间复制，这是一种性能非常高的进程间通信机制。</p><h3 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h3><p>课程告一段落，我们做个总结。</p><p>进程之间要协作，就需要进程之间可以进行通信。为此 Linux 实现了多种通信机制，这节课我们主要探讨了消息队列和共享内存。</p><p>消息队列能使进程之间互相发送消息，这些消息的形式格式可以随意设定。从数据结构的角度看，消息队列其实是一个挂载消息的链表。发送消息的进程把消息插入链表，接收消息的进程则从链表上获取消息。同步手段由内核提供，即消息链表空了则接收进程休眠，消息链表满了发送进程就会休眠。</p><p>共享内存的实现是把同一块物理内存页面，映射到不同进程的虚拟地址空间当中，进程之间直接通过修改各自虚拟地址空间当中的内容，就能完成数据的瞬间传送。一个进程写入修改了共享内存，另一个进程马上就可以感知到。</p><p>不知道你是不是已经发现了一个问题，这些进程通信方式，只能用于本机进程间通信，不能用于远程通信，如果需要让计算机之间的进程远程通信，就需要使用套接字。套接字是一种网络通信编程接口，有兴趣的同学可以自己了解一下。</p><p>这节课的导图如下，供你参考：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/30/5.png" alt=""></a></p><p>好，今天的课程讲完了，我们下一次再见。</p><h3 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h3><p>进程间通信哪些是同步的，哪些是异步的？</p><p>期待你在留言区跟我交流互动，也推荐你把这节课分享给更多朋友，共同进步。</p>`,65)])])}const E=n(l,[["render",e]]);export{g as __pageData,E as default};
