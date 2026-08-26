> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 创建翻译

**post** `/audio/translations`

将音频翻译为英文。

### 返回

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

    翻译文本的片段及其对应的详细信息。

    - `id: number`

      片段的唯一标识符。

    - `avg_logprob: number`

      片段的平均对数概率。如果值低于 -1，则认为对数概率失败。

    - `compression_ratio: number`

      片段的压缩比。如果值大于 2.4，则认为压缩失败。

    - `end: number`

      片段的结束时间（秒）。

    - `no_speech_prob: number`

      片段中无语音的概率。如果值高于 1.0 且 `avg_logprob` 低于 -1，则认为该片段为静音。

    - `seek: number`

      片段的起始偏移量。

    - `start: number`

      片段的开始时间（秒）。

    - `temperature: number`

      用于生成片段的温度参数。

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

#### 响应

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

#### 响应

```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
