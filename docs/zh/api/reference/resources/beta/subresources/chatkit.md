# ChatKit

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 域类型

### ChatKit 工作流

- `ChatKitWorkflow object { id, state_variables, tracing, version }`

  工作流元数据和会话返回的状态。

  - `id: string`

    支持该会话的工作流的标识符。

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

# 会话

## 取消聊天会话

**post** `/chatkit/sessions/{session_id}/cancel`

取消一个活动的 ChatKit 会话，并返回其最近的元数据。

取消将阻止新请求使用已颁发的客户端密钥。

### 路径参数

- `session_id: string`

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

        指示会话是否启用了上传功能。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示会话的聊天历史记录是否被持久化。

      - `recent_threads: number or null`

        历史视图中显示的先前线程数量。当保留所有历史时默认为 null。

  - `client_secret: string`

    用于认证会话请求的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    已解析的速率限制值。

    - `max_requests_per_1_minute: number`

      每分钟窗口内允许的最大请求数。

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

      支持该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。未提供覆盖项时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于该工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用了追踪。

    - `version: string or null`

      会话所使用的特定工作流版本。使用最新部署时默认为 null。

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

  一个自由格式字符串，用于标识你的最终用户；确保此会话可以访问其他具有相同 `user` 作用域的对象。

- `workflow: ChatSessionWorkflowParam`

  驱动会话的工作流。

  - `id: string`

    会话调用的工作流的标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发给工作流的状态变量。键最多可有 64 个字符，值必须是原始类型，映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    可选的追踪覆盖设置，用于工作流调用。省略时，默认启用追踪。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

- `chatkit_configuration: optional ChatSessionChatKitConfigurationParam`

  ChatKit 运行时配置功能的可选覆盖设置

  - `automatic_thread_titling: optional object { enabled }`

    自动线程标题的配置。省略时，默认启用自动线程标题。

    - `enabled: optional boolean`

      启用自动线程标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用及其限制的配置。省略时，上传默认禁用（max_files 10，max_file_size 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以兆字节为单位）。默认为 512 MB，这是允许的最大大小。

    - `max_files: optional number`

      可上传到会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天历史记录的保留配置。省略时，历史记录默认启用，且 recent_threads 无限制（null）。

    - `enabled: optional boolean`

      使聊天用户能够访问之前的 ChatKit 线程。默认为 true。

    - `recent_threads: optional number`

      用户可访问的近期 ChatKit 线程数量。未设置时默认为无限制。

- `expires_after: optional ChatSessionExpiresAfterParam`

  会话过期时间（从创建起以秒计）的可选覆盖设置。默认为 10 分钟。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。目前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    锚点后会话过期的秒数。

- `rate_limits: optional ChatSessionRateLimitsParam`

  每分钟请求限制的可选覆盖值。省略时默认为 10。

  - `max_requests_per_1_minute: optional number`

    会话每分钟允许的最大请求数。默认为 10。

### 返回

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    会话的已解析 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程命名偏好。

      - `enabled: boolean`

        是否启用自动线程命名。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否启用上传。

      - `max_file_size: number or null`

        以兆字节为单位的最大上传大小。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示会话的聊天历史记录是否持久化。

      - `recent_threads: number or null`

        历史视图中的先前线程数。保留全部历史时默认为 null。

  - `client_secret: string`

    用于验证会话请求的临时客户端密钥。

  - `expires_at: number`

    会话到期时间的 Unix 时间戳（秒）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    类型判别器始终为 `chatkit.session`.

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

    与会话关联的用户标识符。

  - `workflow: ChatKitWorkflow`

    会话的工作流元数据。

    - `id: string`

      支持该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用工作流时应用的状态变量键值对。当未提供覆盖项时，默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用追踪。

    - `version: string or null`

      会话使用的特定工作流版本。当使用最新部署时，默认为 null。

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

# 线程

## 删除 ChatKit 线程

**删除** `/chatkit/threads/{thread_id}`

删除一个 ChatKit 线程及其条目和存储的附件。

### 路径参数

- `thread_id: string`

### 返回

- `id: string`

  已删除线程的标识符。

- `deleted: boolean`

  表示该线程已被删除。

- `object: "chatkit.thread.deleted"`

  类型判别器，始终为 `chatkit.thread.deleted`.

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

## 列出 ChatKit 线程

