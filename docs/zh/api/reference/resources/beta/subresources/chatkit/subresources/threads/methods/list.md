> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面提供 Markdown 版本，可在页面 URL 后添加 `.md` 来获取。

## 列出 ChatKit 线程

**get** `/chatkit/threads`

使用可选分页和用户筛选器列出 ChatKit 线程。

### 查询参数

- `after: optional string`

  列出在该线程条目 ID 之后创建的条目。第一页默认为 null。

- `before: optional string`

  列出在该线程条目 ID 之前创建的条目。最新的结果默认为 null。

- `limit: optional number`

  要返回的线程条目最大数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间对结果进行排序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  筛选属于此用户标识符的线程。默认为 null 以返回所有用户。

### 返回

- `data: array of ChatKitThread`

  项目列表

  - `id: string`

    线程的标识符。

  - `created_at: number`

    创建线程时的 Unix 时间戳（秒）。

  - `object: "chatkit.thread"`

    始终为的类型判别器 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    线程的当前状态。默认为 `active` 对于新创建的线程。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        始终为的状态判别器 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        始终为的状态判别器 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        始终为的状态判别器 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    标识拥有线程的最终用户的自由格式字符串。

- `first_id: string or null`

  列表中第一个项目的 ID。

- `has_more: boolean`

  是否还有更多项目可用。

- `last_id: string or null`

  列表中最后一个项目的 ID。

- `object: "list"`

  返回的对象类型，必须为 `list`.

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
