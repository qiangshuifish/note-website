import{_ as a,H as n,f as t,i as p}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"15 | 调度（上）：如何制定项目管理流程？","description":"","frontmatter":{},"headers":[{"level":2,"title":"调度策略与调度类","slug":"调度策略与调度类","link":"#调度策略与调度类","children":[{"level":3,"title":"实时调度策略","slug":"实时调度策略","link":"#实时调度策略","children":[]},{"level":3,"title":"普通调度策略","slug":"普通调度策略","link":"#普通调度策略","children":[]}]},{"level":2,"title":"完全公平调度算法","slug":"完全公平调度算法","link":"#完全公平调度算法","children":[]},{"level":2,"title":"调度队列与调度实体","slug":"调度队列与调度实体","link":"#调度队列与调度实体","children":[]},{"level":2,"title":"调度类是如何工作的？","slug":"调度类是如何工作的","link":"#调度类是如何工作的","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/15-调度（上）：如何制定项目管理流程？.md","filePath":"趣谈Linux操作系统/15-调度（上）：如何制定项目管理流程？.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/15-调度（上）：如何制定项目管理流程？.md"};function i(l,s,c,r,_,u){return n(),t("div",null,[...s[0]||(s[0]=[p(`<h1 id="_15-调度-上-如何制定项目管理流程" tabindex="-1">15 | 调度（上）：如何制定项目管理流程？ <a class="header-anchor" href="#_15-调度-上-如何制定项目管理流程" aria-label="Permalink to &quot;15 | 调度（上）：如何制定项目管理流程？&quot;">​</a></h1><p>前几节，我们介绍了task_struct数据结构。它就像项目管理系统一样，可以帮项目经理维护项目运行过程中的各类信息，但这并不意味着项目管理工作就完事大吉了。task_struct仅仅能够解决“ <strong>看到</strong>”的问题，咱们还要解决如何制定流程，进行项目调度的问题，也就是“ <strong>做到</strong>”的问题。</p><p>公司的人员总是有限的。无论接了多少项目，公司不可能短时间增加很多人手。有的项目比较紧急，应该先进行排期；有的项目可以缓缓，但是也不能让客户等太久。所以这个过程非常复杂，需要平衡。</p><p>对于操作系统来讲，它面对的CPU的数量是有限的，干活儿都是它们，但是进程数目远远超过CPU的数目，因而就需要进行进程的调度，有效地分配CPU的时间，既要保证进程的最快响应，也要保证进程之间的公平。这也是一个非常复杂的、需要平衡的事情。</p><h2 id="调度策略与调度类" tabindex="-1">调度策略与调度类 <a class="header-anchor" href="#调度策略与调度类" aria-label="Permalink to &quot;调度策略与调度类&quot;">​</a></h2><p>在Linux里面，进程大概可以分成两种。</p><p>一种称为 <strong>实时进程</strong>，也就是需要尽快执行返回结果的那种。这就好比我们是一家公司，接到的客户项目需求就会有很多种。有些客户的项目需求比较急，比如一定要在一两个月内完成的这种，客户会加急加钱，那这种客户的优先级就会比较高。</p><p>另一种是 <strong>普通进程</strong>，大部分的进程其实都是这种。这就好比，大部分客户的项目都是普通的需求，可以按照正常流程完成，优先级就没实时进程这么高，但是人家肯定也有确定的交付日期。</p><p>那很显然，对于这两种进程，我们的调度策略肯定是不同的。</p><p>在task_struct中，有一个成员变量，我们叫 <strong>调度策略</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unsigned int policy;</span></span></code></pre></div><p>它有以下几个定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define SCHED_NORMAL		0</span></span>
<span class="line"><span>#define SCHED_FIFO		1</span></span>
<span class="line"><span>#define SCHED_RR		2</span></span>
<span class="line"><span>#define SCHED_BATCH		3</span></span>
<span class="line"><span>#define SCHED_IDLE		5</span></span>
<span class="line"><span>#define SCHED_DEADLINE		6</span></span></code></pre></div><p>配合调度策略的，还有我们刚才说的 <strong>优先级</strong>，也在task_struct中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int prio, static_prio, normal_prio;</span></span>
<span class="line"><span>unsigned int rt_priority;</span></span></code></pre></div><p>优先级其实就是一个数值，对于实时进程，优先级的范围是0～99；对于普通进程，优先级的范围是100～139。数值越小，优先级越高。从这里可以看出，所有的实时进程都比普通进程优先级要高。毕竟，谁让人家加钱了呢。</p><h3 id="实时调度策略" tabindex="-1">实时调度策略 <a class="header-anchor" href="#实时调度策略" aria-label="Permalink to &quot;实时调度策略&quot;">​</a></h3><p>对于调度策略，其中SCHED_FIFO、SCHED_RR、SCHED_DEADLINE是实时进程的调度策略。</p><p>虽然大家都是加钱加急的项目，但是也不能乱来，还是需要有个办事流程才行。</p><p>例如， <strong>SCHED_FIFO</strong> 就是交了相同钱的，先来先服务，但是有的加钱多，可以分配更高的优先级，也就是说，高优先级的进程可以抢占低优先级的进程，而相同优先级的进程，我们遵循先来先得。</p><p>另外一种策略是，交了相同钱的，轮换着来，这就是 <strong>SCHED_RR轮流调度算法</strong>，采用时间片，相同优先级的任务当用完时间片会被放到队列尾部，以保证公平性，而高优先级的任务也是可以抢占低优先级的任务。</p><p>还有一种新的策略是 <strong>SCHED_DEADLINE</strong>，是按照任务的deadline进行调度的。当产生一个调度点的时候，DL调度器总是选择其deadline距离当前时间点最近的那个任务，并调度它执行。</p><h3 id="普通调度策略" tabindex="-1">普通调度策略 <a class="header-anchor" href="#普通调度策略" aria-label="Permalink to &quot;普通调度策略&quot;">​</a></h3><p>对于普通进程的调度策略有，SCHED_NORMAL、SCHED_BATCH、SCHED_IDLE。</p><p>既然大家的项目都没有那么紧急，就应该按照普通的项目流程，公平地分配人员。</p><p>SCHED_NORMAL是普通的进程，就相当于咱们公司接的普通项目。</p><p>SCHED_BATCH是后台进程，几乎不需要和前端进行交互。这有点像公司在接项目同时，开发一些可以复用的模块，作为公司的技术积累，从而使得在之后接新项目的时候，能够减少工作量。这类项目可以默默执行，不要影响需要交互的进程，可以降低它的优先级。</p><p>SCHED_IDLE是特别空闲的时候才跑的进程，相当于咱们学习训练类的项目，比如咱们公司很长时间没有接到外在项目了，可以弄几个这样的项目练练手。</p><p>上面无论是policy还是priority，都设置了一个变量，变量仅仅表示了应该这样这样干，但事情总要有人去干，谁呢？在task_struct里面，还有这样的成员变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct sched_class *sched_class;</span></span></code></pre></div><p>调度策略的执行逻辑，就封装在这里面，它是真正干活的那个。</p><p>sched_class有几种实现：</p><ul><li><p>stop_sched_class优先级最高的任务会使用这种策略，会中断所有其他线程，且不会被其他任务打断；</p></li><li><p>dl_sched_class就对应上面的deadline调度策略；</p></li><li><p>rt_sched_class就对应RR算法或者FIFO算法的调度策略，具体调度策略由进程的task_struct-&gt;policy指定；</p></li><li><p>fair_sched_class就是普通进程的调度策略；</p></li><li><p>idle_sched_class就是空闲进程的调度策略。</p></li></ul><p>这里实时进程的调度策略RR和FIFO相对简单一些，而且由于咱们平时常遇到的都是普通进程，在这里，咱们就重点分析普通进程的调度问题。普通进程使用的调度策略是fair_sched_class，顾名思义，对于普通进程来讲，公平是最重要的。</p><h2 id="完全公平调度算法" tabindex="-1">完全公平调度算法 <a class="header-anchor" href="#完全公平调度算法" aria-label="Permalink to &quot;完全公平调度算法&quot;">​</a></h2><p>在Linux里面，实现了一个基于CFS的调度算法。CFS全称Completely Fair Scheduling，叫完全公平调度。听起来很“公平”。那这个算法的原理是什么呢？我们来看看。</p><p>首先，你需要记录下进程的运行时间。CPU会提供一个时钟，过一段时间就触发一个时钟中断。就像咱们的表滴答一下，这个我们叫Tick。CFS会为每一个进程安排一个虚拟运行时间vruntime。如果一个进程在运行，随着时间的增长，也就是一个个tick的到来，进程的vruntime将不断增大。没有得到执行的进程vruntime不变。</p><p>显然，那些vruntime少的，原来受到了不公平的对待，需要给它补上，所以会优先运行这样的进程。</p><p>这有点像让你把一筐球平均分到N个口袋里面，你看着哪个少，就多放一些；哪个多了，就先不放。这样经过多轮，虽然不能保证球完全一样多，但是也差不多公平。</p><p>你可能会说，不还有优先级呢？如何给优先级高的进程多分时间呢？</p><p>这个简单，就相当于N个口袋，优先级高的袋子大，优先级低的袋子小。这样球就不能按照个数分配了，要按照比例来，大口袋的放了一半和小口袋放了一半，里面的球数目虽然差很多，也认为是公平的。</p><p>在更新进程运行的统计量的时候，我们其实就可以看出这个逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Update the current task&#39;s runtime statistics.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static void update_curr(struct cfs_rq *cfs_rq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sched_entity *curr = cfs_rq-&amp;gt;curr;</span></span>
<span class="line"><span>	u64 now = rq_clock_task(rq_of(cfs_rq));</span></span>
<span class="line"><span>	u64 delta_exec;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	delta_exec = now - curr-&amp;gt;exec_start;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	curr-&amp;gt;exec_start = now;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	curr-&amp;gt;sum_exec_runtime += delta_exec;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	curr-&amp;gt;vruntime += calc_delta_fair(delta_exec, curr);</span></span>
<span class="line"><span>	update_min_vruntime(cfs_rq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * delta /= w</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static inline u64 calc_delta_fair(u64 delta, struct sched_entity *se)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (unlikely(se-&amp;gt;load.weight != NICE_0_LOAD))</span></span>
<span class="line"><span>        /* delta_exec * weight / lw.weight */</span></span>
<span class="line"><span>		delta = __calc_delta(delta, NICE_0_LOAD, &amp;se-&amp;gt;load);</span></span>
<span class="line"><span>	return delta;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里得到当前的时间，以及这次的时间片开始的时间，两者相减就是这次运行的时间delta_exec ，但是得到的这个时间其实是实际运行的时间，需要做一定的转化才作为虚拟运行时间vruntime。转化方法如下：</p><p>虚拟运行时间vruntime += 实际运行时间delta_exec * NICE_0_LOAD/权重</p><p>这就是说，同样的实际运行时间，给高权重的算少了，低权重的算多了，但是当选取下一个运行进程的时候，还是按照最小的vruntime来的，这样高权重的获得的实际运行时间自然就多了。这就相当于给一个体重(权重)200斤的胖子吃两个馒头，和给一个体重100斤的瘦子吃一个馒头，然后说，你们两个吃的是一样多。这样虽然总体胖子比瘦子多吃了一倍，但是还是公平的。</p><h2 id="调度队列与调度实体" tabindex="-1">调度队列与调度实体 <a class="header-anchor" href="#调度队列与调度实体" aria-label="Permalink to &quot;调度队列与调度实体&quot;">​</a></h2><p>看来CFS需要一个数据结构来对vruntime进行排序，找出最小的那个。这个能够排序的数据结构不但需要查询的时候，能够快速找到最小的，更新的时候也需要能够快速地调整排序，要知道vruntime可是经常在变的，变了再插入这个数据结构，就需要重新排序。</p><p>能够平衡查询和更新速度的是树，在这里使用的是红黑树。</p><p>红黑树的的节点是应该包括vruntime的，称为调度实体。</p><p>在task_struct中有这样的成员变量：</p><p>struct sched_entity se;</p><p>struct sched_rt_entity rt;</p><p>struct sched_dl_entity dl;</p><p>这里有实时调度实体sched_rt_entity，Deadline调度实体sched_dl_entity，以及完全公平算法调度实体sched_entity。</p><p>看来不光CFS调度策略需要有这样一个数据结构进行排序，其他的调度策略也同样有自己的数据结构进行排序，因为任何一个策略做调度的时候，都是要区分谁先运行谁后运行。</p><p>而进程根据自己是实时的，还是普通的类型，通过这个成员变量，将自己挂在某一个数据结构里面，和其他的进程排序，等待被调度。如果这个进程是个普通进程，则通过sched_entity，将自己挂在这棵红黑树上。</p><p>对于普通进程的调度实体定义如下，这里面包含了vruntime和权重load_weight，以及对于运行时间的统计。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sched_entity {</span></span>
<span class="line"><span>	struct load_weight		load;</span></span>
<span class="line"><span>	struct rb_node			run_node;</span></span>
<span class="line"><span>	struct list_head		group_node;</span></span>
<span class="line"><span>	unsigned int			on_rq;</span></span>
<span class="line"><span>	u64				exec_start;</span></span>
<span class="line"><span>	u64				sum_exec_runtime;</span></span>
<span class="line"><span>	u64				vruntime;</span></span>
<span class="line"><span>	u64				prev_sum_exec_runtime;</span></span>
<span class="line"><span>	u64				nr_migrations;</span></span>
<span class="line"><span>	struct sched_statistics		statistics;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>下图是一个红黑树的例子。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/c2b86e79f19d811ce10774688fc0c093.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/c2b86e79f19d811ce10774688fc0c093.jpeg" alt=""></a></p><p>所有可运行的进程通过不断地插入操作最终都存储在以时间为顺序的红黑树中，vruntime最小的在树的左侧，vruntime最多的在树的右侧。 CFS调度策略会选择红黑树最左边的叶子节点作为下一个将获得CPU的任务。</p><p>这棵红黑树放在哪里呢？就像每个软件工程师写代码的时候，会将任务排成队列，做完一个做下一个。</p><p>CPU也是这样的，每个CPU都有自己的 struct rq 结构，其用于描述在此CPU上所运行的所有进程，其包括一个实时进程队列rt_rq和一个CFS运行队列cfs_rq，在调度时，调度器首先会先去实时进程队列找是否有实时进程需要运行，如果没有才会去CFS运行队列找是否有进程需要运行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct rq {</span></span>
<span class="line"><span>	/* runqueue lock: */</span></span>
<span class="line"><span>	raw_spinlock_t lock;</span></span>
<span class="line"><span>	unsigned int nr_running;</span></span>
<span class="line"><span>	unsigned long cpu_load[CPU_LOAD_IDX_MAX];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct load_weight load;</span></span>
<span class="line"><span>	unsigned long nr_load_updates;</span></span>
<span class="line"><span>	u64 nr_switches;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct cfs_rq cfs;</span></span>
<span class="line"><span>	struct rt_rq rt;</span></span>
<span class="line"><span>	struct dl_rq dl;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct task_struct *curr, *idle, *stop;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>对于普通进程公平队列cfs_rq，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* CFS-related fields in a runqueue */</span></span>
<span class="line"><span>struct cfs_rq {</span></span>
<span class="line"><span>	struct load_weight load;</span></span>
<span class="line"><span>	unsigned int nr_running, h_nr_running;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	u64 exec_clock;</span></span>
<span class="line"><span>	u64 min_vruntime;</span></span>
<span class="line"><span>#ifndef CONFIG_64BIT</span></span>
<span class="line"><span>	u64 min_vruntime_copy;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	struct rb_root tasks_timeline;</span></span>
<span class="line"><span>	struct rb_node *rb_leftmost;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct sched_entity *curr, *next, *last, *skip;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这里面rb_root指向的就是红黑树的根节点，这个红黑树在CPU看起来就是一个队列，不断地取下一个应该运行的进程。rb_leftmost指向的是最左面的节点。</p><p>到这里终于凑够数据结构了，上面这些数据结构的关系如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/ac043a08627b40b85e624477d937f3fd.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/ac043a08627b40b85e624477d937f3fd.jpeg" alt=""></a></p><h2 id="调度类是如何工作的" tabindex="-1">调度类是如何工作的？ <a class="header-anchor" href="#调度类是如何工作的" aria-label="Permalink to &quot;调度类是如何工作的？&quot;">​</a></h2><p>凑够了数据结构，接下来我们来看调度类是如何工作的。</p><p>调度类的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sched_class {</span></span>
<span class="line"><span>	const struct sched_class *next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	void (*enqueue_task) (struct rq *rq, struct task_struct *p, int flags);</span></span>
<span class="line"><span>	void (*dequeue_task) (struct rq *rq, struct task_struct *p, int flags);</span></span>
<span class="line"><span>	void (*yield_task) (struct rq *rq);</span></span>
<span class="line"><span>	bool (*yield_to_task) (struct rq *rq, struct task_struct *p, bool preempt);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	void (*check_preempt_curr) (struct rq *rq, struct task_struct *p, int flags);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct task_struct * (*pick_next_task) (struct rq *rq,</span></span>
<span class="line"><span>						struct task_struct *prev,</span></span>
<span class="line"><span>						struct rq_flags *rf);</span></span>
<span class="line"><span>	void (*put_prev_task) (struct rq *rq, struct task_struct *p);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	void (*set_curr_task) (struct rq *rq);</span></span>
<span class="line"><span>	void (*task_tick) (struct rq *rq, struct task_struct *p, int queued);</span></span>
<span class="line"><span>	void (*task_fork) (struct task_struct *p);</span></span>
<span class="line"><span>	void (*task_dead) (struct task_struct *p);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	void (*switched_from) (struct rq *this_rq, struct task_struct *task);</span></span>
<span class="line"><span>	void (*switched_to) (struct rq *this_rq, struct task_struct *task);</span></span>
<span class="line"><span>	void (*prio_changed) (struct rq *this_rq, struct task_struct *task, int oldprio);</span></span>
<span class="line"><span>	unsigned int (*get_rr_interval) (struct rq *rq,</span></span>
<span class="line"><span>					 struct task_struct *task);</span></span>
<span class="line"><span>	void (*update_curr) (struct rq *rq)</span></span></code></pre></div><p>这个结构定义了很多种方法，用于在队列上操作任务。这里请大家注意第一个成员变量，是一个指针，指向下一个调度类。</p><p>上面我们讲了，调度类分为下面这几种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern const struct sched_class stop_sched_class;</span></span>
<span class="line"><span>extern const struct sched_class dl_sched_class;</span></span>
<span class="line"><span>extern const struct sched_class rt_sched_class;</span></span>
<span class="line"><span>extern const struct sched_class fair_sched_class;</span></span>
<span class="line"><span>extern const struct sched_class idle_sched_class;</span></span></code></pre></div><p>它们其实是放在一个链表上的。这里我们以调度最常见的操作， <strong>取下一个任务</strong> 为例，来解析一下。可以看到，这里面有一个for_each_class循环，沿着上面的顺序，依次调用每个调度类的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Pick up the highest-prio task:</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static inline struct task_struct *</span></span>
<span class="line"><span>pick_next_task(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	const struct sched_class *class;</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	for_each_class(class) {</span></span>
<span class="line"><span>		p = class-&amp;gt;pick_next_task(rq, prev, rf);</span></span>
<span class="line"><span>		if (p) {</span></span>
<span class="line"><span>			if (unlikely(p == RETRY_TASK))</span></span>
<span class="line"><span>				goto again;</span></span>
<span class="line"><span>			return p;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这就说明，调度的时候是从优先级最高的调度类到优先级低的调度类，依次执行。而对于每种调度类，有自己的实现，例如，CFS就有fair_sched_class。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct sched_class fair_sched_class = {</span></span>
<span class="line"><span>	.next			= &amp;idle_sched_class,</span></span>
<span class="line"><span>	.enqueue_task		= enqueue_task_fair,</span></span>
<span class="line"><span>	.dequeue_task		= dequeue_task_fair,</span></span>
<span class="line"><span>	.yield_task		= yield_task_fair,</span></span>
<span class="line"><span>	.yield_to_task		= yield_to_task_fair,</span></span>
<span class="line"><span>	.check_preempt_curr	= check_preempt_wakeup,</span></span>
<span class="line"><span>	.pick_next_task		= pick_next_task_fair,</span></span>
<span class="line"><span>	.put_prev_task		= put_prev_task_fair,</span></span>
<span class="line"><span>	.set_curr_task          = set_curr_task_fair,</span></span>
<span class="line"><span>	.task_tick		= task_tick_fair,</span></span>
<span class="line"><span>	.task_fork		= task_fork_fair,</span></span>
<span class="line"><span>	.prio_changed		= prio_changed_fair,</span></span>
<span class="line"><span>	.switched_from		= switched_from_fair,</span></span>
<span class="line"><span>	.switched_to		= switched_to_fair,</span></span>
<span class="line"><span>	.get_rr_interval	= get_rr_interval_fair,</span></span>
<span class="line"><span>	.update_curr		= update_curr_fair,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>对于同样的pick_next_task选取下一个要运行的任务这个动作，不同的调度类有自己的实现。fair_sched_class的实现是pick_next_task_fair，rt_sched_class的实现是pick_next_task_rt。</p><p>我们会发现这两个函数是操作不同的队列，pick_next_task_rt操作的是rt_rq，pick_next_task_fair操作的是cfs_rq。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct task_struct *</span></span>
<span class="line"><span>pick_next_task_rt(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>	struct rt_rq *rt_rq = &amp;rq-&amp;gt;rt;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct task_struct *</span></span>
<span class="line"><span>pick_next_task_fair(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cfs_rq *cfs_rq = &amp;rq-&amp;gt;cfs;</span></span>
<span class="line"><span>	struct sched_entity *se;</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样整个运行的场景就串起来了，在每个CPU上都有一个队列rq，这个队列里面包含多个子队列，例如rt_rq和cfs_rq，不同的队列有不同的实现方式，cfs_rq就是用红黑树实现的。</p><p>当有一天，某个CPU需要找下一个任务执行的时候，会按照优先级依次调用调度类，不同的调度类操作不同的队列。当然rt_sched_class先被调用，它会在rt_rq上找下一个任务，只有找不到的时候，才轮到fair_sched_class被调用，它会在cfs_rq上找下一个任务。这样保证了实时任务的优先级永远大于普通任务。</p><p>下面我们仔细看一下sched_class定义的与调度有关的函数。</p><ul><li><p>enqueue_task向就绪队列中添加一个进程，当某个进程进入可运行状态时，调用这个函数；</p></li><li><p>dequeue_task 将一个进程从就绪队列中删除；</p></li><li><p>pick_next_task 选择接下来要运行的进程；</p></li><li><p>put_prev_task 用另一个进程代替当前运行的进程；</p></li><li><p>set_curr_task 用于修改调度策略；</p></li><li><p>task_tick 每次周期性时钟到的时候，这个函数被调用，可能触发调度。</p></li></ul><p>在这里面，我们重点看fair_sched_class对于pick_next_task的实现pick_next_task_fair，获取下一个进程。调用路径如下：pick_next_task_fair-&gt;pick_next_entity-&gt;__pick_first_entity。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sched_entity *__pick_first_entity(struct cfs_rq *cfs_rq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct rb_node *left = rb_first_cached(&amp;cfs_rq-&amp;gt;tasks_timeline);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!left)</span></span>
<span class="line"><span>		return NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return rb_entry(left, struct sched_entity, run_node);</span></span></code></pre></div><p>从这个函数的实现可以看出，就是从红黑树里面取最左面的节点。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>好了，这一节我们讲了调度相关的数据结构，还是比较复杂的。一个CPU上有一个队列，CFS的队列是一棵红黑树，树的每一个节点都是一个sched_entity，每个sched_entity都属于一个task_struct，task_struct里面有指针指向这个进程属于哪个调度类。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/10381dbafe0f78d80beb87560a9506af.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/10381dbafe0f78d80beb87560a9506af.jpeg" alt=""></a></p><p>在调度的时候，依次调用调度类的函数，从CPU的队列中取出下一个进程。上面图中的调度器、上下文切换这一节我们没有讲，下一节我们讲讲基于这些数据结构，如何实现调度。</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这里讲了进程调度的策略和算法，你知道如何通过API设置进程和线程的调度策略吗？你可以写个程序尝试一下。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93251/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,99)])])}const h=a(e,[["render",i]]);export{o as __pageData,h as default};