**get** `/chatkit/threads`

列出 ChatKit 线程，支持可选的分页和用户筛选。

### 查询参数

- `after: optional string`

  列出在该线程项 ID 之后创建的项。第一页默认为 null。

- `before: optional string`

  列出在该线程项 ID 之前创建的项。最新结果默认为 null。

- `limit: optional number`

  要返回的线程项的最大数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间对结果进行排序的顺序。默认为 `desc`.

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

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    类型判别器，始终为 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    线程的当前状态。默认值为 `active` 对于新创建的线程。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        状态判别器，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已被锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态判别器，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已被关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态判别器，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该线程的最终用户的自由格式字符串。

- `first_id: string or null`

  列表中第一个项目的 ID。

- `has_more: boolean`

  是否还有更多可用项目。

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

## 列出 ChatKit 线程条目

**get** `/chatkit/threads/{thread_id}/items`

列出属于 ChatKit 线程的项目。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  在此线程项 ID 之后创建的列表项。默认在第一页中为 null。

- `before: optional string`

  在此线程项 ID 之前创建的列表项。默认为最新结果中的 null。

- `limit: optional number`

  要返回的线程项的最大数量。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间对结果进行排序的顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

### 返回

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的分页线程条目列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    条目列表

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      线程中用户撰写的消息。

      - `id: string`

        线程条目的标识符。

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

          附件鉴别器。

          - `"image"`

          - `"file"`

      - `content: array of object { text, type }  or object { text, type }`

        用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户贡献到线程的文本块。

          - `text: string`

            用户提供的纯文本内容。

          - `type: "input_text"`

            类型鉴别器，始终为 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            类型鉴别器，始终为 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        条目创建时的 Unix 时间戳（秒）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。当 ChatKit 应自动选择时默认值为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      线程中由助手撰写的消息。

      - `id: string`

        线程项的标识符。

      - `content: array of ChatKitResponseOutputText`

        有序的助手响应片段。

        - `annotations: array of object { source, type }  or object { source, type }`

          附加到响应文本的注释有序列表。

          - `File object { source, type }`

            引用已上传文件的注释。

            - `source: object { filename, type }`

              注释引用的文件附件。

              - `filename: string`

                注释引用的文件名。

              - `type: "file"`

                类型判别器，始终为 `file`.

                - `"file"`

            - `type: "file"`

              类型判别器，始终为 `file` 此注释的类型。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注释。

            - `source: object { type, url }`

              注释引用的 URL。

              - `type: "url"`

                类型判别器，始终为 `url`.

                - `"url"`

              - `url: string`

                注释引用的 URL。

            - `type: "url"`

              类型判别器，始终为 `url` 此注释的类型。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          始终为的类型判别器 `output_text`.

          - `"output_text"`

      - `created_at: number`

        项目创建时的 Unix 时间戳（秒）。

      - `object: "chatkit.thread_item"`

        始终为的类型判别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为的类型判别器 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      渲染小组件负载的线程项目。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        项目创建时的 Unix 时间戳（秒）。

      - `object: "chatkit.thread_item"`

        始终为的类型判别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为的类型判别器 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在界面中渲染的序列化小组件负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      由助手发起的客户端工具调用的记录。

      - `id: string`

        线程项目的标识符。

      - `arguments: string`

        发送给工具的 JSON 编码参数。

      - `call_id: string`

        客户端工具调用的标识符。

      - `created_at: number`

        项目创建时的 Unix 时间戳（秒）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为的类型判别器 `chatkit.thread_item`.

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

        类型判别器，始终为 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由 工作流 发出的任务，用于显示进度和状态更新。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项目创建时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

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

        类型判别器，始终为 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      线程中 工作流 任务的集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        组中包含的任务。

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

        始终为 `chatkit.task_group`.

        - `"chatkit.task_group"`

  - `first_id: string or null`

    列表中第一个条目的 ID。

  - `has_more: boolean`

    是否还有更多条目可用。

  - `last_id: string or null`

    列表中最后一个条目的 ID。

  - `object: "list"`

    返回的对象类型，必须为 `list`.

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
  "has_more": false,
  "object": "list"
}
```

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

    类型判别器，始终为 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    线程的当前状态。默认为 `active` 对于新创建的线程。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        状态判别器，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态判别器，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态判别器，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该线程的最终用户的自由格式字符串。

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

## 领域类型

### 聊天会话

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其解析后的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话的 ChatKit 功能配置解析结果。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程标题设置。

      - `enabled: boolean`

        是否启用自动线程标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否启用上传。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示会话是否持久保存聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数。当保留所有历史记录时默认为 null。

  - `client_secret: string`

    为会话请求进行身份验证的临时客户端密钥。

  - `expires_at: number`

    会话过期的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    类型鉴别器，始终为 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    解析后的速率限制值。

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

      支持该会话的工作流的标识符。

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

      用于会话的特定工作流版本。使用最新部署时默认为 null。

### 聊天会话自动线程标题

- `ChatSessionAutomaticThreadTitling object { enabled }`

  会话的自动线程标题偏好。

  - `enabled: boolean`

    是否启用自动线程标题。

### 聊天会话 ChatKit 配置

- `ChatSessionChatKitConfiguration object { automatic_thread_titling, file_upload, history }`

  会话的ChatKit配置。

  - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

    自动线程标题偏好。

    - `enabled: boolean`

      是否启用了自动线程标题。

  - `file_upload: ChatSessionFileUpload`

    会话的上传设置。

    - `enabled: boolean`

      指示会话是否启用了上传功能。

    - `max_file_size: number or null`

      最大上传大小（以兆字节为单位）。

    - `max_files: number or null`

      会话期间允许的最大上传次数。

  - `history: ChatSessionHistory`

    历史记录保留配置。

    - `enabled: boolean`

      指示会话是否持久化聊天历史记录。

    - `recent_threads: number or null`

      历史视图中显示的先前线程数量。保留全部历史记录时默认为null。

### 聊天会话 ChatKit 配置参数

- `ChatSessionChatKitConfigurationParam object { automatic_thread_titling, file_upload, history }`

  ChatKit行为的可选按会话配置设置。

  - `automatic_thread_titling: optional object { enabled }`

    自动线程标题的配置。省略时，默认启用自动线程标题。

    - `enabled: optional boolean`

      启用自动线程标题生成。默认为true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用和限制的配置。省略时，上传默认禁用（max_files 10，max_file_size 512 MB）。

    - `enabled: optional boolean`

      为本次会话启用上传。默认为false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以兆字节为单位）。默认为512 MB，这是允许的最大大小。

    - `max_files: optional number`

      可上传到会话的最大文件数。默认为10。

  - `history: optional object { enabled, recent_threads }`

    聊天历史保留的配置。省略时，默认启用历史记录，且对recent_threads无限制（null）。

    - `enabled: optional boolean`

      允许聊天用户访问以前的ChatKit线程。默认为true。

    - `recent_threads: optional number`

      用户可访问的最近ChatKit线程数量。未设置时默认为无限制。

### 聊天会话在参数之后过期

- `ChatSessionExpiresAfterParam object { anchor, seconds }`

  控制会话相对于锚点时间戳的过期时间。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。当前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    锚点之后会话过期的秒数。

### 聊天会话文件上传

- `ChatSessionFileUpload object { enabled, max_file_size, max_files }`

  应用于会话的上传权限和限制。

  - `enabled: boolean`

    指示该会话是否启用了上传功能。

  - `max_file_size: number or null`

    最大上传大小（以兆字节为单位）。

  - `max_files: number or null`

    会话期间允许的最大上传次数。

### 聊天会话历史

- `ChatSessionHistory object { enabled, recent_threads }`

  为会话返回的历史记录保留偏好。

  - `enabled: boolean`

    指示聊天历史记录是否针对会话持久化。

  - `recent_threads: number or null`

    在历史视图中显示的先前线程数量。当保留所有历史记录时，默认为 null。

### 聊天会话速率限制

- `ChatSessionRateLimits object { max_requests_per_1_minute }`

  会话的每分钟活跃请求限制。

  - `max_requests_per_1_minute: number`

    一分钟窗口内允许的最大请求数。

### 聊天会话速率限制参数

- `ChatSessionRateLimitsParam object { max_requests_per_1_minute }`

  控制会话的请求速率限制。

  - `max_requests_per_1_minute: optional number`

    会话每分钟允许的最大请求数。默认为 10。

### 聊天会话状态

- `ChatSessionStatus = "active" or "expired" or "cancelled"`

  - `"active"`

  - `"expired"`

  - `"cancelled"`

### 聊天会话工作流参数

- `ChatSessionWorkflowParam object { id, state_variables, tracing, version }`

  应用于聊天会话的工作流引用和覆盖设置。

  - `id: string`

    会话所调用的工作流的标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发到工作流的状态变量。键最长可为 64 个字符，值必须是原始类型，映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    针对追踪调用的可选工作流覆盖设置。省略时，追踪默认启用。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

### ChatKit 附件

- `ChatKitAttachment object { id, mime_type, name, 2 more }`

  线程项目上包含的附件元数据。

  - `id: string`

    附件的标识符。

  - `mime_type: string`

    附件的 MIME 类型。

  - `name: string`

    附件的原始显示名称。

  - `preview_url: string or null`

    用于内联渲染附件的预览 URL。

  - `type: "image" or "file"`

    附件判别器。

    - `"image"`

    - `"file"`

### ChatKit 响应输出文本

- `ChatKitResponseOutputText object { annotations, text, type }`

  助手响应文本，附带可选的注释。

  - `annotations: array of object { source, type }  or object { source, type }`

    附加到响应文本的注释的有序列表。

    - `File object { source, type }`

      引用上传文件的注释。

      - `source: object { filename, type }`

        注释引用的文件附件。

        - `filename: string`

          注释引用的文件名。

        - `type: "file"`

          类型判别器，始终为 `file`.

          - `"file"`

      - `type: "file"`

        类型判别器，始终为 `file` 用于此注释。

        - `"file"`

    - `URL object { source, type }`

      引用 URL 的注释。

      - `source: object { type, url }`

        注释引用的 URL。

        - `type: "url"`

          类型判别器，始终为 `url`.

          - `"url"`

        - `url: string`

          注释引用的 URL。

      - `type: "url"`

        类型判别器，始终为 `url` 用于此注释。

        - `"url"`

  - `text: string`

    助手生成的文本。

  - `type: "output_text"`

    类型判别器，始终为 `output_text`.

    - `"output_text"`

### ChatKit 线程

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 线程及其当前状态。

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    类型判别器，始终为 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    线程的当前状态。默认为 `active` 用于新创建的线程。

    - `Active object { type }`

      指示线程处于活动状态。

      - `type: "active"`

        状态判别器，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      指示线程已锁定且无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态判别器，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      指示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态判别器，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该线程的最终用户的自由格式字符串。

### ChatKit 线程助手消息项

- `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

  线程中由助手撰写的消息。

  - `id: string`

    线程项的标识符。

  - `content: array of ChatKitResponseOutputText`

    有序的助手响应片段。

    - `annotations: array of object { source, type }  or object { source, type }`

      附加到响应文本的注释的有序列表。

      - `File object { source, type }`

        引用已上传文件的注释。

        - `source: object { filename, type }`

          注释引用的文件附件。

          - `filename: string`

            注释引用的文件名。

          - `type: "file"`

            类型判别器，始终为 `file`.

            - `"file"`

        - `type: "file"`

          类型判别器，始终为 `file` 用于此注释。

          - `"file"`

      - `URL object { source, type }`

        引用 URL 的注释。

        - `source: object { type, url }`

          注释引用的 URL。

          - `type: "url"`

            类型判别器，始终为 `url`.

            - `"url"`

          - `url: string`

            注释引用的 URL。

        - `type: "url"`

          类型判别器，始终为 `url` 用于此注释。

          - `"url"`

    - `text: string`

      助手生成的文本。

    - `type: "output_text"`

      类型判别器，始终为 `output_text`.

      - `"output_text"`

  - `created_at: number`

    项创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    类型判别器，始终为 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.assistant_message"`

    类型判别器，始终为 `chatkit.assistant_message`.

    - `"chatkit.assistant_message"`

