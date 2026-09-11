# WebSockets

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

选择你的应用程序使用的 API。每个 API 都有自己的身份验证、会话创建和事件契约。



## 将服务器连接到 GPT-Live

在你的服务器捕获音频或为客户端中继音频流时，使用主 WebSocket。它双向传输音频和 JSON 事件。把你项目的 API 密钥保存在该受信服务器上。对于浏览器和移动应用，请从 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live).

本指南介绍主音频连接。一个 [sideband 连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 允许服务器观察并控制一个已有的 Live 会话。一个 [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode) 将你的后端连接到 Responses API，用于推理和工具调用。二者都不能替代主音频连接。

### 进行身份验证并启动会话

1. 连接到 `wss://api.openai.com/v1/live/sessions` ，不要带任何查询参数。使用 `Authorization: Bearer $OPENAI_API_KEY` 进行身份验证，并附带示例中展示的连接请求头。
2. 发送 `session.start` 作为第一条消息。将模型、对话指令、音频格式、语音和委派配置放入 `session` 对象中。
3. 等待 `session.started` ，然后再发送音频或应用命令。它包含已解析的会话配置和会话 ID。

下面的示例使用 Marin、PCM16 音频（24 kHz），以及带有 网页搜索 的 Responses 后端。请保持对话指令简洁。通过以下方式配置后端指令、工具和工具权限 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation).

### 使用 SDK 流式传输音频

对于 Node.js，安装 `openai` 并 `ws` 使用 `npm install openai ws` 并将 JavaScript 示例保存为 `client.mjs`. 对于 macOS 或 Linux 上的 Python，安装 `openai[realtime]` 并将 Python 示例保存为 `client.py`. 设置 `OPENAI_API_KEY` 在服务端环境中运行。这些示例需要支持实时功能的SDK版本。示例从标准输入读取 24 kHz 的原始单声道 PCM16 音频，并将返回的音频以相同格式写入标准输出。将这些流连接到你的应用的音频采集与播放。日志和转录事件输出到标准错误，以免污染音频流。

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
/** @type {ReturnType<typeof setTimeout> | undefined} */
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


运行 `node client.mjs` 或 `python client.py` 并接入你的音频源与播放器。出现 `Session ready` 后，提供按录制采样率连续输入的麦克风流。一次性管道传输整个文件无法模拟实时麦克风。音频源的 EOF 不会结束对话。发送 `SIGINT` 给该进程以请求优雅关闭。

示例负责连接音频流；采集、缓冲、播放以及必要时进行重采样由你的应用处理。在评估模型行为之前，请先使用你的设备和网络测试这些部分。

### 选择音频格式

Set `session.audio.format` 在启动时设置。输入和输出使用同一种格式，并且在该会话期间不可更改。

- `{"type":"audio/pcm","rate":24000}`: 单声道有符号 16 位小端 PCM，24 kHz；默认值。
- `{"type":"audio/pcm","rate":16000}`: 单声道有符号 16 位小端 PCM，16 kHz。
- `{"type":"audio/pcmu","rate":8000}`: G.711 μ-law，8 kHz，每样本一个字节。
- `{"type":"audio/pcma","rate":8000}`: G.711 A-law，8 kHz，每样本一个字节。

对原始字节进行 Base64 编码，且不要添加 WAV 或其他容器头。PCM 数据块必须包含完整的 16 位采样，因此其字节长度必须为偶数。示例会将一个尾随字节带入下一个输入数据块。除此之外，数据块的边界是任意的：保持连续且有序的流。

