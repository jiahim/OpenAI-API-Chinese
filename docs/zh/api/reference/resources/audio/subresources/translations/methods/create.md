> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 创建翻译

**post** `/audio/translations`

将音频翻译为英语。

### 返回

- `Translation object { text }`

  - `text: string`

- `TranslationVerbose object { duration, language, text, segments }`

  - `duration: number`

    输入音频的持续时长。

  - `language: string`

    输出翻译所使用的语言（始终为 `english`).

  - `text: string`

    翻译后的文本。

  - `segments: optional array of TranscriptionSegment`

    翻译文本的片段及其对应的详细信息。

    - `id: number`

      该片段的唯一标识符。

    - `avg_logprob: number`

      该片段的平均 logprob。若该值低于 -1，则视为 logprobs 失败。

    - `compression_ratio: number`

      该片段的压缩率。若该值大于 2.4，则视为压缩失败。

    - `end: number`

      该片段的结束时间（单位为秒）。

    - `no_speech_prob: number`

      该片段中无语音的概率。若该值高于 1.0，且 `avg_logprob` 低于 -1，则视为该片段为静音。

    - `seek: number`

      该片段的 seek 偏移量。

    - `start: number`

      该片段的开始时间（单位为秒）。

    - `temperature: number`

      用于生成该片段的 temperature 参数。

    - `text: string`

      该片段的文本内容。

    - `tokens: array of number`

      该文本内容对应的 token ID 数组。

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
