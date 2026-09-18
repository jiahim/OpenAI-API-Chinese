# Realtime

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## Domain Types

### 音频转录

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本之前等待的时长。
    较高的值可以提高转写准确率，但会增加延迟。
    仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
    提供可提高准确率和延迟表现。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续上一段音频
    片段的可选文本。
    对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
    Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

### 会话已创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  在创建会话时返回。在会话创建后立即发出。

  - `conversation: object { id, object }`

    会话资源。

    - `id: optional string`

      会话的唯一 ID。

    - `object: optional string`

      对象类型，必须为 `realtime.conversation`.

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "conversation.created"`

    事件类型，必须为 `conversation.created`.

    - `"conversation.created"`

### 对话项

- `ConversationItem = RealtimeConversationItemSystemMessage or RealtimeConversationItemUserMessage or RealtimeConversationItemAssistantMessage or 6 more`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` ，用于系统消息。

        - `"input_text"`

    - `role: "system"`

      消息发送方的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送方的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    实时对话中的一条助手消息项。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本，如果输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送方的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    实时对话中的一项函数调用项。

    - `arguments: string`

      函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      正在调用的函数名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    实时对话中的一项函数调用输出项。

    - `call_id: string`

      此输出所对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的实时项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      所回复审批请求的 ID。

    - `approve: boolean`

      请求是否被批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    列出 MCP 服务器上可用工具的 Realtime 项。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的其他注解。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      所运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的审批请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      该工具调用的错误（如果有）。

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

      该工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    请求人工批准工具调用的 Realtime 项。

    - `id: string`

      审批请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

### Conversation Item Added

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当某个 Item 被添加到默认会话时由服务端发送。出现这种情况有多种可能：

  - 当客户端发送一个 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。这种情况下，该 item 将是一条包含缓冲区音频的用户消息。
  - 当模型正在生成 Response 时。这种情况下， `conversation.item.added` 事件将在模型开始生成特定的 Item 时发送，因此它此时还没有任何内容（且 `status` 将会是 `in_progress`).

  该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），音频数据除外，音频数据可以通过 `conversation.item.retrieve` 事件单独获取（如果需要）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.added"`

    事件类型，必须为 `conversation.item.added`.

    - `"conversation.item.added"`

  - `previous_item_id: optional string or null`

    位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
    在插入 item 时保持顺序。

### 会话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向对话的上下文中添加一个新 Item，包括消息、函数
  调用以及函数调用响应。该事件既可用于填充对话的
  “历史记录”，也可用于在流式传输过程中添加新 Item，但存在
  当前限制：无法填充助手音频消息。

  如果成功，服务端将发出一个 `conversation.item.added` 事件，并在，
  该 Item 最终确定时发出一个 `conversation.item.done` 事件。否则，将发送一个
  `error` 事件。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.create"`

    事件类型，必须为 `conversation.item.create`.

    - `"conversation.item.create"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

  - `previous_item_id: optional string`

    新 Item 将插入到其后的前一个 Item 的 ID。如果未设置，则新 Item 将追加到对话末尾。

    如果设置为 `root`，则新 Item 将被添加到对话开头。

    如果设置为现有 ID，则允许在对话中间插入一个 Item。如果找不到该 ID，将返回错误，且不会添加该 Item。

### 对话项创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在创建对话项时返回。产生此事件的情况有以下几种：

  - 服务器正在生成 Response，如果成功将生成
    一个或两个 Item，其类型为 `message`
    （role `assistant`）或类型为 `function_call`.
  - 输入音频缓冲区已被提交，可以由客户端或
    服务器（在 `server_vad` 模式下）提交。服务器将获取
    输入音频缓冲区的内容，并将其添加到新的用户消息 Item 中。
  - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
    到该 Conversation。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.created"`

    事件类型，必须为 `conversation.item.created`.

    - `"conversation.item.created"`

  - `previous_item_id: optional string or null`

    Conversation 上下文中前一个项的 ID，允许
    客户端了解对话的顺序。可以为 `null` ，如果该
    项没有前驱项。

### 会话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你想要从对话中移除任何条目时发送此事件
  历史。服务端将响应一个 `conversation.item.deleted` 事件，
  除非该条目在对话历史中不存在,这种情况下服务端
  将响应一个错误。

  - `item_id: string`

    要删除的条目 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 对话项已删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当会话中的某一项被客户端通过以下方式删除时返回：
  `conversation.item.delete` 事件。此事件用于将服务端对会话历史的理解与客户端视图保持同步。
  服务端的会话历史理解与客户端视图。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被删除项的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话项完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  在对话项被最终化时返回。

  该事件将包含该项的完整内容，但音频数据除外，音频数据可在需要时通过以下事件单独获取 `conversation.item.retrieve` 事件获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.done"`

    事件类型，必须为 `conversation.item.done`.

    - `"conversation.item.done"`

  - `previous_item_id: optional string or null`

    位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
    在插入 item 时保持顺序。

### 对话项输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  此事件是写入用户音频缓冲区后，对用户音频进行转录的输出。
  当输入音频缓冲区由客户端或服务端（在启用 VAD 时）提交时，转录随即开始。
  转录与 Response 创建异步进行，因此此事件可能早于或晚于
  Response 事件出现。
  Realtime API 模型原生支持音频，因此输入转录是。

  由一个独立的 ASR（自动语音识别）模型运行的单独过程。
  转录文本可能与模型的解读存在一定差异，
  应被视为一个粗略参考。
  包含音频的内容部分的索引。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含正在转录的音频的条目 ID。

  - `transcript: string`

    转录后的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    转录的使用统计，按 ASR 模型的定价计费，而非实时模型的定价。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 用量计费的模型的使用统计。

      - `input_tokens: number`

        此请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。始终为 `tokens` 对应此变体。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        有关此请求计费输入 token 的详细信息。

        - `audio_tokens: optional number`

          此请求计费的音频 token 数量。

        - `text_tokens: optional number`

          此请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用统计信息。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        usage 对象的类型。始终为 `duration` 对应此变体。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

    - `code: string`

      在音频中检测到的某种语言的代码。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录增量事件

- `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

  当输入音频转录内容部分的文本值使用增量转录结果进行更新时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含正在转录的音频的条目 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    该项目内容数组中内容部分的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。可以通过配置会话来启用这些对数概率， `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于将为此转录块选择的标记的对数概率。这有助于识别给定转录块是否存在多个有效选项的可能性。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  在配置了输入音频转录时返回，并且针对用户消息的转录
  请求失败。这些事件与其他事件分开，以便客户端可以识别相关的 Item。
  `error` events so that the client can identify the related Item.

  - `content_index: number`

    包含音频的内容部分的索引。

  - `error: object { code, message, param, type }`

    转录错误的详细信息。

    - `code: optional string`

      错误代码（如果有）。

    - `message: optional string`

      人类可读的错误消息。

    - `param: optional string`

      与错误相关的参数（如果有）。

    - `type: optional string`

      错误类型。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    用户消息 Item 的 ID。

  - `type: "conversation.item.input_audio_transcription.failed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.failed`.

    - `"conversation.item.input_audio_transcription.failed"`

### 对话项输入音频转录分段

- `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

  在为某个 item 识别出输入音频转写片段时返回。

  - `id: string`

    片段标识符。

  - `content_index: number`

    输入音频内容部分在该 item 中的索引。

  - `end: number`

    片段的结束时间（以秒为单位）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含该输入音频内容的 item 的 ID。

  - `speaker: string`

    为该片段检测到的说话人标签。

  - `start: number`

    片段的开始时间（以秒为单位）。

  - `text: string`

    该片段对应的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### Conversation Item Retrieve Event

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你希望检索服务器对会话历史中某个具体条目的表示时发送该事件。例如，可用于在降噪和 VAD 之后检查用户音频。
  服务器将返回一个 `conversation.item.retrieved` 事件，
  除非该条目在对话历史中不存在,这种情况下服务端
  将响应一个错误。

  - `item_id: string`

    要检索的条目的 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件以截断之前的助手消息音频。服务端
  将以快于实时的速度生成音频，因此当用户
  打断以截断已发送到客户端但尚未
  播放的音频时，此事件非常有用。这将同步服务端对音频的理解与
  客户端的播放进度。

  截断音频将删除 服务端 文本转录，以确保上下文中
  不存在用户尚未听到的文本。

  如果成功，服务端将响应一个 `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    截断音频的截止时长（包含），以毫秒为单位。如果
    audio_end_ms 大于实际音频时长，服务端
    将响应一个错误。

  - `content_index: number`

    要截断的内容部分的索引。将其设置为 `0`.

  - `item_id: string`

    要截断的助手消息项的 ID。仅助手消息
    项可以被截断。

  - `type: "conversation.item.truncate"`

    事件类型，必须为 `conversation.item.truncate`.

    - `"conversation.item.truncate"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 对话项截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当较早的助手音频消息项被客户端通过以下方式截断时返回：
  一个 `conversation.item.truncate` 事件。该事件用于
  使服务端对音频的理解与客户端的播放保持同步。

  此操作将截断音频并移除服务端的文本转录，
  以确保上下文中不存在用户未听到的文本。

  - `audio_end_ms: number`

    音频被截断到的时长（以毫秒为单位）。

  - `content_index: number`

    被截断的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被截断的助手消息项的 ID。

  - `type: "conversation.item.truncated"`

    事件类型，必须为 `conversation.item.truncated`.

    - `"conversation.item.truncated"`

### 引用对话项

- `ConversationItemWithReference object { id, arguments, call_id, 7 more }`

  要添加到对话中的条目。

  - `id: optional string`

    对于类型为 (`message` | `function_call` | `function_call_output`)
    的条目，此字段允许客户端为该条目分配唯一 ID。这
    不是必需的，因为如果未提供，服务端将生成一个。

    对于类型为 `item_reference`，的条目，此字段是必需的，是对话中先前
    存在的任何条目的引用。

  - `arguments: optional string`

    函数调用的参数（适用于 `function_call` 条目）。

  - `call_id: optional string`

    函数调用的 ID（适用于 `function_call` 和
    `function_call_output` 条目）。如果在 `function_call_output`
    条目上传递，服务端将检查具有相同 `function_call` ID 的条目是否存在于对话
    历史记录中。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 条目。

    - 角色为 `system` 的消息条目仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` 内容。

    - `id: optional string`

      要引用的先前对话项的 ID（用于 `item_reference`
      事件中的内容类型）。这些可以引用 `response.create` 由客户端和服务端创建的项。
      客户端和服务端创建的项。

    - `audio: optional string`

      Base64 编码的音频字节，用于 `input_audio` 内容类型。

    - `text: optional string`

      文本内容，用于 `input_text` 和 `text` 内容类型。

    - `transcript: optional string`

      音频的转录文本，用于 `input_audio` 内容类型。

    - `type: optional "input_audio" or "input_text" or "item_reference" or "text"`

      内容类型（`input_text`, `input_audio`, `item_reference`, `text`).

      - `"input_audio"`

      - `"input_text"`

      - `"item_reference"`

      - `"text"`

  - `name: optional string`

    被调用的函数名称（用于 `function_call` 条目）。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符，始终为 `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    函数调用的输出（用于 `function_call_output` 条目）。

  - `role: optional "user" or "assistant" or "system"`

    消息发送者的角色（`user`, `assistant`, `system`），仅
    适用于 `message` 条目。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    该项的状态（`completed`, `incomplete`, `in_progress`）。这些对对话没有影响，
    但出于与
    `conversation.item.created` 事件时。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

  - `type: optional "message" or "function_call" or "function_call_output"`

    该项的类型（`message`, `function_call`, `function_call_output`, `item_reference`).

    - `"message"`

    - `"function_call"`

    - `"function_call_output"`

### Input Audio Buffer Append Event

- `InputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件可将音频字节追加到输入音频缓冲区。该音频
  缓冲区是一种临时存储，你可以向其写入内容，并在稍后提交。“提交”操作会基于缓冲区内容在对话历史中创建一个新的
  用户消息项，并清空缓冲区。
  输入音频转录（若已启用）将在缓冲区提交时生成。

  如果启用了 VAD，则音频缓冲区用于检测语音，并由服务端决定何时
  提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
  输入音频降噪作用于对音频缓冲区的写入操作。

  客户端可以选择在每个事件中放入的音频量，最大为
  15 MiB；例如，客户端流式传输较小的数据块可以使
  VAD 响应更及时。与大多数其他客户端事件不同，服务端
  不会针对此事件发送确认响应。

  - `audio: string`

    Base64 编码的音频字节。必须采用会话配置中
    `input_audio_format` 字段所指定的格式。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 输入音频缓冲区清除事件

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务端将
  响应一个 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### Input Audio Buffer Cleared Event

- `InputAudioBufferClearedEvent object { event_id, type }`

  当输入音频缓冲区被客户端通过以下方式清除时返回：a
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### 输入音频缓冲区提交事件

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会创建来自模型的响应。服务端将响应一个 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 输入音频缓冲区已提交事件

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  在输入音频缓冲区被提交时返回，由客户端触发，或
  在服务端 VAD 模式下自动触发。该 `item_id` 属性为将要创建的用户
  消息项的 ID，因此也会向客户端发送一个 `conversation.item.created` 事件
  。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项将插入到其之后的先前项的 ID。
    如果该项没有前项，可以为 `null` 。

### 输入音频缓冲区 DTMF 事件接收事件

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示
  电话键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
  是用户按下的按键。该 `received_at` 是 UTC Unix 时间戳
  表示服务器收到事件的时间。

  - `event: string`

    用户按下的电话键盘按键。

  - `received_at: number`

    服务器收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### 输入音频缓冲区语音开始事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  由服务端在模式下发送，用于指示已在 `server_vad` 音频缓冲区中检测到语音。只要有音频被添加，就会触发
  此事件（除非已检测到语音）。客户端可能希望使用此
  事件来中断音频播放或向用户提供视觉反馈。
  客户端应预期在语音停止时收到。

  一个 `input_audio_buffer.speech_stopped` 事件
  。该 `item_id` 属性是对应用户消息条目的 ID
  该项目将在语音停止时创建，并也会包含在
  `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
  音频缓冲区）。

  - `audio_start_ms: number`

    从会话期间写入缓冲区的所有音频开始处起算的毫秒数，当语音首次被检测到时。该值对应于
    发送给模型的音频起始位置，因此会包含
    在 Session 中配置的内容。
    `prefix_padding_ms` 在 Session 中配置的。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    语音停止时将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  当以下情况时返回 `server_vad` 服务端在音频缓冲区中检测到语音结束时使用。服务端还会发送
  the audio buffer. The server will also send an `conversation.item.created`
  以及从音频缓冲区创建的用户消息项事件。

  - `audio_end_ms: number`

    语音停止时距离会话开始的毫秒数。这将
    对应于发送给模型的音频末尾，因此包括
    `min_silence_duration_ms` 在 Session 中配置的。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### Input Audio Buffer Timeout Triggered

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  当输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话的设置中配置，
  在 `idle_timeout_ms` 会话的设置中 `turn_detection` 配置，表示在配置的持续时间内未检测到任何语音。
  已超过配置的持续时间未检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段表示从最后一个模型响应之后到触发时刻的音频片段，以从音频写入
  输入音频缓冲区起算的偏移量表示。这意味着它划分了静默的音频片段，
  起始值与结束值之间的差值大致与配置的超时一致。
  起始值与结束值之间的差值大致匹配所配置的超时时长。

  空音频将作为一个 item 提交到对话中 `input_audio` （会有一个
  `input_audio_buffer.committed` 事件），并生成一个模型响应。仍可能存在未触发 VAD 但被模型检测到的语音，因此模型可能用
  与对话相关的内容或提示用户继续说话的内容进行回复。
  相关的内容或提示用户继续说话的内容作为回复。

  - `audio_end_ms: number`

    触发超时时刻，写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    位于最后一个模型响应播放时间之后，写入输入音频缓冲区的音频的毫秒偏移量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    与此音频片段关联的 item 的 ID。

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

### Mcp List Tools Completed

- `McpListToolsCompleted object { event_id, item_id, type }`

  在某个条目上列出 MCP 工具的操作完成时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具条目的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp 列出工具失败

- `McpListToolsFailed object { event_id, item_id, type }`

  当列出某项的 MCP 工具失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具条目的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp List Tools In Progress

- `McpListToolsInProgress object { event_id, item_id, type }`

  在某个项目的 MCP 工具列表进行中时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具条目的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 降噪类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### Output Audio Buffer Clear Event

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP：** 发送以中止当前音频响应。这将触发服务端
  停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
  事件应之前发送一个 `response.cancel` 客户端事件来停止
  当前响应的生成。
  [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### Rate Limits Updated Event

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，用于指示已更新的速率限制。
  创建 Response 时，会有一部分 token 被“预留”用于输出
  token，此处显示的速率限制反映了该预留情况，并会在
  Response 完成后相应进行调整。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

    速率限制信息的列表。

    - `limit: optional number`

      速率限制所允许的最大值。

    - `name: optional "requests" or "tokens"`

      速率限制的名称（`requests`, `tokens`).

      - `"requests"`

      - `"tokens"`

    - `remaining: optional number`

      达到限制前的剩余值。

    - `reset_seconds: optional number`

      速率限制重置前的秒数。

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

      输入音频降噪的配置。可以设置为 `null` 以关闭。
      降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时长。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
        提供可提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频
        片段的可选文本。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。该参数在
          用户长时间停顿出乎意料的情况下很有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话。
          当前上下文。

          超时值将在上一个模型响应的音频播放结束后应用，
          即设置为该 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 关联）将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）向默认
          对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
          为 500ms。使用较短的值时，模型响应会更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
          阈值要求更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时已结束说话。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
          对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应的速度，以原始速度的倍数表示。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

      该参数是对生成后音频的后处理调整，
      也可以提示模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
      一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
      在会话期间无法再更改声音。
      我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

          自定义语音 ID，例如 `voice_1234`.

### 实时音频配置输入

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

    输入音频降噪的配置。可以设置为 `null` 以关闭。
    降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本之前等待的时长。
      较高的值可以提高转写准确率，但会增加延迟。
      仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
      提供可提高准确率和延迟表现。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续上一段音频
      片段的可选文本。
      对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
      Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

      - `type: "server_vad"`

        轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

        如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。该参数在
        用户长时间停顿出乎意料的情况下很有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话。
        当前上下文。

        超时值将在上一个模型响应的音频播放结束后应用，
        即设置为该 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 关联）将在达到超时时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）向默认
        对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

        如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
        为 500ms。使用较短的值时，模型响应会更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
        阈值要求更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时已结束说话。

      - `type: "semantic_vad"`

        轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
        对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

### 实时音频配置输出

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
    1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

    该参数是对生成后音频的后处理调整，
    也可以提示模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型回应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
    一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
    在会话期间无法再更改声音。
    我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

        自定义语音 ID，例如 `voice_1234`.

### 实时音频格式

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

### 实时音频输入轮次检测

- `RealtimeAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

    - `type: "server_vad"`

      轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

      如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超过该时间后将自动触发模型响应。该参数在
      用户长时间停顿出乎意料的情况下很有用，例如电话
      通话。模型将根据当前上下文有效地提示用户继续对话。
      当前上下文。

      超时值将在上一个模型响应的音频播放结束后应用，
      即设置为该 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与 Response 关联）将在达到超时时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）向默认
      对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

      如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
      为 500ms。使用较短的值时，模型响应会更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
      阈值要求更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来判断用户何时已结束说话。

    - `type: "semantic_vad"`

      轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
      对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

