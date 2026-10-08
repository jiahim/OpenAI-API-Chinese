> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

## 创建语音

**帖子** `/audio/voices`

创建可用于音频输出的自定义语音（例如用于文本转语音和 Realtime API）。这需要一段音频样本和一份之前上传的同意录音。

发送 `name`, `audio_sample`，以及 `consent` 录音 ID，以 multipart form data 格式发送。可选的 `type` 默认为 `audio_sample`.

返回已保存语音的元数据。请参阅 [自定义语音指南](/api/docs/guides/text-to-speech#custom-voices) 了解相关要求和最佳实践。自定义语音仅向符合条件的客户提供。

### Returns

- `Voice object { id, created_at, name, 2 more }`

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

  - `type: "audio_sample"`

    语音的创建方式。

    - `"audio_sample"`

### 示例

```http
curl https://api.openai.com/v1/audio/voices \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'audio_sample=@/path/to/audio_sample' \
    -F consent=consent \
    -F name=x
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "audio.voice",
  "type": "audio_sample"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=My new voice" \
  -F "consent=cons_1234" \
  -F "audio_sample=@audio_sample.wav;type=audio/x-wav"
```
