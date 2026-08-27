# 使用 WebSocket 的 Realtime API

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 是一种被广泛支持的 API，用于实时数据传输，也是服务器到服务器应用中连接 OpenAI Realtime API 的绝佳选择。对于浏览器和移动客户端，我们建议通过 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc).

在服务器到服务器与 Realtime 的集成中，你的后端系统将通过 WebSocket 直接连接到 Realtime API。你可以使用 [标准 API 密钥](https://platform.openai.com/settings/organization/api-keys) 来认证此连接，因为令牌只会在你的安全后端服务器上可用。

![直接连接到实时 API](https://openaidevs.retool.com/api/file/464d4334-c467-4862-901b-d0c6847f003a)

## 通过 WebSocket 连接

以下是通过 WebSocket 连接到 Realtime API 的几个示例。除了使用下方的 WebSocket URL 外，你还需要使用你的 OpenAI API 密钥传递一个认证头。如果你的应用程序分配了 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，请在 header 中传递最终用户的稳定、隐私保护标识符， `OpenAI-Safety-Identifier` 。

在浏览器中可以使用临时 API 令牌通过 WebSocket，如 [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/realtime-webrtc)所示，但如果你从浏览器或移动应用等客户端连接，在大多数情况下 WebRTC 将是更稳健的解决方案。



ws 模块 (Node.js)

    Connect using the ws module (Node.js)

```javascript
import WebSocket from "ws";

const url = "wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1";
const ws = new WebSocket(url, {
  headers: {
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    "OpenAI-Safety-Identifier": "hashed-user-id",
  },
});

ws.on("open", function open() {
  console.log("Connected to server.");
});

ws.on("message", function incoming(message) {
  console.log(JSON.parse(message.toString()));
});
```

  

  

    
websocket-client (Python)

    Connect with websocket-client (Python)

```python
# example requires websocket-client library:
# pip install websocket-client

import os
import json
import websocket

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

url = "wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1"
headers = [
    "Authorization: Bearer " + OPENAI_API_KEY,
    "OpenAI-Safety-Identifier: hashed-user-id",
]


def on_open(ws):
    print("Connected to server.")


def on_message(ws, message):
    data = json.loads(message)
    print("Received event:", json.dumps(data, indent=2))


ws = websocket.WebSocketApp(
    url,
    header=headers,
    on_open=on_open,
    on_message=on_message,
)

ws.run_forever()
```

  

  

    
WebSocket（浏览器）

    Connect with standard WebSocket (browsers)

```javascript
/*
Note that in client-side environments like web browsers, we recommend
using WebRTC instead. It is possible, however, to use the standard
WebSocket interface in browser-like environments like Deno and
Cloudflare Workers.
*/

const ws = new WebSocket(
  "wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1",
  [
    "realtime",
    // Use a short-lived token fetched from your application server.
    "openai-insecure-api-key." + OPENAI_REALTIME_EPHEMERAL_KEY,
    // Optional
    "openai-organization." + OPENAI_ORG_ID,
    "openai-project." + OPENAI_PROJECT_ID,
  ]
);

ws.addEventListener("open", function open() {
  console.log("Connected to server.");
});

ws.addEventListener("message", function incoming(event) {
  console.log(event.data);
});
```



## 发送和接收事件

Realtime API 会话通过结合 [客户端发送的事件](https://developers.openai.com/api/reference/resources/realtime/client-events#session.update) （由你作为开发者发出）以及 [服务端发送的事件](https://developers.openai.com/api/reference/resources/realtime/server-events#error) （由 Realtime API 创建以指示会话生命周期事件）来管理。

通过 WebSocket，你将发送和接收以文本字符串形式存在的 JSON 序列化事件，如以下 Node.js 示例所示（对于其他 WebSocket 库同样适用）：

```javascript
import WebSocket from "ws";

const url = "wss://api.openai.com/v1/realtime?model=gpt-realtime-2.1";
const ws = new WebSocket(url, {
  headers: {
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    "OpenAI-Safety-Identifier": "hashed-user-id",
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


WebSocket 接口可能是与 Realtime 模型交互时可以使用的最低级别接口，你将负责通过套接字连接发送和处理 Base64 编码的音频块。

要了解如何通过 Websockets 发送和接收音频，请参阅 [Realtime 对话指南](https://developers.openai.com/api/docs/guides/realtime-conversations#handling-audio-with-websockets).