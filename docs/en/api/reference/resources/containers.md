# Containers

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Create container

**post** `/containers`

Create Container

### Body Parameters

- `name: string`

  Name of the container to create.

- `expires_after: optional object { anchor, minutes }`

  Container expiration time in seconds relative to the 'anchor' time.

  - `anchor: "last_active_at"`

    Time anchor for the expiration time. Currently only 'last_active_at' is supported.

    - `"last_active_at"`

  - `minutes: number`

- `file_ids: optional array of string`

  IDs of files to copy to the container.

- `memory_limit: optional "1g" or "4g" or "16g" or "64g"`

  Optional memory limit for the container. Defaults to "1g".

  - `"1g"`

  - `"4g"`

  - `"16g"`

  - `"64g"`

- `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

  Network access policy for the container.

  - `ContainerNetworkPolicyDisabled object { type }`

    - `type: "disabled"`

      Disable outbound network access. Always `disabled`.

      - `"disabled"`

  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

    - `allowed_domains: array of string`

      A list of allowed domains when type is `allowlist`.

    - `type: "allowlist"`

      Allow outbound network access only to specified domains. Always `allowlist`.

      - `"allowlist"`

    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

      Optional domain-scoped secrets for allowlisted domains.

      - `domain: string`

        The domain associated with the secret.

      - `name: string`

        The name of the secret to inject for the domain.

      - `value: string`

        The secret value to inject for the domain.

- `skills: optional array of SkillReference or InlineSkill`

  An optional list of skills referenced by id or inline data.

  - `SkillReference object { skill_id, type, version }`

    - `skill_id: string`

      The ID of the referenced skill.

    - `type: "skill_reference"`

      References a skill created with the /v1/skills endpoint.

      - `"skill_reference"`

    - `version: optional string`

      Optional skill version. Use a positive integer or 'latest'. Omit for default.

  - `InlineSkill object { description, name, source, type }`

    - `description: string`

      The description of the skill.

    - `name: string`

      The name of the skill.

    - `source: InlineSkillSource`

      Inline skill payload

      - `data: string`

        Base64-encoded skill zip bundle.

      - `media_type: "application/zip"`

        The media type of the inline skill payload. Must be `application/zip`.

        - `"application/zip"`

      - `type: "base64"`

        The type of the inline skill source. Must be `base64`.

        - `"base64"`

    - `type: "inline"`

      Defines an inline skill for this request.

      - `"inline"`

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
curl https://api.openai.com/v1/containers \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "name"
        }'
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
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "My Container",
        "memory_limit": "4g",
        "skills": [
          {
            "type": "skill_reference",
            "skill_id": "skill_4db6f1a2c9e73508b41f9da06e2c7b5f"
          },
          {
            "type": "skill_reference",
            "skill_id": "openai-spreadsheets",
            "version": "latest"
          }
        ],
        "network_policy": {
          "type": "allowlist",
          "allowed_domains": ["api.buildkite.com"]
        }
      }'
```

#### Response

```json
{
    "id": "cntr_682e30645a488191b6363a0cbefc0f0a025ec61b66250591",
    "object": "container",
    "created_at": 1747857508,
    "status": "running",
    "expires_after": {
        "anchor": "last_active_at",
        "minutes": 20
    },
    "last_active_at": 1747857508,
    "network_policy": {
        "type": "allowlist",
        "allowed_domains": ["api.buildkite.com"]
    },
    "memory_limit": "4g",
    "name": "My Container"
}
```

## Delete a container

**delete** `/containers/{container_id}`

Delete Container

### Path Parameters

- `container_id: string`

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Example

```http
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
    "id": "cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863",
    "object": "container.deleted",
    "deleted": true
}
```

## List containers

**get** `/containers`

List Containers

### Query Parameters

- `after: optional string`

  A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- `limit: optional number`

  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- `name: optional string`

  Filter results by container name.

- `order: optional "asc" or "desc"`

  Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of object { id, created_at, name, 6 more }`

  A list of containers.

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

- `first_id: string`

  The ID of the first container in the list.

- `has_more: boolean`

  Whether there are more containers available.

- `last_id: string`

  The ID of the last container in the list.

- `object: "list"`

  The type of object returned, must be 'list'.

  - `"list"`

### Example

```http
curl https://api.openai.com/v1/containers \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
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
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### Example

```http
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
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
  ],
  "first_id": "container_123",
  "last_id": "container_123",
  "has_more": false
}
```

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

## Domain Types

### Container Create Response

- `ContainerCreateResponse object { id, created_at, name, 6 more }`

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

### Container List Response

- `ContainerListResponse object { id, created_at, name, 6 more }`

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

### Container Retrieve Response

- `ContainerRetrieveResponse object { id, created_at, name, 6 more }`

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

# Files

## Create container file

**post** `/containers/{container_id}/files`

Create a Container File

You can send either a multipart/form-data request with the raw file content, or a JSON request with a file ID.

### Path Parameters

- `container_id: string`

### Body Parameters

