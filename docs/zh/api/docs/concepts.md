# 核心概念

> 完整文档索引请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

在 OpenAI，保护用户数据是我们使命的根本。我们不会通过我们的
  API 对输入和输出进行模型训练。详情请参阅我们的 
  [API 数据隐私页面](https://openai.com/api-data-privacy).

## 文本生成模型

OpenAI 的文本生成模型（通常称为生成式预训练 Transformer，简称为“GPT”模型），例如 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 和 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，已经过训练以理解自然语言和形式化语言。这些模型能根据输入生成文本输出。这些模型的输入也称为“提示”。设计提示本质上就是你对模型进行“编程”的方式，通常通过提供指令或一些如何成功完成任务的示例来实现。GPT 模型可应用于各种各样的任务，包括内容或代码生成、摘要、对话、创意写作等。更多信息请阅读我们的入门 [文本生成指南](https://developers.openai.com/api/docs/guides/text) 以及我们的 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering).

## Embeddings

嵌入（embedding）是一段数据（例如某些文本）的向量表示，旨在保留其内容和/或含义的某些方面。以某种方式相似的数据片段，其嵌入向量往往会比不相关的数据更接近。OpenAI 提供文本嵌入模型，输入一个文本字符串，输出一个嵌入向量。嵌入可用于搜索、聚类、推荐、异常检测、分类等场景。更多关于嵌入的内容请阅读我们的 [embeddings guide](https://developers.openai.com/api/docs/guides/embeddings).

## Tokens

文本生成和 embeddings 模型以称为 token 的块为单位处理文本。Token 表示常见的字符序列。例如，字符串 " tokenization" 会被拆分为 " token" 和 "ization"，而像 " the" 这样简短且常见的单词则表示为单个 token。请注意，在一句话中，每个单词的第一个 token 通常以空格字符开头。请查看我们的 [tokenizer 工具](https://platform.openai.com/tokenizer) 来测试特定字符串，并查看它们如何被转换为 token。作为粗略的经验法则，对于英文文本，1 个 token 大约对应 4 个字符或 0.75 个单词。

需要牢记的一个限制是，对于文本生成模型，prompt 和生成输出加起来不得超过模型的最大上下文长度。对于 embeddings 模型（不会输出 token），输入必须短于模型的最大上下文长度。每个文本生成和 embeddings 模型的最大上下文长度可在 [模型索引](https://developers.openai.com/api/docs/models).