> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 获取文档页面的 Markdown 版本。

## 创建语音

**post** `/audio/speech`

根据输入文本生成音频。

返回音频文件内容，或音频事件流。

### 请求体参数

- `input: string`

  用于生成音频的文本。最大长度为 4096 个字符。

- `model: string or SpeechModel`

  可用的 [TTS 模型](/api/docs/guides/text-to-speech): `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`，之一，或 `gpt-4o-mini-tts-2025-12-15`.

  - `string`

  - `SpeechModel = "tts-1" or "tts-1-hd" or "gpt-4o-mini-tts" or "gpt-4o-mini-tts-2025-12-15"`

    - `"tts-1"`

    - `"tts-1-hd"`

    - `"gpt-4o-mini-tts"`

    - `"gpt-4o-mini-tts-2025-12-15"`

- `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  生成音频时使用的声音。支持的内置声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`，以及 `cedar`。你也可以提供一个带有 `id`，的自定义 voice 对象，例如 `{ "id": "voice_1234" }`。声音试听可在 [文本转语音指南](/api/docs/guides/text-to-speech#voice-options).

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

    自定义声音参考。

    - `id: string`

      自定义声音 ID，例如 `voice_1234`.

- `instructions: optional string`

  通过附加指令控制生成音频的声音。不适用于 `tts-1` 或 `tts-1-hd`.

- `response_format: optional "mp3" or "opus" or "aac" or 3 more`

  输出的音频格式。支持的格式有 `mp3`, `opus`, `aac`, `flac`, `wav`，以及 `pcm`.

  - `"mp3"`

  - `"opus"`

  - `"aac"`

  - `"flac"`

  - `"wav"`

  - `"pcm"`

- `speed: optional number`

  生成音频的速度。从 `0.25` 到 `4.0`. `1.0` 中选取，默认值为 1.0。

- `stream_format: optional "sse" or "audio"`

  流式传输音频的格式。支持的格式有 `sse` 和 `audio`. `sse` 不支持 `tts-1` 或 `tts-1-hd`.

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
