> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

## Create upload

**post** `/uploads`

创建一个中间 [Upload](/docs/api-reference/uploads/object) 对象
，你可以向其中添加 [Parts](/docs/api-reference/uploads/part-object) 。
目前，一个 Upload 最多接受总计 8 GB 的内容，并在创建
一小时后过期。

完成 Upload 后，我们会创建一个包含你上传的所有 part 的
[File](/docs/api-reference/files/object) 对象。该 File 可在我们平台的其他地方作为常规的
File 对象在平台其余部分中使用。
File 对象。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。
请参阅针对你使用场景的
[支持的 MIME 类型文档](/docs/assistants/tools/file-search#supported-files).

有关每个用途的正确文件扩展名指南，请
按照相关文档进行 [创建一个
File](/docs/api-reference/files/create).

返回带有状态信息的 Upload 对象 `pending`.

### 请求体参数

- `bytes: number`

  你要上传的文件的字节数。

- `filename: string`

  要上传的文件的名称。

- `mime_type: string`

  文件的 MIME 类型。

  此值必须属于你的文件用途所支持的 MIME 类型范围。参见
  助手中支持的 MIME 类型和视觉功能。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  上传文件的预期用途。

  请参阅 File（文件）的 [documentation on File
  purposes](/docs/api-reference/files/create#files-create-purpose).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下，带有 `purpose=batch` 的过期时间为 30 天，其他所有文件会一直保留直到被手动删除。

  - `anchor: "created_at"`

    过期策略生效的锚定时间戳。支持的锚点： `created_at`.

    - `"created_at"`

  - `seconds: number`

    文件将在锚定时间之后过期的秒数。必须介于 3600（1 小时）和 2592000（30 天）之间。

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Parts 的形式接收字节分块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期上传的字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（以秒为单位）。

  - `expires_at: number`

    Upload 过期时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    要上传的文件名。

  - `purpose: string`

    文件的预期用途。 [请参考此处](/docs/api-reference/files/object#files/object-purpose) 了解可接受的值。

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

      文件的大小，以字节为单位。

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

      文件到期时的 Unix 时间戳（单位：秒）。

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

#### 响应

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

#### 响应

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
