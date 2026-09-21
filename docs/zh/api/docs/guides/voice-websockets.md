# WebSockets

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

选择你的 API 以查看其连接步骤和会话事件。



## 将服务器连接到 GPT-Live

在你的服务器捕获音频或为客户端中继音频流时，使用主 WebSocket。它在两个方向上都承载音频和 JSON 事件。请将项目 API 密钥保存在该受信任的服务器上。针对浏览器和移动应用，请从 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live).

本指南介绍如何将音频流式传输到 GPT-Live。若要监控或控制现有会话，请参阅 [服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live)。若要将推理和工具后端连接到 Responses API,请参阅 [Responses WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode).

### 进行身份验证并开启会话

1. 连接到 `wss://api.openai.com/v1/live/sessions` ，不使用任何查询参数。通过 `Authorization: Bearer $OPENAI_API_KEY` 进行身份验证，并在请求中附带示例所示的连接标头。
2. 发送 `session.start` 作为第一条消息。将模型、会话指令、音频格式、语音以及委托配置放入 `session` 对象中。
3. 等待 `session.started` 后再发送音频或应用命令。它包含已解析的会话配置和会话 ID。

下面的示例使用 Marin、PCM16 音频（24 kHz）以及带 网页搜索 的 Responses 后端。请保持对话指令简洁。通过以下方式配置后端指令、工具及工具权限： [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation).

### 使用 SDK 流式传输音频

对于 Node.js，请安装 `openai` 并将 `ws` 与 `npm install openai ws` 并将 JavaScript 示例保存为 `client.mjs`。对于 macOS 或 Linux 上的 Python，请安装 `openai[realtime]` 并将 Python 示例保存为 `client.py`。设置 `OPENAI_API_KEY` 在服务端环境中运行。这些示例需要支持 Live 的 SDK 版本。示例从标准输入读取原始的单声道 PCM16 音频（采样率 24 kHz），并将返回的音频以相同格式写入标准输出。请将这些流连接到你的应用的音频采集与播放。日志和转写事件输出到标准错误，以免污染音频流。

```javascript
import OpenAI from "openai";
import { LiveWS } from "openai/resources/live/ws";

// stdin and stdout carry raw mono PCM16 audio at 24 kHz, not WAV files.
// Supply microphone bytes continuously and play stdout in the same format.
process.stdin.pause();
const ws = new LiveWS(new OpenAI());
let started = false;
let closing = false;
let finalized = false;
let pendingByte = Buffer.alloc(0);

let closeTimeout;

ws.socket.on("open", () => {
  ws.send({
    type: "session.start",
    event_id: "event_start",
    session: {
      model: "gpt-live-1",
      instructions:
        "Be concise. Delegate requests needing current information to the backend, which can search the web.",
      audio: {
        format: { type: "audio/pcm", rate: 24000 },
        output: { voice: "marin" },
      },
      delegation: {
        type: "responses",
        responses: {
          model: "gpt-5.6-luna",
          tools: [{ type: "web_search" }],
          tool_choice: "auto",
        },
      },
    },
  });
});

process.stdin.on("data", (chunk) => {
  if (!started || closing || ws.socket.readyState !== 1) return;
  const bytes = Buffer.concat([pendingByte, chunk]);
  const completeLength = bytes.length - (bytes.length % 2);
  pendingByte = bytes.subarray(completeLength);
  if (completeLength) {
    ws.send({
      type: "session.input_audio.append",
      audio: bytes.subarray(0, completeLength).toString("base64"),
    });
  }
});

// Register the final-event handler before any close command can be sent.
ws.on("event", (event) => {
  if (event.type === "session.started") {
    started = true;
    console.error("Session ready", event.session.id);
    process.stdin.resume();
  } else if (event.type === "session.output_audio.delta") {
    process.stdout.write(Buffer.from(event.delta, "base64"));
  } else if (event.type === "session.closed") {
    finalized = true;
    clearTimeout(closeTimeout);
    process.stdin.pause();
    console.error("Final session usage", event.usage);
    ws.close();
  } else {
    // Includes transcript deltas and nested response.event usage.
    console.error(JSON.stringify(event));
  }
});

process.on("SIGINT", () => {
  if (closing) return;
  if (!started || ws.socket.readyState !== 1) {
    ws.socket.platformSocket.terminate();
    return;
  }
  closing = true;
  process.stdin.pause();
  ws.send({ type: "session.close" });
  closeTimeout = setTimeout(() => {
    console.error("Incomplete finalization: session.closed was not received");
    process.exitCode = 1;
    ws.socket.platformSocket.terminate();
  }, 15_000);
});
ws.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
ws.socket.on("close", () => {
  clearTimeout(closeTimeout);
  process.stdin.pause();
  if (!finalized) {
    console.error("Connection closed without final session usage");
    process.exitCode = 1;
  }
});
```

