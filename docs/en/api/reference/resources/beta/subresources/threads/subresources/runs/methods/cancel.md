> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Cancel a run

**post** `/threads/{thread_id}/runs/{run_id}/cancel`

Cancels a run that is `in_progress`.

### Path Parameters

- `thread_id: string`

- `run_id: string`

### Returns

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  Represents an execution run on a [thread](/docs/api-reference/threads).

  - `id: string`

    The identifier, which can be referenced in API endpoints.

  - `assistant_id: string`

    The ID of the [assistant](/docs/api-reference/assistants) used for execution of this run.

  - `cancelled_at: number or null`

    The Unix timestamp (in seconds) for when the run was cancelled.

  - `completed_at: number or null`

    The Unix timestamp (in seconds) for when the run was completed.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the run was created.

  - `expires_at: number or null`

    The Unix timestamp (in seconds) for when the run will expire.

  - `failed_at: number or null`

    The Unix timestamp (in seconds) for when the run failed.

  - `incomplete_details: object { reason }  or null`

    Details on why the run is incomplete. Will be `null` if the run is not incomplete.

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      The reason why the run is incomplete. This will point to which specific token limit was reached over the course of the run.

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    The instructions that the [assistant](/docs/api-reference/assistants) used for this run.

  - `last_error: object { code, message }  or null`

    The last error associated with this run. Will be `null` if there are no errors.

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      One of `server_error`, `rate_limit_exceeded`, or `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      A human-readable description of the error.

  - `max_completion_tokens: number or null`

    The maximum number of completion tokens specified to have been used over the course of the run.

  - `max_prompt_tokens: number or null`

    The maximum number of prompt tokens specified to have been used over the course of the run.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: string`

    The model that the [assistant](/docs/api-reference/assistants) used for this run.

  - `object: "thread.run"`

    The object type, which is always `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    Whether to enable [parallel function calling](/docs/guides/function-calling#configuring-parallel-function-calling) during tool use.

  - `required_action: object { submit_tool_outputs, type }  or null`

    Details on the action required to continue the run. Will be `null` if no action is required.

    - `submit_tool_outputs: object { tool_calls }`

      Details on the tool outputs needed for this run to continue.

      - `tool_calls: array of RequiredActionFunctionToolCall`

        A list of the relevant tool calls.

        - `id: string`

          The ID of the tool call. This ID must be referenced when you submit the tool outputs in using the [Submit tool outputs to run](/docs/api-reference/runs/submitToolOutputs) endpoint.

        - `function: object { arguments, name }`

          The function definition.

          - `arguments: string`

            The arguments that the model expects you to pass to the function.

          - `name: string`

            The name of the function.

        - `type: "function"`

          The type of tool call the output is required for. For now, this is always `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      For now, this is always `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    Specifies the format that the model must output. Compatible with [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4), and all GPT-3.5 Turbo models since `gpt-3.5-turbo-1106`.

    Setting to `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the [Structured Outputs guide](/docs/guides/structured-outputs).

    Setting to `{ "type": "json_object" }` enables JSON mode, which ensures the message the model generates is valid JSON.

    **Important:** when using JSON mode, you **must** also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.

    - `"auto"`

      `auto` is the default value

      - `"auto"`

    - `ResponseFormatText object { type }`

      Default response format. Used to generate text responses.

      - `type: "text"`

        The type of response format being defined. Always `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON object response format. An older method of generating JSON responses.
      Using `json_schema` is recommended for models that support it. Note that the
      model will not generate JSON without a system or user message instructing it
      to do so.

      - `type: "json_object"`

        The type of response format being defined. Always `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema response format. Used to generate structured JSON responses.
      Learn more about [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs configuration options, including a JSON Schema.

        - `name: string`

          The name of the response format. Must be a-z, A-Z, 0-9, or contain
          underscores and dashes, with a maximum length of 64.

        - `description: optional string`

          A description of what the response format is for, used by the model to
          determine how to respond in the format.

        - `schema: optional map[unknown]`

          The schema for the response format, described as a JSON Schema object.
          Learn how to build JSON schemas [here](https://json-schema.org/).

        - `strict: optional boolean or null`

          Whether to enable strict schema adherence when generating the output.
          If set to true, the model will always follow the exact schema defined
          in the `schema` field. Only a subset of JSON Schema is supported when
          `strict` is `true`. To learn more, read the [Structured Outputs
          guide](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        The type of response format being defined. Always `json_schema`.

        - `"json_schema"`

  - `started_at: number or null`

    The Unix timestamp (in seconds) for when the run was started.

  - `status: "queued" or "in_progress" or "requires_action" or 6 more`

    The status of the run, which can be either `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, `incomplete`, or `expired`.

    - `"queued"`

    - `"in_progress"`

    - `"requires_action"`

    - `"cancelling"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"incomplete"`

    - `"expired"`

  - `thread_id: string`

    The ID of the [thread](/docs/api-reference/threads) that was executed on as a part of this run.

  - `tool_choice: AssistantToolChoiceOption or null`

    Controls which (if any) tool is called by the model.
    `none` means the model will not call any tools and instead generates a message.
    `auto` is the default value and means the model can pick between generating a message or calling one or more tools.
    `required` means the model must call one or more tools before responding to the user.
    Specifying a particular tool like `{"type": "file_search"}` or `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool.

    - `"none" or "auto" or "required"`

      `none` means the model will not call any tools and instead generates a message. `auto` means the model can pick between generating a message or calling one or more tools. `required` means the model must call one or more tools before responding to the user.

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      Specifies a tool the model should use. Use to force the model to call a specific tool.

      - `type: "function" or "code_interpreter" or "file_search"`

        The type of the tool. If type is `function`, the function name must be set

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          The name of the function to call.

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    The list of tools that the [assistant](/docs/api-reference/assistants) used for this run.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        The type of tool being defined: `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        The type of tool being defined: `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        Overrides for the file search tool.

        - `max_num_results: optional number`

          The maximum number of results the file search tool should output. The default is 20 for `gpt-4*` models and 5 for `gpt-3.5-turbo`. This number should be between 1 and 50 inclusive.

          Note that the file search tool may output fewer than `max_num_results` results. See the [file search tool documentation](/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.

        - `ranking_options: optional object { score_threshold, ranker }`

          The ranking options for the file search. If not specified, the file search tool will use the `auto` ranker and a score_threshold of 0.

          See the [file search tool documentation](/docs/assistants/tools/file-search#customizing-file-search-settings) for more information.

          - `score_threshold: number`

            The score threshold for the file search. All values must be a floating point number between 0 and 1.

          - `ranker: optional "auto" or "default_2024_08_21"`

            The ranker to use for the file search. If not specified will use the `auto` ranker.

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.

        - `description: optional string`

          A description of what the function does, used by the model to choose when and how to call the function.

        - `parameters: optional FunctionParameters`

          The parameters the functions accepts, described as a JSON Schema object. See the [guide](/docs/guides/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.

          Omitting `parameters` defines a function with an empty parameter list.

        - `strict: optional boolean or null`

          Whether to enable strict schema adherence when generating the function call. If set to true, the model will follow the exact schema defined in the `parameters` field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn more about Structured Outputs in the [function calling guide](/docs/guides/function-calling).

      - `type: "function"`

        The type of tool being defined: `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    Controls for how a thread will be truncated prior to the run. Use this to control the initial context window of the run.

    - `type: "auto" or "last_messages"`

      The truncation strategy to use for the thread. The default is `auto`. If set to `last_messages`, the thread will be truncated to the n most recent messages in the thread. When set to `auto`, messages in the middle of the thread will be dropped to fit the context length of the model, `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      The number of most recent messages from the thread when constructing the context for the run.

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    Usage statistics related to the run. This value will be `null` if the run is not in a terminal state (i.e. `in_progress`, `queued`, etc.).

    - `completion_tokens: number`

      Number of completion tokens used over the course of the run.

    - `prompt_tokens: number`

      Number of prompt tokens used over the course of the run.

    - `total_tokens: number`

      Total number of tokens used (prompt + completion).

  - `temperature: optional number or null`

    The sampling temperature used for this run. If not set, defaults to 1.

  - `top_p: optional number or null`

    The nucleus sampling value used for this run. If not set, defaults to 1.

### Example

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/cancel \
    -X POST \
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
  "expires_at": 0,
  "failed_at": 0,
  "incomplete_details": {
    "reason": "max_completion_tokens"
  },
  "instructions": "instructions",
  "last_error": {
    "code": "server_error",
    "message": "message"
  },
  "max_completion_tokens": 256,
  "max_prompt_tokens": 256,
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "object": "thread.run",
  "parallel_tool_calls": true,
  "required_action": {
    "submit_tool_outputs": {
      "tool_calls": [
        {
          "id": "id",
          "function": {
            "arguments": "arguments",
            "name": "name"
          },
          "type": "function"
        }
      ]
    },
    "type": "submit_tool_outputs"
  },
  "response_format": "auto",
  "started_at": 0,
  "status": "queued",
  "thread_id": "thread_id",
  "tool_choice": "none",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "truncation_strategy": {
    "type": "auto",
    "last_messages": 1
  },
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0
  },
  "temperature": 0,
  "top_p": 0
}
```

### Example

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST
```

#### Response

```json
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699076126,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "cancelling",
  "started_at": 1699076126,
  "expires_at": 1699076726,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": "You summarize books.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "tool_resources": {
    "file_search": {
      "vector_store_ids": ["vs_123"]
    }
  },
  "metadata": {},
  "usage": null,
  "temperature": 1.0,
  "top_p": 1.0,
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
```
