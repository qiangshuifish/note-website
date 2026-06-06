import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"40 | IPC（上）：不同项目组之间抢资源，如何协调？","description":"","frontmatter":{},"headers":[{"level":2,"title":"共享内存","slug":"共享内存","link":"#共享内存","children":[]},{"level":2,"title":"信号量","slug":"信号量","link":"#信号量","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/40-IPC（上）：不同项目组之间抢资源，如何协调？.md","filePath":"趣谈Linux操作系统/40-IPC（上）：不同项目组之间抢资源，如何协调？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/40-IPC（上）：不同项目组之间抢资源，如何协调？.md"};function i(l,s,c,r,o,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_40-ipc-上-不同项目组之间抢资源-如何协调" tabindex="-1">40 | IPC（上）：不同项目组之间抢资源，如何协调？ <a class="header-anchor" href="#_40-ipc-上-不同项目组之间抢资源-如何协调" aria-label="Permalink to &quot;40 | IPC（上）：不同项目组之间抢资源，如何协调？&quot;">​</a></h1><p>我们前面讲了，如果项目组之间需要紧密合作，那就需要共享内存，这样就像把两个项目组放在一个会议室一起沟通，会非常高效。这一节，我们就来详细讲讲这个进程之间共享内存的机制。</p><p>有了这个机制，两个进程可以像访问自己内存中的变量一样，访问共享内存的变量。但是同时问题也来了，当两个进程共享内存了，就会存在同时读写的问题，就需要对于共享的内存进行保护，就需要信号量这样的同步协调机制。这些也都是我们这节需要探讨的问题。下面我们就一一来看。</p><p>共享内存和信号量也是System V系列的进程间通信机制，所以很多地方和我们讲过的消息队列有点儿像。为了将共享内存和信号量结合起来使用，我这里定义了一个share.h头文件，里面放了一些共享内存和信号量在每个进程都需要的函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/ipc.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/shm.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/types.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/sem.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define MAX_NUM 128</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct shm_data {</span></span>
<span class="line"><span>  int data[MAX_NUM];</span></span>
<span class="line"><span>  int datalength;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>union semun {</span></span>
<span class="line"><span>  int val;</span></span>
<span class="line"><span>  struct semid_ds *buf;</span></span>
<span class="line"><span>  unsigned short int *array;</span></span>
<span class="line"><span>  struct seminfo *__buf;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int get_shmid(){</span></span>
<span class="line"><span>  int shmid;</span></span>
<span class="line"><span>  key_t key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if((key = ftok(&quot;/root/sharememory/sharememorykey&quot;, 1024)) &amp;lt; 0){</span></span>
<span class="line"><span>      perror(&quot;ftok error&quot;);</span></span>
<span class="line"><span>          return -1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  shmid = shmget(key, sizeof(struct shm_data), IPC_CREAT|0777);</span></span>
<span class="line"><span>  return shmid;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int get_semaphoreid(){</span></span>
<span class="line"><span>  int semid;</span></span>
<span class="line"><span>  key_t key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if((key = ftok(&quot;/root/sharememory/semaphorekey&quot;, 1024)) &amp;lt; 0){</span></span>
<span class="line"><span>      perror(&quot;ftok error&quot;);</span></span>
<span class="line"><span>          return -1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  semid = semget(key, 1, IPC_CREAT|0777);</span></span>
<span class="line"><span>  return semid;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int semaphore_init (int semid) {</span></span>
<span class="line"><span>  union semun argument;</span></span>
<span class="line"><span>  unsigned short values[1];</span></span>
<span class="line"><span>  values[0] = 1;</span></span>
<span class="line"><span>  argument.array = values;</span></span>
<span class="line"><span>  return semctl (semid, 0, SETALL, argument);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int semaphore_p (int semid) {</span></span>
<span class="line"><span>  struct sembuf operations[1];</span></span>
<span class="line"><span>  operations[0].sem_num = 0;</span></span>
<span class="line"><span>  operations[0].sem_op = -1;</span></span>
<span class="line"><span>  operations[0].sem_flg = SEM_UNDO;</span></span>
<span class="line"><span>  return semop (semid, operations, 1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int semaphore_v (int semid) {</span></span>
<span class="line"><span>  struct sembuf operations[1];</span></span>
<span class="line"><span>  operations[0].sem_num = 0;</span></span>
<span class="line"><span>  operations[0].sem_op = 1;</span></span>
<span class="line"><span>  operations[0].sem_flg = SEM_UNDO;</span></span>
<span class="line"><span>  return semop (semid, operations, 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="共享内存" tabindex="-1">共享内存 <a class="header-anchor" href="#共享内存" aria-label="Permalink to &quot;共享内存&quot;">​</a></h2><p>我们先来看里面对于共享内存的操作。</p><p>首先，创建之前，我们要有一个key来唯一标识这个共享内存。这个key可以根据文件系统上的一个文件的inode随机生成。</p><p>然后，我们需要创建一个共享内存，就像创建一个消息队列差不多，都是使用xxxget来创建。其中，创建共享内存使用的是下面这个函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int shmget(key_t key, size_t size, int shmflag);</span></span></code></pre></div><p>其中，key就是前面生成的那个key，shmflag如果为IPC_CREAT，就表示新创建，还可以指定读写权限0777。</p><p>对于共享内存，需要指定一个大小size，这个一般要申请多大呢？一个最佳实践是，我们将多个进程需要共享的数据放在一个struct里面，然后这里的size就应该是这个struct的大小。这样每一个进程得到这块内存后，只要强制将类型转换为这个struct类型，就能够访问里面的共享数据了。</p><p>在这里，我们定义了一个struct shm_data结构。这里面有两个成员，一个是一个整型的数组，一个是数组中元素的个数。</p><p>生成了共享内存以后，接下来就是将这个共享内存映射到进程的虚拟地址空间中。我们使用下面这个函数来进行操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void *shmat(int  shm_id, const  void *addr, int shmflg);</span></span></code></pre></div><p>这里面的shm_id，就是上面创建的共享内存的id，addr就是指定映射在某个地方。如果不指定，则内核会自动选择一个地址，作为返回值返回。得到了返回地址以后，我们需要将指针强制类型转换为struct shm_data结构，就可以使用这个指针设置data和datalength了。</p><p>当共享内存使用完毕，我们可以通过shmdt解除它到虚拟内存的映射。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int shmdt(const  void *shmaddr)；</span></span></code></pre></div><h2 id="信号量" tabindex="-1">信号量 <a class="header-anchor" href="#信号量" aria-label="Permalink to &quot;信号量&quot;">​</a></h2><p>看完了共享内存，接下来我们再来看信号量。信号量以集合的形式存在的。</p><p>首先，创建之前，我们同样需要有一个key，来唯一标识这个信号量集合。这个key同样可以根据文件系统上的一个文件的inode随机生成。</p><p>然后，我们需要创建一个信号量集合，同样也是使用xxxget来创建，其中创建信号量集合使用的是下面这个函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int semget(key_t key, int nsems, int semflg);</span></span></code></pre></div><p>这里面的key，就是前面生成的那个key，shmflag如果为IPC_CREAT，就表示新创建，还可以指定读写权限0777。</p><p>这里，nsems表示这个信号量集合里面有几个信号量，最简单的情况下，我们设置为1。</p><p>信号量往往代表某种资源的数量，如果用信号量做互斥，那往往将信号量设置为1。这就是上面代码中semaphore_init函数的作用，这里面调用semctl函数，将这个信号量集合的中的第0个信号量，也即唯一的这个信号量设置为1。</p><p>对于信号量，往往要定义两种操作，P操作和V操作。对应上面代码中semaphore_p函数和semaphore_v函数，semaphore_p会调用semop函数将信号量的值减一，表示申请占用一个资源，当发现当前没有资源的时候，进入等待。semaphore_v会调用semop函数将信号量的值加一，表示释放一个资源，释放之后，就允许等待中的其他进程占用这个资源。</p><p>我们可以用这个信号量，来保护共享内存中的struct shm_data，使得同时只有一个进程可以操作这个结构。</p><p>你是否记得咱们讲线程同步机制的时候，构建了一个老板分配活的场景。这里我们同样构建一个场景，分为producer.c和consumer.c，其中producer也即生产者，负责往struct shm_data塞入数据，而consumer.c负责处理struct shm_data中的数据。</p><p>下面我们来看producer.c的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;share.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main() {</span></span>
<span class="line"><span>  void *shm = NULL;</span></span>
<span class="line"><span>  struct shm_data *shared = NULL;</span></span>
<span class="line"><span>  int shmid = get_shmid();</span></span>
<span class="line"><span>  int semid = get_semaphoreid();</span></span>
<span class="line"><span>  int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  shm = shmat(shmid, (void*)0, 0);</span></span>
<span class="line"><span>  if(shm == (void*)-1){</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  shared = (struct shm_data*)shm;</span></span>
<span class="line"><span>  memset(shared, 0, sizeof(struct shm_data));</span></span>
<span class="line"><span>  semaphore_init(semid);</span></span>
<span class="line"><span>  while(1){</span></span>
<span class="line"><span>    semaphore_p(semid);</span></span>
<span class="line"><span>    if(shared-&amp;gt;datalength &amp;gt; 0){</span></span>
<span class="line"><span>      semaphore_v(semid);</span></span>
<span class="line"><span>      sleep(1);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      printf(&quot;how many integers to caculate : &quot;);</span></span>
<span class="line"><span>      scanf(&quot;%d&quot;,&amp;shared-&amp;gt;datalength);</span></span>
<span class="line"><span>      if(shared-&amp;gt;datalength &amp;gt; MAX_NUM){</span></span>
<span class="line"><span>        perror(&quot;too many integers.&quot;);</span></span>
<span class="line"><span>        shared-&amp;gt;datalength = 0;</span></span>
<span class="line"><span>        semaphore_v(semid);</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      for(i=0;i&amp;lt;shared-&amp;gt;datalength;i++){</span></span>
<span class="line"><span>        printf(&quot;Input the %d integer : &quot;, i);</span></span>
<span class="line"><span>        scanf(&quot;%d&quot;,&amp;shared-&amp;gt;data[i]);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      semaphore_v(semid);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，get_shmid创建了共享内存，get_semaphoreid创建了信号量集合，然后shmat将共享内存映射到了虚拟地址空间的shm指针指向的位置，然后通过强制类型转换，shared的指针指向放在共享内存里面的struct shm_data结构，然后初始化为0。semaphore_init将信号量进行了初始化。</p><p>接着，producer进入了一个无限循环。在这个循环里面，我们先通过semaphore_p申请访问共享内存的权利，如果发现datalength大于零，说明共享内存里面的数据没有被处理过，于是semaphore_v释放权利，先睡一会儿，睡醒了再看。如果发现datalength等于0，说明共享内存里面的数据被处理完了，于是开始往里面放数据。让用户输入多少个数，然后每个数是什么，都放在struct shm_data结构中，然后semaphore_v释放权利，等待其他的进程将这些数拿去处理。</p><p>我们再来看consumer的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;share.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main() {</span></span>
<span class="line"><span>  void *shm = NULL;</span></span>
<span class="line"><span>  struct shm_data *shared = NULL;</span></span>
<span class="line"><span>  int shmid = get_shmid();</span></span>
<span class="line"><span>  int semid = get_semaphoreid();</span></span>
<span class="line"><span>  int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  shm = shmat(shmid, (void*)0, 0);</span></span>
<span class="line"><span>  if(shm == (void*)-1){</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  shared = (struct shm_data*)shm;</span></span>
<span class="line"><span>  while(1){</span></span>
<span class="line"><span>    semaphore_p(semid);</span></span>
<span class="line"><span>    if(shared-&amp;gt;datalength &amp;gt; 0){</span></span>
<span class="line"><span>      int sum = 0;</span></span>
<span class="line"><span>      for(i=0;i&amp;lt;shared-&amp;gt;datalength-1;i++){</span></span>
<span class="line"><span>        printf(&quot;%d+&quot;,shared-&amp;gt;data[i]);</span></span>
<span class="line"><span>        sum += shared-&amp;gt;data[i];</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      printf(&quot;%d&quot;,shared-&amp;gt;data[shared-&amp;gt;datalength-1]);</span></span>
<span class="line"><span>      sum += shared-&amp;gt;data[shared-&amp;gt;datalength-1];</span></span>
<span class="line"><span>      printf(&quot;=%d\\n&quot;,sum);</span></span>
<span class="line"><span>      memset(shared, 0, sizeof(struct shm_data));</span></span>
<span class="line"><span>      semaphore_v(semid);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      semaphore_v(semid);</span></span>
<span class="line"><span>      printf(&quot;no tasks, waiting.\\n&quot;);</span></span>
<span class="line"><span>      sleep(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，get_shmid获得producer创建的共享内存，get_semaphoreid获得producer创建的信号量集合，然后shmat将共享内存映射到了虚拟地址空间的shm指针指向的位置，然后通过强制类型转换，shared的指针指向放在共享内存里面的struct shm_data结构。</p><p>接着，consumer进入了一个无限循环，在这个循环里面，我们先通过semaphore_p申请访问共享内存的权利，如果发现datalength等于0，就说明没什么活干，需要等待。如果发现datalength大于0，就说明有活干，于是将datalength个整型数字从data数组中取出来求和。最后将struct shm_data清空为0，表示任务处理完毕，通过semaphore_v释放权利。</p><p>通过程序创建的共享内存和信号量集合，我们可以通过命令ipcs查看。当然，我们也可以通过ipcrm进行删除。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ipcs</span></span>
<span class="line"><span>------ Message Queues --------</span></span>
<span class="line"><span>key        msqid      owner      perms      used-bytes   messages</span></span>
<span class="line"><span>------ Shared Memory Segments --------</span></span>
<span class="line"><span>key        shmid      owner      perms      bytes      nattch     status</span></span>
<span class="line"><span>0x00016988 32768      root       777        516        0</span></span>
<span class="line"><span>------ Semaphore Arrays --------</span></span>
<span class="line"><span>key        semid      owner      perms      nsems</span></span>
<span class="line"><span>0x00016989 32768      root       777        1</span></span></code></pre></div><p>下面我们来运行一下producer和consumer，可以得到下面的结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ./producer</span></span>
<span class="line"><span>how many integers to caculate : 2</span></span>
<span class="line"><span>Input the 0 integer : 3</span></span>
<span class="line"><span>Input the 1 integer : 4</span></span>
<span class="line"><span>how many integers to caculate : 4</span></span>
<span class="line"><span>Input the 0 integer : 3</span></span>
<span class="line"><span>Input the 1 integer : 4</span></span>
<span class="line"><span>Input the 2 integer : 5</span></span>
<span class="line"><span>Input the 3 integer : 6</span></span>
<span class="line"><span>how many integers to caculate : 7</span></span>
<span class="line"><span>Input the 0 integer : 9</span></span>
<span class="line"><span>Input the 1 integer : 8</span></span>
<span class="line"><span>Input the 2 integer : 7</span></span>
<span class="line"><span>Input the 3 integer : 6</span></span>
<span class="line"><span>Input the 4 integer : 5</span></span>
<span class="line"><span>Input the 5 integer : 4</span></span>
<span class="line"><span>Input the 6 integer : 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ./consumer</span></span>
<span class="line"><span>3+4=7</span></span>
<span class="line"><span>3+4+5+6=18</span></span>
<span class="line"><span>9+8+7+6+5+4+3=42</span></span></code></pre></div><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节的内容差不多了，我们来总结一下。共享内存和信号量的配合机制，如下图所示：</p><ul><li>无论是共享内存还是信号量，创建与初始化都遵循同样流程，通过ftok得到key，通过xxxget创建对象并生成id；</li><li>生产者和消费者都通过shmat将共享内存映射到各自的内存空间，在不同的进程里面映射的位置不同；</li><li>为了访问共享内存，需要信号量进行保护，信号量需要通过semctl初始化为某个值；</li><li>接下来生产者和消费者要通过semop(-1)来竞争信号量，如果生产者抢到信号量则写入，然后通过semop(+1)释放信号量，如果消费者抢到信号量则读出，然后通过semop(+1)释放信号量；</li><li>共享内存使用完毕，可以通过shmdt来解除映射。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103724/469552bffe601d594c432d4fad97490b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103724/469552bffe601d594c432d4fad97490b.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>信号量大于1的情况下，应该如何使用？你可以试着构建一个场景。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103724/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103724/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,49)])])}const u=n(t,[["render",i]]);export{m as __pageData,u as default};
