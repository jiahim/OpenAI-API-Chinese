# 成本优化

> 完整文档索引请参见 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 。

选择你的 API 以了解使用量的计量方式，并寻找管理语音应用成本的方法。
costs for your voice application.



## GPT-Live 使用与费用

GPT-Live 将语音对话与负责推理和
运行工具的后端分离。需要分别估算这两部分成本：语音会话的费用取决于
时长，而后端成本则取决于你所使用的模型和工具。

### 语音会话费用

GPT-Live 语音会话按当前 [模型费率](https://developers.openai.com/api/docs/models/gpt-live-1)。按秒计费。会话时长不会向上取整到下一整分钟。

主动会话时间包括用户说话、助手说话、双方都静默，
或后端正在处理的时间。

进行估算时，主动会话时间从开始一直计算到结束。使用 API 报告的
时长，而不是只计算你播放音频的时长。静音
麦克风输入不会关闭会话。当对话结束时，
请关闭会话并收集其最终用量。

请参阅 [API 价格](https://developers.openai.com/api/docs/pricing) 以了解后端模型和工具的价格。

### WebRTC 初始化费用

一个 `POST /v1/live/sessions` 创建 WebRTC 会话的请求会在会话初始化期间计入 15 秒语音时长。这部分费用在会话开始运行后抵扣时长费用。估算运行中会话的费用时，请勿再额外加上这 15 秒。

例如，下方 90 秒的会话已经包含了初始化时计费的 15 秒，并非按 105 秒计费。在评估重连或在用户准备好说话之前就创建会话的应用时，请将会话创建费用考虑在内。

### 后端成本

后端调用的计费与语音会话分开，与在
无语音的应用中相同。请把模型的输入和输出 token、在支持的情况下
的缓存输入，以及任何适用的图像或工具费用一并计入。如果你的应用
还调用了其他服务，也请将它们的成本纳入估算。

你可以将这部分工作与语音前端分开优化。可以参考通用的
[成本优化指南](https://developers.openai.com/api/docs/guides/cost-optimization) 来减少请求
和 token 用量。对符合条件的 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 后端模型，将可复用的
指令、工具定义以及其他稳定的内容放在 prompt 的开头，以利用
提示缓存。

后端选型也会影响对话的长度。请综合比较成本：当某项优化
让用户等待更久，或改变助手完成任务的可靠性时，需要一并权衡
由此带来的影响。

### 估算对话成本

针对包含一次语音会话的对话：

**总费用 =（可计费语音秒数 ÷ 60 × 每分钟语音费率）+ 后端费用**

例如，假设语音费率为每分钟 $0.05，那么一次 90 秒的语音会话费用为 $0.075。如果后端模型和工具费用总计 $0.02，则该对话的费用为 $0.095：

| 组件              | 计算方式                | 费用       |
| ---------------------- | -------------------------- | ---------- |
| 语音会话          | 90 秒 ÷ 60 × $0.05    | $0.075     |
| 后端工作           | 模型和工具费用合计 | $0.02      |
| **会话总费用** | **$0.075 + $0.02**         | **$0.095** |

上述费用率和后端成本仅为示例；请使用当前的语音费用率、你测得的后端使用量，以及
适用的模型和工具费用率。如果任务跨越多个语音会话，请将
它们的时长相加，并计入会话之间执行的后端工作。

### 优化策略

专注于帮助用户以更少的不必要对话完成任务
和等待。保留任务所需的确认与检查。

#### 在会话开始前提供相关上下文

在启动语音会话之前，先收集你的应用已有权限使用的信息。例如，一个帮助处理订单的助手可以
从订单号和当前状态开始，这样用户就不需要
重复这些信息，也无需等待再次查询。
重复它们或等待再次查询。

让这些上下文保持最新，并聚焦于当前任务。为语音模型提供
对话所需的信息；将详细的记录和工作流保留在后端。请参阅
会话配置 [session configuration](https://developers.openai.com/api/docs/guides/live-conversations#session-configuration)
和 [delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).

#### 减少等待工具所花费的时间

更短的等待时间可以提升用户体验并降低语音会话成本。
例如，假设你的后端使用了 `gpt-5.6-luna` 并使用了
[Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 以并行方式运行独立的工具调用。如果这些优化帮助用户提前一分钟结束并关闭
语音会话，你就可以节省 $0.05 的语音费用。只要新增的后端成本低于该节省额，总
成本就会下降。
成本就会下降。

你还可以 [在交接事件到达之前，从转写片段启动一次预查询](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments)
。在衡量后端成本时，请将未使用的预取工作纳入
后端成本衡量中。

请参阅 [降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency)
，涵盖模型、连接、流式传输和工具方面的优化。使用
来衡量有效的口语响应时间和任务成功率。 [voice 智能体 评估](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).

#### 在长时间任务中关闭会话

语音前端和你应用管理的后端可以独立运行。
通过客户端委托，你的后端工作进程可以在语音会话打开或关闭时继续运行。在
关闭语音会话之前保存任务状态和对话上下文。
[关闭语音会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close).

对于环境型 智能体，当后端正在处理一个
长时间运行的任务（例如以目标模式编码）时，关闭语音会话。提供一个按钮，标签为
**继续对话** 以便在用户返回时启动新的语音会话，或者使用后端
完成事件来启动新会话并通知用户结果已
就绪。

通过使用已保存的上下文和经过验证的任务结果开启新会话来恢复对话，
。例如，通过 `input`。发送此启动事件。例如，通过
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

等待 `session.started` 后再流式传输音频。请参阅
[使用先前的对话为会话植入初始消息](https://developers.openai.com/api/docs/guides/live-conversations#seed-a-session-with-prior-conversation)
以了解支持的历史记录格式。

如果较早的会话是使用 `store: true`，存储的，你也可以 [fork 该会话](https://developers.openai.com/api/docs/guides/live-conversations#store-and-fork-a-session)。无论你使用哪种方式，都要在应用中保留已验证的后端任务状态。

关闭连接每分钟闲置语音时间可节省 $0.05；请将此节省与
重连成本以及对用户体验的中断进行权衡。

#### 选择合适的后端模型

首先选择能够满足任务准确性和可靠性要求的模型。
然后比较整体对话成本，包括语音时长、模型使用、
工具调用和重试次数。 [模型选择指南](https://developers.openai.com/api/docs/guides/model-selection)
介绍了如何权衡这些取舍。

如果后端模型更大但完成任务更快，并且语音会话节省的费用超过其额外的令牌成本，那么它的总体成本反而可能更低。如果
模型更便宜但耗时更长、重复调用工具或失败，
那么它的总体成本也可能更高。
请按任务进行比较。

比较每个成功任务的成本，同时结合完成率和完成时间。将失败尝试和重试计入总成本，避免因完成的工作量更少而显得更便宜。使用 [语音智能体评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 来规划你的对比。

### 监控实际使用情况

为每个会话分别记录语音时长和服务端用量。GPT-Live
以秒为单位报告累计语音时长：

```json
{
  "type": "session.usage.updated",
  "event_id": "event_usage_1",
  "usage": { "seconds": 12 },
  "context_window": { "usage_ratio": 0.42 }
}
```

每次更新都会替换上一次的时长快照，请勿将多个快照累加。
发送完成后 `session.close`，持续接收事件，直到 `session.closed` 和
时记录其最终的 `usage.seconds` 一次。按照
[优雅关闭流程](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close)
操作，以便你的应用在断开连接前收集最终的用量数据。

对于 Responses 委托，请阅读后端响应中的 `usage` 来自嵌套
`response.completed` 事件通过 `response.event`。传递。对每个
后端响应使用其响应 ID 计数一次,并保留应用该模型费率所需的输入、输出和
缓存令牌详情。对于后端工作,你的
应用程序独立运行,也需收集这些请求的使用情况。

在代表性对话中比较估算总额与实际总额。将
仅用于评估的模型调用与应用程序使用分开,并结合任务成功率一起审查成本
。

  

  


## Realtime API 费用

本文介绍 Realtime API 的计费方式，并提供成本优化策略。语音智能体会话会在文本、音频和图像模态上累计输入和输出 token。流式翻译和流式转录会话按音频时长计费。价格因模型而异，具体价格列在模型页面上（例如， [`gpt-realtime-2`](https://developers.openai.com/api/docs/models/gpt-realtime-2), [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate), [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper)），以及 [`gpt-realtime`](https://developers.openai.com/api/docs/models/gpt-realtime)).

对话式 Realtime API 会话由一系列 _轮次_，组成，用户添加输入以触发一个 _Response_ 来生成模型输出。服务端维护一个 _Conversation_，它是构成下一轮输入的 _Items_ 列表。当返回 Response 时，输出会自动添加到 Conversation 中。

翻译和转录会话使用不同的流式架构。客户端持续流式传输音频，并在源音频到达时接收翻译后的音频、转录增量或转录事件。这些会话不使用常规的 Response 生命周期，因此应使用其基于时长的费率来估算和监控，而不是按 Response 的 token 使用量来估算和监控。

## Per-Response costs

Realtime API 费用在创建 Response 时产生，并根据输入和输出 token 数量计费（输入转录费用除外，见下文）。目前不会对网络带宽或连接收费。Response 可以手动创建，也可以在开启语音活动检测（VAD）时自动创建。VAD 会有效过滤掉空的输入音频，因此空音频不计入输入 token，除非客户端手动将其添加为对话输入。

每次 Response 都会将整个对话发送给模型。某一轮的输出会作为 Items 添加到服务端对话中，并成为后续轮的输入，因此会话中靠后的轮次会更加昂贵。

可以使用我们的 [分词工具](https://platform.openai.com/tokenizer)。来估算文本 token 费用。用户消息中的音频 token 按每 100 ms 音频 1 个 token 计算，而助手消息中的音频 token 按每 50 ms 音频 1 个 token 计算。请注意，token 计数除了消息内容外还包含特殊 token，因此实际计数可能会出现小幅波动，例如一条内容为 10 个文本 token 的用户消息可能计为 12 个 token。

### 示例

下面通过一个简单的示例来说明在多轮 Realtime API 会话中的 token 开销。

在对话的第一轮中，我们添加了 100 个 token 的指令，以及一条 20 个音频 token 的用户消息（例如基于用户说话由 VAD 添加），合计 120 个输入 token。生成 Response 会产生一条助手输出消息（20 个音频 token 和 10 个文本 token）。

接下来我们用另一条用户音频消息创建第二轮。第二轮的 token 会是怎样的？此时对话内容包含初始指令、第一条用户消息、第一轮的助手输出消息，以及第二条用户消息（25 个音频 token）。这一轮的输入将包含 110 个文本 token 和 64 个音频 token，再加上另一条助手输出消息的输出 token。

![连续对话轮次中的 token](https://cdn.openai.com/API/docs/images/realtime-costs-turns.png)

第一轮的消息在第二轮中可能会被缓存，从而降低输入成本。更多信息请参阅下方关于缓存的说明。

Response 所使用的 token 可以从以下事件中读取 `response.done` ，其形式如下。

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

除了对话式 Responses 之外，Realtime API 还会对输入转录计费（如果启用）。输入转录使用的是与 speech2speech 模型不同的模型，例如 [`whisper-1`](https://developers.openai.com/api/docs/models/whisper-1) 或 [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe)，因此按不同的价目表计费。转录会在音频写入输入音频缓冲区并提交时执行，可以通过手动方式或 VAD 完成。

输入转录的 token 计数可以从 `conversation.item.input_audio_transcription.completed` 事件中读取，如下例所示。

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

Realtime API 支持 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)，该机制会自动生效，并可在多轮会话中显著降低输入 token 的成本。当某个 Response 的输入 token 与先前某个 Response 的 token 匹配时，缓存即会生效，不过这是尽力而为，并不保证一定命中。

最大化缓存命中率的最佳策略是保持会话历史静态不变。移除或修改对话中的内容会使缓存“失效”到发生变更的位置——输入与之前的匹配度会随之降低。请注意，指令和工具定义位于会话的开头，因此在会话中途修改这些内容会降低后续轮次的缓存命中率。

## 截断

当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着消息（从最早的开始）会从 Response 输入中丢弃。一个 32k 上下文且最大输出 token 为 4,096 的模型，在发生截断前，上下文中只能包含 28,224 个 token。

客户端可以设置一个比模型最大值更小的 token 窗口，这是控制 token 使用和成本的好方法。通过以下配置实现 `token_limits.post_instructions` （如果你按如下所示使用 type 配置截断）。顾名思义，这控制了 Response 的最大输入 token 数，不包括指令 token。将 `retention_ratio` 设置为 1,000 意味着超过 1,000 输入 token 上限的内容不会发送给模型用于 Response。 `post_instructions` 设为 1,000 意味着超过 1,000 输入 token 上限的内容不会发送给模型用于 Response。

截断会破坏对话开头附近的缓存，如果每次轮次都发生截断，那么缓存命中率将非常低。为了缓解这个问题，客户端可以配置截断以丢弃比所需更多的消息，这将延长下一次截断发生前的余量。这可以通过 `session.truncation.retention_ratio` 设置来控制。服务端默认值为 `1.0` ，表示截断将仅删除必要的项。值为 `0.8` 意味着截断将保留最大值的 80%，额外丢弃 20%。

如果你试图降低 Realtime API 每个会话的成本（对于给定模型），我们建议减少限制 token 数量，并将 `retention_ratio` 设置为小于 1，如以下示例所示。请记住，这里在降低成本和降低给定轮次的模型记忆之间可能存在权衡。

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

截断也可以被完全禁用，如下所示。禁用后，如果对话过长而无法创建 Response，将返回错误。如果你打算手动管理对话大小，这可能会很有用。

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

Realtime speech2speech 模型有“常规”尺寸和 mini 尺寸两种，mini 尺寸显著更便宜。这里的权衡通常与指令遵循和函数调用方面的智能相关，这些能力在 mini 模型中效果较差。我们建议先用较大的模型测试应用程序，完善你的应用和提示，然后再尝试使用 mini 模型进行优化。

### 编辑对话

虽然截断会在服务端自动发生，但另一种成本管理策略是手动编辑对话。API 的一项原则是允许客户端完全控制服务端对话，从而允许客户端随意添加和移除条目。

```json
{
  "type": "conversation.item.delete",
  "item_id": "item_CCXLecNJVIVR2HUy3ABLj"
}
```

清除旧消息是减小输入 token 数量和降低成本的有效方法。这可能会移除重要内容，但一种常见策略是用摘要替换这些旧消息。可以使用以下方法从对话中删除条目： `conversation.item.delete` 如上所示的 message 类型，并可使用 `conversation.item.create` message 进行添加。

## 估算成本

鉴于 Realtime API 的令牌使用情况较为复杂，提前准确估算成本可能比较困难。一种较好的方法是：在 Realtime Playground 中使用你预期的提示词和函数进行测试，并在一个示例会话中衡量令牌使用情况。某个会话的令牌使用情况可以在 Realtime Playground 的 Logs 标签页中找到，位于会话 id 旁边。

![在 Playground 中显示令牌](https://cdn.openai.com/API/docs/images/realtime-playground-tokens.png)