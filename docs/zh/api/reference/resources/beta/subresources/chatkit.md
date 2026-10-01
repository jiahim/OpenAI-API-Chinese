# ChatKit

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## Domain Types

### ChatKit Workflow

- `ChatKitWorkflow object { id, state_variables, tracing, version }`

  为会话返回的工作流元数据和状态。

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

      指示是否启用了追踪。

  - `version: string or null`

    会话使用的特定工作流版本。使用最新部署时默认为 null。

# 会话

## 取消 ChatKit 会话

**post** `/chatkit/sessions/{session_id}/cancel`

取消一个活跃的 ChatKit 会话并返回其最新的元数据。

取消后，将阻止新请求使用已颁发的客户端密钥。

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

      自动会话标题设置。

      - `enabled: boolean`

        是否启用了自动会话标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否启用了上传功能。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传数量。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        在历史记录视图中显示的过往会话数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行认证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为的类型鉴别器 `chatkit.session`.

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

    该会话的工作流元数据。

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

        指示是否启用了追踪。

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

  用于标识最终用户的自由格式字符串；确保该会话能够访问具有相同 `user` 作用域的对象。

- `workflow: ChatSessionWorkflowParam`

  为会话提供支持的工作流。

  - `id: string`

    由会话调用的工作流的标识符。

  - `state_variables: optional map[string or boolean or number]`

    传递给工作流的状态变量。键名最多 64 个字符，值必须为基本类型，映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    针对工作流调用的可选追踪覆盖项。未提供时，默认启用追踪。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

- `chatkit_configuration: optional ChatSessionChatKitConfigurationParam`

  ChatKit 运行时配置功能的可选覆盖项

  - `automatic_thread_titling: optional object { enabled }`

    自动线程标题生成配置。未提供时，默认启用自动线程标题生成。

    - `enabled: optional boolean`

      启用自动线程标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。未提供时，默认禁用上传（max_files 10，max_file_size 512 MB）。

    - `enabled: optional boolean`

      为该会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以 MB 为单位）。默认为 512 MB，即允许的最大值。

    - `max_files: optional number`

      可上传至该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天记录保留配置。未提供时，默认启用历史记录且对 recent_threads 不设上限（null）。

    - `enabled: optional boolean`

      允许聊天用户访问此前的 ChatKit 线程。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 线程数量。未设置时默认为无限制。

- `expires_after: optional ChatSessionExpiresAfterParam`

  会话过期时间的可选覆盖项（以创建起算的秒数）。默认为 10 分钟。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。当前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    会话在锚点之后过期的秒数。

- `rate_limits: optional ChatSessionRateLimitsParam`

  可选的每分钟请求限制覆盖值。未指定时，默认为 10。

  - `max_requests_per_1_minute: optional number`

    会话每分钟允许的最大请求数。默认为 10。

### 返回值

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话已解析的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动会话标题设置。

      - `enabled: boolean`

        是否启用了自动会话标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否启用了上传功能。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传数量。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        在历史记录视图中显示的过往会话数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行认证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为的类型鉴别器 `chatkit.session`.

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

    该会话的工作流元数据。

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

        指示是否启用了追踪。

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

删除一个 ChatKit 会话及其中的项目和已存储的附件。

### 路径参数

- `thread_id: string`

### 返回值

- `id: string`

  已删除线程的标识符。

- `deleted: boolean`

  表示该线程已被删除。

- `object: "chatkit.thread.deleted"`

  始终为的类型鉴别器 `chatkit.thread.deleted`.

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

列出 ChatKit 线程，支持可选的分页和用户过滤条件。

### 查询参数

- `after: optional string`

  在该会话条目 ID 之后创建的列表项。对于第一页默认为 null。

- `before: optional string`

  在该会话条目 ID 之前创建的列表项。对于最新结果默认为 null。

- `limit: optional number`

  要返回的最大会话条目数。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序的结果顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  筛选属于该用户标识符的会话。默认为 null 时返回所有用户。

