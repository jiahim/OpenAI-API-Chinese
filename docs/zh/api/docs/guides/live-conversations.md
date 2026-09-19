# 管理 GPT-Live 会话

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 。

在 [连接到 GPT-Live](https://developers.openai.com/api/docs/guides/live)，后，使用会话事件来添加上下文、显示转录文本并管理连接。GPT-Live 可以同时听和说。请分别跟踪转录文本、已播放的音频和后端任务进度，以便你的界面能够展示助手正在说什么以及还有哪些工作仍在运行。

本指南假定你的连接已发出 `session.started`。请参阅 [Connections](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 了解连接设置和音频流传输，以及 [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation) 了解后端工作。





## 配置会话

在创建会话时选择模型、语音和委托模式。为对话提供模型指令并包含相关历史记录。随着对话的进行，GPT-Live 会自动管理上下文。

### Configuration fields

| 设置      | 在启动时配置                                                                                | 在会话期间更改                            |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 模型        | 设置所需的 `model`.                                                                           | 开启新会话以更改它。                    |
| 指令 | 设置 `instructions` 以控制对话行为，最多 16,384 个 token。                                  | 使用以下方式添加指令 `session.instructions.append`. |
| 历史      | 设置 `input` 添加到相关的前序文本消息。默认为 `[]`.                                   | 使用 append 事件添加上下文。                      |
| 语音        | 设置 `audio.output.voice` 为支持的语音或已授权的自定义语音。默认值为 `marin`.   | 开启新会话以更改它。                    |
| 委托   | 设置 `delegation.type` 为 `client` 或 `responses`。省略或 `null` 委托会选择客户端模式。 | 在现有模式下更新 Responses 设置。  |
| 存储      | 设置 `store` 为 `true` 以使该会话可用于派生。默认值为 `false`.            | 在启动时选择。                                   |

### 语音选项

在创建会话时选择声音。将 `audio.output.voice` 设置为 API 名称，例如 `"quartz"`. GPT-Live 包含以下额外的语音选项：

| 语音    | API 名称   | 语言   | 区域影响 | 呈现方式 | 来源    |
| -------- | ---------- | ---------- | ------------------ | ------------ | --------- |
| Quartz   | `quartz`   | 英语    | 澳式英语         | 女性化     | 生成式 |
| Ripple   | `ripple`   | 英语    | 澳式英语         | 男性化    | 自然   |
| Vesper   | `vesper`   | 英语    | 英式英语            | 男性化    | 自然   |
| Willow   | `willow`   | 英语    | 爱尔兰式              | 女性化     | 自然   |
| Stone    | `stone`    | 英语    | 爱尔兰式              | 男性化    | 自然   |
| Gleam    | `gleam`    | 英语    | 北美式     | 女性化     | 自然   |
| Meridian | `meridian` | 英语    | 北美式     | 男性化    | 自然   |
| Bossa    | `bossa`    | 葡萄牙语 | 巴西葡萄牙语          | 女性化     | 自然   |
| Tempo    | `tempo`    | 葡萄牙语 | 巴西葡萄牙语          | 男性化    | 自然   |
| Beacon   | `beacon`   | 英语    | 菲律宾语           | 男性化    | 生成式 |
| Delta    | `delta`    | 英语    | Southern U.S.      | 女性化     | 生成式 |
| Cinder   | `cinder`   | 英语    | Southern U.S.      | 男性化    | 生成式 |

区域影响描述了语音的说话风格。请使用你的应用所需的语言和发音来测试该语音。有关使用你自己录音创建的已批准语音，请参阅 [自定义语音](https://developers.openai.com/api/docs/guides/custom-voices).





对于 WebSocket，请选择 `audio.format` 作为启动时的格式。会话的输入和输出音频使用相同格式。如需使用其他格式，请开启新会话。WebRTC 会在连接建立期间协商其音频格式，因此请将 `audio.format` out of WebRTC 请求。详见 [WebSocket 音频格式](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 以了解支持的格式和流式传输详情。

### 更新实时会话

使用 `session.update` 对 `session.delegation.responses` 在已使用 Responses 委托的会话中进行更改。仅发送你希望更改的设置；未发送的设置将保留其原值。请参阅 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 以了解相关设置并更新 工作流。

在启动时选择委托模式以及字段 `model`, `instructions`, `input`, `audio`，以及 `store` 。仅将 `session.update` 用于上文所述受支持的 Responses 设置；其他配置字段将被拒绝。若要切换委托模式，请创建新会话。启动时， `delegation: null` 会选取客户端委托，而非恢复默认的 Responses 设置。

一次成功的更新会发出 `session.updated` ，其中包含最终的会话配置。请将其与你通过 `event_id` 发送的 `client_event_id`。进行匹配。处理 [被拒绝的命令](#handle-rejected-commands) 时，请在同一个事件循环中完成。后端任务与语音输出则通过各自的事件进行追踪。

## 提供历史记录和上下文

使用启动历史来恢复某个主题，并在对话推进时追加相关上下文。将可信应用的指令与用户消息及事实结果分开保存。

### 使用先前的对话作为会话种子

在创建会话时包含之前的文本消息 `session.input` 例如，向你的 `input` 中添加以下 [会话创建配置](https://developers.openai.com/api/docs/guides/live#connect-your-first-session):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {
    "model": "gpt-live-1",
    "input": [
        {
            "type": "message",
            "role": "user",
            "content": [
                {"type": "input_text", "text": "I need help with my recent order."}
            ],
        },
        {
            "type": "message",
            "role": "assistant",
            "content": [{"type": "output_text", "text": "What is the order number?"}],
        },
    ],
}
```


该列表最多接受 128 条消息和总计 8,192 个 token。每条消息包含一个文本部分，并使用以下角色之一： `developer`, `user`、或 `assistant`。开发者和用户消息使用 `input_text`；助手消息使用 `text` 或 `output_text`。将受信任的应用指令放在 `instructions` 或开发者消息中。

选择下次交互所需的文本历史记录，并在启动时提供。在会话期间，使用下面的上下文事件添加更新。通过 [委托 工作流](https://developers.openai.com/api/docs/guides/live-delegation).

### 了解上下文何时到达模型

将模型从一开始就需要的任何上下文放在 `input`；中；会话开始时可以使用整个字段。

在正在进行的会话中， `session.instructions.append`, `session.thinking.append`，以及 `session.commentary.append` 随时间添加上下文。当会话时间线到达所添加上下文的预计结束位置时，确认信号就会到达。其 `start_ms` 和 `end_ms` 用于估计该更新在会话时间线上的位置。

这些时间描述的是上下文传递，而不是语音或回放。模型仍可能在完全使用整个更新之前就做出响应。当某个操作依赖于新的指令或事实时，请在你的应用中验证相应的行为。

如果会话时间线停止，确认信号可能会一直处于待处理状态。请将确认信号与传出的 `event_id` 发送的 `client_event_id`，进行匹配，并在等待时继续处理错误。关闭会话会为仍处于待处理状态的追加操作返回错误。

### 在对话过程中添加上下文

根据模型应如何使用该更新来选择事件：

- `session.instructions.append`: 添加受信任的应用指令,以影响行为和语言输出。
- `session.thinking.append`: 添加事实性上下文,但不要求模型立即说出这些内容。
- `session.commentary.append`: 提供可供模型朗读的信息,模型可能会对这些内容进行改述。

每个事件接收纯字符串 `content` 长度不超过 500 个 token，以及一个必需的 `delegation_id`。使用 `null` 传递会话级别的上下文。例如，在你的应用验证用户已同意并开始查找后，发送以下内容：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.thinking.append",
    event_id: "context_1",
    delegation_id: null,
    content:
      "The user has already accepted the terms. The account lookup is still running.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.thinking.append(
        event_id="context_1",
        delegation_id=None,
        content=(
            "The user has already accepted the terms. The account lookup is still "
            "running."
        ),
    )
```


处理 `session.thinking.appended` 及其 `client_event_id: "context_1"`，或对应的错误，以追踪本次更新。参见 [了解上下文何时送达模型](#understand-when-context-reaches-the-model) 中的确认时序。

助手可能会复述通过这些事件提供的任何信息。请只发送适合对话的内容，并将凭据和密钥保存在你的后端。使用 `session.instructions.append` 传递由你的应用定义的行为。将事实性的工具结果作为上下文提供，并在应用代码中强制执行权限和所需的确认。

关于页面导航、选择操作以及其他界面变更，请参见 [共享界面上下文](https://developers.openai.com/api/docs/guides/live-delegation#share-ui-context) 以发送简洁的更新，帮助 GPT-Live 理解用户所指的内容。

若要更新特定后端任务，请使用相关客户端委托的 ID。委托 ID 用于标识 Live 任务；Responses 响应 ID 和工具调用 ID 标识的是不同的对象。参见 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update) ，了解该 工作流的说明。

当你的应用检测到问题时，通过会话的主 WebSocket 或 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband)。请参阅 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 用于检查、操作控件和播放处理。












## 管理语音和转录

### 转录增量

监听 `session.input_transcript.delta` 用户语音和 `session.output_transcript.delta` 助手语音。每个事件包含一段文本片段以及它在会话时间轴上的区间：

```json
{
  "type": "session.input_transcript.delta",
  "event_id": "event_transcript_1",
  "delta": "What is",
  "start_ms": 1000,
  "end_ms": 1200
}
```

按原样追加每位发言者的 `delta` 片段，保留其中的空格和重复的词。同时保留它们的 `start_ms` 和 `end_ms`。这些值是从会话开始起计的毫秒数。上面的示例覆盖了从 1,000 ms 到 1,200 ms（不含）的区间。它们描述的是近似片段时序而非精确的词边界；请使用它们而非数据包的到达时间来组织转录文本。

转录事件针对包含文本的区间到达，并且投递可能不均匀。一个片段可能只包含句子的一部分；投递中的间隔可能是网络延迟。转录 delta 没有 item ID，也没有用于标记对话回合结束的事件，因此由你的应用自行决定如何对它们分组以供显示。

处理转录片段是可选的。你可以使用它们来更新 UI、运行检查，或在对话继续进行时提前启动一些工作。对于轻量级检查，可以考虑使用 `gpt-5.6-luna` 等低推理强度的模型。参见 [响应转录片段](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例与连接指导。

使用 [转录护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#run-checks-alongside-the-conversation) ，以便在语音持续进行时监控对话并触发干预。如果你的应用需要在播放前检查助手语音，请参见 [在播放前检查语音](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#check-speech-before-playback) 中的缓冲、审批、打断与恢复处理。





将转录时序与音频播放分开处理。WebSocket `session.output_audio.delta` 事件不包含时序字段，也没有 output-audio-done 事件；WebRTC 通过其媒体轨道传输音频。参见 [Connections](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 了解音频处理方式。





### Display captions

GPT-Live 是全双工的：呼叫方和助手可以同时说话。独立更新他们的字幕，这样两位说话者的文本可以在重叠语音期间持续增长。

如果你的应用使用聊天气泡，片段 “I'd like” 和 “ to change my booking” 可以出现在同一个呼叫方气泡中。如果助手在呼叫方继续说话时说 “Sure”，将那个确认单独显示，同时允许呼叫方的气泡继续增长。保留原始片段和时间戳，以便稍后到达的文本可以更新相应的气泡。

使用 `session.output_transcript.delta` 用于语音字幕，并将后端更新单独显示。将有关运行工具或取消工作的决策保留在应用的任务逻辑中，与你如何对文本进行分组以供显示分开。

### 控制麦克风输入

Send `session.input_audio.mute` 以在不结束会话的情况下静音输入：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.input_audio.mute",
    event_id: "mute_1",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.input_audio.mute(
        event_id="mute_1",
    )
```


Wait for `session.input_audio.muted` 及其 `client_event_id: "mute_1"` 之后再将该命令视为已接受。若要恢复输入，请发送 `session.input_audio.unmute` 并等待 `session.input_audio.unmuted`。处理任一命令的错误。

静音输入会使会话保持运行：模型可以继续生成语音，委派的工作也可以继续进行。如果你还需要停止本地录音或播放，请使用你应用中的麦克风采集和音频播放器控件。

### 在来电者说话前先问候

要让 GPT-Live 开启对话，请在其后发送问候指令 `session.started`。请指定语言、助手应说的话，以及让它立即开始然后暂停以等待回应。在呼叫方开口之前，使用应用所选的问候语语言。例如：

> 现在用英语向来电者问好。说明你是支持助手，并询问有什么可以帮忙的。然后暂停并倾听。

1. 在整个序列中保持输入音频持续运行，包括通话方开口前的静音。在 WebSocket 上，继续发送 `session.input_audio.append`；在 WebRTC 上，保持输入音频轨道处于活跃状态。
2. 使用以下字段随 `session.instructions.append` 一起发送一次指令 `delegation_id: null`.
3. 将响应中的 `session.instructions.appended` 与你发送的命令进行匹配 `client_event_id`，并处理任何错误。此确认表明指令已被接受。

若需精确措辞和已知的播放完成点，请在你的应用中播放经过验证的录音或渲染后的片段，并在播放过程中 [控制 GPT-Live 播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed)。请测试你所支持语言中的问候语，包括呼叫者在问候期间开始讲话的情况。参见 [语音模型提示](https://developers.openai.com/api/docs/guides/live-prompting) 了解提示设计。

### 提供披露信息

使用 `session.instructions.append` 以请求特定的披露用语。 `session.commentary.append` 可能会对文本进行改述。例如，之后 `session.started`，可以发送：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.instructions.append",
    event_id: "disclosure_1",
    delegation_id: null,
    content:
      "Immediately say the following disclosure exactly and in full before responding to the caller: This call may be recorded for quality and training purposes.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.instructions.append(
        event_id="disclosure_1",
        delegation_id=None,
        content=(
            "Immediately say the following disclosure exactly and in full before "
            "responding to the caller: This call may be recorded for quality and "
            "training purposes."
        ),
    )
```


保持输入音频持续运行，例如 [在来电者说话前打招呼](#greet-before-the-caller-speaks)。在对话过程中发送的指令可能会打断正在进行的语音。

在标记已交付之前，请检查生成的披露内容及其播放情况。指令确认记录表示已接受；请使用音频本身来核对措辞。对于精确措辞和已知的播放完成点，可通过你的应用播放经过核验的录音或渲染片段，并在播放期间控制 GPT-Live 的输出。参见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





## 管理更长的对话

GPT-Live 会自动管理较长的对话，并保留你原有的启动指令。

默认上下文窗口可容纳 128,000 个 token，包括你的指令、对话文本以及未出现在转录中的音频 token。

GPT-Live 会在后台对较早的对话历史进行摘要。当上下文用量超过 90% 时，它会在同一会话内启动一个替换语音引擎。该替换引擎会接收你的原始指令以及最多 8,192 个 token 的对话历史，其中包含最近的消息，以及在可用时对较早消息的摘要。准备摘要并不会立即改变当前运行引擎的上下文。





较早的对话细节可能会被摘要或省略。请在应用中保存重要事实、已确认的操作以及当前任务状态，并在需要时提供相关上下文。

## 存储并复刻会话

分叉会从一个已保存的语音对话中启动新的会话。可使用它基于同一份参考对话运行多次评估试验，或让用户在更早的会话结束后继续对话。每个分叉都会获得新的连接和会话 ID，并以源对话及其已保存的配置作为起点。

### 从参考对话运行评估

假设你想测试你的智能体如何处理来电者修改订单的情况。在整个录制过程中，从开始设置到来电者已确认订单为止，记录一次。在来电者提出修改请求之前，结束并完成该会话。之后的每次评估都可以分叉同一参考会话，并接收相同的下一段来电者音频："其实，能改送到我的办公室吗？"

对于每次试验，恢复相同的测试订单和应用程序状态，提供下一段来电者输入，并评估新的响应和工具操作。你可以重复该场景，或比较支持的 Responses 后端设置。分别测量分叉启动时间和响应时间。参见 [GPT-Live 评估指南](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) ，了解如何选择场景和衡量结果。

分叉会继承 GPT-Live 的模型、语音和原始指令。若要比较不同的语音模型或启动提示，请使用相应配置创建新会话。分叉API会使用已完成的源录制，因此请在希望评估开始的节点结束参考会话。

### 在会话结束后继续

例如，呼叫者可能会挂断后稍后再次拨打，或者在通话掉线后重新连接。如果较早的会话已有存储的录音，你的应用可以在新连接上分叉该会话，并从已保存的对话继续。

将应用任务状态与源会话 ID 一起保存。在继续之前，检查所有未完成的后端工作状态，并将当前结果提供给新会话。例如，如果订单更新已提交，请先确认其结果，然后再尝试再次更新。使用新的会话 ID 来进行控制和带外连接，并将后续的后端结果路由到新会话。

### 为分支准备会话

1. **在创建源时启用存储。** 设置 `store: true` 在其会话配置中。存储默认为 `false`,必须在你的项目中启用,并需要允许持久化的数据策略。
2. **保存源会话 ID。** 从 `session.started` 或 WebRTC 创建响应中读取它,并将其与你应用的对话记录关联。
3. **完成并关闭源。** 完成所需的后端工作,然后遵循 [使用与优雅关闭](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close).保持连接打开,直到 `session.closed` 并处理任何最终化错误。分叉需要已完成的存储录制;保存它会增加最终化的时间。
4. **在新连接上启动分叉。** 使用源 ID 与下面的传输流程,保存新的会话 ID,并在继续对话之前完成启动。设置子会话的 `store` 显式为: `true` 如果你希望稍后分叉其 延续,或者 `false` 如果你不需要存储该试用。省略此项将继承源设置。

存储的录音可保留 30 天。在 Zero Data Retention (ZDR) 下， `store` 将被视为 `false` ，且无法使用分叉。对于基于分叉的评估，请使用为项目启用了存储的非 ZDR 组织。

如果你没有已完成的存储录音， [使用相关的已保存文本历史记录开启新会话](https://developers.openai.com/api/docs/guides/live-conversations#seed-a-session-with-prior-conversation)。请参阅 [GPT-Live 数据控制](https://developers.openai.com/api/docs/guides/your-data#v1livesessions) 了解存储要求。

例如，在源会话的 WebSocket `session.start` 配置或 WebRTC 创建请求中设置该字段：

```json
{
  "store": true
}
```

通过你的应用程序所使用的传输方式启动该分叉：

| Transport | 启动分叉                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | 连接到 `wss://api.openai.com/v1/live/sessions/{source_session_id}/fork`.                                                                     |
| WebRTC    | 向...发送新的 SDP offer `POST /v1/live/sessions/{source_session_id}/fork`. 应用返回的 `transport.sdp` answer 到新的对等连接。 |

Fork 会继承源会话的模型、原始指令和输入。启动时仅发送支持的覆盖项：

- **WebSocket：** `store`、Responses 委派设置以及新连接的 `audio.format`。发送一个 `session.start` 事件，其中包含一个 `session` 对象；可使用 `{}` 在受支持的位置保留继承的设置。
- **WebRTC：** `store`、Responses 委派设置以及前端客户端权限。

对于 WebSocket 分支，请设置 `audio.format` 以用于新连接，或使用默认的 24 kHz PCM16。源音频格式和前端数据通道权限不会被继承。WebRTC 会在连接建立期间协商音频格式；请省略 `audio.format`。WebRTC 会保留前端权限设置，除非你显式覆盖它们。

对于 WebSocket，请等待 `session.started` 之后再发送更多命令。对于 WebRTC，HTTP 请求即启动会话；通过已协商的连接继续即可，无需再发送另一个 `session.start`.

### 启动 WebSocket 分支

Set `OPENAI_API_KEY`。示例使用你的应用保存的已存储源会话 ID。它们会确认启动然后关闭该分支。若要延续对话，请在之后使用 `session.started` 使用 [WebSocket 连接流程](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。请参阅 [分支 WebSocket 参考](https://developers.openai.com/api/reference/resources/live/fork-websocket) 了解启动字段和事件。

```javascript
import OpenAI from "openai";
import { ForksWS } from "openai/resources/live/forks/ws";

async function forkSession(sourceSessionId) {
  const ws = new ForksWS(new OpenAI(), { session_id: sourceSessionId });
  let finalized = false;
  try {
    for await (const event of ws) {
      if (event.type === "open") {
        ws.send({ type: "session.start", session: {} });
      } else if (event.type === "error") {
        throw event.error;
      } else if (event.type === "message") {
        if (event.message.type === "session.started") {
          console.log("Fork ready:", event.message.session.id);
          // This startup example closes the fork after confirming it is ready.
          ws.send({ type: "session.close" });
        } else if (event.message.type === "session.closed") {
          console.log("Final usage:", event.message.usage);
          finalized = true;
          break;
        }
      }
    }
    if (!finalized) throw new Error("Connection closed before session.closed");
  } finally {
    ws.close();
  }
}
```

```python
from openai import OpenAI


def fork_session(source_session_id: str) -> None:
    client = OpenAI()
    with client.live.forks.connect(session_id=source_session_id) as connection:
        connection.session.start(session={})
        finalized = False
        for event in connection:
            if event.type == "session.started":
                print("Fork ready:", event.session.id)
                # This startup example closes the fork after confirming it is ready.
                connection.session.close()
            elif event.type == "session.closed":
                print("Final usage:", event.usage)
                finalized = True
                break
            elif event.type == "error":
                raise RuntimeError(event.error.message)
        if not finalized:
            raise RuntimeError("Connection closed before session.closed")
```


### 启动 WebRTC 分支

在前端创建一个新的 SDP offer 并发送给后端。以下后端示例使用该 offer 以及你在应用中存储的源会话 ID：

```javascript
import OpenAI from "openai";

async function forkSession(sourceSessionId, offerSdp) {
  const client = new OpenAI();
  const fork = await client.live.sessions.fork(sourceSessionId, {
    transport: { type: "webrtc", sdp: offerSdp },
  });
  console.log(JSON.stringify(fork));
}
```

```python
from openai import OpenAI


def fork_session(source_session_id: str, offer_sdp: str) -> None:
    client = OpenAI()
    fork = client.live.sessions.fork(
        source_session_id,
        transport={"type": "webrtc", "sdp": offer_sdp},
    )
    print(fork.model_dump_json())
```


将响应返回给前端，应用 `transport.sdp` 作为新对等连接的 answer，并保留新的 `session.id`。在后端保留 API 密钥。

将新的会话 ID 用于带外连接和会话控制。在重试未完成的动作之前，先在后端检查其结果并恢复当前应用任务状态。如果你没有已完成的存储录制， [使用已保存的历史记录初始化新会话](#seed-a-session-with-prior-conversation).

### 下载录音

存储的录制文件完成最终化后，使用以下命令下载其音频 `GET /v1/live/sessions/{session_id}/content`。响应为二进制立体声 WAV，输入音频位于左声道，输出音频位于右声道。示例使用你应用中的存储会话 ID，并将响应流式传输到 `recording.wav`:

```javascript
import OpenAI from "openai";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

async function downloadRecording(sessionId) {
  const client = new OpenAI();
  const response = await client.live.sessions.downloadRecording(sessionId);
  if (!response.body) throw new Error("Recording response has no body");
  await pipeline(response.body, createWriteStream("recording.wav"));
}
```

```python
from openai import OpenAI


def download_recording(session_id: str) -> None:
    client = OpenAI()
    with client.live.sessions.with_streaming_response.download_recording(
        session_id
    ) as response:
        response.stream_to_file("recording.wav")
```


## 关闭空闲会话并恢复

对于交互间隔较长的应用，请在无活动期间关闭语音会话，并在用户回来时开启新会话。保留对话上下文和应用任务状态，这样用户在再次使用时无需重复说明。例如，车载助手可以在司机再次激活语音时恢复会话，而编码助手可以在语音对话之间保持其后端工作进程持续运行。

1. **决定何时关闭。** 根据音频活动、助手播放和应用交互，使用由应用控制的无活动超时。允许出现预期的暂停，例如阅读或思考。仅当播放结束且当前语音会话没有待处理工作时才关闭。仅凭转录事件之间的间隔无法判定为静音。
2. **保存状态并优雅地关闭。** 保存源会话 ID、对话上下文和当前任务状态。完成所有必需的 Responses 工作，然后按照 [使用与优雅关闭](#usage-and-graceful-close)：安装 `session.closed` 监听器，发送 `session.close`，并等待 `session.closed` 之后再释放连接。使用客户端委托时，应用管理的后端工作可以在语音关闭后继续独立运行。
3. **检测何时重新启动。** 提供一个标记为 **Resume conversation**，的按钮、一个按住说话控件，或由应用管理的唤醒触发器。已关闭的 Live 会话无法监听用户。如果你使用本地语音检测来自动重启，请保持麦克风采集处于激活状态，并通过连接建立过程缓冲开头的语音。一旦新会话准备就绪，就交付该音频，从而保留用户的最初语音。
4. **在新会话中恢复上下文。** 如果源会话是使用 `store: true`，创建的，并且已启用并允许存储，且其录制成功完成，请， [分叉已存储的会话](#prepare-a-session-for-forking)。否则，请， [使用已保存的文本历史记录开启新会话](#seed-a-session-with-prior-conversation)。保存新的会话 ID，检查未完成的后端操作的状态，并将后续结果路由到新会话。在你的应用中保留操作状态，以便重启时不会重复已完成的操作。

将麦克风静音会保持会话处于活动状态。通过比较可避免的语音时长、会话创建成本以及语音再次就绪前的延迟来选择空闲超时。请参阅 [语音会话成本](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live#voice-session-costs) 和 [WebRTC 初始化费用](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live#webrtc-initialization-charges).

## 处理错误并结束会话

持续读取会话事件，直到会话结束。区分被拒绝的命令、连接失败和已完成的会话，以便你的应用能够恰当地进行恢复。

### 处理被拒绝的命令

读取 `error` 事件以及确认信息。如果存在， `error.client_event_id` 用于标识失败的传出命令：

```json
{
  "type": "error",
  "event_id": "event_error",
  "error": {
    "type": "invalid_request_error",
    "code": "immutable_field_update",
    "message": "The delegation type cannot change after session startup.",
    "param": "session.delegation.type",
    "client_event_id": "event_update"
  }
}
```

为错误代码为 `null` 或客户端事件 ID 缺失的错误提供一个通用错误处理器。对于不可变字段错误，保留当前配置，或使用预期设置创建一个新会话。

### 处理内容审核

审核可以通过两种方式影响会话：

- 某些审核事件会结束会话。
- 其他事件会切断助手当前语音的剩余音频输出，并发出一个 `error` 事件，但不结束会话。

保持处理 `error` 音频播放期间的事件。分别跟踪音频中断和会话关闭，并且仅在检查口语消息的回放后再将其标记为已送达。结合内置审核机制，应用你自己的 [对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 。

### 用法与优雅关闭

`session.usage.updated` 以秒为单位报告累计语音时长：

```json
{
  "type": "session.usage.updated",
  "event_id": "event_usage_1",
  "usage": { "seconds": 12 },
  "context_window": { "usage_ratio": 0.42 }
}
```

使用最新的 `usage.seconds` 作为语音时长的累计总数。例如，更新值为 12 和 15 秒，则表示使用了 15 秒。将后端 token 用量与嵌套的 Responses 完成事件分开统计。参见 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) 了解用量核算方式。

优雅关闭：

1. 完成你的应用需要的所有委托 Responses 工作，包括待处理的函数结果和响应延续。
2. 在发送之前安装 `session.closed` 监听器 `session.close`.
3. 发送 `session.close` 并停止向会话提交新工作。在待处理的会话事件排空期间，保持 WebSocket 或 WebRTC 连接、数据通道以及任何已附加的边带接收器处于活动状态。
4. 读取最终的 `usage.seconds`, `reason`，以及会话快照，来源： `session.closed`。保留已通过 `response.event`.
5. 收到委托用量。该事件之后，清理传输通道和音频设备。如果终结失败或超过你的应用设置的超时，请报告未完成终结并释放资源。

发送 `session.close` 会取消已排队的 Responses 并拒绝进一步的命令。正在进行的响应可以正常结束，但等待函数结果返回的响应在关闭开始后无法继续。请单独决定是结束还是取消通过客户端委托运行的应用任务。

使用 `session.closed` 以确认最终化并读取最终的配置快照。在该事件到达之前保持传输连接打开。如果套接字先关闭，则将最终化记录为未确认；如果在有效的 `session.closed`，之后关闭，则保留已确认的结果。

最终事件的 `reason` 说明了会话结束的原因：

| 原因            | 含义                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `close_requested` | 你的应用程序发送 `session.close` 或调用了 hangup 端点。 |
| `expired`         | 会话达到了其时长限制。                              |
| `content`         | 安全过滤器结束了会话。                                   |
| `remote_hangup`   | 远程主连接正常结束。                      |
| `connection_lost` | 主连接或上游连接意外中断。            |

一个 `session.closed` 事件可确认最终化，即便原因为连接丢失或安全终止。若缺少该事件，最终用量将无法确认。已存储的会话在保存录音时可能需要更长时间才能最终化；请选择一个能容纳存储时长的应用超时。

### 从失败的连接中恢复

HTTP 会话创建错误意味着会话未能到达 `session.started`。将启动错误与会话运行期间发生的错误分开处理。如果运行中的连接在 `session.closed`，之前失败，保留最新观察到的用量，并将最终用量标记为未确认。

如果存在已完成的存储录制， [分叉该录制](#store-and-fork-a-session) 以在新会话中继续。否则，使用相关的已保存历史记录创建一个替换会话。在继续之前，使用你的后端检查未完成的动作，恢复当前任务状态，并更新结果路由，以防止来自上一个会话的延迟结果覆盖较新的工作。