# Realtime

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

## Domain Types

### 音频转录

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转录文本之前等待的时间。
    较高的值可以提高转录准确率，但会增加延迟。
    仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。使用
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    可以提高准确率并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续先前音频的可选文本
    片段。
    对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
    Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

### 会话创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  在会话创建时返回。在会话创建后立即发出。

  - `conversation: object { id, object }`

    会话资源。

    - `id: optional string`

      会话的唯一 ID。

    - `object: optional string`

      对象类型，必须为 `realtime.conversation`.

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "conversation.created"`

    事件类型，必须为 `conversation.created`.

    - `"conversation.created"`

### 会话项

- `ConversationItem = RealtimeConversationItemSystemMessage or RealtimeConversationItemUserMessage or RealtimeConversationItemAssistantMessage or 6 more`

  Realtime 会话中的单个 item。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` ，表示系统消息。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      item 的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供或由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（用于 `input_text`).

      - `transcript: optional string`

        音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      item 的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供或由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息项。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本，如果输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      item 的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供或由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一个函数调用项。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      item 的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供或由服务端生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一个函数调用输出项。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      item 的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      item 的唯一 ID。这可以由客户端提供或由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      所应答审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      item 的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    列出 MCP 服务器可用工具的 Realtime 条目。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      item 的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    表示在 MCP 服务器上调用工具的 Realtime 条目。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      所运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      item 的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联审批请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用产生的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个请求人工批准工具调用的 Realtime item。

    - `id: string`

      批准请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      item 的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

### 会话项已添加

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当 Item 被添加到默认会话时由服务端发送。可能在以下几种情况下发生：

  - 当客户端发送 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。这种情况下，该 Item 将是一条包含缓冲区中音频的用户消息。
  - 当模型正在生成 Response 时。这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时还不会有任何内容（且 `status` 将是 `in_progress`).

  该事件将包含 Item 的全部内容（模型正在生成 Response 的情况除外），但音频数据除外，音频数据可在需要时通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 会话中的单个 item。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.added"`

    事件类型，必须为 `conversation.item.added`.

    - `"conversation.item.added"`

  - `previous_item_id: optional string or null`

    位于此项之前的项的 ID（如果有）。这用于
    在插入项时保持顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向会话的上下文添加一个新 Item，包括消息、函数调用和函数调用响应。该事件既可用于填充会话的“历史”记录，也可在流式传输中途添加新的 Item，但当前存在一个限制：无法填充助手音频消息。
  calls, and function call responses. This event can be used both to populate a
  "history" of the conversation and to add new items mid-stream, but has the
  current limitation that it cannot populate assistant audio messages.

  If successful, the server will respond with a `conversation.item.created`
  event, otherwise an `error` 事件将被发送。

  - `item: ConversationItem`

    Realtime 会话中的单个 item。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.create"`

    事件类型，必须为 `conversation.item.create`.

    - `"conversation.item.create"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `previous_item_id: optional string`

    新项将插入其后的前一项的 ID。如果未设置，新项将追加到对话末尾。

    如果设置为 `root`，新项将被添加到对话的开头。

    如果设置为现有 ID，则可以在对话中间插入一个项。如果找不到该 ID，将返回错误，并且不会添加该项。

### 对话项创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在创建对话项时返回。产生此事件的情况有多种：

  - 服务器正在生成 Response，如果成功将产生
    一个或两个 Item，其类型为 `message`
    (role `assistant`) 或类型 `function_call`.
  - 输入音频缓冲区已提交，可以由客户端或
    服务器（在 `server_vad` 模式下）提交。服务器将获取
    输入音频缓冲区的内容并将其添加到新的用户消息 Item 中。
  - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
    到对话中。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 会话中的单个 item。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.created"`

    事件类型，必须为 `conversation.item.created`.

    - `"conversation.item.created"`

  - `previous_item_id: optional string or null`

    对话上下文中前一个项的 ID，可让
    客户端理解对话顺序。可以是 `null` 如果该
    项没有前驱项。

### 对话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你希望从会话中移除某个条目时，发送此事件
  历史记录。服务端将返回一个 `conversation.item.deleted` 事件，
  除非该条目不存在于会话历史记录中，此时
  服务端将响应一个错误。

  - `item_id: string`

    要删除的条目的 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 对话项删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当会话中的某个条目被客户端通过某个事件删除时返回。
  `conversation.item.delete` 事件。该事件用于同步服务端对会话历史的理解与客户端的视图。
  服务端对会话历史的理解与客户端的视图。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    被删除条目的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话项已完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  当对话项被定稿时返回。

  该事件将包含该 Item 的完整内容，但音频数据除外，音频数据可以单独通过以下方式检索： `conversation.item.retrieve` 事件（如有需要）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 会话中的单个 item。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.done"`

    事件类型，必须为 `conversation.item.done`.

    - `"conversation.item.done"`

  - `previous_item_id: optional string or null`

    位于此项之前的项的 ID（如果有）。这用于
    在插入项时保持顺序。

### 对话项输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  该事件是写入
  用户音频缓冲区的音频转写输出。当输入音频缓冲区被
  客户端或服务端（启用 VAD 时）提交时，转写开始。转写与 Response 创建
  异步进行，因此该事件可能早于或晚于
  Response 事件到达。

  Realtime API 模型原生支持音频，因此输入转写是
  在另一个 ASR（自动语音识别）模型上运行的独立过程。
  转写文本可能与模型的解读存在一定差异，
  应作为大致参考。

  - `content_index: number`

    包含音频的内容分块的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    包含正在转写音频的项的 ID。

  - `transcript: string`

    已转写的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    该转写的用量统计，按照 ASR 模型的定价计费，而非 realtime 模型的定价。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 用量计费的模型的用量统计。

      - `input_tokens: number`

        本次请求计费的输入 token 数量。

      - `output_tokens: number`

        已生成的输出 token 数量。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        用量对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入 token 的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的用量统计信息。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        用量对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

    - `code: string`

      在音频中检测到的某种语言的语言代码。

  - `logprobs: optional array of LogProbProperties or null`

    转录结果的对数概率。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录增量事件

- `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

  当输入音频转录内容部分的文本值被更新为增量转录结果时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    包含正在转写音频的项的 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    项目内容数组中内容部分的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。可通过配置会话启用，配置方式为 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应此段转录可能被选中的某个 token 的对数概率。这有助于判断在给定转录片段中是否存在多个有效选项。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  当配置了输入音频转录，且用户消息的转录
  请求失败时返回。这些事件与其他事件分开，以便客户端能够识别相关的 Item。
  `error` 事件以便客户端能够识别相关的 Item。

  - `content_index: number`

    包含音频的内容分块的索引。

  - `error: object { code, message, param, type }`

    转录错误的详细信息。

    - `code: optional string`

      错误代码（如果有）。

    - `message: optional string`

      人类可读的错误消息。

    - `param: optional string`

      与错误相关的参数（如果有）。

    - `type: optional string`

      错误的类型。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    用户消息条目的 ID。

  - `type: "conversation.item.input_audio_transcription.failed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.failed`.

    - `"conversation.item.input_audio_transcription.failed"`

### 对话项输入音频转写片段

- `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

  在为某个 item 识别出输入音频转写片段时返回。

  - `id: string`

    片段标识符。

  - `content_index: number`

    该 item 中输入音频内容部分的索引。

  - `end: number`

    片段的结束时间（秒）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    包含输入音频内容的 item 的 ID。

  - `speaker: string`

    为该片段检测到的说话人标签。

  - `start: number`

    片段的开始时间（秒）。

  - `text: string`

    该片段的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### 对话项检索事件

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你想要检索服务端在会话历史中某个特定项的表示时发送此事件。例如，这在降噪和 VAD 之后检查用户音频时非常有用。
  服务端将返回一个 `conversation.item.retrieved` 事件，
  除非该条目不存在于会话历史记录中，此时
  服务端将响应一个错误。

  - `item_id: string`

    要检索的项的 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件以截断上一条助手消息的音频。服务端
  将以快于实时的速度生成音频，因此当你需要截断已发送
  给客户端但尚未播放的音频时，此事件非常有用。这会同步服务端对音频
  的理解与客户端的播放进度。
  the client's playback.

  截断音频将删除 服务端 文本转写，以确保上下文中
  不会保留用户尚未听到的文本。

  If successful, the server will respond with a `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    截断音频所包含的时长上限，单位为毫秒。如果
    audio_end_ms 超过实际的音频时长，
    服务端将返回错误。

  - `content_index: number`

    要截断的内容部分的索引。请将此值设置为 `0`.

  - `item_id: string`

    要截断的助手消息项的 ID。仅助手消息
    项可以被截断。

  - `type: "conversation.item.truncate"`

    事件类型，必须为 `conversation.item.truncate`.

    - `"conversation.item.truncate"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 对话项截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当较早的助手音频消息项被客户端通过
  事件截断时返回。 `conversation.item.truncate` 事件。此事件用于
  使服务端对音频的理解与客户端的播放保持同步。

  此操作将截断音频并移除服务端的文本转录，
  以确保上下文中没有用户尚未听到的文本。

  - `audio_end_ms: number`

    音频被截断到的时长（毫秒）。

  - `content_index: number`

    被截断的内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    被截断的助手消息项的 ID。

  - `type: "conversation.item.truncated"`

    事件类型，必须为 `conversation.item.truncated`.

    - `"conversation.item.truncated"`

### 带引用的对话项

- `ConversationItemWithReference object { id, arguments, call_id, 7 more }`

  要添加到对话中的条目。

  - `id: optional string`

    对于类型为 ( 的条目，`message` | `function_call` | `function_call_output`)
    该字段允许客户端为该条目指定唯一 ID。它
    不是必需的，因为如果未提供，服务端会生成一个。

    对于类型为 `item_reference`，的条目，该字段是必需的，并且是
    对之前在对话中已存在的任意条目的引用。

  - `arguments: optional string`

    函数调用的参数（适用于 `function_call` 条目）。

  - `call_id: optional string`

    函数调用的 ID（适用于 `function_call` 和
    `function_call_output` 条目）。如果在 `function_call_output`
    条目上传递，服务端会检查对话历史中是否存在具有相同 `function_call` ID 的
    条目。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 条目。

    - 角色为 `system` 的消息条目仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` content.

    - `id: optional string`

      ID of a previous conversation item to reference (for `item_reference`
      content types in `response.create` events). These can reference both
      client and server created items.

    - `audio: optional string`

      Base64-encoded audio bytes, used for `input_audio` content type.

    - `text: optional string`

      The text content, used for `input_text` 和 `text` content types.

    - `transcript: optional string`

      The transcript of the audio, used for `input_audio` content type.

    - `type: optional "input_audio" or "input_text" or "item_reference" or "text"`

      The content type (`input_text`, `input_audio`, `item_reference`, `text`).

      - `"input_audio"`

      - `"input_text"`

      - `"item_reference"`

      - `"text"`

  - `name: optional string`

    The name of the function being called (for `function_call` 条目）。

  - `object: optional "realtime.item"`

    Identifier for the API object being returned - always `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    The output of the function call (for `function_call_output` 条目）。

  - `role: optional "user" or "assistant" or "system"`

    The role of the message sender (`user`, `assistant`, `system`), only
    applicable for `message` 条目。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    The status of the item (`completed`, `incomplete`, `in_progress`). These have no effect
    on the conversation, but are accepted for consistency with the
    `conversation.item.created` 事件时。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

  - `type: optional "message" or "function_call" or "function_call_output"`

    项目的类型（`message`, `function_call`, `function_call_output`, `item_reference`).

    - `"message"`

    - `"function_call"`

    - `"function_call_output"`

### Input Audio Buffer Append Event

- `InputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件可将音频字节追加到输入音频缓冲区。该音频
  缓冲区是可写的临时存储，你可以稍后提交。一次“提交”会根据缓冲区内容在
  对话历史中创建一条新的用户消息项，并清空缓冲区。
  如果启用了输入音频转录，将在提交缓冲区时生成转录文本。

  如果启用了 VAD，音频缓冲区将用于检测语音，并由服务端决定何时
  提交。禁用服务端 VAD 时，你必须手动提交音频缓冲区。
  输入音频降噪作用于对音频缓冲区的写入。

  客户端可自行决定每个事件放入多少音频，最大
  为 15 MiB；例如客户端流式传输较小的分块可以让
  VAD 响应更及时。与其他大多数客户端事件不同，服务端
  不会针对此事件发送确认响应。

  - `audio: string`

    Base64 编码的音频字节。其格式必须与会话配置中指定的
    `input_audio_format` 字段一致。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区清除事件

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务端将
  返回 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区清除事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  当输入音频缓冲区由客户端通过以下方式清除时返回：a
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### Input Audio Buffer Commit Event

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入的音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在服务端 VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果已在会话配置中启用），但不会创建来自模型的响应。服务端将使用一个 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区提交事件

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  在输入音频缓冲区被提交时返回，无论是客户端提交还是在服务端 VAD 模式下自动提交。
  event 属性是即将创建的用户消息项的 ID，因此 `item_id` 这是一
  个 conversation.item.created 事件。 `conversation.item.created` event
  也会被发送到客户端。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项将插入到其之后的先前项的 ID。
    可以是 `null` 如果该项没有前驱项。

### 输入音频缓冲区 DTMF 事件已接收事件

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示电话键盘按键
  （0–9、*、#、A–D）的消息。该 `event` 属性
  是用户按下的键盘按键。该 `received_at` 是服务器接收事件的 UTC Unix 时间戳
  ，即服务器接收到该事件的时间。

  - `event: string`

    用户按下的电话按键。

  - `received_at: number`

    服务器接收 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### Input Audio Buffer Speech Started 事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  在 `server_vad` 模式下由服务端发送，用于指示已在音频缓冲区中检测到语音。只要有音频被添加到缓冲区，就可能发生此情况（除非已检测到语音）。客户端可以使用此事件来中断音频播放或向用户提供视觉反馈。
  检测到语音。只要有音频被添加到
  缓冲区中，就可能发生此情况（除非已检测到语音）。客户端可以使用此事件来中断音频播放或向用户提供视觉反馈。
  中断音频播放或向用户提供视觉反馈。

  客户端应当预期在语音停止时收到一个 `input_audio_buffer.speech_stopped` event
  事件。item_id `item_id` 属性是将在语音停止时创建的用户消息项的 ID，
  该 ID 也会出现在
  `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
  音频缓冲区）。

  - `audio_start_ms: number`

    从会话期间写入缓冲区的所有音频开头起，到首次检测到语音为止所经过的毫秒数。这将对应于发送给模型的音频起始处，因此包含在
    从会话期间写入缓冲区的所有音频开头起，到首次检测到语音为止的毫秒数。该值对应于发送给模型的音频起始处，
    因此包含在会话中配置的
    `prefix_padding_ms` （在 Session 中配置的）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    语音停止时将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  在以下情况下以 `server_vad` 模式返回：服务端检测到音频缓冲区中的语音结束时。服务端还会发送一个
  包含由音频缓冲区生成的用户消息条目的事件。 `conversation.item.created`
  包含由音频缓冲区生成的用户消息条目的事件。

  - `audio_end_ms: number`

    自会话开始起，语音停止时的毫秒数。该值对应于发送给模型的音频结束位置，因此包含
    发送给模型的音频结束位置，因此包含
    `min_silence_duration_ms` （在 Session 中配置的）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时已触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  在输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话的
  设置中 `idle_timeout_ms` 进行配置，表示在配置的持续时间内未检测到任何语音。 `turn_detection` 设置中配置，表示在配置的
  持续时间内未检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段表示从写入输入音频缓冲区的音频开头算起，
  从最后一个模型响应到触发时间之间的音频片段偏移量。这意味着它划分了处于静默状态的
  音频片段，其起始值与结束值之差大致等于所配置的超时时长。
  音频片段，其起始值与结束值之差大致等于所配置的超时时长。

  这段空音频将作为 `input_audio` 项提交到对话中（将产生一个
  `input_audio_buffer.committed` 事件），并生成模型响应。模型仍可能检测到未触发 VAD 的语音，因此模型可能会根据对话内容作出相关回复，或提示用户继续说话。
  事件），并生成模型响应。模型仍可能检测到未触发 VAD 的语音，因此模型可能
  会给出与对话相关的内容，或提示用户继续说话。

  - `audio_end_ms: number`

    触发超时时，已写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    位于上一个模型响应播放时间之后、已写入输入音频缓冲区的音频的毫秒偏移量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    与此音频片段关联的项的 ID。

  - `type: "input_audio_buffer.timeout_triggered"`

    事件类型，必须为 `input_audio_buffer.timeout_triggered`.

    - `"input_audio_buffer.timeout_triggered"`

### Log Prob Properties

- `LogProbProperties object { token, bytes, logprob }`

  一个对数概率对象。

  - `token: string`

    用于生成该对数概率的 token。

  - `bytes: array of number`

    用于生成该对数概率的字节。

  - `logprob: number`

    该 token 的对数概率。

### Mcp 列出工具已完成

- `McpListToolsCompleted object { event_id, item_id, type }`

  当列出 MCP 工具针对某个条目完成时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP list tools 条目的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp 列出工具失败

- `McpListToolsFailed object { event_id, item_id, type }`

  当某个条目的 MCP 工具列表获取失败时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP list tools 条目的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp List Tools In Progress

- `McpListToolsInProgress object { event_id, item_id, type }`

  当某条目的 MCP 工具列举正在进行时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP list tools 条目的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 降噪类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### Output Audio Buffer Clear Event

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
  停止生成音频并发出 `output_audio_buffer.cleared` 事件。该
  事件应之前有一个 `response.cancel` 客户端事件来停止当前
  响应的生成。
  [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### 速率限制更新事件

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，用于指示已更新的速率限制。
  在创建 Response 时，会为输出 "预留" 一些 tokens
  tokens，此处显示的速率限制反映了该预留，随后会在
  Response 完成后相应地进行调整。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

    速率限制信息列表。

    - `limit: optional number`

      该速率限制所允许的最大值。

    - `name: optional "requests" or "tokens"`

      速率限制的名称（`requests`, `tokens`).

      - `"requests"`

      - `"tokens"`

    - `remaining: optional number`

      达到限制之前的剩余值。

    - `reset_seconds: optional number`

      速率限制重置前的剩余秒数。

  - `type: "rate_limits.updated"`

    事件类型，必须为 `rate_limits.updated`.

    - `"rate_limits.updated"`

### Realtime Audio Config

- `RealtimeAudioConfig object { input, output }`

  输入和输出音频的配置。

  - `input: optional RealtimeAudioConfigInput`

    - `format: optional RealtimeAudioFormats`

      输入音频的格式。

      - `PCMAudio object { rate, type }`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `rate: optional 24000`

          音频的采样率。始终为 `24000`.

          - `24000`

        - `type: optional "audio/pcm"`

          音频格式。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `PCMUAudio object { type }`

        G.711 μ-law 格式。

        - `type: optional "audio/pcmu"`

          音频格式。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `PCMAAudio object { type }`

        G.711 A-law 格式。

        - `type: optional "audio/pcma"`

          音频格式。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可以提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频的可选文本
        片段。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。这在
          用户长时间停顿属于意外情况的场景下非常有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文进行。

          该超时值将在上一个模型响应的音频播放完成后生效，
          即它被设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          关联到 Response）会在达到超时时被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当发生 VAD start 事件时，是否自动中断（取消）向默认
          会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。值越小，模型响应越快，
          但可能会在用户短暂的停顿时插入。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
          高的阈值会要求更大的音量才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当发生 VAD stop 事件时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
          会话（即。 `conversation` 的 `auto`)。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应的速度，以原始速度的倍数表示。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

      该参数是在音频生成之后对音频进行的后处理调整，也
      可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回复的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
      一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
      在会话过程中就无法再更改声音。
      我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

      - `string`

      - `"alloy" or "ash" or "ballad" or 7 more`

        - `"alloy"`

        - `"ash"`

        - `"ballad"`

        - `"coral"`

        - `"echo"`

        - `"sage"`

        - `"shimmer"`

        - `"verse"`

        - `"marin"`

        - `"cedar"`

      - `ID object { id }`

        自定义语音参考。

        - `id: string`

          自定义语音 ID，例如： `voice_1234`.

### Realtime Audio Config Input

- `RealtimeAudioConfigInput object { format, noise_reduction, transcription, turn_detection }`

  - `format: optional RealtimeAudioFormats`

    输入音频的格式。

    - `PCMAudio object { rate, type }`

      PCM 音频格式。仅支持 24kHz 采样率。

      - `rate: optional 24000`

        音频的采样率。始终为 `24000`.

        - `24000`

      - `type: optional "audio/pcm"`

        音频格式。始终为 `audio/pcm`.

        - `"audio/pcm"`

    - `PCMUAudio object { type }`

      G.711 μ-law 格式。

      - `type: optional "audio/pcmu"`

        音频格式。始终为 `audio/pcmu`.

        - `"audio/pcmu"`

    - `PCMAAudio object { type }`

      G.711 A-law 格式。

      - `type: optional "audio/pcma"`

        音频格式。始终为 `audio/pcma`.

        - `"audio/pcma"`

  - `noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
    对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转录文本之前等待的时间。
      较高的值可以提高转录准确率，但会增加延迟。
      仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。使用
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      可以提高准确率并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续先前音频的可选文本
      片段。
      对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
      Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

    语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。这在
        用户长时间停顿属于意外情况的场景下非常有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话，
        基于当前上下文进行。

        该超时值将在上一个模型响应的音频播放完成后生效，
        即它被设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        关联到 Response）会在达到超时时被发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当发生 VAD start 事件时，是否自动中断（取消）向默认
        会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
        500ms。值越小，模型响应越快，
        但可能会在用户短暂的停顿时插入。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
        高的阈值会要求更大的音量才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当发生 VAD stop 事件时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
        会话（即。 `conversation` 的 `auto`)。

### Realtime Audio Config Output

- `RealtimeAudioConfigOutput object { format, speed, voice }`

  - `format: optional RealtimeAudioFormats`

    输出音频的格式。

    - `PCMAudio object { rate, type }`

      PCM 音频格式。仅支持 24kHz 采样率。

      - `rate: optional 24000`

        音频的采样率。始终为 `24000`.

        - `24000`

      - `type: optional "audio/pcm"`

        音频格式。始终为 `audio/pcm`.

        - `"audio/pcm"`

    - `PCMUAudio object { type }`

      G.711 μ-law 格式。

      - `type: optional "audio/pcmu"`

        音频格式。始终为 `audio/pcmu`.

        - `"audio/pcmu"`

    - `PCMAAudio object { type }`

      G.711 A-law 格式。

      - `type: optional "audio/pcma"`

        音频格式。始终为 `audio/pcma`.

        - `"audio/pcma"`

  - `speed: optional number`

    模型语音回应的速度，以原始速度的倍数表示。
    1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

    该参数是在音频生成之后对音频进行的后处理调整，也
    可以通过提示让模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于回复的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
    一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
    在会话过程中就无法再更改声音。
    我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      - `"alloy"`

      - `"ash"`

      - `"ballad"`

      - `"coral"`

      - `"echo"`

      - `"sage"`

      - `"shimmer"`

      - `"verse"`

      - `"marin"`

      - `"cedar"`

    - `ID object { id }`

      自定义语音参考。

      - `id: string`

        自定义语音 ID，例如： `voice_1234`.

### Realtime Audio Formats

- `RealtimeAudioFormats = object { rate, type }  or object { type }  or object { type }`

  PCM 音频格式。仅支持 24kHz 采样率。

  - `PCMAudio object { rate, type }`

    PCM 音频格式。仅支持 24kHz 采样率。

    - `rate: optional 24000`

      音频的采样率。始终为 `24000`.

      - `24000`

    - `type: optional "audio/pcm"`

      音频格式。始终为 `audio/pcm`.

      - `"audio/pcm"`

  - `PCMUAudio object { type }`

    G.711 μ-law 格式。

    - `type: optional "audio/pcmu"`

      音频格式。始终为 `audio/pcmu`.

      - `"audio/pcmu"`

  - `PCMAAudio object { type }`

    G.711 A-law 格式。

    - `type: optional "audio/pcma"`

      音频格式。始终为 `audio/pcma`.

      - `"audio/pcma"`

### Realtime Audio Input Turn Detection

