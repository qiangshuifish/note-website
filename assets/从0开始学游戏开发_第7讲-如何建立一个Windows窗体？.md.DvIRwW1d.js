import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const w=JSON.parse('{"title":"第7讲 | 如何建立一个Windows窗体？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Windows窗体由哪些部分构成？","slug":"windows窗体由哪些部分构成","link":"#windows窗体由哪些部分构成","children":[]},{"level":2,"title":"使用C/C++编写Windows窗体","slug":"使用c-c-编写windows窗体","link":"#使用c-c-编写windows窗体","children":[]},{"level":2,"title":"使用Python编写Windows窗体","slug":"使用python编写windows窗体","link":"#使用python编写windows窗体","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"relativePath":"从0开始学游戏开发/第7讲-如何建立一个Windows窗体？.md","filePath":"从0开始学游戏开发/第7讲-如何建立一个Windows窗体？.md","lastUpdated":1779818530000}'),i={name:"从0开始学游戏开发/第7讲-如何建立一个Windows窗体？.md"};function l(t,s,o,c,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="第7讲-如何建立一个windows窗体" tabindex="-1">第7讲 | 如何建立一个Windows窗体？ <a class="header-anchor" href="#第7讲-如何建立一个windows窗体" aria-label="Permalink to &quot;第7讲 | 如何建立一个Windows窗体？&quot;">​</a></h1><p>今天，我要跟你分享开发Windows游戏的第一步，建立窗体。</p><p>上一节，我讲解Python和C++的编译器，以及它们各自对应的IDE该如何选择，并且测试了C/C++的运行，编译了一个Lua静态库。准备工作基本上算是完成了。</p><p>如果你有一些编程功底，应该知道建立Windows的窗体所需的一些基础知识。如果你经验稍丰富一些，还应该知道Delphi、C++Builder、C#等等。这些工具都可以帮助你非常方便地做出一个空白窗体，但是这些窗体并没有游戏的绘图系统，所以它们只是“建立了一个标准窗体”而已。因此，虽然建立窗体是我们这一节的内容，但 <strong>我们要探讨的是，在窗体背后，Windows系统做了什么。</strong></p><h2 id="windows窗体由哪些部分构成" tabindex="-1">Windows窗体由哪些部分构成？ <a class="header-anchor" href="#windows窗体由哪些部分构成" aria-label="Permalink to &quot;Windows窗体由哪些部分构成？&quot;">​</a></h2><p>我们常规意义上的Windows窗体，由下列几个部分组成。</p><ul><li><p><strong>标题栏</strong>：窗口上方的鼠标拖动条区域。标题栏的左边有控制菜单的图标，中间显示的是程序的标题。</p></li><li><p><strong>菜单栏</strong>：位于标题栏的下面，包含很多菜单，涉及的程序所负责的功能不一样，菜单的内容也不一样。比如有些有文件菜单，有些就没有，有一些窗体甚至根本就没有菜单栏。</p></li><li><p><strong>工具栏</strong>：位于菜单栏的下方，工具栏会以图形按钮的形式给出用户最常使用的一些命令。比如，新建、复制、粘贴、另存为等。</p></li><li><p><strong>工作区域</strong>：窗体的中间区域。一般窗体的输入输出都在这里面进行，如果你接触过Windows窗体编程，就知道在这个工作区域能做很多的事情，比如子窗体显示、层叠，在工作区域的子窗体内进行文字编辑等等。你可以理解成，游戏的图形图像就在此处显示。</p></li><li><p><strong>状态栏</strong>：位于窗体的底部，显示运行程序的当前状态。通过它，用户可以了解到程序运行的情况。比如的，如果我们开发出的窗体程序是个编辑器的话，我按了一下Insert键，那么状态栏就会显示Ins缩写；或者点击到哪个编辑区域，会在状态栏出现第几行第几列这样的标注。</p></li><li><p><strong>滚动条</strong>：如果窗体中显示的内容过多，不管横向还是纵向，当前可见的部分不够显示时，窗体就会出现滚动条，分为水平滚动条与垂直滚动条两种。</p></li><li><p><strong>窗体缩放按钮</strong>：窗体的缩放按钮在右上角，在窗体编程中属于System类目。这些缩放按钮依次为最小化、最大化和关闭按钮。</p></li></ul><p>我们来看一张标准的Windows窗体截图，这个软件名是Notepad++。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E5%BC%80%E5%A7%8B%E5%AD%A6%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/images/8957/cc1d248bd1c76405ad73792112c33faf.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E5%BC%80%E5%A7%8B%E5%AD%A6%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/images/8957/cc1d248bd1c76405ad73792112c33faf.jpg" alt=""></a></p><p>这是MSDN上对于窗体结构的说明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct tagWNDCLASSEX {</span></span>
<span class="line"><span>  UINT      cbSize; //结构体大小，等于 sizeof(WNDCLASSEX)</span></span>
<span class="line"><span>  UINT      style;  //窗体的风格</span></span>
<span class="line"><span>  WNDPROC   lpfnWndProc; //窗体函数指针</span></span>
<span class="line"><span>  int       cbClsExtra;  //附加在窗体类后的字节数，初始化是零</span></span>
<span class="line"><span>  int       cbWndExtra;  //附加在窗体实例化的附加字节数。系统初始化是零，如果一个应用程序使用WNDCLASSEX注册一个通过在资源中使用CLASS指令建立的对话框时，必须把这个成员设成DLGWINDOWEXTRA。</span></span>
<span class="line"><span>  HINSTANCE hInstance; //该对象的实例句柄</span></span>
<span class="line"><span>  HICON     hIcon;     //该对象的图标句柄</span></span>
<span class="line"><span>  HCURSOR   hCursor;   //该对象的光标句柄</span></span>
<span class="line"><span>  HBRUSH    hbrBackground; //该对象的背景刷子</span></span>
<span class="line"><span>  LPCTSTR   lpszMenuName;  //菜单指针</span></span>
<span class="line"><span>  LPCTSTR   lpszClassName;  //类名指针</span></span>
<span class="line"><span>  HICON     hIconSm;       //与窗体关联的小图标，如果这个值为NULL，那么就把hIcon转换为大小比较合适的小图标</span></span>
<span class="line"><span>} WNDCLASSEX, *PWNDCLASSEX;</span></span></code></pre></div><h2 id="使用c-c-编写windows窗体" tabindex="-1">使用C/C++编写Windows窗体 <a class="header-anchor" href="#使用c-c-编写windows窗体" aria-label="Permalink to &quot;使用C/C++编写Windows窗体&quot;">​</a></h2><p>接下来，我将使用C/C++IDE来编写代码，完成一个默认窗体的开发，并让它运行起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;windows.h&amp;gt;</span></span>
<span class="line"><span>LRESULT CALLBACK WindowProcedure(HWND, UINT, WPARAM, LPARAM);</span></span>
<span class="line"><span>char szClassName[ ] = &quot;WindowsApp&quot;;</span></span>
<span class="line"><span>int WINAPI WinMain(HINSTANCE hThisInstance, HINSTANCE hPrevInstance, LPSTR lpszArgument, int nFunsterStil)</span></span>
<span class="line"><span></span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>    HWND hwnd;               /* 指向我们窗体的句柄 */</span></span>
<span class="line"><span>    MSG messages;            /* 保存发往应用的消息 */</span></span>
<span class="line"><span>    WNDCLASSEX wincl;        /* 前面详细介绍过的WNDCLASSEX结构的对象 */</span></span>
<span class="line"><span>    wincl.hInstance = hThisInstance;</span></span>
<span class="line"><span>    wincl.lpszClassName = szClassName;</span></span>
<span class="line"><span>    wincl.lpfnWndProc = WindowProcedure;</span></span>
<span class="line"><span>    wincl.style = CS_DBLCLKS;</span></span>
<span class="line"><span>    wincl.cbSize = sizeof(WNDCLASSEX);</span></span></code></pre></div><p>上述代码开始给WNDCLASSEX结构对象赋值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> /* 使用默认图标以及鼠标指针 */</span></span>
<span class="line"><span>    wincl.hIcon = LoadIcon(NULL, IDI_APPLICATION);</span></span>
<span class="line"><span>    wincl.hIconSm = LoadIcon(NULL, IDI_APPLICATION);</span></span>
<span class="line"><span>    wincl.hCursor = LoadCursor(NULL, IDC_ARROW);</span></span>
<span class="line"><span>    wincl.lpszMenuName = NULL; /* 没有菜单栏 */</span></span>
<span class="line"><span>    wincl.cbClsExtra = 0;                      /* 没有多余的字节跟在窗体类的后面 */</span></span>
<span class="line"><span>    wincl.cbWndExtra = 0;</span></span>
<span class="line"><span>    wincl.hbrBackground = (HBRUSH) GetStockObject(LTGRAY_BRUSH);</span></span>
<span class="line"><span>    if(!RegisterClassEx(&amp;wincl)) return 0;</span></span></code></pre></div><p>代码在窗口过程调用函数的时候，将地址赋值给lpfnWndProc，然后呼叫RegisterClassEx(&amp;wincl)注册窗口类，系统就拥有了窗口过程函数的地址。如果注册失败，则返回0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> hwnd = CreateWindowEx( 0,            /* 扩展风格为0*/</span></span>
<span class="line"><span>           szClassName,         /* 类名 */</span></span>
<span class="line"><span>           &quot;Windows App&quot;,         /* 窗体抬头标题 */</span></span>
<span class="line"><span>           WS_OVERLAPPEDWINDOW, /* 默认窗体 */</span></span>
<span class="line"><span>           CW_USEDEFAULT,       /* 让操作系统决定窗体对应Windows的X位置在哪里 */</span></span>
<span class="line"><span>           CW_USEDEFAULT,       /* 让操作系统决定窗体对应Windows的Y位置在哪里 */</span></span>
<span class="line"><span>           544,                 /* 程序宽度 */</span></span>
<span class="line"><span>           375,                 /* 程序高度 */</span></span>
<span class="line"><span>           HWND_DESKTOP,        /* 父窗体的句柄，父窗体定义为Windows桌面，HWND_DESKTOP 是系统定义的最顶层的托管的窗体 */</span></span>
<span class="line"><span>           NULL,                /* 没有菜单 */</span></span>
<span class="line"><span>           hThisInstance,       /* 程序实例化句柄 */</span></span>
<span class="line"><span>           NULL                 /* 指向窗体的创建数据为空 */</span></span>
<span class="line"><span>           );</span></span>
<span class="line"><span>    ShowWindow(hwnd, nFunsterStil);</span></span>
<span class="line"><span>    /* 要显示窗体，使用的是ShowWindow函数 */</span></span>
<span class="line"><span>    while(GetMessage(&amp;messages, NULL, 0, 0))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>           TranslateMessage(&amp;messages);</span></span>
<span class="line"><span>           DispatchMessage(&amp;messages);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return messages.wParam;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>建立并显示窗体，在循环内将虚拟键消息转换为字符串消息，随后调度一个消息给窗体程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LRESULT CALLBACK WindowProcedure(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    switch (message)                  /* 指向消息的句柄 */</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>           case WM_DESTROY:</span></span>
<span class="line"><span>           PostQuitMessage(0);</span></span>
<span class="line"><span>           break;</span></span>
<span class="line"><span>           default:</span></span>
<span class="line"><span>           return DefWindowProc(hwnd, message, wParam, lParam);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后是消息处理。当窗体程序接收到某些操作的时候，比如键盘、鼠标等等，就会呼叫 DispatchMessage(&amp;messages)；函数将消息回调给系统，系统通过注册的窗口类得到函数指针并且通过函数指针调用函数对消息进行处理。</p><p>还有一个经常用到的函数就是MoveWindow，就是移动已经建立的窗体。MoveWindow函数用来改变窗口的位置和尺寸，如果窗体本身就按照计算机的屏幕对齐左上角，对于窗体内的子窗体，就对齐父窗体的左上角。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL MoveWindow( HWND hWnd,/* 窗体句柄 */</span></span>
<span class="line"><span>         int x,  /* 窗体左上角起点x轴 */</span></span>
<span class="line"><span>         int y,  /* 窗体左上角起点y轴 */</span></span>
<span class="line"><span>         int nWidth, /* 窗体宽度 */</span></span>
<span class="line"><span>         int nHeight, /* 窗体高度 */</span></span>
<span class="line"><span>         BOOL bRepaint = TRUE /* 是否重新绘制，如果是true系统会发送WM_PAINT到窗体，然后呼叫UpdateWindow函数进行重新绘制，如果是false则不重新绘制*/</span></span>
<span class="line"><span>        );</span></span></code></pre></div><p>MoveWindow会给窗体发送WM_WINDOWPOSCHANGING，WM_WINDOWPOSCHANGED，WM_MOVE，WM_SIZE和WM_NCCALCSIZE消息。</p><p>类似的功能还有SetWindowPos，SetWindowPos功能更强大，可以设置更多的参数。</p><p>这是基本的使用C/C++绘制Windows窗体的流程，也是标准的Windows窗体的创建和显示。在后续的分享中，我也会使用GDI或者GDI+来绘制一些的内容。</p><h2 id="使用python编写windows窗体" tabindex="-1">使用Python编写Windows窗体 <a class="header-anchor" href="#使用python编写windows窗体" aria-label="Permalink to &quot;使用Python编写Windows窗体&quot;">​</a></h2><p>说完了C/C++系统编程编写的Windows窗体，接下来来看一下，如何使用Python来编写Windows窗体。</p><p>Python的Windows窗体编程一般会使用默认的Tinker库。不过用别的窗体库也可一建立一个窗体，比如Python版本的QT库或者wxPython。</p><p>现在来看一下，使用默认的Tinker来建立一个窗体。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import Tkinter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def my_window(w, h):</span></span>
<span class="line"><span>  ws = root.winfo_screenwidth()</span></span>
<span class="line"><span>  hs = root.winfo_screenheight()</span></span>
<span class="line"><span>  x = (ws/2) - (w/2)</span></span>
<span class="line"><span>  y = (hs/2) - (h/2)</span></span>
<span class="line"><span>  root.geometry(&quot;%dx%d+%d+%d&quot; % (w, h, x, y))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>root = Tkinter.Tk(className=&#39;python windows app&#39;)</span></span>
<span class="line"><span>my_window(100, 100)</span></span>
<span class="line"><span>root.mainloop()</span></span></code></pre></div><p>运行的结果是这样的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E5%BC%80%E5%A7%8B%E5%AD%A6%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/images/8957/657a175b08898385f555f7613d1a55b8.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E5%BC%80%E5%A7%8B%E5%AD%A6%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/images/8957/657a175b08898385f555f7613d1a55b8.jpg" alt=""></a></p><p>我们可以看到左上角有一个Tk的标识，这是Tinker的默认图标。目前，我们只是建立了一个Windows的窗体，并不能直接编写游戏。除此之外，我们还必须要知道这些建立窗体的具体的细节。</p><p>不过，就像前面的文章所说，OpenGL并不附带任何关联窗体的编程，所以如果你使用的是OpenGL的接口来编写代码，稍微修改一下，这些窗体就能成为游戏屏幕窗体。</p><p><strong>游戏所有的内容都是在一个循环内完成的，即我们所有的绘图、线程、操作、刷新，都在一个大循环内完成</strong>，类似我们在前面看到的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while(GetMessage(&amp;messages, NULL, 0, 0))</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>      TranslateMessage(&amp;messages);</span></span>
<span class="line"><span>      DispatchMessage(&amp;messages);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>以及使用Python编写的代码的窗体中，也会看到一个循环函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>root.mainloop()</span></span></code></pre></div><p>在这个while循环中，消息的派发都在此完成。游戏也一样，我们所有游戏内的代码几乎都在循环内完成。你可以想象 <strong>一个循环完成一个大的绘制过程，第二个循环刷新前一次绘制过程，最终类似电影一样，完成整个动画的绘制以及不间断的操作。</strong></p><p>在建立Windows窗体的时候，程序会从入口函数WinMain开始运行，定义和初始化窗体类，然后将窗体类实例化，随后进行消息循环获取消息，然后将消息发送给消息处理函数，最后做出相应的操作。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>总结一下今天所说的内容，我们编写了一个标准的Windows窗体，在编写的过程中：</p><ul><li><p>窗体的结构是在建立窗体之前就定义下来的；</p></li><li><p>所有长时间运行的程序，包括游戏，包括Windows本身都是一个大循环。我们在这个循环里做我们想做的事情，直到循环结束；</p></li><li><p>如果使用脚本语言的方式编写窗体，就不需要关心那么多的东西，只需要定义坐标、位置和窗体名称即可。</p></li></ul><p>最后，给你留一道小思考题吧。</p><p>你经常会看到有一些游戏是需要全屏才能进行的。既然我们在这里建立了一个窗体，那请问你，全屏是怎么做到的呢？</p><p>欢迎留言说出你的看法，我在下一节的挑战中等你！</p>`,47)])])}const g=n(i,[["render",l]]);export{w as __pageData,g as default};
