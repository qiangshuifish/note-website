# 37 | 如何构建并使用RAG技术（一）

你好，我是月影。

我们课程更新到现在，大部分探讨的内容是大模型本身。而作为智能体来说，大模型推只是其中核心的环节，而不是全部。

这一点在我们前面课程中，大家也能体会到，比如波波熊学伴的智能体工作流，既包括主要的大模型推理，也包括了前置的资料搜索等环节，这些环节和大模型最终协同完成用户的任务。

今天我们就来系统聊一个在智能体中非常重要的环节，你可能在 AI 相关技术领域已经听到过这个概念，我们前面的课程也偶尔有提及，那就是 RAG，全称是 Retrieval-AugmentedGeneration，中文一般叫做检索增强生成，其实更准确的说法应该是生成式检索增强。

## 实现 RAG 的几种可选方案

从原理上来讲，在不提供外部信息的情况下，大模型的推理只能基于自身训练的语料库，这些语料库构成大模型所具有的全部知识，那么对于最新发生的事情，大模型本身不知道，所以也就无法准确回答了。

我们要让大模型知道最近发生的事情，回答一些最新的东西，有几个办法。

### 使用搜索引擎

我们在前面的课程中，尝试过用 serpdev 这样的搜索引擎 SaaS 服务，也尝试过 Coze 智能体中的搜索工具，这些搜索引擎根据用户的内容搜索答案，将答案通过提示词提供给大模型作为参考，大模型就可以根据搜索结果里的内容进行回答。

在通用的问答领域，其实搜索引擎是非常好用的一种方式，在很多企业内容，往往构建有私域的搜索引擎，比如本地的文档库，数据检索服务等等，很多企业为了引入 AI，先投入很多时间和高成本在构建经典 RAG 系统的向量数据库上，其实是没有必要的，完全可以先部署大模型，对接企业内部的搜索服务，这样就能满足很大一部分的需求了。

### 超长上下文大模型的全文嵌入

现在有不少大模型本身的上下文很长，例如上下文 128K 的 moonshot，以中文汉字平均 1 个字 1.5 token 的方式计算，128K 上下文可以承载约八万七千个汉字，这已经是相当多的内容了，在一般情况下，如果不是做多轮对话，而是简单的专项问答系统，甚至可以把整个资料完全放入到模型的提示词中使用。

例如，在公司内部基于员工手册构建一个 AI 智能员工服务机器人，就完全没必要构建 RAG，而是直接将员工手册的所有内容都写入 AI 提示词中就可以。

### 对结构化、语义化的文件系统结合目录搜索与文件读取

如果是让 AI 回答项目某个目录下某些文档中的内容，往往也不需要构建 RAG，因为通常情况下项目目录结构和文件名都是包含明确信息的，AI 可以通过查找目录列出文件，通过文件名判断相关联文件内容，然后读取文件，抽取出重要内容，最后将内容放到提示词中，返回给用户的回答。

这种逐步搜索，通过多轮执行最终给出回答的方式，正是 AI Coding 工具常用的方式。比如你给 Trae 或者 Cursor 描述一个任务后，它就是基于上下文和项目结构开始查找这些相关文件，最终给出结果。

### 三种方式的局限性

前面讲的这三种方式都很方便，但有各自的缺陷。

使用搜索引擎，通常用来搜索公开的资料，或者借助企业内部已有的搜索接口搜索内部资料，如果没有接口或者非公开资料，搭建一套搜索引擎的成本也不比构建向量数据库更低。

超长上下文大模型全文嵌入，首先上下文长的大模型本身往往成本就比较高，其次如果多轮对话，每一轮对话都携带有长上下文，对 token 也是一种浪费。所以一般这种全文嵌入只适用于单轮问答的场景。

结构化搜索，查找到资料往往需要多轮执行，这样也会导致大量的 token 消耗，但是结构化搜索不需要事先构建向量数据，比较适合实时任务场景。比如写代码的时候，一般不会一边写一边构建向量数据，所以这种方式就更多用于 AI Coding。

## 使用经典 RAG 技术

经典 Retrieval-Augmented Generation 是一套体系，它结合了信息检索与语言生成的人工智能架构，通过将知识内容的文本转换成向量，存放于专门的向量数据库中，在回答问题时，让AI 先查一下向量知识库内容，找出（召回）相似度高的文本内容，把它作为参考资料再进行回答。

