> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 创建语音同意

**post** `/audio/voice_consents`

上传一段语音同意录音。

### 返回

- `id: string`

  同意录音标识符。

- `created_at: number`

  同意录音创建时的 Unix 时间戳（以秒为单位）。

- `language: string`

  同意短语的 BCP 47 语言标签（例如， `en-US`).

- `name: string`

  上传同意录音时提供的标签。

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

#### 响应

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
