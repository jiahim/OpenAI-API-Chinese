# Assistants

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Create assistant

**post** `/assistants`

Create an assistant with a model and instructions.

### Body Parameters

- `model: string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

  ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

    - `"gpt-5"`

    - `"gpt-5-mini"`

    - `"gpt-5-nano"`

    - `"gpt-5-2025-08-07"`

    - `"gpt-5-mini-2025-08-07"`

    - `"gpt-5-nano-2025-08-07"`

    - `"gpt-4.1"`

    - `"gpt-4.1-mini"`

    - `"gpt-4.1-nano"`

    - `"gpt-4.1-2025-04-14"`

    - `"gpt-4.1-mini-2025-04-14"`

    - `"gpt-4.1-nano-2025-04-14"`

    - `"o3-mini"`

    - `"o3-mini-2025-01-31"`

    - `"o1"`

    - `"o1-2024-12-17"`

    - `"gpt-4o"`

    - `"gpt-4o-2024-11-20"`

    - `"gpt-4o-2024-08-06"`

    - `"gpt-4o-2024-05-13"`

    - `"gpt-4o-mini"`

    - `"gpt-4o-mini-2024-07-18"`

    - `"gpt-4.5-preview"`

    - `"gpt-4.5-preview-2025-02-27"`

    - `"gpt-4-turbo"`

    - `"gpt-4-turbo-2024-04-09"`

    - `"gpt-4-0125-preview"`

    - `"gpt-4-turbo-preview"`

    - `"gpt-4-1106-preview"`

    - `"gpt-4-vision-preview"`

    - `"gpt-4"`

    - `"gpt-4-0314"`

    - `"gpt-4-0613"`

    - `"gpt-4-32k"`

    - `"gpt-4-32k-0314"`

    - `"gpt-4-32k-0613"`

    - `"gpt-3.5-turbo"`

    - `"gpt-3.5-turbo-16k"`

    - `"gpt-3.5-turbo-0613"`

    - `"gpt-3.5-turbo-1106"`

    - `"gpt-3.5-turbo-0125"`

    - `"gpt-3.5-turbo-16k-0613"`

- `description: optional string or null`

  The description of the assistant. The maximum length is 512 characters.

- `instructions: optional string or null`

  The system instructions that the assistant uses. The maximum length is 256,000 characters.

- `metadata: optional Metadata or null`

  Set of 16 key-value pairs that can be attached to an object. This can be
  useful for storing additional information about the object in a structured
  format, and querying for objects via API or the dashboard.

  Keys are strings with a maximum length of 64 characters. Values are strings
  with a maximum length of 512 characters.

- `name: optional string or null`

  The name of the assistant. The maximum length is 256 characters.

- `reasoning_effort: optional ReasoningEffort or null`

  Constrains effort on reasoning for reasoning models. Currently supported
  values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
  Reducing reasoning effort can result in faster responses and fewer tokens
  used on reasoning in a response. Not all reasoning models support every
  value. See the
  [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
  for model-specific support.

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

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

- `temperature: optional number or null`

  What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter` tool. There can be a maximum of 20 files associated with the tool.

  - `file_search: optional object { vector_store_ids, vector_stores }`

    - `vector_store_ids: optional array of string`

      The [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

    - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

      A helper to create a [vector store](/docs/api-reference/vector-stores/object) with file_ids and attach it to this assistant. There can be a maximum of 1 vector store attached to the assistant.

      - `chunking_strategy: optional object { type }  or object { static, type }`

        The chunking strategy used to chunk the file(s). If not set, will use the `auto` strategy.

        - `Auto object { type }`

          The default strategy. This strategy currently uses a `max_chunk_size_tokens` of `800` and `chunk_overlap_tokens` of `400`.

          - `type: "auto"`

            Always `auto`.

            - `"auto"`

        - `Static object { static, type }`

          - `static: object { chunk_overlap_tokens, max_chunk_size_tokens }`

            - `chunk_overlap_tokens: number`

              The number of tokens that overlap between chunks. The default value is `400`.

              Note that the overlap must not exceed half of `max_chunk_size_tokens`.

            - `max_chunk_size_tokens: number`

              The maximum number of tokens in each chunk. The default value is `800`. The minimum value is `100` and the maximum value is `4096`.

          - `type: "static"`

            Always `static`.

            - `"static"`

      - `file_ids: optional array of string`

        A list of [file](/docs/api-reference/files) IDs to add to the vector store. For vector stores created before Nov 2025, there can be a maximum of 10,000 files in a vector store. For vector stores created starting in Nov 2025, the limit is 100,000,000 files.

      - `metadata: optional Metadata or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard.

        Keys are strings with a maximum length of 64 characters. Values are strings
        with a maximum length of 512 characters.

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool`

  A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

- `top_p: optional number or null`

  An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

  We generally recommend altering this or temperature but not both.

### Returns

- `Assistant object { id, created_at, description, 10 more }`

  Represents an `assistant` that can call the model and use tools.

  - `id: string`

    The identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the assistant was created.

  - `description: string or null`

    The description of the assistant. The maximum length is 512 characters.

  - `instructions: string or null`

    The system instructions that the assistant uses. The maximum length is 256,000 characters.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: string`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `name: string or null`

    The name of the assistant. The maximum length is 256 characters.

  - `object: "assistant"`

    The object type, which is always `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

  - `response_format: optional AssistantResponseFormatOption or null`

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

  - `temperature: optional number or null`

    What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter`` tool. There can be a maximum of 20 files associated with the tool.

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        The ID of the [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

  - `top_p: optional number or null`

    An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

    We generally recommend altering this or temperature but not both.

### Example

```http
curl https://api.openai.com/v1/assistants \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-4o",
          "temperature": 1,
          "top_p": 1
        }'
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "description": "description",
  "instructions": "instructions",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "response_format": "auto",
  "temperature": 1,
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  },
  "top_p": 1
}
```

### Code Interpreter

```http
curl "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "name": "Math Tutor",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o"
  }'
```

#### Response

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

### Files

```http
curl https://api.openai.com/v1/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
    "tools": [{"type": "file_search"}],
    "tool_resources": {"file_search": {"vector_store_ids": ["vs_123"]}},
    "model": "gpt-4o"
  }'
```

#### Response

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009403,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
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
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

## Delete assistant

**delete** `/assistants/{assistant_id}`

Delete an assistant.

### Path Parameters

- `assistant_id: string`

### Returns

- `AssistantDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "assistant.deleted"`

    - `"assistant.deleted"`

### Example

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "assistant.deleted"
}
```

### Example

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### Response

```json
{
  "id": "asst_abc123",
  "object": "assistant.deleted",
  "deleted": true
}
```

## List assistants

**get** `/assistants`

Returns a list of assistants.

### Query Parameters

- `after: optional string`

  A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- `before: optional string`

  A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.

- `limit: optional number`

  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

- `order: optional "asc" or "desc"`

  Sort order by the `created_at` timestamp of the objects. `asc` for ascending order and `desc` for descending order.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of Assistant`

  - `id: string`

    The identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the assistant was created.

  - `description: string or null`

    The description of the assistant. The maximum length is 512 characters.

  - `instructions: string or null`

    The system instructions that the assistant uses. The maximum length is 256,000 characters.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: string`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `name: string or null`

    The name of the assistant. The maximum length is 256 characters.

  - `object: "assistant"`

    The object type, which is always `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

  - `response_format: optional AssistantResponseFormatOption or null`

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

  - `temperature: optional number or null`

    What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter`` tool. There can be a maximum of 20 files associated with the tool.

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        The ID of the [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

  - `top_p: optional number or null`

    An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

    We generally recommend altering this or temperature but not both.

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### Example

```http
curl https://api.openai.com/v1/assistants \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "description": "description",
      "instructions": "instructions",
      "metadata": {
        "foo": "string"
      },
      "model": "model",
      "name": "name",
      "object": "assistant",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ],
      "response_format": "auto",
      "temperature": 1,
      "tool_resources": {
        "code_interpreter": {
          "file_ids": [
            "string"
          ]
        },
        "file_search": {
          "vector_store_ids": [
            "string"
          ]
        }
      },
      "top_p": 1
    }
  ],
  "first_id": "asst_abc123",
  "has_more": false,
  "last_id": "asst_abc456",
  "object": "list"
}
```

### Example

```http
curl "https://api.openai.com/v1/assistants?order=desc&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "asst_abc123",
      "object": "assistant",
      "created_at": 1698982736,
      "name": "Coding Tutor",
      "description": null,
      "model": "gpt-4o",
      "instructions": "You are a helpful assistant designed to make me better at coding!",
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    },
    {
      "id": "asst_abc456",
      "object": "assistant",
      "created_at": 1698982718,
      "name": "My Assistant",
      "description": null,
      "model": "gpt-4o",
      "instructions": "You are a helpful assistant designed to make me better at coding!",
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    },
    {
      "id": "asst_abc789",
      "object": "assistant",
      "created_at": 1698982643,
      "name": null,
      "description": null,
      "model": "gpt-4o",
      "instructions": null,
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    }
  ],
  "first_id": "asst_abc123",
  "last_id": "asst_abc789",
  "has_more": false
}
```

## Retrieve assistant

**get** `/assistants/{assistant_id}`

Retrieves an assistant.

### Path Parameters

- `assistant_id: string`

### Returns

- `Assistant object { id, created_at, description, 10 more }`

  Represents an `assistant` that can call the model and use tools.

  - `id: string`

    The identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the assistant was created.

  - `description: string or null`

    The description of the assistant. The maximum length is 512 characters.

  - `instructions: string or null`

    The system instructions that the assistant uses. The maximum length is 256,000 characters.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: string`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `name: string or null`

    The name of the assistant. The maximum length is 256 characters.

  - `object: "assistant"`

    The object type, which is always `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

  - `response_format: optional AssistantResponseFormatOption or null`

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

  - `temperature: optional number or null`

    What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter`` tool. There can be a maximum of 20 files associated with the tool.

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        The ID of the [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

  - `top_p: optional number or null`

    An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

    We generally recommend altering this or temperature but not both.

### Example

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "description": "description",
  "instructions": "instructions",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "response_format": "auto",
  "temperature": 1,
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  },
  "top_p": 1
}
```

### Example

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### Response

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

## Modify assistant

**post** `/assistants/{assistant_id}`

Modifies an assistant.

### Path Parameters

- `assistant_id: string`

### Body Parameters

- `description: optional string or null`

  The description of the assistant. The maximum length is 512 characters.

- `instructions: optional string or null`

  The system instructions that the assistant uses. The maximum length is 256,000 characters.

- `metadata: optional Metadata or null`

  Set of 16 key-value pairs that can be attached to an object. This can be
  useful for storing additional information about the object in a structured
  format, and querying for objects via API or the dashboard.

  Keys are strings with a maximum length of 64 characters. Values are strings
  with a maximum length of 512 characters.

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

  ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

    - `"gpt-5"`

    - `"gpt-5-mini"`

    - `"gpt-5-nano"`

    - `"gpt-5-2025-08-07"`

    - `"gpt-5-mini-2025-08-07"`

    - `"gpt-5-nano-2025-08-07"`

    - `"gpt-4.1"`

    - `"gpt-4.1-mini"`

    - `"gpt-4.1-nano"`

    - `"gpt-4.1-2025-04-14"`

    - `"gpt-4.1-mini-2025-04-14"`

    - `"gpt-4.1-nano-2025-04-14"`

    - `"o3-mini"`

    - `"o3-mini-2025-01-31"`

    - `"o1"`

    - `"o1-2024-12-17"`

    - `"gpt-4o"`

    - `"gpt-4o-2024-11-20"`

    - `"gpt-4o-2024-08-06"`

    - `"gpt-4o-2024-05-13"`

    - `"gpt-4o-mini"`

    - `"gpt-4o-mini-2024-07-18"`

    - `"gpt-4.5-preview"`

    - `"gpt-4.5-preview-2025-02-27"`

    - `"gpt-4-turbo"`

    - `"gpt-4-turbo-2024-04-09"`

    - `"gpt-4-0125-preview"`

    - `"gpt-4-turbo-preview"`

    - `"gpt-4-1106-preview"`

    - `"gpt-4-vision-preview"`

    - `"gpt-4"`

    - `"gpt-4-0314"`

    - `"gpt-4-0613"`

    - `"gpt-4-32k"`

    - `"gpt-4-32k-0314"`

    - `"gpt-4-32k-0613"`

    - `"gpt-3.5-turbo"`

    - `"gpt-3.5-turbo-16k"`

    - `"gpt-3.5-turbo-0613"`

    - `"gpt-3.5-turbo-1106"`

    - `"gpt-3.5-turbo-0125"`

    - `"gpt-3.5-turbo-16k-0613"`

- `name: optional string or null`

  The name of the assistant. The maximum length is 256 characters.

- `reasoning_effort: optional ReasoningEffort or null`

  Constrains effort on reasoning for reasoning models. Currently supported
  values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
  Reducing reasoning effort can result in faster responses and fewer tokens
  used on reasoning in a response. Not all reasoning models support every
  value. See the
  [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
  for model-specific support.

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

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

- `temperature: optional number or null`

  What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      Overrides the list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter` tool. There can be a maximum of 20 files associated with the tool.

  - `file_search: optional object { vector_store_ids }`

    - `vector_store_ids: optional array of string`

      Overrides the [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool`

  A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

- `top_p: optional number or null`

  An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

  We generally recommend altering this or temperature but not both.

### Returns

- `Assistant object { id, created_at, description, 10 more }`

  Represents an `assistant` that can call the model and use tools.

  - `id: string`

    The identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the assistant was created.

  - `description: string or null`

    The description of the assistant. The maximum length is 512 characters.

  - `instructions: string or null`

    The system instructions that the assistant uses. The maximum length is 256,000 characters.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: string`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `name: string or null`

    The name of the assistant. The maximum length is 256 characters.

  - `object: "assistant"`

    The object type, which is always `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

  - `response_format: optional AssistantResponseFormatOption or null`

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

  - `temperature: optional number or null`

    What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter`` tool. There can be a maximum of 20 files associated with the tool.

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        The ID of the [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

  - `top_p: optional number or null`

    An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

    We generally recommend altering this or temperature but not both.

### Example

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "temperature": 1,
          "top_p": 1
        }'
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "description": "description",
  "instructions": "instructions",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "response_format": "auto",
  "temperature": 1,
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  },
  "top_p": 1
}
```

### Example

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      "tools": [{"type": "file_search"}],
      "model": "gpt-4o"
    }'
```

#### Response

```json
{
  "id": "asst_123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "tool_resources": {
    "file_search": {
      "vector_store_ids": []
    }
  },
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

## Domain Types

### Assistant

- `Assistant object { id, created_at, description, 10 more }`

  Represents an `assistant` that can call the model and use tools.

  - `id: string`

    The identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the assistant was created.

  - `description: string or null`

    The description of the assistant. The maximum length is 512 characters.

  - `instructions: string or null`

    The system instructions that the assistant uses. The maximum length is 256,000 characters.

  - `metadata: Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: string`

    ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.

  - `name: string or null`

    The name of the assistant. The maximum length is 256 characters.

  - `object: "assistant"`

    The object type, which is always `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types `code_interpreter`, `file_search`, or `function`.

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

  - `response_format: optional AssistantResponseFormatOption or null`

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

  - `temperature: optional number or null`

    What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    A set of resources that are used by the assistant's tools. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter`` tool. There can be a maximum of 20 files associated with the tool.

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        The ID of the [vector store](/docs/api-reference/vector-stores/object) attached to this assistant. There can be a maximum of 1 vector store attached to the assistant.

  - `top_p: optional number or null`

    An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

    We generally recommend altering this or temperature but not both.

### Assistant Deleted

- `AssistantDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "assistant.deleted"`

    - `"assistant.deleted"`

### Assistant Stream Event

- `AssistantStreamEvent = object { data, event, enabled }  or object { data, event }  or object { data, event }  or 22 more`

  Represents an event emitted when streaming a Run.

  Each event in a server-sent events stream has an `event` and `data` property:

  ```
  event: thread.created
  data: {"id": "thread_123", "object": "thread", ...}
  ```

  We emit events whenever a new object is created, transitions to a new state, or is being
  streamed in parts (deltas). For example, we emit `thread.run.created` when a new run
  is created, `thread.run.completed` when a run completes, and so on. When an Assistant chooses
  to create a message during a run, we emit a `thread.message.created event`, a
  `thread.message.in_progress` event, many `thread.message.delta` events, and finally a
  `thread.message.completed` event.

  We may add additional events over time, so we recommend handling unknown events gracefully
  in your code. See the [Assistants API quickstart](/docs/assistants/overview) to learn how to
  integrate the Assistants API with streaming.

  - `ThreadCreated object { data, event, enabled }`

    Occurs when a new [thread](/docs/api-reference/threads/object) is created.

    - `data: Thread`

      Represents a thread that contains [messages](/docs/api-reference/messages).

      - `id: string`

        The identifier, which can be referenced in API endpoints.

      - `created_at: number`

        The Unix timestamp (in seconds) for when the thread was created.

      - `metadata: Metadata or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard.

        Keys are strings with a maximum length of 64 characters. Values are strings
        with a maximum length of 512 characters.

      - `object: "thread"`

        The object type, which is always `thread`.

        - `"thread"`

      - `tool_resources: object { code_interpreter, file_search }  or null`

        A set of resources that are made available to the assistant's tools in this thread. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

        - `code_interpreter: optional object { file_ids }`

          - `file_ids: optional array of string`

            A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter` tool. There can be a maximum of 20 files associated with the tool.

        - `file_search: optional object { vector_store_ids }`

          - `vector_store_ids: optional array of string`

            The [vector store](/docs/api-reference/vector-stores/object) attached to this thread. There can be a maximum of 1 vector store attached to the thread.

    - `event: "thread.created"`

      - `"thread.created"`

    - `enabled: optional boolean`

      Whether to enable input audio transcription.

  - `ThreadRunCreated object { data, event }`

    Occurs when a new [run](/docs/api-reference/runs/object) is created.

    - `data: Run`

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

    - `event: "thread.run.created"`

      - `"thread.run.created"`

  - `ThreadRunQueued object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to a `queued` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.queued"`

      - `"thread.run.queued"`

  - `ThreadRunInProgress object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to an `in_progress` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.in_progress"`

      - `"thread.run.in_progress"`

  - `ThreadRunRequiresAction object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to a `requires_action` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.requires_action"`

      - `"thread.run.requires_action"`

  - `ThreadRunCompleted object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) is completed.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.completed"`

      - `"thread.run.completed"`

  - `ThreadRunIncomplete object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) ends with status `incomplete`.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.incomplete"`

      - `"thread.run.incomplete"`

  - `ThreadRunFailed object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) fails.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.failed"`

      - `"thread.run.failed"`

  - `ThreadRunCancelling object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to a `cancelling` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.cancelling"`

      - `"thread.run.cancelling"`

  - `ThreadRunCancelled object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) is cancelled.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.cancelled"`

      - `"thread.run.cancelled"`

  - `ThreadRunExpired object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) expires.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.expired"`

      - `"thread.run.expired"`

  - `ThreadRunStepCreated object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) is created.

    - `data: RunStep`

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

    - `event: "thread.run.step.created"`

      - `"thread.run.step.created"`

  - `ThreadRunStepInProgress object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) moves to an `in_progress` state.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.in_progress"`

      - `"thread.run.step.in_progress"`

  - `ThreadRunStepDelta object { data, event }`

    Occurs when parts of a [run step](/docs/api-reference/run-steps/step-object) are being streamed.

    - `data: RunStepDeltaEvent`

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

    - `event: "thread.run.step.delta"`

      - `"thread.run.step.delta"`

  - `ThreadRunStepCompleted object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) is completed.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.completed"`

      - `"thread.run.step.completed"`

  - `ThreadRunStepFailed object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) fails.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.failed"`

      - `"thread.run.step.failed"`

  - `ThreadRunStepCancelled object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) is cancelled.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.cancelled"`

      - `"thread.run.step.cancelled"`

  - `ThreadRunStepExpired object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) expires.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.expired"`

      - `"thread.run.step.expired"`

  - `ThreadMessageCreated object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) is created.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

      - `id: string`

        The identifier, which can be referenced in API endpoints.

      - `assistant_id: string or null`

        If applicable, the ID of the [assistant](/docs/api-reference/assistants) that authored this message.

      - `attachments: array of object { file_id, tools }  or null`

        A list of files attached to the message, and the tools they were added to.

        - `file_id: optional string`

          The ID of the file to attach to the message.

        - `tools: optional array of CodeInterpreterTool or object { type }`

          The tools to add this file to.

          - `CodeInterpreterTool object { type }`

          - `FileSearchTool object { type }`

            - `type: "file_search"`

              The type of tool being defined: `file_search`

              - `"file_search"`

      - `completed_at: number or null`

        The Unix timestamp (in seconds) for when the message was completed.

      - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

        The content of the message in array of text and/or images.

        - `ImageFileContentBlock object { image_file, type }`

          References an image [File](/docs/api-reference/files) in the content of a message.

          - `image_file: ImageFile`

            - `file_id: string`

              The [File](/docs/api-reference/files) ID of the image in the message content. Set `purpose="vision"` when uploading the File if you need to later display the file content.

            - `detail: optional "auto" or "low" or "high"`

              Specifies the detail level of the image if specified by the user. `low` uses fewer tokens, you can opt in to high resolution using `high`.

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_file"`

            Always `image_file`.

            - `"image_file"`

        - `ImageURLContentBlock object { image_url, type }`

          References an image URL in the content of a message.

          - `image_url: ImageURL`

            - `url: string`

              The external URL of the image, must be a supported image types: jpeg, jpg, png, gif, webp.

            - `detail: optional "auto" or "low" or "high"`

              Specifies the detail level of the image. `low` uses fewer tokens, you can opt in to high resolution using `high`. Default value is `auto`

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            The type of the content part.

            - `"image_url"`

        - `TextContentBlock object { text, type }`

          The text content that is part of a message.

          - `text: Text`

            - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

              - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

                A citation within the message that points to a specific quote from a specific File associated with the assistant or the message. Generated when the assistant uses the "file_search" tool to search files.

                - `end_index: number`

                - `file_citation: object { file_id }`

                  - `file_id: string`

                    The ID of the specific File the citation is from.

                - `start_index: number`

                - `text: string`

                  The text in the message content that needs to be replaced.

                - `type: "file_citation"`

                  Always `file_citation`.

                  - `"file_citation"`

              - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

                A URL for the file that's generated when the assistant used the `code_interpreter` tool to generate a file.

                - `end_index: number`

                - `file_path: object { file_id }`

                  - `file_id: string`

                    The ID of the file that was generated.

                - `start_index: number`

                - `text: string`

                  The text in the message content that needs to be replaced.

                - `type: "file_path"`

                  Always `file_path`.

                  - `"file_path"`

            - `value: string`

              The data that makes up the text.

          - `type: "text"`

            Always `text`.

            - `"text"`

        - `RefusalContentBlock object { refusal, type }`

          The refusal content generated by the assistant.

          - `refusal: string`

          - `type: "refusal"`

            Always `refusal`.

            - `"refusal"`

      - `created_at: number`

        The Unix timestamp (in seconds) for when the message was created.

      - `incomplete_at: number or null`

        The Unix timestamp (in seconds) for when the message was marked as incomplete.

      - `incomplete_details: object { reason }  or null`

        On an incomplete message, details about why the message is incomplete.

        - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

          The reason the message is incomplete.

          - `"content_filter"`

          - `"max_tokens"`

          - `"run_cancelled"`

          - `"run_expired"`

          - `"run_failed"`

      - `metadata: Metadata or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard.

        Keys are strings with a maximum length of 64 characters. Values are strings
        with a maximum length of 512 characters.

      - `object: "thread.message"`

        The object type, which is always `thread.message`.

        - `"thread.message"`

      - `role: "user" or "assistant"`

        The entity that produced the message. One of `user` or `assistant`.

        - `"user"`

        - `"assistant"`

      - `run_id: string or null`

        The ID of the [run](/docs/api-reference/runs) associated with the creation of this message. Value is `null` when messages are created manually using the create message or create thread endpoints.

      - `status: "in_progress" or "incomplete" or "completed"`

        The status of the message, which can be either `in_progress`, `incomplete`, or `completed`.

        - `"in_progress"`

        - `"incomplete"`

        - `"completed"`

      - `thread_id: string`

        The [thread](/docs/api-reference/threads) ID that this message belongs to.

    - `event: "thread.message.created"`

      - `"thread.message.created"`

  - `ThreadMessageInProgress object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) moves to an `in_progress` state.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

    - `event: "thread.message.in_progress"`

      - `"thread.message.in_progress"`

  - `ThreadMessageDelta object { data, event }`

    Occurs when parts of a [Message](/docs/api-reference/messages/object) are being streamed.

    - `data: MessageDeltaEvent`

      Represents a message delta i.e. any changed fields on a message during streaming.

      - `id: string`

        The identifier of the message, which can be referenced in API endpoints.

      - `delta: MessageDelta`

        The delta containing the fields that have changed on the Message.

        - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

          The content of the message in array of text and/or images.

          - `ImageFileDeltaBlock object { index, type, image_file }`

            References an image [File](/docs/api-reference/files) in the content of a message.

            - `index: number`

              The index of the content part in the message.

            - `type: "image_file"`

              Always `image_file`.

              - `"image_file"`

            - `image_file: optional ImageFileDelta`

              - `detail: optional "auto" or "low" or "high"`

                Specifies the detail level of the image if specified by the user. `low` uses fewer tokens, you can opt in to high resolution using `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_id: optional string`

                The [File](/docs/api-reference/files) ID of the image in the message content. Set `purpose="vision"` when uploading the File if you need to later display the file content.

          - `TextDeltaBlock object { index, type, text }`

            The text content that is part of a message.

            - `index: number`

              The index of the content part in the message.

            - `type: "text"`

              Always `text`.

              - `"text"`

            - `text: optional TextDelta`

              - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

                - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

                  A citation within the message that points to a specific quote from a specific File associated with the assistant or the message. Generated when the assistant uses the "file_search" tool to search files.

                  - `index: number`

                    The index of the annotation in the text content part.

                  - `type: "file_citation"`

                    Always `file_citation`.

                    - `"file_citation"`

                  - `end_index: optional number`

                  - `file_citation: optional object { file_id, quote }`

                    - `file_id: optional string`

                      The ID of the specific File the citation is from.

                    - `quote: optional string`

                      The specific quote in the file.

                  - `start_index: optional number`

                  - `text: optional string`

                    The text in the message content that needs to be replaced.

                - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

                  A URL for the file that's generated when the assistant used the `code_interpreter` tool to generate a file.

                  - `index: number`

                    The index of the annotation in the text content part.

                  - `type: "file_path"`

                    Always `file_path`.

                    - `"file_path"`

                  - `end_index: optional number`

                  - `file_path: optional object { file_id }`

                    - `file_id: optional string`

                      The ID of the file that was generated.

                  - `start_index: optional number`

                  - `text: optional string`

                    The text in the message content that needs to be replaced.

              - `value: optional string`

                The data that makes up the text.

          - `RefusalDeltaBlock object { index, type, refusal }`

            The refusal content that is part of a message.

            - `index: number`

              The index of the refusal part in the message.

            - `type: "refusal"`

              Always `refusal`.

              - `"refusal"`

            - `refusal: optional string`

          - `ImageURLDeltaBlock object { index, type, image_url }`

            References an image URL in the content of a message.

            - `index: number`

              The index of the content part in the message.

            - `type: "image_url"`

              Always `image_url`.

              - `"image_url"`

            - `image_url: optional ImageURLDelta`

              - `detail: optional "auto" or "low" or "high"`

                Specifies the detail level of the image. `low` uses fewer tokens, you can opt in to high resolution using `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `url: optional string`

                The URL of the image, must be a supported image types: jpeg, jpg, png, gif, webp.

        - `role: optional "user" or "assistant"`

          The entity that produced the message. One of `user` or `assistant`.

          - `"user"`

          - `"assistant"`

      - `object: "thread.message.delta"`

        The object type, which is always `thread.message.delta`.

        - `"thread.message.delta"`

    - `event: "thread.message.delta"`

      - `"thread.message.delta"`

  - `ThreadMessageCompleted object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) is completed.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

    - `event: "thread.message.completed"`

      - `"thread.message.completed"`

  - `ThreadMessageIncomplete object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) ends before it is completed.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

    - `event: "thread.message.incomplete"`

      - `"thread.message.incomplete"`

  - `ErrorEvent object { data, event }`

    Occurs when an [error](/docs/guides/error-codes#api-errors) occurs. This can happen due to an internal server error or a timeout.

    - `data: ErrorObject`

      - `code: string or null`

      - `message: string`

      - `param: string or null`

      - `type: string`

    - `event: "error"`

      - `"error"`

  - `DoneEvent object { data, event }`

    Occurs when a stream ends.

    - `data: "[DONE]"`

      - `"[DONE]"`

    - `event: "done"`

      - `"done"`

### Code Interpreter Tool

- `CodeInterpreterTool object { type }`

  - `type: "code_interpreter"`

    The type of tool being defined: `code_interpreter`

    - `"code_interpreter"`

### File Search Tool

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

### Function Tool

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

### Message Stream Event

- `MessageStreamEvent = object { data, event }  or object { data, event }  or object { data, event }  or 2 more`

  Occurs when a [message](/docs/api-reference/messages/object) is created.

  - `ThreadMessageCreated object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) is created.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

      - `id: string`

        The identifier, which can be referenced in API endpoints.

      - `assistant_id: string or null`

        If applicable, the ID of the [assistant](/docs/api-reference/assistants) that authored this message.

      - `attachments: array of object { file_id, tools }  or null`

        A list of files attached to the message, and the tools they were added to.

        - `file_id: optional string`

          The ID of the file to attach to the message.

        - `tools: optional array of CodeInterpreterTool or object { type }`

          The tools to add this file to.

          - `CodeInterpreterTool object { type }`

            - `type: "code_interpreter"`

              The type of tool being defined: `code_interpreter`

              - `"code_interpreter"`

          - `FileSearchTool object { type }`

            - `type: "file_search"`

              The type of tool being defined: `file_search`

              - `"file_search"`

      - `completed_at: number or null`

        The Unix timestamp (in seconds) for when the message was completed.

      - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

        The content of the message in array of text and/or images.

        - `ImageFileContentBlock object { image_file, type }`

          References an image [File](/docs/api-reference/files) in the content of a message.

          - `image_file: ImageFile`

            - `file_id: string`

              The [File](/docs/api-reference/files) ID of the image in the message content. Set `purpose="vision"` when uploading the File if you need to later display the file content.

            - `detail: optional "auto" or "low" or "high"`

              Specifies the detail level of the image if specified by the user. `low` uses fewer tokens, you can opt in to high resolution using `high`.

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_file"`

            Always `image_file`.

            - `"image_file"`

        - `ImageURLContentBlock object { image_url, type }`

          References an image URL in the content of a message.

          - `image_url: ImageURL`

            - `url: string`

              The external URL of the image, must be a supported image types: jpeg, jpg, png, gif, webp.

            - `detail: optional "auto" or "low" or "high"`

              Specifies the detail level of the image. `low` uses fewer tokens, you can opt in to high resolution using `high`. Default value is `auto`

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            The type of the content part.

            - `"image_url"`

        - `TextContentBlock object { text, type }`

          The text content that is part of a message.

          - `text: Text`

            - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

              - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

                A citation within the message that points to a specific quote from a specific File associated with the assistant or the message. Generated when the assistant uses the "file_search" tool to search files.

                - `end_index: number`

                - `file_citation: object { file_id }`

                  - `file_id: string`

                    The ID of the specific File the citation is from.

                - `start_index: number`

                - `text: string`

                  The text in the message content that needs to be replaced.

                - `type: "file_citation"`

                  Always `file_citation`.

                  - `"file_citation"`

              - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

                A URL for the file that's generated when the assistant used the `code_interpreter` tool to generate a file.

                - `end_index: number`

                - `file_path: object { file_id }`

                  - `file_id: string`

                    The ID of the file that was generated.

                - `start_index: number`

                - `text: string`

                  The text in the message content that needs to be replaced.

                - `type: "file_path"`

                  Always `file_path`.

                  - `"file_path"`

            - `value: string`

              The data that makes up the text.

          - `type: "text"`

            Always `text`.

            - `"text"`

        - `RefusalContentBlock object { refusal, type }`

          The refusal content generated by the assistant.

          - `refusal: string`

          - `type: "refusal"`

            Always `refusal`.

            - `"refusal"`

      - `created_at: number`

        The Unix timestamp (in seconds) for when the message was created.

      - `incomplete_at: number or null`

        The Unix timestamp (in seconds) for when the message was marked as incomplete.

      - `incomplete_details: object { reason }  or null`

        On an incomplete message, details about why the message is incomplete.

        - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

          The reason the message is incomplete.

          - `"content_filter"`

          - `"max_tokens"`

          - `"run_cancelled"`

          - `"run_expired"`

          - `"run_failed"`

      - `metadata: Metadata or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard.

        Keys are strings with a maximum length of 64 characters. Values are strings
        with a maximum length of 512 characters.

      - `object: "thread.message"`

        The object type, which is always `thread.message`.

        - `"thread.message"`

      - `role: "user" or "assistant"`

        The entity that produced the message. One of `user` or `assistant`.

        - `"user"`

        - `"assistant"`

      - `run_id: string or null`

        The ID of the [run](/docs/api-reference/runs) associated with the creation of this message. Value is `null` when messages are created manually using the create message or create thread endpoints.

      - `status: "in_progress" or "incomplete" or "completed"`

        The status of the message, which can be either `in_progress`, `incomplete`, or `completed`.

        - `"in_progress"`

        - `"incomplete"`

        - `"completed"`

      - `thread_id: string`

        The [thread](/docs/api-reference/threads) ID that this message belongs to.

    - `event: "thread.message.created"`

      - `"thread.message.created"`

  - `ThreadMessageInProgress object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) moves to an `in_progress` state.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

    - `event: "thread.message.in_progress"`

      - `"thread.message.in_progress"`

  - `ThreadMessageDelta object { data, event }`

    Occurs when parts of a [Message](/docs/api-reference/messages/object) are being streamed.

    - `data: MessageDeltaEvent`

      Represents a message delta i.e. any changed fields on a message during streaming.

      - `id: string`

        The identifier of the message, which can be referenced in API endpoints.

      - `delta: MessageDelta`

        The delta containing the fields that have changed on the Message.

        - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

          The content of the message in array of text and/or images.

          - `ImageFileDeltaBlock object { index, type, image_file }`

            References an image [File](/docs/api-reference/files) in the content of a message.

            - `index: number`

              The index of the content part in the message.

            - `type: "image_file"`

              Always `image_file`.

              - `"image_file"`

            - `image_file: optional ImageFileDelta`

              - `detail: optional "auto" or "low" or "high"`

                Specifies the detail level of the image if specified by the user. `low` uses fewer tokens, you can opt in to high resolution using `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_id: optional string`

                The [File](/docs/api-reference/files) ID of the image in the message content. Set `purpose="vision"` when uploading the File if you need to later display the file content.

          - `TextDeltaBlock object { index, type, text }`

            The text content that is part of a message.

            - `index: number`

              The index of the content part in the message.

            - `type: "text"`

              Always `text`.

              - `"text"`

            - `text: optional TextDelta`

              - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

                - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

                  A citation within the message that points to a specific quote from a specific File associated with the assistant or the message. Generated when the assistant uses the "file_search" tool to search files.

                  - `index: number`

                    The index of the annotation in the text content part.

                  - `type: "file_citation"`

                    Always `file_citation`.

                    - `"file_citation"`

                  - `end_index: optional number`

                  - `file_citation: optional object { file_id, quote }`

                    - `file_id: optional string`

                      The ID of the specific File the citation is from.

                    - `quote: optional string`

                      The specific quote in the file.

                  - `start_index: optional number`

                  - `text: optional string`

                    The text in the message content that needs to be replaced.

                - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

                  A URL for the file that's generated when the assistant used the `code_interpreter` tool to generate a file.

                  - `index: number`

                    The index of the annotation in the text content part.

                  - `type: "file_path"`

                    Always `file_path`.

                    - `"file_path"`

                  - `end_index: optional number`

                  - `file_path: optional object { file_id }`

                    - `file_id: optional string`

                      The ID of the file that was generated.

                  - `start_index: optional number`

                  - `text: optional string`

                    The text in the message content that needs to be replaced.

              - `value: optional string`

                The data that makes up the text.

          - `RefusalDeltaBlock object { index, type, refusal }`

            The refusal content that is part of a message.

            - `index: number`

              The index of the refusal part in the message.

            - `type: "refusal"`

              Always `refusal`.

              - `"refusal"`

            - `refusal: optional string`

          - `ImageURLDeltaBlock object { index, type, image_url }`

            References an image URL in the content of a message.

            - `index: number`

              The index of the content part in the message.

            - `type: "image_url"`

              Always `image_url`.

              - `"image_url"`

            - `image_url: optional ImageURLDelta`

              - `detail: optional "auto" or "low" or "high"`

                Specifies the detail level of the image. `low` uses fewer tokens, you can opt in to high resolution using `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `url: optional string`

                The URL of the image, must be a supported image types: jpeg, jpg, png, gif, webp.

        - `role: optional "user" or "assistant"`

          The entity that produced the message. One of `user` or `assistant`.

          - `"user"`

          - `"assistant"`

      - `object: "thread.message.delta"`

        The object type, which is always `thread.message.delta`.

        - `"thread.message.delta"`

    - `event: "thread.message.delta"`

      - `"thread.message.delta"`

  - `ThreadMessageCompleted object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) is completed.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

    - `event: "thread.message.completed"`

      - `"thread.message.completed"`

  - `ThreadMessageIncomplete object { data, event }`

    Occurs when a [message](/docs/api-reference/messages/object) ends before it is completed.

    - `data: Message`

      Represents a message within a [thread](/docs/api-reference/threads).

    - `event: "thread.message.incomplete"`

      - `"thread.message.incomplete"`

