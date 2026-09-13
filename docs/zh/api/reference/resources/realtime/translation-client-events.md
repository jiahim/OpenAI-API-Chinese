# Realtime 翻译客户端事件

> 如需查看完整文档索引,请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

这些是 OpenAI Realtime Translation WebSocket 服务器将接受来自客户端的事件。

<a id="session.update"></a>

## session.update

发送此事件以更新翻译会话配置。Translation
会话支持更新 `audio.output.language`, `audio.input.transcription`,
和 `audio.input.noise_reduction`.

### Schema

Schema name: `RealtimeTranslationClientEventSessionUpdate`

- `session: RealtimeTranslationSessionUpdateRequest`

  需要更新的翻译会话字段。session `type` 和 `model` 在创建时设置，无法通过
  修改。 `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近距离说话麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍基于
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

- `type: "session.update"`

  事件类型，必须为 `session.update`.

  - `"session.update"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识该事件。

### 示例

```json
{
  "type": "session.update",
  "session": {
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper"
        },
        "noise_reduction": null
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

<a id="session.input_audio_buffer.append"></a>

## session.input_audio_buffer.append

发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
小端原始音频字节。不受支持的 websocket 音频格式将返回
校验错误，因为质量较低的音频会显著降低翻译
质量。

翻译以 200 ms 引擎帧为粒度进行处理。为获得最佳实时表现，
请按 200 ms 的块追加音频。如果块较短，服务端会将其缓存，
直到凑齐一帧音频后再处理。如果块较长，服务端会将其拆分为
200 ms 的帧，并按顺序依次加入队列。

在会话处于活动状态时持续追加静音。如果客户端停止发送
音频后又重新发送，模型时间会将恢复后的音频视为与
之前的音频连续，而不是一次真实世界中的停顿。

### Schema

Schema name: `RealtimeTranslationClientEventInputAudioBufferAppend`

- `audio: string`

  Base64 编码的 24 kHz PCM16 单声道音频字节。

- `type: "session.input_audio_buffer.append"`

  事件类型，必须为 `session.input_audio_buffer.append`.

  - `"session.input_audio_buffer.append"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识该事件。

### 示例

```json
{
  "event_id": "event_456",
  "type": "session.input_audio_buffer.append",
  "audio": "Base64EncodedAudioData"
}
```

<a id="session.close"></a>

## session.close

优雅地关闭实时翻译会话。服务器在关闭前会刷新挂起的
输入音频，并发出所有剩余的翻译输出，然后关闭
会话。

### Schema

Schema name: `RealtimeTranslationClientEventSessionClose`

- `type: "session.close"`

  事件类型，必须为 `session.close`.

  - `"session.close"`

- `event_id: optional string`

  可选的客户端生成的 ID，用于标识该事件。

### 示例

```json
{
  "event_id": "event_789",
  "type": "session.close"
}
```
