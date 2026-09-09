# 音频

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## Domain Types

### Audio Model

- `AudioModel = "whisper-1" or "gpt-transcribe" or "gpt-4o-transcribe" or 3 more`

  - `"whisper-1"`

  - `"gpt-transcribe"`

  - `"gpt-4o-transcribe"`

  - `"gpt-4o-mini-transcribe"`

  - `"gpt-4o-mini-transcribe-2025-12-15"`

  - `"gpt-4o-transcribe-diarize"`

### Audio Response Format

- `AudioResponseFormat = "json" or "text" or "srt" or 3 more`

  输出格式，可选以下选项之一： `json`, `text`, `srt`, `verbose_json`, `vtt`，或 `diarized_json`。对于 `gpt-4o-transcribe` 和 `gpt-4o-mini-transcribe`，唯一支持的格式是 `json`。对于 `gpt-4o-transcribe-diarize`，支持的格式包括 `json`, `text`，以及 `diarized_json`，其中 `diarized_json` 是接收说话人标注所必需的。

  - `"json"`

  - `"text"`

  - `"srt"`

  - `"verbose_json"`

  - `"vtt"`

  - `"diarized_json"`

# 语音

## 创建语音

**post** `/audio/speech`

根据输入文本生成音频。

返回音频文件内容，或音频事件流。

### 正文参数

- `input: string`

  要生成音频的文本。最大长度为 4096 个字符。

- `model: string or SpeechModel`

  以下可用模型之一 [TTS 模型](/api/docs/guides/text-to-speech): `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`，或 `gpt-4o-mini-tts-2025-12-15`.

  - `string`

  - `SpeechModel = "tts-1" or "tts-1-hd" or "gpt-4o-mini-tts" or "gpt-4o-mini-tts-2025-12-15"`

    - `"tts-1"`

    - `"tts-1-hd"`

    - `"gpt-4o-mini-tts"`

    - `"gpt-4o-mini-tts-2025-12-15"`

- `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  生成音频时使用的语音。支持的内置语音包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`，以及 `cedar`。你也可以提供一个包含 `id`，的自定义语音对象，例如 `{ "id": "voice_1234" }`。语音预览可在 [文本转语音指南](/api/docs/guides/text-to-speech#voice-options).

  - `string`

  - `"alloy" or "ash" or "ballad" or 7 more`

    - `"alloy"`

    - `"ash"`

    - `"ballad"`

    - `"coral"`

    - `"echo"`

    - `"sage"`

    - `"shimmer"`

    - `"verse"`

    - `"marin"`

    - `"cedar"`

  - `ID object { id }`

    自定义语音参考。

    - `id: string`

      自定义语音 ID，例如 `voice_1234`.

- `instructions: optional string`

  使用附加指令控制生成音频的语音。不适用于 `tts-1` 或 `tts-1-hd`.

- `response_format: optional "mp3" or "opus" or "aac" or 3 more`

  音频的输出格式。支持格式包括 `mp3`, `opus`, `aac`, `flac`, `wav`，以及 `pcm`.

  - `"mp3"`

  - `"opus"`

  - `"aac"`

  - `"flac"`

  - `"wav"`

  - `"pcm"`

- `speed: optional number`

  生成音频的速度。选择范围从 `0.25` 到 `4.0`. `1.0` 为默认值。

- `stream_format: optional "sse" or "audio"`

  流式传输音频的格式。支持格式包括 `sse` 和 `audio`. `sse` 不支持 `tts-1` 或 `tts-1-hd`.

  - `"sse"`

  - `"audio"`

### 示例

```http
curl https://api.openai.com/v1/audio/speech \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "input": "input",
          "model": "tts-1",
          "voice": "alloy"
        }'
```

### 示例

```http
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

### SSE 流格式

```http
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "alloy",
    "stream_format": "sse"
  }'
```

## Domain Types

### 语音模型

- `SpeechModel = "tts-1" or "tts-1-hd" or "gpt-4o-mini-tts" or "gpt-4o-mini-tts-2025-12-15"`

  - `"tts-1"`

  - `"tts-1-hd"`

  - `"gpt-4o-mini-tts"`

  - `"gpt-4o-mini-tts-2025-12-15"`

# 转录

## 创建转录

**post** `/audio/transcriptions`

将音频转写为输入语言。

以 `json`, `diarized_json`，格式返回一个转写对象，或 `verbose_json`
格式返回转写事件流。

### Returns

- `Transcription object { text, languages, logprobs, usage }`

  表示模型根据提供的输入返回的转录响应。

  - `text: string`

    转录后的文本。

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

    - `code: string`

      音频中检测到的语言代码。

  - `logprobs: optional array of object { token, bytes, logprob }`

    转录中词元的对数概率。仅在使用以下模型时返回 `gpt-4o-transcribe` 和 `gpt-4o-mini-transcribe` 如果 `logprobs` 被添加到 `include` 数组。

    - `token: optional string`

      转录中的词元。

    - `bytes: optional array of number`

      词元的字节。

    - `logprob: optional number`

      词元的对数概率。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    本次请求的词元使用统计信息。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按词元使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入词元数。

      - `output_tokens: number`

        生成的输出词元数。

      - `total_tokens: number`

        使用的词元总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入词元的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        usage 对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

- `TranscriptionDiarized object { duration, segments, task, 2 more }`

  表示模型返回的说话人分离转录响应，包括合并后的转录文本和说话人分段标注。

  - `duration: number`

    输入音频的时长（以秒为单位）。

  - `segments: array of TranscriptionDiarizedSegment`

    带有时间戳和说话人标签的转录分段。

    - `id: string`

      该分段的唯一标识符。

    - `end: number`

      分段的结束时间戳（以秒为单位）。

    - `speaker: string`

      此分段的说话人标签。当提供已知说话人时，该标签匹配 `known_speaker_names[]`；否则，说话人将按顺序使用大写字母标记（如（`A`, `B`, ...).

    - `start: number`

      分段的开始时间戳（以秒为单位）。

    - `text: string`

      此分段的转录文本。

    - `type: "transcript.text.segment"`

      分段的类型。始终为 `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `task: "transcribe"`

    所运行任务的类型。始终为 `transcribe`.

    - `"transcribe"`

  - `text: string`

    整个音频输入的拼接转录文本。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    本次请求的 token 或时长使用情况统计。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按词元使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入词元数。

      - `output_tokens: number`

        生成的输出词元数。

      - `total_tokens: number`

        使用的词元总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入词元的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        usage 对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

