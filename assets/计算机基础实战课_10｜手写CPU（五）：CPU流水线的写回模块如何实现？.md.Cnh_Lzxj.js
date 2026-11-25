import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"10 | 手写CPU（五）：CPU流水线的写回模块如何实现？","description":"","frontmatter":{},"headers":[{"level":2,"title":"流水线控制冒险","slug":"流水线控制冒险","link":"#流水线控制冒险","children":[]},{"level":2,"title":"写回控制模块设计","slug":"写回控制模块设计","link":"#写回控制模块设计","children":[]},{"level":2,"title":"写回数据通路模块设计","slug":"写回数据通路模块设计","link":"#写回数据通路模块设计","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"计算机基础实战课/10｜手写CPU（五）：CPU流水线的写回模块如何实现？.md","filePath":"计算机基础实战课/10｜手写CPU（五）：CPU流水线的写回模块如何实现？.md","lastUpdated":1795560006000}'),l={name:"计算机基础实战课/10｜手写CPU（五）：CPU流水线的写回模块如何实现？.md"};function i(t,s,c,_,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_10-手写cpu-五-cpu流水线的写回模块如何实现" tabindex="-1">10 | 手写CPU（五）：CPU流水线的写回模块如何实现？ <a class="header-anchor" href="#_10-手写cpu-五-cpu流水线的写回模块如何实现" aria-label="Permalink to &quot;10 | 手写CPU（五）：CPU流水线的写回模块如何实现？&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>今天我们一起来完成迷你 CPU 的最后一个部分——写回相关模块的设计（课程代码在这里）。</p><p>简单回顾一下，上节课我们完成了 CPU 流水线的访存相关模块的设计。在设计访存模块之前，我们发现流水线中存在数据冒险的问题。为了解决这个问题，我们设计了数据前递模块。</p><p>但是我们采用的数据前递模块，只局限于解决算术操作和数据传输中的冒险问题。在 CPU 流水线中还可能存在结构冒险和控制冒险的问题，我们在进行流水线规划时，已经合理地避免了结构冒险。但是，控制冒险还可能出现，下面我们就来探讨一下流水线的控制冒险问题。</p><h2 id="流水线控制冒险" tabindex="-1">流水线控制冒险 <a class="header-anchor" href="#流水线控制冒险" aria-label="Permalink to &quot;流水线控制冒险&quot;">​</a></h2><p>还记得前面我们说过的条件分支指令吗？就是根据指令设置的数值比较结果，改变并控制跳转的方向，比如 beq 和 bne 指令。</p><p>假如在流水线取出分支指令后，紧跟着在下一个时钟周期就会取下一条指令。但是，流水线并不知道下一条指令应该从哪里取，因为它刚从存储器中取出分支指令，还不能确定上一条分支指令是否会发生跳转。</p><p>上面这种流水线需要根据上一条指令的执行结果决定下一步行为的情况，就是流水线中的控制冒险。这时候该怎么办呢？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/1.png" alt=""></a></p><p>控制冒险可以使用流水线停顿的方法解决，就是在取出分支指令后，流水线马上停下来，等到分支指令的结果出来，确定下一条指令从哪个地址取之后，流水线再继续。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/2.png" alt=""></a></p><p>如上图所示，每当遇到条件分支指令时，流水线就停顿以避免控制冒险。但是这种方法对性能的影响是很大的。因为条件分支指令要等到执行之后的访存阶段，才能决定分支跳转是否发生，这就相当于流水线停顿了 2 个时钟周期。我们 MiniCPU 只有五级流水线，就停顿了这么久，像 intel 的酷睿 i7 处理器流水线，它的深度有十几级，如果也用停顿的方法，那延时损失就更大了。</p><p>既然阻塞流水线直到分支指令执行完成的方法非常耗时，浪费了太多流水线的时钟周期。那么，有没有一种方法既能解决控制冒险问题，又不影响流水线的性能呢？</p><p>很遗憾，答案是否定的。到目前为止，我们还没有找到根本性的解决控制冒险问题的方法。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/3.png" alt=""></a></p><p>但是，这并不代表我们没有办法去优化它，我们可以采用分支预测的方法提升分支阻塞的效率。</p><p>具体思路是这样的，当每次遇到条件分支指令时，预测分支会发生跳转，直接在分支指令的下一条取跳转后相应地址的指令。如果分支发生跳转的概率是 50%，那么这种优化方式就可以减少一半由控制冒险带来的性能损失。</p><p>其实我们第六节课取指阶段设计的预读取模块（if_pre.v），实现的就是这个功能，相关代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   wire is_bxx = (instr[6:0] == \`OPCODE_BRANCH);   //条件挑转指令的操作码</span></span>
<span class="line"><span>   wire is_jal = (instr[6:0] == \`OPCODE_JAL) ;     //无条件跳转指令的操作码</span></span>
<span class="line"><span>   //B型指令的立即数拼接</span></span>
<span class="line"><span>   wire [31:0] bimm  = {​{20{instr[31]}​}, instr[7], instr[30:25], instr[11:8], 1&#39;</span></span>
<span class="line"><span>   //J型指令的立即数拼接</span></span>
<span class="line"><span>   wire [31:0] jimm  = {​{12{instr[31]}​}, instr[19:12], instr[20], instr[30:21],</span></span>
<span class="line"><span>   //指令地址的偏移量</span></span>
<span class="line"><span>   wire [31:0] adder = is_jal ? jimm : (is_bxx &amp; bimm[31]) ? bimm : 4;</span></span>
<span class="line"><span>   assign pre_pc = pc + adder;</span></span></code></pre></div><p>看到这你可能还有疑问，如果条件分支不发生跳转的话又会怎么样呢？这种情况下，已经被读取和译码的指令就会被丢弃，流水线继续从不分支的地址取指令。</p><p>要想丢弃指令也不难，只需要把流水线中的控制信号和数据清“0”即可，也就是当预测失败的分支指令执行之后，到达访存阶段时，需要将流水线中处于取指、译码和执行阶段的指令清除。</p><p>我先展示一下控制冒险模块的整体代码，之后再详细解读。代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module hazard (</span></span>
<span class="line"><span> input  [4:0]  rs1,</span></span>
<span class="line"><span> input  [4:0]  rs2,</span></span>
<span class="line"><span> input         alu_result_0,</span></span>
<span class="line"><span> input  [1:0]  id_ex_jump,</span></span>
<span class="line"><span> input         id_ex_branch,</span></span>
<span class="line"><span> input         id_ex_imm_31,</span></span>
<span class="line"><span> input         id_ex_memRead,</span></span>
<span class="line"><span> input         id_ex_memWrite,</span></span>
<span class="line"><span> input  [4:0]  id_ex_rd,</span></span>
<span class="line"><span> input  [1:0]  ex_mem_maskMode,</span></span>
<span class="line"><span> input         ex_mem_memWrite,</span></span>
<span class="line"><span> output reg    pcFromTaken,</span></span>
<span class="line"><span> output reg    pcStall,</span></span>
<span class="line"><span> output reg    IF_ID_stall,</span></span>
<span class="line"><span> output reg    ID_EX_stall,</span></span>
<span class="line"><span> output reg    ID_EX_flush,</span></span>
<span class="line"><span> output reg    EX_MEM_flush,</span></span>
<span class="line"><span> output reg    IF_ID_flush</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span> wire branch_do = ((alu_result_0 &amp; ~id_ex_imm_31) | (~alu_result_0 &amp; id_ex_imm_3</span></span>
<span class="line"><span> wire ex_mem_taken = id_ex_jump[0] | (id_ex_branch &amp; branch_do);</span></span>
<span class="line"><span> wire id_ex_memAccess = id_ex_memRead | id_ex_memWrite;</span></span>
<span class="line"><span> wire ex_mem_need_stall = ex_mem_memWrite &amp; (ex_mem_maskMode == 2&#39;h0 | ex_mem_ma</span></span>
<span class="line"><span> always @(*) begin</span></span>
<span class="line"><span>   if(id_ex_memAccess &amp;&amp; ex_mem_need_stall) begin</span></span>
<span class="line"><span>     pcFromTaken  &lt;= 0;</span></span>
<span class="line"><span>     pcStall      &lt;= 1;</span></span>
<span class="line"><span>     IF_ID_stall  &lt;= 1;</span></span>
<span class="line"><span>     IF_ID_flush  &lt;= 0;</span></span>
<span class="line"><span>     ID_EX_stall  &lt;= 1;</span></span>
<span class="line"><span>     ID_EX_flush  &lt;= 0;</span></span>
<span class="line"><span>     EX_MEM_flush &lt;= 1;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span>   else if(ex_mem_taken) begin</span></span>
<span class="line"><span>     pcFromTaken  &lt;= 1;</span></span>
<span class="line"><span>     pcStall      &lt;= 0;</span></span>
<span class="line"><span>     IF_ID_flush  &lt;= 1;</span></span>
<span class="line"><span>     ID_EX_flush  &lt;= 1;</span></span>
<span class="line"><span>     EX_MEM_flush &lt;= 0;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span>   else if(id_ex_memRead &amp; (id_ex_rd == rs1 || id_ex_rd == rs2)) begin</span></span>
<span class="line"><span>     pcFromTaken &lt;= 0;</span></span>
<span class="line"><span>     pcStall     &lt;= 1;</span></span>
<span class="line"><span>     IF_ID_stall &lt;= 1;</span></span>
<span class="line"><span>     ID_EX_flush &lt;= 1;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span>   else begin</span></span>
<span class="line"><span>     pcFromTaken    &lt;= 0;</span></span>
<span class="line"><span>     pcStall        &lt;= 0;</span></span>
<span class="line"><span>     IF_ID_stall    &lt;= 0;</span></span>
<span class="line"><span>     ID_EX_stall    &lt;= 0;</span></span>
<span class="line"><span>     ID_EX_flush    &lt;= 0;</span></span>
<span class="line"><span>     EX_MEM_flush   &lt;= 0;</span></span>
<span class="line"><span>     IF_ID_flush    &lt;= 0;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>首先我们来看看在控制冒险模块中，内部产生的几个信号都起到了怎样的作用。</p><p>branch_do 信号就是条件分支指令的条件比较结果，由 ALU 运算结果和立即数的最高位（符合位）通过“与”操作得到；ex_mem_taken 是确认分支指令跳转的信号，由无条件跳转（jump）“或”条件分支指令（branch）产生。</p><p>id_ex_memAccess 是存储器的选通信号，当对存储器的“读”或者“写”控制信号有效时产生；ex_mem_need_stall 信号表示流水线需要停顿，当执行 sb 或者 sh 指令时就会出现这样的情况。</p><p>然后，再来看看我们这个模块要输出的几个信号。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> wire branch_do = ((alu_result_0 &amp; ~id_ex_imm_31) | (~alu_result_0 &amp; id_ex_imm_3</span></span>
<span class="line"><span> wire ex_mem_taken = id_ex_jump[0] | (id_ex_branch &amp; branch_do);</span></span>
<span class="line"><span> wire id_ex_memAccess = id_ex_memRead | id_ex_memWrite;</span></span>
<span class="line"><span> wire ex_mem_need_stall = ex_mem_memWrite &amp; (ex_mem_maskMode == 2&#39;h0 | ex_mem_ma</span></span></code></pre></div><p>pcFromTaken 是分支指令执行之后，判断和分支预测方向是否一致的信号。pcStall 是控制程序计数器停止的信号，如果程序计数器停止，那么流水线将不会读取新的指令。IF_ID_stall 是流水线中从取指到译码的阶段的停止信号。ID_EX_stall 是流水线从译码到执行阶段的停止信号。</p><p>此外，当流水线需要冲刷时，就会产生取指、译码、执行、访存阶段的清零信号，分别对应着ID_EX_flush、EX_MEM_flush 和 IF_ID_flush 信号。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> output reg    pcFromTaken,  //分支指令执行结果，判断是否与预测方向一样</span></span>
<span class="line"><span> output reg    pcStall,    //程序计数器停止信号</span></span>
<span class="line"><span> output reg    IF_ID_stall,  //流水线IF_ID段停止信号</span></span>
<span class="line"><span> output reg    ID_EX_stall,  //流水线ID_EX段停止信号</span></span>
<span class="line"><span> output reg    ID_EX_flush,  //流水线ID_EX段清零信号</span></span>
<span class="line"><span> output reg    EX_MEM_flush,   //流水线EX_MEM段清零信号</span></span>
<span class="line"><span> output reg    IF_ID_flush    //流水线IF_ID段清零信号</span></span></code></pre></div><p>什么情况下才会产生上面的控制信号呢？一共有三种情况，我这就带你依次分析一下。</p><p>第一种情况是解决数据相关性问题。数据相关指的是指令之间存在的依赖关系。当两条指令之间存在相关关系时，它们就不能在流水线中重叠执行。</p><p>例如，前一条指令是访存指令 Store，后一条也是 Load 或者 Store 指令，因为我们采用的是同步 RAM，需要先读出再写入，占用两个时钟周期，所以这时要把之后的指令停一个时钟周期。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   if(ID_EX_memAccess &amp;&amp; EX_MEM_need_stall) begin</span></span>
<span class="line"><span>     pcFromTaken  &lt;= 0;</span></span>
<span class="line"><span>     pcStall      &lt;= 1;</span></span>
<span class="line"><span>     IF_ID_stall  &lt;= 1;</span></span>
<span class="line"><span>     IF_ID_flush  &lt;= 0;</span></span>
<span class="line"><span>     ID_EX_stall  &lt;= 1;</span></span>
<span class="line"><span>     ID_EX_flush  &lt;= 0;</span></span>
<span class="line"><span>     EX_MEM_flush &lt;= 1;</span></span>
<span class="line"><span>   end</span></span></code></pre></div><p>第二种情况是分支预测失败的问题，当分支指令执行之后，如果发现分支跳转的方向与预测方向不一致。这时就需要冲刷流水线，清除处于取指、译码阶段的指令数据，更新 PC 值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 分支预测失败，需要冲刷流水线，更新pc值</span></span>
<span class="line"><span>   else if(EX_MEM_taken) begin</span></span>
<span class="line"><span>     pcFromTaken  &lt;= 1;</span></span>
<span class="line"><span>     pcStall      &lt;= 0;</span></span>
<span class="line"><span>     IF_ID_flush  &lt;= 1;</span></span>
<span class="line"><span>     ID_EX_flush  &lt;= 1;</span></span>
<span class="line"><span>     EX_MEM_flush &lt;= 0;</span></span>
<span class="line"><span>   end</span></span></code></pre></div><p>第三种情况就是解决上一节课提到的数据冒险问题。当前一条指令是 Load，后一条指令的源寄存器 rs1 和 rs2 依赖于前一条从存储器中读出来的值，需要把 Load 指令之后的指令停顿一个时钟周期，而且还要冲刷 ID _EX 阶段的指令数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   else if(ID_EX_memRead &amp; (ID_EX_rd == rs1 || ID_EX_rd == rs2)) begin</span></span>
<span class="line"><span>     pcFromTaken &lt;= 0;</span></span>
<span class="line"><span>     pcStall     &lt;= 1;</span></span>
<span class="line"><span>     IF_ID_stall &lt;= 1;</span></span>
<span class="line"><span>     ID_EX_flush &lt;= 1;</span></span>
<span class="line"><span>   end</span></span></code></pre></div><p>解决了流水线的冒险问题，我们才能确保指令经过流水线执行后，得到的结果是正确的，这时候才能把执行结果写回到寄存器。接下来，让我们来继续完成写回阶段的模块设计。</p><h2 id="写回控制模块设计" tabindex="-1">写回控制模块设计 <a class="header-anchor" href="#写回控制模块设计" aria-label="Permalink to &quot;写回控制模块设计&quot;">​</a></h2><p>现在我们来到了流水线的最后一级——结果写回。先来看看写回控制模块，这个模块实现起来就非常简单了，它的作用就是选择存储器读取回来的数据作为写回的结果，还是选择流水线执行运算之后产生的数据作为写回结果。</p><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module mem_wb_ctrl(</span></span>
<span class="line"><span> input   clk,</span></span>
<span class="line"><span> input   reset,</span></span>
<span class="line"><span> input   in_wb_ctrl_toReg,</span></span>
<span class="line"><span> input   in_wb_ctrl_regWrite,</span></span>
<span class="line"><span> output  data_wb_ctrl_toReg,</span></span>
<span class="line"><span> output  data_wb_ctrl_regWrite</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span> reg  reg_wb_ctrl_toReg;</span></span>
<span class="line"><span> reg  reg_wb_ctrl_regWrite;</span></span>
<span class="line"><span> assign data_wb_ctrl_toReg = reg_wb_ctrl_toReg;</span></span>
<span class="line"><span> assign data_wb_ctrl_regWrite = reg_wb_ctrl_regWrite;</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_wb_ctrl_toReg &lt;= 1&#39;h0;</span></span>
<span class="line"><span>   end else begin</span></span>
<span class="line"><span>     reg_wb_ctrl_toReg &lt;= in_wb_ctrl_toReg;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_wb_ctrl_regWrite &lt;= 1&#39;h0;</span></span>
<span class="line"><span>   end else begin</span></span>
<span class="line"><span>     reg_wb_ctrl_regWrite &lt;= in_wb_ctrl_regWrite;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>代码里有两个重要的信号需要你留意。一个是写回寄存器的数据选择信号 wb_ctrl_toReg，当这个信号为“1”时，选择从存储器读取的数值作为写回数据，否则把流水线的运算结果作为写回数据。另一个是寄存器的写控制信号 wb_ctrl_regWrite，当这个信号为“1”时，开始往目标寄存器写回指令执行的结果。</p><h2 id="写回数据通路模块设计" tabindex="-1">写回数据通路模块设计 <a class="header-anchor" href="#写回数据通路模块设计" aria-label="Permalink to &quot;写回数据通路模块设计&quot;">​</a></h2><p>和写回的控制模块一样，流水线的最后一级的写回数据通路上的信号也变得比较少了。</p><p>写回数据通路模块产生的信号主要包括写回目标寄存器的地址 reg_WAddr，流水线执行运算后的结果数据 result，从存储器读取的数据 readData。</p><p>写回数据通路的模块代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module mem_wb(</span></span>
<span class="line"><span> input         clk,</span></span>
<span class="line"><span> input         reset,</span></span>
<span class="line"><span> input  [4:0]  in_regWAddr,</span></span>
<span class="line"><span> input  [31:0] in_result,</span></span>
<span class="line"><span> input  [31:0] in_readData,</span></span>
<span class="line"><span> input  [31:0] in_pc,</span></span>
<span class="line"><span> output [4:0]  data_regWAddr,</span></span>
<span class="line"><span> output [31:0] data_result,</span></span>
<span class="line"><span> output [31:0] data_readData,</span></span>
<span class="line"><span> output [31:0] data_pc</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span> reg [4:0]  reg_regWAddr;</span></span>
<span class="line"><span> reg [31:0] reg_result;</span></span>
<span class="line"><span> reg [31:0] reg_readData;</span></span>
<span class="line"><span> reg [31:0] reg_pc;</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_regWAddr &lt;= 5&#39;h0;</span></span>
<span class="line"><span>   end else  begin</span></span>
<span class="line"><span>     reg_regWAddr &lt;= in_regWAddr;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_result &lt;= 32&#39;h0;</span></span>
<span class="line"><span>   end else begin</span></span>
<span class="line"><span>     reg_result &lt;= in_result;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_readData &lt;= 32&#39;h0;</span></span>
<span class="line"><span>   end else begin</span></span>
<span class="line"><span>     reg_readData &lt;= in_readData;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_pc &lt;= 32&#39;h0;</span></span>
<span class="line"><span>   end else  begin</span></span>
<span class="line"><span>     reg_pc &lt;= in_pc;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span> assign data_regWAddr = reg_regWAddr;</span></span>
<span class="line"><span> assign data_result = reg_result;</span></span>
<span class="line"><span> assign data_readData = reg_readData;</span></span>
<span class="line"><span> assign data_pc = reg_pc;</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>仔细观察代码，你是否发现和流水线的前面几级的数据通路模块相比，少了两个控制信号呢？</p><p>是的，写回阶段的模块没有了流水线的停止控制信号 stall 和流水线的冲刷控制信号 flush。这是因为写回阶段的数据经过了数据冒险和控制冒险模块的处理，已经可以确保流水线产生的结果无误了，所以写回阶段的数据不受停止信号 stall 和清零信号 flush 的控制。</p><p>到这里，我们要设计的迷你 CPU 的五级流水线就基本完成啦。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>最后我给你做个总结吧。</p><p>这节课我们先分析了流水线中存在的控制冒险问题，也就是当流水线中出现条件分支指令时，下一条指令还不确定从哪里取的问题。最容易想到的解决方案，就是在取出分支指令后，流水线马上停下来，等到分支指令的结果出来，确定下一条指令从哪个地址获取之后，流水线再继续。但是，这里流水线停顿的方式缺点很明显，它会带来很多 CPU 的性能损失。</p><p>于是，我们采用了分支预测的方法，预测每一条分支指令都会发生跳转，直接在分支指令的下一条取跳转后相应地址的指令。如果分支发生跳转的概率是 50%，那么这种优化方式就可以减少一半由控制冒险带来的性能损失。</p><p>最后，根据整个流水线执行后的数据，我们完成了流水线的最后一级，也就是写回控制模块和数据通路模块的设计。写回控制模块要么选择存储器读取回来的数据作为写回结果，要么选择流水线执行运算之后产生的数据作为写回结果。数据通路模块则包含了写回目标寄存器的地址、ALU 的运算结果以及访存阶段读存储器得到的数据。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/10/4.png" alt=""></a></p><p>到这里，我们终于把 CPU 的五级流水线的最后一级设计完成了，这代表基于指令集 RV32I 的迷你 CPU 核心代码设计已经完成。很快就可以让它跑程序了，你是不是很期待呢？下一节课我们就可以看到效果了！</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>除了流水线停顿和分支预测方法，是否还有其他解决控制冒险问题的办法？</p><p>欢迎你在留言区跟我交流互动，或者记录下你的思考与收获。如果觉得这节课还不错，别忘了分享给身边的朋友，我们一起来手写 CPU！</p>`,64)])])}const u=n(l,[["render",i]]);export{g as __pageData,u as default};
