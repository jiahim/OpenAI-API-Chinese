> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 上传文件

**发布** `/files`

上传可在各个端点使用的文件。单个文件
最大可达 512 MB，每个项目最多可存储 2.5 TB 的文件
总量。没有组织范围的存储限制。对此
端点的速率限制为每个已认证用户每分钟 1,000 次请求。
。

- Assistants API 支持最大 200 万 token 的文件，并支持特定的
  文件类型。有关详细信息，请参阅 [Assistants 工具指南](/api/docs/guides/tools) 。
  详情。
- 微调 API 仅支持 `.jsonl` 文件。输入还要求采用
  微调所需的特定格式，例如
  [对话](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 或
  [completions](/api/docs/guides/supervised-fine-tuning#formatting-your-data) models。
- The Batch API 仅支持 `.jsonl` 最大 200 MB 的文件。输入
  还要求使用特定的
  [format](/api/docs/guides/batch#1-prepare-your-batch-file).
- 对于检索或 `file_search` 导入，请先在此上传文件。如果你
  需要将多个已上传的文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create)
  代替逐个添加它们。向量存储的附加有独立的
  文件上传的限制，包括每个组织每分钟最多 2,000 个附加文件，按
  组织计算。

请 [联系我们](https://help.openai.com/) 如果你需要提高这些
存储限制。

### Returns

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object 表示已上传到 OpenAI 的文档。

  - `id: string`

    文件标识符，可在 API 端点中引用。

  - `bytes: number`

    文件大小，以字节为单位。

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

    已弃用。文件的当前状态，可能为 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段于 `fine_tuning.job`.

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
  "purpose": "fine-tune"
}
```
