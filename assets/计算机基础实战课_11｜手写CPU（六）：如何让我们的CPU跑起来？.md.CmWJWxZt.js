import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"11 | 手写CPU（六）：如何让我们的CPU跑起来？","description":"","frontmatter":{},"headers":[{"level":2,"title":"系统总线设计","slug":"系统总线设计","link":"#系统总线设计","children":[]},{"level":2,"title":"只读存储器 ROM 的实现","slug":"只读存储器-rom-的实现","link":"#只读存储器-rom-的实现","children":[]},{"level":2,"title":"随机访问存储器 RAM","slug":"随机访问存储器-ram","link":"#随机访问存储器-ram","children":[]},{"level":2,"title":"外设 UART 设计","slug":"外设-uart-设计","link":"#外设-uart-设计","children":[]},{"level":2,"title":"在 CPU 上跑个 Hello World","slug":"在-cpu-上跑个-hello-world","link":"#在-cpu-上跑个-hello-world","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"计算机基础实战课/11｜手写CPU（六）：如何让我们的CPU跑起来？.md","filePath":"计算机基础实战课/11｜手写CPU（六）：如何让我们的CPU跑起来？.md","lastUpdated":1795560006000}'),e={name:"计算机基础实战课/11｜手写CPU（六）：如何让我们的CPU跑起来？.md"};function l(t,s,d,h,r,c){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_11-手写cpu-六-如何让我们的cpu跑起来" tabindex="-1">11 | 手写CPU（六）：如何让我们的CPU跑起来？ <a class="header-anchor" href="#_11-手写cpu-六-如何让我们的cpu跑起来" aria-label="Permalink to &quot;11 | 手写CPU（六）：如何让我们的CPU跑起来？&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>通过前面几节课的学习，我们已经完成了 MiniCPU 五级流水线的模块设计，现在距离实现一个完整的 MiniCPU 也就一步之遥。</p><p>还差哪些工作没完成呢？还记得我们在第六节课设计的 MiniCPU 架构图吗？回想一下，我们已经设计完成的五级流水线，都包含下图的哪些模块？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/1.png" alt=""></a></p><p>上图的 CPU 核心模块，也就是 CPU Core 包含的模块的设计，这些我们已经在前面几节课里完成了。除了五级流水线的模块，我们还设计了用于保存操作数和运算结果的通用寄存器组，设计了解决数据冒险问题的 forwarding 模块，以及解决控制冒险问题的 hazard 模块。</p><p>接下来，我们还需要搞定一些外围组件，也就是图里虚线框外的系统总线、ROM、RAM、输入输出端口 GPIO（GPIO 比较简单，课程里没专门讲）和 UART 模块。</p><p>学完这节课，我们就可以把这个 CPU 运行起来了，最终我还会带你在这个 CPU 上跑一个RISC-V 版本的 Hello World 程序（课程代码从这里下载），是不是很期待？话不多说，我们这就开始！</p><h2 id="系统总线设计" tabindex="-1">系统总线设计 <a class="header-anchor" href="#系统总线设计" aria-label="Permalink to &quot;系统总线设计&quot;">​</a></h2><p>首先，让我们看看 CPU 的系统总线。</p><p>总线是连接多个部件的信息传输线，它是各部件共享的传输介质。在某一时刻，只允许有一个部件向总线发送信息，而多个部件可以同时从总线上接收相同的信息。MiniCPU 的系统总线用来连接 CPU 内核与外设，完成信息传输的功能。</p><p>系统总线在整个 MiniCPU 中是一个很关键的模块。你可以这样理解，总线就是 CPU 内核跟其他外设部件的“联络员”。举几个例子，总线可以从 ROM 中读取指令，再交给 CPU 去执行；CPU 运行程序时的变量，也会交由总线保存到 RAM 中；用来实现芯片与外部通信的 UART模块，也需要通过总线跟 CPU 进行信息交换……</p><p>那总线的代码具体要怎么设计呢？我先展示一下写好的整体代码，再带你具体分析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module sys_bus (</span></span>
<span class="line"><span>   // cpu -&gt; imem</span></span>
<span class="line"><span>   input  [31:0] cpu_imem_addr,</span></span>
<span class="line"><span>   output [31:0] cpu_imem_data,</span></span>
<span class="line"><span>   output [31:0] imem_addr,</span></span>
<span class="line"><span>   input  [31:0] imem_data,</span></span>
<span class="line"><span>   // cpu -&gt; bus</span></span>
<span class="line"><span>   input  [31:0] cpu_dmem_addr,</span></span>
<span class="line"><span>   input  [31:0] cpu_dmem_data_in,</span></span>
<span class="line"><span>   input         cpu_dmem_wen,</span></span>
<span class="line"><span>   output reg [31:0] cpu_dmem_data_out,</span></span>
<span class="line"><span>   // bus -&gt; ram</span></span>
<span class="line"><span>   input  [31:0] dmem_read_data,</span></span>
<span class="line"><span>   output [31:0] dmem_write_data,</span></span>
<span class="line"><span>   output [31:0] dmem_addr,</span></span>
<span class="line"><span>   output reg    dmem_wen,</span></span>
<span class="line"><span>   // bus -&gt; rom</span></span>
<span class="line"><span>   input  [31:0] dmem_rom_read_data,</span></span>
<span class="line"><span>   output [31:0] dmem_rom_addr,</span></span>
<span class="line"><span>   // bus -&gt; uart</span></span>
<span class="line"><span>   input  [31:0] uart_read_data,</span></span>
<span class="line"><span>   output [31:0] uart_write_data,</span></span>
<span class="line"><span>   output [31:0] uart_addr,</span></span>
<span class="line"><span>   output reg    uart_wen</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>   assign imem_addr = cpu_imem_addr;</span></span>
<span class="line"><span>   assign cpu_imem_data = imem_data;</span></span>
<span class="line"><span>   assign dmem_addr = cpu_dmem_addr;</span></span>
<span class="line"><span>   assign dmem_write_data = cpu_dmem_data_in;</span></span>
<span class="line"><span>   assign dmem_rom_addr = cpu_dmem_addr;</span></span>
<span class="line"><span>   assign uart_addr = cpu_dmem_addr;</span></span>
<span class="line"><span>   assign uart_write_data = cpu_dmem_data_in;</span></span>
<span class="line"><span>   always @(*) begin</span></span>
<span class="line"><span>       case (cpu_dmem_addr[31:28])</span></span>
<span class="line"><span>           4&#39;h0: begin                //ROM</span></span>
<span class="line"><span>               cpu_dmem_data_out &lt;= dmem_rom_read_data;</span></span>
<span class="line"><span>               dmem_wen &lt;= 0;</span></span>
<span class="line"><span>               uart_wen &lt;= 0;</span></span>
<span class="line"><span>           end</span></span>
<span class="line"><span>           4&#39;h1: begin               // RAM</span></span>
<span class="line"><span>               dmem_wen &lt;= cpu_dmem_wen;</span></span>
<span class="line"><span>               cpu_dmem_data_out &lt;= dmem_read_data;</span></span>
<span class="line"><span>               uart_wen &lt;= 0;</span></span>
<span class="line"><span>           end</span></span>
<span class="line"><span>           4&#39;h2: begin               // uart io</span></span>
<span class="line"><span>               uart_wen &lt;= cpu_dmem_wen;</span></span>
<span class="line"><span>               cpu_dmem_data_out &lt;= uart_read_data;</span></span>
<span class="line"><span>               dmem_wen &lt;= 0;</span></span>
<span class="line"><span>           end</span></span>
<span class="line"><span>           default:   begin</span></span>
<span class="line"><span>               dmem_wen &lt;= 0;</span></span>
<span class="line"><span>               uart_wen &lt;= 0;</span></span>
<span class="line"><span>               cpu_dmem_data_out &lt;= 0;</span></span>
<span class="line"><span>           end</span></span>
<span class="line"><span>       endcase</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>这里我们设计的系统总线其实是一个“一对多”的结构，也可以说是“一主多从”结构，就是一个CPU 内核作为主设备（Master），多个外设作为从设备（Slave）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/2.png" alt=""></a></p><p>CPU 内核具有系统总线的控制权，它可以通过系统总线，发起对外设的访问，而外设只能响应从 CPU 内核发来的各种总线命令。因此，每个外设都需要有一个固定的地址，作为 CPU访问特定外设的标识。</p><p>以下就是给从设备分配的地址空间：</p><ul><li>// 设备地址空间// 0x0000_0000 -ROM (word to byte )// 0x1000_0000 -RAM (word to byte )// 0x2000_0000 -uart (word to byte )// 0x3000_0000 -other(word to byte )</li></ul><p>从代码的第 39～60 行也可以看到，总线根据地址的高 4 bit 的值，就可以判断出 CPU 访问的是哪个从设备。</p><p>当（cpu_dmem_addr[31:28] = 4’h0 ）时，CPU 访问的是 ROM，把从 ROM 返回的数据赋给总线；当（cpu_dmem_addr[31:28] = 4’h1 ）时，CPU 访问的是 RAM，把 CPU 的写使能cpu_dmem_wen 赋给 RAM 的写使能信号 dmem_wen，同时把从 RAM 返回的数据赋给总线；当（cpu_dmem_addr[31:28] = 4’h2 ）时，CPU 访问的是串行通信模块 UART，把 CPU的写使能 cpu_dmem_wen 赋给 uart 的写使能信号 uart_wen，同时把从 UART 返回的数据赋给总线。这就是 MiniCPU 总线的工作过程。</p><h2 id="只读存储器-rom-的实现" tabindex="-1">只读存储器 ROM 的实现 <a class="header-anchor" href="#只读存储器-rom-的实现" aria-label="Permalink to &quot;只读存储器 ROM 的实现&quot;">​</a></h2><p>接下来，我们看看连接在总线上的存储器要如何实现。</p><p>ROM 是个缩写，它表示只读存储器（Read Only Memory）。ROM 具有非易失性的特点。什么是非易失性呢？说白了就是在系统断电的情况下，仍然可以保存数据。</p><p>正是因为这一特点，ROM 很适合用来存放计算机的程序。由于历史原因，虽然现在使用的ROM 中，有些类型不仅是可以读，还可以写，但我们还是习惯性地把它们称作只读存储器。比如，现在电子系统中常用的 EEPROM、NOR flash 、Nand flash 等，都可以归类为 ROM。</p><p>在我们的 MiniCPU 中，目前没有真正使用上述的 ROM 作为指令存储器。让我们看看MiniCPU 中实现 ROM 功能的代码，再相应分析我们的设计思路。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module imem (</span></span>
<span class="line"><span>   input  [11:0] addr1,</span></span>
<span class="line"><span>   output [31:0] imem_o1,</span></span>
<span class="line"><span>   input  [11:0] addr2,</span></span>
<span class="line"><span>   output [31:0] imem_o2</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>   reg [31:0] imem_reg[0:4096];</span></span>
<span class="line"><span>   assign imem_o1 = imem_reg[addr1];</span></span>
<span class="line"><span>   assign imem_o2 = imem_reg[addr2];</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>为了方便学习和仿真，我们使用了寄存器（reg）临时定义了一个指令存储器 imem，并在仿真的顶层（tb_top.v）使用了 $readmemh（）函数，把编译好的二进制指令读入到 imem 中，以便 CPU 内部读取并执行这些指令。这里我们设置的存储器在功能上是只读的。</p><p>以下就是仿真的顶层（tb_top.v）调用 $readmemh（）函数的语句。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$readmemh(\`HEXFILE, MiniCPU.u_imem.imem_reg);</span></span></code></pre></div><p>函数里面有两个参数，一个是存放二进制指令的文件（HEXFILE），另一个就是实现 ROM 功能的寄存器（imem_reg）。这条语句可以在我们启动 CPU 仿真时，把二进制的指令一次性读入到 imem 中，这样 CPU 运行的过程中就可以取 imem 中的指令去执行了。</p><h2 id="随机访问存储器-ram" tabindex="-1">随机访问存储器 RAM <a class="header-anchor" href="#随机访问存储器-ram" aria-label="Permalink to &quot;随机访问存储器 RAM&quot;">​</a></h2><p>除了存放指令的 ROM，我们还需要一个存放变量和数据的 RAM（Random AccessMemory）。</p><p>RAM 和特点跟 ROM 正好相反，它是易失性存储器，通常都是在掉电之后就会丢失数据。但是它具有读写速度快的优势，所以通常用作 CPU 的高速缓存。</p><p>RAM 之所以叫做随机访问存储器，是因为不同的地址可以在相同的时间内随机读写。这是由RAM 的结构决定的，RAM 使用存储阵列来存储数据，只要给出行地址和列地址，就能确定目标数据，而且这一过程和目标数据所处的物理位置无关。</p><p>和 ROM 一样，为了方便对设计的 MiniCPU 进行仿真验证，我们还是用寄存器（reg）临时构建了一个数据存储器 dmem，作为 MiniCPU 中的 RAM 使用。虽然临时构建的存储器和实际的 ROM 有点差别，但我们还在初期学习阶段，这已经足够了。</p><p>下面就是实现 RAM 功能的数据存储器 dmem 的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module dmem(</span></span>
<span class="line"><span>   input [11:0] addr,</span></span>
<span class="line"><span>   input we,</span></span>
<span class="line"><span>   input [31:0] din,</span></span>
<span class="line"><span>   input clk,</span></span>
<span class="line"><span>   output reg [31:0] dout</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>   reg [31:0] dmem_reg[0:4095];</span></span>
<span class="line"><span>   always @(posedge clk) begin</span></span>
<span class="line"><span>       if(we) begin</span></span>
<span class="line"><span>           dmem_reg[addr] &lt;= din;</span></span>
<span class="line"><span>       end</span></span>
<span class="line"><span>           dout &lt;= dmem_reg[addr];</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>代码的第 11~16 行可以看到，我们使用了时钟信号 clk，说明这里的 dmem 实现的是一个时钟同步 RAM。而且当写使能信号（we）为“1”时，才能往 RAM 里写数据，否则只能读取数据。</p><h2 id="外设-uart-设计" tabindex="-1">外设 UART 设计 <a class="header-anchor" href="#外设-uart-设计" aria-label="Permalink to &quot;外设 UART 设计&quot;">​</a></h2><p>为了让 MiniCPU 能和其他电子设备进行通信，我们还要设计 UART 模块。</p><p>同样地，设计代码之前我先带你快速了解一下 UART 是什么，它的工作原理是怎样的。</p><p>UART 的全称叫通用异步收发传输器（Universal Asynchronous Receiver/Transmitter），它是一种串行、异步、全双工的通信协议，是电子设备间进行异步通信的常用模块。</p><p>UART 负责对系统总线的并行数据和串行口上的串行数据进行转换，通信双方采用相同的波特率。在不使用时钟信号线的情况下，仅用一根数据发送信号线和一根数据接收信号线（Rx 和Tx）就可以完成两个设备间的通信，因此我们也把 UART 称为异步串行通信。</p><p>串行通信是指，利用一条传输线将数据按顺序一位位传送的过程。UART 的发送模块会把来自CPU 总线的并行数据转换为串行数据，再以串行方式将其发送到另一个设备的 UART 接收端。然后由 UART 的接收模块把串行数据转换为并行数据，以便接收设备存储和使用这些数据。</p><p>UART 的数据传输格式如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/3.png" alt=""></a></p><p>从图里我们可以看到，UART 传输数据包括起始位、数据位、奇偶校验位、停止位和空闲位。UART 数据传输线通常在不传输数据时保持在高电平。</p><p>这么多名词是不是有点应接不暇？我挨个解释一下，你就清楚了。</p><ul><li><p>起始位是在数据线上先发出一个逻辑低电平“0”信号，表示数据传输的开始。</p></li><li><p>数据位是由 5~8 位逻辑高低电平表示的“1”或“0”信号。</p></li><li><p>校验位在传输的数据位的后面加 1bit，表示“1”的位数应为偶数（偶校验）或奇数（奇校验）。</p></li><li><p>停止位是一个数据位宽的 1 倍、1.5 倍、或者 2 倍的高电平信号，它是一次数据传输的结束标志。</p></li><li><p>空闲位是数据传输线处于逻辑高电平状态，表示当前线路上处于空闲状态，没有数据传送。</p></li></ul><p>跟数据发送信号线 TX、数据接收信号线 RX 相对应，我们的 UART 也分别设计了发送模块（uart_tx）和接收模块（uart_rx）。如果你想了解具体的功能实现，可以课后查看我们的MiniCPU 的项目代码。</p><p>这里只放出来发送模块的端口信号，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module uart_tx(</span></span>
<span class="line"><span>input           clk         , // Top level system clock input.</span></span>
<span class="line"><span>input           resetn      , // Asynchronous active low reset.</span></span>
<span class="line"><span>output          uart_txd    , // UART transmit pin.</span></span>
<span class="line"><span>output          uart_tx_busy, // Module busy sending previous item.</span></span>
<span class="line"><span>input           uart_tx_en  , // Send the data on uart_tx_data</span></span>
<span class="line"><span>input   [7:0]   uart_tx_data  // The data to be sent</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>UART 接收模块的端口信号如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module uart_rx(</span></span>
<span class="line"><span>input         clk          , // Top level system clock input.</span></span>
<span class="line"><span>input         resetn       , // Asynchronous active low reset.</span></span>
<span class="line"><span>input         uart_rxd     , // UART Recieve pin.</span></span>
<span class="line"><span>input         uart_rx_en   , // Recieve enable</span></span>
<span class="line"><span>output        uart_rx_break, // Did we get a BREAK message?</span></span>
<span class="line"><span>output        uart_rx_valid, // Valid data recieved and available.</span></span>
<span class="line"><span>output reg  [7:0] uart_rx_data   // The recieved data.</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>端口信号的代码你结合上面的注释很容易就能理解，后面 CPU 跑程序的时候就会用到这部分的功能。</p><h2 id="在-cpu-上跑个-hello-world" tabindex="-1">在 CPU 上跑个 Hello World <a class="header-anchor" href="#在-cpu-上跑个-hello-world" aria-label="Permalink to &quot;在 CPU 上跑个 Hello World&quot;">​</a></h2><p>好，现在来到我们的最后一个环节，编写程序，并把它放到我们的 MiniCPU 上跑起来。</p><p>为了能更直观看到 CPU 的运行效果，这里我们使用 RISC-V 汇编指令，设计了一段用 UART发送“Hello MiniCPU!”字符串的代码，然后让串口接收端把发送的字符串在电脑上打印出来。</p><p>具体的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#    Assembly                Description</span></span>
<span class="line"><span>main:</span></span>
<span class="line"><span>       li      x2, 0x20000000          # uart address</span></span>
<span class="line"><span>       li      x6,  0x1500             #x6 &lt;== 0x1500, delay 1ms</span></span>
<span class="line"><span>       addi    x7, x0, 0               #x7 &lt;== 0</span></span>
<span class="line"><span>       addi    x5, x0, 0x48            #x5 &lt;== &quot;H&quot;</span></span>
<span class="line"><span>       sw      x5, 0(x2)</span></span>
<span class="line"><span>delay1: addi    x7, x7, 1               #x7 &lt;== x7 + 1</span></span>
<span class="line"><span>       bne     x7, x6, delay1          #x6 != x7</span></span>
<span class="line"><span>       addi    x7, x0, 0               #x7 &lt;== 0</span></span>
<span class="line"><span>       addi    x5, x0, 0x65            #x5 &lt;== &quot;e&quot;</span></span>
<span class="line"><span>       sw      x5, 0(x2)</span></span>
<span class="line"><span>delay2: addi    x7, x7, 1               #x7 &lt;== x7 + 1</span></span>
<span class="line"><span>       bne     x7, x6, delay2           #x6 != x7</span></span>
<span class="line"><span>       addi    x7, x0, 0               #x7 &lt;== 0</span></span>
<span class="line"><span>       addi    x5, x0, 0x6c            #x5 &lt;== &quot;l&quot;</span></span>
<span class="line"><span>       sw      x5, 0(x2)</span></span>
<span class="line"><span>delay3: addi    x7, x7, 1               #x7 &lt;== x7 + 1</span></span>
<span class="line"><span>       bne     x7, x6, delay3           #x6 != x7</span></span>
<span class="line"><span>       addi    x7, x0, 0               #x7 &lt;== 0</span></span>
<span class="line"><span>       addi    x5, x0, 0x6c            #x5 &lt;== &quot;l&quot;</span></span>
<span class="line"><span>       sw      x5, 0(x2)</span></span>
<span class="line"><span> …………  //由于代码较长，结构相似，这里省略了一部分，完整代码你可以从Gitee上获取</span></span>
<span class="line"><span>delay13: addi    x7, x7, 1               #x7 &lt;== x7 + 1</span></span>
<span class="line"><span>       bne     x7, x6, delay13           #x6 != x7</span></span>
<span class="line"><span>       addi    x7, x0, 0               #x7 &lt;== 0</span></span>
<span class="line"><span>       addi    x5, x0, 0x21            #x5 &lt;== &quot;!&quot;</span></span>
<span class="line"><span>       sw      x5, 0(x2)</span></span>
<span class="line"><span>end:    j       end</span></span>
<span class="line"><span>       ret</span></span></code></pre></div><p>有了代码，我们还需要把它编译成能在 CPU 上运行的机器码，才能把它放在 CPU 上跑。</p><p>下面的代码就是放在课程代码中的 Makefile，作用是编译汇编代码，还有定义好 CPU 仿真需要用到的一些命名规则。</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SOURCE_TB </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tb</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tb_top.v</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TMP_DIR </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tmp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SOURCE </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rtl.f</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TARGET </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${TMP_DIR}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tb_top.o</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TEST_HEX </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sim</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">asm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">build</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">test.dat</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 编译汇编程序，输出二进制指令</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">asm:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> make </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">C .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sim</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">asm</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> python .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sim</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">asm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">word2byte.py</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 对CPU进行仿真</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">cpu:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">f \${TMP_DIR}</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> cp \${SOURCE_TB} \${TMP_DIR}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> sed -i &#39;s#.hex#\${TEST_HEX}#&#39; \${TMP_DIR}/tb_top.v</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> iverilog -f \${SOURCE} -o \${TARGET}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> vvp \${TARGET}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看波形</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">wave:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> gtkwave \${TMP_DIR}/tb_top.vcd &amp;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 清除临时文件</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">clean:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> make -C ./sim/asm clean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> rm ./tmp/* -rf</span></span></code></pre></div><p>从 Makefile 的代码中可以看到，我们一共定义了 4 个目标命令，它们的作用分别是完成汇编程序编译的（asm）命令、执行 MiniCPU 仿真的（cpu）命令、用软件 GTKwave 打开仿真后的波形（wave）命令，以及清除仿真过程中产生的临时文件的（clean）命令。</p><p>通过在终端上执行“make asm”命令，便可以把上面设计的汇编程序编译成二进制指令test.dat。然后我们再输入“make cpu”命令就启动 MiniCPU 的仿真了，运行结果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/4.png" alt=""></a></p><p>到此，我们的 MiniCPU 就设计完成啦！祝贺你一路进行到这里。看到页面上输出 HelloMiniCPU 的时候，是不是感觉还挺好玩的？</p><p>如果你觉得意犹未尽，还可以在项目文件夹里的“./mini_cpu/sim/asm/src/miniCPU_sim.asm”这个文件中编写你自己的 RISC-V 汇编程序，然后就可以在我们的 MiniCPU 上玩出更多花样了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>这节课，我们把 MiniCPU 的几个外部模块设计完成，这几个模块是让 CPU“跑起来”的必要组件。</p><p>我们首先设计了 MiniCPU 的系统总线。有了它，就能连接 CPU 内核与外设，完成信息传输的功能，相当于 CPU 内核与外部设备的一座桥梁。</p><p>接下来的模块就是 ROM 和 RAM。ROM 是存放 CPU 指令的只读存储器。为了方便学习和仿真，我们通过寄存器临时定义了一个指令存储器，然后在仿真的顶层使用了 $readmemh 函数，把编译好的二进制指令读入到指令存储器中，这样 CPU 运行时就可以读取和执行这些指令了。</p><p>RAM 用来存放数据，它在掉电之后会丢失数据，但是读写速度快，通常用来作为 CPU 的高速缓存。跟 ROM 的实现思路一样，我们还是用寄存器临时构建了一个数据存储器 dmem，作为MiniCPU 中的 RAM 使用。</p><p>为了让 MiniCPU 能和其他设备通信，我们还设计了异步串行通信模块 UART，它用一根数据发送信号线和一根数据接收信号线就可以完成两个设备间的通信。</p><p>MiniCPU 设计好了之后，我们进入运行调试环节，用 RISC-V 指令编写了一段用 UART 发送“Hello MiniCPU!”字符串的汇编程序，然后让串口接收端把发送的字符串在电脑上打印出来。如果字符串显示正常，说明我们的 miniCPU 已经可以正常运行了。</p><p>到这里，我们 RISC-V 处理器的实现就全部完成了。这节课要点，你可以参考下面的导图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/11/5.png" alt=""></a></p><p>你有兴趣的话，还可以课后做更多的探索，比如给它添加更多的 RISCV 指令功能，在 CPU总线上挂载更多的外设……后面的课程里，我会带你学习更多的 RISC-V 指令，敬请期待！</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>计算机两大体系结构分别是冯诺依曼体系结构和哈弗体系结构，请问我们的 MiniCPU 属于哪一种体系结构呢？</p><p>期待你在留言区跟我交流互动，说说这个模块学习下来的感受，如果觉得手写 CPU 很酷，别忘了分享给身边更多的朋友。</p>`,82)])])}const u=a(e,[["render",l]]);export{E as __pageData,u as default};
