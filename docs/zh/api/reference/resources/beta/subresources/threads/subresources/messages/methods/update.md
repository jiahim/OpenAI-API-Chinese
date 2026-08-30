> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得 Markdown 版本的文档页面。

## 修改消息

**post** `/threads/{thread_id}/messages/{message_id}`

修改一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储关于对象的附加信息，并通过
  API 或控制面板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

### Returns

- `Message object { id, assistant_id, attachments, 11 more }`

  表示 [thread](/docs/api-reference/threads).

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，编写此消息的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到该消息的文件列表，以及这些文件被添加到的工具。

    - `file_id: optional string`

      要附加到该消息的文件 ID。

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

    消息的内容，为文本和/或图像的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的图像 [File](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [File](/docs/api-reference/files) 消息内容中图像的 ID。如果需要稍后显示文件内容，请在上传 `purpose="vision"` 时设置。

        - `detail: optional "auto" or "low" or "high"`

          如果由用户指定，则指定图像的细节等级。 `low` 使用的 token 较少，你可以通过以下方式选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        Always `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的图片 URL。

      - `image_url: ImageURL`

        - `url: string`

          图片的外部 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图片的细节级别。 `low` 使用的 token 较少，你可以通过以下方式选择使用高分辨率 `high`. 默认值为 `auto`

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

            消息中的一条引用，指向与该助手或消息关联的特定文件中的特定引用片段。当助手使用 “file_search” 工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                该引用所来自的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要被替换的文本。

            - `type: "file_citation"`

              Always `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时生成的该文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                已生成文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要被替换的文本。

            - `type: "file_path"`

              Always `file_path`.

              - `"file_path"`

        - `value: string`

          组成该文本的数据。

      - `type: "text"`

        Always `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      由助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        Always `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    在不完整的消息上，关于该消息不完整原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储关于对象的附加信息，并通过
    API 或控制面板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成该消息的实体。取值之一为 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与此消息关联的 [运行](/docs/api-reference/runs) 的 ID。如果消息是通过 create message 或 create thread 端点手动创建的，则该值为 `null` 。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [thread](/docs/api-reference/threads) 所属线程的 ID。

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