```python
import asyncio
import base64
import os
import signal
import sys

from openai import AsyncOpenAI
from openai.types.live.session_config_param import SessionConfigParam


async def main() -> None:
    # stdin/stdout carry raw mono PCM16 at 24 kHz, not WAV files.
    session: SessionConfigParam = {
        "model": "gpt-live-1",
        "instructions": "Be concise. Delegate requests needing current information to the backend, which can search the web.",
        "audio": {
            "format": {"type": "audio/pcm", "rate": 24000},
            "output": {"voice": "marin"},
        },
        "delegation": {
            "type": "responses",
            "responses": {
                "model": "gpt-5.6-luna",
                "tools": [{"type": "web_search"}],
                "tool_choice": "auto",
            },
        },
    }
    loop = asyncio.get_running_loop()
    chunks: asyncio.Queue[bytes] = asyncio.Queue()
    finalized = asyncio.Event()
    closing = False
    pending = b""
    close_task: asyncio.Task[None] | None = None

    def read_audio() -> None:
        chunk = os.read(sys.stdin.fileno(), 4800)
        if chunk:
            chunks.put_nowait(chunk)
        else:
            # EOF does not end a Live session. Use SIGINT to finalize it.
            loop.remove_reader(sys.stdin.fileno())

    async with AsyncOpenAI() as client:
        async with client.live.connect() as connection:

            async def send_audio() -> None:
                nonlocal pending
                while True:
                    chunk = pending + await chunks.get()
                    complete = len(chunk) - len(chunk) % 2
                    pending = chunk[complete:]
                    if complete and not closing:
                        await connection.session.input_audio.append(
                            audio=base64.b64encode(chunk[:complete]).decode("ascii")
                        )

            async def close_session() -> None:
                nonlocal closing
                closing = True
                loop.remove_reader(sys.stdin.fileno())
                await connection.session.close()
                try:
                    await asyncio.wait_for(finalized.wait(), timeout=15)
                except TimeoutError:
                    print(
                        "Incomplete finalization: no session.closed event",
                        file=sys.stderr,
                    )
                    await connection.close()

            def request_close() -> None:
                nonlocal close_task
                if close_task is None:
                    close_task = asyncio.create_task(close_session())

            # Start receiving before a close command can be requested.
            await connection.session.start(session=session, event_id="event_start")
            sender = asyncio.create_task(send_audio())
            try:
                async for event in connection:
                    if event.type == "session.started":
                        print("Session ready", event.session.id, file=sys.stderr)
                        loop.add_reader(sys.stdin.fileno(), read_audio)
                        loop.add_signal_handler(signal.SIGINT, request_close)
                    elif event.type == "session.output_audio.delta":
                        sys.stdout.buffer.write(base64.b64decode(event.delta))
                        sys.stdout.buffer.flush()
                    elif event.type == "session.closed":
                        print("Final session usage", event.usage, file=sys.stderr)
                        finalized.set()
                        break
                    else:
                        print(event.model_dump_json(), file=sys.stderr)
            finally:
                loop.remove_reader(sys.stdin.fileno())
                loop.remove_signal_handler(signal.SIGINT)
                sender.cancel()
                await asyncio.gather(sender, return_exceptions=True)
                if close_task is not None:
                    await close_task
            if not finalized.is_set():
                raise RuntimeError("Connection closed without final session usage")


if __name__ == "__main__":
    asyncio.run(main())
```


运行 `node client.mjs` 或 `python client.py` 并连接你的音频源与播放器。出现 `Session ready` 时，提供一个按其录制采样率连续输入的麦克风流。一次管道传输整个文件并不能模拟实时麦克风。音频源上的 EOF 不会结束对话。请发送 `SIGINT` 给进程以请求优雅关闭。

该示例仅连接音频流；采集、缓冲、播放以及必要的重采样由你的应用负责。在评估模型行为之前，请先结合你的设备和网络测试这些部分。

### 选择音频格式

设置 `session.audio.format` at startup. One format applies to both input and output and cannot change during the session.

- `{"type":"audio/pcm","rate":24000}`: 单声道有符号 16 位小端 PCM，采样率 24 kHz；默认值。
- `{"type":"audio/pcm","rate":16000}`: 单声道有符号 16 位小端 PCM，采样率 16 kHz。
- `{"type":"audio/pcmu","rate":8000}`: G.711 μ-law，采样率 8 kHz，每个样本一个字节。
- `{"type":"audio/pcma","rate":8000}`: G.711 A-law，采样率 8 kHz，每个样本一个字节。

对原始字节进行 Base64 编码，不要添加 WAV 或其他容器头。PCM 数据块必须包含完整的 16 位采样，因此其字节长度必须为偶数。示例会将一个尾部字节带入下一个输入分块。除分块边界之外的其他方面可以任意选择：保持一个连续且有序的流。

