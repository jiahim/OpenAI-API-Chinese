# 关键概念

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在 OpenAI，保护用户数据是我们使命的根本。我们不会使用通过 API 的输入和输出
  来训练我们的模型。在我们的 
  [API 数据隐私页面](https://openai.com/api-data-privacy).

## 文本生成模型

OpenAI 的文本生成模型（通常称为生成式预训练变换器或简称“GPT”模型），如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 和 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，经过训练可以理解自然语言和正式语言。这些模型能够根据输入生成文本输出。这些模型的输入也被称为“提示”。设计提示本质上就是你“编程”模型的方式，通常通过提供指令或一些如何成功完成任务的示例。GPT 模型可用于多种任务，包括内容或代码生成、摘要、对话、创意写作等。在我们的入门 [文本生成指南](https://developers.openai.com/api/docs/guides/text) 以及我们的 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering).

## 嵌入

嵌入是对一段数据（例如某些文本）的向量表示，旨在保留其内容和/或含义的某些方面。在某种程度上相似的数据块，其嵌入往往比不相关数据的嵌入更接近。OpenAI提供文本嵌入模型，它们以文本字符串为输入，并以嵌入向量作为输出。嵌入可用于搜索、聚类、推荐、异常检测、分类等。更多关于嵌入的内容，请参阅我们的 [嵌入指南](https://developers.openai.com/api/docs/guides/embeddings).

## 令牌

文本生成和嵌入模型将文本处理为称为 token 的块。Token 表示常见的字符序列。例如，字符串 " tokenization" 被分解为 " token" 和 "ization"，而像 " the" 这样的短常见单词则表示为单个 token。请注意，在句子中，每个单词的第一个 token 通常以空格字符开头。查看我们的 [tokenizer 工具](https://platform.openai.com/tokenizer) 来测试特定字符串，并查看它们如何被转换为 token。粗略估算，对于英文文本，1 个 token 大约等于 4 个字符或 0.75 个单词。

需要记住的一个限制是，对于文本生成模型，提示和生成的输出合计不得超过模型的最大上下文长度。对于嵌入模型（不输出 token），输入必须短于模型的最大上下文长度。每个文本生成和嵌入模型的最大上下文长度可在 [模型索引](https://developers.openai.com/api/docs/models).