### 实时客户端事件

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向对话的上下文中添加一个新 Item，包括消息、函数
    调用以及函数调用响应。该事件既可用于填充对话的
    “历史记录”，也可用于在流式传输过程中添加新 Item，但存在
    当前限制：无法填充助手音频消息。

    如果成功，服务端将发出一个 `conversation.item.added` 事件，并在，
    该 Item 最终确定时发出一个 `conversation.item.done` 事件。否则，将发送一个
    `error` 事件。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送方的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          正在调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的一项函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的实时项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所回复审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器上可用工具的 Realtime 项。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的其他注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联的审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          该工具调用的错误（如果有）。

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

          该工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        请求人工批准工具调用的 Realtime 项。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.create"`

      事件类型，必须为 `conversation.item.create`.

      - `"conversation.item.create"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

    - `previous_item_id: optional string`

      新 Item 将插入到其后的前一个 Item 的 ID。如果未设置，则新 Item 将追加到对话末尾。

      如果设置为 `root`，则新 Item 将被添加到对话开头。

      如果设置为现有 ID，则允许在对话中间插入一个 Item。如果找不到该 ID，将返回错误，且不会添加该 Item。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你想要从对话中移除任何条目时发送此事件
    历史。服务端将响应一个 `conversation.item.deleted` 事件，
    除非该条目在对话历史中不存在,这种情况下服务端
    将响应一个错误。

    - `item_id: string`

      要删除的条目 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你希望检索服务器对会话历史中某个具体条目的表示时发送该事件。例如，可用于在降噪和 VAD 之后检查用户音频。
    服务器将返回一个 `conversation.item.retrieved` 事件，
    除非该条目在对话历史中不存在,这种情况下服务端
    将响应一个错误。

    - `item_id: string`

      要检索的条目的 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件以截断之前的助手消息音频。服务端
    将以快于实时的速度生成音频，因此当用户
    打断以截断已发送到客户端但尚未
    播放的音频时，此事件非常有用。这将同步服务端对音频的理解与
    客户端的播放进度。

    截断音频将删除 服务端 文本转录，以确保上下文中
    不存在用户尚未听到的文本。

    如果成功，服务端将响应一个 `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      截断音频的截止时长（包含），以毫秒为单位。如果
      audio_end_ms 大于实际音频时长，服务端
      将响应一个错误。

    - `content_index: number`

      要截断的内容部分的索引。将其设置为 `0`.

    - `item_id: string`

      要截断的助手消息项的 ID。仅助手消息
      项可以被截断。

    - `type: "conversation.item.truncate"`

      事件类型，必须为 `conversation.item.truncate`.

      - `"conversation.item.truncate"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件可将音频字节追加到输入音频缓冲区。该音频
    缓冲区是一种临时存储，你可以向其写入内容，并在稍后提交。“提交”操作会基于缓冲区内容在对话历史中创建一个新的
    用户消息项，并清空缓冲区。
    输入音频转录（若已启用）将在缓冲区提交时生成。

    如果启用了 VAD，则音频缓冲区用于检测语音，并由服务端决定何时
    提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
    输入音频降噪作用于对音频缓冲区的写入操作。

    客户端可以选择在每个事件中放入的音频量，最大为
    15 MiB；例如，客户端流式传输较小的数据块可以使
    VAD 响应更及时。与大多数其他客户端事件不同，服务端
    不会针对此事件发送确认响应。

    - `audio: string`

      Base64 编码的音频字节。必须采用会话配置中
      `input_audio_format` 字段所指定的格式。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务端将
    响应一个 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP：** 发送以中止当前音频响应。这将触发服务端
    停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
    事件应之前发送一个 `response.cancel` 客户端事件来停止
    当前响应的生成。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会创建来自模型的响应。服务端将响应一个 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消正在进行的响应。服务端将响应一个
    包含状态为 `response.done` 的事件。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。
    如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。
    即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `response.cancel` 即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。
    即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

    - `response_id: optional string`

      要取消的特定响应 ID——如果未提供，将取消默认对话中正在进行的响应。
      在默认对话中正在进行的响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务端创建一个 Response，这意味着会触发模型推理。在 Server VAD 模式下，服务端会自动创建 Response。
    模型推理。在 Server VAD 模式下，服务端会自动创建 Response。
    会自动创建 Response。

    一个 Response 至少包含一个 Item，也可能包含两个，其中第二个是函数调用。这些 Item 默认会追加到对话历史中。
    是函数调用。这些 Item 默认会追加到对话历史中。
    对话历史中。

    服务器将返回一个 `response.created` 事件、已创建 Item 和内容的事件，以及最终的
    事件，以及最终的 `response.done` 事件，以表示
    Response 已完成。

    该 `response.create` event 包含如下推理配置：
    `instructions` 和 `tools`。如果设置了这些字段，它们将仅针对本次 Response 覆盖 Session 的
    配置。

    Response 可以在默认 Conversation 之外创建，这意味着它们可以
    包含任意输入，并且可以禁止将输出写入 Conversation。
    同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行创建多个
    Response。 `metadata` 字段是区分多个同时发起的 Response 的好方法。
    同时发起的多个 Response。

    客户端可以设置 `conversation` 为 `none` 来创建一个不写入默认 Conversation 的 Response。可以使用
    字段提供任意输入，该字段是一个接受 `input` 原始 Item 和对已有 Item 引用的数组。
    原始 Item 和对已有 Item 引用的数组。

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

    - `response: optional RealtimeResponseCreateParams`

      使用以下参数创建一个新的 Realtime response

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

            模型回应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
            一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
            在会话期间无法再更改声音。
            我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

                自定义语音 ID，例如 `voice_1234`.

      - `conversation: optional string or "auto" or "none"`

        控制 response 被添加到哪个会话。当前支持
        `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
        表示响应的内容将被添加到默认
        对话中。将其设置为 `none` 以创建一个不会向默认对话添加项目的
        带外响应。

        - `string`

        - `"auto" or "none"`

          控制 response 被添加到哪个会话。当前支持
          `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
          表示响应的内容将被添加到默认
          对话中。将其设置为 `none` 以创建一个不会向默认对话添加项目的
          带外响应。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        包含在模型提示中的输入项。使用此字段
        会为本次 Response 创建一个新的上下文，而不是使用默认
        对话。空数组 `[]` 将清除本次 Response 的上下文。
        请注意，这可以包括对会话中先前出现的项目的引用，
        通过它们的 id。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          实时对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          实时对话中的一项函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          实时对话中的一项函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的实时项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          列出 MCP 服务器上可用工具的 Realtime 项。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime 项。

      - `instructions: optional string`

        默认系统指令（即系统消息）会被前置到模型调用中。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“保持极度简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为（例如“说话快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
        请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以获取给定模型的
        最大可用 token 数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        由 16 组键值对组成的集合，可以附加到对象上。可用于
        以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
        查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串，
        最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前可能的取值仅有
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
        输出设置为 mode `text` 将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可并行调用多个工具。仅支持
        reasoning Realtime models such as `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射，用于为你的
          提示中的变量替换值。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `image_url: optional string or null`

              要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的输入文件。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件内容。

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `file_url: optional string`

              要发送给模型的文件 URL。

            - `filename: optional string`

              要发送给模型的文件名。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用它的指导，
            以及关于调用时告知用户哪些信息的指导。
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

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

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
            服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
            流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            通过安全 MCP 隧道连接。

            当前支持的值 `connector_id` 包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google Calendar： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook Calendar： `connector_outlookcalendar`
            - Outlook Email： `connector_outlookemail`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。取值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新除
    之外的任何字段； `voice` 和 `model`. `voice` 只有在尚未产生其他音频输出时才能更新。

    当服务器收到 `session.update`，时，它将响应
    包含状态为 `session.updated` 事件，展示完整且生效的配置。
    只有 `session.update` 中出现的字段会被更新。若要清除某个字段，例如
    `instructions`，请传入空字符串。若要清除某个字段，例如 `tools`，请传入空数组。
    若要清除某个字段，例如 `turn_detection`，请传入 `null`.

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。可选择 realtime
      会话或转录会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。始终为 Realtime API 的 `realtime` 。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可以设置为 `null` 以关闭。
              降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在输出转写文本之前等待的时长。
                较高的值可以提高转写准确率，但会增加延迟。
                仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。在
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
                提供可提高准确率和延迟表现。

              - `languages: optional array of string`

                输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                用于引导模型风格或延续上一段音频
                片段的可选文本。
                对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
                Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

                - `type: "server_vad"`

                  轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                  如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                  用户长时间停顿出乎意料的情况下很有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话。
                  当前上下文。

                  超时值将在上一个模型响应的音频播放结束后应用，
                  即设置为该 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 关联）将在达到超时时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）向默认
                  对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                  如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                  为 500ms。使用较短的值时，模型响应会更快，
                  但可能会在用户短暂停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                  阈值要求更响亮的音频才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时已结束说话。

                - `type: "semantic_vad"`

                  轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                  对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应的速度，以原始速度的倍数表示。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

              该参数是对生成后音频的后处理调整，
              也可以提示模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型回应的声音。支持的内置声音有
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
              一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
              在会话期间无法再更改声音。
              我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

                  自定义语音 ID，例如 `voice_1234`.

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          服务端输出中要包含的其他字段。

          `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

          请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 以获取给定模型的
          最大可用 token 数。默认为 `inf`.

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
          模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
          模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可并行调用多个工具。仅支持
          reasoning Realtime models such as `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `reasoning: optional RealtimeReasoning`

          支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪些工具（如果有）。

            `none` 表示模型将不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或
            多个工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项可强制模型调用特定的函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `tools: optional RealtimeToolsConfig`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              该 MCP 服务器的标签，用于在工具调用中标识它。

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

                允许的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
              服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
              流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
              通过安全 MCP 隧道连接。

              当前支持的值 `connector_id` 包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google Calendar： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook Calendar： `connector_outlookcalendar`
              - Outlook Email： `connector_outlookemail`
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

              该 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                ，这些工具需要审批。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据，还是只读。如果 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据，还是只读。如果 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。取值之一为 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
              `tunnel_id` 之一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
              `server_url`, `connector_id`，或 `tunnel_id` 之一。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
          为某个会话启用追踪，就无法再修改其配置。

          `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
          工作流名称、分组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            对追踪进行更细粒度的配置。

            - `group_id: optional string`

              附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
              分组。

            - `metadata: optional unknown`

              附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
              过滤。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称。这用于
              在 Traces Dashboard 中为该追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

          客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

          截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

          截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

            - `retention_ratio: number`

              在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

              - `post_instructions: optional number`

                指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转写会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。始终为 Realtime API 的 `transcription` 用于转写会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可以设置为 `null` 以关闭。
              降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

                - `type: "server_vad"`

                  轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                  如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                  用户长时间停顿出乎意料的情况下很有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话。
                  当前上下文。

                  超时值将在上一个模型响应的音频播放结束后应用，
                  即设置为该 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 关联）将在达到超时时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）向默认
                  对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                  如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                  为 500ms。使用较短的值时，模型响应会更快，
                  但可能会在用户短暂停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                  阈值要求更响亮的音频才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时已结束说话。

                - `type: "semantic_vad"`

                  轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                  对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          服务端输出中要包含的其他字段。

          `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。这是一个客户端可以自行指定的任意字符串。如果该事件出现错误，它会被传回，但相应的 `session.updated` 事件中不会包含它。

### Realtime Conversation Item Assistant Message

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  实时对话中的一条助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

    - `text: optional string`

      文本内容。

    - `transcript: optional string`

      音频内容的转录文本，如果输出类型为 `audio`.

    - `type: optional "output_text" or "output_audio"`

      内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

      - `"output_text"`

      - `"output_audio"`

  - `role: "assistant"`

    消息发送方的角色。始终为 `assistant`.

    - `"assistant"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务器生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime Conversation Item Function Call

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  实时对话中的一项函数调用项。

  - `arguments: string`

    函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    正在调用的函数名称。

  - `type: "function_call"`

    条目的类型。始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务器生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime Conversation Item Function Call Output

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  实时对话中的一项函数调用输出项。

  - `call_id: string`

    此输出所对应的函数调用的 ID。

  - `output: string`

    函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

  - `type: "function_call_output"`

    条目的类型。始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务器生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime Conversation Item System Message

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。始终为 `input_text` ，用于系统消息。

      - `"input_text"`

  - `role: "system"`

    消息发送方的角色。始终为 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务器生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime Conversation Item User Message

- `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

  Realtime 对话中的用户消息条目。

  - `content: array of object { audio, detail, image_url, 3 more }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

    - `detail: optional "auto" or "low" or "high"`

      图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

    - `text: optional string`

      文本内容（针对 `input_text`).

    - `transcript: optional string`

      音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

    - `type: optional "input_text" or "input_audio" or "input_image"`

      内容类型（`input_text`, `input_audio`，或 `input_image`).

      - `"input_text"`

      - `"input_audio"`

      - `"input_image"`

  - `role: "user"`

    消息发送方的角色。始终为 `user`.

    - `"user"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务器生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime Error

- `RealtimeError object { message, type, code, 2 more }`

  错误的详细信息。

  - `message: string`

    人类可读的错误消息。

  - `type: string`

    错误的类型（例如，“invalid_request_error”、“server_error”）。

  - `code: optional string or null`

    错误代码（如果有）。

  - `event_id: optional string or null`

    导致错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如果有）。

### 实时错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  在发生错误时返回，错误可能源自客户端或服务端
  问题。大多数错误都是可恢复的，会话将保持打开状态，我们
  建议实现者默认监控并记录错误消息。

  - `error: RealtimeError`

    错误的详细信息。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误的类型（例如，“invalid_request_error”、“server_error”）。

    - `code: optional string or null`

      错误代码（如果有）。

    - `event_id: optional string or null`

      导致错误的客户端事件的 event_id（如果适用）。

    - `param: optional string or null`

      与错误相关的参数（如果有）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "error"`

    事件类型，必须为 `error`.

    - `"error"`

### Realtime Function Tool

- `RealtimeFunctionTool object { description, name, parameters, type }`

  - `description: optional string`

    函数的描述，包括何时以及如何调用它的指导，
    以及关于调用时告知用户哪些信息的指导。
    （如果有的话）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    使用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

### Realtime Mcp Approval Request

- `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

  请求人工批准工具调用的 Realtime 项。

  - `id: string`

    审批请求的唯一 ID。

  - `arguments: string`

    工具参数的 JSON 字符串。

  - `name: string`

    要运行的工具名称。

  - `server_label: string`

    发起请求的 MCP 服务器的标签。

  - `type: "mcp_approval_request"`

    条目的类型。始终为 `mcp_approval_request`.

    - `"mcp_approval_request"`

