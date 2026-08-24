> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete ChatKit thread

**delete** `/chatkit/threads/{thread_id}`

Delete a ChatKit thread along with its items and stored attachments.

### Path Parameters

- `thread_id: string`

### Returns

- `id: string`

  Identifier of the deleted thread.

- `deleted: boolean`

  Indicates that the thread has been deleted.

- `object: "chatkit.thread.deleted"`

  Type discriminator that is always `chatkit.thread.deleted`.

  - `"chatkit.thread.deleted"`

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "chatkit.thread.deleted"
}
```
