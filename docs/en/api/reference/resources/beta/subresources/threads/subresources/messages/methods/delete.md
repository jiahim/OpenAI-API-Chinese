> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete message

**delete** `/threads/{thread_id}/messages/{message_id}`

Deletes a message.

### Path Parameters

- `thread_id: string`

- `message_id: string`

### Returns

- `MessageDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.message.deleted"`

    - `"thread.message.deleted"`

### Example

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.message.deleted"
}
```

### Example

```http
curl -X DELETE https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### Response

```json
{
  "id": "msg_abc123",
  "object": "thread.message.deleted",
  "deleted": true
}
```
