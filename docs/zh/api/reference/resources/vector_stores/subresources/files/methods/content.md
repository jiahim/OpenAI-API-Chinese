> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 检索向量存储文件内容

**get** `/vector_stores/{vector_store_id}/files/{file_id}/content`

检索向量存储文件的解析内容。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

- `data: array of object { text, type }`

  文件的解析内容。

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅 `"text"`)

- `has_more: boolean`

  指示是否还有更多内容页需要获取。

- `next_page: string or null`

  下一页的令牌（如有）。

- `object: "vector_store.file_content.page"`

  对象类型，始终为 `vector_store.file_content.page`

  - `"vector_store.file_content.page"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID/content \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "text": "text",
      "type": "type"
    }
  ],
  "has_more": true,
  "next_page": "next_page",
  "object": "vector_store.file_content.page"
}
```

### 示例

```http
curl \
https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123/content \
-H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "file_id": "file-abc123",
  "filename": "example.txt",
  "attributes": {"key": "value"},
  "content": [
    {"type": "text", "text": "..."},
    ...
  ]
}
```
