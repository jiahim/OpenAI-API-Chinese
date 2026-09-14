> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 创建上传

**post** `/uploads`

创建一个中间的 [Upload](/api/reference/resources/uploads) 对象
，你可以向其中添加 [Parts](/api/reference/resources/uploads/subresources/parts) 。
目前，一个 Upload 最多只能接受总计 8 GB 的内容，并且在你创建后一小时后
过期。

完成 Upload 后，我们会创建一个包含你上传的所有部分的
[File](/api/reference/resources/files) 对象。该
File 可在我们平台的其他部分作为常规的 File 对象使用。
File 对象。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。
请参考适合你用例的
[支持的 MIME 类型文档](/api/docs/guides/tools-file-search#supported-files).

有关每个用途的合适文件扩展名指南，请
遵循相关文档说明以 [创建
File](/api/reference/resources/files/methods/create).

返回 Upload 对象及其状态 `pending`.

### Body 参数

- `bytes: number`

  你正在上传的文件的字节数。

- `filename: string`

  要上传文件的名称。

- `mime_type: string`

  文件的 MIME 类型。

  该类型必须属于文件用途所支持的 MIME 类型范围内。参见
  助手与视觉功能所支持的 MIME 类型。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  已上传文件的预期用途。

  参见 [File 的
  用途](/api/reference/resources/files/methods/create#%28resource%29%20files%20%3E%20%28method%29%20create%20%3E%20%28params%29%200%20%3E%20%28param%29%20purpose%20%3E%20%28schema%29).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下,带有 `purpose=batch` 的文件在 30 天后过期,其他所有文件会一直保留,直到被手动删除。

  - `anchor: "created_at"`

    过期策略生效的锚定时间戳。支持以下锚点: `created_at`.

    - `"created_at"`

  - `seconds: number`

    文件在锚点时间之后过期的秒数。必须在 3600（1 小时）到 2592000（30 天）之间。

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Parts 的形式接收字节块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期上传的字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（单位为秒）。

  - `expires_at: number`

    Upload 过期时的 Unix 时间戳（单位为秒）。

  - `filename: string`

    要上传的文件名称。

  - `purpose: string`

    文件的预期用途。 [请参阅此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 以了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    该 `File` 对象表示已上传到 OpenAI 的文档。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件大小（以字节为单位）。

    - `created_at: number`

      文件创建时的 Unix 时间戳（单位为秒）。

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

      文件过期时的 Unix 时间戳（以秒为单位）。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

  - `object: optional "upload"`

    对象类型，始终为 "upload"。

    - `"upload"`

### 示例

```http
curl https://api.openai.com/v1/uploads \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "bytes": 0,
          "filename": "filename",
          "mime_type": "mime_type",
          "purpose": "assistants"
        }'
```

#### Response

```json
{
  "id": "id",
  "bytes": 0,
  "created_at": 0,
  "expires_at": 0,
  "filename": "filename",
  "purpose": "purpose",
  "status": "pending",
  "file": {
    "id": "id",
    "bytes": 0,
    "created_at": 0,
    "filename": "filename",
    "object": "file",
    "purpose": "assistants",
    "status": "uploaded",
    "expires_at": 0,
    "status_details": "status_details"
  },
  "object": "upload"
}
```

### 示例

```http
curl https://api.openai.com/v1/uploads \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "purpose": "fine-tune",
    "filename": "training_examples.jsonl",
    "bytes": 2147483648,
    "mime_type": "text/jsonl",
    "expires_after": {
      "anchor": "created_at",
      "seconds": 3600
    }
  }'
```

#### Response

```json
{
  "id": "upload_abc123",
  "object": "upload",
  "bytes": 2147483648,
  "created_at": 1719184911,
  "filename": "training_examples.jsonl",
  "purpose": "fine-tune",
  "status": "pending",
  "expires_at": 1719127296
}
```