### Run Step Stream Event

- `RunStepStreamEvent = object { data, event }  or object { data, event }  or object { data, event }  or 4 more`

  Occurs when a [run step](/docs/api-reference/run-steps/step-object) is created.

  - `ThreadRunStepCreated object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) is created.

    - `data: RunStep`

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

    - `event: "thread.run.step.created"`

      - `"thread.run.step.created"`

  - `ThreadRunStepInProgress object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) moves to an `in_progress` state.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.in_progress"`

      - `"thread.run.step.in_progress"`

  - `ThreadRunStepDelta object { data, event }`

    Occurs when parts of a [run step](/docs/api-reference/run-steps/step-object) are being streamed.

    - `data: RunStepDeltaEvent`

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

    - `event: "thread.run.step.delta"`

      - `"thread.run.step.delta"`

  - `ThreadRunStepCompleted object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) is completed.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.completed"`

      - `"thread.run.step.completed"`

  - `ThreadRunStepFailed object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) fails.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.failed"`

      - `"thread.run.step.failed"`

  - `ThreadRunStepCancelled object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) is cancelled.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.cancelled"`

      - `"thread.run.step.cancelled"`

  - `ThreadRunStepExpired object { data, event }`

    Occurs when a [run step](/docs/api-reference/run-steps/step-object) expires.

    - `data: RunStep`

      Represents a step in execution of a run.

    - `event: "thread.run.step.expired"`

      - `"thread.run.step.expired"`

