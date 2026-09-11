# 实时对话

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

一旦你通过以下任一方式连接到 Realtime API， [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 或 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)，你就可以调用 Realtime 模型（例如 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)）进行语音对语音的对话。为此，你需要 **发送客户端事件** 来发起操作，并 **监听服务端事件** 以响应 Realtime API 执行的操作。

本指南将逐步介绍使用音频和文本生成、图像输入、函数调用等模型能力所需的事件流程，以及如何理解 Realtime 会话的状态。

如果你不需要与模型进行对话，也就是不
  期望任何响应，可以使用 Realtime API 的 [转写
  模式](https://developers.openai.com/api/docs/guides/realtime-transcription).

## Realtime 语音对语音会话

Realtime 会话是模型与已连接客户端之间的一次有状态交互。会话的关键组成部分包括：

- 该 **Session** 对象，用于控制交互参数，例如所使用的模型、用于生成输出的语音以及其他配置。
- 一个 **Conversation**，表示当前会话期间生成的用户输入 Items 和模型输出 Items。
- **Responses**，是添加到 Conversation 中的、由模型生成的音频或文本 Items。

**输入音频缓冲区与 WebSockets**

如果使用 WebRTC，与模型进行音频收发所需的大部分媒体处理都由 WebRTC API 协助完成。



如果使用 WebSockets 处理音频，你将需要手动与 **输入音频缓冲区** 进行交互，方法是向服务端发送音频，并通过包含 base64 编码音频的 JSON 事件传输。

所有这些组件共同构成了一个 Realtime Session（实时会话）。你将使用客户端事件来更新会话的状态，并监听服务端事件以对会话内的状态变化作出响应。

![实时状态示意图](https://openaidevs.retool.com/api/file/11fe71d2-611e-4a26-a587-881719a90e56)

## 会话生命周期事件

通过以下任一方式启动会话后 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 或 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)，服务器将发送一个 [`session.created`](https://developers.openai.com/api/reference/resources/realtime) 事件，指示会话已就绪。在客户端，你可以使用以下方式更新当前会话配置： [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件。大多数会话属性可以随时更新，但以下属性除外： `voice` 模型用于音频输出的属性，需在该会话中模型已经响应过一次音频之后更新。Realtime 会话的最长持续时间为 **60 分钟**.

以下示例展示了使用 `session.update` 客户端事件来更新会话。有关通过这些通道发送客户端事件的更多内容，请参阅 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#sending-and-receiving-events) 或 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime#sending-and-receiving-events) 指南。

更新本次会话中模型所使用的系统指令

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

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  output_modalities: [:audio],
  audio: {
    input: {
      format: {
        type: :"audio/pcm",
        rate: 24_000
      },
      turn_detection: { type: :semantic_vad }
    },
    output: {
      format: {
        type: :"audio/pcm",
        rate: 24_000
      },
      voice: :marin
    }
  },
  prompt: {
    id: "pmpt_123",
    version: "89",
    variables: { city: "Paris" }
  },
  instructions: "Speak clearly and briefly. Confirm before taking action."
)
```


当会话更新完成后，服务器将发送一个 [`session.updated`](https://developers.openai.com/api/reference/resources/realtime) 事件，其中包含会话的新状态。

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

## 文本输入和输出

要使用 Realtime 模型生成文本，你可以向当前对话添加文本输入，请求模型生成响应，并监听服务端发送的事件以了解模型响应的进度。要生成文本， [会话必须配置](https://developers.openai.com/api/reference/resources/realtime) 为 `text` 模态（默认即为如此）。

使用 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件创建一个新的文本对话项。这类似于在 Chat Completions 中发送 [用户消息（提示）](https://developers.openai.com/api/docs/guides/text) REST API 中的方式。

使用用户输入创建一个对话项

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

```ruby
connection.conversation.items.create(
  type: :message,
  role: :user,
  content: [
    {
      type: :input_text,
      text: "What is the weather like today?"
    }
  ]
)
```


在将用户消息添加到对话后，发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件以启动模型的响应。如果当前会话同时启用了音频和文本，模型将同时以音频和文本内容进行响应。如果仅希望生成文本，可以在发送 `response.create` 客户端事件时进行指定，如下所示。

生成仅文本的响应

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

```ruby
connection.response.create(
  output_modalities: [:text],
  instructions: "Respond with a concise text message."
)
```


当响应完全结束时，服务端将发出 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件。该事件将包含模型生成的完整文本，如下所示。

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

```ruby
connection.each do |event|
  next unless event.is_a?(OpenAI::Realtime::ResponseDoneEvent)

  puts("Response status: #{event.response.status}")
  Array(event.response.output).each do |item|
    next unless item.is_a?(OpenAI::Realtime::RealtimeConversationItemAssistantMessage)

    item.content.each do |content|
      puts(content.text) if content.type == :output_text
    end
  end
  break
end
```


在模型响应生成过程中，服务端会在整个流程中发出多个生命周期事件。你可以监听这些事件，例如 [`response.output_text.delta`](https://developers.openai.com/api/reference/resources/realtime)，以便在响应生成时为用户提供实时反馈。服务端发出的所有事件列表可在下方 **相关服务端事件**。中找到。它们大致按照发出顺序排列，并附带文本生成相关的客户端事件。

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

Realtime API 最强大的功能之一，是与模型进行语音到语音的交互，无需中间的文本转语音或语音转文本步骤。这能为语音界面带来更低的延迟，并为模型提供更多数据来处理语音输入的语调和抑扬变化。

### 语音选项

实时会话可以配置为在生成音频输出时使用几种内置语音之一。你可以在 `voice` （或在 `response.create`）中设置来控制模型的音色。当前可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`, `marin`，和 `cedar`。一旦模型在该会话中发出音频后，该 `voice` 在该会话内就无法再修改。为获得最佳质量，我们建议使用 `marin` 或 `cedar`.

### 使用 WebRTC 处理音频

如果你使用 WebRTC 连接到 Realtime API，那么 Realtime API 充当与你的客户端之间的 [对等连接](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) 。模型的音频输出作为 [远端媒体流](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)。传送到你的客户端。模型的音频输入通过音频设备（[`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)）采集，媒体流作为轨道添加到对等连接中。

下面的示例代码来自 [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) ，展示了一个使用浏览器 API 同时配置本地和远端音频的基础示例：

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


上面的代码片段能够让你与 Realtime API 交互，但还有更多可做的事情。更多不同类型用户界面的示例，请参阅 [WebRTC 示例](https://github.com/webrtc/samples) 仓库。这些示例的实时演示也可以 [在这里找到](https://webrtc.github.io/samples/).

使用 [媒体捕获与流](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API) 接口，你可以在浏览器中执行诸如静音和取消静音麦克风、选择从哪个设备采集输入等操作。

### WebRTC 中音频的客户端和服务端事件

默认情况下，WebRTC 客户端在发送音频输入之前无需向 Realtime API 发送任何客户端事件。一旦将本地音频轨道添加到对等连接中，你的用户就可以开始说话了！

但是，当音频通过对等连接在客户端和服务端之间来回传输时，WebRTC 客户端仍会收到许多服务端发送的生命周期事件。例如：

- 当输入通过本地媒体轨道发送时，你将收到来自服务端的 [`input_audio_buffer.speech_started`](https://developers.openai.com/api/reference/resources/realtime) 事件。
- 当本地音频输入停止时，你会收到 [`input_audio_buffer.speech_stopped`](https://developers.openai.com/api/reference/resources/realtime) 事件。
- 你会收到 [针对进行中音频转录的增量事件](https://developers.openai.com/api/reference/resources/realtime).
- 当模型已完成转录并发送完一个响应时，你会收到一个 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件。

操控用于媒体流的 WebRTC API 通常已能满足你的全部控制需求。但有时仍需使用更底层的接口来处理音频输入与输出。更多相关信息以及细粒度音频输入处理所需的事件列表，请参阅下方的 WebSockets 章节。

### Handling audio with WebSockets

通过 WebSocket 发送和接收音频时，你需要做更多工作来从客户端发送媒体、从服务器接收媒体。下表描述了 WebSocket 会话中发送和接收音频所必需的事件流程。

以下事件按生命周期顺序列出，但某些事件（例如 `delta` 事件）可能会同时发生。

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

### 将音频流式输入到服务端

要将音频输入流式传输到服务端，你可以使用 [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。此事件需要你发送分块的 **Base64 编码的音频字节** 通过套接字发送到 Realtime API。每个分块大小不得超过 15 MB。

输入分块的格式可以针对整个会话或单次响应进行配置。

- 会话： `session.input_audio_format` in [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- 响应： `response.input_audio_format` in [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

将音频输入字节附加到对话中

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

```ruby
File.open("speech.pcm", "rb") do |audio|
  while (chunk = audio.read(9_600))
    connection.input_audio_buffer.append_bytes(chunk)
  end
end
```


### 发送完整的音频消息

也可以创建包含完整音频录音的对话消息。使用 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来创建带有 `input_audio` 内容的消息。

创建完整的音频输入对话项

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

```ruby
audio = Base64.strict_encode64(File.binread("speech.pcm"))

connection.conversation.items.create(
  type: :message,
  role: :user,
  content: [
    {
      type: :input_audio,
      audio: audio
    }
  ]
)
```


### 通过 WebSocket 处理音频输出

**要在 Web 浏览器等客户端设备上播放输出音频，我们推荐使用 WebRTC 而非 WebSockets**。在网络条件不稳定的情况下，WebRTC 向客户端设备发送媒体会更加稳健。

但如果你要在使用 WebSocket 的服务端到服务端应用中处理音频输出，则需要监听 [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime) 事件，其中包含模型输出的 Base64 编码音频数据分块。你可以选择缓存这些分块后写入文件，或者立即将它们转发到其他来源，例如 [使用 Twilio 接听电话](https://www.twilio.com/en-us/blog/twilio-openai-realtime-api-launch-integration).

请注意， [`response.output_audio.done`](https://developers.openai.com/api/reference/resources/realtime) 并 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件实际上并不包含音频数据——只包含音频内容的转录文本。若要获取实际的音频字节，你需要监听 [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime) 事件。

输出块（chunk）的格式可以针对整个会话或单个响应进行配置。

- 会话： `session.audio.output.format` in [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- 响应： `response.audio.output.format` in [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

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

```ruby
connection.each do |event|
  case event
  when OpenAI::Realtime::ResponseAudioDeltaEvent
    audio_bytes = Base64.strict_decode64(event.delta)
    puts("Received #{audio_bytes.bytesize} audio bytes")
  when OpenAI::Realtime::ResponseDoneEvent
    break
  end
end
```


## 图像输入

`gpt-realtime-2` 并 `gpt-realtime` 也支持图像输入。你可以在用户消息中将图像作为内容部分附加，模型在回复时可以结合图像中的内容。

在对话中添加图像

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

```ruby
encoded_image = Base64.strict_encode64(File.binread("image.png"))

connection.conversation.items.create(
  type: :message,
  role: :user,
  content: [
    {
      type: :input_image,
      image_url: "data:image/png;base64,#{encoded_image}"
    },
    {
      type: :input_text,
      text: "Describe this image."
    }
  ]
)
connection.response.create(output_modalities: [:text])
```


## 语音活动检测

默认情况下，Realtime 会话启用了 **语音活动检测（VAD）** ，这意味着 API 将自动判断用户何时开始或停止说话并作出响应。

在我们的文档中详细了解如何配置 VAD： [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad) 指南。

### 禁用 VAD

VAD 可以通过设置以下参数禁用 `turn_detection` 为 `null` 为 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。对于希望对音频输入进行细粒度控制的界面来说，这非常有用，例如 [按住说话](https://en.wikipedia.org/wiki/Push-to-talk) 界面。

当 VAD 被禁用时，客户端必须手动发送一些额外的客户端事件来触发音频响应：

- 手动发送 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime)，它将为对话创建一个新的用户输入项。
- 手动发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 以触发模型的音频响应。
- 发送 [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 在开始新的用户输入之前。

### 保留 VAD，但关闭自动回复

如果你希望保持 VAD 模式启用，但仅希望保留手动决定何时生成响应的能力，可以设置 `turn_detection.interrupt_response` 并 `turn_detection.create_response` 为 `false` 为 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。这将保留 VAD 的所有行为，但不会自动创建新的 Responses。客户端可以通过以下事件手动触发： [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。

这对于内容审核、输入校验或 RAG 模式非常有用，在这些场景下，你愿意以稍高的交互延迟换取对输入的控制权。

## 在默认对话之外创建响应

默认情况下，会话期间生成的所有响应都会被添加到该会话的对话状态（即“默认对话”）中。但你可能希望在会话默认对话的上下文之外生成模型响应，或者并发地生成多个响应。你可能还希望对模型生成响应时所考虑的对话条目进行更精细的控制（例如，仅考虑最近 N 轮对话）。

通过在创建响应时将某个字段设置为字符串 `response.conversation` 字段设置为字符串 `none` ，可以在通过 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件创建响应时实现此功能。

在创建 out-of-band 响应时，你可能还需要某种方式来标识哪些服务端发送事件属于此响应。你可以为模型响应提供 `metadata` ，帮助你识别此次客户端发送事件正在生成哪个响应。

创建一个 out-of-band 模型响应

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

```ruby
connection.response.create(
  conversation: :none,
  metadata: { topic: "classification" },
  output_modalities: [:text],
  instructions: "Classify the conversation as support or sales."
)
```


现在，当你监听 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 服务端事件时，你就可以识别你的 out-of-band 响应的结果。

创建一个 out-of-band 模型响应

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

```ruby
connection.each do |event|
  next unless event.is_a?(OpenAI::Realtime::ResponseDoneEvent)
  next unless event.response.metadata&.fetch(:topic, nil) == "classification"

  puts("Classification response completed: #{event.response.status}")
  Array(event.response.output).each do |item|
    next unless item.is_a?(OpenAI::Realtime::RealtimeConversationItemAssistantMessage)

    item.content.each do |content|
      puts("Classification: #{content.text}") if content.type == :output_text
    end
  end
  break
end
```


### 为 responses 创建自定义上下文

你也可以在默认/当前对话之外，构造模型将用于生成回复的自定义上下文。这可以通过 `input` 数组在客户端事件上完成 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 。你可以使用新的输入，或通过 ID 引用对话中已有的输入项。

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

```ruby
connection.response.create(
  conversation: :none,
  metadata: { topic: "classification" },
  output_modalities: [:text],
  input: [
    {
      type: :item_reference,
      id: existing_item_id
    },
    {
      type: :message,
      role: :user,
      content: [
        {
          type: :input_text,
          text: "Classify this issue: my order is late."
        }
      ]
    }
  ]
)
```


### 在无上下文的情况下创建响应

你也可以将响应插入到默认对话中，忽略所有其他指令和上下文。通过将 `input` 设置为空数组即可实现。

将无上下文模型响应插入默认对话

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

```ruby
connection.response.create(
  input: [],
  output_modalities: [:text],
  instructions: "Generate a concise greeting without conversation context."
)
```


## 函数调用

Realtime 模型也支持 **函数调用**，它使你能够执行自定义代码以扩展模型的能力。其高层工作原理如下：

1. 当 [更新会话](https://developers.openai.com/api/reference/resources/realtime) 或 [创建响应](https://developers.openai.com/api/reference/resources/realtime)，时，你可以指定一个可供模型调用的函数列表。
1. 如果在处理输入时模型确定应该进行函数调用，它将向会话中添加表示函数调用参数的项。
1. 当客户端检测到包含函数调用参数的会话项时，它将使用这些参数执行自定义代码
1. 当自定义代码执行完毕后，客户端将创建包含函数调用输出的新会话项，并要求模型做出响应。

下面我们通过添加一个可调用函数，为模型用户提供今日星座运势，看看它在实践中如何运作。我们将展示需要发送的客户端事件对象的结构，以及服务端将相应返回的事件。

### 配置可调用函数

首先，我们必须根据用户输入为模型提供一组可以调用的函数。可用函数可以在会话级别或单个响应级别进行配置。

- 会话： `session.tools` 中的属性 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- 响应： `response.tools` 中的属性 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

以下是一个客户端事件载荷示例，用于 `session.update` 该事件配置了一个星座运势生成函数，该函数接受一个参数（用于生成运势的星座）：

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

该 `description` 函数及参数的字段可帮助模型决定是否调用该函数，以及在每个参数中包含哪些数据。如果模型收到的输入表明用户想要获取自己的运势，它将使用以下 `sign` 参数调用该函数。

### 检测模型何时希望调用函数

根据模型的输入，模型可能会决定调用一个函数以生成最佳响应。假设我们的应用程序使用以下会话项添加了 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，然后创建一个响应：

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

随后通过一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来生成响应：

```json
{
  "type": "response.create"
}
```

模型不会立即返回文本或音频响应，而是会生成一个响应，其中包含应传递给开发者应用程序中某个函数的参数。你可以使用 [`response.function_call_arguments.delta`](https://developers.openai.com/api/reference/resources/realtime) 服务端事件监听函数调用参数的实时更新，但 `response.done` 也将包含我们调用该函数所需的完整数据。

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

在服务端发出的 JSON 中，我们可以检测到模型希望调用自定义函数：

| 属性                       | 函数调用用途                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `response.output[0].type`      | 当设置为 `function_call`，时，表示此响应包含某个具名函数调用的参数。                         |
| `response.output[0].name`      | 要调用的已配置函数名称，在本例中为 `generate_horoscope`                                             |
| `response.output[0].arguments` | 传递给函数的参数的 JSON 字符串。在我们的例子里， `"{\"sign\":\"Aquarius\"}"`.                              |
| `response.output[0].call_id`   | 该函数调用的系统生成 ID —— **你需要使用此 ID 将函数调用结果返回给模型**. |

根据这些信息，我们可以在应用中执行代码来生成运势，然后将这些信息返回给模型，让它生成响应。

### 向模型提供函数调用的结果

在收到模型对函数调用的参数响应后，你的应用可以执行满足该函数调用的代码。这可以是任何你想要的操作，比如与外部 API 通信或访问数据库。

当你准备好将自定义代码的结果交给模型时，你可以通过以下方式创建一个包含结果的新对话条目 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件创建响应时实现此功能。

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

- 该对话条目类型为 `function_call_output`
- `item.call_id` 与我们在上方事件中获取到的 ID 相同 `response.done` 上方的事件
- `item.output` 是一个 JSON 字符串，其中包含我们函数调用的结果

一旦我们添加了包含函数调用结果的会话项后，我们会再次从客户端发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。这将使用函数调用中的数据触发模型响应。

```json
{
  "type": "response.create"
}
```

## 错误处理

该 [`error`](https://developers.openai.com/api/reference/resources/realtime) 每当服务器在会话期间遇到错误情况时，就会发出该 event。有时，这些错误可以追溯到由你的应用发出的某个客户端 event。

与 HTTP 请求和响应不同——在 HTTP 中，响应会隐式地与来自客户端的请求相关联——我们需要使用客户端 event 上的一个 `event_id` 属性来判断它们中的哪一个在服务器上触发了错误情况。下面的代码演示了这一技巧，其中客户端尝试发出一个不受支持的事件类型。

```javascript
const event = {
  event_id: "my_awesome_event",
  type: "scooby.dooby.doo",
};

dataChannel.send(JSON.stringify(event));
```


从客户端发送的这个失败的 event 将引发如下所示的 error event：

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

在许多语音应用中，用户可以在模型说话时打断它。当 VAD 启用时，实时 API 会处理中断，即检测到用户说话后取消正在进行的响应，并开始一个新的响应。但在这种场景下，你会希望模型知道它在哪里被打断，从而能够自然地继续对话（例如用户说“那最后一句是什么？”）。我们将此称为 **截断** 模型的最后响应，即从对话中移除模型最后响应中尚未播放的部分。

在 WebRTC 和 SIP 连接中，服务端管理一段输出音频缓冲，因此知道在某一时刻已播放了多少音频。当发生用户中断时，服务端会自动截断未播放的音频。

在使用 WebSocket 连接时，客户端负责音频播放，因此必须自行停止播放并处理截断。该流程如下：

1. 客户端会监听来自 `input_audio_buffer.speech_started` 服务端的新事件，以表明用户已开始说话。服务端会自动取消任何正在进行的模型响应，并发出一个 `response.cancelled` 事件。
1. 当客户端检测到此事件时，应立即停止播放模型当前正在播放的任何音频。它应该记录在中断之前最后一段音频响应已播放了多少。
1. 客户端应发送一个 [`conversation.item.truncate`](https://developers.openai.com/api/reference/resources/realtime) 事件，以从对话中移除模型上一次响应中未播放的部分。

下面是一个示例：

```json
{
    "type": "conversation.item.truncate",
    "item_id": "item_1234", # this is the item ID of the model's last response
    "content_index": 0,
    "audio_end_ms": 1500 # truncate audio after 1.5 seconds
}
```

那同时截断转录文本呢？realtime 模型没有足够的信息来精确对齐转录文本和音频，因此 `conversation.item.truncate` 会在某个位置切断音频，并移除未播放部分的文本转录。这可以解决移除未播放音频的问题，但无法提供截断后的转录文本。

## Push-to-talk

Realtime API 默认使用语音活动检测（VAD），这意味着模型会基于音频输入触发响应。你也可以通过禁用 VAD，并在应用层设置一个开关来控制何时将音频输入发送给模型，从而实现按住说话（push-to-talk）的交互方式，例如按住空格键来捕获音频，松开时触发模型响应。对于某些应用来说，这种方式效果出奇地好——它让用户能够掌控交互，避免了 VAD 失效的问题，并且由于不用等待 VAD 超时，响应感觉很迅速。

在 WebSockets 和 WebRTC 上实现按住说话的方式略有不同。在 Realtime API 的 WebSocket 连接中，所有事件都在同一通道内按相同顺序发送；而 WebRTC 连接则为音频和控制事件分别设置了独立的通道。

### WebSockets

要通过 WebSocket 连接实现按住说话，你需要让客户端停止音频播放、处理打断，并发起新的响应。以下是更详细的步骤：

1. 通过设置关闭 VAD `"turn_detection": null` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件。
1. 按下时，在客户端开始录制音频。
   1. 如果模型有正在进行的响应，通过发送 [`response.cancel`](https://developers.openai.com/api/reference/resources/realtime) 事件。
   1. 如果模型有正在进行的输出播放，立即停止播放并发送 `conversation.item.truncate` 事件，从对话中移除任何未播放的音频。
1. 松开时，发送一个 [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime) 消息，附带音频以将新音频放入输入缓冲区。
1. 发送一个 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime) 事件，这会提交写入输入缓冲区的音频并启动输入转录（如果已启用）。
1. 然后使用 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。

### WebRTC and SIP

使用 WebRTC 实现按住说话功能类似，但输入音频缓冲区必须被显式清除。步骤如下：

1. 通过设置关闭 VAD `"turn_detection": null` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件。
1. 按下时，发送一个 [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 事件以清除之前的音频输入。
   1. 如果模型有正在进行的响应，通过发送 [`response.cancel`](https://developers.openai.com/api/reference/resources/realtime) 事件。
   1. 如果模型正在持续输出播放，发送一个 [`output_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 事件以清除未播放的音频，这也会截断对话。
1. 松开时，发送一个 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime) 事件，这会提交写入输入缓冲区的音频并启动输入转录（如果已启用）。
1. 然后使用 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。