- `TranscriptionVerbose object { duration, language, text, 3 more }`

  表示模型基于所提供的输入返回的详细 JSON 转录响应。

  - `duration: number`

    输入音频的时长。

  - `language: string`

    输入音频的语言。

  - `text: string`

    转录后的文本。

  - `segments: optional array of TranscriptionSegment`

    转录文本的分段及其对应的详细信息。

    - `id: number`

      片段的唯一标识符。

    - `avg_logprob: number`

      片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

    - `compression_ratio: number`

      片段的压缩率。如果该值大于 2.4，则认为压缩失败。

    - `end: number`

      片段的结束时间（秒）。

    - `no_speech_prob: number`

      片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

    - `seek: number`

      片段的寻址偏移量。

    - `start: number`

      片段的开始时间（秒）。

    - `temperature: number`

      用于生成该片段的温度参数。

    - `text: string`

      片段的文本内容。

    - `tokens: array of number`

      文本内容的 token ID 数组。

  - `usage: optional object { seconds, type }`

    按音频输入时长计费的模型的使用情况统计。

    - `seconds: number`

      输入音频的时长（以秒为单位）。

    - `type: "duration"`

      usage 对象的类型。对于此变体始终为 `duration` 。

      - `"duration"`

  - `words: optional array of TranscriptionWord`

    提取的单词及其对应的时间戳。

    - `end: number`

      单词的结束时间（秒）。

    - `start: number`

      单词的开始时间（秒）。

    - `word: string`

      单词的文本内容。

### 示例

```http
curl https://api.openai.com/v1/audio/transcriptions \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F model=gpt-4o-transcribe
```

#### Response

```json
{
  "text": "text",
  "languages": [
    {
      "code": "code"
    }
  ],
  "logprobs": [
    {
      "token": "token",
      "bytes": [
        0
      ],
      "logprob": 0
    }
  ],
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0,
    "type": "tokens",
    "input_token_details": {
      "audio_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="gpt-4o-transcribe"
```

#### Response

```json
{
  "text": "Imagine the wildest idea that you've ever had, and you're curious about how it might scale to something that's a 100, a 1,000 times bigger. This is a place where you can get to do that.",
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 0,
      "audio_tokens": 14
    },
    "output_tokens": 45,
    "total_tokens": 59
  }
}
```

### Diarization

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/meeting.wav" \
  -F model="gpt-4o-transcribe-diarize" \
  -F response_format="diarized_json" \
  -F chunking_strategy=auto \
  -F 'known_speaker_names[]=agent' \
  -F 'known_speaker_references[]=data:audio/wav;base64,AAA...'
```

#### Response

```json
{
  "task": "transcribe",
  "duration": 27.4,
  "text": "Agent: Thanks for calling OpenAI support.\nA: Hi, I'm trying to enable diarization.\nAgent: Happy to walk you through the steps.",
  "segments": [
    {
      "type": "transcript.text.segment",
      "id": "seg_001",
      "start": 0.0,
      "end": 4.7,
      "text": "Thanks for calling OpenAI support.",
      "speaker": "agent"
    },
    {
      "type": "transcript.text.segment",
      "id": "seg_002",
      "start": 4.7,
      "end": 11.8,
      "text": "Hi, I'm trying to enable diarization.",
      "speaker": "A"
    },
    {
      "type": "transcript.text.segment",
      "id": "seg_003",
      "start": 12.1,
      "end": 18.5,
      "text": "Happy to walk you through the steps.",
      "speaker": "agent"
    }
  ],
  "usage": {
    "type": "duration",
    "seconds": 27
  }
}
```

### Logprobs

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "include[]=logprobs" \
  -F model="gpt-4o-transcribe" \
  -F response_format="json"
```

#### Response

```json
{
  "text": "Hey, my knee is hurting and I want to see the doctor tomorrow ideally.",
  "logprobs": [
    { "token": "Hey", "logprob": -1.0415299, "bytes": [72, 101, 121] },
    { "token": ",", "logprob": -9.805982e-5, "bytes": [44] },
    { "token": " my", "logprob": -0.00229799, "bytes": [32, 109, 121] },
    {
      "token": " knee",
      "logprob": -4.7159858e-5,
      "bytes": [32, 107, 110, 101, 101]
    },
    { "token": " is", "logprob": -0.043909557, "bytes": [32, 105, 115] },
    {
      "token": " hurting",
      "logprob": -1.1041146e-5,
      "bytes": [32, 104, 117, 114, 116, 105, 110, 103]
    },
    { "token": " and", "logprob": -0.011076359, "bytes": [32, 97, 110, 100] },
    { "token": " I", "logprob": -5.3193703e-6, "bytes": [32, 73] },
    {
      "token": " want",
      "logprob": -0.0017156356,
      "bytes": [32, 119, 97, 110, 116]
    },
    { "token": " to", "logprob": -7.89631e-7, "bytes": [32, 116, 111] },
    { "token": " see", "logprob": -5.5122365e-7, "bytes": [32, 115, 101, 101] },
    { "token": " the", "logprob": -0.0040786397, "bytes": [32, 116, 104, 101] },
    {
      "token": " doctor",
      "logprob": -2.3392786e-6,
      "bytes": [32, 100, 111, 99, 116, 111, 114]
    },
    {
      "token": " tomorrow",
      "logprob": -7.89631e-7,
      "bytes": [32, 116, 111, 109, 111, 114, 114, 111, 119]
    },
    {
      "token": " ideally",
      "logprob": -0.5800861,
      "bytes": [32, 105, 100, 101, 97, 108, 108, 121]
    },
    { "token": ".", "logprob": -0.00011093382, "bytes": [46] }
  ],
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 0,
      "audio_tokens": 14
    },
    "output_tokens": 45,
    "total_tokens": 59
  }
}
```

