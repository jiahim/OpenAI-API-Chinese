> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete thread

**delete** `/threads/{thread_id}`

Delete a thread.

### Path Parameters

- `thread_id: string`

### Returns

- `ThreadDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.deleted"`

    - `"thread.deleted"`

### Example

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.deleted"
}
```

### Example

```http
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### Response

```json
{
  "id": "thread_abc123",
  "object": "thread.deleted",
  "deleted": true
}
```
