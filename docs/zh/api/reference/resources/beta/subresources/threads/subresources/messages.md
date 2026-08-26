# 消息

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

## 创建消息

**post** `/threads/{thread_id}/messages`

创建一条消息。

### 路径参数

- `thread_id: string`

### 请求体参数

- `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

  消息的文本内容。

  - `TextContent = string`

    消息的文本内容。

  - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    一个内容部分数组，每个部分具有已定义的类型，可以属于类型 `text` 或图片可以通过 `image_url` 或 `image_file`。传递。图片类型仅在 [Vision 兼容模型](/docs/models).

    - `ImageFileContentBlock object { image_file, type }`

      引用一张图片 [文件](/docs/api-reference/files) 在消息的内容中。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图片的 ID。设置 `purpose="vision"` 在上传文件时，如果你稍后需要显示文件内容。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定，指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的图片 URL。

      - `image_url: ImageURL`

        - `url: string`

          图片的外部 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图片的细节级别。 `low` 使用的令牌数更少，你可以选择使用高分辨率，通过 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlockParam object { text, type }`

      消息中作为一部分的文本内容。

      - `text: string`

        要发送给模型的文本内容

      - `type: "text"`

        始终 `text`.

        - `"text"`

- `role: "user" or "assistant"`

  创建消息的实体的角色。允许的值包括：

  - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来表示用户生成的消息。
  - `assistant`：表示消息由助手生成。使用此值将助手的消息插入到对话中。

  - `"user"`

  - `"assistant"`

- `attachments: optional array of object { file_id, tools }  or null`

  附加到消息的文件列表，以及应将它们添加到的工具。

  - `file_id: optional string`

    要附加到消息的文件的 ID。

  - `tools: optional array of CodeInterpreterTool or object { type }`

    要将此文件添加到的工具。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具的类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type }`

      - `type: "file_search"`

        正在定义的工具的类型： `file_search`

        - `"file_search"`

- `metadata: optional Metadata or null`

  可以附加到对象的 16 个键值对的集合。这可以
  用于以结构化格式存储有关对象的额外信息，以及
  通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示线程中的一条消息 [thread](/docs/api-reference/threads).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，编写此消息的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要将此文件添加到的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          正在定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          正在定义的工具类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息的内容，以文本和/或图像的数组形式呈现。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [File](/docs/api-reference/files) 图像。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [File](/docs/api-reference/files) 消息内容中图像的 ID。在上传 File 时设置， `purpose="vision"` 以便日后需要显示文件内容时使用。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定了图像，则指定图像的细节级别。 `low` 使用的令牌较少，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      在消息内容中引用图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图像类型之一：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用的令牌较少，你可以选择使用高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引文，指向与助手或消息关联的特定文件中的特定引用。当助手使用“file_search”工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引文来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成的文件 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化
    格式存储关于对象的额外信息，并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    产生消息的实体。取值为 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与创建此消息相关的 [运行](/docs/api-reference/runs) 的 ID。当使用创建消息或创建线程端点手动创建消息时，值为 `null` 。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) 此消息所属的 ID。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "content": "string",
          "role": "user"
        }'
```

#### 响应

```json
{
  "id": "id",
  "assistant_id": "assistant_id",
  "attachments": [
    {
      "file_id": "file_id",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ]
    }
  ],
  "completed_at": 0,
  "content": [
    {
      "image_file": {
        "file_id": "file_id",
        "detail": "auto"
      },
      "type": "image_file"
    }
  ],
  "created_at": 0,
  "incomplete_at": 0,
  "incomplete_details": {
    "reason": "content_filter"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.message",
  "role": "user",
  "run_id": "run_id",
  "status": "in_progress",
  "thread_id": "thread_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "role": "user",
      "content": "How does AI work? Explain it in simple terms."
    }'
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1713226573,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "attachments": [],
  "metadata": {}
}
```

## 删除消息

**删除** `/threads/{thread_id}/messages/{message_id}`

删除一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 返回值