### 返回值

- `data: array of ChatKitThread`

  条目列表

  - `id: string`

    会话的标识符。

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为的类型鉴别器 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    会话的当前状态。默认为 `active` ，适用于新创建的会话。

    - `Active object { type }`

      表示会话处于活跃状态。

      - `type: "active"`

        状态判别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示会话已锁定，无法接受新的输入。

      - `reason: string or null`

        会话被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态判别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示会话已关闭。

      - `reason: string or null`

        会话被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态判别字段，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    会话的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该会话的最终用户的自由格式字符串。

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

## 列出 ChatKit 会话条目

**get** `/chatkit/threads/{thread_id}/items`

列出属于某个 ChatKit 线程的项目。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  在该会话条目 ID 之后创建的列表项。对于第一页默认为 null。

- `before: optional string`

  在该会话条目 ID 之前创建的列表项。对于最新结果默认为 null。

- `limit: optional number`

  要返回的最大会话条目数。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序的结果顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

### 返回值

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项目的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    条目列表

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      线程中由用户撰写的消息。

      - `id: string`

        线程项目的标识符。

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

      - `content: array of object { text, type }  or object { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            用户提供的纯文本内容。

          - `type: "input_text"`

            始终为的类型鉴别器 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为的类型鉴别器 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          优先调用的工具。当 ChatKit 应自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      会话线程中由助手撰写的消息。

      - `id: string`

        线程项目的标识符。

      - `content: array of ChatKitResponseOutputText`

        助手响应的有序片段。

        - `annotations: array of object { source, type }  or object { source, type }`

          附加到响应文本的有序标注列表。

          - `File object { source, type }`

            引用已上传文件的标注。

            - `source: object { filename, type }`

              该标注引用的文件附件。

              - `filename: string`

                该标注引用的文件名。

              - `type: "file"`

                始终为的类型鉴别器 `file`.

                - `"file"`

            - `type: "file"`

              类型鉴别器，始终为 `file` 此类标注的取值。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的标注。

            - `source: object { type, url }`

              该标注引用的 URL。

              - `type: "url"`

                始终为的类型鉴别器 `url`.

                - `"url"`

              - `url: string`

                该标注引用的 URL。

            - `type: "url"`

              类型鉴别器，始终为 `url` 此类标注的取值。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          始终为的类型鉴别器 `output_text`.

          - `"output_text"`

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为的类型鉴别器 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于渲染小组件负载的线程项。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为的类型鉴别器 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中渲染的序列化小组件负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      助手发起的客户端工具调用记录。

      - `id: string`

        线程项目的标识符。

      - `arguments: string`

        发送给工具的 JSON 编码参数。

      - `call_id: string`

        该客户端工具调用的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        已调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        该工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为的类型鉴别器 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由工作流发出用于展示进度和状态更新的任务。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

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

        始终为的类型鉴别器 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在对话中分组到一起的 工作流 任务集合。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

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

        始终为的类型鉴别器 `chatkit.task_group`.

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

## 检索 ChatKit 会话

**get** `/chatkit/threads/{thread_id}`

通过标识符检索 ChatKit 会话。

### 路径参数

- `thread_id: string`

### 返回值

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    会话的标识符。

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为的类型鉴别器 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    会话的当前状态。默认为 `active` ，适用于新创建的会话。

    - `Active object { type }`

      表示会话处于活跃状态。

      - `type: "active"`

        状态判别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示会话已锁定，无法接受新的输入。

      - `reason: string or null`

        会话被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态判别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示会话已关闭。

      - `reason: string or null`

        会话被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态判别字段，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    会话的可选人类可读标题。未生成标题时默认为 null。

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

  表示一个 ChatKit 会话及其已解析的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    该会话已解析的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动会话标题设置。

      - `enabled: boolean`

        是否启用了自动会话标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示会话是否启用了上传功能。

      - `max_file_size: number or null`

        最大上传大小（以兆字节为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传数量。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为该会话持久化聊天历史记录。

      - `recent_threads: number or null`

        在历史记录视图中显示的过往会话数量。当保留所有历史记录时，默认为 null。

  - `client_secret: string`

    用于对会话请求进行认证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为的类型鉴别器 `chatkit.session`.

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

    该会话的工作流元数据。

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

        指示是否启用了追踪。

    - `version: string or null`

      会话使用的特定工作流版本。使用最新部署时默认为 null。

### 聊天会话自动主题命名

- `ChatSessionAutomaticThreadTitling object { enabled }`

  会话的自动会话标题偏好设置。

  - `enabled: boolean`

    是否启用了自动会话标题。

### Chat 会话 ChatKit 配置

- `ChatSessionChatKitConfiguration object { automatic_thread_titling, file_upload, history }`

  该会话的 ChatKit 配置。

  - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

    自动会话标题设置。

    - `enabled: boolean`

      是否启用了自动会话标题。

  - `file_upload: ChatSessionFileUpload`

    会话的上传设置。

    - `enabled: boolean`

      指示会话是否启用了上传功能。

    - `max_file_size: number or null`

      最大上传大小（以兆字节为单位）。

    - `max_files: number or null`

      会话期间允许的最大上传数量。

  - `history: ChatSessionHistory`

    历史记录保留配置。

    - `enabled: boolean`

      指示是否为该会话持久化聊天历史记录。

    - `recent_threads: number or null`

      在历史记录视图中显示的过往会话数量。当保留所有历史记录时，默认为 null。

### Chat Session ChatKit Configuration Param

- `ChatSessionChatKitConfigurationParam object { automatic_thread_titling, file_upload, history }`

  ChatKit 行为的可选会话级配置设置。

  - `automatic_thread_titling: optional object { enabled }`

    自动线程标题生成配置。未提供时，默认启用自动线程标题生成。

    - `enabled: optional boolean`

      启用自动线程标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。未提供时，默认禁用上传（max_files 10，max_file_size 512 MB）。

    - `enabled: optional boolean`

      为该会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（以 MB 为单位）。默认为 512 MB，即允许的最大值。

    - `max_files: optional number`

      可上传至该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天记录保留配置。未提供时，默认启用历史记录且对 recent_threads 不设上限（null）。

    - `enabled: optional boolean`

      允许聊天用户访问此前的 ChatKit 线程。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 线程数量。未设置时默认为无限制。

### Chat Session Expires After Param

- `ChatSessionExpiresAfterParam object { anchor, seconds }`

  控制会话相对于锚定时间戳的过期时间。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。当前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    会话在锚点之后过期的秒数。

### 聊天会话文件上传

- `ChatSessionFileUpload object { enabled, max_file_size, max_files }`

  应用于会话的上传权限和限制。

  - `enabled: boolean`

    指示会话是否启用了上传功能。

  - `max_file_size: number or null`

    最大上传大小（以兆字节为单位）。

  - `max_files: number or null`

    会话期间允许的最大上传数量。

### 聊天会话历史

- `ChatSessionHistory object { enabled, recent_threads }`

  为该会话返回的历史记录保留偏好。

  - `enabled: boolean`

    指示是否为该会话持久化聊天历史记录。

  - `recent_threads: number or null`

    在历史记录视图中显示的过往会话数量。当保留所有历史记录时，默认为 null。

### 聊天会话速率限制

- `ChatSessionRateLimits object { max_requests_per_1_minute }`

  本次会话每分钟的有效请求上限。

  - `max_requests_per_1_minute: number`

    一分钟窗口内允许的最大请求数。

### Chat Session Rate Limits Param

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

  应用于聊天会话的工作流引用和覆盖。

  - `id: string`

    由会话调用的工作流的标识符。

  - `state_variables: optional map[string or boolean or number]`

    传递给工作流的状态变量。键名最多 64 个字符，值必须为基本类型，映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    针对工作流调用的可选追踪覆盖项。未提供时，默认启用追踪。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

### ChatKit Attachment

- `ChatKitAttachment object { id, mime_type, name, 2 more }`

  在线程项上附带的附件元数据。

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

### ChatKit 响应输出文本

- `ChatKitResponseOutputText object { annotations, text, type }`

  助手回复文本，可附带可选的标注。

  - `annotations: array of object { source, type }  or object { source, type }`

    附加到响应文本的有序标注列表。

    - `File object { source, type }`

      引用已上传文件的标注。

      - `source: object { filename, type }`

        该标注引用的文件附件。

        - `filename: string`

          该标注引用的文件名。

        - `type: "file"`

          始终为的类型鉴别器 `file`.

          - `"file"`

      - `type: "file"`

        类型鉴别器，始终为 `file` 此类标注的取值。

        - `"file"`

    - `URL object { source, type }`

      引用 URL 的标注。

      - `source: object { type, url }`

        该标注引用的 URL。

        - `type: "url"`

          始终为的类型鉴别器 `url`.

          - `"url"`

        - `url: string`

          该标注引用的 URL。

      - `type: "url"`

        类型鉴别器，始终为 `url` 此类标注的取值。

        - `"url"`

  - `text: string`

    助手生成的文本。

  - `type: "output_text"`

    始终为的类型鉴别器 `output_text`.

    - `"output_text"`

### ChatKit Thread

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    会话的标识符。

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为的类型鉴别器 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    会话的当前状态。默认为 `active` ，适用于新创建的会话。

    - `Active object { type }`

      表示会话处于活跃状态。

      - `type: "active"`

        状态判别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示会话已锁定，无法接受新的输入。

      - `reason: string or null`

        会话被锁定的原因。未记录原因时默认为 null。

      - `type: "locked"`

        状态判别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示会话已关闭。

      - `reason: string or null`

        会话被关闭的原因。未记录原因时默认为 null。

      - `type: "closed"`

        状态判别字段，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    会话的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该会话的最终用户的自由格式字符串。

### ChatKit Thread Assistant Message Item

- `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

  会话线程中由助手撰写的消息。

  - `id: string`

    线程项目的标识符。

  - `content: array of ChatKitResponseOutputText`

    助手响应的有序片段。

    - `annotations: array of object { source, type }  or object { source, type }`

      附加到响应文本的有序标注列表。

      - `File object { source, type }`

        引用已上传文件的标注。

        - `source: object { filename, type }`

          该标注引用的文件附件。

          - `filename: string`

            该标注引用的文件名。

          - `type: "file"`

            始终为的类型鉴别器 `file`.

            - `"file"`

        - `type: "file"`

          类型鉴别器，始终为 `file` 此类标注的取值。

          - `"file"`

      - `URL object { source, type }`

        引用 URL 的标注。

        - `source: object { type, url }`

          该标注引用的 URL。

          - `type: "url"`

            始终为的类型鉴别器 `url`.

            - `"url"`

          - `url: string`

            该标注引用的 URL。

        - `type: "url"`

          类型鉴别器，始终为 `url` 此类标注的取值。

          - `"url"`

    - `text: string`

      助手生成的文本。

    - `type: "output_text"`

      始终为的类型鉴别器 `output_text`.

      - `"output_text"`

  - `created_at: number`

    该项目创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    始终为的类型鉴别器 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.assistant_message"`

    始终为的类型鉴别器 `chatkit.assistant_message`.

    - `"chatkit.assistant_message"`

