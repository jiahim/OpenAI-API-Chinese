> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 获取语音同意

**get** `/audio/voice_consents/{consent_id}`

获取一条语音同意录音。

### 路径参数

- `consent_id: string`

### 返回

- `id: string`

  同意录音的标识符。

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
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
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
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
