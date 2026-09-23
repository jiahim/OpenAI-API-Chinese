# 语音活动检测 (VAD)

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取该页面的 Markdown 版本。

语音活动检测（VAD）是 Realtime API 中提供的一项功能，可自动检测用户何时开始或停止说话。
它在 [语音到语音](https://developers.openai.com/api/docs/guides/realtime-conversations) Realtime 会话中默认启用，但该功能是可选的，可以关闭。
在 [转录](https://developers.openai.com/api/docs/guides/realtime-transcription) Realtime 会话中的轮次检测支持取决于转录模型。支持 VAD 的模型默认使用 `server_vad`，而 `gpt-live-transcribe` 和 `gpt-realtime-whisper` 则需要省略轮次检测或将其设置为 `null`。发送 `input_audio_buffer.commit` 以便使用这些模型结束每个音频轮次。

## 概述

当 VAD 启用时，音频会被自动分块，Realtime API 会发送事件来指示用户何时开始或停止说话：

- `input_audio_buffer.speech_started`: 一段语音对话的开始
- `input_audio_buffer.speech_stopped`: 一段语音对话的结束

你可以使用这些事件在应用中处理语音轮次。例如，你可以用它们来管理会话状态或分块处理转录文本。

你可以通过以下方式配置 VAD: [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件，设置 `session.audio.input.turn_detection`.

VAD 有两种模式:

- `server_vad`: 根据静音段自动对音频进行分块。
- `semantic_vad`: 当模型根据用户所说的话判断用户已说完一句话时，对音频进行分块。

对于支持 VAD 的会话和模型，默认值为 `server_vad`.

请阅读下文，详细了解各种模式。

## Server VAD

Server VAD 是语音对语音会话的默认模式，也是支持轮次检测的模型上进行转录会话时的默认模式。它利用静音片段自动对音频进行分块。

你可以调整以下属性来微调 VAD 设置：

- `threshold`: 激活阈值（0 到 1）。阈值越高，激活模型所需的音频音量越大，因此在嘈杂环境下表现可能会更好。
- `prefix_padding_ms`: 在 VAD 检测到语音之前要包含的音频时长（以毫秒为单位）。
- `silence_duration_ms`: 用于检测语音停止的静默时长（以毫秒为单位）。值越短，检测到轮次结束的速度越快。

以下是 VAD 配置示例：

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

在转录会话中使用相同的 `session.audio.input.turn_detection` 字段。在转录会话中，可省略 `gpt-live-transcribe` 和 `gpt-realtime-whisper`，或将轮次检测省略或设为 `null`.

该 `create_response` 和 `interrupt_response` 字段仅用于语音到语音会话。在转录会话中，VAD 仅控制音频的分块方式。

## Semantic VAD

Semantic VAD 是一种新模式，它使用语义分类器，根据用户已说出的话语来判断用户是否已说完。
该分类器会根据用户已说结束的可能性对输入音频进行打分。当概率较低时，模型会等待超时；而当概率较高时，则无需等待。
例如，相较于明确的陈述，用户声音逐渐减弱会导致更长的超时时间。

使用此模式后，模型在语音到语音对话中更不容易打断用户，或在用户说完之前对转录文本进行切分。

可以通过设置 `session.audio.input.turn_detection.type` 为 `semantic_vad`.

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

同一个 `session.audio.input.turn_detection` 字段也适用于支持 VAD 的模型的转录会话。该 `create_response` 和 `interrupt_response` 字段仅用于对话。

可选的 `eagerness` 属性用于控制模型打断用户的积极性，并调节最大等待超时时间。在转录模式下，即使模型不进行回复，它也会影响音频的切分方式。

- `auto` 为默认值，等价于 `medium`.
- `low` 会让用户从容地讲话。
- `high` 会尽快对音频进行分块。

如果你希望模型在对话模式下更频繁地做出回应，或者希望转录模式下更快地返回转录事件，可以设置 `eagerness` 为 `high`.

另一方面，如果你希望在对话模式下让用户不被打断地讲话，或者在转录模式下获得更大的转录片段，可以设置 `eagerness` 为 `low`.