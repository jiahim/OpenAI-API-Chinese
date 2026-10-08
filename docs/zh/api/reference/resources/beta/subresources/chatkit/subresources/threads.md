# 线程

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾附加 `.md` 来获取。

## 删除 ChatKit 线程

**delete** `/chatkit/threads/{thread_id}`

删除 ChatKit 会话及其条目和已存储的附件。

### 路径参数

- `thread_id: string`

### 返回

- `id: string`

  已删除对话的标识符。

- `deleted: boolean`

  表示该对话已被删除。

- `object: "chatkit.thread.deleted"`

  始终为以下值的类型鉴别字段 `chatkit.thread.deleted`.

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

  在此线程项 ID 之后创建的列表项。第一页默认为 null。

- `before: optional string`

  在此线程项 ID 之前创建的列表项。最新结果默认为 null。

- `limit: optional number`

  返回的最大线程项数。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序的顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  筛选属于此用户标识符的线程。默认为 null 以返回所有用户。

### 返回

- `data: array of ChatKitThread`

  项列表

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为以下值的类型鉴别字段 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: Active { type }  or Locked { reason, type }  or Closed { reason, type }`

    线程的当前状态。新创建的线程默认为 `active` 。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        状态判别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。默认为 null，表示未记录原因。

      - `type: "locked"`

        状态判别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。默认为 null，表示未记录原因。

      - `type: "closed"`

        状态判别字段，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该线程的最终用户的自由格式字符串。

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

列出属于某个 ChatKit 会话线程的条目。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  在此线程项 ID 之后创建的列表项。第一页默认为 null。

- `before: optional string`

  在此线程项 ID 之前创建的列表项。最新结果默认为 null。

- `limit: optional number`

  返回的最大线程项数。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序的顺序。默认为 `desc`.

  - `"asc"`

  - `"desc"`

### 返回

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    项列表

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

          附件的判别字段。

          - `"image"`

          - `"file"`

      - `content: array of InputText { text, type }  or QuotedText { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            用户提供的纯文本内容。

          - `type: "input_text"`

            始终为以下值的类型鉴别字段 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引文片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为以下值的类型鉴别字段 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖参数。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。由 ChatKit 自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      线程中的助手消息。

      - `id: string`

        线程项的标识符。

      - `content: array of ChatKitResponseOutputText`

        有序的助手响应片段。

        - `annotations: array of File { source, type }  or URL { source, type }`

          附加到响应文本的有序注释列表。

          - `File object { source, type }`

            引用已上传文件的注释。

            - `source: object { filename, type }`

              该注释引用的文件附件。

              - `filename: string`

                该注释引用的文件名。

              - `type: "file"`

                始终为以下值的类型鉴别字段 `file`.

                - `"file"`

            - `type: "file"`

              类型鉴别字段，始终为 `file` 。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注释。

            - `source: object { type, url }`

              该注释引用的 URL。

              - `type: "url"`

                始终为以下值的类型鉴别字段 `url`.

                - `"url"`

              - `url: string`

                该注释引用的 URL。

            - `type: "url"`

              类型鉴别字段，始终为 `url` 。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          始终为以下值的类型鉴别字段 `output_text`.

          - `"output_text"`

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为以下值的类型鉴别字段 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于渲染 widget 负载的线程项。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为以下值的类型鉴别字段 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中渲染的已序列化 widget 负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      助手发起的客户端工具调用的记录。

      - `id: string`

        线程项的标识符。

      - `arguments: string`

        发送给该工具的 JSON 编码参数。

      - `call_id: string`

        该客户端工具调用的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从该工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        该工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为以下值的类型鉴别字段 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由 工作流 发出以展示进度和状态更新的任务。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

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

        始终为以下值的类型鉴别字段 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在线程中分组到一起的工作流任务集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        包含在分组中的任务。

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

        始终为以下值的类型鉴别字段 `chatkit.task_group`.

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

通过标识符检索 ChatKit 会话线程。

### 路径参数

- `thread_id: string`

### 返回

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为以下值的类型鉴别字段 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: Active { type }  or Locked { reason, type }  or Closed { reason, type }`

    线程的当前状态。新创建的线程默认为 `active` 。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        状态判别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。默认为 null，表示未记录原因。

      - `type: "locked"`

        状态判别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。默认为 null，表示未记录原因。

      - `type: "closed"`

        状态判别字段，始终为 `closed`.

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
  "created_at": 1712345600,
  "status": {
    "type": "active"
  },
  "user": "user_123"
}
```

## 域类型

### 聊天会话

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  表示 ChatKit 会话及其解析后的配置。

  - `id: string`

    ChatKit 会话的标识符。

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    会话解析后的 ChatKit 功能配置。

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      自动线程标题首选项。

      - `enabled: boolean`

        是否启用自动线程标题。

    - `file_upload: ChatSessionFileUpload`

      会话的上传设置。

      - `enabled: boolean`

        指示是否为会话启用上传。

      - `max_file_size: number or null`

        最大上传大小（以 MB 为单位）。

      - `max_files: number or null`

        会话期间允许的最大上传次数。

    - `history: ChatSessionHistory`

      历史记录保留配置。

      - `enabled: boolean`

        指示是否为会话持久化聊天历史记录。

      - `recent_threads: number or null`

        历史记录视图中显示的先前线程数量。保留全部历史记录时默认为 null。

  - `client_secret: string`

    用于对会话请求进行身份验证的临时客户端密钥。

  - `expires_at: number`

    会话过期时的 Unix 时间戳（以秒为单位）。

  - `max_requests_per_1_minute: number`

    每分钟请求限制的便捷副本。

  - `object: "chatkit.session"`

    始终为以下值的类型鉴别字段 `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    解析后的速率限制值。

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

      支持该会话的工作流的标识符。

    - `state_variables: map[string or boolean or number] or null`

      调用该工作流时应用的状态变量键值对。未提供覆盖值时默认为 null。

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      应用于该工作流的追踪设置。

      - `enabled: boolean`

        指示是否启用了追踪。

    - `version: string or null`

      用于该会话的特定工作流版本。使用最新部署时默认为 null。

### 聊天会话自动主题命名

- `ChatSessionAutomaticThreadTitling object { enabled }`

  会话的自动线程标题偏好设置。

  - `enabled: boolean`

    是否启用自动线程标题。

### Chat Session ChatKit Configuration

- `ChatSessionChatKitConfiguration object { automatic_thread_titling, file_upload, history }`

  该会话的 ChatKit 配置。

  - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

    自动线程标题首选项。

    - `enabled: boolean`

      是否启用自动线程标题。

  - `file_upload: ChatSessionFileUpload`

    会话的上传设置。

    - `enabled: boolean`

      指示是否为会话启用上传。

    - `max_file_size: number or null`

      最大上传大小（以 MB 为单位）。

    - `max_files: number or null`

      会话期间允许的最大上传次数。

  - `history: ChatSessionHistory`

    历史记录保留配置。

    - `enabled: boolean`

      指示是否为会话持久化聊天历史记录。

    - `recent_threads: number or null`

      历史记录视图中显示的先前线程数量。保留全部历史记录时默认为 null。

### 聊天会话 ChatKit 配置参数

- `ChatSessionChatKitConfigurationParam object { automatic_thread_titling, file_upload, history }`

  ChatKit 行为的可选会话级配置设置。

  - `automatic_thread_titling: optional object { enabled }`

    自动会话标题配置。如果省略，默认启用自动会话标题。

    - `enabled: optional boolean`

      启用自动会话标题生成。默认为 true。

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    上传启用与限制的配置。如果省略，默认禁用上传（max_files 为 10，max_file_size 为 512 MB）。

    - `enabled: optional boolean`

      为此会话启用上传。默认为 false。

    - `max_file_size: optional number`

      每个上传文件的最大大小（单位：MB）。默认为 512 MB，这也是允许的最大值。

    - `max_files: optional number`

      可上传到该会话的最大文件数。默认为 10。

  - `history: optional object { enabled, recent_threads }`

    聊天记录保留配置。如果省略，默认启用历史记录，recent_threads 不设上限（null）。

    - `enabled: optional boolean`

      允许聊天用户访问此前的 ChatKit 会话。默认为 true。

    - `recent_threads: optional number`

      用户可访问的最近 ChatKit 会话数量。未设置时默认为无限制。

### 会话在参数后过期 Chat Session Expires After Param

- `ChatSessionExpiresAfterParam object { anchor, seconds }`

  相对于某个锚点时间戳，控制会话何时过期。

  - `anchor: "created_at"`

    用于计算过期时间的基础时间戳。当前固定为 `created_at`.

    - `"created_at"`

  - `seconds: number`

    从锚点起经过多少秒后会话过期。

### Chat Session File Upload

- `ChatSessionFileUpload object { enabled, max_file_size, max_files }`

  应用于该会话的上传权限和限制。

  - `enabled: boolean`

    指示是否为会话启用上传。

  - `max_file_size: number or null`

    最大上传大小（以 MB 为单位）。

  - `max_files: number or null`

    会话期间允许的最大上传次数。

### 聊天会话历史

- `ChatSessionHistory object { enabled, recent_threads }`

  为该会话返回的历史记录保留偏好。

  - `enabled: boolean`

    指示是否为会话持久化聊天历史记录。

  - `recent_threads: number or null`

    历史记录视图中显示的先前线程数量。保留全部历史记录时默认为 null。

### 聊天会话速率限制

- `ChatSessionRateLimits object { max_requests_per_1_minute }`

  会话当前生效的每分钟请求速率限制。

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

  应用于聊天会话的工作流引用和覆盖项。

  - `id: string`

    由该会话调用的工作流标识符。

  - `state_variables: optional map[string or boolean or number]`

    转发给工作流的状态变量。键名最长 64 个字符，值必须是基本类型，且该映射默认为空对象。

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    针对工作流调用的可选追踪覆盖项。若省略，则追踪默认启用。

    - `enabled: optional boolean`

      会话期间是否启用追踪。默认为 true。

  - `version: optional string`

    要运行的特定工作流版本。默认为最新部署的版本。

### ChatKit Attachment

- `ChatKitAttachment object { id, mime_type, name, 2 more }`

  在线程项上包含的附件元数据。

  - `id: string`

    附件的标识符。

  - `mime_type: string`

    附件的 MIME 类型。

  - `name: string`

    附件的原始显示名称。

  - `preview_url: string or null`

    用于内联渲染附件的预览 URL。

  - `type: "image" or "file"`

    附件的判别字段。

    - `"image"`

    - `"file"`

### ChatKit Response Output Text

- `ChatKitResponseOutputText object { annotations, text, type }`

  助手响应文本，可附带注释。

  - `annotations: array of File { source, type }  or URL { source, type }`

    附加到响应文本的有序注释列表。

    - `File object { source, type }`

      引用已上传文件的注释。

      - `source: object { filename, type }`

        该注释引用的文件附件。

        - `filename: string`

          该注释引用的文件名。

        - `type: "file"`

          始终为以下值的类型鉴别字段 `file`.

          - `"file"`

      - `type: "file"`

        类型鉴别字段，始终为 `file` 。

        - `"file"`

    - `URL object { source, type }`

      引用 URL 的注释。

      - `source: object { type, url }`

        该注释引用的 URL。

        - `type: "url"`

          始终为以下值的类型鉴别字段 `url`.

          - `"url"`

        - `url: string`

          该注释引用的 URL。

      - `type: "url"`

        类型鉴别字段，始终为 `url` 。

        - `"url"`

  - `text: string`

    助手生成的文本。

  - `type: "output_text"`

    始终为以下值的类型鉴别字段 `output_text`.

    - `"output_text"`

### ChatKit Thread

- `ChatKitThread object { id, created_at, object, 3 more }`

  表示一个 ChatKit 会话及其当前状态。

  - `id: string`

    线程的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread"`

    始终为以下值的类型鉴别字段 `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: Active { type }  or Locked { reason, type }  or Closed { reason, type }`

    线程的当前状态。新创建的线程默认为 `active` 。

    - `Active object { type }`

      表示线程处于活动状态。

      - `type: "active"`

        状态判别字段，始终为 `active`.

        - `"active"`

    - `Locked object { reason, type }`

      表示线程已锁定，无法接受新的输入。

      - `reason: string or null`

        线程被锁定的原因。默认为 null，表示未记录原因。

      - `type: "locked"`

        状态判别字段，始终为 `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      表示线程已关闭。

      - `reason: string or null`

        线程被关闭的原因。默认为 null，表示未记录原因。

      - `type: "closed"`

        状态判别字段，始终为 `closed`.

        - `"closed"`

  - `title: string or null`

    线程的可选人类可读标题。未生成标题时默认为 null。

  - `user: string`

    用于标识拥有该线程的最终用户的自由格式字符串。

### ChatKit Thread 助手消息项

- `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

  线程中的助手消息。

  - `id: string`

    线程项的标识符。

  - `content: array of ChatKitResponseOutputText`

    有序的助手响应片段。

    - `annotations: array of File { source, type }  or URL { source, type }`

      附加到响应文本的有序注释列表。

      - `File object { source, type }`

        引用已上传文件的注释。

        - `source: object { filename, type }`

          该注释引用的文件附件。

          - `filename: string`

            该注释引用的文件名。

          - `type: "file"`

            始终为以下值的类型鉴别字段 `file`.

            - `"file"`

        - `type: "file"`

          类型鉴别字段，始终为 `file` 。

          - `"file"`

      - `URL object { source, type }`

        引用 URL 的注释。

        - `source: object { type, url }`

          该注释引用的 URL。

          - `type: "url"`

            始终为以下值的类型鉴别字段 `url`.

            - `"url"`

          - `url: string`

            该注释引用的 URL。

        - `type: "url"`

          类型鉴别字段，始终为 `url` 。

          - `"url"`

    - `text: string`

      助手生成的文本。

    - `type: "output_text"`

      始终为以下值的类型鉴别字段 `output_text`.

      - `"output_text"`

  - `created_at: number`

    创建该项时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    始终为以下值的类型鉴别字段 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.assistant_message"`

    始终为以下值的类型鉴别字段 `chatkit.assistant_message`.

    - `"chatkit.assistant_message"`

### ChatKit Thread 项列表

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    项列表

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

          附件的判别字段。

          - `"image"`

          - `"file"`

      - `content: array of InputText { text, type }  or QuotedText { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            用户提供的纯文本内容。

          - `type: "input_text"`

            始终为以下值的类型鉴别字段 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引文片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为以下值的类型鉴别字段 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于消息的推理覆盖参数。未设置时默认为 null。

        - `model: string or null`

          生成响应的模型名称。使用会话默认值时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。由 ChatKit 自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      线程中的助手消息。

      - `id: string`

        线程项的标识符。

      - `content: array of ChatKitResponseOutputText`

        有序的助手响应片段。

        - `annotations: array of File { source, type }  or URL { source, type }`

          附加到响应文本的有序注释列表。

          - `File object { source, type }`

            引用已上传文件的注释。

            - `source: object { filename, type }`

              该注释引用的文件附件。

              - `filename: string`

                该注释引用的文件名。

              - `type: "file"`

                始终为以下值的类型鉴别字段 `file`.

                - `"file"`

            - `type: "file"`

              类型鉴别字段，始终为 `file` 。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注释。

            - `source: object { type, url }`

              该注释引用的 URL。

              - `type: "url"`

                始终为以下值的类型鉴别字段 `url`.

                - `"url"`

              - `url: string`

                该注释引用的 URL。

            - `type: "url"`

              类型鉴别字段，始终为 `url` 。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          始终为以下值的类型鉴别字段 `output_text`.

          - `"output_text"`

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为以下值的类型鉴别字段 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于渲染 widget 负载的线程项。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为以下值的类型鉴别字段 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中渲染的已序列化 widget 负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      助手发起的客户端工具调用的记录。

      - `id: string`

        线程项的标识符。

      - `arguments: string`

        发送给该工具的 JSON 编码参数。

      - `call_id: string`

        该客户端工具调用的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从该工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        该工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为以下值的类型鉴别字段 `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      由 工作流 发出以展示进度和状态更新的任务。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `heading: string or null`

        任务的可选标题。未提供时默认为 null。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

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

        始终为以下值的类型鉴别字段 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在线程中分组到一起的工作流任务集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        创建该项时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型鉴别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        包含在分组中的任务。

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

        始终为以下值的类型鉴别字段 `chatkit.task_group`.

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

### ChatKit Thread 用户消息项

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

      附件的判别字段。

      - `"image"`

      - `"file"`

  - `content: array of InputText { text, type }  or QuotedText { text, type }`

    由用户提供的有序内容元素。

    - `InputText object { text, type }`

      用户向线程贡献的文本块。

      - `text: string`

        用户提供的纯文本内容。

      - `type: "input_text"`

        始终为以下值的类型鉴别字段 `input_text`.

        - `"input_text"`

    - `QuotedText object { text, type }`

      用户在消息中引用的引文片段。

      - `text: string`

        引用的文本内容。

      - `type: "quoted_text"`

        始终为以下值的类型鉴别字段 `quoted_text`.

        - `"quoted_text"`

  - `created_at: number`

    创建该项时的 Unix 时间戳（以秒为单位）。

  - `inference_options: object { model, tool_choice }  or null`

    应用于消息的推理覆盖参数。未设置时默认为 null。

    - `model: string or null`

      生成响应的模型名称。使用会话默认值时默认为 null。

    - `tool_choice: object { id }  or null`

      首选调用的工具。由 ChatKit 自动选择时默认为 null。

      - `id: string`

        所请求工具的标识符。

  - `object: "chatkit.thread_item"`

    始终为以下值的类型鉴别字段 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.user_message"`

    - `"chatkit.user_message"`

### ChatKit 小组件项

- `ChatKitWidgetItem object { id, created_at, object, 3 more }`

  用于渲染 widget 负载的线程项。

  - `id: string`

    线程项的标识符。

  - `created_at: number`

    创建该项时的 Unix 时间戳（以秒为单位）。

  - `object: "chatkit.thread_item"`

    始终为以下值的类型鉴别字段 `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    父线程的标识符。

  - `type: "chatkit.widget"`

    始终为以下值的类型鉴别字段 `chatkit.widget`.

    - `"chatkit.widget"`

  - `widget: string`

    在 UI 中渲染的已序列化 widget 负载。

### Thread 删除响应

- `ThreadDeleteResponse object { id, deleted, object }`

  删除会话后返回的确认载荷。

  - `id: string`

    已删除对话的标识符。

  - `deleted: boolean`

    表示该对话已被删除。

  - `object: "chatkit.thread.deleted"`

    始终为以下值的类型鉴别字段 `chatkit.thread.deleted`.

    - `"chatkit.thread.deleted"`
