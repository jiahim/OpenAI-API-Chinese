# 实时翻译

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

实时翻译可让你将源音频流式传输到专用翻译会话中，并在说话者仍在讲话时接收翻译后的音频以及转录增量。可用于实时口译、多语言通话、广播、会议、课堂和视频会议室等场景。

使用 [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 当你的应用需要翻译人类所说的内容时，请使用它。如果你需要一个能够回答问题、调用工具并管理对话的助手，请使用 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) 配合标准的 Realtime 会话。

## 翻译会话的差异

实时翻译会话使用与语音智能体会话不同的架构：

| Voice-智能体 会话                         | 翻译会话                              |
| ------------------------------------------- | ------------------------------------------------ |
| 连接到 `/v1/realtime`.                 | 连接到 `/v1/realtime/translations`.         |
| 模型充当助手。             | 模型充当口译员。                |
| 使用对话与响应生命周期。 | 持续从传入的音频流式接收。        |
| 可以调用工具并生成助手轮次。 | 生成翻译后的音频和转录增量。 |
| 你可以调用 `response.create`.             | 你不能调用 `response.create`.                |

从音频流本身开始翻译。持续追加音频，包括短语之间的静音，并按到达顺序处理输出事件。

## 选择传输方式

当浏览器捕获或播放音频时，使用 WebRTC。WebRTC 将源音频作为媒体轨道发送，并接收翻译后的语音作为远端音频轨道，因此你无需手动重采样或播放 PCM 数据块。

当你的服务器已接收原始音频时，使用 WebSockets，例如 Twilio Media Streams、SIP 媒体、广播接入或媒体工作进程。使用 WebSockets 时，发送 base64 编码的 24 kHz PCM16 音频，并自行播放返回的音频增量。

## 创建浏览器 WebRTC 会话

对于浏览器应用，请在你的服务端创建一个短时效的客户端密钥。不要在浏览器中暴露你的标准 API 密钥。

创建一个翻译客户端密钥

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


在浏览器中，采集音频、创建点对点连接，并向翻译通话端点提交 SDP offer：

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

运行此示例前，请先安装 `ws` （Node.js）、 `websocket-client` （Python）或 `async-websocket` （Ruby）（`gem install async-websocket`).

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

```ruby
require "async"
require "async/http/endpoint"
require "async/websocket/client"
require "json"

endpoint = Async::HTTP::Endpoint.parse("wss://api.openai.com/v1/realtime/translations?model=gpt-realtime-translate", timeout: 10, alpn_protocols: ["http/1.1"])
headers = {"Authorization" => "Bearer #{ENV.fetch("OPENAI_API_KEY")}", "OpenAI-Safety-Identifier" => "hashed-user-id"}
Sync do |task|
  task.with_timeout(120) do
    Async::WebSocket::Client.connect(endpoint, headers: headers) do |connection|
      message = connection.read or raise "Connection closed before session creation"
      event = JSON.parse(message.to_str)
      raise "Expected session.created: #{event}" unless event["type"] == "session.created"
      puts(event.fetch("type"))
    end
  end
end
```


对于 Ruby，将以下配置和音频追加代码片段插入到 `Async::WebSocket::Client.connect` 块中，位于 session-created 检查之后、块结束之前。在发送音频和接收翻译事件期间保持连接处于打开状态。

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

```ruby
connection.write(JSON.generate(type: "session.update", session: {audio: {output: {language: "es"}}}))
connection.flush
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

```ruby
require "base64"

File.open("speech.pcm", "rb") do |audio|
  while (chunk = audio.read(4_800))
    connection.write(JSON.generate(type: "session.input_audio_buffer.append", audio: Base64.strict_encode64(chunk)))
    connection.flush
  end
end
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

当你的源流结束时，发送一个 [`session.close`](https://developers.openai.com/api/reference/resources/realtime/translation-client-events#session-close) 事件后再关闭 WebSocket。该事件会通知服务端刷新待处理的输入音频、输出剩余的翻译音频和转录结果，然后再发送一个 `session.closed` 事件。该 `session.close` 事件仅在翻译会话中受支持。

在你发送 `session.close`，之后，停止追加音频，并在正常的接收循环中继续读取事件，直到收到 `session.closed`。立即关闭套接字可能会丢失会话中仍在排出的翻译输出。

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


## 构建跟听翻译

在单个说话人或音频流需要面向受众提供翻译后的音频时，可以使用“同步跟听”翻译。示例包括直播、会议演讲、网络研讨会、财报电话会议、讲座和视频。

典型架构如下：

```text
source audio -> translation session -> translated audio + subtitles
```

为每个目标语言创建一个翻译会话。如果同一段英文源内容需要输出西班牙语和法语，就创建一个英语到西班牙语的会话，以及一个英语到法语的会话。

对于浏览器的同步跟听应用，使用 `getDisplayMedia()`，捕获标签页音频，通过 WebRTC 发送，并播放远端的翻译音频轨道。对于生产级别的广播，在服务端媒体 worker 中运行翻译，并将翻译后的音频轨道或字幕发布给听众。

## 构建对话式翻译

当两位或更多参与者跨语言交谈时，可使用会话式翻译。例如客服通话、销售通话、辅导教学和视频会议室等场景。

将各参与者的音轨分开保留。如果将多位说话人混为一条流，会让说话人身份、说话人字幕以及重叠语音的处理更加困难。

对于双人通话，按方向各创建一个翻译会话：

```text
Caller A audio -> translate into Caller B language -> play to Caller B
Caller B audio -> translate into Caller A language -> play to Caller A
```

对于群组房间，会话数量取决于活跃说话人和目标语言：

```text
translation sessions ~= active source speaker tracks x distinct target languages
```

对于小型房间，每个听众可以在浏览器端为想要翻译的远端说话人创建翻译旁路进程。对于较大的房间，则使用一个订阅每个源说话人一次的服务端参与者或媒体处理单元，为每个目标语言创建一个翻译会话，并重新发布翻译后的音轨。

## 测试质量与延迟

使用真实音频和双语审校进行翻译测试。自动化指标有帮助，但无法捕捉用户注意到的每一个错误。

测试：

- 语言对质量；
- 姓名、数字、日期、货币和电话号码；
- 特定领域的术语；
- 语码转换和多语言对话；
- 口音、快速语音和重叠语音；
- 首段翻译音频的延迟；
- 语句结束延迟；
- 字幕时序；
- 音色一致性；
- 重连行为。

如果你的使用场景依赖精确的名称或领域术语，请在发布前构建一个黄金测试集，并人工复核失败案例。

## 生产环境检查清单

- 在浏览器媒体场景下选择 WebRTC，在服务端媒体场景下选择 WebSockets。
- 使用专用的 `/v1/realtime/translations` 端点。
- 持续流式传输音频，包括短语之间的静音部分。
- 使用 `session.close` 并等待 `session.closed` 再关闭 WebSocket 会话。
- 在对话式翻译中保持说话人音轨相互独立。
- 每种输出语言使用一个会话。
- 在需要时同时呈现源语言和目标语言转录文本。
- 提供原声、译音、字幕、静音和音量的控制选项。
- 展示重连中、延迟和不可用的状态。
- 将延迟与翻译质量分开跟踪。

## 相关指南

[实时和音频概述



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[WebRTC 连接



      Connect browser media to a realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[WebSocket 连接



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[实时转录



      Stream transcript deltas from live audio.](https://developers.openai.com/api/docs/guides/realtime-transcription)