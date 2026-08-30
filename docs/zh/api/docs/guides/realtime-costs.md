# 管理成本

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

本文档介绍 Realtime API 的计费方式，并提供成本优化策略。语音智能体 会话会在文本、音频和图像模态上累计输入和输出 token。流式翻译和流式转录会话按音频时长计费。不同模型价格不同，价格列在各模型页面上（例如， [`gpt-realtime-2`](https://developers.openai.com/api/docs/models/gpt-realtime-2), [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate), [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper)，和 [`gpt-realtime`](https://developers.openai.com/api/docs/models/gpt-realtime)).

对话式 Realtime API 会话是一系列 _轮次_，用户在其中添加输入以触发一次 _响应_ 以生成模型输出。服务端维护一个 _对话_，它是构成下一轮输入的 _条目_ 列表。当响应返回时，其输出会自动添加到对话中。

翻译和转录会话采用不同的流式架构。客户端持续流式传输音频，并在源音频到达时接收翻译后的音频、转录增量或转录事件。这些会话不使用常规的响应生命周期，因此请按基于时长的费率估算和监控它们，而不是按每次响应的 token 使用量。

## 每次响应成本

Realtime API 费用在创建 Response 时产生，并按输入和输出 token 数量计费（输入转录费用除外，详见下文）。目前不收取网络带宽或连接费用。Response 可以手动创建，也可以在开启语音活动检测（VAD）时自动创建。VAD 会有效过滤掉空白的输入音频，因此空白音频不会计入输入 token，除非客户端手动将其作为对话输入添加。

整个对话会在每个 Response 中发送给模型。一个轮次的输出将作为 Items 添加到服务端对话中，并成为后续轮次的输入，因此会话中靠后的轮次费用会更高。

文本 token 费用可以使用我们的 [分词工具](https://platform.openai.com/tokenizer)。进行估算。用户消息中的音频 token 按每 100 ms 音频 1 个 token 计算，而助手消息中的音频 token 按每 50 ms 音频 1 个 token 计算。请注意，token 计数除消息内容外还包含特殊 token，因此实际计数会有小幅差异，例如一条包含 10 个文本 token 内容的用户消息可能计为 12 个 token。

### 示例

下面用一个简单示例说明在多轮 Realtime API 会话中的 token 费用。

在对话的第一轮中，我们添加了 100 个 token 的指令，以及一条由用户产生的、包含 20 个音频 token 的用户消息（例如由基于用户语音的 VAD 添加），输入 token 共计 120 个。生成 Response 时会产生一条助手输出消息（20 个音频 token 和 10 个文本 token）。

然后我们用另一条用户音频消息创建第二轮。第二轮的 token 会是什么样？此时的对话包含初始指令、第一条用户消息、第一轮的助手输出消息，以及第二条用户消息（25 个音频 token）。这一轮的输入将包含 110 个文本 token 和 64 个音频 token，再加上另一条助手输出消息的输出 token。

![后续对话轮次的 token](https://cdn.openai.com/API/docs/images/realtime-costs-turns.png)

第一轮的消息有可能会被缓存用于第二轮，从而降低输入成本。更多关于缓存的信息请参见下文。

Response 使用的 token 可以从 `response.done` 事件中读取，其形式如下。

```json
{
  "type": "response.done",
  "response": {
    ...
    "usage": {
      "total_tokens": 253,
      "input_tokens": 132,
      "output_tokens": 121,
      "input_token_details": {
        "text_tokens": 119,
        "audio_tokens": 13,
        "image_tokens": 0,
        "cached_tokens": 64,
        "cached_tokens_details": {
          "text_tokens": 64,
          "audio_tokens": 0,
          "image_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 30,
        "audio_tokens": 91
      }
    }
  }
}
```

## 输入转录费用

除了对话型 Responses 之外，Realtime API 还会对输入转录（如果启用）计费。输入转录使用的模型不同于 speech2speech 模型，例如 [`whisper-1`](https://developers.openai.com/api/docs/models/whisper-1) 或 [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe)，因此按照不同的费率表计费。转录在音频写入输入音频缓冲区并随后被提交（手动提交或由 VAD 提交）时执行。

可以从以下事件中读取输入转录的 token 数 `conversation.item.input_audio_transcription.completed` 事件，如下例所示。

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  ...
  "transcript": "Hi, can you hear me?",
  "usage": {
    "type": "tokens",
    "total_tokens": 26,
    "input_tokens": 17,
    "input_token_details": {
      "text_tokens": 0,
      "audio_tokens": 17
    },
    "output_tokens": 9
  }
}
```

## 缓存

Realtime API 支持 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching)，该机制会自动生效，能够显著降低多轮会话中输入词元的成本。当某次 Response 的输入词元与此前 Response 的词元匹配时，缓存即会生效，不过这是尽力而为的行为，并不保证一定命中。

最大化缓存命中率的最优策略是保持会话历史不变。如果移除或修改会话中的内容，缓存会“失效”到发生变化的位置为止——输入与之前的匹配度会随之降低。请注意，指令和工具定义位于会话开头，因此在会话中途修改它们会降低后续轮次的缓存命中率。

## Truncation

当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，这意味着消息（从最早的开始）会从 Response 输入中丢弃。具有 32k 上下文且最大输出 token 为 4,096 的模型，在发生截断之前上下文中只能包含 28,224 个 token。

客户端可以设置一个比模型最大值更小的 token 窗口，这是控制 token 使用和成本的好方法。这通过 `token_limits.post_instructions` 配置（如果你使用下面的 `retention_ratio` 类型配置截断）。顾名思义，这控制了 Response 的最大输入 token 数，不包括指令 token。将 `post_instructions` 设置为 1,000 意味着超过 1,000 输入 token 上限的内容将不会被发送给模型用于 Response。

截断会在对话开始附近破坏缓存，如果每次轮询都发生截断，那么缓存命中率将会非常低。为了缓解这个问题，客户端可以配置截断以丢弃比必要更多的消息，这将延长在需要另一次截断之前的余量。这可以通过 `session.truncation.retention_ratio` 设置来控制。服务端默认值为 `1.0` ，意味着截断将仅移除必要的项。值为 `0.8` 表示截断将保留最大值的 80%，多丢弃 20%。

如果你试图降低 Realtime API 每个会话的成本（针对给定模型），我们建议减少 token 数量并设置一个 `retention_ratio` 小于 1，如下例所示。请记住，在降低成本和降低单轮模型记忆之间可能存在权衡。

```json
{
  "event": "session.update",
  "session": {
    "truncation": {
      "type": "retention_ratio",
      "retention_ratio": 0.8,
      "token_limits": {
        "post_instructions": 8000
      }
    }
  }
}
```

截断也可以被完全禁用，如下所示。禁用后，如果 Conversation 对于创建 Response 来说过长，将返回错误。如果你打算手动管理 Conversation 大小，这可能会很有用。

```json
{
  "event": "session.update",
  "session": {
    "truncation": "disabled"
  }
}
```

## 其他优化策略

### 使用 mini 模型

Realtime 语音转语音模型提供“标准”尺寸和 mini 尺寸两种版本，后者价格显著更低。这里的权衡通常在于与指令遵循和函数调用相关的智能程度，这在 mini 模型中效果较差。我们建议先用较大的模型测试应用，完善应用和提示词，然后再尝试使用 mini 模型进行优化。

### 编辑对话

虽然截断会在服务端自动发生，但另一种成本管理策略是手动编辑会话。API 的一个设计原则是允许客户端完全控制服务端会话，从而使客户端可以随意添加和移除条目。

```json
{
  "type": "conversation.item.delete",
  "item_id": "item_CCXLecNJVIVR2HUy3ABLj"
}
```

清理旧消息是减少输入 token 数量和成本的有效方法。这可能会移除重要内容，但一种常见策略是将这些旧消息替换为摘要。可以使用以下方式从会话中删除条目： `conversation.item.delete` 消息（如上所述），并可以通过以下方式添加条目： `conversation.item.create` 消息。

## 成本估算

由于 Realtime API 令牌使用情况较为复杂，可能难以提前估算成本。一个较好的做法是：在 Realtime Playground 中使用你预期的提示词和函数进行测试，并在一个示例会话中测量令牌使用量。某个会话的令牌使用情况可以在 Realtime Playground 的 Logs 选项卡中、位于会话 ID 旁边找到。

![在 Playground 中显示令牌](https://cdn.openai.com/API/docs/images/realtime-playground-tokens.png)