# 步骤

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps`

返回属于某次运行的操作步骤列表。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象（以 obj_foo 结尾），则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象（以 obj_foo 开头），则后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `include: optional array of RunStepInclude`

  要在响应中包含的其他字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 来获取 文件搜索结果内容。

  请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

- `limit: optional number`

  返回对象数量的限制。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of RunStep`

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（秒）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后错误。可为 `null` 如果没有错误。

    - `code: "server_error" or "rate_limit_exceeded"`

      之一 `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    一组可附加到对象的16个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    与运行步骤关联的 [运行](/docs/api-reference/runs) 该运行步骤所属的。

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

          该运行步骤创建的消息的ID。

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

            工具调用的ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

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

                    该 [file](/docs/api-reference/files) 图像 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终为一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的分数。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅当通过 include 查询参数请求时才包含内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

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

              函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    与运行步骤关联的 [thread](/docs/api-reference/threads) 被运行的线程。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数。

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

## 检索运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps/{step_id}`

检索一个运行步骤。

### 路径参数

- `thread_id: string`

- `run_id: string`

- `step_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  要在响应中包含的其他字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 来获取 文件搜索结果内容。

  请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 返回

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示一次运行执行中的一个步骤。

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（秒）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后错误。可为 `null` 如果没有错误。

    - `code: "server_error" or "rate_limit_exceeded"`

      之一 `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    一组可附加到对象的16个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    与运行步骤关联的 [运行](/docs/api-reference/runs) 该运行步骤所属的。

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

          该运行步骤创建的消息的ID。

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

            工具调用的ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

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

                    该 [file](/docs/api-reference/files) 图像 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终为一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的分数。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅当通过 include 查询参数请求时才包含内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

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

              函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    与运行步骤关联的 [thread](/docs/api-reference/threads) 被运行的线程。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数。

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

## 领域类型

### 代码解释器日志

- `CodeInterpreterLogs object { index, type, logs }`

  作为运行步骤一部分的代码解释器工具调用的文本输出。

  - `index: number`

    输出在 outputs 数组中的索引。

  - `type: "logs"`

    始终 `logs`.

    - `"logs"`

  - `logs: optional string`

    代码解释器工具调用的文本输出。

### 代码解释器输出图像

- `CodeInterpreterOutputImage object { index, type, image }`

  - `index: number`

    输出在 outputs 数组中的索引。

  - `type: "image"`

    始终 `image`.

    - `"image"`

  - `image: optional object { file_id }`

    - `file_id: optional string`

      该 [file](/docs/api-reference/files) 图像 ID。

### 代码解释器工具调用

- `CodeInterpreterToolCall object { id, code_interpreter, type }`

  运行步骤涉及的代码解释器工具调用的详细信息。

  - `id: string`

    工具调用的ID。

  - `code_interpreter: object { input, outputs }`

    代码解释器工具调用定义。

    - `input: string`

      代码解释器工具调用的输入。

    - `outputs: array of object { logs, type }  or object { image, type }`

      代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

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

            该 [file](/docs/api-reference/files) 图像 ID。

        - `type: "image"`

          始终 `image`.

          - `"image"`

  - `type: "code_interpreter"`

    工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

    - `"code_interpreter"`

### 代码解释器工具调用增量

- `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

  运行步骤涉及的代码解释器工具调用的详细信息。

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "code_interpreter"`

    工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

    - `"code_interpreter"`

  - `id: optional string`

    工具调用的ID。

  - `code_interpreter: optional object { input, outputs }`

    代码解释器工具调用定义。

    - `input: optional string`

      代码解释器工具调用的输入。

    - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

      代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

      - `CodeInterpreterLogs object { index, type, logs }`

        作为运行步骤一部分的代码解释器工具调用的文本输出。

        - `index: number`

          输出在 outputs 数组中的索引。

        - `type: "logs"`

          始终 `logs`.

          - `"logs"`

        - `logs: optional string`

          代码解释器工具调用的文本输出。

      - `CodeInterpreterOutputImage object { index, type, image }`

        - `index: number`

          输出在 outputs 数组中的索引。

        - `type: "image"`

          始终 `image`.

          - `"image"`

        - `image: optional object { file_id }`

          - `file_id: optional string`

            该 [file](/docs/api-reference/files) 图像 ID。

### 文件搜索工具调用

- `FileSearchToolCall object { id, file_search, type }`

  - `id: string`

    工具调用对象的 ID。

  - `file_search: object { ranking_options, results }`

    目前，该值始终为一个空对象。

    - `ranking_options: optional object { ranker, score_threshold }`

      文件搜索的排序选项。

      - `ranker: "auto" or "default_2024_08_21"`

        用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

        - `"auto"`

        - `"default_2024_08_21"`

      - `score_threshold: number`

        文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

    - `results: optional array of object { file_id, file_name, score, content }`

      文件搜索的结果。

      - `file_id: string`

        找到结果的文件的 ID。

      - `file_name: string`

        找到结果的文件的名称。

      - `score: number`

        结果的分数。所有值必须是 0 到 1 之间的浮点数。

      - `content: optional array of object { text, type }`

        找到的结果的内容。仅当通过 include 查询参数请求时才包含内容。

        - `text: optional string`

          文件的文本内容。

        - `type: optional "text"`

          内容的类型。

          - `"text"`

  - `type: "file_search"`

    工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

    - `"file_search"`

