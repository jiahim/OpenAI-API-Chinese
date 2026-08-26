# 延迟优化

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

本指南介绍了可用于改善各类与 LLM 相关用例延迟的核心原则集。这些技术源于我们与众多客户和开发者在生产应用程序上的合作经验，因此无论你在构建什么——从细粒度的 工作流到端到端的聊天应用程序——它们都适用。

尽管有许多单独的技术，本指南将它们归为 **七大原则** ，这些原则代表了一套用于改善延迟的高层次方法分类。

最后，我们将通过一个 [示例](#example) 来了解如何应用这些原则。

### 七大原则

1. [更快地处理令牌。](#process-tokens-faster)
2. [生成更少的令牌。](#generate-fewer-tokens)
3. [使用更少的输入令牌。](#use-fewer-input-tokens)
4. [减少请求次数。](#make-fewer-requests)
5. [并行化。](#parallelize)
6. [减少用户的等待时间。](#make-your-users-wait-less)
7. [不要默认使用 LLM。](#dont-default-to-an-llm)

## 更快地处理令牌

**推理速度** 可能是谈到延迟时最先想到的因素（但你很快就会看到，它远非唯一因素）。这指的是 LLM 实际 **处理 token 的速率**，通常以 TPM（每分钟 token 数）或 TPS（每秒 token 数）来衡量。

影响推理速度的主要因素是 **模型大小**——较小的模型通常运行更快（也更便宜），如果使用得当，甚至可能超越较大的模型。为了在较小的模型上保持高质量性能，你可以探索：

- 使用更长的， [更详细的提示词](https://developers.openai.com/api/docs/guides/prompt-engineering#prompt-engineering),
- 添加（更多） [少样本示例](https://developers.openai.com/api/docs/guides/prompt-engineering#few-shot-learning)，或
- [微调](https://developers.openai.com/api/docs/guides/model-optimization) /蒸馏。

你还可以采用推理优化，例如我们的 [**预测输出**](https://developers.openai.com/api/docs/guides/predicted-outputs) 功能。预测输出可以让你在提前知道大部分输出内容时显著降低生成延迟，例如代码编辑任务。通过向模型提供预测，LLM 可以更专注于实际更改，而减少对保持不变内容的关注。



影响推理速度的其他因素包括你可用的 
  **计算量** 以及你采用的任何额外 
  **推理优化** 。 
 

  大多数人无法直接影响这些因素，但如果你好奇，并且
  对你的基础设施有一定控制权， **更快的硬件** 或 
  **以较低饱和度运行引擎** 可能会带来适度的
  TPM 提升。而且如果你深入底层，还有无数其他 
  [推理优化](https://lilianweng.github.io/posts/2023-01-10-inference-optimization/) 
  超出了本指南的讨论范围。



## 生成更少的令牌

在使用 LLM 时，生成令牌几乎总是延迟最高的步骤：作为一般经验法则， **将输出令牌减少 50% 可能使延迟降低约 50%**。减少输出大小的方法取决于输出类型：

如果你生成的是 **自然语言**, **要求模型更简洁** （"少于 20 个词"或"简短一点"）可能会有所帮助。你还可以使用少样本示例和/或微调来教导模型生成更短的响应。

如果你生成的是 **结构化输出**，尽量 **最小化输出语法** ：尽可能缩短函数名、省略命名参数、合并参数等。

最后，虽然不常见，你也可以使用 `max_tokens` 或 `stop_tokens` 提前结束生成。

始终记住：减少一个输出令牌，就赢得一（毫）秒！

## 使用更少的输入令牌

虽然减少输入 token 数量确实会降低延迟，但这通常不是一个重要因素——**将提示减少 50% 可能只会带来 1–5% 的延迟改进**。除非你处理的是真正庞大的上下文（文档、图像），否则你可能应将精力放在其他地方。

话虽如此，如果你 _正在_ 处理庞大的上下文（或你决心榨取最后一点性能 _并且_ 已用尽所有其他选项），你可以使用以下技术来减少输入 token：

- **微调模型**，以替代冗长的指令/示例需求。
- **过滤上下文输入**，如修剪 RAG 结果、清理 HTML 等。
- **最大化共享提示前缀**，将动态部分（例如 RAG 结果和历史记录）放在提示的后面。这使你的请求更 [KV 缓存](https://medium.com/@joaolages/kv-caching-explained-276520203249)-友好（大多数 LLM 提供商使用），意味着每次请求处理的输入令牌更少。

请查阅我们的文档，了解 [提示词
  缓存](https://developers.openai.com/api/docs/guides/prompt-engineering#save-on-cost-and-latency-with-prompt-caching)
  的工作原理。

## 减少请求次数

每次发起请求都会产生一定的往返延迟——这些延迟会逐渐累积。

如果你的 LLM 需要执行多个顺序步骤，与其每步单独发送一次请求，不如考虑 **将这些步骤合并到单个提示中，并在一次响应中获取所有结果**。这样可以避免额外的往返延迟，同时还能降低处理多个响应的复杂性。

实现这一目标的方法是在合并提示中以枚举列表的形式收集你的步骤，然后要求模型在 JSON 对象中以命名字段返回结果。这样，你可以解析并引用每个结果。

## 并行化

在使用大型语言模型执行多个步骤时，并行处理可以非常强大。

如果步骤 **并 _非_ 严格顺序**，你可以 **将它们拆分为并行调用**。两件衬衫晾干所需的时间与一件相同。

如果步骤 **_是_ 严格顺序**，的，但你仍然可能可以利用 **投机执行**。这在分类步骤中特别有效，其中一种结果比其他结果更可能（例如，内容审核）。

1. 同时启动步骤 1 和步骤 2（例如，输入审核与故事生成）
2. 验证步骤 1 的结果
3. 如果结果不符合预期，取消步骤 2（必要时重试）

如果你对第1步的猜测正确，那么你基本上可以在零额外延迟的情况下运行它！

## 减少用户等待

等待与 **等待** 和 **观看进度发生**—之间有着巨大的差异——确保你的用户体验到后者。以下是一些技巧：

- **流式传输**：最有效的方法，因为它将 _等待_ 时间缩短到一秒或更短。（如果每次响应完成前你都看不到任何内容，ChatGPT 会感觉非常不同。）
- **分块处理**：如果你的输出在显示给用户之前需要进一步处理（如审核、翻译），请考虑 **分块处理** 而不是一次性处理。通过将流式传输到后端，然后将处理后的块发送到前端来实现。
- **展示你的步骤**：如果你正在执行多个步骤或使用工具，请向用户展示这一过程。你能展示的真实进度越多越好。
- **加载状态**：加载指示器和进度条大有帮助。

请注意，虽然 **展示你的步骤及加载状态** 在很大程度上有
心理上的效果， **流式传输与分块** 确实能在考虑应用与用户系统时
减少整体延迟：用户会更快读完响应，
从而更快完成。

## 不要默认使用 LLM

语言模型功能强大且用途广泛，因此有时会被用在 **更快的经典方法** 更为适用的场景中。识别这类场景可能让你大幅降低延迟。请考虑以下示例：

- **硬编码：** 如果你的 **输出** 受到高度限制，你可能不需要 LLM 来生成它。操作确认、拒绝消息和标准输入请求都是硬编码的最佳候选。（你甚至可以使用老方法为每个准备几个变体。）
- **预计算：** 如果你的 **输入** 受到限制（例如，类别选择），你可以提前生成多个响应，并确保永远不向用户显示相同的内容两次。
- **利用 UI：** 汇总的指标、报告或搜索结果有时使用经典的定制 UI 组件比 LLM 生成的文本传达效果更好。
- **传统优化技术：** LLM 应用仍然是应用；二分搜索、缓存、哈希映射和运行时复杂度在 _仍然_ 在语言模型的世界中有用。

## 示例

现在让我们看一个示例应用，识别潜在的延迟优化点，并提出一些解决方案！

我们将分析一个受真实生产应用启发的假想客户服务机器人的架构和提示词。 [架构和提示词](#architecture-and-prompts) 部分奠定了基础，而 [分析和优化](#analysis-and-optimizations) 部分将逐步讲解延迟优化过程。

你会注意到这个示例并未涵盖每一个原则，就像
  真实用例也不要求应用每一项技术一样。

### 架构与提示词

以下是一个 **假设的** 客户服务机器人 **的初始架构**。这就是我们将要进行的更改。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-0.png)

从高层次来看，此图流程描述了以下过程：

1. 在持续进行的对话中，用户发送一条消息。
2. 最后一条消息会转化为 **自包含查询** （参见提示中的示例）。
3. 我们判断是否 **需要额外的（检索到的）信息** 来回应这一查询。
4. **检索** 被执行，产生搜索结果。
5. 智能体 **进行推理** ，分析用户的查询和搜索结果，并 **生成回应**.
6. 回应发送回给用户。

以下是图中每个部分使用的提示词。虽然这些提示词仍然是假设性的简化版本，但其结构和措辞与生产环境中应用的提示词相同。

当你看到类似的占位符，如 "**[用户输入]**" 表示
  动态部分，运行时会被实际数据替换。

查询上下文化提示词

将用户查询改写为自包含的搜索查询。

```example-chat
SYSTEM: Given the previous conversation, re-write the last user query so it contains
all necessary context.

# Example
History: [{user: "What is your return policy?"},{assistant: "..."}]
User Query: "How long does it cover?"
Response: "How long does the return policy cover?"

# Conversation
[last 3 messages of conversation]

# User Query
[last user query]

USER: [JSON-formatted input conversation here]
```

检索检查提示词

确定查询是否需要执行检索才能作答。

```example-chat
SYSTEM: Given a user query, determine whether it requires doing a realtime lookup to
respond to.

# Examples
User Query: "How can I return this item after 30 days?"
Response: "true"

User Query: "Thank you!"
Response: "false"

USER: [input user query here]
```

智能体提示词

填写 JSON 的字段，按照预定义的步骤进行推理，从而在给定用户对话和相关信息的情况下生成最终响应。

```example-chat
SYSTEM: You are a helpful customer service bot.

Use the result JSON to reason about each user query - use the retrieved context.

# Example

User: "My computer screen is cracked! I want it fixed now!!!"

Assistant Response:
{
  "message_is_conversation_continuation": "True",
  "number_of_messages_in_conversation_so_far": "1",
  "user_sentiment": "Aggravated",
  "query_type": "Hardware Issue",
  "response_tone": "Validating and solution-oriented",
  "response_requirements": "Propose options for repair or replacement.",
  "user_requesting_to_talk_to_human": "False",
  "enough_information_in_context": "True",
  "response": "..."
}

USER: # Relevant Information
` ` `
[retrieved context]
` ` `

USER: [input user query here]
```

### 分析与优化

#### 第 1 部分：查看检索提示

从架构来看，首先引人注意的是 **连续的GPT-4调用** ——这暗示了潜在的效率问题，通常可以用单个调用或并行调用来替代。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-2.png)

在这种情况下，由于检索检查需要上下文查询，让我们 **将它们合并为一个提示** 以 [减少请求次数](#make-fewer-requests).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-3.png)

合并后的查询上下文化与检索检查提示

**有什么变化？** 之前，我们有一个提示用于重写查询，另一个用于判断是否需要进行检索查找。现在，这个合并后的提示同时完成这两项任务。具体来说，请注意提示第一行更新后的指令，以及更新后的输出 JSON：

```javascript
{
  query: "[contextualized query]",
  retrieval: "[true/false - whether retrieval is required]",
}
```

```ruby
combined_query = {
  query: "[contextualized query]",
  retrieval: "[true/false - whether retrieval is required]"
}

puts(combined_query)
```


```example-chat
SYSTEM: Given the previous conversation, re-write the last user query so it contains
all necessary context. Then, determine whether the full request requires doing a
realtime lookup to respond to.

Respond in the following form:
{
  query:"[contextualized query]",
  retrieval:"[true/false - whether retrieval is required]"
}

# Examples

History: [{user: "What is your return policy?"},{assistant: "..."}]
User Query: "How long does it cover?"
Response: {query: "How long does the return policy cover?", retrieval: "true"}

History: [{user: "How can I return this item after 30 days?"},{assistant: "..."}]
User Query: "Thank you!"
Response: {query: "Thank you!", retrieval: "false"}

# Conversation
[last 3 messages of conversation]

# User Query
[last user query]

USER: [JSON-formatted input conversation here]
```



实际上，添加上下文和判断是否检索都是直接且定义明确的任务，因此我们可能可以使用 **更小的微调模型** 来代替。切换到 GPT-3.5 可以让我们 [更快地处理令牌](#process-tokens-faster).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-4.png)

#### 第 2 部分：分析智能体提示词

现在让我们把注意力转向智能体提示词。在填充 JSON 字段时似乎有许多不同的步骤在同时进行——这或许表明有机会 [并行化](#parallelize).

![智能体对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-5.png)

然而，假设我们已经运行了一些测试，发现拆分 JSON 中的推理步骤会产生更差的结果，因此我们需要探索不同的解决方案。

**我们能否使用微调的 GPT-3.5 而不是 GPT-4？** 也许可以——但一般来说，智能体的开放式响应最好留给 GPT-4，以便它能更好地处理更大范围的情况。话虽如此，仅看推理步骤本身，它们可能并不都需要 GPT-4 级别的推理能力才能生成。它们定义明确、范围有限，使其成为 **适合微调的良好候选对象**.

```javascript
{
  message_is_conversation_continuation: "True", // <-
  number_of_messages_in_conversation_so_far: "1", // <-
  user_sentiment: "Aggravated", // <-
  query_type: "Hardware Issue", // <-
  response_tone: "Validating and solution-oriented", // <-
  response_requirements: "Propose options for repair or replacement.", // <-
  user_requesting_to_talk_to_human: "False", // <-
  enough_information_in_context: "True", // <-
  response: "...", // X -- benefits from GPT-4
}
```

```ruby
assistant_response = {
  message_is_conversation_continuation: "True", # <-
  number_of_messages_in_conversation_so_far: "1", # <-
  user_sentiment: "Aggravated", # <-
  query_type: "Hardware Issue", # <-
  response_tone: "Validating and solution-oriented", # <-
  response_requirements: "Propose options for repair or replacement.", # <-
  user_requesting_to_talk_to_human: "False", # <-
  enough_information_in_context: "True", # <-
  response: "..." # X -- benefits from GPT-4
}

puts(assistant_response)
```


这就带来了权衡的可能。我们是将其保留为 **完全由 GPT-4 生成的单次请求**，还是 **拆分为两个顺序请求** ，并仅对最终响应之外的步骤使用 GPT-3.5？我们面临原则上的冲突：第一种方案让我们 [减少请求次数](#make-fewer-requests)，但第二种方案可能让我们 [更快处理令牌](#process-tokens-faster).

与许多优化权衡一样，答案将取决于具体情况。例如：

- token 在 `response` vs 与其他字段中的比例。
- 由于大多数字段处理速度更快，平均延迟降低。
- 平均延迟 _增加_ （因执行两次请求而非一次）。

结论因情况而异，确定的最佳方式是用生产示例进行测试。在这种情况下，假设测试表明将提示拆分为两部分是有利的，以便 [更快地处理令牌](#process-tokens-faster).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-6.png)

**注：** 我们将把 `response` 和 `enough_information_in_context` 一起放在第二个提示中，以避免将检索到的上下文传递给两个新提示。

Assistants 提示 - 推理

该提示将传递给 GPT-3.5，并且可以在精选示例上进行微调。

**有什么变化？** “enough_information_in_context”和“response”字段被移除，检索结果不再加载到该提示中。

```example-chat
SYSTEM: You are a helpful customer service bot.

Based on the previous conversation, respond in a JSON to determine the required
fields.

# Example

User: "My freaking computer screen is cracked!"

Assistant Response:
{
  "message_is_conversation_continuation": "True",
  "number_of_messages_in_conversation_so_far": "1",
  "user_sentiment": "Aggravated",
  "query_type": "Hardware Issue",
  "response_tone": "Validating and solution-oriented",
  "response_requirements": "Propose options for repair or replacement.",
  "user_requesting_to_talk_to_human": "False",
}
```
Assistants 提示 - 响应

该提示将由 GPT-4 处理，并将接收前一个提示中确定的推理步骤以及检索结果。

**有什么变化？** 除“enough_information_in_context”和“response”外，所有步骤均被移除。此外，我们之前作为输出填写的 JSON 将传递给该提示。

```example-chat
SYSTEM: You are a helpful customer service bot.

Use the retrieved context, as well as these pre-classified fields, to respond to
the user's query.

# Reasoning Fields
` ` `
[reasoning json determined in previous GPT-3.5 call]
` ` `

# Example

User: "My freaking computer screen is cracked!"

Assistant Response:
{
  "enough_information_in_context": "True",
  "response": "..."
}

USER: # Relevant Information
` ` `
[retrieved context]
` ` `
```




事实上，既然推理提示不依赖于检索到的上下文，我们可以 [并行化](#parallelize) 并同时触发它和检索提示。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-6b.png)

#### 第 3 部分：优化结构化输出

让我们再看一下推理提示词。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-7b.png)

仔细查看推理 JSON，你可能会注意到字段名本身相当长。

```javascript
{
  message_is_conversation_continuation: "True", // <-
  number_of_messages_in_conversation_so_far: "1", // <-
  user_sentiment: "Aggravated", // <-
  query_type: "Hardware Issue", // <-
  response_tone: "Validating and solution-oriented", // <-
  response_requirements: "Propose options for repair or replacement.", // <-
  user_requesting_to_talk_to_human: "False", // <-
}
```

```ruby
reasoning = {
  message_is_conversation_continuation: "True", # <-
  number_of_messages_in_conversation_so_far: "1", # <-
  user_sentiment: "Aggravated", # <-
  query_type: "Hardware Issue", # <-
  response_tone: "Validating and solution-oriented", # <-
  response_requirements: "Propose options for repair or replacement.", # <-
  user_requesting_to_talk_to_human: "False" # <-
}

puts(reasoning)
```


通过缩短字段名并将解释移至注释中，我们可以 [生成更少的 token](#generate-fewer-tokens).

```javascript
{
  cont: "True", // whether last message is a continuation
  n_msg: "1", // number of messages in the continued conversation
  tone_in: "Aggravated", // sentiment of user query
  type: "Hardware Issue", // type of the user query
  tone_out: "Validating and solution-oriented", // desired tone for response
  reqs: "Propose options for repair or replacement.", // response requirements
  human: "False", // whether user is expressing want to talk to human
}
```

```ruby
reasoning = {
  cont: "True", # whether last message is a continuation
  n_msg: "1", # number of messages in the continued conversation
  tone_in: "Aggravated", # sentiment of user query
  type: "Hardware Issue", # type of the user query
  tone_out: "Validating and solution-oriented", # desired tone for response
  reqs: "Propose options for repair or replacement.", # response requirements
  human: "False" # whether user wants to talk to a human
}

puts(reasoning)
```


![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-8b.png)

这一小改动减少了 19 个输出 token。虽然对于 GPT-3.5 来说这可能只带来几毫秒的改进，但对于 GPT-4 来说，这可能节省多达一秒的时间。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/token-counts-latency-customer-service-large.png)

然而，你可以想象，这对于更大的模型输出会有多么显著的影响。

我们可以进一步为 JSON 字段使用单个字符，或将所有内容放入数组中，但这可能会开始损害我们的响应质量。同样，最好的判断方法是通过测试。

#### 示例总结

让我们回顾一下为客户服务机器人示例实施的优化：

![助手对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-11b.png)

1. **结合** 查询上下文化和检索检查步骤，以 [减少请求次数](#make-fewer-requests).
2. 对于新提示词， **切换到更小、微调的 GPT-3.5** 以 [更快处理 token](#process-tokens-faster).
3. 将助手提示词一分为二， **切换到更小、微调的 GPT-3.5** 用于推理，再次以 [更快处理 token](#process-tokens-faster).
4. [并行化](#parallelize) 检索检查和推理步骤。
5. **缩短推理字段名** 并将注释移入提示词，以 [生成更少的 token](#generate-fewer-tokens).