### Segment timestamps

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=segment" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

#### Response

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 8.470000267028809,
  "text": "The beach was a popular spot on a hot summer day. People were swimming in the ocean, building sandcastles, and playing beach volleyball.",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 3.319999933242798,
      "text": " The beach was a popular spot on a hot summer day.",
      "tokens": [
        50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530
      ],
      "temperature": 0.0,
      "avg_logprob": -0.2860786020755768,
      "compression_ratio": 1.2363636493682861,
      "no_speech_prob": 0.00985979475080967
    },
    ...
  ],
  "usage": {
    "type": "duration",
    "seconds": 9
  }
}
```

### Streaming

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="gpt-4o-mini-transcribe" \
  -F stream=true
```

#### Response

```json
data: {"type":"transcript.text.delta","delta":"I","logprobs":[{"token":"I","logprob":-0.00007588794,"bytes":[73]}]}

data: {"type":"transcript.text.delta","delta":" see","logprobs":[{"token":" see","logprob":-3.1281633e-7,"bytes":[32,115,101,101]}]}

data: {"type":"transcript.text.delta","delta":" skies","logprobs":[{"token":" skies","logprob":-2.3392786e-6,"bytes":[32,115,107,105,101,115]}]}

data: {"type":"transcript.text.delta","delta":" of","logprobs":[{"token":" of","logprob":-3.1281633e-7,"bytes":[32,111,102]}]}

data: {"type":"transcript.text.delta","delta":" blue","logprobs":[{"token":" blue","logprob":-1.0280384e-6,"bytes":[32,98,108,117,101]}]}

data: {"type":"transcript.text.delta","delta":" and","logprobs":[{"token":" and","logprob":-0.0005108566,"bytes":[32,97,110,100]}]}

data: {"type":"transcript.text.delta","delta":" clouds","logprobs":[{"token":" clouds","logprob":-1.9361265e-7,"bytes":[32,99,108,111,117,100,115]}]}

data: {"type":"transcript.text.delta","delta":" of","logprobs":[{"token":" of","logprob":-1.9361265e-7,"bytes":[32,111,102]}]}

data: {"type":"transcript.text.delta","delta":" white","logprobs":[{"token":" white","logprob":-7.89631e-7,"bytes":[32,119,104,105,116,101]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.0014890312,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" the","logprobs":[{"token":" the","logprob":-0.0110956915,"bytes":[32,116,104,101]}]}

data: {"type":"transcript.text.delta","delta":" bright","logprobs":[{"token":" bright","logprob":0.0,"bytes":[32,98,114,105,103,104,116]}]}

data: {"type":"transcript.text.delta","delta":" blessed","logprobs":[{"token":" blessed","logprob":-0.000045848617,"bytes":[32,98,108,101,115,115,101,100]}]}

data: {"type":"transcript.text.delta","delta":" days","logprobs":[{"token":" days","logprob":-0.000010802739,"bytes":[32,100,97,121,115]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.00001700133,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" the","logprobs":[{"token":" the","logprob":-0.0000118755715,"bytes":[32,116,104,101]}]}

data: {"type":"transcript.text.delta","delta":" dark","logprobs":[{"token":" dark","logprob":-5.5122365e-7,"bytes":[32,100,97,114,107]}]}

data: {"type":"transcript.text.delta","delta":" sacred","logprobs":[{"token":" sacred","logprob":-5.4385737e-6,"bytes":[32,115,97,99,114,101,100]}]}

data: {"type":"transcript.text.delta","delta":" nights","logprobs":[{"token":" nights","logprob":-4.00813e-6,"bytes":[32,110,105,103,104,116,115]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.0036910512,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" and","logprobs":[{"token":" and","logprob":-0.0031903093,"bytes":[32,97,110,100]}]}

data: {"type":"transcript.text.delta","delta":" I","logprobs":[{"token":" I","logprob":-1.504853e-6,"bytes":[32,73]}]}

data: {"type":"transcript.text.delta","delta":" think","logprobs":[{"token":" think","logprob":-4.3202e-7,"bytes":[32,116,104,105,110,107]}]}

data: {"type":"transcript.text.delta","delta":" to","logprobs":[{"token":" to","logprob":-1.9361265e-7,"bytes":[32,116,111]}]}

data: {"type":"transcript.text.delta","delta":" myself","logprobs":[{"token":" myself","logprob":-1.7432603e-6,"bytes":[32,109,121,115,101,108,102]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.29254505,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" what","logprobs":[{"token":" what","logprob":-0.016815351,"bytes":[32,119,104,97,116]}]}

data: {"type":"transcript.text.delta","delta":" a","logprobs":[{"token":" a","logprob":-3.1281633e-7,"bytes":[32,97]}]}

data: {"type":"transcript.text.delta","delta":" wonderful","logprobs":[{"token":" wonderful","logprob":-2.1008714e-6,"bytes":[32,119,111,110,100,101,114,102,117,108]}]}

data: {"type":"transcript.text.delta","delta":" world","logprobs":[{"token":" world","logprob":-8.180258e-6,"bytes":[32,119,111,114,108,100]}]}

data: {"type":"transcript.text.delta","delta":".","logprobs":[{"token":".","logprob":-0.014231676,"bytes":[46]}]}

data: {"type":"transcript.text.done","text":"I see skies of blue and clouds of white, the bright blessed days, the dark sacred nights, and I think to myself, what a wonderful world.","logprobs":[{"token":"I","logprob":-0.00007588794,"bytes":[73]},{"token":" see","logprob":-3.1281633e-7,"bytes":[32,115,101,101]},{"token":" skies","logprob":-2.3392786e-6,"bytes":[32,115,107,105,101,115]},{"token":" of","logprob":-3.1281633e-7,"bytes":[32,111,102]},{"token":" blue","logprob":-1.0280384e-6,"bytes":[32,98,108,117,101]},{"token":" and","logprob":-0.0005108566,"bytes":[32,97,110,100]},{"token":" clouds","logprob":-1.9361265e-7,"bytes":[32,99,108,111,117,100,115]},{"token":" of","logprob":-1.9361265e-7,"bytes":[32,111,102]},{"token":" white","logprob":-7.89631e-7,"bytes":[32,119,104,105,116,101]},{"token":",","logprob":-0.0014890312,"bytes":[44]},{"token":" the","logprob":-0.0110956915,"bytes":[32,116,104,101]},{"token":" bright","logprob":0.0,"bytes":[32,98,114,105,103,104,116]},{"token":" blessed","logprob":-0.000045848617,"bytes":[32,98,108,101,115,115,101,100]},{"token":" days","logprob":-0.000010802739,"bytes":[32,100,97,121,115]},{"token":",","logprob":-0.00001700133,"bytes":[44]},{"token":" the","logprob":-0.0000118755715,"bytes":[32,116,104,101]},{"token":" dark","logprob":-5.5122365e-7,"bytes":[32,100,97,114,107]},{"token":" sacred","logprob":-5.4385737e-6,"bytes":[32,115,97,99,114,101,100]},{"token":" nights","logprob":-4.00813e-6,"bytes":[32,110,105,103,104,116,115]},{"token":",","logprob":-0.0036910512,"bytes":[44]},{"token":" and","logprob":-0.0031903093,"bytes":[32,97,110,100]},{"token":" I","logprob":-1.504853e-6,"bytes":[32,73]},{"token":" think","logprob":-4.3202e-7,"bytes":[32,116,104,105,110,107]},{"token":" to","logprob":-1.9361265e-7,"bytes":[32,116,111]},{"token":" myself","logprob":-1.7432603e-6,"bytes":[32,109,121,115,101,108,102]},{"token":",","logprob":-0.29254505,"bytes":[44]},{"token":" what","logprob":-0.016815351,"bytes":[32,119,104,97,116]},{"token":" a","logprob":-3.1281633e-7,"bytes":[32,97]},{"token":" wonderful","logprob":-2.1008714e-6,"bytes":[32,119,111,110,100,101,114,102,117,108]},{"token":" world","logprob":-8.180258e-6,"bytes":[32,119,111,114,108,100]},{"token":".","logprob":-0.014231676,"bytes":[46]}],"usage":{"input_tokens":14,"input_token_details":{"text_tokens":0,"audio_tokens":14},"output_tokens":45,"total_tokens":59}}
```

