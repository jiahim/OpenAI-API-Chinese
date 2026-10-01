# 会话

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需 Markdown 版本的文档页面，可在页面 URL 末尾附加 `.md` 来获取。

## 取消 ChatKit 会话

**post** `/chatkit/sessions/{session_id}/cancel`

取消一个处于活动状态的 ChatKit 会话，并返回其最近的元数据。

取消后，将阻止新请求使用已签发的客户端密钥。

### 路径参数

- `session_id: string`

### 返回值

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话已解析的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程标题偏好设置。

      - `enabled: boolean`

        是否启用自动线程标题。

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

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行身份验证的临时客户端密钥。

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

      支持该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。如果未提供覆盖，则默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用了追踪。

    - `version: string or null`

      用于该会话的特定工作流版本。使用最新部署时默认为 null。

### 示例

```http
curl https://api.openai.com/v1/chatkit/sessions/$SESSION_ID/cancel \
    -X POST \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cksess_123",
  "object": "chatkit.session",
  "client_secret": "",
  "expires_at": 1712349876,
  "workflow": {
    "id": "workflow_alpha",
    "version": "2024-10-01",
    "state_variables": {
      "message": "hello"
    },
    "tracing": {
      "enabled": true
    }
  },
  "user": "user_789",
  "rate_limits": {
    "max_requests_per_1_minute": 60
  },
  "max_requests_per_1_minute": 60,
  "status": "cancelled",
  "chatkit_configuration": {
    "automatic_thread_titling": {
      "enabled": true
    },
    "file_upload": {
      "enabled": true,
      "max_file_size": 16,
      "max_files": 20
    },
    "history": {
      "enabled": true,
      "recent_threads": 10
    }
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

#### Response

```json
{
  "id": "cksess_123",
  "object": "chatkit.session",
  "client_secret": "",
  "expires_at": 1735689600,
  "workflow": {
    "id": "workflow_alpha",
    "version": null,
    "state_variables": null,
    "tracing": {
      "enabled": true
    }
  },
  "user": "user_123",
  "rate_limits": {
    "max_requests_per_1_minute": 10
  },
  "max_requests_per_1_minute": 10,
  "status": "cancelled",
  "chatkit_configuration": {
    "automatic_thread_titling": {
      "enabled": true
    },
    "file_upload": {
      "enabled": false,
      "max_file_size": 512,
      "max_files": 10
    },
    "history": {
      "enabled": true,
      "recent_threads": null
    }
  }
}
```

## 创建 ChatKit 会话

**post** `/chatkit/sessions`

创建一个 ChatKit 会话。

### 请求体参数

- `user: string`

  用于标识最终用户的自由格式字符串；确保此 Session 可以访问具有相同 `user` scope。

- `workflow: ChatSessionWorkflowParam`

  驱动该会话的工作流。

  - `id: string`

    会话所调用 工作流 的标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发给 工作流 的状态变量。键最多 64 个字符，值必须为基本类型，映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    追踪 调用的可选 工作流 覆盖项。省略时，追踪 默认启用。

    - `enabled: optional boolean`

      会话期间是否启用 追踪。默认为 true。

  - `version: optional string`

    要运行的指定 工作流 版本。默认为最新部署的版本。

- `chatkit_configuration: optional ChatSessionChatKitConfigurationParam`

  ChatKit 运行时配置功能的可选覆盖项

  - `automatic_thread_titling: optional object { enabled }`

    自动线程标题配置。省略时，默认启用自动线程标题。

    - `enabled: optional boolean`

      启用自动线程标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。省略时，默认禁用上传（max_files 为 10，max_file_size 为 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以 MB 为单位）。默认为 512 MB，这也是允许的最大值。

    - `max_files: optional number`

      可上传至该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天记录保留配置。省略时，默认启用历史记录，recent_threads 不设上限（null）。

    - `enabled: optional boolean`

      允许聊天用户访问先前的 ChatKit 线程。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 线程数。未设置时默认为无限制。

- `expires_after: optional ChatSessionExpiresAfterParam`

  会话过期时间的可选覆盖项，以创建时起计的秒数表示。默认为 10 分钟。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。当前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    会话过期前距锚点的秒数。

- `rate_limits: optional ChatSessionRateLimitsParam`

  用于覆盖每分钟请求限制的可选参数。若省略，默认值为 10。

  - `max_requests_per_1_minute: optional number`

    会话允许的每分钟最大请求数。默认为 10。

### 返回值

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话已解析的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程标题偏好设置。

      - `enabled: boolean`

        是否启用自动线程标题。

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

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行身份验证的临时客户端密钥。

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

      支持该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。如果未提供覆盖，则默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

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

#### Response

```json
{
  "id": "cksess_123",
  "chatkit_configuration": {
    "automatic_thread_titling": {
      "enabled": true
    },
    "file_upload": {
      "enabled": true,
      "max_file_size": 16,
      "max_files": 20
    },
    "history": {
      "enabled": true,
      "recent_threads": 10
    }
  },
  "client_secret": "ek_token_123",
  "expires_at": 1712349876,
  "max_requests_per_1_minute": 60,
  "object": "chatkit.session",
  "rate_limits": {
    "max_requests_per_1_minute": 60
  },
  "status": "active",
  "user": "user_789",
  "workflow": {
    "id": "workflow_alpha",
    "state_variables": {
      "message": "hello"
    },
    "tracing": {
      "enabled": true
    },
    "version": "2024-10-01"
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
    "user": "user_123",
    "workflow": {"id": "workflow_alpha"}
  }'
```

#### Response

```json
{
  "id": "cksess_123",
  "object": "chatkit.session",
  "client_secret": "ek_example_00eyJleHBpcmVzX2F0IjogMTczNTY4OTYwMH0=",
  "expires_at": 1735689600,
  "workflow": {
    "id": "workflow_alpha",
    "version": null,
    "state_variables": null,
    "tracing": {
      "enabled": true
    }
  },
  "user": "user_123",
  "rate_limits": {
    "max_requests_per_1_minute": 10
  },
  "max_requests_per_1_minute": 10,
  "status": "active",
  "chatkit_configuration": {
    "automatic_thread_titling": {
      "enabled": true
    },
    "file_upload": {
      "enabled": false,
      "max_file_size": 512,
      "max_files": 10
    },
    "history": {
      "enabled": true,
      "recent_threads": null
    }
  }
}
```