### Realtime Mcp Approval Response

- `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

  响应 MCP 审批请求的实时项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    所回复审批请求的 ID。

  - `approve: boolean`

    请求是否被批准。

  - `type: "mcp_approval_response"`

    条目的类型。始终为 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    可选的决策原因。

### Realtime Mcp List Tools

- `RealtimeMcpListTools object { server_label, tools, type, id }`

  列出 MCP 服务器上可用工具的 Realtime 项。

  - `server_label: string`

    MCP 服务器的标签。

  - `tools: array of object { input_schema, name, annotations, description }`

    服务器上可用的工具。

    - `input_schema: unknown`

      描述工具输入的 JSON schema。

    - `name: string`

      工具的名称。

    - `annotations: optional unknown or null`

      关于该工具的其他注解。

    - `description: optional string or null`

      工具的描述。

  - `type: "mcp_list_tools"`

    条目的类型。始终为 `mcp_list_tools`.

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

  表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

  - `id: string`

    该工具调用的唯一 ID。

  - `arguments: string`

    传递给该工具的参数的 JSON 字符串。

  - `name: string`

    所运行工具的名称。

  - `server_label: string`

    运行该工具的 MCP 服务器的标签。

  - `type: "mcp_call"`

    条目的类型。始终为 `mcp_call`.

    - `"mcp_call"`

  - `approval_request_id: optional string or null`

    关联的审批请求的 ID（如果有）。

  - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

    该工具调用的错误（如果有）。

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

    该工具调用的输出。

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

  支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

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

    响应的唯一 ID，格式类似 `resp_1234`.

  - `audio: optional object { output }`

    音频输出配置。

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

        模型用于回复的声音。在模型至少回复过一次音频后，无法在该
        会话中再次更改声音。当前
        可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。在模型至少回复过一次音频后，无法在该
          会话中再次更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

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

    响应所加入的对话，由 `conversation`
    字段位于 `response.create` 事件中。如果 `auto`，响应将被添加到
    默认对话中，且该字段的值将 `conversation_id` 为一个类似
    `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `none`，的 ID，响应不会被添加到任何对话中，
    该字段的值为 `conversation_id` 将会是 `null`。如果响应是通过
    VAD 自动触发的，则该响应将被添加到默认对话中

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    （包括工具调用），该 ID 在本次响应中被使用。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    由 16 组键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
    查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅有
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
    输出设置为 mode `text` 将禁用模型的音频输出。

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
      当 `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      响应未完成的原因。对于 `cancelled` 响应，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并中断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      字段（ `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    响应的使用统计信息，将用于计费。
    Realtime API 会话将维护对话上下文并将新的
    项追加到对话中，因此先前轮次的输出（文本和
    音频令牌）将作为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      响应中使用的输入令牌的详细信息。缓存令牌是来自对话先前轮次的令牌，它们作为当前响应的上下文被包含在内。此处的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和未缓存令牌。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数。

      - `cached_tokens: optional number`

        用作 Response 输入的已缓存 token 数。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        用作 Response 输入的已缓存 token 的详细信息。

        - `audio_tokens: optional number`

          用作 Response 输入的已缓存音频 token 数。

        - `image_tokens: optional number`

          用作 Response 输入的已缓存图像 token 数。

        - `text_tokens: optional number`

          用作 Response 输入的已缓存文本 token 数。

      - `image_tokens: optional number`

        用作 Response 输入的图像 token 数。

      - `text_tokens: optional number`

        用作 Response 输入的文本 token 数。

    - `input_tokens: optional number`

      Response 中使用的输入 token 数，包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      Response 中使用的输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数，包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中的总 token 数，包括输入和输出
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

      模型回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
      一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
      在会话期间无法再更改声音。
      我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

          自定义语音 ID，例如 `voice_1234`.

### Realtime Response Create Params

- `RealtimeResponseCreateParams object { audio, conversation, input, 9 more }`

  使用以下参数创建一个新的 Realtime response

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

        模型回应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
        一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
        在会话期间无法再更改声音。
        我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

            自定义语音 ID，例如 `voice_1234`.

  - `conversation: optional string or "auto" or "none"`

    控制 response 被添加到哪个会话。当前支持
    `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
    表示响应的内容将被添加到默认
    对话中。将其设置为 `none` 以创建一个不会向默认对话添加项目的
    带外响应。

    - `string`

    - `"auto" or "none"`

      控制 response 被添加到哪个会话。当前支持
      `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个不会向默认对话添加项目的
      带外响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    包含在模型提示中的输入项。使用此字段
    会为本次 Response 创建一个新的上下文，而不是使用默认
    对话。空数组 `[]` 将清除本次 Response 的上下文。
    请注意，这可以包括对会话中先前出现的项目的引用，
    通过它们的 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    默认系统指令（即系统消息）会被前置到模型调用中。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“保持极度简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为（例如“说话快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
    请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以获取给定模型的
    最大可用 token 数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    由 16 组键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
    查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅有
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
    输出设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可并行调用多个工具。仅支持
    reasoning Realtime models such as `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射，用于为你的
      提示中的变量替换值。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `image_url: optional string or null`

          要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的输入文件。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件内容。

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `file_url: optional string`

          要发送给模型的文件 URL。

        - `filename: optional string`

          要发送给模型的文件名。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，type 始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，type 始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用它的指导，
        以及关于调用时告知用户哪些信息的指导。
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        使用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        该 MCP 服务器的标签，用于在工具调用中标识它。

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

          允许的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
        服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
        流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
        通过安全 MCP 隧道连接。

        当前支持的值 `connector_id` 包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google Calendar： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook Calendar： `connector_outlookcalendar`
        - Outlook Email： `connector_outlookemail`
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

        该 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。取值之一为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Realtime Response Status

- `RealtimeResponseStatus object { error, reason, type }`

  关于该状态的更多详细信息。

  - `error: optional object { code, type }`

    导致响应失败的原因描述，
    当 `status` 为 `failed`.

    - `code: optional string`

      错误代码（如果有）。

    - `type: optional string`

      错误类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    响应未完成的原因。对于 `cancelled` 响应，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并中断了响应）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致响应失败的错误类型，对应
    字段（ `status` 字段（`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime Response Usage

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  响应的使用统计信息，将用于计费。
  Realtime API 会话将维护对话上下文并将新的
  项追加到对话中，因此先前轮次的输出（文本和
  音频令牌）将作为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    响应中使用的输入令牌的详细信息。缓存令牌是来自对话先前轮次的令牌，它们作为当前响应的上下文被包含在内。此处的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和未缓存令牌。

    - `audio_tokens: optional number`

      用作 Response 输入的音频 token 数。

    - `cached_tokens: optional number`

      用作 Response 输入的已缓存 token 数。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      用作 Response 输入的已缓存 token 的详细信息。

      - `audio_tokens: optional number`

        用作 Response 输入的已缓存音频 token 数。

      - `image_tokens: optional number`

        用作 Response 输入的已缓存图像 token 数。

      - `text_tokens: optional number`

        用作 Response 输入的已缓存文本 token 数。

    - `image_tokens: optional number`

      用作 Response 输入的图像 token 数。

    - `text_tokens: optional number`

      用作 Response 输入的文本 token 数。

  - `input_tokens: optional number`

    Response 中使用的输入 token 数，包括文本和
    音频 token。

  - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

    Response 中使用的输出 token 的详细信息。

    - `audio_tokens: optional number`

      Response 中使用的音频 token 数。

    - `text_tokens: optional number`

      Response 中使用的文本 token 数。

  - `output_tokens: optional number`

    Response 中发送的输出 token 数，包括文本和
    音频 token。

  - `total_tokens: optional number`

    Response 中的总 token 数，包括输入和输出
    文本及音频 token。

### Realtime Response Usage Input Token Details

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  响应中使用的输入令牌的详细信息。缓存令牌是来自对话先前轮次的令牌，它们作为当前响应的上下文被包含在内。此处的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和未缓存令牌。

  - `audio_tokens: optional number`

    用作 Response 输入的音频 token 数。

  - `cached_tokens: optional number`

    用作 Response 输入的已缓存 token 数。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    用作 Response 输入的已缓存 token 的详细信息。

    - `audio_tokens: optional number`

      用作 Response 输入的已缓存音频 token 数。

    - `image_tokens: optional number`

      用作 Response 输入的已缓存图像 token 数。

    - `text_tokens: optional number`

      用作 Response 输入的已缓存文本 token 数。

  - `image_tokens: optional number`

    用作 Response 输入的图像 token 数。

  - `text_tokens: optional number`

    用作 Response 输入的文本 token 数。

### Realtime Response Usage Output Token Details

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  Response 中使用的输出 token 的详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数。

### Realtime Server Event