- `MessageDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.message.deleted"`

    - `"thread.message.deleted"`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.message.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message.deleted",
  "deleted": true
}
```

## 列出消息

**get** `/threads/{thread_id}/messages`

返回指定线程的消息列表。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个定义你在列表中位置的对象 ID。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个定义你在列表中位置的对象 ID。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 开头，你的后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  要返回的对象数量限制。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  排序顺序由 `created_at` 对象的时间戳决定。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

- `run_id: optional string`

  按生成消息的运行 ID 筛选消息。

### 返回

- `data: array of Message`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如适用，编写此消息的 [智能体](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要添加此文件的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          正在定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          正在定义的工具类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息内容，以文本和/或图像的数组形式呈现。

    - `ImageFileContentBlock object { image_file, type }`

      在消息内容中引用一个 [文件](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。在 `purpose="vision"` 上传文件时设置，如果之后需要显示文件内容。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定，指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      在消息内容中引用图片 URL。

      - `image_url: ImageURL`

        - `url: string`

          图片的外部 URL，必须为支持的图片类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图片的细节级别。 `low` 使用较少 token，你可以选择使用高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中指向与智能体或消息关联的特定文件中特定引用的引用。当智能体使用“file_search”工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                该引用来自的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当智能体使用 `code_interpreter` 工具生成文件时产生的文件 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成的文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      智能体生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（秒）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对集合。这可以
    用于以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与 [运行](/docs/api-reference/runs) 关联的 ID，该运行 `null` 与创建此消息相关。当使用创建消息或创建线程端点手动创建消息时，值为。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [thread](/docs/api-reference/threads) 该消息所属的 ID。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "assistant_id": "assistant_id",
      "attachments": [
        {
          "file_id": "file_id",
          "tools": [
            {
              "type": "code_interpreter"
            }
          ]
        }
      ],
      "completed_at": 0,
      "content": [
        {
          "image_file": {
            "file_id": "file_id",
            "detail": "auto"
          },
          "type": "image_file"
        }
      ],
      "created_at": 0,
      "incomplete_at": 0,
      "incomplete_details": {
        "reason": "content_filter"
      },
      "metadata": {
        "foo": "string"
      },
      "object": "thread.message",
      "role": "user",
      "run_id": "run_id",
      "status": "in_progress",
      "thread_id": "thread_id"
    }
  ],
  "first_id": "msg_abc123",
  "has_more": false,
  "last_id": "msg_abc123",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "msg_abc123",
      "object": "thread.message",
      "created_at": 1699016383,
      "assistant_id": null,
      "thread_id": "thread_abc123",
      "run_id": null,
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "How does AI work? Explain it in simple terms.",
            "annotations": []
          }
        }
      ],
      "attachments": [],
      "metadata": {}
    },
    {
      "id": "msg_abc456",
      "object": "thread.message",
      "created_at": 1699016383,
      "assistant_id": null,
      "thread_id": "thread_abc123",
      "run_id": null,
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "Hello, what is AI?",
            "annotations": []
          }
        }
      ],
      "attachments": [],
      "metadata": {}
    }
  ],
  "first_id": "msg_abc123",
  "last_id": "msg_abc456",
  "has_more": false
}
```

## 检索消息

**get** `/threads/{thread_id}/messages/{message_id}`