### 向量数据库和检索

向量数据库和向量检索，是经典 RAG 技术中很重要的概念，它本质上是通过 embedding 模型将数据压缩成语义向量，通过向量相似度（比如余弦距离、欧氏距离、点积等）来进行匹配，从而真正实现语义搜索而不是依赖传统的搜索引擎的关键词匹配。

向量检索能做到真正意义上的语义匹配，在某些情况下，基于关键词匹配的搜索引擎很难做到。例如用户询问“上海有哪些适合小孩的亲子餐厅？”，知识库中的内容有“儿童友好的家庭用餐场所推荐”，如果是传统的文档搜索，很难匹配这样的内容，而向量检索则可以找出相关片段。

### 构建向量检索系统

要构建一套向量检索系统，我们需要一个构建向量的 embedding 模型，和一个存储向量数据的向量数据库。

接下来我们就通过实战来体会。

首先，我们需要挑选一个 embedding 模型，前面课程中我们已经安装了 ollama，在这里，我们选择 ollama 官方的 nomic-embed-text 就可以。

我们在终端运行代码：

```
ollama pull nomic-embed-text
```

ollama 会自动下载这个模型，一般 embedding 模型规模较小，很快就能下载完成。

接下来，我们打开 Trae IDE 创建一个新的 NodeJS 项目 rag_demo。

然后我们需要一个本地向量数据库，在这里我选择最简单的 vectra，它是一个基于 NodeJS 的微型向量数据库，不适合生产环境，但用来本地演示是没问题的。如果需要在生产环境使用，可以选择其他数据库比如 node-faiss 等等。

接下来我们安装必要的依赖并测试效果。

首先是 ollama：

```
pnpm i ollama
```

在这里，我们安装 NodeJS 的 ollama SDK，虽然我们直接通过 ollama 的 REST 接口也可以访问 embedding 模型，但是通过 SDK 可以简化我们的操作。

```
我们可以试一下。在项目下创建一个文件  ./examples/ollama-usage.ts。
```

内容如下：

```python
import ollama from 'ollama';
async function main() {
 const res = await ollama.embeddings({
   model: 'nomic-embed-text',
   prompt: 'RAG 是什么？'
 })
 console.log(res.embedding) // 就是向量数组啦～
}
main();
然后我们运行  npx tsx examples/ollama-usage.ts ，你会看到终端输出类似如下的信
```

息：

```
[
  0.19573575258255005,  0.04674296826124191,   -4.181270122528076,
  -1.4150619506835938,  0.32933059334754944, -0.33324098587036133,
  0.38572266697883606,   0.8365907669067383,  -0.3828256130218506,
  -1.8367664813995361,   -0.563200056552887,   0.9701204895973206,
   0.6225993037223816,    0.921666145324707, -0.12139183282852173,
   -1.416558027267456, 0.002502933144569397,  -1.5984857082366943,
  -1.5473697185516357,  0.20426428318023682,  -1.0203261375427246,
...
]
```

这个就是 embedding 模型根据我们输入的文本构建的向量了。

接下来，我们安装向量数据库 vectra，用来存储向量：

```
pnpm i vectra
```

现在我们可以实现具体逻辑了，首先需要几个工具函数。

```bash
让我们新增模块  src/utils/index.ts ，内容如下：
/**
* 工具函数集合
* @description 包含项目中使用的通用工具函数
* @author RAG Demo Project
* @version 1.0.0
*/
import ollama, { EmbeddingsResponse } from 'ollama';
export interface IEmbedding {
 metadata: { text: string };
 vector: number[];
}
function splitText(text: string, chunkSize = 300, overlap = 50): string[] {
 const chunks: string[] = []
 let i = 0
 while (i < text.length) {
   chunks.push(text.slice(i, i + chunkSize))
   i += chunkSize - overlap
 }
 return chunks
}
function getEmbedding(text: string): Promise<EmbeddingsResponse> {
 return ollama.embeddings({
   model: 'nomic-embed-text',
   prompt: text
 });
}
export async function getEmbeddings(text: string): Promise<IEmbedding[]> {
 const chunks = splitText(text);
 const embeddings = await Promise.all(chunks.map(chunk => getEmbedding(chunk)));
 return embeddings.map((embedding, i) => ({
   vector: embedding.embedding,
   metadata: { text: chunks[i] }
 }));
}
export async function getVector(text: string): Promise<number[]> {
 return (await getEmbedding(text)).embedding;
}
```

