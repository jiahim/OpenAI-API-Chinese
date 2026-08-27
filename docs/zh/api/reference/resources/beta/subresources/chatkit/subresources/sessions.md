# 会话

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 取消聊天会话

**post** `/chatkit/sessions/{session_id}/cancel`

取消一个活动的 ChatKit 会话并返回其最新的元数据。

取消操作会阻止新请求使用已发放的客户端密钥。

### 路径参数

- `session_id: string`

### 返回

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    会话的已解析 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程标题设置。

      - `enabled: boolean`

        是否启用自动线程标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否启用上传功能。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示会话的聊天历史记录是否持久化。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于认证会话请求的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    类型判别器，始终为 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    已解析的速率限制值。

    - `max_requests_per_1_minute: number`

      一分钟窗口内允许的最大请求数。

  - `status: ChatSessionStatus`

    会话的当前生命周期状态。

    - `"active"`

    - `"expired"`

    - `"cancelled"`

  - `user: string`

    与会话关联的用户标识符。

  - `workflow: ChatKitWorkflow`

    会话的工作流元数据。

    - `id: string`

      支撑该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。未提供覆盖时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用追踪。

    - `version: string or null`

      会话使用的特定工作流版本。使用最新部署时默认为 null。

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

## 创建 ChatKit 会话

**post** `/chatkit/sessions`

创建一个 ChatKit 会话。

### 请求体参数

- `user: string`

  一个自由格式字符串，用于标识你的最终用户；确保此会话可以访问其他具有相同 `user` scope 的对象。

- `workflow: ChatSessionWorkflowParam`

  驱动会话的工作流。

  - `id: string`

    会话调用的 工作流 的标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发给 工作流 的状态变量。键最长可为 64 个字符，值必须是原始类型，映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    追踪调用的可选 工作流覆盖项。省略时，追踪默认启用。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

- `chatkit_configuration: optional ChatSessionChatKitConfigurationParam`

  ChatKit 运行时配置功能的可选覆盖项

  - `automatic_thread_titling: optional object { enabled }`

    自动线程标题的配置。省略时，自动线程标题默认启用。

    - `enabled: optional boolean`

      启用自动线程标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用和限制的配置。省略时，上传默认禁用（max_files 10，max_file_size 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以兆字节为单位）。默认为 512 MB，这也是允许的最大大小。

    - `max_files: optional number`

      可上传到会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天历史保留的配置。省略时，历史默认启用，且不限制 recent_threads（null）。

    - `enabled: optional boolean`

      允许聊天用户访问之前的 ChatKit 线程。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 线程数。未设置时默认为无限制。

- `expires_after: optional ChatSessionExpiresAfterParam`

  可选覆盖项，用于设置自创建以来的会话过期时间（秒）。默认为 10 分钟。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。目前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    锚点之后会话过期的秒数。

- `rate_limits: optional ChatSessionRateLimitsParam`

  每分钟请求限制的可选覆盖。省略时默认为10。

  - `max_requests_per_1_minute: optional number`

    会话每分钟允许的最大请求数。默认值为10。

### 返回

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其解析后的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    会话的已解析 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程标题偏好设置。

      - `enabled: boolean`

        是否启用自动线程标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否允许上传。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示会话的聊天历史记录是否持久化。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于验证会话请求的临时客户端密钥。

  - `expires_at: number`

    会话过期的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    方便使用的每分钟请求限制副本。

  - `object: "chatkit.session"`

    始终为 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    已解析的速率限制值。

    - `max_requests_per_1_minute: number`

      一分钟窗口内允许的最大请求数。

  - `status: ChatSessionStatus`

    会话的当前生命周期状态。

    - `"active"`

    - `"expired"`

    - `"cancelled"`

  - `user: string`

    会话关联的用户标识符。

  - `workflow: ChatKitWorkflow`

    会话的工作流元数据。

    - `id: string`

      支持该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。当未提供覆盖项时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用追踪。

    - `version: string or null`

      会话使用的特定工作流版本。当使用最新部署时默认为 null。

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