- `RealtimeAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超过该时间后将自动触发模型响应。这在
      用户长时间停顿属于意外情况的场景下非常有用，例如电话
      通话。模型将根据当前上下文有效地提示用户继续对话，
      基于当前上下文进行。

      该超时值将在上一个模型响应的音频播放完成后生效，
      即它被设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
      关联到 Response）会在达到超时时被发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当发生 VAD start 事件时，是否自动中断（取消）向默认
      会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
      500ms。值越小，模型响应越快，
      但可能会在用户短暂的停顿时插入。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
      高的阈值会要求更大的音量才能激活模型，
      因此在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当发生 VAD stop 事件时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
      会话（即。 `conversation` 的 `auto`)。

### Realtime Client Event

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向会话的上下文添加一个新 Item，包括消息、函数调用和函数调用响应。该事件既可用于填充会话的“历史”记录，也可在流式传输中途添加新的 Item，但当前存在一个限制：无法填充助手音频消息。
    calls, and function call responses. This event can be used both to populate a
    "history" of the conversation and to add new items mid-stream, but has the
    current limitation that it cannot populate assistant audio messages.

    If successful, the server will respond with a `conversation.item.created`
    event, otherwise an `error` 事件将被发送。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，表示系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

        Realtime 对话中的用户消息条目。

        - `content: array of object { audio, detail, image_url, 3 more }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一个函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          item 的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一个函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          item 的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所应答审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          item 的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器可用工具的 Realtime 条目。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          item 的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          item 的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          工具调用产生的错误（如果有）。

          - `RealtimeMcpProtocolError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "protocol_error"`

              - `"protocol_error"`

          - `RealtimeMcpToolExecutionError object { message, type }`

            - `message: string`

            - `type: "tool_execution_error"`

              - `"tool_execution_error"`

          - `RealtimeMcphttpError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "http_error"`

              - `"http_error"`

        - `output: optional string or null`

          工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        一个请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          item 的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.create"`

      事件类型，必须为 `conversation.item.create`.

      - `"conversation.item.create"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `previous_item_id: optional string`

      新项将插入其后的前一项的 ID。如果未设置，新项将追加到对话末尾。

      如果设置为 `root`，新项将被添加到对话的开头。

      如果设置为现有 ID，则可以在对话中间插入一个项。如果找不到该 ID，将返回错误，并且不会添加该项。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你希望从会话中移除某个条目时，发送此事件
    历史记录。服务端将返回一个 `conversation.item.deleted` 事件，
    除非该条目不存在于会话历史记录中，此时
    服务端将响应一个错误。

    - `item_id: string`

      要删除的条目的 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你想要检索服务端在会话历史中某个特定项的表示时发送此事件。例如，这在降噪和 VAD 之后检查用户音频时非常有用。
    服务端将返回一个 `conversation.item.retrieved` 事件，
    除非该条目不存在于会话历史记录中，此时
    服务端将响应一个错误。

    - `item_id: string`

      要检索的项的 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件以截断上一条助手消息的音频。服务端
    将以快于实时的速度生成音频，因此当你需要截断已发送
    给客户端但尚未播放的音频时，此事件非常有用。这会同步服务端对音频
    的理解与客户端的播放进度。
    the client's playback.

    截断音频将删除 服务端 文本转写，以确保上下文中
    不会保留用户尚未听到的文本。

    If successful, the server will respond with a `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      截断音频所包含的时长上限，单位为毫秒。如果
      audio_end_ms 超过实际的音频时长，
      服务端将返回错误。

    - `content_index: number`

      要截断的内容部分的索引。请将此值设置为 `0`.

    - `item_id: string`

      要截断的助手消息项的 ID。仅助手消息
      项可以被截断。

    - `type: "conversation.item.truncate"`

      事件类型，必须为 `conversation.item.truncate`.

      - `"conversation.item.truncate"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件可将音频字节追加到输入音频缓冲区。该音频
    缓冲区是可写的临时存储，你可以稍后提交。一次“提交”会根据缓冲区内容在
    对话历史中创建一条新的用户消息项，并清空缓冲区。
    如果启用了输入音频转录，将在提交缓冲区时生成转录文本。

    如果启用了 VAD，音频缓冲区将用于检测语音，并由服务端决定何时
    提交。禁用服务端 VAD 时，你必须手动提交音频缓冲区。
    输入音频降噪作用于对音频缓冲区的写入。

    客户端可自行决定每个事件放入多少音频，最大
    为 15 MiB；例如客户端流式传输较小的分块可以让
    VAD 响应更及时。与其他大多数客户端事件不同，服务端
    不会针对此事件发送确认响应。

    - `audio: string`

      Base64 编码的音频字节。其格式必须与会话配置中指定的
      `input_audio_format` 字段一致。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务端将
    返回 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
    停止生成音频并发出 `output_audio_buffer.cleared` 事件。该
    事件应之前有一个 `response.cancel` 客户端事件来停止当前
    响应的生成。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入的音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在服务端 VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果已在会话配置中启用），但不会创建来自模型的响应。服务端将使用一个 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消正在进行的响应。服务端将响应一个
    事件，状态为 `response.done` 如果 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使当前没有正在进行的响应，
    调用该事件也是安全的，如果出错将会返回错误，会话将保持不受影响。
    调用 `response.cancel` 即使当前没有正在进行的响应，也会返回错误，会话
    将保持不受影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `response_id: optional string`

      要取消的特定响应 ID——如果未提供，则会取消一个
      默认会话中的进行中响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    该事件指示服务端创建一个 Response，即触发
    模型推理。在 Server VAD 模式下，服务端将自动创建 Responses
    。

    一个 Response 至少包含一个 Item，也可能有两个，若是后者，
    则第二个是函数调用。这些 Item 默认会被追加到
    会话历史中。

    服务端将返回一个 `response.created` 事件、Item 相关事件
    及已创建的内容，最后是一个 `response.done` 事件，表示
    Response 已完成。

    该 `response.create` event 包含推理配置，例如
    `instructions` 和 `tools`。如果设置了这些参数，它们将仅在本次 Response 中覆盖会话的
    配置。

    Response 可以在默认对话之外创建，这意味着它们可以
    接收任意输入，并且可以禁用将输出写入对话。
    同一时间只能有一个 Response 向默认对话写入，但除此之外，多个
    Response 可以并行创建。 `metadata` 字段是区分
    多个并发 Response 的好方法。

    客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认
    对话的 Response。可以通过 `input` 字段提供任意输入，该字段是一个数组，可接受
    原始 Item 以及对已有 Item 的引用。

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `response: optional RealtimeResponseCreateParams`

      使用这些参数创建一个新的 Realtime response

      - `audio: optional RealtimeResponseCreateAudioOutput`

        音频输入和输出的配置。

        - `output: optional object { format, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

            - `PCMAudio object { rate, type }`

              PCM 音频格式。仅支持 24kHz 采样率。

              - `rate: optional 24000`

                音频的采样率。始终为 `24000`.

                - `24000`

              - `type: optional "audio/pcm"`

                音频格式。始终为 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终为 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终为 `audio/pcma`.

                - `"audio/pcma"`

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于回复的声音。支持的内置声音包括
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
            一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
            在会话过程中就无法再更改声音。
            我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              - `"alloy"`

              - `"ash"`

              - `"ballad"`

              - `"coral"`

              - `"echo"`

              - `"sage"`

              - `"shimmer"`

              - `"verse"`

              - `"marin"`

              - `"cedar"`

            - `ID object { id }`

              自定义语音参考。

              - `id: string`

                自定义语音 ID，例如： `voice_1234`.

      - `conversation: optional string or "auto" or "none"`

        控制 response 添加到哪个对话。目前支持
        `auto` 和 `none`，使用 `auto` 作为默认值。 `auto` 值为 previous_response_id
        意味着响应的内容将被添加到默认的
        对话中。将其设置为 none `none` 以创建一个不会向默认对话添加项目的
        带外响应。

        - `string`

        - `"auto" or "none"`

          控制 response 添加到哪个对话。目前支持
          `auto` 和 `none`，使用 `auto` 作为默认值。 `auto` 值为 previous_response_id
          意味着响应的内容将被添加到默认的
          对话中。将其设置为 none `none` 以创建一个不会向默认对话添加项目的
          带外响应。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        要包含在模型提示词中的输入项。使用此字段
        会为本次响应创建一个新的上下文，而不是使用默认的
        对话。空数组 [] `[]` 将清除本次响应的上下文。
        注意，其中可以包含对会话中之前出现过的项目的引用，
        通过它们的 id 进行引用。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一个函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一个函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          列出 MCP 服务器可用工具的 Realtime 条目。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          一个请求人工批准工具调用的 Realtime item。

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如 "极其简洁"、"表现得友好"、"以下是一些优秀响应的示例"）以及音频行为上（例如 "说话快一点"、"在声音中加入情感"、"经常大笑"）的行为。这些指令不一定会被模型严格遵循，但它们为模型的期望行为提供了指导。
        请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
        数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard.

        Keys are strings with a maximum length of 64 characters. Values are strings
        with a maximum length of 512 characters.

      - `output_modalities: optional array of "text" or "audio"`

        The set of modalities the model used to respond, currently the only possible values are
        `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
        output to mode `text` will disable audio output from the model.

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        Whether the model may call multiple tools in parallel. Only supported by
        reasoning Realtime models such as `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        Reference to a prompt template and its variables.
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          The unique identifier of the prompt template to use.

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          Optional map of values to substitute in for variables in your
          prompt. The substitution values can either be strings, or other
          Response input types like images or files.

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              The type of the input item. Always `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `image_url: optional string or null`

              发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送到模型的文件输入。

            - `type: "input_file"`

              The type of the input item. Always `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送到模型的文件内容。

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `file_url: optional string`

              发送到模型的文件的 URL。

            - `filename: optional string`

              发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供一个字符串模式或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
          更多工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定的 function 工具。

          - `name: string`

            要调用的 function 名称。

          - `type: "function"`

            对于 function 调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        可供模型使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时告诉用户什么的指导
            （如果有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            函数在 JSON Schema 中的参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 电子邮件： `connector_outlookemail`
            - SharePoint： `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              ，用于需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
            `tunnel_id` 之一，必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新任何字段
    除了 `voice` 和 `model`. `voice` 只有在尚未产生其他音频输出的情况下才能更新。

    当服务端收到 `session.update`，时，它将响应一个
    事件，状态为 `session.updated` 事件，显示完整且生效的配置。
    只有出现在 `session.update` 中的字段会被更新。若要清除类似
    `instructions`，请传入空字符串。若要清除类似字段 `tools`，请传入空数组。
    若要清除类似字段 `turn_detection`，请传入 `null`.

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。选择 realtime
      会话或转录会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
              对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在输出转录文本之前等待的时间。
                较高的值可以提高转录准确率，但会增加延迟。
                仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。使用
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
                可以提高准确率并降低延迟。

              - `languages: optional array of string`

                输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                用于引导模型风格或延续先前音频的可选文本
                片段。
                对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
                Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

              语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。这在
                  用户长时间停顿属于意外情况的场景下非常有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话，
                  基于当前上下文进行。

                  该超时值将在上一个模型响应的音频播放完成后生效，
                  即它被设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  关联到 Response）会在达到超时时被发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当发生 VAD start 事件时，是否自动中断（取消）向默认
                  会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                  500ms。值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插入。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                  高的阈值会要求更大的音量才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当发生 VAD stop 事件时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                  会话（即。 `conversation` 的 `auto`)。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应的速度，以原始速度的倍数表示。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

              该参数是在音频生成之后对音频进行的后处理调整，也
              可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型用于回复的声音。支持的内置声音包括
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
              一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
              在会话过程中就无法再更改声音。
              我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                - `"alloy"`

                - `"ash"`

                - `"ballad"`

                - `"coral"`

                - `"echo"`

                - `"sage"`

                - `"shimmer"`

                - `"verse"`

                - `"marin"`

                - `"cedar"`

              - `ID object { id }`

                自定义语音参考。

                - `id: string`

                  自定义语音 ID，例如： `voice_1234`.

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的附加字段。

          `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

          请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。请提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
          数。默认为 `inf`.

          - `number`

          - `"inf"`

            - `"inf"`

        - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的 Realtime 模型。

          - `string`

          - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

            此会话使用的 Realtime 模型。

            - `"gpt-realtime"`

            - `"gpt-realtime-1.5"`

            - `"gpt-realtime-2"`

            - `"gpt-realtime-2.1"`

            - `"gpt-realtime-2.1-mini"`

            - `"gpt-realtime-2025-08-28"`

            - `"gpt-4o-realtime-preview"`

            - `"gpt-4o-realtime-preview-2024-10-01"`

            - `"gpt-4o-realtime-preview-2024-12-17"`

            - `"gpt-4o-realtime-preview-2025-06-03"`

            - `"gpt-4o-mini-realtime-preview"`

            - `"gpt-4o-mini-realtime-preview-2024-12-17"`

            - `"gpt-realtime-mini"`

            - `"gpt-realtime-mini-2025-10-06"`

            - `"gpt-realtime-mini-2025-12-15"`

            - `"gpt-audio-1.5"`

            - `"gpt-audio-mini"`

            - `"gpt-audio-mini-2025-10-06"`

            - `"gpt-audio-mini-2025-12-15"`

        - `output_modalities: optional array of "text" or "audio"`

          模型可以响应的模态集合。默认为 `["audio"]`，表示
          模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
          模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          Whether the model may call multiple tools in parallel. Only supported by
          reasoning Realtime models such as `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          Reference to a prompt template and its variables.
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `reasoning: optional RealtimeReasoning`

          适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型选择工具的方式。提供一个字符串模式或强制使用特定的
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪些工具（如果有）。

            `none` 表示模型将不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
            更多工具。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项强制模型调用特定的 function 工具。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项强制模型调用远程 MCP 服务上的特定工具。

        - `tools: optional RealtimeToolsConfig`

          可供模型使用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
              MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
              使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
              通过安全 MCP 隧道进行连接。

              当前支持的 `connector_id` 值包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google 日历： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook 日历： `connector_outlookcalendar`
              - Outlook 电子邮件： `connector_outlookemail`
              - SharePoint： `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，也可以是与工具关联的过滤对象
                ，用于需要审批的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
              `tunnel_id` 之一，必须提供其中一个。

            - `tunnel_id: optional string`

              要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
          为某个会话启用追踪 后，配置便无法修改。

          `auto` 将为该会话创建一个追踪，并使用默认值设置
          工作流 名称、group id 和 metadata。

          - `Auto = "auto"`

            启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            针对 追踪 的细粒度配置。

            - `group_id: optional string`

              附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
              筛选。

            - `workflow_name: optional string`

              附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
              在追踪仪表板中为该追踪 命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

          客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

          截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

          截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

            - `retention_ratio: number`

              指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

              - `post_instructions: optional number`

                指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转写会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。对于 Realtime API，始终为 `transcription` 用于转写会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
              对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

              语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。这在
                  用户长时间停顿属于意外情况的场景下非常有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话，
                  基于当前上下文进行。

                  该超时值将在上一个模型响应的音频播放完成后生效，
                  即它被设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  关联到 Response）会在达到超时时被发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当发生 VAD start 事件时，是否自动中断（取消）向默认
                  会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                  500ms。值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插入。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                  高的阈值会要求更大的音量才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当发生 VAD stop 事件时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                  会话（即。 `conversation` 的 `auto`)。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的附加字段。

          `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。这是一个客户端可以自行指定的任意字符串。如果该事件出现错误，该 ID 会被传回，但对应的 `session.updated` 事件中不会包含它。

### Realtime 对话项助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  Realtime 对话中的一条助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

    - `text: optional string`

      文本内容。

    - `transcript: optional string`

      音频内容的转录文本，如果输出类型为 `audio`.

    - `type: optional "output_text" or "output_audio"`

      内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

      - `"output_text"`

      - `"output_audio"`

  - `role: "assistant"`

    消息发送者的角色。始终为 `assistant`.

    - `"assistant"`

  - `type: "message"`

    item 的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    item 的唯一 ID。这可以由客户端提供或由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项函数调用

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  Realtime 对话中的一个函数调用项。

  - `arguments: string`

    函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    被调用函数的名称。

  - `type: "function_call"`

    item 的类型。始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    item 的唯一 ID。这可以由客户端提供或由服务端生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项函数调用输出

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  Realtime 对话中的一个函数调用输出项。

  - `call_id: string`

    此输出对应的函数调用的 ID。

  - `output: string`

    函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

  - `type: "function_call_output"`

    item 的类型。始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    item 的唯一 ID。这可以由客户端提供或由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。始终为 `input_text` ，表示系统消息。

      - `"input_text"`

  - `role: "system"`

    消息发送者的角色。始终为 `system`.

    - `"system"`

  - `type: "message"`

    item 的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    item 的唯一 ID。这可以由客户端提供或由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项用户消息

- `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

  Realtime 对话中的用户消息条目。

  - `content: array of object { audio, detail, image_url, 3 more }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

    - `detail: optional "auto" or "low" or "high"`

      图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

    - `text: optional string`

      文本内容（用于 `input_text`).

    - `transcript: optional string`

      音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

    - `type: optional "input_text" or "input_audio" or "input_image"`

      内容类型（`input_text`, `input_audio`，或 `input_image`).

      - `"input_text"`

      - `"input_audio"`

      - `"input_image"`

  - `role: "user"`

    消息发送者的角色。始终为 `user`.

    - `"user"`

  - `type: "message"`

    item 的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    item 的唯一 ID。这可以由客户端提供或由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 错误

- `RealtimeError object { message, type, code, 2 more }`

  错误的详细信息。

  - `message: string`

    人类可读的错误消息。

  - `type: string`

    错误类型（例如 "invalid_request_error"、"server_error"）。

  - `code: optional string or null`

    错误代码（如果有）。

  - `event_id: optional string or null`

    导致该错误的客户端事件的 event_id（如适用）。

  - `param: optional string or null`

    与错误相关的参数（如果有）。

### Realtime 错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  在发生错误时返回，错误可能是客户端问题或服务端
  问题。大多数错误都是可恢复的，会话将保持打开状态，我们
  建议实现者默认监控并记录错误消息。

  - `error: RealtimeError`

    错误的详细信息。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误类型（例如 "invalid_request_error"、"server_error"）。

    - `code: optional string or null`

      错误代码（如果有）。

    - `event_id: optional string or null`

      导致该错误的客户端事件的 event_id（如适用）。

    - `param: optional string or null`

      与错误相关的参数（如果有）。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "error"`

    事件类型，必须为 `error`.

    - `"error"`

### Realtime Function Tool

- `RealtimeFunctionTool object { description, name, parameters, type }`

  - `description: optional string`

    函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时告诉用户什么的指导
    （如果有）。

  - `name: optional string`

    函数名称。

  - `parameters: optional unknown`

    函数在 JSON Schema 中的参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

### Realtime Mcp Approval Request

- `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

  一个请求人工批准工具调用的 Realtime item。

  - `id: string`

    批准请求的唯一 ID。

  - `arguments: string`

    工具参数的 JSON 字符串。

  - `name: string`

    要运行的工具名称。

  - `server_label: string`

    发起请求的 MCP 服务器的标签。

  - `type: "mcp_approval_request"`

    item 的类型。始终为 `mcp_approval_request`.

    - `"mcp_approval_request"`

### Realtime Mcp Approval Response

- `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

  响应 MCP 审批请求的 Realtime 项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    所应答审批请求的 ID。

  - `approve: boolean`

    请求是否已批准。

  - `type: "mcp_approval_response"`

    item 的类型。始终为 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    可选的决策原因。

### Realtime Mcp List Tools

- `RealtimeMcpListTools object { server_label, tools, type, id }`

  列出 MCP 服务器可用工具的 Realtime 条目。

  - `server_label: string`

    MCP 服务器的标签。

  - `tools: array of object { input_schema, name, annotations, description }`

    服务器上可用的工具。

    - `input_schema: unknown`

      描述该工具输入的 JSON schema。

    - `name: string`

      工具的名称。

    - `annotations: optional unknown or null`

      关于该工具的附加注解。

    - `description: optional string or null`

      工具的描述。

  - `type: "mcp_list_tools"`

    item 的类型。始终为 `mcp_list_tools`.

    - `"mcp_list_tools"`

  - `id: optional string`

    该列表的唯一 ID。

### Realtime Mcp Protocol Error

- `RealtimeMcpProtocolError object { code, message, type }`

  - `code: number`

  - `message: string`

  - `type: "protocol_error"`

    - `"protocol_error"`

### Realtime Mcp Tool Call

