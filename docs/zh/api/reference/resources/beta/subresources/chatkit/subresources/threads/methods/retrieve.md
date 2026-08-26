> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 检索 ChatKit 线程

**get** `/chatkit/threads/{thread_id}`

按标识符检索 ChatKit 线程。

### 路径参数

- `thread_id: string`

### 返回

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 线程及其当前状态。

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    类型区分符，始终为 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    线程的当前状态。默认为 `active` ，适用于新建线程。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        状态区分符，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态区分符，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态区分符，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有线程的最终用户的自由格式字符串。

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
