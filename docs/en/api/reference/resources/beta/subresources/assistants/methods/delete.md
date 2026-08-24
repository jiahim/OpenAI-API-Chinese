> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete assistant

**delete** `/assistants/{assistant_id}`

Delete an assistant.

### Path Parameters

- `assistant_id: string`

### Returns

- `AssistantDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "assistant.deleted"`

    - `"assistant.deleted"`

### Example

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "assistant.deleted"
}
```

### Example

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### Response

```json
{
  "id": "asst_abc123",
  "object": "assistant.deleted",
  "deleted": true
}
```
