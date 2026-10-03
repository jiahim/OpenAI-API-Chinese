# 服务端控制

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取相应页面的 Markdown 版本。

选择你的 API 以查看其连接步骤和会话事件。



## 从你的服务器控制 GPT-Live 会话

当服务端需要接收会话事件、执行私有工具或更新会话时，可以将你的应用服务端挂接到现有的 GPT-Live WebRTC 或 SIP 会话上。这个第二条连接称为 **sideband WebSocket**。两条连接共享同一个会话，而 WebRTC 或 SIP 承载主音频流。

sideband 负责传输事件和命令。工具执行、授权检查和业务规则由你的应用自行处理。请将 API 密钥和工具凭证保存在你的服务端。

### 判断是否需要旁带

对于浏览器应用程序，请使用 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 来传输字幕和本地 UI 更新。当转写处理在你的服务器上运行时（例如 护栏 检查、情感分析或推测性的工具调用），请使用旁路（sideband）。即使浏览器音频仍通过 WebRTC 传输，你的服务器也可以接收事件并直接控制同一个会话。请参阅 [对转写片段作出响应](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例。

如果你的后端通过主 [WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)，传输音频，请使用该连接来接收事件和发送命令。

[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation) 也可以在没有旁路的情况下工作。浏览器可以将其数据通道中的函数调用事件转发到经过身份验证的后端执行。OpenAI 托管工具通过委托的后端运行，无需应用程序工具执行器。

### 附加到现有会话

1. 保存后端将要控制的会话 ID。对于 WebRTC 或外呼 [SIP 通话](https://developers.openai.com/api/docs/guides/voice-sip?api=live#place-an-outbound-call)，使用 `session.id` 从 JSON 响应中获取 `POST /v1/live/sessions`。对于入站 SIP， [先接听来电](https://developers.openai.com/api/docs/guides/voice-sip?api=live#accept-or-reject-the-call) 然后使用其 webhook 中的 `data.session_id` 。请将 ID 与应用的用户和会话记录一同保存。
2. 在以下地址从你的服务器打开 WebSocket 连接，并将已保存的 ID 原样替换进去。使用 `Authorization: Bearer $OPENAI_API_KEY` 进行身份验证，使用创建或接受该会话的项目身份验证凭据。同时包含创建会话时所需的相同连接头。

```text
   wss://api.openai.com/v1/live/sessions/{session_id}/attach
```

3. 在该 socket 上接收事件并发送命令。会话已经在运行；不要再次发送 `session.start` 。

原样使用会话 ID，包括其前缀，并验证你的应用已获得对该会话的授权访问。

### 观察事件并发送命令

| Task                         | 事件或命令                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 跟进对话      | 接收用户与助手转录增量、委托事件，以及嵌套的 Responses 事件。                                                                          |
| 更新后端配置 | 使用 `session.update` 以更改现有委托模式内支持的设置。启动设置（如前端模型和音频配置）保持不变。 |
| 提供上下文              | 使用 `session.instructions.append` 用于指令， `session.thinking.append` 用于静默上下文，以及 `session.commentary.append` 用于可朗读更新。                |
| 返回工具结果          | 使用 Responses 委托时，发送 `response.item.create`，然后 `response.create` 以继续后端工作。                                                               |
| 控制麦克风输入     | 使用 `session.input_audio.mute` 和 `session.input_audio.unmute`。静音输入不会停止助手的输出。                                                    |
| 结束会话           | 发送 `session.close` 并接收 `session.closed` 后再断开连接。                                                                                                |

命令遵循与主连接相同的验证和委托规则。对于上下文追加，请使用 `delegation_id: null` 表示通用会话上下文；非 null 的 ID 必须标识一个已存在的客户端委托。参见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解配置、函数执行以及上下文追加示例。

对于浏览器会话，请将麦克风输入和扬声器输出保留在已协商的 WebRTC 媒体轨道上。将副信道用于会话事件与控制，并在你的音频播放器中追踪播放进度。

### 接收反射音频

旁路也会接收后续输入和输出音频的副本，而主连接则承载实时媒体：

| 事件                        | 音频字段 | 时序                                                                       |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `session.input_audio.append` | `audio`     | 无时间戳。                                                               |
| `session.output_audio.delta` | `delta`     | `start_ms` 和 `end_ms` 描述该输出在会话时间线上的范围。 |

两个 payload 都是 base64 编码的原始 mono PCM16LE 音频，采样率为 24 kHz，与主传输的音频格式无关。两个事件都没有 `event_id`。Reflected input 包含输入静音前已接收到的音频；它并不确认模型已消费这些样本。Reflected output 的区间可能因丢帧而出现空缺，也不表示调用方何时听到音频。

仅通过主连接发送麦克风音频。通过 sideband 接收 reflected 音频。

### 为每个操作指派一个负责人

选择由浏览器还是后端处理每个动作。如果两个连接同时收到 function-call 事件，则只执行一次该函数。对上下文更新和继续后端工作的请求应用相同的归属规则。

如果后端需要从一开始就观察对话，则尽早附加。将转录文本和工具状态存储在你的应用中，包括在附加之前收集到的所有历史记录。

当附加了侧带连接时，浏览器仍可接收会话事件。将敏感的工具凭证和授权决策保留在后端，仅返回对话所需的上下文。





## 应用会话护栏

使用你的服务器的主 WebSocket 或边带通道来监控会话,并根据你应用的策略检查请求。由你的应用执行检查、阻止受影响的操作,并在检查触发时发送纠正指令。

### 在对话过程中运行检查

护栏的一种用途是 [在转写片段到达时对其进行处理](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments)。同一条流可以同时启动一次推测性查找或更新 UI，并与这些检查并行进行。

1. **监控对话记录。** 累积 `session.input_transcript.delta` 片段以检查用户请求是否存在越狱尝试、敏感信息或违反策略的情况。使用 `session.output_transcript.delta` 检查助手发言是否存在不支持的声明或超出应用范围的回复。将每次检查与其所评估的对话记录及应用请求关联起来。
2. **并发运行检查。** 一个快速、轻量的模型可以在对话进行的同时评估请求。返回一个小型的结构化结果，例如 `{"triggered": true}`，供你的应用据此采取行动。需要批准的操作仅在其检查通过后才执行。如果某项检查失败或超时，则继续保持阻止状态。
3. **阻止受影响操作。** 当某项检查触发时，在应用状态中将该请求标记为已阻止。在执行工具或提交更改（包括已排入队列的工作）之前，检查该状态。
4. **停止相关工作。** 在后端支持取消的情况下，取消应用持有的任务，并丢弃来自已阻止或被替换请求的延迟结果。使用 Responses 委派时，停止执行受影响的自定义函数，且不要发送 `response.create` 以继续执行已阻止的工作。这不会取消已经在运行的托管响应，也不会停止前端的语音输出。
5. **记录并重定向。** 记录该决策以及受影响的请求 ID 和委派 ID，然后发送一条纠正指令。

参见 [Transcript deltas](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 了解如何收集片段，以及 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) 了解如何使后端结果与当前任务保持一致。

### 重定向对话

使用 `session.instructions.append` 用于护栏引导。它可以中断正在进行的语音并应用新指令。例如，在你的应用阻止了一个请求后，发送：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.instructions.append",
    event_id: "guardrail_block_17",
    delegation_id: null,
    content:
      "Stop speaking immediately. Do not continue or act on the last request. Refuse briefly, then wait.",
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
        event_id="guardrail_block_17",
        delegation_id=None,
        content=(
            "Stop speaking immediately. Do not continue or act on the last request. "
            "Refuse briefly, then wait."
        ),
    )
```


保持指令由应用编写。不要将不受信任的用户文本作为指令复制到其中。使用 `delegation_id: null` 用于此次会话范围的修正，并保持 `content` 在 500 个 token 以内。

将 `session.instructions.appended` 匹配到你的命令，通过 `client_event_id`。确认消息会在预估的上下文注入之后到达。要停止音频到达呼叫方，请使用下面的播放控件。

对于请求特定口头措辞的披露说明，也请使用指令。参见 [播报披露说明](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure) 以获取示例和播放注意事项。

### 在需要时控制播放

如果你的应用需要屏蔽模型音频，请在客户端或媒体中继端控制播放。临时静音或丢弃输出，清除本地已排队的音频，并发送纠正指令。在清除过期音频后，按照你应用的恢复策略恢复播放；指令确认并不代表可以恢复播放。仅靠侧带信号无法控制播放，并且纠正指令无法撤回调用方已经听到的音频。

`session.input_audio.mute` 用于控制调用方的麦克风输入。它不会静音模型输出，也不会取消已委托的工作。

### 在播放前检查语音

对于大多数应用而言， [监控用户与助手的对话记录](#run-checks-alongside-the-conversation) 而对话仍在进行。当 护栏 触发时，你的应用可以拦截受影响的动作或发送修正指令。

如果你的应用需要在播放前检查助手语音，请在将其发送给通话方之前，先在播放器或媒体桥接中缓冲音频。在检查执行期间继续接收音频和对话记录事件，并独立于播放读取对话记录。

1. **采集音频及其转录。** 在应用中实现输出语音活动检测（VAD），或使用媒体框架提供的噪声门来识别候选语音片段。GPT-Live 不为此 工作流 提供输出 VAD 或噪声门。等待用于检查每个片段的转录完成。
2. **放行已批准的音频。** 当一个片段通过检查时，将其原始缓冲的音频加入播放队列。如果检查失败、转录缺失或检查超时，则丢弃该片段并使用应用自定义的安全兜底。
3. **处理打断。** 将音频、转录、检查结果和播放状态关联到应用生成的 ID。当打断取消了该语音时，清除其缓冲和队列中的音频，并忽略后续对该语音的任何批准。

停顿可以在模型仍在生成回答时标记候选片段。如果你的策略要求检查完整的回答，请定义应用如何确认回答完成；仅靠语音活动检测无法确认整个回答是否结束。

缓冲会增加延迟。被丢弃的语音仍会保留在模型的对话上下文中，因此需要测试在音频被截留或触发回退之后，对话是如何继续进行的。

### 测试干预措施

测试允许和阻止的请求、误报、缓慢或失败的检查、语音期间的触发、工具运行期间的触发，以及来自已取消工作的延迟结果。分别验证操作阻止、应用程序状态、纠正性语音和实际播放。如果你可以控制输出，请在测试中加入排队的音频和恢复。使用 [voice 智能体 evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 来比较任务成功率和口语响应时间。

## 干净地结束

在工具完成且会话上报最终用量期间持续接收事件。先注册 `session.closed` 处理函数，再发送 `session.close`，并在待处理任务排空期间保持 WebRTC 连接、数据通道和旁带通道处于打开状态。在清理前保存最终会话用量以及在 Responses 事件中收到的所有后端用量。如果连接在最终事件到达之前失败，请将终结状态记录为不完整。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 了解关闭顺序。

  

  


Realtime API 允许客户端通过 WebRTC 或 SIP 直接连接到 API 服务器。不过，你很可能希望工具调用和其他业务逻辑位于你的应用服务器上，以保持这些逻辑的私密性并与客户端无关。

通过“旁带”控制通道连接，将工具调用、业务逻辑和其他细节保留在服务端以确保安全。我们现在为 SIP 和 WebRTC 连接都提供了旁带选项。

旁带连接意味着同一个 Realtime 会话存在两条活动连接：一条来自用户的客户端，一条来自你的应用服务器。服务器连接可用于监控会话、更新指令以及响应工具调用。

## 使用 WebRTC

1. 当 [建立对等连接时](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 你会从 Realtime API 获取并接收一个 SDP 响应以配置该连接。如果你使用了 WebRTC 指南中的示例代码，代码大致如下：

```javascript
const baseUrl = "https://api.openai.com/v1/realtime/calls";
const sdpResponse = await fetch(baseUrl, {
  method: "POST",
  body: offer.sdp,
  headers: {
    Authorization: `Bearer ${EPHEMERAL_KEY}`,
    "Content-Type": "application/sdp",
  },
});
```


2. fetch 响应将包含一个 `Location` 响应头，其中包含一个唯一的 call ID，可用于在服务端建立指向同一个 Realtime 会话的 WebSocket 连接。

```javascript
// Location: /v1/realtime/calls/rtc_123456
const location = sdpResponse.headers.get("Location");
const callId = location?.split("/").pop();
console.log(callId);
```


3. 在服务端，你接下来可以 [监听事件并配置会话](https://developers.openai.com/api/docs/guides/realtime-conversations) 就像使用典型的 Realtime API WebSocket 连接一样，使用该 call ID 配合如下 URL：
   `wss://api.openai.com/v1/realtime?call_id=rtc_xxxxx`，如下所示：

```javascript
import WebSocket from "ws";
const callId = "rtc_u1_9c6574da8b8a41a18da9308f4ad974ce";

// Connect to a WebSocket for the in-progress call
const url = "wss://api.openai.com/v1/realtime?call_id=" + callId;
const ws = new WebSocket(url, {
  headers: {
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  },
});

ws.on("open", function open() {
  console.log("Connected to server.");

  // Send client events over the WebSocket once connected
  ws.send(
    JSON.stringify({
      type: "session.update",
      session: {
        type: "realtime",
        instructions: "Be extra nice today!",
      },
    })
  );
});

// Listen for and parse server events
ws.on("message", function incoming(message) {
  console.log(JSON.parse(message.toString()));
});
```


通过这种方式，你可以在服务端添加工具、监控会话并执行业务逻辑，而无需在客户端配置这些操作。

## 使用 SIP

1. 用户通过 SIP 经由电话连接到 OpenAI。
2. OpenAI 会向你应用的服务器 webhook URL 发送一个 webhook，通知你的应用当前会话的状态。该 webhook 大致如下所示：

```json
POST https://my_website.com/webhook_endpoint
user-agent: OpenAI/1.0 (+https://platform.openai.com/docs/webhooks)
content-type: application/json
webhook-id: wh_685342e6c53c8190a1be43f081506c52 # unique id for idempotency
webhook-timestamp: 1750287078 # timestamp of delivery attempt
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4= # signature to verify authenticity from OpenAI

{
  "object": "event",
  "id": "evt_685343a1381c819085d44c354e1b330e",
  "type": "realtime.call.incoming",
  "created_at": 1750287018, // Unix timestamp
  "data": {
    "call_id": "some_unique_id",
    "sip_headers": [
      { "name": "From", "value": "sip:+142555512112@sip.example.com" },
      { "name": "To", "value": "sip:+18005551212@sip.example.com" },
      { "name": "Call-ID", "value": "03782086-4ce9-44bf-8b0d-4e303d2cc590"}
    ]
  }
}

```

3. 应用服务器使用 webhook 中提供的值，通过如下 URL 向 Realtime API 发起 WebSocket 连接： `call_id` ，URL 形如： `wss://api.openai.com/v1/realtime?call_id={callId}`。该 WebSocket 连接将在整个 SIP 通话期间保持存活。

然后，你可以像通过 WebSocket 连接发起会话那样，使用该 WebSocket 连接发送和接收事件来控制通话。这包括监控通话、动态更新指令，以及响应工具调用。