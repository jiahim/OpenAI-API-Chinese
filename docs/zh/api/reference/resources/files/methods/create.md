> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 上传文件

**发布** `/files`

上传可在各个端点使用的文件。单个文件
最大可为 512 MB，每个项目最多可存储 2.5 TB 的文件。
没有组织范围的总存储限制。该端点
的上传速率限制为每个已认证用户每分钟 1,000 次请求。
用户。

- Assistants API 支持最大 200 万 tokens 的文件，并要求特定的文件类型。
  详见 [Assistants 工具指南](/api/docs/guides/tools) 以了解
  详情。
- 微调 API 仅支持 .jsonl 文件。输入还需要满足针对 `.jsonl` 微调所需的特定格式。
  微调所需的特定格式。
  [聊天](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 或
  [补全](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 模型。
- 批量 API 仅支持大小最大为 200 MB 的文件。 `.jsonl` 输入还要求使用特定的
  格式。
  [格式](/api/docs/guides/batch#1-prepare-your-batch-file).
- 用于检索或 `file_search` 导入时，请先在此处上传文件。如果
  你需要将多个已上传的文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create)
  而不是逐个附加。向量存储附加操作有单独的限制。
  来自文件上传的限制，包括每个组织每分钟 2,000 个已附加文件
  organization.

请 [联系我们](https://help.openai.com/) 如果你需要提高这些
存储限制。

### 返回

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number or null`

    The size of the file, in bytes. In a completed file upload response, this can
    be null when the file size is not yet available.

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

    The Unix timestamp (in seconds) for when the file will expire. In a
    completed file upload response, this can be null when no expiry is set.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`. Completed file upload responses can return null when these details are unset.

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
  -F file="@mydata.jsonl" \
  -F 'expires_after[anchor]=created_at' \
  -F 'expires_after[seconds]=2592000'
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1680202602,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
  "status": "processed"
}
```
