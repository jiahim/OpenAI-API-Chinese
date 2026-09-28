> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 上传文件

**post** `/files`

上传可在多个端点之间使用的文件。单个文件
最大可达 512 MB，每个项目总共最多可存储 2.5 TB 的文件
。组织级别没有存储容量限制。通过该
端点上传的请求频率限制为每个已身份验证
用户每分钟 1,000 次。

- Assistants API 支持最大 2 百万 token 的文件以及特定的文件类型。
  请参阅 [Assistants 工具指南](/api/docs/guides/tools) 了解
  详情。
- 微调 API 仅支持 `.jsonl` 文件。输入还需要满足
  微调的特定格式要求
  [对话](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 或
  [completions](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 模型。
- Batch API 仅支持 `.jsonl` 最大 200 MB 大小的文件。输入
  文件还需要特定的必需
  [格式](/api/docs/guides/batch#1-prepare-your-batch-file).
- 对于检索或 `file_search` 摄取，请先在此处上传文件。如果
  你需要将多个已上传文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create)
  而不是逐个附加它们。向量存储附加具有独立的
  limits from file upload, including 2,000 attached files per minute per
  organization.

请 [联系我们](https://help.openai.com/) 以提高这些
存储限制。

### 返回值

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` 对象，表示已上传到 OpenAI 的文档。

  - `id: string`

    文件标识符，可在 API 端点中引用。

  - `bytes: number`

    文件大小（以字节为单位）。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    文件名称。

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

    已弃用。文件的当前状态，可能为 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因的详细信息，请参阅 `error` 字段，详见 `fine_tuning.job`.

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
