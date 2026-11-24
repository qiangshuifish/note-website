# 12 | 借力打力：大模型生成QAPairs提升RAG应用测试效率

你好，我是陈磊。

上一节课我们深入浅出地聊了 Agentic 模式，那种让 AI 像个独立思考的“特工”一样执行任务的架构，真是让人眼前一亮。我们还结合测试实践，给出了不少接地气的例子。那种从传统脚本的死板规则，跃升到智能体灵活应对的快感，绝对会让人上瘾！

天天泡在自动化测试里，你一定深有体会，基于确定性规则的工具就像老朋友一样可靠，一键执行，结果清晰明了。而智能体则更像一个灵活的实习生，能够理解上下文、处理边缘情况，甚至在测试中动态调整策略，帮你挖掘隐藏的 bug。不过，智能体并非万能，无法一夜之间取代所有传统脚本。它的价值在复杂任务中尤为凸显——传统自动化擅长规则明确、输入输出固定的场景，比如简单的 API 验证；而智能体则像一个经验丰富的导航员，能够根据实时情况灵活应对，轻松处理那些规则复杂、业务逻辑多变的测试场景。

试想，在你的下一个回归测试里，如果能让智能体自动适应变幻的 UI 元素，不光省时省力，还能让整个团队的协作效率飞起来。总之，别急着全盘推翻旧有工具，先从小场景练手，感受那种“啊，原来测试还能这么玩”的惊喜。

前面的几节课，我们一直围绕大模型如何注入活力到软件测试的方方面面。但现在，视角一转——如果我们要测试一个大模型应用本身呢？能不能反过来，让大模型来当你的“测试小伙伴”，辅助设计那些原本复杂的用例？今天咱们就来换个思路，聚焦大模型应用测试的一个经典痛点，如何从知识库里高效批量生成问题 - 答案对（QA Pairs），来精准检验模型在特定领域的“脑力和深度”。

作为一线测试工程师，你我都清楚，这步干得漂亮，就能直击模型的准确率和鲁棒性短板。今天我们就利用 LangChain 的 QAGenerationChain 这个利器，从根源上化解痛点，让整个生成过程从原本的“磕磕绊绊、反复调试”华丽变身为“顺滑如丝、一气呵成”。你只需喂入知识库，链条一转，就能吐出结构化的 QA 对，完美适配你的评估脚本——这不光加速了测试迭代，还让你有更多精力去深挖模型的边界行为。

## 认清痛点：手工生成 QA 卡壳在哪？

在测试大模型应用之前，QA 对数据集绝对是你的第一道防线。它本质上是一组精心设计的问答对，每一对都包含问题和参考答案这两大核心元素。当然，为了让它更强大，你还可以添加一些额外的“调味料”，比如问题难度、场景标签或其他元数据。这些额外信息会让你的测试更精准、更易分析。

生成这样的数据集，有手动和自动两种方式，但无论哪种，都要紧扣大模型应用的实际场景，比如，确保事实准确性、防范模型的“幻觉”输出，以及验证上下文的理解能力。只有这样，你的测试才能真正击中要害，避免模型在关键时刻掉链子。

手动生成 QA 对，尤其适合我们这些测试工程师在早期原型阶段或高度定制化场景中使用。它能带来那种“亲手打造”的满足感，确保每个样本都精准、可靠、多样化。这不是枯燥的重复劳动，而是一场创意与严谨的结合。通过这个过程，你会发现自己的领域知识和测试直觉在不断提升，最终产出一个高质量的测试集，让后续的自动化验证事半功倍。

现在我们就来细细拆解一下手动构造 QA 对的过程，确保你能轻松上手。

一切从数据源开始！首先，作为测试工程师，你可以从用户日志、领域知识库或模拟对话中，挑选那些最能代表真实场景的文本或对话样本。关键是要追求多样性，甚至是跨领域融合的案例。

