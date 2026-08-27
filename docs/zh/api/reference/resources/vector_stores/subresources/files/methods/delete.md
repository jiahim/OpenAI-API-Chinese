> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 删除向量存储文件

**删除** `/vector_stores/{vector_store_id}/files/{file_id}`

删除向量存储文件。这将从向量存储中移除该文件，但文件本身不会被删除。要删除文件，请使用 [删除文件](/docs/api-reference/files/delete) 端点。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

- `VectorStoreFileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.file.deleted"`

    - `"vector_store.file.deleted"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "vector_store.file.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  id: "file-abc123",
  object: "vector_store.file.deleted",
  deleted: true
}
```
