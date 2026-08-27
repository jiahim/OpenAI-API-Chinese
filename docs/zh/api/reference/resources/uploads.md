# 上传

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 取消上传

**post** `/uploads/{upload_id}/cancel`

取消上传。上传被取消后，不得再添加任何部分。

返回上传对象及其状态 `cancelled`.

### 路径参数

- `upload_id: string`

### 返回

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以接受以 Parts 形式提供的字节块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    要上传的预期字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（秒）。

  - `expires_at: number`

    Upload 过期时的 Unix 时间戳（秒）。

  - `filename: string`

    要上传的文件名称。

  - `purpose: string`

    文件的预期用途。 [请参考此处](/docs/api-reference/files/object#files/object-purpose) 以了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    该 `File` 对象表示已上传至 OpenAI 的文档。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件的大小（字节）。

    - `created_at: number`

      文件创建时的 Unix 时间戳（秒）。

    - `filename: string`

      文件名称。

    - `object: "file"`

      对象类型，始终为 `file`.

      - `"file"`

    - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

      文件的预期用途。支持的值有 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

      - `"assistants"`

      - `"assistants_output"`

      - `"batch"`

      - `"batch_output"`

      - `"fine-tune"`

      - `"fine-tune-results"`

      - `"vision"`

      - `"user_data"`

    - `status: "uploaded" or "processed" or "error"`

      已弃用。文件的当前状态，可以为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件过期时的 Unix 时间戳（秒）。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败原因的详细信息，请参阅 `error` 字段上的 `fine_tuning.job`.

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

**发布** `/uploads/{upload_id}/complete`

完成 [上传](/docs/api-reference/uploads/object).

在返回的上传对象中，有一个嵌套的 [文件](/docs/api-reference/files/object) 对象，可直接用于平台的其余部分。

你可以通过传入零件ID的有序列表来指定零件的顺序。

完成时上传的字节数必须与创建上传对象时最初指定的字节数匹配。上传完成后不得添加任何零件。
返回带有状态的上传对象 `completed`，包括一个额外的 `file` 属性，其中包含所创建的可使用的文件对象。

### 路径参数

- `upload_id: string`

### 请求体参数

- `part_ids: array of string`

  Part ID 的有序列表。

- `md5: optional string`

  文件内容的可选 md5 校验和，用于验证上传的字节是否与你预期的一致。

### 返回

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Parts 的形式接受字节块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    拟上传的字节数。

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

    该 `File` 对象表示已上传至 OpenAI 的文档。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件的大小（以字节为单位）。

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

      文件过期时的 Unix 时间戳（以秒为单位）。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败原因的详细信息，请参阅 `error` 字段上的 `fine_tuning.job`.

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

创建一个中间 [Upload](/docs/api-reference/uploads/object) 对象
，你可以向其中添加 [Parts](/docs/api-reference/uploads/part-object) 。
目前，一个 Upload 最多可接受总共 8 GB 的数据，并在创建后
一小时过期。

一旦你完成 Upload，我们将创建一个
[File](/docs/api-reference/files/object) 对象，其中包含你上传的所有 parts
。这个 File 可以在我们平台的其余部分中像普通的
File 对象一样使用。

对于某些 `purpose` 值，必须指定正确的 `mime_type` 。
请参阅相关文档以了解
[适用于你的用例的支持 MIME 类型](/docs/assistants/tools/file-search#supported-files).

关于每种用途的正确文件扩展名指南，请
请遵循 [创建
文件](/docs/api-reference/files/create).

返回带有状态的 Upload 对象 `pending`.

### 请求体参数

- `bytes: number`

  你正在上传的文件中的字节数。

- `filename: string`

  要上传的文件名称。

- `mime_type: string`

  文件的 MIME 类型。

  此类型必须属于你的文件用途所支持的 MIME 类型。请参阅
  助手和视觉支持的 MIME 类型。

- `purpose: "assistants" or "batch" or "fine-tune" or "vision"`

  上传文件的预期用途。

  请参阅 [关于文件用途的文档
  用途](/docs/api-reference/files/create#files-create-purpose).

  - `"assistants"`

  - `"batch"`

  - `"fine-tune"`

  - `"vision"`

- `expires_after: optional object { anchor, seconds }`

  文件的过期策略。默认情况下，带有 `purpose=batch` 的文件在 30 天后过期，所有其他文件会一直保留，直到手动删除。

  - `anchor: "created_at"`

    过期策略开始生效的锚定时间戳。支持的锚点： `created_at`.

    - `"created_at"`

  - `seconds: number`

    文件在锚定时间之后多少秒过期。必须介于 3600（1 小时）和 2592000（30 天）之间。

### 返回

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以接受以 Parts 形式提供的字节块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    计划上传的字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（以秒为单位）。

  - `expires_at: number`

    Upload 过期时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    要上传的文件的名称。

  - `purpose: string`

    文件的预期用途。 [请参阅此处](/docs/api-reference/files/object#files/object-purpose) 以了解可接受的值。

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

      文件过期时的 Unix 时间戳（秒）。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败原因的详细信息，请参阅 `error` 字段，位于 `fine_tuning.job`.

  - `object: optional "upload"`

    对象类型，始终为 “upload”。

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

## 域类型

### 上传

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以接受以 Parts 形式出现的字节块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期上传的字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（以秒为单位）。

  - `expires_at: number`

    Upload 过期时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    要上传的文件的名称。

  - `purpose: string`

    文件的预期用途。 [请参阅此处](/docs/api-reference/files/object#files/object-purpose) 以了解可接受的值。

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

      文件的预期用途。支持的值有 `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`，以及 `user_data`.

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

      文件过期时的 Unix 时间戳（秒）。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败的详细原因，请参阅 `error` 字段，位于 `fine_tuning.job`.

  - `object: optional "upload"`

    对象类型，始终为 "upload"。

    - `"upload"`

# 部件

## 添加上传部件

**post** `/uploads/{upload_id}/parts`

向 [Part](/docs/api-reference/uploads/part-object) 添加 [Upload](/docs/api-reference/uploads/object) 对象。Part 表示你试图上传的文件中的字节块。

每个 Part 最大可为 64 MB，你可以添加 Parts，直到达到 Upload 的最大值 8 GB。

可以并行添加多个 Parts。你可以在 [完成 Upload](/docs/api-reference/uploads/complete).

### 路径参数

- `upload_id: string`

### 返回

- `UploadPart object { id, created_at, object, upload_id }`

  上传部分（Part）代表我们可以添加到上传对象（Upload）中的字节块。

  - `id: string`

    上传部分（Part）的唯一标识符，可在 API 端点中引用。

  - `created_at: number`

    创建该部分（Part）时的 Unix 时间戳（以秒为单位）。

  - `object: "upload.part"`

    对象类型，始终为 `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    该部分（Part）被添加到的上传对象（Upload）的 ID。

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

## 域类型

### 上传部分

- `UploadPart object { id, created_at, object, upload_id }`

  上传部分（Part）表示我们可以添加到上传对象（Upload）中的一块字节数据。

  - `id: string`

    上传部分（Part）的唯一标识符，可在 API 端点中引用。

  - `created_at: number`

    该部分创建时的 Unix 时间戳（以秒为单位）。

  - `object: "upload.part"`

    对象类型，始终为 `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    此部分被添加到的上传对象（Upload）的 ID。
