> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## Retrieve container file content

**get** `/containers/{container_id}/files/{file_id}/content`

检索容器文件内容

### 路径参数

- `container_id: string`

- `file_id: string`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl https://api.openai.com/v1/containers/container_123/files/cfile_456/content \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
<binary content of the file>
```
