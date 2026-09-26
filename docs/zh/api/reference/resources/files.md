# 文件

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## Retrieve file content

**get** `/files/{file_id}/content`

返回一个响应，其中包含指定文件的内容。

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

上传一个可在各个端点之间使用的文件。单个文件
最大可为 512 MB，每个项目最多可以存储 2.5 TB 的文件
总量。整个组织没有存储容量限制。上传到此
端点的请求受速率限制，每个已认证用户每分钟最多 1,000 次
请求。

- Assistants API 支持最大 2 亿 token 的文件，且仅支持特定
  的文件类型。详见 [Assistants 工具指南](/api/docs/guides/tools) 。
  。
- 微调 API 仅支持 `.jsonl` 文件。输入还需要针对微调
  满足特定要求的格式
  [对话](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 或
  [补全](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 模型。
- Batch API 仅支持 `.jsonl` 最大 200 MB 的文件。输入还
  需要采用特定要求的
  [格式](/api/docs/guides/batch#1-prepare-your-batch-file).
- 如需进行检索或 `file_search` 摄取，请先在此上传文件。如果
  你需要将多个已上传文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create)
  ，而不是逐个附加。向量存储的附加方式另有独立
  来自文件上传的限制，包括每个
  组织每分钟可附加 2,000 个文件。

请 [联系我们](https://help.openai.com/) 如果你需要提高这些
存储限制。

### 返回值

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object 表示已上传到 OpenAI 的文档。

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

    文件的预期用途。支持的值包括 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可为 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件到期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

### 示例

```http
curl https://api.openai.com/v1/files \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F purpose=assistants
```

#### Response

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

#### Response

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1677614202,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune"
}
```

## 删除文件

**delete** `/files/{file_id}`

删除文件并将其从所有向量存储中移除。

### 路径参数

- `file_id: string`

### 返回值

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

#### Response

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

#### Response

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

  用于分页查询的游标。 `after` 是一个用于标识你在列表中所处位置的对象 ID。例如，如果你发起列表请求并收到 100 个对象，最后一个是 obj_foo，那么你的下一次调用可以传入 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  限制返回的对象数量。取值范围为 1 到 10,000，默认值为 10,000。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

- `purpose: optional string`

  仅返回具有指定用途的文件。

### 返回值

- `data: array of FileObject`

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

    文件的预期用途。支持的值包括 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可为 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件到期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

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

#### Response

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
      "purpose": "assistants"
    },
    {
      "id": "file-abc456",
      "object": "file",
      "bytes": 140,
      "created_at": 1613779121,
      "expires_at": 1677614202,
      "filename": "puppy.jsonl",
      "purpose": "fine-tune"
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}
```

## Retrieve file

**get** `/files/{file_id}`

返回有关特定文件的信息。

### 路径参数

- `file_id: string`

### 返回值

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object 表示已上传到 OpenAI 的文档。

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

    文件的预期用途。支持的值包括 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可为 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件到期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

### 示例

```http
curl https://api.openai.com/v1/files/$FILE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

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

#### Response

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1677614202,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune"
}
```

## Domain Types

### 文件内容

- `FileContent = string`

### 文件已删除

- `FileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "file"`

    - `"file"`

### File Object

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object 表示已上传到 OpenAI 的文档。

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

    文件的预期用途。支持的值包括 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    已弃用。文件的当前状态，可为 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件到期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.
