# 13 | Query改写：大模型测试的数据倍增器

你好，我是陈磊。

上节课，我详细分享了如何从知识库中高效批量生成高质量的 QA 对（问题 - 答案对），以此作为利剑，直击大模型应用的准确率和鲁棒性痛点。我们不光聊了手工构建的细腻过程，还重点探讨了如何反客为主、借助大模型自身的能力，来自动化生成这些测试数据集——这简直是“以子之矛攻子之盾”的绝妙一招，让测试工程师从繁琐标注中彻底解放。

我把自己写的并开源的小工具 qa-gen-cn 拎出来现身说法，它构建了一个简洁却强大的“输入、生成、过滤、输出”模块化流水线，从文档预处理和分块入手，利用 LangChain 链条驱动LLM 吐出多样 QA 对，再通过语义相似、长度检查、关键词匹配或唯一性验证等关卡把关，确保输出精炼可靠、针对中文场景优化。这不只加速了你的测试迭代，还能让你腾出手深挖模型的边界行为。

今天我们将目光从 QA 对的生成，转向大模型测试中另外一个非常实用的技能 query 改写上。Query 改写，也叫 Query 扩写，它简直就是测试工程师的“数据倍增器”！

比如你手头就那么点有限的测试查询，覆盖面总觉得捉襟见肘，万一模型在用户真实输入的奇葩表达上栽跟头，那可就尴尬了。这时候，Query 改写就登场了，它能像个“同义词工厂”，快速从原始查询衍生出一堆语义等价却表达多变的变体，让你的测试数据集瞬间膨胀，覆盖更多边缘 case 和真实场景，提升模型的鲁棒性，这不光是效率飞跃，更是让测试从“死记硬背”变成“活学活用”的华丽转身。

作为一线测试开发工程师，你肯定深有体会，那些模糊口语化的用户问法，稍不留神就让模型卡壳，而改写后的多样查询，就能帮你提前挖雷、填坑，玩转那种“以毒攻毒”的快感。

## Query 改写的方法

聊到 Query 改写的核心玩法，咱们就得直奔主题——用多种方法重写原始查询，变出一堆语义相似的变体。这就好比给你的测试查询戴上“变色龙外衣”，让它在保持原意的前提下，换个马甲、换个口吻，就能覆盖更多用户那千奇百怪的输入习惯。

一个模糊的“北京天气咋样”扔给模型，稍有歧义就可能翻车，但通过改写，它瞬间衍生出“首都今天有雨吗？”或“查查北京当前气象情况”，帮你提前戳破模型的弱点，测试覆盖率蹭蹭上涨，bug 藏都藏不住，Query 改写有三种方式，分别是基于大模型的改写、词汇表改写和同义词改写，下面我就详细介绍一下。

### 基于大模型的改写

基于大模型的改写，直接借助大模型能力，基于原始查询脑暴出一波语义等价的变体。想想看，你喂入“推荐一部好看的科幻电影”，它不光能吐出“有啥经典的太空冒险片？”这种口语化翻版，还能变着花样玩儿“帮我找找未来主义主题的影视作品”，甚至带点俏皮的“外星人入侵的电影推介？”等等问题，大模型天生就懂得捕获上下文的用户意图，能捕捉那些人类想不到的表达，实现弯道超车，特别适合测试模型的意图识别和鲁棒性。

