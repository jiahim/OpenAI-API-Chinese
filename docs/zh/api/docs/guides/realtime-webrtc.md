# 使用 WebRTC 的实时 API

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

[WebRTC](https://webrtc.org/) 是一组强大的标准接口，用于构建实时应用。OpenAI Realtime API 支持通过 WebRTC 对等连接接入实时模型。

对于基于浏览器的语音到语音应用，建议从 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents)，入手，它涵盖了 Agents SDK 中用于管理 Realtime 会话的高级辅助方法和 API。WebRTC 接口功能强大且灵活，但比 Agents SDK 更加底层。

当从客户端（如 Web 浏览器或
  移动设备）连接 Realtime 模型时，建议使用 WebRTC 而非 WebSocket，以获得更
  稳定的性能。

如需了解更多关于在 WebRTC 之上构建用户界面的指导，请， [参阅 MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).

## 概述

Realtime API 支持两种从浏览器连接到 Realtime API 的机制：使用临时 API 密钥（[通过 OpenAI REST API 生成](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)），或者使用新的统一接口。通常，使用统一接口更简单，但会让你的应用服务器处于会话初始化的关键路径上。

### 使用统一接口连接

使用统一接口初始化 WebRTC 连接的过程如下（假设为 Web 浏览器客户端）：

