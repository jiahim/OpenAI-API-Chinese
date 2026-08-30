> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 删除文件

**delete** `/files/{file_id}`

删除文件并将其从所有 vector stores 中移除。

### 路径参数

- `file_id: string`

### 返回

- `FileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "file"`

    - `"file"`

### 示例

```http
curl https://api.openai.com/v1/files/$FILE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "file"
}
```

### 示例

```http
curl https://api.openai.com/v1/files/file-abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "file",
  "deleted": true
}
```
