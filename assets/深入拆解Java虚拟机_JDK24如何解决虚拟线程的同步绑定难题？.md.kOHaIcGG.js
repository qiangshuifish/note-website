import{_ as n,H as p,f as a,i as e}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"JDK 24 如何解决虚拟线程的同步绑定难题？","description":"","frontmatter":{},"headers":[{"level":2,"title":"虚拟线程","slug":"虚拟线程","link":"#虚拟线程","children":[]},{"level":2,"title":"哲学家就餐问题","slug":"哲学家就餐问题","link":"#哲学家就餐问题","children":[]},{"level":2,"title":"JEP 491：同步虚拟线程无需绑定平台线程","slug":"jep-491-同步虚拟线程无需绑定平台线程","link":"#jep-491-同步虚拟线程无需绑定平台线程","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"深入拆解Java虚拟机/JDK24如何解决虚拟线程的同步绑定难题？.md","filePath":"深入拆解Java虚拟机/JDK24如何解决虚拟线程的同步绑定难题？.md","lastUpdated":1779821039000}'),i={name:"深入拆解Java虚拟机/JDK24如何解决虚拟线程的同步绑定难题？.md"};function l(c,s,o,t,h,r){return p(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="jdk-24-如何解决虚拟线程的同步绑定难题" tabindex="-1">JDK 24 如何解决虚拟线程的同步绑定难题？ <a class="header-anchor" href="#jdk-24-如何解决虚拟线程的同步绑定难题" aria-label="Permalink to &quot;JDK 24 如何解决虚拟线程的同步绑定难题？&quot;">​</a></h1><p>你好，我是郑雨迪。</p><p>Java 线程是 Java 程序执行的基本单位，相信大家对此并不陌生。JVM 允许应用程序同时运行多个线程，从而实现并发执行。</p><p>传统的 Java 线程依赖操作系统的原生线程，由操作系统负责调度和管理。这类线程的内存开销较大，单个线程的栈空间通常超过 1MB（可通过 -Xss 或 -XX:ThreadStackSize 进行调整，最小值为 1MB）。</p><p>例如，在 Web 服务器中，如果为每个请求创建一个 Java 线程，处理百万级别的请求将消耗超过 1TB 的内存用于栈空间，这在实际应用中难以承受。</p><p>因此，JVM 能够创建的线程数量受限，难以满足高并发场景的需求，与主流的异步编程模型存在一定冲突。</p><h2 id="虚拟线程" tabindex="-1">虚拟线程 <a class="header-anchor" href="#虚拟线程" aria-label="Permalink to &quot;虚拟线程&quot;">​</a></h2><p><strong>JDK 21 的 Loom 项目 <a href="https://openjdk.org/jeps/444" target="_blank" rel="noreferrer">[1]</a> 将传统的 Java 线程划分为虚拟线程（virtual thread）和平台线程（platform thread）。</strong></p><p>平台线程本质上仍是原来的 Java 线程，同样与操作系统的原生线程一一映射，并且需要固定的大容量栈空间，因此 JVM 能够创建的平台线程数量十分有限。</p><p>相比之下，虚拟线程采用了可变栈空间的设计。 <strong>对于调用层级较浅的简单任务，其栈空间占用极小。</strong> 这一特性使得 JVM 能够同时创建大量的虚拟线程，从而支持 “一个任务一个线程” 的编程模型，提高并发能力。</p><p>虚拟线程的高效与灵活性带来了一定的代价——它们无法直接执行，而必须依赖平台线程作为其载体（carrier）。</p><p>当一个虚拟线程需要运行时，JVM 会从空闲的平台线程中挑选一个，并在其上加载（mount）该虚拟线程进行执行。若虚拟线程进入阻塞或等待状态，平台线程会卸载（unmount）该虚拟线程，以便运行其他虚拟线程。一旦阻塞结束，JVM 会为该虚拟线程重新分配平台线程，继续执行任务。</p><p>然而，在实际应用中，开发者发现一个与虚拟线程设计理念相悖的问题——部分 JVM 操作可能导致虚拟线程被绑定到平台线程，无法卸载。这意味着，当虚拟线程执行某些阻塞操作时，不仅自身会被阻塞，对应的平台线程及其所在的操作系统线程也会被占用，影响并发性能。</p><p>在 JVM 操作中，最常见的一种会导致虚拟线程与平台线程绑定的情况是同步操作。例如，以下代码演示了这一问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>synchronized (uncontendedLock) {</span></span>
<span class="line"><span>  synchronized (contendedLock) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假设在执行第二行 synchronized 语句时，contendedLock 已被其他线程占用，那么当前虚拟线程将进入阻塞状态。按照虚拟线程的设计，平台线程本应卸载该虚拟线程，并调度其他虚拟线程运行，以最大化计算资源的利用。</p><p>然而，JVM 会将虚拟线程固定在平台线程上，导致平台线程无法卸载虚拟线程，从而一同陷入阻塞。</p><p>这主要有两个原因：首先，第一行的 synchronized 操作执行后，当前虚拟线程已持有 uncontendedLock 的锁，而加载其他虚拟线程将会导致 uncontendedLock 的所有者变更；其次，在第二行 synchronized 操作加锁失败时，虚拟线程正在运行 JVM 本地代码，而虚拟线程的卸载必须在 Java 层面完成。</p><p>在最糟糕的情况下，所有平台线程都因锁竞争而被阻塞，而唯一能释放锁的虚拟线程却无法执行，因为没有可用的平台线程来调度它。最终，应用程序陷入死锁，无法继续运行。</p><h2 id="哲学家就餐问题" tabindex="-1">哲学家就餐问题 <a class="header-anchor" href="#哲学家就餐问题" aria-label="Permalink to &quot;哲学家就餐问题&quot;">​</a></h2><p>我们可以通过经典的并发问题——哲学家就餐问题，来进一步探讨虚拟线程被绑定到平台线程可能引发的死锁情况。</p><p>在传统的哲学家就餐问题中，死锁通常源于线程加锁顺序的不一致，导致循环等待。</p><p>当所有哲学家先拿起左侧餐具并加锁，再尝试获取右侧餐具的锁时，会发现该餐具已被相邻的哲学家占用，导致无法完成就餐，也无法释放左侧餐具。最终，所有哲学家线程陷入相互等待，程序进入死锁状态。</p><p>为了解决这一经典死锁问题，有多种方法可供选择，例如使用 ReentrantLock，或者增加一只额外的餐具，确保至少有一位哲学家能够顺利获取两只餐具完成就餐。以下是改进后的代码示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat DiningPhilosophers.java</span></span>
<span class="line"><span>record Philosopher(int id, CyclicBarrier barrier, Object leftChopstick, Object rightChopstick) {</span></span>
<span class="line"><span>    void eat() {</span></span>
<span class="line"><span>        synchronized (leftChopstick) {</span></span>
<span class="line"><span>            System.out.println(&quot;Philosopher &quot; + id + &quot; picked up left chopstick...&quot;);</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                barrier.await();</span></span>
<span class="line"><span>            } catch (InterruptedException | BrokenBarrierException e) {</span></span>
<span class="line"><span>                throw new RuntimeException(e);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            synchronized (rightChopstick) {</span></span>
<span class="line"><span>                System.out.println(&quot;Philosopher &quot; + id + &quot; picked up right chopstick...&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    System.out.println(&quot;&gt; Running on JDK &quot; + Runtime.version());</span></span>
<span class="line"><span>    final int numThreads = Integer.parseInt(args[0]);</span></span>
<span class="line"><span>    final boolean additionalChopstick = Boolean.parseBoolean(args[1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Object[] chopsticks = new Object[additionalChopstick ? numThreads + 1 : numThreads];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; chopsticks.length; i++) {</span></span>
<span class="line"><span>        chopsticks[i] = new Object();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    CyclicBarrier barrier = new CyclicBarrier(numThreads, () -&gt;</span></span>
<span class="line"><span>            System.out.println(&quot;All threads have reached the fence, proceeding...\\n&quot;));</span></span>
<span class="line"><span>    try (ExecutorService virtualThreadExecutor = Executors.newVirtualThreadPerTaskExecutor()) {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; numThreads; i++) {</span></span>
<span class="line"><span>            virtualThreadExecutor.submit(new Philosopher(i, barrier, chopsticks[i], chopsticks[(i + 1) % chopsticks.length])::eat);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># use --enable-preview to enable implicitly declared classes on JDK 23</span></span>
<span class="line"><span>$ java --enable-preview  DiningPhilosophers.java 10 false</span></span>
<span class="line"><span>&gt; Running on JDK 23.0.2+7-58</span></span>
<span class="line"><span>Philosopher 4 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 2 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 7 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 9 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 0 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 5 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 1 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 3 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 8 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 6 picked up left chopstick...</span></span>
<span class="line"><span>All threads have reached the fence, proceeding...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>^C⏎</span></span>
<span class="line"><span>$ java --enable-preview  DiningPhilosophers.java 10 true</span></span>
<span class="line"><span>&gt; Running on JDK 23.0.2+7-58</span></span>
<span class="line"><span>Philosopher 0 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 8 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 3 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 2 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 6 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 7 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 4 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 9 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 1 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 5 picked up left chopstick...</span></span>
<span class="line"><span>All threads have reached the fence, proceeding...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Philosopher 9 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 8 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 7 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 6 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 5 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 4 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 3 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 2 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 1 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 0 picked up right chopstick...</span></span></code></pre></div><p>为了更直观地展示最坏情况，我们使用 CyclicBarrier 来确保所有哲学家线程都先获取左侧餐具。在额外增加一只餐具的情况下，第 N-1 位哲学家率先完成就餐并释放左侧餐具，接着第 N-2 位哲学家获取该餐具并开始就餐，依次类推。</p><p>然而， <strong>由于我们采用的是虚拟线程，当它们尝试获取左侧餐具的锁时，JVM 会将该虚拟线程绑定到运行它的平台线程。</strong></p><p>在上述代码中，虚拟线程执行的同步代码块中包含两个可能导致阻塞的操作，分别为 CyclicBarrier 的 await() 方法，以及嵌套的 synchronized 代码块。当虚拟线程执行这些操作时，它所依赖的平台线程同样会陷入阻塞，无法调度其他虚拟线程。</p><p>以 CyclicBarrier 为例，它要求所有虚拟线程都到达屏障后才能继续执行。在此之前，所有到达屏障的虚拟线程及其所依赖的平台线程都会进入阻塞状态。如果平台线程数量不足，部分虚拟线程将无法运行，也就无法到达屏障，进而导致整个系统陷入死锁，因为其他等待中的虚拟线程无法恢复执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ java --enable-preview  DiningPhilosophers.java 11 true</span></span>
<span class="line"><span>&gt; Running on JDK 23.0.2+7-58</span></span>
<span class="line"><span>Philosopher 0 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 9 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 3 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 1 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 5 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 2 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 6 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 7 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 4 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 8 picked up left chopstick...</span></span></code></pre></div><p>在我的运行环境中（Apple M4，10 cores），Executors.newVirtualThreadPerTaskExecutor 线程池共包含 10 个平台线程。当哲学家的数量增加到 11 位时，前 10 个哲学家所对应的虚拟线程可以顺利运行并到达屏障。然而，由于缺少可用的平台线程，第 11 个虚拟线程无法被加载并执行，导致整个系统陷入死锁。</p><p>为了解决这个问题，我们可以向线程池增加额外的平台线程，希望新的平台线程可以加载并执行卡住的虚拟线程，从而解除死锁。</p><p>然而， <strong>这种方法并不具备可扩展性</strong>：如果程序涉及百万级别的哲学家，受限于 JVM 的内存空间，无法创建如此多的平台线程，因此增加平台线程并不能从根本上解决问题。</p><p>这一死锁问题一直是 Loom 项目落地的重大挑战。尽管 Loom 的设计者鼓励开发人员使用 java.util.concurrent 包来管理并发操作，然而，许多应用程序依赖的第三方库仍然使用 synchronized 进行锁管理。这些不可控的同步代码同样可能导致平台线程阻塞，从而破坏虚拟线程的高效调度。</p><h2 id="jep-491-同步虚拟线程无需绑定平台线程" tabindex="-1">JEP 491：同步虚拟线程无需绑定平台线程 <a class="header-anchor" href="#jep-491-同步虚拟线程无需绑定平台线程" aria-label="Permalink to &quot;JEP 491：同步虚拟线程无需绑定平台线程&quot;">​</a></h2><p><strong>JDK 24 并入了 JEP 491 <a href="https://openjdk.org/jeps/491" target="_blank" rel="noreferrer">[2]</a>，从根本上解决了虚拟线程在同步操作时被绑定到平台线程的问题</strong>。</p><p>要理解 JEP 491 的工作原理，我们首先需要弄清为什么同步操作会导致虚拟线程与平台线程绑定。</p><p>JVM 实现 synchronized 关键字的方式主要包括两种轻量级锁和一种重量级锁，它们的本质都是将被加锁的 Java 对象与当前线程关联，以标识锁的归属权。</p><p>例如，新轻量级锁通过在线程本地空间维护一个锁栈来记录加锁的 Java 对象，旧轻量级锁则直接在标记字段中存储指向线程栈的指针，而重量级锁通过让 Java 对象头的标记字段指向一个 ObjectMonitor 来管理锁状态，其中包含持有锁的线程信息以及等待锁的线程列表。</p><p>在 JEP 491 之前，这些锁所关联的线程始终是平台线程。如果某个虚拟线程持有锁后被卸载，而平台线程被分配去执行另一个虚拟线程，就会导致锁的归属突然发生变化。这种情况类似于哲学家就餐问题中，某位哲学家意外获得了另一位可能不相临的哲学家的餐具，从而破坏了锁的正确性，可能引发严重的并发错误。</p><p>为避免这种混乱，JVM 采取了一刀切的策略，即在虚拟线程持有锁后，强制绑定到平台线程，确保该虚拟线程不会被卸载。代价是，一旦虚拟线程进入阻塞，平台线程也随之被阻塞，从而降低系统的并发能力。</p><p><strong>JEP 491 通过让 Java 对象的锁直接指向虚拟线程而非平台线程，从根本上解决了这个问题。</strong></p><p>在新轻量级锁的实现中，JVM 在虚拟线程被卸载时，会将锁栈备份到虚拟线程独立的存储区域，并在虚拟线程被重新调度时恢复该锁栈，以确保锁的归属不变。由于每个平台线程在加载不同的虚拟线程时都会覆盖自身的对象栈，因此不会发生锁归属错乱的问题。</p><p>需要注意的是，这里蕴含了一个隐藏条件，那便是 <strong>平台线程自身不能获取轻量级锁。</strong> 否则，在加载虚拟线程时，其拥有的轻量级锁记录会被覆盖。</p><p>相比之下，旧轻量级锁的处理则更加复杂。由于旧轻量级锁直接在标记字段中存储指向线程栈的指针，这意味着当虚拟线程被卸载时，JVM 需要找到所有被锁定的 Java 对象，并修改其标记字段以指向虚拟线程的存储区域。</p><p>这需要执行一次全栈扫描，或者在加锁时额外记录所有被锁定的对象。由于实现复杂度较高，并且旧轻量级锁未来可能会被移除，JEP 491 并未修复旧轻量级锁绑定平台线程的问题。</p><p>对于重量级锁，JEP 491 依然采用 ObjectMonitor 结构，但重量级锁的所有者不再是 JVM 内部的 JavaThread 对象，而是虚拟线程的 ID，即 java.lang.Thread.tid。由于 tid 只是一个 64 位整数，JVM 无法直接通过 tid 找到持有锁的线程，但可以正确判断当前虚拟线程是否拥有该锁，从而保证锁的归属。</p><p>在锁竞争时，JVM 会将虚拟线程添加到 ObjectMonitor 的等待队列中。与平台线程不同，虚拟线程无法被操作系统直接唤醒，而是需要通过 Java 层面的调度器进行调度。</p><p>目前的实现方式是使用一个专门的 unblocker 线程，当其他线程释放重量级锁时，会通知该 unblocker 线程，使其将可运行的虚拟线程添加到调度器。未来，Loom 设计者考虑在锁释放时，直接调用 Java 代码，将等待的虚拟线程添加到调度器，以减少额外线程的开销。</p><p>前面提到，虚拟线程的卸载通常需在 Java 层完成。JEP 491 打破了这一限制，使得在执行 synchronized 语句获取锁失败或调用 Object.wait() 时，JVM 可直接在虚拟机内部触发虚拟线程的卸载。</p><p>具体而言，JVM 先将当前虚拟线程的 Java 栈帧复制到堆中，然后跳转至一段预设的桩代码清除栈帧，并最终回到 Java 层的 Continuation.run() 以执行卸载逻辑。</p><p>通过上述优化，JVM 实现了虚拟线程与平台线程的解耦。在 JDK 24 中运行前一章节的哲学家就餐示例，可以观察到虚拟线程在 synchronized 代码块内不会再绑定到平台线程，从而有效避免了死锁和线程资源浪费的问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ java --enable-preview  DiningPhilosophers.java 11 true</span></span>
<span class="line"><span>&gt; Running on JDK 24+36-3646</span></span>
<span class="line"><span>Philosopher 2 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 5 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 4 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 9 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 3 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 1 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 0 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 6 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 10 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 8 picked up left chopstick...</span></span>
<span class="line"><span>Philosopher 7 picked up left chopstick...</span></span>
<span class="line"><span>All threads have reached the fence, proceeding...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Philosopher 10 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 9 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 8 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 7 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 6 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 5 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 4 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 3 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 2 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 1 picked up right chopstick...</span></span>
<span class="line"><span>Philosopher 0 picked up right chopstick...</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>JDK 21 引入了虚拟线程，使 Java 线程不再与操作系统线程一一对应，从而大幅提升并发能力。然而，某些 JVM 操作，如 synchronized 同步操作，会导致虚拟线程与平台线程绑定，使得平台线程无法卸载虚拟线程，从而影响系统的并发能力，甚至可能导致死锁。</p><p>JDK 24 通过 JEP 491 解决了synchronized 同步操作导致的绑定问题。</p><p>JEP 491 重新设计了 Java 的同步机制，使锁的所有权直接关联虚拟线程，而非平台线程。当虚拟线程被卸载时，JVM 会将其持有的轻量级锁状态存储，并在其重新加载时恢复，从而确保锁不会错误地转移到其他线程。</p><p>而对于重量级锁，JVM 采用 Thread.tid 作为所有者标识，并通过一个专门的线程处理虚拟线程的唤醒。</p><p>未来，Loom 设计者将着手解决诸如类初始化等可能导致虚拟线程与平台线程绑定的问题，以进一步提升虚拟线程的可扩展性。</p>`,59)])])}const u=n(i,[["render",l]]);export{k as __pageData,u as default};
