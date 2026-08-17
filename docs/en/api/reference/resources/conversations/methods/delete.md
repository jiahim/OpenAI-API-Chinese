> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete a conversation

**delete** `/conversations/{conversation_id}`

Delete a conversation. Items in the conversation will not be deleted.

### Path Parameters

- `conversation_id: string`

### Returns

- `ConversationDeletedResource object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "conversation.deleted"`

    - `"conversation.deleted"`

### Example

```http
curl https://api.openai.com/v1/conversations/$CONVERSATION_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "conversation.deleted"
}
```

### Example

```http
curl -X DELETE https://api.openai.com/v1/conversations/conv_123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "conv_123",
  "object": "conversation.deleted",
  "deleted": true
}
```