- `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

  表示在 MCP 服务器上调用工具的 Realtime 条目。

  - `id: string`

    工具调用的唯一 ID。

  - `arguments: string`

    传递给该工具的参数的 JSON 字符串。

  - `name: string`

    所运行工具的名称。

  - `server_label: string`

    运行该工具的 MCP 服务器的标签。

  - `type: "mcp_call"`

    item 的类型。始终为 `mcp_call`.

    - `"mcp_call"`

  - `approval_request_id: optional string or null`

    关联审批请求的 ID（如果有）。

  - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

    工具调用产生的错误（如果有）。

    - `RealtimeMcpProtocolError object { code, message, type }`

      - `code: number`

      - `message: string`

      - `type: "protocol_error"`

        - `"protocol_error"`

    - `RealtimeMcpToolExecutionError object { message, type }`

      - `message: string`

      - `type: "tool_execution_error"`

        - `"tool_execution_error"`

    - `RealtimeMcphttpError object { code, message, type }`

      - `code: number`

      - `message: string`

      - `type: "http_error"`

        - `"http_error"`

  - `output: optional string or null`

    工具调用的输出。

### Realtime Mcp Tool Execution Error

- `RealtimeMcpToolExecutionError object { message, type }`

  - `message: string`

  - `type: "tool_execution_error"`

    - `"tool_execution_error"`

### Realtime Mcphttp Error

- `RealtimeMcphttpError object { code, message, type }`

  - `code: number`

  - `message: string`

  - `type: "http_error"`

    - `"http_error"`

### Realtime Reasoning

- `RealtimeReasoning object { effort }`

  适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

### Realtime Reasoning Effort

- `RealtimeReasoningEffort = "minimal" or "low" or "medium" or 2 more`

  限制支持推理的 Realtime 模型（例如
  `gpt-realtime-2`.

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

### Realtime Response

- `RealtimeResponse object { id, audio, conversation_id, 8 more }`

  响应资源。

  - `id: optional string`

    响应的唯一 ID，格式如下 `resp_1234`.

  - `audio: optional object { output }`

    音频输出的配置。

    - `output: optional object { format, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的声音。一旦模型至少以音频回复过一次，
        会话期间就无法再更改该声音。当前
        可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
        以获得最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少以音频回复过一次，
          会话期间就无法再更改该声音。当前
          可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          以获得最佳质量。

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

  - `conversation_id: optional string`

    响应所添加到的对话，由 `conversation`
    字段中的 `response.create` 事件决定。如果 `auto`，则响应会被添加到
    默认对话中，且 `conversation_id` 的值会是一个类似
    `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使当前没有正在进行的响应， `none`，则响应不会被添加到任何对话中，
    的值 `conversation_id` 将是 `null`。如果响应是由 VAD
    自动触发的，则该响应会被添加到默认对话中

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用），该输入用于本次响应。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    由响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    The set of modalities the model used to respond, currently the only possible values are
    `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
    output to mode `text` will disable audio output from the model.

    - `"text"`

    - `"audio"`

  - `status: optional "completed" or "cancelled" or "failed" or 2 more`

    响应的最终状态（`completed`, `cancelled`, `failed`，或
    `incomplete`, `in_progress`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

    - `"in_progress"`

  - `status_details: optional RealtimeResponseStatus`

    关于该状态的更多详细信息。

    - `error: optional object { code, type }`

      导致响应失败的原因描述，
      在以下情况时填充： `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误的类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      响应未完成的原因。对于一个 `cancelled` 响应，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音起始）或 `client_cancelled` （客户端发送了取消事件）。对于一个  `incomplete` Response,取值之一 `max_output_tokens` 或 `content_filter`  (服务端安全过滤器被触发并截断了 Response)。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致 Response 失败的错误类型,对应
      字段 ( `status` field (`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    Response 的用量统计信息,这将对应计费。一个
    Realtime API 会话将维护一个对话上下文,并将新的
    Items 追加到 Conversation 中,因此先前轮次的输出(文本和
    音频 tokens)将成为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      Response 中输入 tokens 的详细信息。Cached tokens 来自对话中先前轮次、被作为当前 response 上下文包含的 tokens。此处的 cached tokens 计为输入 tokens 的一个子集,这意味着 input tokens 将包含 cached 和 uncached tokens。

      - `audio_tokens: optional number`

        Response 中作为输入使用的音频 token 数。

      - `cached_tokens: optional number`

        Response 中作为输入使用的缓存 token 数。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        关于 Response 中作为输入使用的缓存 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中作为输入使用的缓存音频 token 数。

        - `image_tokens: optional number`

          Response 中作为输入使用的缓存图像 token 数。

        - `text_tokens: optional number`

          Response 中作为输入使用的缓存文本 token 数。

      - `image_tokens: optional number`

        Response 中作为输入使用的图像 token 数。

      - `text_tokens: optional number`

        Response 中作为输入使用的文本 token 数。

    - `input_tokens: optional number`

      Response 中使用的输入 token 数，包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      关于 Response 中使用的输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数，包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中的 token 总数，包括输入和输出
      文本及音频 token。

### Realtime Response Create Audio Output

- `RealtimeResponseCreateAudioOutput object { output }`

  音频输入和输出的配置。

  - `output: optional object { format, voice }`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

      - `PCMAudio object { rate, type }`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `rate: optional 24000`

          音频的采样率。始终为 `24000`.

          - `24000`

        - `type: optional "audio/pcm"`

          音频格式。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `PCMUAudio object { type }`

        G.711 μ-law 格式。

        - `type: optional "audio/pcmu"`

          音频格式。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `PCMAAudio object { type }`

        G.711 A-law 格式。

        - `type: optional "audio/pcma"`

          音频格式。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回复的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
      一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
      在会话过程中就无法再更改声音。
      我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

      - `string`

      - `"alloy" or "ash" or "ballad" or 7 more`

        - `"alloy"`

        - `"ash"`

        - `"ballad"`

        - `"coral"`

        - `"echo"`

        - `"sage"`

        - `"shimmer"`

        - `"verse"`

        - `"marin"`

        - `"cedar"`

      - `ID object { id }`

        自定义语音参考。

        - `id: string`

          自定义语音 ID，例如： `voice_1234`.

### Realtime Response Create Params

- `RealtimeResponseCreateParams object { audio, conversation, input, 9 more }`

  使用这些参数创建一个新的 Realtime response

  - `audio: optional RealtimeResponseCreateAudioOutput`

    音频输入和输出的配置。

    - `output: optional object { format, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回复的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
        一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
        在会话过程中就无法再更改声音。
        我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

        - `ID object { id }`

          自定义语音参考。

          - `id: string`

            自定义语音 ID，例如： `voice_1234`.

  - `conversation: optional string or "auto" or "none"`

    控制 response 添加到哪个对话。目前支持
    `auto` 和 `none`，使用 `auto` 作为默认值。 `auto` 值为 previous_response_id
    意味着响应的内容将被添加到默认的
    对话中。将其设置为 none `none` 以创建一个不会向默认对话添加项目的
    带外响应。

    - `string`

    - `"auto" or "none"`

      控制 response 添加到哪个对话。目前支持
      `auto` 和 `none`，使用 `auto` 作为默认值。 `auto` 值为 previous_response_id
      意味着响应的内容将被添加到默认的
      对话中。将其设置为 none `none` 以创建一个不会向默认对话添加项目的
      带外响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    要包含在模型提示词中的输入项。使用此字段
    会为本次响应创建一个新的上下文，而不是使用默认的
    对话。空数组 [] `[]` 将清除本次响应的上下文。
    注意，其中可以包含对会话中之前出现过的项目的引用，
    通过它们的 id 进行引用。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    在模型调用前默认添加的系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如 "极其简洁"、"表现得友好"、"以下是一些优秀响应的示例"）以及音频行为上（例如 "说话快一点"、"在声音中加入情感"、"经常大笑"）的行为。这些指令不一定会被模型严格遵循，但它们为模型的期望行为提供了指导。
    请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
    数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `output_modalities: optional array of "text" or "audio"`

    The set of modalities the model used to respond, currently the only possible values are
    `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
    output to mode `text` will disable audio output from the model.

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    Whether the model may call multiple tools in parallel. Only supported by
    reasoning Realtime models such as `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    Reference to a prompt template and its variables.
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      The unique identifier of the prompt template to use.

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      Optional map of values to substitute in for variables in your
      prompt. The substitution values can either be strings, or other
      Response input types like images or files.

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        A text input to the model.

        - `text: string`

          The text input to the model.

        - `type: "input_text"`

          The type of the input item. Always `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          The type of the input item. Always `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `image_url: optional string or null`

          发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送到模型的文件输入。

        - `type: "input_file"`

          The type of the input item. Always `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送到模型的文件内容。

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `file_url: optional string`

          发送到模型的文件的 URL。

        - `filename: optional string`

          发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。提供一个字符串模式或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
      更多工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项强制模型调用特定的 function 工具。

      - `name: string`

        要调用的 function 名称。

      - `type: "function"`

        对于 function 调用，type 始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型调用远程 MCP 服务上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务标签。

      - `type: "mcp"`

        对于 MCP 工具，type 始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    可供模型使用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时告诉用户什么的指导
        （如果有）。

      - `name: optional string`

        函数名称。

      - `parameters: optional unknown`

        函数在 JSON Schema 中的参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
        MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 电子邮件： `connector_outlookemail`
        - SharePoint： `connector_sharepoint`

        - `"connector_dropbox"`

        - `"connector_gmail"`

        - `"connector_googlecalendar"`

        - `"connector_googledrive"`

        - `"connector_microsoftteams"`

        - `"connector_outlookcalendar"`

        - `"connector_outlookemail"`

        - `"connector_sharepoint"`

      - `defer_loading: optional boolean`

        此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，也可以是与工具关联的过滤对象
          ，用于需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
        `tunnel_id` 之一，必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

### Realtime Response Status

- `RealtimeResponseStatus object { error, reason, type }`

  关于该状态的更多详细信息。

  - `error: optional object { code, type }`

    导致响应失败的原因描述，
    在以下情况时填充： `status` 为 `failed`.

    - `code: optional string`

      错误代码（如果有）。

    - `type: optional string`

      错误的类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    响应未完成的原因。对于一个 `cancelled` 响应，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音起始）或 `client_cancelled` （客户端发送了取消事件）。对于一个  `incomplete` Response,取值之一 `max_output_tokens` 或 `content_filter`  (服务端安全过滤器被触发并截断了 Response)。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致 Response 失败的错误类型,对应
    字段 ( `status` field (`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime Response Usage

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  Response 的用量统计信息,这将对应计费。一个
  Realtime API 会话将维护一个对话上下文,并将新的
  Items 追加到 Conversation 中,因此先前轮次的输出(文本和
  音频 tokens)将成为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    Response 中输入 tokens 的详细信息。Cached tokens 来自对话中先前轮次、被作为当前 response 上下文包含的 tokens。此处的 cached tokens 计为输入 tokens 的一个子集,这意味着 input tokens 将包含 cached 和 uncached tokens。

    - `audio_tokens: optional number`

      Response 中作为输入使用的音频 token 数。

    - `cached_tokens: optional number`

      Response 中作为输入使用的缓存 token 数。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      关于 Response 中作为输入使用的缓存 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中作为输入使用的缓存音频 token 数。

      - `image_tokens: optional number`

        Response 中作为输入使用的缓存图像 token 数。

      - `text_tokens: optional number`

        Response 中作为输入使用的缓存文本 token 数。

    - `image_tokens: optional number`

      Response 中作为输入使用的图像 token 数。

    - `text_tokens: optional number`

      Response 中作为输入使用的文本 token 数。

  - `input_tokens: optional number`

    Response 中使用的输入 token 数，包括文本和
    音频 token。

  - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

    关于 Response 中使用的输出 token 的详细信息。

    - `audio_tokens: optional number`

      Response 中使用的音频 token 数。

    - `text_tokens: optional number`

      Response 中使用的文本 token 数。

  - `output_tokens: optional number`

    Response 中发送的输出 token 数，包括文本和
    音频 token。

  - `total_tokens: optional number`

    Response 中的 token 总数，包括输入和输出
    文本及音频 token。

### Realtime Response Usage Input Token Details

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  Response 中输入 tokens 的详细信息。Cached tokens 来自对话中先前轮次、被作为当前 response 上下文包含的 tokens。此处的 cached tokens 计为输入 tokens 的一个子集,这意味着 input tokens 将包含 cached 和 uncached tokens。

  - `audio_tokens: optional number`

    Response 中作为输入使用的音频 token 数。

  - `cached_tokens: optional number`

    Response 中作为输入使用的缓存 token 数。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    关于 Response 中作为输入使用的缓存 token 的详细信息。

    - `audio_tokens: optional number`

      Response 中作为输入使用的缓存音频 token 数。

    - `image_tokens: optional number`

      Response 中作为输入使用的缓存图像 token 数。

    - `text_tokens: optional number`

      Response 中作为输入使用的缓存文本 token 数。

  - `image_tokens: optional number`

    Response 中作为输入使用的图像 token 数。

  - `text_tokens: optional number`

    Response 中作为输入使用的文本 token 数。

### Realtime Response Usage Output Token Details

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  关于 Response 中使用的输出 token 的详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数。

### Realtime Server Event

- `RealtimeServerEvent = ConversationCreatedEvent or ConversationItemCreatedEvent or ConversationItemDeletedEvent or 43 more`

  实时服务端事件。

  - `ConversationCreatedEvent object { conversation, event_id, type }`

    在会话创建时返回。在会话创建后立即发出。

    - `conversation: object { id, object }`

      会话资源。

      - `id: optional string`

        会话的唯一 ID。

      - `object: optional string`

        对象类型，必须为 `realtime.conversation`.

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "conversation.created"`

      事件类型，必须为 `conversation.created`.

      - `"conversation.created"`

  - `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

    在创建对话项时返回。产生此事件的情况有多种：

    - 服务器正在生成 Response，如果成功将产生
      一个或两个 Item，其类型为 `message`
      (role `assistant`) 或类型 `function_call`.
    - 输入音频缓冲区已提交，可以由客户端或
      服务器（在 `server_vad` 模式下）提交。服务器将获取
      输入音频缓冲区的内容并将其添加到新的用户消息 Item 中。
    - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
      到对话中。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，表示系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

        Realtime 对话中的用户消息条目。

        - `content: array of object { audio, detail, image_url, 3 more }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一个函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          item 的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一个函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          item 的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所应答审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          item 的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器可用工具的 Realtime 条目。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          item 的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          item 的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          工具调用产生的错误（如果有）。

          - `RealtimeMcpProtocolError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "protocol_error"`

              - `"protocol_error"`

          - `RealtimeMcpToolExecutionError object { message, type }`

            - `message: string`

            - `type: "tool_execution_error"`

              - `"tool_execution_error"`

          - `RealtimeMcphttpError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "http_error"`

              - `"http_error"`

        - `output: optional string or null`

          工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        一个请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          item 的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.created"`

      事件类型，必须为 `conversation.item.created`.

      - `"conversation.item.created"`

    - `previous_item_id: optional string or null`

      对话上下文中前一个项的 ID，可让
      客户端理解对话顺序。可以是 `null` 如果该
      项没有前驱项。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当会话中的某个条目被客户端通过某个事件删除时返回。
    `conversation.item.delete` 事件。该事件用于同步服务端对会话历史的理解与客户端的视图。
    服务端对会话历史的理解与客户端的视图。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      被删除条目的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    该事件是写入
    用户音频缓冲区的音频转写输出。当输入音频缓冲区被
    客户端或服务端（启用 VAD 时）提交时，转写开始。转写与 Response 创建
    异步进行，因此该事件可能早于或晚于
    Response 事件到达。

    Realtime API 模型原生支持音频，因此输入转写是
    在另一个 ASR（自动语音识别）模型上运行的独立过程。
    转写文本可能与模型的解读存在一定差异，
    应作为大致参考。

    - `content_index: number`

      包含音频的内容分块的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      包含正在转写音频的项的 ID。

    - `transcript: string`

      已转写的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      该转写的用量统计，按照 ASR 模型的定价计费，而非 realtime 模型的定价。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 用量计费的模型的用量统计。

        - `input_tokens: number`

          本次请求计费的输入 token 数量。

        - `output_tokens: number`

          已生成的输出 token 数量。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          用量对象的类型。对于此变体始终为 `tokens` 。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          本次请求计费的输入 token 的详细信息。

          - `audio_tokens: optional number`

            本次请求计费的音频 token 数量。

          - `text_tokens: optional number`

            本次请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的用量统计信息。

        - `seconds: number`

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          用量对象的类型。对于此变体始终为 `duration` 。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

      - `code: string`

        在音频中检测到的某种语言的语言代码。

    - `logprobs: optional array of LogProbProperties or null`

      转录结果的对数概率。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

    当输入音频转录内容部分的文本值被更新为增量转录结果时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      包含正在转写音频的项的 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      项目内容数组中内容部分的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。可通过配置会话启用，配置方式为 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应此段转录可能被选中的某个 token 的对数概率。这有助于判断在给定转录片段中是否存在多个有效选项。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    当配置了输入音频转录，且用户消息的转录
    请求失败时返回。这些事件与其他事件分开，以便客户端能够识别相关的 Item。
    `error` 事件以便客户端能够识别相关的 Item。

    - `content_index: number`

      包含音频的内容分块的索引。

    - `error: object { code, message, param, type }`

      转录错误的详细信息。

      - `code: optional string`

        错误代码（如果有）。

      - `message: optional string`

        人类可读的错误消息。

      - `param: optional string`

        与错误相关的参数（如果有）。

      - `type: optional string`

        错误的类型。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      用户消息条目的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    在检索某个会话条目时返回， `conversation.item.retrieve`。这是一种获取服务端对某个条目表示形式的方式，例如用于在噪声抑制和 VAD 之后访问经过后处理的音频数据。它包含该条目的完整内容，包括音频数据。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当较早的助手音频消息项被客户端通过
    事件截断时返回。 `conversation.item.truncate` 事件。此事件用于
    使服务端对音频的理解与客户端的播放保持同步。

    此操作将截断音频并移除服务端的文本转录，
    以确保上下文中没有用户尚未听到的文本。

    - `audio_end_ms: number`

      音频被截断到的时长（毫秒）。

    - `content_index: number`

      被截断的内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      被截断的助手消息项的 ID。

    - `type: "conversation.item.truncated"`

      事件类型，必须为 `conversation.item.truncated`.

      - `"conversation.item.truncated"`

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能是客户端问题或服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认监控并记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误类型（例如 "invalid_request_error"、"server_error"）。

      - `code: optional string or null`

        错误代码（如果有）。

      - `event_id: optional string or null`

        导致该错误的客户端事件的 event_id（如适用）。

      - `param: optional string or null`

        与错误相关的参数（如果有）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `InputAudioBufferClearedEvent object { event_id, type }`

    当输入音频缓冲区由客户端通过以下方式清除时返回：a
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    在输入音频缓冲区被提交时返回，无论是客户端提交还是在服务端 VAD 模式下自动提交。
    event 属性是即将创建的用户消息项的 ID，因此 `item_id` 这是一
    个 conversation.item.created 事件。 `conversation.item.created` event
    也会被发送到客户端。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项将插入到其之后的先前项的 ID。
      可以是 `null` 如果该项没有前驱项。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示电话键盘按键
    （0–9、*、#、A–D）的消息。该 `event` 属性
    是用户按下的键盘按键。该 `received_at` 是服务器接收事件的 UTC Unix 时间戳
    ，即服务器接收到该事件的时间。

    - `event: string`

      用户按下的电话按键。

    - `received_at: number`

      服务器接收 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    在 `server_vad` 模式下由服务端发送，用于指示已在音频缓冲区中检测到语音。只要有音频被添加到缓冲区，就可能发生此情况（除非已检测到语音）。客户端可以使用此事件来中断音频播放或向用户提供视觉反馈。
    检测到语音。只要有音频被添加到
    缓冲区中，就可能发生此情况（除非已检测到语音）。客户端可以使用此事件来中断音频播放或向用户提供视觉反馈。
    中断音频播放或向用户提供视觉反馈。

    客户端应当预期在语音停止时收到一个 `input_audio_buffer.speech_stopped` event
    事件。item_id `item_id` 属性是将在语音停止时创建的用户消息项的 ID，
    该 ID 也会出现在
    `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
    音频缓冲区）。

    - `audio_start_ms: number`

      从会话期间写入缓冲区的所有音频开头起，到首次检测到语音为止所经过的毫秒数。这将对应于发送给模型的音频起始处，因此包含在
      从会话期间写入缓冲区的所有音频开头起，到首次检测到语音为止的毫秒数。该值对应于发送给模型的音频起始处，
      因此包含在会话中配置的
      `prefix_padding_ms` （在 Session 中配置的）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      语音停止时将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    在以下情况下以 `server_vad` 模式返回：服务端检测到音频缓冲区中的语音结束时。服务端还会发送一个
    包含由音频缓冲区生成的用户消息条目的事件。 `conversation.item.created`
    包含由音频缓冲区生成的用户消息条目的事件。

    - `audio_end_ms: number`

      自会话开始起，语音停止时的毫秒数。该值对应于发送给模型的音频结束位置，因此包含
      发送给模型的音频结束位置，因此包含
      `min_silence_duration_ms` （在 Session 中配置的）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示已更新的速率限制。
    在创建 Response 时，会为输出 "预留" 一些 tokens
    tokens，此处显示的速率限制反映了该预留，随后会在
    Response 完成后相应地进行调整。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

      速率限制信息列表。

      - `limit: optional number`

        该速率限制所允许的最大值。

      - `name: optional "requests" or "tokens"`

        速率限制的名称（`requests`, `tokens`).

        - `"requests"`

        - `"tokens"`

      - `remaining: optional number`

        达到限制之前的剩余值。

      - `reset_seconds: optional number`

        速率限制重置前的剩余秒数。

    - `type: "rate_limits.updated"`

      事件类型，必须为 `rate_limits.updated`.

      - `"rate_limits.updated"`

  - `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

    当模型生成的音频更新时返回。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `delta: string`

      Base64 编码的音频数据增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.delta"`

      事件类型，必须为 `response.output_audio.delta`.

      - `"response.output_audio.delta"`

  - `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

    当模型生成的音频完成时返回。在某个 Response
    被中断、未完成或取消时也会发出。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.done"`

      事件类型，必须为 `response.output_audio.done`.

      - `"response.output_audio.done"`

  - `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

    当模型生成的音频输出转写更新时返回。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `delta: string`

      转写文本增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio_transcript.delta"`

      事件类型，必须为 `response.output_audio_transcript.delta`.

      - `"response.output_audio_transcript.delta"`

  - `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

    当模型生成的音频输出转写完成时返回
    流式传输。在某个 Response 被中断、未完成或
    取消时也会发出。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `transcript: string`

      音频的最终转写文本。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    在响应生成过程中，向 assistant 消息条目添加新的内容部分时返回
    。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      被添加内容部分的条目 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `part: object { audio, text, transcript, type }`

      被添加的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（当 type 为 "audio" 时）。

      - `text: optional string`

        文本内容（当 type 为 "text" 时）。

      - `transcript: optional string`

        音频的转录文本（当 type 为 "audio" 时）。

      - `type: optional "audio" or "text"`

        内容类型（"text"、"audio"）。

        - `"audio"`

        - `"text"`

    - `response_id: string`

      响应的 ID。

    - `type: "response.content_part.added"`

      事件类型，必须为 `response.content_part.added`.

      - `"response.content_part.added"`

  - `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

    在助手消息条目中，当某个内容部分完成流式传输时返回。
    在 Response 被中断、未完成或取消时也会发出。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `part: object { audio, text, transcript, type }`

      已完成的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（当 type 为 "audio" 时）。

      - `text: optional string`

        文本内容（当 type 为 "text" 时）。

      - `transcript: optional string`

        音频的转录文本（当 type 为 "audio" 时）。

      - `type: optional "audio" or "text"`

        内容类型（"text"、"audio"）。

        - `"audio"`

        - `"text"`

    - `response_id: string`

      响应的 ID。

    - `type: "response.content_part.done"`

      事件类型，必须为 `response.content_part.done`.

      - `"response.content_part.done"`

  - `ResponseCreatedEvent object { event_id, response, type }`

    在创建新 Response 时返回，即响应创建的首个事件，
    此时响应处于初始状态， `in_progress`.

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

      - `id: optional string`

        响应的唯一 ID，格式如下 `resp_1234`.

      - `audio: optional object { output }`

        音频输出的配置。

        - `output: optional object { format, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

            - `PCMAudio object { rate, type }`

              PCM 音频格式。仅支持 24kHz 采样率。

              - `rate: optional 24000`

                音频的采样率。始终为 `24000`.

                - `24000`

              - `type: optional "audio/pcm"`

                音频格式。始终为 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终为 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终为 `audio/pcma`.

                - `"audio/pcma"`

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少以音频回复过一次，
              会话期间就无法再更改该声音。当前
              可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
              以获得最佳质量。

              - `"alloy"`

              - `"ash"`

              - `"ballad"`

              - `"coral"`

              - `"echo"`

              - `"sage"`

              - `"shimmer"`

              - `"verse"`

              - `"marin"`

              - `"cedar"`

      - `conversation_id: optional string`

        响应所添加到的对话，由 `conversation`
        字段中的 `response.create` 事件决定。如果 `auto`，则响应会被添加到
        默认对话中，且 `conversation_id` 的值会是一个类似
        `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使当前没有正在进行的响应， `none`，则响应不会被添加到任何对话中，
        的值 `conversation_id` 将是 `null`。如果响应是由 VAD
        自动触发的，则该响应会被添加到默认对话中

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用），该输入用于本次响应。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard.

        Keys are strings with a maximum length of 64 characters. Values are strings
        with a maximum length of 512 characters.

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        由响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一个函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一个函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          列出 MCP 服务器可用工具的 Realtime 条目。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          一个请求人工批准工具调用的 Realtime item。

      - `output_modalities: optional array of "text" or "audio"`

        The set of modalities the model used to respond, currently the only possible values are
        `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
        output to mode `text` will disable audio output from the model.

        - `"text"`

        - `"audio"`

      - `status: optional "completed" or "cancelled" or "failed" or 2 more`

        响应的最终状态（`completed`, `cancelled`, `failed`，或
        `incomplete`, `in_progress`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

        - `"in_progress"`

      - `status_details: optional RealtimeResponseStatus`

        关于该状态的更多详细信息。

        - `error: optional object { code, type }`

          导致响应失败的原因描述，
          在以下情况时填充： `status` 为 `failed`.

          - `code: optional string`

            错误代码（如果有）。

          - `type: optional string`

            错误的类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          响应未完成的原因。对于一个 `cancelled` 响应，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音起始）或 `client_cancelled` （客户端发送了取消事件）。对于一个  `incomplete` Response,取值之一 `max_output_tokens` 或 `content_filter`  (服务端安全过滤器被触发并截断了 Response)。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致 Response 失败的错误类型,对应
          字段 ( `status` field (`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        Response 的用量统计信息,这将对应计费。一个
        Realtime API 会话将维护一个对话上下文,并将新的
        Items 追加到 Conversation 中,因此先前轮次的输出(文本和
        音频 tokens)将成为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          Response 中输入 tokens 的详细信息。Cached tokens 来自对话中先前轮次、被作为当前 response 上下文包含的 tokens。此处的 cached tokens 计为输入 tokens 的一个子集,这意味着 input tokens 将包含 cached 和 uncached tokens。

          - `audio_tokens: optional number`

            Response 中作为输入使用的音频 token 数。

          - `cached_tokens: optional number`

            Response 中作为输入使用的缓存 token 数。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            关于 Response 中作为输入使用的缓存 token 的详细信息。

            - `audio_tokens: optional number`

              Response 中作为输入使用的缓存音频 token 数。

            - `image_tokens: optional number`

              Response 中作为输入使用的缓存图像 token 数。

            - `text_tokens: optional number`

              Response 中作为输入使用的缓存文本 token 数。

          - `image_tokens: optional number`

            Response 中作为输入使用的图像 token 数。

          - `text_tokens: optional number`

            Response 中作为输入使用的文本 token 数。

        - `input_tokens: optional number`

          Response 中使用的输入 token 数，包括文本和
          音频 token。

        - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

          关于 Response 中使用的输出 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中使用的音频 token 数。

          - `text_tokens: optional number`

            Response 中使用的文本 token 数。

        - `output_tokens: optional number`

          Response 中发送的输出 token 数，包括文本和
          音频 token。

        - `total_tokens: optional number`

          Response 中的 token 总数，包括输入和输出
          文本及音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    在 Response 完成流式传输时返回。无论最终状态如何，
    final state。事件中包含的 Response 对象会附带所有输出条目 `response.done` ，但会缺少原始音频数据。
    客户端应检查 Response 的。

    字段以判断该请求是否成功 `status` ，或是否出现了其他结果：
    (`completed`）或者是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

    响应将包含在响应过程中生成的所有输出项，但不包括
    任何音频内容。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

    - `type: "response.done"`

      事件类型，必须为 `response.done`.

      - `"response.done"`

  - `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

    当模型生成的函数调用参数被更新时返回。

    - `call_id: string`

      函数调用的 ID。

    - `delta: string`

      以 JSON 字符串表示的参数增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.function_call_arguments.delta"`

      事件类型，必须为 `response.function_call_arguments.delta`.

      - `"response.function_call_arguments.delta"`

  - `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

    当模型生成的函数调用参数流式传输完成时返回。
    在 Response 被中断、未完成或取消时也会发出。

    - `arguments: string`

      最终参数，以 JSON 字符串形式提供。

    - `call_id: string`

      函数调用的 ID。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `name: string`

      被调用函数的名称。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.function_call_arguments.done"`

      事件类型，必须为 `response.function_call_arguments.done`.

      - `"response.function_call_arguments.done"`

  - `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

    在 Response 生成过程中创建新 Item 时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

    - `output_index: number`

      该输出项在 Response 中的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

    - `type: "response.output_item.added"`

      事件类型，必须为 `response.output_item.added`.

      - `"response.output_item.added"`

  - `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

    当 Item 完成流式传输时返回。在 Response 被
    中断、未完成或取消时也会发出。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

    - `output_index: number`

      该输出项在 Response 中的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

    - `type: "response.output_item.done"`

      事件类型，必须为 `response.output_item.done`.

      - `"response.output_item.done"`

  - `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

    当 "output_text" 内容部分的文本值更新时返回。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `delta: string`

      文本增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_text.delta"`

      事件类型，必须为 `response.output_text.delta`.

      - `"response.output_text.delta"`

  - `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

    当 "output_text" 内容部分的文本值流式传输完成时返回。在
    Response 被中断、未完成或取消时也会发出。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `text: string`

      最终的文本内容。

    - `type: "response.output_text.done"`

      事件类型，必须为 `response.output_text.done`.

      - `"response.output_text.done"`

  - `SessionCreatedEvent object { event_id, session, type }`

    在创建 Session 时返回。作为第一个服务端事件，在建立新
    连接时自动发出。该事件将包含
    默认的 Session 配置。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        Realtime 会话配置对象。

        - `id: string`

          会话的唯一标识符，形如 `sess_1234567890abcdef`.

        - `object: "realtime.session"`

          对象类型。始终为 `realtime.session`.

          - `"realtime.session"`

        - `type: "realtime"`

          要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
              对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }`

              输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                为输入音频转录配置的提示（如果存在）。

            - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

              轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

              语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。这在
                  用户长时间停顿属于意外情况的场景下非常有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话，
                  基于当前上下文进行。

                  该超时值将在上一个模型响应的音频播放完成后生效，
                  即它被设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  关联到 Response）会在达到超时时被发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当发生 VAD start 事件时，是否自动中断（取消）向默认
                  会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                  500ms。值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插入。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                  高的阈值会要求更大的音量才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当发生 VAD stop 事件时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                  会话（即。 `conversation` 的 `auto`)。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应的速度，以原始速度的倍数表示。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

              该参数是在音频生成之后对音频进行的后处理调整，也
              可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少以音频回复过一次，
              会话期间就无法再更改该声音。当前
              可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
              以获得最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复的声音。一旦模型至少以音频回复过一次，
                会话期间就无法再更改该声音。当前
                可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
                以获得最佳质量。

                - `"alloy"`

                - `"ash"`

                - `"ballad"`

                - `"coral"`

                - `"echo"`

                - `"sage"`

                - `"shimmer"`

                - `"verse"`

                - `"marin"`

                - `"cedar"`

        - `expires_at: optional number`

          会话的过期时间戳，以自纪元起的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的附加字段。

          `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

          请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。请提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
          数。默认为 `inf`.

          - `number`

          - `"inf"`

            - `"inf"`

        - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的 Realtime 模型。

          - `string`

          - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

            此会话使用的 Realtime 模型。

            - `"gpt-realtime"`

            - `"gpt-realtime-1.5"`

            - `"gpt-realtime-2"`

            - `"gpt-realtime-2.1"`

            - `"gpt-realtime-2.1-mini"`

            - `"gpt-realtime-2025-08-28"`

            - `"gpt-4o-realtime-preview"`

            - `"gpt-4o-realtime-preview-2024-10-01"`

            - `"gpt-4o-realtime-preview-2024-12-17"`

            - `"gpt-4o-realtime-preview-2025-06-03"`

            - `"gpt-4o-mini-realtime-preview"`

            - `"gpt-4o-mini-realtime-preview-2024-12-17"`

            - `"gpt-realtime-mini"`

            - `"gpt-realtime-mini-2025-10-06"`

            - `"gpt-realtime-mini-2025-12-15"`

            - `"gpt-audio-1.5"`

            - `"gpt-audio-mini"`

            - `"gpt-audio-mini-2025-10-06"`

            - `"gpt-audio-mini-2025-12-15"`

        - `output_modalities: optional array of "text" or "audio"`

          模型可以响应的模态集合。默认为 `["audio"]`，表示
          模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
          模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          Reference to a prompt template and its variables.
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

          - `id: string`

            The unique identifier of the prompt template to use.

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            Optional map of values to substitute in for variables in your
            prompt. The substitution values can either be strings, or other
            Response input types like images or files.

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

              - `text: string`

                The text input to the model.

              - `type: "input_text"`

                The type of the input item. Always `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

              - `detail: ImageDetail`

                发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                The type of the input item. Always `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                发送到模型的文件 ID。

              - `image_url: optional string or null`

                发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送到模型的文件输入。

              - `type: "input_file"`

                The type of the input item. Always `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                发送到模型的文件内容。

              - `file_id: optional string or null`

                发送到模型的文件 ID。

              - `file_url: optional string`

                发送到模型的文件的 URL。

              - `filename: optional string`

                发送到模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

          - `version: optional string or null`

            可选的提示模板版本。

        - `reasoning: optional RealtimeReasoning`

          适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

          - `effort: optional RealtimeReasoningEffort`

            限制支持推理的 Realtime 模型（例如
            `gpt-realtime-2`.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

        - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

          模型选择工具的方式。提供一个字符串模式或强制使用特定的
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪些工具（如果有）。

            `none` 表示模型将不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
            更多工具。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项强制模型调用特定的 function 工具。

            - `name: string`

              要调用的 function 名称。

            - `type: "function"`

              对于 function 调用，type 始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项强制模型调用远程 MCP 服务上的特定工具。

            - `server_label: string`

              要使用的 MCP 服务标签。

            - `type: "mcp"`

              对于 MCP 工具，type 始终为 `mcp`.

              - `"mcp"`

            - `name: optional string or null`

              要在服务上调用的工具名称。

        - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

          可供模型使用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

            - `description: optional string`

              函数的描述，包括关于何时以及如何
              调用它的指导，以及关于调用时告诉用户什么的指导
              （如果有）。

            - `name: optional string`

              函数名称。

            - `parameters: optional unknown`

              函数在 JSON Schema 中的参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
              MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
              使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
              通过安全 MCP 隧道进行连接。

              当前支持的 `connector_id` 值包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google 日历： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook 日历： `connector_outlookcalendar`
              - Outlook 电子邮件： `connector_outlookemail`
              - SharePoint： `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，也可以是与工具关联的过滤对象
                ，用于需要审批的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
              `tunnel_id` 之一，必须提供其中一个。

            - `tunnel_id: optional string`

              要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
          为某个会话启用追踪 后，配置便无法修改。

          `auto` 将为该会话创建一个追踪，并使用默认值设置
          工作流 名称、group id 和 metadata。

          - `Auto = "auto"`

            启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            针对 追踪 的细粒度配置。

            - `group_id: optional string`

              附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
              筛选。

            - `workflow_name: optional string`

              附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
              在追踪仪表板中为该追踪 命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

          客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

          截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

          截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

            - `retention_ratio: number`

              指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

              - `post_instructions: optional number`

                指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        Realtime 转录会话配置对象。

        - `id: string`

          会话的唯一标识符，形如 `sess_1234567890abcdef`.

        - `object: string`

          对象类型。始终为 `realtime.transcription_session`.

        - `type: "transcription"`

          会话的类型。始终为 `transcription` 用于转写会话。

          - `"transcription"`

        - `audio: optional object { input }`

          会话的输入音频配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪配置。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }`

              转录模型的配置。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                为输入音频转录配置的提示（如果存在）。

            - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

              轮次检测配置。可设置为 `null` 以关闭。服务端
              VAD 表示模型将根据
              音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                检测语音停止的静音持续时间（以毫秒为单位）。默认
                500ms。值越小，模型响应越快，
                但可能会在用户短暂的停顿时插入。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                高的阈值会要求更大的音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

              - `type: optional string`

                轮次检测类型，仅 `server_vad` 是目前受支持的。

        - `expires_at: optional number`

          会话的过期时间戳，以自纪元起的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的附加字段。

          - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话通过以下事件更新时返回： `session.update` 事件，除非
    出现错误。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        Realtime 会话配置对象。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        Realtime 转录会话配置对象。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `OutputAudioBufferStarted object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端开始向客户端流式传输音频时发出。此事件在
    已添加音频内容部分之后发出（`response.content_part.added`)
    添加到响应中）。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端上的输出音频缓冲区已完全清空时发出，
    并且不会再有音频发出。此事件在完整的响应
    数据已发送到客户端之后发出（`response.done`).
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被清空时发出。这可能发生在 VAD
    模式下用户中断时（`input_audio_buffer.speech_started`),
    ），或者客户端发出 `output_audio_buffer.clear` 事件以手动
    截断当前音频响应。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务器事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当 Item 被添加到默认会话时由服务端发送。可能在以下几种情况下发生：

    - 当客户端发送 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。这种情况下，该 Item 将是一条包含缓冲区中音频的用户消息。
    - 当模型正在生成 Response 时。这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时还不会有任何内容（且 `status` 将是 `in_progress`).

    该事件将包含 Item 的全部内容（模型正在生成 Response 的情况除外），但音频数据除外，音频数据可在需要时通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      位于此项之前的项的 ID（如果有）。这用于
      在插入项时保持顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    当对话项被定稿时返回。

    该事件将包含该 Item 的完整内容，但音频数据除外，音频数据可以单独通过以下方式检索： `conversation.item.retrieve` 事件（如有需要）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 会话中的单个 item。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      位于此项之前的项的 ID（如果有）。这用于
      在插入项时保持顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    在输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话的
    设置中 `idle_timeout_ms` 进行配置，表示在配置的持续时间内未检测到任何语音。 `turn_detection` 设置中配置，表示在配置的
    持续时间内未检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段表示从写入输入音频缓冲区的音频开头算起，
    从最后一个模型响应到触发时间之间的音频片段偏移量。这意味着它划分了处于静默状态的
    音频片段，其起始值与结束值之差大致等于所配置的超时时长。
    音频片段，其起始值与结束值之差大致等于所配置的超时时长。

    这段空音频将作为 `input_audio` 项提交到对话中（将产生一个
    `input_audio_buffer.committed` 事件），并生成模型响应。模型仍可能检测到未触发 VAD 的语音，因此模型可能会根据对话内容作出相关回复，或提示用户继续说话。
    事件），并生成模型响应。模型仍可能检测到未触发 VAD 的语音，因此模型可能
    会给出与对话相关的内容，或提示用户继续说话。

    - `audio_end_ms: number`

      触发超时时，已写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      位于上一个模型响应播放时间之后、已写入输入音频缓冲区的音频的毫秒偏移量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      与此音频片段关联的项的 ID。

    - `type: "input_audio_buffer.timeout_triggered"`

      事件类型，必须为 `input_audio_buffer.timeout_triggered`.

      - `"input_audio_buffer.timeout_triggered"`

  - `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

    在为某个 item 识别出输入音频转写片段时返回。

    - `id: string`

      片段标识符。

    - `content_index: number`

      该 item 中输入音频内容部分的索引。

    - `end: number`

      片段的结束时间（秒）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      包含输入音频内容的 item 的 ID。

    - `speaker: string`

      为该片段检测到的说话人标签。

    - `start: number`

      片段的开始时间（秒）。

    - `text: string`

      该片段的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    当某条目的 MCP 工具列举正在进行时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP list tools 条目的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    当列出 MCP 工具针对某个条目完成时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP list tools 条目的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    当某个条目的 MCP 工具列表获取失败时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP list tools 条目的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    在响应生成期间，当 MCP 工具调用参数被更新时返回。

    - `delta: string`

      以 JSON 编码的参数增量。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.mcp_call_arguments.delta"`

      事件类型，必须为 `response.mcp_call_arguments.delta`.

      - `"response.mcp_call_arguments.delta"`

    - `obfuscation: optional string or null`

      如果存在,表示增量文本经过混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成过程中，MCP 工具调用参数最终确定时返回。

    - `arguments: string`

      最终的 JSON 编码参数字符串。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.mcp_call_arguments.done"`

      事件类型，必须为 `response.mcp_call_arguments.done`.

      - `"response.mcp_call_arguments.done"`

  - `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

    MCP 工具调用已开始且正在进行时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `type: "response.mcp_call.in_progress"`

      事件类型，必须为 `response.mcp_call.in_progress`.

      - `"response.mcp_call.in_progress"`

  - `ResponseMcpCallCompleted object { event_id, item_id, output_index, type }`

    MCP 工具调用已成功完成时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `type: "response.mcp_call.completed"`

      事件类型，必须为 `response.mcp_call.completed`.

      - `"response.mcp_call.completed"`

  - `ResponseMcpCallFailed object { event_id, item_id, output_index, type }`

    MCP 工具调用失败时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `type: "response.mcp_call.failed"`

      事件类型，必须为 `response.mcp_call.failed`.

      - `"response.mcp_call.failed"`

### Realtime Session

- `RealtimeSession object { id, expires_at, include, 17 more }`

  用于 beta 接口的 Realtime 会话对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的附加字段。

    - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`,输入音频必须为 16 位 PCM,采样率 24kHz,
    单声道(mono),且采用小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
    对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      为输入音频转录配置的提示（如果存在）。

  - `instructions: optional string`

    默认的系统指令(即系统消息),会被前置到模型
    调用之前。该字段允许客户端引导模型给出期望的
    响应。可以指示模型在响应内容和格式上如何输出,
    (例如 "保持极其简洁","表现得友好","以下是一些较好的
    响应示例"),以及在音频行为上如何表现(例如 "语速快一些",
    "在声音中注入情感",""经常笑一下")。这些指令并不会
    被模型严格遵循,但它们为模型期望的行为提供了引导。
    为模型在期望行为上提供指导。

    请注意,服务端会设置默认指令,当该字段
    未设置时将使用这些默认指令,并且可以在 `session.created` 事件中看到,位于
    会话开始时。

  - `max_response_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
    数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2025-08-28" or 13 more`

    此会话使用的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2025-08-28" or 13 more`

      此会话使用的 Realtime 模型。

      - `"gpt-realtime"`

      - `"gpt-realtime-1.5"`

      - `"gpt-realtime-2025-08-28"`

      - `"gpt-4o-realtime-preview"`

      - `"gpt-4o-realtime-preview-2024-10-01"`

      - `"gpt-4o-realtime-preview-2024-12-17"`

      - `"gpt-4o-realtime-preview-2025-06-03"`

      - `"gpt-4o-mini-realtime-preview"`

      - `"gpt-4o-mini-realtime-preview-2024-12-17"`

      - `"gpt-realtime-mini"`

      - `"gpt-realtime-mini-2025-10-06"`

      - `"gpt-realtime-mini-2025-12-15"`

      - `"gpt-audio-1.5"`

      - `"gpt-audio-mini"`

      - `"gpt-audio-mini-2025-10-06"`

      - `"gpt-audio-mini-2025-12-15"`

  - `object: optional "realtime.session"`

    对象类型。始终为 `realtime.session`.

    - `"realtime.session"`

  - `output_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输出音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`,输出音频的采样率为 24kHz。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    Reference to a prompt template and its variables.
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      The unique identifier of the prompt template to use.

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      Optional map of values to substitute in for variables in your
      prompt. The substitution values can either be strings, or other
      Response input types like images or files.

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        A text input to the model.

        - `text: string`

          The text input to the model.

        - `type: "input_text"`

          The type of the input item. Always `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          The type of the input item. Always `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `image_url: optional string or null`

          发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送到模型的文件输入。

        - `type: "input_file"`

          The type of the input item. Always `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送到模型的文件内容。

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `file_url: optional string`

          发送到模型的文件的 URL。

        - `filename: optional string`

          发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `speed: optional number`

    模型语音回复的速度。1.0 为默认速度。0.25 为
    最低速度。1.5 为最高速度。此值只能在模型轮次之间更
    改，不能在响应进行中更改。

  - `temperature: optional number`

    模型的采样温度，限制为 [0.6, 1.2]。对于音频模型，强烈建议使用 0.8 的温度以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时告诉用户什么的指导
      （如果有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      函数在 JSON Schema 中的参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    用于追踪的配置选项。设置为 null 可禁用追踪。一旦
    为某个会话启用追踪 后，配置便无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值设置
    工作流 名称、group id 和 metadata。

    - `"auto"`

      该会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      针对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
        在追踪仪表板中进行筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
        在追踪仪表板中为该追踪命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

    语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。这在
        用户长时间停顿属于意外情况的场景下非常有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话，
        基于当前上下文进行。

        该超时值将在上一个模型响应的音频播放完成后生效，
        即它被设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        关联到 Response）会在达到超时时被发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当发生 VAD start 事件时，是否自动中断（取消）向默认
        会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
        500ms。值越小，模型响应越快，
        但可能会在用户短暂的停顿时插入。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
        高的阈值会要求更大的音量才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当发生 VAD stop 事件时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
        会话（即。 `conversation` 的 `auto`)。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复的声音。一旦模型至少以音频回复过一次，
    会话期间就无法再更改该声音。当前
    可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复的声音。一旦模型至少以音频回复过一次，
      会话期间就无法再更改该声音。当前
      可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
      `shimmer`，以及 `verse`.

      - `"alloy"`

      - `"ash"`

      - `"ballad"`

      - `"coral"`

      - `"echo"`

      - `"sage"`

      - `"shimmer"`

      - `"verse"`

      - `"marin"`

      - `"cedar"`

### Realtime Session Create Request

- `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

  Realtime 会话对象配置。

  - `type: "realtime"`

    要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

    - `"realtime"`

  - `audio: optional RealtimeAudioConfig`

    输入和输出音频的配置。

    - `input: optional RealtimeAudioConfigInput`

      - `format: optional RealtimeAudioFormats`

        输入音频的格式。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪的配置。可设置为 `null` 以关闭。
        降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转录文本之前等待的时间。
          较高的值可以提高转录准确率，但会增加延迟。
          仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。使用
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          可以提高准确率并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续先前音频的可选文本
          片段。
          对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
          Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

        语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。这在
            用户长时间停顿属于意外情况的场景下非常有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话，
            基于当前上下文进行。

            该超时值将在上一个模型响应的音频播放完成后生效，
            即它被设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            关联到 Response）会在达到超时时被发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当发生 VAD start 事件时，是否自动中断（取消）向默认
            会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。值越小，模型响应越快，
            但可能会在用户短暂的停顿时插入。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
            高的阈值会要求更大的音量才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当发生 VAD stop 事件时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
            会话（即。 `conversation` 的 `auto`)。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应的速度，以原始速度的倍数表示。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

        该参数是在音频生成之后对音频进行的后处理调整，也
        可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回复的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
        一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
        在会话过程中就无法再更改声音。
        我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

        - `ID object { id }`

          自定义语音参考。

          - `id: string`

            自定义语音 ID，例如： `voice_1234`.

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的附加字段。

    `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

    请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
    数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    此会话使用的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的 Realtime 模型。

      - `"gpt-realtime"`

      - `"gpt-realtime-1.5"`

      - `"gpt-realtime-2"`

      - `"gpt-realtime-2.1"`

      - `"gpt-realtime-2.1-mini"`

      - `"gpt-realtime-2025-08-28"`

      - `"gpt-4o-realtime-preview"`

      - `"gpt-4o-realtime-preview-2024-10-01"`

      - `"gpt-4o-realtime-preview-2024-12-17"`

      - `"gpt-4o-realtime-preview-2025-06-03"`

      - `"gpt-4o-mini-realtime-preview"`

      - `"gpt-4o-mini-realtime-preview-2024-12-17"`

      - `"gpt-realtime-mini"`

      - `"gpt-realtime-mini-2025-10-06"`

      - `"gpt-realtime-mini-2025-12-15"`

      - `"gpt-audio-1.5"`

      - `"gpt-audio-mini"`

      - `"gpt-audio-mini-2025-10-06"`

      - `"gpt-audio-mini-2025-12-15"`

  - `output_modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。默认为 `["audio"]`，表示
    模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
    模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    Whether the model may call multiple tools in parallel. Only supported by
    reasoning Realtime models such as `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    Reference to a prompt template and its variables.
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      The unique identifier of the prompt template to use.

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      Optional map of values to substitute in for variables in your
      prompt. The substitution values can either be strings, or other
      Response input types like images or files.

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        A text input to the model.

        - `text: string`

          The text input to the model.

        - `type: "input_text"`

          The type of the input item. Always `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          The type of the input item. Always `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `image_url: optional string or null`

          发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送到模型的文件输入。

        - `type: "input_file"`

          The type of the input item. Always `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送到模型的文件内容。

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `file_url: optional string`

          发送到模型的文件的 URL。

        - `filename: optional string`

          发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional RealtimeToolChoiceConfig`

    模型选择工具的方式。提供一个字符串模式或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
      更多工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项强制模型调用特定的 function 工具。

      - `name: string`

        要调用的 function 名称。

      - `type: "function"`

        对于 function 调用，type 始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型调用远程 MCP 服务上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务标签。

      - `type: "mcp"`

        对于 MCP 工具，type 始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务上调用的工具名称。

  - `tools: optional RealtimeToolsConfig`

    可供模型使用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时告诉用户什么的指导
        （如果有）。

      - `name: optional string`

        函数名称。

      - `parameters: optional unknown`

        函数在 JSON Schema 中的参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
        MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 电子邮件： `connector_outlookemail`
        - SharePoint： `connector_sharepoint`

        - `"connector_dropbox"`

        - `"connector_gmail"`

        - `"connector_googlecalendar"`

        - `"connector_googledrive"`

        - `"connector_microsoftteams"`

        - `"connector_outlookcalendar"`

        - `"connector_outlookemail"`

        - `"connector_sharepoint"`

      - `defer_loading: optional boolean`

        此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，也可以是与工具关联的过滤对象
          ，用于需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
        `tunnel_id` 之一，必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
    为某个会话启用追踪 后，配置便无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值设置
    工作流 名称、group id 和 metadata。

    - `Auto = "auto"`

      启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      针对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
        筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
        在追踪仪表板中为该追踪 命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

    截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

    截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

      - `retention_ratio: number`

        指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

        - `post_instructions: optional number`

          指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型选择工具的方式。提供一个字符串模式或强制使用特定的
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
    更多工具。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项强制模型调用特定的 function 工具。

    - `name: string`

      要调用的 function 名称。

    - `type: "function"`

      对于 function 调用，type 始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项强制模型调用远程 MCP 服务上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务标签。

    - `type: "mcp"`

      对于 MCP 工具，type 始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务上调用的工具名称。

### Realtime Tools Config

- `RealtimeToolsConfig = array of RealtimeToolsConfigUnion`

  可供模型使用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时告诉用户什么的指导
      （如果有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      函数在 JSON Schema 中的参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
      MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
      使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 值包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook 日历： `connector_outlookcalendar`
      - Outlook 电子邮件： `connector_outlookemail`
      - SharePoint： `connector_sharepoint`

      - `"connector_dropbox"`

      - `"connector_gmail"`

      - `"connector_googlecalendar"`

      - `"connector_googledrive"`

      - `"connector_microsoftteams"`

      - `"connector_outlookcalendar"`

      - `"connector_outlookemail"`

      - `"connector_sharepoint"`

    - `defer_loading: optional boolean`

      此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的过滤对象
        ，用于需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
      `tunnel_id` 之一，必须提供其中一个。

    - `tunnel_id: optional string`

      要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol
  (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时告诉用户什么的指导
      （如果有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      函数在 JSON Schema 中的参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
      MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
      使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 值包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook 日历： `connector_outlookcalendar`
      - Outlook 电子邮件： `connector_outlookemail`
      - SharePoint： `connector_sharepoint`

      - `"connector_dropbox"`

      - `"connector_gmail"`

      - `"connector_googlecalendar"`

      - `"connector_googledrive"`

      - `"connector_microsoftteams"`

      - `"connector_outlookcalendar"`

      - `"connector_outlookemail"`

      - `"connector_sharepoint"`

    - `defer_loading: optional boolean`

      此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的过滤对象
        ，用于需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
      `tunnel_id` 之一，必须提供其中一个。

    - `tunnel_id: optional string`

      要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

### Realtime 追踪配置

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
  为某个会话启用追踪 后，配置便无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值设置
  工作流 名称、group id 和 metadata。

  - `Auto = "auto"`

    启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    针对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
      筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
      在追踪仪表板中为该追踪 命名。

### Realtime Transcription Session Audio

- `RealtimeTranscriptionSessionAudio object { input }`

  输入和输出音频的配置。

  - `input: optional RealtimeTranscriptionSessionAudioInput`

    - `format: optional RealtimeAudioFormats`

      PCM 音频格式。仅支持 24kHz 采样率。

      - `PCMAudio object { rate, type }`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `rate: optional 24000`

          音频的采样率。始终为 `24000`.

          - `24000`

        - `type: optional "audio/pcm"`

          音频格式。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `PCMUAudio object { type }`

        G.711 μ-law 格式。

        - `type: optional "audio/pcmu"`

          音频格式。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `PCMAAudio object { type }`

        G.711 A-law 格式。

        - `type: optional "audio/pcma"`

          音频格式。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可以提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频的可选文本
        片段。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。这在
          用户长时间停顿属于意外情况的场景下非常有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文进行。

          该超时值将在上一个模型响应的音频播放完成后生效，
          即它被设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          关联到 Response）会在达到超时时被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当发生 VAD start 事件时，是否自动中断（取消）向默认
          会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。值越小，模型响应越快，
          但可能会在用户短暂的停顿时插入。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
          高的阈值会要求更大的音量才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当发生 VAD stop 事件时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
          会话（即。 `conversation` 的 `auto`)。

### Realtime Transcription Session Audio Input

- `RealtimeTranscriptionSessionAudioInput object { format, noise_reduction, transcription, turn_detection }`

  - `format: optional RealtimeAudioFormats`

    PCM 音频格式。仅支持 24kHz 采样率。

    - `PCMAudio object { rate, type }`

      PCM 音频格式。仅支持 24kHz 采样率。

      - `rate: optional 24000`

        音频的采样率。始终为 `24000`.

        - `24000`

      - `type: optional "audio/pcm"`

        音频格式。始终为 `audio/pcm`.

        - `"audio/pcm"`

    - `PCMUAudio object { type }`

      G.711 μ-law 格式。

      - `type: optional "audio/pcmu"`

        音频格式。始终为 `audio/pcmu`.

        - `"audio/pcmu"`

    - `PCMAAudio object { type }`

      G.711 A-law 格式。

      - `type: optional "audio/pcma"`

        音频格式。始终为 `audio/pcma`.

        - `"audio/pcma"`

  - `noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
    对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转录文本之前等待的时间。
      较高的值可以提高转录准确率，但会增加延迟。
      仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。使用
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      可以提高准确率并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续先前音频的可选文本
      片段。
      对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
      Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

    语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。这在
        用户长时间停顿属于意外情况的场景下非常有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话，
        基于当前上下文进行。

        该超时值将在上一个模型响应的音频播放完成后生效，
        即它被设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        关联到 Response）会在达到超时时被发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当发生 VAD start 事件时，是否自动中断（取消）向默认
        会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
        500ms。值越小，模型响应越快，
        但可能会在用户短暂的停顿时插入。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
        高的阈值会要求更大的音量才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当发生 VAD stop 事件时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
        会话（即。 `conversation` 的 `auto`)。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超过该时间后将自动触发模型响应。这在
      用户长时间停顿属于意外情况的场景下非常有用，例如电话
      通话。模型将根据当前上下文有效地提示用户继续对话，
      基于当前上下文进行。

      该超时值将在上一个模型响应的音频播放完成后生效，
      即它被设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
      关联到 Response）会在达到超时时被发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当发生 VAD start 事件时，是否自动中断（取消）向默认
      会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
      500ms。值越小，模型响应越快，
      但可能会在用户短暂的停顿时插入。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
      高的阈值会要求更大的音量才能激活模型，
      因此在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当发生 VAD stop 事件时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
      会话（即。 `conversation` 的 `auto`)。

### Realtime Transcription Session Create Request

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转写会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。对于 Realtime API，始终为 `transcription` 用于转写会话。

    - `"transcription"`

  - `audio: optional RealtimeTranscriptionSessionAudio`

    输入和输出音频的配置。

    - `input: optional RealtimeTranscriptionSessionAudioInput`

      - `format: optional RealtimeAudioFormats`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪的配置。可设置为 `null` 以关闭。
        降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转录文本之前等待的时间。
          较高的值可以提高转录准确率，但会增加延迟。
          仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。使用
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          可以提高准确率并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续先前音频的可选文本
          片段。
          对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
          Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

        语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。这在
            用户长时间停顿属于意外情况的场景下非常有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话，
            基于当前上下文进行。

            该超时值将在上一个模型响应的音频播放完成后生效，
            即它被设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            关联到 Response）会在达到超时时被发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当发生 VAD start 事件时，是否自动中断（取消）向默认
            会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。值越小，模型响应越快，
            但可能会在用户短暂的停顿时插入。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
            高的阈值会要求更大的音量才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当发生 VAD stop 事件时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
            会话（即。 `conversation` 的 `auto`)。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的附加字段。

    `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  Realtime 翻译客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。翻译
    会话支持对以下字段的更新： `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 字段在创建时设置，无法通过
      此事件进行更改。 `session.update`.

      - `audio: optional object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 以禁用它。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍然从
            输入音频流中运行。

            - `model: string`

              用于源转录增量文本的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量文本的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端原始音频字节。不受支持的 websocket 音频格式会返回
    验证错误，因为较低质量的音频会显著降低翻译
    质量。

    翻译使用 200 ms 引擎帧。为获得最佳实时行为，请追加
    以 200 毫秒的音频块发送。如果某个块较短，服务端会将其缓冲，直到凑够一帧所需的音频量。
    如果某个块较长，服务端会将其拆分为 200 毫秒的帧，并按顺序入队。
    帧并按顺序入队。

    在会话处于活跃状态时持续追加静音。如果客户端停止发送音频后稍后恢复，模型会将恢复后的音频视为与先前音频连续，
    音频视为与先前音频连续，而不是视为现实世界中的停顿。
    而不是视为现实世界中的停顿。

    - `audio: string`

      Base64 编码的 24 kHz PCM16 单声道音频字节。

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    正常关闭实时翻译会话。服务端会在关闭前刷新待处理的
    输入音频，并输出所有剩余的翻译结果，然后关闭
    会话。

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话持续流式传入源音频，
    并持续流式输出翻译后的音频以及转录文本增量。

    - `model: string`

      此会话使用的 Realtime 翻译模型。

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用它。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流中运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥过期配置。过期时间指的是在此之后
    客户端密钥将无法再用于创建会话的时点。会话本身在开始后
    可以延续到该时间之后继续运行。一个密钥在过期之前可用于创建多个会话，
    直到其过期为止。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点，即 `seconds` 将被加到客户端密钥的 `created_at` 时间上以生成过期时间戳。仅 `created_at` 是目前受支持的。

      - `"created_at"`

    - `seconds: optional number`

      从锚点到过期的秒数。选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

### 实时翻译客户端密钥创建响应

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，自纪元起以秒为单位。

  - `session: RealtimeTranslationSession`

    Realtime 翻译会话。翻译会话会持续将输入音频翻译为
    已配置的目标语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流中运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      此会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime `translation` 翻译会话，始终为该值。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation Input Audio Buffer Append 事件

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端原始音频字节。不受支持的 websocket 音频格式会返回
  验证错误，因为较低质量的音频会显著降低翻译
  质量。

  翻译使用 200 ms 引擎帧。为获得最佳实时行为，请追加
  以 200 毫秒的音频块发送。如果某个块较短，服务端会将其缓冲，直到凑够一帧所需的音频量。
  如果某个块较长，服务端会将其拆分为 200 毫秒的帧，并按顺序入队。
  帧并按顺序入队。

  在会话处于活跃状态时持续追加静音。如果客户端停止发送音频后稍后恢复，模型会将恢复后的音频视为与先前音频连续，
  音频视为与先前音频连续，而不是视为现实世界中的停顿。
  而不是视为现实世界中的停顿。

  - `audio: string`

    Base64 编码的 24 kHz PCM16 单声道音频字节。

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### Realtime Translation Input Transcript Delta 事件

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当存在可选的源语言转写文本时返回。该事件
  仅在 `audio.input.transcription` 已配置时触发。

  转写增量是仅追加的文本片段。客户端不应在增量之间
  插入固定空格。

  - `delta: string`

    仅追加的源语言转写文本。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时序元数据，派生自可用的翻译帧
    时间戳。它以 200 毫秒为步长推进，但多个转写
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转写增量标识符。

### Realtime Translation Output Audio Delta Event

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  在翻译后的输出音频可用时返回。The `delta` 包含一个
  PCM16 音频块，其长度可能不同。客户端应解码并按顺序拼接
  完整的增量数据，而不是假定固定的字节或采样数。

  - `delta: string`

    Base64 编码的翻译后音频数据。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.output_audio.delta"`

    事件类型，必须为 `session.output_audio.delta`.

    - `"session.output_audio.delta"`

  - `channels: optional number`

    音频声道数。

  - `elapsed_ms: optional number or null`

    用于流对齐的时序元数据，派生自可用的翻译帧
    可用时提供。将 `elapsed_ms` 视为对齐元数据，而不是唯一
    事件标识符。

  - `format: optional "pcm16"`

    音频编码格式，用于 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频增量的采样率。