```python
from typing import List
import json
from queryrewrite.llm.base import LLMBase  # 假设你的库导入
from queryrewrite.utils.data_models import Query, RewrittenQuery  # Query/Rewritt
from queryrewrite.utils.super_json import SuperJSON  # 你的JSON解析器
class LLMRewriter:
   """Rewrites a query using a large language model."""
   def __init__(self, llm: LLMBase, thinking: str = ''):
       self.llm = llm
       self.thinking = thinking
       self.response_parser = SuperJSON()
       self.system_prompt = '''
def 资深测试开发专家():
   """
   你是一名从业20年的资深测试开发工程师，一直从事NLP、LLM相关技术的测试，你曾经参与过ChatGPT
   """
   能力=["测试分析", "测试设计","NLP性能指标","LLM的性能指标","RAG","向量数据库","embedd
   工作内容=["query rewrite","评测","测试数据标注","对齐","python","评价测试用数据","选择
def query_rewrite(用户输入):
   """
   分析用户的输入的测试数据，依据数据进行改写并返回，返回格式json
   """
   new_data = []
   new_query_list = one_query_rewrite(用户输入["query"], 用户输入["reference"])  #
   for one_new_query in new_query_list:
       new_data.append({"query": one_new_query, "reference": 用户输入["reference"
def one_query_rewrite(query, reference):
   """
   依据reference的上下文，完成query改写，返回一个list，包含10条新query。
   确保每条新query语义锚定reference，避免幻觉；文字结构多样化，如口语/正式/疑问变体。
   """
   # 生成一个包含10条和query语义相同的，文字结构有区别的query的list
if __name__ == "__main__":
   # 必须按照如下的运行规则来运行你的程序：
   # 1 设定system role
   资深测试开发专家()
   print("请输入你改写的query数据，数据格式：{\"query\":\"\",\"reference\":\"\"}：")
   # 2 调取query_rewrite改写
   query_rewrite(用户输入)
   # 3 严格遵守函数的调用关系
   # 4 输出 json格式，格式为[{"query":"","reference":""}]
'''
   def rewrite(self, query: Query) -> List[RewrittenQuery]:
       """
       Rewrites the query using the LLM.
       Args:
           query: The query to rewrite. (Query dataclass with .query and .refere
       Returns:
           A list of rewritten queries. (List[RewrittenQuery])
       """
       # 拼接prompt：thinking + system_prompt + 实际数据
       prompt = f'{self.thinking}\n\n{self.system_prompt}\n\n{{"query":"{query.q
       # 调用LLM
       response = self.llm.invoke(prompt)
       # JSON解析 + 异常处理：优雅降级，避免crash
       try:
           parsed_response = self.response_parser.loads(response)
           # 优先检查list格式（期望输出）
           if isinstance(parsed_response, list) and all("query" in item and "ref
               return [RewrittenQuery(**item) for item in parsed_response]
           # Fallback: dict with "response" key
           elif isinstance(parsed_response, dict) and "response" in parsed_respo
               resp_content = parsed_response["response"]
               if isinstance(resp_content, list):
                   return [RewrittenQuery(**item) for item in resp_content if "q
               else:
                   # 单条raw fallback
                   return [RewrittenQuery(query=str(resp_content).strip(), refer
           else:
               raise ValueError(f"Unexpected parsed format: {type(parsed_respons
       except (json.JSONDecodeError, ValueError, KeyError) as e:
           # 解析失败：raw response降级，确保至少返回点东西
           print(f"Parse failed ({type(e).__name__}): {e}. Falling back to raw r
           return [RewrittenQuery(query=response.strip(), reference=query.refere
```

通过如上代码，可以完成利用大模型来对特定的 query 进行改写的任务，LLMRewriter 通过一个非常具体和结构化的系统提示，来精确地控制大模型的改写和输出行为，最后还内置了对大模型输出的解析和容错处理，即使模型没有完全遵守格式要求，也能返回一个合理的结果。

### 词汇表改写

词汇表改写是规则上的替换，它基于你预先构建的领域词汇表（比如一个 JSON 里的同义词组），扫描原始查询里的关键词，一一替换成同义备选，批量产出变体。这是一种领域内的同义词的表述变体，例如电商测试，你定义“买”为“购买 / 选购 / 入手”，查询“买个新手机”就能衍生“选购一部最新款手机”或“入手苹果新机”，覆盖不同用户口味。这种改写的最大优势就是稳定、无幻觉风险，适用于规则明确的垂直场景如医疗或法律测试，避免 LLM 偶尔“脑补过头”的情况。

