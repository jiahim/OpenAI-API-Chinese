> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

## 上传文件

**post** `/files`

上传一个可在各个端点使用的文件。单个文件
最大可达 512 MB，每个项目总计最多可存储 2.5 TB 的文件。
组织范围没有存储上限。此端点的
上传速率限制为每个已认证用户每分钟 1,000 次请求。
用户。

- Assistants API 支持最大 200 万 token 的文件，且仅限特定文件类型。详见
  Assistants 工具指南 [Assistants 工具指南](/api/docs/guides/tools) 以获取
  详情。
- Fine-tuning API 仅支持 `.jsonl` .jsonl 文件。输入还需要符合
  微调的特定格式要求，详见
  [聊天](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 或
  [completions](/api/docs/guides/supervised-fine-tuning#formatting-your-data) models。
- Batch API 仅支持 `.jsonl` 最大 200 MB 的文件。输入
  还有特定的必需
  [format](/api/docs/guides/batch#1-prepare-your-batch-file).
- 对于检索或 `file_search` 摄入，请先在此处上传文件。如果
  你需要将多个已上传的文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create)
  而不是逐个附加。向量存储附加有独立的
  文件上传的限制，包括每个组织单位每分钟可附加 2,000 个文件
  。

请 [联系我们](https://help.openai.com/) 如果你需要提高这些
存储限制。

### 返回值

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    文件大小，以字节为单位。在已完成的文件上传响应中，当文件大小还无法获取时，该值
    可能为 null。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    文件名。

  - `object: "file"`

    对象类型，始终为 `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    文件的预期用途。支持的取值包括 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

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

    文件到期时的 Unix 时间戳（以秒为单位）。在已
    完成的文件上传响应中，当未设置到期时间时，该值可能为 null。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`。已完成的文件上传响应在未设置这些详情时可能返回 null。

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
