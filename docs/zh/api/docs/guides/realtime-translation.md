# 实时翻译

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

实时翻译让你可以将源音频流式输入到专门的翻译会话中，并在说话者仍在讲话时接收翻译后的音频和转录增量。可将其用于现场口译、多语言通话、广播、会议、课程和视频会议室。

使用 [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 当你的应用需要翻译人类的说话内容时。如果你需要一个能够回答问题、调用工具并管理对话的助手，请使用 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) 配合标准实时会话。

## 翻译会话的差异

实时翻译会话使用的架构与语音智能体会话不同：

| 语音智能体会话                         | 翻译会话                              |
| ------------------------------------------- | ------------------------------------------------ |
| 连接到 `/v1/realtime`.                 | 连接到 `/v1/realtime/translations`.         |
| 模型充当助手。             | 模型充当口译员。                |
| 使用对话和响应生命周期。 | 从传入音频持续流式传输。        |
| 可以调用工具并产生助手轮次。 | 生成翻译后的音频和转写增量。 |
| 你可以调用 `response.create`.             | 你不调用 `response.create`.                |

翻译从音频流本身开始。持续追加音频，包括短语之间的静音，并在输出事件到达时进行处理。

## 选择传输方式

当浏览器捕获或播放音频时，使用 WebRTC。WebRTC 将源音频作为媒体轨道发送，并将翻译后的语音作为远程音频轨道接收，因此你无需手动重采样或播放 PCM 数据块。

当你的服务器已经接收原始音频时，例如 Twilio Media Streams、SIP 媒体、广播采集或媒体工作器，请使用 WebSockets。使用 WebSockets 时，发送 base64 编码的 24 kHz PCM16 音频，并自行播放返回的音频增量。

## 创建浏览器的 WebRTC 会话

对于浏览器应用，请在你的服务器上创建一个短期有效的客户端密钥。不要在浏览器中暴露你的标准 API 密钥。

创建翻译客户端密钥

```javascript
app.post("/session", async (req, res) => {
  const language = req.body.targetLanguage ?? "es";

  const response = await fetch(
    "https://api.openai.com/v1/realtime/translations/client_secrets",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: JSON.stringify({
        session: {
          model: "gpt-realtime-translate",
          audio: {
            output: { language },
          },
        },
      }),
    }
  );

  res.status(response.status).json(await response.json());
});
```


在浏览器中，捕获音频、建立对等连接，并将 SDP 提议发布到翻译调用端点：

连接浏览器翻译调用

```javascript
const { value: clientSecret } = await fetch("/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ targetLanguage: "es" }),
}).then((response) => response.json());

const sourceStream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});

const pc = new RTCPeerConnection();
pc.addTrack(sourceStream.getAudioTracks()[0], sourceStream);

const translatedAudio = new Audio();
translatedAudio.autoplay = true;
pc.ontrack = ({ streams }) => {
  translatedAudio.srcObject = streams[0];
};

const events = pc.createDataChannel("oai-events");
events.onmessage = ({ data }) => {
  const event = JSON.parse(data);
  if (event.type === "session.output_transcript.delta") {
    subtitles.textContent += event.delta;
  }
};

const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpResponse = await fetch(
  "https://api.openai.com/v1/realtime/translations/calls",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "Content-Type": "application/sdp",
    },
    body: offer.sdp,
  }
);

if (!sdpResponse.ok) {
  throw new Error(await sdpResponse.text());
}

await pc.setRemoteDescription({
  type: "answer",
  sdp: await sdpResponse.text(),
});
```


## 创建 WebSocket 会话

连接到专用翻译端点，并在 URL 中选择模型：

在运行此示例之前，请为 Node.js 安装 `ws` .js 或为 Python 安装 `websocket-client` 包。

连接到翻译会话

```javascript
import WebSocket from "ws";

const ws = new WebSocket(
  "wss://api.openai.com/v1/realtime/translations?model=gpt-realtime-translate",
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Safety-Identifier": "hashed-user-id",
    },
  }
);
```

```python
import os
import websocket

ws = websocket.WebSocket()
ws.connect(
    "wss://api.openai.com/v1/realtime/translations?model=gpt-realtime-translate",
    header=[
        f"Authorization: Bearer {os.environ['OPENAI_API_KEY']}",
        "OpenAI-Safety-Identifier: hashed-user-id",
    ],
)
```


在套接字打开后配置目标语言：

配置目标语言

```javascript
ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "session.update",
      session: {
        audio: {
          output: {
            language: "es",
          },
        },
      },
    })
  );
});
```

```python
import json

ws.send(
    json.dumps(
        {
            "type": "session.update",
            "session": {
                "audio": {
                    "output": {
                        "language": "es",
                    },
                },
            },
        }
    )
)
```


然后持续追加音频：

追加源音频

```javascript
ws.send(
  JSON.stringify({
    type: "session.input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```

```python
ws.send(
    json.dumps(
        {
            "type": "session.input_audio_buffer.append",
            "audio": base64_pcm16,
        }
    )
)
```


监听翻译后的音频和转录文本：

监听翻译后的音频和转录文本

```javascript
ws.on("message", (data) => {
  const event = JSON.parse(data.toString());

  if (event.type === "session.output_audio.delta") {
    playPcm16(event.delta);
  }

  if (event.type === "session.output_transcript.delta") {
    process.stdout.write(event.delta);
  }

  if (event.type === "session.input_transcript.delta") {
    updateSourceTranscript(event.delta);
  }
});
```

