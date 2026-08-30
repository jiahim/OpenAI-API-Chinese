# Files

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾附加 `.md` 来获取相应文档页面的 Markdown 版本。

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

上传一个可在多个端点之间使用的文件。单个文件
最大可达 512 MB，每个项目最多可存储 2.5 TB 的文件
。没有组织范围的存储限制。该端点的
上传速率限制为每个已认证用户每分钟 1,000 次请求
。

- Assistants API 支持最大 2 亿 token 的文件，且仅支持特定的
  文件类型。详见 [Assistants 工具指南](/docs/assistants/tools) 。
  。
- 微调 API 仅支持 `.jsonl` 文件。输入还需符合微调
  所需的特定格式，适用于
  [聊天](/docs/api-reference/fine-tuning/chat-input) 或
  [补全](/docs/api-reference/fine-tuning/completions-input) 模型。
- 批量 API 仅支持 `.jsonl` 大小不超过 200 MB 的文件。输入
  还必须采用特定的必需
  [格式](/docs/api-reference/batch/request-input).
- 对于检索或 `file_search` 数据导入，请先在此上传文件。如果
  你需要将多个已上传文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch)
  而不是逐个附加它们。向量存储附加操作有单独的
  文件上传相关的限制，包括每个组织每分钟最多可附加 2,000 个文件，按每
  组织计算。

请 [联系我们](https://help.openai.com/) 如果你需要提高这些
存储限制。

### Returns

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.

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
  "purpose": "fine-tune",
}
```

## 删除文件

**delete** `/files/{file_id}`

删除文件，并将其从所有向量存储中移除。

### 路径参数

- `file_id: string`

### Returns

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

  用于分页查询的游标。 `after` 是一个对象 ID，用于确定你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，那么后续调用可以包含 after=obj_foo 来获取列表的下一页。

- `limit: optional number`

  要返回的对象数量的上限。Limit 的取值范围是 1 到 10,000，默认为 10,000。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

- `purpose: optional string`

  仅返回具有指定用途的文件。

### Returns

- `data: array of FileObject`

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.

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

返回有关特定文件的信息。

### 路径参数

- `file_id: string`

### Returns

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.

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

  该 `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.
