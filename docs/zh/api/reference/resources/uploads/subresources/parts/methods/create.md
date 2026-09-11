> 完整文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## Add upload part

**post** `/uploads/{upload_id}/parts`

将一个 [Part](/api/reference/resources/uploads/subresources/parts) 添加到 [Upload](/api/reference/resources/uploads) 对象。一个 Part 表示你要上传的文件中的一块字节数据。

每个 Part 最大为 64 MB，你可以不断添加 Parts，直到达到 Upload 的上限 8 GB。

可以并行添加多个 Parts。你可以在 [完成 Upload](/api/reference/resources/uploads/methods/complete).

### 路径参数

- `upload_id: string`

### 返回

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
