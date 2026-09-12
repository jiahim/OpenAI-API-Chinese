# Server-side controls

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取相应文档页面的 Markdown 版本。

选择你的应用程序所使用的 API。每个 API 都有其独立的身份验证、会话创建和事件契约。



## 从你的服务端控制 GPT-Live 会话

当你的服务器需要接收对话事件、执行私有工具或更新对话时，将你的应用服务器附加到现有的 GPT-Live WebRTC 或 SIP 会话上。这个第二连接被称为 **旁带 WebSocket**。两个连接共享同一个会话，而 WebRTC 或 SIP 承载主要的音频。

旁带用于传输事件和命令。你的应用负责提供工具执行、授权检查以及业务规则。请将 API 密钥和工具凭证保留在你的服务器上。

### 判断是否需要侧带

对于浏览器应用，请使用 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 来获取字幕和本地 UI 更新。当转录处理在你的服务器上运行时，例如 护栏 检查、情感分析或推测性工具调用，请使用旁路通道。你的服务器可以接收事件并直接引导同一个会话，同时浏览器音频保持在 WebRTC 上。参见 [对转录片段做出反应](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) 中的示例。

如果你的后端已经拥有主 [WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)，它已经接收会话的事件并可以发送命令。

[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation) 也可以在没有旁路信道的情况下工作。浏览器可以将其数据通道中的函数调用事件转发给经过身份认证的后端来执行。OpenAI 托管工具通过被委托的后端运行，无需应用工具执行器。

### 附加到现有会话

