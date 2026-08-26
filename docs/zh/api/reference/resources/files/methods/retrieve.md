> 完整的文档索引，请参见 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 检索文件

**get** `/files/{file_id}`

返回有关特定文件的信息。

### 路径参数

- `file_id: string`

### 返回值

- `FileObject object { id, bytes, created_at, 6 more }`

  该 `File` 对象表示已上传至 OpenAI 的文档。

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

    文件到期时的 Unix 时间戳（以秒为单位）。

  - `status_details: optional string`

    已弃用。有关微调训练文件未能通过验证的原因详情，请参见 `error` 字段，位于 `fine_tuning.job`.

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