其次，当样本到手后，该轮到你的创意时刻了。由团队的专家手动脑暴，提取或变异问题形式，包括事实型问题、推理型问题，还有那些调皮的边缘案例。每种问题都要配上丰富的上下文，确保模型在“故事”中做出正确回应。这个过程超级有趣，你可以像编剧一样，设计出一系列“如果……会怎样”的变体，让 QA 对变得生动而全面。记住，多样性是王道，它会让你的测试覆盖面更广，模型的弱点无所遁形。

第三步就进入标注环节，为每个问题配上真实的参考答案。这一步需要多人协作，通过讨论和共识机制，来保证答案的准确性和一致性。协作标注不只高效，还能让团队的知识共享更紧密。大家围坐一起，辩论一个棘手答案，那种集体智慧碰撞的火花，绝对是测试生涯的亮点。

第四步也是关键的关键，数据集初具雏形后还要通过小规模模型测试或内部审查，检查覆盖度和潜在偏差。比如，是不是某些场景被忽略了？事实准确性是否可靠？上下文理解有没有盲区？如果发现问题，就大胆迭代：调整样本、补充变体，直到一切就位。

最后，导出为 JSON 或 CSV 格式，你的测试集就 ready to go 了。这个迭代循环不仅是技术活儿，更是测试思维的体现——它教你如何从反馈中成长，让数据集越来越强大。

手动构造 QA 对的过程虽说像一场匠心独运的创作盛宴，但当你的测试规模急剧膨胀，比如从数十对样本跃升到上千，甚至上万时，这种“手工活儿”难免会成为瓶颈。时间成本飙升、团队精力分散，还可能因为人为偏差而遗漏某些隐秘的模型痛点。

这时，自动生成 QA 数据集就成了救星，它像一个高效的复制工厂，能基于现有文档或知识库，批量产出多样化的问答对，同时融入智能验证机制，确保质量不打折。这不仅仅是效率的飞跃，更是测试策略的升级，把你从琐碎的标注中解放出来，使你专注于更高阶的测试活动和问题诊断。

## 大模型生成 QA 对：借力破壳而出

下面我就用 qa-gen-cn 这个 QA 对中文生成小工具，来讲讲借助大模型完成这项工作的思路（qa-gen-cn 是我很早之前写的一个开源 QA 对生成的小工具，这里我很推荐你去 GitHub 下载源代码看一看）。这个依据文档自动生成 QA 对的小工具实现了从文档处理、QA 对生成、QA 对验证的全流程逻辑，这个模块的解决思路本质上是“输入、生成、过滤、输出”的流水线架构，针对中文 LLM 测试的痛点（如事实准确性低、幻觉输出多、上下文理解偏差）提供高效、可靠的解决方案。下面我就详细拆解实现思路，帮助你全面理解其问题解决路径。

### 整体思路

起初开始写这个小工具的时候就是为了解决从海量中文文档中高效提取、生成多样化的 QA对，同时确保这些 QA 对的事实准确、语义相关且无重复的问题。这直接针对 LLM 应用测试的“第一道防线”需求，构建可靠的基准数据集。

问题诊断在于，手动生成 QA 对效率低下且易引入偏差，而现有工具多为英文优化，忽略了中文分词和语义细微差别（如多义词、长句结构）。

为此，我采用模块化流水线、本地 LLM 驱动生成以及多维度验证过滤的混合策略，其中模块化设计确保可扩展性，支持本地 Ollama 或云端 OpenAI 等模型；LLM 生成注入创意多样性，而验证机制则如同质量关卡，剔除低质样本，避免模型“幻觉”输出。

设计原则上，强调高效性，通过自动化分块和批量生成处理长文档，无需人工干预；准确性则结合规则的关键词匹配和语义相似度验证，形成双保险防错；通过 JSON 文件灵活调整阈值和模型，适应事实型或推理型等不同测试场景。这种思路宛如一个“智能工厂”：文档作为原料，LLM 化身生产线，验证充当质检环节，最终输出精炼的 QA “产品”。

## 生成 QA 对核心思路