- `RealtimeServerEvent = ConversationCreatedEvent or ConversationItemCreatedEvent or ConversationItemDeletedEvent or 43 more`

  一个实时服务端事件。

  - `ConversationCreatedEvent object { conversation, event_id, type }`

    在创建会话时返回。在会话创建后立即发出。

    - `conversation: object { id, object }`

      会话资源。

      - `id: optional string`

        会话的唯一 ID。

      - `object: optional string`

        对象类型，必须为 `realtime.conversation`.

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "conversation.created"`

      事件类型，必须为 `conversation.created`.

      - `"conversation.created"`

  - `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

    在创建对话项时返回。产生此事件的情况有以下几种：

    - 服务器正在生成 Response，如果成功将生成
      一个或两个 Item，其类型为 `message`
      （role `assistant`）或类型为 `function_call`.
    - 输入音频缓冲区已被提交，可以由客户端或
      服务器（在 `server_vad` 模式下）提交。服务器将获取
      输入音频缓冲区的内容，并将其添加到新的用户消息 Item 中。
    - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
      到该 Conversation。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送方的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          正在调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的一项函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的实时项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所回复审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器上可用工具的 Realtime 项。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的其他注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联的审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          该工具调用的错误（如果有）。

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

          该工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        请求人工批准工具调用的 Realtime 项。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.created"`

      事件类型，必须为 `conversation.item.created`.

      - `"conversation.item.created"`

    - `previous_item_id: optional string or null`

      Conversation 上下文中前一个项的 ID，允许
      客户端了解对话的顺序。可以为 `null` ，如果该
      项没有前驱项。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当会话中的某一项被客户端通过以下方式删除时返回：
    `conversation.item.delete` 事件。此事件用于将服务端对会话历史的理解与客户端视图保持同步。
    服务端的会话历史理解与客户端视图。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被删除项的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    此事件是写入用户音频缓冲区后，对用户音频进行转录的输出。
    当输入音频缓冲区由客户端或服务端（在启用 VAD 时）提交时，转录随即开始。
    转录与 Response 创建异步进行，因此此事件可能早于或晚于
    Response 事件出现。
    Realtime API 模型原生支持音频，因此输入转录是。

    由一个独立的 ASR（自动语音识别）模型运行的单独过程。
    转录文本可能与模型的解读存在一定差异，
    应被视为一个粗略参考。
    包含音频的内容部分的索引。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含正在转录的音频的条目 ID。

    - `transcript: string`

      转录后的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      转录的使用统计，按 ASR 模型的定价计费，而非实时模型的定价。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 用量计费的模型的使用统计。

        - `input_tokens: number`

          此请求计费的输入 token 数。

        - `output_tokens: number`

          生成的输出 token 数。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          usage 对象的类型。始终为 `tokens` 对应此变体。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          有关此请求计费输入 token 的详细信息。

          - `audio_tokens: optional number`

            此请求计费的音频 token 数量。

          - `text_tokens: optional number`

            此请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的使用统计信息。

        - `seconds: number`

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          usage 对象的类型。始终为 `duration` 对应此变体。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠地检测到任何语言。

      - `code: string`

        在音频中检测到的某种语言的代码。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

    当输入音频转录内容部分的文本值使用增量转录结果进行更新时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含正在转录的音频的条目 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      该项目内容数组中内容部分的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。可以通过配置会话来启用这些对数概率， `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于将为此转录块选择的标记的对数概率。这有助于识别给定转录块是否存在多个有效选项的可能性。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    在配置了输入音频转录时返回，并且针对用户消息的转录
    请求失败。这些事件与其他事件分开，以便客户端可以识别相关的 Item。
    `error` events so that the client can identify the related Item.

    - `content_index: number`

      包含音频的内容部分的索引。

    - `error: object { code, message, param, type }`

      转录错误的详细信息。

      - `code: optional string`

        错误代码（如果有）。

      - `message: optional string`

        人类可读的错误消息。

      - `param: optional string`

        与错误相关的参数（如果有）。

      - `type: optional string`

        错误类型。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      用户消息 Item 的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    在检索某个会话条目时返回， `conversation.item.retrieve`。提供此事件作为一种获取服务端对某条目表示的方式，例如在噪声消除和 VAD 之后访问经过后处理的音频数据。它包含该条目的完整内容，包括音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当较早的助手音频消息项被客户端通过以下方式截断时返回：
    一个 `conversation.item.truncate` 事件。该事件用于
    使服务端对音频的理解与客户端的播放保持同步。

    此操作将截断音频并移除服务端的文本转录，
    以确保上下文中不存在用户未听到的文本。

    - `audio_end_ms: number`

      音频被截断到的时长（以毫秒为单位）。

    - `content_index: number`

      被截断的内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被截断的助手消息项的 ID。

    - `type: "conversation.item.truncated"`

      事件类型，必须为 `conversation.item.truncated`.

      - `"conversation.item.truncated"`

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能源自客户端或服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认监控并记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误的类型（例如，“invalid_request_error”、“server_error”）。

      - `code: optional string or null`

        错误代码（如果有）。

      - `event_id: optional string or null`

        导致错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如果有）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `InputAudioBufferClearedEvent object { event_id, type }`

    当输入音频缓冲区被客户端通过以下方式清除时返回：a
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    在输入音频缓冲区被提交时返回，由客户端触发，或
    在服务端 VAD 模式下自动触发。该 `item_id` 属性为将要创建的用户
    消息项的 ID，因此也会向客户端发送一个 `conversation.item.created` 事件
    。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项将插入到其之后的先前项的 ID。
      如果该项没有前项，可以为 `null` 。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示
    电话键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
    是用户按下的按键。该 `received_at` 是 UTC Unix 时间戳
    表示服务器收到事件的时间。

    - `event: string`

      用户按下的电话键盘按键。

    - `received_at: number`

      服务器收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    由服务端在模式下发送，用于指示已在 `server_vad` 音频缓冲区中检测到语音。只要有音频被添加，就会触发
    此事件（除非已检测到语音）。客户端可能希望使用此
    事件来中断音频播放或向用户提供视觉反馈。
    客户端应预期在语音停止时收到。

    一个 `input_audio_buffer.speech_stopped` 事件
    。该 `item_id` 属性是对应用户消息条目的 ID
    该项目将在语音停止时创建，并也会包含在
    `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
    音频缓冲区）。

    - `audio_start_ms: number`

      从会话期间写入缓冲区的所有音频开始处起算的毫秒数，当语音首次被检测到时。该值对应于
      发送给模型的音频起始位置，因此会包含
      在 Session 中配置的内容。
      `prefix_padding_ms` 在 Session 中配置的。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      语音停止时将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    当以下情况时返回 `server_vad` 服务端在音频缓冲区中检测到语音结束时使用。服务端还会发送
    the audio buffer. The server will also send an `conversation.item.created`
    以及从音频缓冲区创建的用户消息项事件。

    - `audio_end_ms: number`

      语音停止时距离会话开始的毫秒数。这将
      对应于发送给模型的音频末尾，因此包括
      `min_silence_duration_ms` 在 Session 中配置的。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示已更新的速率限制。
    创建 Response 时，会有一部分 token 被“预留”用于输出
    token，此处显示的速率限制反映了该预留情况，并会在
    Response 完成后相应进行调整。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

      速率限制信息的列表。

      - `limit: optional number`

        速率限制所允许的最大值。

      - `name: optional "requests" or "tokens"`

        速率限制的名称（`requests`, `tokens`).

        - `"requests"`

        - `"tokens"`

      - `remaining: optional number`

        达到限制前的剩余值。

      - `reset_seconds: optional number`

        速率限制重置前的秒数。

    - `type: "rate_limits.updated"`

      事件类型，必须为 `rate_limits.updated`.

      - `"rate_limits.updated"`

  - `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

    在模型生成的音频更新时返回。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `delta: string`

      Base64 编码的音频数据增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.output_audio.delta"`

      事件类型，必须为 `response.output_audio.delta`.

      - `"response.output_audio.delta"`

  - `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

    在模型生成的音频完成时返回。如果某个 Response
    被中断、未完成或被取消，也会发出此事件。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.output_audio.done"`

      事件类型，必须为 `response.output_audio.done`.

      - `"response.output_audio.done"`

  - `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

    在模型生成的音频输出转录更新时返回。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `delta: string`

      转录增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.output_audio_transcript.delta"`

      事件类型，必须为 `response.output_audio_transcript.delta`.

      - `"response.output_audio_transcript.delta"`

  - `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

    在模型生成的音频输出转录完成时返回
    流式输出。如果某个 Response 被中断、未完成或
    被取消，也会发出此事件。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `transcript: string`

      该音频的最终转录文本。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    在响应生成过程中向助手消息条目添加新的内容部分时返回
    响应。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

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

      该响应的 ID。

    - `type: "response.content_part.added"`

      事件类型，必须为 `response.content_part.added`.

      - `"response.content_part.added"`

  - `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

    在助手消息项中某个内容部分流式传输完成时返回。
    也会在 Response 被中断、未完成或取消时发出。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

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

      该响应的 ID。

    - `type: "response.content_part.done"`

      事件类型，必须为 `response.content_part.done`.

      - `"response.content_part.done"`

  - `ResponseCreatedEvent object { event_id, response, type }`

    在创建新的 Response 时返回。这是 response 创建过程中的第一个事件，
    此时响应处于初始状态 `in_progress`.

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

      - `id: optional string`

        响应的唯一 ID，格式类似 `resp_1234`.

      - `audio: optional object { output }`

        音频输出配置。

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

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。在模型至少回复过一次音频后，无法在该
              会话中再次更改声音。当前
              可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

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

        响应所加入的对话，由 `conversation`
        字段位于 `response.create` 事件中。如果 `auto`，响应将被添加到
        默认对话中，且该字段的值将 `conversation_id` 为一个类似
        `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `none`，的 ID，响应不会被添加到任何对话中，
        该字段的值为 `conversation_id` 将会是 `null`。如果响应是通过
        VAD 自动触发的，则该响应将被添加到默认对话中

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        （包括工具调用），该 ID 在本次响应中被使用。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        由 16 组键值对组成的集合，可以附加到对象上。可用于
        以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
        查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串，
        最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          实时对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          实时对话中的一项函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          实时对话中的一项函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的实时项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          列出 MCP 服务器上可用工具的 Realtime 项。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime 项。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前可能的取值仅有
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
        输出设置为 mode `text` 将禁用模型的音频输出。

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
          当 `status` 为 `failed`.

          - `code: optional string`

            错误代码（如果有）。

          - `type: optional string`

            错误类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          响应未完成的原因。对于 `cancelled` 响应，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并中断了响应）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致响应失败的错误类型，对应
          字段（ `status` 字段（`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        响应的使用统计信息，将用于计费。
        Realtime API 会话将维护对话上下文并将新的
        项追加到对话中，因此先前轮次的输出（文本和
        音频令牌）将作为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          响应中使用的输入令牌的详细信息。缓存令牌是来自对话先前轮次的令牌，它们作为当前响应的上下文被包含在内。此处的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和未缓存令牌。

          - `audio_tokens: optional number`

            用作 Response 输入的音频 token 数。

          - `cached_tokens: optional number`

            用作 Response 输入的已缓存 token 数。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            用作 Response 输入的已缓存 token 的详细信息。

            - `audio_tokens: optional number`

              用作 Response 输入的已缓存音频 token 数。

            - `image_tokens: optional number`

              用作 Response 输入的已缓存图像 token 数。

            - `text_tokens: optional number`

              用作 Response 输入的已缓存文本 token 数。

          - `image_tokens: optional number`

            用作 Response 输入的图像 token 数。

          - `text_tokens: optional number`

            用作 Response 输入的文本 token 数。

        - `input_tokens: optional number`

          Response 中使用的输入 token 数，包括文本和
          音频 token。

        - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

          Response 中使用的输出 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中使用的音频 token 数。

          - `text_tokens: optional number`

            Response 中使用的文本 token 数。

        - `output_tokens: optional number`

          Response 中发送的输出 token 数，包括文本和
          音频 token。

        - `total_tokens: optional number`

          Response 中的总 token 数，包括输入和输出
          文本及音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    在 Response 流式传输完成时返回。无论最终状态如何都会发出，
    该事件中包含的 Response 对象 `response.done` 将
    包含 Response 中的所有输出 Items，但会省略原始音频数据。

    客户端应检查 Response 的 `status` 字段以判断是否成功
    (`completed`），还是出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

    响应将包含在响应过程中生成的所有输出项，但不包括
    任何音频内容。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

    - `type: "response.done"`

      事件类型，必须为 `response.done`.

      - `"response.done"`

  - `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

    在模型生成的函数调用参数被更新时返回。

    - `call_id: string`

      函数调用的 ID。

    - `delta: string`

      以 JSON 字符串形式表示的参数增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.function_call_arguments.delta"`

      事件类型，必须为 `response.function_call_arguments.delta`.

      - `"response.function_call_arguments.delta"`

  - `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

    当模型生成的函数调用参数流式传输完成时返回。
    也会在 Response 被中断、未完成或取消时发出。

    - `arguments: string`

      最终的参数，以 JSON 字符串形式表示。

    - `call_id: string`

      函数调用的 ID。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `name: string`

      被调用函数的名称。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.function_call_arguments.done"`

      事件类型，必须为 `response.function_call_arguments.done`.

      - `"response.function_call_arguments.done"`

  - `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

    在 Response 生成过程中创建新 Item 时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      在 Response 中输出项的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

    - `type: "response.output_item.added"`

      事件类型，必须为 `response.output_item.added`.

      - `"response.output_item.added"`

  - `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

    当一个 Item 流式传输完成时返回。也会在 Response 被
    中断、未完成或取消时发出。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      在 Response 中输出项的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

    - `type: "response.output_item.done"`

      事件类型，必须为 `response.output_item.done`.

      - `"response.output_item.done"`

  - `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

    当 "output_text" 内容部分的文本值更新时返回。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `delta: string`

      文本增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.output_text.delta"`

      事件类型，必须为 `response.output_text.delta`.

      - `"response.output_text.delta"`

  - `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

    当 "output_text" 内容部分的文本值流式传输完成时返回。同时
    也会在 Response 被中断、未完成或取消时发出。

    - `content_index: number`

      该项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `text: string`

      最终的文本内容。

    - `type: "response.output_text.done"`

      事件类型，必须为 `response.output_text.done`.

      - `"response.output_text.done"`

  - `SessionCreatedEvent object { event_id, session, type }`

    当创建一个 Session 时返回。在建立新连接时，
    会自动作为第一个服务端事件发出。该事件将包含
    默认的 Session 配置。

    - `event_id: string`

      服务端事件的唯一 ID。

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

          要创建的会话类型。始终为 Realtime API 的 `realtime` 。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可以设置为 `null` 以关闭。
              降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }`

              输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

              轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

                - `type: "server_vad"`

                  轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                  如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                  用户长时间停顿出乎意料的情况下很有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话。
                  当前上下文。

                  超时值将在上一个模型响应的音频播放结束后应用，
                  即设置为该 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 关联）将在达到超时时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）向默认
                  对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                  如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                  为 500ms。使用较短的值时，模型响应会更快，
                  但可能会在用户短暂停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                  阈值要求更响亮的音频才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时已结束说话。

                - `type: "semantic_vad"`

                  轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                  对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应的速度，以原始速度的倍数表示。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

              该参数是对生成后音频的后处理调整，
              也可以提示模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。在模型至少回复过一次音频后，无法在该
              会话中再次更改声音。当前
              可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复的声音。在模型至少回复过一次音频后，无法在该
                会话中再次更改声音。当前
                可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
                最佳质量。

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

          服务端输出中要包含的其他字段。

          `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

          请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 以获取给定模型的
          最大可用 token 数。默认为 `inf`.

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
          模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
          模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            可选的映射，用于为你的
            提示中的变量替换值。替换值可以是字符串，也可以是其他
            Response 输入类型，例如图片或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

              - `text: string`

                模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

              - `detail: ImageDetail`

                发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                输入项的类型。始终为 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                要发送给模型的文件 ID。

              - `image_url: optional string or null`

                要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的输入文件。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                要发送给模型的文件内容。

              - `file_id: optional string or null`

                要发送给模型的文件 ID。

              - `file_url: optional string`

                要发送给模型的文件 URL。

              - `filename: optional string`

                要发送给模型的文件名。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

          - `version: optional string or null`

            提示模板的可选版本。

        - `reasoning: optional RealtimeReasoning`

          支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

          - `effort: optional RealtimeReasoningEffort`

            限制支持推理的 Realtime 模型（例如
            `gpt-realtime-2`.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

        - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

          模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪些工具（如果有）。

            `none` 表示模型将不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或
            多个工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项可强制模型调用特定的函数。

            - `name: string`

              要调用的函数名称。

            - `type: "function"`

              对于函数调用，type 始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

            - `server_label: string`

              要使用的 MCP 服务器的标签。

            - `type: "mcp"`

              对于 MCP 工具，type 始终为 `mcp`.

              - `"mcp"`

            - `name: optional string or null`

              要在服务器上调用的工具名称。

        - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

            - `description: optional string`

              函数的描述，包括何时以及如何调用它的指导，
              以及关于调用时告知用户哪些信息的指导。
              （如果有的话）。

            - `name: optional string`

              函数的名称。

            - `parameters: optional unknown`

              使用 JSON Schema 表示的函数参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              该 MCP 服务器的标签，用于在工具调用中标识它。

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

                允许的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
              服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
              流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
              通过安全 MCP 隧道连接。

              当前支持的值 `connector_id` 包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google Calendar： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook Calendar： `connector_outlookcalendar`
              - Outlook Email： `connector_outlookemail`
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

              该 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                ，这些工具需要审批。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据，还是只读。如果 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据，还是只读。如果 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。取值之一为 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
              `tunnel_id` 之一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
              `server_url`, `connector_id`，或 `tunnel_id` 之一。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
          为某个会话启用追踪，就无法再修改其配置。

          `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
          工作流名称、分组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            对追踪进行更细粒度的配置。

            - `group_id: optional string`

              附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
              分组。

            - `metadata: optional unknown`

              附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
              过滤。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称。这用于
              在 Traces Dashboard 中为该追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

          客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

          截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

          截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

            - `retention_ratio: number`

              在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

              - `post_instructions: optional number`

                指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        一个 Realtime 转录会话配置对象。

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

                降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }`

              转录模型的配置。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

              轮次检测的配置。可以设置为 `null` 以关闭。服务端
              VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
              语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                在 VAD 检测到语音之前包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                检测语音停止的静音时长（以毫秒为单位）。默认为
                为 500ms。使用较短的值时，模型响应会更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
                阈值要求更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

              - `type: optional string`

                轮次检测的类型，仅 `server_vad` 目前受支持。

        - `expires_at: optional number`

          会话的过期时间戳，以自纪元起的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          服务端输出中要包含的其他字段。

          - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    在通过以下事件更新会话时返回， `session.update` 除非
    发生错误。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        Realtime 会话配置对象。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        一个 Realtime 转录会话配置对象。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `OutputAudioBufferStarted object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端开始向客户端流式传输音频时触发。该事件在将音频内容部分添加（
    到响应中之后触发。`response.content_part.added`)
    到响应中。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端上的输出音频缓冲区已完全清空时触发，且不会再有后续音频。该事件在完整响应数据已发送给客户端（
    之后触发。
    之后触发。`response.done`).
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被清空时触发。这种情况发生在 VAD 模式下用户发生打断（
    时，或者客户端发出以下事件（`input_audio_buffer.speech_started`),
    以手动 `output_audio_buffer.clear` 截断当前音频响应时。
    截断当前音频响应。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当某个 Item 被添加到默认会话时由服务端发送。出现这种情况有多种可能：

    - 当客户端发送一个 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。这种情况下，该 item 将是一条包含缓冲区音频的用户消息。
    - 当模型正在生成 Response 时。这种情况下， `conversation.item.added` 事件将在模型开始生成特定的 Item 时发送，因此它此时还没有任何内容（且 `status` 将会是 `in_progress`).

    该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），音频数据除外，音频数据可以通过 `conversation.item.retrieve` 事件单独获取（如果需要）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
      在插入 item 时保持顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    在对话项被最终化时返回。

    该事件将包含该项的完整内容，但音频数据除外，音频数据可在需要时通过以下事件单独获取 `conversation.item.retrieve` 事件获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
      在插入 item 时保持顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    当输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话的设置中配置，
    在 `idle_timeout_ms` 会话的设置中 `turn_detection` 配置，表示在配置的持续时间内未检测到任何语音。
    已超过配置的持续时间未检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段表示从最后一个模型响应之后到触发时刻的音频片段，以从音频写入
    输入音频缓冲区起算的偏移量表示。这意味着它划分了静默的音频片段，
    起始值与结束值之间的差值大致与配置的超时一致。
    起始值与结束值之间的差值大致匹配所配置的超时时长。

    空音频将作为一个 item 提交到对话中 `input_audio` （会有一个
    `input_audio_buffer.committed` 事件），并生成一个模型响应。仍可能存在未触发 VAD 但被模型检测到的语音，因此模型可能用
    与对话相关的内容或提示用户继续说话的内容进行回复。
    相关的内容或提示用户继续说话的内容作为回复。

    - `audio_end_ms: number`

      触发超时时刻，写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      位于最后一个模型响应播放时间之后，写入输入音频缓冲区的音频的毫秒偏移量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      与此音频片段关联的 item 的 ID。

    - `type: "input_audio_buffer.timeout_triggered"`

      事件类型，必须为 `input_audio_buffer.timeout_triggered`.

      - `"input_audio_buffer.timeout_triggered"`

  - `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

    在为某个 item 识别出输入音频转写片段时返回。

    - `id: string`

      片段标识符。

    - `content_index: number`

      输入音频内容部分在该 item 中的索引。

    - `end: number`

      片段的结束时间（以秒为单位）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含该输入音频内容的 item 的 ID。

    - `speaker: string`

      为该片段检测到的说话人标签。

    - `start: number`

      片段的开始时间（以秒为单位）。

    - `text: string`

      该片段对应的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    在某个项目的 MCP 工具列表进行中时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具条目的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    在某个条目上列出 MCP 工具的操作完成时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具条目的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    当列出某项的 MCP 工具失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具条目的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    在响应生成过程中 MCP 工具调用参数被更新时返回。

    - `delta: string`

      以 JSON 编码的参数增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.mcp_call_arguments.delta"`

      事件类型，必须为 `response.mcp_call_arguments.delta`.

      - `"response.mcp_call_arguments.delta"`

    - `obfuscation: optional string or null`

      如果存在,表明增量文本经过混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成期间 MCP 工具调用参数被最终确定后返回。

    - `arguments: string`

      最终的 JSON 编码参数字符串。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      该响应的 ID。

    - `type: "response.mcp_call_arguments.done"`

      事件类型，必须为 `response.mcp_call_arguments.done`.

      - `"response.mcp_call_arguments.done"`

  - `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

    在 MCP 工具调用已启动且正在进行时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `type: "response.mcp_call.in_progress"`

      事件类型，必须为 `response.mcp_call.in_progress`.

      - `"response.mcp_call.in_progress"`

  - `ResponseMcpCallCompleted object { event_id, item_id, output_index, type }`

    在 MCP 工具调用成功完成时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `type: "response.mcp_call.completed"`

      事件类型，必须为 `response.mcp_call.completed`.

      - `"response.mcp_call.completed"`

  - `ResponseMcpCallFailed object { event_id, item_id, output_index, type }`

    在 MCP 工具调用失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `type: "response.mcp_call.failed"`

      事件类型，必须为 `response.mcp_call.failed`.

      - `"response.mcp_call.failed"`

### Realtime 会话

- `RealtimeSession object { id, expires_at, include, 17 more }`

  用于 beta 接口的实时会话对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    服务端输出中要包含的其他字段。

    - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输入音频必须为 24kHz 采样率的 16 位 PCM，
    单声道（mono），并采用小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可以设置为 `null` 以关闭。
    降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

    在模型调用之前添加的默认系统指令（即系统消息）。
    此字段允许客户端引导模型给出期望的响应。可以指导模型的响应内容和格式，
    （例如 "be extremely succinct"、"act friendly"、"here are examples of good responses"），
    （例如 "be extremely succinct"、"act friendly"、"here are examples of good
    responses"）以及音频行为（例如 "talk quickly"、"inject emotion
    into your voice"、"laugh frequently"）。这些指令并不保证会被模型遵循，
    但它们为模型在期望行为上提供指引。
    它们为模型在期望行为上提供指引。

    请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并且它们
    在会话开始时的 `session.created` 事件中可见。
    会话开始时的事件中。

  - `max_response_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以获取给定模型的
    最大可用 token 数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频，
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
    对于 `pcm16`，输出音频以 24kHz 采样率进行采样。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射，用于为你的
      提示中的变量替换值。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `image_url: optional string or null`

          要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的输入文件。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件内容。

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `file_url: optional string`

          要发送给模型的文件 URL。

        - `filename: optional string`

          要发送给模型的文件名。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音响应的速度。1.0 是默认速度。0.25 是
    最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，
    不能在响应进行中更改。

  - `temperature: optional number`

    模型的采样温度，限定范围为 [0.6, 1.2]。对于音频模型，强烈建议使用 0.8 的温度以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何调用它的指导，
      以及关于调用时告知用户哪些信息的指导。
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    追踪 的配置选项。设为 null 可禁用 追踪。一旦
    为某个会话启用追踪，就无法再修改其配置。

    `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
    工作流名称、分组 ID 和元数据。

    - `"auto"`

      会话的默认 追踪 模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪进行更细粒度的配置。

      - `group_id: optional string`

        附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
        在追踪仪表板中的分组。

      - `metadata: optional unknown`

        附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
        在追踪仪表板中的筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在追踪仪表板中为 追踪 命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

      - `type: "server_vad"`

        轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

        如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。该参数在
        用户长时间停顿出乎意料的情况下很有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话。
        当前上下文。

        超时值将在上一个模型响应的音频播放结束后应用，
        即设置为该 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 关联）将在达到超时时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）向默认
        对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

        如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
        为 500ms。使用较短的值时，模型响应会更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
        阈值要求更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时已结束说话。

      - `type: "semantic_vad"`

        轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
        对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复的声音。在模型至少回复过一次音频后，无法在该
    会话中再次更改声音。当前
    可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，和 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复的声音。在模型至少回复过一次音频后，无法在该
      会话中再次更改声音。当前
      可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
      `shimmer`，和 `verse`.

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

    要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

        输入音频降噪的配置。可以设置为 `null` 以关闭。
        降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本之前等待的时长。
          较高的值可以提高转写准确率，但会增加延迟。
          仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
          提供可提高准确率和延迟表现。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续上一段音频
          片段的可选文本。
          对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
          Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

          - `type: "server_vad"`

            轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

            如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。该参数在
            用户长时间停顿出乎意料的情况下很有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话。
            当前上下文。

            超时值将在上一个模型响应的音频播放结束后应用，
            即设置为该 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 关联）将在达到超时时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）向默认
            对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

            如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
            为 500ms。使用较短的值时，模型响应会更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
            阈值要求更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时已结束说话。

          - `type: "semantic_vad"`

            轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
            对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应的速度，以原始速度的倍数表示。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

        该参数是对生成后音频的后处理调整，
        也可以提示模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型回应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
        一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
        在会话期间无法再更改声音。
        我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

            自定义语音 ID，例如 `voice_1234`.

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务端输出中要包含的其他字段。

    `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

    请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以获取给定模型的
    最大可用 token 数。默认为 `inf`.

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
    模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
    模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可并行调用多个工具。仅支持
    reasoning Realtime models such as `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射，用于为你的
      提示中的变量替换值。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `image_url: optional string or null`

          要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的输入文件。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件内容。

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `file_url: optional string`

          要发送给模型的文件 URL。

        - `filename: optional string`

          要发送给模型的文件名。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional RealtimeToolChoiceConfig`

    模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，type 始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，type 始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional RealtimeToolsConfig`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用它的指导，
        以及关于调用时告知用户哪些信息的指导。
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        使用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        该 MCP 服务器的标签，用于在工具调用中标识它。

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

          允许的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
        服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
        流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
        通过安全 MCP 隧道连接。

        当前支持的值 `connector_id` 包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google Calendar： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook Calendar： `connector_outlookcalendar`
        - Outlook Email： `connector_outlookemail`
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

        该 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。取值之一为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
    为某个会话启用追踪，就无法再修改其配置。

    `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
    工作流名称、分组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪进行更细粒度的配置。

      - `group_id: optional string`

        附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
        分组。

      - `metadata: optional unknown`

        附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
        过滤。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在 Traces Dashboard 中为该追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

    截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

    截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

      - `retention_ratio: number`

        在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

        - `post_instructions: optional number`

          指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或
    多个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，type 始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，type 始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

