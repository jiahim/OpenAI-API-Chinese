# Latency optimization

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

本指南介绍一套核心原则，你可以将其应用于各种 LLM 相关场景以降低延迟。这些技巧来自我们与众多客户和开发者在生产应用上的合作经验，因此无论你在构建什么——从细粒度的工作流到端到端的聊天应用——它们都应有所帮助。

尽管具体的技巧有很多，但本指南将它们归为 **七条原则** ，作为改进延迟方法的顶层分类。

最后，我们将通过一个 [示例](#example) 展示如何应用这些原则。

### 七项原则

1. [更快地处理 tokens。](#process-tokens-faster)
2. [生成更少的 tokens。](#generate-fewer-tokens)
3. [使用更少的输入 tokens。](#use-fewer-input-tokens)
4. [发起更少的请求。](#make-fewer-requests)
5. [并行化。](#parallelize)
6. [让你的用户等待更短。](#make-your-users-wait-less)
7. [不要默认使用 LLM。](#dont-default-to-an-llm)

## 更快地处理令牌

**推理速度** 通常是人们谈论延迟时首先想到的（但你很快就会发现，它远非唯一的因素）。它指的是 LLM **处理 token 的实际速率**，通常以 TPM（tokens per minute，每分钟 token 数）或 TPS（tokens per second，每秒 token 数）来衡量。

影响推理速度的主要因素是 **模型规模**——更小的模型通常运行得更快（成本也更低），如果使用得当，甚至可以超越更大的模型。为了在使用更小模型的同时保持高质量的性能，你可以探索：

- 使用更长的， [更详细的提示](https://developers.openai.com/api/docs/guides/prompt-engineering#prompt-engineering),
- 添加（更多） [few-shot 示例](https://developers.openai.com/api/docs/guides/prompt-engineering#few-shot-learning)，或者
- [微调](https://developers.openai.com/api/docs/guides/model-optimization) / 蒸馏。

你也可以使用我们的 [**Predicted outputs**](https://developers.openai.com/api/docs/guides/predicted-outputs) 功能。Predicted outputs 让你在已知大部分输出内容（例如代码编辑任务）时显著降低生成延迟。通过向模型提供预测，LLM 可以更专注于实际的变化，而不是保持不变的内容。



影响推理速度的其他因素包括你拥有的 
  **算力** 以及你采用的任何额外的 
  **推理优化** 方式。 
 

  大多数情况下你无法直接影响这些因素，但如果你对此感兴趣，并且
  能够掌控你的基础设施， **更快的硬件** 或 
  **在较低饱和度下运行引擎** 可能会带来适度的
  TPM 提升。如果你正在进行更深入的优化，还有许多其他 
  [推理优化](https://lilianweng.github.io/posts/2023-01-10-inference-optimization/) 
  方法，这些就略微超出本指南的范围了。



## 生成更少的 token

使用 LLM 时，生成 token 几乎总是延迟最高的步骤：作为一个通用的经验法则， **削减 50% 的输出 token 可能将延迟降低约 50%**。减少输出大小的方式取决于输出类型：

如果生成的是 **自然语言**, **让模型更简洁** （例如“控制在 20 字以内”或“简洁一些”）可能会有所帮助。你也可以使用少样本示例和/或微调来让模型生成更短的回复。

如果生成的是 **结构化输出**，尝试 **尽可能精简输出语法** ：缩短函数名、省略命名参数、合并参数等。

最后，虽然并不常见，但你也可以使用 `max_tokens` 或 `stop_tokens` 提前结束生成。

请始终记住：减少一个输出 token，就省下了一（毫）秒！

## 使用更少的输入 token

虽然减少输入 token 的数量确实会降低延迟，但这通常并不是一个显著因素——**将 prompt 削减 50% 可能只带来 1–5% 的延迟改善**。除非你处理的是真正庞大的上下文规模（文档、图像），否则你可能想把精力花在其他地方。

话虽如此，如果你 _正在_ 处理庞大的上下文（或者你决心榨取每一丝性能 _，并且_ 已经用尽了所有其他方案），可以使用以下技巧来减少输入 token：

- **对模型进行微调**，以替代冗长的指令 / 示例的需求。
- **过滤上下文输入**，例如裁剪 RAG 结果、清理 HTML 等。
- **最大化共享提示前缀**，将动态部分（例如 RAG 结果和对话历史）放在提示的靠后位置。这样可以让你的请求对 [KV 缓存](https://medium.com/@joaolages/kv-caching-explained-276520203249)-更友好（大多数 LLM 提供商都采用这种方式），并且意味着每次请求处理的输入 token 会更少。

查看我们的文档，详细了解 [prompt
  caching](https://developers.openai.com/api/docs/guides/prompt-engineering#save-on-cost-and-latency-with-prompt-caching)
  的工作原理。

## 减少请求次数

每次发起请求时，你都会产生一定的往返延迟——这种延迟会逐渐累积。

如果要让 LLM 按顺序执行多个步骤，与其每个步骤单独发起一次请求，不如考虑 **将它们合并到一个提示中，并在同一次响应中获取全部结果**。这样既能避免额外的往返延迟，还可能降低处理多个响应时的复杂度。

一种可行的做法是：在合并后的提示中用枚举列表列出各个步骤，然后要求模型在一个 JSON 对象中以具名字段返回结果。这样你就可以解析并引用每一个结果。

## 并行化

在使用 LLM 执行多个步骤时，并行处理可能非常强大。

如果这些步骤 **正在 _并非_ 严格的顺序执行**，你可以 **将它们拆分为并行的调用**。两件衣服的晾干时间与一件相同。

如果这些步骤 **_正在_ 严格的顺序执行**，不过，你可能仍然可以 **利用推测执行**。这种方式在分类步骤中尤为有效，因为在这些场景中，某种结果往往比其他结果更可能出现（例如内容审核）。

1. 同时启动步骤 1 和步骤 2（例如，输入审核与故事生成）
2. 验证步骤 1 的结果
3. 如果结果不符合预期，则取消步骤 2（必要时重试）

如果第 1 步的猜测正确，那么实际上可以在零额外延迟的情况下运行它！

## 让你的用户少等待

“被动等待”与 **主动** ，并且 **观察进展发生”之间存在巨大差异**——请确保你的用户获得的是后者体验。以下是一些技巧：

- **Streaming**：这是最有效的做法，它可以将 _等待_ 时间缩短到一秒甚至更短。（如果每次响应完成之前什么都看不到，ChatGPT 的体验会大不相同。）
- **Chunking**：如果你的输出在展示给用户之前还需要进一步处理（例如审核、翻译），可以考虑 **分块处理** ，而不是一次性全部处理。具体做法是先流式传输到后端，处理后再将分块结果发送到前端。
- **Show your steps**：如果你需要执行多个步骤或使用工具，请把这些过程展示给用户。你能展示的真实进度越多，体验就越好。
- **Loading states**：加载动画和进度条非常有用。

注意，虽然 **展示步骤 & 显示加载状态** 大多只是
心理作用， **流式传输 & 分块** 确实能在考虑应用 + 用户系统后降低整体
延迟：用户会更快地读完回复
。

## 不要默认使用 LLM

语言模型功能强大且用途广泛，因此有时会被用于本应由 **更快的经典方法** 处理的场景。识别这些场景可以显著降低你的延迟。可以参考以下示例：

- **硬编码：** 如果你的 **输出** 高度受限，可能并不需要使用 LLM 来生成。操作确认、拒绝消息以及标准输入请求都非常适合硬编码。（你甚至可以使用老办法，为每种情况准备几种变体。）
- **预计算：** 如果你的 **输入** 受到限制（例如类别选择）时，你可以提前生成多个回复，并确保不会向同一用户重复展示相同的回复。
- **借助 UI：** 汇总的指标、报告或搜索结果有时更适合通过经典的定制 UI 组件来呈现，而不是由 LLM 生成的文本。
- **传统优化技术：** LLM 应用本质上仍然是应用程序；二分查找、缓存、哈希表以及运行时复杂度在语言模型时代依然 _非常_ 有用。

## 示例

现在让我们来看一个示例应用，找出潜在的延迟优化点，并提出一些改进方案！

我们将分析一个受真实生产应用启发的假设性客服机器人的架构和提示词。 [架构和提示词](#architecture-and-prompts) 部分做了铺垫，而 [分析与优化](#analysis-and-optimizations) 部分将带你走完延迟优化的整个过程。

你会注意到，这个示例并没有覆盖每一条原则，就像
  真实场景中的用例也并非每种技术都要用到。

### 架构与提示词

下图展示了 **一个假设的** 客户服务机器人 **的初始架构**。我们将对其做出修改。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-0.png)

从整体上看，图中流程描述了以下过程：

1. 用户在持续进行的对话中发送一条消息。
2. 最后一条消息被转换为 **一个独立的查询** （参见 prompt 中的示例）。
3. 我们判断是否需要 **额外的（检索到的）信息来回答该查询** 以响应该查询。
4. **执行检索** ，并生成搜索结果。
5. 助手 **依据** 用户的查询和搜索结果进行推理，并 **生成响应**.
6. 响应被发送回用户。

下面是示意图各部分使用的提示。虽然它们仍然是假设性的简化示例，但它们的结构和措辞与你在生产应用中看到的相同。

你在图中看到类似“**[user input here]**”这样的占位符的地方，表示
  动态内容，这些内容会在运行时被实际数据替换。



#### 查询上下文提示词



Re-writes user query to be a self-contained search query.

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







#### 检索检查提示词


判断查询是否需要执行检索才能进行响应。

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







#### 助手提示词


填充 JSON 的各个字段，按照预定义的步骤进行推理，基于用户对话和相关的检索信息生成最终响应。

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

从架构上看，最先引人注意的是 **连续的 GPT-4 调用** ——这暗示着一种潜在的低效，往往可以通过单次调用或并行调用来替代。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-2.png)

在这种情况下，由于检索检查需要经过上下文处理的查询，我们 **将它们合并为单个提示** 以 [减少请求次数](#make-fewer-requests).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-3.png)



##### 组合查询上下文化与检索检查提示



**有什么变化？** 之前，我们使用一个 prompt 来重写查询，再使用另一个 prompt 来判断是否需要进行检索查找。现在，这个合并后的 prompt 同时完成这两项任务。具体来说，请注意 prompt 第一行更新后的指令，以及更新后的输出 JSON：

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







实际上，添加上下文和判断是否需要检索都是直接且定义明确的任务，因此我们可以使用一个 **更小的、微调过的模型** 来替代。切换到 GPT-3.5 将让我们 [更快地处理 token](#process-tokens-faster).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-4.png)

#### 第 2 部分：分析助手提示词

现在让我们把注意力转向 Assistant 提示。看起来在填写 JSON 字段时发生了许多不同的步骤——这可能表明存在一个机会来 [并行化](#parallelize).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-5.png)

不过，假设我们已经运行了一些测试，并发现拆分 JSON 中的推理步骤会产生更糟糕的响应，因此我们需要探索不同的解决方案。

**我们能否使用经过微调的 GPT-3.5 来代替 GPT-4？** 也许可以——但一般来说，助手的开放式响应最好留给 GPT-4 处理，这样它才能更好地应对更广泛的情况。话虽如此，单独看这些推理步骤本身，它们可能并不全都需要 GPT-4 级别的推理能力才能生成。它们范围明确且有限，因此是 **进行微调的良好候选对象**.

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


这带来了一种权衡的可能性。我们是将此保留为 **完全由 GPT-4 生成的单个请求**，还是 **拆分成两个顺序请求** ，并对除最终响应之外的所有内容使用 GPT-3.5？我们面临相互冲突的原则：第一种方案让我们能够 [减少请求次数](#make-fewer-requests)，但第二种方案可能让我们能够 [更快地处理 token](#process-tokens-faster).

与许多优化权衡一样，答案将取决于具体情况。例如：

- 中各类字段所占的 token 比例 `response` 与其他字段的对比。
- 由于处理大多数字段的速度更快，平均延迟有所下降。
- 平均延迟 _增加_ 是因为执行两次请求而不是一次。

结论会因情况而异，最佳的判断方式是使用生产示例进行测试。在这个示例中，我们假设测试结果表明将提示拆分为两部分是有利的，以便 [更快地处理 token](#process-tokens-faster).

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-6.png)

**注意：** 我们会将这些内容 `response` ，并且 `enough_information_in_context` 一起在第二个 prompt 中处理，以避免将检索到的上下文同时传递给两个新的 prompt。



##### Assistants 提示 - 推理



此提示将传递给 GPT-3.5，并可在精选示例上进行微调。

**有什么变化？** enough_information_in_context 和 response 字段已移除，检索结果也不再加载到此提示中。

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






##### Assistants prompt - response



此提示将由 GPT-4 处理，并接收在前面的提示中确定的推理步骤以及检索返回的结果。

**有什么变化？** 除 "enough_information_in_context" 和 "response" 外，所有步骤均已移除。此外，我们之前作为输出填充的 JSON 将被传入此提示。

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








事实上，既然推理提示不再依赖于检索到的上下文，我们可以 [并行化](#parallelize) 并将其与检索提示同时发出。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-6b.png)

#### 第 3 部分：优化结构化输出

让我们再来看一下推理提示。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-7b.png)

仔细观察推理 JSON，你可能会注意到字段名本身相当长。

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


通过让它们更短并把解释移到注释中，我们可以 [生成更少的 token](#generate-fewer-tokens).

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

这一小幅改动减少了 19 个输出 token。对于 GPT-3.5，这可能只会带来几毫秒的性能提升；而对于 GPT-4，则可能节省长达一秒。

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/token-counts-latency-customer-service-large.png)

不过，你可以想象一下，这会对较长的模型输出产生多么显著的影响。

我们还可以进一步使用单个字符作为 JSON 字段名，或将所有内容放在数组中，但这样做可能开始影响响应质量。归根结底，判断最佳方案的方法仍然是测试。

#### 示例总结

让我们回顾一下为客服机器人示例所做的优化：

![Assistants 对象架构图](https://cdn.openai.com/API/docs/images/diagram-latency-customer-service-11b.png)

1. **合并** 查询上下文构建与检索校验步骤，以 [减少请求次数](#make-fewer-requests).
2. 对于新的提示， **切换到更小、经过微调的 GPT-3.5** 以 [更快地处理 token](#process-tokens-faster).
3. 将助手提示一分为二， **对推理部分同样切换到更小、经过微调的 GPT-3.5** 以再次 [更快地处理 token](#process-tokens-faster).
4. [并行化](#parallelize) 检索校验与推理步骤。
5. **缩短推理字段名称** 并将注释移入提示中，以 [减少生成的 token](#generate-fewer-tokens).