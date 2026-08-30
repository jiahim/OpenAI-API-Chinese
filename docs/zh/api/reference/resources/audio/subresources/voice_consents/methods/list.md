> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 列出语音同意书

**get** `/audio/voice_consents`

返回语音同意录音列表。

### 查询参数

- `after: optional string`

  用于分页查询的游标。 `after` 是一个对象 ID，用于标识你在列表中的位置。例如，如果你发起一次列表请求并收到 100 个对象，最后一个对象是 obj_foo，那么你可以在下一次调用时传入 after=obj_foo 以获取列表的下一页内容。

- `limit: optional number`

  返回对象数量的上限。范围在 1 到 100 之间，默认值为 20。

### 返回值

- `data: array of object { id, created_at, language, 2 more }`

  - `id: string`

    同意录制记录的标识符。

  - `created_at: number`

    创建同意录制记录的 Unix 时间戳（单位为秒）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录制记录时提供的标签。

  - `object: "audio.voice_consent"`

    对象类型，始终为 `audio.voice_consent`.

    - `"audio.voice_consent"`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "cons_1234",
      "created_at": 0,
      "language": "language",
      "name": "name",
      "object": "audio.voice_consent"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voice_consents?limit=20 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
