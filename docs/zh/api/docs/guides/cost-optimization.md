# 成本优化

> 完整文档索引请参阅 [llms.txt](/llms.txt). 通过在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

使用 OpenAI 模型时，可以通过多种方式降低成本。成本和延迟通常是相互关联的；减少令牌和请求通常会带来更快的处理速度。OpenAI 的 Batch API 和 flex 处理也是降低成本的其他方式。

## 成本与延迟

为降低延迟和成本，可以参考以下策略：

- **减少请求**：限制完成任务所需的请求数量。
- **最小化令牌用量**：降低输入令牌数量，并优化以获得更短的模型输出。
- **选择更小的模型**：使用能够在降低成本和延迟的同时保持准确性的模型。

若要深入了解这些内容，请参阅我们的 [延迟优化](https://developers.openai.com/api/docs/guides/latency-optimization).

## Batch API

异步处理任务。Batch API 提供了一组简洁的端点，允许你将一组请求归集到一个文件中，启动批处理任务来执行这些请求，在底层请求执行时查询该批次的状态，并在批次完成后最终取回收集到的结果。

[开始使用 Batch API →](https://developers.openai.com/api/docs/guides/batch)

## Flex 处理

通过接受更慢的响应速度和偶尔的资源不可用，可以显著降低 Chat Completions 或 Responses 请求的成本。非常适合非生产环境或低优先级任务，例如模型评估、数据增强或异步工作负载。

[开始使用 flex 处理 →](https://developers.openai.com/api/docs/guides/flex-processing)