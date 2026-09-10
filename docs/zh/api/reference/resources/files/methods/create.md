> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

## 上传文件

**post** `/files`

上传一个可在多个端点之间使用的文件。单文件大小
最大可达 512 MB，每个项目最多可存储 2.5 TB 的文件
总计。没有组织范围的存储限制。此端点的
上传速率限制为每个已认证用户每分钟 1,000 次请求
用户。

- Assistants API 支持的文件最多包含 200 万个 token，并且必须是特定的
  文件类型。详见 [Assistants 工具指南](/api/docs/guides/tools) 。
  。
- 微调 API 仅支持 `.jsonl` 文件。输入数据还需要采用
  微调所要求的特定格式，分别针对
  [对话](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 或
  [补全](/api/docs/guides/supervised-fine-tuning#formatting-your-data) 模型。
- Batch API 仅支持大小不超过 `.jsonl` 200 MB 的文件。其输入还必须采用特定的
  格式，详见
  [此处](/api/docs/guides/batch#1-prepare-your-batch-file).
- 用于检索或 `file_search` 摄入时，请先在此处上传文件。如
  果需要将多个已上传的文件附加到同一个向量存储，请使用
  [`/vector_stores/{vector_store_id}/file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create)
  ，而不是逐个附加。向量存储附件具有独立的
  文件上传的限制，包括每个每分钟 2,000 个附加文件
  organization。

请 [联系我们](https://help.openai.com/) ，如果你需要提高这些
存储限制。

### 返回

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` object 表示已上传到 OpenAI 的文档。

  - `id: string`

    文件标识符，可在 API 端点中引用。

  - `bytes: number`

    文件大小（以字节为单位）。

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

    已弃用。文件的当前状态，可以是 `uploaded`, `processed`，或 `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    文件过期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件验证失败的原因的详细信息，请参阅 `error` 字段，位于 `fine_tuning.job`.

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