### ChatKit Thread Item List

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项目的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    条目列表

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      线程中由用户撰写的消息。

      - `id: string`

        线程项目的标识符。

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

      - `content: array of object { text, type }  or object { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            用户提供的纯文本内容。

          - `type: "input_text"`

            始终为的类型鉴别器 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为的类型鉴别器 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          优先调用的工具。当 ChatKit 应自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      会话线程中由助手撰写的消息。

      - `id: string`

        线程项目的标识符。

      - `content: array of ChatKitResponseOutputText`

        助手响应的有序片段。

        - `annotations: array of object { source, type }  or object { source, type }`

          附加到响应文本的有序标注列表。

          - `File object { source, type }`

            引用已上传文件的标注。

            - `source: object { filename, type }`

              该标注引用的文件附件。

              - `filename: string`

                该标注引用的文件名。

              - `type: "file"`

                始终为的类型鉴别器 `file`.

                - `"file"`

            - `type: "file"`

              类型鉴别器，始终为 `file` 此类标注的取值。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的标注。

            - `source: object { type, url }`

              该标注引用的 URL。

              - `type: "url"`

                始终为的类型鉴别器 `url`.

                - `"url"`

              - `url: string`

                该标注引用的 URL。

            - `type: "url"`

              类型鉴别器，始终为 `url` 此类标注的取值。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          始终为的类型鉴别器 `output_text`.

          - `"output_text"`

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为的类型鉴别器 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于渲染小组件负载的线程项。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为的类型鉴别器 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中渲染的序列化小组件负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      助手发起的客户端工具调用记录。

      - `id: string`

        线程项目的标识符。

      - `arguments: string`

        发送给工具的 JSON 编码参数。

      - `call_id: string`

        该客户端工具调用的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        已调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        该工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为的类型鉴别器 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由工作流发出用于展示进度和状态更新的任务。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

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

        始终为的类型鉴别器 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在对话中分组到一起的 工作流 任务集合。

      - `id: string`

        线程项目的标识符。

      - `created_at: number`

        该项目创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为的类型鉴别器 `chatkit.thread_item`.

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

        始终为的类型鉴别器 `chatkit.task_group`.

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

    线程项目的标识符。

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

  - `content: array of object { text, type }  or object { text, type }`

    由用户提供的有序内容元素。

    - `InputText object { text, type }`

      用户向线程贡献的文本块。

      - `text: string`

        用户提供的纯文本内容。

      - `type: "input_text"`

        始终为的类型鉴别器 `input_text`.

        - `"input_text"`

    - `QuotedText object { text, type }`

      用户在消息中引用的引用片段。

      - `text: string`

        引用的文本内容。

      - `type: "quoted_text"`

        始终为的类型鉴别器 `quoted_text`.

        - `"quoted_text"`

  - `created_at: number`

    该项目创建时的 Unix 时间戳（以秒为单位）。

  - `inference_options: object { model, tool_choice }  or null`

    应用于消息的推理覆盖。未设置时默认为 null。

    - `model: string or null`

      生成响应的模型名称。使用会话默认值时默认为 null。

    - `tool_choice: object { id }  or null`

      优先调用的工具。当 ChatKit 应自动选择时默认为 null。

      - `id: string`

        所请求工具的标识符。

  - `object: "chatkit.thread_item"`

    始终为的类型鉴别器 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.user_message"`

    - `"chatkit.user_message"`

### ChatKit Widget Item

- `ChatKitWidgetItem object { id, created_at, object, 3 more }`

  用于渲染小组件负载的线程项。

  - `id: string`

    线程项目的标识符。

  - `created_at: number`

    该项目创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    始终为的类型鉴别器 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.widget"`

    始终为的类型鉴别器 `chatkit.widget`.

    - `"chatkit.widget"`

  - `widget: string`

    在 UI 中渲染的序列化小组件负载。

### Thread Delete Response

- `ThreadDeleteResponse object { id, deleted, object }`

  删除 thread 后返回的确认负载。

  - `id: string`

    已删除线程的标识符。

  - `deleted: boolean`

    表示该线程已被删除。

  - `object: "chatkit.thread.deleted"`

    始终为的类型鉴别器 `chatkit.thread.deleted`.

    - `"chatkit.thread.deleted"`
