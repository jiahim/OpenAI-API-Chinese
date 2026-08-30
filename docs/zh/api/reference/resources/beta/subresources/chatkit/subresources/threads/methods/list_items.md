> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

## 列出 ChatKit 对话线程项

**get** `/chatkit/threads/{thread_id}/items`

列出属于某个 ChatKit 会话线程的条目。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  在指定的会话条目 ID 之后创建的列表条目。对于第一页，默认为 null。

- `before: optional string`

  在指定的会话条目 ID 之前创建的列表条目。对于最新结果，默认为 null。

- `limit: optional number`

  要返回的最大会话条目数。默认为 20。

- `order: optional "asc" or "desc"`

  按创建时间排序结果的方式。默认为 `desc`.

  - `"asc"`

  - `"desc"`

### Returns

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  为 ChatKit API 渲染的线程项的分页列表。

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    项的列表

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

      - `content: array of object { text, type }  or object { text, type }`

        由用户提供的有序内容元素。

        - `InputText object { text, type }`

          用户向线程贡献的文本块。

          - `text: string`

            由用户提供的纯文本内容。

          - `type: "input_text"`

            始终为以下值的类型判别字段 `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          用户在消息中引用的引用片段。

          - `text: string`

            引用的文本内容。

          - `type: "quoted_text"`

            始终为以下值的类型判别字段 `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `inference_options: object { model, tool_choice }  or null`

        应用于该消息的推理覆盖参数。未设置时默认为 null。

        - `model: string or null`

          生成该响应的模型名称。使用会话默认模型时默认为 null。

        - `tool_choice: object { id }  or null`

          首选调用的工具。由 ChatKit 自动选择时默认为 null。

          - `id: string`

            所请求工具的标识符。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别字段 `chatkit.thread_item`.

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

        按顺序排列的助手响应片段。

        - `annotations: array of object { source, type }  or object { source, type }`

          附加到响应文本的、按顺序排列的注解列表。

          - `File object { source, type }`

            引用已上传文件的注解。

            - `source: object { filename, type }`

              该注解引用的文件附件。

              - `filename: string`

                该注解引用的文件名。

              - `type: "file"`

                始终为以下值的类型判别字段 `file`.

                - `"file"`

            - `type: "file"`

              类型鉴别器，始终为 `file` （对于此注解而言）。

              - `"file"`

          - `URL object { source, type }`

            引用 URL 的注解。

            - `source: object { type, url }`

              该注解引用的 URL。

              - `type: "url"`

                始终为以下值的类型判别字段 `url`.

                - `"url"`

              - `url: string`

                该注解引用的 URL。

            - `type: "url"`

              类型鉴别器，始终为 `url` （对于此注解而言）。

              - `"url"`

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          始终为以下值的类型判别字段 `output_text`.

          - `"output_text"`

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.assistant_message"`

        始终为以下值的类型判别字段 `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      用于渲染 widget 负载的线程项。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.widget"`

        始终为以下值的类型判别字段 `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        在 UI 中渲染的序列化 widget 负载。

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      助手发起的客户端工具调用的记录。

      - `id: string`

        线程项的标识符。

      - `arguments: string`

        发送到工具的 JSON 编码参数。

      - `call_id: string`

        客户端工具调用的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `name: string`

        被调用的工具名称。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别字段 `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        从该工具捕获的 JSON 编码输出。执行进行中时默认为 null。

      - `status: "in_progress" or "completed"`

        工具调用的执行状态。

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        父线程的标识符。

      - `type: "chatkit.client_tool_call"`

        始终为以下值的类型判别字段 `chatkit.client_tool_call`.

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

        始终为以下值的类型判别字段 `chatkit.thread_item`.

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

        始终为以下值的类型判别字段 `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      在会话中分组到一起的 工作流 任务集合。

      - `id: string`

        线程项的标识符。

      - `created_at: number`

        项创建时的 Unix 时间戳（以秒为单位）。

      - `object: "chatkit.thread_item"`

        始终为以下值的类型判别字段 `chatkit.thread_item`.

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

        始终为以下值的类型判别字段 `chatkit.task_group`.

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
