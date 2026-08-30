> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 取消聊天会话

**post** `/chatkit/sessions/{session_id}/cancel`

取消活动的 ChatKit 会话并返回其最新元数据。

取消后可阻止新请求使用已颁发的客户端密钥。

### 路径参数

- `session_id: string`

### 返回

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    为该会话解析的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动会话标题偏好设置。

      - `enabled: boolean`

        是否启用自动会话标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示该会话是否启用了上传。

      - `max_file_size: number or null`

        最大上传大小（以 MB 为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传数量。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话保留聊天历史记录。

      - `recent_threads: number or null`

        在历史记录视图中展示的过往会话数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于验证会话请求的临时客户端密钥。

  - `expires_at: number`

    会话过期的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    类型鉴别符，始终为 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    已解析的速率限制值。

    - `max_requests_per_1_minute: number`

      一分钟时间窗口内允许的最大请求数。

  - `status: ChatSessionStatus`

    会话的当前生命周期状态。

    - `"active"`

    - `"expired"`

    - `"cancelled"`

  - `user: string`

    与该会话关联的用户标识符。

  - `workflow: ChatKitWorkflow`

    会话的工作流元数据。

    - `id: string`

      支撑该会话的 工作流 的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用 工作流 时应用的状态变量键值对。如果未提供任何覆盖值，则默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于 工作流 的追踪设置。

      - `enabled: boolean`

        指示是否启用了 追踪。

    - `version: string or null`

      该会话使用的特定 工作流 版本。使用最新部署时默认为 null。

### 示例

```http
curl https://api.openai.com/v1/chatkit/sessions/$SESSION_ID/cancel \
    -X POST \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "chatkit_configuration": {
    "automatic_thread_titling": {
      "enabled": true
    },
    "file_upload": {
      "enabled": true,
      "max_file_size": 0,
      "max_files": 0
    },
    "history": {
      "enabled": true,
      "recent_threads": 0
    }
  },
  "client_secret": "client_secret",
  "expires_at": 0,
  "max_requests_per_1_minute": 0,
  "object": "chatkit.session",
  "rate_limits": {
    "max_requests_per_1_minute": 0
  },
  "status": "active",
  "user": "user",
  "workflow": {
    "id": "id",
    "state_variables": {
      "foo": "string"
    },
    "tracing": {
      "enabled": true
    },
    "version": "version"
  }
}
```

### 示例

```http
curl -X POST \
  https://api.openai.com/v1/chatkit/sessions/cksess_123/cancel \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "cksess_123",
  "object": "chatkit.session",
  "workflow": {
    "id": "workflow_alpha",
    "version": "1"
  },
  "scope": {
    "customer_id": "cust_456"
  },
  "max_requests_per_1_minute": 30,
  "ttl_seconds": 900,
  "status": "cancelled",
  "cancelled_at": 1712345678
}
```
