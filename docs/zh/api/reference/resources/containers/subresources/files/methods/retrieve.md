> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## 检索容器文件

**get** `/containers/{container_id}/files/{file_id}`

Retrieve Container File

### 路径参数

- `container_id: string`

- `file_id: string`

### 返回

- `id: string`

  文件的唯一标识符。

- `bytes: number`

  文件大小（以字节为单位）。

- `container_id: string`

  此文件所属的容器。

- `created_at: number`

  文件创建时的 Unix 时间戳（以秒为单位）。

- `object: string`

  此对象的类型（`container.file`).

- `path: string`

  容器中文件的路径。

- `source: string`

  文件的来源（例如， `user`, `assistant`).

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

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
curl https://api.openai.com/v1/containers/container_123/files/file_456 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

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