### Run Stream Event

- `RunStreamEvent = object { data, event }  or object { data, event }  or object { data, event }  or 7 more`

  Occurs when a new [run](/docs/api-reference/runs/object) is created.

  - `ThreadRunCreated object { data, event }`

    Occurs when a new [run](/docs/api-reference/runs/object) is created.

    - `data: Run`

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

    - `event: "thread.run.created"`

      - `"thread.run.created"`

  - `ThreadRunQueued object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to a `queued` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.queued"`

      - `"thread.run.queued"`

  - `ThreadRunInProgress object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to an `in_progress` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.in_progress"`

      - `"thread.run.in_progress"`

  - `ThreadRunRequiresAction object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to a `requires_action` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.requires_action"`

      - `"thread.run.requires_action"`

  - `ThreadRunCompleted object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) is completed.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.completed"`

      - `"thread.run.completed"`

  - `ThreadRunIncomplete object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) ends with status `incomplete`.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.incomplete"`

      - `"thread.run.incomplete"`

  - `ThreadRunFailed object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) fails.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.failed"`

      - `"thread.run.failed"`

  - `ThreadRunCancelling object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) moves to a `cancelling` status.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.cancelling"`

      - `"thread.run.cancelling"`

  - `ThreadRunCancelled object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) is cancelled.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.cancelled"`

      - `"thread.run.cancelled"`

  - `ThreadRunExpired object { data, event }`

    Occurs when a [run](/docs/api-reference/runs/object) expires.

    - `data: Run`

      Represents an execution run on a [thread](/docs/api-reference/threads).

    - `event: "thread.run.expired"`

      - `"thread.run.expired"`

