# 配合 WARP 使用 WebRTC

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

使用 [WebRTC 精简往返协议（WARP）](https://datatracker.ietf.org/doc/draft-uberti-tsvwg-warp/) 来缩短启动 GPT-Live 或 Realtime API 语音会话所需的时间。WARP 结合了三种传输优化（[DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147), [SPED](https://datatracker.ietf.org/doc/draft-hancke-webrtc-sped/)）以及 [SNAP](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap/)）与预先协商的数据通道，通过更少的网络往返次数来建立连接。

你也可以单独使用这些优化。即使在无法使用完整 WARP 的情况下，启用你的客户端所支持的特性也能降低连接延迟。组合使用所有特性可提供完整的 WARP 握手。

WARP、SPED 和 SNAP 是 IETF 的 Internet-Draft，因此它们的规范和客户端支持可能会发生变化。

GPT-Live 和 Realtime API 使用相同的 WebRTC 优化。无论你的应用服务器使用何种语言，你都可以在浏览器或原生客户端中配置它们。这两个 API 在创建会话时发送协商好的数据通道 ID 的方式有所不同。

## 在原生客户端中启用 WARP

如需完整 WARP，请通过字段试验启用传输优化并预先协商数据通道。你也可以单独使用其中任意一个步骤。

### 启用字段试验

当前版本的 [`libwebrtc`](https://webrtc.googlesource.com/src/) 已包含 WARP 优化。如果你的原生客户端使用了兼容的 `libwebrtc` 构建版本，请启用以下字段试用 (field trials)：

```text
WebRTC-ForceDtls13/Enabled/
WebRTC-Sctp-Snap/Enabled/
WebRTC-IceHandshakeDtls/Enabled/
```

这些试用分别用于启用 DTLS 1.3、SNAP 和 SPED。请仅包含你希望启用的优化所对应的试用。

某些集成需要使用一条合并后的字段试用字符串：

```text
WebRTC-ForceDtls13/Enabled/WebRTC-Sctp-Snap/Enabled/WebRTC-IceHandshakeDtls/Enabled/
```

请在对等连接工厂（peer connection factory）创建之前初始化字段试用。例如，一个 Rust 集成可以同时启用这三条试用：

```rust
const WARP_FIELD_TRIALS: &str = concat!(
    "WebRTC-ForceDtls13/Enabled/",
    "WebRTC-Sctp-Snap/Enabled/",
    "WebRTC-IceHandshakeDtls/Enabled/",
);

webrtc_sys::peer_connection_factory::ffi::initialize_field_trials(
    WARP_FIELD_TRIALS.to_string(),
);
```

如果你使用了包装了 SDK 的 `libwebrtc`，例如一个原生的 LiveKit SDK，请通过其 WebRTC 配置或初始化选项传入相同的字段试用字符串。如果该 SDK 没有暴露字段试用接口，请在 开发工具包 创建其对等连接工厂之前初始化底层实例，或者升级到一个提供该配置的封装库。 `libwebrtc` 实例，方法是在 SDK 创建其对等连接工厂之前进行初始化，或者升级到一个提供该配置的封装库。

### 预先协商数据通道

在你的客户端和信令请求中使用相同的频道 ID。这些步骤同时适用于原生客户端和浏览器，即使你尚未启用所有三项传输优化：

1. 在 SDP offer 之前创建数据通道，设置 `negotiated` 为 `true` ，并将 `id` 设置为可用的通道 ID，例如 `4`。通道标签可以是任意字符串。
2. 将 SDP offer 和通道 ID 发送给你的应用服务器，然后按照下方适用于 API 的步骤操作。

#### 连接 GPT-Live

从 [GPT-Live WebRTC 快速入门](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)。让你的服务端将 channel ID 作为 `transport.dcid` 包含在 `POST /v1/live/sessions`。的 JSON 请求体中。将 `transport.type` 设置为 `webrtc` ， `transport.sdp` 设置为客户端的 SDP offer。

对于使用 `id: 4`，创建的 channel，将以下 JSON 请求体发送到 `POST /v1/live/sessions`。将 `<SDP offer>` 替换为你的客户端生成的实际 SDP offer：

```json
{
  "session": {
    "model": "gpt-live-1"
  },
  "transport": {
    "type": "webrtc",
    "sdp": "<SDP offer>",
    "dcid": 4
  }
}
```

该 `transport.dcid` 字段可启用预先协商的 channel；使用标准 data channel 时请省略它。不要将 `dcid` 作为 URL 查询参数发送：GPT-Live 不接受查询参数，这与下文 Realtime API 流程不同。

将返回的 `transport.sdp` 作为远端 answer 应用，并在发送应用命令前等待 `session.started` 。HTTP 请求会启动会话；不要在 data channel 上发送 `session.start` 。

如果你的 SDK 未提供 `transport.dcid`，保留 GPT-Live 快速入门中的标准数据通道
  配置。你仍然可以启用客户端所支持的各项
  传输优化。

#### 连接到 Realtime API

使用 [统一 WebRTC 连接流程](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface)。让你的服务器在调用时通过 `dcid` 查询参数传入频道 ID `/v1/realtime/calls`。对于通过 `id: 4`，创建的频道，使用 `POST /v1/realtime/calls?dcid=4` ，并在 multipart 请求体中保持相同的 SDP 和会话配置。

将返回的 SDP 作为远端应答。在使用标准数据通道时省略 `dcid` 。下面的 [完整示例](#connect-with-the-unified-interface) 展示了两种配置。

## 在浏览器中启用 WARP

Chrome、Edge 以及其他基于 Chromium 的浏览器自带 `libwebrtc`，但网页无法配置其字段试验。请启用浏览器中可用的传输功能，然后使用与原生客户端相同的 API 信令机制预先协商一个数据通道。

### 启用可用功能和源试用版

一个 [origin trial](https://developer.chrome.com/docs/web-platform/origin-trials/) 可为已注册的网站启用一项实验性浏览器功能。请查看每个 WARP 功能的可用情况：

- **DTLS 1.3：** Chrome 支持 DTLS 1.3，无需源试用。
- **SNAP：** Chrome 151–156 通过源试用支持 SNAP。对于 Edge，请检查你的版本是否可使用 SNAP 源试用，并注册由 Edge 颁发的令牌。
- **SPED：** 暂无可用的浏览器源试用。请稍后查看 SPED 支持情况。若要使用完整的 WARP，浏览器必须默认启用 SPED，或者你必须控制其启动标志并自行启用必要的字段试用。

启用 SNAP origin trial 并不会启用 SPED 或完整的 WARP。如果你的浏览器没有暴露 SPED，仍然可以使用 DTLS 1.3 和 SNAP origin trial 来获得这些单独优化的好处。

查看你所用浏览器的 origin trial：

- [Google Chrome 源试用](https://developer.chrome.com/origintrials/#/trials/active)
- [Microsoft Edge 源试用](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials)

启用 SNAP 试用版源（origin trial）：

1. 打开浏览器的 Origin Trials 页面并找到 **WebRTC Data Channel: SCTP Negotiation Acceleration Protocol (SNAP)**.
2. 选择 **Register** 并输入你应用的 origin，例如 `https://example.com`.
3. 将发放的 token 添加到页面的 `<head>` 之前，创建 `RTCPeerConnection`:

```html
   <meta http-equiv="origin-trial" content="YOUR_ORIGIN_TRIAL_TOKEN" />
```

4. 重新加载页面。在 Chrome 中，打开 DevTools，选择 **Application**,并确认 `WebRtcSctpSnap` 出现在 **Origin Trials**.

你也可以将令牌作为 HTTP 响应头提供：

```http
Origin-Trial: YOUR_ORIGIN_TRIAL_TOKEN
```

Origin Trial 令牌仅适用于其命名的特性、签发的浏览器以及
  已注册的源。一个 SNAP 令牌不会启用 SPED，Chrome 令牌也
  不会在 Edge 中启用该试验。Firefox、Safari、iOS 上的浏览器以及较旧版本的
  Chromium 构建可以支持标准的 WebRTC，但不支持完整的 WARP。

### 预协商浏览器数据通道

按照上方 [数据通道设置](#pre-negotiate-a-data-channel)，然后使用 [GPT-Live](#connect-to-gpt-live) 或 [Realtime API](#connect-to-the-realtime-api) 说明发送匹配的 ID。预先协商通道不需要 origin 试用，并且即使在没有完整 WARP 的情况下也能减少等待服务端事件的时间。

## 使用统一接口连接

使用 [统一 WebRTC 连接流程](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface) 用于更快的 Realtime API 连接。浏览器将其 SDP offer 和协商好的 data-channel ID 发送到你的应用服务器。你的服务器在 `dcid` 查询参数传入频道 ID `/v1/realtime/calls`.

### 配置你的应用服务器

此应用服务器支持标准 WebRTC 和 WARP。带有标记的注释 `WARP only` 标识了 `dcid` WARP 所需的转发：

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

  const endpoint = new URL("https://api.openai.com/v1/realtime/calls");

  // WARP only: forward the negotiated data-channel ID to the Realtime API.
  if (typeof req.query.dcid === "string") {
    endpoint.searchParams.set("dcid", req.query.dcid);
  }

  try {
    const r = await fetch(endpoint, {
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


### 从你的浏览器连接

在浏览器中启用可用的优化后，设置 `useWarp` 为 `true`。选择任意可用的数据通道 ID，并将同一个 ID 传递给服务端。标记为 `WARP only` 的注释标识了标准 WebRTC 不需要的配置和信令：

```javascript
// WARP only: set to true after enabling the supported WARP optimizations.
const useWarp = false;

// WARP only: choose any available data-channel ID.
const dataChannelId = 4;

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

// Set up the event channel using any channel label.
// WARP only: pre-negotiate the channel using the selected data-channel ID.
const dc = pc.createDataChannel(
  "events",
  useWarp ? { negotiated: true, id: dataChannelId } : undefined,
);

// Start the session using the Session Description Protocol (SDP)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const endpoint = new URL("/session", window.location.origin);

// WARP only: include the matching data-channel ID in the session request.
if (useWarp) {
  endpoint.searchParams.set("dcid", String(dataChannelId));
}

const sdpResponse = await fetch(endpoint, {
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


## 使用不支持 WARP 的客户端

如果你的 WebRTC 客户端未使用 `libwebrtc`，请向你的 WebRTC 协议栈添加兼容 WARP 的传输优化，或改用该协议栈支持的其他方式。相关规范参见 [WARP](https://datatracker.ietf.org/doc/draft-uberti-tsvwg-warp/), [SPED](https://datatracker.ietf.org/doc/draft-hancke-webrtc-sped/), [SNAP](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap/), [DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147)）以及 [data channel establishment](https://datatracker.ietf.org/doc/html/rfc8832).

如果这些优化不可用，请改用标准的 [GPT-Live WebRTC 流程](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 或 [Realtime API 统一接口](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface).