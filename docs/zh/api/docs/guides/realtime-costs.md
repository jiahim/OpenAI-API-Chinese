# 管理成本

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

本文档介绍实时API计费方式，并提供优化成本的策略。语音智能体会话会跨文本、音频和图像模态累积输入和输出 token。流式翻译和流式转录会话按音频时长计费。不同模型的价格不同，价格列在模型页面上（例如， [`gpt-realtime-2`](https://developers.openai.com/api/docs/models/gpt-realtime-2), [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate), [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper)，以及 [`gpt-realtime`](https://developers.openai.com/api/docs/models/gpt-realtime)).

对话式实时API会话是一系列 _轮次_，其中用户添加输入以触发 _响应_ 来生成模型输出。服务器维护一个 _对话_，它是一个 _项目_ 列表，构成下一轮的输入。当返回响应时，输出会自动添加到对话中。

翻译和转录会话使用不同的流式架构。客户端持续流式传输音频，并在源音频到达时接收翻译后的音频、转录增量或转录事件。这些会话不使用正常的响应生命周期，因此请使用基于时长的费率而非每个响应的 token 使用量来估算和监控它们。

## 单次响应费用

当创建 Response 时，Realtime API 的费用即开始产生，并根据输入和输出 token 的数量计费（输入转录费用除外，见下文）。目前网络带宽或连接不产生费用。如果开启了语音活动检测（VAD），可以手动或自动创建 Response。VAD 将有效过滤掉空的输入音频，因此空的音频不计入输入 token，除非客户端手动将其作为对话输入添加。

整个对话会在每次生成 Response 时发送给模型。一轮的输出将作为 Item 添加到服务端 Conversation 中，并成为后续轮次的输入，因此会话中较晚的轮次成本会更高。

文本 token 成本可以使用我们的 [分词工具](https://platform.openai.com/tokenizer)。进行估算。用户消息中的音频 token 为每 100 毫秒音频 1 个 token，而助手消息中的音频 token 为每 50 毫秒音频 1 个 token。请注意，token 计数包括消息内容之外的特殊 token，这会导致计数出现微小差异，例如，包含 10 个文本 token 内容的用户消息可能会计为 12 个 token。

### 示例

下面是一个简单示例，用于说明多轮 Realtime API 会话中的令牌成本。

对于对话的第一轮，我们添加了 100 个令牌的指令、一条 20 个音频令牌的用户消息（例如由 VAD 根据用户说话添加），总计 120 个输入令牌。创建响应会生成一条助手输出消息（20 个音频令牌、10 个文本令牌）。

然后我们创建第二轮，包含另一条用户音频消息。第二轮的令牌情况如何？此时对话包含初始指令、第一条用户消息、第一轮的助手输出消息，以及第二条用户消息（25 个音频令牌）。这一轮将有 110 个文本令牌和 64 个音频令牌作为输入，加上另一条助手输出消息的输出令牌。

![连续对话轮次中的令牌](https://cdn.openai.com/API/docs/images/realtime-costs-turns.png)

第一轮的消息在第二轮中很可能被缓存，从而降低输入成本。有关缓存的更多信息，请参阅下文。

响应的令牌用量可从 `response.done` 事件中读取，如下所示。

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

除了对话式响应之外，Realtime API 还会对输入转录（如果启用）进行计费。输入转录使用的模型与语音到语音模型不同，例如 [`whisper-1`](https://developers.openai.com/api/docs/models/whisper-1) 或 [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe)，因此按照不同的费率表计费。当音频写入输入音频缓冲区并提交（无论是手动还是通过 VAD）时，会执行转录。

输入转录的令牌数可以从 `conversation.item.input_audio_transcription.completed` 事件中读取，如下例所示。

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

Realtime API 支持 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)，该功能自动启用，可显著降低多轮会话中输入令牌的成本。当某个响应的输入令牌与先前响应的令牌匹配时，缓存即生效，但此过程为尽力而为，不保证一定发生。

最大化缓存命中率的最佳策略是保持会话历史的静态不变。移除或更改对话中的内容会“破坏”缓存，直至更改点——输入不再像之前那样匹配。请注意，指令和工具定义位于对话的开头，因此在会话中途更改这些内容会降低后续轮次的缓存命中率。

## 截断

当对话中的 token 数量超过模型的输入 token 限制时，对话将被截断，这意味着消息（从最旧的开始）将从 Response 输入中移除。一个具有 4,096 最大输出 token 的 32k 上下文模型，在发生截断之前只能包含 28,224 个上下文 token。

客户端可以设置比模型最大 token 窗口更小的窗口，这是控制 token 使用量和成本的好方法。这通过 `token_limits.post_instructions` 配置来控制（如果你使用 `retention_ratio` 类型配置截断，如下所示）。如名称所示，这控制了 Response 的最大输入 token 数量，指令 token 除外。将 `post_instructions` 设置为 1,000 意味着超过 1,000 输入 token 限制的项目将不会被发送到模型以生成 Response。

截断会破坏对话开头附近的缓存，如果每一轮都发生截断，那么缓存命中率会非常低。为了缓解这个问题，客户端可以配置截断以移除比必要更多的消息，这将延长到下一次截断发生前的余量。这可以通过 `session.truncation.retention_ratio` 设置来控制。服务器默认为 `1.0` ，这意味着截断将仅移除必要的项目。值为 `0.8` 表示截断将保留最大值的 80%，额外移除 20%。

如果你试图降低每次会话的 Realtime API 成本（针对特定模型），我们建议减少 token 数量并设置 `retention_ratio` 小于 1，如以下示例所示。请记住，这里可能存在权衡：成本更低，但特定轮次的模型记忆能力也会降低。

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

截断也可以完全禁用，如下所示。当禁用时，如果对话过长而无法创建 Response，将返回错误。如果你打算手动管理对话大小，这可能会很有用。

```json
{
  "event": "session.update",
  "session": {
    "truncation": "disabled"
  }
}
```

## 其他优化策略

### 使用迷你模型

Realtime 语音到语音模型提供“标准”尺寸和 mini 尺寸，后者成本显著更低。其权衡通常在于与指令遵循和函数调用相关的智能表现，在 mini 模型中效果会不如标准模型。我们建议先使用较大模型测试应用，优化应用和提示词，然后尝试使用 mini 模型进行优化。

### 编辑对话

虽然截断会在服务端自动发生，但另一种成本管理策略是手动编辑对话。API的一个原则是允许客户端完全控制服务端对话，允许客户端随意添加和移除项目。

```json
{
  "type": "conversation.item.delete",
  "item_id": "item_CCXLecNJVIVR2HUy3ABLj"
}
```

清理旧消息是减少输入令牌大小和成本的好方法。这可能会移除重要内容，但常见策略是用摘要替换这些旧消息。项目可通过 `conversation.item.delete` 从对话中删除，如上所述，并且可以通过 `conversation.item.create` 添加项目。

## 估算成本

鉴于 Realtime API 令牌使用的复杂性，提前估算成本可能比较困难。一个较好的方法是使用 Realtime Playground 配合你预期的提示和函数，并在示例会话中测量令牌使用情况。会话的令牌使用情况可以在 Realtime Playground 的日志选项卡中，通过会话 ID 旁找到。

![在 Playground 中显示令牌](https://cdn.openai.com/API/docs/images/realtime-playground-tokens.png)