### ChatKit Thread 条目列表

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    项目列表

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      线程中用户撰写的消息。

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

          附件判别器。

          - `"image"`

          - `"file"`

      - `content: array of object { text, type }  or object { text, type }`

        用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户贡献给线程的文本块。

          - `text: string`

            用户提供的纯文本内容。

          - `type: "input_text"`

            类型判别器，始终为 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            类型判别器，始终为 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        项目创建时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。当 ChatKit 应自动选择时，默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      线程中由助手撰写的消息。

      - `id: string`

        线程项的标识符。

      - `content: array of ChatKitResponseOutputText`

        有序的助手响应片段。

        - `annotations: array of object { source, type }  or object { source, type }`

          附加到响应文本的注释的有序列表。

          - `File object { source, type }`

            引用已上传文件的注释。

            - `source: object { filename, type }`

              注释引用的文件附件。

              - `filename: string`

                注释引用的文件名。

              - `type: "file"`

                类型判别器，始终为 `file`.

                - `"file"`

            - `type: "file"`

              类型判别器，始终为 `file` 此注释的类型。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注释。

            - `source: object { type, url }`

              注释引用的 URL。

              - `type: "url"`

                类型判别器，始终为 `url`.

                - `"url"`

              - `url: string`

                注释引用的 URL。

            - `type: "url"`

              类型判别器，始终为 `url` 此注释的类型。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          类型判别器，始终为 `output_text`.

          - `"output_text"`

      - `created_at: number`

        项目创建时的 Unix 时间戳（秒）。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        类型判别器，始终为 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      渲染小部件负载的线程项。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项目创建时的 Unix 时间戳（秒）。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        类型判别器，始终为 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中渲染的序列化小部件负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      由助手发起的客户端工具调用的记录。

      - `id: string`

        线程项的标识符。

      - `arguments: string`

        发送给工具的 JSON 编码参数。

      - `call_id: string`

        客户端工具调用的标识符。

      - `created_at: number`

        项目创建时的 Unix 时间戳（秒）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

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

        类型判别器，始终为 `chatkit.client_tool_call`.

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

        类型判别器，始终为 `chatkit.thread_item`.

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

        类型判别器，始终为 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      线程中分组的 工作流 任务集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        类型判别器，始终为 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        组中包含的任务。

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

        类型判别器，始终 `chatkit.task_group`.

        - `"chatkit.task_group"`

  - `first_id: string or null`

    列表中第一项的 ID。

  - `has_more: boolean`

    是否还有更多项可用。

  - `last_id: string or null`

    列表中最后一项的 ID。

  - `object: "list"`

    返回的对象类型，必须为 `list`.

    - `"list"`