```python
while True:
    event = json.loads(ws.recv())

    if event["type"] == "session.output_audio.delta":
        play_pcm16(event["delta"])

    if event["type"] == "session.output_transcript.delta":
        print(event["delta"], end="", flush=True)

    if event["type"] == "session.input_transcript.delta":
        update_source_transcript(event["delta"])
```


## 关闭 WebSocket 会话

当源音频流结束时，发送一个 [`session.close`](https://developers.openai.com/api/reference/resources/realtime/translation-client-events#session-close) 事件，然后关闭 WebSocket。该事件会通知服务刷新待处理的输入音频，输出剩余的翻译音频和转录文本，随后发送一个 `session.closed` 事件。该 `session.close` 事件仅支持翻译会话。

发送 `session.close`，后，停止附加音频，并在正常的接收循环中继续读取事件，直到收到 `session.closed`。立即关闭套接字可能导致会话中仍在排空的翻译输出丢失。

关闭翻译会话

```javascript
let translationSessionClosing = false;

function closeTranslationSession() {
  if (translationSessionClosing) {
    return;
  }

  translationSessionClosing = true;
  ws.send(
    JSON.stringify({
      type: "session.close",
    })
  );
}

ws.on("message", (data) => {
  const event = JSON.parse(data.toString());

  if (event.type === "session.output_audio.delta") {
    playPcm16(event.delta);
  }

  if (event.type === "session.output_transcript.delta") {
    process.stdout.write(event.delta);
  }

  if (event.type === "session.input_transcript.delta") {
    updateSourceTranscript(event.delta);
  }

  if (event.type === "session.closed") {
    ws.close();
  }
});

// Call this when the source stream ends.
closeTranslationSession();
```

```python
translation_session_closing = False


def close_translation_session():
    global translation_session_closing
    if translation_session_closing:
        return

    translation_session_closing = True
    ws.send(json.dumps({"type": "session.close"}))


# Call this when the source stream ends.
close_translation_session()

while True:
    event = json.loads(ws.recv())

    if event["type"] == "session.output_audio.delta":
        play_pcm16(event["delta"])

    if event["type"] == "session.output_transcript.delta":
        print(event["delta"], end="", flush=True)

    if event["type"] == "session.input_transcript.delta":
        update_source_transcript(event["delta"])

    if event["type"] == "session.closed":
        ws.close()
        break
```


## 构建跟随收听翻译

当单一来源说话人或流需要为听众提供翻译音频时，请使用“跟随收听”翻译。示例包括直播、会议演讲、网络研讨会、财报电话会议、讲座和视频。

典型架构为：

```text
source audio -> translation session -> translated audio + subtitles
```

为每种目标语言创建一个翻译会话。如果相同的英文源需要西班牙语和法语输出，请分别创建一个英语到西班牙语的会话和一个英语到法语的会话。

对于浏览器“跟随收听”应用，捕获标签页音频的方式为 `getDisplayMedia()`，通过 WebRTC 发送它，并播放远程翻译的音频轨道。对于生产广播，在服务器媒体工作器中运行翻译，并将翻译后的音频轨道或字幕发布给听众。

## 构建对话式翻译

当两个或更多参与者使用不同语言交谈时，使用对话翻译。示例包括支持电话、销售电话、辅导和视频房间。

保持参与者音频轨道分离。将说话者混合到一个流中会使说话者身份、说话者字幕和重叠语音难以处理。

对于两人通话，每个方向创建一个翻译会话：

```text
Caller A audio -> translate into Caller B language -> play to Caller B
Caller B audio -> translate into Caller A language -> play to Caller A
```

对于群组房间，会话数量取决于活跃发言者和目标语言：

```text
translation sessions ~= active source speaker tracks x distinct target languages
```

对于小型房间，每个听众可以为想要翻译的远程发言者创建浏览器端的翻译辅助会话。对于较大房间，使用服务端参与者或媒体工作者，订阅每个源发言者一次，为每种目标语言创建一个翻译会话，并重新发布翻译后的轨道。

## 测试质量与延迟

使用真实音频和双语审查进行测试翻译。自动化指标可以提供帮助，但它们无法捕捉用户注意到的每一个错误。

测试：

- 语言配对质量；
- 名称、数字、日期、货币和电话号码；
- 领域特定术语；
- 代码切换和混合语言对话；
- 口音、快速语音和重叠语音；
- 首次翻译音频延迟；
- 语句结束延迟；
- 字幕时间控制；
- 语音一致性；
- 重连行为。

如果你的用例依赖确切的名称或领域术语，请在发布前构建黄金数据集并手动审查失败案例。

## 生产环境检查清单

- 对于浏览器媒体，请选择 WebRTC；对于服务器媒体，请选择 WebSockets。
- 使用专用的 `/v1/realtime/translations` 端点。
- 持续流式传输音频，包括短语之间的静音。
- 使用 `session.close` 并等待 `session.closed` 在关闭 WebSocket 会话之前。
- 对于对话翻译，保持说话人音轨分离。
- 每种输出语言使用一个会话。
- 在有用时，同时呈现源语言和目标语言的转录文本。
- 提供对原始音频、翻译音频、字幕、静音和音量的控制。
- 显示重连、延迟和不可用状态。
- 将延迟与翻译质量分开跟踪。

## 相关指南

[实时与音频概览



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[WebRTC 连接



      Connect browser media to a realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[WebSocket 连接



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[实时转录



      Stream transcript deltas from live audio.](https://developers.openai.com/api/docs/guides/realtime-transcription)