1. 浏览器使用来自其 WebRTC 对等连接的 SDP 数据，向开发者控制的服务器发起请求。
2. 服务器将该 SDP 与其会话配置组合为 multipart 表单，并将其发送给 OpenAI Realtime API，使用其 [标准 API 密钥进行认证](https://platform.openai.com/settings/organization/api-keys).

#### 通过统一接口创建会话

要通过统一接口创建实时 API 会话，你需要构建一个小型 服务端 应用（或与现有应用集成）来向 `/v1/realtime/calls`。发起请求。你将使用一个 [标准的 API 密钥](https://platform.openai.com/settings/organization/api-keys) 在你的后端服务器上对该请求进行身份验证。

下面是一个简单的 Node.js [express](https://expressjs.com/) 服务器示例，用于创建实时 API 会话：

```javascript
import express from "express";

const app = express();

// Parse raw SDP payloads posted from the browser
app.use(express.text({ type: ["application/sdp", "text/plain"] }));

const sessionConfig = JSON.stringify({
  type: "realtime",
  model: "gpt-realtime-2.1",
  audio: { output: { voice: "marin" } },
});

// An endpoint which creates a Realtime API session.
app.post("/session", async (req, res) => {
  const fd = new FormData();
  fd.set("sdp", req.body);
  fd.set("session", sessionConfig);

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });
    // Send back the SDP we received from the OpenAI REST API
    const sdp = await r.text();
    res.send(sdp);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(3000);
```


如果你的应用为每个最终用户分配一个 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
，请将其作为 `OpenAI-Safety-Identifier` 标头包含在此
服务端 请求中。请使用稳定且保护隐私的值，例如经过哈希处理的
内部用户 ID。该标头应由你可信的后端设置，而不是由
浏览器设置。

#### 连接服务器

在浏览器中，你可以使用标准的 WebRTC API 通过你的应用服务端连接到 Realtime API。客户端会将其 SDP 数据直接 POST 到你的服务端。

```javascript
// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
audioElement.current = document.createElement("audio");
audioElement.current.autoplay = true;
pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
pc.addTrack(ms.getTracks()[0]);

// Set up data channel for sending and receiving events
const dc = pc.createDataChannel("oai-events");

// Start the session using the Session Description Protocol (SDP)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpResponse = await fetch("/session", {
  method: "POST",
  body: offer.sdp,
  headers: {
    "Content-Type": "application/sdp",
  },
});

const answer = {
  type: "answer",
  sdp: await sdpResponse.text(),
};
await pc.setRemoteDescription(answer);
```


### 使用临时令牌连接

使用临时 API 密钥初始化 WebRTC 连接的过程如下（假设使用 Web 浏览器客户端）：

1. 浏览器向开发者控制的服务器发出请求，以生成一个临时 API 密钥。
1. 开发者的服务器使用 [标准 API 密钥进行认证](https://platform.openai.com/settings/organization/api-keys) 从 [OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)，请求临时密钥，并将该新密钥返回给浏览器。
1. 浏览器使用临时密钥直接与 OpenAI Realtime API 进行身份验证以建立会话 [WebRTC 对等连接](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection).

![通过 WebRTC 连接实时 接口](https://openaidevs.retool.com/api/file/55b47800-9aaf-48b9-90d5-793ab227ddd3)

#### 创建临时令牌

若要创建用于客户端的临时令牌，你需要构建一个小型服务端应用（或集成到现有应用中）来发起 [OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets) 请求以获取临时密钥。你将使用一个 [标准的 API 密钥](https://platform.openai.com/settings/organization/api-keys) 在你的后端服务器上对该请求进行身份验证。

下面是一个简单的 Node.js [express](https://expressjs.com/) 使用 REST API 颁发临时 API 密钥的服务器：

```javascript
import express from "express";

const app = express();

const sessionConfig = JSON.stringify({
  session: {
    type: "realtime",
    model: "gpt-realtime-2.1",
    audio: {
      output: {
        voice: "marin",
      },
    },
  },
});

// An endpoint which would work with the client code above - it returns
// the contents of a REST API request to this protected endpoint
app.get("/token", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Safety-Identifier": "hashed-user-id",
        },
        body: sessionConfig,
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(3000);
```


你可以在任何能够发送和接收 HTTP 请求的平台上创建类似这样的服务端端点。只需确保 **你只在服务端使用标准的 OpenAI API 密钥，不要在浏览器中使用。**

使用临时令牌时，请设置 `OpenAI-Safety-Identifier` 在创建客户端密钥的服务端
请求上设置。Realtime API 会将该标识符绑定到
所生成的临时令牌，因此浏览器在使用该令牌后续连接时无需发送该安全
标识符。

#### 连接服务器

在浏览器中，你可以使用标准的 WebRTC API 连接到 Realtime API 并使用临时令牌。客户端首先从你的服务端端点获取令牌，然后将其 SDP 数据（连同临时令牌）通过 POST 提交到 Realtime API。

```javascript
// Get a session token for OpenAI Realtime API
const tokenResponse = await fetch("/token");
const data = await tokenResponse.json();
const EPHEMERAL_KEY = data.value;

// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
audioElement.current = document.createElement("audio");
audioElement.current.autoplay = true;
pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
pc.addTrack(ms.getTracks()[0]);

// Set up data channel for sending and receiving events
const dc = pc.createDataChannel("oai-events");

// Start the session using the Session Description Protocol (SDP)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
  method: "POST",
  body: offer.sdp,
  headers: {
    Authorization: `Bearer ${EPHEMERAL_KEY}`,
    "Content-Type": "application/sdp",
  },
});

const answer = {
  type: "answer",
  sdp: await sdpResponse.text(),
};
await pc.setRemoteDescription(answer);
```


## 发送和接收事件

Realtime API 会话通过组合使用 [客户端发送的事件](https://developers.openai.com/api/reference/resources/realtime/client-events#session.update) （由你作为开发者发送）以及 [服务端事件](https://developers.openai.com/api/reference/resources/realtime/server-events#error) （由 Realtime API 生成，用于指示会话生命周期事件）进行管理。

通过 WebRTC 连接到 Realtime 模型时，你无需像使用 [WebSockets](https://developers.openai.com/api/docs/guides/realtime-websocket)。那样以相同粒度处理来自模型的音频事件。如果按上述方式配置，WebRTC 对等连接对象会为你完成所有这些工作。

要发送和接收其他客户端和服务端事件，你可以使用 WebRTC 对等连接的 [数据通道](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels).

```javascript
// This is the data channel set up in the browser code above...
const dc = pc.createDataChannel("oai-events");

// Listen for server events
dc.addEventListener("message", (e) => {
  const event = JSON.parse(e.data);
  console.log(event);
});

// Send client events
const event = {
  type: "conversation.item.create",
  item: {
    type: "message",
    role: "user",
    content: [
      {
        type: "input_text",
        text: "hello there!",
      },
    ],
  },
};
dc.send(JSON.stringify(event));
```


要详细了解如何管理 Realtime 对话，请参阅 [Realtime 对话指南](https://developers.openai.com/api/docs/guides/realtime-conversations).

[Realtime Console



      Check out the WebRTC Realtime API in this light weight example app.](https://github.com/openai/openai-realtime-console/)