### Word timestamps

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=word" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

#### Response

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 8.470000267028809,
  "text": "The beach was a popular spot on a hot summer day. People were swimming in the ocean, building sandcastles, and playing beach volleyball.",
  "words": [
    {
      "word": "The",
      "start": 0.0,
      "end": 0.23999999463558197
    },
    ...
    {
      "word": "volleyball",
      "start": 7.400000095367432,
      "end": 7.900000095367432
    }
  ],
  "usage": {
    "type": "duration",
    "seconds": 9
  }
}
```

## Domain Types

### Transcription

- `Transcription object { text, languages, logprobs, usage }`

  表示模型根据提供的输入返回的转录响应。

  - `text: string`

    转录后的文本。

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

    - `code: string`

      音频中检测到的语言代码。

  - `logprobs: optional array of object { token, bytes, logprob }`

    转录中词元的对数概率。仅在使用以下模型时返回 `gpt-4o-transcribe` 和 `gpt-4o-mini-transcribe` 如果 `logprobs` 被添加到 `include` 数组。

    - `token: optional string`

      转录中的词元。

    - `bytes: optional array of number`

      词元的字节。

    - `logprob: optional number`

      词元的对数概率。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    本次请求的词元使用统计信息。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按词元使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入词元数。

      - `output_tokens: number`

        生成的输出词元数。

      - `total_tokens: number`

        使用的词元总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入词元的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        usage 对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

### Transcription Create Response

- `TranscriptionCreateResponse = Transcription or TranscriptionDiarized or TranscriptionVerbose`

  表示模型根据提供的输入返回的转录响应。

  - `Transcription object { text, languages, logprobs, usage }`

    表示模型根据提供的输入返回的转录响应。

    - `text: string`

      转录后的文本。

    - `languages: optional array of TranscriptionLanguage`

      音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

      - `code: string`

        音频中检测到的语言代码。

    - `logprobs: optional array of object { token, bytes, logprob }`

      转录中词元的对数概率。仅在使用以下模型时返回 `gpt-4o-transcribe` 和 `gpt-4o-mini-transcribe` 如果 `logprobs` 被添加到 `include` 数组。

      - `token: optional string`

        转录中的词元。

      - `bytes: optional array of number`

        词元的字节。

      - `logprob: optional number`

        词元的对数概率。

    - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      本次请求的词元使用统计信息。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按词元使用量计费的模型的使用统计信息。

        - `input_tokens: number`

          本次请求计费的输入词元数。

        - `output_tokens: number`

          生成的输出词元数。

        - `total_tokens: number`

          使用的词元总数（输入 + 输出）。

        - `type: "tokens"`

          usage 对象的类型。对于此变体始终为 `tokens` 。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          本次请求计费的输入词元的详细信息。

          - `audio_tokens: optional number`

            本次请求计费的音频 token 数量。

          - `text_tokens: optional number`

            本次请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的使用情况统计。

        - `seconds: number`

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          usage 对象的类型。对于此变体始终为 `duration` 。

          - `"duration"`

  - `TranscriptionDiarized object { duration, segments, task, 2 more }`

    表示模型返回的说话人分离转录响应，包括合并后的转录文本和说话人分段标注。

    - `duration: number`

      输入音频的时长（以秒为单位）。

    - `segments: array of TranscriptionDiarizedSegment`

      带有时间戳和说话人标签的转录分段。

      - `id: string`

        该分段的唯一标识符。

      - `end: number`

        分段的结束时间戳（以秒为单位）。

      - `speaker: string`

        此分段的说话人标签。当提供已知说话人时，该标签匹配 `known_speaker_names[]`；否则，说话人将按顺序使用大写字母标记（如（`A`, `B`, ...).

      - `start: number`

        分段的开始时间戳（以秒为单位）。

      - `text: string`

        此分段的转录文本。

      - `type: "transcript.text.segment"`

        分段的类型。始终为 `transcript.text.segment`.

        - `"transcript.text.segment"`

    - `task: "transcribe"`

      所运行任务的类型。始终为 `transcribe`.

      - `"transcribe"`

    - `text: string`

      整个音频输入的拼接转录文本。

    - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      本次请求的 token 或时长使用情况统计。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按词元使用量计费的模型的使用统计信息。

        - `input_tokens: number`

          本次请求计费的输入词元数。

        - `output_tokens: number`

          生成的输出词元数。

        - `total_tokens: number`

          使用的词元总数（输入 + 输出）。

        - `type: "tokens"`

          usage 对象的类型。对于此变体始终为 `tokens` 。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          本次请求计费的输入词元的详细信息。

          - `audio_tokens: optional number`

            本次请求计费的音频 token 数量。

          - `text_tokens: optional number`

            本次请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的使用情况统计。

        - `seconds: number`

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          usage 对象的类型。对于此变体始终为 `duration` 。

          - `"duration"`

  - `TranscriptionVerbose object { duration, language, text, 3 more }`

    表示模型基于所提供的输入返回的详细 JSON 转录响应。

    - `duration: number`

      输入音频的时长。

    - `language: string`

      输入音频的语言。

    - `text: string`

      转录后的文本。

    - `segments: optional array of TranscriptionSegment`

      转录文本的分段及其对应的详细信息。

      - `id: number`

        片段的唯一标识符。

      - `avg_logprob: number`

        片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

      - `compression_ratio: number`

        片段的压缩率。如果该值大于 2.4，则认为压缩失败。

      - `end: number`

        片段的结束时间（秒）。

      - `no_speech_prob: number`

        片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

      - `seek: number`

        片段的寻址偏移量。

      - `start: number`

        片段的开始时间（秒）。

      - `temperature: number`

        用于生成该片段的温度参数。

      - `text: string`

        片段的文本内容。

      - `tokens: array of number`

        文本内容的 token ID 数组。

    - `usage: optional object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        usage 对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

    - `words: optional array of TranscriptionWord`

      提取的单词及其对应的时间戳。

      - `end: number`

        单词的结束时间（秒）。

      - `start: number`

        单词的开始时间（秒）。

      - `word: string`

        单词的文本内容。

