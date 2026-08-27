> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 上传文件

**post** `/files`

上传一个可在各种端点使用的文件。单个文件
最大可达 512 MB，每个项目最多可存储 2.5 TB 的文件，
总计。没有组织范围内的存储限制。对此
端点的上传受限于每个经过身份验证的用户每分钟 1,000 次请求。
用户。

- Assistants API 支持最多 200 万 token 的特定文件，
  有关文件类型，请参阅 [Assistants 工具指南](/docs/assistants/tools) 以获取
  详细信息。
- Fine-tuning API 仅支持 `.jsonl` 文件。输入还必须有
  用于微调的特定格式，适用于
  [聊天](/docs/api-reference/fine-tuning/chat-input) 或
  [补全](/docs/api-reference/fine-tuning/completions-input) 模型。
- Batch API 仅支持 `.jsonl` 大小不超过 200 MB 的文件。输入
  还必须符合特定的
  [格式](/docs/api-reference/batch/request-input).
- 对于检索或 `file_search` 摄取，请先在此上传文件。如果
  需要将多个上传文件附加到同一向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch)
  而不是逐个附加。向量存储附件有单独的
  文件上传的限制，包括每个
  组织每分钟最多附加 2,000 个文件。

如需 [联系我们](https://help.openai.com/) 以提高这些
存储限制。

### 返回

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` 对象表示一个已上传至 OpenAI 的文档。

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

    已弃用。有关微调训练文件为何未通过验证的详细信息，请参见 `error` 字段于 `fine_tuning.job`.

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
