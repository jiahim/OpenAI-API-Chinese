# 使用 WARP 的 WebRTC

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

使用 [WebRTC 简化往返协议 (WARP)](https://datatracker.ietf.org/doc/draft-uberti-tsvwg-warp/) 来缩短启动 Realtime API 语音会话所需的时间。WARP 结合了 [DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147), [SPED](https://datatracker.ietf.org/doc/draft-hancke-webrtc-sped/), [SNAP](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap/)，以及一个预先协商好的数据通道，以更少的网络往返次数建立连接。

WARP、SPED 和 SNAP 都是 IETF Internet-Draft，因此它们的规范和客户端支持可能会发生变化。

你也可以单独使用这些优化。即使无法使用完整的 WARP，启用你的客户端所支持的特性也能降低连接延迟。同时使用所有特性可以提供完整的 WARP 握手。

## 在原生客户端中启用 WARP

当前版本包含 [`libwebrtc`](https://webrtc.googlesource.com/src/) WARP 优化。如果你的原生客户端使用兼容的 `libwebrtc` 构建，请启用以下字段试用：

```text
WebRTC-ForceDtls13/Enabled/
WebRTC-Sctp-Snap/Enabled/
WebRTC-IceHandshakeDtls/Enabled/
```

某些集成需要一条组合的字段试用字符串：

```text
WebRTC-ForceDtls13/Enabled/WebRTC-Sctp-Snap/Enabled/WebRTC-IceHandshakeDtls/Enabled/
```

在对等连接工厂创建之前初始化字段试用。例如，Rust 集成可以同时启用这三个试用：

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

如果你使用包装了 SDK 的 `libwebrtc`，例如原生 LiveKit SDK，请通过其 WebRTC 配置或初始化选项传入相同的字段试用字符串。如果该 SDK 不暴露字段试用，请在底层 `libwebrtc` 实例创建之前初始化，或者更新到提供此配置的封装库。SDK 创建对等连接工厂之前，请先初始化底层。

启用试用后，使用任意可用 ID 创建一个协商的数据通道。当你向 `/v1/realtime/calls`，发送 SDP offer 时，请在 `dcid` 查询参数中包含相同的 ID。

## 在浏览器中启用 WARP

Chrome、Edge 以及其他基于 Chromium 的浏览器会内置 `libwebrtc`，但网页无法配置其字段试用。一个 [源试用](https://developer.chrome.com/docs/web-platform/origin-trials/) 可以为已注册的网站启用一项实验性浏览器功能。请检查每个 WARP 功能的可用性：

- **DTLS 1.3:** Chrome 无需 origin trial 即可支持 DTLS 1.3。
- **SNAP:** Chrome 151–156 通过 origin trial 支持 SNAP。对于 Edge，请检查你的版本是否有 SNAP origin trial 可用，并注册获取 Edge 颁发的 token。
- **SPED:** 暂无可用的浏览器 origin trial。请稍后再来查看 SPED 支持情况。要使用完整的 WARP，浏览器必须默认启用 SPED，或者你必须控制其启动标志并自行启用必要的 field trials。

启用 SNAP origin trial 并不会启用 SPED 或完整的 WARP。如果你的浏览器未暴露 SPED，你仍然可以使用 DTLS 1.3 和 SNAP origin trial 来获得这些单独优化的收益。

查看你浏览器的 origin trials：

- [Google Chrome origin trials](https://developer.chrome.com/origintrials/#/trials/active)
- [Microsoft Edge origin trials](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials)

启用 SNAP 源试用：

1. 打开浏览器的 origin trials 页面，找到 **WebRTC Data Channel: SCTP Negotiation Acceleration Protocol (SNAP)**.
2. 选择 **Register** 并输入你应用的 origin，例如 `https://example.com`.
3. 将颁发的令牌添加到页面的 `<head>` 之前，该脚本会创建 `RTCPeerConnection`:

```html
   <meta http-equiv="origin-trial" content="YOUR_ORIGIN_TRIAL_TOKEN" />
```

4. 重新加载页面。在 Chrome 中，打开 DevTools，选择 **Application**，并确认 `WebRtcSctpSnap` 出现在 **Origin Trials**.

你也可以将 token 作为 HTTP 响应头提供：

```http
Origin-Trial: YOUR_ORIGIN_TRIAL_TOKEN
```

origin-trial token 仅适用于其命名的特性、签发的浏览器以及
  已注册的 origin。SNAP token 无法启用 SPED，Chrome token
  也无法在 Edge 中启用该试用。Firefox、Safari、iOS 上的浏览器以及较旧
  的 Chromium 版本可以支持标准 WebRTC，但不支持完整的 WARP。

## 通过统一接口连接

使用 [统一的 WebRTC 连接流程](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface) 以实现更快的 Realtime API 连接。浏览器将其 SDP offer 与协商好的数据通道 ID 一同发送到你的应用服务器。你的服务器在调用时通过 `dcid` 查询参数传入相同的 ID `/v1/realtime/calls`.

### 配置你的应用服务器

此应用服务器支持标准 WebRTC 和 WARP。被标记的注释 `WARP only` 标识了 WARP 所需的 `dcid` 转发配置：

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


### 从浏览器连接

在浏览器中启用可用的优化后，设置 `useWarp` 为 `true`。选择任意可用的数据通道 ID，并将同一个 ID 传递给服务器。带有 `WARP only` 标记的注释标识了标准 WebRTC 不需要的配置和信令：

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

如果你的 WebRTC 客户端不使用 `libwebrtc`，请向你的 WebRTC 协议栈添加兼容 WARP 的传输优化，或使用该协议栈支持的其他方式。相关规范为 [WARP](https://datatracker.ietf.org/doc/draft-uberti-tsvwg-warp/), [SPED](https://datatracker.ietf.org/doc/draft-hancke-webrtc-sped/), [SNAP](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap/), [DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147)，和 [data channel establishment](https://datatracker.ietf.org/doc/html/rfc8832).

如果这些优化不可用，请使用 [统一 WebRTC 接口](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface).