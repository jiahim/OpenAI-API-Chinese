# ChatKit

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## Domain Types

### ChatKit Workflow

- `ChatKitWorkflow object { id, state_variables, tracing, version }`

  会话返回的工作流元数据和状态。

  - `id: string`

    支撑该会话的工作流标识符。

  - `state_variables: map[string or boolean or number] or null`

    调用工作流时应用的状态变量键值对。未提供覆盖时默认为 null。

    - `string`

    - `boolean`

    - `number`

  - `tracing: object { enabled }`

    应用于工作流的追踪设置。

    - `enabled: boolean`

      指示追踪是否启用。

  - `version: string or null`

    会话使用的特定工作流版本。使用最新部署时默认为 null。

# Sessions

## 取消 ChatKit 会话

**post** `/chatkit/sessions/{session_id}/cancel`

取消一个活跃的 ChatKit 会话，并返回其最新的元数据。

取消后，已签发的客户端密钥将无法再用于发起新请求。

### 路径参数

- `session_id: string`

### 返回值

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其解析后的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话解析后的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程命名偏好设置。

      - `enabled: boolean`

        是否启用自动线程命名。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示是否为该会话启用上传。

      - `max_file_size: number or null`

        最大上传大小（以 MB 为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行身份验证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为以下值的类型判别符 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    解析后的速率限制值。

    - `max_requests_per_1_minute: number`

      每个一分钟窗口内允许的最大请求数。

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

      调用工作流时应用的状态变量键值对。未提供覆盖时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示追踪是否启用。

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

#### 响应

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

  用于标识你的最终用户的自由格式字符串；可确保此会话能够访问具有相同 `user` 作用域的对象。

- `workflow: ChatSessionWorkflowParam`

  驱动该会话的工作流。

  - `id: string`

    会话所调用工作流的标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发到该工作流的状态变量。键最多 64 个字符，值必须为基本类型，且该映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    对工作流调用的可选追踪覆盖项。当省略时，默认启用追踪。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

- `chatkit_configuration: optional ChatSessionChatKitConfigurationParam`

  ChatKit 运行时配置功能的可选覆盖项

  - `automatic_thread_titling: optional object { enabled }`

    自动会话标题生成配置。当省略时，默认启用自动会话标题生成。

    - `enabled: optional boolean`

      启用自动会话标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。当省略时，默认禁用上传（max_files 为 10，max_file_size 为 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以 MB 为单位）。默认为 512 MB，这也是允许的最大值。

    - `max_files: optional number`

      可上传到该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天记录保留配置。当省略时，默认启用历史记录，且 recent_threads 不设上限（null）。

    - `enabled: optional boolean`

      允许聊天用户访问先前的 ChatKit 会话。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 会话数量。未设置时默认为无限制。

- `expires_after: optional ChatSessionExpiresAfterParam`

  会话过期时间的可选覆盖项，以自创建起计算的秒数表示。默认为 10 分钟。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。目前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    从锚点开始计算，session 过期的秒数。

- `rate_limits: optional ChatSessionRateLimitsParam`

  可选的每分钟请求上限覆盖。省略时默认为 10。

  - `max_requests_per_1_minute: optional number`

    session 每分钟允许的最大请求数。默认为 10。

### 返回值

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其解析后的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话解析后的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程命名偏好设置。

      - `enabled: boolean`

        是否启用自动线程命名。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示是否为该会话启用上传。

      - `max_file_size: number or null`

        最大上传大小（以 MB 为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行身份验证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为以下值的类型判别符 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    解析后的速率限制值。

    - `max_requests_per_1_minute: number`

      每个一分钟窗口内允许的最大请求数。

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

      调用工作流时应用的状态变量键值对。未提供覆盖时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示追踪是否启用。

    - `version: string or null`

      会话使用的特定工作流版本。使用最新部署时默认为 null。

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

#### 响应

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

# 线程

## 删除 ChatKit 线程

**delete** `/chatkit/threads/{thread_id}`

删除一个 ChatKit 会话及其条目和已存储的附件。

### 路径参数

- `thread_id: string`

### 返回值

- `id: string`

  已删除线程的标识符。

- `deleted: boolean`

  表示该线程已被删除。

- `object: "chatkit.thread.deleted"`

  始终为以下值的类型判别符 `chatkit.thread.deleted`.

  - `"chatkit.thread.deleted"`

### 示例

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "chatkit.thread.deleted"
}
```

## 列出 ChatKit 会话

**get** `/chatkit/threads`

列出 ChatKit 会话，支持可选的分页和用户筛选条件。

### 查询参数

- `after: optional string`

  在此线程项 ID 之后创建的列表项。对于第一页，默认值为 null。

- `before: optional string`

  在此线程项 ID 之前创建的列表项。对于最新结果，默认值为 null。

- `limit: optional number`

  要返回的最大线程项数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序结果的方式。默认为 `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  筛选属于此用户标识符的线程。默认为 null 以返回所有用户。

### 返回值

- `data: array of ChatKitThread`

  一个项列表

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为以下值的类型判别符 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: Active { type }  or Locked { reason, type }  or Closed { reason, type }`

    线程的当前状态。对于新创建的线程，默认为 `active` 。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    标识拥有该线程的最终用户的自由格式字符串。

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

## 列出 ChatKit 线程项

**get** `/chatkit/threads/{thread_id}/items`

列出属于某个 ChatKit 线程的项目。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  在此线程项 ID 之后创建的列表项。对于第一页，默认值为 null。

- `before: optional string`

  在此线程项 ID 之前创建的列表项。对于最新结果，默认值为 null。

- `limit: optional number`

  要返回的最大线程项数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序结果的方式。默认为 `desc`.

  - `"asc"`

  - `"desc"`

### 返回值

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    一个项列表

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      线程中由用户撰写的消息。

      - `id: string`

        线程项的标识符。

      - `attachments: array of ChatKitAttachment`

        与用户消息关联的附件。默认为空列表。

        - `id: string`

          附件的标识符。

        - `mime_type: string`

          附件的 MIME 类型。

        - `name: string`

          附件的原始显示名称。

        - `preview_url: string or null`

          用于内联渲染附件的预览 URL。

        - `type: "image" or "file"`

          附件判别字段。

          - `"image"`

          - `"file"`

      - `content: array of InputText { text, type }  or QuotedText { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            由用户提供的纯文本内容。

          - `type: "input_text"`

            始终为以下值的类型判别符 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为以下值的类型判别符 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖配置。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。在 ChatKit 应自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      线程中由 Assistant 撰写的消息。

      - `id: string`

        线程项的标识符。

      - `content: array of ChatKitResponseOutputText`

        有序的 Assistant 响应片段。

        - `annotations: array of File { source, type }  or URL { source, type }`

          附加到响应文本的有序注释列表。

          - `File object { source, type }`

            引用已上传文件的注释。

            - `source: object { filename, type }`

              注释引用的文件附件。

              - `filename: string`

                注释引用的文件名。

              - `type: "file"`

                始终为以下值的类型判别符 `file`.

                - `"file"`

            - `type: "file"`

              类型判别字段，固定为 `file` 。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注释。

            - `source: object { type, url }`

              注释引用的 URL。

              - `type: "url"`

                始终为以下值的类型判别符 `url`.

                - `"url"`

              - `url: string`

                注释引用的 URL。

            - `type: "url"`

              类型判别字段，固定为 `url` 。

              - `"url"`

        - `text: string`

          Assistant 生成的文本。

        - `type: "output_text"`

          始终为以下值的类型判别符 `output_text`.

          - `"output_text"`

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为以下值的类型判别符 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于呈现 widget 负载的线程项。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为以下值的类型判别符 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中呈现的序列化 widget 负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      由 Assistant 发起的客户端工具调用记录。

      - `id: string`

        线程项的标识符。

      - `arguments: string`

        发送给工具的 JSON 编码参数。

      - `call_id: string`

        客户端工具调用的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为以下值的类型判别符 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由 工作流 发出的任务，用于显示进度和状态更新。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `summary: string or null`

        描述任务的可选摘要。省略时默认为 null。

      - `task_type: "custom" or "thought"`

        任务的子类型。

        - `"custom"`

        - `"thought"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.task"`

        始终为以下值的类型判别符 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在线程中分组到一起的工作流任务集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        分组中包含的任务。

        - `heading: string or null`

          分组任务的可选标题。未提供时默认为 null。

        - `summary: string or null`

          描述分组任务的可选摘要。省略时默认为 null。

        - `type: "custom" or "thought"`

          分组任务的子类型。

          - `"custom"`

          - `"thought"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.task_group"`

        始终为以下值的类型判别符 `chatkit.task_group`.

        - `"chatkit.task_group"`

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
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID/items \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "attachments": [
        {
          "id": "id",
          "mime_type": "mime_type",
          "name": "name",
          "preview_url": "https://example.com",
          "type": "image"
        }
      ],
      "content": [
        {
          "text": "text",
          "type": "input_text"
        }
      ],
      "created_at": 0,
      "inference_options": {
        "model": "model",
        "tool_choice": {
          "id": "id"
        }
      },
      "object": "chatkit.thread_item",
      "thread_id": "thread_id",
      "type": "chatkit.user_message"
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
curl "https://api.openai.com/v1/chatkit/threads/cthr_abc123/items?limit=3" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "cthi_user_001",
      "object": "chatkit.thread_item",
      "type": "chatkit.user_message",
      "content": [
        {
          "type": "input_text",
          "text": "I need help debugging an onboarding issue."
        }
      ],
      "attachments": [],
      "created_at": 1712345600,
      "thread_id": "cthr_abc123",
      "inference_options": null
    },
    {
      "id": "cthi_assistant_002",
      "object": "chatkit.thread_item",
      "type": "chatkit.assistant_message",
      "content": [
        {
          "type": "output_text",
          "text": "Let's start by confirming the workflow version you deployed.",
          "annotations": []
        }
      ],
      "created_at": 1712345601,
      "thread_id": "cthr_abc123"
    }
  ],
  "has_more": false,
  "object": "list",
  "first_id": "cthi_user_001",
  "last_id": "cthi_assistant_002"
}
```

## 检索 ChatKit 会话线程

**get** `/chatkit/threads/{thread_id}`

通过标识符获取 ChatKit 线程。

### 路径参数

- `thread_id: string`

### 返回值

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为以下值的类型判别符 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: Active { type }  or Locked { reason, type }  or Closed { reason, type }`

    线程的当前状态。对于新创建的线程，默认为 `active` 。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    标识拥有该线程的最终用户的自由格式字符串。

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
  "created_at": 1712345600,
  "status": {
    "type": "active"
  },
  "user": "user_123"
}
```

## Domain Types

### 聊天会话

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其解析后的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话解析后的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程命名偏好设置。

      - `enabled: boolean`

        是否启用自动线程命名。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示是否为该会话启用上传。

      - `max_file_size: number or null`

        最大上传大小（以 MB 为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行身份验证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为以下值的类型判别符 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    解析后的速率限制值。

    - `max_requests_per_1_minute: number`

      每个一分钟窗口内允许的最大请求数。

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

      调用工作流时应用的状态变量键值对。未提供覆盖时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示追踪是否启用。

    - `version: string or null`

      会话使用的特定工作流版本。使用最新部署时默认为 null。

### 聊天会话自动主题命名

- `ChatSessionAutomaticThreadTitling object { enabled }`

  本会话的自动会话标题偏好设置。

  - `enabled: boolean`

    是否启用自动线程命名。

### Chat Session ChatKit Configuration

- `ChatSessionChatKitConfiguration object { automatic_thread_titling, file_upload, history }`

  该会话的 ChatKit 配置。

  - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

    自动线程命名偏好设置。

    - `enabled: boolean`

      是否启用自动线程命名。

  - `file_upload: ChatSessionFileUpload`

    会话的上传设置。

    - `enabled: boolean`

      指示是否为该会话启用上传。

    - `max_file_size: number or null`

      最大上传大小（以 MB 为单位）。

    - `max_files: number or null`

      会话期间允许的最大上传次数。

  - `history: ChatSessionHistory`

    历史记录保留配置。

    - `enabled: boolean`

      指示是否为该会话持久化聊天历史记录。

    - `recent_threads: number or null`

      历史记录视图中显示的先前线程数量。保留所有历史记录时，默认为 null。

### Chat Session ChatKit Configuration Param

- `ChatSessionChatKitConfigurationParam object { automatic_thread_titling, file_upload, history }`

  可选的会话级 ChatKit 行为配置设置。

  - `automatic_thread_titling: optional object { enabled }`

    自动会话标题生成配置。当省略时，默认启用自动会话标题生成。

    - `enabled: optional boolean`

      启用自动会话标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。当省略时，默认禁用上传（max_files 为 10，max_file_size 为 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以 MB 为单位）。默认为 512 MB，这也是允许的最大值。

    - `max_files: optional number`

      可上传到该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天记录保留配置。当省略时，默认启用历史记录，且 recent_threads 不设上限（null）。

    - `enabled: optional boolean`

      允许聊天用户访问先前的 ChatKit 会话。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 会话数量。未设置时默认为无限制。

### 聊天会话在 Param 之后过期

- `ChatSessionExpiresAfterParam object { anchor, seconds }`

  控制会话相对于锚点时间戳的过期时间。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。目前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    从锚点开始计算，session 过期的秒数。

### 聊天会话文件上传

- `ChatSessionFileUpload object { enabled, max_file_size, max_files }`

  应用于会话的上传权限和限制。

  - `enabled: boolean`

    指示是否为该会话启用上传。

  - `max_file_size: number or null`

    最大上传大小（以 MB 为单位）。

  - `max_files: number or null`

    会话期间允许的最大上传次数。

### 聊天会话历史

- `ChatSessionHistory object { enabled, recent_threads }`

  为该会话返回的历史记录保留偏好设置。

  - `enabled: boolean`

    指示是否为该会话持久化聊天历史记录。

  - `recent_threads: number or null`

    历史记录视图中显示的先前线程数量。保留所有历史记录时，默认为 null。

### 聊天会话速率限制

- `ChatSessionRateLimits object { max_requests_per_1_minute }`

  当前会话每分钟的活跃请求上限。

  - `max_requests_per_1_minute: number`

    每个一分钟窗口内允许的最大请求数。

### Chat Session Rate Limits Param

- `ChatSessionRateLimitsParam object { max_requests_per_1_minute }`

  控制会话的请求速率限制。

  - `max_requests_per_1_minute: optional number`

    session 每分钟允许的最大请求数。默认为 10。

### 聊天会话状态

- `ChatSessionStatus = "active" or "expired" or "cancelled"`

  - `"active"`

  - `"expired"`

  - `"cancelled"`

### 聊天会话工作流参数

- `ChatSessionWorkflowParam object { id, state_variables, tracing, version }`

  应用于聊天会话的工作流引用和覆盖。

  - `id: string`

    会话所调用工作流的标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发到该工作流的状态变量。键最多 64 个字符，值必须为基本类型，且该映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    对工作流调用的可选追踪覆盖项。当省略时，默认启用追踪。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

### ChatKit Attachment

- `ChatKitAttachment object { id, mime_type, name, 2 more }`

  附加在线程条目上的附件元数据。

  - `id: string`

    附件的标识符。

  - `mime_type: string`

    附件的 MIME 类型。

  - `name: string`

    附件的原始显示名称。

  - `preview_url: string or null`

    用于内联渲染附件的预览 URL。

  - `type: "image" or "file"`

    附件判别字段。

    - `"image"`

    - `"file"`

### ChatKit Response Output Text

- `ChatKitResponseOutputText object { annotations, text, type }`

  助手响应文本，可附带可选的注解。

  - `annotations: array of File { source, type }  or URL { source, type }`

    附加到响应文本的有序注释列表。

    - `File object { source, type }`

      引用已上传文件的注释。

      - `source: object { filename, type }`

        注释引用的文件附件。

        - `filename: string`

          注释引用的文件名。

        - `type: "file"`

          始终为以下值的类型判别符 `file`.

          - `"file"`

      - `type: "file"`

        类型判别字段，固定为 `file` 。

        - `"file"`

    - `URL object { source, type }`

      引用 URL 的注释。

      - `source: object { type, url }`

        注释引用的 URL。

        - `type: "url"`

          始终为以下值的类型判别符 `url`.

          - `"url"`

        - `url: string`

          注释引用的 URL。

      - `type: "url"`

        类型判别字段，固定为 `url` 。

        - `"url"`

  - `text: string`

    Assistant 生成的文本。

  - `type: "output_text"`

    始终为以下值的类型判别符 `output_text`.

    - `"output_text"`

### ChatKit Thread

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为以下值的类型判别符 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: Active { type }  or Locked { reason, type }  or Closed { reason, type }`

    线程的当前状态。对于新创建的线程，默认为 `active` 。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    标识拥有该线程的最终用户的自由格式字符串。

### ChatKit Thread Assistant Message Item

- `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

  线程中由 Assistant 撰写的消息。

  - `id: string`

    线程项的标识符。

  - `content: array of ChatKitResponseOutputText`

    有序的 Assistant 响应片段。

    - `annotations: array of File { source, type }  or URL { source, type }`

      附加到响应文本的有序注释列表。

      - `File object { source, type }`

        引用已上传文件的注释。

        - `source: object { filename, type }`

          注释引用的文件附件。

          - `filename: string`

            注释引用的文件名。

          - `type: "file"`

            始终为以下值的类型判别符 `file`.

            - `"file"`

        - `type: "file"`

          类型判别字段，固定为 `file` 。

          - `"file"`

      - `URL object { source, type }`

        引用 URL 的注释。

        - `source: object { type, url }`

          注释引用的 URL。

          - `type: "url"`

            始终为以下值的类型判别符 `url`.

            - `"url"`

          - `url: string`

            注释引用的 URL。

        - `type: "url"`

          类型判别字段，固定为 `url` 。

          - `"url"`

    - `text: string`

      Assistant 生成的文本。

    - `type: "output_text"`

      始终为以下值的类型判别符 `output_text`.

      - `"output_text"`

  - `created_at: number`

    项创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    始终为以下值的类型判别符 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.assistant_message"`

    始终为以下值的类型判别符 `chatkit.assistant_message`.

    - `"chatkit.assistant_message"`

### ChatKit Thread Item List

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    一个项列表

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      线程中由用户撰写的消息。

      - `id: string`

        线程项的标识符。

      - `attachments: array of ChatKitAttachment`

        与用户消息关联的附件。默认为空列表。

        - `id: string`

          附件的标识符。

        - `mime_type: string`

          附件的 MIME 类型。

        - `name: string`

          附件的原始显示名称。

        - `preview_url: string or null`

          用于内联渲染附件的预览 URL。

        - `type: "image" or "file"`

          附件判别字段。

          - `"image"`

          - `"file"`

      - `content: array of InputText { text, type }  or QuotedText { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            由用户提供的纯文本内容。

          - `type: "input_text"`

            始终为以下值的类型判别符 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为以下值的类型判别符 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖配置。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。在 ChatKit 应自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      线程中由 Assistant 撰写的消息。

      - `id: string`

        线程项的标识符。

      - `content: array of ChatKitResponseOutputText`

        有序的 Assistant 响应片段。

        - `annotations: array of File { source, type }  or URL { source, type }`

          附加到响应文本的有序注释列表。

          - `File object { source, type }`

            引用已上传文件的注释。

            - `source: object { filename, type }`

              注释引用的文件附件。

              - `filename: string`

                注释引用的文件名。

              - `type: "file"`

                始终为以下值的类型判别符 `file`.

                - `"file"`

            - `type: "file"`

              类型判别字段，固定为 `file` 。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注释。

            - `source: object { type, url }`

              注释引用的 URL。

              - `type: "url"`

                始终为以下值的类型判别符 `url`.

                - `"url"`

              - `url: string`

                注释引用的 URL。

            - `type: "url"`

              类型判别字段，固定为 `url` 。

              - `"url"`

        - `text: string`

          Assistant 生成的文本。

        - `type: "output_text"`

          始终为以下值的类型判别符 `output_text`.

          - `"output_text"`

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为以下值的类型判别符 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于呈现 widget 负载的线程项。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为以下值的类型判别符 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中呈现的序列化 widget 负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      由 Assistant 发起的客户端工具调用记录。

      - `id: string`

        线程项的标识符。

      - `arguments: string`

        发送给工具的 JSON 编码参数。

      - `call_id: string`

        客户端工具调用的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为以下值的类型判别符 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由 工作流 发出的任务，用于显示进度和状态更新。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `summary: string or null`

        描述任务的可选摘要。省略时默认为 null。

      - `task_type: "custom" or "thought"`

        任务的子类型。

        - `"custom"`

        - `"thought"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.task"`

        始终为以下值的类型判别符 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在线程中分组到一起的工作流任务集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别符 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        分组中包含的任务。

        - `heading: string or null`

          分组任务的可选标题。未提供时默认为 null。

        - `summary: string or null`

          描述分组任务的可选摘要。省略时默认为 null。

        - `type: "custom" or "thought"`

          分组任务的子类型。

          - `"custom"`

          - `"thought"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.task_group"`

        始终为以下值的类型判别符 `chatkit.task_group`.

        - `"chatkit.task_group"`

  - `first_id: string or null`

    列表中第一项的 ID。

  - `has_more: boolean`

    是否还有更多可用项。

  - `last_id: string or null`

    列表中最后一项的 ID。

  - `object: "list"`

    返回对象的类型，必须为 `list`.

    - `"list"`

