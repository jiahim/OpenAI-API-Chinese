# 管理 GPT-Live 会话

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

在 [连接到 GPT-Live](https://developers.openai.com/api/docs/guides/live)，后,使用会话事件来更新上下文、显示转录内容并管理连接的生命周期。模型可以同时听和说,因此请在你的应用中保持接收到的事件、音频回放和后端任务状态相互独立。

本指南假设你的连接已经发出 `session.started`。请参阅 [连接](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 以了解连接设置和音频流传输,以及 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 以了解后端工作。





## 配置会话

在创建会话时选择模型、语音和委托模式。为模型提供对话说明，并包含相关历史记录。GPT-Live 会随着对话的进行自动管理上下文。

### 配置字段

| 设置      | 在启动时配置                                                                                | 在会话期间更改                            |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 模型        | 设置必需项 `model`.                                                                           | 启动新会话以更改它。                    |
| 指令 | 设置 `instructions` 用于对话行为，最多 16,384 个 token。                                  | 使用以下方式添加指令 `session.instructions.append`. |
| 历史记录      | 设置 `input` 到相关的先前文本消息。默认为 `[]`.                                   | 追加上下文；不要替换启动历史记录。   |
| 语音        | 设置 `audio.output.voice` 到受支持的语音或已授权的自定义语音。默认值为 `marin`.   | 启动新会话以更改它。                    |
| 委托   | 设置 `delegation.type` 到 `client` 或 `responses`。省略或 `null` 委托选择客户端模式。 | 在现有模式下更新 Responses 设置。  |
| 存储      | 设置 `store` 到 `true` 以使该会话可用于派生。它默认为 `false`.            | 在启动时选择。                                   |

### 语音选项

在创建会话时选择语音。将 `audio.output.voice` 设置为 API 名称，例如 `"quartz"`。GPT-Live 包含以下额外的语音选项：

| 语音    | API 名称   | 语言   | 地区影响 | 表达风格 | 来源    |
| -------- | ---------- | ---------- | ------------------ | ------------ | --------- |
| Quartz   | `quartz`   | 英语    | 澳大利亚         | 女性     | 生成 |
| Ripple   | `ripple`   | 英语    | 澳大利亚         | 男性    | 自然   |
| Vesper   | `vesper`   | 英语    | 英式            | 男性    | 自然   |
| Willow   | `willow`   | 英语    | 爱尔兰              | 女性     | 自然   |
| Stone    | `stone`    | 英语    | 爱尔兰              | 男性    | 自然   |
| Gleam    | `gleam`    | 英语    | 北美     | 女性     | 自然   |
| Meridian | `meridian` | 英语    | 北美     | 男性    | 自然   |
| Bossa    | `bossa`    | 葡萄牙语 | 巴西          | 女性     | 自然   |
| Tempo    | `tempo`    | 葡萄牙语 | 巴西          | 男性    | 自然   |
| Beacon   | `beacon`   | 英语    | 菲律宾语           | 男性    | 生成 |
| Delta    | `delta`    | 英语    | Southern U.S.      | 女性     | 生成 |
| Cinder   | `cinder`   | 英语    | Southern U.S.      | 男性    | 生成 |

地区影响描述的是声音的说话风格，而非对口音准确性的保证。如需了解如何使用你自己的录音创建已批准的声音，请参阅 [自定义声音](https://developers.openai.com/api/docs/guides/custom-voices).





对于 WebSocket，请选择共享的 `audio.format` 在启动时设置，会话期间无法更改。对于 WebRTC，请省略此字段，因为连接会协商其音频格式。参见 [WebSocket 音频格式](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 以了解格式和流式传输的详细信息。

### 更新一个活跃会话

使用 `session.update` 对以下项进行更改： `session.delegation.responses` 在已使用 Responses 委托的会话中。仅发送你要更改的设置；未提供的设置将保留其原值。请参阅 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 了解相关设置以及如何更新 工作流。

启动后无法更改委托模式。特别是，将 `delegation` 设置为 `null` 会选择客户端模式；它不会重置 Responses 会话。启动字段 `model`, `instructions`, `input`, `audio`，以及 `store` 不是被接受的更新字段。未知的配置字段将被拒绝。

一次成功的更新将发出 `session.updated` ，其中包含完整已解析的会话配置。当你提供 `event_id`，时，确认响应会将其返回为 `client_event_id`。请检查 [已拒绝的命令](#handle-rejected-commands) 以及确认响应。被接受仅表明配置更新成功；并不代表后端任务已运行，也不代表模型已发声。

## 提供历史记录和上下文

使用启动历史延续某个主题，并在对话进行中追加相关的上下文。将可信的应用指令与用户消息及事实结果分开保存。

### 使用先前的对话为会话植入初始状态

在创建会话时将之前的文本消息包含进来 `session.input` 。例如，添加此 `input` 字段到你的 [会话创建配置](https://developers.openai.com/api/docs/guides/live#connect-your-first-session):

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


该列表最多接受 128 条消息，总计 8,192 个 token。支持的角色包括 `developer`, `user`，以及 `assistant`，每条消息包含一个文本部分。开发者和用户消息使用 `input_text`；助手消息使用 `text` 或 `output_text`。将可信的应用程序指令放入 `instructions` 或开发者消息中。该列表不接受 `system` 角色。

选择下一次交互所需的历史记录。 `input` 是一个启动字段，不能用于替换运行中会话的历史记录。它也不接受 Responses 委派中使用的全部后端输入项范围。

### 了解上下文何时到达模型

完整的 `input` 会在会话开始时提供给模型。把模型从一开始就需要了解的内容放在此字段中。

在会话运行期间， `session.instructions.append`, `session.thinking.append`，以及 `session.commentary.append` 事件会随着时间将内容输入到模型中。这些事件的确认会等待，直到帧进度达到上下文注入的预计结束位置。返回的 `start_ms` 和 `end_ms` 描述的是会话时间线上的一个预计范围，而不是语音或播放的完成情况。它们并不能证明模型已消费完整个更新内容。不要假设它接下来的语音会反映整个更新。

如果帧进度停止，确认可能会一直处于待处理状态。关闭会话时，待处理的 append 会报错。将每个确认与发出的 `event_id` 通过 `client_event_id`，进行匹配，并在等待期间持续处理错误。

### 在对话期间添加上下文

根据模型应如何使用该更新来选择事件：

- `session.instructions.append`: 添加受信应用程序指令，以影响其行为和发言。
- `session.thinking.append`: 添加事实性上下文，但不要求模型立即说出。
- `session.commentary.append`: 提供供模型大声朗读的信息，模型可能会进行改述。

每个事件都接受纯字符串 `content` 最多 500 个 tokens，以及一个必需的 `delegation_id`。使用 `null` 提供会话级别的上下文。例如，在你的应用验证用户同意并开始查询后，发送以下内容：

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


等待 `session.thinking.appended` ，其中包含 `client_event_id: "context_1"`，或处理错误。该确认表示上下文已被接受，但并不代表语音、播放或外部操作的完成。

静默上下文会影响后续语音输出，但它并非隐私边界。凭据、密钥以及绝不能让模型泄露的文本，都不应通过这三个事件发送。请使用 instructions 事件来承载应用自身编写的行为，而非不可信的工具输出。权限校验与必要的确认必须由你的应用强制执行。

关于页面导航、选中区域以及其他界面变更，请参阅 [共享界面上下文](https://developers.openai.com/api/docs/guides/live-delegation#share-ui-context) ，用于发送简洁的更新，帮助 GPT-Live 理解用户所指的内容。

对于与后端任务绑定的结果，请使用已知的客户端委托 ID，并遵循 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update)。该 ID 不是 Responses 的响应 ID，也不是工具调用 ID。

在应用检测触发后，可以使用 instructions 来引导对话。你的服务端可以监听事件，并通过 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) （附加到现有会话）或其主 WebSocket 发送这些修正。请参阅 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 了解并发检查、操作拦截与播放控制。








## 构建对话界面

独立于后端进度显示转录文本和麦克风状态。收到助手文本并不能告诉你用户已听到了多少音频。

### 转录增量

监听 `session.input_transcript.delta` 用户语音，以及 `session.output_transcript.delta` 助手语音。每个事件都包含一个文本片段及其在会话时间轴上的区间：

```json
{
  "type": "session.input_transcript.delta",
  "event_id": "event_transcript_1",
  "delta": "What is",
  "start_ms": 1000,
  "end_ms": 1200
}
```

按顺序为每位说话者追加片段，并保留 `start_ms` 和 `end_ms`。这些是会话时间轴上的毫秒值，区间包含起点、不包含终点。它们不是挂钟时间戳、数据包到达时间，也不是精确的词级对齐。

只有包含转录文本的区间才会产生事件，网络传输也可能不均匀。不要因缺少事件就推断静音，也不要把某个片段视为完整的用户轮次。转录片段没有项目 ID，也没有权威的轮次完成事件。

处理转录片段是可选的。你可以在对话继续进行时，使用它们来更新界面、运行检查或提前开始工作。对于轻量级检查，可以考虑使用 `gpt-5.6-luna` 等低推理强度的小模型。参见 [响应转录片段](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例与连接指引。

对于对话护栏，请在用户和助手文本累积的过程中进行检查。转录传输不会在播放前提供用于审批语音的预读缓冲。参见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





如果你的界面将文本按轮次分组，请确保该分组可被修改。保留原始片段，允许用户和助手的区间重叠，并根据录制的对话调整任何间隔超时。来自另一方说话者的简短确认可能属于同一段持续交流的一部分。分组片段本身不得触发工具执行，也不得以此取消后端工作。





将转录时间与音频播放分开处理。WebSocket `session.output_audio.delta` 事件不包含时间字段，也没有 output-audio-done 事件；WebRTC 通过其媒体轨道传输音频。参见 [连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 了解音频处理方式。

### 显示字幕

构建能够在双方说话时不断增长的字幕行：

1. **保留文本。** 存储每位发言者的原始 `delta`, `start_ms`，以及 `end_ms`。按接收顺序原样拼接文本，包括空格和重复的词。不要裁剪片段，也不要在片段之间插入空格。
2. **独立更新每位发言者。** 在语音重叠时允许用户和助手行增长。在打断后保留此前的助手文本，并在助手恢复时开启新的一行。
3. **保持行稳定。** 在应用中分配展示 ID，并在文本增长时保持行顺序。不要用变化的文本或结束时间戳来推导行身份，也不要在某行收到片段时把它移到最下面。
4. **为迟到的片段重新检查分组。** 利用转录时间戳将同一发言者临近的片段分组。允许晚到的文本更新先前的行，并在保留原始片段的同时修正片段归属。这些展示分组并不是完整的语义回合；任何间隔阈值都需要在应用中测试确定。
5. **让读者控制滚动。** 在读者位于底部时跟随新文本。读者向上滚动时暂停自动滚动，并提供返回到最新字幕的方式。
6. **在状态区域展示工具进度。** 使用助手转录事件作为口头字幕。将工具活动和服务端结果显示在字幕之外；接收到结果并不代表助手已说出该内容。

使用重叠语音、简短回应、打断、长停顿以及两位说话者文本以不同速率到达时的翻译来测试显示效果。

### 控制麦克风输入

发送 `session.input_audio.mute` 可在不结束会话的情况下静音输入：

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


等待 `session.input_audio.muted` ，其中包含 `client_event_id: "mute_1"` 然后再将该命令视为已接受。要恢复输入，请发送 `session.input_audio.unmute` 并等待 `session.input_audio.unmuted`。请处理任一命令的错误。

静音输入不会停止推理、委派的工作或已生成的语音。如需相关控制，请在你的应用中分别管理麦克风采集和音频播放。

### 在调用方发言前先打招呼

若需在之后请求问候语 `session.started`:

1. 发送一条新的 `session.instructions.append` 其中 `delegation_id: null`。包含问候语、问候语使用的语言，以及明确指示在不等候来电者的情况下立即问候，然后暂停并倾听。保留现有的启动指令。
2. 等待 `session.instructions.appended`，匹配其 `client_event_id` 以响应你的命令。在继续之前处理被拒绝的命令。
3. 保持输入音频持续运行，包括来电者说话之前的静默。在 WebSocket 上，继续发送 `session.input_audio.append`；在 WebRTC 上，保持已协商的输入音频轨道处于活动状态。观察输出转录文本和音频中的问候语。

使用你的应用指定的语言，直到来电者开口说话为止；不要根据姓名、电话号码或位置来推断语言。参见 [提示词与语音模型](https://developers.openai.com/api/docs/guides/live-prompting) 了解提示词设计。

如果问候语需要遵循应用指令，请通过 `session.instructions.append`，发送这些指令，然后使用简短的 `session.commentary.append` 提示助手开始。例如：“按照提供的指令，现在开始对话。”保持输入音频持续运行，包括来电者开口前的静音部分。

指令用于请求问候语，但不保证完全准确的措辞或不被中断的播放。API 不会发出问候语完成事件，确认收到也不意味着问候语已被听到。如果音频必须逐字播放，请使用应用控制的播放方式。请使用你的应用所支持的语言和打断场景对问候语进行测试。

### 提供披露信息

使用 `session.instructions.append` 以请求披露时使用的具体措辞。 `session.commentary.append` 可能会对文本进行改写。例如，在 `session.started`，后，发送：

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


按相关说明保持输入音频持续运行 [在来电方说话前先问候](#greet-before-the-caller-speaks)。请谨慎选择发送时机：在对话过程中发送指令可能会打断正在进行中的语音。

此操作仅请求相应措辞，并不保证完全按此播报。请在标记为已送达前，核对完整的口头披露内容和实际播放情况。 `session.instructions.appended` 仅表示指令已被接受。如果要求精确的音频播放，请通过你的应用播放经过校验的录音或渲染好的音频片段，并在播放期间控制 GPT-Live 的输出。详见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





## 管理更长的对话

GPT-Live 会在长对话过程中自动管理上下文；无需任何配置参数。你在会话开始时提供的指令会在整个压缩过程中保留下来，无需重复发送。

默认上下文窗口可容纳 128,000 个 token，包括你的指令、对话文本以及未在转写中出现的音频 token。

GPT-Live 会在后台对较早的对话历史进行摘要。当上下文使用率超过 90% 时，它会在同一会话内启动替换语音引擎。该替换引擎会接收你的原始指令以及最多 8,192 个 token 的对话历史，其中包含最近的消息，并在可用时包含对较早消息的摘要。准备摘要不会立即改变正在运行引擎的上下文。





较早的对话细节可能会被摘要或省略。请将重要事实、已确认的操作以及当前任务状态保存在你的应用中，并在需要时提供相关上下文。

## 存储与分支会话

Set `store` 设置为 `true` 在会话配置中于创建时设置，以便保存录音供后续下载或分支使用。存储默认为 `false` ，并且必须为你的项目启用。下载和分支需要已完成的存储录音以及允许持久化的数据策略。录音在 30 天后过期。在零数据保留（Zero Data Retention）下， `store` 将被视为 `false`，并且录音的下载和分支不可用。请参阅 [GPT-Live 数据控制](https://developers.openai.com/api/docs/guides/your-data#v1livesessions).

例如，将此字段添加到你的 WebSocket `session` 对象中，或在你的 WebRTC 创建请求中添加： `session.start` 事件中：

```json
{
  "store": true
}
```

从以下位置保存源会话 ID： `session.started` 或 WebRTC 创建响应。分支会从一个 **新会话开始，并使用新的 ID** 从存储的会话状态生成。它不会重新打开原始连接，也不会复用源会话 ID。

通过你的应用程序所使用的传输方式启动分支：

| 传输方式 | 启动 fork                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | 连接到 `wss://api.openai.com/v1/live/sessions/{source_session_id}/fork`.                                                                     |
| WebRTC    | 向...发送新的 SDP offer `POST /v1/live/sessions/{source_session_id}/fork`. 将返回的 `transport.sdp` answer 应用到新的 peer connection。 |

fork 会继承已存储的会话配置，但需遵守下文的传输规则。对于 WebSocket fork，请发送 `session.start` ，并附带一个必需的 `session` 对象； `{}` 不提供任何覆盖项。不要提供新的 model，也不要重复原始的 instructions 或 input。你可以覆盖 `store`、Responses delegation 设置以及新的 WebSocket 音频格式。WebRTC fork 可以覆盖 `store`、Responses delegation 设置以及前端客户端权限。在 fork 上省略 `store` 会继承源会话的设置。

WebSocket fork 不会 **不** 继承源会话的音频格式：请显式设置 `audio.format` ，或使用默认的 PCM16 24 kHz。它还会丢弃继承的前端数据通道权限。WebRTC fork 会协商其音频格式并拒绝 `audio.format`；除非你另行覆盖，否则会保留前端权限设置。

等待 `session.started` 之后才能继续发送 WebSocket 命令。WebRTC 通过 HTTP 请求启动，其数据通道上不得再收到一次 `session.start` 。

### 启动 WebSocket fork

Set `OPENAI_API_KEY`. 这些示例使用由你的应用程序保存的已存储源会话 ID。它们会确认启动，然后关闭该分支。若要继续对话，请在之后通过 `session.started` 使用 [WebSocket 连接流程](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。请参阅 [fork WebSocket 参考](https://developers.openai.com/api/reference/resources/live/fork-websocket) 了解启动字段和事件。

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

在前端创建一个新的 SDP offer 并发送到后端。以下后端示例会使用该 offer 以及你应用中保存的源会话 ID：

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


将响应返回到你的前端，应用 `transport.sdp` 作为新对等连接的 answer，并保留新的 `session.id`。在后端保留 API 密钥。

将新的会话 ID 用于后续带外连接和会话控制。应用任务状态请单独保存：恢复会话状态并不代表某个挂起的后端操作已执行完成。在重试某个操作之前，请先核对不确定的结果。如果没有保存的可派生会话，请， [使用已保存的历史记录创建一个新会话](#seed-a-session-with-prior-conversation).

### 下载录音

在存储的录音完成后，使用以下命令下载其音频 `GET /v1/live/sessions/{session_id}/content`。响应是二进制立体声 WAV，输入音频位于左声道，输出音频位于右声道。示例使用你应用中的存储会话 ID，并将响应流式传输到 `recording.wav`:

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


## 处理错误并结束会话

持续读取会话事件，直至会话结束。请区分被拒绝的命令、失败的连接以及已完成的会话，以便应用能够进行适当的恢复。

### 处理被拒绝的命令

Read `error` events alongside acknowledgments. When present, `error.client_event_id` identifies the outgoing command that failed:

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

An error code can be `null`, and an error may lack a client event ID. Handle those cases without assuming a command succeeded. For an immutable-field error, keep the current configuration or create a new session with the intended settings.

### 处理审核

审核会以两种方式影响会话：

- 某些审核事件会终止会话。
- 其他事件会截断助手在当前语音片段中剩余的音频，并发出一个 `error` 事件，但不终止会话。

Read `error` 事件，即使音频正在播放时也会发生。不要假设每次审核错误都会关闭会话，也不要将音频中断视为连接失败。请让应用状态与会话生命周期保持一致，并且不要把被打断的语音消息标记为已完整送达。应用层 [对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 仍然与内置的此审核行为相互独立。

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

这些是快照，而非可累加的增量。后端令牌用量是独立的；请在嵌套的 Responses 完成事件中保留它。参见 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) 了解用量核算。

要优雅地关闭：

1. 完成应用程序所需的全部已委派 Responses 工作，包括待处理的函数结果和响应延续。
2. 在发送 `session.closed` 监听器之前，先发送 `session.close`.
3. 发送 `session.close` 并停止向该会话提交新工作。在待处理的会话事件排空期间，保持 WebSocket 或 WebRTC 连接、数据通道以及任何已附加的边带接收器处于活跃状态。
4. 读取最终的 `usage.seconds`, `reason`，以及来自 `session.closed`。的会话快照。保留已通过 `response.event`.
5. 接收到的委派用量。在该事件之后清理传输通道和音频设备。如果终结化失败或超过你设置的超时，请报告终结化未完成并释放相关资源。

发送 `session.close` 会取消已排队的 Responses 并拒绝后续命令。一个活跃的 response 可以完成，但等待函数结果的 response 在关闭开始后无法继续。请单独决定是完成还是取消你的应用通过客户端委托运行的工作。

该 `session.closed` 事件用于确立结束状态；其中嵌入的 session 是一个配置快照。仅关闭 socket 并不确立成功，并且在有效的结束事件之后的传输关闭代码不会使结束状态无效。在发送该命令后立即关闭 WebRTC 可能会导致无法收到结束事件。

结束事件的 `reason` 说明了 session 结束的原因：

| 原因            | 含义                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `close_requested` | 你的应用发送了 `session.close` 或调用了 hangup 端点。 |
| `expired`         | 会话已达到其时长限制。                              |
| `content`         | 安全过滤器结束了该会话。                                   |
| `remote_hangup`   | 远程主连接已正常结束。                      |
| `connection_lost` | 主连接或上游连接意外中断。            |

一个 `session.closed` 该事件即使在因连接丢失或安全终止而结束时也能确认对话已最终化。若缺少该事件，最终用量将无法得到确认。已存储的会话在保存录制内容时可能需要更长时间才能最终化；请选择一个能够涵盖存储耗时的应用超时时间。

### 从失败的连接中恢复

HTTP 会话创建错误表示该会话未能到达 `session.started`。将启动阶段的错误与运行中会话的错误分开处理。如果运行中的连接在 `session.closed`，之前失败，请保留最近一次观察到的用量，并将最终用量标记为未确认。

如果存在已存储的会话， [分叉它](#store-and-fork-a-session) 以从其保存状态启动新会话。否则，使用相关保存的历史记录创建替代会话。重试前先与后端协调待处理的操作，并抑制来自上一次会话的过期结果。请显式恢复应用状态，不要假设新连接会恢复上一个会话或其待处理任务。