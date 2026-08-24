> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Retrieve container file content

**get** `/containers/{container_id}/files/{file_id}/content`

Retrieve Container File Content

### Path Parameters

- `container_id: string`

- `file_id: string`

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Example

```http
curl https://api.openai.com/v1/containers/container_123/files/cfile_456/content \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
<binary content of the file>
```