- `file: optional string`

  The File object (not file name) to be uploaded.

- `file_id: optional string`

  Name of the file to create.

### Returns

- `id: string`

  Unique identifier for the file.

- `bytes: number`

  Size of the file in bytes.

- `container_id: string`

  The container this file belongs to.

- `created_at: number`

  Unix timestamp (in seconds) when the file was created.

- `object: string`

  The type of this object (`container.file`).

- `path: string`

  Path of the file in the container.

- `source: string`

  Source of the file (e.g., `user`, `assistant`).

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### Response

```json
{
  "id": "id",
  "bytes": 0,
  "container_id": "container_id",
  "created_at": 0,
  "object": "object",
  "path": "path",
  "source": "source"
}
```

### Example

```http
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@example.txt"
```

#### Response

```json
{
  "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
  "object": "container.file",
  "created_at": 1747848842,
  "bytes": 880,
  "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
  "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
  "source": "user"
}
```

## Delete a container file

**delete** `/containers/{container_id}/files/{file_id}`

Delete Container File

### Path Parameters

- `container_id: string`

- `file_id: string`

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Example

```http
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863/files/cfile_682e0e8a43c88191a7978f477a09bdf5 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
    "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "object": "container.file.deleted",
    "deleted": true
}
```

## List container files

**get** `/containers/{container_id}/files`

List Container files

### Path Parameters

- `container_id: string`

### Query Parameters

- `after: optional string`

  A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- `limit: optional number`

  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- `order: optional "asc" or "desc"`

  Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of object { id, bytes, container_id, 4 more }`

  A list of container files.

  - `id: string`

    Unique identifier for the file.

  - `bytes: number`

    Size of the file in bytes.

  - `container_id: string`

    The container this file belongs to.

  - `created_at: number`

    Unix timestamp (in seconds) when the file was created.

  - `object: string`

    The type of this object (`container.file`).

  - `path: string`

    Path of the file in the container.

  - `source: string`

    Source of the file (e.g., `user`, `assistant`).

- `first_id: string`

  The ID of the first file in the list.

- `has_more: boolean`

  Whether there are more files available.

- `last_id: string`

  The ID of the last file in the list.

- `object: "list"`

  The type of object returned, must be 'list'.

  - `"list"`

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "bytes": 0,
      "container_id": "container_id",
      "created_at": 0,
      "object": "object",
      "path": "path",
      "source": "source"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### Example

```http
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
    "object": "list",
    "data": [
        {
            "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
            "object": "container.file",
            "created_at": 1747848842,
            "bytes": 880,
            "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
            "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
            "source": "user"
        }
    ],
    "first_id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "has_more": false,
    "last_id": "cfile_682e0e8a43c88191a7978f477a09bdf5"
}
```

## Retrieve container file

**get** `/containers/{container_id}/files/{file_id}`

Retrieve Container File

### Path Parameters

- `container_id: string`

- `file_id: string`

### Returns

- `id: string`

  Unique identifier for the file.

- `bytes: number`

  Size of the file in bytes.

- `container_id: string`

  The container this file belongs to.

- `created_at: number`

  Unix timestamp (in seconds) when the file was created.

- `object: string`

  The type of this object (`container.file`).

- `path: string`

  Path of the file in the container.

- `source: string`

  Source of the file (e.g., `user`, `assistant`).

### Example

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "bytes": 0,
  "container_id": "container_id",
  "created_at": 0,
  "object": "object",
  "path": "path",
  "source": "source"
}
```

### Example

```http
curl https://api.openai.com/v1/containers/container_123/files/file_456 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
    "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "object": "container.file",
    "created_at": 1747848842,
    "bytes": 880,
    "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
    "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
    "source": "user"
}
```

## Domain Types

### File Create Response

- `FileCreateResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    Unique identifier for the file.

  - `bytes: number`

    Size of the file in bytes.

  - `container_id: string`

    The container this file belongs to.

  - `created_at: number`

    Unix timestamp (in seconds) when the file was created.

  - `object: string`

    The type of this object (`container.file`).

  - `path: string`

    Path of the file in the container.

  - `source: string`

    Source of the file (e.g., `user`, `assistant`).

### File List Response

- `FileListResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    Unique identifier for the file.

  - `bytes: number`

    Size of the file in bytes.

  - `container_id: string`

    The container this file belongs to.

  - `created_at: number`

    Unix timestamp (in seconds) when the file was created.

  - `object: string`

    The type of this object (`container.file`).

  - `path: string`

    Path of the file in the container.

  - `source: string`

    Source of the file (e.g., `user`, `assistant`).

### File Retrieve Response

- `FileRetrieveResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    Unique identifier for the file.

  - `bytes: number`

    Size of the file in bytes.

  - `container_id: string`

    The container this file belongs to.

  - `created_at: number`

    Unix timestamp (in seconds) when the file was created.

  - `object: string`

    The type of this object (`container.file`).

  - `path: string`

    Path of the file in the container.

  - `source: string`

    Source of the file (e.g., `user`, `assistant`).

# Content

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
