> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 检索 ChatKit 会话线程

**get** `/chatkit/threads/{thread_id}`

根据标识符获取 ChatKit 会话线程。

### 路径参数

- `thread_id: string`

### 返回

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    会话的标识符。

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为的类型判别符 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    会话的当前状态。默认为 `active` ，适用于新建会话。

    - `Active object { type }`

      表示会话处于活动状态。

      - `type: "active"`

        始终为的状态判别符 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示会话已被锁定，无法接受新的输入。

      - `reason: string or null`

        会话被锁定的原因。若未记录原因，则默认为 null。

      - `type: "locked"`

        始终为的状态判别符 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示会话已被关闭。

      - `reason: string or null`

        会话被关闭的原因。若未记录原因，则默认为 null。

      - `type: "closed"`

        始终为的状态判别符 `closed`.

        - `"closed"`

  - `title: string or null`

    可选的人类可读会话标题。若尚未生成标题，则默认为 null。

  - `user: string`

    用于标识拥有该会话的最终用户的自由格式字符串。

### 示例

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
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
```

### 示例

```http
curl https://api.openai.com/v1/chatkit/threads/cthr_abc123 \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "cthr_abc123",
  "object": "chatkit.thread",
  "title": "Customer escalation",
  "items": {
    "data": [
      {
        "id": "cthi_user_001",
        "object": "chatkit.thread_item",
        "type": "user_message",
        "content": [
          {
            "type": "input_text",
            "text": "I need help debugging an onboarding issue."
          }
        ],
        "attachments": []
      },
      {
        "id": "cthi_assistant_002",
        "object": "chatkit.thread_item",
        "type": "assistant_message",
        "content": [
          {
            "type": "output_text",
            "text": "Let's start by confirming the workflow version you deployed."
          }
        ]
      }
    ],
    "has_more": false
  }
}
```
