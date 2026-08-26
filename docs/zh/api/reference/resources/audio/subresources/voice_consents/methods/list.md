> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出语音同意记录

**get** `/audio/voice_consents`

返回语音同意录音列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  对返回对象数量的限制。限制范围可以为 1 到 100，默认值为 20。

### 返回

- `data: array of object { id, created_at, language, 2 more }`

  - `id: string`

    同意录音标识符。

  - `created_at: number`

    同意录音创建时的 Unix 时间戳（秒）。

  - `language: string`

    同意短语的 BCP 47 语言标签（例如， `en-US`).

  - `name: string`

    上传同意录音时提供的标签。

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