### Realtime Tools Config

- `RealtimeToolsConfig = array of RealtimeToolsConfigUnion`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何调用它的指导，
      以及关于调用时告知用户哪些信息的指导。
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      该 MCP 服务器的标签，用于在工具调用中标识它。

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

        允许的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据，还是只读。如果 MCP
          服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
      服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
      流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
      通过安全 MCP 隧道连接。

      当前支持的值 `connector_id` 包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google Calendar： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook Calendar： `connector_outlookcalendar`
      - Outlook Email： `connector_outlookemail`
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

      该 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。取值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol
  （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何调用它的指导，
      以及关于调用时告知用户哪些信息的指导。
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      该 MCP 服务器的标签，用于在工具调用中标识它。

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

        允许的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据，还是只读。如果 MCP
          服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
      服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
      流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
      通过安全 MCP 隧道连接。

      当前支持的值 `connector_id` 包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google Calendar： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook Calendar： `connector_outlookcalendar`
      - Outlook Email： `connector_outlookemail`
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

      该 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。取值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Realtime Tracing Config

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
  为某个会话启用追踪，就无法再修改其配置。

  `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
  工作流名称、分组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪进行更细粒度的配置。

    - `group_id: optional string`

      附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
      分组。

    - `metadata: optional unknown`

      附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
      过滤。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在 Traces Dashboard 中为该追踪命名。

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

      输入音频降噪的配置。可以设置为 `null` 以关闭。
      降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时长。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
        提供可提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频
        片段的可选文本。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。该参数在
          用户长时间停顿出乎意料的情况下很有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话。
          当前上下文。

          超时值将在上一个模型响应的音频播放结束后应用，
          即设置为该 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 关联）将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）向默认
          对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
          为 500ms。使用较短的值时，模型响应会更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
          阈值要求更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时已结束说话。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
          对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

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

    输入音频降噪的配置。可以设置为 `null` 以关闭。
    降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本之前等待的时长。
      较高的值可以提高转写准确率，但会增加延迟。
      仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
      提供可提高准确率和延迟表现。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续上一段音频
      片段的可选文本。
      对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
      Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

      - `type: "server_vad"`

        轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

        如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。该参数在
        用户长时间停顿出乎意料的情况下很有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话。
        当前上下文。

        超时值将在上一个模型响应的音频播放结束后应用，
        即设置为该 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 关联）将在达到超时时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）向默认
        对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

        如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
        为 500ms。使用较短的值时，模型响应会更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
        阈值要求更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时已结束说话。

      - `type: "semantic_vad"`

        轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
        对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

    - `type: "server_vad"`

      轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

      如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超过该时间后将自动触发模型响应。该参数在
      用户长时间停顿出乎意料的情况下很有用，例如电话
      通话。模型将根据当前上下文有效地提示用户继续对话。
      当前上下文。

      超时值将在上一个模型响应的音频播放结束后应用，
      即设置为该 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与 Response 关联）将在达到超时时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）向默认
      对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

      如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
      为 500ms。使用较短的值时，模型响应会更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
      阈值要求更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来判断用户何时已结束说话。

    - `type: "semantic_vad"`

      轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
      对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

### Realtime Transcription Session Create Request

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转写会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。始终为 Realtime API 的 `transcription` 用于转写会话。

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

        输入音频降噪的配置。可以设置为 `null` 以关闭。
        降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本之前等待的时长。
          较高的值可以提高转写准确率，但会增加延迟。
          仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
          提供可提高准确率和延迟表现。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续上一段音频
          片段的可选文本。
          对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
          Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

          - `type: "server_vad"`

            轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

            如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。该参数在
            用户长时间停顿出乎意料的情况下很有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话。
            当前上下文。

            超时值将在上一个模型响应的音频播放结束后应用，
            即设置为该 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 关联）将在达到超时时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）向默认
            对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

            如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
            为 500ms。使用较短的值时，模型响应会更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
            阈值要求更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时已结束说话。

          - `type: "semantic_vad"`

            轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
            对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务端输出中要包含的其他字段。

    `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  一个 Realtime 翻译客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。
    翻译会话支持更新以下字段： `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置，
      且无法通过此事件进行更改。 `session.update`.

      - `audio: optional object { input, output }`

        用于翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 可禁用它。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍基于
            输入音频流运行。

            - `model: string`

              用于源转录增量文本的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译后输出音频和转录增量文本的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端原始音频字节。不受支持的 websocket 音频格式会返回
    校验错误，因为低质量音频会显著降低翻译
    质量。

    翻译以 200 ms 引擎帧为单位。为获得最佳实时效果，请追加
    以 200 毫秒为一块发送音频。如果某个块较短，服务端会进行缓冲，直到
    累积到一帧所需的音频量。如果某个块较长，服务端会将其拆分为
    200 毫秒的帧，并依次排入队列。

    在会话处于活跃状态时持续追加静音。如果客户端停止发送
    音频后再次恢复，模型会将恢复后的音频视为与
    之前的音频连续，而不是现实世界中的暂停。

    - `audio: string`

      Base64 编码的 24 kHz PCM16 单声道音频字节。

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    正常关闭实时翻译会话。服务端会刷新待处理的
    输入音频，并在关闭之前输出所有剩余的翻译结果
    会话。

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建一个翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话持续流式传入源音频，
    并持续流式输出翻译后的音频以及转录增量。

    - `model: string`

      此会话使用的 Realtime 翻译模型。

    - `audio: optional object { input, output }`

      用于翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 可禁用它。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍基于
          输入音频流运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量文本的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥过期的配置。过期指的是之后的时间，
    客户端密钥将不再可用于创建会话。会话本身在该时间开始后
    仍可继续进行。一个密钥在其过期之前可用于创建多个会话。
    直到它过期为止。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点， `seconds` 将被加到客户端密钥的时间上以生成过期时间戳。仅 `created_at` 支持某些值。 `created_at` 目前受支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点到过期的秒数。选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

### Realtime Translation 客户端密钥 创建响应

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  创建翻译会话和 Realtime API 客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    Realtime 翻译会话。翻译会话会持续将输入
    音频翻译为配置好的输出语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      用于翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍基于
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过以下方式更改： `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation Input Audio Buffer Append Event

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端原始音频字节。不受支持的 websocket 音频格式会返回
  校验错误，因为低质量音频会显著降低翻译
  质量。

  翻译以 200 ms 引擎帧为单位。为获得最佳实时效果，请追加
  以 200 毫秒为一块发送音频。如果某个块较短，服务端会进行缓冲，直到
  累积到一帧所需的音频量。如果某个块较长，服务端会将其拆分为
  200 毫秒的帧，并依次排入队列。

  在会话处于活跃状态时持续追加静音。如果客户端停止发送
  音频后再次恢复，模型会将恢复后的音频视为与
  之前的音频连续，而不是现实世界中的暂停。

  - `audio: string`

    Base64 编码的 24 kHz PCM16 单声道音频字节。

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### Realtime Translation Input Transcript Delta Event

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当可选的源语言转录文本可用时返回。该事件
  仅在 `audio.input.transcription` 已配置时发出。

  转录增量是仅追加的文本片段。客户端不应在增量之间
  插入无条件空格。

  - `delta: string`

    仅追加的源语言转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的计时元数据，源自翻译帧
    （当可用时）。它以 200 毫秒为步长递增，但多个转录
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  在翻译后的输出音频可用时返回。该 `delta` 包含一个
  长度可变的 PCM16 音频分块。客户端应解码并将该
  完整的增量放入队列，而不是假设固定的字节或采样数。

  - `delta: string`

    Base64 编码的翻译后音频数据。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_audio.delta"`

    事件类型，必须为 `session.output_audio.delta`.

    - `"session.output_audio.delta"`

  - `channels: optional number`

    音频声道数。

  - `elapsed_ms: optional number or null`

    用于流对齐的计时元数据，源自翻译帧
    （可用时）。请将 `elapsed_ms` 视为对齐元数据，而非唯一的
    事件标识符。

  - `format: optional "pcm16"`

    音频编码（ `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频增量的采样率。

### 实时翻译输出转录增量事件

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当翻译后的转录文本可用时返回。

  转录增量是仅追加的文本片段。客户端不应在增量之间
  插入无条件空格。

  - `delta: string`

    翻译后输出音频的仅追加转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的计时元数据，源自翻译帧
    （当可用时）。它以 200 毫秒为步长递增，但多个转录
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译服务端事件

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  Realtime 翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能源自客户端或服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认监控并记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误的类型（例如，“invalid_request_error”、“server_error”）。

      - `code: optional string or null`

        错误代码（如果有）。

      - `event_id: optional string or null`

        导致错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如果有）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

    在创建翻译会话时返回。在建立
    新连接时，作为第一个服务端事件自动发出。该事件包含
    默认的翻译会话配置。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `audio: object { input, output }`

        用于翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍基于
            输入音频流运行。

            - `model: string`

              用于源转录增量的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译后输出音频和转录增量文本的目标语言。

      - `expires_at: number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `model: string`

        用于本次会话的 Realtime 翻译模型。此字段在
        会话创建时设置，无法通过以下方式更改： `session.update`.

      - `type: "translation"`

        会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    在使用 `session.update` 事件，
    更新翻译会话时返回，除非出现错误。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `RealtimeTranslationSessionClosedEvent object { event_id, type }`

    在实时翻译会话关闭时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.closed"`

      事件类型，必须为 `session.closed`.

      - `"session.closed"`

  - `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当可选的源语言转录文本可用时返回。该事件
    仅在 `audio.input.transcription` 已配置时发出。

    转录增量是仅追加的文本片段。客户端不应在增量之间
    插入无条件空格。

    - `delta: string`

      仅追加的源语言转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的计时元数据，源自翻译帧
      （当可用时）。它以 200 毫秒为步长递增，但多个转录
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当翻译后的转录文本可用时返回。

    转录增量是仅追加的文本片段。客户端不应在增量之间
    插入无条件空格。

    - `delta: string`

      翻译后输出音频的仅追加转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的计时元数据，源自翻译帧
      （当可用时）。它以 200 毫秒为步长递增，但多个转录
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    在翻译后的输出音频可用时返回。该 `delta` 包含一个
    长度可变的 PCM16 音频分块。客户端应解码并将该
    完整的增量放入队列，而不是假设固定的字节或采样数。

    - `delta: string`

      Base64 编码的翻译后音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_audio.delta"`

      事件类型，必须为 `session.output_audio.delta`.

      - `"session.output_audio.delta"`

    - `channels: optional number`

      音频声道数。

    - `elapsed_ms: optional number or null`

      用于流对齐的计时元数据，源自翻译帧
      （可用时）。请将 `elapsed_ms` 视为对齐元数据，而非唯一的
      事件标识符。

    - `format: optional "pcm16"`

      音频编码（ `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频增量的采样率。

### Realtime Translation Session

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  Realtime 翻译会话。翻译会话会持续将输入
  音频翻译为配置好的输出语言。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    用于翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍基于
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量文本的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `model: string`

    用于本次会话的 Realtime 翻译模型。此字段在
    会话创建时设置，无法通过以下方式更改： `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

    - `"translation"`

### Realtime Translation Session Close Event

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  正常关闭实时翻译会话。服务端会刷新待处理的
  输入音频，并在关闭之前输出所有剩余的翻译结果
  会话。

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### Realtime Translation Session Closed Event

- `RealtimeTranslationSessionClosedEvent object { event_id, type }`

  在实时翻译会话关闭时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.closed"`

    事件类型，必须为 `session.closed`.

    - `"session.closed"`

### Realtime Translation Session Create Request

- `RealtimeTranslationSessionCreateRequest object { model, audio }`

  Realtime 翻译会话配置。翻译会话持续流式传入源音频，
  并持续流式输出翻译后的音频以及转录增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    用于翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 可禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍基于
        输入音频流运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量文本的目标语言。

### Realtime Translation Session Created Event

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在创建翻译会话时返回。在建立
  新连接时，作为第一个服务端事件自动发出。该事件包含
  默认的翻译会话配置。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeTranslationSession`

    翻译会话配置。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      用于翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍基于
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过以下方式更改： `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Realtime Translation Session Update Event

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。
  翻译会话支持更新以下字段： `audio.output.language`, `audio.input.transcription`,
  和 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置，
    且无法通过此事件进行更改。 `session.update`.

    - `audio: optional object { input, output }`

      用于翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 可禁用它。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍基于
          输入音频流运行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量文本的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### Realtime Translation Session Update Request

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可使用以下方式更新的实时翻译会话字段 `session.update`.

  - `audio: optional object { input, output }`

    用于翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 可禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍基于
        输入音频流运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量文本的目标语言。

