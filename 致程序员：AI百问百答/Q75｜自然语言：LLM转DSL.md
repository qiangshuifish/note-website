# Q75 | 自然语言：LLM转DSL

- 作者介绍：黄佳，新加坡科研局资深研发工程师

Q：如何通过自然语言让 LLM 生成 DSL（Domain-specific languages）？

黄佳：

实施的具体方法流程如下：DSL 模式定义、知识检索（RAG）与示例注入、Prompt 设计、语法与输出约束、执行与验证以及工具与框架选型。

通用 vs 专用语法：

- Text2SQL 通常利用数据库元数据（如 information_schema）动态提取 DDL，依赖数据库自身保证 SQL 语法合法性。

- Text2DSL 需显式提供 DSL 定义（如 BNF 语法或 JSON Schema），因其无法像 SQL 那样动态获取元数据，在生成后通过专用解析器或 Dry-Run 验证来确保输出符合语法。

Prompt 设计：

- Text2SQL Prompt ： 通常按 “Schema → 描述 → 示例 → 对用户提问”形式组织，上下文包含表结构、字段含义及自然语言 → SQL 示例。

- Text2DSL Prompt：除了示例外，还需要在 Prompt 中嵌入 DSL 的文法片段或 JSONSchema 模板，并通过 Grammar Prompting 明确约束模型输出格式，防止生成非法 DSL。
