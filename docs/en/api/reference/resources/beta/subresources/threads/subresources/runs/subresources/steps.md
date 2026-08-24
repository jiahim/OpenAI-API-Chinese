# Steps

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## List run steps

**get** `/threads/{thread_id}/runs/{run_id}/steps`

Returns a list of run steps belonging to a run.

### Path Parameters

- `thread_id: string`

- `run_id: string`

### Query Parameters

- `after: optional string`

  A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- `before: optional string`

  A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- `include: optional array of RunStepInclude`

  A list of additional fields to include in the response. Currently the only supported value is `step_details.tool_calls[*].file_search.results[*].content` to fetch the file search result content.

  See the [file search tool documentation](/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.

  - `"step_details.tool_calls[*].file_search.results[*].content"`

- `limit: optional number`

  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- `order: optional "asc" or "desc"`

  Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of RunStep`

  - `id: string`

    The identifier of the run step, which can be referenced in API endpoints.

  - `assistant_id: string`

    The ID of the [assistant](/docs/api-reference/assistants) associated with the run step.

  - `cancelled_at: number or null`

    The Unix timestamp (in seconds) for when the run step was cancelled.

  - `completed_at: number or null`

    The Unix timestamp (in seconds) for when the run step completed.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the run step was created.

  - `expired_at: number or null`

    The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if the parent run is expired.

  - `failed_at: number or null`

    The Unix timestamp (in seconds) for when the run step failed.

  - `last_error: object { code, message }  or null`

    The last error associated with this run step. Will be `null` if there are no errors.

    - `code: "server_error" or "rate_limit_exceeded"`

      One of `server_error` or `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      A human-readable description of the error.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `object: "thread.run.step"`

    The object type, which is always `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    The ID of the [run](/docs/api-reference/runs) that this run step is a part of.

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    The status of the run step, which can be either `in_progress`, `cancelled`, `failed`, `completed`, or `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    The details of the run step.

    - `MessageCreationStepDetails object { message_creation, type }`

      Details of the message creation by the run step.

      - `message_creation: object { message_id }`

        - `message_id: string`

          The ID of the message that was created by this run step.

      - `type: "message_creation"`

        Always `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      Details of the tool call.

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        An array of tool calls the run step was involved in. These can be associated with one of three types of tools: `code_interpreter`, `file_search`, or `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          Details of the Code Interpreter tool call the run step was involved in.

          - `id: string`

            The ID of the tool call.

          - `code_interpreter: object { input, outputs }`

            The Code Interpreter tool call definition.

            - `input: string`

              The input to the Code Interpreter tool call.

            - `outputs: array of object { logs, type }  or object { image, type }`

              The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

              - `CodeInterpreterLogOutput object { logs, type }`

                Text output from the Code Interpreter tool call as part of a run step.

                - `logs: string`

                  The text output from the Code Interpreter tool call.

                - `type: "logs"`

                  Always `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    The [file](/docs/api-reference/files) ID of the image.

                - `type: "image"`

                  Always `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            The ID of the tool call object.

          - `file_search: object { ranking_options, results }`

            For now, this is always going to be an empty object.

            - `ranking_options: optional object { ranker, score_threshold }`

              The ranking options for the file search.

              - `ranker: "auto" or "default_2024_08_21"`

                The ranker to use for the file search. If not specified will use the `auto` ranker.

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                The score threshold for the file search. All values must be a floating point number between 0 and 1.

            - `results: optional array of object { file_id, file_name, score, content }`

              The results of the file search.

              - `file_id: string`

                The ID of the file that result was found in.

              - `file_name: string`

                The name of the file that result was found in.

              - `score: number`

                The score of the result. All values must be a floating point number between 0 and 1.

              - `content: optional array of object { text, type }`

                The content of the result that was found. The content is only included if requested via the include query parameter.

                - `text: optional string`

                  The text content of the file.

                - `type: optional "text"`

                  The type of the content.

                  - `"text"`

          - `type: "file_search"`

            The type of tool call. This is always going to be `file_search` for this type of tool call.

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            The ID of the tool call object.

          - `function: object { arguments, name, output }`

            The definition of the function that was called.

            - `arguments: string`

              The arguments passed to the function.

            - `name: string`

              The name of the function.

            - `output: string or null`

              The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

          - `type: "function"`

            The type of tool call. This is always going to be `function` for this type of tool call.

            - `"function"`

      - `type: "tool_calls"`

        Always `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    The ID of the [thread](/docs/api-reference/threads) that was run.

  - `type: "message_creation" or "tool_calls"`

    The type of run step, which can be either `message_creation` or `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    Usage statistics related to the run step. This value will be `null` while the run step's status is `in_progress`.

    - `completion_tokens: number`

      Number of completion tokens used over the course of the run step.

    - `prompt_tokens: number`

      Number of prompt tokens used over the course of the run step.

    - `total_tokens: number`

      Total number of tokens used (prompt + completion).

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### Example

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/steps \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

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

### Example

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### Response

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

## Retrieve run step

**get** `/threads/{thread_id}/runs/{run_id}/steps/{step_id}`

Retrieves a run step.

### Path Parameters

- `thread_id: string`

- `run_id: string`

- `step_id: string`

### Query Parameters

- `include: optional array of RunStepInclude`

  A list of additional fields to include in the response. Currently the only supported value is `step_details.tool_calls[*].file_search.results[*].content` to fetch the file search result content.

  See the [file search tool documentation](/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### Returns

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  Represents a step in execution of a run.

  - `id: string`

    The identifier of the run step, which can be referenced in API endpoints.

  - `assistant_id: string`

    The ID of the [assistant](/docs/api-reference/assistants) associated with the run step.

  - `cancelled_at: number or null`

    The Unix timestamp (in seconds) for when the run step was cancelled.

  - `completed_at: number or null`

    The Unix timestamp (in seconds) for when the run step completed.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the run step was created.

  - `expired_at: number or null`

    The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if the parent run is expired.

  - `failed_at: number or null`

    The Unix timestamp (in seconds) for when the run step failed.

  - `last_error: object { code, message }  or null`

    The last error associated with this run step. Will be `null` if there are no errors.

    - `code: "server_error" or "rate_limit_exceeded"`

      One of `server_error` or `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      A human-readable description of the error.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `object: "thread.run.step"`

    The object type, which is always `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    The ID of the [run](/docs/api-reference/runs) that this run step is a part of.

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    The status of the run step, which can be either `in_progress`, `cancelled`, `failed`, `completed`, or `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    The details of the run step.

    - `MessageCreationStepDetails object { message_creation, type }`

      Details of the message creation by the run step.

      - `message_creation: object { message_id }`

        - `message_id: string`

          The ID of the message that was created by this run step.

      - `type: "message_creation"`

        Always `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      Details of the tool call.

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        An array of tool calls the run step was involved in. These can be associated with one of three types of tools: `code_interpreter`, `file_search`, or `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          Details of the Code Interpreter tool call the run step was involved in.

          - `id: string`

            The ID of the tool call.

          - `code_interpreter: object { input, outputs }`

            The Code Interpreter tool call definition.

            - `input: string`

              The input to the Code Interpreter tool call.

            - `outputs: array of object { logs, type }  or object { image, type }`

              The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

              - `CodeInterpreterLogOutput object { logs, type }`

                Text output from the Code Interpreter tool call as part of a run step.

                - `logs: string`

                  The text output from the Code Interpreter tool call.

                - `type: "logs"`

                  Always `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    The [file](/docs/api-reference/files) ID of the image.

                - `type: "image"`

                  Always `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            The ID of the tool call object.

          - `file_search: object { ranking_options, results }`

            For now, this is always going to be an empty object.

            - `ranking_options: optional object { ranker, score_threshold }`

              The ranking options for the file search.

              - `ranker: "auto" or "default_2024_08_21"`

                The ranker to use for the file search. If not specified will use the `auto` ranker.

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                The score threshold for the file search. All values must be a floating point number between 0 and 1.

            - `results: optional array of object { file_id, file_name, score, content }`

              The results of the file search.

              - `file_id: string`

                The ID of the file that result was found in.

              - `file_name: string`

                The name of the file that result was found in.

              - `score: number`

                The score of the result. All values must be a floating point number between 0 and 1.

              - `content: optional array of object { text, type }`

                The content of the result that was found. The content is only included if requested via the include query parameter.

                - `text: optional string`

                  The text content of the file.

                - `type: optional "text"`

                  The type of the content.

                  - `"text"`

          - `type: "file_search"`

            The type of tool call. This is always going to be `file_search` for this type of tool call.

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            The ID of the tool call object.

          - `function: object { arguments, name, output }`

            The definition of the function that was called.

            - `arguments: string`

              The arguments passed to the function.

            - `name: string`

              The name of the function.

            - `output: string or null`

              The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

          - `type: "function"`

            The type of tool call. This is always going to be `function` for this type of tool call.

            - `"function"`

      - `type: "tool_calls"`

        Always `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    The ID of the [thread](/docs/api-reference/threads) that was run.

  - `type: "message_creation" or "tool_calls"`

    The type of run step, which can be either `message_creation` or `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    Usage statistics related to the run step. This value will be `null` while the run step's status is `in_progress`.

    - `completion_tokens: number`

      Number of completion tokens used over the course of the run step.

    - `prompt_tokens: number`

      Number of prompt tokens used over the course of the run step.

    - `total_tokens: number`

      Total number of tokens used (prompt + completion).

### Example

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/steps/$STEP_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

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

### Example

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps/step_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### Response

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

## Domain Types

### Code Interpreter Logs

- `CodeInterpreterLogs object { index, type, logs }`

  Text output from the Code Interpreter tool call as part of a run step.

  - `index: number`

    The index of the output in the outputs array.

  - `type: "logs"`

    Always `logs`.

    - `"logs"`

  - `logs: optional string`

    The text output from the Code Interpreter tool call.

### Code Interpreter Output Image

- `CodeInterpreterOutputImage object { index, type, image }`

  - `index: number`

    The index of the output in the outputs array.

  - `type: "image"`

    Always `image`.

    - `"image"`

  - `image: optional object { file_id }`

    - `file_id: optional string`

      The [file](/docs/api-reference/files) ID of the image.

### Code Interpreter Tool Call

- `CodeInterpreterToolCall object { id, code_interpreter, type }`

  Details of the Code Interpreter tool call the run step was involved in.

  - `id: string`

    The ID of the tool call.

  - `code_interpreter: object { input, outputs }`

    The Code Interpreter tool call definition.

    - `input: string`

      The input to the Code Interpreter tool call.

    - `outputs: array of object { logs, type }  or object { image, type }`

      The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

      - `CodeInterpreterLogOutput object { logs, type }`

        Text output from the Code Interpreter tool call as part of a run step.

        - `logs: string`

          The text output from the Code Interpreter tool call.

        - `type: "logs"`

          Always `logs`.

          - `"logs"`

      - `CodeInterpreterImageOutput object { image, type }`

        - `image: object { file_id }`

          - `file_id: string`

            The [file](/docs/api-reference/files) ID of the image.

        - `type: "image"`

          Always `image`.

          - `"image"`

  - `type: "code_interpreter"`

    The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

    - `"code_interpreter"`

### Code Interpreter Tool Call Delta

- `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

  Details of the Code Interpreter tool call the run step was involved in.

  - `index: number`

    The index of the tool call in the tool calls array.

  - `type: "code_interpreter"`

    The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

    - `"code_interpreter"`

  - `id: optional string`

    The ID of the tool call.

  - `code_interpreter: optional object { input, outputs }`

    The Code Interpreter tool call definition.

    - `input: optional string`

      The input to the Code Interpreter tool call.

    - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

      The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

      - `CodeInterpreterLogs object { index, type, logs }`

        Text output from the Code Interpreter tool call as part of a run step.

        - `index: number`

          The index of the output in the outputs array.

        - `type: "logs"`

          Always `logs`.

          - `"logs"`

        - `logs: optional string`

          The text output from the Code Interpreter tool call.

      - `CodeInterpreterOutputImage object { index, type, image }`

        - `index: number`

          The index of the output in the outputs array.

        - `type: "image"`

          Always `image`.

          - `"image"`

        - `image: optional object { file_id }`

          - `file_id: optional string`

            The [file](/docs/api-reference/files) ID of the image.

### File Search Tool Call

- `FileSearchToolCall object { id, file_search, type }`

  - `id: string`

    The ID of the tool call object.

  - `file_search: object { ranking_options, results }`

    For now, this is always going to be an empty object.

    - `ranking_options: optional object { ranker, score_threshold }`

      The ranking options for the file search.

      - `ranker: "auto" or "default_2024_08_21"`

        The ranker to use for the file search. If not specified will use the `auto` ranker.

        - `"auto"`

        - `"default_2024_08_21"`

      - `score_threshold: number`

        The score threshold for the file search. All values must be a floating point number between 0 and 1.

    - `results: optional array of object { file_id, file_name, score, content }`

      The results of the file search.

      - `file_id: string`

        The ID of the file that result was found in.

      - `file_name: string`

        The name of the file that result was found in.

      - `score: number`

        The score of the result. All values must be a floating point number between 0 and 1.

      - `content: optional array of object { text, type }`

        The content of the result that was found. The content is only included if requested via the include query parameter.

        - `text: optional string`

          The text content of the file.

        - `type: optional "text"`

          The type of the content.

          - `"text"`

  - `type: "file_search"`

    The type of tool call. This is always going to be `file_search` for this type of tool call.

    - `"file_search"`

### File Search Tool Call Delta

- `FileSearchToolCallDelta object { file_search, index, type, id }`

  - `file_search: unknown`

    For now, this is always going to be an empty object.

  - `index: number`

    The index of the tool call in the tool calls array.

  - `type: "file_search"`

    The type of tool call. This is always going to be `file_search` for this type of tool call.

    - `"file_search"`

  - `id: optional string`

    The ID of the tool call object.

### Function Tool Call

- `FunctionToolCall object { id, function, type }`

  - `id: string`

    The ID of the tool call object.

  - `function: object { arguments, name, output }`

    The definition of the function that was called.

    - `arguments: string`

      The arguments passed to the function.

    - `name: string`

      The name of the function.

    - `output: string or null`

      The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

  - `type: "function"`

    The type of tool call. This is always going to be `function` for this type of tool call.

    - `"function"`

### Function Tool Call Delta

- `FunctionToolCallDelta object { index, type, id, function }`

  - `index: number`

    The index of the tool call in the tool calls array.

  - `type: "function"`

    The type of tool call. This is always going to be `function` for this type of tool call.

    - `"function"`

  - `id: optional string`

    The ID of the tool call object.

  - `function: optional object { arguments, name, output }`

    The definition of the function that was called.

    - `arguments: optional string`

      The arguments passed to the function.

    - `name: optional string`

      The name of the function.

    - `output: optional string or null`

      The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

### Message Creation Step Details

- `MessageCreationStepDetails object { message_creation, type }`

  Details of the message creation by the run step.

  - `message_creation: object { message_id }`

    - `message_id: string`

      The ID of the message that was created by this run step.

  - `type: "message_creation"`

    Always `message_creation`.

    - `"message_creation"`

### Run Step

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  Represents a step in execution of a run.

  - `id: string`

    The identifier of the run step, which can be referenced in API endpoints.

  - `assistant_id: string`

    The ID of the [assistant](/docs/api-reference/assistants) associated with the run step.

  - `cancelled_at: number or null`

    The Unix timestamp (in seconds) for when the run step was cancelled.

  - `completed_at: number or null`

    The Unix timestamp (in seconds) for when the run step completed.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the run step was created.

  - `expired_at: number or null`

    The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if the parent run is expired.

  - `failed_at: number or null`

    The Unix timestamp (in seconds) for when the run step failed.

  - `last_error: object { code, message }  or null`

    The last error associated with this run step. Will be `null` if there are no errors.

    - `code: "server_error" or "rate_limit_exceeded"`

      One of `server_error` or `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      A human-readable description of the error.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `object: "thread.run.step"`

    The object type, which is always `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    The ID of the [run](/docs/api-reference/runs) that this run step is a part of.

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    The status of the run step, which can be either `in_progress`, `cancelled`, `failed`, `completed`, or `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    The details of the run step.

    - `MessageCreationStepDetails object { message_creation, type }`

      Details of the message creation by the run step.

      - `message_creation: object { message_id }`

        - `message_id: string`

          The ID of the message that was created by this run step.

      - `type: "message_creation"`

        Always `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      Details of the tool call.

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        An array of tool calls the run step was involved in. These can be associated with one of three types of tools: `code_interpreter`, `file_search`, or `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          Details of the Code Interpreter tool call the run step was involved in.

          - `id: string`

            The ID of the tool call.

          - `code_interpreter: object { input, outputs }`

            The Code Interpreter tool call definition.

            - `input: string`

              The input to the Code Interpreter tool call.

            - `outputs: array of object { logs, type }  or object { image, type }`

              The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

              - `CodeInterpreterLogOutput object { logs, type }`

                Text output from the Code Interpreter tool call as part of a run step.

                - `logs: string`

                  The text output from the Code Interpreter tool call.

                - `type: "logs"`

                  Always `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    The [file](/docs/api-reference/files) ID of the image.

                - `type: "image"`

                  Always `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            The ID of the tool call object.

          - `file_search: object { ranking_options, results }`

            For now, this is always going to be an empty object.

            - `ranking_options: optional object { ranker, score_threshold }`

              The ranking options for the file search.

              - `ranker: "auto" or "default_2024_08_21"`

                The ranker to use for the file search. If not specified will use the `auto` ranker.

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                The score threshold for the file search. All values must be a floating point number between 0 and 1.

            - `results: optional array of object { file_id, file_name, score, content }`

              The results of the file search.

              - `file_id: string`

                The ID of the file that result was found in.

              - `file_name: string`

                The name of the file that result was found in.

              - `score: number`

                The score of the result. All values must be a floating point number between 0 and 1.

              - `content: optional array of object { text, type }`

                The content of the result that was found. The content is only included if requested via the include query parameter.

                - `text: optional string`

                  The text content of the file.

                - `type: optional "text"`

                  The type of the content.

                  - `"text"`

          - `type: "file_search"`

            The type of tool call. This is always going to be `file_search` for this type of tool call.

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            The ID of the tool call object.

          - `function: object { arguments, name, output }`

            The definition of the function that was called.

            - `arguments: string`

              The arguments passed to the function.

            - `name: string`

              The name of the function.

            - `output: string or null`

              The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

          - `type: "function"`

            The type of tool call. This is always going to be `function` for this type of tool call.

            - `"function"`

      - `type: "tool_calls"`

        Always `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    The ID of the [thread](/docs/api-reference/threads) that was run.

  - `type: "message_creation" or "tool_calls"`

    The type of run step, which can be either `message_creation` or `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    Usage statistics related to the run step. This value will be `null` while the run step's status is `in_progress`.

    - `completion_tokens: number`

      Number of completion tokens used over the course of the run step.

    - `prompt_tokens: number`

      Number of prompt tokens used over the course of the run step.

    - `total_tokens: number`

      Total number of tokens used (prompt + completion).

### Run Step Delta Event

- `RunStepDeltaEvent object { id, delta, object }`

  Represents a run step delta i.e. any changed fields on a run step during streaming.

  - `id: string`

    The identifier of the run step, which can be referenced in API endpoints.

  - `delta: object { step_details }`

    The delta containing the fields that have changed on the run step.

    - `step_details: optional RunStepDeltaMessageDelta or ToolCallDeltaObject`

      The details of the run step.

      - `RunStepDeltaMessageDelta object { type, message_creation }`

        Details of the message creation by the run step.

        - `type: "message_creation"`

          Always `message_creation`.

          - `"message_creation"`

        - `message_creation: optional object { message_id }`

          - `message_id: optional string`

            The ID of the message that was created by this run step.

      - `ToolCallDeltaObject object { type, tool_calls }`

        Details of the tool call.

        - `type: "tool_calls"`

          Always `tool_calls`.

          - `"tool_calls"`

        - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

          An array of tool calls the run step was involved in. These can be associated with one of three types of tools: `code_interpreter`, `file_search`, or `function`.

          - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

            Details of the Code Interpreter tool call the run step was involved in.

            - `index: number`

              The index of the tool call in the tool calls array.

            - `type: "code_interpreter"`

              The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

              - `"code_interpreter"`

            - `id: optional string`

              The ID of the tool call.

            - `code_interpreter: optional object { input, outputs }`

              The Code Interpreter tool call definition.

              - `input: optional string`

                The input to the Code Interpreter tool call.

              - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

                The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

                - `CodeInterpreterLogs object { index, type, logs }`

                  Text output from the Code Interpreter tool call as part of a run step.

                  - `index: number`

                    The index of the output in the outputs array.

                  - `type: "logs"`

                    Always `logs`.

                    - `"logs"`

                  - `logs: optional string`

                    The text output from the Code Interpreter tool call.

                - `CodeInterpreterOutputImage object { index, type, image }`

                  - `index: number`

                    The index of the output in the outputs array.

                  - `type: "image"`

                    Always `image`.

                    - `"image"`

                  - `image: optional object { file_id }`

                    - `file_id: optional string`

                      The [file](/docs/api-reference/files) ID of the image.

          - `FileSearchToolCallDelta object { file_search, index, type, id }`

            - `file_search: unknown`

              For now, this is always going to be an empty object.

            - `index: number`

              The index of the tool call in the tool calls array.

            - `type: "file_search"`

              The type of tool call. This is always going to be `file_search` for this type of tool call.

              - `"file_search"`

            - `id: optional string`

              The ID of the tool call object.

          - `FunctionToolCallDelta object { index, type, id, function }`

            - `index: number`

              The index of the tool call in the tool calls array.

            - `type: "function"`

              The type of tool call. This is always going to be `function` for this type of tool call.

              - `"function"`

            - `id: optional string`

              The ID of the tool call object.

            - `function: optional object { arguments, name, output }`

              The definition of the function that was called.

              - `arguments: optional string`

                The arguments passed to the function.

              - `name: optional string`

                The name of the function.

              - `output: optional string or null`

                The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

  - `object: "thread.run.step.delta"`

    The object type, which is always `thread.run.step.delta`.

    - `"thread.run.step.delta"`

### Run Step Delta Message Delta

- `RunStepDeltaMessageDelta object { type, message_creation }`

  Details of the message creation by the run step.

  - `type: "message_creation"`

    Always `message_creation`.

    - `"message_creation"`

  - `message_creation: optional object { message_id }`

    - `message_id: optional string`

      The ID of the message that was created by this run step.

### Run Step Include

- `RunStepInclude = "step_details.tool_calls[*].file_search.results[*].content"`

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### Tool Call Delta Object

- `ToolCallDeltaObject object { type, tool_calls }`

  Details of the tool call.

  - `type: "tool_calls"`

    Always `tool_calls`.

    - `"tool_calls"`

  - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

    An array of tool calls the run step was involved in. These can be associated with one of three types of tools: `code_interpreter`, `file_search`, or `function`.

    - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

      Details of the Code Interpreter tool call the run step was involved in.

      - `index: number`

        The index of the tool call in the tool calls array.

      - `type: "code_interpreter"`

        The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

        - `"code_interpreter"`

      - `id: optional string`

        The ID of the tool call.

      - `code_interpreter: optional object { input, outputs }`

        The Code Interpreter tool call definition.

        - `input: optional string`

          The input to the Code Interpreter tool call.

        - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

          The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

          - `CodeInterpreterLogs object { index, type, logs }`

            Text output from the Code Interpreter tool call as part of a run step.

            - `index: number`

              The index of the output in the outputs array.

            - `type: "logs"`

              Always `logs`.

              - `"logs"`

            - `logs: optional string`

              The text output from the Code Interpreter tool call.

          - `CodeInterpreterOutputImage object { index, type, image }`

            - `index: number`

              The index of the output in the outputs array.

            - `type: "image"`

              Always `image`.

              - `"image"`

            - `image: optional object { file_id }`

              - `file_id: optional string`

                The [file](/docs/api-reference/files) ID of the image.

    - `FileSearchToolCallDelta object { file_search, index, type, id }`

      - `file_search: unknown`

        For now, this is always going to be an empty object.

      - `index: number`

        The index of the tool call in the tool calls array.

      - `type: "file_search"`

        The type of tool call. This is always going to be `file_search` for this type of tool call.

        - `"file_search"`

      - `id: optional string`

        The ID of the tool call object.

    - `FunctionToolCallDelta object { index, type, id, function }`

      - `index: number`

        The index of the tool call in the tool calls array.

      - `type: "function"`

        The type of tool call. This is always going to be `function` for this type of tool call.

        - `"function"`

      - `id: optional string`

        The ID of the tool call object.

      - `function: optional object { arguments, name, output }`

        The definition of the function that was called.

        - `arguments: optional string`

          The arguments passed to the function.

        - `name: optional string`

          The name of the function.

        - `output: optional string or null`

          The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

### Tool Calls Step Details

- `ToolCallsStepDetails object { tool_calls, type }`

  Details of the tool call.

  - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

    An array of tool calls the run step was involved in. These can be associated with one of three types of tools: `code_interpreter`, `file_search`, or `function`.

    - `CodeInterpreterToolCall object { id, code_interpreter, type }`

      Details of the Code Interpreter tool call the run step was involved in.

      - `id: string`

        The ID of the tool call.

      - `code_interpreter: object { input, outputs }`

        The Code Interpreter tool call definition.

        - `input: string`

          The input to the Code Interpreter tool call.

        - `outputs: array of object { logs, type }  or object { image, type }`

          The outputs from the Code Interpreter tool call. Code Interpreter can output one or more items, including text (`logs`) or images (`image`). Each of these are represented by a different object type.

          - `CodeInterpreterLogOutput object { logs, type }`

            Text output from the Code Interpreter tool call as part of a run step.

            - `logs: string`

              The text output from the Code Interpreter tool call.

            - `type: "logs"`

              Always `logs`.

              - `"logs"`

          - `CodeInterpreterImageOutput object { image, type }`

            - `image: object { file_id }`

              - `file_id: string`

                The [file](/docs/api-reference/files) ID of the image.

            - `type: "image"`

              Always `image`.

              - `"image"`

      - `type: "code_interpreter"`

        The type of tool call. This is always going to be `code_interpreter` for this type of tool call.

        - `"code_interpreter"`

    - `FileSearchToolCall object { id, file_search, type }`

      - `id: string`

        The ID of the tool call object.

      - `file_search: object { ranking_options, results }`

        For now, this is always going to be an empty object.

        - `ranking_options: optional object { ranker, score_threshold }`

          The ranking options for the file search.

          - `ranker: "auto" or "default_2024_08_21"`

            The ranker to use for the file search. If not specified will use the `auto` ranker.

            - `"auto"`

            - `"default_2024_08_21"`

          - `score_threshold: number`

            The score threshold for the file search. All values must be a floating point number between 0 and 1.

        - `results: optional array of object { file_id, file_name, score, content }`

          The results of the file search.

          - `file_id: string`

            The ID of the file that result was found in.

          - `file_name: string`

            The name of the file that result was found in.

          - `score: number`

            The score of the result. All values must be a floating point number between 0 and 1.

          - `content: optional array of object { text, type }`

            The content of the result that was found. The content is only included if requested via the include query parameter.

            - `text: optional string`

              The text content of the file.

            - `type: optional "text"`

              The type of the content.

              - `"text"`

      - `type: "file_search"`

        The type of tool call. This is always going to be `file_search` for this type of tool call.

        - `"file_search"`

    - `FunctionToolCall object { id, function, type }`

      - `id: string`

        The ID of the tool call object.

      - `function: object { arguments, name, output }`

        The definition of the function that was called.

        - `arguments: string`

          The arguments passed to the function.

        - `name: string`

          The name of the function.

        - `output: string or null`

          The output of the function. This will be `null` if the outputs have not been [submitted](/docs/api-reference/runs/submitToolOutputs) yet.

      - `type: "function"`

        The type of tool call. This is always going to be `function` for this type of tool call.

        - `"function"`

  - `type: "tool_calls"`

    Always `tool_calls`.

    - `"tool_calls"`