检索一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示一个 [线程](/docs/api-reference/threads).

  - `id: string`

    内的消息。标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，则为撰写此消息的 [助手](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要将此文件添加到的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          所定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          所定义的工具类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（秒）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息内容，为文本和/或图像的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [文件](/docs/api-reference/files) 图像。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。如果在之后需要显示文件内容，则在上传文件时设置 `purpose="vision"` 。

        - `detail: optional "auto" or "low" or "high"`

          如果由用户指定，指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率，通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      在消息内容中引用一个图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率，通过 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，该文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      由助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（秒）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    在不完整的消息上，说明消息不完整的原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象的16组键值对。这可用于
    以结构化格式存储关于对象的额外信息，并
    通过API或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    产生消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与创建此消息关联的 [运行](/docs/api-reference/runs) 的 ID。当使用创建消息或创建线程端点手动创建消息时，值为 `null` 。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) 该消息所属的 ID。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "assistant_id": "assistant_id",
  "attachments": [
    {
      "file_id": "file_id",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ]
    }
  ],
  "completed_at": 0,
  "content": [
    {
      "image_file": {
        "file_id": "file_id",
        "detail": "auto"
      },
      "type": "image_file"
    }
  ],
  "created_at": 0,
  "incomplete_at": 0,
  "incomplete_details": {
    "reason": "content_filter"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.message",
  "role": "user",
  "run_id": "run_id",
  "status": "in_progress",
  "thread_id": "thread_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699017614,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "attachments": [],
  "metadata": {}
}
```

## 修改消息

**post** `/threads/{thread_id}/messages/{message_id}`

修改一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  可附加到对象上的 16 个键值对的集合。这可以
  用于以结构化格式存储有关该对象的额外信息，
  并通过 API 或仪表盘查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示 [thread](/docs/api-reference/threads).

  - `id: string`

    内的消息。该标识符可在 API 端点中引用。

  - `assistant_id: string or null`

    如适用，则为编写此消息的 [assistant（智能体）](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要将此文件添加到的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          正在定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          正在定义的工具类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息内容，为文本和/或图像的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的图像 [File](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [File](/docs/api-reference/files) 消息内容中图像的 ID。在上传 `purpose="vision"` 时设置，以便日后需要显示文件内容时使用。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定，则指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率， `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率， `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              需要替换的消息内容中的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时生成的文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成的文件的 ID。

            - `start_index: number`

            - `text: string`

              需要替换的消息内容中的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（秒）。

  - `incomplete_at: number or null`

    消息标记为不完整时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因详情。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    产生消息的实体。可为 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与此消息创建关联的 [运行](/docs/api-reference/runs) 的 ID。当使用创建消息或创建线程端点手动创建消息时，值为 `null` 。消息的状态，可为。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可为 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) 此消息所属的 ID。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### 响应

```json
{
  "id": "id",
  "assistant_id": "assistant_id",
  "attachments": [
    {
      "file_id": "file_id",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ]
    }
  ],
  "completed_at": 0,
  "content": [
    {
      "image_file": {
        "file_id": "file_id",
        "detail": "auto"
      },
      "type": "image_file"
    }
  ],
  "created_at": 0,
  "incomplete_at": 0,
  "incomplete_details": {
    "reason": "content_filter"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.message",
  "role": "user",
  "run_id": "run_id",
  "status": "in_progress",
  "thread_id": "thread_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699017614,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "file_ids": [],
  "metadata": {
    "modified": "true",
    "user": "abc123"
  }
}
```

## 领域类型

### 文件引用注释

- `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

  消息中的引用，指向与助手或消息关联的特定文件中的特定引用文本。当助手使用 "file_search" 工具搜索文件时生成。

  - `end_index: number`

  - `file_citation: object { file_id }`

    - `file_id: string`

      引文来源的特定文件的 ID。

  - `start_index: number`

  - `text: string`

    消息内容中需要替换的文本。

  - `type: "file_citation"`

    始终 `file_citation`.

    - `"file_citation"`

### 文件引用增量注释

- `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

  消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用"file_search"工具搜索文件时生成。

  - `index: number`

    文本内容部分中注释的索引。

  - `type: "file_citation"`

    始终 `file_citation`.

    - `"file_citation"`

  - `end_index: optional number`

  - `file_citation: optional object { file_id, quote }`

    - `file_id: optional string`

      引用来源的特定文件的ID。

    - `quote: optional string`

      文件中的具体引文。

  - `start_index: optional number`

  - `text: optional string`

    消息内容中需要替换的文本。

### 文件路径注解

- `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

  当智能体使用 `code_interpreter` 工具生成文件时，该文件的 URL。

  - `end_index: number`

  - `file_path: object { file_id }`

    - `file_id: string`

      所生成文件的 ID。

  - `start_index: number`

  - `text: string`

    消息内容中需要替换的文本。

  - `type: "file_path"`

    始终 `file_path`.

    - `"file_path"`

