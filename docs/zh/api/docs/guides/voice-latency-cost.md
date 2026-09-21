# 成本优化

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

选择你的 API，了解如何计量使用量并找到管理方法
语音应用的成本。



## GPT-Live 使用与费用

GPT-Live 将语音对话与负责推理和运行工具的后端分离开来。请分别估算这两部分成本：语音会话的成本取决于时长，而后端成本则取决于所使用的模型和工具。
由于语音会话的成本取决于时长，而后端成本取决于所使用的模型和工具，
因此这两部分成本需要分别估算。

### 语音会话费用

GPT-Live 语音会话按当前 [模型费率](https://developers.openai.com/api/docs/models/gpt-live-1)。按秒计费。会话时长不会向上取整到下一整分钟。

活跃会话时间包括用户说话、助手说话、双方都静默，
以及后端处理的时间。

进行估算时，从开始到结束计算活跃会话时长。请使用
API 返回的时长，而不是仅统计你播放音频的时间。静音
麦克风输入不会结束会话。当对话结束时，
关闭会话并收集其最终使用情况。

请参阅 [API 定价](https://developers.openai.com/api/docs/pricing) 了解后端模型和工具的价格。

### WebRTC 初始化费用

一个 `POST /v1/live/sessions` 创建 WebRTC 会话的请求会在会话初始化期间计费 15 秒的语音时长。该时长会在会话开始运行后抵扣持续时长费用。在估算运行中会话的费用时，不要再额外加上这 15 秒。

例如，下方 90 秒的会话已经包含了初始化时计费的 15 秒，不会按 105 秒计费。在评估重连或在用户准备好说话之前就创建会话的应用时，请将会话创建费用纳入考量。

### 后端成本

后端调用的计费与语音会话分开，这与不含语音的
应用相同。包含模型输入和输出 token，在支持的情况下还包括缓存的输入
token，以及任何适用的图像或工具费用。如果你的应用
调用了其他服务，也请将它们的成本计入你的估算中。

你可以将这部分工作与语音前端分开优化。参考通用
[成本优化指南](https://developers.openai.com/api/docs/guides/cost-optimization) 以减少请求
和 token 使用量。使用 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) （针对符合条件的
后端模型），做法是将可复用的指令、工具定义以及其他
稳定的内容放在 prompt 的开头。

后端的选择也会改变对话的长度。当优化让用户等待更久，或者改变了
助手完成任务的方式时，比较其综合成本
是否仍可接受。

### 估算对话成本

针对包含一个语音会话的对话：

**总费用 =（可计费语音秒数 ÷ 60 × 每分钟语音费率）+ 后端费用**

例如，假设语音费率为每分钟 $0.05，那么一个 90 秒的语音会话费用为 $0.075。如果后端模型和工具费用合计为 $0.02，则该对话的总费用为 $0.095：

| 组件              | 计算方式                | 费用       |
| ---------------------- | -------------------------- | ---------- |
| 语音会话          | 90 秒 ÷ 60 × $0.05    | $0.075     |
| 后端工作           | 模型与工具费用合计 | $0.02      |
| **会话总计** | **$0.075 + $0.02**         | **$0.095** |

上述费用和后端成本仅为示例；请使用当前的语音费率、你所测量的后端用量，以及
适用的模型和工具费率。如果任务跨越多个语音会话，请将
各会话的时长相加，并计入会话之间进行的后端工作。

### 优化策略

专注于帮助用户完成任务，减少不必要的对话
和等待。保持任务所需的确认与检查。

#### 在会话之前提供相关的上下文

在开始语音会话之前，收集你的应用已被授权使用的信息。例如，
帮助处理订单的助手可以从订单号和当前状态开始，这样用户无需
重复提供这些信息，也无需等待另一次查询。
重复它们或等待另一次查找。

保持这些上下文与任务相关且保持最新。为语音模型提供
对话所需的信息；将详细记录和工作流保留在后端。详见
会话配置 [session configuration](https://developers.openai.com/api/docs/guides/live-conversations#session-configuration)
和 [delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).

#### 减少等待工具所花费的时间

更短的等待时间可以提升用户体验并降低语音会话的成本。
例如，假设你的后端使用了 `gpt-5.6-luna` 搭配
[快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 并以
并行方式运行独立的工具调用。如果这些优化能帮助用户提前一分钟结束语音
会话，你就可以节省 0.05 美元的语音费用。如果额外的后端成本低于这笔节省，
总成本就会下降。

你还可以在 [委托事件到达前基于转录片段启动投机性查询](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments)
委托事件到达之前开始一项投机性查询。请将未使用的投机性工作纳入你的
后端成本测算中。

请参阅 [降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency)
方面的模型、连接、流式传输和工具优化。使用
验证有效的口语响应时间和任务成功情况，使用 [语音智能体评估](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).

#### 在长时间任务期间关闭会话

语音前端和你应用管理的后端可以独立运行。
使用客户端委托时，你的后端工作进程可以在语音会话打开或关闭期间持续运行。在关闭语音会话之前保存任务状态和对话上下文，
会话处于打开或关闭状态时都可保持运行。请在关闭语音会话前保存任务状态与对话上下文，
[关闭语音会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close).

关于闲置超时、重启触发条件以及上下文恢复 工作流，请参阅 [关闭闲置会话并恢复](https://developers.openai.com/api/docs/guides/live-conversations#close-idle-sessions-and-resume).

对于一个常驻 智能体，在后端处理长时间运行任务（例如以目标模式进行编码）时关闭语音会话。可提供一个标有
"恢复对话" 按钮，长时间运行任务（例如以目标模式进行编码）时关闭语音会话。可提供一个标有
**Resume conversation** 的按钮，以便在用户返回时开启新的语音会话；也可以使用后端完成事件来启动新会话并通知用户结果已就绪，
以在用户返回时启动新的语音会话，或者使用后端完成事件来开启新会话并通知用户结果已准备就绪，
。

通过使用已保存的上下文和经验证的任务结果开启新会话来恢复对话，
并通过新的 WebSocket 连接发送此启动事件 `input`。例如，通过新的 WebSocket 连接发送此启动事件
[新的 WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live):

```json
{
  "type": "session.start",
  "session": {
    "model": "gpt-live-1",
    "instructions": "Help the user review completed work and delegate follow-up tasks.",
    "input": [
      {
        "type": "message",
        "role": "developer",
        "content": [
          {
            "type": "input_text",
            "text": "Saved task: add CSV export. Result: code is ready for review."
          }
        ]
      }
    ],
    "delegation": { "type": "client" }
  }
}
```

等待 `session.started` 后再开始流式传输音频。请参阅
[使用先前对话为会话设定种子](https://developers.openai.com/api/docs/guides/live-conversations#seed-a-session-with-prior-conversation)
以了解支持的历史记录格式。

如果较早的会话已使用 `store: true`，存储，你还可以 [分叉该会话](https://developers.openai.com/api/docs/guides/live-conversations#store-and-fork-a-session)。无论使用哪种方式，请将已验证的后端任务状态保存在你的应用中。

关闭每分钟空闲语音时间可节省 $0.05；将该节省与
重连成本以及对用户体验的中断进行比较。

#### 选择合适的后端模型

从满足任务准确性和可靠性要求的模型开始。
然后比较总对话成本，包括语音时长、模型使用、
工具调用和重试。请参考 [模型选择指南](https://developers.openai.com/api/docs/guides/model-selection)
了解如何权衡这些取舍。

更大的后端模型如果能更快地完成任务，且语音会话节省的费用超过其额外的 token 成本，整体成本反而可能更低。
更便宜的模型如果耗时更长、重复工具调用或无法完成任务，整体成本反而可能更高。
更便宜的模型如果耗时更长、重复工具调用或未能
完成任务。

比较每次成功任务的总成本，以及完成率和完成时间。在总成本中纳入失败尝试和重试，以免更便宜的配置因为完成的工作更少而显得更好。在规划对比时，请使用 [voice 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 进行规划对比。

### 监控实际使用情况

为每个会话分别记录语音时长和后端使用情况。GPT-Live
以秒为单位报告累计语音时长：

```json
{
  "type": "session.usage.updated",
  "event_id": "event_usage_1",
  "usage": { "seconds": 12 },
  "context_window": { "usage_ratio": 0.42 }
}
```

每次更新都会替换之前的时长快照。请勿对这些快照进行累加。
发送完成后 `session.close`，持续接收事件直到 `session.closed` 和
记录其最终的 `usage.seconds` 一次。请按照
[优雅关闭流程](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close)
进行操作，以便你的应用在断开连接前收集最终的使用情况。

对于 Responses 委托，请阅读后端响应的 `usage` 来自嵌套
`response.completed` 通过交付的事件 `response.event`。每次计
算后端响应时，使用其响应 ID，并保留应用该模型费率所需的输入、输出和
缓存 token 详细信息。对于后端工作，你的
application 独立运行，也需要从这些请求中收集使用情况。

在具有代表性的对话中比较估算总量与实际总量。
将仅用于评估的模型调用与 application 的使用情况分开，并将成本与任务成功情况一起审视。
一起审视。

  

  


## Realtime API 费用

本文档介绍 Realtime API 计费方式，并提供成本优化策略。语音智能体 会话会在文本、音频和图像模态上累计输入和输出 token。流式翻译和流式转录会话按音频时长计费。价格因模型而异，价格列在模型页面中（例如， [`gpt-realtime-2`](https://developers.openai.com/api/docs/models/gpt-realtime-2), [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate), [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper)，以及 [`gpt-realtime`](https://developers.openai.com/api/docs/models/gpt-realtime)).

对话式 Realtime API 会话由一系列 _轮次_，组成，其中用户添加输入以触发一次 _Response_ 来生成模型输出。服务端维护一个 _Conversation_，它是一个由 _Items_ 组成的列表，这些 Items 构成下一轮输入。当返回 Response 时，其输出会自动添加到 Conversation 中。

翻译和转录会话使用不同的流式架构。客户端持续流式传输音频，并在源音频到达时接收翻译后的音频、转录增量或转录事件。这些会话不使用常规的 Response 生命周期，因此请使用其基于时长的费率来估算和监控，而不是按 Response 的 token 使用量。

## 每次响应的成本

每次创建 Response 时会产生 Realtime API 费用，并根据输入和输出 token 数量计费（输入转录费用除外，见下文）。目前不收取网络带宽或连接费用。Response 可以手动创建，也可以在开启语音活动检测（VAD）时自动创建。VAD 会有效过滤掉空的输入音频，因此空音频不会计入输入 token，除非客户端手动将其添加为对话输入。

每次 Response 时，整个对话都会发送给模型。某一轮的输出会作为 Items 添加到服务端的 Conversation 中，并成为后续轮次的输入，因此会话中靠后的轮次费用会更高。

可以使用我们的 [tokenization 工具](https://platform.openai.com/tokenizer)。来估算文本 token 的费用。用户消息中的音频 token 按每 100 ms 音频 1 个 token 计算，而助手消息中的音频 token 按每 50 ms 音频 1 个 token 计算。请注意，token 计数包含消息内容之外的一些特殊 token，这会导致计数出现小幅波动，例如一条内容为 10 个文本 token 的用户消息实际可能计为 12 个 token。

### 示例

下面是一个简单的示例，演示在多轮 Realtime API 会话中的 token 成本。

在对话的第一轮中，我们添加了 100 个 token 的指令，以及一条包含 20 个音频 token 的用户消息（例如由基于用户语音的 VAD 添加），输入 token 总计为 120 个。创建一个 Response 会生成一条助手输出消息（20 个音频 token、10 个文本 token）。

然后我们创建第二轮，并附带另一条用户音频消息。第二轮的 token 会是什么样的？此时的会话包含初始指令、第一条用户消息、来自第一轮的助手输出消息，再加上第二条用户消息（25 个音频 token）。这一轮的输入将包含 110 个文本 token 和 64 个音频 token，再加上另一条助手输出消息的输出 token。

![连续多轮对话中的 token](https://cdn.openai.com/API/docs/images/realtime-costs-turns.png)

第一轮的消息在第二轮中很可能会被缓存，从而降低输入成本。有关缓存的更多信息，请参见下文。

Response 所使用的 token 可以从 `response.done` 事件中读取，其内容如下所示。

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

除了对话式 Responses 之外，如果启用了输入转录，Realtime API 也会对其进行计费。输入转录使用的模型与 speech2speech 模型不同，例如 [`whisper-1`](https://developers.openai.com/api/docs/models/whisper-1) 或 [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe)，因此按不同的费率计费。当音频被写入输入音频缓冲区然后被提交（手动提交或通过 VAD 提交）时，会执行转录。

输入转录的 token 数量可以从 `conversation.item.input_audio_transcription.completed` 事件中读取，如下例所示。

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

## Caching

Realtime API 支持 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)，该功能会自动启用，并能在多轮会话中显著降低输入 token 的成本。当某个 Response 的输入 token 与先前 Response 的 token 相匹配时，缓存机制即会生效，但该机制属于尽力而为，不保证一定命中。

提高缓存命中率的最优策略是保持会话历史的稳定性。删除或修改会话中的内容会“破坏”自变更点起的缓存——输入与之前的匹配度会下降。请注意，指令和工具定义位于会话开头，因此若在会话中途修改它们，会降低后续轮次的缓存命中率。

## 截断

当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着消息（从最早的消息开始）会从 Response 输入中被丢弃。一个 32k 上下文模型，如果最大输出 token 为 4,096，那么在发生截断之前，上下文只能包含 28,224 个 token。

客户端可以将 token 窗口设置得比模型的最大值更小，这是控制 token 使用和成本的好方法。这可以通过以下参数进行控制 `token_limits.post_instructions` 配置（如果你像下面这样使用 `retention_ratio` 类型配置截断）。顾名思义，这会控制一个 Response 的最大输入 token 数，但不包括指令 token。将 `post_instructions` 设置为 1,000 意味着超过 1,000 输入 token 上限的内容不会被发送给模型以生成 Response。

截断会破坏对话开始附近的缓存，并且如果在每一轮都发生截断，那么缓存命中率将会非常低。为了缓解这个问题，客户端可以配置截断以丢弃比必要数量更多的消息，这将在下一次需要截断之前扩大余量。这可以通过以下设置进行控制 `session.truncation.retention_ratio` 设置。服务端默认值为 `1.0` ，这意味着截断将仅移除必要的条目。如果将值设置为 `0.8` ，则意味着截断后会保留最大值的 80%，并额外丢弃 20%。

如果你希望降低 Realtime API 每个会话的成本（针对特定模型），我们建议限制最大 token 数量，并将 `retention_ratio` 设置为小于 1，如下面的示例所示。请注意，这可能在降低成本的同时降低模型在特定轮次中的记忆能力。

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

截断也可以被完全禁用，如下所示。禁用后，如果 Conversation 过长而无法创建 Response，将返回错误。如果你打算手动管理 Conversation 大小，这可能会很有用。

```json
{
  "event": "session.update",
  "session": {
    "truncation": "disabled"
  }
}
```

## 其他优化策略

### 使用小型模型

Realtime speech2speech 模型分为“普通”版本和 mini 版本，后者价格显著更低。这里的取舍通常在于与指令遵循和函数调用相关的智能水平，mini 模型在这方面效果较差。我们建议先用更大的模型测试应用，完善应用和提示词，然后尝试使用 mini 模型进行优化。

### 编辑对话

虽然服务端会自动进行截断，但另一种成本管理策略是手动编辑会话。API 的一条原则是允许客户端完全控制服务端 会话，使客户端可以随意添加和删除条目。

```json
{
  "type": "conversation.item.delete",
  "item_id": "item_CCXLecNJVIVR2HUy3ABLj"
}
```

清理旧消息是减小输入令牌数量和降低成本的好方法。这可能会移除重要内容，但一种常见策略是用摘要替换这些旧消息。会话中的条目可以通过如下方式删除： `conversation.item.delete` 如上所述的消息，也可以通过如下方式添加： `conversation.item.create` 消息。

## 估算成本

鉴于 Realtime API 的 token 计费较为复杂，很难提前估算成本。一个较好的方法是使用 Realtime Playground 配合你打算使用的提示和函数，并在一次示例会话中测量 token 用量。在 Realtime Playground 的 Logs 标签页中，可以查看某个会话的 token 用量，位置与会话 ID 相邻。

![在 Playground 中查看 token 用量](https://cdn.openai.com/API/docs/images/realtime-playground-tokens.png)