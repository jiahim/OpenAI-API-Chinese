# 关键概念

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt). 在页面 URL 末尾附加 `.md` 即可获取文档页面的 Markdown 版本。

在 OpenAI，保护用户数据是我们使命的根本。我们不会通过我们的
  API 对输入和输出进行模型训练。了解更多信息，请访问我们的 
  [API 数据隐私页面](https://openai.com/api-data-privacy).

## 文本生成模型

OpenAI 的文本生成模型（通常称为生成式预训练变换器，简称 "GPT" 模型），例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 和 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，已通过训练能够理解自然语言和形式化语言。这些模型可以根据输入返回文本输出。这些模型的输入也被称为 "提示词（prompts）"。设计提示词本质上就是如何对模型进行 "编程"，通常通过提供指令或一些如何成功完成任务的示例来实现。GPT 模型可广泛应用于各种任务，包括内容或代码生成、摘要、对话、创意写作等。更多内容请参阅我们的入门 [文本生成指南](https://developers.openai.com/api/docs/guides/text) 以及我们的 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering).

## Embeddings

嵌入（embedding）是一段数据（例如一段文本）的向量表示，旨在保留其内容和/或含义的某些方面。以某种方式相似的数据片段，其嵌入往往比不相关的数据的嵌入更为接近。OpenAI 提供文本嵌入模型，它以文本字符串作为输入，并输出一个嵌入向量。嵌入可用于搜索、聚类、推荐、异常检测、分类等场景。在我们的 [嵌入指南](https://developers.openai.com/api/docs/guides/embeddings).

## Tokens

文本生成和嵌入模型以称为 token 的块来处理文本。Token 表示常见的字符序列。例如，字符串 " tokenization" 会被分解为 " token" 和 "ization"，而像 " the" 这样简短且常见的单词则表示为单个 token。请注意，在句子中，每个单词的首个 token 通常以一个空格字符开头。请参阅我们的 [tokenizer 工具](https://platform.openai.com/tokenizer) 来测试特定字符串并查看它们是如何转换为 token 的。作为一个粗略的经验法则，对于英文文本，1 个 token 大约对应 4 个字符或 0.75 个单词。

需要牢记的一个限制是：对于文本生成模型，提示和生成输出加在一起不得超过模型的最大上下文长度。对于嵌入模型（它们不会输出 token），输入必须短于模型的最大上下文长度。每个文本生成和嵌入模型的最大上下文长度可在 [模型索引](https://developers.openai.com/api/docs/models).