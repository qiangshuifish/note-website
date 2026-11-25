import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"07 | 手写CPU（二）：如何实现指令译码模块？","description":"","frontmatter":{},"headers":[{"level":2,"title":"指令是如何翻译的？","slug":"指令是如何翻译的","link":"#指令是如何翻译的","children":[]},{"level":2,"title":"译码模块的设计","slug":"译码模块的设计","link":"#译码模块的设计","children":[]},{"level":2,"title":"译码控制模块设计","slug":"译码控制模块设计","link":"#译码控制模块设计","children":[]},{"level":2,"title":"译码数据通路模块设计","slug":"译码数据通路模块设计","link":"#译码数据通路模块设计","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"计算机基础实战课/07｜手写CPU（二）：如何实现指令译码模块？.md","filePath":"计算机基础实战课/07｜手写CPU（二）：如何实现指令译码模块？.md","lastUpdated":1795560006000}'),l={name:"计算机基础实战课/07｜手写CPU（二）：如何实现指令译码模块？.md"};function i(t,s,c,r,_,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_07-手写cpu-二-如何实现指令译码模块" tabindex="-1">07 | 手写CPU（二）：如何实现指令译码模块？ <a class="header-anchor" href="#_07-手写cpu-二-如何实现指令译码模块" aria-label="Permalink to &quot;07 | 手写CPU（二）：如何实现指令译码模块？&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>上节课，我们了解了什么是 CPU 的流水线，并决定采用经典的五级流水线来设计我们的MiniCPU，之后梳理了我们将要设计的 MiniCPU 架构长什么样，最后完成了流水线的第一步——取指。</p><p>取指阶段把存储器里的指令读出以后，就会传递给后续的译码模块进行处理。那之后指令是如何译码的呢？这就要说到流水线的第二步——译码（代码从这里下载）。</p><h2 id="指令是如何翻译的" tabindex="-1">指令是如何翻译的？ <a class="header-anchor" href="#指令是如何翻译的" aria-label="Permalink to &quot;指令是如何翻译的？&quot;">​</a></h2><p>第五节课我们已经讲过了 RISC-V 指令架构，明确了我们的 MiniCPU 选用的是 RV32I 指令集。其中每条指令都是 32 位，且分为 6 种指令格式，不同格式的指令中包含了不一样的指令信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/1.png" alt=""></a></p><p>如上图所示的 6 种指令格式，其中 R 型指令包含了操作码 opcode、目标寄存器索引 rd、功能码 funct3 和 funct7 以及源寄存器索引 rs1 和 rs2。而 I 型指令则是包含操作码 opcode、目标寄存器索引 rd、功能码 funct3、源寄存器索引 rs1 以及立即数 imm。</p><p>与此类似，后面的 S 型指令、B 型指令、U 型指令和 J 型指令也有特定的操作码、功能码、源寄存器索引、目标寄存器索引和立即数。</p><p>不过指令格式不同，指令译码模块翻译指令的工作机制却是统一的。首先译码电路会翻译出指令中携带的寄存器索引、立即数大小等执行信息。接着，在解决数据可能存在的数据冒险（这个概念后面第九节课会讲）之后，由译码数据通路负责把译码后的指令信息，发送给对应的执行单元去执行。</p><h2 id="译码模块的设计" tabindex="-1">译码模块的设计 <a class="header-anchor" href="#译码模块的设计" aria-label="Permalink to &quot;译码模块的设计&quot;">​</a></h2><p>通过上面的分析，你是否对译码模块的设计已经有了头绪？是的，译码模块就是拆解从取指模块传过来的每一条指令。译码时，需要识别出指令的操作码，并根据对应的指令格式提取出指令中包含的信息。</p><p>译码模块具体的 Verilog 设计代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module decode (</span></span>
<span class="line"><span> input  [31:0] instr,      //指令源码</span></span>
<span class="line"><span> output  [4:0] rs1_addr,    //源寄存器rs1索引</span></span>
<span class="line"><span> output  [4:0] rs2_addr,    //源寄存器rs2索引</span></span>
<span class="line"><span> output  [4:0] rd_addr,    //目标寄存器rd索引</span></span>
<span class="line"><span> output  [2:0] funct3,      //功能码funct3</span></span>
<span class="line"><span> output  [6:0] funct7,      //功能码funct7</span></span>
<span class="line"><span> output        branch,</span></span>
<span class="line"><span> output [1:0]  jump,</span></span>
<span class="line"><span> output        mem_read,</span></span>
<span class="line"><span> output        mem_write,</span></span>
<span class="line"><span> output        reg_write,</span></span>
<span class="line"><span> output        to_reg,</span></span>
<span class="line"><span> output [1:0]  result_sel,</span></span>
<span class="line"><span> output        alu_src,</span></span>
<span class="line"><span> output        pc_add,</span></span>
<span class="line"><span> output [6:0]  types,</span></span>
<span class="line"><span> output [1:0]  alu_ctrlop,</span></span>
<span class="line"><span> output        valid_inst,</span></span>
<span class="line"><span> output [31:0] imm</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>localparam DEC_INVALID = 21&#39;b0;</span></span>
<span class="line"><span>reg [20:0] dec_array;</span></span>
<span class="line"><span>//---------- decode rs1、rs2 -----------------</span></span>
<span class="line"><span>assign rs1_addr = instr[19:15];</span></span>
<span class="line"><span>assign rs2_addr = instr[24:20];</span></span>
<span class="line"><span>//---------- decode rd -----------------------</span></span>
<span class="line"><span>assign rd_addr = instr[11:7];</span></span>
<span class="line"><span>//---------- decode funct3、funct7 -----------</span></span>
<span class="line"><span>assign funct7 = instr[31:25];</span></span>
<span class="line"><span>assign funct3 = instr[14:12];</span></span>
<span class="line"><span>// ----------------------------- decode signals ---------------------------------</span></span>
<span class="line"><span>//                        20     19-18  17       16        15        14     13-12</span></span>
<span class="line"><span>//                        branch jump   memRead  memWrite  regWrite  toReg  resul</span></span>
<span class="line"><span>localparam DEC_LUI     = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b01</span></span>
<span class="line"><span>localparam DEC_AUIPC   = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_JAL     = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b10</span></span>
<span class="line"><span>localparam DEC_JALR    = {1&#39;b0,  2&#39;b11, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b10</span></span>
<span class="line"><span>localparam DEC_BRANCH  = {1&#39;b1,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b0,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_LOAD    = {1&#39;b0,  2&#39;b00, 1&#39;b1,    1&#39;b0,     1&#39;b1,     1&#39;b1,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_STORE   = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b1,     1&#39;b0,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_ALUI    = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_ALUR    = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>assign  {branch, jump, mem_read, mem_write, reg_write, to_reg, result_sel, alu_sr</span></span>
<span class="line"><span>always @(*) begin</span></span>
<span class="line"><span> case(instr[6:0])</span></span>
<span class="line"><span>   \`OPCODE_LUI    :   dec_array &lt;= DEC_LUI;</span></span>
<span class="line"><span>   \`OPCODE_AUIPC  :   dec_array &lt;= DEC_AUIPC;</span></span>
<span class="line"><span>   \`OPCODE_JAL    :   dec_array &lt;= DEC_JAL;</span></span>
<span class="line"><span>   \`OPCODE_JALR   :   dec_array &lt;= DEC_JALR;</span></span>
<span class="line"><span>   \`OPCODE_BRANCH :   dec_array &lt;= DEC_BRANCH;</span></span>
<span class="line"><span>   \`OPCODE_LOAD   :   dec_array &lt;= DEC_LOAD;</span></span>
<span class="line"><span>   \`OPCODE_STORE  :   dec_array &lt;= DEC_STORE;</span></span>
<span class="line"><span>   \`OPCODE_ALUI   :   dec_array &lt;= DEC_ALUI;</span></span>
<span class="line"><span>   \`OPCODE_ALUR   :   dec_array &lt;= DEC_ALUR;</span></span>
<span class="line"><span>   default        :  begin</span></span>
<span class="line"><span>                dec_array &lt;= DEC_INVALID;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> endcase</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span>// -------------------- IMM -------------------------</span></span>
<span class="line"><span>wire [31:0] Iimm = {​{21{instr[31]}​}, instr[30:20]};</span></span>
<span class="line"><span>wire [31:0] Simm = {​{21{instr[31]}​}, instr[30:25], instr[11:7]};</span></span>
<span class="line"><span>wire [31:0] Bimm = {​{20{instr[31]}​}, instr[7], instr[30:25], instr[11:8], 1&#39;b0};</span></span>
<span class="line"><span>wire [31:0] Uimm = {instr[31:12], 12&#39;b0};</span></span>
<span class="line"><span>wire [31:0] Jimm = {​{12{instr[31]}​}, instr[19:12], instr[20], instr[30:21], 1&#39;b0}</span></span>
<span class="line"><span>assign imm = {32{types[5]}​} &amp; Iimm</span></span>
<span class="line"><span>          | {32{types[4]}​} &amp; Simm</span></span>
<span class="line"><span>          | {32{types[3]}​} &amp; Bimm</span></span>
<span class="line"><span>          | {32{types[2]}​} &amp; Uimm</span></span>
<span class="line"><span>          | {32{types[1]}​} &amp; Jimm;</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>这段代码看起来很长，其实整个代码可以分为三个部分：第 28 行到 37 行负责完成指令的源寄存器、目标寄存器、3 位操作码和 7 位操作码的译码，第 40 行至 73 行负责完成指令格式类型的识别，第 75 行至 87 行负责完成立即数译码。</p><p>首先，我们来看指令中源寄存器、目标寄存器、3 位操作码和 7 位操作码的译码。仔细观察上面提到的 6 种指令格式，我们可以发现一定的规律：全部的目标寄存器索引 rd 都位于指令的第 7～11 位，源寄存器索引 rs1 位于指令的第 15～19 位，源寄存器索引 rs2 位于指令的第20～24 位，三位的操作码 funct3 位于指令的第 12～14 位，七位的操作码 funct7 位于指令的第 25～31 位。</p><p>它们的位置分布如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/2.png" alt=""></a></p><p>上述这些信号在不同指令格式中的位置比较固定。因此我们就可以根据这些位置特点，直接从指令中截取，从而得到它们相应的信息，具体实现的 Verilog 代码如下（对应整体代码的 27～37 行）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//---------- decode rs1、rs2 -----------------</span></span>
<span class="line"><span>assign rs1_addr = instr[19:15];</span></span>
<span class="line"><span>assign rs2_addr = instr[24:20];</span></span>
<span class="line"><span>//---------- decode rd -----------------------</span></span>
<span class="line"><span>assign rd_addr = instr[11:7];</span></span>
<span class="line"><span>//---------- decode funct3、funct7 -----------</span></span>
<span class="line"><span>assign funct7 = instr[31:25];</span></span>
<span class="line"><span>assign funct3 = instr[14:12];</span></span></code></pre></div><p>在所有的指令格式中，还有一段最为特殊的信息码。这段信息码是每条指令都有的，且位置和位宽保持不变。没错，它就是指令的操作码 opcode。</p><p>对照 RISC-V 的官方手册，我为你整理出了 RV32I 指令集的操作码对照表，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/3.png" alt=""></a></p><p>我们再来回顾一下 RISC-V 的指令格式，这次我们重点观察指令操作码的位置。</p><p>不难发现，所有指令操作码都位于指令的第 0～6 位。根据这 7 位的操作码就可以判断出一条指令是什么类型，它对应的是什么指令格式。进而可以产生指令执行信号，为后续的指令执行单元的操作提供依据。</p><p>以下就是指令操作码的译码和产生相关指令控制信号的 Verilog 代码（对应整体代码的 39～72行）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ----------------------------- decode signals ---------------------------------</span></span>
<span class="line"><span>//                        20     19-18  17       16        15        14     13-12</span></span>
<span class="line"><span>//                        branch jump   memRead  memWrite  regWrite  toReg  resul</span></span>
<span class="line"><span>localparam DEC_LUI     = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b01</span></span>
<span class="line"><span>localparam DEC_AUIPC   = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_JAL     = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b10</span></span>
<span class="line"><span>localparam DEC_JALR    = {1&#39;b0,  2&#39;b11, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b10</span></span>
<span class="line"><span>localparam DEC_BRANCH  = {1&#39;b1,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b0,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_LOAD    = {1&#39;b0,  2&#39;b00, 1&#39;b1,    1&#39;b0,     1&#39;b1,     1&#39;b1,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_STORE   = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b1,     1&#39;b0,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_ALUI    = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>localparam DEC_ALUR    = {1&#39;b0,  2&#39;b00, 1&#39;b0,    1&#39;b0,     1&#39;b1,     1&#39;b0,  2&#39;b00</span></span>
<span class="line"><span>assign  {branch, jump, mem_read, mem_write, reg_write, to_reg, result_sel, alu_sr</span></span>
<span class="line"><span>always @(*) begin</span></span>
<span class="line"><span> case(instr[6:0])</span></span>
<span class="line"><span>   \`OPCODE_LUI    :   dec_array &lt;= DEC_LUI;</span></span>
<span class="line"><span>   \`OPCODE_AUIPC  :   dec_array &lt;= DEC_AUIPC;</span></span>
<span class="line"><span>   \`OPCODE_JAL    :   dec_array &lt;= DEC_JAL;</span></span>
<span class="line"><span>   \`OPCODE_JALR   :   dec_array &lt;= DEC_JALR;</span></span>
<span class="line"><span>   \`OPCODE_BRANCH :   dec_array &lt;= DEC_BRANCH;</span></span>
<span class="line"><span>   \`OPCODE_LOAD   :   dec_array &lt;= DEC_LOAD;</span></span>
<span class="line"><span>   \`OPCODE_STORE  :   dec_array &lt;= DEC_STORE;</span></span>
<span class="line"><span>   \`OPCODE_ALUI   :   dec_array &lt;= DEC_ALUI;</span></span>
<span class="line"><span>   \`OPCODE_ALUR   :   dec_array &lt;= DEC_ALUR;</span></span>
<span class="line"><span>   default        :  begin</span></span>
<span class="line"><span>                dec_array &lt;= DEC_INVALID;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> endcase</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>从上面的代码我们可以看到，译码的过程就是先识别指令的低 7 位操作码 instr[6:0]，根据操作码对应的代码标识，产生分支信号 branch、跳转信号 jump、读存储器信号 mem_read……这些译码之后的指令控制信息。然后，把译码得到的信息交到 CPU 流水线的下一级去执行。</p><p>此外，还有指令中的立即数需要提取。观察上述的 6 种指令格式你会发现，除了 R 型指令不包含立即数，其他 5 种指令类型都包含了立即数。</p><p>前面我已经讲过了怎么去识别指令的类型。那指令里的立即数怎么提取呢？其实这跟提取指令的索引、功能码差不多。</p><p>我们根据不同指令类型中立即数的分布位置，就能直接提取指令的立即数。最后也是根据指令的类型选择性输出 I 型、S 型、B 型、U 型或者 J 型指令的立即数即可，具体的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// -------------------- IMM -------------------------</span></span>
<span class="line"><span>wire [31:0] Iimm = {​{21{instr[31]}​}, instr[30:20]};</span></span>
<span class="line"><span>wire [31:0] Simm = {​{21{instr[31]}​}, instr[30:25], instr[11:7]};</span></span>
<span class="line"><span>wire [31:0] Bimm = {​{20{instr[31]}​}, instr[7], instr[30:25], instr[11:8], 1&#39;b0};</span></span>
<span class="line"><span>wire [31:0] Uimm = {instr[31:12], 12&#39;b0};</span></span>
<span class="line"><span>wire [31:0] Jimm = {​{12{instr[31]}​}, instr[19:12], instr[20], instr[30:21], 1&#39;b0}</span></span>
<span class="line"><span>assign imm = {32{types[5]}​} &amp; Iimm</span></span>
<span class="line"><span>          | {32{types[4]}​} &amp; Simm</span></span>
<span class="line"><span>          | {32{types[3]}​} &amp; Bimm</span></span>
<span class="line"><span>          | {32{types[2]}​} &amp; Uimm</span></span>
<span class="line"><span>          | {32{types[1]}​} &amp; Jimm;</span></span></code></pre></div><h2 id="译码控制模块设计" tabindex="-1">译码控制模块设计 <a class="header-anchor" href="#译码控制模块设计" aria-label="Permalink to &quot;译码控制模块设计&quot;">​</a></h2><p>前面的译码模块得到的指令信号，可以分为两大类。一类是由指令的操作码经过译码后产生的指令执行控制信号，如跳转操作 jump 信号、存储器读取 mem_read 信号等；另一类是从指令源码中提取出来的数据信息，如立即数、寄存器索引、功能码等。</p><p>为了能对流水线更好地实施控制，这里我们需要把译码后的数据和控制信号分开处理。首先来看译码控制模块的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module id_ex_ctrl(</span></span>
<span class="line"><span> input        clk,</span></span>
<span class="line"><span> input        reset,</span></span>
<span class="line"><span> input        in_ex_ctrl_itype,</span></span>
<span class="line"><span> input  [1:0] in_ex_ctrl_alu_ctrlop,</span></span>
<span class="line"><span> input  [1:0] in_ex_ctrl_result_sel,</span></span>
<span class="line"><span> input        in_ex_ctrl_alu_src,</span></span>
<span class="line"><span> input        in_ex_ctrl_pc_add,</span></span>
<span class="line"><span> input        in_ex_ctrl_branch,</span></span>
<span class="line"><span> input  [1:0] in_ex_ctrl_jump,</span></span>
<span class="line"><span> input        in_mem_ctrl_mem_read,</span></span>
<span class="line"><span> input        in_mem_ctrl_mem_write,</span></span>
<span class="line"><span> input  [1:0] in_mem_ctrl_mask_mode,</span></span>
<span class="line"><span> input        in_mem_ctrl_sext,</span></span>
<span class="line"><span> input        in_wb_ctrl_to_reg,</span></span>
<span class="line"><span> input        in_wb_ctrl_reg_write,</span></span>
<span class="line"><span> input        in_noflush,</span></span>
<span class="line"><span> input        flush,</span></span>
<span class="line"><span> input        valid,</span></span>
<span class="line"><span> output       out_ex_ctrl_itype,</span></span>
<span class="line"><span> output [1:0] out_ex_ctrl_alu_ctrlop,</span></span>
<span class="line"><span> output [1:0] out_ex_ctrl_result_sel,</span></span>
<span class="line"><span> output       out_ex_ctrl_alu_src,</span></span>
<span class="line"><span> output       out_ex_ctrl_pc_add,</span></span>
<span class="line"><span> output       out_ex_ctrl_branch,</span></span>
<span class="line"><span> output [1:0] out_ex_ctrl_jump,</span></span>
<span class="line"><span> output       out_mem_ctrl_mem_read,</span></span>
<span class="line"><span> output       out_mem_ctrl_mem_write,</span></span>
<span class="line"><span> output [1:0] out_mem_ctrl_mask_mode,</span></span>
<span class="line"><span> output       out_mem_ctrl_sext,</span></span>
<span class="line"><span> output       out_wb_ctrl_to_reg,</span></span>
<span class="line"><span> output       out_wb_ctrl_reg_write,</span></span>
<span class="line"><span> output       out_noflush</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span> reg  reg_ex_ctrl_itype;</span></span>
<span class="line"><span> reg [1:0] reg_ex_ctrl_alu_ctrlop;</span></span>
<span class="line"><span> reg [1:0] reg_ex_ctrl_result_sel;</span></span>
<span class="line"><span> reg  reg_ex_ctrl_alu_src;</span></span>
<span class="line"><span> reg  reg_ex_ctrl_pc_add;</span></span>
<span class="line"><span> reg  reg_ex_ctrl_branch;</span></span>
<span class="line"><span> reg [1:0] reg_ex_ctrl_jump;</span></span>
<span class="line"><span> reg  reg_mem_ctrl_mem_read;</span></span>
<span class="line"><span> reg  reg_mem_ctrl_mem_write;</span></span>
<span class="line"><span> reg [1:0] reg_mem_ctrl_mask_mode;</span></span>
<span class="line"><span> reg  reg_mem_ctrl_sext;</span></span>
<span class="line"><span> reg  reg_wb_ctrl_to_reg;</span></span>
<span class="line"><span> reg  reg_wb_ctrl_reg_write;</span></span>
<span class="line"><span> reg  reg_noflush;</span></span>
<span class="line"><span> ………………    //由于这里的代码较长，结构相似，这里省略了一部分</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_noflush &lt;= 1&#39;h0;</span></span>
<span class="line"><span>   end else if (flush) begin</span></span>
<span class="line"><span>     reg_noflush &lt;= 1&#39;h0;</span></span>
<span class="line"><span>   end else if (valid) begin</span></span>
<span class="line"><span>     reg_noflush &lt;= in_noflush;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>上面就是译码控制模块的 Verilog 设计代码。</p><p>上一节课学习取指模块的时候我们说过，并不是所有从存储器中读取出来的指令，都能够给到执行单元去执行的。比如，当指令发生冲突时，需要对流水线进行冲刷，这时就需要清除流水线中的指令。同样的，译码阶段的指令信号也需要清除。</p><p>译码控制模块就是为了实现这一功能，当指令清除信号 flush 有效时，把译码模块产生的jump、branch、mem_read、mem_write、reg_write……这些控制信号全部清“0”。否则，就把这些控制信号发送给流水线的下一级进行处理。</p><h2 id="译码数据通路模块设计" tabindex="-1">译码数据通路模块设计 <a class="header-anchor" href="#译码数据通路模块设计" aria-label="Permalink to &quot;译码数据通路模块设计&quot;">​</a></h2><p>和译码模块类似，译码数据通路模块会根据 CPU 相关控制模块产生的流水线冲刷控制信号，决定要不要把这些数据发送给后续模块。</p><p>其中，译码得到的数据信息包括立即数 imm、源寄存器索引 rs1 和 rs2、目标寄存器索引 rd以及功能码 funct3 和 funct7。具体的设计代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module id_ex(</span></span>
<span class="line"><span> input         clk,</span></span>
<span class="line"><span> input         reset,</span></span>
<span class="line"><span> input  [4:0]  in_rd_addr,</span></span>
<span class="line"><span> input  [6:0]  in_funct7,</span></span>
<span class="line"><span> input  [2:0]  in_funct3,</span></span>
<span class="line"><span> input  [31:0] in_imm,</span></span>
<span class="line"><span> input  [31:0] in_rs2_data,</span></span>
<span class="line"><span> input  [31:0] in_rs1_data,</span></span>
<span class="line"><span> input  [31:0] in_pc,</span></span>
<span class="line"><span> input  [4:0]  in_rs1_addr,</span></span>
<span class="line"><span> input  [4:0]  in_rs2_addr,</span></span>
<span class="line"><span> input         flush,</span></span>
<span class="line"><span> input         valid,</span></span>
<span class="line"><span> output [4:0]  out_rd_addr,</span></span>
<span class="line"><span> output [6:0]  out_funct7,</span></span>
<span class="line"><span> output [2:0]  out_funct3,</span></span>
<span class="line"><span> output [31:0] out_imm,</span></span>
<span class="line"><span> output [31:0] out_rs2_data,</span></span>
<span class="line"><span> output [31:0] out_rs1_data,</span></span>
<span class="line"><span> output [31:0] out_pc,</span></span>
<span class="line"><span> output [4:0]  out_rs1_addr,</span></span>
<span class="line"><span> output [4:0]  out_rs2_addr</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span> reg [4:0] reg_rd_addr;</span></span>
<span class="line"><span> reg [6:0] reg_funct7;</span></span>
<span class="line"><span> reg [2:0] reg_funct3;</span></span>
<span class="line"><span> reg [31:0] reg_imm;</span></span>
<span class="line"><span> reg [31:0] reg_rs2_data;</span></span>
<span class="line"><span> reg [31:0] reg_rs1_data;</span></span>
<span class="line"><span> reg [31:0] reg_pc;</span></span>
<span class="line"><span> reg [4:0] reg_rs1_addr;</span></span>
<span class="line"><span> reg [4:0] reg_rs2_addr;</span></span>
<span class="line"><span> …………  //由于代码较长，结构相似，这里省略了一部分，完整代码你可以从Gitee上获取</span></span>
<span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_rs2_addr &lt;= 5&#39;h0;</span></span>
<span class="line"><span>   end else if (flush) begin</span></span>
<span class="line"><span>     reg_rs2_addr &lt;= 5&#39;h0;</span></span>
<span class="line"><span>   end else if (valid) begin</span></span>
<span class="line"><span>     reg_rs2_addr &lt;= in_rs2_addr;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span>
<span class="line"><span>endmodule</span></span></code></pre></div><p>我们以目标寄存器的索引地址 reg_rd_addr 信号为例，分析一下它是怎么流通的。当流水线冲刷信号 flush 有效时，目标寄存器的索引地址 reg_rd_addr 直接清“0”，否则当信号有效标志valid 为“1”时，把目标寄存器的索引地址传递给流水线的下一级。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> always @(posedge clk or posedge reset) begin</span></span>
<span class="line"><span>   if (reset) begin</span></span>
<span class="line"><span>     reg_rd_addr &lt;= 5&#39;h0;</span></span>
<span class="line"><span>   end else if (flush) begin</span></span>
<span class="line"><span>     reg_rd_addr &lt;= 5&#39;h0;</span></span>
<span class="line"><span>   end else if (valid) begin</span></span>
<span class="line"><span>     reg_rd_addr &lt;= in_rd_addr;</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span> end</span></span></code></pre></div><p>类似地，当流水线冲刷信号 flush 有效时，把译码模块得到的源操作数 1、源操作数 2、立即数、目标寄存器地址……等等这些数据全部清“0”。否则，就把这些数据发送给流水线的下一级进行处理。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>指令译码是 CPU 流水线中比较重要的一步，在译码阶段一定不能出错，否则流水线后续的执行就全都乱了。今天我们设计出了指令译码的相关模块，我带你回顾一下这节课的要点。</p><p>首先，我们针对 RV32I 指令集的 6 种指令格式，分析了它们各自包含了哪些指令信号。根据这些信息的位置不同，指令译码模块就可以从不同类型的指令格式中，把每条指令包含的信息提取出来。</p><p>之后，根据上面分析的译码思路，我们就可以设计译码模块了。经过观察，我们发现指令中的操作码、目标寄存器索引、源寄存器索引和功能码，在不同指令格式中的位置比较固定，所以这些信息可以直接从指令中截取得到。</p><p>由于指令的操作码有特殊的指令标识作用，我们可以根据操作码产生指令控制信息，给到CPU 流水线的下一级去执行。此外，还可以根据不同指令类型中立即数的分布位置特点，通过截取得到指令的立即数。</p><p>译码得到的指令信号分为两大类：一类是由指令的操作码经过译码后产生的指令执行控制信号，另一类是从指令源码中提取出来的数据信息。为了让译码后的信息，能更好地分发给流水线后续模块去执行，这里我们把译码后的数据和控制信号分开处理，分别设计了数据通路模块和译码控制模块。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80%E5%AE%9E%E6%88%98%E8%AF%BE/images/07/4.png" alt=""></a></p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在 6 种指令格式中，S 型、J 型和 B 型指令里的立即数是不连续的，这是为什么？</p><p>欢迎你在留言区跟我交流互动，也推荐你把这节课分享给更多朋友，组团一起来跟我折腾CPU!</p>`,56)])])}const b=n(l,[["render",i]]);export{o as __pageData,b as default};