### 文件路径增量注释

- `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

  助手使用该工具生成文件时，生成文件的 URL。 `code_interpreter` 工具生成文件。

  - `index: number`

    文本内容部分中注释的索引。

  - `type: "file_path"`

    始终 `file_path`.

    - `"file_path"`

  - `end_index: optional number`

  - `file_path: optional object { file_id }`

    - `file_id: optional string`

      生成文件的 ID。

  - `start_index: optional number`

  - `text: optional string`

    消息内容中需要替换的文本。

### 图片文件

- `ImageFile object { file_id, detail }`

  - `file_id: string`

    该 [文件](/docs/api-reference/files) 消息内容中图片的 ID。设置 `purpose="vision"` 上传文件时，如果之后需要显示文件内容。

  - `detail: optional "auto" or "low" or "high"`

    如果用户指定了图片，则指定图片的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率。 `high`.

    - `"auto"`

    - `"low"`

    - `"high"`

### 图片文件内容块

- `ImageFileContentBlock object { image_file, type }`

  引用图片 [文件](/docs/api-reference/files) 位于消息内容中。

  - `image_file: ImageFile`

    - `file_id: string`

      该 [文件](/docs/api-reference/files) 消息内容中图片的 ID。设置 `purpose="vision"` 上传文件时设置，以便稍后显示文件内容。

    - `detail: optional "auto" or "low" or "high"`

      指定用户指定的图片细节级别。 `low` 使用更少的令牌，你可选择高分辨率使用 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_file"`

    始终 `image_file`.

    - `"image_file"`

### 图像文件增量

- `ImageFileDelta object { detail, file_id }`

  - `detail: optional "auto" or "low" or "high"`

    指定用户指定时图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

    - `"auto"`

    - `"low"`

    - `"high"`

  - `file_id: optional string`

    该 [文件](/docs/api-reference/files) 消息内容中图像的ID。设置 `purpose="vision"` 当上传文件时，如果之后需要显示文件内容。

### 图像文件增量块

- `ImageFileDeltaBlock object { index, type, image_file }`

  引用图片 [文件](/docs/api-reference/files) 在消息内容中。

  - `index: number`

    消息中内容部分的索引。

  - `type: "image_file"`

    始终 `image_file`.

    - `"image_file"`

  - `image_file: optional ImageFileDelta`

    - `detail: optional "auto" or "low" or "high"`

      如果用户指定，指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `file_id: optional string`

      该 [文件](/docs/api-reference/files) 消息内容中图片的ID。设置 `purpose="vision"` 在上传文件时，如果你需要在之后显示文件内容。

### 图片 URL

- `ImageURL object { url, detail }`

  - `url: string`

    图片的外部 URL，必须是受支持的图片类型：jpeg、jpg、png、gif、webp。

  - `detail: optional "auto" or "low" or "high"`

    指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`。默认值为 `auto`

    - `"auto"`

    - `"low"`

    - `"high"`

### 图片 URL 内容块

- `ImageURLContentBlock object { image_url, type }`

  在消息内容中引用图片 URL。

  - `image_url: ImageURL`

    - `url: string`

      图片的外部 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

    - `detail: optional "auto" or "low" or "high"`

      指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用 `high`。默认值为 `auto`

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_url"`

    内容部分的类型。

    - `"image_url"`

### 图像 URL 增量

- `ImageURLDelta object { detail, url }`

  - `detail: optional "auto" or "low" or "high"`

    指定图像的细节级别。 `low` 使用更少的令牌，你可以选择高分辨率使用 `high`.

    - `"auto"`

    - `"low"`

    - `"high"`

  - `url: optional string`

    图像的 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

### 图像 URL Delta 块

