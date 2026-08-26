> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 检索运行步骤

**获取** `/threads/{thread_id}/runs/{run_id}/steps/{step_id}`

检索一个运行步骤。

### 路径参数

- `thread_id: string`

- `run_id: string`

- `step_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  要包含在响应中的附加字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 返回

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示运行执行中的一个步骤。

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与运行步骤关联的 [助手](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（秒）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后一个错误。如果 `null` 没有错误，则为 null。

    - `code: "server_error" or "rate_limit_exceeded"`

      以下之一： `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    可附加到对象的一组 16 个键值对。这可用于
    以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    该运行步骤所属的 [run](/docs/api-reference/runs) 的 ID。

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

          该运行步骤创建的消息的 ID。

      - `type: "message_creation"`

        始终为 `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      工具调用的详细信息。

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        运行步骤涉及的工具调用数组。这些可以与三种类型的工具之一关联： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的 Code Interpreter 工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            Code Interpreter 工具调用定义。

            - `input: string`

              Code Interpreter 工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每一个都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤的一部分，代码解释器工具调用产生的文本输出。

                - `logs: string`

                  代码解释器工具调用产生的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [文件](/docs/api-reference/files) 图像的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类型的工具调用，它始终是 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，这始终是一个空对象。

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

                找到结果所在的文件的 ID。

              - `file_name: string`

                找到结果所在的文件的名称。

              - `score: number`

                结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅在通过 include 查询参数请求时才包含该内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于这种工具调用，该值始终为 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            所调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，该值将为 [已提交](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于这种工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    所运行 [线程](/docs/api-reference/threads) 的 ID。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。此值将 `null` 在运行步骤状态为 `in_progress`.

    - `completion_tokens: number`

      运行步骤期间使用的完成令牌数量。

    - `prompt_tokens: number`

      运行步骤期间使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/steps/$STEP_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
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
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps/step_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
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
```