### 实时翻译输出转录增量事件

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当翻译后的转录文本可用时返回。

  转写增量是仅追加的文本片段。客户端不应在增量之间
  插入固定空格。

  - `delta: string`

    翻译后输出音频的仅追加转录文本。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时序元数据，派生自可用的翻译帧
    时间戳。它以 200 毫秒为步长推进，但多个转写
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转写增量标识符。

### Realtime 翻译服务端事件

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  一个 Realtime 翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能是客户端问题或服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认监控并记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误类型（例如 "invalid_request_error"、"server_error"）。

      - `code: optional string or null`

        错误代码（如果有）。

      - `event_id: optional string or null`

        导致该错误的客户端事件的 event_id（如适用）。

      - `param: optional string or null`

        与错误相关的参数（如果有）。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

    在创建翻译会话时返回。作为首个服务端事件，在
    建立新连接时自动发出。该事件包含
    默认的翻译会话配置。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `audio: object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍然从
            输入音频流中运行。

            - `model: string`

              用于源转录增量数据的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量文本的目标语言。

      - `expires_at: number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `model: string`

        此会话使用的 Realtime 翻译模型。该字段在
        会话创建时设置，且无法通过 `session.update`.

      - `type: "translation"`

        会话类型。对于 Realtime `translation` 翻译会话，始终为该值。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    在使用 `session.update` 事件，
    更新翻译会话时返回，除非出现错误。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `RealtimeTranslationSessionClosedEvent object { event_id, type }`

    在实时翻译会话关闭时返回。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.closed"`

      事件类型，必须为 `session.closed`.

      - `"session.closed"`

  - `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当存在可选的源语言转写文本时返回。该事件
    仅在 `audio.input.transcription` 已配置时触发。

    转写增量是仅追加的文本片段。客户端不应在增量之间
    插入固定空格。

    - `delta: string`

      仅追加的源语言转写文本。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时序元数据，派生自可用的翻译帧
      时间戳。它以 200 毫秒为步长推进，但多个转写
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转写增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当翻译后的转录文本可用时返回。

    转写增量是仅追加的文本片段。客户端不应在增量之间
    插入固定空格。

    - `delta: string`

      翻译后输出音频的仅追加转录文本。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时序元数据，派生自可用的翻译帧
      时间戳。它以 200 毫秒为步长推进，但多个转写
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转写增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    在翻译后的输出音频可用时返回。The `delta` 包含一个
    PCM16 音频块，其长度可能不同。客户端应解码并按顺序拼接
    完整的增量数据，而不是假定固定的字节或采样数。

    - `delta: string`

      Base64 编码的翻译后音频数据。

    - `event_id: string`

      服务器事件的唯一 ID。

    - `type: "session.output_audio.delta"`

      事件类型，必须为 `session.output_audio.delta`.

      - `"session.output_audio.delta"`

    - `channels: optional number`

      音频声道数。

    - `elapsed_ms: optional number or null`

      用于流对齐的时序元数据，派生自可用的翻译帧
      可用时提供。将 `elapsed_ms` 视为对齐元数据，而不是唯一
      事件标识符。

    - `format: optional "pcm16"`

      音频编码格式，用于 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频增量的采样率。

### 实时翻译会话

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  Realtime 翻译会话。翻译会话会持续将输入音频翻译为
  已配置的目标语言。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流中运行。

        - `model: string`

          用于源转录增量数据的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `model: string`

    此会话使用的 Realtime 翻译模型。该字段在
    会话创建时设置，且无法通过 `session.update`.

  - `type: "translation"`

    会话类型。对于 Realtime `translation` 翻译会话，始终为该值。

    - `"translation"`

### 实时翻译会话关闭事件

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  正常关闭实时翻译会话。服务端会在关闭前刷新待处理的
  输入音频，并输出所有剩余的翻译结果，然后关闭
  会话。

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 实时翻译会话已关闭事件

- `RealtimeTranslationSessionClosedEvent object { event_id, type }`

  在实时翻译会话关闭时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `type: "session.closed"`

    事件类型，必须为 `session.closed`.

    - `"session.closed"`

### 实时翻译会话创建请求

- `RealtimeTranslationSessionCreateRequest object { model, audio }`

  Realtime 翻译会话配置。翻译会话持续流式传入源音频，
  并持续流式输出翻译后的音频以及转录文本增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流中运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

### 实时翻译会话已创建事件

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在创建翻译会话时返回。作为首个服务端事件，在
  建立新连接时自动发出。该事件包含
  默认的翻译会话配置。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `session: RealtimeTranslationSession`

    翻译会话配置。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流中运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      此会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime `translation` 翻译会话，始终为该值。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 实时翻译会话更新事件

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。翻译
  会话支持对以下字段的更新： `audio.output.language`, `audio.input.transcription`,
  和 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 和 `model` 字段在创建时设置，无法通过
    此事件进行更改。 `session.update`.

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用它。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流中运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 实时翻译会话更新请求

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可通过以下方式更新的实时翻译会话字段 `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流中运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