### 文件搜索工具调用增量

- `FileSearchToolCallDelta object { file_search, index, type, id }`

  - `file_search: unknown`

    目前，该值始终为一个空对象。

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "file_search"`

    工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

    - `"file_search"`

  - `id: optional string`

    工具调用对象的 ID。

### 函数工具调用

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

      函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

  - `type: "function"`

    工具调用类型。对于此类工具调用，该值始终为 `function` 。

    - `"function"`

### 函数工具调用增量

- `FunctionToolCallDelta object { index, type, id, function }`

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "function"`

    工具调用类型。对于此类工具调用，该值始终为 `function` 。

    - `"function"`

  - `id: optional string`

    工具调用对象的 ID。

  - `function: optional object { arguments, name, output }`

    所调用函数的定义。

    - `arguments: optional string`

      传递给函数的参数。

    - `name: optional string`

      函数的名称。

    - `output: optional string or null`

      函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

### 消息创建步骤详情

- `MessageCreationStepDetails object { message_creation, type }`

  运行步骤创建消息的详细信息。

  - `message_creation: object { message_id }`

    - `message_id: string`

      该运行步骤创建的消息的ID。

  - `type: "message_creation"`

    始终 `message_creation`.

    - `"message_creation"`

### 运行步骤

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示一次运行执行中的一个步骤。

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（秒）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后错误。可为 `null` 如果没有错误。

    - `code: "server_error" or "rate_limit_exceeded"`

      之一 `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    一组可附加到对象的16个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    与运行步骤关联的 [运行](/docs/api-reference/runs) 该运行步骤所属的。

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

          该运行步骤创建的消息的ID。

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

            工具调用的ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

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

                    该 [file](/docs/api-reference/files) 图像 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终为一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的分数。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅当通过 include 查询参数请求时才包含内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

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

              函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    与运行步骤关联的 [thread](/docs/api-reference/threads) 被运行的线程。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

### 运行步骤增量事件

- `RunStepDeltaEvent object { id, delta, object }`

  表示运行步骤增量，即流式传输期间运行步骤上任何已更改的字段。

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `delta: object { step_details }`

    包含运行步骤上已更改字段的增量。

    - `step_details: optional RunStepDeltaMessageDelta or ToolCallDeltaObject`

      运行步骤的详细信息。

      - `RunStepDeltaMessageDelta object { type, message_creation }`

        运行步骤创建消息的详细信息。

        - `type: "message_creation"`

          始终 `message_creation`.

          - `"message_creation"`

        - `message_creation: optional object { message_id }`

          - `message_id: optional string`

            该运行步骤创建的消息的ID。

      - `ToolCallDeltaObject object { type, tool_calls }`

        工具调用的详细信息。

        - `type: "tool_calls"`

          始终 `tool_calls`.

          - `"tool_calls"`

        - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

          运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

          - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

            运行步骤涉及的代码解释器工具调用的详细信息。

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "code_interpreter"`

              工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

              - `"code_interpreter"`

            - `id: optional string`

              工具调用的ID。

            - `code_interpreter: optional object { input, outputs }`

              代码解释器工具调用定义。

              - `input: optional string`

                代码解释器工具调用的输入。

              - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

                代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

                - `CodeInterpreterLogs object { index, type, logs }`

                  作为运行步骤一部分的代码解释器工具调用的文本输出。

                  - `index: number`

                    输出在 outputs 数组中的索引。

                  - `type: "logs"`

                    始终 `logs`.

                    - `"logs"`

                  - `logs: optional string`

                    代码解释器工具调用的文本输出。

                - `CodeInterpreterOutputImage object { index, type, image }`

                  - `index: number`

                    输出在 outputs 数组中的索引。

                  - `type: "image"`

                    始终 `image`.

                    - `"image"`

                  - `image: optional object { file_id }`

                    - `file_id: optional string`

                      该 [file](/docs/api-reference/files) 图像 ID。

          - `FileSearchToolCallDelta object { file_search, index, type, id }`

            - `file_search: unknown`

              目前，该值始终为一个空对象。

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "file_search"`

              工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

              - `"file_search"`

            - `id: optional string`

              工具调用对象的 ID。

          - `FunctionToolCallDelta object { index, type, id, function }`

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "function"`

              工具调用类型。对于此类工具调用，该值始终为 `function` 。

              - `"function"`

            - `id: optional string`

              工具调用对象的 ID。

            - `function: optional object { arguments, name, output }`

              所调用函数的定义。

              - `arguments: optional string`

                传递给函数的参数。

              - `name: optional string`

                函数的名称。

              - `output: optional string or null`

                函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

  - `object: "thread.run.step.delta"`

    对象类型，始终为 `thread.run.step.delta`.

    - `"thread.run.step.delta"`

