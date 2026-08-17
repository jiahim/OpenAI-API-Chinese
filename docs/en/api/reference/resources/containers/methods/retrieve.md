> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Retrieve container

**get** `/containers/{container_id}`

Retrieve Container

### Path Parameters

- `container_id: string`

### Returns

- `id: string`

  Unique identifier for the container.

- `created_at: number`

  Unix timestamp (in seconds) when the container was created.

- `name: string`

  Name of the container.

- `object: string`

  The type of this object.

- `status: string`

  Status of the container (e.g., active, deleted).

- `expires_after: optional object { anchor, minutes }`

  The container will expire after this time period.
  The anchor is the reference point for the expiration.
  The minutes is the number of minutes after the anchor before the container expires.

  - `anchor: optional "last_active_at"`

    The reference point for the expiration.

    - `"last_active_at"`

  - `minutes: optional number`

    The number of minutes after the anchor before the container expires.

- `last_active_at: optional number`

  Unix timestamp (in seconds) when the container was last active.

- `memory_limit: optional "1g" or "4g" or "16g" or "64g"`

  The memory limit configured for the container.

  - `"1g"`

  - `"4g"`

  - `"16g"`

  - `"64g"`

- `network_policy: optional object { type, allowed_domains }`

  Network access policy for the container.

  - `type: "allowlist" or "disabled"`

    The network policy mode.

    - `"allowlist"`

    - `"disabled"`

  - `allowed_domains: optional array of string`

    Allowed outbound domains when `type` is `allowlist`.

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "object",
  "status": "status",
  "expires_after": {
    "anchor": "last_active_at",
    "minutes": 0
  },
  "last_active_at": 0,
  "memory_limit": "1g",
  "network_policy": {
    "type": "allowlist",
    "allowed_domains": [
      "string"
    ]
  }
}
```

### Example

```http
curl https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
    "id": "cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863",
    "object": "container",
    "created_at": 1747844794,
    "status": "running",
    "expires_after": {
        "anchor": "last_active_at",
        "minutes": 20
    },
    "last_active_at": 1747844794,
    "memory_limit": "4g",
    "name": "My Container"
}
```
