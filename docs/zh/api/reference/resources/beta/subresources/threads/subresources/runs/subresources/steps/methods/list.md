> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps`

返回属于某次运行（run）的运行步骤（run step）列表。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，则后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `include: optional array of RunStepInclude`

  要包含在响应中的其他字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 来获取文件搜索结果内容。

  请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

- `limit: optional number`

  要返回的对象数量限制。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序， `desc` 用于降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of RunStep`

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（以秒为单位）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（以秒为单位）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded"`

      取值为 `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的可读描述。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的附加信息，
    并可通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    此 [运行](/docs/api-reference/runs) 的 ID，即此运行步骤所属的。

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    运行步骤的状态，可以是 `in_progress`, `cancelled`, `failed`, `completed`，或 `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    运行步骤的详细信息。

    - `MessageCreationStepDetails object { message_creation, type }`

      运行步骤创建消息的详细信息。

      - `message_creation: object { message_id }`

        - `message_id: string`

          此运行步骤创建的消息的 ID。

      - `type: "message_creation"`

        始终 `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      工具调用的详细信息。

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每一项都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤一部分的代码解释器工具调用的文本输出。

                - `logs: string`

                  代码解释器工具调用的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [文件](/docs/api-reference/files) 的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅在通过 include 查询参数请求时，才会包含该内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于此类工具调用，这始终是 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            被调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，这将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于此类工具调用，这始终是 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    被运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。此值将为 `null` 当运行步骤的状态为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数量。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/steps \
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
      "cancelled_at": 0,
      "completed_at": 0,
      "created_at": 0,
      "expired_at": 0,
      "failed_at": 0,
      "last_error": {
        "code": "server_error",
        "message": "message"
      },
      "metadata": {
        "foo": "string"
      },
      "object": "thread.run.step",
      "run_id": "run_id",
      "status": "in_progress",
      "step_details": {
        "message_creation": {
          "message_id": "message_id"
        },
        "type": "message_creation"
      },
      "thread_id": "thread_id",
      "type": "message_creation",
      "usage": {
        "completion_tokens": 0,
        "prompt_tokens": 0,
        "total_tokens": 0
      }
    }
  ],
  "first_id": "step_abc123",
  "has_more": false,
  "last_id": "step_abc456",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "step_abc123",
      "object": "thread.run.step",
      "created_at": 1699063291,
      "run_id": "run_abc123",
      "assistant_id": "asst_abc123",
      "thread_id": "thread_abc123",
      "type": "message_creation",
      "status": "completed",
      "cancelled_at": null,
      "completed_at": 1699063291,
      "expired_at": null,
      "failed_at": null,
      "last_error": null,
      "step_details": {
        "type": "message_creation",
        "message_creation": {
          "message_id": "msg_abc123"
        }
      },
      "usage": {
        "prompt_tokens": 123,
        "completion_tokens": 456,
        "total_tokens": 579
      }
    }
  ],
  "first_id": "step_abc123",
  "last_id": "step_abc456",
  "has_more": false
}
```
