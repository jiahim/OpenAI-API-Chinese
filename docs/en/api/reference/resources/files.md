# Files

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Retrieve file content

**get** `/files/{file_id}/content`

Returns a response containing the contents of the specified file.

### Path Parameters

- `file_id: string`

### Example

```http
curl https://api.openai.com/v1/files/$FILE_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Example

```http
curl https://api.openai.com/v1/files/file-abc123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > file.jsonl
```

## Upload file

**post** `/files`

Upload a file that can be used across various endpoints. Individual files
can be up to 512 MB, and each project can store up to 2.5 TB of files in
total. There is no organization-wide storage limit. Uploads to this
endpoint are rate-limited to 1,000 requests per minute per authenticated
user.

- The Assistants API supports files up to 2 million tokens and of specific
  file types. See the [Assistants Tools guide](/docs/assistants/tools) for
  details.
- The Fine-tuning API only supports `.jsonl` files. The input also has
  certain required formats for fine-tuning
  [chat](/docs/api-reference/fine-tuning/chat-input) or
  [completions](/docs/api-reference/fine-tuning/completions-input) models.
- The Batch API only supports `.jsonl` files up to 200 MB in size. The input
  also has a specific required
  [format](/docs/api-reference/batch/request-input).
- For Retrieval or `file_search` ingestion, upload files here first. If
  you need to attach multiple uploaded files to the same vector store, use
  [`/vector_stores/{vector_store_id}/file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch)
  instead of attaching them one by one. Vector store attachment has separate
  limits from file upload, including 2,000 attached files per minute per
  organization.

Please [contact us](https://help.openai.com/) if you need to increase these
storage limits.

### Returns

- `FileObject object { id, bytes, created_at, 6 more }`

  The `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.

### Example

```http
curl https://api.openai.com/v1/files \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F purpose=assistants
```

#### Response

```json
{
  "id": "id",
  "bytes": 0,
  "created_at": 0,
  "filename": "filename",
  "object": "file",
  "purpose": "assistants",
  "status": "uploaded",
  "expires_at": 0,
  "status_details": "status_details"
}
```

### Example

```http
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
  -F expires_after[anchor]="created_at"
  -F expires_after[seconds]=2592000
```

#### Response

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1677614202,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}
```

## Delete file

**delete** `/files/{file_id}`

Delete a file and remove it from all vector stores.

### Path Parameters

- `file_id: string`

### Returns

- `FileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "file"`

    - `"file"`

### Example

```http
curl https://api.openai.com/v1/files/$FILE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "file"
}
```

### Example

```http
curl https://api.openai.com/v1/files/file-abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "file-abc123",
  "object": "file",
  "deleted": true
}
```

## List files

**get** `/files`

Returns a list of files.

### Query Parameters

- `after: optional string`

  A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- `limit: optional number`

  A limit on the number of objects to be returned. Limit can range between 1 and 10,000, and the default is 10,000.

- `order: optional "asc" or "desc"`

  Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

  - `"asc"`

  - `"desc"`

- `purpose: optional string`

  Only return files with the given purpose.

### Returns

- `data: array of FileObject`

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### Example

```http
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "bytes": 0,
      "created_at": 0,
      "filename": "filename",
      "object": "file",
      "purpose": "assistants",
      "status": "uploaded",
      "expires_at": 0,
      "status_details": "status_details"
    }
  ],
  "first_id": "file-abc123",
  "has_more": false,
  "last_id": "file-abc456",
  "object": "list"
}
```

### Example

```http
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "file-abc123",
      "object": "file",
      "bytes": 175,
      "created_at": 1613677385,
      "expires_at": 1677614202,
      "filename": "salesOverview.pdf",
      "purpose": "assistants",
    },
    {
      "id": "file-abc456",
      "object": "file",
      "bytes": 140,
      "created_at": 1613779121,
      "expires_at": 1677614202,
      "filename": "puppy.jsonl",
      "purpose": "fine-tune",
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}
```

## Retrieve file

**get** `/files/{file_id}`

Returns information about a specific file.

### Path Parameters

- `file_id: string`

### Returns

- `FileObject object { id, bytes, created_at, 6 more }`

  The `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.

### Example

```http
curl https://api.openai.com/v1/files/$FILE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "bytes": 0,
  "created_at": 0,
  "filename": "filename",
  "object": "file",
  "purpose": "assistants",
  "status": "uploaded",
  "expires_at": 0,
  "status_details": "status_details"
}
```

### Example

```http
curl https://api.openai.com/v1/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "file-abc123",
  "object": "file",
  "bytes": 120000,
  "created_at": 1677610602,
  "expires_at": 1677614202,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune",
}
```

## Domain Types

### File Content

- `FileContent = string`

### File Deleted

- `FileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "file"`

    - `"file"`

### File Object

- `FileObject object { id, bytes, created_at, 6 more }`

  The `File` object represents a document that has been uploaded to OpenAI.

  - `id: string`

    The file identifier, which can be referenced in the API endpoints.

  - `bytes: number`

    The size of the file, in bytes.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the file was created.

  - `filename: string`

    The name of the file.

  - `object: "file"`

    The object type, which is always `file`.

    - `"file"`

  - `purpose: "assistants" or "assistants_output" or "batch" or 5 more`

    The intended purpose of the file. Supported values are `assistants`, `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`, `vision`, and `user_data`.

    - `"assistants"`

    - `"assistants_output"`

    - `"batch"`

    - `"batch_output"`

    - `"fine-tune"`

    - `"fine-tune-results"`

    - `"vision"`

    - `"user_data"`

  - `status: "uploaded" or "processed" or "error"`

    Deprecated. The current status of the file, which can be either `uploaded`, `processed`, or `error`.

    - `"uploaded"`

    - `"processed"`

    - `"error"`

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the file will expire.

  - `status_details: optional string`

    Deprecated. For details on why a fine-tuning training file failed validation, see the `error` field on `fine_tuning.job`.
