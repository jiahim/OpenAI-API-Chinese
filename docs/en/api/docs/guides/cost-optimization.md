# Cost optimization

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

There are several ways to reduce costs when using OpenAI models. Cost and latency are typically interconnected; reducing tokens and requests generally leads to faster processing. OpenAI's Batch API and flex processing are additional ways to lower costs.

## Cost and latency

To reduce latency and cost, consider the following strategies:

- **Reduce requests**: Limit the number of necessary requests to complete tasks.
- **Minimize tokens**: Lower the number of input tokens and optimize for shorter model outputs.
- **Select a smaller model**: Use models that balance reduced costs and latency with maintained accuracy.

To dive deeper into these, please refer to our guide on [latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization).

## Batch API

Process jobs asynchronously. The Batch API offers a straightforward set of endpoints that allow you to collect a set of requests into a single file, kick off a batch processing job to execute these requests, query for the status of that batch while the underlying requests execute, and eventually retrieve the collected results when the batch is complete.

[Get started with the Batch API →](https://developers.openai.com/api/docs/guides/batch)

## Flex processing

Get significantly lower costs for Chat Completions or Responses requests in exchange for slower response times and occasional resource unavailability. Ieal for non-production or lower-priority tasks such as model evaluations, data enrichment, or asynchronous workloads.

[Get started with flex processing →](https://developers.openai.com/api/docs/guides/flex-processing)