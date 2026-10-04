> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## 取消上传

**post** `/uploads/{upload_id}/cancel`

取消该 Upload。Upload 被取消后不能再添加任何 Part。

返回带有状态的 Upload 对象 `cancelled`.

### 路径参数

- `upload_id: string`

### 返回

- `Upload object { id, bytes, created_at, 6 more }`

  Upload 对象可以以 Parts 的形式接收字节分块。

  - `id: string`

    Upload 的唯一标识符，可在 API 端点中引用。

  - `bytes: number`

    预期要上传的字节数。

  - `created_at: number`

    Upload 创建时的 Unix 时间戳（以秒为单位）。

  - `expires_at: number`

    Upload 到期时的 Unix 时间戳（以秒为单位）。

  - `filename: string`

    要上传的文件名。

  - `purpose: string`

    该文件的预期用途。 [请参考此处](/api/reference/resources/files#%28resource%29%20files%20%3E%20%28model%29%20file_object%20%3E%20%28schema%29%20%3E%20%28property%29%20purpose) 了解可接受的值。

  - `status: "pending" or "completed" or "cancelled" or "expired"`

    Upload 的状态。

    - `"pending"`

    - `"completed"`

    - `"cancelled"`

    - `"expired"`

  - `file: optional FileObject or null`

    上传完成后处于就绪状态的 File 对象。

    - `id: string`

      文件标识符，可在 API 端点中引用。

    - `bytes: number`

      文件的字节大小。在已完成的文件上传响应中，当文件大小尚不可用时，此字段可能
      为 null。

    - `created_at: number`

      文件创建时的 Unix 时间戳（单位为秒）。

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

      已弃用。文件的当前状态，可为 `uploaded`, `processed`，或 `error`.

      - `"uploaded"`

      - `"processed"`

      - `"error"`

    - `expires_at: optional number`

      文件将过期的 Unix 时间戳（以秒为单位）。在
      已完成的文件上传响应中，当未设置过期时间时，此字段可为 null。

    - `status_details: optional string`

      已弃用。有关微调训练文件验证失败原因的详细信息，请参阅 `error` 字段，位于 `fine_tuning.job`。当这些详细信息未设置时，已完成的文件上传响应可以返回 null。

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