```python
import itertools
from typing import List
import random
import re
try:
   import jieba
   HAS_JIEBA = True
except ImportError:
   HAS_JIEBA = False
   print("Warning: jieba not installed, falling back to simple split. Install ji
from queryrewrite.utils.data_models import Query, RewrittenQuery, Glossary
class GlossaryRewriter:
   """使用同义词词汇表重写查询。"""
   def __init__(self, glossary: Glossary, max_combos: int = 100):
       """
       参数:
           glossary: 同义词组列表，格式为 List[List[str]]。
           max_combos: 生成重写查询的最大数量（防止组合爆炸）。
       """
       self.glossary = glossary
       self.max_combos = max_combos
       self.synonym_map = self._create_synonym_map()
       if HAS_JIEBA:
           self._add_glossary_to_jieba()
   def _create_synonym_map(self) -> dict:
       """创建映射：单词 -> 完整的同义词列表。"""
       synonym_map = {}
       for word_list in self.glossary:
           for word in word_list:
               synonym_map[word] = word_list
       return synonym_map
   def _add_glossary_to_jieba(self):
       """将词汇表中的词（去重后）添加到jieba词典。"""
       unique_words = set(word for word_list in self.glossary for word in word_l
       for word in unique_words:
           jieba.add_word(word)
   def _tokenize(self, text: str) -> List[str]:
       """查询分词：如果jieba可用则使用jieba，否则使用简单拆分。"""
       if HAS_JIEBA:
           return list(jieba.cut(text))
       else:
           # 后备方案：按空格/标点符号拆分，比较粗糙但适用于混合语言
           return re.findall(r'\w+|[^\w\s]', text, re.UNICODE)
   def rewrite(self, query: Query) -> List[RewrittenQuery]:
       """
       使用词汇表重写查询。
       参数:
           query: 要重写的查询对象（使用 .query 和 .reference 属性）。
       返回:
           一个重写后的查询列表（List[RewrittenQuery]，数量上限为 max_combos）。
       """
       if not query.query.strip():
           return []  # 边缘情况：处理空查询
       words = self._tokenize(query.query)
       rewritten_word_lists = [self.synonym_map.get(word, [word]) for word in wo
       # 生成所有组合，如果数量过多则进行采样
       all_combos = list(itertools.product(*rewritten_word_lists))
       num_combos = len(all_combos)
       if num_combos > self.max_combos:
           print(f"警告: 组合数 {num_combos} 超出最大值 {self.max_combos}；将进行随机采
           all_combos = random.sample(all_combos, self.max_combos)
       rewritten_queries = []
       for combination in all_combos:
           # 拼接：对纯中文不使用空格，对英文/混合使用空格（启发式）
           is_chinese_like = all(re.match(r'[\u4e00-\u9fff]', w) for w in combin
           joined_query = "".join(combination) if is_chinese_like else " ".join(
           rewritten_queries.append(
               RewrittenQuery(query=joined_query, reference=query.reference)
           )
       return rewritten_queries
```

如上代码就实现了一个基于词汇表的同义词替换，它主要是接收一个原始查询和一个预定义的同义词列表，然后通过替换查询中的词语为其同义词，来生成大量语义相同但表达方式不同的新查询。在使用如上例子的时候需要提前准备好词汇表，这也是领域内知识替换的具体化的实现，是需要大模型应用服务的领域内的知识才能建立的。

### 同义词改写

同义词改写应该是词汇表和大模型改写的一个结合方法，先让大模型生成关键词的备选列表，再用规则替换植入原查询，生成一波平衡创意与精确的变体。这种比 LLM 少点“天马行空”，比词汇表多点灵活。拿“学习 Python 编程”来说，它可能输出“掌握 Python 代码技巧”或“钻研Python 开发语言”，完美捕捉语义核心却换了表达壳子。它结合了 LLM 的语义深度和替换的原子化操作，生成变体既多样又可控，测试时能有效验证模型的词汇鲁棒性。

