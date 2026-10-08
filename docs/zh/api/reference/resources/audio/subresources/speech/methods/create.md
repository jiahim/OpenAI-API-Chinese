> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 创建语音

**post** `/audio/speech`

根据输入文本生成音频。

返回音频文件内容，或音频事件流。

### Body 参数

- `input: string`

  要生成音频的文本。最大长度为 4096 个字符。

- `model: string or SpeechModel`

  可用的 [TTS 模型](/api/docs/guides/text-to-speech): `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`，或 `gpt-4o-mini-tts-2025-12-15`.

  - `string`

  - `SpeechModel = "tts-1" or "tts-1-hd" or "gpt-4o-mini-tts" or "gpt-4o-mini-tts-2025-12-15"`

    - `"tts-1"`

    - `"tts-1-hd"`

    - `"gpt-4o-mini-tts"`

    - `"gpt-4o-mini-tts-2025-12-15"`

- `voice: string or "alloy" or "ash" or "ballad" or 10 more or ID { id }`

  生成音频时使用的音色。支持的内置音色包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`，以及 `cedar`。你也可以提供自定义音色对象，其中包含 `id`，例如 `{ "id": "voice_1234" }`。可在此处预览音色： [文本转语音指南](/api/docs/guides/text-to-speech#voice-options)。自定义音色必须基于音频样本创建。

  - `string`

  - `"alloy" or "ash" or "ballad" or 10 more`

    生成音频时使用的音色。支持的内置音色包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`，以及 `cedar`。你也可以提供自定义音色对象，其中包含 `id`，例如 `{ "id": "voice_1234" }`。可在此处预览音色： [文本转语音指南](/api/docs/guides/text-to-speech#voice-options)。自定义音色必须基于音频样本创建。

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

    - `"fable"`

    - `"onyx"`

    - `"nova"`

  - `ID object { id }`

    自定义音色参考。

    - `id: string`

      自定义音色 ID，例如 `voice_1234`.

- `instructions: optional string`

  使用附加指令控制生成音频的音色。不适用于 `tts-1` 或 `tts-1-hd`.

- `response_format: optional "mp3" or "opus" or "aac" or 3 more`

  音频输出格式。支持的格式包括 `mp3`, `opus`, `aac`, `flac`, `wav`，以及 `pcm`.

  - `"mp3"`

  - `"opus"`

  - `"aac"`

  - `"flac"`

  - `"wav"`

  - `"pcm"`

- `speed: optional number`

  生成音频的速度。选择一个介于 `0.25` 至 `4.0`. `1.0` 之间的值。默认为。

- `stream_format: optional "sse" or "audio"`

  音频流式传输格式。支持的格式包括 `sse` 和 `audio`. `sse` 不支持 `tts-1` 或 `tts-1-hd`.

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
          "voice": "ash"
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
