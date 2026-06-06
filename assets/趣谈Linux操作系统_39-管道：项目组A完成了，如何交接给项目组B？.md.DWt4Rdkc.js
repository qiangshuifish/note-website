import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const f=JSON.parse('{"title":"39 | 管道：项目组A完成了，如何交接给项目组B？","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/39-管道：项目组A完成了，如何交接给项目组B？.md","filePath":"趣谈Linux操作系统/39-管道：项目组A完成了，如何交接给项目组B？.md","lastUpdated":1779822193000}'),i={name:"趣谈Linux操作系统/39-管道：项目组A完成了，如何交接给项目组B？.md"};function t(l,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_39-管道-项目组a完成了-如何交接给项目组b" tabindex="-1">39 | 管道：项目组A完成了，如何交接给项目组B？ <a class="header-anchor" href="#_39-管道-项目组a完成了-如何交接给项目组b" aria-label="Permalink to &quot;39 | 管道：项目组A完成了，如何交接给项目组B？&quot;">​</a></h1><p>在这一章的第一节里，我们大致讲了管道的使用方式以及相应的命令行。这一节，我们就具体来看一下管道是如何实现的。</p><p>我们先来看，我们常用的 <strong>匿名管道</strong>（Anonymous Pipes），也即将多个命令串起来的竖线，背后的原理到底是什么。</p><p>上次我们说，它是基于管道的，那管道如何创建呢？管道的创建，需要通过下面这个系统调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int pipe(int fd[2])</span></span></code></pre></div><p>在这里，我们创建了一个管道pipe，返回了两个文件描述符，这表示管道的两端，一个是管道的读取端描述符fd[0]，另一个是管道的写入端描述符fd[1]。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/8fa3144bf3a34ddf789884a75fa2d4a7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/8fa3144bf3a34ddf789884a75fa2d4a7.png" alt=""></a></p><p>我们来看在内核里面是如何实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE1(pipe, int __user *, fildes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return sys_pipe2(fildes, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYSCALL_DEFINE2(pipe2, int __user *, fildes, int, flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *files[2];</span></span>
<span class="line"><span>	int fd[2];</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = __do_pipe_flags(fd, files, flags);</span></span>
<span class="line"><span>	if (!error) {</span></span>
<span class="line"><span>		if (unlikely(copy_to_user(fildes, fd, sizeof(fd)))) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			error = -EFAULT;</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			fd_install(fd[0], files[0]);</span></span>
<span class="line"><span>			fd_install(fd[1], files[1]);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return error;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在内核中，主要的逻辑在pipe2系统调用中。这里面要创建一个数组files，用来存放管道的两端的打开文件，另一个数组fd存放管道的两端的文件描述符。如果调用__do_pipe_flags没有错误，那就调用fd_install，将两个fd和两个struct file关联起来。这一点和打开一个文件的过程很像了。</p><p>我们来看__do_pipe_flags。这里面调用了create_pipe_files，然后生成了两个fd。从这里可以看出，fd[0]是用于读的，fd[1]是用于写的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __do_pipe_flags(int *fd, struct file **files, int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	int fdw, fdr;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = create_pipe_files(files, flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = get_unused_fd_flags(flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	fdr = error;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = get_unused_fd_flags(flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	fdw = error;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	fd[0] = fdr;</span></span>
<span class="line"><span>	fd[1] = fdw;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>创建一个管道，大部分的逻辑其实都是在create_pipe_files函数里面实现的。这一章第一节的时候，我们说过，命名管道是创建在文件系统上的。从这里我们可以看出，匿名管道，也是创建在文件系统上的，只不过是一种特殊的文件系统，创建一个特殊的文件，对应一个特殊的inode，就是这里面的get_pipe_inode。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int create_pipe_files(struct file **res, int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	struct inode *inode = get_pipe_inode();</span></span>
<span class="line"><span>	struct file *f;</span></span>
<span class="line"><span>	struct path path;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	path.dentry = d_alloc_pseudo(pipe_mnt-&amp;gt;mnt_sb, &amp;empty_name);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	path.mnt = mntget(pipe_mnt);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	d_instantiate(path.dentry, inode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	f = alloc_file(&amp;path, FMODE_WRITE, &amp;pipefifo_fops);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	f-&amp;gt;f_flags = O_WRONLY | (flags &amp; (O_NONBLOCK | O_DIRECT));</span></span>
<span class="line"><span>	f-&amp;gt;private_data = inode-&amp;gt;i_pipe;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	res[0] = alloc_file(&amp;path, FMODE_READ, &amp;pipefifo_fops);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	path_get(&amp;path);</span></span>
<span class="line"><span>	res[0]-&amp;gt;private_data = inode-&amp;gt;i_pipe;</span></span>
<span class="line"><span>	res[0]-&amp;gt;f_flags = O_RDONLY | (flags &amp; O_NONBLOCK);</span></span>
<span class="line"><span>	res[1] = f;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从get_pipe_inode的实现，我们可以看出，匿名管道来自一个特殊的文件系统pipefs。这个文件系统被挂载后，我们就得到了struct vfsmount *pipe_mnt。然后挂载的文件系统的superblock就变成了：pipe_mnt-&gt;mnt_sb。如果你对文件系统的操作还不熟悉，要返回去复习一下文件系统那一章啊。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct file_system_type pipe_fs_type = {</span></span>
<span class="line"><span>	.name		= &quot;pipefs&quot;,</span></span>
<span class="line"><span>	.mount		= pipefs_mount,</span></span>
<span class="line"><span>	.kill_sb	= kill_anon_super,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init init_pipe_fs(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int err = register_filesystem(&amp;pipe_fs_type);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!err) {</span></span>
<span class="line"><span>		pipe_mnt = kern_mount(&amp;pipe_fs_type);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct inode * get_pipe_inode(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct inode *inode = new_inode_pseudo(pipe_mnt-&amp;gt;mnt_sb);</span></span>
<span class="line"><span>	struct pipe_inode_info *pipe;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	inode-&amp;gt;i_ino = get_next_ino();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	pipe = alloc_pipe_info();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	inode-&amp;gt;i_pipe = pipe;</span></span>
<span class="line"><span>	pipe-&amp;gt;files = 2;</span></span>
<span class="line"><span>	pipe-&amp;gt;readers = pipe-&amp;gt;writers = 1;</span></span>
<span class="line"><span>	inode-&amp;gt;i_fop = &amp;pipefifo_fops;</span></span>
<span class="line"><span>	inode-&amp;gt;i_state = I_DIRTY;</span></span>
<span class="line"><span>	inode-&amp;gt;i_mode = S_IFIFO | S_IRUSR | S_IWUSR;</span></span>
<span class="line"><span>	inode-&amp;gt;i_uid = current_fsuid();</span></span>
<span class="line"><span>	inode-&amp;gt;i_gid = current_fsgid();</span></span>
<span class="line"><span>	inode-&amp;gt;i_atime = inode-&amp;gt;i_mtime = inode-&amp;gt;i_ctime = current_time(inode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return inode;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们从new_inode_pseudo函数创建一个inode。这里面开始填写Inode的成员，这里和文件系统的很像。这里值得注意的是struct pipe_inode_info，这个结构里面有个成员是struct pipe_buffer *bufs。我们可以知道， <strong>所谓的匿名管道，其实就是内核里面的一串缓存</strong>。</p><p>另外一个需要注意的是pipefifo_fops，将来我们对于文件描述符的操作，在内核里面都是对应这里面的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct file_operations pipefifo_fops = {</span></span>
<span class="line"><span>	.open		= fifo_open,</span></span>
<span class="line"><span>	.llseek		= no_llseek,</span></span>
<span class="line"><span>	.read_iter	= pipe_read,</span></span>
<span class="line"><span>	.write_iter	= pipe_write,</span></span>
<span class="line"><span>	.poll		= pipe_poll,</span></span>
<span class="line"><span>	.unlocked_ioctl	= pipe_ioctl,</span></span>
<span class="line"><span>	.release	= pipe_release,</span></span>
<span class="line"><span>	.fasync		= pipe_fasync,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>我们回到create_pipe_files函数，创建完了inode，还需创建一个dentry和他对应。dentry和inode对应好了，我们就要开始创建struct file对象了。先创建用于写入的，对应的操作为pipefifo_fops；再创建读取的，对应的操作也为pipefifo_fops。然后把private_data设置为pipe_inode_info。这样从struct file这个层级上，就能直接操作底层的读写操作。</p><p>至此，一个匿名管道就创建成功了。如果对于fd[1]写入，调用的是pipe_write，向pipe_buffer里面写入数据；如果对于fd[0]的读入，调用的是pipe_read，也就是从pipe_buffer里面读取数据。</p><p>但是这个时候，两个文件描述符都是在一个进程里面的，并没有起到进程间通信的作用，怎么样才能使得管道是跨两个进程的呢？还记得创建进程调用的fork吗？在这里面，创建的子进程会复制父进程的struct files_struct，在这里面fd的数组会复制一份，但是fd指向的struct file对于同一个文件还是只有一份，这样就做到了，两个进程各有两个fd指向同一个struct file的模式，两个进程就可以通过各自的fd写入和读取同一个管道文件实现跨进程通信了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/9c0e38e31c7a51da12faf4a1aca10ba3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/9c0e38e31c7a51da12faf4a1aca10ba3.png" alt=""></a></p><p>由于管道只能一端写入，另一端读出，所以上面的这种模式会造成混乱，因为父进程和子进程都可以写入，也都可以读出，通常的方法是父进程关闭读取的fd，只保留写入的fd，而子进程关闭写入的fd，只保留读取的fd，如果需要双向通行，则应该创建两个管道。</p><p>一个典型的使用管道在父子进程之间的通信代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;unistd.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;fcntl.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;errno.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int fds[2];</span></span>
<span class="line"><span>  if (pipe(fds) == -1)</span></span>
<span class="line"><span>    perror(&quot;pipe error&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  pid_t pid;</span></span>
<span class="line"><span>  pid = fork();</span></span>
<span class="line"><span>  if (pid == -1)</span></span>
<span class="line"><span>    perror(&quot;fork error&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (pid == 0){</span></span>
<span class="line"><span>    close(fds[0]);</span></span>
<span class="line"><span>    char msg[] = &quot;hello world&quot;;</span></span>
<span class="line"><span>    write(fds[1], msg, strlen(msg) + 1);</span></span>
<span class="line"><span>    close(fds[1]);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    close(fds[1]);</span></span>
<span class="line"><span>    char msg[128];</span></span>
<span class="line"><span>    read(fds[0], msg, 128);</span></span>
<span class="line"><span>    close(fds[0]);</span></span>
<span class="line"><span>    printf(&quot;message : %s\\n&quot;, msg);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/71eb7b4d026d04e4093daad7e24feab6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/71eb7b4d026d04e4093daad7e24feab6.png" alt=""></a></p><p>到这里，我们仅仅解析了使用管道进行父子进程之间的通信，但是我们在shell里面的不是这样的。在shell里面运行A|B的时候，A进程和B进程都是shell创建出来的子进程，A和B之间不存在父子关系。</p><p>不过，有了上面父子进程之间的管道这个基础，实现A和B之间的管道就方便多了。</p><p>我们首先从shell创建子进程A，然后在shell和A之间建立一个管道，其中shell保留读取端，A进程保留写入端，然后shell再创建子进程B。这又是一次fork，所以，shell里面保留的读取端的fd也被复制到了子进程B里面。这个时候，相当于shell和B都保留读取端，只要shell主动关闭读取端，就变成了一管道，写入端在A进程，读取端在B进程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/81be4d460aaa804e9176ec70d59fdefa.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/81be4d460aaa804e9176ec70d59fdefa.png" alt=""></a></p><p>接下来我们要做的事情就是，将这个管道的两端和输入输出关联起来。这就要用到dup2系统调用了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int dup2(int oldfd, int newfd);</span></span></code></pre></div><p>这个系统调用，将老的文件描述符赋值给新的文件描述符，让newfd的值和oldfd一样。</p><p>我们还是回忆一下，在files_struct里面，有这样一个表，下标是fd，内容指向一个打开的文件struct file。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct files_struct {</span></span>
<span class="line"><span>  struct file __rcu * fd_array[NR_OPEN_DEFAULT];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个表里面，前三项是定下来的，其中第零项STDIN_FILENO表示标准输入，第一项STDOUT_FILENO表示标准输出，第三项STDERR_FILENO表示错误输出。</p><p>在A进程中，写入端可以做这样的操作：dup2(fd[1],STDOUT_FILENO)，将STDOUT_FILENO（也即第一项）不再指向标准输出，而是指向创建的管道文件，那么以后往标准输出写入的任何东西，都会写入管道文件。</p><p>在B进程中，读取端可以做这样的操作，dup2(fd[0],STDIN_FILENO)，将STDIN_FILENO也即第零项不再指向标准输入，而是指向创建的管道文件，那么以后从标准输入读取的任何东西，都来自于管道文件。</p><p>至此，我们才将A|B的功能完成。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/c042b12de704995e4ba04173e0a304e2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/c042b12de704995e4ba04173e0a304e2.png" alt=""></a></p><p>为了模拟A|B的情况，我们可以将前面的那一段代码，进一步修改成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;unistd.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;fcntl.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;errno.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int fds[2];</span></span>
<span class="line"><span>  if (pipe(fds) == -1)</span></span>
<span class="line"><span>    perror(&quot;pipe error&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  pid_t pid;</span></span>
<span class="line"><span>  pid = fork();</span></span>
<span class="line"><span>  if (pid == -1)</span></span>
<span class="line"><span>    perror(&quot;fork error&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (pid == 0){</span></span>
<span class="line"><span>    dup2(fds[1], STDOUT_FILENO);</span></span>
<span class="line"><span>    close(fds[1]);</span></span>
<span class="line"><span>    close(fds[0]);</span></span>
<span class="line"><span>    execlp(&quot;ps&quot;, &quot;ps&quot;, &quot;-ef&quot;, NULL);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    dup2(fds[0], STDIN_FILENO);</span></span>
<span class="line"><span>    close(fds[0]);</span></span>
<span class="line"><span>    close(fds[1]);</span></span>
<span class="line"><span>    execlp(&quot;grep&quot;, &quot;grep&quot;, &quot;systemd&quot;, NULL);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们来看命名管道。我们在讲命令的时候讲过，命名管道需要事先通过命令mkfifo，进行创建。如果是通过代码创建命名管道，也有一个函数，但是这不是一个系统调用，而是Glibc提供的函数。它的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int</span></span>
<span class="line"><span>mkfifo (const char *path, mode_t mode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  dev_t dev = 0;</span></span>
<span class="line"><span>  return __xmknod (_MKNOD_VER, path, mode | S_IFIFO, &amp;dev);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int</span></span>
<span class="line"><span>__xmknod (int vers, const char *path, mode_t mode, dev_t *dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  unsigned long long int k_dev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  /* We must convert the value to dev_t type used by the kernel.  */</span></span>
<span class="line"><span>  k_dev = (*dev) &amp; ((1ULL &amp;lt;&amp;lt; 32) - 1);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  return INLINE_SYSCALL (mknodat, 4, AT_FDCWD, path, mode,</span></span>
<span class="line"><span>                         (unsigned int) k_dev);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Glibc的mkfifo函数会调用mknodat系统调用，还记得咱们学字符设备的时候，创建一个字符设备的时候，也是调用的mknod。这里命名管道也是一个设备，因而我们也用mknod。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE4(mknodat, int, dfd, const char __user *, filename, umode_t, mode, unsigned, dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct dentry *dentry;</span></span>
<span class="line"><span>	struct path path;</span></span>
<span class="line"><span>	unsigned int lookup_flags = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>retry:</span></span>
<span class="line"><span>	dentry = user_path_create(dfd, filename, &amp;path, lookup_flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch (mode &amp; S_IFMT) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		case S_IFIFO: case S_IFSOCK:</span></span>
<span class="line"><span>			error = vfs_mknod(path.dentry-&amp;gt;d_inode,dentry,mode,0);</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于mknod的解析，我们在字符设备那一节已经解析过了，先是通过user_path_create对于这个管道文件创建一个dentry，然后因为是S_IFIFO，所以调用vfs_mknod。由于这个管道文件是创建在一个普通文件系统上的，假设是在ext4文件上，于是vfs_mknod会调用ext4_dir_inode_operations的mknod，也即会调用ext4_mknod。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct inode_operations ext4_dir_inode_operations = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.mknod		= ext4_mknod,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int ext4_mknod(struct inode *dir, struct dentry *dentry,</span></span>
<span class="line"><span>		      umode_t mode, dev_t rdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	handle_t *handle;</span></span>
<span class="line"><span>	struct inode *inode;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	inode = ext4_new_inode_start_handle(dir, mode, &amp;dentry-&amp;gt;d_name, 0,</span></span>
<span class="line"><span>					    NULL, EXT4_HT_DIR, credits);</span></span>
<span class="line"><span>	handle = ext4_journal_current_handle();</span></span>
<span class="line"><span>	if (!IS_ERR(inode)) {</span></span>
<span class="line"><span>		init_special_inode(inode, inode-&amp;gt;i_mode, rdev);</span></span>
<span class="line"><span>		inode-&amp;gt;i_op = &amp;ext4_special_inode_operations;</span></span>
<span class="line"><span>		err = ext4_add_nondir(handle, dentry, inode);</span></span>
<span class="line"><span>		if (!err &amp;&amp; IS_DIRSYNC(dir))</span></span>
<span class="line"><span>			ext4_handle_sync(handle);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	if (handle)</span></span>
<span class="line"><span>		ext4_journal_stop(handle);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define ext4_new_inode_start_handle(dir, mode, qstr, goal, owner, \\</span></span>
<span class="line"><span>				    type, nblocks)		    \\</span></span>
<span class="line"><span>	__ext4_new_inode(NULL, (dir), (mode), (qstr), (goal), (owner), \\</span></span>
<span class="line"><span>			 0, (type), __LINE__, (nblocks))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void init_special_inode(struct inode *inode, umode_t mode, dev_t rdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	inode-&amp;gt;i_mode = mode;</span></span>
<span class="line"><span>	if (S_ISCHR(mode)) {</span></span>
<span class="line"><span>		inode-&amp;gt;i_fop = &amp;def_chr_fops;</span></span>
<span class="line"><span>		inode-&amp;gt;i_rdev = rdev;</span></span>
<span class="line"><span>	} else if (S_ISBLK(mode)) {</span></span>
<span class="line"><span>		inode-&amp;gt;i_fop = &amp;def_blk_fops;</span></span>
<span class="line"><span>		inode-&amp;gt;i_rdev = rdev;</span></span>
<span class="line"><span>	} else if (S_ISFIFO(mode))</span></span>
<span class="line"><span>		inode-&amp;gt;i_fop = &amp;pipefifo_fops;</span></span>
<span class="line"><span>	else if (S_ISSOCK(mode))</span></span>
<span class="line"><span>		;	/* leave it no_open_fops */</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ext4_mknod中，ext4_new_inode_start_handle会调用__ext4_new_inode，在ext4文件系统上真的创建一个文件，但是会调用init_special_inode，创建一个内存中特殊的inode，这个函数我们在字符设备文件中也遇到过，只不过当时inode的i_fop指向的是def_chr_fops，这次换成管道文件了，inode的i_fop变成指向pipefifo_fops，这一点和匿名管道是一样的。</p><p>这样，管道文件就创建完毕了。</p><p>接下来，要打开这个管道文件，我们还是会调用文件系统的open函数。还是沿着文件系统的调用方式，一路调用到pipefifo_fops的open函数，也就是fifo_open。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int fifo_open(struct inode *inode, struct file *filp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct pipe_inode_info *pipe;</span></span>
<span class="line"><span>	bool is_pipe = inode-&amp;gt;i_sb-&amp;gt;s_magic == PIPEFS_MAGIC;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span>	filp-&amp;gt;f_version = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (inode-&amp;gt;i_pipe) {</span></span>
<span class="line"><span>		pipe = inode-&amp;gt;i_pipe;</span></span>
<span class="line"><span>		pipe-&amp;gt;files++;</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		pipe = alloc_pipe_info();</span></span>
<span class="line"><span>		pipe-&amp;gt;files = 1;</span></span>
<span class="line"><span>		inode-&amp;gt;i_pipe = pipe;</span></span>
<span class="line"><span>		spin_unlock(&amp;inode-&amp;gt;i_lock);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	filp-&amp;gt;private_data = pipe;</span></span>
<span class="line"><span>	filp-&amp;gt;f_mode &amp;= (FMODE_READ | FMODE_WRITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch (filp-&amp;gt;f_mode) {</span></span>
<span class="line"><span>	case FMODE_READ:</span></span>
<span class="line"><span>		pipe-&amp;gt;r_counter++;</span></span>
<span class="line"><span>		if (pipe-&amp;gt;readers++ == 0)</span></span>
<span class="line"><span>			wake_up_partner(pipe);</span></span>
<span class="line"><span>		if (!is_pipe &amp;&amp; !pipe-&amp;gt;writers) {</span></span>
<span class="line"><span>			if ((filp-&amp;gt;f_flags &amp; O_NONBLOCK)) {</span></span>
<span class="line"><span>			filp-&amp;gt;f_version = pipe-&amp;gt;w_counter;</span></span>
<span class="line"><span>			} else {</span></span>
<span class="line"><span>				if (wait_for_partner(pipe, &amp;pipe-&amp;gt;w_counter))</span></span>
<span class="line"><span>					goto err_rd;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	case FMODE_WRITE:</span></span>
<span class="line"><span>		pipe-&amp;gt;w_counter++;</span></span>
<span class="line"><span>		if (!pipe-&amp;gt;writers++)</span></span>
<span class="line"><span>			wake_up_partner(pipe);</span></span>
<span class="line"><span>		if (!is_pipe &amp;&amp; !pipe-&amp;gt;readers) {</span></span>
<span class="line"><span>			if (wait_for_partner(pipe, &amp;pipe-&amp;gt;r_counter))</span></span>
<span class="line"><span>				goto err_wr;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	case FMODE_READ | FMODE_WRITE:</span></span>
<span class="line"><span>		pipe-&amp;gt;readers++;</span></span>
<span class="line"><span>		pipe-&amp;gt;writers++;</span></span>
<span class="line"><span>		pipe-&amp;gt;r_counter++;</span></span>
<span class="line"><span>		pipe-&amp;gt;w_counter++;</span></span>
<span class="line"><span>		if (pipe-&amp;gt;readers == 1 || pipe-&amp;gt;writers == 1)</span></span>
<span class="line"><span>			wake_up_partner(pipe);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在fifo_open里面，创建pipe_inode_info，这一点和匿名管道也是一样的。这个结构里面有个成员是struct pipe_buffer *bufs。我们可以知道， <strong>所谓的命名管道，其实是也是内核里面的一串缓存。</strong></p><p>接下来，对于命名管道的写入，我们还是会调用pipefifo_fops的pipe_write函数，向pipe_buffer里面写入数据。对于命名管道的读入，我们还是会调用pipefifo_fops的pipe_read，也就是从pipe_buffer里面读取数据。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>无论是匿名管道，还是命名管道，在内核都是一个文件。只要是文件就要有一个inode。这里我们又用到了特殊inode、字符设备、块设备，其实都是这种特殊的inode。</p><p>在这种特殊的inode里面，file_operations指向管道特殊的pipefifo_fops，这个inode对应内存里面的缓存。</p><p>当我们用文件的open函数打开这个管道设备文件的时候，会调用pipefifo_fops里面的方法创建struct file结构，他的inode指向特殊的inode，也对应内存里面的缓存，file_operations也指向管道特殊的pipefifo_fops。</p><p>写入一个pipe就是从struct file结构找到缓存写入，读取一个pipe就是从struct file结构找到缓存读出。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/486e2bc73abbe91d7083bb1f4f678097.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/486e2bc73abbe91d7083bb1f4f678097.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>上面创建匿名管道的程序，你一定要运行一下，然后试着通过strace查看自己写的程序的系统调用，以及直接在命令行使用匿名管道的系统调用，做一个比较。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/103426/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,65)])])}const g=n(i,[["render",t]]);export{f as __pageData,g as default};
