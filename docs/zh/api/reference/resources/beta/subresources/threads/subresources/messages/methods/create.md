> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

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

    由具有定义类型的内容部分组成，其中每个部分可以为 `text` 类型，或者图片可以通过 `image_url` 或 `image_file`。传递。图片类型仅在 [视觉兼容模型](/docs/models).

    - `ImageFileContentBlock object { image_file, type }`

      上支持。引用消息内容中的一张 [文件](/docs/api-reference/files) 。内容是消息中的文本内容。

      - `image_file: ImageFile`

        - `file_id: string`

          表示 [文件](/docs/api-reference/files) 在消息内容中的 ID。当上传文件时，设置 `purpose="vision"` 以便之后需要显示文件内容时可以检索。

        - `detail: optional "auto" or "low" or "high"`

          指定用户图像细节的级别。默认情况下使用较少的令牌，你可以通过选择使用。 `low` 来使用高分辨率， `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      使用高分辨率。引用消息内容中的图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图像类型之一：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率，通过 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlockParam object { text, type }`

      作为消息一部分的文本内容。

      - `text: string`

        要发送给模型的文本内容

      - `type: "text"`

        始终 `text`.

        - `"text"`

- `role: "user" or "assistant"`

  创建消息的实体的角色。允许的值包括：

  - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来表示用户生成的消息。
  - `assistant`：表示消息由助手生成。使用此值将助手的消息插入对话中。

  - `"user"`

  - `"assistant"`

- `attachments: optional array of object { file_id, tools }  or null`

  附加到消息的文件列表，以及它们应添加到的工具。

  - `file_id: optional string`

    要附加到消息的文件的 ID。

  - `tools: optional array of CodeInterpreterTool or object { type }`

    要添加此文件的工具。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具的类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type }`

      - `type: "file_search"`

        正在定义的工具的类型： `file_search`

        - `"file_search"`

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。这可以
  用于以结构化格式存储有关对象的额外信息，
  并通过 API 或仪表板查询对象。

  键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。
  值是最长为 512 个字符的字符串。

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示一个线程内的消息， [线程](/docs/api-reference/threads).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，创建此消息的 [助理](/docs/api-reference/assistants) 的 ID。

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

    消息完成时的 Unix 时间戳（秒）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息内容，为文本和/或图片的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [文件](/docs/api-reference/files) 图片。

      - `image_file: ImageFile`

        - `file_id: string`

          消息内容中图片的 [文件](/docs/api-reference/files) ID。上传文件时设置该值，以便之后需要显示文件内容时使用。 `purpose="vision"` 上传文件时设置该值，以便之后需要显示文件内容时使用。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定了图像，则指定图像的细节级别。 `low` 使用的令牌更少，你可以选择使用以下选项启用高分辨率 `high`.

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

          指定图像的细节级别。 `low` 使用的令牌更少，你可以选择使用以下选项启用高分辨率 `high`。默认值为 `auto`

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

            当助手使用以下工具生成文件时，生成的文件的 URL `code_interpreter` 工具来生成文件。

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

    可附加到对象的 16 个键值对集合。这可用于
    以结构化格式存储有关该对象的附加信息，
    并通过 API 或仪表盘查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。
    值的最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与此消息创建相关联的 [运行](/docs/api-reference/runs) 的 ID。当使用创建消息或创建线程端点手动创建消息时，值为 `null` null。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [thread](/docs/api-reference/threads) ID 即此消息所属的线程 ID。

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