模块的执行逻辑是一个线性且可迭代的管道，从输入文档到输出 JSON 文件。每个阶段都有明确的输入和输出接口，便于调试和扩展。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
QA Pair Generator using a robust LCEL chain with JSON output parsing.
"""
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from typing import List, Dict, Any
from .super_json import SuperJSON,extract_json
from .utils import load_document
# A prompt that is very explicit about the desired JSON output format.
# QWEN_TEMPLATE=""""""
PROMPT_TEMPLATE = """
You are an expert assistant tasked with generating question-and-answer pairs from
Based on the following text, please generate a list of QA pairs.
The output should be a single, valid JSON object containing a single key "qa_pair
Do NOT output any other text, explanations, or markdown formatting before or afte
Here is the text:
--- TEXT ---
{text}
--- END TEXT ---
JSON_OUTPUT:
"""
class QAGenerator:
   """
   Generates QA pairs from a document using a robust LCEL chain.
   """
   def __init__(self, llm: Any, show_chunks: bool = False):
       """
       Initializes the QAGenerator.
       Args:
           llm: The language model instance from LLMFactory.
           show_chunks (bool): If True, prints the document chunks.
       """
       self.llm = llm
       self.show_chunks = show_chunks
       # Define the generation chain using LangChain Expression Language (LCEL)
       prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
       parser = JsonOutputParser()
       self.chain = prompt | self.llm | parser
   def _split_documents(self, docs: List[Document], chunk_size: int, chunk_overl
       """
       Splits the documents into smaller chunks.
       """
       text_splitter = RecursiveCharacterTextSplitter(
           chunk_size=chunk_size,
           chunk_overlap=chunk_overlap,
           separators=["\n\n", "\n", "。", "！", "？"], # More robust separators
           keep_separator=True
       )
       return text_splitter.split_documents(docs)
   def generate_from_document(
       self,
       doc_path: str,
       chunk_size: int = 4000,
       chunk_overlap: int = 200
   ) -> List[Dict[str, str]]:
       """
       Loads a document, splits it, and generates QA pairs using the robust chai
       Args:
           doc_path (str): The path to the document.
           chunk_size (int): The size of each text chunk.
           chunk_overlap (int): The overlap between text chunks.
       Returns:
           A list of generated QA pairs.
       """
       docs = load_document(doc_path)
       chunks = self._split_documents(docs, chunk_size, chunk_overlap)
       if self.show_chunks:
           print("--- Document Chunks ---")
           for i, chunk in enumerate(chunks):
               print(f"Chunk {i+1}: {chunk.page_content.strip()}\n")
           print("-----------------------\n")
       qa_pairs = []
       for doc in chunks:
           try:
               # The chain is invoked with the document content
               # 如果langchain的JsonOutputParser没有成功，就会报错
               result = self.chain.invoke({"text": doc.page_content})
               print(f"result:{result}")
               if isinstance(result, dict) and "qa_pairs" in result and isinstan
                   qa_pairs.extend(result["qa_pairs"])
               else:
                   print(f"Warning: Unexpected output format from LLM for a chun
           except Exception as e:
               # 处理一些无法返回json的大模型的异常
               # exception会截获不能反悔json的大模型的response，存在e.llm_output里面，
               # result = e.llm_output
               try:
                   result = e.llm_output
                   result_dict =extract_json(result)
                   # print(f"result_dict:{result_dict}")
                   if isinstance(result_dict, dict) and "qa_pairs" in result_dic
                       qa_pairs.extend(result_dict["qa_pairs"])
               except Exception as e:
                   continue
               continue
           print(f"qa_pairs:{qa_pairs}")
       return qa_pairs
```

我先对文档进行了一些预处理，通过读取纯文本文件，使用滑动窗口算法分块，这样就可以避免大模型的 Token 限制，长文档直接喂入易导致上下文丢失或生成不准。对于每个 chunk 通过调用大模型，在预设好的系统提示词下，生成多个 QA 对，通过调整采样参数可以控制生成文档的数量。

## 验证和过滤生成 QA 对

当得到了生成的 QA 对后，并不能直接拿来应用，还需要验证生成 QA 对和原文的贴合度。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
QA Pair Validator to filter and ensure the quality of generated QA pairs.
"""
import jieba
import jieba.analyse
import numpy as np
from sentence_transformers import SentenceTransformer, util
from sklearn.cluster import AgglomerativeClustering
from typing import List, Dict, Any, Tuple, Set
class QAPairValidator:
   """
   Validates a list of QA pairs based on a set of configurable rules.
   Validation 1,2,3,4 validation是互斥的，只能选择一个验证
   验证优先级：1>2>3>4，在self.config中配置了：
       1 similarity_threshold和similarity_model，后面其他验证的配置可以不配置，如果配置
       2 question_min_length和question_max_length，answer_min_length和answer_max_
       3 keyword_top_n，后面其他验证的配置可以不配置，如果配置了也不起作用。
       4 similarity_model、uniqueness_distance_threshold和uniqueness_check_enable
   qa_pair: A dictionary containing the QA pair.
           - similarity_threshold: The threshold for the similarity between the
           - similarity_model: The model name for the similarity calculation. re
           - question_min_length: The minimum length of the question. recommende
           - question_max_length: The maximum length of the question. recommende
           - answer_min_length: The minimum length of the answer. recommended va
           - answer_max_length: The maximum length of the answer. recommended va
           - uniqueness_distance_threshold: The threshold for the distance betwe
           - keyword_top_n: The number of keywords to extract from the document.
           - uniqueness_check_enabled: A boolean indicating whether to check for
   """
   def __init__(self, validation_config: Dict[str, Any]):
       """
       Initializes the validator with a configuration.
       Args:
           validation_config: A dictionary containing settings for each validati
                              e.g., thresholds, min/max lengths.
       """
       self.config = validation_config
       # Lazy load model only when needed
       self._model = None
   # Validation 1: Semantic Similarity
   def _validate_similarity(self, doc_content: str, qa_pair: Dict[str, str]) ->
       """
       Args:
           doc_content: The original document content for context-based validati
           qa_pair: A dictionary containing the QA pair.
           - similarity_threshold: The threshold for the similarity between the
           - similarity_model: The model name for the similarity calculation. re
       Returns:
           A boolean indicating whether the QA pair is valid.
       """
       # if 'similarity_threshold' in qa_pair:
       threshold = self.config['similarity_threshold']
       # else:
       #     threshold = self.config.get("similarity_threshold", 0.5)
       # if 'similarity_model' in self.config:
       model_name = self.config['similarity_model']
       # else:
       # model_name = self.config.get("similarity_model", 'paraphrase-multilingu
       self._model = SentenceTransformer(model_name)
       doc_embedding = self._model.encode(doc_content, convert_to_tensor=True)
       q_embedding = self._model.encode(qa_pair['question'], convert_to_tensor=T
       a_embedding = self._model.encode(qa_pair['answer'], convert_to_tensor=Tru
       q_sim = util.cos_sim(doc_embedding, q_embedding).item()
       a_sim = util.cos_sim(doc_embedding, a_embedding).item()
       if q_sim > threshold and a_sim > threshold:
           return {
           'question': qa_pair['question'],
           'answer': qa_pair['answer']}
       # else:
       #     return {
       #         'question_matched_keywords': qa_pair['question'],
       #         'answer_matched_keywords': qa_pair['answer'],
       #         'is_valid': False}
   # Validation 2: Keyword Match
   def _extract_keywords_chinese(self,documents)->list:
       """
       使用 jieba 提取中文文档中的关键词
       Args:
           documents: 文档列表（每个文档是一个字符串）
           top_n: 返回前 N 个关键词
       Returns:
           关键词列表
       """
       keywords = []
       # if 'keyword_top_n' in self.config:
       top_n_keywords = self.config['keyword_top_n']
       # else:
       #     top_n_keywords = self.config.get("keyword_top_n", 10)
       for doc in documents:
           # 使用 jieba.analyse.extract_tags 提取关键词
           # 使用 TF-IDF 算法，返回 (word, weight) 元组
           doc_keywords = jieba.analyse.extract_tags(doc, topK=top_n_keywords, w
           keywords.extend(doc_keywords)
       return keywords
   def _validate_keywords(self, doc_content: str, qa_pair: Dict[str, str]) -> bo
       """
       检查中文 QA 对是否包含关键词
       Args:
           doc_content: The original document content for context-based validati
           qa_pair: A dictionary containing the QA pair.
           - question: 问题字符串
           - answer: 答案字符串
       Returns:
           包含的关键词列表和是否有效
       """
       keywords = self._extract_keywords_chinese([doc_content])
       keyword_set = {word for word, _ in keywords}
       # 对问题和答案进行分词
       question_words = set(jieba.lcut(qa_pair['question']))
       answer_words = set(jieba.lcut(qa_pair['answer']))
       # 检查问题和答案中包含的关键词
       question_matched = question_words.intersection(keyword_set)
       answer_matched = answer_words.intersection(keyword_set)
       # 判断有效性：问题和答案都必须包含至少一个关键词
       if  len(question_matched) > 0 and len(answer_matched) > 0:
           return {
               'question': question_matched,
               'answer': answer_matched
           }
       # else:
       #      return {
       #         'question_matched_keywords': question_matched,
       #         'answer_matched_keywords': answer_matched,
       #         'is_valid': False
       #     }
   # Validation 3: Length Checks
   def _validate_length(self, qa_pair: Dict[str, str]) -> bool:
       """
       Args:
           qa_pair: A dictionary containing the QA pair.
           - question_min_length: The minimum length of the question. if not in
           - question_max_length: The maximum length of the question. if not in
           - answer_min_length: The minimum length of the answer. if not in qa_p
           - answer_max_length: The maximum length of the answer. if not in qa_p
       Returns:
           A boolean indicating whether the QA pair is valid.
       """
       q_len = len(qa_pair['question'])
       a_len = len(qa_pair['answer'])
       q_min = self.config['question_min_length']
       q_max = self.config['question_max_length']
       a_min = self.config['answer_min_length']
       a_max = self.config['answer_max_length']
       if (q_min <= q_len <= q_max) and (a_min <= a_len <= a_max):
           return {
               'question': qa_pair['question'],
               'answer': qa_pair['answer']}
   # Validation 4: Uniqueness/Duplication Check
   def _validate_duplicates(self, qa_pairs: List[Dict[str, str]]) -> List[Dict[s
       """
       Args:
           qa_pairs: The list of generated QA pairs.
           - uniqueness_distance_threshold: The threshold for the distance betwe
       Returns:
           A list of validated and filtered QA pairs.
       """
       threshold = self.config['uniqueness_distance_threshold']
       model_name = self.config['similarity_model']
       # else:
       # model_name = self.config.get("similarity_model", 'paraphrase-multilingu
       self._model = SentenceTransformer(model_name)
       questions = [p['question'] for p in qa_pairs]
       embeddings = self._model.encode(questions, convert_to_tensor=True, normal
       distance_matrix = 1 - util.cos_sim(embeddings, embeddings).cpu().numpy()
       distance_matrix = np.clip(distance_matrix, 0, None)
       clustering = AgglomerativeClustering(
           n_clusters=None,
           distance_threshold=threshold,
           metric='precomputed',
           linkage='average'
       ).fit(distance_matrix)
       # Keep only the first item from each cluster
       unique_indices = []
       seen_labels = set()
       for i, label in enumerate(clustering.labels_):
           if label not in seen_labels:
               unique_indices.append(i)
               seen_labels.add(label)
       return [qa_pairs[i] for i in sorted(unique_indices)]
   def validate(self, qa_pairs: List[Dict[str, str]], doc_content: str) -> List[
       """
       Applies a pipeline of validations to filter QA pairs.
       Args:
           qa_pairs: The list of generated QA pairs.
           doc_content: The original document content for context-based validati
       Returns:
           A list of validated and filtered QA pairs.
       """
       if not qa_pairs:
           return []
       # Validation 1,2,3,4 validation是互斥的，只能选择一个验证
       # 验证优先级：1>2>3>4，在self.config中配置了：
       #       1 similarity_threshold和similarity_model，后面其他验证的配置可以不配置
       #       2 question_min_length和question_max_length，answer_min_length和ans
       #       3 keyword_top_n，后面其他验证的配置可以不配置，如果配置了也不起作用。
       #       4 uniqueness_distance_threshold和uniqueness_check_enabled，其他验证
       qa_pairs_result = []
       if 'similarity_threshold' in self.config and 'similarity_model' in self.c
           for pair in qa_pairs:
               qa_pairs_result.append(self._validate_similarity(doc_content, pai
       elif 'question_min_length' in self.config and 'question_max_length' in se
           for pair in qa_pairs:
               qa_pairs_result.append(self._validate_length(pair))
       elif 'keyword_top_n' in self.config:
           for pair in qa_pairs:
               qa_pairs_result.append(self._validate_keywords(doc_content, pair)
       elif 'uniqueness_distance_threshold' in self.config and 'uniqueness_check
           qa_pairs_result=self._validate_duplicates(qa_pairs)
       else:
           qa_pairs_result=qa_pairs
return qa pairs result
```

通过如上验证和过滤，才能得到一个有效的 QA 对集合。这里提供了语义相似验证、长度验证、关键词匹配验证以及唯一验证。具体如下：

- 语义相似验证是将源文档、问题和答案分别经过向量化后计算它们之间的余弦相似度，只有相似的 QA 才被确定是有效的。

- 长度检查：保证问题和答案的长度在一个合理的范围内，避免过长或过短，通过获取生成的QA 对的问题长度和参考答案长度是否落在了一个长度区间内，来判断是否满足了预定条件，才能确定这个 QA 对是否有效。

- 关键词匹配验证：确保问题和答案都包含了从原文中提取出的核心关键词。然后检查分词后的问题和答案是否至少包含一个提取出的关键词才能确定有效。

- 唯一验证：移除内容重复或语义上高度相似的问题，增加 QA 对的多样性。这个方法处理的是整个 QA 对列表，而不是单个 QA 对。借助 sentence_transformers 模型将问题编码向量化，然后计算两个问题的距离，形成一个距离矩阵，通过层次聚类算法将相似问题分组聚类，然后每个聚类中只保留一个代表性的 QA 对，从而过滤掉所有重复或相似的问题。

这个项目提供了一个灵活且功能强大的 QA 对质量控制工具。在使用的过程中通过一个简单的配置文件，选择最适合自己场景的验证策略，来自动化地筛选出高质量的问答数据。

## 总结

今天我们从手动生成 QA 对的问题开始，讲到了如何借力打力，用大模型生成 QA 对帮助我们完成测试，我还给你分享了我开发开源工具 qa-gen-cn 的思考过程，从而实现了“输入、生成、过滤、输出”的模块化流水线过程。这个小工具主要是面向中文场景进行了优化，灵活配置阈值，支持本地 Ollama 或云端模型，助力测试工程师从琐碎标注中解放，加速迭代并深挖模型边界。总之，这不仅是效率升级，更是测试策略的“脑洞大开”——从小场景练手，拥抱AI“实习生”般的智能协作，让软件测试如丝般顺滑！

## 思考题

我相信和我一起回顾了这个小工具的开发历程，你也开始思考你能借助大模型完成应用测试的一些解决方案了，尤其是“输入、生成、过滤、输出”的模块化流水线过程，也帮你解决了大模型测试的一些困惑，如果你刚好有些想法，就写在评论区，我们一起脑暴一下。如果你觉得这节课的内容对你有帮助，也欢迎你分享给其他朋友，我们下节课再见！
