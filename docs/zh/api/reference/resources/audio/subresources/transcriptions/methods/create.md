> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## Create transcription

**post** `/audio/transcriptions`

将音频转录为输入语言。

以 `json`, `diarized_json`，或 `verbose_json`
格式返回转录对象，或返回转录事件流。

### Returns

- `Transcription object { text, languages, logprobs, usage }`

  表示根据所提供输入由模型返回的转录响应。

  - `text: string`

    转录得到的文本。

  - `languages: optional array of TranscriptionLanguage`

    在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

    - `code: string`

      在音频中检测到的语言代码。

  - `logprobs: optional array of object { token, bytes, logprob }`

    转录中各 token 的对数概率。仅在使用以下模型时返回： `gpt-4o-transcribe` 和 `gpt-4o-mini-transcribe` 当 `logprobs` 被添加到 `include` 数组时。

    - `token: optional string`

      转录中的 token。

    - `bytes: optional array of number`

      该 token 的字节。

    - `logprob: optional number`

      该 token 的对数概率。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    本次请求的 token 使用统计信息。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于该变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入 token 详情。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长，单位为秒。

      - `type: "duration"`

        usage 对象的类型。对于该变体始终为 `duration` 。

        - `"duration"`

- `TranscriptionDiarized object { duration, segments, task, 2 more }`

  表示模型返回的说话人分离转写响应，包括合并后的转写文本和说话人分段标注。

  - `duration: number`

    输入音频的时长，单位为秒。

  - `segments: array of TranscriptionDiarizedSegment`

    带有时间戳和说话人标签的转写分段。

    - `id: string`

      该分段的唯一标识符。

    - `end: number`

      该分段的结束时间戳，单位为秒。

    - `speaker: string`

      该分段的说话人标签。当提供已知说话人时，标签与 `known_speaker_names[]`。匹配；否则，说话人将按顺序使用大写字母标记为（`A`, `B`, ...).

    - `start: number`

      该分段的起始时间戳，单位为秒。

    - `text: string`

      该分段的转写文本。

    - `type: "transcript.text.segment"`

      分段的类型。始终为 `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `task: "transcribe"`

    所运行任务的类型。始终为 `transcribe`.

    - `"transcribe"`

  - `text: string`

    整个音频输入拼接后的转写文本。

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    本次请求的 token 或时长使用情况统计。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于该变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入 token 详情。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长，单位为秒。

      - `type: "duration"`

        usage 对象的类型。对于该变体始终为 `duration` 。

        - `"duration"`

- `TranscriptionVerbose object { duration, language, text, 3 more }`

  表示模型基于提供的输入返回的详细 JSON 转写响应。

  - `duration: number`

    输入音频的时长。

  - `language: string`

    输入音频的语言。

  - `text: string`

    转录得到的文本。

  - `segments: optional array of TranscriptionSegment`

    转写文本的分段及其对应的详细信息。

    - `id: number`

      该段的唯一标识符。

    - `avg_logprob: number`

      该段的平均 logprob。若该值低于 -1，则视为 logprobs 失败。

    - `compression_ratio: number`

      该段的压缩比。若该值大于 2.4，则视为压缩失败。

    - `end: number`

      该段的结束时间，以秒为单位。

    - `no_speech_prob: number`

      该段中无语音的概率。若该值高于 1.0 并且 `avg_logprob` 低于 -1，则将该段视为静音。

    - `seek: number`

      该段的寻址偏移量。

    - `start: number`

      该段的开始时间，以秒为单位。

    - `temperature: number`

      用于生成该段的温度参数。

    - `text: string`

      该段的文本内容。

    - `tokens: array of number`

      该文本内容的 token ID 数组。

  - `usage: optional object { seconds, type }`

    按音频输入时长计费的模型的使用情况统计。

    - `seconds: number`

      输入音频的时长，单位为秒。

    - `type: "duration"`

      usage 对象的类型。对于该变体始终为 `duration` 。

      - `"duration"`

  - `words: optional array of TranscriptionWord`

    提取出的词语及其对应的时间戳。

    - `end: number`

      该词语的结束时间，以秒为单位。

    - `start: number`

      该词语的开始时间，以秒为单位。

    - `word: string`

      该词语的文本内容。

### 示例

```http
curl https://api.openai.com/v1/audio/transcriptions \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F model=gpt-4o-transcribe
```

#### 响应

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

#### 响应

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

### 说话人区分

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

#### 响应

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

### 对数概率

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "include[]=logprobs" \
  -F model="gpt-4o-transcribe" \
  -F response_format="json"
```

#### 响应

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

### 分段时间戳

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=segment" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

#### 响应

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

### 流式传输

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="gpt-4o-mini-transcribe" \
  -F stream=true
```

#### 响应

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

### 词级时间戳

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=word" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

#### 响应

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
