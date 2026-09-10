# 管理 GPT-Live 会话

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在 [连接到 GPT-Live 后](https://developers.openai.com/api/docs/guides/live)，使用会话事件来更新上下文、显示转录内容并管理连接的生命周期。模型可以同时进行听和说，因此请在你的应用中分别处理接收到的事件、音频回放和后端任务状态。

本指南假定你的连接已发出 `session.started`。请参阅 [连接](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 以了解连接设置和音频流传输，以及 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 以了解后端工作。





## 配置会话

在创建会话时选择模型、语音和委托模式。为模型提供对话指令并包含相关历史记录。GPT-Live 会在对话进行时自动管理上下文。

### 配置字段

| 设置      | 在启动时配置                                                                                | 在会话期间更改                            |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 模型        | 设置所需的 `model`.                                                                           | 开启新会话来更改。                    |
| 指令 | 设置 `instructions` 以控制对话行为，最多 16,384 个 token。                                  | 使用以下方式添加指令 `session.instructions.append`. |
| History      | 设置 `input` to relevant prior text messages. It defaults to `[]`.                                   | 追加上下文；不要替换启动历史。   |
| 语音        | 设置 `audio.output.voice` 到受支持的声音或经授权的自定义声音。默认值为 `marin`.   | 开启新会话来更改。                    |
| 委派   | 设置 `delegation.type` 到 `client` 或 `responses`。省略或 `null` 委派将选择客户端模式。 | 在现有模式下更新 Responses 设置。  |
| 存储      | 设置 `store` 到 `true` 以使会话可用于派生。它默认为 `false`.            | 在启动时选择。                                   |

### 语音选项

在创建会话时选择语音。请将 `audio.output.voice` 设置为 API 名称，例如 `"quartz"`。GPT-Live 包含以下额外的语音选项：

| 语音    | API 名称   | 语言   | 地域影响 | 呈现风格 | 来源    |
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
| Delta    | `delta`    | 英语    | 美式南方      | 阴性     | 生成 |
| Cinder   | `cinder`   | 英语    | 美式南方      | 阳性    | 生成 |

区域影响描述的是某个语音的说话风格，并不保证口音的准确性。若想使用基于你自己的录音创建的已批准语音，请参阅 [自定义语音](https://developers.openai.com/api/docs/guides/custom-voices).





对于 WebSocket，请选择共享的 `audio.format` 在启动时设置，会话期间不可更改。对于 WebRTC，请省略该字段，因为连接会协商其音频格式。请参阅 [WebSocket 音频格式](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 了解格式和流式传输详情。

### 更新实时会话

使用 `session.update` 来更改 `session.delegation.responses` 。仅发送你想要更改的设置；未发送的设置保留其原有值。参见 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 以了解相关设置并更新 工作流。

启动后无法更改委托模式。特别需要注意的是，将 `delegation` 设置为 `null` 会选中客户端模式；它不会重置 Responses 会话。启动字段 `model`, `instructions`, `input`, `audio`，和 `store` 不是可接受的更新字段。未知配置字段将被拒绝。

更新成功时会发出 `session.updated` ，其中包含完整解析后的会话配置。当你提供 `event_id`，时，确认响应会将其返回为 `client_event_id`。请同时检查 [已拒绝的命令](#handle-rejected-commands) 以及确认响应。接受仅表示配置更新已确认，并不代表后端任务已运行或模型已发言。

## 提供历史记录和上下文

使用启动历史来延续某个话题，并在对话进行时追加相关上下文。将可信的应用指令与用户消息及事实性结果分开存放。

### 使用先前的对话为会话植入种子

在创建会话时包含之前的文本消息 `session.input` 时，请添加以下内容。例如，将此 `input` 字段添加到你的 [会话创建配置](https://developers.openai.com/api/docs/guides/live#connect-your-first-session):

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


该列表最多接受 128 条消息，总计 8,192 个 token。支持的角色包括 `developer`, `user`，和 `assistant`，每条消息包含一个文本部分。开发者和用户消息使用 `input_text`；助手消息使用 `text` 或 `output_text`。将可信的应用指令放入 `instructions` 或开发者消息中。该列表不接受 `system` 角色。

选择下一次交互所需的历史记录。 `input` 是一个启动字段，而不是在运行中的会话内替换历史记录的方式。它也不接受 Responses 委派中使用的全部后端输入项范围。

### 理解上下文何时到达模型

完整 `input` 在会话开始时模型即可使用。把模型从一开始就需要的内容放在这个字段中。

在正在运行的会话期间， `session.instructions.append`, `session.thinking.append`，和 `session.commentary.append` 事件会随时间把内容注入模型。它们的确认会等到帧进度达到上下文注入的预计结束位置。所返回的 `start_ms` 和 `end_ms` 描述的是会话时间线上的预计范围，而不是语音或播放完成。这并不证明模型已消费完整个更新。不要假设其下一段语音会反映整个更新。

如果帧进度停止，确认可能一直处于等待状态。关闭会话时，pending appends 会报错。将每条确认与发出的 `event_id` 通过 `client_event_id`，进行匹配，并在等待期间持续处理错误。

### 在对话期间添加上下文

根据模型应如何使用更新来选择事件：

- `session.instructions.append`: 添加可信的应用程序指令，影响行为和发言。
- `session.thinking.append`: 添加事实性上下文，但不要求模型立即说出。
- `session.commentary.append`: 提供供模型大声朗读的信息，模型可能会进行转述。

每个事件都以纯字符串 `content` 形式提供，最多 500 个 token，以及必填的 `delegation_id`。使用 `null` 用于会话级上下文。例如，在你的应用验证用户已接受并开始查找后发送：

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


等待 `session.thinking.appended` 配合 `client_event_id: "context_1"`，或处理错误。该确认表示上下文已被接受，但并不确认语音、播放或外部操作的完成。

静默上下文会影响后续语音；它不是隐私边界。凭据、密钥以及模型绝不能透露的文本必须保留在所有三类事件之外。使用指令事件来承载应用编写的行为，而不是不受信任的工具输出。权限和必要的确认由你的应用强制实施。

关于页面导航、选择以及其他 UI 变更，请参阅 [分享 UI 上下文](https://developers.openai.com/api/docs/guides/live-delegation#share-ui-context) ，以便提供简洁的更新，帮助 GPT-Live 理解用户所指的内容。

对于与后端任务相关的结果，请使用已知的客户端委托 ID 并遵循 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update)。该 ID 不是 Responses 响应 ID 或工具调用 ID。

在应用检查触发后，使用指令来引导对话。你的服务器可以监听事件，并通过附加到现有会话的 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) ，或通过该会话的主 WebSocket 发送这些更正。请参阅 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) ，了解并发检查、操作拦截和播放控制。








## 构建对话界面

独立于后端进度来展示转录文本和麦克风状态。接收到助手文本并不能告诉你用户已听到了多少音频。

### 转录增量

监听 `session.input_transcript.delta` 用户语音并 `session.output_transcript.delta` 助手语音。每个事件包含一个文本片段及其在会话时间轴上的区间：

```json
{
  "type": "session.input_transcript.delta",
  "event_id": "event_transcript_1",
  "delta": "What is",
  "start_ms": 1000,
  "end_ms": 1200
}
```

按顺序追加每个说话人的片段，并保留 `start_ms` 和 `end_ms`。这些是会话时间轴上以毫秒为单位的时间值，区间包含起点且不包含终点。它们不是挂钟时间戳、数据包到达时间，也不是精确的词对齐。

只有包含转录文本的区间才会产生事件，且网络传输可能不均匀。不要从缺失的事件推断静默，也不要将一个片段视为完整的用户轮次。转录增量没有 item ID，也没有权威的轮次完成事件。

处理转录片段是可选的。你可以使用它们来更新 UI、运行检查，或在对话继续时提前开始工作。对于轻量级检查，可以考虑使用 `gpt-5.6-luna` 这类小模型，并设置低推理努力度。参见 [对转录片段作出响应](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例与连接指引。

对于对话护栏，请随着用户和助手累积文本的到来进行检查。转录传输不提供在播放前审批语音的提前缓冲区。参见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





如果你的界面将文本分组为轮次，请保持该分组可修订。保留原始片段，允许用户和助手的区间重叠，并根据录制的对话调整任何间隔超时。来自另一方的简短确认可能属于正在进行的交流的一部分。对片段进行分组本身不得触发工具执行，也不得取消后端工作。





将转录时序与音频播放分开处理。WebSocket `session.output_audio.delta` 事件没有时序字段，也没有 output-audio-done 事件；WebRTC 通过其媒体轨道传输音频。参见 [连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 了解音频处理方式。

### 显示字幕

构建可在双方同时说话时增长的字幕行：

1. **保留原文文本。** 存储每位说话者的原始文本 `delta`, `start_ms`，以及 `end_ms`。按接收到的顺序原样拼接文本，包括空格和重复的词语。不要裁剪片段，也不要在片段之间插入空格。
2. **独立更新每位说话者。** 允许用户和助手行在重叠语音期间增长。打断后保留较早的助手文本可见，并在助手恢复时开启新的一行。
3. **保持行稳定。** 在你的应用中分配展示用 ID，并随着文本增长保持行顺序。不要用会变化的文本或结束时间戳来推导行的身份，也不要在某行收到片段时就把它移到最下面。
4. **为晚到的片段重新审视分组。** 使用转写时间戳把同一说话者邻近的片段归为一组。允许晚到的文本更新较早的行，并在保留原始片段的同时修订片段分配。这些展示分组并不是完整的语义轮次；任何间隔阈值都应由应用自行选择并测试。
5. **让读者掌控滚动。** 当读者位于底部时跟随新文本。当读者向上滚动时暂停自动滚动，并提供返回到最新字幕的方式。
6. **在状态区域显示工具进度。** 使用助手转写事件来显示口述字幕。在字幕之外展示工具活动和后端结果；收到结果并不代表助手已经把它说出来。

使用重叠语音、简短确认、打断、长停顿以及两位说话者文本到达速率不同的情况下的翻译，来测试显示效果。

### 控制麦克风输入

Send `session.input_audio.mute` 以在不移除会话的情况下将输入设为静音：

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


等待 `session.input_audio.muted` 配合 `client_event_id: "mute_1"` 之后再将该命令视为已接受。若要恢复输入，请发送 `session.input_audio.unmute` 并等待 `session.input_audio.unmuted`。处理任一命令的错误。

静音输入不会停止推理、委托的工作或已生成的语音。当需要时，在你的应用中分别控制麦克风采集和音频播放。

### 在来电者开口之前先打招呼

若要在之后请求问候语 `session.started`:

1. 发送一条全新 `session.instructions.append` ，包含 `delegation_id: null`。问候语、其语言以及一条显式指令，要求立即问候来电者，不要等待，然后暂停并倾听。保留现有的启动指令。
2. 等待 `session.instructions.appended`，匹配其 `client_event_id` 到你的命令。继续之前先处理被拒绝的命令。
3. 保持输入音频持续运行，包括来电者说话前的静默。在 WebSocket 上，继续发送 `session.input_audio.append`；在 WebRTC 上，保持协商好的输入音频轨道处于激活状态。观察输出转录和音频以确认问候语。

使用你的应用程序所指定的语言，直到来电方开口说话；不要根据姓名、电话号码或位置来推断语言。详见 [语音模型提示词设计](https://developers.openai.com/api/docs/guides/live-prompting) 中的提示设计相关内容。

如果问候语需要遵循应用程序的指令，请随 `session.instructions.append`，一并发送这些指令，然后使用一条简短的 `session.commentary.append` 提示助手开始对话。例如：“现在开始对话，遵循所提供的指令。”保持输入音频持续运行，包括来电方开口前的静默时段。

指令用于请求问候语；它们并不保证措辞完全一致，也不保证播放过程不被打断。API 不会发出问候语完成事件，且确认并不等同于问候语已被听到。如果音频必须逐字精确，请使用由应用程序控制的播放方式。请使用你的应用程序所支持的语言和打断场景测试你的问候语。

### Deliver a disclosure

使用 `session.instructions.append` 用于请求披露时的具体口语措辞。 `session.commentary.append` 可能会对文本进行意译。例如，之后 `session.started`，可以发送：

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


按所述持续运行输入音频 [在来电者开口前先打招呼](#greet-before-the-caller-speaks)。请谨慎选择播报时机：在对话进行中发送的指令可能会打断正在进行的语音。

该调用只是请求了相应措辞，并不保证完全按此播报。在将其标记为已交付之前，请核实完整的口语披露内容以及实际的播放情况。 `session.instructions.appended` 仅表示指令已被接受。如果需要精确的音频播报，请通过你的应用播放经过核验的录音或渲染片段，并在播放期间控制 GPT-Live 的输出。参见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





## 管理较长的对话

GPT-Live 会在长对话过程中自动管理上下文，无需任何配置参数。你在会话开始时提供的指令会在整个压缩过程中保留，无需重新发送。

默认上下文窗口可容纳 128,000 个 token，其中包含你的指令、对话文本以及未在转写文本中出现的音频 token。

GPT-Live 会在后台对较早的对话历史进行摘要。当上下文使用率超过 90% 时，它会在同一会话内启动一个替换语音引擎。替换引擎会接收你的原始指令以及最多 8,192 个 token 的对话历史，其中包含最近的消息，以及在可用时对较早消息的摘要。准备摘要并不会立即改变正在运行的引擎的上下文。





较早的对话细节可能会被摘要或省略。请将重要事实、已确认的操作以及当前任务状态保留在你的应用中，并在需要时提供相关上下文。

## 存储并复刻会话

设置 `store` 设置为 `true` 在创建会话配置中，以便保存录音供后续下载或分叉。存储默认 `false` ，且必须为你的项目启用。下载和分叉需要一条已完成的存储录音以及允许持久化的数据策略。录音将在 30 天后过期。在零数据保留（Zero Data Retention）下， `store` 将被视为 `false`，并且录音下载与分叉不可用。参见 [GPT-Live 数据控制](https://developers.openai.com/api/docs/guides/your-data#v1livesessions).

例如，将以下字段添加到你的 WebSocket `session` 事件或 WebRTC 创建请求中的 `session.start` 对象：

```json
{
  "store": true
}
```

从 `session.started` 或 WebRTC 创建响应中保存源会话 ID。分叉会从已存储的会话状态启动一个 **带有新 ID 的新会话** 。它不会重新打开原始连接，也不会复用源会话 ID。

通过你的应用程序所使用的传输方式启动分叉：

| Transport | Start the fork                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | Connect to `wss://api.openai.com/v1/live/sessions/{source_session_id}/fork`.                                                                     |
| WebRTC    | Send a new SDP offer to `POST /v1/live/sessions/{source_session_id}/fork`. Apply the returned `transport.sdp` answer to the new peer connection. |

fork 会继承已存储的会话配置，但需遵守下文的传输规则。对于 WebSocket fork，请发送 `session.start` 并附带必需的 `session` 对象； `{}` 不会提供任何覆盖。不要提供新的模型，也不要重复原始的 instructions 或 input。你可以覆盖 `store`、Responses 委派设置以及新的 WebSocket 音频格式。WebRTC fork 可以覆盖 `store`、Responses 委派设置以及前端客户端权限。省略 `store` 时，fork 会继承源会话的该设置。

WebSocket fork 不会 **继承** 源会话的音频格式：请显式设置 `audio.format` ，或使用默认的 24 kHz PCM16。它也会丢弃继承的前端数据通道权限。WebRTC fork 会协商其音频格式，并拒绝 `audio.format`；除非你显式覆盖，否则它们会保留前端权限设置。

等待 `session.started` 之后再发送后续的 WebSocket 命令。WebRTC 通过 HTTP 请求启动，且不得在其数据通道上接收第二个 `session.start` 。

### 启动 WebSocket fork

设置 `OPENAI_API_KEY` 和 `OPENAI_LIVE_SESSION_ID` 到你的 API 密钥以及已存储的源会话 ID。这些示例确认启动成功，然后关闭该 fork。若要继续对话，请在之后发送并接收音频 `session.started` 使用 [WebSocket 连接流程](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。请参阅 [fork WebSocket 参考](https://developers.openai.com/api/reference/resources/live/fork-websocket) 了解启动字段和事件。

```javascript
import OpenAI from "openai";
import { ForksWS } from "openai/resources/live/forks/ws";

const sourceSessionId = process.env.OPENAI_LIVE_SESSION_ID;
if (!sourceSessionId) throw new Error("Set OPENAI_LIVE_SESSION_ID");

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
```

```python
import os

from openai import OpenAI

client = OpenAI()
source_session_id = os.environ["OPENAI_LIVE_SESSION_ID"]

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

在前端创建一个新的 SDP offer，并将其发送到后端。以下后端示例从名为 `OPENAI_LIVE_SDP_OFFER_FILE` 的文件中读取该 offer，并 fork 已存储的 `OPENAI_LIVE_SESSION_ID`:

```javascript
import OpenAI from "openai";
import { readFile } from "node:fs/promises";

const sourceSessionId = process.env.OPENAI_LIVE_SESSION_ID;
const offerFile = process.env.OPENAI_LIVE_SDP_OFFER_FILE;
if (!sourceSessionId || !offerFile) {
  throw new Error("Set OPENAI_LIVE_SESSION_ID and OPENAI_LIVE_SDP_OFFER_FILE");
}
const offerSdp = await readFile(offerFile, "utf8");

const client = new OpenAI();
const fork = await client.live.sessions.fork(sourceSessionId, {
  transport: { type: "webrtc", sdp: offerSdp },
});
console.log(JSON.stringify(fork));
```

```python
import os
from pathlib import Path

from openai import OpenAI

client = OpenAI()
source_session_id = os.environ["OPENAI_LIVE_SESSION_ID"]
offer_sdp = Path(os.environ["OPENAI_LIVE_SDP_OFFER_FILE"]).read_bytes().decode()

fork = client.live.sessions.fork(
    source_session_id,
    transport={"type": "webrtc", "sdp": offer_sdp},
)
print(fork.model_dump_json())
```


将响应返回给你的前端，应用 `transport.sdp` 作为新对等连接的 answer，并保留新的 `session.id`。请将 API 密钥保存在你的后端。

将新的会话 ID 用于后续的带外连接和会话控制。请将应用任务状态单独保存：恢复会话状态并不能确认某个挂起的后端动作已完成。在重试某个动作之前，请先对不确定的结果进行对账。如果你没有可 fork 的已存储会话， [使用已保存的历史记录初始化一个新会话](#seed-a-session-with-prior-conversation).

### 下载录音

存储的录音完成后，使用以下命令下载其音频： `GET /v1/live/sessions/{session_id}/content`。响应为二进制立体声 WAV，输入音频位于左声道，输出音频位于右声道。请将 `OPENAI_LIVE_SESSION_ID` 设置为存储的会话 ID。以下示例将响应流式传输到 `recording.wav`:

```javascript
import OpenAI from "openai";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const sessionId = process.env.OPENAI_LIVE_SESSION_ID;
if (!sessionId) throw new Error("Set OPENAI_LIVE_SESSION_ID");

const client = new OpenAI();
const response = await client.live.sessions.downloadRecording(sessionId);
if (!response.body) throw new Error("Recording response has no body");
await pipeline(response.body, createWriteStream("recording.wav"));
```

```python
import os

from openai import OpenAI

client = OpenAI()
session_id = os.environ["OPENAI_LIVE_SESSION_ID"]

with client.live.sessions.with_streaming_response.download_recording(
    session_id
) as response:
    response.stream_to_file("recording.wav")
```


## 处理错误并结束会话

持续读取会话事件，直到会话结束。区分被拒绝的命令、连接失败和已完成的会话，以便你的应用能够恰当地恢复。

### 处理被拒绝的命令

读取 `error` 事件以及确认消息。如果存在，则， `error.client_event_id` 标识失败的传出命令：

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

错误代码可以 `null`，并且错误可能缺少客户端事件 ID。处理这些情况时不要假设命令已成功。对于不可变字段错误，请保留当前配置或使用预期设置创建一个新会话。

### 处理审核

审核（Moderation）可以通过以下两种方式影响会话：

- 某些审核事件会结束会话。
- 其他审核事件会截断助手在其当前发言剩余部分的音频，并发出一个 `error` 事件但不结束会话。

读取 `error` events even while audio is playing. Don't assume every moderation error closes the session, or that an audio interruption means the connection failed. Keep application state aligned with the session lifecycle, and don't mark an interrupted spoken message as fully delivered. Application-level [会话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) remain separate from this built-in moderation behavior.

### 用量与优雅关闭

`session.usage.updated` 以秒为单位报告累计语音时长：

```json
{
  "type": "session.usage.updated",
  "event_id": "event_usage_1",
  "usage": { "seconds": 12 },
  "context_window": { "usage_ratio": 0.42 }
}
```

这些是快照，而非可累加的增量。后端 token 用量是独立的，需要从嵌套的 Responses completion 事件中保留。请参阅 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) 了解用量核算方式。

要优雅地关闭：

1. 完成你的应用所需的全部已委托 Responses 工作，包括待处理的函数结果和响应延续。
2. 在发送之前安装 `session.closed` 监听器 `session.close`.
3. 发送 `session.close` 并停止向会话提交新工作。在待处理的会话事件排空期间，保持 WebSocket 或 WebRTC 连接、数据通道以及任何已附加的边带接收器处于活动状态。
4. 读取最终的 `usage.seconds`, `reason`，以及会话快照，来自 `session.closed`。保留已通过 `response.event`.
5. 接收到委托使用量。在该事件之后清理传输通道和音频设备。如果终结失败或超过你设置的超时，请上报未完成的终结并释放资源。

发送 `session.close` 会取消已排队的 Responses 并拒绝后续命令。正在进行的响应可以完成，但正在等待函数结果的响应在关闭开始后无法继续。请单独决定是要完成还是取消应用通过客户端委托运行的工作。

该 `session.closed` 事件用于确定终结状态；其中嵌入的会话是配置快照。仅关闭套接字本身并不构成成功，而在有效终结事件之后发生的传输关闭代码不会使终结状态失效。在发送命令后立即关闭 WebRTC 可能导致无法交付终结事件。

终结事件的 `reason` 说明了会话结束的原因：

| 原因            | 含义                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `close_requested` | 你的应用发送了 `session.close` 或调用了挂断端点。 |
| `expired`         | 会话达到其时长限制。                              |
| `content`         | 安全过滤器结束了会话。                                   |
| `remote_hangup`   | 远程主连接正常结束。                      |
| `connection_lost` | 主连接或上游连接意外丢失。            |

一个 `session.closed` 该事件确认会话已最终化，即使原因是连接断开或安全终止也是如此。若缺少该事件，最终的用量将无法确认。已存储的会话在保存其录制内容时可能需要更长时间才能最终化；请选择一个考虑存储因素的应用超时时间。

### 从失败的连接中恢复

HTTP 会话创建错误意味着该会话未能到达 `session.started`。请将会话启动错误与会话运行过程中的错误分开处理。如果正在运行的连接在 `session.closed`，之前失败，请保留最新观测到的用量，并将最终用量标记为未确认。

如果有已存储的会话， [复刻该会话](#store-and-fork-a-session) 以从其保存的状态启动新会话。否则，请使用相关的已保存历史记录创建一个替代会话。在重试挂起操作之前，先与后端协调它们，并抑制来自上一次会话的过期结果。请显式恢复应用状态，不要假设新连接会恢复上一个会话或其挂起的工作。