### Realtime Translation Session Updated Event

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  在使用 `session.update` 事件，
  更新翻译会话时返回，除非出现错误。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `session: RealtimeTranslationSession`

    翻译会话配置。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流中运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      此会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime `translation` 翻译会话，始终为该值。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime Truncation

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

  截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### Response Audio Delta Event

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频更新时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `delta: string`

    Base64 编码的音频数据增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.delta"`

    事件类型，必须为 `response.output_audio.delta`.

    - `"response.output_audio.delta"`

### Response Audio Done Event

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  当模型生成的音频完成时返回。在某个 Response
  被中断、未完成或取消时也会发出。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.done"`

    事件类型，必须为 `response.output_audio.done`.

    - `"response.output_audio.done"`

### Response Audio Transcript Delta Event

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频输出转写更新时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `delta: string`

    转写文本增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio_transcript.delta"`

    事件类型，必须为 `response.output_audio_transcript.delta`.

    - `"response.output_audio_transcript.delta"`

### Response Audio Transcript Done Event

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  当模型生成的音频输出转写完成时返回
  流式传输。在某个 Response 被中断、未完成或
  取消时也会发出。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `transcript: string`

    音频的最终转写文本。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### Response Cancel Event

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件以取消正在进行的响应。服务端将响应一个
  事件，状态为 `response.done` 如果 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使当前没有正在进行的响应，
  调用该事件也是安全的，如果出错将会返回错误，会话将保持不受影响。
  调用 `response.cancel` 即使当前没有正在进行的响应，也会返回错误，会话
  将保持不受影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `response_id: optional string`

    要取消的特定响应 ID——如果未提供，则会取消一个
    默认会话中的进行中响应。

### Response Content Part Added Event

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  在响应生成过程中，向 assistant 消息条目添加新的内容部分时返回
  。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    被添加内容部分的条目 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `part: object { audio, text, transcript, type }`

    被添加的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（当 type 为 "audio" 时）。

    - `text: optional string`

      文本内容（当 type 为 "text" 时）。

    - `transcript: optional string`

      音频的转录文本（当 type 为 "audio" 时）。

    - `type: optional "audio" or "text"`

      内容类型（"text"、"audio"）。

      - `"audio"`

      - `"text"`

  - `response_id: string`

    响应的 ID。

  - `type: "response.content_part.added"`

    事件类型，必须为 `response.content_part.added`.

    - `"response.content_part.added"`

### Response Content Part Done Event

