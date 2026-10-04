> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## Create upload

**post** `/uploads`

创建一个中间 [Upload](/api/reference/resources/uploads) 对象
，你可以向其中添加 [Parts](/api/reference/resources/uploads/subresources/parts) 。
目前，一个 Upload 最多接受总计 8 GB 的内容，并在创建
一小时后过期。

完成 Upload 后，我们会创建一个
[File](/api/reference/resources/files) 对象，其中包含你上传的所有 Part。
该 File 可在我们平台的其他部分作为常规
File 对象使用。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。
请参阅你所适用场景的
[支持的 MIME 类型文档](/api/docs/guides/tools-file-search#supported-files).

有关各用途对应正确文件扩展名的指导，请
按照相关文档 [创建
File](/api/reference/resources/files/methods/create).

返回包含状态的 Upload 对象 `pending`.

### 请求体参数

- `bytes: number`

  你正在上传的文件的字节数。

- `filename: string`

  要上传的文件名。

- `mime_type: string`

  文件的 MIME 类型。

  此 MIME 类型必须属于该文件用途所支持的 MIME 类型范围内。请参阅
  助手与视觉所支持的 MIME 类型。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  上传文件的预期用途。

  请参阅 [File 用途相关
  文档](/api/reference/resources/files/methods/create#%28resource%29%20files%20%3E%20%28method%29%20create%20%3E%20%28params%29%200%20%3E%20%28param%29%20purpose%20%3E%20%28schema%29).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下，以下用途的文件 `purpose=batch` 将在 30 天后过期，而所有其他文件会一直保留，直至被手动删除。

  - `anchor: "created_at"`

    过期策略生效的锚点时间戳。支持以下锚点： `created_at`.

    - `"created_at"`

  - `seconds: number`

    在锚点时间之后文件将要过期的秒数。必须在 3600（1 小时）到 2592000（30 天）之间。

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

    待上传文件的名称。

  - `purpose: string`

    文件的预期用途。 [请参考此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    Upload 完成后已就绪的 File 对象。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件的大小，以字节为单位。在已完成的文件上传响应中，当文件大小尚不可用时，此字段可以
      为 null。

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

      已弃用。文件的当前状态，可为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件将过期的 Unix 时间戳（以秒为单位）。在
      已完成的文件上传响应中，当未设置过期时间时，此字段可能为 null。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段中的 `fine_tuning.job`。当这些详情未设置时，已完成的文件上传响应可能返回 null。

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