### ChatKit 线程用户消息条目

- `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

  线程中用户编写的消息。

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

      附件判别器。

      - `"image"`

      - `"file"`

  - `content: array of object { text, type }  or object { text, type }`

    用户提供的有序内容元素。

    - `InputText object { text, type }`

      用户贡献到线程的文本块。

      - `text: string`

        用户提供的纯文本内容。

      - `type: "input_text"`

        类型判别器，始终为 `input_text`.

        - `"input_text"`

    - `QuotedText object { text, type }`

      用户在消息中引用的引用片段。

      - `text: string`

        引用文本内容。

      - `type: "quoted_text"`

        类型判别器，始终为 `quoted_text`.

        - `"quoted_text"`

  - `created_at: number`

    创建该项时的 Unix 时间戳（秒）。

  - `inference_options: object { model, tool_choice }  or null`

    应用于消息的推理覆盖。未设置时默认为 null。

    - `model: string or null`

      生成响应的模型名称。使用会话默认值时默认为 null。

    - `tool_choice: object { id }  or null`

      要调用的首选工具。当 ChatKit 应自动选择时默认为 null。

      - `id: string`

        请求的工具的标识符。

  - `object: "chatkit.thread_item"`

    始终为 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.user_message"`

    - `"chatkit.user_message"`

### ChatKit 组件项

- `ChatKitWidgetItem object { id, created_at, object, 3 more }`

  渲染小组件负载的线程项。

  - `id: string`

    线程项的标识符。

  - `created_at: number`

    项创建时的 Unix 时间戳（秒）。

  - `object: "chatkit.thread_item"`

    类型判别符，始终为 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.widget"`

    类型判别符，始终为 `chatkit.widget`.

    - `"chatkit.widget"`

  - `widget: string`

    在界面中渲染的序列化小组件负载。

### 线程删除响应

- `ThreadDeleteResponse object { id, deleted, object }`

  删除线程后返回的确认负载。

  - `id: string`

    已删除线程的标识符。

  - `deleted: boolean`

    指示该线程已被删除。

  - `object: "chatkit.thread.deleted"`

    类型判别器，始终为 `chatkit.thread.deleted`.

    - `"chatkit.thread.deleted"`
