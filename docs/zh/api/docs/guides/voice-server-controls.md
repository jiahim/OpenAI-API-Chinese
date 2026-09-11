# 服务端控制

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

选择你的应用程序使用的 API。每个 API 都有各自的认证、会话创建和事件契约。



## 从你的服务端控制 GPT-Live 会话

当服务器需要接收对话事件、执行私有工具或更新对话时，将你的应用服务器附加到现有的 GPT-Live WebRTC 或 SIP 会话。这个第二连接称为 **旁带 WebSocket**。两个连接共享同一个会话，而 WebRTC 或 SIP 承载主要的音频。

旁带用于传输事件和命令。你的应用负责提供工具执行、授权检查和业务规则。请将 API 密钥和工具凭证保存在你的服务器上。

### 判断是否需要旁带

对于浏览器应用程序，请使用 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 进行字幕和本地 UI 更新。当转录处理在你的服务器上运行时，请使用旁路，例如 护栏 检查、情感分析或推测性工具调用。你的服务器可以在浏览器音频保持在 WebRTC 上的同时接收事件并直接操控同一个会话。参见 [对转录片段作出反应](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例。

如果你的后端已经拥有主要的 [WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)，它已经会接收会话的事件并可以发送命令。

[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation) 在不使用旁路的情况下也可工作。浏览器可以将其数据通道中的函数调用事件转发给经过身份验证的后端来执行。OpenAI 托管工具通过委托的后端运行，无需应用工具执行器。

### 附加到现有会话

1. 保存你的后端将要控制的会话 ID。对于 WebRTC，使用 `session.id` 从 JSON 响应中获取的 `POST /v1/live/sessions`。对于 SIP， [先接听来电](https://developers.openai.com/api/docs/guides/voice-sip?api=live#accept-or-reject-the-call) ，然后使用 `data.session_id` 从其 webhook 中获取的 ID。请将此 ID 与应用的用户和会话记录一并保存。
2. 从你的服务器通过以下 URL 打开一个 WebSocket 连接，并将已保存的 ID 原样替换进去。使用 `Authorization: Bearer $OPENAI_API_KEY` 以及创建或接受该会话时所用的项目身份进行认证。需要包含与创建会话时相同的连接请求头。

```text
   wss://api.openai.com/v1/live/sessions/{session_id}/attach
```

3. 在已附加的 socket 上接收事件并发送指令。会话已在运行中，请勿再次发送 `session.start` 。

将会话 ID 视为不透明值。保留其前缀，并且仅在已授权你的应用程序访问的会话中使用它。请从 Live JSON 响应中读取该 ID，而不是从 Realtime `Location` 请求头或 `call_id` URL 参数中读取。

### 观察事件并发送命令

| 任务                         | 事件或命令                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 跟随对话      | 接收用户与助手转录增量、交接事件以及嵌套的 Responses 事件。                                                                          |
| 更新后端配置 | 使用 `session.update` 以在现有交接模式下更改支持的设置。前端模型和音频配置等启动设置保持不变。 |
| 提供上下文              | 使用 `session.instructions.append` 用于指令， `session.thinking.append` 用于安静上下文，以及 `session.commentary.append` 用于可朗读的更新。                |
| 返回工具结果          | 通过 Responses 交接，发送 `response.item.create`，然后 `response.create` 以继续后端工作。                                                               |
| 控制麦克风输入     | 使用 `session.input_audio.mute` 和 `session.input_audio.unmute`。静音输入不会停止助手的输出。                                                    |
| 结束会话           | 发送 `session.close` 并接收 `session.closed` 在断开连接之前。                                                                                                |

命令遵循与主连接相同的验证和委托规则。对于上下文追加，请使用 `delegation_id: null` 添加通用会话上下文；非空 ID 必须标识一个已存在的客户端委托。详见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) ，其中介绍了配置、函数执行以及上下文追加示例。

对于浏览器会话，请保持麦克风输入和扬声器输出在已协商好的 WebRTC 媒体轨道上。会话事件和控制请使用旁路通道。转录事件或命令确认并不能证明音频已经播放，也不能证明用户已经听到。

### 接收反射音频

旁路也会接收后续输入和输出音频的副本，而主连接传输实时媒体：

| Event                        | Audio 字段 | Timing                                                                       |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `session.input_audio.append` | `audio`     | 无时间戳。                                                               |
| `session.output_audio.delta` | `delta`     | `start_ms` 和 `end_ms` 描述输出在会话时间轴上的范围。 |

两个载荷均为 base64 编码的原始 mono PCM16LE 音频，采样率为 24 kHz，与主传输的音频格式无关。两种事件都没有 `event_id`。反射输入包含输入静音前收到的音频；它并不确认模型是否使用了这些采样。反射输出范围可能存在因丢帧导致的空隙，且并不表示调用方听到音频的时间。

这些是服务端事件，并非允许通过边带发送音频的权限。请通过主传输发送麦克风音频；不要发送 `session.input_audio.append` 到已附加的 socket。

### 为每个操作指派一名负责人

选择由浏览器还是后端处理每个动作。如果两个连接都收到 function-call 事件，则仅执行一次该函数。对上下文更新和继续后端工作的请求应用同样的所有权规则。

在你的应用中存储对话记录和工具状态。如果后端需要从一开始就观察对话，请尽早连接，并保留连接之前收集到的任何历史记录。不要依赖连接来重建先前的对话记录或工具结果。

旁路本身并不能让会话事件对浏览器私有。请将敏感的工具凭证和授权决策保留在你的后端，并仅返回对话所需的上下文。





## 应用对话护栏

使用服务器的连接来监控会话、根据应用的策略检查请求，并在触发检查时进行干预。旁路（sideband）使你的服务器能够访问会话事件和命令；你的应用运行检查并强制执行其结果。当你的服务器已经拥有主要的 WebSocket 连接时，同样的工作流同样适用。

### 在对话旁运行检查

护栏的一种用途是 [在转录片段到达时对其进行处理](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments). 同一个流可以在进行这些检查的同时启动一次推测式查找或更新 UI。

1. **监控对话文本。** 累积片段以检查用户请求中是否包含越狱尝试、敏感信息或违反策略的内容。使用 `session.input_transcript.delta` 片段以检查用户请求中是否包含越狱尝试、敏感信息或违反策略的内容。使用 `session.output_transcript.delta` 检查助手发言中是否存在不受支持的声明或超出你应用范围的回复。将每次检查与其对应的对话文本和应用请求关联起来。
2. **并发运行检查。** 快速、轻量的模型可以在对话继续进行的同时评估请求，并返回一个较小的结构化结果，例如 `{"triggered": true}`，供你的应用据此采取行动。需要审批的操作在检查通过前保持阻塞；超时或检查失败不等同于审批通过。
3. **阻止受影响的操作。** 当检查触发时，在应用状态中将请求标记为已阻止。在执行工具或提交变更（包括已排队的工作）之前检查该状态。口头拒绝并不会阻止工具运行。
4. **停止相关工作。** 在你的后端支持取消时，取消应用拥有的任务，并丢弃来自已阻止或已被替代请求的延迟结果。通过 Responses 委托时，停止执行受影响的自定义函数，并且不要发送 `response.create` 以继续执行已阻止的工作。这不会取消已在运行的托管响应，也不会停止前端的语音输出。
5. **记录并重定向。** 将决策与受影响的请求和委托 ID 一起记录，然后发送一条纠正性指令。类似 `guardrail.triggered` 的事件名属于你应用的遥测范畴，并非 GPT-Live API 事件。

请参阅 [转录片段增量](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 用于收集片段，以及 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) 用于保持后端结果与当前任务对齐。

### 重定向对话

使用 `session.instructions.append` 进行 护栏 引导。它可以中断正在进行语音输出并应用新指令。例如，在你的应用阻止某个请求后，发送：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


保持该指令由应用编写。不要将不可信的用户文本复制到其中作为指令。使用 `delegation_id: null` 进行此会话范围内的修正，并保持 `content` 不超过 500 tokens。

与 `session.instructions.appended` 匹配，通过 `client_event_id`。确认消息会在估计的上下文注入完成后到达；它并不能证明助手已停止说话，也不能证明队列中的音频已停止播放。修正指令无法撤回用户已经听到的音频。

对于要求使用特定口头表述的披露，也请使用指令。参见 [提供披露](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure) 了解示例及播放注意事项。

### Control playback when needed

首先测试纠错指令与动作拦截。如果你的应用还需要拦截模型音频，请在客户端或媒体中继处控制输出：临时静音或丢弃输出，丢弃本地已排队的音频，发送纠错指令，然后根据你应用的恢复策略恢复播放。恢复前请清理过期的音频。单纯的旁带信道无法控制媒体路径，指令确认也不代表可以恢复播放。

`session.input_audio.mute` 控制呼叫端的麦克风输入。它不会静音模型输出，也不会取消已委派的工作。

GPT-Live 在说话时会流式输出转写片段。如果必须在用户听到音频前完成某项检查，你的应用需要在播放前缓冲并审核音频。这会增加延迟。被抑制的音频还可能使模型的对话上下文超前于用户实际听到的内容，因此请测试对话如何恢复。

### 测试该干预

测试允许和被阻止的请求、误报、缓慢或失败的检查、语音过程中的触发、工具运行中的触发，以及已取消工作的延迟结果。分别验证动作阻止、应用状态、纠正性语音以及实际播放。如果你控制输出，请将队列中的音频和恢复纳入测试。使用 [voice 智能体 evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 以比较任务成功率和语音响应时间。

## 干净地结束

在后端负责工具执行或最终用量收集期间，持续接收事件。在发送前注册 `session.closed` handler `session.close`，并在待处理任务排空期间保持 WebRTC 连接、数据通道和旁路通道处于打开状态。在清理之前保存最终的会话用量以及 Responses 事件中收到的任何后端用量。如果连接在最终事件到达之前失败，请将完成阶段记录为未完成。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 了解关闭流程。

  

  


Realtime API 允许客户端通过 WebRTC 或 SIP 直接连接到 API 服务器。不过，你很可能希望工具使用和其他业务逻辑驻留在你的应用服务器上，以保持这些逻辑的私有性并与客户端无关。

通过“旁路”控制通道进行连接，将工具使用、业务逻辑以及其他细节安全地保留在服务端。SIP 和 WebRTC 连接目前都支持旁路选项。

旁路连接意味着同一个 Realtime 会话存在两条活动连接：一条来自用户客户端，另一条来自你的应用服务器。服务器连接可用于监控会话、更新指令以及响应工具调用。

## 使用 WebRTC

1. 当 [建立对等连接](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 时，你会获取并收到来自 Realtime API 的 SDP 响应，以配置该连接。如果你使用的是 WebRTC 指南中的示例代码，其大致如下所示：

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


2. fetch 响应将包含一个 `Location` 响应头，其中包含一个唯一的 call ID，可用于在服务端与同一个 Realtime 会话建立 WebSocket 连接。

```javascript
// Location: /v1/realtime/calls/rtc_123456
const location = sdpResponse.headers.get("Location");
const callId = location?.split("/").pop();
console.log(callId);
```


3. 在服务端，你可以随后 [监听事件并配置会话](https://developers.openai.com/api/docs/guides/realtime-conversations) 就像使用典型的 Realtime API WebSocket 连接一样，只需将该 call ID 与 URL 一起使用
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
2. OpenAI 会向应用的服务器 webhook URL 发送一个 webhook，通知应用当前会话的状态。该 webhook 的内容大致如下：

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

3. 应用服务器使用 Realtime API 建立 WebSocket 连接 `call_id` 通过类似如下的 URL 在 webhook 中提供的值: `wss://api.openai.com/v1/realtime?call_id={callId}`。WebSocket 连接将在整个 SIP 通话期间保持有效。

随后即可使用该 WebSocket 连接发送和接收事件来控制通话，就像会话是通过 WebSocket 连接发起时一样。这包括监控通话、动态更新指令以及响应工具调用。