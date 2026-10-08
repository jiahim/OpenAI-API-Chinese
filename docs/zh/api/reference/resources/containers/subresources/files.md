# Files

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

## 创建容器文件

**post** `/containers/{container_id}/files`

创建容器文件

你可以发送包含原始文件内容的 multipart/form-data 请求，也可以发送包含文件 ID 的 JSON 请求。

### 路径参数

- `container_id: string`

### 正文参数

- `file: optional string`

  要上传的 File 对象（非文件名）。

- `file_id: optional string`

  要创建的文件的名称。

### Returns

- `id: string`

  文件的唯一标识符。

- `bytes: number`

  文件的大小（以字节为单位）。

- `container_id: string`

  该文件所属的容器。

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
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@example.txt"
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

## 删除容器文件

**删除** `/containers/{container_id}/files/{file_id}`

删除容器文件

### 路径参数

- `container_id: string`

- `file_id: string`

### Returns

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

## 列出容器文件

**get** `/containers/{container_id}/files`

列出容器文件

### 路径参数

- `container_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  返回对象数量的限制。限制范围为 1 到 100，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of object { id, bytes, container_id, 4 more }`

  容器文件列表。

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    该文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

- `first_id: string`

  列表中第一个文件的 ID。

- `has_more: boolean`

  是否还有更多文件可用。

- `last_id: string`

  列表中最后一个文件的 ID。

- `object: "list"`

  返回对象的类型，必须为 'list'。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "bytes": 0,
      "container_id": "container_id",
      "created_at": 0,
      "object": "object",
      "path": "path",
      "source": "source"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "object": "list",
    "data": [
        {
            "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
            "object": "container.file",
            "created_at": 1747848842,
            "bytes": 880,
            "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
            "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
            "source": "user"
        }
    ],
    "first_id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "has_more": false,
    "last_id": "cfile_682e0e8a43c88191a7978f477a09bdf5"
}
```

## 获取容器文件

**get** `/containers/{container_id}/files/{file_id}`

检索容器文件

### 路径参数

- `container_id: string`

- `file_id: string`

### Returns

- `id: string`

  文件的唯一标识符。

- `bytes: number`

  文件的大小（以字节为单位）。

- `container_id: string`

  该文件所属的容器。

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

## Domain Types

### File Create Response

- `FileCreateResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    该文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

### File Delete Response

- `FileDeleteResponse object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "container.file.deleted"`

    - `"container.file.deleted"`

### File List Response

- `FileListResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    该文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

### File Retrieve Response

- `FileRetrieveResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    该文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

# Content

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
