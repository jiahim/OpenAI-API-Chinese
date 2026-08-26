# 语音活动检测（VAD）

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

语音活动检测（VAD）是 Realtime API 中的一项功能，可自动检测用户何时开始或停止说话。
它在 [语音到语音](https://developers.openai.com/api/docs/guides/realtime-conversations) Realtime 会话中默认启用，但也可选并可关闭。
在 [转录](https://developers.openai.com/api/docs/guides/realtime-transcription) Realtime 会话中，转变检测的支持取决于转录模型。支持 VAD 的模型默认设置为 `server_vad`，而 `gpt-realtime-whisper` 要求省略转变检测或将其设置为 `null`.

## 概述

启用 VAD 后，音频会自动分块，Realtime API 会发送事件以指示用户何时开始或停止说话：

- `input_audio_buffer.speech_started`：语音回合的开始
- `input_audio_buffer.speech_stopped`：语音回合的结束

你可以在应用程序中使用这些事件来处理语音轮次。例如，你可以使用它们来管理对话状态或分块处理文本。

你可以通过 [`session.update`](https://developers.openai.com/api/reference/resources/realtime) 客户端事件配置 VAD，通过设置 `session.audio.input.turn_detection`.

VAD 有两种模式：

- `server_vad`: 根据静音时段自动对音频进行分块。
- `semantic_vad`: 当模型根据用户所说的话判断用户已完成话语时，对音频进行分块。

对于支持 VAD 的会话和模型，默认值为 `server_vad`.

请阅读下文以了解不同模式的更多信息。

## 服务端 VAD

服务端 VAD 是语音到语音会话及支持轮次检测的模型上的转录会话的默认模式。它利用静音时段自动对音频进行分块。

你可以调整以下属性以微调 VAD 设置：

- `threshold`：激活阈值（0 到 1）。阈值越高，需要越大的音量才能激活模型，因此在嘈杂环境中可能表现更好。
- `prefix_padding_ms`：在 VAD 检测到语音之前要包含的音频量（以毫秒为单位）。
- `silence_duration_ms`：检测语音停止的静音持续时间（以毫秒为单位）。值越短，轮次检测越快。

以下是一个VAD配置示例：

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

在转录会话中使用相同的 `session.audio.input.turn_detection` 字段。对于 `gpt-realtime-whisper`，省略话轮检测或将其设置为 `null`.

The `create_response` 和 `interrupt_response` 字段仅用于语音到语音对话。在转录会话中，VAD仅控制音频如何分块。

## 语义 VAD

语义 VAD 是一种新模式，它使用语义分类器，根据用户说出的话语来检测用户何时说完话。
该分类器根据用户说完话的概率对输入音频进行评分。当概率较低时，模型将等待超时；而当概率较高时，则无需等待。
例如，用户音频以“嗯……”结尾时，会比确定性的陈述导致更长的超时时间。

使用此模式，模型在语音到语音对话中不太可能打断用户，或者在用户说完话之前将转录文本分块。

可以通过设置 `session.audio.input.turn_detection.type` 为 `semantic_vad`.

来激活语义 VAD。可按如下方式配置：

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

同样的 `session.audio.input.turn_detection` 字段适用于转录会话。而 `create_response` 和 `interrupt_response` 字段仅限会话使用。

可选的 `eagerness` 属性是一种控制模型打断用户急切程度的方法，可调整最大等待超时时间。在转录模式下，即使模型不回复，它也会影响音频的分块方式。

- `auto` 是默认值，等同于 `medium`.
- `low` 将让用户从容地说话。
- `high` 将尽快对音频进行分块处理。

如果你希望模型在对话模式下更频繁地响应，或者在转录模式下更快地返回转录事件，你可以将 `eagerness` 设置为 `high`.

另一方面，如果你希望在对话模式下让用户畅所欲言而不被打断，或者你希望在转录模式下获得更大的转录片段，你可以将 `eagerness` 设置为 `low`.