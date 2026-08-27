# 成本优化

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用 OpenAI 模型时有多种降低成本的方法。成本和延迟通常是相互关联的；减少令牌和请求通常会加快处理速度。此外，OpenAI 的 Batch API 和灵活处理也是降低成本的额外方式。

## 成本与延迟

为降低延迟和成本，可考虑以下策略：

- **减少请求**：限制完成任务所需的必要请求数量。
- **最小化令牌**：降低输入令牌数量，并优化模型输出的简洁性。
- **选择更小的模型**：使用在降低成本和延迟的同时保持准确性的模型。

要深入了解这些内容，请参阅我们的 [延迟优化](https://developers.openai.com/api/docs/guides/latency-optimization).

## 批量API

异步处理作业。批处理 API 提供一组直接的端点，允许你将一组请求收集到单个文件中，启动批处理作业以执行这些请求，在底层请求执行时查询该批处理的状态，并最终在批处理完成时检索收集到的结果。

[批处理 API 快速入门 →](https://developers.openai.com/api/docs/guides/batch)

## 灵活处理

以较慢的响应时间和偶尔的资源不可用为代价，显著降低 Chat Completions 或 Responses 请求的成本。适用于非生产环境或低优先级任务，如模型评估、数据增强或异步工作负载。

[开始使用 flex processing →](https://developers.openai.com/api/docs/guides/flex-processing)