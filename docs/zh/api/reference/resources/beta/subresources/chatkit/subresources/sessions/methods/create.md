> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 创建 ChatKit 会话

**post** `/chatkit/sessions`

创建 ChatKit 会话。

### 请求体参数

- `user: string`

  用于标识最终用户的自由格式字符串；确保此会话能够访问具有相同 `user` 作用域的其他对象。

- `workflow: ChatSessionWorkflowParam`

  驱动该会话的工作流。

  - `id: string`

    会话所调用的工作流标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发给工作流的状态变量。键最多 64 个字符，值必须是原始类型，且该映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    用于工作流调用的可选追踪覆盖项。未指定时，追踪默认启用。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

- `chatkit_configuration: optional ChatSessionChatKitConfigurationParam`

  ChatKit 运行时配置功能的可选覆盖项

  - `automatic_thread_titling: optional object { enabled }`

    自动会话标题配置。未指定时，自动会话标题默认启用。

    - `enabled: optional boolean`

      启用自动会话标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。未指定时，上传默认禁用（max_files 为 10，max_file_size 为 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以 MB 为单位）。默认为 512 MB，这也是允许的最大大小。

    - `max_files: optional number`

      可上传到该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天历史保留配置。未指定时，历史记录默认启用，recent_threads 无限制（null）。

    - `enabled: optional boolean`

      允许聊天用户访问之前的 ChatKit 会话。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 会话数量。未设置时默认为无限制。

- `expires_after: optional ChatSessionExpiresAfterParam`

  会话过期时间的可选覆盖项（自创建起的秒数）。默认为 10 分钟。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。当前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    在锚点之后会话过期的秒数。

- `rate_limits: optional ChatSessionRateLimitsParam`

  可选的每分钟请求限制覆盖值。省略时默认为 10。

  - `max_requests_per_1_minute: optional number`

    会话每分钟允许的最大请求数。默认为 10。

### Returns

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话已解析的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动会话主题命名偏好。

      - `enabled: boolean`

        是否启用自动会话主题命名。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示该会话是否允许上传。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传数量。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示该会话是否持久化聊天历史。

      - `recent_threads: number or null`

        在历史记录视图中展示的先前会话数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于认证会话请求的临时客户端密钥。

  - `expires_at: number`

    会话过期的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为的类型判别字段 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    已解析的速率限制值。

    - `max_requests_per_1_minute: number`

      一分钟窗口内允许的最大请求数。

  - `status: ChatSessionStatus`

    会话当前的生命周期状态。

    - `"active"`

    - `"expired"`

    - `"cancelled"`

  - `user: string`

    与会话关联的用户标识符。

  - `workflow: ChatKitWorkflow`

    会话的工作流元数据。

    - `id: string`

      支撑该会话的工作流标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。如果未提供覆盖，则默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于该工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用了追踪。

    - `version: string or null`

      用于该会话的特定工作流版本。使用最新部署时默认为 null。

### 示例

```http
curl https://api.openai.com/v1/chatkit/sessions \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "user": "x",
          "workflow": {
            "id": "id"
          }
        }'
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
curl https://api.openai.com/v1/chatkit/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -d '{
    "workflow": {
      "id": "workflow_alpha",
      "version": "2024-10-01"
    },
    "scope": {
      "project": "alpha",
      "environment": "staging"
    },
    "expires_after": 1800,
    "max_requests_per_1_minute": 60,
    "max_requests_per_session": 500
  }'
```

#### 响应

```json
{
  "client_secret": "chatkit_token_123",
  "expires_at": 1735689600,
  "workflow": {
    "id": "workflow_alpha",
    "version": "2024-10-01"
  },
  "scope": {
    "project": "alpha",
    "environment": "staging"
  },
  "max_requests_per_1_minute": 60,
  "max_requests_per_session": 500,
  "status": "active"
}
```