### Realtime 翻译会话已更新事件

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  在使用 `session.update` 事件，
  更新翻译会话时返回，除非出现错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeTranslationSession`

    翻译会话配置。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      用于翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍基于
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过以下方式更改： `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime 截断

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

  截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

  截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

    - `retention_ratio: number`

      在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

      - `post_instructions: optional number`

        指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### Response 音频增量事件

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  在模型生成的音频更新时返回。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `delta: string`

    Base64 编码的音频数据增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.output_audio.delta"`

    事件类型，必须为 `response.output_audio.delta`.

    - `"response.output_audio.delta"`

### Response 音频完成事件

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  在模型生成的音频完成时返回。如果某个 Response
  被中断、未完成或被取消，也会发出此事件。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.output_audio.done"`

    事件类型，必须为 `response.output_audio.done`.

    - `"response.output_audio.done"`

### Response 音频转写增量事件

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  在模型生成的音频输出转录更新时返回。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `delta: string`

    转录增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.output_audio_transcript.delta"`

    事件类型，必须为 `response.output_audio_transcript.delta`.

    - `"response.output_audio_transcript.delta"`

### Response 音频转写完成事件

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  在模型生成的音频输出转录完成时返回
  流式输出。如果某个 Response 被中断、未完成或
  被取消，也会发出此事件。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `transcript: string`

    该音频的最终转录文本。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### Response 取消事件

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件以取消正在进行的响应。服务端将响应一个
  包含状态为 `response.done` 的事件。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。
  如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。
  即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `response.cancel` 即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。
  即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

  - `response_id: optional string`

    要取消的特定响应 ID——如果未提供，将取消默认对话中正在进行的响应。
    在默认对话中正在进行的响应。

### Response 内容部分已添加事件

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  在响应生成过程中向助手消息条目添加新的内容部分时返回
  响应。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

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

    该响应的 ID。

  - `type: "response.content_part.added"`

    事件类型，必须为 `response.content_part.added`.

    - `"response.content_part.added"`

### Response 内容部分完成事件

- `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

  在助手消息项中某个内容部分流式传输完成时返回。
  也会在 Response 被中断、未完成或取消时发出。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

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

    该响应的 ID。

  - `type: "response.content_part.done"`

    事件类型，必须为 `response.content_part.done`.

    - `"response.content_part.done"`

### Response 创建事件

- `ResponseCreateEvent object { type, event_id, response }`

  此事件指示服务端创建一个 Response，这意味着会触发模型推理。在 Server VAD 模式下，服务端会自动创建 Response。
  模型推理。在 Server VAD 模式下，服务端会自动创建 Response。
  会自动创建 Response。

  一个 Response 至少包含一个 Item，也可能包含两个，其中第二个是函数调用。这些 Item 默认会追加到对话历史中。
  是函数调用。这些 Item 默认会追加到对话历史中。
  对话历史中。

  服务器将返回一个 `response.created` 事件、已创建 Item 和内容的事件，以及最终的
  事件，以及最终的 `response.done` 事件，以表示
  Response 已完成。

  该 `response.create` event 包含如下推理配置：
  `instructions` 和 `tools`。如果设置了这些字段，它们将仅针对本次 Response 覆盖 Session 的
  配置。

  Response 可以在默认 Conversation 之外创建，这意味着它们可以
  包含任意输入，并且可以禁止将输出写入 Conversation。
  同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行创建多个
  Response。 `metadata` 字段是区分多个同时发起的 Response 的好方法。
  同时发起的多个 Response。

  客户端可以设置 `conversation` 为 `none` 来创建一个不写入默认 Conversation 的 Response。可以使用
  字段提供任意输入，该字段是一个接受 `input` 原始 Item 和对已有 Item 引用的数组。
  原始 Item 和对已有 Item 引用的数组。

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

  - `response: optional RealtimeResponseCreateParams`

    使用以下参数创建一个新的 Realtime response

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

          模型回应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
          一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
          在会话期间无法再更改声音。
          我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

              自定义语音 ID，例如 `voice_1234`.

    - `conversation: optional string or "auto" or "none"`

      控制 response 被添加到哪个会话。当前支持
      `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个不会向默认对话添加项目的
      带外响应。

      - `string`

      - `"auto" or "none"`

        控制 response 被添加到哪个会话。当前支持
        `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
        表示响应的内容将被添加到默认
        对话中。将其设置为 `none` 以创建一个不会向默认对话添加项目的
        带外响应。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      包含在模型提示中的输入项。使用此字段
      会为本次 Response 创建一个新的上下文，而不是使用默认
      对话。空数组 `[]` 将清除本次 Response 的上下文。
      请注意，这可以包括对会话中先前出现的项目的引用，
      通过它们的 id。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送方的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          正在调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的一项函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的实时项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所回复审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器上可用工具的 Realtime 项。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的其他注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联的审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          该工具调用的错误（如果有）。

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

          该工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        请求人工批准工具调用的 Realtime 项。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `instructions: optional string`

      默认系统指令（即系统消息）会被前置到模型调用中。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“保持极度简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为（例如“说话快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
      请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 以获取给定模型的
      最大可用 token 数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      由 16 组键值对组成的集合，可以附加到对象上。可用于
      以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
      查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串，
      最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅有
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
      输出设置为 mode `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可并行调用多个工具。仅支持
      reasoning Realtime models such as `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射，用于为你的
        提示中的变量替换值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `image_url: optional string or null`

            要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件内容。

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `file_url: optional string`

            要发送给模型的文件 URL。

          - `filename: optional string`

            要发送给模型的文件名。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，type 始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，type 始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用它的指导，
          以及关于调用时告知用户哪些信息的指导。
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          使用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          该 MCP 服务器的标签，用于在工具调用中标识它。

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

            允许的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
          服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
          流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
          通过安全 MCP 隧道连接。

          当前支持的值 `connector_id` 包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook Calendar： `connector_outlookcalendar`
          - Outlook Email： `connector_outlookemail`
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

          该 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。取值之一为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Response 已创建事件

- `ResponseCreatedEvent object { event_id, response, type }`

  在创建新的 Response 时返回。这是 response 创建过程中的第一个事件，
  此时响应处于初始状态 `in_progress`.

  - `event_id: string`

    服务端事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式类似 `resp_1234`.

    - `audio: optional object { output }`

      音频输出配置。

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

          模型用于回复的声音。在模型至少回复过一次音频后，无法在该
          会话中再次更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

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

      响应所加入的对话，由 `conversation`
      字段位于 `response.create` 事件中。如果 `auto`，响应将被添加到
      默认对话中，且该字段的值将 `conversation_id` 为一个类似
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `none`，的 ID，响应不会被添加到任何对话中，
      该字段的值为 `conversation_id` 将会是 `null`。如果响应是通过
      VAD 自动触发的，则该响应将被添加到默认对话中

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      （包括工具调用），该 ID 在本次响应中被使用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      由 16 组键值对组成的集合，可以附加到对象上。可用于
      以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
      查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串，
      最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送方的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          正在调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的一项函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的实时项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所回复审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器上可用工具的 Realtime 项。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的其他注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联的审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          该工具调用的错误（如果有）。

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

          该工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        请求人工批准工具调用的 Realtime 项。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅有
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
      输出设置为 mode `text` 将禁用模型的音频输出。

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
        当 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于 `cancelled` 响应，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并中断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段（ `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的使用统计信息，将用于计费。
      Realtime API 会话将维护对话上下文并将新的
      项追加到对话中，因此先前轮次的输出（文本和
      音频令牌）将作为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        响应中使用的输入令牌的详细信息。缓存令牌是来自对话先前轮次的令牌，它们作为当前响应的上下文被包含在内。此处的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和未缓存令牌。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数。

        - `cached_tokens: optional number`

          用作 Response 输入的已缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          用作 Response 输入的已缓存 token 的详细信息。

          - `audio_tokens: optional number`

            用作 Response 输入的已缓存音频 token 数。

          - `image_tokens: optional number`

            用作 Response 输入的已缓存图像 token 数。

          - `text_tokens: optional number`

            用作 Response 输入的已缓存文本 token 数。

        - `image_tokens: optional number`

          用作 Response 输入的图像 token 数。

        - `text_tokens: optional number`

          用作 Response 输入的文本 token 数。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的总 token 数，包括输入和输出
        文本及音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### Response 完成事件

