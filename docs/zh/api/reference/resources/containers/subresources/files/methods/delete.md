> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

## 删除容器文件

**删除** `/containers/{container_id}/files/{file_id}`

删除容器文件

### 路径参数

- `container_id: string`

- `file_id: string`

### 返回

- `id: string`

- `deleted: boolean`

- `object: "container.file.deleted"`

  - `"container.file.deleted"`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "container.file.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863/files/cfile_682e0e8a43c88191a7978f477a09bdf5 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "object": "container.file.deleted",
    "deleted": true
}
```