在上面的代码里，我们实现了几个函数，它们是生成向量数据的辅助函数。

首先，由于向量存储文本的长度是有限制的，如果文本太长，转换成向量可能会丢失细节信息，所以我们需要一个拆分文本的方法 splitText。

需要注意的一点是，向量化的文本拆分和对普通字符串的拆分方法有一个不同点，就是它需要一个 overlap 参数，用首尾重复来保证上下文语义的桥接。

这里举个例子。假设说有这样一段文本：

- “……此时刘慈欣提出了‘黑暗森林法则’，这是整个小说的核心概念之一。接下来，章北海在……”

如果刚好切在“黑暗森林法则”与“接下来，章北海”之间，那么 embedding 就断裂了，这就很可能导致向量检索的时候失去了“黑暗森林法则”与“章北海”的关联性，但是通过 overlap = 50，也就是说切分的下一段文本刻意留有上一段文本的最后五十个字符，就能保证下一段文本中有“黑暗森林法则”和“章北海”的上下文，从而不会导致连接断裂。

接着我们实现 getEmbedding 和 getEmbeddings 方法，它们分别对单段文本和切分成多段的文本通过 nomic-embed-text 模型进行向量化，用于存入数据库。

最后提供一个 getVector 方法，用来做查询时的文本向量化，实际上它内部也是调用getEmbedding 实现的，只不过只返回向量本身，而且这个名字不易和存储向量时的getEmbeddings 方法混淆。

工具函数有了，我们就可以实现具体的功能了。

```bash
接下来创建  src/index.ts ：
/**
* 项目入口文件
* @description 这是项目的主入口文件
* @author RAG Demo Project
* @version 1.0.0
*/
import path from 'node:path';
import { LocalIndex } from 'vectra';
import { getVector, getEmbeddings } from "./utils";
export class SimpleRag {
 private db: LocalIndex | undefined;
 private indexPath: string;
 constructor(indexPath: string = '.vectra') {
   this.indexPath = path.join(__dirname, '..', indexPath);
 }
 get avaliable() {
   return this.db !== undefined;
 }
 async initialize() {
   const index = new LocalIndex(this.indexPath);
   if (!(await index.isIndexCreated())) {
     await index.createIndex();
   }
   this.db = index;
 }
 async add(text: string) {
   if(!this.avaliable) throw new Error('RAG is not initialized');
   const embeddings = await getEmbeddings(text);
   const res: (Awaited<ReturnType<LocalIndex['insertItem']>> | undefined)[] = []
   for(const embedding of embeddings) {
     res.push(await this.db?.insertItem(embedding));
   }
   return res.filter(item => item).map((item) => ({id: item!.id}));
 }
 async del(items: {id: string}|{id: string}[]) {
   if(!Array.isArray(items)) items = [items];
   if(!this.avaliable) throw new Error('RAG is not initialized');
   // 这地方同样也不能并行删除
   // return await Promise.all(items.map(async (item) => this.db?.deleteItem(ite
   const res: ({ id: string })[] = [];
   for(const item of items) {
     await this.db?.deleteItem(item.id);
     res.push({ id: item.id });
   }
   return res;
 }
 async query(query: string, topK: number = 5) {
   if(!this.avaliable) throw new Error('RAG is not initialized');
   const vector = await getVector(query);
   const result = await this.db?.queryItems(vector, query, topK);
   return result?.map(({item, score}) => ({
     text: item.metadata.text,
     query,
     simularity: score,
     id: item.id,
   }));
 }
}
```

在这里，我们创建一个 SimpleRag 类，主要有四个方法。其中 initialize 是异步初始化方法，vectra 向量数据库通过 new LocalIndex 来创建本地数据索引，在构造函数里，我们可以指定一个 localIndex 的存放地址，我们默认让它存放于 .vectra 目录下，实际上它是以一个简单的JSON 文本格式存放的。

接着是 add 方法，它是用来创建文本内容索引并保存到向量数据库中的，我们可以把任何文本数据通过调用 add 来创建内容索引。

