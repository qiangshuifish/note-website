import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"27 | 模型工程（三）：低成本领域模型方案，小团队怎么做大模型？","description":"","frontmatter":{},"headers":[{"level":2,"title":"为什么选 Alpaca 项目？","slug":"为什么选-alpaca-项目","link":"#为什么选-alpaca-项目","children":[]},{"level":2,"title":"数据生成过程","slug":"数据生成过程","link":"#数据生成过程","children":[]},{"level":2,"title":"全量参数训练","slug":"全量参数训练","link":"#全量参数训练","children":[]},{"level":2,"title":"LoRA 低成本训练","slug":"lora-低成本训练","link":"#lora-低成本训练","children":[{"level":3,"title":"本地设置","slug":"本地设置","link":"#本地设置","children":[]},{"level":3,"title":"训练（finetune.py）","slug":"训练-finetune-py","link":"#训练-finetune-py","children":[]},{"level":3,"title":"推理（generate.py）","slug":"推理-generate-py","link":"#推理-generate-py","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"AI大模型系统实战/27｜模型工程（三）：低成本领域模型方案，小团队怎么做大模型？.md","filePath":"AI大模型系统实战/27｜模型工程（三）：低成本领域模型方案，小团队怎么做大模型？.md","lastUpdated":1795452834000}'),i={name:"AI大模型系统实战/27｜模型工程（三）：低成本领域模型方案，小团队怎么做大模型？.md"};function t(l,s,o,c,r,h){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_27-模型工程-三-低成本领域模型方案-小团队怎么做大模型" tabindex="-1">27 | 模型工程（三）：低成本领域模型方案，小团队怎么做大模型？ <a class="header-anchor" href="#_27-模型工程-三-低成本领域模型方案-小团队怎么做大模型" aria-label="Permalink to &quot;27 | 模型工程（三）：低成本领域模型方案，小团队怎么做大模型？&quot;">​</a></h1><p>你好，我是 Tyler。</p><p>在前两节课中，我们学习了如何通过 self-instruct 的方法获取训练数据，以及如何以较低成本训练模型。你对这两个内容掌握得如何？</p><p>今天这节课，我们将继续深入探讨这些算法的具体实现。我们将学习数据增强、全量训练和LoRA（低秩适应）的低成本领域模型训练。</p><h2 id="为什么选-alpaca-项目" tabindex="-1">为什么选 Alpaca 项目？ <a class="header-anchor" href="#为什么选-alpaca-项目" aria-label="Permalink to &quot;为什么选 Alpaca 项目？&quot;">​</a></h2><p>为了帮助你快速直观地建立感性认识，我在众多的学习对象中选择了 Alpaca 这个开源项目。目前，许多领域专属模型的开发方法几乎都源自 Alpaca，而且 Alpaca 的开源实现与工业界的需求紧密契合，可以说达到了工业级的入门标准。而且，Alpaca 的全量参数训练和 LoRA 加速训练方法都得到了出色的开源项目支持。</p><p>我们可以通过研究 Alpaca 项目的原始代码来了解大语言模型的训练方法。在你掌握并灵活使用 Alpaca 之后，就可以逐渐上手工业级复杂大语言模型的开发和微调。好，现在我们正式开始 Alpaca 开源项目的学习。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/AI%E5%A4%A7%E6%A8%A1%E5%9E%8B%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/images/27/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/AI%E5%A4%A7%E6%A8%A1%E5%9E%8B%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/images/27/1.png" alt=""></a></p><p>先来看一下数据生成算法的实现，Alpaca 模型是通过对 7B 的 LLaMA 模型使用 self-instruct论文中的技术生成的 5.2 万条指令遵循数据。self-instruct 论文提出了一种新的生成数据增强方法，可以有效地提高大语言模型的性能。</p><p>目前 Alpaca 模型仍在发展中，存在一些局限性，例如安全性问题。不过，安全性问题是开源大语言模型的通用问题，因此在使用 Alpaca 模型时，我们需要采取相应的安全措施，例如使用安全的输入数据和训练方法，以及在部署模型时应采取相应的风控和内容安全策略。</p><p>下面我们开始 Alpaca 的具体实现学习，大致分为数据生成、模型训练和训练提效这几个环节。</p><h2 id="数据生成过程" tabindex="-1">数据生成过程 <a class="header-anchor" href="#数据生成过程" aria-label="Permalink to &quot;数据生成过程&quot;">​</a></h2><p>在第 25 节课我们学习了 Alpaca 的数据生成方法，Alpaca 对 self-instruct（自我教导）数据生成的方式进行了升级，提高了效率，降低了花费。这些升级包括用 text-davinci-003（代替davinci）来生成指令数据，并且创建了一个新的提示词模版 prompt.txt。</p><p>此外，他还采用了更大胆的批量解码方式，每一次会生成 20 条指令，大幅度降低了生成数据的费用。同时，数据生成流程也变得更简单了，取消了分类指令和非分类指令之间的差异，每个指令只生成一个实例，而不再生成 2 到 3 个实例。</p><p>这些优化成功生成了包含 52000 个实例的指令数据集，而成本只有不到 500 美元。初步研究还显示，与之前的 self-instruct 发布的数据相比，这样生成的这 52000 条数据更加多样化。</p><p>下一步，我们将带你生成这些数据，体会一下这种无中生有的快乐。</p><p>要运行这些代码，你需要使用你的 OpenAI API 密钥，设置环境变量 OPENAI_API_KEY，然后用以下命令安装所需的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ pip install -r requirements.txt</span></span></code></pre></div><p>接下来，我们运行生成数据的指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ python -m generate_instruction generate_instruction_following_data</span></span></code></pre></div><p>这里 generate_instruction_following_data 函数，是为了生成新的指令数据，确保新生成的指令文本不要和已有的指令文本过于相似。生成的数据可以用于微调预训练大语言模型。</p><p>下面我将为你解释一下这个函数的具体实现。步骤稍微有点多，需要你耐心一点，跟住我的节奏还是很容易理解的。</p><p>首先，它加载了种子任务数据，这是人工编写的指令数据，代码中将解析这些 JSON 格式的数据，提取指令、输入和输出信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>seed_tasks = [json.loads(l) for l in open(seed_tasks_path, &quot;r&quot;)]</span></span>
<span class="line"><span>seed_instruction_data = [</span></span>
<span class="line"><span>   {&quot;instruction&quot;: t[&quot;instruction&quot;], &quot;input&quot;: t[&quot;instances&quot;][0][&quot;input&quot;], &quot;outpu</span></span>
<span class="line"><span>   for t in seed_tasks</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>接着，它创建了一个输出目录（如果不存在的话），用于存储生成的指令数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>os.makedirs(output_dir, exist_ok=True)</span></span></code></pre></div><p>之后我们需要初始化一些变量，其中包括生成请求的索引、存储机器生成指令的数据列表以及ROUGE 评估器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>request_idx = 0</span></span>
<span class="line"><span>machine_instruction_data = []</span></span>
<span class="line"><span>scorer = rouge_scorer.RougeScorer([&quot;rougeL&quot;], use_stemmer=False)</span></span></code></pre></div><p>这里还有一个进度条，用于可视化地追踪生成进度，如果已经有新的指令数据生成出来，就会更新进度条。</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">progress_bar </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> tqdm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">tqdm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(total</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">num_instructions_to_generate)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> machine_instruction_data:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   progress_bar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">update</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">len</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(machine_instruction_data))</span></span></code></pre></div><p>接下来，将所有种子任务指令和已生成的机器指令数据变成 token，以便后续做相似性比较。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>all_instructions = [d[&quot;instruction&quot;] for d in seed_instruction_data] + [</span></span>
<span class="line"><span>   d[&quot;instruction&quot;] for d in machine_instruction_data</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>all_instruction_tokens = [scorer._tokenizer.tokenize(inst) for inst in all_instru</span></span></code></pre></div><p>之后，算法通过循环生成新的指令数据，直到达到指定的指令数据生成数量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while len(machine_instruction_data) &lt; num_instructions_to_generate:</span></span>
<span class="line"><span>   request_idx += 1</span></span>
<span class="line"><span>   # ... (以下是生成新指令的主要部分)</span></span></code></pre></div><p>接下来为每个生成请求创建一个输入文本批次，每个批次包含多个提示指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>batch_inputs = []</span></span>
<span class="line"><span>for _ in range(request_batch_size):</span></span>
<span class="line"><span>   # only sampling from the seed tasks</span></span>
<span class="line"><span>   prompt_instructions = random.sample(seed_instruction_data, num_prompt_instruc</span></span>
<span class="line"><span>   prompt = encode_prompt(prompt_instructions)</span></span>
<span class="line"><span>   batch_inputs.append(prompt)</span></span></code></pre></div><p>再然后我们就可以使用 OpenAI 的 API 向模型提出请求，生成新的指令数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>decoding_args = utils.OpenAIDecodingArguments(</span></span>
<span class="line"><span>   temperature=temperature,</span></span>
<span class="line"><span>   n=1,</span></span>
<span class="line"><span>   max_tokens=3072,</span></span>
<span class="line"><span>   top_p=top_p,</span></span>
<span class="line"><span>   stop=[&quot;\\n20&quot;, &quot;20.&quot;, &quot;20.&quot;],</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>request_start = time.time()</span></span>
<span class="line"><span>results = utils.openai_completion(</span></span>
<span class="line"><span>   prompts=batch_inputs,</span></span>
<span class="line"><span>   model_name=model_name,</span></span>
<span class="line"><span>   batch_size=request_batch_size,</span></span>
<span class="line"><span>   decoding_args=decoding_args,</span></span>
<span class="line"><span>   logit_bias={&quot;50256&quot;: -100},</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>request_duration = time.time() - request_start</span></span></code></pre></div><p>再然后，处理生成的结果，提取新生成的指令数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>process_start = time.time()</span></span>
<span class="line"><span>instruction_data = []</span></span>
<span class="line"><span>for result in results:</span></span>
<span class="line"><span>   new_instructions = post_process_gpt3_response(num_prompt_instructions, result</span></span>
<span class="line"><span>   instruction_data += new_instructions</span></span></code></pre></div><p>之后是比较关键的计算相似度环节。对每个新生成的指令数据，需要使用 ROUGE 评估方法，计算它与已有指令数据的相似性分数。如果相似度高于 0.7，这个指令将不予保留。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>total = len(instruction_data)</span></span>
<span class="line"><span>keep = 0</span></span>
<span class="line"><span>for instruction_data_entry in instruction_data:</span></span>
<span class="line"><span>   # ... (以下是计算相似性分数的主要部分)</span></span></code></pre></div><p>最后，保存新生成的指令数据到文件，打印每个请求的持续时间、生成的指令数量和保留的指令数量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>process_duration = time.time() - process_start</span></span>
<span class="line"><span>print(f&quot;Request {request_idx} took {request_duration:.2f}s, processing took {proc</span></span>
<span class="line"><span>print(f&quot;Generated {total} instructions, kept {keep} instructions&quot;)</span></span>
<span class="line"><span>utils.jdump(machine_instruction_data, os.path.join(output_dir, &quot;regen.json&quot;))</span></span></code></pre></div><p>到这里，generate_instruction_following_data 函数就完成了它的使命，我们也拿到了生成的指令微调数据。</p><h2 id="全量参数训练" tabindex="-1">全量参数训练 <a class="header-anchor" href="#全量参数训练" aria-label="Permalink to &quot;全量参数训练&quot;">​</a></h2><p>接下来，我们用上一步中生成的数据，来训练 Llama 模型。最终生成的数据存储在alpaca_data.json 文件中，其中的数据集包含了 52000 条指令，每个指令由以下字段组成。</p><ul><li><p>instruction：一个字符串，描述模型应该执行的任务，这 52000 条指令都是独一无二的。</p></li><li><p>input：是一个可选的字段，用来表示指令的可选上下文或输入。大约 40% 的示例包含这个字段，例如，当指令是 “总结以下文章” 时，该字段的输入则是文章原文内容。</p></li><li><p>output：一个字符串，由 text-davinci-003 生成的、作为指令数据的输出。</p></li></ul><p>你可以看一下文稿后面的例子，这样更好理解。</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;instruction&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Give three tips for staying healthy.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;input&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;output&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.Eat a balanced diet and make sure to include plenty of fruit</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   },</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">]</span></span></code></pre></div><p>如果你想要进行微调，首先需要使用以下指令安装必要的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ pip install -r requirements.txt</span></span></code></pre></div><p>接下来，需要在拥有 4 个 A100 80G GPU（FSDP full_shard 模式）的机器上，使用我们的数据集对 LLaMA-7B 进行微调。</p><p>我们使用后面的命令，就可以在 Python 3.10 上复现与论文中模型质量相似的结果。</p><p>首先修改以下配置内容。</p><ol><li><p>第一要设置端口 &lt;​your_random_port&gt;，这个端口用于多机多卡训练。</p></li><li><p>第二个参数是原始预训练 llama 模型所在的路径&lt;​your_path_to_hf_converted_llama_ckpt_and_tokenizer&gt;。</p></li><li><p>第三个参数是训练完成后模型保存的路径 &lt;​your_output_dir&gt;。</p></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>torchrun --nproc_per_node=4 --master_port=&lt;​your_random_port&gt; train.py \\</span></span>
<span class="line"><span>   --model_name_or_path &lt;​your_path_to_hf_converted_llama_ckpt_and_tokenizer&gt; \\</span></span>
<span class="line"><span>   --data_path ./alpaca_data.json \\</span></span>
<span class="line"><span>   --bf16 True \\</span></span>
<span class="line"><span>   --output_dir &lt;​your_output_dir&gt; \\</span></span>
<span class="line"><span>   --num_train_epochs 3 \\</span></span>
<span class="line"><span>   --per_device_train_batch_size 4 \\</span></span>
<span class="line"><span>   --per_device_eval_batch_size 4 \\</span></span>
<span class="line"><span>   --gradient_accumulation_steps 8 \\</span></span>
<span class="line"><span>   --evaluation_strategy &quot;no&quot; \\</span></span>
<span class="line"><span>   --save_strategy &quot;steps&quot; \\</span></span>
<span class="line"><span>   --save_steps 2000 \\</span></span>
<span class="line"><span>   --save_total_limit 1 \\</span></span>
<span class="line"><span>   --learning_rate 2e-5 \\</span></span>
<span class="line"><span>   --weight_decay 0. \\</span></span>
<span class="line"><span>   --warmup_ratio 0.03 \\</span></span>
<span class="line"><span>   --lr_scheduler_type &quot;cosine&quot; \\</span></span>
<span class="line"><span>   --logging_steps 1 \\</span></span>
<span class="line"><span>   --fsdp &quot;full_shard auto_wrap&quot; \\</span></span>
<span class="line"><span>   --fsdp_transformer_layer_cls_to_wrap &#39;LlamaDecoderLayer&#39; \\</span></span>
<span class="line"><span>   --tf32 True</span></span></code></pre></div><p>这个脚本也同样适用于 OPT（Open Pre-trained Transformer Language Models）的微调。以下是微调 OPT-6.7B 的示例，你可以尝试一下 Meta 的另一款模型，看看和 Llama 有什么区别。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>torchrun --nproc_per_node=4 --master_port=&lt;​your_random_port&gt; train.py \\</span></span>
<span class="line"><span>   --model_name_or_path &quot;facebook/opt-6.7b&quot; \\</span></span>
<span class="line"><span>   --data_path ./alpaca_data.json \\</span></span>
<span class="line"><span>   --bf16 True \\</span></span>
<span class="line"><span>   --output_dir &lt;​your_output_dir&gt; \\</span></span>
<span class="line"><span>   --num_train_epochs 3 \\</span></span>
<span class="line"><span>   --per_device_train_batch_size 4 \\</span></span>
<span class="line"><span>   --per_device_eval_batch_size 4 \\</span></span>
<span class="line"><span>   --gradient_accumulation_steps 8 \\</span></span>
<span class="line"><span>   --evaluation_strategy &quot;no&quot; \\</span></span>
<span class="line"><span>   --save_strategy &quot;steps&quot; \\</span></span>
<span class="line"><span>   --save_steps 2000 \\</span></span>
<span class="line"><span>   --save_total_limit 1 \\</span></span>
<span class="line"><span>   --learning_rate 2e-5 \\</span></span>
<span class="line"><span>   --weight_decay 0. \\</span></span>
<span class="line"><span>   --warmup_ratio 0.03 \\</span></span>
<span class="line"><span>   --lr_scheduler_type &quot;cosine&quot; \\</span></span>
<span class="line"><span>   --logging_steps 1 \\</span></span>
<span class="line"><span>   --fsdp &quot;full_shard auto_wrap&quot; \\</span></span>
<span class="line"><span>   --fsdp_transformer_layer_cls_to_wrap &#39;OPTDecoderLayer&#39; \\</span></span>
<span class="line"><span>   --tf32 True</span></span></code></pre></div><p>需要注意的是，这里提供的训练脚本是为了简化使用，让你可以轻松上手，所以没有经过特别的性能优化。如果要使用更多的 GPU 运行，你可以试着调整 gradient_accumulation_steps的设置。</p><h2 id="lora-低成本训练" tabindex="-1">LoRA 低成本训练 <a class="header-anchor" href="#lora-低成本训练" aria-label="Permalink to &quot;LoRA 低成本训练&quot;">​</a></h2><p>当然，不是所有的同学都有条件进行全量的训练实验，毕竟它需要 8 张 A100 的显卡，这时候我们可以运用上节课学到的 LoRA（低秩适应）。</p><p>我们可以使用这种方法来复现斯坦福大学 Alpaca 项目的结果。在接下来要讲的这个项目中，也提供了一个 Instruct 模型，而且训练的质量与 text-davinci-003 类似，可以在树莓派上运行的（用于研究）、而且代码也可以轻松扩展到 13b、30b 和 65b 的模型。</p><p>除了训练代码，该项目还发布了已微调好的模型和 LoRA 权重以及推理的脚本。为了让微调的过程节省资源并且高效，该项目使用了 HuggingFace 的 PEFT 和 Tim Dettmers 的bitsandbytes 来优化性能。</p><p>在默认的超参数设置下，LoRA 模型的输出与斯坦福 Alpaca 模型相当。不过进一步的调整可能会取得更好的性能。如果你对此感兴趣，不妨亲自尝试一下，并把你的结果在留言区里分享出来。</p><h3 id="本地设置" tabindex="-1">本地设置 <a class="header-anchor" href="#本地设置" aria-label="Permalink to &quot;本地设置&quot;">​</a></h3><p>我们首先在本地设置 LoRA，首先安装必要的依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ pip install -r requirements.txt</span></span></code></pre></div><p>如果 bitsandbytes 无法正常工作，可以考虑从源代码进行安装。</p><h3 id="训练-finetune-py" tabindex="-1">训练（finetune.py） <a class="header-anchor" href="#训练-finetune-py" aria-label="Permalink to &quot;训练（finetune.py）&quot;">​</a></h3><p>finetune.py 包含了基于 PEFT 微调 LLaMA 模型的示例，具体的用法是后面这样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python finetune.py \\</span></span>
<span class="line"><span>   --base_model &#39;decapoda-research/llama-7b-hf&#39; \\</span></span>
<span class="line"><span>   --data_path &#39;yahma/alpaca-cleaned&#39; \\</span></span>
<span class="line"><span>   --output_dir &#39;./lora-alpaca&#39;</span></span></code></pre></div><p>下面我带你梳理一下 train 函数的内容，这是模型训练代码的核心部分，这里我们挑主要的代码逻辑讲解。我们使用了 Hugging Face Transformers 库中的 LlamaForCausalLM 类来加载基础模型，这里通过 base_model 参数来设置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   model = LlamaForCausalLM.from_pretrained(</span></span>
<span class="line"><span>       base_model,</span></span>
<span class="line"><span>       load_in_8bit=True,</span></span>
<span class="line"><span>       torch_dtype=torch.float16,</span></span>
<span class="line"><span>       device_map=device_map,</span></span>
<span class="line"><span>   )</span></span></code></pre></div><p>接着，我们为 LoRA 方法创建配置，然后把它传到模型的设置中。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   config</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> LoraConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       r</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lora_r,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       lora_alpha</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lora_alpha,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       target_modules</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lora_target_modules,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       lora_dropout</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lora_dropout,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       bias</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;none&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       task_type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;CAUSAL_LM&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   )</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   model</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> get_peft_model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">model,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>然后，这里的代码检查了是否有恢复训练的检查点。如果有，它会加载已有的模型权重。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   if resume_from_checkpoint:</span></span>
<span class="line"><span>       # Check the available weights and load them</span></span>
<span class="line"><span>       checkpoint_name = os.path.join(</span></span>
<span class="line"><span>           resume_from_checkpoint, &quot;pytorch_model.bin&quot;</span></span>
<span class="line"><span>       )  # Full checkpoint</span></span>
<span class="line"><span>       if not os.path.exists(checkpoint_name):</span></span>
<span class="line"><span>           checkpoint_name = os.path.join(</span></span>
<span class="line"><span>               resume_from_checkpoint, &quot;adapter_model.bin&quot;</span></span>
<span class="line"><span>           )  # only LoRA model - LoRA config above has to fit</span></span>
<span class="line"><span>           resume_from_checkpoint = (</span></span>
<span class="line"><span>               False  # So the trainer won&#39;t try loading its state</span></span>
<span class="line"><span>           )</span></span>
<span class="line"><span>       # The two files above have a different name depending on how they were sa</span></span>
<span class="line"><span>       if os.path.exists(checkpoint_name):</span></span>
<span class="line"><span>           print(f&quot;Restarting from {checkpoint_name}&quot;)</span></span>
<span class="line"><span>           adapters_weights = torch.load(checkpoint_name)</span></span>
<span class="line"><span>           set_peft_model_state_dict(model, adapters_weights)</span></span>
<span class="line"><span>       else:</span></span>
<span class="line"><span>           print(f&quot;Checkpoint {checkpoint_name} not found&quot;)</span></span></code></pre></div><p>之后的这段代码用来检查是否在单机多卡（Multi-GPU）环境中运行，如果是，将模型配置为模型并行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   if not ddp and torch.cuda.device_count() &gt; 1:</span></span>
<span class="line"><span>       # keeps Trainer from trying its own DataParallelism when more than 1 gpu</span></span>
<span class="line"><span>       model.is_parallelizable = True</span></span>
<span class="line"><span>       model.model_parallel = True</span></span></code></pre></div><p>然后，这里创建了一个 Hugging Face Transformers 的 Trainer 对象，用于管理和执行训练过程，其中设置了训练参数、数据集和数据收集器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   trainer = transformers.Trainer(</span></span>
<span class="line"><span>       model=model,</span></span>
<span class="line"><span>       train_dataset=train_data,</span></span>
<span class="line"><span>       eval_dataset=val_data,</span></span>
<span class="line"><span>       args=transformers.TrainingArguments(</span></span>
<span class="line"><span>           per_device_train_batch_size=micro_batch_size,</span></span>
<span class="line"><span>           gradient_accumulation_steps=gradient_accumulation_steps,</span></span>
<span class="line"><span>           warmup_steps=100,</span></span>
<span class="line"><span>           num_train_epochs=num_epochs,</span></span>
<span class="line"><span>           learning_rate=learning_rate,</span></span>
<span class="line"><span>           fp16=True,</span></span>
<span class="line"><span>           logging_steps=10,</span></span>
<span class="line"><span>           optim=&quot;adamw_torch&quot;,</span></span>
<span class="line"><span>           evaluation_strategy=&quot;steps&quot; if val_set_size &gt; 0 else &quot;no&quot;,</span></span>
<span class="line"><span>           save_strategy=&quot;steps&quot;,</span></span>
<span class="line"><span>           eval_steps=200 if val_set_size &gt; 0 else None,</span></span>
<span class="line"><span>           save_steps=200,</span></span>
<span class="line"><span>           output_dir=output_dir,</span></span>
<span class="line"><span>           save_total_limit=3,</span></span>
<span class="line"><span>           load_best_model_at_end=True if val_set_size &gt; 0 else False,</span></span>
<span class="line"><span>           ddp_find_unused_parameters=False if ddp else None,</span></span>
<span class="line"><span>           group_by_length=group_by_length,</span></span>
<span class="line"><span>           report_to=&quot;wandb&quot; if use_wandb else None,</span></span>
<span class="line"><span>           run_name=wandb_run_name if use_wandb else None,</span></span>
<span class="line"><span>       ),</span></span>
<span class="line"><span>       data_collator=transformers.DataCollatorForSeq2Seq(</span></span>
<span class="line"><span>           tokenizer, pad_to_multiple_of=8, return_tensors=&quot;pt&quot;, padding=True</span></span>
<span class="line"><span>       ),</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>最后，这里开始模型的训练，如果有提供的 checkpoint（检查点），则从该检查点恢复训练。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   trainer.train(resume_from_checkpoint=resume_from_checkpoint)</span></span></code></pre></div><p>当然，你也可以基于后面的示例，根据具体的需要调整超参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python finetune.py \\</span></span>
<span class="line"><span>   --base_model &#39;decapoda-research/llama-7b-hf&#39; \\</span></span>
<span class="line"><span>   --data_path &#39;yahma/alpaca-cleaned&#39; \\</span></span>
<span class="line"><span>   --output_dir &#39;./lora-alpaca&#39; \\</span></span>
<span class="line"><span>   --batch_size 128 \\</span></span>
<span class="line"><span>   --micro_batch_size 4 \\</span></span>
<span class="line"><span>   --num_epochs 3 \\</span></span>
<span class="line"><span>   --learning_rate 1e-4 \\</span></span>
<span class="line"><span>   --cutoff_len 512 \\</span></span>
<span class="line"><span>   --val_set_size 2000 \\</span></span>
<span class="line"><span>   --lora_r 8 \\</span></span>
<span class="line"><span>   --lora_alpha 16 \\</span></span>
<span class="line"><span>   --lora_dropout 0.05 \\</span></span>
<span class="line"><span>   --lora_target_modules &#39;[q_proj,v_proj]&#39; \\</span></span>
<span class="line"><span>   --train_on_inputs \\</span></span>
<span class="line"><span>   --group_by_length</span></span></code></pre></div><p>至此，你已经完成基于 LoRA 的模型训练了，你可以直接将这里的模型用于在线的模型推理。</p><h3 id="推理-generate-py" tabindex="-1">推理（generate.py） <a class="header-anchor" href="#推理-generate-py" aria-label="Permalink to &quot;推理（generate.py）&quot;">​</a></h3><p>当然，如果你没有领域定制训练的需求，只是想看看 Alpaca 默认实现的模型效果是什么样的，可以直接使用 generate.py 从 Hugging Face 模型库读取基础模型和 LoRA 权重，然后运行一个 Gradio 接口，用于对指定输入进行推理。</p><p>你可以使用后面这段示例代码使用模型，具体的权重文件版本可以使用 lora_weights 参数进行指定。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python generate.py \\</span></span>
<span class="line"><span>   --load_8bit \\</span></span>
<span class="line"><span>   --base_model &#39;decapoda-research/llama-7b-hf&#39; \\</span></span>
<span class="line"><span>   --lora_weights &#39;tloen/alpaca-lora-7b&#39;</span></span></code></pre></div><p>是不是非常方便？你可以参考这节课学习的内容，课后亲手练习一下，尝试搭建起你自己的专属领域大模型，完成你在特定领域的具体任务。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>学到这里，我们做个总结吧。</p><p>在这节课中，我们学到了一系列方法和工具，它们可以帮助你以更低的成本进行模型训练、生成多样化的数据，我们还学习了如何通过 LoRA 来提高性能。如果你对这些技术和流程感兴趣，鼓励你深入学习和实践，以便能够训练出属于你自己的领域专属模型。</p><p>当然，目前的 self-instruct 和 alpaca 数据生成方法也存在一些局限性，正如我们在之前的课后习题中提到的，它们的数据质量受限于 GPT 知识的范围。因此，为了生成高质量的训练数据，超越 GPT 知识范围，我们可以考虑其他数据生成方法，比如结合低质量的大规模原始语料，利用大语言模型生成相对少量的高质量语料。</p><p>模型工程的任务主要包括两个方面：对大型语言模型的微调（从 1-10）和构建全新的大型语言模型（从 0-1）。至此，我们已经完成了模型训练的必修部分，也就是模型微调的内容。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>根据前面学习的 GPT 系列原理的知识，想一想构建一个规模达到 100B 及以上的模型需要怎么做。</p><p>恭喜完成我们第 27 次的打卡学习，期待你在留言区和我交流互动。如果你觉得有收获，也欢迎你分享给你身边的朋友，邀 TA 一起讨论。</p>`,100)])])}const _=a(i,[["render",t]]);export{u as __pageData,_ as default};