### 运行步骤增量消息增量

- `RunStepDeltaMessageDelta object { type, message_creation }`

  运行步骤创建消息的详细信息。

  - `type: "message_creation"`

    始终 `message_creation`.

    - `"message_creation"`

  - `message_creation: optional object { message_id }`

    - `message_id: optional string`

      该运行步骤创建的消息的ID。

### 运行步骤包含

- `RunStepInclude = "step_details.tool_calls[*].file_search.results[*].content"`

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 工具调用增量对象

- `ToolCallDeltaObject object { type, tool_calls }`

  工具调用的详细信息。

  - `type: "tool_calls"`

    始终 `tool_calls`.

    - `"tool_calls"`

  - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

    运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

      运行步骤涉及的代码解释器工具调用的详细信息。

      - `index: number`

        工具调用数组中的工具调用索引。

      - `type: "code_interpreter"`

        工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

        - `"code_interpreter"`

      - `id: optional string`

        工具调用的ID。

      - `code_interpreter: optional object { input, outputs }`

        代码解释器工具调用定义。

        - `input: optional string`

          代码解释器工具调用的输入。

        - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

          代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

          - `CodeInterpreterLogs object { index, type, logs }`

            作为运行步骤一部分的代码解释器工具调用的文本输出。

            - `index: number`

              输出在 outputs 数组中的索引。

            - `type: "logs"`

              始终 `logs`.

              - `"logs"`

            - `logs: optional string`

              代码解释器工具调用的文本输出。

          - `CodeInterpreterOutputImage object { index, type, image }`

            - `index: number`

              输出在 outputs 数组中的索引。

            - `type: "image"`

              始终 `image`.

              - `"image"`

            - `image: optional object { file_id }`

              - `file_id: optional string`

                该 [file](/docs/api-reference/files) 图像 ID。

    - `FileSearchToolCallDelta object { file_search, index, type, id }`

      - `file_search: unknown`

        目前，该值始终为一个空对象。

      - `index: number`

        工具调用数组中的工具调用索引。

      - `type: "file_search"`

        工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

        - `"file_search"`

      - `id: optional string`

        工具调用对象的 ID。

    - `FunctionToolCallDelta object { index, type, id, function }`

      - `index: number`

        工具调用数组中的工具调用索引。

      - `type: "function"`

        工具调用类型。对于此类工具调用，该值始终为 `function` 。

        - `"function"`

      - `id: optional string`

        工具调用对象的 ID。

      - `function: optional object { arguments, name, output }`

        所调用函数的定义。

        - `arguments: optional string`

          传递给函数的参数。

        - `name: optional string`

          函数的名称。

        - `output: optional string or null`

          函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

### 工具调用步骤详情

- `ToolCallsStepDetails object { tool_calls, type }`

  工具调用的详细信息。

  - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

    运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterToolCall object { id, code_interpreter, type }`

      运行步骤涉及的代码解释器工具调用的详细信息。

      - `id: string`

        工具调用的ID。

      - `code_interpreter: object { input, outputs }`

        代码解释器工具调用定义。

        - `input: string`

          代码解释器工具调用的输入。

        - `outputs: array of object { logs, type }  or object { image, type }`

          代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`) 或图片（`image`)。每一项都由不同的对象类型表示。

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

                该 [file](/docs/api-reference/files) 图像 ID。

            - `type: "image"`

              始终 `image`.

              - `"image"`

      - `type: "code_interpreter"`

        工具调用类型。对于此类工具调用，该值始终为 `code_interpreter` 。

        - `"code_interpreter"`

    - `FileSearchToolCall object { id, file_search, type }`

      - `id: string`

        工具调用对象的 ID。

      - `file_search: object { ranking_options, results }`

        目前，该值始终为一个空对象。

        - `ranking_options: optional object { ranker, score_threshold }`

          文件搜索的排序选项。

          - `ranker: "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

        - `results: optional array of object { file_id, file_name, score, content }`

          文件搜索的结果。

          - `file_id: string`

            找到结果的文件的 ID。

          - `file_name: string`

            找到结果的文件的名称。

          - `score: number`

            结果的分数。所有值必须是 0 到 1 之间的浮点数。

          - `content: optional array of object { text, type }`

            找到的结果的内容。仅当通过 include 查询参数请求时才包含内容。

            - `text: optional string`

              文件的文本内容。

            - `type: optional "text"`

              内容的类型。

              - `"text"`

      - `type: "file_search"`

        工具调用类型。对于此类工具调用，该值始终为 `file_search` 。

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

          函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

      - `type: "function"`

        工具调用类型。对于此类工具调用，该值始终为 `function` 。

        - `"function"`

  - `type: "tool_calls"`

    始终 `tool_calls`.

    - `"tool_calls"`
