> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 创建上传

**post** `/uploads`

创建中间 [Upload](/docs/api-reference/uploads/object) 对象
，你可以向其中添加 [Parts](/docs/api-reference/uploads/part-object) 。当前，一个 Upload 总共最多可接受 8 GB 内容，并在。
你创建后的一
小时后过期。

一旦你完成 Upload，我们将创建一个
[File](/docs/api-reference/files/object) 对象，其中包含你上传的所有
部分。该 File 可像普通
File 对象一样在我们平台的其余部分使用。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。请参阅文档了解。
你的用例所支持的
[MIME 类型](/docs/assistants/tools/file-search#supported-files).

有关每种用途的正确文件扩展名的指导，请
按照文档操作 [创建
文件](/docs/api-reference/files/create).

返回包含状态的 Upload 对象 `pending`.

### 请求体参数

- `bytes: number`

  你正在上传的文件中的字节数。

- `filename: string`

  要上传的文件的名称。

- `mime_type: string`

  文件的 MIME 类型。

  这必须属于你的文件用途所支持的 MIME 类型。请参阅
  适用于助手和视觉的受支持 MIME 类型。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  上传文件的预期用途。

  请参阅 [关于 File 的文档
  用途](/docs/api-reference/files/create#files-create-purpose).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下， `purpose=batch` 在 30 天后过期，所有其他文件则会一直保留，直到手动删除。

  - `anchor: "created_at"`

    过期策略适用的锚点时间戳。支持的锚点： `created_at`.

    - `"created_at"`

  - `seconds: number`

    锚点时间之后文件过期的秒数。必须在 3600（1 小时）到 2592000（30 天）之间。

### 返回

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以接受以 Parts 形式提供的字节块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    要上传的预期字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（以秒为单位）。

  - `expires_at: number`

    Upload 过期时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    要上传的文件的名称。

  - `purpose: string`

    文件的预期用途。 [请参阅此处](/docs/api-reference/files/object#files/object-purpose) 了解可接受的值。

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

      文件的预期用途。支持的值包括 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，和 `user_data`.

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

      已弃用。有关微调训练文件验证失败原因的详细信息，请参阅 `error` 字段 `fine_tuning.job`.

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