```javascript
 async add(text: string) {
   if(!this.avaliable) throw new Error('RAG is not initialized');
   const embeddings = await getEmbeddings(text);
   const res: (Awaited<ReturnType<LocalIndex['insertItem']>> | undefined)[] = []
   for(const embedding of embeddings) {
     res.push(await this.db?.insertItem(embedding));
   }
   return res.filter(item => item).map((item) => ({id: item!.id}));
 }
```

在 add 方法中，我们使用刚才实现的工具方法 getEmbeddings 来获得向量化的文本记录，然后将它通过 db.insertItem 存入数据库中，返回一个 [{id: xxxx}] 的数据，表示写入的记录，删除数据操作也需要通过 id 来进行。

接着是 del 方法：

```javascript
 async del(items: {id: string}|{id: string}[]) {
   if(!Array.isArray(items)) items = [items];
   if(!this.avaliable) throw new Error('RAG is not initialized');
   // 这地方同样也不能并行删除
   // return await Promise.all(items.map(async (item) => this.db?.deleteItem(ite
   const res: ({ id: string })[] = [];
   for(const item of items) {
     await this.db?.deleteItem(item.id);
     res.push({ id: item.id });
   }
   return res;
 }
```

我们通过调用 db.deleteItem 方法来批量删除包含指定 id 的记录。

最后就是 query 方法了。

```javascript
 async query(query: string, topK: number = 5) {
   if(!this.avaliable) throw new Error('RAG is not initialized');
   const vector = await getVector(query);
   const result = await this.db?.queryItems(vector, query, topK);
   return result?.map(({item, score}) => ({
     text: item.metadata.text,
     query,
     simularity: score,
     id: item.id,
   }));
 }
```

我们在这个方法里查询结果，其中 query 是我们要检索匹配的内容，number 表示最多取出几条记录。我们通过 db.queryItems 进行查询，最终的结果会按照相似度从高到低返回给我们。

这样我们就完成了简单的 RAG 工具，它能基于文本内容创建数据，给大模型使用。

```python
我们测试一下，创建  ./examples/rag-usage.ts ：
import { SimpleRag } from '../src/index';
async function main() {
 const rag = new SimpleRag();
 await rag.initialize();
 const inserted = await rag.add('RAG 技术原理');
 console.log(JSON.stringify(inserted));
 const res = await rag.query('RAG 是什么？');
 console.log(JSON.stringify(res));
 const res2 = await rag.query('随便问一些无关内容');
 console.log(JSON.stringify(res2));
 await rag.del(inserted);
}
main();
运行 npx tsx ./examples/rag-usage.ts ，会得到如下结果：
```

```json
[{"id":"b77f03cb-7ec0-4282-bcc8-ced53f78aa5f"}]
[{"text":"RAG 技术原理","query":"RAG 是什么？","simularity":0.9265016580322546,"id":
[{"text":"RAG 技术原理","query":"随便问一些无关内容","simularity":0.5137422439344267,
```

我们会看到，query 返回的结果，用户问的“RAG 是什么？”与“RAG 技术原理”有很高的相似度，simularity 值超过了 0.92，而“随便问一些无关内容”与之的相似度只有 0.51 左右。这样我们就可以在业务里查询向量数据，把高相关的内容写入大模型提示词里，以实现通过 RAG 来提升模型输出内容的准确度了。

## 要点总结

这节课，我们主要介绍了 RAG 技术的原理和作用，以及实现 RAG 的几种可选方案。然后针对经典 RAG 技术，通过实例讲解了使用向量数据库和 embedding 模型构建基础的向量检索系统的方法。

在下一节课中，我们将向量数据库和大模型联系起来，通过具体例子来学习如何实现一个完整的带有 RAG 能力的知识管理智能体，敬请期待。

## 课后练习

这一节课我们的例子使用的是一个非常简单的向量数据库 vectra，它的特点是基于本地文件系统，无任何依赖，所以安装非常简单，适合教学场景，但不适合高并发的生产环境。你可以考虑使用其他向量数据库替代，比如 FAISS（Facebook AI Similarity Search），这是由 Meta（Facebook）开源的一个高性能向量相似度搜索库，你可以试着部署它，然后通过 NodeJS访问，将 SimpleRag 的数据库操作替换成 FAISS。将你的实践心得分享到评论区吧。

本节课完整代码详见 GitHub 仓库。