- `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

  在助手消息条目中，当某个内容部分完成流式传输时返回。
  在 Response 被中断、未完成或取消时也会发出。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `part: object { audio, text, transcript, type }`

    已完成的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（当 type 为 "audio" 时）。

    - `text: optional string`

      文本内容（当 type 为 "text" 时）。

    - `transcript: optional string`

      音频的转录文本（当 type 为 "audio" 时）。

    - `type: optional "audio" or "text"`

      内容类型（"text"、"audio"）。

      - `"audio"`

      - `"text"`

  - `response_id: string`

    响应的 ID。

  - `type: "response.content_part.done"`

    事件类型，必须为 `response.content_part.done`.

    - `"response.content_part.done"`

### Response Create Event

- `ResponseCreateEvent object { type, event_id, response }`

  该事件指示服务端创建一个 Response，即触发
  模型推理。在 Server VAD 模式下，服务端将自动创建 Responses
  。

  一个 Response 至少包含一个 Item，也可能有两个，若是后者，
  则第二个是函数调用。这些 Item 默认会被追加到
  会话历史中。

  服务端将返回一个 `response.created` 事件、Item 相关事件
  及已创建的内容，最后是一个 `response.done` 事件，表示
  Response 已完成。

  该 `response.create` event 包含推理配置，例如
  `instructions` 和 `tools`。如果设置了这些参数，它们将仅在本次 Response 中覆盖会话的
  配置。

  Response 可以在默认对话之外创建，这意味着它们可以
  接收任意输入，并且可以禁用将输出写入对话。
  同一时间只能有一个 Response 向默认对话写入，但除此之外，多个
  Response 可以并行创建。 `metadata` 字段是区分
  多个并发 Response 的好方法。

  客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认
  对话的 Response。可以通过 `input` 字段提供任意输入，该字段是一个数组，可接受
  原始 Item 以及对已有 Item 的引用。

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `response: optional RealtimeResponseCreateParams`

    使用这些参数创建一个新的 Realtime response

    - `audio: optional RealtimeResponseCreateAudioOutput`

      音频输入和输出的配置。

      - `output: optional object { format, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回复的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
          一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
          在会话过程中就无法再更改声音。
          我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

          - `ID object { id }`

            自定义语音参考。

            - `id: string`

              自定义语音 ID，例如： `voice_1234`.

    - `conversation: optional string or "auto" or "none"`

      控制 response 添加到哪个对话。目前支持
      `auto` 和 `none`，使用 `auto` 作为默认值。 `auto` 值为 previous_response_id
      意味着响应的内容将被添加到默认的
      对话中。将其设置为 none `none` 以创建一个不会向默认对话添加项目的
      带外响应。

      - `string`

      - `"auto" or "none"`

        控制 response 添加到哪个对话。目前支持
        `auto` 和 `none`，使用 `auto` 作为默认值。 `auto` 值为 previous_response_id
        意味着响应的内容将被添加到默认的
        对话中。将其设置为 none `none` 以创建一个不会向默认对话添加项目的
        带外响应。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      要包含在模型提示词中的输入项。使用此字段
      会为本次响应创建一个新的上下文，而不是使用默认的
      对话。空数组 [] `[]` 将清除本次响应的上下文。
      注意，其中可以包含对会话中之前出现过的项目的引用，
      通过它们的 id 进行引用。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，表示系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

        Realtime 对话中的用户消息条目。

        - `content: array of object { audio, detail, image_url, 3 more }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一个函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          item 的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一个函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          item 的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所应答审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          item 的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器可用工具的 Realtime 条目。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          item 的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          item 的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          工具调用产生的错误（如果有）。

          - `RealtimeMcpProtocolError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "protocol_error"`

              - `"protocol_error"`

          - `RealtimeMcpToolExecutionError object { message, type }`

            - `message: string`

            - `type: "tool_execution_error"`

              - `"tool_execution_error"`

          - `RealtimeMcphttpError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "http_error"`

              - `"http_error"`

        - `output: optional string or null`

          工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        一个请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          item 的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `instructions: optional string`

      在模型调用前默认添加的系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如 "极其简洁"、"表现得友好"、"以下是一些优秀响应的示例"）以及音频行为上（例如 "说话快一点"、"在声音中加入情感"、"经常大笑"）的行为。这些指令不一定会被模型严格遵循，但它们为模型的期望行为提供了指导。
      请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
      数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      Set of 16 key-value pairs that can be attached to an object. This can be
      useful for storing additional information about the object in a structured
      format, and querying for objects via API or the dashboard.

      Keys are strings with a maximum length of 64 characters. Values are strings
      with a maximum length of 512 characters.

    - `output_modalities: optional array of "text" or "audio"`

      The set of modalities the model used to respond, currently the only possible values are
      `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
      output to mode `text` will disable audio output from the model.

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      Whether the model may call multiple tools in parallel. Only supported by
      reasoning Realtime models such as `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      Reference to a prompt template and its variables.
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        The unique identifier of the prompt template to use.

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        Optional map of values to substitute in for variables in your
        prompt. The substitution values can either be strings, or other
        Response input types like images or files.

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送到模型的文件 ID。

          - `image_url: optional string or null`

            发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送到模型的文件输入。

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送到模型的文件内容。

          - `file_id: optional string or null`

            发送到模型的文件 ID。

          - `file_url: optional string`

            发送到模型的文件的 URL。

          - `filename: optional string`

            发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。提供一个字符串模式或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定的 function 工具。

        - `name: string`

          要调用的 function 名称。

        - `type: "function"`

          对于 function 调用，type 始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务标签。

        - `type: "mcp"`

          对于 MCP 工具，type 始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      可供模型使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时告诉用户什么的指导
          （如果有）。

        - `name: optional string`

          函数名称。

        - `parameters: optional unknown`

          函数在 JSON Schema 中的参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
          MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持的 `connector_id` 值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
          - Outlook 电子邮件： `connector_outlookemail`
          - SharePoint： `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，也可以是与工具关联的过滤对象
            ，用于需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
          `tunnel_id` 之一，必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

### Response Created Event

- `ResponseCreatedEvent object { event_id, response, type }`

  在创建新 Response 时返回，即响应创建的首个事件，
  此时响应处于初始状态， `in_progress`.

  - `event_id: string`

    服务器事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式如下 `resp_1234`.

    - `audio: optional object { output }`

      音频输出的配置。

      - `output: optional object { format, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少以音频回复过一次，
          会话期间就无法再更改该声音。当前
          可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          以获得最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

    - `conversation_id: optional string`

      响应所添加到的对话，由 `conversation`
      字段中的 `response.create` 事件决定。如果 `auto`，则响应会被添加到
      默认对话中，且 `conversation_id` 的值会是一个类似
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使当前没有正在进行的响应， `none`，则响应不会被添加到任何对话中，
      的值 `conversation_id` 将是 `null`。如果响应是由 VAD
      自动触发的，则该响应会被添加到默认对话中

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用），该输入用于本次响应。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      Set of 16 key-value pairs that can be attached to an object. This can be
      useful for storing additional information about the object in a structured
      format, and querying for objects via API or the dashboard.

      Keys are strings with a maximum length of 64 characters. Values are strings
      with a maximum length of 512 characters.

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      由响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，表示系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

        Realtime 对话中的用户消息条目。

        - `content: array of object { audio, detail, image_url, 3 more }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一个函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          item 的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一个函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          item 的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所应答审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          item 的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器可用工具的 Realtime 条目。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          item 的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          item 的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          工具调用产生的错误（如果有）。

          - `RealtimeMcpProtocolError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "protocol_error"`

              - `"protocol_error"`

          - `RealtimeMcpToolExecutionError object { message, type }`

            - `message: string`

            - `type: "tool_execution_error"`

              - `"tool_execution_error"`

          - `RealtimeMcphttpError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "http_error"`

              - `"http_error"`

        - `output: optional string or null`

          工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        一个请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          item 的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      The set of modalities the model used to respond, currently the only possible values are
      `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
      output to mode `text` will disable audio output from the model.

      - `"text"`

      - `"audio"`

    - `status: optional "completed" or "cancelled" or "failed" or 2 more`

      响应的最终状态（`completed`, `cancelled`, `failed`，或
      `incomplete`, `in_progress`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

      - `"in_progress"`

    - `status_details: optional RealtimeResponseStatus`

      关于该状态的更多详细信息。

      - `error: optional object { code, type }`

        导致响应失败的原因描述，
        在以下情况时填充： `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于一个 `cancelled` 响应，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音起始）或 `client_cancelled` （客户端发送了取消事件）。对于一个  `incomplete` Response,取值之一 `max_output_tokens` 或 `content_filter`  (服务端安全过滤器被触发并截断了 Response)。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致 Response 失败的错误类型,对应
        字段 ( `status` field (`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的用量统计信息,这将对应计费。一个
      Realtime API 会话将维护一个对话上下文,并将新的
      Items 追加到 Conversation 中,因此先前轮次的输出(文本和
      音频 tokens)将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 中输入 tokens 的详细信息。Cached tokens 来自对话中先前轮次、被作为当前 response 上下文包含的 tokens。此处的 cached tokens 计为输入 tokens 的一个子集,这意味着 input tokens 将包含 cached 和 uncached tokens。

        - `audio_tokens: optional number`

          Response 中作为输入使用的音频 token 数。

        - `cached_tokens: optional number`

          Response 中作为输入使用的缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          关于 Response 中作为输入使用的缓存 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中作为输入使用的缓存音频 token 数。

          - `image_tokens: optional number`

            Response 中作为输入使用的缓存图像 token 数。

          - `text_tokens: optional number`

            Response 中作为输入使用的缓存文本 token 数。

        - `image_tokens: optional number`

          Response 中作为输入使用的图像 token 数。

        - `text_tokens: optional number`

          Response 中作为输入使用的文本 token 数。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        关于 Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的 token 总数，包括输入和输出
        文本及音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### Response Done Event

- `ResponseDoneEvent object { event_id, response, type }`

  在 Response 完成流式传输时返回。无论最终状态如何，
  final state。事件中包含的 Response 对象会附带所有输出条目 `response.done` ，但会缺少原始音频数据。
  客户端应检查 Response 的。

  字段以判断该请求是否成功 `status` ，或是否出现了其他结果：
  (`completed`）或者是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  响应将包含在响应过程中生成的所有输出项，但不包括
  任何音频内容。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式如下 `resp_1234`.

    - `audio: optional object { output }`

      音频输出的配置。

      - `output: optional object { format, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少以音频回复过一次，
          会话期间就无法再更改该声音。当前
          可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          以获得最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

    - `conversation_id: optional string`

      响应所添加到的对话，由 `conversation`
      字段中的 `response.create` 事件决定。如果 `auto`，则响应会被添加到
      默认对话中，且 `conversation_id` 的值会是一个类似
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使当前没有正在进行的响应， `none`，则响应不会被添加到任何对话中，
      的值 `conversation_id` 将是 `null`。如果响应是由 VAD
      自动触发的，则该响应会被添加到默认对话中

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用），该输入用于本次响应。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      Set of 16 key-value pairs that can be attached to an object. This can be
      useful for storing additional information about the object in a structured
      format, and querying for objects via API or the dashboard.

      Keys are strings with a maximum length of 64 characters. Values are strings
      with a maximum length of 512 characters.

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      由响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，表示系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

        Realtime 对话中的用户消息条目。

        - `content: array of object { audio, detail, image_url, 3 more }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          item 的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一个函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          item 的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一个函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          item 的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          item 的唯一 ID。这可以由客户端提供或由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所应答审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          item 的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器可用工具的 Realtime 条目。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          item 的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime 条目。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          item 的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          工具调用产生的错误（如果有）。

          - `RealtimeMcpProtocolError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "protocol_error"`

              - `"protocol_error"`

          - `RealtimeMcpToolExecutionError object { message, type }`

            - `message: string`

            - `type: "tool_execution_error"`

              - `"tool_execution_error"`

          - `RealtimeMcphttpError object { code, message, type }`

            - `code: number`

            - `message: string`

            - `type: "http_error"`

              - `"http_error"`

        - `output: optional string or null`

          工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        一个请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          item 的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      The set of modalities the model used to respond, currently the only possible values are
      `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
      output to mode `text` will disable audio output from the model.

      - `"text"`

      - `"audio"`

    - `status: optional "completed" or "cancelled" or "failed" or 2 more`

      响应的最终状态（`completed`, `cancelled`, `failed`，或
      `incomplete`, `in_progress`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

      - `"in_progress"`

    - `status_details: optional RealtimeResponseStatus`

      关于该状态的更多详细信息。

      - `error: optional object { code, type }`

        导致响应失败的原因描述，
        在以下情况时填充： `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于一个 `cancelled` 响应，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音起始）或 `client_cancelled` （客户端发送了取消事件）。对于一个  `incomplete` Response,取值之一 `max_output_tokens` 或 `content_filter`  (服务端安全过滤器被触发并截断了 Response)。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致 Response 失败的错误类型,对应
        字段 ( `status` field (`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的用量统计信息,这将对应计费。一个
      Realtime API 会话将维护一个对话上下文,并将新的
      Items 追加到 Conversation 中,因此先前轮次的输出(文本和
      音频 tokens)将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 中输入 tokens 的详细信息。Cached tokens 来自对话中先前轮次、被作为当前 response 上下文包含的 tokens。此处的 cached tokens 计为输入 tokens 的一个子集,这意味着 input tokens 将包含 cached 和 uncached tokens。

        - `audio_tokens: optional number`

          Response 中作为输入使用的音频 token 数。

        - `cached_tokens: optional number`

          Response 中作为输入使用的缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          关于 Response 中作为输入使用的缓存 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中作为输入使用的缓存音频 token 数。

          - `image_tokens: optional number`

            Response 中作为输入使用的缓存图像 token 数。

          - `text_tokens: optional number`

            Response 中作为输入使用的缓存文本 token 数。

        - `image_tokens: optional number`

          Response 中作为输入使用的图像 token 数。

        - `text_tokens: optional number`

          Response 中作为输入使用的文本 token 数。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        关于 Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的 token 总数，包括输入和输出
        文本及音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### Response Function Call Arguments Delta Event

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  当模型生成的函数调用参数被更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    以 JSON 字符串表示的参数增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.delta"`

    事件类型，必须为 `response.function_call_arguments.delta`.

    - `"response.function_call_arguments.delta"`

### Response Function Call Arguments Done Event

- `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

  当模型生成的函数调用参数流式传输完成时返回。
  在 Response 被中断、未完成或取消时也会发出。

  - `arguments: string`

    最终参数，以 JSON 字符串形式提供。

  - `call_id: string`

    函数调用的 ID。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `name: string`

    被调用函数的名称。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.done"`

    事件类型，必须为 `response.function_call_arguments.done`.

    - `"response.function_call_arguments.done"`

### Response Mcp Call Arguments Delta

- `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

  在响应生成期间，当 MCP 工具调用参数被更新时返回。

  - `delta: string`

    以 JSON 编码的参数增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.mcp_call_arguments.delta"`

    事件类型，必须为 `response.mcp_call_arguments.delta`.

    - `"response.mcp_call_arguments.delta"`

  - `obfuscation: optional string or null`

    如果存在,表示增量文本经过混淆处理。

### Response Mcp Call Arguments Done

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成过程中，MCP 工具调用参数最终确定时返回。

  - `arguments: string`

    最终的 JSON 编码参数字符串。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.mcp_call_arguments.done"`

    事件类型，必须为 `response.mcp_call_arguments.done`.

    - `"response.mcp_call_arguments.done"`

### Response Mcp Call Completed

- `ResponseMcpCallCompleted object { event_id, item_id, output_index, type }`

  MCP 工具调用已成功完成时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.completed"`

    事件类型，必须为 `response.mcp_call.completed`.

    - `"response.mcp_call.completed"`

### Response Mcp Call Failed

- `ResponseMcpCallFailed object { event_id, item_id, output_index, type }`

  MCP 工具调用失败时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.failed"`

    事件类型，必须为 `response.mcp_call.failed`.

    - `"response.mcp_call.failed"`

### Response Mcp Call In Progress

- `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

  MCP 工具调用已开始且正在进行时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.in_progress"`

    事件类型，必须为 `response.mcp_call.in_progress`.

    - `"response.mcp_call.in_progress"`

### Response Output Item Added Event

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  在 Response 生成过程中创建新 Item 时返回。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 会话中的单个 item。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    该输出项在 Response 中的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.added"`

    事件类型，必须为 `response.output_item.added`.

    - `"response.output_item.added"`

### Response Output Item Done Event

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  当 Item 完成流式传输时返回。在 Response 被
  中断、未完成或取消时也会发出。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 会话中的单个 item。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 会话中的系统消息可用于向模型提供额外的上下文或指令。这与会话开始时提供的指令提示类似但有所不同，因为系统消息可以在会话中的任何时刻添加。对于会话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，表示系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认使用 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），格式为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的转录文本（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        item 的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一个函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        item 的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一个函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        item 的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        item 的唯一 ID。这可以由客户端提供或由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所应答审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        item 的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器可用工具的 Realtime 条目。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        item 的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime 条目。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        item 的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用产生的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        item 的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    该输出项在 Response 中的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.done"`

    事件类型，必须为 `response.output_item.done`.

    - `"response.output_item.done"`

### Response Text Delta Event

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  当 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `delta: string`

    文本增量。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_text.delta"`

    事件类型，必须为 `response.output_text.delta`.

    - `"response.output_text.delta"`

### Response Text Done Event

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  当 "output_text" 内容部分的文本值流式传输完成时返回。在
  Response 被中断、未完成或取消时也会发出。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `item_id: string`

    条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `text: string`

    最终的文本内容。

  - `type: "response.output_text.done"`

    事件类型，必须为 `response.output_text.done`.

    - `"response.output_text.done"`

### Session Created Event

- `SessionCreatedEvent object { event_id, session, type }`

  在创建 Session 时返回。作为第一个服务端事件，在建立新
  连接时自动发出。该事件将包含
  默认的 Session 配置。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

        - `"realtime"`

      - `audio: optional object { input, output }`

        输入和输出音频的配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            输入音频的格式。

            - `PCMAudio object { rate, type }`

              PCM 音频格式。仅支持 24kHz 采样率。

              - `rate: optional 24000`

                音频的采样率。始终为 `24000`.

                - `24000`

              - `type: optional "audio/pcm"`

                音频格式。始终为 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终为 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终为 `audio/pcma`.

                - `"audio/pcma"`

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。这在
                用户长时间停顿属于意外情况的场景下非常有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文进行。

                该超时值将在上一个模型响应的音频播放完成后生效，
                即它被设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                关联到 Response）会在达到超时时被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当发生 VAD start 事件时，是否自动中断（取消）向默认
                会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短暂的停顿时插入。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                高的阈值会要求更大的音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当发生 VAD stop 事件时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                会话（即。 `conversation` 的 `auto`)。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是在音频生成之后对音频进行的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少以音频回复过一次，
              会话期间就无法再更改该声音。当前
              可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
              以获得最佳质量。

              - `"alloy"`

              - `"ash"`

              - `"ballad"`

              - `"coral"`

              - `"echo"`

              - `"sage"`

              - `"shimmer"`

              - `"verse"`

              - `"marin"`

              - `"cedar"`

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

        请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
        数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的 Realtime 模型。

          - `"gpt-realtime"`

          - `"gpt-realtime-1.5"`

          - `"gpt-realtime-2"`

          - `"gpt-realtime-2.1"`

          - `"gpt-realtime-2.1-mini"`

          - `"gpt-realtime-2025-08-28"`

          - `"gpt-4o-realtime-preview"`

          - `"gpt-4o-realtime-preview-2024-10-01"`

          - `"gpt-4o-realtime-preview-2024-12-17"`

          - `"gpt-4o-realtime-preview-2025-06-03"`

          - `"gpt-4o-mini-realtime-preview"`

          - `"gpt-4o-mini-realtime-preview-2024-12-17"`

          - `"gpt-realtime-mini"`

          - `"gpt-realtime-mini-2025-10-06"`

          - `"gpt-realtime-mini-2025-12-15"`

          - `"gpt-audio-1.5"`

          - `"gpt-audio-mini"`

          - `"gpt-audio-mini-2025-10-06"`

          - `"gpt-audio-mini-2025-12-15"`

      - `output_modalities: optional array of "text" or "audio"`

        模型可以响应的模态集合。默认为 `["audio"]`，表示
        模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
        模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        Reference to a prompt template and its variables.
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          The unique identifier of the prompt template to use.

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          Optional map of values to substitute in for variables in your
          prompt. The substitution values can either be strings, or other
          Response input types like images or files.

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              The type of the input item. Always `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `image_url: optional string or null`

              发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送到模型的文件输入。

            - `type: "input_file"`

              The type of the input item. Always `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送到模型的文件内容。

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `file_url: optional string`

              发送到模型的文件的 URL。

            - `filename: optional string`

              发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供一个字符串模式或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
          更多工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定的 function 工具。

          - `name: string`

            要调用的 function 名称。

          - `type: "function"`

            对于 function 调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        可供模型使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时告诉用户什么的指导
            （如果有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            函数在 JSON Schema 中的参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 电子邮件： `connector_outlookemail`
            - SharePoint： `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              ，用于需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
            `tunnel_id` 之一，必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        为某个会话启用追踪 后，配置便无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值设置
        工作流 名称、group id 和 metadata。

        - `Auto = "auto"`

          启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          针对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
            在追踪仪表板中为该追踪 命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

        截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型。始终为 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 以关闭。服务端
            VAD 表示模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（以毫秒为单位）。默认
              500ms。值越小，模型响应越快，
              但可能会在用户短暂的停顿时插入。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值会要求更大的音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅 `server_vad` 是目前受支持的。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Session Update Event

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新任何字段
  除了 `voice` 和 `model`. `voice` 只有在尚未产生其他音频输出的情况下才能更新。

  当服务端收到 `session.update`，时，它将响应一个
  事件，状态为 `session.updated` 事件，显示完整且生效的配置。
  只有出现在 `session.update` 中的字段会被更新。若要清除类似
  `instructions`，请传入空字符串。若要清除类似字段 `tools`，请传入空数组。
  若要清除类似字段 `turn_detection`，请传入 `null`.

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。选择 realtime
    会话或转录会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

        - `"realtime"`

      - `audio: optional RealtimeAudioConfig`

        输入和输出音频的配置。

        - `input: optional RealtimeAudioConfigInput`

          - `format: optional RealtimeAudioFormats`

            输入音频的格式。

            - `PCMAudio object { rate, type }`

              PCM 音频格式。仅支持 24kHz 采样率。

              - `rate: optional 24000`

                音频的采样率。始终为 `24000`.

                - `24000`

              - `type: optional "audio/pcm"`

                音频格式。始终为 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终为 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终为 `audio/pcma`.

                - `"audio/pcma"`

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在输出转录文本之前等待的时间。
              较高的值可以提高转录准确率，但会增加延迟。
              仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。使用
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
              可以提高准确率并降低延迟。

            - `languages: optional array of string`

              输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              用于引导模型风格或延续先前音频的可选文本
              片段。
              对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
              Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。这在
                用户长时间停顿属于意外情况的场景下非常有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文进行。

                该超时值将在上一个模型响应的音频播放完成后生效，
                即它被设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                关联到 Response）会在达到超时时被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当发生 VAD start 事件时，是否自动中断（取消）向默认
                会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短暂的停顿时插入。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                高的阈值会要求更大的音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当发生 VAD stop 事件时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                会话（即。 `conversation` 的 `auto`)。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是在音频生成之后对音频进行的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于回复的声音。支持的内置声音包括
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
            一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
            在会话过程中就无法再更改声音。
            我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              - `"alloy"`

              - `"ash"`

              - `"ballad"`

              - `"coral"`

              - `"echo"`

              - `"sage"`

              - `"shimmer"`

              - `"verse"`

              - `"marin"`

              - `"cedar"`

            - `ID object { id }`

              自定义语音参考。

              - `id: string`

                自定义语音 ID，例如： `voice_1234`.

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

        请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
        数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的 Realtime 模型。

          - `"gpt-realtime"`

          - `"gpt-realtime-1.5"`

          - `"gpt-realtime-2"`

          - `"gpt-realtime-2.1"`

          - `"gpt-realtime-2.1-mini"`

          - `"gpt-realtime-2025-08-28"`

          - `"gpt-4o-realtime-preview"`

          - `"gpt-4o-realtime-preview-2024-10-01"`

          - `"gpt-4o-realtime-preview-2024-12-17"`

          - `"gpt-4o-realtime-preview-2025-06-03"`

          - `"gpt-4o-mini-realtime-preview"`

          - `"gpt-4o-mini-realtime-preview-2024-12-17"`

          - `"gpt-realtime-mini"`

          - `"gpt-realtime-mini-2025-10-06"`

          - `"gpt-realtime-mini-2025-12-15"`

          - `"gpt-audio-1.5"`

          - `"gpt-audio-mini"`

          - `"gpt-audio-mini-2025-10-06"`

          - `"gpt-audio-mini-2025-12-15"`

      - `output_modalities: optional array of "text" or "audio"`

        模型可以响应的模态集合。默认为 `["audio"]`，表示
        模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
        模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        Whether the model may call multiple tools in parallel. Only supported by
        reasoning Realtime models such as `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        Reference to a prompt template and its variables.
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          The unique identifier of the prompt template to use.

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          Optional map of values to substitute in for variables in your
          prompt. The substitution values can either be strings, or other
          Response input types like images or files.

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              The type of the input item. Always `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `image_url: optional string or null`

              发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送到模型的文件输入。

            - `type: "input_file"`

              The type of the input item. Always `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送到模型的文件内容。

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `file_url: optional string`

              发送到模型的文件的 URL。

            - `filename: optional string`

              发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional RealtimeToolChoiceConfig`

        模型选择工具的方式。提供一个字符串模式或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
          更多工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定的 function 工具。

          - `name: string`

            要调用的 function 名称。

          - `type: "function"`

            对于 function 调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务上调用的工具名称。

      - `tools: optional RealtimeToolsConfig`

        可供模型使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时告诉用户什么的指导
            （如果有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            函数在 JSON Schema 中的参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 电子邮件： `connector_outlookemail`
            - SharePoint： `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              ，用于需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
            `tunnel_id` 之一，必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        为某个会话启用追踪 后，配置便无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值设置
        工作流 名称、group id 和 metadata。

        - `Auto = "auto"`

          启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          针对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
            在追踪仪表板中为该追踪 命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

        截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转写会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。对于 Realtime API，始终为 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。这在
                用户长时间停顿属于意外情况的场景下非常有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文进行。

                该超时值将在上一个模型响应的音频播放完成后生效，
                即它被设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                关联到 Response）会在达到超时时被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当发生 VAD start 事件时，是否自动中断（取消）向默认
                会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短暂的停顿时插入。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                高的阈值会要求更大的音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当发生 VAD stop 事件时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                会话（即。 `conversation` 的 `auto`)。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。这是一个客户端可以自行指定的任意字符串。如果该事件出现错误，该 ID 会被传回，但对应的 `session.updated` 事件中不会包含它。

### Session Updated Event

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话通过以下事件更新时返回： `session.update` 事件，除非
  出现错误。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

        - `"realtime"`

      - `audio: optional object { input, output }`

        输入和输出音频的配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            输入音频的格式。

            - `PCMAudio object { rate, type }`

              PCM 音频格式。仅支持 24kHz 采样率。

              - `rate: optional 24000`

                音频的采样率。始终为 `24000`.

                - `24000`

              - `type: optional "audio/pcm"`

                音频格式。始终为 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终为 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终为 `audio/pcma`.

                - `"audio/pcma"`

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。这在
                用户长时间停顿属于意外情况的场景下非常有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文进行。

                该超时值将在上一个模型响应的音频播放完成后生效，
                即它被设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                关联到 Response）会在达到超时时被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当发生 VAD start 事件时，是否自动中断（取消）向默认
                会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短暂的停顿时插入。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                高的阈值会要求更大的音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当发生 VAD stop 事件时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                会话（即。 `conversation` 的 `auto`)。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是在音频生成之后对音频进行的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少以音频回复过一次，
              会话期间就无法再更改该声音。当前
              可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
              以获得最佳质量。

              - `"alloy"`

              - `"ash"`

              - `"ballad"`

              - `"coral"`

              - `"echo"`

              - `"sage"`

              - `"shimmer"`

              - `"verse"`

              - `"marin"`

              - `"cedar"`

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

        请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
        数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的 Realtime 模型。

          - `"gpt-realtime"`

          - `"gpt-realtime-1.5"`

          - `"gpt-realtime-2"`

          - `"gpt-realtime-2.1"`

          - `"gpt-realtime-2.1-mini"`

          - `"gpt-realtime-2025-08-28"`

          - `"gpt-4o-realtime-preview"`

          - `"gpt-4o-realtime-preview-2024-10-01"`

          - `"gpt-4o-realtime-preview-2024-12-17"`

          - `"gpt-4o-realtime-preview-2025-06-03"`

          - `"gpt-4o-mini-realtime-preview"`

          - `"gpt-4o-mini-realtime-preview-2024-12-17"`

          - `"gpt-realtime-mini"`

          - `"gpt-realtime-mini-2025-10-06"`

          - `"gpt-realtime-mini-2025-12-15"`

          - `"gpt-audio-1.5"`

          - `"gpt-audio-mini"`

          - `"gpt-audio-mini-2025-10-06"`

          - `"gpt-audio-mini-2025-12-15"`

      - `output_modalities: optional array of "text" or "audio"`

        模型可以响应的模态集合。默认为 `["audio"]`，表示
        模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
        模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        Reference to a prompt template and its variables.
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          The unique identifier of the prompt template to use.

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          Optional map of values to substitute in for variables in your
          prompt. The substitution values can either be strings, or other
          Response input types like images or files.

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              The type of the input item. Always `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `image_url: optional string or null`

              发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送到模型的文件输入。

            - `type: "input_file"`

              The type of the input item. Always `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送到模型的文件内容。

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `file_url: optional string`

              发送到模型的文件的 URL。

            - `filename: optional string`

              发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供一个字符串模式或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
          更多工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定的 function 工具。

          - `name: string`

            要调用的 function 名称。

          - `type: "function"`

            对于 function 调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        可供模型使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时告诉用户什么的指导
            （如果有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            函数在 JSON Schema 中的参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 电子邮件： `connector_outlookemail`
            - SharePoint： `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              ，用于需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
            `tunnel_id` 之一，必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        为某个会话启用追踪 后，配置便无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值设置
        工作流 名称、group id 和 metadata。

        - `Auto = "auto"`

          启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          针对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
            在追踪仪表板中为该追踪 命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

        截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型。始终为 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 以关闭。服务端
            VAD 表示模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（以毫秒为单位）。默认
              500ms。值越小，模型响应越快，
              但可能会在用户短暂的停顿时插入。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值会要求更大的音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅 `server_vad` 是目前受支持的。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Transcription Session Update

- `TranscriptionSessionUpdate object { session, type, event_id }`

  发送此事件以更新转录会话。

  - `session: object { include, input_audio_format, input_audio_noise_reduction, 2 more }`

    实时转写会话对象配置。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在转录中包含的项集。当前可用的项包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`,输入音频必须为 16 位 PCM,采样率 24kHz,
      单声道(mono),且采用小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供了额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可以提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频的可选文本
        片段。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静音持续时间（以毫秒为单位）。默认
        500ms。值越小，模型响应越快，
        但可能会在用户短暂的停顿时插入。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值会要求更大的音量才能激活模型，
        因此在嘈杂环境中可能表现更好。

      - `type: optional "server_vad"`

        轮次检测类型。目前仅 `server_vad` 支持转录会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 转录会话更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  当转录会话通过以下方式更新时返回： `transcription_session.update` 事件，除非
  出现错误。

  - `event_id: string`

    服务器事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    一个新的 Realtime 转录会话配置。

    当会话在服务端通过 REST API 创建时，会话对象
    还会包含一个临时密钥。密钥的默认 TTL 为 10 分钟。该
    属性在通过 WebSocket API 更新会话时不会出现。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅当会话
      通过 REST API 在服务端创建时才会出现。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌都会在
        一分钟后过期。

      - `value: string`

        可在客户端环境中用于验证连接到
        Realtime API 的临时密钥。请在客户端环境中使用此密钥，而不是
        标准的 API 令牌，后者仅应在 服务端使用。

    - `input_audio_format: optional string`

      输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        为输入音频转录配置的提示（如果存在）。

    - `modalities: optional array of "text" or "audio"`

      模型可以响应的模态集合。若要禁用音频,
      请将其设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端
      VAD 表示模型将根据
      音量，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静音持续时间（以毫秒为单位）。默认
        500ms。值越小，模型响应越快，
        但可能会在用户短暂的停顿时插入。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值会要求更大的音量才能激活模型，
        因此在嘈杂环境中可能表现更好。

      - `type: optional string`

        轮次检测类型，仅 `server_vad` 是目前受支持的。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 通话

## 接听通话

**post** `/realtime/calls/{call_id}/accept`

接收来电 SIP 并配置将用于
处理该通话的实时会话。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

  - `"realtime"`

- `audio: optional RealtimeAudioConfig`

  输入和输出音频的配置。

  - `input: optional RealtimeAudioConfigInput`

    - `format: optional RealtimeAudioFormats`

      输入音频的格式。

      - `PCMAudio object { rate, type }`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `rate: optional 24000`

          音频的采样率。始终为 `24000`.

          - `24000`

        - `type: optional "audio/pcm"`

          音频格式。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `PCMUAudio object { type }`

        G.711 μ-law 格式。

        - `type: optional "audio/pcmu"`

          音频格式。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `PCMAAudio object { type }`

        G.711 A-law 格式。

        - `type: optional "audio/pcma"`

          音频格式。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可以提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频的可选文本
        片段。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。这在
          用户长时间停顿属于意外情况的场景下非常有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文进行。

          该超时值将在上一个模型响应的音频播放完成后生效，
          即它被设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          关联到 Response）会在达到超时时被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当发生 VAD start 事件时，是否自动中断（取消）向默认
          会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。值越小，模型响应越快，
          但可能会在用户短暂的停顿时插入。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
          高的阈值会要求更大的音量才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当发生 VAD stop 事件时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
          会话（即。 `conversation` 的 `auto`)。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应的速度，以原始速度的倍数表示。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

      该参数是在音频生成之后对音频进行的后处理调整，也
      可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回复的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
      一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
      在会话过程中就无法再更改声音。
      我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

      - `string`

      - `"alloy" or "ash" or "ballad" or 7 more`

        - `"alloy"`

        - `"ash"`

        - `"ballad"`

        - `"coral"`

        - `"echo"`

        - `"sage"`

        - `"shimmer"`

        - `"verse"`

        - `"marin"`

        - `"cedar"`

      - `ID object { id }`

        自定义语音参考。

        - `id: string`

          自定义语音 ID，例如： `voice_1234`.

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的附加字段。

  `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

  请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。请提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
  数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

  此会话使用的 Realtime 模型。

  - `string`

  - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    此会话使用的 Realtime 模型。

    - `"gpt-realtime"`

    - `"gpt-realtime-1.5"`

    - `"gpt-realtime-2"`

    - `"gpt-realtime-2.1"`

    - `"gpt-realtime-2.1-mini"`

    - `"gpt-realtime-2025-08-28"`

    - `"gpt-4o-realtime-preview"`

    - `"gpt-4o-realtime-preview-2024-10-01"`

    - `"gpt-4o-realtime-preview-2024-12-17"`

    - `"gpt-4o-realtime-preview-2025-06-03"`

    - `"gpt-4o-mini-realtime-preview"`

    - `"gpt-4o-mini-realtime-preview-2024-12-17"`

    - `"gpt-realtime-mini"`

    - `"gpt-realtime-mini-2025-10-06"`

    - `"gpt-realtime-mini-2025-12-15"`

    - `"gpt-audio-1.5"`

    - `"gpt-audio-mini"`

    - `"gpt-audio-mini-2025-10-06"`

    - `"gpt-audio-mini-2025-12-15"`

- `output_modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。默认为 `["audio"]`，表示
  模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
  模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  Whether the model may call multiple tools in parallel. Only supported by
  reasoning Realtime models such as `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  Reference to a prompt template and its variables.
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    The unique identifier of the prompt template to use.

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    Optional map of values to substitute in for variables in your
    prompt. The substitution values can either be strings, or other
    Response input types like images or files.

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      A text input to the model.

      - `text: string`

        The text input to the model.

      - `type: "input_text"`

        The type of the input item. Always `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        The type of the input item. Always `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送到模型的文件 ID。

      - `image_url: optional string or null`

        发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送到模型的文件输入。

      - `type: "input_file"`

        The type of the input item. Always `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送到模型的文件内容。

      - `file_id: optional string or null`

        发送到模型的文件 ID。

      - `file_url: optional string`

        发送到模型的文件的 URL。

      - `filename: optional string`

        发送到模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    可选的提示模板版本。

