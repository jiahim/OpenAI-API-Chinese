> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。若需文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 以获取。

## 删除语音同意

**删除** `/audio/voice_consents/{consent_id}`

删除一条语音同意录音。

### 路径参数

- `consent_id: string`

### 返回

- `id: string`

  同意记录的标识符。

- `deleted: boolean`

- `object: "audio.voice_consent"`

  - `"audio.voice_consent"`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "cons_1234",
  "deleted": true,
  "object": "audio.voice_consent"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