- `ImageURLDeltaBlock object { index, type, image_url }`

  在消息内容中引用图片 URL。

  - `index: number`

    内容部分在消息中的索引。

  - `type: "image_url"`

    始终 `image_url`.

    - `"image_url"`

  - `image_url: optional ImageURLDelta`

    - `detail: optional "auto" or "low" or "high"`

      指定图片的细节级别。 `low` 使用更少的令牌，你可以通过 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `url: optional string`

      图片的 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

### 消息

- `Message object { id, assistant_id, attachments, 11 more }`

  表示 [线程](/docs/api-reference/threads).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如适用，则为创作了此消息的 [助手](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要添加此文件的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          正在定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          正在定义的工具类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息内容为文本和/或图像的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [文件](/docs/api-reference/files) 图像。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。在 `purpose="vision"` 上传文件时设置，如果之后需要显示文件内容。

        - `detail: optional "auto" or "low" or "high"`

          指定用户设置时图像的细节级别。 `low` 使用的令牌更少，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用的令牌更少，你可以选择使用高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引用。当助手使用"file_search"工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成的文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，有关消息不完整原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    以及通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与此消息创建相关的 [运行](/docs/api-reference/runs) 的 ID。值为 `null` 当消息通过创建消息或创建线程端点手动创建时。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) 此消息所属的 ID。

### 消息已删除

- `MessageDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.message.deleted"`

    - `"thread.message.deleted"`

### 消息增量