- `reasoning: optional RealtimeReasoning`

  适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型选择工具的方式。提供一个字符串模式或强制使用特定的
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
    更多工具。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项强制模型调用特定的 function 工具。

    - `name: string`

      要调用的 function 名称。

    - `type: "function"`

      对于 function 调用，type 始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项强制模型调用远程 MCP 服务上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务标签。

    - `type: "mcp"`

      对于 MCP 工具，type 始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务上调用的工具名称。

- `tools: optional RealtimeToolsConfig`

  可供模型使用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时告诉用户什么的指导
      （如果有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      函数在 JSON Schema 中的参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
      MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
      使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持的 `connector_id` 值包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google 日历： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook 日历： `connector_outlookcalendar`
      - Outlook 电子邮件： `connector_outlookemail`
      - SharePoint： `connector_sharepoint`

      - `"connector_dropbox"`

      - `"connector_gmail"`

      - `"connector_googlecalendar"`

      - `"connector_googledrive"`

      - `"connector_microsoftteams"`

      - `"connector_outlookcalendar"`

      - `"connector_outlookemail"`

      - `"connector_sharepoint"`

    - `defer_loading: optional boolean`

      此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的过滤对象
        ，用于需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
      `tunnel_id` 之一，必须提供其中一个。

    - `tunnel_id: optional string`

      要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
  为某个会话启用追踪 后，配置便无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值设置
  工作流 名称、group id 和 metadata。

  - `Auto = "auto"`

    启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    针对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
      筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
      在追踪仪表板中为该追踪 命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

  截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/accept \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "type": "realtime"
        }'
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/accept \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "type": "realtime",
        "model": "gpt-realtime",
        "instructions": "You are Alex, a friendly concierge for Example Corp.",
      }'
```

## 创建呼叫

**post** `/realtime/calls`

通过 WebRTC 创建一个新的 Realtime API 调用，并接收所需的 SDP 应答
以完成对等连接。

### 示例

```http
curl https://api.openai.com/v1/realtime/calls \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F sdp=sdp
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "sdp=<offer.sdp;type=application/sdp" \
  -F 'session={"type":"realtime","model":"gpt-realtime"};type=application/json'
```

#### 响应

```json
v=0
o=- 4227147428 1719357865 IN IP4 127.0.0.1
s=-
c=IN IP4 0.0.0.0
t=0 0
a=group:BUNDLE 0 1
a=msid-semantic:WMS *
a=fingerprint:sha-256 CA:92:52:51:B4:91:3B:34:DD:9C:0B:FB:76:19:7E:3B:F1:21:0F:32:2C:38:01:72:5D:3F:78:C7:5F:8B:C7:36
m=audio 9 UDP/TLS/RTP/SAVPF 111 0 8
a=mid:0
a=ice-ufrag:kZ2qkHXX/u11
a=ice-pwd:uoD16Di5OGx3VbqgA3ymjEQV2kwiOjw6
a=setup:active
a=rtcp-mux
a=rtpmap:111 opus/48000/2
a=candidate:993865896 1 udp 2130706431 4.155.146.196 3478 typ host ufrag kZ2qkHXX/u11
a=candidate:1432411780 1 tcp 1671430143 4.155.146.196 443 typ host tcptype passive ufrag kZ2qkHXX/u11
m=application 9 UDP/DTLS/SCTP webrtc-datachannel
a=mid:1
a=sctp-port:5000
```

## 挂断通话

**post** `/realtime/calls/{call_id}/hangup`

结束一个活跃的实时 API 调用，无论该调用是通过 SIP 还是
WebRTC 发起的。

### 路径参数

- `call_id: string`

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Refer call

**post** `/realtime/calls/{call_id}/refer`

使用 SIP REFER 动词将正在进行的 SIP 呼叫转接到新目标。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 头中的 URI。支持类似以下的值
  `tel:+14155550123` 或 `sip:agent@example.com`.

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/refer \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "target_uri": "tel:+14155550123"
        }'
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/refer \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```

## 拒绝调用

**post** `/realtime/calls/{call_id}/reject`

通过向主叫方返回 SIP 状态码来拒接来电 SIP 通话。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  回传给呼叫方的 SIP 响应代码。省略时默认为 `603` (Decline)
  。

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```

# 客户端密钥

## 创建客户端密钥

**post** `/realtime/client_secrets`

创建一个 Realtime 客户端密钥，并附带相应的会话配置。

客户端密钥是短期有效的令牌，可以传递给客户端应用，例如，
Web 前端或移动客户端，从而在避免泄露你的主 API 密钥的前提下，授予其访问 Realtime 接口 的权限。
泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。

你还可以在客户端密钥上附加会话配置选项，这些选项将应用于
使用该客户端密钥创建的所有会话，但这些选项也会被
客户端连接覆盖。

[详细了解通过客户端密钥结合 WebRTC 进行身份验证](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，格式类似 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期时间指的是在此之后
  客户端密钥将无法再用于创建会话的时点。会话本身在开始后
  可以延续到该时间之后继续运行。一个密钥在过期之前可用于创建多个会话，
  直到其过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，即 `seconds` 将被加到客户端密钥的 `created_at` 时间上以生成过期时间戳。仅 `created_at` 是目前受支持的。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择实时模型
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

      - `"realtime"`

    - `audio: optional RealtimeAudioConfig`

      输入和输出音频的配置。

      - `input: optional RealtimeAudioConfigInput`

        - `format: optional RealtimeAudioFormats`

          输入音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本之前等待的时间。
            较高的值可以提高转录准确率，但会增加延迟。
            仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。使用
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            可以提高准确率并降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续先前音频的可选文本
            片段。
            对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
            Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

          语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。这在
              用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话，
              基于当前上下文进行。

              该超时值将在上一个模型响应的音频播放完成后生效，
              即它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              关联到 Response）会在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当发生 VAD start 事件时，是否自动中断（取消）向默认
              会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短暂的停顿时插入。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
              高的阈值会要求更大的音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当发生 VAD stop 事件时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
              会话（即。 `conversation` 的 `auto`)。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应的速度，以原始速度的倍数表示。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

          该参数是在音频生成之后对音频进行的后处理调整，也
          可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回复的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以使用以下字段提供自定义声音对象，例如
          一个 `id`。例如： `{ "id": "voice_1234" }`。一旦模型至少返回过一次音频，
          在会话过程中就无法再更改声音。
          我们建议使用 `marin` 和 `cedar` 以获得最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

          - `ID object { id }`

            自定义语音参考。

            - `id: string`

              自定义语音 ID，例如： `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

      请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
      数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `"gpt-realtime"`

        - `"gpt-realtime-1.5"`

        - `"gpt-realtime-2"`

        - `"gpt-realtime-2.1"`

        - `"gpt-realtime-2.1-mini"`

        - `"gpt-realtime-2025-08-28"`

        - `"gpt-4o-realtime-preview"`

        - `"gpt-4o-realtime-preview-2024-10-01"`

        - `"gpt-4o-realtime-preview-2024-12-17"`

        - `"gpt-4o-realtime-preview-2025-06-03"`

        - `"gpt-4o-mini-realtime-preview"`

        - `"gpt-4o-mini-realtime-preview-2024-12-17"`

        - `"gpt-realtime-mini"`

        - `"gpt-realtime-mini-2025-10-06"`

        - `"gpt-realtime-mini-2025-12-15"`

        - `"gpt-audio-1.5"`

        - `"gpt-audio-mini"`

        - `"gpt-audio-mini-2025-10-06"`

        - `"gpt-audio-mini-2025-12-15"`

    - `output_modalities: optional array of "text" or "audio"`

      模型可以响应的模态集合。默认为 `["audio"]`，表示
      模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
      模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      Whether the model may call multiple tools in parallel. Only supported by
      reasoning Realtime models such as `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      Reference to a prompt template and its variables.
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        The unique identifier of the prompt template to use.

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        Optional map of values to substitute in for variables in your
        prompt. The substitution values can either be strings, or other
        Response input types like images or files.

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送到模型的文件 ID。

          - `image_url: optional string or null`

            发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送到模型的文件输入。

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送到模型的文件内容。

          - `file_id: optional string or null`

            发送到模型的文件 ID。

          - `file_url: optional string`

            发送到模型的文件的 URL。

          - `filename: optional string`

            发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。提供一个字符串模式或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定的 function 工具。

        - `name: string`

          要调用的 function 名称。

        - `type: "function"`

          对于 function 调用，type 始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务标签。

        - `type: "mcp"`

          对于 MCP 工具，type 始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务上调用的工具名称。

    - `tools: optional RealtimeToolsConfig`

      可供模型使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时告诉用户什么的指导
          （如果有）。

        - `name: optional string`

          函数名称。

        - `parameters: optional unknown`

          函数在 JSON Schema 中的参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
          MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持的 `connector_id` 值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
          - Outlook 电子邮件： `connector_outlookemail`
          - SharePoint： `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，也可以是与工具关联的过滤对象
            ，用于需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
          `tunnel_id` 之一，必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
      为某个会话启用追踪 后，配置便无法修改。

      `auto` 将为该会话创建一个追踪，并使用默认值设置
      工作流 名称、group id 和 metadata。

      - `Auto = "auto"`

        启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        针对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
          在追踪仪表板中为该追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

      截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

      截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

        - `retention_ratio: number`

          指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转写会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API，始终为 `transcription` 用于转写会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

          语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。这在
              用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话，
              基于当前上下文进行。

              该超时值将在上一个模型响应的音频播放完成后生效，
              即它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              关联到 Response）会在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当发生 VAD start 事件时，是否自动中断（取消）向默认
              会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短暂的停顿时插入。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
              高的阈值会要求更大的音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当发生 VAD stop 事件时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
              会话（即。 `conversation` 的 `auto`)。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### Returns

- `expires_at: number`

  客户端密钥的过期时间戳，自纪元起以秒为单位。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  实时会话或转录会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

      - `"realtime"`

    - `audio: optional object { input, output }`

      输入和输出音频的配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          输入音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示（如果存在）。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

          语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。这在
              用户长时间停顿属于意外情况的场景下非常有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话，
              基于当前上下文进行。

              该超时值将在上一个模型响应的音频播放完成后生效，
              即它被设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              关联到 Response）会在达到超时时被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当发生 VAD start 事件时，是否自动中断（取消）向默认
              会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短暂的停顿时插入。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
              高的阈值会要求更大的音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当发生 VAD stop 事件时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
              会话（即。 `conversation` 的 `auto`)。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应的速度，以原始速度的倍数表示。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

          该参数是在音频生成之后对音频进行的后处理调整，也
          可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少以音频回复过一次，
          会话期间就无法再更改该声音。当前
          可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          以获得最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

      请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
      数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `"gpt-realtime"`

        - `"gpt-realtime-1.5"`

        - `"gpt-realtime-2"`

        - `"gpt-realtime-2.1"`

        - `"gpt-realtime-2.1-mini"`

        - `"gpt-realtime-2025-08-28"`

        - `"gpt-4o-realtime-preview"`

        - `"gpt-4o-realtime-preview-2024-10-01"`

        - `"gpt-4o-realtime-preview-2024-12-17"`

        - `"gpt-4o-realtime-preview-2025-06-03"`

        - `"gpt-4o-mini-realtime-preview"`

        - `"gpt-4o-mini-realtime-preview-2024-12-17"`

        - `"gpt-realtime-mini"`

        - `"gpt-realtime-mini-2025-10-06"`

        - `"gpt-realtime-mini-2025-12-15"`

        - `"gpt-audio-1.5"`

        - `"gpt-audio-mini"`

        - `"gpt-audio-mini-2025-10-06"`

        - `"gpt-audio-mini-2025-12-15"`

    - `output_modalities: optional array of "text" or "audio"`

      模型可以响应的模态集合。默认为 `["audio"]`，表示
      模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
      模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      Reference to a prompt template and its variables.
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        The unique identifier of the prompt template to use.

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        Optional map of values to substitute in for variables in your
        prompt. The substitution values can either be strings, or other
        Response input types like images or files.

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送到模型的文件 ID。

          - `image_url: optional string or null`

            发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送到模型的文件输入。

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送到模型的文件内容。

          - `file_id: optional string or null`

            发送到模型的文件 ID。

          - `file_url: optional string`

            发送到模型的文件的 URL。

          - `filename: optional string`

            发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。提供一个字符串模式或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定的 function 工具。

        - `name: string`

          要调用的 function 名称。

        - `type: "function"`

          对于 function 调用，type 始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务标签。

        - `type: "mcp"`

          对于 MCP 工具，type 始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      可供模型使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时告诉用户什么的指导
          （如果有）。

        - `name: optional string`

          函数名称。

        - `parameters: optional unknown`

          函数在 JSON Schema 中的参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
          MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持的 `connector_id` 值包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google 日历： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook 日历： `connector_outlookcalendar`
          - Outlook 电子邮件： `connector_outlookemail`
          - SharePoint： `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，也可以是与工具关联的过滤对象
            ，用于需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
          `tunnel_id` 之一，必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
      为某个会话启用追踪 后，配置便无法修改。

      `auto` 将为该会话创建一个追踪，并使用默认值设置
      工作流 名称、group id 和 metadata。

      - `Auto = "auto"`

        启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        针对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
          在追踪仪表板中为该追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

      截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

      截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

        - `retention_ratio: number`

          指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    Realtime 转录会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话的类型。始终为 `transcription` 用于转写会话。

      - `"transcription"`

    - `audio: optional object { input }`

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示（如果存在）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测配置。可设置为 `null` 以关闭。服务端
          VAD 表示模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间（以毫秒为单位）。默认
            500ms。值越小，模型响应越快，
            但可能会在用户短暂的停顿时插入。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            高的阈值会要求更大的音量才能激活模型，
            因此在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测类型，仅 `server_vad` 是目前受支持的。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的附加字段。

      - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `value: string`

  生成的客户端密钥值。

### 示例

```http
curl https://api.openai.com/v1/realtime/client_secrets \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### 响应

```json
{
  "expires_at": 0,
  "session": {
    "id": "id",
    "object": "realtime.session",
    "type": "realtime",
    "audio": {
      "input": {
        "format": {
          "rate": 24000,
          "type": "audio/pcm"
        },
        "noise_reduction": {
          "type": "near_field"
        },
        "transcription": {
          "language": "language",
          "languages": [
            "string"
          ],
          "model": "whisper-1",
          "prompt": "prompt"
        },
        "turn_detection": {
          "type": "server_vad",
          "create_response": true,
          "idle_timeout_ms": 5000,
          "interrupt_response": true,
          "prefix_padding_ms": 0,
          "silence_duration_ms": 0,
          "threshold": 0
        }
      },
      "output": {
        "format": {
          "rate": 24000,
          "type": "audio/pcm"
        },
        "speed": 0.25,
        "voice": "ash"
      }
    },
    "expires_at": 0,
    "include": [
      "item.input_audio_transcription.logprobs"
    ],
    "instructions": "instructions",
    "max_output_tokens": "inf",
    "model": "gpt-realtime",
    "output_modalities": [
      "text"
    ],
    "prompt": {
      "id": "id",
      "variables": {
        "foo": "string"
      },
      "version": "version"
    },
    "reasoning": {
      "effort": "minimal"
    },
    "tool_choice": "none",
    "tools": [
      {
        "description": "description",
        "name": "name",
        "parameters": {},
        "type": "function"
      }
    ],
    "tracing": "auto",
    "truncation": "auto"
  },
  "value": "value"
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/client_secrets \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_after": {
      "anchor": "created_at",
      "seconds": 600
    },
    "session": {
      "type": "realtime",
      "model": "gpt-realtime",
      "instructions": "You are a friendly assistant."
    }
  }'
```

#### 响应

```json
{
  "value": "ek_68af296e8e408191a1120ab6383263c2",
  "expires_at": 1756310470,
  "session": {
    "type": "realtime",
    "object": "realtime.session",
    "id": "sess_C9CiUVUzUzYIssh3ELY1d",
    "model": "gpt-realtime",
    "output_modalities": [
      "audio"
    ],
    "instructions": "You are a friendly assistant.",
    "tools": [],
    "tool_choice": "auto",
    "max_output_tokens": "inf",
    "tracing": null,
    "truncation": "auto",
    "prompt": null,
    "expires_at": 0,
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": null,
        "noise_reduction": null,
        "turn_detection": {
          "type": "server_vad",
        }
      },
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "alloy",
        "speed": 1.0
      }
    },
    "include": null
  }
}
```

## Domain Types

### Client Secret Create Response