```python
import itertools
from typing import List
import json
import random
try:
   import jieba.posseg as pseg
   HAS_JIEBA = True
except ImportError:
   HAS_JIEBA = False
   print("Warning: jieba not installed, falling back to simple split. Install ji
from queryrewrite.llm.base import LLMBase
from queryrewrite.utils.data_models import Query, RewrittenQuery
from queryrewrite.utils.super_list import SuperList
class SynonymRewriter:
   """通过调用LLM为查询中的词语生成同义词，从而重写查询。"""
   def __init__(self, llm: LLMBase, thinking: str = '', max_combos: int = 50, ma
       """
       参数:
           llm: 大语言模型实例。
           thinking: 可选的思考或引导提示。
           max_combos: 生成重写查询的最大数量。
           max_synonyms_per_word: 为单个词生成的同义词上限，用于控制组合爆炸。
       """
       self.llm = llm
       self.thinking = thinking
       self.max_combos = max_combos
       self.max_synonyms_per_word = max_synonyms_per_word
   def _tokenize_pos(self, text: str) -> List[tuple]:
       """带词性标注的分词：如果jieba可用则使用，否则使用带模拟词性的简单拆分。"""
       if HAS_JIEBA:
           return list(pseg.cut(text))
       else:
           # 后备方案：简单拆分，模拟词性（'n'代表名词/动词，'x'代表其他）
           words = text.split()
           return [(w, 'n' if len(w) > 1 else 'x') for w in words]
   def _get_synonyms(self, word: str, flag: str) -> List[str]:
       """通过LLM获取同义词，如果词性是标点/未知则跳过。"""
       skip_flags = ['x', 'wp', 'ws', 'w']  # 常见的跳过标记：未知/标点/空格
       if flag in skip_flags:
           return [word]  # 跳过LLM，保留原词
       prompt = f"{self.thinking}\\n\\n生成‘{word}’的最多{self.max_synonyms_per_wo
       response = self.llm.invoke(prompt)
       try:
           synonyms = SuperList(response)
           # 限制数量并确保是字符串列表
           synonyms = [s.strip() for s in synonyms[:self.max_synonyms_per_word]
           return synonyms if synonyms else [word]
       except Exception as e:
           print(f"为'{word}'生成同义词失败: {e}，回退到原词。")
           return [word]
   def rewrite(self, query: Query) -> List[RewrittenQuery]:
       """
       通过为其词语生成同义词来重写查询。
       参数:
           query: 要重写的查询对象（使用 .query 和 .reference 属性）。
       返回:
           一个重写后的查询列表（List[RewrittenQuery]，数量有上限）。
       """
       if not query.query.strip():
           return []
       words_pos = self._tokenize_pos(query.query)
       rewritten_word_lists = []
       for word, flag in words_pos:
           synonyms = self._get_synonyms(word, flag)
           rewritten_word_lists.append(synonyms)
       # 生成组合，如果太多则进行采样
       all_combos = list(itertools.product(*rewritten_word_lists))
       num_combos = len(all_combos)
       if num_combos > self.max_combos:
           print(f"警告: {num_combos} 个组合超过了最大值 {self.max_combos}；将进行采样
           all_combos = random.sample(all_combos, self.max_combos)
       rewritten_queries = []
       for combination in all_combos:
           # 智能拼接：对中文类查询不加空格，对混合/英文查询加空格
           joined_query = "".join(combination) if all(len(w) > 1 and not w.isasc
           rewritten_queries.append(
               RewrittenQuery(query=joined_query, reference=query.reference)
           )
       return rewritten_queries
```

这个代码段就完成了同义词改写的全部过程，首先利用大模型生成同义词表，这部分和词汇表改写的区别就是它不依赖一个外部的静态的词汇表，而是通过实时调用大模型来为查询中的每个有效词语生成同义词，然后将这些同义词组合成新的查询。这种方法最大的优势就是灵活性和创造性，能够发现词典中可能没有的、更贴近上下文的同义表达。

## 改写 Query 的筛选

Query 改写同样需要“输入、生成、过滤、输出”模块化流水线来保证最终的改写质量。所以就需要验证环节闪亮登场了，它像个质量门卫，用多种方法筛查改写后的 query，确保每条都不会丢失原 Query 的核心意图，同时剔除那些表达雷同或信息贫瘠的 query，从而使得验证不是多余的“纠结症”，而是平衡“多样性”和“可靠性”的艺术，覆盖边缘 case 的同时，避开假阳性Bug。

## ROUGE-L 和 BLEU 归一化验证

不知道你还记不记得 ROUGE-L 和 BLEU 两个指标，如果你忘记了就去前面 03 讲中看一下。

这部分我们计算改写的 Query 与原始 Query 的 ROUGE-L 和 BLEU 分数，量化变体质量，然后归一化后选出最佳平衡点。

```python
def rouge_l_bleu_normalized(rewritten_queries: List[RewrittenQuery], original_que
   """
   通过加权的ROUGE-L和(1-BLEU)分数来选择最佳查询。
   ROUGE-L (越高越好) 代表语义相似度。
   BLEU (越低越好) 代表词汇差异度。我们使用 (1-BLEU) 使其变为越高越好。
   """
   if not rewritten_queries:
       return []
   if not (0 <= rouge_weight <= 1):
       raise ValueError("rouge_weight must be between 0 and 1.")
   bleu_weight = 1 - rouge_weight
   scored_queries = []
   for rq in rewritten_queries:
       rouge_l = calculate_rouge_l(rq["query"], original_query)
       bleu = calculate_bleu(rq["query"], original_query)
       # 综合得分：ROUGE-L越高越好，BLEU越低越好 (1-BLEU)
       score = rouge_weight * rouge_l + bleu_weight * (1 - bleu)
       scored_queries.append((score, rq))
   if not scored_queries:
       return []
   # 返回综合得分最高的查询
   best_query = max(scored_queries, key=lambda item: item[0])
   return [best_query[1]]
```

