# Uploads

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

## 取消上传

**post** `/uploads/{upload_id}/cancel`

取消该 Upload。Upload 被取消后，无法再添加任何 Part。

返回 Upload 对象，其中包含状态字段 status `cancelled`.

### 路径参数

- `upload_id: string`

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Part 的形式接收字节分块。

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

    文件的预期用途。 [请参阅此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 以了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    Upload 完成后生成的可用 File 对象。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件大小，以字节为单位。在已完成文件上传的响应中，当文件大小尚不可用时，
      该字段可能为 null。

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

      已弃用。文件的当前状态，可能为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件将过期的 Unix 时间戳（以秒为单位）。在
      已完成文件上传响应中，如果未设置过期时间，此字段可以为 null。

    - `status_details: optional string`

      已废弃。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段上的 `fine_tuning.job`。已完成文件上传响应在这些详情未设置时可以返回 null。

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

完成 [Upload](/api/reference/resources/uploads).

在返回的 Upload 对象中，包含一个嵌套的 [File](/api/reference/resources/files) 对象，可直接用于平台的其他部分。

你可以通过传入一个有序的 Part ID 列表来指定 Parts 的顺序。

完成时上传的字节数必须与最初创建 Upload 对象时指定的字节数一致。Upload 对象完成后，不可再添加任何 Part。
返回 Upload 对象，状态为 `completed`，并附带一个 `file` 属性，其中包含已创建且可用的 File 对象。

### 路径参数

- `upload_id: string`

### Body 参数

- `part_ids: array of string`

  按顺序排列的 Part ID 列表。

- `md5: optional string`

  可选的 md5 校验和，用于验证上传的字节是否与你的预期一致。

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Part 的形式接收字节分块。

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

    文件的预期用途。 [请参阅此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 以了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    Upload 完成后生成的可用 File 对象。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件大小，以字节为单位。在已完成文件上传的响应中，当文件大小尚不可用时，
      该字段可能为 null。

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

      已弃用。文件的当前状态，可能为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件将过期的 Unix 时间戳（以秒为单位）。在
      已完成文件上传响应中，如果未设置过期时间，此字段可以为 null。

    - `status_details: optional string`

      已废弃。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段上的 `fine_tuning.job`。已完成文件上传响应在这些详情未设置时可以返回 null。

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
    "filename": "training_examples.jsonl",
    "purpose": "fine-tune",
    "status": "processed"
  }
}
```

## 创建上传

**post** `/uploads`

创建一个中间的 [Upload](/api/reference/resources/uploads) 对象
，你可以向其添加 [Parts](/api/reference/resources/uploads/subresources/parts) 。
目前，一个 Upload 最多总共可接受 8 GB 的数据，并且在你创建
一小时后过期。

完成 Upload 后，我们会创建一个
[File](/api/reference/resources/files) 对象，其中包含你上传的所有分块。
该 File 可在我们平台的其他部分作为常规的
File 对象使用。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。
请参阅关于你所使用场景下受支持 MIME 类型的
[文档](/api/docs/guides/tools-file-search#supported-files).

有关每个用途的合适文件扩展名指导，请
参阅关于如何创建 [的文档
File](/api/reference/resources/files/methods/create).

返回 Upload 对象，其中包含状态字段 status `pending`.

### Body 参数

- `bytes: number`

  你正在上传的文件的字节数。

- `filename: string`

  要上传文件的名称。

- `mime_type: string`

  文件的 MIME 类型。

  此值必须属于你的文件用途所支持的 MIME 类型。参见
  助手和视觉所支持的 MIME 类型。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  已上传文件的预期用途。

  参见 [File 的相关
  文档](/api/reference/resources/files/methods/create#%28resource%29%20files%20%3E%20%28method%29%20create%20%3E%20%28params%29%200%20%3E%20%28param%29%20purpose%20%3E%20%28schema%29).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下，purpose 为 `purpose=batch` 的文件会在 30 天后过期，其他所有文件会一直保留，直至被手动删除。

  - `anchor: "created_at"`

    过期策略适用的锚定时间戳。支持以下锚点： `created_at`.

    - `"created_at"`

  - `seconds: number`

    文件在锚定时间之后过期的秒数。必须介于 3600（1 小时）到 2592000（30 天）之间。

### 返回值

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Part 的形式接收字节分块。

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

    文件的预期用途。 [请参阅此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 以了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    Upload 完成后生成的可用 File 对象。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件大小，以字节为单位。在已完成文件上传的响应中，当文件大小尚不可用时，
      该字段可能为 null。

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

      已弃用。文件的当前状态，可能为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件将过期的 Unix 时间戳（以秒为单位）。在
      已完成文件上传响应中，如果未设置过期时间，此字段可以为 null。

    - `status_details: optional string`

      已废弃。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段上的 `fine_tuning.job`。已完成文件上传响应在这些详情未设置时可以返回 null。

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

  Upload 对象可以以 Part 的形式接收字节分块。

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

    文件的预期用途。 [请参阅此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 以了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    Upload 完成后生成的可用 File 对象。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件大小，以字节为单位。在已完成文件上传的响应中，当文件大小尚不可用时，
      该字段可能为 null。

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

      已弃用。文件的当前状态，可能为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件将过期的 Unix 时间戳（以秒为单位）。在
      已完成文件上传响应中，如果未设置过期时间，此字段可以为 null。

    - `status_details: optional string`

      已废弃。有关微调训练文件验证失败的原因详情，请参阅 `error` 字段上的 `fine_tuning.job`。已完成文件上传响应在这些详情未设置时可以返回 null。

  - `object: optional "upload"`

    对象类型，始终为 "upload"。

    - `"upload"`

# Parts

## Add upload part

**post** `/uploads/{upload_id}/parts`

向 [Part](/api/reference/resources/uploads/subresources/parts) 对象添加一个 [Upload](/api/reference/resources/uploads) 对象。一个 Part 代表你要上传的文件中一段字节块。

每个 Part 最大为 64 MB，你可以不断添加 Part，直到达到 8 GB 的上传上限。

可以并行添加多个 Part。你可以决定这些 Part 的预期顺序，当你 [完成上传](/api/reference/resources/uploads/methods/complete).

### 路径参数

- `upload_id: string`

### 返回值

- `UploadPart object { id, created_at, object, upload_id }`

  上传片段表示我们可以添加到 Upload 对象中的一块字节。

  - `id: string`

    上传片段的唯一标识符，可在 API 端点中引用。

  - `created_at: number`

    创建该片段时的 Unix 时间戳（以秒为单位）。

  - `object: "upload.part"`

    对象类型，始终为 `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    此片段被添加到的 Upload 对象的 ID。

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

### 上传分块

- `UploadPart object { id, created_at, object, upload_id }`

  上传片段表示我们可以添加到 Upload 对象中的一块字节。

  - `id: string`

    上传片段的唯一标识符，可在 API 端点中引用。

  - `created_at: number`

    创建该片段时的 Unix 时间戳（以秒为单位）。

  - `object: "upload.part"`

    对象类型，始终为 `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    此片段被添加到的 Upload 对象的 ID。
