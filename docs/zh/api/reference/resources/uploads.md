# Uploads

> 完整的文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取对应文档页面的 Markdown 版本。

## 取消上传

**post** `/uploads/{upload_id}/cancel`

取消上传。上传被取消后，不能再添加任何 Part。

返回包含以下状态的 Upload 对象 `cancelled`.

### 路径参数

- `upload_id: string`

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以通过 Parts 的形式接收字节分块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期要上传的字节数。

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

      文件大小（以字节为单位）。

    - `created_at: number`

      文件创建时的 Unix 时间戳（以秒为单位）。

    - `filename: string`

      文件名。

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

      已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

  - `object: optional "upload"`

    对象类型，始终为 "upload"。

    - `"upload"`

### 示例

```http
curl https://api.openai.com/v1/uploads/$UPLOAD_ID/cancel \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
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
curl https://api.openai.com/v1/uploads/upload_abc123/cancel
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
  "status": "cancelled",
  "expires_at": 1719127296
}
```

## 完成上传

**post** `/uploads/{upload_id}/complete`

完成 [Upload](/docs/api-reference/uploads/object).

在返回的 Upload 对象中，嵌套了一个 [File](/docs/api-reference/files/object) 对象，可直接在平台其他部分使用。

你可以通过传入一个有序的 Part ID 列表来指定 Parts 的顺序。

完成时上传的字节数必须与最初创建 Upload 对象时指定的字节数一致。Upload 完成之后不能再添加任何 Part。
返回状态为 `completed`，的 Upload 对象，其中包含一个额外的 `file` 属性，其中包含所创建的可用 File 对象。

### 路径参数

- `upload_id: string`

### Body Parameters

- `part_ids: array of string`

  有序的 Part ID 列表。

- `md5: optional string`

  用于验证上传字节是否符合预期的文件内容的可选 md5 校验和。

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以通过 Parts 的形式接收字节分块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期要上传的字节数。

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

      文件大小（以字节为单位）。

    - `created_at: number`

      文件创建时的 Unix 时间戳（以秒为单位）。

    - `filename: string`

      文件名。

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

      已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

  - `object: optional "upload"`

    对象类型，始终为 "upload"。

    - `"upload"`

### 示例

```http
curl https://api.openai.com/v1/uploads/$UPLOAD_ID/complete \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "part_ids": [
            "string"
          ]
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
curl https://api.openai.com/v1/uploads/upload_abc123/complete
  -d '{
    "part_ids": ["part_def456", "part_ghi789"]
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
  "status": "completed",
  "expires_at": 1719127296,
  "file": {
    "id": "file-xyz321",
    "object": "file",
    "bytes": 2147483648,
    "created_at": 1719186911,
    "expires_at": 1719127296,
    "filename": "training_examples.jsonl",
    "purpose": "fine-tune",
  }
}
```

## 创建上传

**post** `/uploads`

Creates an intermediate [Upload](/docs/api-reference/uploads/object) object
你可以向其添加 [Parts](/docs/api-reference/uploads/part-object) 。
目前，一个 Upload 总体最多接受 8 GB，并且在你创建之后
一小时后过期。

完成 Upload 后，我们将创建一个
[File](/docs/api-reference/files/object) 对象，其中包含你上传的所有 part
。此 File 可在我们平台的其他部分中作为常规
File 对象使用。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。
请参阅相关文档了解你的用例所支持的
[MIME 类型](/docs/assistants/tools/file-search#supported-files).

有关每种用途的正确文件扩展名指南，请
参阅关于如何创建 [的文档
File](/docs/api-reference/files/create).

返回包含以下状态的 Upload 对象 `pending`.

### Body Parameters

- `bytes: number`

  你正在上传的文件的字节数。

- `filename: string`

  要上传的文件名。

- `mime_type: string`

  文件的 MIME 类型。

  该值必须属于你文件用途所支持的 MIME 类型范围。参见
  智能体与视觉所支持的 MIME 类型。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  上传文件的预期用途。

  参见 [关于 File
  用途](/docs/api-reference/files/create#files-create-purpose).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下，使用 `purpose=batch` 的文件会在 30 天后过期，其他文件则会一直保留，直到被手动删除。

  - `anchor: "created_at"`

    过期策略生效的锚点时间戳。支持的锚点包括： `created_at`.

    - `"created_at"`

  - `seconds: number`

    文件将在锚点时间之后过期的秒数。必须介于 3600（1 小时）到 2592000（30 天）之间。

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以通过 Parts 的形式接收字节分块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期要上传的字节数。

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

      文件大小（以字节为单位）。

    - `created_at: number`

      文件创建时的 Unix 时间戳（以秒为单位）。

    - `filename: string`

      文件名。

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

## Domain Types

### Upload

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以通过 Parts 的形式接收字节分块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期要上传的字节数。

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

      文件大小（以字节为单位）。

    - `created_at: number`

      文件创建时的 Unix 时间戳（以秒为单位）。

    - `filename: string`

      文件名。

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

      已弃用。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段，位于 `fine_tuning.job`.

  - `object: optional "upload"`

    对象类型，始终为 "upload"。

    - `"upload"`

# Parts

## Add upload part

**post** `/uploads/{upload_id}/parts`

向某个 [Part](/docs/api-reference/uploads/part-object) 对象添加一个 Part [Upload](/docs/api-reference/uploads/object) 。Part 表示你正在尝试上传的文件中的一段字节。

每个 Part 的大小上限为 64 MB，你可以不断添加 Part，直到达到 8 GB 的上传上限。

可以并行添加多个 Part。你可以在 [完成上传](/docs/api-reference/uploads/complete).

### 路径参数

- `upload_id: string`

### 返回值

- `UploadPart object { id, created_at, object, upload_id }`

  upload Part 表示我们可以添加到 Upload 对象的一个字节块。

  - `id: string`

    upload Part 的唯一标识符，可在 API 端点中引用。

  - `created_at: number`

    Part 创建时的 Unix 时间戳（以秒为单位）。

  - `object: "upload.part"`

    对象类型，始终为 `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    此 Part 所添加到的 Upload 对象的 ID。

### 示例

```http
curl https://api.openai.com/v1/uploads/$UPLOAD_ID/parts \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'data=@/path/to/data'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "object": "upload.part",
  "upload_id": "upload_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/uploads/upload_abc123/parts
  -F data="aHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS91cGxvYWRz..."
```

#### 响应

```json
{
  "id": "part_def456",
  "object": "upload.part",
  "created_at": 1719185911,
  "upload_id": "upload_abc123"
}
```

## Domain Types

### Upload Part

- `UploadPart object { id, created_at, object, upload_id }`

  upload Part 表示我们可以添加到 Upload 对象的一个字节块。

  - `id: string`

    upload Part 的唯一标识符，可在 API 端点中引用。

  - `created_at: number`

    Part 创建时的 Unix 时间戳（以秒为单位）。

  - `object: "upload.part"`

    对象类型，始终为 `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    此 Part 所添加到的 Upload 对象的 ID。
