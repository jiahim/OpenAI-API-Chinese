# 文件

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 以获取。

## 检索文件内容

**get** `/files/{file_id}/content`

返回一个包含指定文件内容的响应。

### 路径参数

- `file_id: string`

### 示例

```http
curl https://api.openai.com/v1/files/$FILE_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl https://api.openai.com/v1/files/file-abc123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > file.jsonl
```

## 上传文件

**post** `/files`

上传一个可在各端点使用的文件。单个文件
最大可达 512 MB，每个项目最多可存储 2.5 TB 的文件，
总计为 2.5 TB。没有组织级存储限制。上传到此
端点的速率限制为每个已认证用户每分钟 1,000 次请求，
每个用户。

- Assistants API 支持最多 200 万 token 的特定
  文件类型。请参阅 [Assistants 工具指南](/docs/assistants/tools) 以了解
  详细信息。
- 微调 API 仅支持 `.jsonl` 文件。输入也具有
  微调所需的特定格式，
  [聊天](/docs/api-reference/fine-tuning/chat-input) 或
  [补全](/docs/api-reference/fine-tuning/completions-input) 模型。
- 批量 API 仅支持 `.jsonl` 大小不超过 200 MB 的文件。输入
  也有特定的必需
  [格式](/docs/api-reference/batch/request-input).
- 对于检索或 `file_search` 摄取，请先在此上传文件。如果
  你需要将多个上传的文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch)
  而不是逐个附加。向量存储附加有单独的
  文件上传的限制，包括每分钟每个组织最多 2,000 个附件
  。

请联系 [我们](https://help.openai.com/) 如果你需要提高这些
存储限制。

### 返回

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` 对象表示已上传到 OpenAI 的文档。

  - `id: string`

    文件标识符，可在 API 端点中引用。

  - `bytes: number`

    文件的大小，以字节为单位。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    文件的名称。

  - `object: "file"`

    对象类型，始终为 `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    文件的预期用途。支持的值有 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，和 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可以是 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件为何未通过验证的详细信息，请参见 `error` 字段 `fine_tuning.job`.

### 示例

```http
curl https://api.openai.com/v1/files \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F purpose=assistants
```

#### 响应

```json
{
  "id": "id",
  "bytes": 0,
  "created_at": 0,
  "filename": "filename",
  "object": "file",
  "purpose": "assistants",
  "status": "uploaded",
  "expires_at": 0,
  "status_details": "status_details"
}
```

### 示例

```http
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
  -F expires_after[anchor]="created_at"
  -F expires_after[seconds]=2592000
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1677614202,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}
```

## 删除文件

**删除** `/files/{file_id}`

删除一个文件并将其从所有矢量存储中移除。

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

## 列出文件

**get** `/files`

返回文件列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到以 obj_foo 结尾的 100 个对象，你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  返回对象数量的限制。限制范围为 1 到 10,000，默认值为 10,000。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 为升序， `desc` 为降序。

  - `"asc"`

  - `"desc"`

- `purpose: optional string`

  仅返回具有给定用途的文件。

### 返回

- `data: array of FileObject`

  - `id: string`

    文件标识符，可在API端点中引用。

  - `bytes: number`

    文件的大小，以字节为单位。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    文件的名称。

  - `object: "file"`

    对象类型，始终为 `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    文件的预期用途。支持的值有 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，和 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可以是 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件未通过验证的原因详情，请参阅 `error` 上的字段 `fine_tuning.job`.

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "bytes": 0,
      "created_at": 0,
      "filename": "filename",
      "object": "file",
      "purpose": "assistants",
      "status": "uploaded",
      "expires_at": 0,
      "status_details": "status_details"
    }
  ],
  "first_id": "file-abc123",
  "has_more": false,
  "last_id": "file-abc456",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 175,
      "created_at": 1613677385,
      "expires_at": 1677614202,
      "filename": "salesOverview.pdf",
      "purpose": "assistants",
    },
    {
      "id": "file-abc456",
      "object": "file",
      "bytes": 140,
      "created_at": 1613779121,
      "expires_at": 1677614202,
      "filename": "puppy.jsonl",
      "purpose": "fine-tune",
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}
```

## 检索文件

**get** `/files/{file_id}`

返回关于特定文件的信息。

### 路径参数

- `file_id: string`

### 返回

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` 对象代表一个已上传到 OpenAI 的文档。

  - `id: string`

    文件标识符，可在 API 端点中引用。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    文件的名称。

  - `object: "file"`

    对象类型，始终为 `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    文件的预期用途。支持的值有 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，和 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可以是 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件未通过验证的原因的详细信息，请参阅 `error` 字段，位于 `fine_tuning.job`.

### 示例

```http
curl https://api.openai.com/v1/files/$FILE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "bytes": 0,
  "created_at": 0,
  "filename": "filename",
  "object": "file",
  "purpose": "assistants",
  "status": "uploaded",
  "expires_at": 0,
  "status_details": "status_details"
}
```

### 示例

```http
curl https://api.openai.com/v1/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1677614202,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}
```

## 域类型

### 文件内容

- `FileContent = string`

### 文件已删除

- `FileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "file"`

    - `"file"`

### 文件对象

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` 对象表示已上传至 OpenAI 的文档。

  - `id: string`

    文件标识符，可在 API 端点中引用。

  - `bytes: number`

    文件的大小，以字节为单位。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    文件的名称。

  - `object: "file"`

    对象类型，始终为 `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    文件的预期用途。支持的值有 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，和 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可以是 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件未通过验证的原因的详细信息，请参阅 `error` 字段，位于 `fine_tuning.job`.