1. 保存你的后端将要控制的会话 ID。对于 WebRTC，使用 `session.id` 中的 JSON 响应中的 `POST /v1/live/sessions`。对于 SIP， [先接听来电](https://developers.openai.com/api/docs/guides/voice-sip?api=live#accept-or-reject-the-call) ，然后使用 `data.session_id` ，该 ID 来自其 webhook。将此 ID 与应用的用户和会话记录一同保存。
2. 从你的服务器使用以下 URL 建立 WebSocket 连接，并将已保存的 ID 原样替换。使用 `Authorization: Bearer $OPENAI_API_KEY` 进行身份验证，使用创建或接受该会话的项目认证。包含创建会话时所需的相同连接头。

```text
   wss://api.openai.com/v1/live/sessions/{session_id}/attach
```

3. 在已附加的 socket 上接收事件并发送命令。会话已经在运行；请勿再次发送 `session.start` 。

将会话 ID 视为不透明值。保留其前缀，并仅用于你的应用已获授权访问的会话。请从 Live JSON 响应中读取该 ID，而不是从 Realtime `Location` header 或 `call_id` URL 参数中读取。

### 观察事件并发送命令

| Task                         | Events or commands                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Follow the conversation      | Receive user and assistant transcript deltas, delegation events, and nested Responses events.                                                                          |
| Update backend configuration | Use `session.update` to change supported settings within the existing delegation mode. Startup settings such as the frontend model and audio configuration stay fixed. |
| Provide context              | Use `session.instructions.append` for instructions, `session.thinking.append` for quiet context, and `session.commentary.append` for speakable updates.                |
| Return tool results          | With Responses delegation, send `response.item.create`, then `response.create` to continue backend work.                                                               |
| Control microphone input     | Use `session.input_audio.mute` and `session.input_audio.unmute`. Muting input does not stop the assistant's output.                                                    |
| Finish the session           | Send `session.close` 并接收 `session.closed` 后再断开连接。                                                                                                |

命令遵循与主连接相同的校验和委派规则。对于上下文追加，使用 `delegation_id: null` 作为通用会话上下文；非空 ID 必须标识一个现有的客户端委派。参见 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解配置、函数执行以及上下文追加示例。

对于浏览器会话，请将麦克风输入和扬声器输出保留在协商好的 WebRTC 媒体轨道上。将旁路用于会话事件和控制。转录事件或命令确认并不能证明音频已播放或用户已听到。

### 接收反射音频

旁路也会接收后续输入和输出音频的副本，而主连接承载实时媒体：

| Event                        | 音频字段 | Timing                                                                       |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `session.input_audio.append` | `audio`     | 无时间戳。                                                               |
| `session.output_audio.delta` | `delta`     | `start_ms` and `end_ms` 描述输出在会话时间线上的范围。 |

两个载荷均为 base64 编码的原始 mono PCM16LE，采样率 24 kHz，与主传输的音频格式无关。两个事件都不带 `event_id`。反射输入包含静音前接收到的音频，并不表明模型消费了这些样本。反射输出范围可能因丢帧而出现间隙，也不表示调用方何时听到音频。

这些是服务端事件，并不等同于允许通过旁路发送音频。请通过主传输发送麦克风音频；不要在已附加的 socket 上发送 `session.input_audio.append` 音频。

### 为每个操作指派一位负责人

选择由浏览器还是后端来处理每个动作。如果两个连接都收到函数调用事件，则只执行一次该函数。对上下文更新和继续后端工作的请求应用同样的所有权规则。

在你的应用中存储对话记录和工具状态。如果后端需要从一开始就能观察对话，请在早期进行挂接，并保留挂接之前收集到的任何历史记录。不要依赖挂接来重建之前的对话记录或工具结果。

旁路本身并不能让会话事件对浏览器保密。请将敏感的工具凭据和授权决策保留在后端，并仅返回对话所需的上下文。





## 应用对话护栏

使用你的服务器连接来监听会话、依据你应用的策略检查请求，并在触发检查时进行干预。边带使你的服务器能够访问会话事件和命令；你的应用运行这些检查并强制执行其结果。当你的服务器已经拥有主 WebSocket 连接时，同样的工作流仍然适用。

### 在与对话并行运行检查

护栏是一种用途，即在 [转录片段到达时对其进行处理](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments)。同一个流可以在这些检查的同时启动推测式查找或更新 UI。

1. **监控会话记录。** 累积片段 `session.input_transcript.delta` 以检查用户请求中是否存在越狱尝试、敏感信息或违反策略的情况。使用 `session.output_transcript.delta` 来检查助手发言中是否有不受支持的声明或超出你应用范围的回复。让每项检查都与所评估的会话记录及应用请求保持关联。
2. **并发运行检查。** 一个快速、轻量的模型可以在会话进行的同时评估请求，并返回你的应用可以据此执行操作的小型结构化结果，例如 `{"triggered": true}`，你的应用可以据此采取行动。保持那些需要审批的操作处于阻塞状态，直到其检查通过；超时或检查失败不等于通过。
3. **阻止受影响的操作。** 当某项检查触发时，在应用状态中将该请求标记为已阻止。在执行工具或提交变更（包括已排队的工作）之前检查该状态。口头的拒绝并不能阻止工具运行。
4. **停止相关工作。** 在后端支持取消的情况下，取消由应用拥有的任务，并丢弃来自已阻止或已被替代请求的迟来结果。使用 Responses 委派时，停止执行受影响的自定义函数，并且不要发送 `response.create` 以继续执行已阻止的工作。这不会取消已在运行的托管响应，也不会停止前端的语音。
5. **记录并重定向。** 将决策与受影响的请求及委派 ID 一起记录，然后发送一条纠正指令。类似 `guardrail.triggered` 的事件名属于你应用的遥测范畴，不是 GPT-Live API 事件。

请参阅 [转录增量](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 以收集片段，以及 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) 以保持后端结果与当前任务一致。

### Redirect the conversation

使用 `session.instructions.append` 进行 护栏 引导。它可以中断进行中的语音并应用新的指令。例如，在你的应用阻止了一个请求后，发送：

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


保持指令由应用作者编写。不要将不可信的用户文本作为指令复制到其中。使用 `delegation_id: null` 进行此会话范围内的修正，并保持 `content` 在 500 个 token 以内。

将 `session.instructions.appended` 与你的命令通过 `client_event_id`。进行匹配。确认信息会在估计的上下文注入之后到达；它并不能证明助手已停止说话，也不能证明已排队的音频已停止播放。修正指令无法撤回用户已经听到的音频。

对于要求特定口语措辞的披露说明，也请使用指令。参见 [提供披露](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure) 中的示例和播放注意事项。

### Control playback when needed

先测试纠正指令和动作阻断。如果你的应用还需要阻断模型音频，可在客户端或媒体中继处控制输出：暂时静音或丢弃输出、丢弃本地排队的音频、发送纠正指令，然后根据应用的恢复策略恢复播放。恢复前请清除陈旧音频。仅靠旁带信号无法控制媒体路径，指令确认也不代表可以恢复播放。

`session.input_audio.mute` 用于控制调用方的麦克风输入。它不会静音模型输出，也不会取消已委派的工作。

GPT-Live 在说话时会流式传输转录片段。如果必须在用户听到音频前完成某项检查，你的应用需要在播放前对音频进行缓冲和审批。这会增加延迟。被抑制的音频也可能让模型的对话上下文超前于用户实际听到的内容，因此请测试对话如何恢复。

### 测试干预效果

测试允许和被拦截的请求、误报、缓慢或失败的检查、语音期间的触发、工具运行期间的触发，以及来自已取消工作的延迟结果。分别验证动作拦截、应用状态、纠正性语音以及实际播放。如果你控制输出，请在测试中包含队列音频和恢复。使用 [voice 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 来比较任务成功率和语音响应时间。

## 干净地结束

当后端拥有工具执行或最终用量收集时，继续接收事件。注册 `session.closed` handler before sending `session.close`，并在待处理工作排空期间保持 WebRTC 连接、数据通道和旁路通道处于打开状态。在清理之前，保存最终的会话用量以及 Responses 事件中收到的所有后端用量。如果连接在最终事件到达之前失败，请将完成状态记录为未完成。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 用于关闭序列。

  

  


Realtime API 允许客户端通过 WebRTC 或 SIP 直接连接到 API 服务器。不过，你很可能希望将工具调用和其他业务逻辑放在应用服务器上，以保持这些逻辑的私有性并与客户端无关。

通过“旁带”（sideband）控制通道连接，将工具调用、业务逻辑以及其他细节保留在服务端。现在 SIP 和 WebRTC 连接均提供旁带选项。

旁带连接意味着同一个 Realtime 会话存在两条活动连接：一条来自用户客户端，另一条来自你的应用服务器。服务器连接可用于监视会话、更新指令以及响应工具调用。

## 使用 WebRTC

1. 当 [建立对等连接](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 时，你需要从 Realtime API 获取并接收一个 SDP 响应来配置该连接。如果你使用了 WebRTC 指南中的示例代码，代码大致如下：

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


2. fetch 响应会包含一个 `Location` 响应头，其中带有一个唯一的 call ID，可用于在服务端建立指向同一 Realtime 会话的 WebSocket 连接。

```javascript
// Location: /v1/realtime/calls/rtc_123456
const location = sdpResponse.headers.get("Location");
const callId = location?.split("/").pop();
console.log(callId);
```


3. 在服务端，你可以 [监听事件并配置会话](https://developers.openai.com/api/docs/guides/realtime-conversations) 就像使用典型的 Realtime API WebSocket 连接一样，只需将该 call ID 与以下 URL 一起使用
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

1. 用户通过 SIP 经电话连接到 OpenAI。
2. OpenAI 向你的应用服务器 webhook URL 发送 webhook，通知你的应用当前会话状态。webhook 内容大致如下：

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

3. 应用服务器使用 webhook 中提供的 value，通过类似下面的 URL 与 Realtime API 建立 WebSocket 连接： `call_id` 该 URL 由 webhook 提供。 `wss://api.openai.com/v1/realtime?call_id={callId}`。该 WebSocket 连接将在整个 SIP 通话期间保持存活。

然后就可以使用该 WebSocket 连接来发送和接收事件以控制通话，就像会话是通过 WebSocket 连接发起时一样。这包括监控通话、动态更新指令，以及响应工具调用。