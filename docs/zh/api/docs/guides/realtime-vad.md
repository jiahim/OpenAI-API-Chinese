# Voice activity detection (VAD)

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

语音活动检测 (VAD) 是 Realtime API 中的一项功能，可自动检测用户何时开始或停止说话。
在以下会话中默认启用该功能： [语音到语音](https://developers.openai.com/api/docs/guides/realtime-conversations) Realtime 会话，但该功能是可选的，可以关闭。
在 [转录](https://developers.openai.com/api/docs/guides/realtime-transcription) Realtime 会话中，轮次检测支持取决于转录模型。支持 VAD 的模型默认采用 `server_vad`，而 `gpt-realtime-whisper` 则需要省略轮次检测或将其设置为 `null`.

## 概述

启用 VAD 后，音频会自动分块，Realtime API 会发送事件以指示用户何时开始或停止说话：

- `input_audio_buffer.speech_started`: 一段语音对话的开始
- `input_audio_buffer.speech_stopped`: 一段语音对话的结束

你可以使用这些事件在你的应用中处理语音轮次。例如，你可以用它们来管理对话状态或分块处理转录文本。

你可以通过以下方式配置 VAD： [`session.update`](https://developers.openai.com/api/reference/resources/realtime) client 事件来设置 `session.audio.input.turn_detection`.

VAD 有两种模式：

- `server_vad`: 根据静音段自动对音频进行分块。
- `semantic_vad`: 当模型根据用户所说的话认为用户已经说完一句话时，对音频进行分块。

对于支持 VAD 的会话和模型，默认值为 `server_vad`.

阅读下文以详细了解不同模式。

## Server VAD

Server VAD 是语音到语音会话的默认模式，也适用于支持轮次检测的模型的转录会话。它利用静默段自动对音频进行分块。

你可以调整以下属性来微调 VAD 设置：

- `threshold`: 激活阈值（0 到 1）。较高的阈值需要更响亮的音频才能激活模型，因此在嘈杂环境中可能会有更好的表现。
- `prefix_padding_ms`: 在 VAD 检测到语音之前要包含的音频时长（以毫秒为单位）。
- `silence_duration_ms`: 检测语音停止的静默时长（以毫秒为单位）。该值越短，越能更快检测到轮次结束。

以下是一个 VAD 配置示例：

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "audio": {
      "input": {
        "turn_detection": {
          "type": "server_vad",
          "threshold": 0.5,
          "prefix_padding_ms": 300,
          "silence_duration_ms": 500,
          "create_response": true, // only in conversation mode
          "interrupt_response": true // only in conversation mode
        }
      }
    }
  }
}
```

在转录会话中使用相同的 `session.audio.input.turn_detection` 字段。对于 `gpt-realtime-whisper`,请省略 turn detection 或将其设置为 `null`.

该 `create_response` 和 `interrupt_response` 字段仅用于语音到语音对话。在转录会话中,VAD 仅控制音频的分块方式。

## Semantic VAD

Semantic VAD 是一种新模式，它使用语义分类器，根据用户已说出的话来判断用户是否已说完。
该分类器会根据用户已经说完了的概率对输入音频进行打分。当该概率较低时，模型会等待一个超时时间；而当概率较高时，则无需等待。
例如，用户音频如果以“ummm...”之类的迟疑收尾，相比明确的陈述会触发更长的超时。

在这种模式下，模型在语音到语音对话中不太会打断用户，或在用户尚未说完时就提前切分转写文本。

Semantic VAD 可以通过设置 `session.audio.input.turn_detection.type` 为 `semantic_vad`.

可以这样配置：

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "audio": {
      "input": {
        "turn_detection": {
          "type": "semantic_vad",
          "eagerness": "low" | "medium" | "high" | "auto", // optional
          "create_response": true, // only in conversation mode
          "interrupt_response": true, // only in conversation mode
        }
      }
    }
  }
}
```

同一个 `session.audio.input.turn_detection` 字段在转写会话中也适用。 `create_response` 和 `interrupt_response` 字段仅在对话模式下可用。

可选的 `eagerness` 属性用于控制模型打断用户的积极性，调整最长等待超时。在转写模式下，即使模型不进行回复，它也会影响音频的切分方式。

- `auto` 是默认值，等同于 `medium`.
- `low` 会让用户从容地说话。
- `high` 会尽快对音频进行分块。

如果希望模型在对话模式下更频繁地响应，或者在转录模式下更快地返回转录事件，可以设置 `eagerness` 为 `high`.

另一方面，如果希望让用户在对话模式下能够不被打断地说话，或者希望在转录模式下获得更大的转录片段，可以设置 `eagerness` 为 `low`.