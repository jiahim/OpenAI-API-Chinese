# Webhook 与服务端控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

Realtime API 允许客户端通过 WebRTC 或 SIP 直接连接到 API 服务器。但是，你很可能希望将工具调用和其他业务逻辑放在应用服务器上，以保持这些逻辑的私密性并与客户端无关。

通过“旁路”控制信道进行连接，将工具调用、业务逻辑及其他细节保留在服务端，确保安全。我们现在为 SIP 和 WebRTC 连接都提供了旁路选项。

旁路连接意味着同一个 Realtime 会话存在两条活动连接：一条来自用户的客户端，另一条来自你的应用服务器。服务器连接可用于监控会话、更新指令以及响应工具调用。

## 使用 WebRTC

1. 当 [建立对等连接时](https://developers.openai.com/api/docs/guides/realtime-webrtc) 你从 Realtime API 获取并接收 SDP 响应以配置连接。如果你使用了 WebRTC 指南中的示例代码，代码大致如下：

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


2. 获取响应将包含一个 `Location` 标头，其中包含一个唯一的通话 ID，可在服务器上用于与同一个 Realtime 会话建立 WebSocket 连接。

```javascript
// Location: /v1/realtime/calls/rtc_123456
const location = sdpResponse.headers.get("Location");
const callId = location?.split("/").pop();
console.log(callId);
```


3. 在服务器上，你可以接着 [监听事件并配置会话](https://developers.openai.com/api/docs/guides/realtime-conversations) 就像在典型的 Realtime API WebSocket 连接中那样，只需将该通话 ID 与 URL 一起使用
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

## With SIP

1. 用户通过 SIP 协议使用电话连接到 OpenAI。
2. OpenAI 会向你的应用服务器 webhook URL 发送一个 webhook，通知你的应用当前会话的状态。该 webhook 大致如下所示：

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

3. 应用服务器使用 webhook 中提供的值，通过类似下方的 URL 与 Realtime API 建立 WebSocket 连接， `call_id` URL 形式如下： `wss://api.openai.com/v1/realtime?call_id={callId}`。该 WebSocket 连接将在整个 SIP 通话期间保持有效。

然后，可以使用该 WebSocket 连接发送和接收事件来控制通话，就像使用 WebSocket 连接发起会话时一样。这包括监控通话、动态更新指令以及响应工具调用。