### Transcription Diarized

- `TranscriptionDiarized object { duration, segments, task, 2 more }`

  表示模型返回的说话人分离转录响应，包括合并后的转录文本和说话人分段标注。

  - `duration: number`

    输入音频的时长（以秒为单位）。

  - `segments: array of TranscriptionDiarizedSegment`

    带有时间戳和说话人标签的转录分段。

    - `id: string`

      该分段的唯一标识符。

    - `end: number`

      分段的结束时间戳（以秒为单位）。

    - `speaker: string`

      此分段的说话人标签。当提供已知说话人时，该标签匹配 `known_speaker_names[]`；否则，说话人将按顺序使用大写字母标记（如（`A`, `B`, ...).

    - `start: number`

      分段的开始时间戳（以秒为单位）。

    - `text: string`

      此分段的转录文本。

    - `type: "transcript.text.segment"`

      分段的类型。始终为 `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `task: "transcribe"`

    所运行任务的类型。始终为 `transcribe`.

    - `"transcribe"`

  - `text: string`

    整个音频输入的拼接转录文本。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    本次请求的 token 或时长使用情况统计。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按词元使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入词元数。

      - `output_tokens: number`

        生成的输出词元数。

      - `total_tokens: number`

        使用的词元总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入词元的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        usage 对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

### Transcription Diarized Segment

- `TranscriptionDiarizedSegment object { id, end, speaker, 3 more }`

  一段带有说话人元数据的说话人分离转录文本。

  - `id: string`

    该分段的唯一标识符。

  - `end: number`

    分段的结束时间戳（以秒为单位）。

  - `speaker: string`

    此分段的说话人标签。当提供已知说话人时，该标签匹配 `known_speaker_names[]`；否则，说话人将按顺序使用大写字母标记（如（`A`, `B`, ...).

  - `start: number`

    分段的开始时间戳（以秒为单位）。

  - `text: string`

    此分段的转录文本。

  - `type: "transcript.text.segment"`

    分段的类型。始终为 `transcript.text.segment`.

    - `"transcript.text.segment"`

### Transcription Include

- `TranscriptionInclude = "logprobs"`

  - `"logprobs"`

### Transcription Language

- `TranscriptionLanguage object { code }`

  在转录音频中检测到的语言。

  - `code: string`

    音频中检测到的语言代码。

### 转写片段

- `TranscriptionSegment object { id, avg_logprob, compression_ratio, 7 more }`

  - `id: number`

    片段的唯一标识符。

  - `avg_logprob: number`

    片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

  - `compression_ratio: number`

    片段的压缩率。如果该值大于 2.4，则认为压缩失败。

  - `end: number`

    片段的结束时间（秒）。

  - `no_speech_prob: number`

    片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

  - `seek: number`

    片段的寻址偏移量。

  - `start: number`

    片段的开始时间（秒）。

  - `temperature: number`

    用于生成该片段的温度参数。

  - `text: string`

    片段的文本内容。

  - `tokens: array of number`

    文本内容的 token ID 数组。

### 转写流事件

- `TranscriptionStreamEvent = TranscriptionTextSegmentEvent or TranscriptionTextDeltaEvent or TranscriptionTextDoneEvent`

  当说话人分离转写返回带有说话人信息的已完成片段时发出。仅当你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 时 `stream` 设置为 `true` 和 `response_format` 设置为 `diarized_json`.

  - `TranscriptionTextSegmentEvent object { id, end, speaker, 3 more }`

    当说话人分离转写返回带有说话人信息的已完成片段时发出。仅当你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 时 `stream` 设置为 `true` 和 `response_format` 设置为 `diarized_json`.

    - `id: string`

      该分段的唯一标识符。

    - `end: number`

      分段的结束时间戳（以秒为单位）。

    - `speaker: string`

      该片段的说话人标签。

    - `start: number`

      分段的开始时间戳（以秒为单位）。

    - `text: string`

      此分段的转录文本。

    - `type: "transcript.text.segment"`

      事件的类型。始终为 `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `TranscriptionTextDeltaEvent object { delta, type, logprobs, segment_id }`

    当存在额外的文本增量时发出。这也是转写开始时发出的第一个事件。仅当你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `Stream` 参数设置为 `true`.

    - `delta: string`

      额外转写的文本增量。

    - `type: "transcript.text.delta"`

      事件的类型。始终为 `transcript.text.delta`.

      - `"transcript.text.delta"`

    - `logprobs: optional array of object { token, bytes, logprob }`

      该增量的对数概率。仅在你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `include[]` 参数设置为 `logprobs`.

      - `token: optional string`

        用于生成对数概率的 token。

      - `bytes: optional array of number`

        用于生成对数概率的字节。

      - `logprob: optional number`

        词元的对数概率。

    - `segment_id: optional string`

      此增量所属的说话人分离片段的标识符。仅在使用 `gpt-4o-transcribe-diarize`.

  - `TranscriptionTextDoneEvent object { text, type, languages, 2 more }`

    当转写完成时发出。包含完整的转写文本。仅在你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `Stream` 参数设置为 `true`.

    - `text: string`

      已转写的文本。

    - `type: "transcript.text.done"`

      事件的类型。始终为 `transcript.text.done`.

      - `"transcript.text.done"`

    - `languages: optional array of TranscriptionLanguage`

      音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

      - `code: string`

        音频中检测到的语言代码。

    - `logprobs: optional array of object { token, bytes, logprob }`

      转写中各个 token 的对数概率。仅在你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `include[]` 参数设置为 `logprobs`.

      - `token: optional string`

        用于生成对数概率的 token。

      - `bytes: optional array of number`

        用于生成对数概率的字节。

      - `logprob: optional number`

        词元的对数概率。

    - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }`

      按词元使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入词元数。

      - `output_tokens: number`

        生成的输出词元数。

      - `total_tokens: number`

        使用的词元总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入词元的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

### 转录文本增量事件

- `TranscriptionTextDeltaEvent object { delta, type, logprobs, segment_id }`

  当存在额外的文本增量时发出。这也是转写开始时发出的第一个事件。仅当你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `Stream` 参数设置为 `true`.

  - `delta: string`

    额外转写的文本增量。

  - `type: "transcript.text.delta"`

    事件的类型。始终为 `transcript.text.delta`.

    - `"transcript.text.delta"`

  - `logprobs: optional array of object { token, bytes, logprob }`

    该增量的对数概率。仅在你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `include[]` 参数设置为 `logprobs`.

    - `token: optional string`

      用于生成对数概率的 token。

    - `bytes: optional array of number`

      用于生成对数概率的字节。

    - `logprob: optional number`

      词元的对数概率。

  - `segment_id: optional string`

    此增量所属的说话人分离片段的标识符。仅在使用 `gpt-4o-transcribe-diarize`.

### 转录文本完成事件

- `TranscriptionTextDoneEvent object { text, type, languages, 2 more }`

  当转写完成时发出。包含完整的转写文本。仅在你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `Stream` 参数设置为 `true`.

  - `text: string`

    已转写的文本。

  - `type: "transcript.text.done"`

    事件的类型。始终为 `transcript.text.done`.

    - `"transcript.text.done"`

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

    - `code: string`

      音频中检测到的语言代码。

  - `logprobs: optional array of object { token, bytes, logprob }`

    转写中各个 token 的对数概率。仅在你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 且 `include[]` 参数设置为 `logprobs`.

    - `token: optional string`

      用于生成对数概率的 token。

    - `bytes: optional array of number`

      用于生成对数概率的字节。

    - `logprob: optional number`

      词元的对数概率。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }`

    按词元使用量计费的模型的使用统计信息。

    - `input_tokens: number`

      本次请求计费的输入词元数。

    - `output_tokens: number`

      生成的输出词元数。

    - `total_tokens: number`

      使用的词元总数（输入 + 输出）。

    - `type: "tokens"`

      usage 对象的类型。对于此变体始终为 `tokens` 。

      - `"tokens"`

    - `input_token_details: optional object { audio_tokens, text_tokens }`

      本次请求计费的输入词元的详细信息。

      - `audio_tokens: optional number`

        本次请求计费的音频 token 数量。

      - `text_tokens: optional number`

        本次请求计费的文本 token 数量。

