> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

## Delete vector store file

**delete** `/vector_stores/{vector_store_id}/files/{file_id}`

删除一个向量存储文件。这会从向量存储中移除该文件，但文件本身不会被删除。要删除文件，请使用 [delete file](/api/reference/resources/files/methods/delete) 端点。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回值

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
  "id": "file-abc123",
  "object": "vector_store.file.deleted",
  "deleted": true
}
```
