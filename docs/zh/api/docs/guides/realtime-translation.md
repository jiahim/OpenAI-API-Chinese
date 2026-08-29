# 实时翻译

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt). 通过在页面 URL 后追加 `.md` 可获取文档页面的 Markdown 版本。

实时翻译可让你将源音频流式传入专用的翻译会话，并在说话者仍在讲话时接收翻译后的音频和转录增量。可用于现场口译、多语言通话、广播、会议、课程和视频会议室。

使用 [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 当你的应用需要翻译人类所说的内容时。如果需要一个能回答问题、调用工具并管理对话的助手，请改用 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) 搭配标准的 Realtime 会话。

## 翻译会话的差异

实时翻译会话使用与语音智能体会话不同的架构：

| 语音-智能体会话                         | 翻译会话                              |
| ------------------------------------------- | ------------------------------------------------ |
| 连接到 `/v1/realtime`.                 | 连接到 `/v1/realtime/translations`.         |
| 模型充当助手。             | 模型充当口译员。                |
| 使用对话与响应生命周期。 | 从传入音频持续流式输出。        |
| 可以调用工具并生成助手回合。 | 产出翻译后的音频和转录增量。 |
| 可以调用 `response.create`.             | 不能调用 `response.create`.                |

翻译从音频流本身开始。持续追加音频，包括短语之间的静音，并实时处理到达的输出事件。

## 选择传输方式

当浏览器需要采集或播放音频时使用 WebRTC。WebRTC 会将源音频作为媒体轨道发送，并将译后的语音作为远端音频轨道返回，因此你无需手动重采样或播放 PCM 数据块。

当你的服务器已经接收到原始音频（例如 Twilio Media Streams、SIP 媒体、广播接入或媒体处理 worker）时使用 WebSockets。使用 WebSockets 时，需自行发送 base64 编码的 24 kHz PCM16 音频，并自行播放返回的音频增量数据。

## 创建浏览器 WebRTC 会话

对于浏览器应用，在你的服务端创建一个短期客户端密钥。不要在浏览器中暴露你的标准 API 密钥。

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


在浏览器中，采集音频、建立对等连接，并将 SDP offer 发送到翻译通话接口：

建立浏览器翻译通话

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

连接到专用翻译端点并在 URL 中选择模型：

安装适用于 Node.js 的 `ws` 包或适用于 Python 的 `websocket-client` 包，然后再运行此示例。

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

当你的源流结束时，请发送一个 [`session.close`](https://developers.openai.com/api/reference/resources/realtime/translation-client-events#session-close) 事件，然后关闭 WebSocket。该事件会通知服务端刷新待处理的输入音频，发出所有剩余的翻译音频和转录输出，然后再发送一个 `session.closed` 事件。该 `session.close` 事件仅在翻译会话中受支持。

在你发送 `session.close`，之后，停止追加音频，并在常规接收循环中继续读取事件，直到你收到 `session.closed`。立即关闭套接字可能会丢弃会话中仍在排出的翻译输出。

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


## 构建跟读翻译

当单个源说话者或音频流需要面向听众提供翻译后的音频时，请使用跟听式翻译。典型场景包括直播、会议演讲、网络研讨会、财报电话会议、讲座以及视频。

典型的架构如下：

```text
source audio -> translation session -> translated audio + subtitles
```

为每个目标语言创建一个翻译会话。如果同一段英文源内容需要输出西班牙语和法语，则分别创建一个英西翻译会话和一个英法翻译会话。

对于浏览器端的跟听式应用，使用 `getDisplayMedia()`，捕获标签页音频，通过 WebRTC 发送，并播放远端的翻译音频轨道。对于正式的广播场景，请在服务端媒体工作进程中运行翻译，并向听众发布翻译后的音频轨道或字幕。

## 构建对话式翻译

当两个或更多参与者跨语言交流时,使用对话式翻译。示例包括客服通话、销售通话、家教辅导和视频会议。

保持各参与者的音频轨道相互独立。将多个说话者混合到一个流中会增加说话人身份识别、说话人字幕以及重叠语音的处理难度。

对于两人通话,按方向各创建一个翻译会话:

```text
Caller A audio -> translate into Caller B language -> play to Caller B
Caller B audio -> translate into Caller A language -> play to Caller A
```

对于群组房间,会话数量取决于活跃说话者和目标语言数量:

```text
translation sessions ~= active source speaker tracks x distinct target languages
```

对于小型房间,每个听众可以在浏览器侧为需要翻译的远端说话者创建翻译附属进程。对于较大的房间,可使用 服务端 参与者或媒体工作进程,使其订阅每个源说话者一次、为每个目标语言创建一个翻译会话,并重新发布翻译后的轨道。

## 测试质量和延迟

使用真实音频和双语审阅进行测试。自动化指标有帮助，但无法捕捉用户注意到的每一个错误。

测试：

- 语言对质量；
- 姓名、数字、日期、货币和电话号码；
- 领域专业术语；
- 语码转换和混合语言对话；
- 口音、快速语音和重叠语音；
- 首段翻译音频延迟；
- 语句结束延迟；
- 字幕时间；
- 音色一致性；
- 重连行为。

如果你的用例依赖于确切的名字或领域术语，请在发布前构建一个黄金集并人工复核失败案例。

## 生产环境检查清单

- 浏览器端媒体选择 WebRTC，服务端媒体选择 WebSockets。
- 使用专用的 `/v1/realtime/translations` 端点。
- 持续流式传输音频，包括短语之间的静音。
- 使用 `session.close` 并等待 `session.closed` 再关闭 WebSocket 会话。
- 在对话翻译中保持说话人音轨相互独立。
- 每种输出语言使用一个会话。
- 在需要时同时呈现源语言和目标语言的转录文本。
- 提供原始音频、翻译音频、字幕、静音和音量的控制。
- 展示正在重连、延迟和不可用的状态。
- 将延迟与翻译质量分开跟踪。

## 相关指南

[Realtime and audio overview（实时与音频概述）



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[WebRTC connection（WebRTC 连接）



      Connect browser media to a realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[WebSocket connection（WebSocket 连接）



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[Realtime transcription（实时转录）



      Stream transcript deltas from live audio.](https://developers.openai.com/api/docs/guides/realtime-transcription)