### Thread Stream Event

- `ThreadStreamEvent object { data, event, enabled }`

  Occurs when a new [thread](/docs/api-reference/threads/object) is created.

  - `data: Thread`

    Represents a thread that contains [messages](/docs/api-reference/messages).

    - `id: string`

      The identifier, which can be referenced in API endpoints.

    - `created_at: number`

      The Unix timestamp (in seconds) for when the thread was created.

    - `metadata: Metadata or null`

      Set of 16 key-value pairs that can be attached to an object. This can be
      useful for storing additional information about the object in a structured
      format, and querying for objects via API or the dashboard.

      Keys are strings with a maximum length of 64 characters. Values are strings
      with a maximum length of 512 characters.

    - `object: "thread"`

      The object type, which is always `thread`.

      - `"thread"`

    - `tool_resources: object { code_interpreter, file_search }  or null`

      A set of resources that are made available to the assistant's tools in this thread. The resources are specific to the type of tool. For example, the `code_interpreter` tool requires a list of file IDs, while the `file_search` tool requires a list of vector store IDs.

      - `code_interpreter: optional object { file_ids }`

        - `file_ids: optional array of string`

          A list of [file](/docs/api-reference/files) IDs made available to the `code_interpreter` tool. There can be a maximum of 20 files associated with the tool.

      - `file_search: optional object { vector_store_ids }`

        - `vector_store_ids: optional array of string`

          The [vector store](/docs/api-reference/vector-stores/object) attached to this thread. There can be a maximum of 1 vector store attached to the thread.

  - `event: "thread.created"`

    - `"thread.created"`

  - `enabled: optional boolean`

    Whether to enable input audio transcription.
