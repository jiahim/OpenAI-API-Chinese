# 管理 GPT-Live 会话

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

在连接到 GPT-Live 后 [连接到 GPT-Live](https://developers.openai.com/api/docs/guides/live)，使用会话事件更新上下文、显示转写文本，并管理连接的生命周期。模型可以同时监听和说话，因此请在应用中分别管理接收到的事件、音频播放和后端任务状态。

本指南假定你的连接已发出 `session.started`。请参阅 [连接](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 了解连接建立与音频流传输，参阅 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解后端任务。





## 配置会话

在创建会话时选择模型、语音和委托模式。为对话提供模型指令并附带相关历史记录。随着对话推进，GPT-Live 会自动管理上下文。

### 配置字段

| 设置      | 在启动时配置                                                                                | 在会话期间更改                            |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 模型        | 设置所需 `model`.                                                                           | 开启新会话以更改它。                    |
| 指令 | 设置 `instructions` 用于对话行为,最多 16,384 个 token。                                  | 使用以下方式添加指令 `session.instructions.append`. |
| 历史      | 设置 `input` 到相关的前序文本消息。默认为 `[]`.                                   | 追加上下文；不要替换启动历史。   |
| 语音        | 设置 `audio.output.voice` 为受支持的语音或已授权的自定义语音。默认为 `marin`.   | 开启新会话以更改它。                    |
| 委托   | 设置 `delegation.type` 为 `client` 或 `responses`。省略或 `null` 委托则选择客户端模式。 | 在现有模式下更新 Responses 设置。  |
| 存储      | 设置 `store` 为 `true` 以使该会话可用于派生。默认值为 `false`.            | 启动时选择。                                   |

### 语音选项

在创建会话时选择语音。设置 `audio.output.voice` 为 API 名称，例如 `"quartz"`。GPT-Live 包含以下额外的语音选项：

| 语音    | API名称   | 语言   | 地区影响 | 呈现方式 | 来源    |
| -------- | ---------- | ---------- | ------------------ | ------------ | --------- |
| Quartz   | `quartz`   | 英语    | 澳大利亚         | 阴性     | 生成 |
| Ripple   | `ripple`   | 英语    | 澳大利亚         | 阳性    | 自然   |
| Vesper   | `vesper`   | 英语    | 英式            | 阳性    | 自然   |
| Willow   | `willow`   | 英语    | 爱尔兰              | 阴性     | 自然   |
| Stone    | `stone`    | 英语    | 爱尔兰              | 阳性    | 自然   |
| Gleam    | `gleam`    | 英语    | 北美     | 阴性     | 自然   |
| Meridian | `meridian` | 英语    | 北美     | 阳性    | 自然   |
| Bossa    | `bossa`    | 葡萄牙语 | 巴西          | 阴性     | 自然   |
| Tempo    | `tempo`    | 葡萄牙语 | 巴西          | 阳性    | 自然   |
| Beacon   | `beacon`   | 英语    | 菲律宾语           | 阳性    | 生成 |
| Delta    | `delta`    | 英语    | 美国南部      | 阴性     | 生成 |
| Cinder   | `cinder`   | 英语    | 美国南部      | 阳性    | 生成 |

区域影响描述的是声音的说话风格，而非对口音还原度的保证。如需通过你自己的录音创建已批准的声音，请参阅 [自定义声音](https://developers.openai.com/api/docs/guides/custom-voices).





对于 WebSocket，请在启动时选择共享 `audio.format` ，且会话期间无法更改。对于 WebRTC，请省略此字段，因为连接会协商其音频格式。请参阅 [WebSocket 音频格式](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 了解格式与流式传输详情。

### 更新一个活跃会话

使用 `session.update` 对以下字段的更改 `session.delegation.responses` 在已使用 Responses 委托的会话中。仅发送你希望更改的设置；未发送的设置保留其原值。参见 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 了解相关设置以及如何更新 工作流。

启动后无法更改委托模式。特别是，将 `delegation` 设置为 `null` 会选择客户端模式；但不会重置 Responses 会话。启动时使用的字段 `model`, `instructions`, `input`, `audio`，和 `store` 不接受作为更新字段。未知配置字段将被拒绝。

一次成功的更新会发出 `session.updated` ，其中包含完整解析后的会话配置。当你提供 `event_id`，时，确认消息会将其原样返回为 `client_event_id`。请检查 [被拒绝的命令](#handle-rejected-commands) 以及确认消息。接受仅代表配置更新已生效，并不代表后端任务已运行或模型已发言。

## 提供历史记录和上下文

使用启动历史延续话题，并在对话推进时追加相关上下文。将可信的应用指令与用户消息和事实结果分开保存。

### 使用先前的对话为会话植入种子

在创建会话时包含先前的文本消息 `session.input` 例如，添加此字段到你的 `input` 会话创建配置 [会话创建配置](https://developers.openai.com/api/docs/guides/live#connect-your-first-session):

```javascript
/** @type {import("openai/resources/live/live").SessionConfig} */
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


该列表最多接受 128 条消息和总计 8,192 个 token。支持的角色为 `developer`, `user`，和 `assistant`，每条包含一个文本部分。开发者和用户消息使用 `input_text`；助手消息使用 `text` 或 `output_text`。将可信的应用指令放入 `instructions` 或开发者消息中。该列表不接受 `system` 角色。

为下一次交互选择所需的历史记录。 `input` 是启动字段，而不是在运行中的会话内替换历史记录的方式。它也不接受 Responses 委派中所使用的全部后端输入项。

### 了解上下文何时到达模型

完整的 `input` 在会话创建时提供的内容会在会话开始时供模型使用。将模型从一开始就需要的信息放在此字段中。

在正在运行的会话期间， `session.instructions.append`, `session.thinking.append`，和 `session.commentary.append` 事件会随时间将内容送入模型。这些事件的确认会一直等待，直到帧进度达到估计的上下文注入结束点。返回的 `start_ms` 和 `end_ms` 描述的是会话时间线上的估计区间，而不是语音或播放的完成情况。它们并不能证明模型已消费完整个更新。不要假设其下一段语音会反映整个更新。

如果帧进度停止，确认可能会一直处于待处理状态。关闭会话时，会报告待处理 append 的错误。通过 `event_id` 将每个确认与发出的 `client_event_id`，进行匹配，并在等待时持续处理错误。

### 在对话过程中添加上下文

根据模型应如何使用该更新来选择事件：

- `session.instructions.append`: 添加可影响行为和发言的可信应用指令。
- `session.thinking.append`: 添加事实性上下文，但不要求模型立即说出来。
- `session.commentary.append`: 提供供模型朗读的信息，模型可能会进行改写。

每个事件接受纯文本字符串 `content` （最多 500 个 token）以及必需的 `delegation_id`。使用 `null` 来提供会话级别的上下文。例如，在你的应用验证用户接受并开始查询后发送：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


等待 `session.thinking.appended` 响应 `client_event_id: "context_1"`，或处理错误。确认（acknowledgment）仅表示上下文已被接受，并不表示语音、播放或外部动作已完成。

静默上下文会影响后续语音，但它不是隐私边界。请将凭据、密钥以及模型绝不能透露的文本排除在这三种事件之外。使用 instructions 事件来承载由应用编写的行为，而非来自不可信工具的输出。在你的应用中强制执行权限和必需的确认。

有关页面导航、选择和其他 UI 变更，请参阅 [共享 UI 上下文](https://developers.openai.com/api/docs/guides/live-delegation#share-ui-context) ，发送简洁的更新以帮助 GPT-Live 理解用户所指的内容。

对于与后端任务绑定的结果，请使用已知的客户端委托 ID 并遵循 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update)。该 ID 不是 Responses 响应 ID 或工具调用 ID。

在应用检查触发后，可使用 instructions 来引导对话。你的服务器可以监听事件，并通过附加到现有会话的 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) ，或通过该会话的主 WebSocket 发送这些更正。请参阅 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) ，了解并发检查、动作阻止和播放控制。








## 构建对话界面

独立于后端进度显示转录文本和麦克风状态。收到助手文本并不能告诉你用户已经听到了多少音频。

### 转录增量

监听 `session.input_transcript.delta` 用户的语音，以及 `session.output_transcript.delta` 助手的语音。每个事件包含一段文本片段及其在会话时间线上的区间：

```json
{
  "type": "session.input_transcript.delta",
  "event_id": "event_transcript_1",
  "delta": "What is",
  "start_ms": 1000,
  "end_ms": 1200
}
```

按顺序为每位发言者追加片段，并保留 `start_ms` 和 `end_ms`。这些是会话时间线上的毫秒值，区间包含起点、不包含终点。它们不是挂钟时间戳、数据包到达时间，也不是精确的词级对齐。

只有包含转录文本的区间才会生成事件，且网络传输可能不均匀。不要从缺失的事件推断静默，也不要将某个片段视为完整的用户轮次。转录片段没有 item ID，也没有权威的“轮次完成”事件。

处理转录片段是可选的。你可以在会话继续进行的同时，用它们更新 UI、运行检查或提前启动工作。对于轻量级检查，可以考虑使用 `gpt-5.6-luna` 并设置较低的推理努力程度。参见 [响应转录片段](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例和连接指引。

对于会话护栏，应在用户和助手文本不断累积的过程中进行检查。转录传输不会在播放前提供用于审批语音的预读缓冲区。参见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





如果你的界面将文本分组为轮次，请保持该分组是可调整的。保留原始片段，允许用户和助手的区间相互重叠，并根据录制的会话调整任意间隙超时。对方发言者的简短确认可能属于一次进行中的交流的一部分。仅对片段进行分组本身不得触发工具执行或取消后端工作。





将转录时序与音频播放分开处理。WebSocket `session.output_audio.delta` 事件不包含时序字段，也没有 output-audio-done 事件；WebRTC 通过其媒体轨道传输音频。参见 [连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 了解音频处理方式。

### 显示说明文字

构建可在双方同时说话时不断增长的字幕行：

1. **保留文本。** 存储每位发言者的原文 `delta`, `start_ms`，以及 `end_ms`。按收到的原样拼接文本，包括空格和重复出现的词。不要裁剪片段，也不要在片段之间插入空格。
2. **独立更新每位发言者。** 允许用户和助手行在语音重叠期间增长。被中断后保留先前的助手文本可见，并在助手恢复时开启新的一行。
3. **保持行稳定。** 在你的应用中分配显示 ID，并在文本增长时保持行顺序。不要用变化的文本或结束时间戳来推导行身份，也不要在行接收到片段时将其移到底部。
4. **重新审视对延迟片段的分组。** 使用转写时间戳将同一发言者的附近片段分组。允许延迟文本更新先前的行，并修订片段的归属，同时保留原始片段。这些显示分组不是完整的语义回合；任何间隔阈值都是应用层自行选择并测试的。
5. **让读者控制滚动。** 当读者位于底部时跟随新增文本。当他们向上滚动时暂停自动滚动，并提供一种返回到最新字幕的方式。
6. **在状态区域中显示工具进度。** 将助手转写事件用于口语字幕。工具活动和后端结果显示在字幕之外；收到结果并不意味着助手已经说出来。

使用重叠语音、简短的应答、打断、长时间的停顿以及两位说话者文本以不同速率到达的翻译，来测试显示效果。

### 控制麦克风输入

Send `session.input_audio.mute` 以静音输入而不结束会话：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


等待 `session.input_audio.muted` 响应 `client_event_id: "mute_1"` 再将该命令视为已接受。要恢复输入，请发送 `session.input_audio.unmute` 并等待 `session.input_audio.unmuted`。处理任一命令的错误。

静音输入不会停止推理、委托工作或已生成的语音。在需要时，请在你的应用中单独控制麦克风采集和音频播放。

### 在来电者说话前先问候

若要在之后请求问候语 `session.started`:

1. 发送一条新的 `session.instructions.append` ，其中 `delegation_id: null`。包含问候语、其语言，以及明确指示立刻进行问候（不要等待来电者），随后暂停并倾听。保留现有的启动指令。
2. 等待 `session.instructions.appended`，并与你的指令匹配。 `client_event_id` 以匹配你的命令。处理被拒绝的命令后再继续。
3. 保持输入音频持续运行，包括来电者说话前的静默。在 WebSocket 上继续发送 `session.input_audio.append`；在 WebRTC 上，保持已协商的输入音频轨道处于活跃状态。观察输出转写和音频以确认问候语。

在来电者开口之前，使用你的应用所指定的语言；不要根据姓名、电话号码或所在地区来推断语言。参见 [为语音模型设计提示](https://developers.openai.com/api/docs/guides/live-prompting) 了解提示设计。

如果问候语需要遵循应用指令，请通过 `session.instructions.append`，一并发送这些指令，然后使用一条简短的 `session.commentary.append` 来提示助手开始。例如：“Begin the conversation now, following the instructions provided.”保持输入音频持续运行，包括来电者开口之前的静默段。

指令只是请求一个问候语，并不保证措辞完全一致或播放不被打断。API 不会发出问候完成事件，确认收到也不代表问候语已被听到。如果音频必须逐字播放，请使用应用控制的播放方式。使用你的应用所支持的语言和打断场景测试你的问候语。

### 提供披露声明

使用 `session.instructions.append` 以请求一条具体的披露措辞。 `session.commentary.append` 可能会对文本进行意译。例如，之后 `session.started`，可以发送：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


如所述保持输入音频持续运行，请参阅 [在来电者说话前先打招呼](#greet-before-the-caller-speaks)。请审慎选择投递时机：在对话过程中发送的指令可能会打断正在进行的语音。

这只是请求该措辞，并不保证完全按此播放。在将其标记为已交付之前，请核对完整的口播披露内容以及实际播放情况。 `session.instructions.appended` 仅表示指令已被接受。如果要求完全一致的音频交付，请通过你的应用播放一段经过核验的录音或渲染片段，并在播放期间控制 GPT-Live 的输出。详见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





## 管理较长的对话

GPT-Live 会在长对话过程中自动管理上下文，无需任何配置参数。你在会话开始时提供的指令会在压缩过程中始终保留，无需重新发送。

默认上下文窗口为 128,000 个 token，包含你的指令、对话文本以及未在转写文本中出现的音频 token。

GPT-Live 会在后台对较早的对话历史进行摘要。当上下文使用率超过 90% 时，它会在同一会话中启动替换语音引擎。替换引擎会接收你的原始指令以及最多 8,192 个 token 的对话历史，其中包含最近的消息，并在可用时包含对较早消息的摘要。生成摘要不会立即改变当前运行引擎的上下文。





较早的对话细节可能会被摘要或省略。请将重要事实、已确认的操作以及当前任务状态保存在你的应用中，并在需要时提供相关上下文。

## 存储并分支会话

Set `store` 设置为 `true` 在创建时的会话配置中设置，以保存录音供后续下载或分叉。存储默认为 `false` ，并且必须为你的项目启用。下载和分叉需要已完成的存储录音以及允许持久化的数据策略。录音将在 30 天后过期。在零数据保留（Zero Data Retention）下， `store` 将被视为 `false`，并且录音下载和分叉不可用。请参阅 [GPT-Live 数据控制](https://developers.openai.com/api/docs/guides/your-data#v1livesessions).

例如，将此字段添加到你的 WebSocket `session` 对象中，在你的 WebSocket `session.start` 事件或 WebRTC 创建请求中：

```json
{
  "store": true
}
```

从 `session.started` 或 WebRTC 创建响应中保存源会话 ID。分叉会启动一个 **使用新 ID 的新会话** ，从已存储的会话状态创建。它不会重新打开原始连接，也不会复用源会话 ID。

通过你的应用程序所使用的传输方式启动分叉：

| 传输 | 启动 fork                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | 连接到 `wss://api.openai.com/v1/live/sessions/{source_session_id}/fork`.                                                                     |
| WebRTC    | 发送新的 SDP offer 至 `POST /v1/live/sessions/{source_session_id}/fork`。应用返回的 `transport.sdp` answer 到新的对等连接。 |

分支会继承已存储的会话配置，但需遵循下方的传输规则。对于 WebSocket 分支，请发送 `session.start` ，其中需要一个 `session` 对象； `{}` 不提供任何覆盖参数。不要提供新的模型，也不要重复原始的指令或输入。你可以覆盖 `store`、Responses 委派设置以及新的 WebSocket 音频格式。WebRTC 分支可以覆盖 `store`、Responses 委派设置以及前端客户端权限。如果省略 `store` ，分支将继承源会话的该设置。

WebSocket 分支 **不会** 继承源会话的音频格式：请显式设置 `audio.format` ，或使用默认的 24 kHz PCM16。同时，它会丢弃已继承的前端数据通道权限。WebRTC 分支会协商其音频格式，并拒绝 `audio.format`；除非你进行覆盖，否则它们会保留前端权限设置。

等待 `session.started` 后再发送进一步的 WebSocket 命令。WebRTC 通过 HTTP 请求启动，并且不得在数据通道上再收到一个 `session.start` 。

### 启动 WebSocket fork

Set `OPENAI_API_KEY`. 这些示例使用你的应用程序保存的已存储源会话 ID。它们确认启动，然后关闭该分支。若要继续对话，在 `session.started` 使用 [WebSocket 连接流程](https://developers.openai.com/api/docs/guides/voice-websockets?api=live). 参见 [fork WebSocket 参考](https://developers.openai.com/api/reference/resources/live/fork-websocket) }

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


### 启动 WebRTC fork

在前端创建一个新的 SDP offer，并将其发送到你的后端。以下后端示例使用该 offer 以及你在应用中存储的源会话 ID：

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


将响应返回到你的前端，应用 `transport.sdp` 作为新对等连接的 answer，并保留新的 `session.id`。将 API 密钥保存在你的后端。

将新的会话 ID 用于后续的带外连接和会话控制。请单独保留应用任务状态：恢复会话状态并不能确认某个待处理的后端操作已完成。在重试某个操作之前，请协调不确定的结果。如果你没有可存储的会话可供分叉， [使用保存的历史记录创建一个新会话](#seed-a-session-with-prior-conversation).

### 下载录音

在存储的录音完成最终处理后，使用以下方式下载其音频： `GET /v1/live/sessions/{session_id}/content`. 响应是二进制立体声 WAV 文件，输入音频在左声道，输出音频在右声道。示例使用你应用中的存储会话 ID，并将响应流式传输到 `recording.wav`:

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

持续读取会话事件，直到会话结束。请区分被拒绝的命令、连接失败和已完成的会话，以便你的应用能够进行合适的恢复。

### 处理被拒绝的命令

读取 `error` 事件以及确认结果。如果存在，它， `error.client_event_id` 标识失败的传出命令：

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

错误代码可以 `null`，并且错误可能缺少客户端事件 ID。请在处理这些情况时不要假设命令已成功。对于不可变字段错误，请保留当前配置，或使用预期设置创建一个新的会话。

### 处理内容审核

Moderation 可以通过两种方式影响会话：

- 部分审核事件会结束会话。
- 其他事件会在当前语音剩余时段内切断助手音频，并发出 `error` 事件，但不结束会话。

读取 `error` 事件，即使在音频播放期间也是如此。不要假设每次审核错误都会关闭会话，也不要将音频中断视为连接失败。保持应用状态与会话生命周期一致，并且不要将被打断的口语消息标记为已完全交付。应用层 [会话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 与内置审核行为仍然是分开的。

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

这些是快照，而非可累加的增量。Backend token 用量是独立统计的；在嵌套的 Responses 完成事件中请保留它。参见 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) 以了解用量核算方式。

如需优雅关闭：

1. 完成应用需要的所有已委托 Responses 工作，包括待处理的函数结果和响应延续。
2. 在发送前安装 `session.closed` 监听器 `session.close`.
3. 发送 `session.close` 并停止向会话提交新工作。在待处理会话事件排空期间，保持 WebSocket 或 WebRTC 连接、数据通道以及任何已附加的边带接收器处于活动状态。
4. 读取最终的 `usage.seconds`, `reason`，以及来自 `session.closed`。的会话快照。保留已通过 `response.event`.
5. 在该事件之后清理传输层和音频设备。如果终结化失败或超出你设置的超时，请报告终结化未完成并释放这些资源。

发送 `session.close` 会取消已排队的 Responses 并拒绝后续命令。活跃的响应可以完成，但正在等待函数结果的响应在开始关闭后无法继续。请单独决定是完成还是取消你的应用通过客户端委托运行的工作。

该 `session.closed` 事件用于确认结束；其中嵌入的会话是配置快照。仅关闭套接字本身并不代表成功，在有效结束事件之后的传输关闭码也不会使结束失效。在发送完命令后立即关闭 WebRTC 可能导致无法送达结束事件。

结束事件的 `reason` 说明会话结束的原因：

| 原因            | 含义                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `close_requested` | 你的应用发送 `session.close` 或调用了 hangup 端点。 |
| `expired`         | 会话已达到其时长上限。                              |
| `content`         | 安全过滤器结束了该会话。                                   |
| `remote_hangup`   | 远程主连接正常结束。                      |
| `connection_lost` | 主连接或上游连接意外丢失。            |

一个 `session.closed` 事件可在因连接断开或安全终止而结束时仍然确认会话已完结。若缺少该事件，最终的使用情况将无法确认。已存储的会话在保存录制内容时可能需要更长时间才能完结；请选择一个能容纳存储所需时间的应用超时。

### 从失败的连接中恢复

HTTP 会话创建错误意味着会话未能到达 `session.started`。请将会话启动错误与会话运行中的错误分开处理。如果运行中的连接在 `session.closed`，之前失败，保留最近观察到的用量，并将最终用量标记为未确认。

如果有可用的已存储会话， [分叉该会话](#store-and-fork-a-session) 以从其已保存的状态启动一个新会话。否则，使用相关的已保存历史记录创建一个替代会话。在重试待处理操作之前，将它们与你的后端进行协调，并抑制来自上一个会话的陈旧结果。请显式恢复应用状态，而不要假设新的连接会恢复上一个会话或其待处理的工作。