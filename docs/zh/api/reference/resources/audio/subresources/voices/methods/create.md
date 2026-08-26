> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建语音

**post** `/audio/voices`

创建自定义语音。

### 返回

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

#### 响应

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