### ChatKit Thread User Message Item

- `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

  线程中由用户撰写的消息。

  - `id: string`

    线程项的标识符。

  - `attachments: array of ChatKitAttachment`

    与用户消息关联的附件。默认为空列表。

    - `id: string`

      附件的标识符。

    - `mime_type: string`

      附件的 MIME 类型。

    - `name: string`

      附件的原始显示名称。

    - `preview_url: string or null`

      用于内联渲染附件的预览 URL。

    - `type: "image" or "file"`

      附件判别字段。

      - `"image"`

      - `"file"`

  - `content: array of InputText { text, type }  or QuotedText { text, type }`

    由用户提供的有序内容元素。

    - `InputText object { text, type }`

      用户向线程贡献的文本块。

      - `text: string`

        由用户提供的纯文本内容。

      - `type: "input_text"`

        始终为以下值的类型判别符 `input_text`.

        - `"input_text"`

    - `QuotedText object { text, type }`

      用户在消息中引用的引用片段。

      - `text: string`

        引用的文本内容。

      - `type: "quoted_text"`

        始终为以下值的类型判别符 `quoted_text`.

        - `"quoted_text"`

  - `created_at: number`

    项创建时的 Unix 时间戳（以秒为单位）。

  - `inference_options: object { model, tool_choice }  or null`

    应用于消息的推理覆盖配置。未设置时默认为 null。

    - `model: string or null`

      生成响应的模型名称。使用会话默认值时默认为 null。

    - `tool_choice: object { id }  or null`

      首选调用的工具。在 ChatKit 应自动选择时默认为 null。

      - `id: string`

        所请求工具的标识符。

  - `object: "chatkit.thread_item"`

    始终为以下值的类型判别符 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.user_message"`

    - `"chatkit.user_message"`

### ChatKit Widget Item

- `ChatKitWidgetItem object { id, created_at, object, 3 more }`

  用于呈现 widget 负载的线程项。

  - `id: string`

    线程项的标识符。

  - `created_at: number`

    项创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    始终为以下值的类型判别符 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.widget"`

    始终为以下值的类型判别符 `chatkit.widget`.

    - `"chatkit.widget"`

  - `widget: string`

    在 UI 中呈现的序列化 widget 负载。

### Thread Delete Response

- `ThreadDeleteResponse object { id, deleted, object }`

  删除会话后返回的确认载荷。

  - `id: string`

    已删除线程的标识符。

  - `deleted: boolean`

    表示该线程已被删除。

  - `object: "chatkit.thread.deleted"`

    始终为以下值的类型判别符 `chatkit.thread.deleted`.

    - `"chatkit.thread.deleted"`
