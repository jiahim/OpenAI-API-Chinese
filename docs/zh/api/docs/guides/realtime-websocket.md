# 基于 WebSocket 的 Realtime API

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取文档页面的 Markdown 版本。

[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 是一种广泛支持的 API，可用于实时数据传输，是在服务端到服务端应用中连接 OpenAI Realtime API 的理想选择。对于浏览器和移动端客户端，我们建议通过 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc).

在服务端到服务端的 Realtime 集成中，你的后端系统将通过 WebSocket 直接连接到 Realtime API。你可以使用 [标准 API 密钥](https://platform.openai.com/settings/organization/api-keys) 来对该连接进行身份验证，因为该令牌仅在你安全的后端服务器上可用。

![直接连接到 realtime API](https://openaidevs.retool.com/api/file/464d4334-c467-4862-901b-d0c6847f003a)

## 通过 WebSocket 连接

以下是通过 WebSocket 连接到 Realtime API 的几个示例。除了使用下面的 WebSocket URL 外，你还需要使用你的 OpenAI API 密钥传递身份验证头。如果你的应用分配 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，请在标头中传递终端用户的稳定且保护隐私的标识符 `OpenAI-Safety-Identifier` 标头。

如以下示例所示，在浏览器中配合临时 API 令牌使用 WebSocket 是可行的， [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/realtime-webrtc)，但如果你从浏览器或移动应用等客户端连接，在大多数情况下 WebRTC 会是更稳健的方案。



ws 模块（Node.js）

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

  

  

    
websocket-client（Python）

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

  

  

    
OpenAI SDK（Ruby）

    

      Install the required gems with 
      `gem install openai async-websocket`.
    

    Connect with the OpenAI SDK (Ruby)

```ruby
require "openai"

client = OpenAI::Client.new(
  default_headers: {"OpenAI-Safety-Identifier" => "hashed-user-id"}
)

client.realtime.connect(model: "gpt-realtime-2.1") do |connection|
  puts("Connected to the Realtime API: #{connection.url.host}")
  connection.each { |event| puts("Received event: #{event.type}") }
end
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

Realtime API 会话通过以下两者结合进行管理： [客户端发送的事件](https://developers.openai.com/api/reference/resources/realtime/client-events#session.update) （由你作为开发者发送）以及 [服务端发送的事件](https://developers.openai.com/api/reference/resources/realtime/server-events#error) （由 Realtime API 生成，用于指示会话生命周期事件）。

在 WebSocket 上，你将同时发送和接收以文本字符串形式进行 JSON 序列化的事件，如下方 Node.js 示例所示（其他 WebSocket 库同样适用相同原则）：

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


WebSocket 接口可能是与 Realtime 模型交互可用的最低层级接口，你需要负责通过 socket 连接同时发送和处理 Base64 编码的音频数据块。

要了解如何通过 WebSocket 发送和接收音频，请参阅 [Realtime conversations 指南](https://developers.openai.com/api/docs/guides/realtime-conversations#handling-audio-with-websockets).