- `MessageDelta object { content, role }`

  包含消息中已更改字段的增量信息。

  - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

    消息内容，以文本和/或图像数组的形式呈现。

    - `ImageFileDeltaBlock object { index, type, image_file }`

      引用一个图像 [文件](/docs/api-reference/files) 位于消息内容中。

      - `index: number`

        消息中内容部分的索引。

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

      - `image_file: optional ImageFileDelta`

        - `detail: optional "auto" or "low" or "high"`

          指定用户所设定图像的细节级别。 `low` 使用更少的令牌，你可以通过以下方式选择高分辨率： `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_id: optional string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置为 `purpose="vision"` 上传文件时设置，以便日后显示文件内容。

    - `TextDeltaBlock object { index, type, text }`

      作为消息一部分的文本内容。

      - `index: number`

        消息中内容部分的索引。

      - `type: "text"`

        始终 `text`.

        - `"text"`

      - `text: optional TextDelta`

        - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

          - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的具体引文。当助手使用 "file_search" 工具搜索文件时生成。

            - `index: number`

              文本内容部分中注释的索引。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

            - `end_index: optional number`

            - `file_citation: optional object { file_id, quote }`

              - `file_id: optional string`

                引文来源的特定文件的 ID。

              - `quote: optional string`

                文件中的具体引用。

            - `start_index: optional number`

            - `text: optional string`

              消息内容中需要替换的文本。

          - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

            智能体使用该工具生成文件时生成的文件的 URL。 `code_interpreter` 工具生成文件。

            - `index: number`

              文本内容部分中注释的索引。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

            - `end_index: optional number`

            - `file_path: optional object { file_id }`

              - `file_id: optional string`

                生成的文件的 ID。

            - `start_index: optional number`

            - `text: optional string`

              消息内容中需要替换的文本。

        - `value: optional string`

          构成文本的数据。

    - `RefusalDeltaBlock object { index, type, refusal }`

      消息中作为一部分的拒绝内容。

      - `index: number`

        消息中拒绝部分的索引。

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

      - `refusal: optional string`

    - `ImageURLDeltaBlock object { index, type, image_url }`

      引用消息内容中的图像 URL。

      - `index: number`

        消息中内容部分的索引。

      - `type: "image_url"`

        始终 `image_url`.

        - `"image_url"`

      - `image_url: optional ImageURLDelta`

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率（通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `url: optional string`

          图像的 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

  - `role: optional "user" or "assistant"`

    产生消息的实体。其中之一为 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

### 消息增量事件

- `MessageDeltaEvent object { id, delta, object }`

  表示消息增量，即流式传输期间消息上任何更改的字段。

  - `id: string`

    消息的标识符，可在 API 端点中引用。

  - `delta: MessageDelta`

    包含消息上已更改字段的增量。

    - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

      消息的内容，为文本和/或图像的数组。

      - `ImageFileDeltaBlock object { index, type, image_file }`

        引用消息内容中的图像 [文件](/docs/api-reference/files) 。

        - `index: number`

          消息中内容部分的索引。

        - `type: "image_file"`

          始终 `image_file`.

          - `"image_file"`

        - `image_file: optional ImageFileDelta`

          - `detail: optional "auto" or "low" or "high"`

            如果用户指定，则指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_id: optional string`

            该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 在上传文件时，如果你之后需要显示文件内容。

      - `TextDeltaBlock object { index, type, text }`

        作为消息一部分的文本内容。

        - `index: number`

          消息中内容部分的索引。

        - `type: "text"`

          始终 `text`.

          - `"text"`

        - `text: optional TextDelta`

          - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

            - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

              消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

              - `index: number`

                文本内容部分中注释的索引。

              - `type: "file_citation"`

                始终 `file_citation`.

                - `"file_citation"`

              - `end_index: optional number`

              - `file_citation: optional object { file_id, quote }`

                - `file_id: optional string`

                  引文来源的具体文件 ID。

                - `quote: optional string`

                  文件中的具体引用内容。

              - `start_index: optional number`

              - `text: optional string`

                消息内容中需要替换的文本。

            - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

              当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

              - `index: number`

                文本内容部分中注释的索引。

              - `type: "file_path"`

                始终 `file_path`.

                - `"file_path"`

              - `end_index: optional number`

              - `file_path: optional object { file_id }`

                - `file_id: optional string`

                  所生成文件的 ID。

              - `start_index: optional number`

              - `text: optional string`

                消息内容中需要替换的文本。

          - `value: optional string`

            构成文本的数据。

      - `RefusalDeltaBlock object { index, type, refusal }`

        作为消息一部分的拒绝内容。

        - `index: number`

          消息中拒绝部分的索引。

        - `type: "refusal"`

          始终 `refusal`.

          - `"refusal"`

        - `refusal: optional string`

      - `ImageURLDeltaBlock object { index, type, image_url }`

        引用消息内容中的图像 URL。

        - `index: number`

          消息中内容部分的索引。

        - `type: "image_url"`

          始终 `image_url`.

          - `"image_url"`

        - `image_url: optional ImageURLDelta`

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `url: optional string`

            图像的 URL，必须为支持的图像类型：jpeg、jpg、png、gif、webp。

    - `role: optional "user" or "assistant"`

      生成消息的实体。取值为 `user` 或 `assistant`.

      - `"user"`

      - `"assistant"`

  - `object: "thread.message.delta"`

    对象类型，始终为 `thread.message.delta`.

    - `"thread.message.delta"`

### 拒绝内容块

- `RefusalContentBlock object { refusal, type }`

  助手生成的拒绝内容。

  - `refusal: string`

  - `type: "refusal"`

    始终 `refusal`.

    - `"refusal"`

### 拒绝增量块

- `RefusalDeltaBlock object { index, type, refusal }`

  作为消息一部分的拒绝内容。

  - `index: number`

    消息中拒绝部分的索引。

  - `type: "refusal"`

    始终 `refusal`.

    - `"refusal"`

  - `refusal: optional string`

### 文本

- `Text object { annotations, value }`

  - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

    - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

      消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“文件搜索”工具搜索文件时生成。

      - `end_index: number`

      - `file_citation: object { file_id }`

        - `file_id: string`

          引用来源的特定文件的 ID。

      - `start_index: number`

      - `text: string`

        消息内容中需要替换的文本。

      - `type: "file_citation"`

        始终 `file_citation`.

        - `"file_citation"`

    - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

      当助手使用 `code_interpreter` 工具生成文件时，生成的文件 URL。

      - `end_index: number`

      - `file_path: object { file_id }`

        - `file_id: string`

          生成文件的 ID。

      - `start_index: number`

      - `text: string`

        消息内容中需要替换的文本。

      - `type: "file_path"`

        始终 `file_path`.

        - `"file_path"`

  - `value: string`

    构成文本的数据。

