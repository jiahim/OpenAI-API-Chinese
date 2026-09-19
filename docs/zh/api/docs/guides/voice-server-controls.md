# 服务端控制

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

选择你的 API 以查看其连接步骤和会话事件。



## 从你的服务器控制 GPT-Live 会话

当应用服务器需要接收会话事件、执行私有工具或更新会话时，可将其接入现有的 GPT-Live WebRTC 或 SIP 会话。这一第二条连接称为 **边带 WebSocket**。两条连接共享同一个会话，而 WebRTC 或 SIP 承载主音频。

边带连接负责传输事件和命令。工具执行、授权检查和业务规则由你的应用提供。请将 API 密钥和工具凭证保存在你的服务器上。

### 判断是否需要旁路

对于浏览器应用，使用 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 来获取字幕和本地 UI 更新。当转录处理在服务端运行时（例如 护栏 检查、情感分析或推测性工具调用），请使用旁路（sideband）。你的服务端可以直接接收事件并引导同一个会话，同时浏览器音频仍通过 WebRTC 传输。详见 [对转录片段做出响应](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例。

如果你的后端通过主要的 [WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)，流式传输音频，请使用该连接来接收事件和发送命令。

[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation) 在没有旁路的情况下也能工作。浏览器可以将其数据通道中的函数调用事件转发到经过身份验证的后端进行执行。OpenAI 托管的工具会通过被委托的后端运行，无需应用工具执行器。

### 附加到现有会话

1. 保存你后端将要控制的会话 ID。对于 WebRTC，使用 `session.id` 从 JSON 响应中获取的值， `POST /v1/live/sessions`。对于 SIP， [先接听来电](https://developers.openai.com/api/docs/guides/voice-sip?api=live#accept-or-reject-the-call) ，然后使用 `data.session_id` 从其 webhook 中获取的值。将该 ID 与应用的用户和会话记录一并保存。
2. 从你的服务器按以下 URL 打开一个 WebSocket，并将保存的 ID 原样替换进去。使用 `Authorization: Bearer $OPENAI_API_KEY` 通过创建或接受该会话的项目身份进行认证，并附带创建会话时所需的相同连接头。

```text
   wss://api.openai.com/v1/live/sessions/{session_id}/attach
```

3. 在已连接的 socket 上接收事件和发送命令。会话已经在运行中，请勿再次发送 `session.start` 。

原样使用该会话 ID，包括其前缀，并验证你的应用已获得对该会话的访问授权。

### 观察事件并发送命令

| 任务                         | 事件或命令                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 跟踪对话      | 接收用户与助手转录增量、交接事件以及嵌套的 Responses 事件。                                                                          |
| 更新后端配置 | 使用 `session.update` 更改现有交接模式中支持的设置。启动设置（例如前端模型和音频配置）保持不变。 |
| 提供上下文              | 使用 `session.instructions.append` 来提供指令， `session.thinking.append` 提供静默上下文，以及 `session.commentary.append` 提供可朗读的更新。                |
| 返回工具结果          | 使用 Responses 交接时，发送 `response.item.create`，然后 `response.create` 以继续后端工作。                                                               |
| 控制麦克风输入     | 使用 `session.input_audio.mute` 和 `session.input_audio.unmute`。静音输入不会停止助手的输出。                                                    |
| 结束会话           | 发送 `session.close` 并接收 `session.closed` 后再断开连接。                                                                                                |

命令遵循与主连接相同的验证和委派规则。对于上下文追加，使用 `delegation_id: null` 用于通用会话上下文；非空 ID 必须标识一个已存在的客户端委派。参见 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解配置、函数执行以及上下文追加示例。

对于浏览器会话，请将麦克风输入和扬声器输出保持在协商好的 WebRTC 媒体轨道上。使用边带通道传递会话事件和控制信息，并在你的音频播放器中跟踪播放进度。

### 接收反射音频

副连接也会接收后续输入和输出音频的副本，而主连接则承载实时媒体：

| Event                        | 音频字段 | 计时                                                                       |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `session.input_audio.append` | `audio`     | 无时间戳。                                                               |
| `session.output_audio.delta` | `delta`     | `start_ms` 和 `end_ms` 描述输出在会话时间线上的范围。 |

两个 payload 均为 base64 编码的原始 mono PCM16LE，采样率 24 kHz，与主传输的音频格式无关。两个事件都带有一个 `event_id`。回传输入包含静音前已接收的音频，但并不表示模型已消费这些采样。回传输出区间可能因丢帧而出现空缺，也不表示调用方何时听到该音频。

仅通过主连接发送麦克风音频。使用边带接收回传音频。

### 为每个操作分配一个负责人

选择由浏览器还是后端处理每个操作。如果两侧连接都收到 function-call 事件，则只执行一次该函数。对上下文更新和后端工作延续请求也采用相同的归属规则。

如果后端需要从一开始就观察对话，请尽早挂接。在你的应用中存储转录文本和工具状态，包括挂接之前收集的任何历史记录。

即使已挂接旁路，浏览器仍然可以接收会话事件。将敏感的工具凭证和授权决策保留在后端，并仅返回对话所需的上下文。





## 应用会话护栏

使用你服务器的主 WebSocket 或边带通道监控对话，并根据你应用的策略检查请求。你的应用执行检查，阻止受影响的动作，并在检查触发时发送修正指令。

### 与对话一起运行检查

护栏是 [在转录片段到达时对其进行处理](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments)。同一数据流可以启动一次预取查询或在执行这些检查的同时更新 UI。

1. **监控对话记录。** 累积片段 `session.input_transcript.delta` 以检查用户请求中是否存在越狱尝试、敏感信息或违反策略的情况。使用 `session.output_transcript.delta` 检查助手发言是否存在不受支持的声明或超出你应用范围的回复。将每次检查与其所评估的对话记录及应用请求关联起来。
2. **并发运行检查。** 一个快速、轻量的模型可以在对话继续进行的同时评估请求。返回一个小型的结构化结果，例如 `{"triggered": true}`，供你的应用据此采取行动。仅在相关检查通过后再运行需要批准的动作。如果检查失败或超时，则保持阻止状态。
3. **阻止受影响的动作。** 当检查触发时，在应用状态中将该请求标记为已阻止。在执行工具调用或提交变更（包括已排入队列的工作）之前检查该状态。
4. **停止相关工作。** 在你的后端支持取消的情况下，取消应用拥有的作业，并丢弃来自已阻止或已被替代请求的迟到结果。使用 Responses 委托时，停止执行受影响的自定义函数，且不要发送 `response.create` 以继续已被阻止的工作。这不会取消已在运行的托管响应，也不会停止前端的语音输出。
5. **记录并重定向。** 将决策连同受影响的请求和委托 ID 一起记录，然后发送一条纠正指令。

参见 [转录片段](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 用于收集片段以及 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) 用于使后端结果与当前任务保持一致。

### 重定向对话

使用 `session.instructions.append` for 护栏 steering. 它可以中断进行中的语音并应用新的指令。例如，在你的应用拦截了一个请求之后，发送：

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


确保指令由应用编写。不要将不可信的用户文本作为指令复制进去。使用 `delegation_id: null` 用于本次会话级别的纠正，并保持 `content` 在 500 个 token 以内。

匹配 `session.instructions.appended` 到你的命令通过 `client_event_id`。确认消息会在预估的上下文注入之后到达。若要停止将音频传至通话对象，请使用下方的播放控件。

对于要求使用特定口头措辞的披露内容，同样可以使用指令。参见 [提供披露内容](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure) 中的示例以及播放相关的注意事项。

### 在需要时控制播放

如果你的应用需要屏蔽模型音频，请在客户端或媒体中继端控制播放。临时静音或丢弃输出，丢弃本地排队中的音频，并发送纠正指令。在清理完陈旧音频后，按照你应用的恢复策略恢复播放；指令确认并不代表可以恢复播放。仅靠旁路无法控制播放，且纠正指令无法撤回呼叫方已听到的音频。

`session.input_audio.mute` 控制呼叫方的麦克风输入。它不会使模型输出静音，也不会取消已委托的任务。

### 播放前检查语音

对于大多数应用而言， [监听用户和助手之间的对话内容](#run-checks-alongside-the-conversation) 在对话持续进行的同时。当 护栏 触发时，你的应用可以拦截受影响的操作或发送纠正指令。

如果你的应用需要在播放前检查助手语音，请在发送到呼叫方之前，先在播放器或媒体桥接中缓冲音频。在检查运行期间继续接收音频和转录事件，并独立于播放读取转录内容。

1. **采集音频及其转录文本。** 在应用中实现输出语音活动检测（VAD），或使用媒体框架提供的噪声门，以识别候选语音片段。GPT-Live 不为此 工作流 提供输出 VAD 或噪声门。等待检查每个片段所需的转录文本。
2. **释放已批准的音频。** 当片段通过检查时，将其原始缓冲音频加入播放队列。如果检查失败、转录文本缺失或检查超时，则丢弃该片段并使用应用定义的安全回退方案。
3. **处理打断。** 将音频、转录文本、检查结果和播放状态与应用生成的 ID 关联。当打断取消该语音时，清除其已缓冲和已排队的音频，并忽略之后任何针对它的批准。

暂停可以在模型仍在生成答案时标记一个候选片段。如果你的策略要求检查完整的答案，请定义你的应用如何判定答案已完成；仅凭语音活动检测无法确认整个答案已经结束。

缓冲会增加延迟。被丢弃的语音仍会保留在模型的对话上下文中，因此需要测试在隐藏音频或使用回退方案后，对话如何继续。

### 测试干预效果

测试允许和被阻止的请求、误报、缓慢或失败的检查、语音期间的触发、工具运行期间的触发，以及来自已取消工作的延迟结果。分别验证操作阻止、应用程序状态、纠正性语音和实际播放。如果你控制输出，请在测试中包含已排队的音频和恢复。使用 [voice 智能体 evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 以比较任务成功率和语音响应时间。

## 干净地完成

在工具完成且会话上报最终用量期间持续接收事件。注册 `session.closed` 处理函数后再发送 `session.close`，并在挂起任务排空期间保持 WebRTC 连接、数据通道和 sideband 处于打开状态。在清理之前保存最终的会话用量以及在 Responses 事件中收到的任何后端用量。如果在最终事件到达之前连接断开，请将完成状态记录为未完成。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 了解关闭流程。

  

  


Realtime API 允许客户端通过 WebRTC 或 SIP 直接连接到 API 服务器。不过，你很可能希望工具使用和其他业务逻辑位于你的应用服务器上，以保持这些逻辑的私密性并与客户端无关。

通过“sideband”控制通道进行连接，将工具使用、业务逻辑以及其他细节安全地保留在服务端。我们现在为 SIP 和 WebRTC 连接都提供了 sideband 选项。

sideband 连接意味着同一个 Realtime 会话存在两条活动连接：一条来自用户的客户端，另一条来自你的应用服务器。服务器连接可用于监控会话、更新指令以及响应工具调用。

## 使用 WebRTC

1. 当 [建立对等连接时](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 你会向 Realtime API 请求并获取一个 SDP 响应，用于配置连接。如果你使用了 WebRTC 指南中的示例代码，代码大致如下：

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


2. 该 fetch 响应会包含一个 `Location` 响应头，其中包含一个唯一的呼叫 ID，可用于在服务端建立指向同一 Realtime 会话的 WebSocket 连接。

```javascript
// Location: /v1/realtime/calls/rtc_123456
const location = sdpResponse.headers.get("Location");
const callId = location?.split("/").pop();
console.log(callId);
```


3. 在服务端，你可以像往常一样 [监听事件并配置会话](https://developers.openai.com/api/docs/guides/realtime-conversations) ，使用与典型 Realtime API WebSocket 连接相同的方式，并使用该呼叫 ID 配合 URL
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

1. 用户通过 SIP 经电话接入 OpenAI。
2. OpenAI 会向你应用的服务器 webhook URL 发送 webhook，通知你的应用该会话的状态。该 webhook 大致如下：

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

3. 应用服务器使用 webhook 中提供的 `call_id` 值，通过类似下方的 URL 与 Realtime API 建立 WebSocket 连接： `wss://api.openai.com/v1/realtime?call_id={callId}`。该 WebSocket 连接将在整个 SIP 通话期间保持存活。

随后可以使用该 WebSocket 连接发送和接收事件来控制通话，就像通过 WebSocket 连接发起会话时一样。这包括监控通话、动态更新指令以及响应工具调用。