> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete vector store

**delete** `/vector_stores/{vector_store_id}`

Delete a vector store.

### Path Parameters

- `vector_store_id: string`

### Returns

- `VectorStoreDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.deleted"`

    - `"vector_store.deleted"`

### Example

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "vector_store.deleted"
}
```

### Example

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### Response

```json
{
  id: "vs_abc123",
  object: "vector_store.deleted",
  deleted: true
}
```
