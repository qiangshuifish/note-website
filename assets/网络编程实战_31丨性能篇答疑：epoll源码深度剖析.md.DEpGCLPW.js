import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"31丨性能篇答疑：epoll源码深度剖析","description":"","frontmatter":{},"headers":[{"level":2,"title":"基本数据结构","slug":"基本数据结构","link":"#基本数据结构","children":[]},{"level":2,"title":"epoll_create","slug":"epoll-create","link":"#epoll-create","children":[]},{"level":2,"title":"epoll_ctl","slug":"epoll-ctl","link":"#epoll-ctl","children":[{"level":3,"title":"查找epoll实例","slug":"查找epoll实例","link":"#查找epoll实例","children":[]},{"level":3,"title":"红黑树查找","slug":"红黑树查找","link":"#红黑树查找","children":[]},{"level":3,"title":"ep_insert","slug":"ep-insert","link":"#ep-insert","children":[]},{"level":3,"title":"ep_poll_callback","slug":"ep-poll-callback","link":"#ep-poll-callback","children":[]},{"level":3,"title":"查找epoll实例","slug":"查找epoll实例-1","link":"#查找epoll实例-1","children":[]},{"level":3,"title":"ep_poll","slug":"ep-poll","link":"#ep-poll","children":[]},{"level":3,"title":"ep_send_events","slug":"ep-send-events","link":"#ep-send-events","children":[]}]},{"level":2,"title":"Level-triggered VS Edge-triggered","slug":"level-triggered-vs-edge-triggered","link":"#level-triggered-vs-edge-triggered","children":[]},{"level":2,"title":"epoll VS poll/select","slug":"epoll-vs-poll-select","link":"#epoll-vs-poll-select","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"网络编程实战/31丨性能篇答疑：epoll源码深度剖析.md","filePath":"网络编程实战/31丨性能篇答疑：epoll源码深度剖析.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/31丨性能篇答疑：epoll源码深度剖析.md"};function t(i,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_31丨性能篇答疑-epoll源码深度剖析" tabindex="-1">31丨性能篇答疑：epoll源码深度剖析 <a class="header-anchor" href="#_31丨性能篇答疑-epoll源码深度剖析" aria-label="Permalink to &quot;31丨性能篇答疑：epoll源码深度剖析&quot;">​</a></h1><p>你好，我是盛延敏，今天是网络编程实战性能篇的答疑模块，欢迎回来。</p><p>在性能篇中，我主要围绕C10K问题进行了深入剖析，最后引出了事件分发机制和多线程。可以说，基于epoll的事件分发能力，是Linux下高性能网络编程的不二之选。如果你觉得还不过瘾，期望有更深刻的认识和理解，那么在性能篇的答疑中，我就带你一起梳理一下epoll的源代码，从中我们一定可以有更多的发现和领悟。</p><p>今天的代码有些多，建议你配合文稿收听音频。</p><h2 id="基本数据结构" tabindex="-1">基本数据结构 <a class="header-anchor" href="#基本数据结构" aria-label="Permalink to &quot;基本数据结构&quot;">​</a></h2><p>在开始研究源代码之前，我们先看一下epoll中使用的数据结构，分别是eventpoll、epitem和eppoll_entry。</p><p>我们先看一下eventpoll这个数据结构，这个数据结构是我们在调用epoll_create之后内核侧创建的一个句柄，表示了一个epoll实例。后续如果我们再调用epoll_ctl和epoll_wait等，都是对这个eventpoll数据进行操作，这部分数据会被保存在epoll_create创建的匿名文件file的private_data字段中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * This structure is stored inside the &quot;private_data&quot; member of the file</span></span>
<span class="line"><span> * structure and represents the main data structure for the eventpoll</span></span>
<span class="line"><span> * interface.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct eventpoll {</span></span>
<span class="line"><span>    /* Protect the access to this structure */</span></span>
<span class="line"><span>    spinlock_t lock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * This mutex is used to ensure that files are not removed</span></span>
<span class="line"><span>     * while epoll is using them. This is held during the event</span></span>
<span class="line"><span>     * collection loop, the file cleanup path, the epoll file exit</span></span>
<span class="line"><span>     * code and the ctl operations.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    struct mutex mtx;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Wait queue used by sys_epoll_wait() */</span></span>
<span class="line"><span>    //这个队列里存放的是执行epoll_wait从而等待的进程队列</span></span>
<span class="line"><span>    wait_queue_head_t wq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Wait queue used by file-&amp;gt;poll() */</span></span>
<span class="line"><span>    //这个队列里存放的是该eventloop作为poll对象的一个实例，加入到等待的队列</span></span>
<span class="line"><span>    //这是因为eventpoll本身也是一个file, 所以也会有poll操作</span></span>
<span class="line"><span>    wait_queue_head_t poll_wait;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* List of ready file descriptors */</span></span>
<span class="line"><span>    //这里存放的是事件就绪的fd列表，链表的每个元素是下面的epitem</span></span>
<span class="line"><span>    struct list_head rdllist;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* RB tree root used to store monitored fd structs */</span></span>
<span class="line"><span>    //这是用来快速查找fd的红黑树</span></span>
<span class="line"><span>    struct rb_root_cached rbr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * This is a single linked list that chains all the &quot;struct epitem&quot; that</span></span>
<span class="line"><span>     * happened while transferring ready events to userspace w/out</span></span>
<span class="line"><span>     * holding -&amp;gt;lock.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    struct epitem *ovflist;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* wakeup_source used when ep_scan_ready_list is running */</span></span>
<span class="line"><span>    struct wakeup_source *ws;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The user that created the eventpoll descriptor */</span></span>
<span class="line"><span>    struct user_struct *user;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //这是eventloop对应的匿名文件，充分体现了Linux下一切皆文件的思想</span></span>
<span class="line"><span>    struct file *file;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* used to optimize loop detection check */</span></span>
<span class="line"><span>    int visited;</span></span>
<span class="line"><span>    struct list_head visited_list_link;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef CONFIG_NET_RX_BUSY_POLL</span></span>
<span class="line"><span>    /* used to track busy poll napi_id */</span></span>
<span class="line"><span>    unsigned int napi_id;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>你能看到在代码中我提到了epitem，这个epitem结构是干什么用的呢？</p><p>每当我们调用epoll_ctl增加一个fd时，内核就会为我们创建出一个epitem实例，并且把这个实例作为红黑树的一个子节点，增加到eventpoll结构体中的红黑树中，对应的字段是rbr。这之后，查找每一个fd上是否有事件发生都是通过红黑树上的epitem来操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Each file descriptor added to the eventpoll interface will</span></span>
<span class="line"><span> * have an entry of this type linked to the &quot;rbr&quot; RB tree.</span></span>
<span class="line"><span> * Avoid increasing the size of this struct, there can be many thousands</span></span>
<span class="line"><span> * of these on a server and we do not want this to take another cache line.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct epitem {</span></span>
<span class="line"><span>    union {</span></span>
<span class="line"><span>        /* RB tree node links this structure to the eventpoll RB tree */</span></span>
<span class="line"><span>        struct rb_node rbn;</span></span>
<span class="line"><span>        /* Used to free the struct epitem */</span></span>
<span class="line"><span>        struct rcu_head rcu;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* List header used to link this structure to the eventpoll ready list */</span></span>
<span class="line"><span>    //将这个epitem连接到eventpoll 里面的rdllist的list指针</span></span>
<span class="line"><span>    struct list_head rdllink;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Works together &quot;struct eventpoll&quot;-&amp;gt;ovflist in keeping the</span></span>
<span class="line"><span>     * single linked chain of items.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    struct epitem *next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The file descriptor information this item refers to */</span></span>
<span class="line"><span>    //epoll监听的fd</span></span>
<span class="line"><span>    struct epoll_filefd ffd;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Number of active wait queue attached to poll operations */</span></span>
<span class="line"><span>    //一个文件可以被多个epoll实例所监听，这里就记录了当前文件被监听的次数</span></span>
<span class="line"><span>    int nwait;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* List containing poll wait queues */</span></span>
<span class="line"><span>    struct list_head pwqlist;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The &quot;container&quot; of this item */</span></span>
<span class="line"><span>    //当前epollitem所属的eventpoll</span></span>
<span class="line"><span>    struct eventpoll *ep;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* List header used to link this item to the &quot;struct file&quot; items list */</span></span>
<span class="line"><span>    struct list_head fllink;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* wakeup_source used when EPOLLWAKEUP is set */</span></span>
<span class="line"><span>    struct wakeup_source __rcu *ws;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The structure that describe the interested events and the source fd */</span></span>
<span class="line"><span>    struct epoll_event event;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>每次当一个fd关联到一个epoll实例，就会有一个eppoll_entry产生。eppoll_entry的结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Wait structure used by the poll hooks */</span></span>
<span class="line"><span>struct eppoll_entry {</span></span>
<span class="line"><span>    /* List header used to link this structure to the &quot;struct epitem&quot; */</span></span>
<span class="line"><span>    struct list_head llink;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The &quot;base&quot; pointer is set to the container &quot;struct epitem&quot; */</span></span>
<span class="line"><span>    struct epitem *base;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Wait queue item that will be linked to the target file wait</span></span>
<span class="line"><span>     * queue head.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    wait_queue_entry_t wait;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The wait queue head that linked the &quot;wait&quot; wait queue item */</span></span>
<span class="line"><span>    wait_queue_head_t *whead;</span></span>
<span class="line"><span>};</span></span></code></pre></div><h2 id="epoll-create" tabindex="-1">epoll_create <a class="header-anchor" href="#epoll-create" aria-label="Permalink to &quot;epoll\\_create&quot;">​</a></h2><p>我们在使用epoll的时候，首先会调用epoll_create来创建一个epoll实例。这个函数是如何工作的呢?</p><p>首先，epoll_create会对传入的flags参数做简单的验证。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Check the EPOLL_* constant for consistency.  */</span></span>
<span class="line"><span>BUILD_BUG_ON(EPOLL_CLOEXEC != O_CLOEXEC);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (flags &amp; ~EPOLL_CLOEXEC)</span></span>
<span class="line"><span>    return -EINVAL;</span></span>
<span class="line"><span>/*</span></span></code></pre></div><p>接下来，内核申请分配eventpoll需要的内存空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Create the internal data structure (&quot;struct eventpoll&quot;).</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>error = ep_alloc(&amp;ep);</span></span>
<span class="line"><span>if (error &amp;lt; 0)</span></span>
<span class="line"><span>  return error;</span></span></code></pre></div><p>在接下来，epoll_create为epoll实例分配了匿名文件和文件描述字，其中fd是文件描述字，file是一个匿名文件。这里充分体现了UNIX下一切都是文件的思想。注意，eventpoll的实例会保存一份匿名文件的引用，通过调用fd_install函数将匿名文件和文件描述字完成了绑定。</p><p>这里还有一个特别需要注意的地方，在调用anon_inode_get_file的时候，epoll_create将eventpoll作为匿名文件file的private_data保存了起来，这样，在之后通过epoll实例的文件描述字来查找时，就可以快速地定位到eventpoll对象了。</p><p>最后，这个文件描述字作为epoll的文件句柄，被返回给epoll_create的调用者。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Creates all the items needed to setup an eventpoll file. That is,</span></span>
<span class="line"><span> * a file structure and a free file descriptor.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>fd = get_unused_fd_flags(O_RDWR | (flags &amp; O_CLOEXEC));</span></span>
<span class="line"><span>if (fd &amp;lt; 0) {</span></span>
<span class="line"><span>    error = fd;</span></span>
<span class="line"><span>    goto out_free_ep;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>file = anon_inode_getfile(&quot;[eventpoll]&quot;, &amp;eventpoll_fops, ep,</span></span>
<span class="line"><span>             O_RDWR | (flags &amp; O_CLOEXEC));</span></span>
<span class="line"><span>if (IS_ERR(file)) {</span></span>
<span class="line"><span>    error = PTR_ERR(file);</span></span>
<span class="line"><span>    goto out_free_fd;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>ep-&amp;gt;file = file;</span></span>
<span class="line"><span>fd_install(fd, file);</span></span>
<span class="line"><span>return fd;</span></span></code></pre></div><h2 id="epoll-ctl" tabindex="-1">epoll_ctl <a class="header-anchor" href="#epoll-ctl" aria-label="Permalink to &quot;epoll\\_ctl&quot;">​</a></h2><p>接下来，我们看一下一个套接字是如何被添加到epoll实例中的。这就要解析一下epoll_ctl函数实现了。</p><h3 id="查找epoll实例" tabindex="-1">查找epoll实例 <a class="header-anchor" href="#查找epoll实例" aria-label="Permalink to &quot;查找epoll实例&quot;">​</a></h3><p>首先，epoll_ctl函数通过epoll实例句柄来获得对应的匿名文件，这一点很好理解，UNIX下一切都是文件，epoll的实例也是一个匿名文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//获得epoll实例对应的匿名文件</span></span>
<span class="line"><span>f = fdget(epfd);</span></span>
<span class="line"><span>if (!f.file)</span></span>
<span class="line"><span>    goto error_return;</span></span></code></pre></div><p>接下来，获得添加的套接字对应的文件，这里tf表示的是target file，即待处理的目标文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Get the &quot;struct file *&quot; for the target file */</span></span>
<span class="line"><span>//获得真正的文件，如监听套接字、读写套接字</span></span>
<span class="line"><span>tf = fdget(fd);</span></span>
<span class="line"><span>if (!tf.file)</span></span>
<span class="line"><span>    goto error_fput;</span></span></code></pre></div><p>再接下来，进行了一系列的数据验证，以保证用户传入的参数是合法的，比如epfd真的是一个epoll实例句柄，而不是一个普通文件描述符。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* The target file descriptor must support poll */</span></span>
<span class="line"><span>//如果不支持poll，那么该文件描述字是无效的</span></span>
<span class="line"><span>error = -EPERM;</span></span>
<span class="line"><span>if (!tf.file-&amp;gt;f_op-&amp;gt;poll)</span></span>
<span class="line"><span>    goto error_tgt_fput;</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>如果获得了一个真正的epoll实例句柄，就可以通过private_data获取之前创建的eventpoll实例了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * At this point it is safe to assume that the &quot;private_data&quot; contains</span></span>
<span class="line"><span> * our own data structure.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>ep = f.file-&amp;gt;private_data;</span></span></code></pre></div><h3 id="红黑树查找" tabindex="-1">红黑树查找 <a class="header-anchor" href="#红黑树查找" aria-label="Permalink to &quot;红黑树查找&quot;">​</a></h3><p>接下来epoll_ctl通过目标文件和对应描述字，在红黑树中查找是否存在该套接字，这也是epoll为什么高效的地方。红黑树（RB-tree）是一种常见的数据结构，这里eventpoll通过红黑树跟踪了当前监听的所有文件描述字，而这棵树的根就保存在eventpoll数据结构中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* RB tree root used to store monitored fd structs */</span></span>
<span class="line"><span>struct rb_root_cached rbr;</span></span></code></pre></div><p>对于每个被监听的文件描述字，都有一个对应的epitem与之对应，epitem作为红黑树中的节点就保存在红黑树中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Try to lookup the file inside our RB tree, Since we grabbed &quot;mtx&quot;</span></span>
<span class="line"><span> * above, we can be sure to be able to use the item looked up by</span></span>
<span class="line"><span> * ep_find() till we release the mutex.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>epi = ep_find(ep, tf.file, fd);</span></span></code></pre></div><p>红黑树是一棵二叉树，作为二叉树上的节点，epitem必须提供比较能力，以便可以按大小顺序构建出一棵有序的二叉树。其排序能力是依靠epoll_filefd结构体来完成的，epoll_filefd可以简单理解为需要监听的文件描述字，它对应到二叉树上的节点。</p><p>可以看到这个还是比较好理解的，按照文件的地址大小排序。如果两个相同，就按照文件文件描述字来排序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct epoll_filefd {</span></span>
<span class="line"><span>	struct file *file; // pointer to the target file struct corresponding to the fd</span></span>
<span class="line"><span>	int fd; // target file descriptor number</span></span>
<span class="line"><span>} __packed;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Compare RB tree keys */</span></span>
<span class="line"><span>static inline int ep_cmp_ffd(struct epoll_filefd *p1,</span></span>
<span class="line"><span>                            struct epoll_filefd *p2)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return (p1-&amp;gt;file &amp;gt; p2-&amp;gt;file ? +1:</span></span>
<span class="line"><span>		   (p1-&amp;gt;file &amp;lt; p2-&amp;gt;file ? -1 : p1-&amp;gt;fd - p2-&amp;gt;fd));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在进行完红黑树查找之后，如果发现是一个ADD操作，并且在树中没有找到对应的二叉树节点，就会调用ep_insert进行二叉树节点的增加。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case EPOLL_CTL_ADD:</span></span>
<span class="line"><span>    if (!epi) {</span></span>
<span class="line"><span>        epds.events |= POLLERR | POLLHUP;</span></span>
<span class="line"><span>        error = ep_insert(ep, &amp;epds, tf.file, fd, full_check);</span></span>
<span class="line"><span>    } else</span></span>
<span class="line"><span>        error = -EEXIST;</span></span>
<span class="line"><span>    if (full_check)</span></span>
<span class="line"><span>        clear_tfile_check_list();</span></span>
<span class="line"><span>    break;</span></span></code></pre></div><h3 id="ep-insert" tabindex="-1">ep_insert <a class="header-anchor" href="#ep-insert" aria-label="Permalink to &quot;ep\\_insert&quot;">​</a></h3><p>ep_insert首先判断当前监控的文件值是否超过了/proc/sys/fs/epoll/max_user_watches的预设最大值，如果超过了则直接返回错误。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>user_watches = atomic_long_read(&amp;ep-&amp;gt;user-&amp;gt;epoll_watches);</span></span>
<span class="line"><span>if (unlikely(user_watches &amp;gt;= max_user_watches))</span></span>
<span class="line"><span>    return -ENOSPC;</span></span></code></pre></div><p>接下来是分配资源和初始化动作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (!(epi = kmem_cache_alloc(epi_cache, GFP_KERNEL)))</span></span>
<span class="line"><span>        return -ENOMEM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Item initialization follow here ... */</span></span>
<span class="line"><span>    INIT_LIST_HEAD(&amp;epi-&amp;gt;rdllink);</span></span>
<span class="line"><span>    INIT_LIST_HEAD(&amp;epi-&amp;gt;fllink);</span></span>
<span class="line"><span>    INIT_LIST_HEAD(&amp;epi-&amp;gt;pwqlist);</span></span>
<span class="line"><span>    epi-&amp;gt;ep = ep;</span></span>
<span class="line"><span>    ep_set_ffd(&amp;epi-&amp;gt;ffd, tfile, fd);</span></span>
<span class="line"><span>    epi-&amp;gt;event = *event;</span></span>
<span class="line"><span>    epi-&amp;gt;nwait = 0;</span></span>
<span class="line"><span>    epi-&amp;gt;next = EP_UNACTIVE_PTR;</span></span></code></pre></div><p>再接下来的事情非常重要，ep_insert会为加入的每个文件描述字设置回调函数。这个回调函数是通过函数ep_ptable_queue_proc来进行设置的。这个回调函数是干什么的呢？其实，对应的文件描述字上如果有事件发生，就会调用这个函数，比如套接字缓冲区有数据了，就会回调这个函数。这个函数就是ep_poll_callback。这里你会发现，原来内核设计也是充满了事件回调的原理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * This is the callback that is used to add our wait queue to the</span></span>
<span class="line"><span> * target file wakeup lists.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static void ep_ptable_queue_proc(struct file *file, wait_queue_head_t *whead,poll_table *pt)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct epitem *epi = ep_item_from_epqueue(pt);</span></span>
<span class="line"><span>    struct eppoll_entry *pwq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (epi&amp;gt;nwait &amp;gt;= 0 &amp;&amp; (pwq = kmem_cache_alloc(pwq_cache, GFP_KERNEL))) {</span></span>
<span class="line"><span>        init_waitqueue_func_entry(&amp;pwq-&amp;gt;wait, ep_poll_callback);</span></span>
<span class="line"><span>        pwq-&amp;gt;whead = whead;</span></span>
<span class="line"><span>        pwq-&amp;gt;base = epi;</span></span>
<span class="line"><span>        if (epi-&amp;gt;event.events &amp; EPOLLEXCLUSIVE)</span></span>
<span class="line"><span>            add_wait_queue_exclusive(whead, &amp;pwq-&amp;gt;wait);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            add_wait_queue(whead, &amp;pwq-&amp;gt;wait);</span></span>
<span class="line"><span>        list_add_tail(&amp;pwq-&amp;gt;llink, &amp;epi-&amp;gt;pwqlist);</span></span>
<span class="line"><span>        epi-&amp;gt;nwait++;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        /* We have to signal that an error occurred */</span></span>
<span class="line"><span>        epi-&amp;gt;nwait = -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="ep-poll-callback" tabindex="-1">ep_poll_callback <a class="header-anchor" href="#ep-poll-callback" aria-label="Permalink to &quot;ep\\_poll\\_callback&quot;">​</a></h3><p>ep_poll_callback函数的作用非常重要，它将内核事件真正地和epoll对象联系了起来。它又是怎么实现的呢？</p><p>首先，通过这个文件的wait_queue_entry_t对象找到对应的epitem对象，因为eppoll_entry对象里保存了wait_queue_entry_t，根据wait_queue_entry_t这个对象的地址就可以简单计算出eppoll_entry对象的地址，从而可以获得epitem对象的地址。这部分工作在ep_item_from_wait函数中完成。一旦获得epitem对象，就可以寻迹找到eventpoll实例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * This is the callback that is passed to the wait queue wakeup</span></span>
<span class="line"><span> * mechanism. It is called by the stored file descriptors when they</span></span>
<span class="line"><span> * have events to report.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static int ep_poll_callback(wait_queue_entry_t *wait, unsigned mode, int sync, void *key)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int pwake = 0;</span></span>
<span class="line"><span>    unsigned long flags;</span></span>
<span class="line"><span>    struct epitem *epi = ep_item_from_wait(wait);</span></span>
<span class="line"><span>    struct eventpoll *ep = epi-&amp;gt;ep;</span></span></code></pre></div><p>接下来，进行一个加锁操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spin_lock_irqsave(&amp;ep-&amp;gt;lock, flags);</span></span></code></pre></div><p>下面对发生的事件进行过滤，为什么需要过滤呢？为了性能考虑，ep_insert向对应监控文件注册的是所有的事件，而实际用户侧订阅的事件未必和内核事件对应。比如，用户向内核订阅了一个套接字的可读事件，在某个时刻套接字的可写事件发生时，并不需要向用户空间传递这个事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Check the events coming with the callback. At this stage, not</span></span>
<span class="line"><span> * every device reports the events in the &quot;key&quot; parameter of the</span></span>
<span class="line"><span> * callback. We need to be able to handle both cases here, hence the</span></span>
<span class="line"><span> * test for &quot;key&quot; != NULL before the event match test.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>if (key &amp;&amp; !((unsigned long) key &amp; epi-&amp;gt;event.events))</span></span>
<span class="line"><span>    goto out_unlock;</span></span></code></pre></div><p>接下来，判断是否需要把该事件传递给用户空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (unlikely(ep-&amp;gt;ovflist != EP_UNACTIVE_PTR)) {</span></span>
<span class="line"><span>  if (epi-&amp;gt;next == EP_UNACTIVE_PTR) {</span></span>
<span class="line"><span>      epi-&amp;gt;next = ep-&amp;gt;ovflist;</span></span>
<span class="line"><span>      ep-&amp;gt;ovflist = epi;</span></span>
<span class="line"><span>      if (epi-&amp;gt;ws) {</span></span>
<span class="line"><span>          /*</span></span>
<span class="line"><span>           * Activate ep-&amp;gt;ws since epi-&amp;gt;ws may get</span></span>
<span class="line"><span>           * deactivated at any time.</span></span>
<span class="line"><span>           */</span></span>
<span class="line"><span>          __pm_stay_awake(ep-&amp;gt;ws);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  goto out_unlock;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果需要，而且该事件对应的event_item不在eventpoll对应的已完成队列中，就把它放入该队列，以便将该事件传递给用户空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* If this file is already in the ready list we exit soon */</span></span>
<span class="line"><span>if (!ep_is_linked(&amp;epi-&amp;gt;rdllink)) {</span></span>
<span class="line"><span>    list_add_tail(&amp;epi-&amp;gt;rdllink, &amp;ep-&amp;gt;rdllist);</span></span>
<span class="line"><span>    ep_pm_stay_awake_rcu(epi);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们知道，当我们调用epoll_wait的时候，调用进程被挂起，在内核看来调用进程陷入休眠。如果该epoll实例上对应描述字有事件发生，这个休眠进程应该被唤醒，以便及时处理事件。下面的代码就是起这个作用的，wake_up_locked函数唤醒当前eventpoll上的等待进程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Wake up ( if active ) both the eventpoll wait list and the -&amp;gt;poll()</span></span>
<span class="line"><span> * wait list.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>if (waitqueue_active(&amp;ep-&amp;gt;wq)) {</span></span>
<span class="line"><span>    if ((epi-&amp;gt;event.events &amp; EPOLLEXCLUSIVE) &amp;&amp;</span></span>
<span class="line"><span>                !((unsigned long)key &amp; POLLFREE)) {</span></span>
<span class="line"><span>        switch ((unsigned long)key &amp; EPOLLINOUT_BITS) {</span></span>
<span class="line"><span>        case POLLIN:</span></span>
<span class="line"><span>            if (epi-&amp;gt;event.events &amp; POLLIN)</span></span>
<span class="line"><span>                ewake = 1;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case POLLOUT:</span></span>
<span class="line"><span>            if (epi-&amp;gt;event.events &amp; POLLOUT)</span></span>
<span class="line"><span>                ewake = 1;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case 0:</span></span>
<span class="line"><span>            ewake = 1;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    wake_up_locked(&amp;ep-&amp;gt;wq);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="查找epoll实例-1" tabindex="-1">查找epoll实例 <a class="header-anchor" href="#查找epoll实例-1" aria-label="Permalink to &quot;查找epoll实例&quot;">​</a></h3><p>epoll_wait函数首先进行一系列的检查，例如传入的maxevents应该大于0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* The maximum number of event must be greater than zero */</span></span>
<span class="line"><span>if (maxevents &amp;lt;= 0 || maxevents &amp;gt; EP_MAX_EVENTS)</span></span>
<span class="line"><span>    return -EINVAL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* Verify that the area passed by the user is writeable */</span></span>
<span class="line"><span>if (!access_ok(VERIFY_WRITE, events, maxevents * sizeof(struct epoll_event)))</span></span>
<span class="line"><span>    return -EFAULT;</span></span></code></pre></div><p>和前面介绍的epoll_ctl一样，通过epoll实例找到对应的匿名文件和描述字，并且进行检查和验证。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Get the &quot;struct file *&quot; for the eventpoll file */</span></span>
<span class="line"><span>f = fdget(epfd);</span></span>
<span class="line"><span>if (!f.file)</span></span>
<span class="line"><span>    return -EBADF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * We have to check that the file structure underneath the fd</span></span>
<span class="line"><span> * the user passed to us _is_ an eventpoll file.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>error = -EINVAL;</span></span>
<span class="line"><span>if (!is_file_epoll(f.file))</span></span>
<span class="line"><span>    goto error_fput;</span></span></code></pre></div><p>还是通过读取epoll实例对应匿名文件的private_data得到eventpoll实例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * At this point it is safe to assume that the &quot;private_data&quot; contains</span></span>
<span class="line"><span> * our own data structure.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>ep = f.file-&amp;gt;private_data;</span></span></code></pre></div><p>接下来调用ep_poll来完成对应的事件收集并传递到用户空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Time to fish for events ... */</span></span>
<span class="line"><span>error = ep_poll(ep, events, maxevents, timeout);</span></span></code></pre></div><h3 id="ep-poll" tabindex="-1">ep_poll <a class="header-anchor" href="#ep-poll" aria-label="Permalink to &quot;ep\\_poll&quot;">​</a></h3><p>还记得 <a href="https://time.geekbang.org/column/article/143245" target="_blank" rel="noreferrer">第23讲</a> 里介绍epoll函数的时候，对应的timeout值可以是大于0，等于0和小于0么？这里ep_poll就分别对timeout不同值的场景进行了处理。如果大于0则产生了一个超时时间，如果等于0则立即检查是否有事件发生。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span>
<span class="line"><span>static int ep_poll(struct eventpoll *ep, struct epoll_event __user *events,int maxevents, long timeout)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>int res = 0, eavail, timed_out = 0;</span></span>
<span class="line"><span>unsigned long flags;</span></span>
<span class="line"><span>u64 slack = 0;</span></span>
<span class="line"><span>wait_queue_entry_t wait;</span></span>
<span class="line"><span>ktime_t expires, *to = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (timeout &amp;gt; 0) {</span></span>
<span class="line"><span>    struct timespec64 end_time = ep_set_mstimeout(timeout);</span></span>
<span class="line"><span>    slack = select_estimate_accuracy(&amp;end_time);</span></span>
<span class="line"><span>    to = &amp;expires;</span></span>
<span class="line"><span>    *to = timespec64_to_ktime(end_time);</span></span>
<span class="line"><span>} else if (timeout == 0) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Avoid the unnecessary trip to the wait queue loop, if the</span></span>
<span class="line"><span>     * caller specified a non blocking operation.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    timed_out = 1;</span></span>
<span class="line"><span>    spin_lock_irqsave(&amp;ep-&amp;gt;lock, flags);</span></span>
<span class="line"><span>    goto check_events;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来尝试获得eventpoll上的锁：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spin_lock_irqsave(&amp;ep-&amp;gt;lock, flags);</span></span></code></pre></div><p>获得这把锁之后，检查当前是否有事件发生，如果没有，就把当前进程加入到eventpoll的等待队列wq中，这样做的目的是当事件发生时，ep_poll_callback函数可以把该等待进程唤醒。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (!ep_events_available(ep)) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Busy poll timed out.  Drop NAPI ID for now, we can add</span></span>
<span class="line"><span>     * it back in when we have moved a socket with a valid NAPI</span></span>
<span class="line"><span>     * ID onto the ready list.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    ep_reset_busy_poll_napi_id(ep);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * We don&#39;t have any available event to return to the caller.</span></span>
<span class="line"><span>     * We need to sleep here, and we will be wake up by</span></span>
<span class="line"><span>     * ep_poll_callback() when events will become available.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    init_waitqueue_entry(&amp;wait, current);</span></span>
<span class="line"><span>    __add_wait_queue_exclusive(&amp;ep-&amp;gt;wq, &amp;wait);</span></span></code></pre></div><p>紧接着是一个无限循环, 这个循环中通过调用schedule_hrtimeout_range，将当前进程陷入休眠，CPU时间被调度器调度给其他进程使用，当然，当前进程可能会被唤醒，唤醒的条件包括有以下四种：</p><ol><li>当前进程超时；</li><li>当前进程收到一个signal信号；</li><li>某个描述字上有事件发生；</li><li>当前进程被CPU重新调度，进入for循环重新判断，如果没有满足前三个条件，就又重新进入休眠。</li></ol><p>对应的1、2、3都会通过break跳出循环，直接返回。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//这个循环里，当前进程可能会被唤醒，唤醒的途径包括</span></span>
<span class="line"><span>//1.当前进程超时</span></span>
<span class="line"><span>//2.当前进行收到一个signal信号</span></span>
<span class="line"><span>//3.某个描述字上有事件发生</span></span>
<span class="line"><span>//对应的1.2.3都会通过break跳出循环</span></span>
<span class="line"><span>//第4个可能是当前进程被CPU重新调度，进入for循环的判断，如果没有满足1.2.3的条件，就又重新进入休眠</span></span>
<span class="line"><span>for (;;) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * We don&#39;t want to sleep if the ep_poll_callback() sends us</span></span>
<span class="line"><span>     * a wakeup in between. That&#39;s why we set the task state</span></span>
<span class="line"><span>     * to TASK_INTERRUPTIBLE before doing the checks.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    set_current_state(TASK_INTERRUPTIBLE);</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * Always short-circuit for fatal signals to allow</span></span>
<span class="line"><span>     * threads to make a timely exit without the chance of</span></span>
<span class="line"><span>     * finding more events available and fetching</span></span>
<span class="line"><span>     * repeatedly.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    if (fatal_signal_pending(current)) {</span></span>
<span class="line"><span>        res = -EINTR;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (ep_events_available(ep) || timed_out)</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    if (signal_pending(current)) {</span></span>
<span class="line"><span>        res = -EINTR;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    spin_unlock_irqrestore(&amp;ep-&amp;gt;lock, flags);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //通过调用schedule_hrtimeout_range，当前进程进入休眠，CPU时间被调度器调度给其他进程使用</span></span>
<span class="line"><span>    if (!schedule_hrtimeout_range(to, slack, HRTIMER_MODE_ABS))</span></span>
<span class="line"><span>        timed_out = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    spin_lock_irqsave(&amp;ep-&amp;gt;lock, flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果进程从休眠中返回，则将当前进程从eventpoll的等待队列中删除，并且设置当前进程为TASK_RUNNING状态。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//从休眠中结束，将当前进程从wait队列中删除，设置状态为TASK_RUNNING，接下来进入check_events，来判断是否是有事件发生</span></span>
<span class="line"><span>    __remove_wait_queue(&amp;ep-&amp;gt;wq, &amp;wait);</span></span>
<span class="line"><span>    __set_current_state(TASK_RUNNING);</span></span></code></pre></div><p>最后，调用ep_send_events将事件拷贝到用户空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//ep_send_events将事件拷贝到用户空间</span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * Try to transfer events to user space. In case we get 0 events and</span></span>
<span class="line"><span> * there&#39;s still timeout left over, we go trying again in search of</span></span>
<span class="line"><span> * more luck.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>if (!res &amp;&amp; eavail &amp;&amp;</span></span>
<span class="line"><span>    !(res = ep_send_events(ep, events, maxevents)) &amp;&amp; !timed_out)</span></span>
<span class="line"><span>    goto fetch_events;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return res;</span></span></code></pre></div><h3 id="ep-send-events" tabindex="-1">ep_send_events <a class="header-anchor" href="#ep-send-events" aria-label="Permalink to &quot;ep\\_send\\_events&quot;">​</a></h3><p>ep_send_events这个函数会将ep_send_events_proc作为回调函数并调用ep_scan_ready_list函数，ep_scan_ready_list函数调用ep_send_events_proc对每个已经就绪的事件循环处理。</p><p>ep_send_events_proc循环处理就绪事件时，会再次调用每个文件描述符的poll方法，以便确定确实有事件发生。为什么这样做呢？这是为了确定注册的事件在这个时刻还是有效的。</p><p>可以看到，尽管ep_send_events_proc已经尽可能的考虑周全，使得用户空间获得的事件通知都是真实有效的，但还是有一定的概率，当ep_send_events_proc再次调用文件上的poll函数之后，用户空间获得的事件通知已经不再有效，这可能是用户空间已经处理掉了，或者其他什么情形。还记得 <a href="https://time.geekbang.org/column/article/141573" target="_blank" rel="noreferrer">第22讲</a> 吗，在这种情况下，如果套接字不是非阻塞的，整个进程将会被阻塞，这也是为什么将非阻塞套接字配合epoll使用作为最佳实践的原因。</p><p>在进行简单的事件掩码校验之后，ep_send_events_proc将事件结构体拷贝到用户空间需要的数据结构中。这是通过__put_user方法完成的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//这里对一个fd再次进行poll操作，以确认事件</span></span>
<span class="line"><span>revents = ep_item_poll(epi, &amp;pt);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * If the event mask intersect the caller-requested one,</span></span>
<span class="line"><span> * deliver the event to userspace. Again, ep_scan_ready_list()</span></span>
<span class="line"><span> * is holding &quot;mtx&quot;, so no operations coming from userspace</span></span>
<span class="line"><span> * can change the item.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>if (revents) {</span></span>
<span class="line"><span>    if (__put_user(revents, &amp;uevent-&amp;gt;events) ||</span></span>
<span class="line"><span>        __put_user(epi-&amp;gt;event.data, &amp;uevent-&amp;gt;data)) {</span></span>
<span class="line"><span>        list_add(&amp;epi-&amp;gt;rdllink, head);</span></span>
<span class="line"><span>        ep_pm_stay_awake(epi);</span></span>
<span class="line"><span>        return eventcnt ? eventcnt : -EFAULT;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    eventcnt++;</span></span>
<span class="line"><span>    uevent++;</span></span></code></pre></div><h2 id="level-triggered-vs-edge-triggered" tabindex="-1">Level-triggered VS Edge-triggered <a class="header-anchor" href="#level-triggered-vs-edge-triggered" aria-label="Permalink to &quot;Level-triggered VS Edge-triggered&quot;">​</a></h2><p>在 <a href="https://time.geekbang.org/column/article/143245" target="_blank" rel="noreferrer">前面的</a> <a href="https://time.geekbang.org/column/article/143245" target="_blank" rel="noreferrer">文章</a> 里，我们一直都在强调level-triggered和edge-triggered之间的区别。</p><p>从实现角度来看其实非常简单，在ep_send_events_proc函数的最后，针对level-triggered情况，当前的epoll_item对象被重新加到eventpoll的就绪列表中，这样在下一次epoll_wait调用时，这些epoll_item对象就会被重新处理。</p><p>在前面我们提到，在最终拷贝到用户空间有效事件列表中之前，会调用对应文件的poll方法，以确定这个事件是不是依然有效。所以，如果用户空间程序已经处理掉该事件，就不会被再次通知；如果没有处理，意味着该事件依然有效，就会被再次通知。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//这里是Level-triggered的处理，可以看到，在Level-triggered的情况下，这个事件被重新加回到ready list里面</span></span>
<span class="line"><span>//这样，下一轮epoll_wait的时候，这个事件会被重新check</span></span>
<span class="line"><span>else if (!(epi-&amp;gt;event.events &amp; EPOLLET)) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * If this file has been added with Level</span></span>
<span class="line"><span>     * Trigger mode, we need to insert back inside</span></span>
<span class="line"><span>     * the ready list, so that the next call to</span></span>
<span class="line"><span>     * epoll_wait() will check again the events</span></span>
<span class="line"><span>     * availability. At this point, no one can insert</span></span>
<span class="line"><span>     * into ep-&amp;gt;rdllist besides us. The epoll_ctl()</span></span>
<span class="line"><span>     * callers are locked out by</span></span>
<span class="line"><span>     * ep_scan_ready_list() holding &quot;mtx&quot; and the</span></span>
<span class="line"><span>     * poll callback will queue them in ep-&amp;gt;ovflist.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    list_add_tail(&amp;epi-&amp;gt;rdllink, &amp;ep-&amp;gt;rdllist);</span></span>
<span class="line"><span>    ep_pm_stay_awake(epi);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="epoll-vs-poll-select" tabindex="-1">epoll VS poll/select <a class="header-anchor" href="#epoll-vs-poll-select" aria-label="Permalink to &quot;epoll VS poll/select&quot;">​</a></h2><p>最后，我们从实现角度来说明一下为什么epoll的效率要远远高于poll/select。</p><p>首先，poll/select先将要监听的fd从用户空间拷贝到内核空间, 然后在内核空间里面进行处理之后，再拷贝给用户空间。这里就涉及到内核空间申请内存，释放内存等等过程，这在大量fd情况下，是非常耗时的。而epoll维护了一个红黑树，通过对这棵黑红树进行操作，可以避免大量的内存申请和释放的操作，而且查找速度非常快。</p><p>下面的代码就是poll/select在内核空间申请内存的展示。可以看到select 是先尝试申请栈上资源, 如果需要监听的fd比较多, 就会去申请堆空间的资源。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int core_sys_select(int n, fd_set __user *inp, fd_set __user *outp,</span></span>
<span class="line"><span>               fd_set __user *exp, struct timespec64 *end_time)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    fd_set_bits fds;</span></span>
<span class="line"><span>    void *bits;</span></span>
<span class="line"><span>    int ret, max_fds;</span></span>
<span class="line"><span>    size_t size, alloc_size;</span></span>
<span class="line"><span>    struct fdtable *fdt;</span></span>
<span class="line"><span>    /* Allocate small arguments on the stack to save memory and be faster */</span></span>
<span class="line"><span>    long stack_fds[SELECT_STACK_ALLOC/sizeof(long)];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ret = -EINVAL;</span></span>
<span class="line"><span>    if (n &amp;lt; 0)</span></span>
<span class="line"><span>        goto out_nofds;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* max_fds can increase, so grab it once to avoid race */</span></span>
<span class="line"><span>    rcu_read_lock();</span></span>
<span class="line"><span>    fdt = files_fdtable(current-&amp;gt;files);</span></span>
<span class="line"><span>    max_fds = fdt-&amp;gt;max_fds;</span></span>
<span class="line"><span>    rcu_read_unlock();</span></span>
<span class="line"><span>    if (n &amp;gt; max_fds)</span></span>
<span class="line"><span>        n = max_fds;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * We need 6 bitmaps (in/out/ex for both incoming and outgoing),</span></span>
<span class="line"><span>     * since we used fdset we need to allocate memory in units of</span></span>
<span class="line"><span>     * long-words.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    size = FDS_BYTES(n);</span></span>
<span class="line"><span>    bits = stack_fds;</span></span>
<span class="line"><span>    if (size &amp;gt; sizeof(stack_fds) / 6) {</span></span>
<span class="line"><span>        /* Not enough space in on-stack array; must use kmalloc */</span></span>
<span class="line"><span>        ret = -ENOMEM;</span></span>
<span class="line"><span>        if (size &amp;gt; (SIZE_MAX / 6))</span></span>
<span class="line"><span>            goto out_nofds;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        alloc_size = 6 * size;</span></span>
<span class="line"><span>        bits = kvmalloc(alloc_size, GFP_KERNEL);</span></span>
<span class="line"><span>        if (!bits)</span></span>
<span class="line"><span>            goto out_nofds;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fds.in      = bits;</span></span>
<span class="line"><span>    fds.out     = bits +   size;</span></span>
<span class="line"><span>    fds.ex      = bits + 2*size;</span></span>
<span class="line"><span>    fds.res_in  = bits + 3*size;</span></span>
<span class="line"><span>    fds.res_out = bits + 4*size;</span></span>
<span class="line"><span>    fds.res_ex  = bits + 5*size;</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>第二，select/poll从休眠中被唤醒时，如果监听多个fd，只要其中有一个fd有事件发生，内核就会遍历内部的list去检查到底是哪一个事件到达，并没有像epoll一样, 通过fd直接关联eventpoll对象，快速地把fd直接加入到eventpoll的就绪列表中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int do_select(int n, fd_set_bits *fds, struct timespec64 *end_time)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    retval = 0;</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        unsigned long *rinp, *routp, *rexp, *inp, *outp, *exp;</span></span>
<span class="line"><span>        bool can_busy_loop = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inp = fds-&amp;gt;in; outp = fds-&amp;gt;out; exp = fds-&amp;gt;ex;</span></span>
<span class="line"><span>        rinp = fds-&amp;gt;res_in; routp = fds-&amp;gt;res_out; rexp = fds-&amp;gt;res_ex;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; n; ++rinp, ++routp, ++rexp) {</span></span>
<span class="line"><span>            unsigned long in, out, ex, all_bits, bit = 1, mask, j;</span></span>
<span class="line"><span>            unsigned long res_in = 0, res_out = 0, res_ex = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            in = *inp++; out = *outp++; ex = *exp++;</span></span>
<span class="line"><span>            all_bits = in | out | ex;</span></span>
<span class="line"><span>            if (all_bits == 0) {</span></span>
<span class="line"><span>                i += BITS_PER_LONG;</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!poll_schedule_timeout(&amp;table, TASK_INTERRUPTIBLE,</span></span>
<span class="line"><span>                   to, slack))</span></span>
<span class="line"><span>        timed_out = 1;</span></span>
<span class="line"><span>...</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在这次答疑中，我希望通过深度分析epoll的源码实现，帮你理解epoll的实现原理。</p><p>epoll维护了一棵红黑树来跟踪所有待检测的文件描述字，黑红树的使用减少了内核和用户空间大量的数据拷贝和内存分配，大大提高了性能。</p><p>同时，epoll维护了一个链表来记录就绪事件，内核在每个文件有事件发生时将自己登记到这个就绪事件列表中，通过内核自身的文件file-eventpoll之间的回调和唤醒机制，减少了对内核描述字的遍历，大大加速了事件通知和检测的效率，这也为level-triggered和edge-triggered的实现带来了便利。</p><p>通过对比poll/select的实现，我们发现epoll确实克服了poll/select的种种弊端，不愧是Linux下高性能网络编程的皇冠。我们应该感谢Linux社区的大神们设计了这么强大的事件分发机制，让我们在Linux下可以享受高性能网络服务器带来的种种技术红利。</p>`,112)])])}const _=n(l,[["render",t]]);export{h as __pageData,_ as default};
