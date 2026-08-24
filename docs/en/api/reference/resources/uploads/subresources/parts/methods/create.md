> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Add upload part

**post** `/uploads/{upload_id}/parts`

Adds a [Part](/docs/api-reference/uploads/part-object) to an [Upload](/docs/api-reference/uploads/object) object. A Part represents a chunk of bytes from the file you are trying to upload.

Each Part can be at most 64 MB, and you can add Parts until you hit the Upload maximum of 8 GB.

It is possible to add multiple Parts in parallel. You can decide the intended order of the Parts when you [complete the Upload](/docs/api-reference/uploads/complete).

### Path Parameters

- `upload_id: string`

### Returns

- `UploadPart object { id, created_at, object, upload_id }`

  The upload Part represents a chunk of bytes we can add to an Upload object.

  - `id: string`

    The upload Part unique identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the Part was created.

  - `object: "upload.part"`

    The object type, which is always `upload.part`.

    - `"upload.part"`

  - `upload_id: string`

    The ID of the Upload object that this Part was added to.

### Example

```http
curl https://api.openai.com/v1/uploads/$UPLOAD_ID/parts \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'data=@/path/to/data'
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "object": "upload.part",
  "upload_id": "upload_id"
}
```

### Example

```http
curl https://api.openai.com/v1/uploads/upload_abc123/parts
  -F data="aHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS91cGxvYWRz..."
```

#### Response

```json
{
  "id": "part_def456",
  "object": "upload.part",
  "created_at": 1719185911,
  "upload_id": "upload_abc123"
}
```
