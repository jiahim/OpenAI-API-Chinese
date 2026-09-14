# Realtime 翻译服务端事件

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

这些事件由 OpenAI Realtime Translation WebSocket 服务端发送给客户端。

<a id="error"></a>

## error

在发生错误时返回，错误可能是客户端问题或服务端
问题。大多数错误都是可恢复的，会话将保持打开状态，我们
建议实现者默认监控并记录错误消息。

### Schema

Schema name: `RealtimeServerEventError`

- `error: RealtimeError`

  错误的详细信息。

  - `message: string`

    人类可读的错误消息。

  - `type: string`

    错误类型（例如 "invalid_request_error"、"server_error"）。

  - `code: optional string or null`

    错误代码（如果有）。

  - `event_id: optional string or null`

    导致错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如果有）。

- `event_id: string`

  服务端事件的唯一 ID。

- `type: "error"`

  事件类型，必须为 `error`.

  - `"error"`

### 示例

```json
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

<a id="session.created"></a>

## session.created

在创建翻译会话时返回。新连接建立时作为第一个服务端事件自动发出。此事件包含
默认的翻译会话配置。
默认的翻译会话配置。

### Schema

Schema name: `RealtimeTranslationServerEventSessionCreated`

- `event_id: string`

  服务端事件的唯一 ID。

- `session: RealtimeTranslationSession`

  翻译会话配置。

  - `id: string`

    会话的唯一标识符，形式如下 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流运行。

        - `model: string`

          用于源转录增量（transcript deltas）的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `model: string`

    用于本次会话的 Realtime 翻译模型。该字段在
    会话创建时设置，无法通过 `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

    - `"translation"`

- `type: "session.created"`

  事件类型，必须为 `session.created`.

  - `"session.created"`

### 示例

```json
{
  "type": "session.created",
  "event_id": "event_123",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "fr"
      }
    }
  }
}
```

<a id="session.updated"></a>

## session.updated

当翻译会话被更新时返回， `session.update` event,
除非发生错误。

### Schema

Schema name: `RealtimeTranslationServerEventSessionUpdated`

- `event_id: string`

  服务端事件的唯一 ID。

- `session: RealtimeTranslationSession`

  翻译会话配置。

  - `id: string`

    会话的唯一标识符，形式如下 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流运行。

        - `model: string`

          用于源转录增量（transcript deltas）的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自纪元以来的秒数表示。

  - `model: string`

    用于本次会话的 Realtime 翻译模型。该字段在
    会话创建时设置，无法通过 `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

    - `"translation"`

- `type: "session.updated"`

  事件类型，必须为 `session.updated`.

  - `"session.updated"`

### 示例

```json
{
  "type": "session.updated",
  "event_id": "event_124",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

<a id="session.closed"></a>

## session.closed

当实时翻译会话关闭时返回。

### Schema

Schema name: `RealtimeTranslationServerEventSessionClosed`

- `event_id: string`

  服务端事件的唯一 ID。

- `type: "session.closed"`

  事件类型，必须为 `session.closed`.

  - `"session.closed"`

### 示例

```json
{
  "event_id": "event_987",
  "type": "session.closed"
}
```

<a id="session.input_transcript.delta"></a>

## session.input_transcript.delta

当可选的源语言转写文本可用时返回。此事件
仅在配置了 `audio.input.transcription` 时才会发出。

转写增量是仅追加的文本片段。客户端不应在增量之间
插入无条件的空格。

### Schema

Schema name: `RealtimeTranslationServerEventSessionInputTranscriptDelta`

- `delta: string`

  仅追加的源语言转录文本。

- `event_id: string`

  服务端事件的唯一 ID。

- `type: "session.input_transcript.delta"`

  事件类型，必须为 `session.input_transcript.delta`.

  - `"session.input_transcript.delta"`

- `elapsed_ms: optional number or null`

  用于流对齐的计时元数据，源自翻译帧
  （在可用时）。它以 200 毫秒为步进推进，但多个转录
  增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
  而非唯一的转录增量标识符。

### 示例

```json
{
  "event_id": "event_125",
  "type": "session.input_transcript.delta",
  "delta": " hear",
  "elapsed_ms": 1200
}
```

<a id="session.output_transcript.delta"></a>

## session.output_transcript.delta

当翻译后的转写文本可用时返回。

转写增量是仅追加的文本片段。客户端不应在增量之间
插入无条件的空格。

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputTranscriptDelta`

- `delta: string`

  用于已翻译输出音频的仅追加转录文本。

- `event_id: string`

  服务端事件的唯一 ID。

- `type: "session.output_transcript.delta"`

  事件类型，必须为 `session.output_transcript.delta`.

  - `"session.output_transcript.delta"`

- `elapsed_ms: optional number or null`

  用于流对齐的计时元数据，源自翻译帧
  （在可用时）。它以 200 毫秒为步进推进，但多个转录
  增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
  而非唯一的转录增量标识符。

### 示例

```json
{
  "event_id": "event_124",
  "type": "session.output_transcript.delta",
  "delta": " escuch",
  "elapsed_ms": 1200
}
```

<a id="session.output_audio.delta"></a>

## session.output_audio.delta

当翻译后的输出音频可用时返回。该 `delta` 包含一个
PCM16 音频数据块，其长度可变。客户端应对完整的增量进行解码和排队，
而非假设固定的字节或采样数。

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputAudioDelta`

- `delta: string`

  Base64 编码的翻译音频数据。

- `event_id: string`

  服务端事件的唯一 ID。

- `type: "session.output_audio.delta"`

  事件类型，必须为 `session.output_audio.delta`.

  - `"session.output_audio.delta"`

- `channels: optional number`

  音频声道数。

- `elapsed_ms: optional number or null`

  用于流对齐的计时元数据，源自翻译帧
  在可用时。请将 `elapsed_ms` 视为对齐元数据，而非唯一的
  事件标识符。

- `format: optional "pcm16"`

  音频编码格式， `delta`.

  - `"pcm16"`

- `sample_rate: optional number`

  音频增量的采样率。

### 示例

```json
{
  "event_id": "event_123",
  "type": "session.output_audio.delta",
  "delta": "Base64EncodedAudioDelta",
  "sample_rate": 24000,
  "channels": 1,
  "format": "pcm16",
  "elapsed_ms": 1200
}
```