说起 ROUGE-L 分数高却 BLEU 分数低，这场景在测试生成文本时超级常见——它像个“双面间谍”，告诉你内容抓得准，也就是高 ROUGE-L，但表达上天马行空，也就是低 BLEU，完美诠释了“同义万千，结构多变”的真谛！

高 ROUGE-L 意味着，你的变体或生成输出忠实捕捉了参考文本的核心信息序列，那些关键点和逻辑流没丢分，顺序也大致对头，就好像你用不同的地图画出了同一条路。反观低 BLEU，词换了、句子重组了，表达新鲜却不雷同。即使意图零偏差，BLEU 也铁面无私地拉低分数，因为它更在意“字面贴合”而非“灵魂共鸣”，这正是我们想要的“多样而不乱”的黄金平衡。

## 帕累托最优

帕累托最优是经济学和决策理论中的一个核心概念，由意大利经济学家维尔弗雷多·帕累托（Vilfredo Pareto）于 19 世纪末提出。它描述了一种资源分配或决策状态，在这种状态下，无法通过重新分配资源或调整方案，使至少一个参与者的利益得到改善，而同时不使任何其他参与者的利益恶化。

简单来说，就是“不能让饼更大，也不能让某人多吃一口而不让别人少吃一口”，这是一个“高效但不一定公平”的均衡点，使用帕累托最优选出来的改写 Query，就是这样一个折中的平衡，再结合 ROUGE-L 和 BLEU 分数就找出了语义和多样性的平衡的结果。

```python
def pareto_optimal(rewritten_queries: List[RewrittenQuery], original_query: str)
   """Finds the Pareto optimal set of rewritten queries based on ROUGE-L and BLE
   if not rewritten_queries:
       return []
   scores = []
   for rq in rewritten_queries:
       rouge_l = calculate_rouge_l(rq["query"], original_query)
       bleu = calculate_bleu(rq["query"], original_query)
       scores.append((rouge_l, bleu, rq))
   pareto_front = []
   for i, (r1, b1, q1) in enumerate(scores):
       is_dominated = False
       for j, (r2, b2, q2) in enumerate(scores):
           if i == j: continue
           # A query is dominated if another query is better or equal in all obj
           # and strictly better in at least one objective.
           if (r2 >= r1 and b2 <= b1) and (r2 > r1 or b2 < b1):
               is_dominated = True
               break
       if not is_dominated:
           pareto_front.append(q1)
   return pareto_front
```

这方法借助帕累托前沿原则，像“多目标优化高手”，在 ROUGE-L vs BLEU 的坐标系上，挑出那些“无人能敌”的变体——即没有其他 query 在两个维度上都优于它的点，形成“非支配前沿”。

厉害之处在于，自动挖出语义 - 多样性的“黄金权衡”，避开“一刀切”阈值的主观坑，让测试数据集覆盖“精英变体”而非全家桶。例如：10 条变体中，“查北京气象” (ROUGE=0.9,BLEU=0.2) 和 “首都天气预报？” (0.75, 0.3) 可能双双上榜，因为互不支配——测试模型时，直击“意图变异边界”。

在实现上可以用 O(n log n) 的排序法优雅实现，但上面举例里直接 O(n²) 暴力循环最常见。

## 最详细：长者为王

最详细就是一个简单粗暴的方法“长者为王”，按照改写的 Query 的长度排序，找出最长的改写Query 返回，这些就在语句越长内容越丰富的假设之上做的决策。这种方法计算零成本，适合测试“长尾意图”场景。

```python
def most_detailed(rewritten_queries: List[RewrittenQuery], original_query: str) -
   """返回最长的查询。如果没有重写查询，则返回空列表。"""
   if not rewritten_queries:
       return []
   # 返回所有查询中最长的一个
   return [max(rewritten_queries, key=lambda rq: len(rq["query"]))]
```

## ROUGE-L 和 BLEU 分数阈值过滤

ROUGE-L 和 BLEU 分数的阈值过滤就相当于建立了一个门槛，迈不过去这道坎就不会被选中。这里会分别针对 ROUGE-L 和 BLEU 分数设置阈值，只有双达标的改写 Query 才能被选中。

