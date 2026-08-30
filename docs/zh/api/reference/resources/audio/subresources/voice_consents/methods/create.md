> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## Create voice consent

**post** `/audio/voice_consents`

上传语音同意录制文件。

### 返回值

- `id: string`

  同意录制标识符。

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