### 转录文本片段事件

- `TranscriptionTextSegmentEvent object { id, end, speaker, 3 more }`

  当说话人分离转写返回带有说话人信息的已完成片段时发出。仅当你 [创建转写](/api/reference/resources/audio/subresources/transcriptions/methods/create) 时 `stream` 设置为 `true` 和 `response_format` 设置为 `diarized_json`.

  - `id: string`

    该分段的唯一标识符。

  - `end: number`

    分段的结束时间戳（以秒为单位）。

  - `speaker: string`

    该片段的说话人标签。

  - `start: number`

    分段的开始时间戳（以秒为单位）。

  - `text: string`

    此分段的转录文本。

  - `type: "transcript.text.segment"`

    事件的类型。始终为 `transcript.text.segment`.

    - `"transcript.text.segment"`

### 详细转录

- `TranscriptionVerbose object { duration, language, text, 3 more }`

  表示模型基于所提供的输入返回的详细 JSON 转录响应。

  - `duration: number`

    输入音频的时长。

  - `language: string`

    输入音频的语言。

  - `text: string`

    转录后的文本。

  - `segments: optional array of TranscriptionSegment`

    转录文本的分段及其对应的详细信息。

    - `id: number`

      片段的唯一标识符。

    - `avg_logprob: number`

      片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

    - `compression_ratio: number`

      片段的压缩率。如果该值大于 2.4，则认为压缩失败。

    - `end: number`

      片段的结束时间（秒）。

    - `no_speech_prob: number`

      片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

    - `seek: number`

      片段的寻址偏移量。

    - `start: number`

      片段的开始时间（秒）。

    - `temperature: number`

      用于生成该片段的温度参数。

    - `text: string`

      片段的文本内容。

    - `tokens: array of number`

      文本内容的 token ID 数组。

  - `usage: optional object { seconds, type }`

    按音频输入时长计费的模型的使用情况统计。

    - `seconds: number`

      输入音频的时长（以秒为单位）。

    - `type: "duration"`

      usage 对象的类型。对于此变体始终为 `duration` 。

      - `"duration"`

  - `words: optional array of TranscriptionWord`

    提取的单词及其对应的时间戳。

    - `end: number`

      单词的结束时间（秒）。

    - `start: number`

      单词的开始时间（秒）。

    - `word: string`

      单词的文本内容。

