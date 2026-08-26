# 实时对话

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

一旦你通过 API 连接到 Realtime，无论是 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc) 还是 [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket)，你都可以调用一个 Realtime 模型（例如 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)）来进行语音到语音的对话。这样做需要你 **发送客户端事件** 来启动操作，并 **监听服务器事件** 以响应 Realtime API 所执行的操作。

本指南将带你了解使用模型功能（如音频和文本生成、图像输入和函数调用）所需的事件流，以及如何思考 Realtime 会话的状态。

如果你不需要与模型进行对话，即你
  不期望任何响应，你可以在API中使用 Realtime [转录
  模式](https://developers.openai.com/api/docs/guides/realtime-transcription).

## 实时语音到语音会话

Realtime 会话是模型与已连接客户端之间的有状态交互。会话的关键组成部分包括：

- 该 **会话** 对象，它控制交互的参数，例如所使用的模型、用于生成输出的语音以及其他配置。
- 一个 **会话记录**，它表示当前会话期间生成的用户输入条目和模型输出条目。
- **响应**，即模型生成的音频或文本条目，会被添加到会话记录中。

**输入音频缓冲区与 WebSockets**

如果你使用 WebRTC，则与模型发送和接收音频所需的大部分媒体处理都会由 WebRTC API 辅助完成。



如果你使用 WebSockets 进行音频通信，则需手动与 **输入音频缓冲区** 交互，即通过 JSON 事件向服务器发送 base64 编码的音频。

所有这些组件共同构成一个实时会话。你将使用客户端事件来更新会话状态，并监听服务器事件以响应会话内的状态变化。

![实时状态图](https://openaidevs.retool.com/api/file/11fe71d2-611e-4a26-a587-881719a90e56)

## 会话生命周期事件

通过以下任一方式发起会话后， [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc) 或 [WebSockets](https://developers.openai.com/api/docs/guides/realtime-websocket)，服务器将发送一个 [`session.created`](https://developers.openai.com/api/reference/resources/realtime) 事件，表明会话已就绪。在客户端，你可以通过 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件更新当前会话配置。大多数会话属性可以随时更新，但 `voice` （模型用于音频输出的属性）除外，它在会话中模型已响应过音频后不可更改。Realtime 会话的最长持续时间为 **60 分钟**.

以下示例演示了如何通过 `session.update` 客户端事件更新会话。有关通过这些通道发送客户端事件的更多信息，请参阅 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc#sending-and-receiving-events) 或 [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket#sending-and-receiving-events) 指南。

更新本会话中模型使用的系统指令

```javascript
const event = {
  type: "session.update",
  session: {
    type: "realtime",
    model: "gpt-realtime-2.1",
    // Lock the output to audio (set to ["text"] if you want text without audio)
    output_modalities: ["audio"],
    audio: {
      input: {
        format: {
          type: "audio/pcm",
          rate: 24000,
        },
        turn_detection: {
          type: "semantic_vad",
        },
      },
      output: {
        format: {
          type: "audio/pcm",
        },
        voice: "marin",
      },
    },
    // Use a server-stored prompt by ID. Optionally pin a version and pass variables.
    prompt: {
      id: "pmpt_123", // your stored prompt ID
      version: "89", // optional: pin a specific version
      variables: {
        city: "Paris", // example variable used by your prompt
      },
    },
    // You can still set direct session fields; these override prompt fields if they overlap:
    instructions:
      "Speak clearly and briefly. Confirm understanding before taking actions.",
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
event = {
    "type": "session.update",
    "session": {
        "type": "realtime",
        "model": "gpt-realtime-2.1",
        # Lock the output to audio (add "text" if you also want text).
        "output_modalities": ["audio"],
        "audio": {
            "input": {
                "format": {
                    "type": "audio/pcm",
                    "rate": 24000,
                },
                "turn_detection": {"type": "semantic_vad"},
            },
            "output": {
                "format": {
                    "type": "audio/pcmu",
                },
                "voice": "marin",
            },
        },
        # Use a server-stored prompt by ID. Optionally pin a version and pass variables.
        "prompt": {
            "id": "pmpt_123",  # Your stored prompt ID.
            "version": "89",  # Optional: pin a specific version.
            "variables": {
                "city": "Paris",  # Example variable used by your prompt.
            },
        },
        # Direct session fields override prompt fields if they overlap.
        "instructions": "Speak clearly and briefly. Confirm understanding before taking actions.",
    },
}
ws.send(json.dumps(event))
```


当会话更新后，服务器将发出一个 [`session.updated`](https://developers.openai.com/api/reference/resources/realtime) 事件，包含会话的新状态。

<table>
  <tr>
    <th>Related client events</th>
    <th>Related server events</th>
  </tr>
  <tr>
    <td>
      [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
    <td>
      [`session.created`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`session.updated`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
  </tr>
</table>

## 文本输入与输出

要使用 Realtime 模型生成文本，你可以向当前对话添加文本输入，让模型生成响应，并监听表示模型响应进度的服务器发送事件。为了生成文本， [必须将会话配置为](https://developers.openai.com/api/reference/resources/realtime) 使用 `text` 模态（默认情况下如此）。

使用 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件创建新的文本对话项。这类似于在 Chat Completions 中发送 [用户消息（提示）](https://developers.openai.com/api/docs/guides/text) REST API 中的。

使用用户输入创建对话项

```javascript
const event = {
  type: "conversation.item.create",
  item: {
    type: "message",
    role: "user",
    content: [
      {
        type: "input_text",
        text: "What Prince album sold the most copies?",
      },
    ],
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
event = {
    "type": "conversation.item.create",
    "item": {
        "type": "message",
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": "What Prince album sold the most copies?",
            }
        ],
    },
}
ws.send(json.dumps(event))
```


将用户消息添加到对话后，发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件以启动模型的响应。如果当前会话同时启用了音频和文本，模型将同时返回音频和文本内容。如果你只想生成文本，可以在发送 `response.create` 客户端事件时指定，如下所示。

仅生成文本响应

```javascript
const event = {
  type: "response.create",
  response: {
    output_modalities: ["text"],
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
event = {"type": "response.create", "response": {"output_modalities": ["text"]}}
ws.send(json.dumps(event))
```


当响应完全完成时，服务器将发出 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件。该事件将包含模型生成的完整文本，如下所示。

监听 response.done 以查看最终结果

```javascript
function handleEvent(message) {
  const data = "data" in message ? message.data : message.toString();
  const serverEvent = JSON.parse(data);
  if (serverEvent.type === "response.done") {
    console.log(serverEvent.response.output[0]);
  }
}

// Listen for server messages (WebRTC)
dataChannel.addEventListener("message", handleEvent);

// Listen for server messages (WebSocket)
// ws.on("message", handleEvent);
```

```python
def on_message(ws, message):
    server_event = json.loads(message)
    if server_event["type"] == "response.done":
        print(server_event["response"]["output"][0])
```


在生成模型响应的过程中，服务器会发出多个生命周期事件。你可以监听这些事件，例如 [`response.output_text.delta`](https://developers.openai.com/api/reference/resources/realtime)，以便在响应生成时向用户提供实时反馈。服务器发出的事件的完整列表见下文 **相关服务器事件**。它们按照发出的大致顺序排列，并附有文本生成的相关客户端事件。

<table>
  <tr>
    <th>Related client events</th>
    <th>Related server events</th>
  </tr>
  <tr>
    <td>
      [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.create`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
    <td>
      [`conversation.item.added`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.created`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_item.added`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.content_part.added`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_text.delta`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_text.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.content_part.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`rate_limits.updated`](https://developers.openai.com/api/reference/resources/realtime/server-events#rate_limits.updated)
    </td>
  </tr>
</table>

## 音频输入与输出

Realtime API 最强大的功能之一是与模型进行语音到语音的交互，无需中间的文本转语音或语音转文本步骤。这降低了语音接口的延迟，并为模型提供了更多关于语音输入语气和语调的数据。

### 语音选项

实时会话可配置为在生成音频输出时使用多种内置语音之一。你可以在 `voice` 中设置 `response.create`（或在 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`, `marin`，和 `cedar`）来控制模型的声音。当前语音选项为 `voice` , 和 `marin` 。一旦模型在会话中发出音频， `cedar`.

### 使用 WebRTC 处理音频

如果你通过 WebRTC 连接到 Realtime API，Realtime API 充当 [对等连接](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) 连接到你的客户端。模型的音频输出作为 [远端媒体流](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)。传送到你的客户端。模型的音频输入通过音频设备（[`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)）收集，媒体流作为轨道添加到对等连接中。

来自 [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/realtime-webrtc) 的示例代码展示了使用浏览器 API 配置本地和远程音频的基本示例：

```javascript
// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
const audioEl = document.createElement("audio");
audioEl.autoplay = true;
pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
pc.addTrack(ms.getTracks()[0]);
```


上述代码片段实现了与 Realtime API 的简单交互，但还有更多功能可以实现。有关不同类型用户界面的更多示例，请查看 [WebRTC 示例](https://github.com/webrtc/samples) 仓库。这些示例的实时演示也可以 [在此查看](https://webrtc.github.io/samples/).

使用 [媒体捕获与流](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API) 在浏览器中可以让你实现诸如静音和取消静音麦克风、选择输入设备等操作。

### WebRTC 中音频的客户端与服务端事件

默认情况下，WebRTC 客户端在发送音频输入之前，无需向 Realtime API 发送任何客户端事件。一旦本地音频轨道添加到对等连接中，你的用户就可以直接开始说话！

然而，WebRTC 客户端在音频通过对等连接在客户端和服务器之间来回传输时，仍会收到许多由服务器发送的生命周期事件。例如：

- 当输入通过本地媒体轨道发送时，你将收到 [`input_audio_buffer.speech_started`](https://developers.openai.com/api/reference/resources/realtime) 来自服务器的事件。
- 当本地音频输入停止时，你将收到 [`input_audio_buffer.speech_stopped`](https://developers.openai.com/api/reference/resources/realtime) 事件。
- 你将收到 [进行中音频转录的 delta 事件](https://developers.openai.com/api/reference/resources/realtime).
- 当模型完成转录并发送响应时，你将收到一个 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件。

操作 WebRTC API 来处理媒体流可能会提供你所需的全部控制。然而，有时可能需要使用更低层的接口进行音频输入和输出。请参阅下面的 WebSockets 部分，了解详细信息以及进行细粒度音频输入处理所需的事件列表。

### 使用 WebSockets 处理音频

当通过 WebSocket 发送和接收音频时，你将需要做更多工作来从客户端发送媒体、并从服务器接收媒体。下面，你将看到一个表格，描述了 WebSocket 会话期间用于通过 WebSocket 发送和接收音频所必需的事件流转。

下面的事件按生命周期顺序给出，尽管某些事件（如 `delta` 事件）可能同时发生。

<table>
  <tr>
    <th>Lifecycle stage</th>
    <th>Client events</th>
    <th>Server events</th>
  </tr>
  <tr>
    <td>Session initialization</td>
    <td>
      [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
    <td>
      [`session.created`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`session.updated`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
  </tr>
  <tr>
    <td>User audio input</td>
    <td>
      [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime)
      

      &nbsp;&nbsp;(send whole audio message)
      

      [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime)
      

      &nbsp;&nbsp;(stream audio in chunks)
      

      [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime)
      

      &nbsp;&nbsp;(used when VAD is disabled)
      

      [`response.create`](https://developers.openai.com/api/reference/resources/realtime)
      

      &nbsp;&nbsp;(used when VAD is disabled)
    </td>
    <td>
      [`input_audio_buffer.speech_started`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`input_audio_buffer.speech_stopped`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`input_audio_buffer.committed`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
  </tr>
  <tr>
    <td>Server audio output</td>
    <td>
      [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime)
      

      &nbsp;&nbsp;(used when VAD is disabled)
    </td>
    <td>
      [`conversation.item.added`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.created`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_item.added`](https://developers.openai.com/api/reference/resources/realtime/server-events#response.output_item.added)
      

      [`response.content_part.added`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_audio.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_audio_transcript.delta`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_audio_transcript.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_text.delta`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_text.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.content_part.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`response.done`](https://developers.openai.com/api/reference/resources/realtime)
      

      [`rate_limits.updated`](https://developers.openai.com/api/reference/resources/realtime)
    </td>
  </tr>
</table>

### 将音频输入流式传输到服务器

要将音频输入流式传输到服务器，你可以使用 [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。此事件要求你通过套接字发送 **Base64 编码的音频字节** 到 Realtime API。每个数据块的大小不能超过 15 MB。

输入数据块的格式可以为整个会话配置，也可以按响应进行配置。

- 会话： `session.input_audio_format` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- 响应： `response.input_audio_format` 在 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

将音频输入字节追加到对话中

```javascript
import fs from "fs";
import decodeAudio from "audio-decode";

// Converts Float32Array of audio data to PCM16 ArrayBuffer
function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

// Converts a Float32Array to base64-encoded PCM16 data
function base64EncodeAudio(float32Array) {
  const arrayBuffer = floatTo16BitPCM(float32Array);
  let binary = "";
  let bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000; // 32KB chunk size
  for (let i = 0; i < bytes.length; i += chunkSize) {
    let chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

// Fills the audio buffer with the contents of three files,
// then asks the model to generate a response.
const files = [
  "fixtures/sample1.wav",
  "fixtures/sample2.wav",
  "fixtures/sample3.wav",
];

for (const filename of files) {
  const audioFile = fs.readFileSync(filename);
  const audioBuffer = await decodeAudio(audioFile);
  const channelData = audioBuffer.channelData[0];
  const base64Chunk = base64EncodeAudio(channelData);
  ws.send(
    JSON.stringify({
      type: "input_audio_buffer.append",
      audio: base64Chunk,
    })
  );
}

ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
ws.send(JSON.stringify({ type: "response.create" }));
```

```python
import base64
import json
import struct
import soundfile as sf
from websocket import create_connection

# ... create websocket-client named ws ...


def float_to_16bit_pcm(float32_array):
    clipped = [max(-1.0, min(1.0, x)) for x in float32_array]
    pcm16 = b"".join(struct.pack("<h", int(x * 32767)) for x in clipped)
    return pcm16


def base64_encode_audio(float32_array):
    pcm_bytes = float_to_16bit_pcm(float32_array)
    encoded = base64.b64encode(pcm_bytes).decode("ascii")
    return encoded


files = ["./path/to/sample1.wav", "./path/to/sample2.wav", "./path/to/sample3.wav"]

for filename in files:
    data, samplerate = sf.read(filename, dtype="float32")
    channel_data = data[:, 0] if data.ndim > 1 else data
    base64_chunk = base64_encode_audio(channel_data)

    # Send the client event
    event = {"type": "input_audio_buffer.append", "audio": base64_chunk}
    ws.send(json.dumps(event))
```


### 发送完整音频消息

还可以创建完整录音形式的对话消息。使用 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来创建消息，其 `input_audio` 内容为完整音频。

创建完整音频输入对话条目

```javascript
const fullAudio = "<a base64-encoded string of audio bytes>";

const event = {
  type: "conversation.item.create",
  item: {
    type: "message",
    role: "user",
    content: [
      {
        type: "input_audio",
        audio: fullAudio,
      },
    ],
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
fullAudio = "<a base64-encoded string of audio bytes>"

event = {
    "type": "conversation.item.create",
    "item": {
        "type": "message",
        "role": "user",
        "content": [
            {
                "type": "input_audio",
                "audio": fullAudio,
            }
        ],
    },
}

ws.send(json.dumps(event))
```


### 从 WebSocket 处理音频输出

**要在浏览器等客户端设备上播放输出音频，我们建议使用 WebRTC 而不是 WebSockets**。在不确定的网络条件下，WebRTC 向客户端设备发送媒体时会更加稳健。

但如果要在使用 WebSocket 的服务端到服务端应用中处理音频输出，你需要监听 [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime) 事件，其中包含来自模型的 Base64 编码音频数据块。你需要将这些数据块缓冲并写入文件，或者可能立即将它们流式传输到另一个来源，例如 [通过 Twilio 拨打电话](https://www.twilio.com/en-us/blog/twilio-openai-realtime-api-launch-integration).

请注意， [`response.output_audio.done`](https://developers.openai.com/api/reference/resources/realtime) 和 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件实际上不包含音频数据——只是音频内容转录。要获取实际的字节，你需要监听 [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime) 事件。

输出块的格式可以在整个会话中配置，也可以按响应配置。

- 会话： `session.audio.output.format` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- 响应： `response.audio.output.format` 在 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

监听 response.output_audio.delta 事件

```javascript
function handleEvent(message) {
  const serverEvent = JSON.parse(message.toString());
  if (serverEvent.type === "response.output_audio.delta") {
    // Access Base64-encoded audio chunks
    // console.log(serverEvent.delta);
  }
}

// Listen for server messages (WebSocket)
ws.on("message", handleEvent);
```

```python
def on_message(ws, message):
    server_event = json.loads(message)
    if server_event["type"] == "response.output_audio.delta":
        # Access Base64-encoded audio chunks:
        print(server_event["delta"])
```


## 图像输入

`gpt-realtime-2` 并 `gpt-realtime` 也支持图像输入。你可以在用户消息中作为内容部分附加图像，模型在响应时可以理解图像中的内容。

向对话添加图像

```javascript
const base64Image = "<a base64-encoded string of image bytes>";

const event = {
  type: "conversation.item.create",
  item: {
    type: "message",
    role: "user",
    content: [
      {
        type: "input_image",
        image_url: `data:image/{format};base64,${base64Image}`,
      },
    ],
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```


## 语音活动检测

默认情况下，Realtime 会话已启用 **语音活动检测（VAD）** ，这意味着 API 将判断用户何时开始或停止说话并自动响应。

在我们的文档中了解更多关于如何配置 VAD 的信息： [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad) 指南。

### 禁用 VAD

可以通过设置 `turn_detection` 为 `null` 并配合 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来禁用 VAD。这对于希望精细控制音频输入的界面（例如 [按键通话](https://en.wikipedia.org/wiki/Push-to-talk) 界面）非常有用。

当 VAD 被禁用时，客户端将必须手动发出一些额外的客户端事件来触发音频响应：

- 手动发送 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime)，这将为对话创建一个新的用户输入项。
- 手动发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 以触发模型的音频响应。
- 发送 [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 在开始新的用户输入之前。

### 保留 VAD，但禁用自动响应

如果你想保持 VAD 模式启用，但只想保留手动决定何时生成回复的能力，你可以设置 `turn_detection.interrupt_response` 和 `turn_detection.create_response` 为 `false` 配合 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。这将保留 VAD 的所有行为，但不会自动创建新的回复。客户端可以手动通过 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件来触发这些。

这对于审核、输入验证或 RAG 模式很有用，在这些场景中，你愿意为了对输入的控制而承受交互中稍高的延迟。

## 在默认对话之外创建响应

默认情况下，会话期间生成的所有响应都会添加到会话的对话状态（即“默认对话”）中。但是，你可能希望在会话默认对话的上下文之外生成模型响应，或者希望同时生成多个响应。你可能还希望更细粒度地控制模型生成响应时考虑哪些对话项（例如，仅最后 N 轮）。

要生成不会添加到默认对话状态的“带外”响应，可以通过在 `response.conversation` 字段中设置为字符串 `none` 并配合 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来实现。

在创建带外响应时，你可能还需要某种方式来识别哪些服务器发送的事件与此响应相关。你可以为模型响应提供 `metadata` 以帮助你确定正在为此客户端发送的事件生成哪个响应。

创建带外模型响应

```javascript
const prompt = `
Analyze the conversation so far. If it is related to support, output
"support". If it is related to sales, output "sales".
`;

const event = {
  type: "response.create",
  response: {
    // Setting to "none" indicates the response is out of band
    // and will not be added to the default conversation
    conversation: "none",

    // Set metadata to help identify responses sent back from the model
    metadata: { topic: "classification" },

    // Set any other available response fields
    output_modalities: ["text"],
    instructions: prompt,
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
prompt = """
Analyze the conversation so far. If it is related to support, output
"support". If it is related to sales, output "sales".
"""

event = {
    "type": "response.create",
    "response": {
        # Setting to "none" indicates the response is out of band,
        # and will not be added to the default conversation
        "conversation": "none",
        # Set metadata to help identify responses sent back from the model
        "metadata": {"topic": "classification"},
        # Set any other available response fields
        "output_modalities": ["text"],
        "instructions": prompt,
    },
}

ws.send(json.dumps(event))
```


现在，当你监听 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 服务器事件时，你可以识别带外响应的结果。

创建带外模型响应

```javascript
function handleEvent(message) {
  const data = "data" in message ? message.data : message.toString();
  const serverEvent = JSON.parse(data);
  if (
    serverEvent.type === "response.done" &&
    serverEvent.response.metadata?.topic === "classification"
  ) {
    // this server event pertained to our OOB model response
    console.log(serverEvent.response.output[0]);
  }
}

// Listen for server messages (WebRTC)
dataChannel.addEventListener("message", handleEvent);

// Listen for server messages (WebSocket)
// ws.on("message", handleEvent);
```

```python
def on_message(ws, message):
    server_event = json.loads(message)
    topic = ""

    # See if metadata is present
    try:
        topic = server_event["response"]["metadata"]["topic"]
    except KeyError:
        print("topic not set")

    if server_event["type"] == "response.done" and topic == "classification":
        # this server event pertained to our OOB model response
        print(server_event["response"]["output"][0])
```


### 为响应创建自定义上下文

你也可以在默认/当前对话之外，构造一个模型将用于生成响应的自定义上下文。这可以通过使用 `input` 数组在一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件中完成。你可以使用新的输入，或通过 ID 引用对话中现有的输入项。

监听带自定义上下文的带外模型响应

```javascript
const event = {
  type: "response.create",
  response: {
    conversation: "none",
    metadata: { topic: "pizza" },
    output_modalities: ["text"],

    // Create a custom input array for this request with whatever context
    // is appropriate
    input: [
      // potentially include existing conversation items:
      {
        type: "item_reference",
        id: "some_conversation_item_id",
      },
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Is it okay to put pineapple on pizza?",
          },
        ],
      },
    ],
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
event = {
    "type": "response.create",
    "response": {
        "conversation": "none",
        "metadata": {"topic": "pizza"},
        "output_modalities": ["text"],
        # Create a custom input array for this request with whatever
        # context is appropriate
        "input": [
            # potentially include existing conversation items:
            {"type": "item_reference", "id": "some_conversation_item_id"},
            # include new content as well
            {
                "type": "message",
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Is it okay to put pineapple on pizza?",
                    }
                ],
            },
        ],
    },
}

ws.send(json.dumps(event))
```


### 创建无上下文的响应

你也可以将响应插入到默认对话中，忽略所有其他指令和上下文。通过将 `input` 设置为空数组来实现。

将无上下文模型响应插入到默认对话中

```javascript
const prompt = `
Say exactly the following:
I'm a little teapot, short and stout!
This is my handle, this is my spout!
`;

const event = {
  type: "response.create",
  response: {
    // An empty input array removes existing context
    input: [],
    instructions: prompt,
  },
};

// WebRTC data channel and WebSocket both have .send()
dataChannel.send(JSON.stringify(event));
```

```python
prompt = """
Say exactly the following:
I'm a little teapot, short and stout!
This is my handle, this is my spout!
"""

event = {
    "type": "response.create",
    "response": {
        # An empty input array removes all prior context
        "input": [],
        "instructions": prompt,
    },
}

ws.send(json.dumps(event))
```


## 函数调用

Realtime 模型还支持 **函数调用**，这使你可以执行自定义代码来扩展模型的能力。以下是大致的工作原理：

1. 当 [更新会话](https://developers.openai.com/api/reference/resources/realtime) 或 [创建响应](https://developers.openai.com/api/reference/resources/realtime)，时，你可以指定可供模型调用的函数列表。
1. 如果在处理输入时，模型确定应进行函数调用，它会向对话中添加代表函数调用参数的项目。
1. 当客户端检测到包含函数调用参数的对话项目时，它将使用这些参数执行自定义代码。
1. 当自定义代码执行完毕后，客户端将创建包含函数调用输出的新对话项目，并要求模型作出响应。

让我们通过添加一个可调用函数来实际看看这会如何运作，该函数将向模型用户提供今日星座运势。我们将展示需要发送的客户端事件对象的形状，以及服务器将依次发出什么。

### 配置可调用函数

首先，我们必须根据用户输入给模型提供一组它可以调用的函数。可用函数可以在会话级别或单个响应级别进行配置。

- 会话： `session.tools` 中的属性 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- 响应： `response.tools` 中的属性 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

以下是一个客户端事件负载示例，用于 `session.update` 配置一个星座运势生成函数，该函数接受一个参数（即应生成运势的星座）：

[`session.update`](https://developers.openai.com/api/reference/resources/realtime)

```json
{
  "type": "session.update",
  "session": {
    "tools": [
      {
        "type": "function",
        "name": "generate_horoscope",
        "description": "Give today's horoscope for an astrological sign.",
        "parameters": {
          "type": "object",
          "properties": {
            "sign": {
              "type": "string",
              "description": "The sign for the horoscope.",
              "enum": [
                "Aries",
                "Taurus",
                "Gemini",
                "Cancer",
                "Leo",
                "Virgo",
                "Libra",
                "Scorpio",
                "Sagittarius",
                "Capricorn",
                "Aquarius",
                "Pisces"
              ]
            }
          },
          "required": ["sign"]
        }
      }
    ],
    "tool_choice": "auto"
  }
}
```

该 `description` 函数及其参数的描述字段有助于模型决定是否调用该函数，以及每个参数应包含哪些数据。如果模型接收到指示用户想要星座运势的输入，它将调用此函数并携带一个 `sign` 参数。

### 检测模型何时想要调用函数

根据模型的输入，模型可能会决定调用函数以生成最佳响应。假设我们的应用程序添加了以下带 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件的对话项，然后创建响应：

```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "message",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "What is my horoscope? I am an aquarius."
      }
    ]
  }
}
```

随后通过 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来生成响应：

```json
{
  "type": "response.create"
}
```

模型不会立即返回文本或音频响应，而是生成一个包含应传递给开发者应用程序中函数的参数的响应。你可以使用 [`response.function_call_arguments.delta`](https://developers.openai.com/api/reference/resources/realtime) 服务器事件监听函数调用参数的实时更新，但 `response.done` 也会包含我们调用函数所需的完整数据。

[`response.done`](https://developers.openai.com/api/reference/resources/realtime)

```json
{
    "type": "response.done",
    "event_id": "event_AeqLA8iR6FK20L4XZs2P6",
    "response": {
        "object": "realtime.response",
        "id": "resp_AeqL8XwMUOri9OhcQJIu9",
        "status": "completed",
        "status_details": null,
        "output": [
            {
                "object": "realtime.item",
                "id": "item_AeqL8gmRWDn9bIsUM2T35",
                "type": "function_call",
                "status": "completed",
                "name": "generate_horoscope",
                "call_id": "call_sHlR7iaFwQ2YQOqm",
                "arguments": "{\"sign\":\"Aquarius\"}"
            }
        ],
        ...
    }
}
```

在服务器发出的 JSON 中，我们可以检测到模型想要调用自定义函数：

| 属性                       | 函数调用用途                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `response.output[0].type`      | 当设置为 `function_call`，时，表示此响应包含命名函数调用的参数。                         |
| `response.output[0].name`      | 要调用的已配置函数的名称，在本例中为 `generate_horoscope`                                             |
| `response.output[0].arguments` | 包含函数参数的 JSON 字符串。在我们的例子中， `"{\"sign\":\"Aquarius\"}"`.                              |
| `response.output[0].call_id`   | 系统为此函数调用生成的 ID - **你需要此 ID 将函数调用结果传回模型**. |

基于这些信息，我们可以在应用中执行代码来生成运势，然后将该信息返回给模型，以便它生成响应。

### 将函数调用的结果提供给模型

收到模型对函数调用的参数响应后，你的应用可以执行满足该函数调用的代码。这可以是任何你想要的，比如与外部 API 通信或访问数据库。

当你准备将自定义代码的结果提供给模型时，可以通过 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件创建包含结果的新对话项。

```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "function_call_output",
    "call_id": "call_sHlR7iaFwQ2YQOqm",
    "output": "{\"horoscope\": \"You will soon meet a new friend.\"}"
  }
}
```

- 会话条目类型为 `function_call_output`
- `item.call_id` 与我们在 `response.done` 上面事件中获得的ID相同
- `item.output` 是一个包含我们函数调用结果的JSON字符串

一旦我们添加了包含函数调用结果的对话条目，我们再次从客户端发出 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。这将触发模型使用函数调用中的数据进行响应。

```json
{
  "type": "response.create"
}
```

## 错误处理

该 [`error`](https://developers.openai.com/api/reference/resources/realtime) 当服务器在会话期间遇到错误条件时，服务器会发出该事件。偶尔，这些错误可以追溯到你的应用程序发出的客户端事件。

与 HTTP 请求和响应不同，其中响应隐式地关联到来自客户端的请求，我们需要使用 `event_id` 客户端事件上的属性来了解其中哪一个事件在服务器上触发了错误条件。下面的代码展示了这一技巧，其中客户端尝试发出一个不受支持的事件类型。

```javascript
const event = {
  event_id: "my_awesome_event",
  type: "scooby.dooby.doo",
};

dataChannel.send(JSON.stringify(event));
```


从客户端发送的这个失败事件将产生类似以下的错误事件：

```json
{
  "type": "invalid_request_error",
  "code": "invalid_value",
  "message": "Invalid value: 'scooby.dooby.doo' ...",
  "param": "type",
  "event_id": "my_awesome_event"
}
```

## 中断与截断

在许多语音应用中，用户可以在模型说话时打断它。当 VAD 启用时，Realtime API 会处理打断，即检测到用户语音，取消正在进行的响应，并开始新的响应。然而在这种情况下，你会希望模型知道它在哪里被打断，以便自然地继续对话（例如，如果用户说“刚才最后那件事是什么？”）。我们将此称为 **截断** 模型的最后一次响应，即从对话中移除模型最后一次响应中未播放的部分。

在 WebRTC 和 SIP 连接中，服务器管理输出音频的缓冲区，因此知道在给定时刻已播放了多少音频。当有用户打断时，服务器将自动截断未播放的音频。

对于 WebSocket 连接，客户端管理音频播放，因此必须停止播放并处理截断。以下是此过程的运作方式：

1. 客户端会监控服务端发送的新 `input_audio_buffer.speech_started` 事件，这些事件表示用户已开始说话。服务端将自动取消任何进行中的模型响应并发出 `response.cancelled` 事件。
1. 当客户端检测到此事件时，应立即停止播放模型当前正在播放的任何音频。它应该记录在被打断之前，最后一段音频响应播放了多少。
1. 客户端应发送 [`conversation.item.truncate`](https://developers.openai.com/api/reference/resources/realtime) 事件，以从对话中移除模型最后响应中未播放的部分。

以下是一个示例：

```json
{
    "type": "conversation.item.truncate",
    "item_id": "item_1234", # this is the item ID of the model's last response
    "content_index": 0,
    "audio_end_ms": 1500 # truncate audio after 1.5 seconds
}
```

同时截断转录文本又如何？实时模型没有足够的信息来精确对齐转录文本和音频，因此 `conversation.item.truncate` 会在给定位置截断音频，并移除未播放部分的文本转录。这解决了移除未播放音频的问题，但并未提供截断后的转录文本。

## 一键通话

Realtime API 默认使用语音活动检测（VAD），这意味着模型响应将由音频输入触发。你也可以通过禁用 VAD 并使用应用层门控来控制音频输入何时发送给模型，从而实现按键说话交互，例如按住空格键录制音频，然后在松开时触发响应。对于某些应用来说，这种方案效果出奇地好——它让用户可以控制交互，避免了 VAD 失败，而且由于无需等待 VAD 超时，响应感觉非常迅速。

在 WebSockets 和 WebRTC 上实现按键说话略有不同。在 Realtime API WebSocket 连接中，所有事件都在同一通道内按相同顺序发送，而 WebRTC 连接则为音频和控制事件提供单独通道。

### WebSocket

要通过 WebSocket 连接实现按下说话（push-to-talk），你需要让客户端停止音频播放、处理中断并启动新的响应。以下是更详细的步骤：

1. 通过设置关闭 VAD `"turn_detection": null` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件中。
1. 按下时，开始在客户端录制音频。
   1. 如果模型有正在进行的响应，请通过发送 [`response.cancel`](https://developers.openai.com/api/reference/resources/realtime) 事件取消它。
   1. 如果模型有正在进行的输出播放，请立即停止播放并发送 `conversation.item.truncate` 事件以从对话中移除任何未播放的音频。
1. 松开时，发送 [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime) 消息并将音频放入输入缓冲区。
1. 发送 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime) 事件，这将提交写入输入缓冲区的音频并启动输入转录（如果启用）。
1. 然后通过发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件触发响应。

### WebRTC 和 SIP

使用 WebRTC 实现一键通话（push-to-talk）类似，但必须显式清除输入音频缓冲区。以下是操作步骤：

1. 通过设置以下内容关闭 VAD `"turn_detection": null` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件中。
1. 按下时，发送 [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 事件以清除之前的音频输入。
   1. 如果模型有正在进行的响应，通过发送 [`response.cancel`](https://developers.openai.com/api/reference/resources/realtime) 事件来取消它。
   1. 如果模型有正在进行的输出播放，发送 [`output_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 事件以清除未播放的音频，这也会截断对话。
1. 松开时，发送 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime) 事件，这将提交写入输入缓冲区的音频并启动输入转录（如果启用）。
1. 然后通过 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件触发响应。