```python
def filter_by_rouge_l_bleu_thresholds(rewritten_queries: List[RewrittenQuery], or
                       rouge_l_threshold: float = 0.4, bleu_threshold: float = 0
   """
   Filters queries based on ROUGE-L and BLEU score thresholds.
   Returns queries where:
   - ROUGE-L score > rouge_l_threshold (higher is better)
   - BLEU score < bleu_threshold (lower is better)
   Args:
       rewritten_queries: List of rewritten queries to filter
       original_query: The original query for comparison
       rouge_l_threshold: Minimum ROUGE-L score threshold (default: 0.4)
       bleu_threshold: Maximum BLEU score threshold (default: 0.3)
   Returns:
       List of queries that meet both threshold criteria
   """
   if not rewritten_queries:
       return []
   optimal_queries = []
   for rq in rewritten_queries:
       rouge_l_score = calculate_rouge_l(rq["query"], original_query)
       bleu_score = calculate_bleu(rq["query"], original_query)
       if rouge_l_score >= rouge_l_threshold and bleu_score < bleu_threshold:
           optimal_queries.append(rq)
   return optimal_queries
```

## 大模型的语义相似度

放在最后的就是终极大招，利用“判官”大模型的思路，用一款大模型作为语义裁判，让这个大模型评价改写的 Query 和原 Query 的相似度，然后返回语义上最相似但是词汇上差异最大的结果。

```python
def llm_semantic_similarity(rewritten_queries: List[RewrittenQuery], original_que
   """使用LLM寻找语义最相似且词汇差异最大（BLEU最低）的查询。"""
   if not rewritten_queries:
       return []
   best_query = None
   highest_similarity = -1.0
   lowest_bleu_at_highest_sim = 2.0  # BLEU 分数在 0 和 1 之间
   for rq in rewritten_queries:
       prompt = f'{thinking}\n\n评估以下两个查询的语义相似度，\n查询1: {original_query
       response = llm.invoke(prompt)
       try:
           similarity = SuperFloat(response)
           bleu_score = calculate_bleu(rq["query"], original_query)
           # 核心选择逻辑：
           # 1. 如果当前查询的相似度更高，则更新最佳查询。
           # 2. 如果相似度相等，则选择BLEU分数更低的那个（词汇差异更大）。
           if similarity > highest_similarity:
               highest_similarity = similarity
               lowest_bleu_at_highest_sim = bleu_score
               best_query = rq
           elif abs(similarity - highest_similarity) < 1e-9:  # 处理浮点数相等的情况
               if bleu_score < lowest_bleu_at_highest_sim:
                   lowest_bleu_at_highest_sim = bleu_score
                   best_query = rq
       except Exception as e:
           print(f"Error processing similarity for query '{rq['query']}': {e}")
           continue
   return [best_query] if best_query else []
```

## 总结

今天的课就到这儿了，咱们从 QA 对的生成到 Query 改写的数据加工，同样走完了“输入、生成、过滤、输出”的流水线，这不光是工具堆砌，更是测试思维的升级。

在我提供给你的代码中有完整的可以运行的代码例子，你可以自己打开代码细细品味，理解三种改写方法的设计思路，然后随着这个流水线走到过滤的环节，认真理解每一个筛选算法的设计逻辑，这样你就可以理解这个 Query 改写的项目的解题思路。上手运行一下提供的例子，真正感受一下那种从“手动编查询编到吐”到“AI 帮手一键扩充”的解放感，让你一下就上瘾测试过程有大模型这个辅助。

## 思考题

如果在你的工作中也有一些大模型应用的测试，那么我希望你把这个 query 改写的项目实际的用在工作中，然后将你选择的改写方法、筛选方法在评论区告诉我，并说说你的思路。如果你还没有这样的实践机会也没关系，你可以用豆包、kimi 任意一个 Chat 应用作为你的被测试系统，设计一些测试问题，然后使用我们今天讲的 query 改写和筛选的算法，将你的使用思路、使用结果分享在评论区。

最后我还希望你能够思考一下，你的测试工作过程中你是不是可以利用“输入、生成、过滤、输出”这样的模块化流水线，解决测试实践过程中的痛点，并抽象出来你自己的一个类似的小工具，如果有，我也希望你能在评论区里聊一聊。期待看到你的思考和成果。
