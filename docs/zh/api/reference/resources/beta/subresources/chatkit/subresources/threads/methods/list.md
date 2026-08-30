> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 列出 ChatKit 会话

**get** `/chatkit/threads`

列出 ChatKit 会话线程，支持可选的分页和用户筛选。

### 查询参数

- `after: optional string`

  在此线程项 ID 之后创建的列表项。对于第一页，默认为 null。

- `before: optional string`

  在此线程项 ID 之前创建的列表项。对于最新结果，默认为 null。

- `limit: optional number`

  要返回的线程项的最大数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序的结果顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  筛选属于此用户标识符的线程。默认为 null，表示返回所有用户。

### Returns

- `data: array of ChatKitThread`

  一个列表项

  - `id: string`

    对话的标识符。

  - `created_at: number`

    对话创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    类型鉴别字段，始终为 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    对话的当前状态。新创建的对话默认为 `active` 。

    - `Active object { type }`

      表示对话处于活跃状态。

      - `type: "active"`

        状态鉴别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示对话已锁定，无法接受新的输入。

      - `reason: string or null`

        对话被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态鉴别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示对话已关闭。

      - `reason: string or null`

        对话被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态鉴别字段，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    对话的可选人类可读标题。尚未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该对话的最终用户的自由格式字符串。

- `first_id: string or null`

  列表中第一项的 ID。

- `has_more: boolean`

  是否还有更多可用项。

- `last_id: string or null`

  列表中最后一项的 ID。

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
      "title": "Customer escalation"
    },
    {
      "id": "cthr_def456",
      "object": "chatkit.thread",
      "title": "Demo feedback"
    }
  ],
  "has_more": false,
  "object": "list"
}
```