- `ClientSecretCreateResponse object { expires_at, session, value }`

  通过为 Realtime API 创建会话和客户端密钥所得到的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，自纪元起以秒为单位。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    实时会话或转录会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

        - `"realtime"`

      - `audio: optional object { input, output }`

        输入和输出音频的配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            输入音频的格式。

            - `PCMAudio object { rate, type }`

              PCM 音频格式。仅支持 24kHz 采样率。

              - `rate: optional 24000`

                音频的采样率。始终为 `24000`.

                - `24000`

              - `type: optional "audio/pcm"`

                音频格式。始终为 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终为 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终为 `audio/pcma`.

                - `"audio/pcma"`

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。这在
                用户长时间停顿属于意外情况的场景下非常有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文进行。

                该超时值将在上一个模型响应的音频播放完成后生效，
                即它被设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                关联到 Response）会在达到超时时被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当发生 VAD start 事件时，是否自动中断（取消）向默认
                会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短暂的停顿时插入。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
                高的阈值会要求更大的音量才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当发生 VAD stop 事件时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
                会话（即。 `conversation` 的 `auto`)。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是在音频生成之后对音频进行的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少以音频回复过一次，
            会话期间就无法再更改该声音。当前
            可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
            以获得最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少以音频回复过一次，
              会话期间就无法再更改该声音。当前
              可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
              以获得最佳质量。

              - `"alloy"`

              - `"ash"`

              - `"ballad"`

              - `"coral"`

              - `"echo"`

              - `"sage"`

              - `"shimmer"`

              - `"verse"`

              - `"marin"`

              - `"cedar"`

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

        请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
        数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          此会话使用的 Realtime 模型。

          - `"gpt-realtime"`

          - `"gpt-realtime-1.5"`

          - `"gpt-realtime-2"`

          - `"gpt-realtime-2.1"`

          - `"gpt-realtime-2.1-mini"`

          - `"gpt-realtime-2025-08-28"`

          - `"gpt-4o-realtime-preview"`

          - `"gpt-4o-realtime-preview-2024-10-01"`

          - `"gpt-4o-realtime-preview-2024-12-17"`

          - `"gpt-4o-realtime-preview-2025-06-03"`

          - `"gpt-4o-mini-realtime-preview"`

          - `"gpt-4o-mini-realtime-preview-2024-12-17"`

          - `"gpt-realtime-mini"`

          - `"gpt-realtime-mini-2025-10-06"`

          - `"gpt-realtime-mini-2025-12-15"`

          - `"gpt-audio-1.5"`

          - `"gpt-audio-mini"`

          - `"gpt-audio-mini-2025-10-06"`

          - `"gpt-audio-mini-2025-12-15"`

      - `output_modalities: optional array of "text" or "audio"`

        模型可以响应的模态集合。默认为 `["audio"]`，表示
        模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
        模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        Reference to a prompt template and its variables.
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          The unique identifier of the prompt template to use.

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          Optional map of values to substitute in for variables in your
          prompt. The substitution values can either be strings, or other
          Response input types like images or files.

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              The type of the input item. Always `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `image_url: optional string or null`

              发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送到模型的文件输入。

            - `type: "input_file"`

              The type of the input item. Always `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送到模型的文件内容。

            - `file_id: optional string or null`

              发送到模型的文件 ID。

            - `file_url: optional string`

              发送到模型的文件的 URL。

            - `filename: optional string`

              发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供一个字符串模式或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
          更多工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项强制模型调用特定的 function 工具。

          - `name: string`

            要调用的 function 名称。

          - `type: "function"`

            对于 function 调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项强制模型调用远程 MCP 服务上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        可供模型使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时告诉用户什么的指导
            （如果有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            函数在 JSON Schema 中的参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 电子邮件： `connector_outlookemail`
            - SharePoint： `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              ，用于需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
            `tunnel_id` 之一，必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        为某个会话启用追踪 后，配置便无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值设置
        工作流 名称、group id 和 metadata。

        - `Auto = "auto"`

          启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          针对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
            在追踪仪表板中为该追踪 命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

        截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型。始终为 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 以关闭。服务端
            VAD 表示模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（以毫秒为单位）。默认
              500ms。值越小，模型响应越快，
              但可能会在用户短暂的停顿时插入。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值会要求更大的音量才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅 `server_vad` 是目前受支持的。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的附加字段。

        - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Session Create Response

- `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

  Realtime 会话配置对象。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `object: "realtime.session"`

    对象类型。始终为 `realtime.session`.

    - `"realtime.session"`

  - `type: "realtime"`

    要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

    - `"realtime"`

  - `audio: optional object { input, output }`

    输入和输出音频的配置。

    - `input: optional object { format, noise_reduction, transcription, turn_detection }`

      - `format: optional RealtimeAudioFormats`

        输入音频的格式。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪的配置。可设置为 `null` 以关闭。
        降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后再次关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型听到的精确内容。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供额外指引。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示（如果存在）。

      - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

        轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

        语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户音频以 "uhhm" 收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已正在响应时，这可能会导致无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。这在
            用户长时间停顿属于意外情况的场景下非常有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话，
            基于当前上下文进行。

            该超时值将在上一个模型响应的音频播放完成后生效，
            即它被设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            关联到 Response）会在达到超时时被发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当发生 VAD start 事件时，是否自动中断（取消）向默认
            会话（即。 `conversation` 的 `auto`) 发出的任何正在进行的响应。如果设为 `true` ，则响应会被取消；否则会继续运行直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。值越小，模型响应越快，
            但可能会在用户短暂的停顿时插入。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。设置更
            高的阈值会要求更大的音量才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当发生 VAD stop 事件时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间，让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否使用输出自动打断任何正在进行的响应，并发送到默认
            会话（即。 `conversation` 的 `auto`)。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应的速度，以原始速度的倍数表示。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中修改。

        该参数是在音频生成之后对音频进行的后处理调整，也
        可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的声音。一旦模型至少以音频回复过一次，
        会话期间就无法再更改该声音。当前
        可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
        以获得最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少以音频回复过一次，
          会话期间就无法再更改该声音。当前
          可选的声音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 用于
          以获得最佳质量。

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的附加字段。

    `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为上（例如“语速快”、“在声音中注入情感”、“经常大笑”）。模型不一定会遵循这些指令，但它们为模型期望的行为提供了指导。

    请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
    数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    此会话使用的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的 Realtime 模型。

      - `"gpt-realtime"`

      - `"gpt-realtime-1.5"`

      - `"gpt-realtime-2"`

      - `"gpt-realtime-2.1"`

      - `"gpt-realtime-2.1-mini"`

      - `"gpt-realtime-2025-08-28"`

      - `"gpt-4o-realtime-preview"`

      - `"gpt-4o-realtime-preview-2024-10-01"`

      - `"gpt-4o-realtime-preview-2024-12-17"`

      - `"gpt-4o-realtime-preview-2025-06-03"`

      - `"gpt-4o-mini-realtime-preview"`

      - `"gpt-4o-mini-realtime-preview-2024-12-17"`

      - `"gpt-realtime-mini"`

      - `"gpt-realtime-mini-2025-10-06"`

      - `"gpt-realtime-mini-2025-12-15"`

      - `"gpt-audio-1.5"`

      - `"gpt-audio-mini"`

      - `"gpt-audio-mini-2025-10-06"`

      - `"gpt-audio-mini-2025-12-15"`

  - `output_modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。默认为 `["audio"]`，表示
    模型将以音频加上文字转录的方式响应。 `["text"]` 可用于让
    模型仅以文本响应。不能同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    Reference to a prompt template and its variables.
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      The unique identifier of the prompt template to use.

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      Optional map of values to substitute in for variables in your
      prompt. The substitution values can either be strings, or other
      Response input types like images or files.

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        A text input to the model.

        - `text: string`

          The text input to the model.

        - `type: "input_text"`

          The type of the input item. Always `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          The type of the input item. Always `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `image_url: optional string or null`

          发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送到模型的文件输入。

        - `type: "input_file"`

          The type of the input item. Always `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送到模型的文件内容。

        - `file_id: optional string or null`

          发送到模型的文件 ID。

        - `file_url: optional string`

          发送到模型的文件的 URL。

        - `filename: optional string`

          发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。提供一个字符串模式或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
      更多工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项强制模型调用特定的 function 工具。

      - `name: string`

        要调用的 function 名称。

      - `type: "function"`

        对于 function 调用，type 始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型调用远程 MCP 服务上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务标签。

      - `type: "mcp"`

        对于 MCP 工具，type 始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    可供模型使用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时告诉用户什么的指导
        （如果有）。

      - `name: optional string`

        函数名称。

      - `parameters: optional unknown`

        函数在 JSON Schema 中的参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器为模型提供额外的工具访问能力。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义的
        MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        使用 `server_url` 以连接远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 电子邮件： `connector_outlookemail`
        - SharePoint： `connector_sharepoint`

        - `"connector_dropbox"`

        - `"connector_gmail"`

        - `"connector_googlecalendar"`

        - `"connector_googledrive"`

        - `"connector_microsoftteams"`

        - `"connector_outlookcalendar"`

        - `"connector_outlookemail"`

        - `"connector_sharepoint"`

      - `defer_loading: optional boolean`

        此 MCP 工具是否为延迟加载工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头，用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，也可以是与工具关联的过滤对象
          ，用于需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值为 `server_url`, `connector_id`，或
        `tunnel_id` 之一，必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的安全 MCP 隧道 ID，用于替代直接的服务端 URL。以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 之一，必须提供其中一个。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
    为某个会话启用追踪 后，配置便无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值设置
    工作流 名称、group id 和 metadata。

    - `Auto = "auto"`

      启用追踪 并设置 追踪 配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      针对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
        筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
        在追踪仪表板中为该追踪 命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

    截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

    截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

      - `retention_ratio: number`

        指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

        - `post_instructions: optional number`

          指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Transcription Session Create Response

- `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

  Realtime 转录会话配置对象。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `object: string`

    对象类型。始终为 `realtime.transcription_session`.

  - `type: "transcription"`

    会话的类型。始终为 `transcription` 用于转写会话。

    - `"transcription"`

  - `audio: optional object { input }`

    会话的输入音频配置。

    - `input: optional object { format, noise_reduction, transcription, turn_detection }`

      - `format: optional RealtimeAudioFormats`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        转录模型的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示（如果存在）。

      - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

        轮次检测配置。可设置为 `null` 以关闭。服务端
        VAD 表示模型将根据
        音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          检测语音停止的静音持续时间（以毫秒为单位）。默认
          500ms。值越小，模型响应越快，
          但可能会在用户短暂的停顿时插入。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          高的阈值会要求更大的音量才能激活模型，
          因此在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测类型，仅 `server_vad` 是目前受支持的。

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的附加字段。

    - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，这必须是 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认
    500ms。值越小，模型响应越快，
    但可能会在用户短暂的停顿时插入。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更大的音量才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅 `server_vad` 是目前受支持的。

# 会话

## 创建会话

**post** `/realtime/sessions`

创建一个临时性的 API 令牌，供客户端应用程序与
Realtime API 一起使用。可以使用与
`session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 包含临时令牌的
key，该 key 是一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以便使用 Realtime API。

返回已创建的 Realtime 会话对象以及一个临时令牌。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于验证连接到
    Realtime API 的临时密钥。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，后者仅应在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转写的配置，默认关闭，开启后可
  设置为 `null` 关闭一次。输入音频转写并非模型原生功能，因为模型会直接消费音频。转写过程以
  异步方式运行，应将其视为粗略参考，
  而非模型所理解的表示。
  rather than the representation understood by the model.

  - `model: optional string`

    用于转写的模型。

- `instructions: optional string`

  在模型调用前默认添加的系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上（例如 "极其简洁"、"表现得友好"、"以下是一些优秀响应的示例"）以及音频行为上（例如 "说话快一点"、"在声音中加入情感"、"经常大笑"）的行为。这些指令不一定会被模型严格遵循，但它们为模型的期望行为提供了指导。
  请注意，服务端会设置默认指令，如果未设置该字段，将使用这些默认指令，并在会话开始时的 `session.created` 事件中可见。

- `max_response_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。请提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
  数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  Reference to a prompt template and its variables.
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    The unique identifier of the prompt template to use.

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    Optional map of values to substitute in for variables in your
    prompt. The substitution values can either be strings, or other
    Response input types like images or files.

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      A text input to the model.

      - `text: string`

        The text input to the model.

      - `type: "input_text"`

        The type of the input item. Always `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送到模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送到模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        The type of the input item. Always `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送到模型的文件 ID。

      - `image_url: optional string or null`

        发送到模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送到模型的文件输入。

      - `type: "input_file"`

        The type of the input item. Always `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送到模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可以低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送到模型的文件内容。

      - `file_id: optional string or null`

        发送到模型的文件 ID。

      - `file_url: optional string`

        发送到模型的文件的 URL。

      - `filename: optional string`

        发送到模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`；边界不会向下舍入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    可选的提示模板版本。

- `speed: optional number`

  模型语音回复的速度。1.0 为默认速度。0.25 为
  最低速度。1.5 为最高速度。此值只能在模型轮次之间更
  改，不能在响应进行中更改。

- `temperature: optional number`

  模型的采样温度，范围限定为 [0.6, 1.2]。默认值为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时告诉用户什么的指导
    （如果有）。

  - `name: optional string`

    函数名称。

  - `parameters: optional unknown`

    函数在 JSON Schema 中的参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  用于追踪的配置选项。设置为 null 可禁用追踪。一旦
  为某个会话启用追踪 后，配置便无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值设置
  工作流 名称、group id 和 metadata。

  - `"auto"`

    该会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    针对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
      在追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
      在追踪仪表板中为该追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话会被截断，即部分消息（从最早的消息开始）不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断前上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

  截断会在下一轮减少缓存的 token 数量（使缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多到最大上下文一定比例的消息，从而减少后续截断的需要，进而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入 token 上限，将返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 限制时，保留一部分对话 token。这样可以在多个轮次之间分摊截断，有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      指令之后要保留的对话 token 比例（`0.0` - `1.0`），用于在对话超过输入 token 限制时生效。将该值设置为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

      - `post_instructions: optional number`

        指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 意味着在指令之后对话超过 5,000 token 时就会发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音量，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认
    500ms。值越小，模型响应越快，
    但可能会在用户短暂的停顿时插入。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更大的音量才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅 `server_vad` 是目前受支持的。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型用于回复的声音。支持的内置声音包括
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`. 你也可以提供一个包含自定义语音对象的
  `id`。例如： `{ "id": "voice_1234" }`. 一旦模型至少用音频响应过一次，
  在会话进行期间就无法再更改语音。

  - `string`

  - `"alloy" or "ash" or "ballad" or 7 more`

    - `"alloy"`

    - `"ash"`

    - `"ballad"`

    - `"coral"`

    - `"echo"`

    - `"sage"`

    - `"shimmer"`

    - `"verse"`

    - `"marin"`

    - `"cedar"`

  - `ID object { id }`

    自定义语音参考。

    - `id: string`

      自定义语音 ID，例如： `voice_1234`.

### Returns

- `id: optional string`

  会话的唯一标识符，形如 `sess_1234567890abcdef`.

- `audio: optional object { input, output }`

  会话的输入和输出音频配置。

  - `input: optional object { format, noise_reduction, transcription, turn_detection }`

    - `format: optional RealtimeAudioFormats`

      PCM 音频格式。仅支持 24kHz 采样率。

      - `PCMAudio object { rate, type }`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `rate: optional 24000`

          音频的采样率。始终为 `24000`.

          - `24000`

        - `type: optional "audio/pcm"`

          音频格式。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `PCMUAudio object { type }`

        G.711 μ-law 格式。

        - `type: optional "audio/pcmu"`

          音频格式。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `PCMAAudio object { type }`

        G.711 A-law 格式。

        - `type: optional "audio/pcma"`

          音频格式。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `noise_reduction: optional object { type }`

      输入音频降噪配置。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转写的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        为输入音频转录配置的提示（如果存在）。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。

      - `prefix_padding_ms: optional number`

      - `silence_duration_ms: optional number`

      - `threshold: optional number`

      - `type: optional string`

        轮次检测类型，仅 `server_vad` 是目前受支持的。

  - `output: optional object { format, speed, voice }`

    - `format: optional RealtimeAudioFormats`

      PCM 音频格式。仅支持 24kHz 采样率。

    - `speed: optional number`

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

      - `string`

      - `"alloy" or "ash" or "ballad" or 7 more`

        - `"alloy"`

        - `"ash"`

        - `"ballad"`

        - `"coral"`

        - `"echo"`

        - `"sage"`

        - `"shimmer"`

        - `"verse"`

        - `"marin"`

        - `"cedar"`

- `expires_at: optional number`

  会话的过期时间戳，以自纪元起的秒数表示。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的附加字段。

  - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  默认的系统指令(即系统消息),会被前置到模型
  调用之前。该字段允许客户端引导模型给出期望的
  响应。可以指示模型在响应内容和格式上如何输出,
  (例如 "保持极其简洁","表现得友好","以下是一些较好的
  响应示例"),以及在音频行为上如何表现(例如 "语速快一些",
  融入你的声音”、“经常大笑”)。这些指令并不保证
  被模型遵循，但它们为模型提供关于期望行为
  的指引。

  请注意,服务端会设置默认指令,当该字段
  未设置时将使用这些默认指令,并且可以在 `session.created` 事件中看到,位于
  会话开始时。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。请提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
  数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string`

  此会话使用的 Realtime 模型。

- `object: optional string`

  对象类型。始终为 `realtime.session`.

- `output_modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `tool_choice: optional string`

  模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时告诉用户什么的指导
    （如果有）。

  - `name: optional string`

    函数名称。

  - `parameters: optional unknown`

    函数在 JSON Schema 中的参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  用于追踪的配置选项。设置为 null 可禁用追踪。一旦
  为某个会话启用追踪 后，配置便无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值设置
  工作流 名称、group id 和 metadata。

  - `"auto"`

    该会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    针对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
      在追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
      在追踪仪表板中为该追踪命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音量，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认
    500ms。值越小，模型响应越快，
    但可能会在用户短暂的停顿时插入。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更大的音量才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅 `server_vad` 是目前受支持的。

### 示例

```http
curl https://api.openai.com/v1/realtime/sessions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "client_secret": {
            "expires_at": 0,
            "value": "value"
          }
        }'
```

#### 响应

```json
{
  "id": "id",
  "audio": {
    "input": {
      "format": {
        "rate": 24000,
        "type": "audio/pcm"
      },
      "noise_reduction": {
        "type": "near_field"
      },
      "transcription": {
        "language": "language",
        "languages": [
          "string"
        ],
        "model": "whisper-1",
        "prompt": "prompt"
      },
      "turn_detection": {
        "prefix_padding_ms": 0,
        "silence_duration_ms": 0,
        "threshold": 0,
        "type": "type"
      }
    },
    "output": {
      "format": {
        "rate": 24000,
        "type": "audio/pcm"
      },
      "speed": 0,
      "voice": "ash"
    }
  },
  "expires_at": 0,
  "include": [
    "item.input_audio_transcription.logprobs"
  ],
  "instructions": "instructions",
  "max_output_tokens": "inf",
  "model": "model",
  "object": "object",
  "output_modalities": [
    "text"
  ],
  "tool_choice": "tool_choice",
  "tools": [
    {
      "description": "description",
      "name": "name",
      "parameters": {},
      "type": "function"
    }
  ],
  "tracing": "auto",
  "turn_detection": {
    "prefix_padding_ms": 0,
    "silence_duration_ms": 0,
    "threshold": 0,
    "type": "type"
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-realtime",
    "modalities": ["audio", "text"],
    "instructions": "You are a friendly assistant."
  }'
```

#### 响应

```json
{
  "id": "sess_001",
  "object": "realtime.session",
  "model": "gpt-realtime-2025-08-25",
  "modalities": ["audio", "text"],
  "instructions": "You are a friendly assistant.",
  "voice": "alloy",
  "input_audio_format": "pcm16",
  "output_audio_format": "pcm16",
  "input_audio_transcription": {
      "model": "whisper-1"
  },
  "turn_detection": null,
  "tools": [],
  "tool_choice": "none",
  "temperature": 0.7,
  "max_response_output_tokens": 200,
  "speed": 1.1,
  "tracing": "auto",
  "client_secret": {
    "value": "ek_abc123", 
    "expires_at": 1234567890
  }
}
```

## Domain Types

### Session Create 响应

- `SessionCreateResponse object { id, audio, expires_at, 10 more }`

  Realtime 会话配置对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: optional object { input, output }`

    会话的输入和输出音频配置。

    - `input: optional object { format, noise_reduction, transcription, turn_detection }`

      - `format: optional RealtimeAudioFormats`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转写的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示（如果存在）。

      - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

        轮次检测的配置。

        - `prefix_padding_ms: optional number`

        - `silence_duration_ms: optional number`

        - `threshold: optional number`

        - `type: optional string`

          轮次检测类型，仅 `server_vad` 是目前受支持的。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        PCM 音频格式。仅支持 24kHz 采样率。

      - `speed: optional number`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的附加字段。

    - `item.input_audio_transcription.logprobs`:在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    默认的系统指令(即系统消息),会被前置到模型
    调用之前。该字段允许客户端引导模型给出期望的
    响应。可以指示模型在响应内容和格式上如何输出,
    (例如 "保持极其简洁","表现得友好","以下是一些较好的
    响应示例"),以及在音频行为上如何表现(例如 "语速快一些",
    融入你的声音”、“经常大笑”)。这些指令并不保证
    被模型遵循，但它们为模型提供关于期望行为
    的指引。

    请注意,服务端会设置默认指令,当该字段
    未设置时将使用这些默认指令,并且可以在 `session.created` 事件中看到,位于
    会话开始时。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或者填 `inf` 以使用给定模型的最大可用 token
    数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string`

    此会话使用的 Realtime 模型。

  - `object: optional string`

    对象类型。始终为 `realtime.session`.

  - `output_modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `tool_choice: optional string`

    模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时告诉用户什么的指导
      （如果有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      函数在 JSON Schema 中的参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    用于追踪的配置选项。设置为 null 可禁用追踪。一旦
    为某个会话启用追踪 后，配置便无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值设置
    工作流 名称、group id 和 metadata。

    - `"auto"`

      该会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      针对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意 metadata，用于在追踪仪表板中启用
        在追踪仪表板中进行筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的工作流 名称。它用于在追踪仪表板中命名该追踪。实际上这里我注意到 markers 是 11_0 包裹 工作流 和 11_1 包裹 追踪，请仔细对应：原始是 工作流 ... 追踪。正确译文如下：
        在追踪仪表板中为该追踪命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 表示模型将根据
    音量，并在用户语音结束时作出响应。

    - `prefix_padding_ms: optional number`

      VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静音持续时间（以毫秒为单位）。默认
      500ms。值越小，模型响应越快，
      但可能会在用户短暂的停顿时插入。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值会要求更大的音量才能激活模型，
      因此在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测类型，仅 `server_vad` 是目前受支持的。

# 转录会话

## 创建转录会话

**post** `/realtime/transcription_sessions`

创建一个临时性的 API 令牌，供客户端应用程序与
专门用于实时转写的 Realtime API。
可以使用与会话相同的参数进行配置 `transcription_session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 包含临时令牌的
key，该 key 是一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以便使用 Realtime API。

返回已创建的 Realtime 转写会话对象以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在转录中包含的项集。当前可用的项包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`,输入音频必须为 16 位 PCM,采样率 24kHz,
  单声道(mono),且采用小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可设置为 `null` 以关闭。
  降噪会在输入音频发送给 VAD 和模型之前，对其添加的音频进行过滤。
  对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确率（减少误报）以及模型性能。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，这些为转录服务提供了额外的指导。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转录文本之前等待的时间。
    较高的值可以提高转录准确率，但会增加延迟。
    仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转录的单词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。使用
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    可以提高准确率并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带有说话人标签的说话人分离时使用。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续先前音频的可选文本
    片段。
    对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“期望与科技相关的词汇”。
    Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认
    500ms。值越小，模型响应越快，
    但可能会在用户短暂的停顿时插入。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更大的音量才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional "server_vad"`

    轮次检测类型。目前仅 `server_vad` 支持转录会话。

    - `"server_vad"`

### Returns

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅当会话
  通过 REST API 在服务端创建时才会出现。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于验证连接到
    Realtime API 的临时密钥。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，后者仅应在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    为输入音频转录配置的提示（如果存在）。

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据
  音量，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（以毫秒为单位）。默认
    500ms。值越小，模型响应越快，
    但可能会在用户短暂的停顿时插入。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更大的音量才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅 `server_vad` 是目前受支持的。

### 示例

```http
curl https://api.openai.com/v1/realtime/transcription_sessions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### 响应

```json
{
  "client_secret": {
    "expires_at": 0,
    "value": "value"
  },
  "input_audio_format": "input_audio_format",
  "input_audio_transcription": {
    "language": "language",
    "languages": [
      "string"
    ],
    "model": "whisper-1",
    "prompt": "prompt"
  },
  "modalities": [
    "text"
  ],
  "turn_detection": {
    "prefix_padding_ms": 0,
    "silence_duration_ms": 0,
    "threshold": 0,
    "type": "type"
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/transcription_sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### 响应

```json
{
  "id": "sess_BBwZc7cFV3XizEyKGDCGL",
  "object": "realtime.transcription_session",
  "modalities": ["audio", "text"],
  "turn_detection": {
    "type": "server_vad",
    "threshold": 0.5,
    "prefix_padding_ms": 300,
    "silence_duration_ms": 200
  },
  "input_audio_format": "pcm16",
  "input_audio_transcription": {
    "model": "gpt-4o-transcribe",
    "language": null,
    "prompt": ""
  },
  "client_secret": null
}
```

## Domain Types

### 转录会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  一个新的 Realtime 转录会话配置。

  当会话在服务端通过 REST API 创建时，会话对象
  还会包含一个临时密钥。密钥的默认 TTL 为 10 分钟。该
  属性在通过 WebSocket API 更新会话时不会出现。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅当会话
    通过 REST API 在服务端创建时才会出现。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌都会在
      一分钟后过期。

    - `value: string`

      可在客户端环境中用于验证连接到
      Realtime API 的临时密钥。请在客户端环境中使用此密钥，而不是
      标准的 API 令牌，后者仅应在 服务端使用。

  - `input_audio_format: optional string`

    输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能的输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      为输入音频转录配置的提示（如果存在）。

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 表示模型将根据
    音量，并在用户语音结束时作出响应。

    - `prefix_padding_ms: optional number`

      VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静音持续时间（以毫秒为单位）。默认
      500ms。值越小，模型响应越快，
      但可能会在用户短暂的停顿时插入。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值会要求更大的音量才能激活模型，
      因此在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测类型，仅 `server_vad` 是目前受支持的。

# 翻译

# 客户端密钥

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并关联一个翻译会话配置。

客户端密钥是短期有效的令牌，可以传递给客户端应用，例如，
例如 Web 前端或移动客户端，可用于访问 Realtime
Translation API 而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义
TTL。

返回已创建的客户端密钥以及生效的翻译会话对象。
该客户端密钥是一个字符串，形如 `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话持续流式传入源音频，
  并持续流式输出翻译后的音频以及转录文本增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流中运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期时间指的是在此之后
  客户端密钥将无法再用于创建会话的时点。会话本身在开始后
  可以延续到该时间之后继续运行。一个密钥在过期之前可用于创建多个会话，
  直到其过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，即 `seconds` 将被加到客户端密钥的 `created_at` 时间上以生成过期时间戳。仅 `created_at` 是目前受支持的。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

### Returns

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，自纪元起以秒为单位。

  - `session: RealtimeTranslationSession`

    Realtime 翻译会话。翻译会话会持续将输入音频翻译为
    已配置的目标语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流中运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      此会话使用的 Realtime 翻译模型。该字段在
      会话创建时设置，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime `translation` 翻译会话，始终为该值。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### 示例

```http
curl https://api.openai.com/v1/realtime/translations/client_secrets \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "session": {
            "model": "model"
          }
        }'
```

#### 响应

```json
{
  "expires_at": 0,
  "session": {
    "id": "id",
    "audio": {
      "input": {
        "noise_reduction": {
          "type": "near_field"
        },
        "transcription": {
          "model": "model"
        }
      },
      "output": {
        "language": "language"
      }
    },
    "expires_at": 0,
    "model": "model",
    "type": "translation"
  },
  "value": "value"
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/translations/client_secrets \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_after": {
      "anchor": "created_at",
      "seconds": 600
    },
    "session": {
      "model": "gpt-realtime-translate",
      "audio": {
        "input": {
          "transcription": {
            "model": "gpt-realtime-whisper"
          },
          "noise_reduction": null
        },
        "output": {
          "language": "es"
        }
      }
    }
  }'
```

#### 响应

```json
{
  "value": "ek_68af296e8e408191a1120ab6383263c2",
  "expires_at": 1756310470,
  "session": {
    "id": "sess_C9CiUVUzUzYIssh3ELY1d",
    "type": "translation",
    "expires_at": 1756310470,
    "model": "gpt-realtime-translate",
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper"
        },
        "noise_reduction": null
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```
