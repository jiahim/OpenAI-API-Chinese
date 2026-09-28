> 如需完整文档索引，请参阅 [llms.txt](/llms.txt). 可在页面 URL 末尾追加 `.md` 以获取该页面的 Markdown 版本。

## 列出 ChatKit 会话

**get** `/chatkit/threads`

列出 ChatKit 会话线程，支持可选的分页和用户筛选条件。

### 查询参数

- `after: optional string`

  在此线程项目 ID 之后创建的列表项。首页默认为 null。

- `before: optional string`

  在此线程项目 ID 之前创建的列表项。用于获取最新结果时默认为 null。

- `limit: optional number`

  要返回的线程项目最大数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序的结果顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  筛选属于此用户标识符的线程。默认为 null 以返回所有用户。

### 返回值

- `data: array of ChatKitThread`

  项目列表

  - `id: string`

    会话的标识符。

  - `created_at: number`

    会话创建时的 Unix 时间戳（单位：秒）。

  - `object: "chatkit.thread"`

    类型区分符，恒为 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    会话的当前状态。新建会话默认为 `active` 。

    - `Active object { type }`

      表示会话处于活跃状态。

      - `type: "active"`

        状态区分符，恒为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示会话已锁定，无法接受新的输入。

      - `reason: string or null`

        会话被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态区分符，恒为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示会话已关闭。

      - `reason: string or null`

        会话被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态区分符，恒为 `closed`.

        - `"closed"`

  - `title: string or null`

    可选的、人类可读的会话标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该会话的终端用户的自由格式字符串。

- `first_id: string or null`

  列表中第一个项目的 ID。

- `has_more: boolean`

  是否还有更多项目可用。

- `last_id: string or null`

  列表中最后一个项目的 ID。

- `object: "list"`

  返回对象的类型，必须为 `list`.

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/chatkit/threads \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "cthr_def456",
      "created_at": 1712345600,
      "object": "chatkit.thread",
      "status": {
        "type": "active"
      },
      "title": "Demo feedback",
      "user": "user_456"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl "https://api.openai.com/v1/chatkit/threads?limit=2&order=desc" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "cthr_abc123",
      "object": "chatkit.thread",
      "title": "Customer escalation",
      "created_at": 1712345600,
      "status": {
        "type": "active"
      },
      "user": "user_123"
    },
    {
      "id": "cthr_def456",
      "object": "chatkit.thread",
      "title": "Demo feedback",
      "created_at": 1712345600,
      "status": {
        "type": "active"
      },
      "user": "user_456"
    }
  ],
  "has_more": false,
  "object": "list",
  "first_id": "cthr_abc123",
  "last_id": "cthr_def456"
}
```