### 转录词

- `TranscriptionWord object { end, start, word }`

  - `end: number`

    单词的结束时间（秒）。

  - `start: number`

    单词的开始时间（秒）。

  - `word: string`

    单词的文本内容。

# 翻译

## 创建翻译

**post** `/audio/translations`

将音频转录为英文。

### Returns

- `Translation object { text }`

  - `text: string`

- `TranslationVerbose object { duration, language, text, segments }`

  - `duration: number`

    输入音频的时长。

  - `language: string`

    输出翻译的语言（始终 `english`).

  - `text: string`

    翻译后的文本。

  - `segments: optional array of TranscriptionSegment`

    翻译文本的各个片段及其对应详情。

    - `id: number`

      片段的唯一标识符。

    - `avg_logprob: number`

      片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

    - `compression_ratio: number`

      片段的压缩率。如果该值大于 2.4，则认为压缩失败。

    - `end: number`

      片段的结束时间（秒）。

    - `no_speech_prob: number`

      片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

    - `seek: number`

      片段的寻址偏移量。

    - `start: number`

      片段的开始时间（秒）。

    - `temperature: number`

      用于生成该片段的温度参数。

    - `text: string`

      片段的文本内容。

    - `tokens: array of number`

      文本内容的 token ID 数组。

### 示例

```http
curl https://api.openai.com/v1/audio/translations \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F model=whisper-1
```

#### Response

```json
{
  "text": "text"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

#### Response

```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```

## Domain Types

### Translation

- `Translation object { text }`

  - `text: string`

### Translation 创建响应

- `TranslationCreateResponse = Translation or TranslationVerbose`

  - `Translation object { text }`

    - `text: string`

  - `TranslationVerbose object { duration, language, text, segments }`

    - `duration: number`

      输入音频的时长。

    - `language: string`

      输出翻译的语言（始终 `english`).

    - `text: string`

      翻译后的文本。

    - `segments: optional array of TranscriptionSegment`

      翻译文本的各个片段及其对应详情。

      - `id: number`

        片段的唯一标识符。

      - `avg_logprob: number`

        片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

      - `compression_ratio: number`

        片段的压缩率。如果该值大于 2.4，则认为压缩失败。

      - `end: number`

        片段的结束时间（秒）。

      - `no_speech_prob: number`

        片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

      - `seek: number`

        片段的寻址偏移量。

      - `start: number`

        片段的开始时间（秒）。

      - `temperature: number`

        用于生成该片段的温度参数。

      - `text: string`

        片段的文本内容。

      - `tokens: array of number`

        文本内容的 token ID 数组。

### Translation 详细

- `TranslationVerbose object { duration, language, text, segments }`

  - `duration: number`

    输入音频的时长。

  - `language: string`

    输出翻译的语言（始终 `english`).

  - `text: string`

    翻译后的文本。

  - `segments: optional array of TranscriptionSegment`

    翻译文本的各个片段及其对应详情。

    - `id: number`

      片段的唯一标识符。

    - `avg_logprob: number`

      片段的平均 logprob。如果该值低于 -1，则认为 logprobs 失败。

    - `compression_ratio: number`

      片段的压缩率。如果该值大于 2.4，则认为压缩失败。

    - `end: number`

      片段的结束时间（秒）。

    - `no_speech_prob: number`

      片段中无语音的概率。如果该值高于 1.0 且 `avg_logprob` 低于 -1，则认为此片段为静音。

    - `seek: number`

      片段的寻址偏移量。

    - `start: number`

      片段的开始时间（秒）。

    - `temperature: number`

      用于生成该片段的温度参数。

    - `text: string`

      片段的文本内容。

    - `tokens: array of number`

      文本内容的 token ID 数组。

# 语音同意

## 创建语音同意

**post** `/audio/voice_consents`

上传语音同意录音。

### Returns

- `id: string`

  同意录制记录的标识符。

- `created_at: number`

  同意录制创建时的 Unix 时间戳（以秒为单位）。

- `language: string`

  同意短语的 BCP 47 语言标签（例如， `en-US`).

- `name: string`

  上传同意录制时提供的标签。

- `object: "audio.voice_consent"`

  对象类型，始终为 `audio.voice_consent`.

  - `"audio.voice_consent"`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F language=language \
    -F name=name \
    -F 'recording=@/path/to/recording'
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=John Doe" \
  -F "language=en-US" \
  -F "recording=@$HOME/consent_recording.wav;type=audio/x-wav"
```

