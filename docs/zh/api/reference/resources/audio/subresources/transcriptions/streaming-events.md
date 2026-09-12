# 转写流式事件

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

<a id="transcript.text.segment"></a>

## transcript.text.segment

当开启了说话人分离的转写返回一个带有说话人信息的已完成片段时发出。仅当你 [创建转写任务](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 时 `stream` 设置为 `true` 且 `response_format` 设置为 `diarized_json`.

### Schema

Schema name: `TranscriptTextSegmentEvent`

- `id: string`

  该片段的唯一标识符。

- `end: number`

  片段的结束时间戳（以秒为单位）。

- `speaker: string`

  该片段的说话人标签。

- `start: number`

  片段的开始时间戳（以秒为单位）。

- `text: string`

  该片段的转写文本。

- `type: "transcript.text.segment"`

  事件的类型，始终为 `transcript.text.segment`.

  - `"transcript.text.segment"`

### 示例

```json
{
  "type": "transcript.text.segment",
  "id": "seg_002",
  "start": 5.2,
  "end": 12.8,
  "text": "Hi, I need help with diarization.",
  "speaker": "A"
}
```

<a id="transcript.text.delta"></a>

## transcript.text.delta

在出现额外的文本增量时发出。这也是转录开始时发出的第一个事件。仅在你 [创建转写任务](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 使用 `Stream` 参数设置为 `true`.

### Schema

Schema name: `TranscriptTextDeltaEvent`

- `delta: string`

  额外转录出的文本增量。

- `type: "transcript.text.delta"`

  事件的类型，始终为 `transcript.text.delta`.

  - `"transcript.text.delta"`

- `logprobs: optional array of object { token, bytes, logprob }`

  该增量的对数概率。仅在你 [创建转录时](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 使用 `include[]` 参数设为 `logprobs`.

  - `token: optional string`

    用于生成该对数概率的 token。

  - `bytes: optional array of number`

    用于生成该对数概率的字节。

  - `logprob: optional number`

    该 token 的对数概率。

- `segment_id: optional string`

  该增量所属的说话人分段标识符。仅在使用 `gpt-4o-transcribe-diarize`.

### 示例

```json
{
  "type": "transcript.text.delta",
  "delta": " wonderful"
}
```

<a id="transcript.text.done"></a>

## transcript.text.done

在转录完成时发出。包含完整的转录文本。仅当你在 [创建转写任务](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 使用 `Stream` 参数设置为 `true`.

### Schema

Schema name: `TranscriptTextDoneEvent`

- `text: string`

  转录得到的文本。

- `type: "transcript.text.done"`

  事件的类型，始终为 `transcript.text.done`.

  - `"transcript.text.done"`

- `languages: optional array of TranscriptionLanguage`

  音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测出任何语言。

  - `code: string`

    在音频中检测到的语言代码。

- `logprobs: optional array of object { token, bytes, logprob }`

  转录中各个 token 的对数概率。仅当你在请求中 [创建转录时](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 使用 `include[]` 参数设为 `logprobs`.

  - `token: optional string`

    用于生成该对数概率的 token。

  - `bytes: optional array of number`

    用于生成该对数概率的字节。

  - `logprob: optional number`

    该 token 的对数概率。

- `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }`

  按 token 用量计费模型的使用统计信息。

  - `input_tokens: number`

    本次请求计费的输入 token 数。

  - `output_tokens: number`

    生成的输出 token 数。

  - `total_tokens: number`

    使用的 token 总数（输入 + 输出）。

  - `type: "tokens"`

    usage 对象的类型。对于此变体始终为 `tokens` 。

    - `"tokens"`

  - `input_token_details: optional object { audio_tokens, text_tokens }`

    本次请求计费的输入 token 的详细信息。

    - `audio_tokens: optional number`

      本次请求计费的音频 token 数。

    - `text_tokens: optional number`

      本次请求计费的文本 token 数。

### 示例

```json
{
  "type": "transcript.text.done",
  "text": "I see skies of blue and clouds of white, the bright blessed days, the dark sacred nights, and I think to myself, what a wonderful world.",
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 10,
      "audio_tokens": 4
    },
    "output_tokens": 31,
    "total_tokens": 45
  }
}
```