### 文本内容块

- `TextContentBlock object { text, type }`

  作为消息组成部分的文本内容。

  - `text: Text`

    - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

      - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

        消息中的引用，指向与助手或消息关联的特定文件中的特定引用。当助手使用“file_search”工具搜索文件时生成。

        - `end_index: number`

        - `file_citation: object { file_id }`

          - `file_id: string`

            引用所来自的特定文件的 ID。

        - `start_index: number`

        - `text: string`

          消息内容中需要被替换的文本。

        - `type: "file_citation"`

          始终 `file_citation`.

          - `"file_citation"`

      - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

        当助手使用 `code_interpreter` 工具生成文件时，所生成文件的 URL。

        - `end_index: number`

        - `file_path: object { file_id }`

          - `file_id: string`

            所生成文件的 ID。

        - `start_index: number`

        - `text: string`

          消息内容中需要被替换的文本。

        - `type: "file_path"`

          始终 `file_path`.

          - `"file_path"`

    - `value: string`

      构成文本的数据。

  - `type: "text"`

    始终 `text`.

    - `"text"`

### 文本内容块参数

- `TextContentBlockParam object { text, type }`

  作为消息一部分的文本内容。

  - `text: string`

    要发送给模型的文本内容

  - `type: "text"`

    始终 `text`.

    - `"text"`

### 文本增量

- `TextDelta object { annotations, value }`

  - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

    - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

      消息中的引文，指向与助手或消息关联的特定文件中的特定引用。当助手使用“文件搜索”工具搜索文件时生成。

      - `index: number`

        文本内容部分中注释的索引。

      - `type: "file_citation"`

        始终 `file_citation`.

        - `"file_citation"`

      - `end_index: optional number`

      - `file_citation: optional object { file_id, quote }`

        - `file_id: optional string`

          引文来源的特定文件的ID。

        - `quote: optional string`

          文件中的具体引用。

      - `start_index: optional number`

      - `text: optional string`

        消息内容中需要替换的文本。

    - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

      当助手使用 `code_interpreter` 工具生成文件时生成的文件的URL。

      - `index: number`

        文本内容部分中注释的索引。

      - `type: "file_path"`

        始终 `file_path`.

        - `"file_path"`

      - `end_index: optional number`

      - `file_path: optional object { file_id }`

        - `file_id: optional string`

          所生成文件的ID。

      - `start_index: optional number`

      - `text: optional string`

        消息内容中需要替换的文本。

  - `value: optional string`

    构成文本的数据。

### 文本增量块

- `TextDeltaBlock object { index, type, text }`

  消息的一部分文本内容。

  - `index: number`

    消息中内容部分的索引。

  - `type: "text"`

    始终 `text`.

    - `"text"`

  - `text: optional TextDelta`

    - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

      - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

        消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用"file_search"工具搜索文件时生成。

        - `index: number`

          文本内容部分中注释的索引。

        - `type: "file_citation"`

          始终 `file_citation`.

          - `"file_citation"`

        - `end_index: optional number`

        - `file_citation: optional object { file_id, quote }`

          - `file_id: optional string`

            引文来源的特定文件的 ID。

          - `quote: optional string`

            文件中的特定引文。

        - `start_index: optional number`

        - `text: optional string`

          消息内容中需要替换的文本。

      - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

        当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

        - `index: number`

          文本内容部分中注释的索引。

        - `type: "file_path"`

          始终 `file_path`.

          - `"file_path"`

        - `end_index: optional number`

        - `file_path: optional object { file_id }`

          - `file_id: optional string`

            生成的文件的 ID。

        - `start_index: optional number`

        - `text: optional string`

          消息内容中需要替换的文本。

    - `value: optional string`

      构成文本的数据。