- `ResponseDoneEvent object { event_id, response, type }`

  在 Response 流式传输完成时返回。无论最终状态如何都会发出，
  该事件中包含的 Response 对象 `response.done` 将
  包含 Response 中的所有输出 Items，但会省略原始音频数据。

  客户端应检查 Response 的 `status` 字段以判断是否成功
  (`completed`），还是出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  响应将包含在响应过程中生成的所有输出项，但不包括
  任何音频内容。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式类似 `resp_1234`.

    - `audio: optional object { output }`

      音频输出配置。

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

          模型用于回复的声音。在模型至少回复过一次音频后，无法在该
          会话中再次更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

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

      响应所加入的对话，由 `conversation`
      字段位于 `response.create` 事件中。如果 `auto`，响应将被添加到
      默认对话中，且该字段的值将 `conversation_id` 为一个类似
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地调用该接口，错误将在会话保持不受影响的情况下返回。 `none`，的 ID，响应不会被添加到任何对话中，
      该字段的值为 `conversation_id` 将会是 `null`。如果响应是通过
      VAD 自动触发的，则该响应将被添加到默认对话中

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      （包括工具调用），该 ID 在本次响应中被使用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      由 16 组键值对组成的集合，可以附加到对象上。可用于
      以结构化格式存储有关该对象的附加信息，并通过 API 或仪表板
      查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串，
      最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送方的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        实时对话中的一条助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        实时对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          正在调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        实时对话中的一项函数调用输出项。

        - `call_id: string`

          此输出所对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务器生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的实时项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          所回复审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        列出 MCP 服务器上可用工具的 Realtime 项。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的其他注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          关联的审批请求的 ID（如果有）。

        - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

          该工具调用的错误（如果有）。

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

          该工具调用的输出。

      - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

        请求人工批准工具调用的 Realtime 项。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅有
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文字转录。将
      输出设置为 mode `text` 将禁用模型的音频输出。

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
        当 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        响应未完成的原因。对于 `cancelled` 响应，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` 响应，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并中断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段（ `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的使用统计信息，将用于计费。
      Realtime API 会话将维护对话上下文并将新的
      项追加到对话中，因此先前轮次的输出（文本和
      音频令牌）将作为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        响应中使用的输入令牌的详细信息。缓存令牌是来自对话先前轮次的令牌，它们作为当前响应的上下文被包含在内。此处的缓存令牌计为输入令牌的子集，这意味着输入令牌将包括缓存令牌和未缓存令牌。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数。

        - `cached_tokens: optional number`

          用作 Response 输入的已缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          用作 Response 输入的已缓存 token 的详细信息。

          - `audio_tokens: optional number`

            用作 Response 输入的已缓存音频 token 数。

          - `image_tokens: optional number`

            用作 Response 输入的已缓存图像 token 数。

          - `text_tokens: optional number`

            用作 Response 输入的已缓存文本 token 数。

        - `image_tokens: optional number`

          用作 Response 输入的图像 token 数。

        - `text_tokens: optional number`

          用作 Response 输入的文本 token 数。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的总 token 数，包括输入和输出
        文本及音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### Response 函数调用参数增量事件

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  在模型生成的函数调用参数被更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    以 JSON 字符串形式表示的参数增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.function_call_arguments.delta"`

    事件类型，必须为 `response.function_call_arguments.delta`.

    - `"response.function_call_arguments.delta"`

### Response 函数调用参数完成事件

- `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

  当模型生成的函数调用参数流式传输完成时返回。
  也会在 Response 被中断、未完成或取消时发出。

  - `arguments: string`

    最终的参数，以 JSON 字符串形式表示。

  - `call_id: string`

    函数调用的 ID。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `name: string`

    被调用函数的名称。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.function_call_arguments.done"`

    事件类型，必须为 `response.function_call_arguments.done`.

    - `"response.function_call_arguments.done"`

### Response Mcp 调用参数增量

- `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

  在响应生成过程中 MCP 工具调用参数被更新时返回。

  - `delta: string`

    以 JSON 编码的参数增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.mcp_call_arguments.delta"`

    事件类型，必须为 `response.mcp_call_arguments.delta`.

    - `"response.mcp_call_arguments.delta"`

  - `obfuscation: optional string or null`

    如果存在,表明增量文本经过混淆处理。

### Response Mcp 调用参数完成

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成期间 MCP 工具调用参数被最终确定后返回。

  - `arguments: string`

    最终的 JSON 编码参数字符串。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.mcp_call_arguments.done"`

    事件类型，必须为 `response.mcp_call_arguments.done`.

    - `"response.mcp_call_arguments.done"`

### Response Mcp 调用已完成

- `ResponseMcpCallCompleted object { event_id, item_id, output_index, type }`

  在 MCP 工具调用成功完成时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.completed"`

    事件类型，必须为 `response.mcp_call.completed`.

    - `"response.mcp_call.completed"`

### Response Mcp 调用失败

- `ResponseMcpCallFailed object { event_id, item_id, output_index, type }`

  在 MCP 工具调用失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.failed"`

    事件类型，必须为 `response.mcp_call.failed`.

    - `"response.mcp_call.failed"`

### Response Mcp 调用进行中

- `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

  在 MCP 工具调用已启动且正在进行时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.in_progress"`

    事件类型，必须为 `response.mcp_call.in_progress`.

    - `"response.mcp_call.in_progress"`

### Response 输出项已添加事件

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  在 Response 生成过程中创建新 Item 时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    在 Response 中输出项的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.added"`

    事件类型，必须为 `response.output_item.added`.

    - `"response.output_item.added"`

### Response Output Item Done Event

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  当一个 Item 流式传输完成时返回。也会在 Response 被
  中断、未完成或取消时发出。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示相似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大变更，请使用 instructions；对于较小的更新（例如“用户现在询问的是另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` ，将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式有 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中作为参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送方的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      实时对话中的一条助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 则取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      实时对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        正在调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      实时对话中的一项函数调用输出项。

      - `call_id: string`

        此输出所对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，这是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。在创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的实时项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        所回复审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      列出 MCP 服务器上可用工具的 Realtime 项。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的其他注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示对 MCP 服务器上某个工具进行调用的 Realtime 项。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的审批请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        该工具调用的错误（如果有）。

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

        该工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的 Realtime 项。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    在 Response 中输出项的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.done"`

    事件类型，必须为 `response.output_item.done`.

    - `"response.output_item.done"`

### Response Text Delta Event

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  当 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `delta: string`

    文本增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `type: "response.output_text.delta"`

    事件类型，必须为 `response.output_text.delta`.

    - `"response.output_text.delta"`

### Response Text Done Event

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  当 "output_text" 内容部分的文本值流式传输完成时返回。同时
  也会在 Response 被中断、未完成或取消时发出。

  - `content_index: number`

    该项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    该响应的 ID。

  - `text: string`

    最终的文本内容。

  - `type: "response.output_text.done"`

    事件类型，必须为 `response.output_text.done`.

    - `"response.output_text.done"`

### Session Created Event

- `SessionCreatedEvent object { event_id, session, type }`

  当创建一个 Session 时返回。在建立新连接时，
  会自动作为第一个服务端事件发出。该事件将包含
  默认的 Session 配置。

  - `event_id: string`

    服务端事件的唯一 ID。

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

        要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

            输入音频降噪的配置。可以设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                用户长时间停顿出乎意料的情况下很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话。
                当前上下文。

                超时值将在上一个模型响应的音频播放结束后应用，
                即设置为该 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联）将在达到超时时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                为 500ms。使用较短的值时，模型响应会更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                阈值要求更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

            该参数是对生成后音频的后处理调整，
            也可以提示模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。在模型至少回复过一次音频后，无法在该
              会话中再次更改声音。当前
              可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

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

        服务端输出中要包含的其他字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以获取给定模型的
        最大可用 token 数。默认为 `inf`.

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
        模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射，用于为你的
          提示中的变量替换值。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `image_url: optional string or null`

              要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的输入文件。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件内容。

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `file_url: optional string`

              要发送给模型的文件 URL。

            - `filename: optional string`

              要发送给模型的文件名。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用它的指导，
            以及关于调用时告知用户哪些信息的指导。
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

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

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
            服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
            流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            通过安全 MCP 隧道连接。

            当前支持的值 `connector_id` 包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google Calendar： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook Calendar： `connector_outlookcalendar`
            - Outlook Email： `connector_outlookemail`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。取值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        为某个会话启用追踪，就无法再修改其配置。

        `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
        工作流名称、分组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪进行更细粒度的配置。

          - `group_id: optional string`

            附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
            分组。

          - `metadata: optional unknown`

            附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
            过滤。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

        截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

        截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      一个 Realtime 转录会话配置对象。

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

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

            轮次检测的配置。可以设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
            语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音时长（以毫秒为单位）。默认为
              为 500ms。使用较短的值时，模型响应会更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 目前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务端输出中要包含的其他字段。

        - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Session Update Event

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新除
  之外的任何字段； `voice` 和 `model`. `voice` 只有在尚未产生其他音频输出时才能更新。

  当服务器收到 `session.update`，时，它将响应
  包含状态为 `session.updated` 事件，展示完整且生效的配置。
  只有 `session.update` 中出现的字段会被更新。若要清除某个字段，例如
  `instructions`，请传入空字符串。若要清除某个字段，例如 `tools`，请传入空数组。
  若要清除某个字段，例如 `turn_detection`，请传入 `null`.

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。可选择 realtime
    会话或转录会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

            输入音频降噪的配置。可以设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在输出转写文本之前等待的时长。
              较高的值可以提高转写准确率，但会增加延迟。
              仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。在
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
              提供可提高准确率和延迟表现。

            - `languages: optional array of string`

              输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              用于引导模型风格或延续上一段音频
              片段的可选文本。
              对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
              Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                用户长时间停顿出乎意料的情况下很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话。
                当前上下文。

                超时值将在上一个模型响应的音频播放结束后应用，
                即设置为该 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联）将在达到超时时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                为 500ms。使用较短的值时，模型响应会更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                阈值要求更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

            该参数是对生成后音频的后处理调整，
            也可以提示模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型回应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
            一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
            在会话期间无法再更改声音。
            我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

                自定义语音 ID，例如 `voice_1234`.

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务端输出中要包含的其他字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以获取给定模型的
        最大可用 token 数。默认为 `inf`.

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
        模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可并行调用多个工具。仅支持
        reasoning Realtime models such as `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射，用于为你的
          提示中的变量替换值。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `image_url: optional string or null`

              要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的输入文件。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件内容。

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `file_url: optional string`

              要发送给模型的文件 URL。

            - `filename: optional string`

              要发送给模型的文件名。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional RealtimeToolChoiceConfig`

        模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional RealtimeToolsConfig`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用它的指导，
            以及关于调用时告知用户哪些信息的指导。
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

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

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
            服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
            流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            通过安全 MCP 隧道连接。

            当前支持的值 `connector_id` 包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google Calendar： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook Calendar： `connector_outlookcalendar`
            - Outlook Email： `connector_outlookemail`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。取值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        为某个会话启用追踪，就无法再修改其配置。

        `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
        工作流名称、分组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪进行更细粒度的配置。

          - `group_id: optional string`

            附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
            分组。

          - `metadata: optional unknown`

            附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
            过滤。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

        截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

        截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转写会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。始终为 Realtime API 的 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可以设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                用户长时间停顿出乎意料的情况下很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话。
                当前上下文。

                超时值将在上一个模型响应的音频播放结束后应用，
                即设置为该 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联）将在达到超时时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                为 500ms。使用较短的值时，模型响应会更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                阈值要求更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务端输出中要包含的其他字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。这是一个客户端可以自行指定的任意字符串。如果该事件出现错误，它会被传回，但相应的 `session.updated` 事件中不会包含它。

### Session Updated Event

- `SessionUpdatedEvent object { event_id, session, type }`

  在通过以下事件更新会话时返回， `session.update` 除非
  发生错误。

  - `event_id: string`

    服务端事件的唯一 ID。

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

        要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

            输入音频降噪的配置。可以设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                用户长时间停顿出乎意料的情况下很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话。
                当前上下文。

                超时值将在上一个模型响应的音频播放结束后应用，
                即设置为该 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联）将在达到超时时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                为 500ms。使用较短的值时，模型响应会更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                阈值要求更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

            该参数是对生成后音频的后处理调整，
            也可以提示模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。在模型至少回复过一次音频后，无法在该
              会话中再次更改声音。当前
              可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

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

        服务端输出中要包含的其他字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以获取给定模型的
        最大可用 token 数。默认为 `inf`.

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
        模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射，用于为你的
          提示中的变量替换值。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `image_url: optional string or null`

              要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的输入文件。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件内容。

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `file_url: optional string`

              要发送给模型的文件 URL。

            - `filename: optional string`

              要发送给模型的文件名。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用它的指导，
            以及关于调用时告知用户哪些信息的指导。
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

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

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
            服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
            流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            通过安全 MCP 隧道连接。

            当前支持的值 `connector_id` 包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google Calendar： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook Calendar： `connector_outlookcalendar`
            - Outlook Email： `connector_outlookemail`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。取值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        为某个会话启用追踪，就无法再修改其配置。

        `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
        工作流名称、分组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪进行更细粒度的配置。

          - `group_id: optional string`

            附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
            分组。

          - `metadata: optional unknown`

            附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
            过滤。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

        截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

        截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      一个 Realtime 转录会话配置对象。

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

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

            轮次检测的配置。可以设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
            语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音时长（以毫秒为单位）。默认为
              为 500ms。使用较短的值时，模型响应会更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 目前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务端输出中要包含的其他字段。

        - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

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

      要在转录中包含的项目集合。当前可用的项目包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`，输入音频必须为 24kHz 采样率的 16 位 PCM，
      单声道（mono），并采用小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可以设置为 `null` 以关闭。
      降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转录的配置。客户端可以选择性地设置转录的语言和提示词，这些为转录服务提供了额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时长。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
        提供可提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频
        片段的可选文本。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可以设置为 `null` 用于关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静音时长（以毫秒为单位）。默认为
        为 500ms。使用较短的值时，模型响应会更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
        阈值要求更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

      - `type: optional "server_vad"`

        轮次检测类型。目前仅 `server_vad` 支持转录会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。

### 转录会话更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  在转录会话通过以下方式更新时返回： `transcription_session.update` 除非
  发生错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    新的实时转录会话配置。

    当通过 REST API 在服务端创建会话时，会话对象
    还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。该
    属性在通过 WebSocket API 更新会话时不会出现。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅在会话
      通过 REST API 在服务端创建时出现。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌都会
        在一分钟后过期。

      - `value: string`

        可在客户端环境中用于认证连接到
        实时 API 的临时密钥。请在客户端环境中使用它，而不是
        标准的 API 令牌，标准令牌应仅 服务端 使用。

    - `input_audio_format: optional string`

      输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

      模型可以响应的模态集合。若要禁用音频，
      请将其设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可以设置为 `null` 以关闭。服务端
      VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
      音频音量，并在用户语音结束时进行响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静音时长（以毫秒为单位）。默认为
        为 500ms。使用较短的值时，模型响应会更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
        阈值要求更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

      - `type: optional string`

        轮次检测的类型，仅 `server_vad` 目前受支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 通话

## 接听来电

**post** `/realtime/calls/{call_id}/accept`

接听来电 SIP 通话并配置将处理该通话的实时会话
。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

      输入音频降噪的配置。可以设置为 `null` 以关闭。
      降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时长。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
        提供可提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频
        片段的可选文本。
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。该参数在
          用户长时间停顿出乎意料的情况下很有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话。
          当前上下文。

          超时值将在上一个模型响应的音频播放结束后应用，
          即设置为该 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 关联）将在达到超时时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）向默认
          对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

          如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
          为 500ms。使用较短的值时，模型响应会更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
          阈值要求更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时已结束说话。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
          对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应的速度，以原始速度的倍数表示。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

      该参数是对生成后音频的后处理调整，
      也可以提示模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
      一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
      在会话期间无法再更改声音。
      我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

          自定义语音 ID，例如 `voice_1234`.

- `include: optional array of "item.input_audio_transcription.logprobs"`

  服务端输出中要包含的其他字段。

  `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

  请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 以获取给定模型的
  最大可用 token 数。默认为 `inf`.

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
  模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
  模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可并行调用多个工具。仅支持
  reasoning Realtime models such as `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的映射，用于为你的
    提示中的变量替换值。替换值可以是字符串，也可以是其他
    Response 输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型。始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        要发送给模型的文件 ID。

      - `image_url: optional string or null`

        要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的输入文件。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        要发送给模型的文件内容。

      - `file_id: optional string or null`

        要发送给模型的文件 ID。

      - `file_url: optional string`

        要发送给模型的文件 URL。

      - `filename: optional string`

        要发送给模型的文件名。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或
    多个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，type 始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，type 始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何调用它的指导，
      以及关于调用时告知用户哪些信息的指导。
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      该 MCP 服务器的标签，用于在工具调用中标识它。

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

        允许的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据，还是只读。如果 MCP
          服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
      服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
      流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
      通过安全 MCP 隧道连接。

      当前支持的值 `connector_id` 包括：

      - Dropbox： `connector_dropbox`
      - Gmail： `connector_gmail`
      - Google Calendar： `connector_googlecalendar`
      - Google Drive： `connector_googledrive`
      - Microsoft Teams： `connector_microsoftteams`
      - Outlook Calendar： `connector_outlookcalendar`
      - Outlook Email： `connector_outlookemail`
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

      该 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。取值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
  为某个会话启用追踪，就无法再修改其配置。

  `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
  工作流名称、分组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪进行更细粒度的配置。

    - `group_id: optional string`

      附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
      分组。

    - `metadata: optional unknown`

      附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
      过滤。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在 Traces Dashboard 中为该追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

  截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

  截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

    - `retention_ratio: number`

      在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

      - `post_instructions: optional number`

        指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

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

## 创建通话

**post** `/realtime/calls`

通过 WebRTC 创建一个新的 Realtime API 调用，并获取完成对等连接所需的 SDP answer。
连接。

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

#### Response

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

结束一个进行中的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 方法将当前活动的 SIP 通话转接到新目标。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应在 SIP Refer-To 头中显示的 URI。支持类似以下的值
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

通过向主叫方返回 SIP 状态码来拒接来电 SIP 呼叫。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  发送回主叫方的 SIP 响应码。默认为 `603` (Decline)
  （如果省略）。

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

创建一个 Realtime 客户端密钥，并附带会话配置。

客户端密钥是短期令牌，可传递给客户端应用，例如，
Web 前端或移动客户端，从而无需泄露你的主 API 密钥即可获得对 Realtime 的访问权限
你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。

你也可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的所有会话，但这些选项也可以被
客户端连接覆盖。

[了解有关通过 WebRTC 使用客户端密钥进行身份验证的更多信息](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，形式如下： `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期的配置。过期指的是之后的时间，
  客户端密钥将不再可用于创建会话。会话本身在该时间开始后
  仍可继续进行。一个密钥在其过期之前可用于创建多个会话。
  直到它过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点， `seconds` 将被加到客户端密钥的时间上以生成过期时间戳。仅 `created_at` 支持某些值。 `created_at` 目前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择使用实时会话配置
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

          输入音频降噪的配置。可以设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转写文本之前等待的时长。
            较高的值可以提高转写准确率，但会增加延迟。
            仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
            提供可提高准确率和延迟表现。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续上一段音频
            片段的可选文本。
            对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
            Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

              如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。该参数在
              用户长时间停顿出乎意料的情况下很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话。
              当前上下文。

              超时值将在上一个模型响应的音频播放结束后应用，
              即设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联）将在达到超时时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）向默认
              对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
              为 500ms。使用较短的值时，模型响应会更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时已结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
              对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应的速度，以原始速度的倍数表示。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

          该参数是对生成后音频的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型回应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，和 `cedar`。你也可以提供自定义声音对象，其中包含
          一个 `id`，例如 `{ "id": "voice_1234" }`。在模型至少使用音频回应一次后，
          在会话期间无法再更改声音。
          我们推荐 `marin` 和 `cedar` 以获得最佳质量。

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

              自定义语音 ID，例如 `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务端输出中要包含的其他字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 以获取给定模型的
      最大可用 token 数。默认为 `inf`.

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
      模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
      模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可并行调用多个工具。仅支持
      reasoning Realtime models such as `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射，用于为你的
        提示中的变量替换值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `image_url: optional string or null`

            要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件内容。

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `file_url: optional string`

            要发送给模型的文件 URL。

          - `filename: optional string`

            要发送给模型的文件名。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，type 始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，type 始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional RealtimeToolsConfig`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用它的指导，
          以及关于调用时告知用户哪些信息的指导。
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          使用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          该 MCP 服务器的标签，用于在工具调用中标识它。

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

            允许的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
          服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
          流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
          通过安全 MCP 隧道连接。

          当前支持的值 `connector_id` 包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook Calendar： `connector_outlookcalendar`
          - Outlook Email： `connector_outlookemail`
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

          该 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。取值之一为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
      为某个会话启用追踪，就无法再修改其配置。

      `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
      工作流名称、分组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪进行更细粒度的配置。

        - `group_id: optional string`

          附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
          分组。

        - `metadata: optional unknown`

          附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
          过滤。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。这用于
          在 Traces Dashboard 中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

      截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

      截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

        - `retention_ratio: number`

          在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转写会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。始终为 Realtime API 的 `transcription` 用于转写会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可以设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

              如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。该参数在
              用户长时间停顿出乎意料的情况下很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话。
              当前上下文。

              超时值将在上一个模型响应的音频播放结束后应用，
              即设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联）将在达到超时时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）向默认
              对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
              为 500ms。使用较短的值时，模型响应会更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时已结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
              对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务端输出中要包含的其他字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### Returns

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  用于实时会话或转写会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

          输入音频降噪的配置。可以设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

              如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。该参数在
              用户长时间停顿出乎意料的情况下很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话。
              当前上下文。

              超时值将在上一个模型响应的音频播放结束后应用，
              即设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 关联）将在达到超时时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）向默认
              对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
              为 500ms。使用较短的值时，模型响应会更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时已结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
              对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应的速度，以原始速度的倍数表示。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

          该参数是对生成后音频的后处理调整，
          也可以提示模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。在模型至少回复过一次音频后，无法在该
          会话中再次更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

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

      服务端输出中要包含的其他字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 以获取给定模型的
      最大可用 token 数。默认为 `inf`.

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
      模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
      模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射，用于为你的
        提示中的变量替换值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `image_url: optional string or null`

            要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的输入文件。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件内容。

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `file_url: optional string`

            要发送给模型的文件 URL。

          - `filename: optional string`

            要发送给模型的文件名。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，type 始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，type 始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用它的指导，
          以及关于调用时告知用户哪些信息的指导。
          （如果有的话）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          使用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          该 MCP 服务器的标签，用于在工具调用中标识它。

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

            允许的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
          服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
          流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
          通过安全 MCP 隧道连接。

          当前支持的值 `connector_id` 包括：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook Calendar： `connector_outlookcalendar`
          - Outlook Email： `connector_outlookemail`
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

          该 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。取值之一为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
      为某个会话启用追踪，就无法再修改其配置。

      `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
      工作流名称、分组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪进行更细粒度的配置。

        - `group_id: optional string`

          附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
          分组。

        - `metadata: optional unknown`

          附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
          过滤。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。这用于
          在 Traces Dashboard 中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

      截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

      截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

        - `retention_ratio: number`

          在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    一个 Realtime 转录会话配置对象。

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

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

          轮次检测的配置。可以设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
          语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音时长（以毫秒为单位）。默认为
            为 500ms。使用较短的值时，模型响应会更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
            阈值要求更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测的类型，仅 `server_vad` 目前受支持。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      服务端输出中要包含的其他字段。

      - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

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

#### Response

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

#### Response

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

  创建会话和客户端密钥以使用 Realtime API 的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    用于实时会话或转写会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

            输入音频降噪的配置。可以设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。该参数在
                用户长时间停顿出乎意料的情况下很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话。
                当前上下文。

                超时值将在上一个模型响应的音频播放结束后应用，
                即设置为该 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 关联）将在达到超时时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

                如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
                为 500ms。使用较短的值时，模型响应会更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
                阈值要求更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
                对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，以原始速度的倍数表示。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

            该参数是对生成后音频的后处理调整，
            也可以提示模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。在模型至少回复过一次音频后，无法在该
            会话中再次更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。在模型至少回复过一次音频后，无法在该
              会话中再次更改声音。当前
              可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

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

        服务端输出中要包含的其他字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以获取给定模型的
        最大可用 token 数。默认为 `inf`.

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
        模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射，用于为你的
          提示中的变量替换值。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `image_url: optional string or null`

              要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的输入文件。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件内容。

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `file_url: optional string`

              要发送给模型的文件 URL。

            - `filename: optional string`

              要发送给模型的文件名。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，type 始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，type 始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何调用它的指导，
            以及关于调用时告知用户哪些信息的指导。
            （如果有的话）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

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

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，还是只读。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
            服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
            流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            通过安全 MCP 隧道连接。

            当前支持的值 `connector_id` 包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google Calendar： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook Calendar： `connector_outlookcalendar`
            - Outlook Email： `connector_outlookemail`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据，还是只读。如果 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。取值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        为某个会话启用追踪，就无法再修改其配置。

        `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
        工作流名称、分组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪进行更细粒度的配置。

          - `group_id: optional string`

            附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
            分组。

          - `metadata: optional unknown`

            附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
            过滤。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

        截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

        截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      一个 Realtime 转录会话配置对象。

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

              降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

            轮次检测的配置。可以设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
            语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音时长（以毫秒为单位）。默认为
              为 500ms。使用较短的值时，模型响应会更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
              阈值要求更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 目前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        服务端输出中要包含的其他字段。

        - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

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

    要创建的会话类型。始终为 Realtime API 的 `realtime` 。

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

        输入音频降噪的配置。可以设置为 `null` 以关闭。
        降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转写的配置，默认为关闭，可以设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到内容的精确反映。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

        轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 结合）从语义上估计用户是否已经说完，然后根据该概率动态设置超时时间。例如，如果用户的音频以“嗯”拖尾收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这在更自然的对话中非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，在一段静音之后关闭。

          - `type: "server_vad"`

            轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，则在模型已经在响应时可能会无法创建响应。

            如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。该参数在
            用户长时间停顿出乎意料的情况下很有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话。
            当前上下文。

            超时值将在上一个模型响应的音频播放结束后应用，
            即设置为该 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 关联）将在达到超时时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）向默认
            对话（即。 `conversation` 的 `auto`) 输出的任何进行中的响应。如果 `true` 则响应将被取消，否则它将继续直到完成。

            如果同时将 `create_response` 和 `interrupt_response` 设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会被发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认
            为 500ms。使用较短的值时，模型响应会更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。更高的
            阈值要求更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时已结束说话。

          - `type: "semantic_vad"`

            轮次检测的类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会等待更长时间以让用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，和 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在发生 VAD 开始事件时自动中断任何进行中的回应，并向默认
            对话（即。 `conversation` 的 `auto`) 时发生 VAD 开始事件。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应的速度，以原始速度的倍数表示。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中更改。

        该参数是对生成后音频的后处理调整，
        也可以提示模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的声音。在模型至少回复过一次音频后，无法在该
        会话中再次更改声音。当前
        可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。在模型至少回复过一次音频后，无法在该
          会话中再次更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，和 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

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

    服务端输出中要包含的其他字段。

    `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是较好的响应示例”），以及音频行为（例如“语速快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型严格遵循，但它们为模型提供了期望行为的指导。

    请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以获取给定模型的
    最大可用 token 数。默认为 `inf`.

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
    模型将以音频加转录文本的形式进行响应。 `["text"]` 可用于让
    模型仅以文本形式响应。不支持同时请求 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射，用于为你的
      提示中的变量替换值。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `image_url: optional string or null`

          要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的输入文件。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          要发送给模型的文件内容。

        - `file_id: optional string or null`

          要发送给模型的文件 ID。

        - `file_url: optional string`

          要发送给模型的文件 URL。

        - `filename: optional string`

          要发送给模型的文件名。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。提供以下字符串模式之一，或强制指定特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，type 始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，type 始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何调用它的指导，
        以及关于调用时告知用户哪些信息的指导。
        （如果有的话）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        使用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      （MCP）服务器为模型提供对额外工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        该 MCP 服务器的标签，用于在工具调用中标识它。

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

          允许的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据，还是只读。如果 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可用于自定义 MCP
        服务器 URL 或服务连接器。你的应用程序必须处理 OAuth 授权
        流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已针对 2026 年 9 月 1 日之后发布的模型弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
        通过安全 MCP 隧道连接。

        当前支持的值 `connector_id` 包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google Calendar： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook Calendar： `connector_outlookcalendar`
        - Outlook Email： `connector_outlookemail`
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

        该 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，还是只读。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。取值之一为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供 `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。需提供
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
    为某个会话启用追踪，就无法再修改其配置。

    `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
    工作流名称、分组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪进行更细粒度的配置。

      - `group_id: optional string`

        附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
        分组。

      - `metadata: optional unknown`

        附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
        过滤。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在 Traces Dashboard 中为该追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

    截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

    截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

      - `retention_ratio: number`

        在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

        - `post_instructions: optional number`

          指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Transcription Session Create Response

- `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

  一个 Realtime 转录会话配置对象。

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

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        转录模型的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

        轮次检测的配置。可以设置为 `null` 以关闭。服务端
        VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
        语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          在 VAD 检测到语音之前包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          检测语音停止的静音时长（以毫秒为单位）。默认为
          为 500ms。使用较短的值时，模型响应会更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
          阈值要求更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测的类型，仅 `server_vad` 目前受支持。

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    服务端输出中要包含的其他字段。

    - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
  语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音时长（以毫秒为单位）。默认为
    为 500ms。使用较短的值时，模型响应会更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
    阈值要求更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 目前受支持。

# Sessions

## Create session

**post** `/realtime/sessions`

创建一个临时 API 令牌，用于客户端应用中调用
Realtime API，可使用与
`session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 其中包含的 key
包含一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以便调用 Realtime API。

返回已创建的 Realtime 会话对象以及一个临时密钥。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会
    在一分钟后过期。

  - `value: string`

    可在客户端环境中用于认证连接到
    实时 API 的临时密钥。请在客户端环境中使用它，而不是
    标准的 API 令牌，标准令牌应仅 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，可以
  设置为 `null` 开启后再关闭。输入音频转录并非模型
  原生支持，因为模型直接消费音频。转录会
  异步运行，并应作为大致指引看待，
  而非模型所理解的表示。

  - `model: optional string`

    用于转录的模型。

- `instructions: optional string`

  默认系统指令（即系统消息）会被前置到模型调用中。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“保持极度简洁”、“表现得友好”、“以下是良好响应的示例”）以及音频行为（例如“说话快一些”、“在声音中注入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
  请注意，服务端会设置默认指令，如果未设置此字段将使用这些默认指令，它们在会话开头的 `session.created` 事件中可见。

- `max_response_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 以获取给定模型的
  最大可用 token 数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的映射，用于为你的
    提示中的变量替换值。替换值可以是字符串，也可以是其他
    Response 输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。取值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型。始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        要发送给模型的文件 ID。

      - `image_url: optional string or null`

        要发送给模型的图像 URL。可以是完全限定的 URL，也可是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的输入文件。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 让系统自动选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        要发送给模型的文件内容。

      - `file_id: optional string or null`

        要发送给模型的文件 ID。

      - `file_url: optional string`

        要发送给模型的文件 URL。

      - `filename: optional string`

        要发送给模型的文件名。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音响应的速度。1.0 是默认速度。0.25 是
  最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，
  不能在响应进行中更改。

- `temperature: optional number`

  模型的采样温度，限制范围为 [0.6, 1.2]。默认为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何调用它的指导，
    以及关于调用时告知用户哪些信息的指导。
    （如果有的话）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    使用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪 的配置选项。设为 null 可禁用 追踪。一旦
  为某个会话启用追踪，就无法再修改其配置。

  `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
  工作流名称、分组 ID 和元数据。

  - `"auto"`

    会话的默认 追踪 模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪进行更细粒度的配置。

    - `group_id: optional string`

      附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
      在追踪仪表板中的分组。

    - `metadata: optional unknown`

      附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
      在追踪仪表板中的筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在追踪仪表板中为 追踪 命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 使用量和成本的有效方法。

  截断会减少下一轮中缓存的 token 数（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，这样可以减少未来截断的次数，从而提高缓存命中率。

  截断可以完全禁用，这意味着服务器永远不会进行截断，但当对话超过模型的输入 token 上限时，会返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超过输入 token 上限时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留一定比例的对话 token。这样可以在多个回合之间分摊截断，有助于提升缓存 token 的利用率。

    - `retention_ratio: number`

      在超出输入 token 上限时，要保留的指令后对话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时设置此值。将其设置为 `0.8` 表示消息会被丢弃，直到已使用 token 达到最大允许 token 数的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则将使用模型的默认 token 上限。

      - `post_instructions: optional number`

        指令之后（包括工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示在指令之后的对话超过 5,000 token 时将发生截断。此值不能高于模型上下文窗口大小减去最大输出 token 数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
  音频音量，并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音时长（以毫秒为单位）。默认为
    为 500ms。使用较短的值时，模型响应会更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
    阈值要求更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 目前受支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型回应的声音。支持的内置声音有
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，和 `cedar`。你也可以提供一个带有自定义 voice 对象的
  `id`，例如 `{ "id": "voice_1234" }`. 一旦模型至少回复过一次音频，会话期间就无法更改语音。
  the session once the model has responded with audio at least once.

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

      自定义语音 ID，例如 `voice_1234`.

### Returns

- `id: optional string`

  会话的唯一标识符，形如 `sess_1234567890abcdef`.

- `audio: optional object { input, output }`

  会话输入和输出音频的配置。

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

        降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转写的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

        轮次检测的类型，仅 `server_vad` 目前受支持。

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

  服务端输出中要包含的其他字段。

  - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用之前添加的默认系统指令（即系统消息）。
  此字段允许客户端引导模型给出期望的响应。可以指导模型的响应内容和格式，
  （例如 "be extremely succinct"、"act friendly"、"here are examples of good responses"），
  （例如 "be extremely succinct"、"act friendly"、"here are examples of good
  responses"）以及音频行为（例如 "talk quickly"、"inject emotion
  into your voice", "laugh frequently"). 指令无法保证
  由模型遵循，但它们为模型提供关于
  期望行为的指导。

  请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并且它们
  在会话开始时的 `session.created` 事件中可见。
  会话开始时的事件中。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 以获取给定模型的
  最大可用 token 数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string`

  此会话使用的 Realtime 模型。

- `object: optional string`

  对象类型。始终为 `realtime.session`.

- `output_modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `tool_choice: optional string`

  模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何调用它的指导，
    以及关于调用时告知用户哪些信息的指导。
    （如果有的话）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    使用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪 的配置选项。设为 null 可禁用 追踪。一旦
  为某个会话启用追踪，就无法再修改其配置。

  `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
  工作流名称、分组 ID 和元数据。

  - `"auto"`

    会话的默认 追踪 模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪进行更细粒度的配置。

    - `group_id: optional string`

      附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
      在追踪仪表板中的分组。

    - `metadata: optional unknown`

      附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
      在追踪仪表板中的筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在追踪仪表板中为 追踪 命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
  音频音量，并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音时长（以毫秒为单位）。默认为
    为 500ms。使用较短的值时，模型响应会更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
    阈值要求更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 目前受支持。

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

#### Response

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

#### Response

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

### Session Create Response

- `SessionCreateResponse object { id, audio, expires_at, 10 more }`

  Realtime 会话配置对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: optional object { input, output }`

    会话输入和输出音频的配置。

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

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转写的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

          轮次检测的类型，仅 `server_vad` 目前受支持。

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

    服务端输出中要包含的其他字段。

    - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用之前添加的默认系统指令（即系统消息）。
    此字段允许客户端引导模型给出期望的响应。可以指导模型的响应内容和格式，
    （例如 "be extremely succinct"、"act friendly"、"here are examples of good responses"），
    （例如 "be extremely succinct"、"act friendly"、"here are examples of good
    responses"）以及音频行为（例如 "talk quickly"、"inject emotion
    into your voice", "laugh frequently"). 指令无法保证
    由模型遵循，但它们为模型提供关于
    期望行为的指导。

    请注意，服务端会设置默认指令，如果此字段未设置，则会使用这些默认指令，并且它们
    在会话开始时的 `session.created` 事件中可见。
    会话开始时的事件中。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用在内。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以获取给定模型的
    最大可用 token 数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string`

    此会话使用的 Realtime 模型。

  - `object: optional string`

    对象类型。始终为 `realtime.session`.

  - `output_modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频，
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `tool_choice: optional string`

    模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何调用它的指导，
      以及关于调用时告知用户哪些信息的指导。
      （如果有的话）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    追踪 的配置选项。设为 null 可禁用 追踪。一旦
    为某个会话启用追踪，就无法再修改其配置。

    `auto` 会使用默认的工作流名称、分组 ID 和元数据，为该会话创建一个追踪。
    工作流名称、分组 ID 和元数据。

    - `"auto"`

      会话的默认 追踪 模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪进行更细粒度的配置。

      - `group_id: optional string`

        附加到此追踪上的分组 ID，用于在 Traces Dashboard 中进行过滤和
        在追踪仪表板中的分组。

      - `metadata: optional unknown`

        附加到此追踪上的任意元数据，用于在 Traces Dashboard 中启用
        在追踪仪表板中的筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在追踪仪表板中为 追踪 命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测的配置。可以设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
    音频音量，并在用户语音结束时进行响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静音时长（以毫秒为单位）。默认为
      为 500ms。使用较短的值时，模型响应会更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
      阈值要求更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 目前受支持。

# 转录会话

## 创建转录会话

**post** `/realtime/transcription_sessions`

创建一个临时 API 令牌，用于客户端应用中调用
Realtime API 专为实时转录而设计。
可使用与相同的会话参数进行配置 `transcription_session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 其中包含的 key
包含一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以便调用 Realtime API。

返回已创建的 Realtime 转录会话对象，以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在转录中包含的项目集合。当前可用的项目包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`，输入音频必须为 24kHz 采样率的 16 位 PCM，
  单声道（mono），并采用小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可以设置为 `null` 以关闭。
  降噪会在输入音频缓冲区中的音频发送到 VAD 和模型之前对其进行过滤。
  对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型表现。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转录的配置。客户端可以选择性地设置转录的语言和提示词，这些为转录服务提供了额外的指导。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本之前等待的时长。
    较高的值可以提高转写准确率，但会增加延迟。
    仅在 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转写的单词或短语。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中
    提供可提高准确率和延迟表现。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。由 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`。当你 `gpt-4o-transcribe-diarize` 需要带说话人标签的说话人分离时，请使用。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续上一段音频
    片段的可选文本。
    对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一个自由文本字符串，例如 "expect words related to technology"。
    Prompt 不支持与 `gpt-realtime-whisper` GA Realtime 会话中支持。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 用于关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音时长（以毫秒为单位）。默认为
    为 500ms。使用较短的值时，模型响应会更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
    阈值要求更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional "server_vad"`

    轮次检测类型。目前仅 `server_vad` 支持转录会话。

    - `"server_vad"`

### Returns

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅在会话
  通过 REST API 在服务端创建时出现。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会
    在一分钟后过期。

  - `value: string`

    可在客户端环境中用于认证连接到
    实时 API 的临时密钥。请在客户端环境中使用它，而不是
    标准的 API 令牌，标准令牌应仅 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可以设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
  音频音量，并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音时长（以毫秒为单位）。默认为
    为 500ms。使用较短的值时，模型响应会更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
    阈值要求更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 目前受支持。

### 示例

```http
curl https://api.openai.com/v1/realtime/transcription_sessions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### Response

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

#### Response

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

### 转写会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  新的实时转录会话配置。

  当通过 REST API 在服务端创建会话时，会话对象
  还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。该
  属性在通过 WebSocket API 更新会话时不会出现。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅在会话
    通过 REST API 在服务端创建时出现。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌都会
      在一分钟后过期。

    - `value: string`

      可在客户端环境中用于认证连接到
      实时 API 的临时密钥。请在客户端环境中使用它，而不是
      标准的 API 令牌，标准令牌应仅 服务端 使用。

  - `input_audio_format: optional string`

    输入音频的格式。选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可用输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，和 `gpt-realtime-whisper`.

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

    模型可以响应的模态集合。若要禁用音频，
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测的配置。可以设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户
    音频音量，并在用户语音结束时进行响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静音时长（以毫秒为单位）。默认为
      为 500ms。使用较短的值时，模型响应会更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。较
      阈值要求更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 目前受支持。

# 翻译

# 客户端密钥

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并关联一个翻译会话配置。

客户端密钥是短期令牌，可传递给客户端应用，例如，
例如 Web 前端或移动客户端，可授予对 Realtime
Translation API 的访问权限，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义
TTL。

返回所创建的客户端密钥以及生效的翻译会话对象。
客户端密钥是一个形如以下形式的字符串 `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话持续流式传入源音频，
  并持续流式输出翻译后的音频以及转录增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    用于翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 可禁用它。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍基于
        输入音频流运行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量文本的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期的配置。过期指的是之后的时间，
  客户端密钥将不再可用于创建会话。会话本身在该时间开始后
  仍可继续进行。一个密钥在其过期之前可用于创建多个会话。
  直到它过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点， `seconds` 将被加到客户端密钥的时间上以生成过期时间戳。仅 `created_at` 支持某些值。 `created_at` 目前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

### Returns

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  创建翻译会话和 Realtime API 客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    Realtime 翻译会话。翻译会话会持续将输入
    音频翻译为配置好的输出语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      用于翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍基于
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过以下方式更改： `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

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

#### Response

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

#### Response

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