当音频的采样率与配置的采样率不一致时，对其进行重采样。更改格式设置不会转换你的输入字节。若要将该示例适配到 G.711，请转发每个数据块的编解码器字节，但不要使用 PCM 专属的两字节对齐逻辑，并将输出播放器配置为同一编解码器。匹配的 G.711 流可以在不转换为 PCM 的情况下直接透传。参见 [电话集成](https://developers.openai.com/api/docs/guides/voice-sip?api=live) 用于连接电话通话。

### 发送和接收事件

将每个事件作为 JSON 文本消息发送。音频在这些消息内部以 base64 形式传输。

- **发送音频：** send `session.input_audio.append` ，其中包含原始的、base64 编码的字节。音频追加没有确认。 `audio`. Audio appends have no acknowledgment.
- **接收音频：** decode `delta` from each `session.output_audio.delta` event 并按顺序将音频排队播放，使用配置的格式。
- **接收转录：** append the text in `delta` from `session.input_transcript.delta` and `session.output_transcript.delta` 追加到对应的转录中。
- **接收后端事件：** 在使用 Responses 委托时，处理每个事件中嵌套的 `event` in each `response.event` envelope。
- **处理错误：** 处理来自 `error` 事件的被拒绝命令和会话错误。使用 `error.client_event_id`，用于在存在时标识该命令。

输出音频事件没有时间字段，GPT-Live 也不会发出 output-audio-done 事件。请通过追踪自己的播放队列来了解已接收音频的播放情况。转录时间戳描述的是会话时间线上的区间，并不表示音频播放完成。后端响应完成也不意味着助手已经说完话。

GPT-Live 管理音频流的收听与发言时机。它不使用 Realtime 的 input-buffer commit 和 `response.create` 语音回合循环。在 Live 中， `response.create` 启动或继续委托的后端工作。详见 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation) 以了解该 工作流。

### 配置持续会话

实时模型、初始对话指令、音频格式、语音和委派模式在启动时即已固定。使用 `session.update` 可在现有委派模式内更新受支持的设置；未指定的设置保留其当前值。成功更新后会返回 `session.updated` ，其中包含已解析的会话配置。

使用 `session.instructions.append` 来添加对话指令，使用 `session.input_audio.mute` 或 `session.input_audio.unmute` 来控制传入音频。静音输入不会取消后端任务，也不会停止已生成的语音。详见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) ，了解上下文更新、转录、输入控制和使用情况。

### 关闭会话

发送 `session.close` 事件。首先安装该 `session.closed` 监听器，持续接收直至该事件到达，然后释放连接。示例中最多等待 15 秒，若终止事件始终未到达，则报告最终化未完成。

从 `session.closed` 以及已收到的后端用量事件中保留最终的语音用量。语音时长更新是累计快照，请勿将其相加。在 `session.closed` 之前的传输失败或超时将导致最终用量无法确认。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 以了解完整生命周期。

  

  


[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 是一类被广泛支持的 API，用于实时数据传输，是在服务端到服务端应用中连接 OpenAI Realtime API 的理想选择。对于浏览器和移动端客户端，我们建议通过 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime).

在服务端到服务端的 Realtime 集成中，你的后端系统将通过 WebSocket 直接连接到 Realtime API。你可以使用一个 [标准的 API 密钥](https://platform.openai.com/settings/organization/api-keys) 对该连接进行身份验证，因为该令牌仅在你的安全后端服务器上可用。

![直接连接到 realtime API](https://openaidevs.retool.com/api/file/464d4334-c467-4862-901b-d0c6847f003a)

## 通过 WebSocket 连接

以下是一些通过 WebSocket 连接到 Realtime API 的示例。除了使用下方的 WebSocket URL，你还需要使用你的 OpenAI API 密钥传递认证请求头。如果你的应用为用户分配 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，请在 `OpenAI-Safety-Identifier` 请求头中传递稳定且保护隐私的最终用户标识符。

可以在浏览器中使用 WebSocket 配合临时 API 令牌，如 [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)，中所述，但在大多数情况下，如果你通过浏览器或移动应用等客户端进行连接，WebRTC 会是更稳健的方案。

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
  default_headers: {"OpenAI-Safety-Identifier" => "hashed-user-id"}
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