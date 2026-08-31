> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取对应文档页面的 Markdown 版本。

## 创建容器文件

**post** `/containers/{container_id}/files`

创建容器文件

你可以发送包含原始文件内容的 multipart/form-data 请求，也可以发送带有文件 ID 的 JSON 请求。

### 路径参数

- `container_id: string`

### 请求体参数

- `file: optional string`

  要上传的文件对象（而非文件名）。

- `file_id: optional string`

  要创建的文件的名称。

### Returns

- `id: string`

  文件的唯一标识符。

- `bytes: number`

  文件的大小（以字节为单位）。

- `container_id: string`

  此文件所属的容器。

- `created_at: number`

  文件创建时的 Unix 时间戳（以秒为单位）。

- `object: string`

  此对象的类型（`container.file`).

- `path: string`

  文件在容器中的路径。

- `source: string`

  文件的来源（例如， `user`, `assistant`).

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### Response

```json
{
  "id": "id",
  "bytes": 0,
  "container_id": "container_id",
  "created_at": 0,
  "object": "object",
  "path": "path",
  "source": "source"
}
```

### 示例

```http
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@example.txt"
```

#### Response

```json
{
  "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
  "object": "container.file",
  "created_at": 1747848842,
  "bytes": 880,
  "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
  "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
  "source": "user"
}
```
