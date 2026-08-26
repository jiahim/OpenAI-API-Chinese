> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 添加上传部分

**post** `/uploads/{upload_id}/parts`

添加一个 [Part](/docs/api-reference/uploads/part-object) 到 [Upload](/docs/api-reference/uploads/object) 对象。Part 表示你尝试上传文件中的一段字节。

每个 Part 最大可为 64 MB，你可以添加 Parts，直到达到 Upload 的最大值 8 GB。

可以并行添加多个 Parts。你可以决定 Parts 的预期顺序，当你 [完成 Upload](/docs/api-reference/uploads/complete).

### 路径参数

- `upload_id: string`

### 返回值

- `UploadPart object { id, created_at, object, upload_id }`

  上传部分（Upload Part）表示可以添加到 Upload 对象中的字节块。

  - `id: string`

    上传部分的唯一标识符，可在 API 端点中引用。

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