## 删除语音同意

**delete** `/audio/voice_consents/{consent_id}`

删除语音同意录音。

### 路径参数

- `consent_id: string`

### Returns

- `id: string`

  同意录制记录的标识符。

- `deleted: boolean`

- `object: "audio.voice_consent"`

  - `"audio.voice_consent"`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cons_1234",
  "deleted": true,
  "object": "audio.voice_consent"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 列出语音同意记录

**get** `/audio/voice_consents`

返回语音同意录音列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，则你后续的调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  返回对象数量的上限。Limit 范围在 1 到 100 之间，默认值为 20。

### Returns

- `data: array of object { id, created_at, language, 2 more }`

  - `id: string`

    同意录制记录的标识符。

  - `created_at: number`

    同意录制创建时的 Unix 时间戳（以秒为单位）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录制时提供的标签。

  - `object: "audio.voice_consent"`

    对象类型，始终为 `audio.voice_consent`.

    - `"audio.voice_consent"`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "cons_1234",
      "created_at": 0,
      "language": "language",
      "name": "name",
      "object": "audio.voice_consent"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents?limit=20 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 获取语音同意

**get** `/audio/voice_consents/{consent_id}`

检索一段语音同意录音。

### 路径参数

- `consent_id: string`

### Returns

- `id: string`

  同意录制记录的标识符。

- `created_at: number`

  同意录制创建时的 Unix 时间戳（以秒为单位）。

- `language: string`

  同意短语的 BCP 47 语言标签（例如， `en-US`).

- `name: string`

  上传同意录制时提供的标签。

- `object: "audio.voice_consent"`

  对象类型，始终为 `audio.voice_consent`.

  - `"audio.voice_consent"`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 更新语音同意

**post** `/audio/voice_consents/{consent_id}`

更新语音同意录音（仅元数据）。

### 路径参数

- `consent_id: string`

### 正文参数

- `name: string`

  此同意记录的更新标签。

### Returns

- `id: string`

  同意录制记录的标识符。

- `created_at: number`

  同意录制创建时的 Unix 时间戳（以秒为单位）。

- `language: string`

  同意短语的 BCP 47 语言标签（例如， `en-US`).

- `name: string`

  上传同意录制时提供的标签。

- `object: "audio.voice_consent"`

  对象类型，始终为 `audio.voice_consent`.

  - `"audio.voice_consent"`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "name"
        }'
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

## Domain Types

### 语音同意创建响应

- `VoiceConsentCreateResponse object { id, created_at, language, 2 more }`

  用于授权创建自定义语音的同意记录。

  - `id: string`

    同意录制记录的标识符。

  - `created_at: number`

    同意录制创建时的 Unix 时间戳（以秒为单位）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录制时提供的标签。

  - `object: "audio.voice_consent"`

    对象类型，始终为 `audio.voice_consent`.

    - `"audio.voice_consent"`

### Voice Consent Delete Response

- `VoiceConsentDeleteResponse object { id, deleted, object }`

  - `id: string`

    同意录制记录的标识符。

  - `deleted: boolean`

  - `object: "audio.voice_consent"`

    - `"audio.voice_consent"`

### Voice Consent List Response

- `VoiceConsentListResponse object { id, created_at, language, 2 more }`

  用于授权创建自定义语音的同意记录。

  - `id: string`

    同意录制记录的标识符。

  - `created_at: number`

    同意录制创建时的 Unix 时间戳（以秒为单位）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录制时提供的标签。

  - `object: "audio.voice_consent"`

    对象类型，始终为 `audio.voice_consent`.

    - `"audio.voice_consent"`

### Voice Consent Retrieve Response

- `VoiceConsentRetrieveResponse object { id, created_at, language, 2 more }`

  用于授权创建自定义语音的同意记录。

  - `id: string`

    同意录制记录的标识符。

  - `created_at: number`

    同意录制创建时的 Unix 时间戳（以秒为单位）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录制时提供的标签。

  - `object: "audio.voice_consent"`

    对象类型，始终为 `audio.voice_consent`.

    - `"audio.voice_consent"`

### Voice Consent Update Response

- `VoiceConsentUpdateResponse object { id, created_at, language, 2 more }`

  用于授权创建自定义语音的同意记录。

  - `id: string`

    同意录制记录的标识符。

  - `created_at: number`

    同意录制创建时的 Unix 时间戳（以秒为单位）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录制时提供的标签。

  - `object: "audio.voice_consent"`

    对象类型，始终为 `audio.voice_consent`.

    - `"audio.voice_consent"`

# Voices

## Create voice

**post** `/audio/voices`

创建自定义语音。

### Returns

- `id: string`

  语音标识符，可在 API 端点中引用。

- `created_at: number`

  语音创建时的 Unix 时间戳（以秒为单位）。

- `name: string`

  语音的名称。

- `object: "audio.voice"`

  对象类型，始终为 `audio.voice`.

  - `"audio.voice"`

### 示例

```http
curl https://api.openai.com/v1/audio/voices \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'audio_sample=@/path/to/audio_sample' \
    -F consent=consent \
    -F name=name
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "audio.voice"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=My new voice" \
  -F "consent=cons_1234" \
  -F "audio_sample=@$HOME/audio_sample.wav;type=audio/x-wav"
```

## Domain Types

### 语音创建响应

- `VoiceCreateResponse object { id, created_at, name, object }`

  可用于音频输出的自定义语音。

  - `id: string`

    语音标识符，可在 API 端点中引用。

  - `created_at: number`

    语音创建时的 Unix 时间戳（以秒为单位）。

  - `name: string`

    语音的名称。

  - `object: "audio.voice"`

    对象类型，始终为 `audio.voice`.

    - `"audio.voice"`