当音频采样率与配置的采样率不一致时，需要对音频进行重采样。更改格式设置不会转换你的输入字节。要使该示例适配 G.711，请转发每个分块的编解码器字节，去掉 PCM 特有的两字节对齐逻辑，并将输出播放器配置为使用相同的编解码器。匹配的 G.711 流可以不经转换直接以 PCM 形式传输。详见 [电话集成](https://developers.openai.com/api/docs/guides/voice-sip?api=live) ，了解如何接入电话呼叫。

### 发送和接收事件

将每个事件作为 JSON 文本消息发送。音频在这些消息中以 base64 形式传输。

- **发送音频：** send `session.input_audio.append` with raw, base64-encoded bytes in `audio`. Audio appends have no acknowledgment.
- **接收音频：** decode `delta` from each `session.output_audio.delta` event and queue the audio for playback in order, using the configured format.
- **接收转录：** append the text in `delta` from `session.input_transcript.delta` and `session.output_transcript.delta` to the corresponding transcript.
- **接收后端事件：** when using Responses delegation, process the nested `event` in each `response.event` envelope.
- **处理错误：** handle rejected commands and session errors from `error` events. Use `error.client_event_id`，用于在存在时识别该命令。

使用应用的音频队列跟踪播放。GPT-Live 的主 WebSocket 发送输出音频时不包含时间戳字段或 output-audio-done 事件。请使用转录时间戳来整理字幕，并结合后端事件来跟踪委托工作。

GPT-Live 会持续管理音频流的听与说时机。请使用 `response.create` 来启动或继续委托的后端工作。详见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 以了解该 工作流。

### 配置一个持续的会话

Live 模型、初始对话指令、音频格式、声音和委托模式在启动时即已固定。请使用 `session.update` 在现有委托模式支持的设置范围内进行调整；未指定的设置保持当前值。成功更新后会返回 `session.updated` ，其中包含已解析的会话配置。

使用 `session.instructions.append` 添加对话指令，使用 `session.input_audio.mute` 或 `session.input_audio.unmute` 控制传入的音频。静音输入不会取消后端工作，也不会停止已生成的语音。详见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解上下文更新、转录、输入控制和使用情况。

### 关闭会话

发送 `session.close` 当会话结束时的消息。先安装 `session.closed` 监听器，持续接收直到该事件到达，然后释放连接。示例会等待最多 15 秒，若终止事件始终未到达则报告未完成。

保留来自 `session.closed` 的最终语音用量以及已收到的后端用量事件。语音时长更新是累计快照，不要将它们相加。在 `session.closed` 之前发生的传输失败或超时将导致最终用量无法确认。详见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 以了解完整生命周期。

  

  


[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 是一种广泛支持的 API，可用于实时数据传输，也是服务端到服务端应用中连接 OpenAI Realtime API 的理想选择。对于浏览器和移动客户端，我们建议通过 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime).

在服务端到服务端的 Realtime 集成中，你的后端系统将通过 WebSocket 直接连接到 Realtime API。你可以使用一个 [标准的 API 密钥](https://platform.openai.com/settings/organization/api-keys) 对该连接进行身份验证，因为该令牌仅在你安全的后端服务器上可用。

![直接连接到 realtime API](https://openaidevs.retool.com/api/file/464d4334-c467-4862-901b-d0c6847f003a)

## 通过 WebSocket 连接

下面是一些通过 WebSocket 连接到 Realtime API 的示例。除了使用下面的 WebSocket URL 之外，你还需要使用你的 OpenAI API 密钥传递身份验证标头。如果你的应用程序分配 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，请在 `OpenAI-Safety-Identifier` 标头中传递稳定的、保护隐私的最终用户标识符。

如以下示例所示，可以在浏览器中使用临时 API 令牌来使用 WebSocket [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)，但如果你从浏览器或移动应用等客户端进行连接，在大多数情况下，WebRTC 会是更稳健的解决方案。

<ContentSwitcher
  id="connection-example"
  initialValue="ws"
  options={[
    { value: "ws", label: "ws module (Node.js)" },
    { value: "python", label: "websocket-client (Python)" },
    { value: "ruby", label: "OpenAI SDK (Ruby)" },
    { value: "websocket", label: "WebSocket (browsers)" },
  ]}
>
  

    
ws module (Node.js)

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

  

  

    
OpenAI SDK (Ruby)

    

      Install the required gems with 
      `gem install openai async-websocket`.
    

    Connect with the OpenAI SDK (Ruby)

```ruby
require "openai"

client = OpenAI::Client.new(
  default_headers: { "OpenAI-Safety-Identifier" => "hashed-user-id" }
)

client.realtime.connect(model: "gpt-realtime-2.1") do |connection|
  puts("Connected to the Realtime API: #{connection.url.host}")
  connection.each { |event| puts("Received event: #{event.type}") }
end
```

  

  

    
WebSocket (browsers)

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



## Sending and receiving events

Realtime API sessions are managed using a combination of [client-sent events](https://developers.openai.com/api/reference/resources/realtime/client-events#session.update) emitted by you as the developer, and [server-sent events](https://developers.openai.com/api/reference/resources/realtime/server-events#error) created by the Realtime API to indicate session lifecycle events.

Over a WebSocket, you will both send and receive JSON-serialized events as strings of text, as in this Node.js example below (the same principles apply for other WebSocket libraries):

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


The WebSocket interface is perhaps the lowest-level interface available to interact with a Realtime model, where you will be responsible for both sending and processing Base64-encoded audio chunks over the socket connection.

To learn how to send and receive audio over Websockets, refer to the [Realtime conversations guide](https://developers.openai.com/api/docs/guides/realtime-conversations#handling-audio-with-websockets).

  

</ContentSwitcher>