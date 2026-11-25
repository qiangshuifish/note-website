import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"36 | Linux文件系统（二）：Linux如何存放文件？","description":"","frontmatter":{},"headers":[{"level":2,"title":"打开虚拟硬盘","slug":"打开虚拟硬盘","link":"#打开虚拟硬盘","children":[]},{"level":2,"title":"获取 Ext3 文件系统超级块","slug":"获取-ext3-文件系统超级块","link":"#获取-ext3-文件系统超级块","children":[]},{"level":2,"title":"获取 Ext3 文件系统块组描述符表","slug":"获取-ext3-文件系统块组描述符表","link":"#获取-ext3-文件系统块组描述符表","children":[]},{"level":2,"title":"获取 Ext3 文件系统根目录","slug":"获取-ext3-文件系统根目录","link":"#获取-ext3-文件系统根目录","children":[]},{"level":2,"title":"获取 Ext3 文件系统文件","slug":"获取-ext3-文件系统文件","link":"#获取-ext3-文件系统文件","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"计算机基础实战课/36｜Linux文件系统（二）：Linux如何存放文件？.md","filePath":"计算机基础实战课/36｜Linux文件系统（二）：Linux如何存放文件？.md","lastUpdated":1795560006000}'),i={name:"计算机基础实战课/36｜Linux文件系统（二）：Linux如何存放文件？.md"};function t(l,n,c,r,o,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_36-linux文件系统-二-linux如何存放文件" tabindex="-1">36 | Linux文件系统（二）：Linux如何存放文件？ <a class="header-anchor" href="#_36-linux文件系统-二-linux如何存放文件" aria-label="Permalink to &quot;36 | Linux文件系统（二）：Linux如何存放文件？&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>通过上节课的学习，我们已经对 Ext3 文件系统的结构非常了解了。这种了解究竟正确与否，还是需要通过写代码来验证。这节课我会带你读取 Ext3 文件系统中的文件，帮你加深对 Ext3的理解。</p><p>我假定你已经学会了怎么建立一个虚拟硬盘并将其格式化为 Ext3 文件系统。如果记不清了，请回到上节课复习一下。课程的配套代码，你需要从这里下载。</p><h2 id="打开虚拟硬盘" tabindex="-1">打开虚拟硬盘 <a class="header-anchor" href="#打开虚拟硬盘" aria-label="Permalink to &quot;打开虚拟硬盘&quot;">​</a></h2><p>想要从虚拟硬盘读取文件，首先要做的当然是打开虚拟硬盘。但我们的硬盘是个文件，所以这就变成了打开了一个文件，然后对文件进行读写就行。这些操作我们已经非常熟悉了，不过多展开。</p><p>这次我们不用 read 命令来读取虚拟硬盘文件数据，因为那样做还需要处理分配临时内容和文件定位的问题，操作比较繁琐。这里我们直接用 mmap 将整个文件映射到虚拟文件中，这样就能像访问内存一样很方便地访问文件了。</p><p>下面我们首先实现 mmap 映射读取文件这个功能，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int init_in_hdfile()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> struct stat filestat;</span></span>
<span class="line"><span> size_t len = 0;</span></span>
<span class="line"><span> void* buf = NULL;</span></span>
<span class="line"><span> int fd = -1;</span></span>
<span class="line"><span> // 打开虚拟硬盘文件</span></span>
<span class="line"><span> fd = open(&quot;./hd.img&quot;, O_RDWR, S_IRWXU|S_IRWXG|S_IRWXO);</span></span>
<span class="line"><span> if(fd &lt; 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   printf(&quot;打开文件失败\\n&quot;);</span></span>
<span class="line"><span>   return -1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 获取文件信息，比如文件大小</span></span>
<span class="line"><span> fstat(fd, &amp;filestat);</span></span>
<span class="line"><span> // 获取文件大小</span></span>
<span class="line"><span> len = filestat.st_size;</span></span>
<span class="line"><span> // 映射整个文件到进程的虚拟内存中</span></span>
<span class="line"><span> buf = mmap(NULL, len, PROT_READ|PROT_WRITE, MAP_SHARED, fd, 0);</span></span>
<span class="line"><span> if(buf == NULL)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   printf(&quot;映射文件失败\\n&quot;);</span></span>
<span class="line"><span>   return -2;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 保存地址 长度大小 文件句柄 到全局变量</span></span>
<span class="line"><span> hdaddr = buf;</span></span>
<span class="line"><span> hdsize = len;</span></span>
<span class="line"><span> hdfilefd = fd;</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们把打开硬盘文件以及将其映射到进程的虚拟内存中的功能，封装在 init_in_hdfile 函数中，并把映射返回的地址、文件长度、文件句柄保存到全局变量中，以便后面使用。</p><h2 id="获取-ext3-文件系统超级块" tabindex="-1">获取 Ext3 文件系统超级块 <a class="header-anchor" href="#获取-ext3-文件系统超级块" aria-label="Permalink to &quot;获取 Ext3 文件系统超级块&quot;">​</a></h2><p>好，作为硬盘的文件已经完成映射，下面我们就来获取其中的 Ext3 文件系统超级块。</p><p>Ext3 文件系统超级块固定存放在硬盘 2 号扇区的开始地址，硬盘扇区从 0 开始计数。我们需要把扇区号转换成文件中对应的偏移量，然后把这个偏移量转换成文件映射虚拟内存中的地址，才能访问到正确的数据。</p><p>下面我们开始写代码，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 将扇区号转换成文件映射的虚拟内存地址</span></span>
<span class="line"><span>void* sector_to_addr(__u64 nr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> return (void*)((__u64)hdaddr + (nr * SECTOR_SIZE));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 将储存块号转换成文件映射的虚拟内存地址</span></span>
<span class="line"><span>void* block_to_addr(__u64 nr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> return (void*)((__u64)hdaddr + (nr * block_size));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 获取超级块的地址</span></span>
<span class="line"><span>struct ext3_super_block* get_superblock()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> return (struct ext3_super_block*)sector_to_addr(2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Ext3 的超级级块结构，定义在工程目录下的 ext3fs.h 头文件中。代码的 get_superblock 函数中正是通过 sector_to_addr 函数对第二号扇区做了转换，之后还加上了映射文件的首地址，才能访问硬盘文件中的超级块。</p><p>我们可以调用 dump_super_block 函数，打印超级块的一些信息，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/1.png" alt=""></a></p><p>从上面的截图，我们能知道文件系统的全局信息，也就是该文件系统有多少个储存块、inode、储存块大小，每个块组多少个储存块等相关信息。</p><h2 id="获取-ext3-文件系统块组描述符表" tabindex="-1">获取 Ext3 文件系统块组描述符表 <a class="header-anchor" href="#获取-ext3-文件系统块组描述符表" aria-label="Permalink to &quot;获取 Ext3 文件系统块组描述符表&quot;">​</a></h2><p>我们知道，Ext3 文件系统将硬盘分区划分成一个个块组，在超级块的下一个储存块中保存着块组描述符表。如果超级块在 0 号储存块中，块组描述符表就是 1 号储存块中；如果超级块在 1 号储存块，块组描述符表就在 2 号储存块中。</p><p>一个块组中有储存块位图块，有 inode 节点位图块，也有 inode 节点表。要获取 Ext3 文件系统块组描述符表，我们只要知道它所在的储存块，就能读取其中的信息。</p><p>下面我们用代码实现这一步：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void get_group_table(struct ext3_group_desc** outgtable, int* outnr )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 计算总块组数</span></span>
<span class="line"><span> int gnr = super-&gt;s_blocks_count / super-&gt;s_blocks_per_group;</span></span>
<span class="line"><span> // 获取块组描述表的首地址</span></span>
<span class="line"><span> struct ext3_group_desc* group = (struct ext3_group_desc* ) block_to_addr(2);</span></span>
<span class="line"><span> *outgtable = group;</span></span>
<span class="line"><span> *outnr = gnr;</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上获取块组描述符表的函数，我们可以通过参数，返回两个块组描述符表的首地址和个数。</p><p>这里我已经为你写好了 dump_all_group 函数，你只要调用它，就可以直接获取块组描述符表信息了。</p><p>接下来我们看看打印出来的块组描述符表信息，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/2.png" alt=""></a></p><h2 id="获取-ext3-文件系统根目录" tabindex="-1">获取 Ext3 文件系统根目录 <a class="header-anchor" href="#获取-ext3-文件系统根目录" aria-label="Permalink to &quot;获取 Ext3 文件系统根目录&quot;">​</a></h2><p>要想在文件系统中读取文件，就必须从其根目录开始，一层一层查找，直到找到文件的 inode节点。</p><p>可是根目录在哪里呢？它就在第一个块组中 inode 节点表中的第 2 个 inode，也就是根目录的inode 节点，这个 inode 节点对应的数据块中储存的目录项数据。目录项可以指向一个目录，也可以指向一个文件，就这样一层层将目录或者文件组织起来了。</p><p>下面我们就来写代码实现这一步，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 获取根目录的inode的地址</span></span>
<span class="line"><span>struct ext3_inode* get_rootinode()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 获取第1个块组描述符</span></span>
<span class="line"><span> struct ext3_group_desc* group = (struct ext3_group_desc* ) block_to_addr(2);</span></span>
<span class="line"><span> // 获取该块组的inode表的块号</span></span>
<span class="line"><span> __u32 ino = group-&gt;bg_inode_table;</span></span>
<span class="line"><span> // 获取第二个inode</span></span>
<span class="line"><span> struct ext3_inode* inp = (struct ext3_inode* )((__u64)block_to_addr(ino)+(super</span></span>
<span class="line"><span> return inp;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 获取根目录的开始的数据项的地址</span></span>
<span class="line"><span>struct ext3_dir_entry* get_rootdir()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 获取根目录的inode</span></span>
<span class="line"><span> struct ext3_inode* inp = get_rootinode();</span></span>
<span class="line"><span> // 返回根目录的inode中第一个数据块的地址，就是根目录的数据</span></span>
<span class="line"><span> return (struct ext3_dir_entry*)block_to_addr(inp-&gt;i_block[0]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面代码中有两个函数，一个是获取根目录 inode 的地址，有了它才能获取根目录的数据，由于我们的文件系统没有太多目录和文件，所以只用一块储存块就能放下所有的目录项目。</p><p>我已经为你写好了代码，用于显示根目录下所有的目录和文件，现在你只要调用 dump_dirs函数可以了，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/3.png" alt=""></a></p><p>由上可知，根目录下有 5 个子目录，分别是：.、…、lost+found、ext3fs、info。ext3fs 和 info是我主动建立的，用于测试。我还在 ext3fs 目录下建立了一个 ext3.txt 文件，并在其中写入了“Hello EXT3 File System!!”数据，下面我们就去读取它的文件数据。</p><h2 id="获取-ext3-文件系统文件" tabindex="-1">获取 Ext3 文件系统文件 <a class="header-anchor" href="#获取-ext3-文件系统文件" aria-label="Permalink to &quot;获取 Ext3 文件系统文件&quot;">​</a></h2><p>现在我们要读取 Ext3 文件系统中的 /ext3fs/ext3.txt 文件，但是我们必须要从根目录开始，查找 ext3fs 目录对应 inode 节点。然后在 ext3fs 目录数据中，找到 ext3.txt 文件对应的 inode节点，读取该 inode 中直接或者间接地址块中块号对应的储存块，那里就是文件的真实数据。</p><p>目前我们已经能读取根目录的数据了，只要再操作两步，就可以查到 ext3.txt 对应的 inode。</p><p>下面我们开始写代码，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 判定文件和目录</span></span>
<span class="line"><span>struct ext3_dir_entry* dir_file_is_ok(struct ext3_dir_entry* dire, __u8 type, cha</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 比较文件和目录类型和名称</span></span>
<span class="line"><span> if(dire-&gt;file_type == type)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   if(0 == strncmp(name, dire-&gt;name, dire-&gt;name_len))</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     return dire;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 查找一个块中的目录项</span></span>
<span class="line"><span>struct ext3_dir_entry* find_dirs_on_block(void* blk, size_t size, __u8 type, char</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> struct ext3_dir_entry* dire = NULL;</span></span>
<span class="line"><span> void* end = (void*)((__u64)blk + size);</span></span>
<span class="line"><span> for (void* dir = blk; dir &lt; end;)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   // 判定是否找到</span></span>
<span class="line"><span>   dire = dir_file_is_ok((struct ext3_dir_entry*)dir, type, name);</span></span>
<span class="line"><span>   if(dire != NULL)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     return dire;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 获取下一个目录项地址</span></span>
<span class="line"><span>   dir = get_next_dir_addr((struct ext3_dir_entry*)dir);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 在一个目录文件中查找目录或者文件</span></span>
<span class="line"><span>struct ext3_dir_entry* find_dirs(struct ext3_inode* inode,  __u8 type, char* name</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> struct ext3_dir_entry* dir = NULL;</span></span>
<span class="line"><span> __s64 filesize = inode-&gt;i_size;</span></span>
<span class="line"><span> // 查找每个直接块</span></span>
<span class="line"><span> for (int i = 0; (i &lt; (EXT3_N_BLOCKS - 3))&amp;&amp;(filesize &gt; 0); i++, filesize -= (__</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   // 查找一个储存块</span></span>
<span class="line"><span>   dir = find_dirs_on_block(block_to_addr(inode-&gt;i_block[i]), (size_t)filesize,</span></span>
<span class="line"><span>   if(dir != NULL)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     return dir;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的三个函数的作用就是查找我们需要的目录和文件。具体是这样的：find_dirs 用来查找整个 inode；find_dirs_on_block 用来查找 inode 中一个储存块；dir_file_is_ok 用于判定每个查找到的目录项，如果找到就返回对应的地址，否则返回 NULL。</p><p>下面我们在 read_file 函数中调用上述函数，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void read_file()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> struct ext3_dir_entry* dir = NULL;</span></span>
<span class="line"><span> // 查找ext3fs目录</span></span>
<span class="line"><span> dir = find_dirs(rootinode, 2, &quot;ext3fs&quot;);</span></span>
<span class="line"><span> if(dir == NULL)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   printf(&quot;没有找到ext3fs目录\\n&quot;);</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 显示ext3fs目录的目录项信息</span></span>
<span class="line"><span> dump_one_dir(dir);</span></span>
<span class="line"><span> // 查找ext3fs目录下的ext3.txt文件</span></span>
<span class="line"><span> dir = find_dirs(get_inode(dir-&gt;inode), 1, &quot;ext3.txt&quot;);</span></span>
<span class="line"><span> if(dir == NULL)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   printf(&quot;没有找到ext3.txt\\n&quot;);</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 显示ext3.txt文件的目录项信息</span></span>
<span class="line"><span> dump_one_dir(dir);</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码的作用是这样的：第一步查找 ext3fs 目录，第二步查找 ext3fs 目录下的 ext3.txt 文件，并把它们相应的信息显示出来。</p><p>我们把程序运行一下，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/4.png" alt=""></a></p><p>上图中已经显示了 ext3.txt 文件的 inode 号，根据这个 inode 号，我们就能找到对应 inode 节点，下面我们进一步写代码读取文件中的数据。代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void dump_inode_data(struct ext3_inode* inode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> // 获取文件大小</span></span>
<span class="line"><span> __s64 filesize = inode-&gt;i_size;</span></span>
<span class="line"><span> printf(&quot;----------------------------------------\\n&quot;);</span></span>
<span class="line"><span> // 展示文件inode的元信息</span></span>
<span class="line"><span> dump_inode(inode);</span></span>
<span class="line"><span> printf(&quot;----------------------------------------\\n&quot;);</span></span>
<span class="line"><span> for (int i = 0; (i &lt; (EXT3_N_BLOCKS - 3))&amp;&amp;(filesize &gt; 0); i++, filesize -= (__</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   // 读取并打印每个储存块中数据内部</span></span>
<span class="line"><span>   printf(&quot;%s\\n&quot;, (char*)block_to_addr(inode-&gt;i_block[i]));</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void read_file()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> struct ext3_dir_entry* dir = NULL;</span></span>
<span class="line"><span> // 查找ext3fs目录</span></span>
<span class="line"><span> dir = find_dirs(rootinode, 2, &quot;ext3fs&quot;);</span></span>
<span class="line"><span> if(dir == NULL)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   printf(&quot;没有找到ext3fs目录\\n&quot;);</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 显示ext3fs目录的目录项信息</span></span>
<span class="line"><span> dump_one_dir(dir);</span></span>
<span class="line"><span> // 查找ext3fs目录下的ext3.txt文件</span></span>
<span class="line"><span> dir = find_dirs(get_inode(dir-&gt;inode), 1, &quot;ext3.txt&quot;);</span></span>
<span class="line"><span> if(dir == NULL)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   printf(&quot;没有找到ext3.txt\\n&quot;);</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // 显示ext3.txt文件的目录项信息</span></span>
<span class="line"><span> dump_one_dir(dir);</span></span>
<span class="line"><span> // 显示ext3.txt文件的内容信息</span></span>
<span class="line"><span> dump_inode_data(get_inode(dir-&gt;inode));</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面的 dump_inode_data 函数中，我之所以能用 printf 打印文件内存，是因为我清楚ext3.txt 文件存放写入的是文本数据。如果是其它别的数据就不能这样做了。</p><p>除了打印文件内容，我们还展示了文件元信息。让我们运行一下，看看结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/5.png" alt=""></a></p><p>从上图，我们已经清楚地看到文件大小、创建时间、所属用户、占用哪个储存块，最后还打印出了文件的内容——Hello EXT3 File System!!，这与我们之前写入的数据分毫不差。到这里，我们已经验证了 Ext3 文件系统结构，也完成了读文件信息的各类实践。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>只要认真学完这两节课，我相信你对 Ext3 文件系统已经有了更深入的了解，硬件上的数据修改是完全可以做到的，成为数据修复大师也指日可待。不过，不能利用这些知识去干坏事哦。</p><p>今天，为了验证上节课学到的一系列 Ext3 结构，我们通过写代码的方式，在文件系统中读取了文件数据。我们通过获取超级块、块组的描述符表，一步步完整地把文件内容读取出来，打印在屏幕上。对比之下，这正好跟我们先前输入的内容是一样的，也就验证了 Ext3 文件系统结构。</p><p>这节课的导图如下所示，供你参考：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/36/6.png" alt=""></a></p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问 inode 号是对应于硬盘分区全局，还是相对于块组的？</p><p>进入下个章节之前，希望你可以留言说说学习的感受，或者向我提问。如果觉得课程还不错，别忘了分享给身边更多朋友。</p>`,62)])])}const E=s(i,[["render",t]]);export{_ as __pageData,E as default};
