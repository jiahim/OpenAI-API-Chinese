# 实时对话

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 末尾追加 `.md` 。

一旦你通过以下任意一种方式连接到 Realtime API [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 或 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime),即可调用 Realtime 模型（例如 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1))进行语音到语音对话。这需要你 **发送客户端事件** 来发起操作,并 **监听服务端事件** 以响应 Realtime API 执行的操作。

本指南将逐步介绍使用音频和文本生成、图像输入以及函数调用等模型能力所需的事件流,以及如何理解 Realtime 会话的状态。

如果你无需与模型进行对话,也就是说,你不
  期望收到任何响应,可以在 [转写
  模式下使用 Realtime API](https://developers.openai.com/api/docs/guides/realtime-transcription).

## 实时语音对语音会话

Realtime 会话是模型与已连接客户端之间的一次有状态交互。构成会话的关键组件包括：

- 该 **Session** 对象，用于控制交互参数，例如所使用的模型、用于生成输出的语音以及其他配置。
- 一个 **Conversation**，表示当前会话中生成的用户输入 Items 和模型输出 Items。
- **Responses**，是添加到 Conversation 的模型生成音频或文本 Items。

**输入音频缓冲区与 WebSockets**

如果使用 WebRTC，许多向模型发送和接收音频所需的媒体处理由 WebRTC API 辅助完成。



如果使用 WebSockets 处理音频，你需要手动与 **input audio buffer** 交互，方式是向服务端发送音频，通过附带 base64 编码音频的 JSON 事件进行传输。

所有这些组件共同构成一个 Realtime Session。你将使用客户端事件来更新会话的状态，并监听服务端事件以响应会话内的状态变化。

![实时状态示意图](https://openaidevs.retool.com/api/file/11fe71d2-611e-4a26-a587-881719a90e56)

## 会话生命周期事件

在通过 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 或 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)，之一发起会话后，服务端会发送一个 [`session.created`](https://developers.openai.com/api/reference/resources/realtime) 事件，表明会话已就绪。在客户端，你可以使用 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件更新当前会话配置。大多数会话属性可以随时更新，但 `voice` 模型用于音频输出的语音，在会话中模型已经响应过一次音频后不可更改。Realtime 会话的最长持续时间为 **60 分钟**.

下面的示例展示了使用 `session.update` 客户端事件来更新会话。有关通过这些通道发送客户端事件的更多内容，请参阅 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#sending-and-receiving-events) 或 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime#sending-and-receiving-events) 指南。

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

```ruby
connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  output_modalities: [:audio],
  audio: {
    input: {
      format: {type: :"audio/pcm", rate: 24_000},
      turn_detection: {type: :semantic_vad}
    },
    output: {
      format: {type: :"audio/pcm", rate: 24_000},
      voice: :marin
    }
  },
  prompt: {
    id: ENV.fetch("OPENAI_REALTIME_PROMPT_ID"),
    version: "89",
    variables: {city: "Paris"}
  },
  instructions: "Speak clearly and briefly. Confirm before taking action."
)
```


会话更新完成后，服务端会发出一个 [`session.updated`](https://developers.openai.com/api/reference/resources/realtime) 事件，其中包含会话的最新状态。

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

要使用 Realtime 模型生成文本，你可以向当前对话添加文本输入，指示模型生成响应，并监听服务端发送的事件以了解模型响应的进度。要生成文本， [会话必须配置](https://developers.openai.com/api/reference/resources/realtime) 使用 `text` 模态（默认即为如此）。

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
  content: [{type: :input_text, text: "What is the weather like today?"}]
)
```


将用户消息添加到对话后，发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件以启动模型的响应。如果当前会话同时启用了音频和文本，模型将同时返回音频和文本内容。如果你希望仅生成文本，可以在发送 `response.create` 客户端事件时指定，如下所示。

生成仅包含文本的响应

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


在模型响应生成过程中，服务端会发出一系列生命周期事件。你可以监听这些事件（例如 [`response.output_text.delta`](https://developers.openai.com/api/reference/resources/realtime)），以便在响应生成时为用户提供实时反馈。服务端发出的事件的完整列表见下文中的 **相关服务端事件**。它们大致按发出的顺序排列，并附带了与文本生成相关的客户端事件。

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

Realtime API 最强大的功能之一是与模型进行语音到语音的交互，无需中间的文本转语音或语音转文本步骤。这能为语音界面带来更低的延迟，并让模型获得更多数据来处理语音输入的语调和抑扬变化。

### Voice options

Realtime 会话可配置为在生成音频输出时使用几种内置语音之一。你可以设置该 `voice` 在创建会话时（或在某个 `response.create`）中）来控制模型的声音。当前可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`, `marin`，和 `cedar`。一旦模型在某个会话中发出了音频，该会话的 `voice` 就无法再修改。为获得最佳质量，我们建议使用 `marin` 或 `cedar`.

### 使用 WebRTC 处理音频

如果你使用 WebRTC 连接到 Realtime API，那么 Realtime API 会作为 [对等连接](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) 连接到你的客户端。模型的音频输出会以 [远端媒体流](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)。的形式传送到你的客户端。模型的音频输入通过音频设备（[`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)）采集，媒体流会作为轨道添加到对等连接中。

来自 [WebRTC 连接指南](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 的示例代码展示了使用浏览器 API 配置本地和远端音频的基本示例：

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


上面的代码片段可以实现与 Realtime API 的交互，但还可以做更多事情。更多不同类型用户界面的示例，请查看 [WebRTC 示例](https://github.com/webrtc/samples) 仓库。这些示例的实时演示也可以在 [这里](https://webrtc.github.io/samples/).

使用 [媒体采集与流](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API) ，你可以在浏览器中实现麦克风静音和取消静音、选择采集输入的设备等操作。

### WebRTC 中音频的客户端与服务端事件

默认情况下，WebRTC 客户端在发送音频输入之前，无需向 Realtime API 发送任何客户端事件。一旦本地音频轨道被添加到对等连接中，你的用户就可以直接开始说话！

不过，当音频在对等连接中的客户端和服务端之间来回传输时，WebRTC 客户端仍会收到许多服务端发送的生命周期事件，例如：

- 当输入通过本地媒体轨道发送时，你会收到 [`input_audio_buffer.speech_started`](https://developers.openai.com/api/reference/resources/realtime) 事件。
- 当本地音频输入停止时，你会收到 [`input_audio_buffer.speech_stopped`](https://developers.openai.com/api/reference/resources/realtime) 事件。
- 你会收到 [正在进行中音频转录的增量事件](https://developers.openai.com/api/reference/resources/realtime).
- 你会收到 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件，表示模型已完成转录并发送完响应。

操作 WebRTC API 媒体流也许能满足你对控制的全部需求。然而，偶尔也需要使用更低级别的接口来处理音频输入和输出。更多信息以及细粒度音频输入所需的事件列表，请参阅下面的 WebSockets 部分。

### 使用 WebSockets 处理音频

通过 WebSocket 发送和接收音频时，客户端需要额外处理媒体发送，服务端也需要额外处理媒体接收。下面给出一张表格，描述了在 WebSocket 会话中发送和接收音频所必需的事件流转。

下面按生命周期顺序列出事件，不过部分事件（例如 `delta` 事件）可能会并发发生。

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

### 向服务端流式传输音频输入

要将音频输入流式传输到服务端，你可以使用 [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。该事件要求你发送 **Base64 编码的音频字节** 块，通过 socket 发送到 Realtime API。每个块的大小不能超过 15 MB。

输入块的格式可以为整个会话配置，也可以按每个响应单独配置。

- Session: `session.input_audio_format` in [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- Response: `response.input_audio_format` in [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

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

也可以创建包含完整音频录制的对话消息。请使用 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来创建带有 `input_audio` 内容的消息。

创建完整的音频输入对话条目

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
  content: [{type: :input_audio, audio: audio}]
)
```


### 处理 WebSocket 的音频输出

**要在网页浏览器等客户端设备上播放输出音频，我们建议使用 WebRTC 而非 WebSockets**。在网络条件不稳定的情况下，WebRTC 向客户端设备传输媒体会更加稳健。

但在使用 WebSocket 的服务端到服务端应用中处理音频输出时，你需要监听 [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime) 事件，其中包含来自模型的 Base64 编码音频数据块。你需要将这些数据块进行缓冲后写入文件，或者立即将它们流转到其他来源，例如 [与 Twilio 进行的电话通话](https://www.twilio.com/en-us/blog/twilio-openai-realtime-api-launch-integration).

请注意， [`response.output_audio.done`](https://developers.openai.com/api/reference/resources/realtime) 和 [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 事件实际上并不包含音频数据，仅包含音频内容的转录文本。若要获取实际的字节数据，你需要监听 [`response.output_audio.delta`](https://developers.openai.com/api/reference/resources/realtime) 事件。

输出音频块的格式可以为整个会话配置，也可以为每个响应单独配置。

- Session: `session.audio.output.format` in [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- Response: `response.audio.output.format` in [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

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

`gpt-realtime-2` 和 `gpt-realtime` 还支持图像输入。你可以在用户消息中以内容部分的形式附加图像，模型在回复时可以结合图像中的内容。

向对话中添加图像

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
    {type: :input_image, image_url: "data:image/png;base64,#{encoded_image}"},
    {type: :input_text, text: "Describe this image."}
  ]
)
connection.response.create(output_modalities: [:text])
```


## 语音活动检测

默认情况下，Realtime 会话启用 **语音活动检测（VAD）** ，这意味着 API 会判断用户何时开始或停止说话，并自动作出回应。

有关如何配置 VAD 的更多信息，请参阅我们的 [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad) 指南。

### 禁用 VAD

可以通过将 `turn_detection` 设置为 `null` 使用 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件来禁用 VAD。这对于希望对音频输入进行精细控制的接口非常有用，例如 [按住说话](https://en.wikipedia.org/wiki/Push-to-talk) 接口。

禁用 VAD 后，客户端必须手动发送一些额外的客户端事件来触发音频响应：

- 手动发送 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime)，这将为对话创建一个新的用户输入项。
- 手动发送 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 以触发来自模型的音频响应。
- 发送 [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) ，然后再开始新的用户输入。

### 保留 VAD，但禁用自动响应

如果你希望保持 VAD 模式启用，但又想保留手动决定何时生成响应的能力，你可以设置 `turn_detection.interrupt_response` 和 `turn_detection.create_response` 设置为 `false` 使用 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。这将保留 VAD 的所有行为，但不会自动创建新的 Responses。客户端可以使用 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件手动触发这些。

这在内容审核、输入校验或 RAG 模式等场景下非常有用，在这些场景中，你愿意用稍多的交互延迟换取对输入的控制权。

## 在默认对话之外创建响应

默认情况下，会话期间生成的所有响应都会添加到该会话的对话状态中（即“默认对话”）。不过，你可能希望在不依赖会话默认对话上下文的情况下生成模型响应，或并发生成多个响应。你可能还需要更精细地控制模型生成响应时会考虑哪些对话项（例如，仅考虑最近 N 轮）。

生成不会添加到默认对话状态中的“带外”响应，可以通过在创建响应时设置以下内容实现： `response.conversation` 字段为字符串 `none` 在通过以下方式创建响应时： [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。

创建带外响应时，你可能还需要某种方式来识别哪些服务端发送事件与此响应相关。你可以提供 `metadata` 作为模型响应的标识，帮助你识别正在为该客户端发送事件生成的响应。

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

```ruby
connection.response.create(
  conversation: :none,
  metadata: {topic: "classification"},
  output_modalities: [:text],
  instructions: "Classify the conversation as support or sales."
)
```


现在，当你监听以下事件时： [`response.done`](https://developers.openai.com/api/reference/resources/realtime) 服务端事件，你可以识别带外响应的结果。

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


### 为响应创建自定义上下文

你也可以构造一个自定义上下文，让模型使用它来生成回复，独立于默认或当前的对话。这可以通过使用 `input` 数组在 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件上来完成。你可以使用新的输入，或者按 ID 引用对话中已有的输入项。

监听使用自定义上下文的带外模型回复

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
  metadata: {topic: "classification"},
  output_modalities: [:text],
  input: [
    {type: :item_reference, id: ENV.fetch("OPENAI_REALTIME_CONTEXT_ITEM_ID")},
    {
      type: :message,
      role: :user,
      content: [{type: :input_text, text: "Classify this issue: my order is late."}]
    }
  ]
)
```


### 创建不带上下文的响应

你也可以将响应插入到默认会话中，忽略所有其他指令和上下文。方法是设置 `input` 为空数组。

将无上下文的模型响应插入到默认会话中

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


## Function calling

Realtime 模型同样支持 **函数调用**，你可以借此执行自定义代码以扩展模型能力。其大致工作流程如下：

1. 当 [更新会话](https://developers.openai.com/api/reference/resources/realtime) 或 [创建响应](https://developers.openai.com/api/reference/resources/realtime)，时，你可以指定模型可调用的函数列表。
1. 如果在处理输入时，模型判断应当发起函数调用，它会向对话中添加表示函数调用参数的项。
1. 当客户端检测到对话项中包含函数调用参数时，它会使用这些参数执行自定义代码
1. 当自定义代码执行完毕后，客户端会创建包含函数调用输出的新对话项，并让模型进行响应。

下面我们通过添加一个可调用函数,让模型用户能够获取今日星座运势,从而看看它在实际中是如何工作的。我们将展示需要发送的客户端事件对象的结构,以及服务端将相应返回的内容。

### 配置可调用函数

首先，我们必须为模型提供一组可以根据用户输入调用的函数。可用函数可以在会话级别或单个响应级别进行配置。

- Session: `session.tools` 中的属性 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)
- Response: `response.tools` 中的属性 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)

以下是一个客户端事件负载示例，对应于一个 `session.update` ，用于配置一个星座运势生成函数，该函数接受单个参数（需要为其生成运势的星座）：

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

该 `description` 这些字段用于描述函数及其参数，可帮助模型决定是否调用该函数，以及在每个参数中包含哪些数据。如果模型收到的输入表明用户想要自己的星座运势，它将使用 `sign` 参数调用该函数。

### 检测模型何时想要调用函数

根据给模型的输入，模型可能会决定调用某个函数以生成最佳回复。假设我们的应用通过以下方式添加了一条对话条目，并附上 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，然后创建一个 response：

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

随后是一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件，用于生成 response：

```json
{
  "type": "response.create"
}
```

模型不会立即返回文本或音频回复，而是会生成一个 response，其中包含应传递给开发者应用中某个函数的参数。你可以使用 [`response.function_call_arguments.delta`](https://developers.openai.com/api/reference/resources/realtime) 服务端事件监听函数调用参数的实时更新，并且 `response.done` 也会包含我们调用函数所需的完整数据。

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

在服务端输出的 JSON 中，我们可以检测到模型希望调用某个自定义函数：

| 属性                       | 函数调用用途                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `response.output[0].type`      | 当设置为 `function_call`，时，表示此响应包含某个具名函数调用的参数。                         |
| `response.output[0].name`      | 要调用的已配置函数名称，本例中为 `generate_horoscope`                                             |
| `response.output[0].arguments` | 一个 JSON 字符串，包含传递给函数的参数。在我们的示例中， `"{\"sign\":\"Aquarius\"}"`.                              |
| `response.output[0].call_id`   | 此函数调用的系统生成 ID — **你需要使用此 ID 将函数调用结果传回模型**. |

根据这些信息，我们可以在应用中执行代码来生成运势结果，并将其返回给模型，以便模型生成回复。

### 将函数调用的结果提供给模型

在收到模型返回的包含函数调用参数的结果后，你的应用可以执行相应的函数调用代码。这可以是任何你需要的操作，例如与外部 API 通信或访问数据库。

当你准备好将自定义代码的执行结果交给模型时，你可以通过以下方式创建一个包含该结果的新会话条目： [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件。

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

- 对话项的类型为 `function_call_output`
- `item.call_id` 与我们在上方 `response.done` 事件中拿到的 ID 一致
- `item.output` 是一个 JSON 字符串，包含我们函数调用的结果

一旦我们添加了包含函数调用结果的对话项后,我们会再次从客户端发出 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。这将使用函数调用中的数据触发模型响应。

```json
{
  "type": "response.create"
}
```

## 错误处理

该 [`error`](https://developers.openai.com/api/reference/resources/realtime) 当服务端在会话过程中遇到错误情况时，会由服务端发出该事件。这些错误有时可以追溯到你的应用所发出的某个客户端事件。

与 HTTP 请求和响应不同（其中响应隐式地与来自客户端的请求相关联），我们需要使用客户端事件上的一个 `event_id` 属性来判断其中哪个事件在服务端触发了错误条件。下面的代码展示了这一技术，其中客户端尝试发出一个不受支持的事件类型。

```javascript
const event = {
  event_id: "my_awesome_event",
  type: "scooby.dooby.doo",
};

dataChannel.send(JSON.stringify(event));
```


从客户端发送的这个失败事件将生成如下所示的错误事件：

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

在许多语音应用中，用户可以在模型说话时打断它。Realtime API 在启用 VAD 时会处理打断：它会检测用户语音，取消正在进行的响应，并开始新的响应。但在此场景下，你希望模型知道它在哪里被打断，以便能够自然地继续对话（例如用户说“刚才最后那句是什么？”）。我们将此称为 **截断** 模型的最后一个响应，也就是从对话中移除模型最后一个响应中尚未播放的部分。

在 WebRTC 和 SIP 连接中，服务端会管理一段输出音频缓冲区，因此知道在某个时刻已播放了多少音频。当发生用户打断时，服务端会自动截断尚未播放的音频。

在使用 WebSocket 连接时，客户端负责音频播放，因此必须自行停止播放并处理截断。该流程如下：

1. 客户端监听来自服务端的 `input_audio_buffer.speech_started` 事件，这些事件表明用户已开始说话。服务端会自动取消任何正在进行的模型响应，并发出一个 `response.cancelled` 事件。
1. 当客户端检测到该事件时，应立即停止播放模型当前正在播放的任何音频，并记录在中断前最后一段音频响应已播放了多少。
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

如果同时截断转录文本呢？实时模型没有足够的信息来精确对齐转录文本和音频，因此会 `conversation.item.truncate` 在某个位置切断音频，并移除未播放部分的转录文本。这解决了移除未播放音频的问题，但无法提供截断后的转录文本。

## Push-to-talk

Realtime API 默认使用语音活动检测（VAD），这意味着模型响应将由音频输入触发。你也可以通过禁用 VAD 并使用应用层门控来控制何时将音频输入发送给模型，从而实现按住说话（push-to-talk）交互，例如按住空格键以捕获音频，在松开时触发响应。对于某些应用来说，这种方式效果出奇地好——它让用户掌控交互，避免 VAD 失败，并且因为无需等待 VAD 超时而显得响应迅速。

在 WebSockets 和 WebRTC 上实现按住说话略有不同。在 Realtime API 的 WebSocket 连接中，所有事件都在同一通道中以相同顺序发送，而 WebRTC 连接则为音频和控制事件分别使用独立通道。

### WebSockets

要通过 WebSocket 连接实现按住说话，你希望客户端停止音频播放、处理打断，并启动一个新的响应。下面是更详细的步骤：

1. 通过设置来关闭 VAD `"turn_detection": null` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件。
1. 在按下时，在客户端开始录制音频。
   1. 如果模型有正在进行的响应，通过发送一个 [`response.cancel`](https://developers.openai.com/api/reference/resources/realtime) 事件。
   1. 如果模型正在持续输出播放，立即停止播放并发送一个 `conversation.item.truncate` 事件，从对话中移除任何未播放的音频。
1. 在松开时，发送一个 [`input_audio_buffer.append`](https://developers.openai.com/api/reference/resources/realtime) 消息，将音频放入输入缓冲区。
1. 发送一个 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime) 事件，这会提交写入到输入缓冲区的音频，并启动输入转录（如果已启用）。
1. 然后使用一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。

### WebRTC and SIP

使用 WebRTC 实现按下即说（push-to-talk）类似，但必须显式清空输入音频缓冲区。操作步骤如下：

1. 通过设置来关闭 VAD `"turn_detection": null` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 事件。
1. 在按下时，发送一个 [`input_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 事件以清除任何之前的音频输入。
   1. 如果模型有正在进行的响应，通过发送一个 [`response.cancel`](https://developers.openai.com/api/reference/resources/realtime) 事件。
   1. 如果模型正在持续输出播放，发送一个 [`output_audio_buffer.clear`](https://developers.openai.com/api/reference/resources/realtime) 事件以清除未播放的音频，这也会截断对话。
1. 在松开时，发送一个 [`input_audio_buffer.commit`](https://developers.openai.com/api/reference/resources/realtime) 事件，这会提交写入到输入缓冲区的音频，并启动输入转录（如果已启用）。
1. 然后使用一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件。