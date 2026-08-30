> 完整文档索引请参阅 [llms.txt](/llms.txt)。Markdown 版本的文档页面可通过在页面 URL 末尾附加 `.md` 获取。

## 创建消息

**post** `/threads/{thread_id}/messages`

创建消息。

### 路径参数

- `thread_id: string`

### 请求体参数

- `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

  消息的文本内容。

  - `TextContent = string`

    消息的文本内容。

  - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    由已定义类型组成的内容部分数组，每个部分的类型可以是 `text` ，或者可以通过 `image_url` 传入图像 `image_file`。图像类型仅在 [支持视觉的模型](/docs/models).

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的一张图像 [文件](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。如果需要在后续显示文件内容，请在上传 `purpose="vision"` 时进行设置。

        - `detail: optional "auto" or "low" or "high"`

          指定由用户指定的图像的细节级别。 `low` 消耗的 token 更少，你可以通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        选择使用高分辨率 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的一个图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 消耗的 token 更少，你可以通过 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlockParam object { text, type }`

      作为消息一部分的文本内容。

      - `text: string`

        发送给模型的文本内容

      - `type: "text"`

        选择使用高分辨率 `text`.

        - `"text"`

- `role: "user" or "assistant"`

  创建消息的实体的角色。允许的值包括：

  - `user`：表示消息由实际用户发送，在大多数情况下应用于表示用户生成的消息。
  - `assistant`：表示消息由助手生成。使用此值可将助手消息插入到对话中。

  - `"user"`

  - `"assistant"`

- `attachments: optional array of object { file_id, tools }  or null`

  附加到消息的文件列表，以及应将这些文件添加到的工具。

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

- `metadata: optional Metadata or null`

  可附加到对象的 16 组键值对。这可以
  用于以结构化形式存储有关对象的
  附加信息，并通过 API 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

### 返回值

- `Message object { id, assistant_id, attachments, 11 more }`

  表示 [thread](/docs/api-reference/threads).

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，编写此消息的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及这些文件被添加到的工具。

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

    消息内容，由文本和/或图像组成的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的一张图像 [文件](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。如果需要在后续显示文件内容，请在上传 `purpose="vision"` 时进行设置。

        - `detail: optional "auto" or "low" or "high"`

          指定由用户指定的图像的细节级别。 `low` 消耗的 token 更少，你可以通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        选择使用高分辨率 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的一个图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 消耗的 token 更少，你可以通过 `high`。默认值为 `auto`

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

            消息中的一条引用，指向与该智能体或该消息关联的特定文件中的具体引文。当智能体使用 "file_search" 工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                该引用所来自的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要被替换的文本。

            - `type: "file_citation"`

              选择使用高分辨率 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            智能体使用 `code_interpreter` 工具生成文件时生成的文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                所生成文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要被替换的文本。

            - `type: "file_path"`

              选择使用高分辨率 `file_path`.

              - `"file_path"`

        - `value: string`

          组成该文本的数据。

      - `type: "text"`

        选择使用高分辨率 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      智能体生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        选择使用高分辨率 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明该消息不完整的详细原因。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      该消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化形式存储有关对象的
    附加信息，并通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，恒为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成该消息的实体。取值为以下之一 `user` 传入图像 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与此消息关联的 [run](/docs/api-reference/runs) 的 ID。如果消息是通过 create message 或 create thread 端点手动创建的，则其取值为 `null` （对应通过 create message 或 create thread 端点手动创建消息的情况）。

  - `status: "in_progress" or "incomplete" or "completed"`

    该消息的状态，可为 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [thread](/docs/api-reference/threads) 所属线程的 ID。

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
