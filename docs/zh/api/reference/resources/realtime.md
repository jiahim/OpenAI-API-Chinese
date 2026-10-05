# Realtime

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 域类型

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

    用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。使用
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    可提升准确率并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
    对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
    Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

### 会话已创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  在对话创建时返回。会话创建完成后立即发出。

  - `conversation: object { id, object }`

    对话资源。

    - `id: optional string`

      对话的唯一 ID。

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

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` ，用于系统消息。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务端生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的一个 Realtime 项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      该请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 项，列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

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

    一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数，格式为 JSON 字符串。

    - `name: string`

      已运行工具的名称。

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

    请求人工批准工具调用的 Realtime item。

    - `id: string`

      审批请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具的名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

### 已添加对话项

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当 Item 被添加到默认会话时由服务端发送。这种情况可能出现在以下几种情形中：

  - 当客户端发送一个 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。此时该 Item 将是一条包含缓冲区音频内容的用户消息。
  - 当模型正在生成 Response 时。此时 `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时还没有任何内容（且 `status` 将是 `in_progress`).

  该事件将包含 Item 的完整内容（模型正在生成 Response 时除外），但不包括音频数据；如有必要，音频数据可以通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

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
    在插入 Item 时保持顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向对话上下文中添加新的 Item，包括消息、函数
  调用和函数调用响应。该事件既可用于填充对话的
  “历史记录”，也可用于在流式传输过程中添加新 item，但存在
  当前限制：无法填充助手音频消息。

  如果成功，服务端将发出一个 `conversation.item.added` 事件，并在，
  该 item 完成时发出一个 `conversation.item.done` 事件。否则将发送一个
  `error` 事件。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.create"`

    事件类型，必须为 `conversation.item.create`.

    - `"conversation.item.create"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

  - `previous_item_id: optional string`

    新 item 将插入到其后的前一个 item 的 ID。如果未设置，新 item 将追加到对话末尾。

    如果设置为 `root`，新 item 将添加到对话开头。

    如果设置为现有 ID，则允许在对话中间插入一个 item。如果找不到该 ID，将返回错误，并且不会添加该 item。

### 会话项创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在创建对话项时返回。存在多种触发此事件的情形：

  - 服务端正在生成 Response，如果成功，将产生
    一个或两个 Item，类型为 `message`
    （role `assistant`) 或类型 `function_call`.
  - 输入音频缓冲区已被提交，提交方可以是客户端，也可以是
    服务端（处于 `server_vad` 模式）。服务端将获取输入音频缓冲区的内容，
    并将其添加到一条新的用户消息 Item 中。
  - 客户端发送了 `conversation.item.create` 事件以添加新的 Item
    到该 Conversation。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.created"`

    事件类型，必须为 `conversation.item.created`.

    - `"conversation.item.created"`

  - `previous_item_id: optional string or null`

    Conversation 上下文中前一个项的 ID，便于
    客户端理解对话的顺序。若该 Item 没有前驱项，可以为 `null` 。
    如果该 item 没有前驱项。

### 对话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你希望从对话中移除某项时，发送该事件
  历史。服务端将响应一个 `conversation.item.deleted` 事件，
  除非该项在对话历史中不存在，此时服务端
  将响应一个错误。

  - `item_id: string`

    要删除项的 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 对话项已删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当会话中的某个条目由客户端通过以下方式删除时返回：
  `conversation.item.delete` 事件。此事件用于同步服务端对会话历史的理解与客户端的视图。
  服务端对会话历史的理解与客户端的视图保持一致。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被删除的条目 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 会话项完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  当某个对话 item 完成时返回。

  该事件将包含 Item 的完整内容，但音频数据除外，如需可以单独通过一个 `conversation.item.retrieve` 事件获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

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
    在插入 Item 时保持顺序。

### 会话项输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  此事件是写入用户音频缓冲区后，音频转写的输出。
  当客户端或服务端（启用 VAD 时）提交输入音频缓冲区时，
  转写便会开始。转写与 Response 创建是异步执行的，
  因此此事件可能早于或晚于 Response 事件到达。
  the Response events.

  Realtime API 模型原生支持音频，因此输入转写是
  由单独的 ASR（自动语音识别）模型运行的独立过程。
  转写文本可能与模型的解读存在一定偏差，
  应被视为大致参考。

  - `content_index: number`

    包含音频的内容分段的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在被转写的、包含音频的项的 ID。

  - `transcript: string`

    转写后的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    该转写的用量统计，按 ASR 模型的定价计费，而非 realtime 模型的定价。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 用量计费的模型的用量统计。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体， `tokens` 始终为 tokens。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入 token 的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用统计信息。

      - `seconds: number`

        输入音频的时长，单位为秒。

      - `type: "duration"`

        usage 对象的类型。对于此变体， `duration` 始终为 tokens。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测出任何语言。

    - `code: string`

      在音频中检测到的语言代码。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项目输入音频转录增量事件

- `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

  当输入音频转录内容部分的文本值使用增量转录结果更新时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在被转写的、包含音频的项的 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    该内容部分在项目内容数组中的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。可通过将会话配置为 `"include": ["item.input_audio_transcription.logprobs"]`。来启用。数组中的每个条目对应此段转录所选词元的对数概率。这有助于判断给定转录片段是否存在多个有效选项。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 会话项目输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  在配置了输入音频转写，且用户消息的转写
  请求失败时返回。这些事件与其他事件分开，以便客户端可以识别相关的 Item。
  `error` 事件，以便客户端识别相关的 Item。

  - `content_index: number`

    包含音频的内容分段的索引。

  - `error: object { code, message, param, type }`

    转写错误的详细信息。

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

    用户消息项的 ID。

  - `type: "conversation.item.input_audio_transcription.failed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.failed`.

    - `"conversation.item.input_audio_transcription.failed"`

### 会话项输入音频转录片段

- `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

  在为某个 item 识别出输入音频转写片段时返回。

  - `id: string`

    片段标识符。

  - `content_index: number`

    该 item 中输入音频内容部分的索引。

  - `end: number`

    片段的结束时间（以秒为单位）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含输入音频内容的 item 的 ID。

  - `speaker: string`

    该片段检测到的说话人标签。

  - `start: number`

    片段的开始时间（以秒为单位）。

  - `text: string`

    该片段对应的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### 会话项检索事件

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你想检索服务端对会话历史中某个特定条目的表示时，发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
  服务端将使用一个进行响应 `conversation.item.retrieved` 事件，
  除非该项在对话历史中不存在，此时服务端
  将响应一个错误。

  - `item_id: string`

    要检索的条目 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件以截断先前助手消息的音频。服务器
  会以快于实时的速度生成音频，因此当用户
  中断以截断已发送到客户端但尚未
  播放的音频时，此事件非常有用。这会将服务器对音频的理解与
  客户端的播放同步起来。

  截断音频将删除 服务端 文本转录，以确保上
  下文中没有用户尚未听到的文本。

  如果成功，服务器将使用以下内容进行响应： `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    截断音频的截止时长（包含），以毫秒为单位。如果
    audio_end_ms 大于实际音频时长，服务器
    将返回错误。

  - `content_index: number`

    要截断的内容部分的索引。将其设置为 `0`.

  - `item_id: string`

    要截断的助手消息项的 ID。只有助手消息
    项可以被截断。

  - `type: "conversation.item.truncate"`

    事件类型，必须为 `conversation.item.truncate`.

    - `"conversation.item.truncate"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 对话项截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当早先的助手音频消息项被客户端截断时返回，包含一个
  事件。此事件用于 `conversation.item.truncate` 事件。此事件用于
  使服务端对音频的理解与客户端的播放保持同步。

  此操作将截断音频并移除 服务端 文本转录，
  以确保上下文中不存在用户尚未听到的文本。

  - `audio_end_ms: number`

    音频被截断的时长，单位为毫秒。

  - `content_index: number`

    被截断的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被截断的助手消息项的 ID。

  - `type: "conversation.item.truncated"`

    事件类型，必须为 `conversation.item.truncated`.

    - `"conversation.item.truncated"`

### 包含引用的对话项

- `ConversationItemWithReference object { id, arguments, call_id, 7 more }`

  要添加到对话中的项。

  - `id: optional string`

    对于类型为 (`message` | `function_call` | `function_call_output`)
    此字段允许客户端为该项分配唯一 ID。该字段
    不是必需的，因为如果未提供，服务端将生成一个。

    对于类型为 `item_reference`，的项，此字段是必需的，并且是
    对对话中先前存在过的任何项的引用。

  - `arguments: optional string`

    函数调用的参数（适用于 `function_call` 项）。

  - `call_id: optional string`

    函数调用的 ID（适用于 `function_call` 和
    `function_call_output` 项）。如果传递到 `function_call_output`
    项，服务端将检查具有相同 ID 的 `function_call` 项是否存在于
    对话历史中。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 项。

    - 角色为 `system` 的消息项仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` content.

    - `id: optional string`

      用于引用的先前对话项的 ID（针对 `item_reference`
      中的内容类型， `response.create` 事件）。这些引用可以同时涉及
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

    被调用的函数名称（针对 `function_call` 项）。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符 —— 始终为 `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    函数调用的输出（针对 `function_call_output` 项）。

  - `role: optional "user" or "assistant" or "system"`

    消息发送者的角色（`user`, `assistant`, `system`），仅
    适用于 `message` 项。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    项的状态（`completed`, `incomplete`, `in_progress`）。这些状态对
    对话没有影响，但为了与
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
  缓冲区是一个临时存储，你可以向其中写入内容，并在稍后提交。提交操作会基于缓冲区内容在对话历史中创建一条新的
  用户消息条目，并清空缓冲区。
  输入音频转录（若已启用）将在缓冲区提交时生成。

  如果启用了 VAD，音频缓冲区将用于检测语音，并由服务端决定何时提交。当服务端 VAD 禁用时，你必须手动提交音频缓冲区。
  提交音频缓冲区。输入音频降噪会作用于对音频缓冲区的写入操作。
  客户端可选择每个事件中放入多少音频，单次最大为。

  15 MiB，例如客户端以较小的分块流式发送音频可以让
  VAD 响应更及时。与大多数其他客户端事件不同，服务端不会
  对该事件发送确认响应。
  对该事件发送确认响应。

  - `audio: string`

    Base64 编码的音频字节。其格式必须与会话配置中
    `input_audio_format` 字段所指定的格式一致。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 输入音频缓冲区清除事件

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务端将
  响应一个 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 输入音频缓冲区已清除事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  当输入音频缓冲区由客户端通过以下方式清除时返回：a
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### 输入音频缓冲区提交事件

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务器将自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会由模型创建响应。服务器将返回 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### Input Audio Buffer Committed Event

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  当输入音频缓冲区被提交时返回，无论是客户端主动提交，还是
  在服务端 VAD 模式下自动提交。item_id 属性即为即将创建的用户 `item_id` 消息项的 ID，因此随后还会向客户端发送一条 response.created
  事件，以通知该用户消息项已创建。 `conversation.item.created` 事件
  也会发送给客户端。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    即将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项将插入其后的前一项的 ID。
    如果该项没有前项，可以为 `null` 。

### Input Audio Buffer Dtmf Event Received Event

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一种表示电话键盘按键（0–9、*、#、A–D）的消息。
  属性是用户按下的键盘按键。 `event` 属性
  是用户按下的键盘按键。 `received_at` 是服务器接收到该事件的 UTC Unix 时间戳。
  是服务器接收到该事件的时间。

  - `event: string`

    用户按下的电话键盘按键。

  - `received_at: number`

    服务器接收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### 输入音频缓冲区语音开始事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  由服务端在处于 `server_vad` 模式时发送，以表明已在音频缓冲区中检测到语音。只要有音频被添加到
  缓冲区，就可能发生此事件（除非已经检测到语音）。客户端可能希望使用此
  事件来中断音频播放或向用户提供视觉反馈。
  客户端应预期在语音停止时会收到一个。

  事件。 `input_audio_buffer.speech_stopped` 事件
  。该 `item_id` 属性是将在语音停止时创建的用户消息项的 ID，
  该 ID 也会包含在
  `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间
  手动提交音频缓冲区）。

  - `audio_start_ms: number`

    从本次会话中首次检测到语音时起，所有写入缓冲区的音频的起始时间（毫秒）。这对应于发送给模型的音频起始位置，因此包含
    在 Session 中配置的
    （前缀指令）。
    `prefix_padding_ms` 。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将在语音停止时创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### Input Audio Buffer Speech Stopped Event

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  当服务端检测到音频缓冲区 `server_vad` 中的语音结束时返回。服务端还会发送一个
  在音频缓冲区中检测到语音结束时触发。 `conversation.item.created`
  事件与从音频缓冲区创建的用户消息条目一起提供。

  - `audio_end_ms: number`

    自会话开始至语音停止时的毫秒数。此值将
    对应于发送给模型的音频结束时刻，因此包含
    `min_silence_duration_ms` 。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    即将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时已触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  当输入音频缓冲区触发 Server VAD 超时时返回。该超时通过会话设置进行配置，表示
  通过 `idle_timeout_ms` 在 `turn_detection` 会话的设置中进行配置，并表示
  在配置的时长内未检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段表示自上一次
  模型响应之后到触发时间为止的音频片段，以写入输入音频缓冲区的音频起点为偏移量。这意味着它标定了那段保持静默的音频
  片段，并且
  起始值与结束值之差大致等于所配置的超时时长。

  空音频将作为一个 `input_audio` 项提交到对话中（将会产生
  `input_audio_buffer.committed` 事件），并生成模型响应。可能存在没有触发 VAD 但仍被模型检测到的语音，因此模型可能以
  与对话相关的内容或提示继续说话的回复作出响应。
  与对话相关的内容或提示继续说话的回复。

  - `audio_end_ms: number`

    触发超时时刻已写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    写入输入音频缓冲区中、位于最后一个模型响应的播放时间之后的音频的毫秒偏移量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    与此分段关联的项的 ID。

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

  当某个项目的 MCP 工具列表已列出时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列表工具项的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp 列出工具失败

- `McpListToolsFailed object { event_id, item_id, type }`

  当列出某个项目的 MCP 工具失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列表工具项的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp List Tools In Progress

- `McpListToolsInProgress object { event_id, item_id, type }`

  在为某个条目列出 MCP 工具时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列表工具项的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### Noise Reduction Type

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### Output Audio Buffer Clear Event

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
  停止生成音频并发出 `output_audio_buffer.cleared` 事件。该
  事件应之前有一个 `response.cancel` 客户端事件以停止当前响应的
  生成。
  [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### 速率限制更新事件

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，用于指示更新后的速率限制。
  创建 Response 时，会为输出“预留”部分 token；
  此处显示的速率限制反映了该预留情况，并在 Response
  完成后进行相应调整。

  - `event_id: string`

    服务端事件的唯一 ID。

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

      速率限制重置之前的秒数。

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
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

        用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提升准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时时间，超时后将自动触发模型响应。该参数
          在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
          当前上下文有效地提示用户继续对话。
          当前上下文。

          该超时值将在最后一次模型响应的音频播放完成后开始计时，
          即它的设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与该 Response 相关的事件）在到达超时时会被发出。
          空闲超时当前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）向默认
          对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
          为 500ms。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          更高的阈值要求更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否使用输出自动中断默认
          对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应的速度，为原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

      该参数是对生成后音频的后处理调整，也
      可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
      一旦模型至少回应过一次音频后就无法更改。
      自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
      我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

      用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。使用
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      可提升准确率并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
      对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
      Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

        如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选超时时间，超时后将自动触发模型响应。该参数
        在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
        当前上下文有效地提示用户继续对话。
        当前上下文。

        该超时值将在最后一次模型响应的音频播放完成后开始计时，
        即它的设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与该 Response 相关的事件）在到达超时时会被发出。
        空闲超时当前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否自动中断（取消）向默认
        对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
        为 500ms。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        更高的阈值要求更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD 停止事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否使用输出自动中断默认
        对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

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

    模型语音回应的速度，为原始速度的倍数。
    1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

    该参数是对生成后音频的后处理调整，也
    可以通过提示让模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于回应的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
    一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
    一旦模型至少回应过一次音频后就无法更改。
    自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
    我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

  轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

  服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

      如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选超时时间，超时后将自动触发模型响应。该参数
      在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
      当前上下文有效地提示用户继续对话。
      当前上下文。

      该超时值将在最后一次模型响应的音频播放完成后开始计时，
      即它的设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与该 Response 相关的事件）在到达超时时会被发出。
      空闲超时当前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否自动中断（取消）向默认
      对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

      如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
      为 500ms。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      更高的阈值要求更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD 停止事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否使用输出自动中断默认
      对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

### 实时客户端事件

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向对话上下文中添加新的 Item，包括消息、函数
    调用和函数调用响应。该事件既可用于填充对话的
    “历史记录”，也可用于在流式传输过程中添加新 item，但存在
    当前限制：无法填充助手音频消息。

    如果成功，服务端将发出一个 `conversation.item.added` 事件，并在，
    该 item 完成时发出一个 `conversation.item.done` 事件。否则将发送一个
    `error` 事件。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的一个 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          该请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

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

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数，格式为 JSON 字符串。

        - `name: string`

          已运行工具的名称。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.create"`

      事件类型，必须为 `conversation.item.create`.

      - `"conversation.item.create"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

    - `previous_item_id: optional string`

      新 item 将插入到其后的前一个 item 的 ID。如果未设置，新 item 将追加到对话末尾。

      如果设置为 `root`，新 item 将添加到对话开头。

      如果设置为现有 ID，则允许在对话中间插入一个 item。如果找不到该 ID，将返回错误，并且不会添加该 item。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你希望从对话中移除某项时，发送该事件
    历史。服务端将响应一个 `conversation.item.deleted` 事件，
    除非该项在对话历史中不存在，此时服务端
    将响应一个错误。

    - `item_id: string`

      要删除项的 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你想检索服务端对会话历史中某个特定条目的表示时，发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
    服务端将使用一个进行响应 `conversation.item.retrieved` 事件，
    除非该项在对话历史中不存在，此时服务端
    将响应一个错误。

    - `item_id: string`

      要检索的条目 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件以截断先前助手消息的音频。服务器
    会以快于实时的速度生成音频，因此当用户
    中断以截断已发送到客户端但尚未
    播放的音频时，此事件非常有用。这会将服务器对音频的理解与
    客户端的播放同步起来。

    截断音频将删除 服务端 文本转录，以确保上
    下文中没有用户尚未听到的文本。

    如果成功，服务器将使用以下内容进行响应： `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      截断音频的截止时长（包含），以毫秒为单位。如果
      audio_end_ms 大于实际音频时长，服务器
      将返回错误。

    - `content_index: number`

      要截断的内容部分的索引。将其设置为 `0`.

    - `item_id: string`

      要截断的助手消息项的 ID。只有助手消息
      项可以被截断。

    - `type: "conversation.item.truncate"`

      事件类型，必须为 `conversation.item.truncate`.

      - `"conversation.item.truncate"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件可将音频字节追加到输入音频缓冲区。该音频
    缓冲区是一个临时存储，你可以向其中写入内容，并在稍后提交。提交操作会基于缓冲区内容在对话历史中创建一条新的
    用户消息条目，并清空缓冲区。
    输入音频转录（若已启用）将在缓冲区提交时生成。

    如果启用了 VAD，音频缓冲区将用于检测语音，并由服务端决定何时提交。当服务端 VAD 禁用时，你必须手动提交音频缓冲区。
    提交音频缓冲区。输入音频降噪会作用于对音频缓冲区的写入操作。
    客户端可选择每个事件中放入多少音频，单次最大为。

    15 MiB，例如客户端以较小的分块流式发送音频可以让
    VAD 响应更及时。与大多数其他客户端事件不同，服务端不会
    对该事件发送确认响应。
    对该事件发送确认响应。

    - `audio: string`

      Base64 编码的音频字节。其格式必须与会话配置中
      `input_audio_format` 字段所指定的格式一致。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务端将
    响应一个 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
    停止生成音频并发出 `output_audio_buffer.cleared` 事件。该
    事件应之前有一个 `response.cancel` 客户端事件以停止当前响应的
    生成。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务器将自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会由模型创建响应。服务器将返回 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消正在进行的响应。服务端会响应
    一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果
    没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地
    调用 `response.cancel` ，此时会返回错误，
    会话不会受到影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

    - `response_id: optional string`

      要取消的特定响应 ID——如果未提供，则取消
      默认对话中正在进行的响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务端创建一个 Response，即触发
    模型推理。在 Server VAD 模式下，服务端会自动创建 Responses
    。

    一个 Response 至少包含一个 Item，也可能有两个，此时第二个
    将是函数调用。这些 Item 默认会追加到
    对话历史中。

    服务端将使用一个进行响应 `response.created` 事件、已创建 Item 的事件
    和内容的事件，最后是一个 `response.done` 事件，用于指示
    Response is complete.

    该 `response.create` event includes inference configuration like
    `instructions` 和 `tools`. If these are set, they will override the Session's
    configuration for this Response only.

    Responses can be created out-of-band of the default Conversation, meaning that they can
    have arbitrary input, and it's possible to disable writing the output to the Conversation.
    Only one Response can write to the default Conversation at a time, but otherwise multiple
    Responses can be created in parallel. The `metadata` field is a good way to disambiguate
    multiple simultaneous Responses.

    Clients can set `conversation` to `none` to create a Response that does not write to the default
    Conversation. Arbitrary input can be provided with the `input` field, which is an array accepting
    raw Items and references to existing Items.

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

    - `response: optional RealtimeResponseCreateParams`

      Create a new Realtime response with these parameters

      - `audio: optional RealtimeResponseCreateAudioOutput`

        Configuration for audio input and output.

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

            模型用于回应的声音。支持的内置声音包括
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
            一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
            一旦模型至少回应过一次音频后就无法更改。
            自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
            我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

        Controls which conversation the response is added to. Currently supports
        `auto` 和 `none`, with `auto` 作为默认值。该 `auto` 值
        表示响应的内容将被添加到默认
        对话中。将其设置为 `none` 以创建一个带外响应，该响应
        不会向默认对话添加项。

        - `string`

        - `"auto" or "none"`

          Controls which conversation the response is added to. Currently supports
          `auto` 和 `none`, with `auto` 作为默认值。该 `auto` 值
          表示响应的内容将被添加到默认
          对话中。将其设置为 `none` 以创建一个带外响应，该响应
          不会向默认对话添加项。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        包含在模型提示中的输入项。使用此字段
        会为本次 Response 创建一个新上下文，而不是使用默认的
        对话。空数组 `[]` 将清除本次 Response 的上下文。
        注意，这里可以包含对会话中先前出现过的项的引用
        通过它们的 id。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一个函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一个函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的一个 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime item。

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型给出期望的响应。可以指示模型关于响应内容和格式（例如，“保持极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。这些指令不保证被模型遵循，但它们为模型期望的行为提供指导。
        注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token
        数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 组键值对。可用于
        以结构化格式存储对象的附加信息，并通过 API
        或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前可能的取值仅有
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        output 设置为 mode `text` 将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以并行调用多个工具。仅支持
        推理 Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射值，用于替换你
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

        模型如何选择工具。提供以下字符串模式之一，或强制指定某个
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何
            调用它的指引，以及调用时告诉用户什么的
            （指引（如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

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

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已于 2026/09/01 之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
            通过安全 MCP 通道连接。

            当前支持的 `connector_id` 值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新任何字段
    除了 `voice` 和 `model`. `voice` 只能在没有其他音频输出的情况下更新。

    当服务器收到 `session.update`，时，它会响应
    一个 `session.updated` 事件，显示完整且生效的配置。
    只有出现在 `session.update` 中的字段会被更新。要清除像
    `instructions`,传递一个空字符串。要清除类似 `tools`，的字段,传递一个空数组。
    要清除类似 `turn_detection`，的字段,传递 `null`.

    要关闭输入音频降噪,请发送以下 Realtime 事件:

    ```json
    {"type":"session.update","session":{"type":"realtime","audio":{"input":{"noise_reduction":null}}}}
    ```

    对于转录会话,请使用 `"type":"transcription"` 放在 `session`.
    从更新中省略 `audio.input.noise_reduction` 会保留其当前设置不变。

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。选择实时
      session 或 transcription 会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。Realtime 始终为 `realtime` 。API。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

                用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。使用
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
                可提升准确率并降低延迟。

              - `languages: optional array of string`

                输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
                对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
                Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                  如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选超时时间，超时后将自动触发模型响应。该参数
                  在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                  当前上下文有效地提示用户继续对话。
                  当前上下文。

                  该超时值将在最后一次模型响应的音频播放完成后开始计时，
                  即它的设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与该 Response 相关的事件）在到达超时时会被发出。
                  空闲超时当前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否自动中断（取消）向默认
                  对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                  为毫秒）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                  为 500ms。该值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                  更高的阈值要求更响亮的音频才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD 停止事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否使用输出自动中断默认
                  对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应的速度，为原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

              该参数是对生成后音频的后处理调整，也
              可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型用于回应的声音。支持的内置声音包括
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
              一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
              一旦模型至少回应过一次音频后就无法更改。
              自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
              我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

          注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
          模型将响应音频以及转录文本。 `["text"]` 可用于让
          模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可以并行调用多个工具。仅支持
          推理 Realtime 模型，例如 `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `reasoning: optional RealtimeReasoning`

          支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型如何选择工具。提供以下字符串模式之一，或强制指定某个
          函数/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪些工具（如果有）。

            `none` 表示模型将不调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或
            多个工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项可以强制模型调用特定的函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

        - `tools: optional RealtimeToolsConfig`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

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

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
              MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段已于 2026/09/01 之后发布的模型弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
              通过安全 MCP 通道连接。

              当前支持的 `connector_id` 值包括：

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

              此 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 头，用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`，也可以是与工具关联的过滤对象
                需要审批的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果某个
                    MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    与此过滤器的标注，则它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果某个
                    MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    与此过滤器的标注，则它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值之一为 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
          为会话启用 追踪，配置便不可修改。

          `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
          工作流 名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            对 追踪 的细粒度配置。

            - `group_id: optional string`

              附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
              筛选。

            - `workflow_name: optional string`

              附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
              命名 追踪。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

          客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

          截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

          截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

            - `retention_ratio: number`

              当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

            - `type: "retention_ratio"`

              使用按比例保留的截断方式。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

              - `post_instructions: optional number`

                指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转写会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。Realtime 始终为 `transcription` 用于转写会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                  如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选超时时间，超时后将自动触发模型响应。该参数
                  在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                  当前上下文有效地提示用户继续对话。
                  当前上下文。

                  该超时值将在最后一次模型响应的音频播放完成后开始计时，
                  即它的设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与该 Response 相关的事件）在到达超时时会被发出。
                  空闲超时当前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否自动中断（取消）向默认
                  对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                  为毫秒）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                  为 500ms。该值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                  更高的阈值要求更响亮的音频才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD 停止事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否使用输出自动中断默认
                  对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      由客户端生成的可选 ID，用于标识此事件。这是一个客户端可以自行指定的任意字符串。如果该事件发生错误，它会被传回，但对应的 `session.updated` 事件将不会包含它。

### Realtime 对话项助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  Realtime 对话中的一条助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

    条目的类型。始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务端生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

    条目的类型。始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。始终为 `input_text` ，用于系统消息。

      - `"input_text"`

  - `role: "system"`

    消息发送者的角色。始终为 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

      Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

    - `detail: optional "auto" or "low" or "high"`

      图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

    - `text: optional string`

      文本内容（针对 `input_text`).

    - `transcript: optional string`

      音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

    - `type: optional "input_text" or "input_audio" or "input_image"`

      内容类型（`input_text`, `input_audio`，或 `input_image`).

      - `"input_text"`

      - `"input_audio"`

      - `"input_image"`

  - `role: "user"`

    消息发送者的角色。始终为 `user`.

    - `"user"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

    错误的类型（例如 "invalid_request_error"、"server_error"）。

  - `code: optional string or null`

    错误代码（如果有）。

  - `event_id: optional string or null`

    导致错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如果有）。

### Realtime 错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  在发生错误时返回，错误可能是客户端问题或服务端
  问题。大多数错误都是可恢复的，会话将保持打开状态，我们
  建议实现者默认监控和记录错误消息。

  - `error: RealtimeError`

    错误的详细信息。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误的类型（例如 "invalid_request_error"、"server_error"）。

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

    函数的描述，包括何时以及如何
    调用它的指引，以及调用时告诉用户什么的
    （指引（如果有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

### Realtime Mcp Approval Request

- `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

  请求人工批准工具调用的 Realtime item。

  - `id: string`

    审批请求的唯一 ID。

  - `arguments: string`

    工具参数的 JSON 字符串。

  - `name: string`

    要运行的工具的名称。

  - `server_label: string`

    发起请求的 MCP 服务器的标签。

  - `type: "mcp_approval_request"`

    条目的类型。始终为 `mcp_approval_request`.

    - `"mcp_approval_request"`

### Realtime Mcp Approval Response

- `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

  响应 MCP 审批请求的一个 Realtime 项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    正在回复的审批请求的 ID。

  - `approve: boolean`

    该请求是否已批准。

  - `type: "mcp_approval_response"`

    条目的类型。始终为 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    可选的决策原因。

### Realtime Mcp List Tools

- `RealtimeMcpListTools object { server_label, tools, type, id }`

  一个 Realtime 项，列出 MCP 服务器上可用的工具。

  - `server_label: string`

    MCP 服务器的标签。

  - `tools: array of object { input_schema, name, annotations, description }`

    服务器上可用的工具。

    - `input_schema: unknown`

      描述该工具输入的 JSON schema。

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

  一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

  - `id: string`

    该工具调用的唯一 ID。

  - `arguments: string`

    传递给该工具的参数，格式为 JSON 字符串。

  - `name: string`

    已运行工具的名称。

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

        模型用于回复的声音。一旦模型至少回复过一次音频，
        会话期间就无法再更改声音。可用的
        声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话期间就无法再更改声音。可用的
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

    响应被添加到的会话，由 `conversation`
    字段在 `response.create` 事件中决定。如果 `auto`，响应将被添加到
    默认会话，且 `conversation_id` 的值将是类似
    `conv_1234`。如果 `none`，的 ID，响应不会被添加到任何会话，且
    的值 `conversation_id` 将是 `null`。如果响应是由
    VAD 自动产生的，则响应将被添加到默认会话

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    ，包含本次响应中使用的工具调用。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API
    或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅有
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    output 设置为 mode `text` 将禁用模型的音频输出。

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

    关于该状态的更多详情。

    - `error: optional object { code, type }`

      导致响应失败的错误描述，
      在以下情况时填充： `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      Response 未完成的原因。对于 `cancelled` Response，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      字段（ `status` 字段的值。`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    Response 的使用统计信息，将用于计费。一个
    Realtime API 会话将维护对话上下文，并将新的
    项追加到对话中，因此先前轮次（文本与
    音频 token）的输出将作为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      Response 中使用的输入 token 详情。缓存 token 来自对话中先前轮次、作为当前响应上下文被包含的 token。此处的缓存 token 计入输入 token 的子集，即输入 token 包括缓存与未缓存的 token。

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

  Configuration for audio input and output.

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

      模型用于回应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
      一旦模型至少回应过一次音频后就无法更改。
      自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
      我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

  Create a new Realtime response with these parameters

  - `audio: optional RealtimeResponseCreateAudioOutput`

    Configuration for audio input and output.

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

        模型用于回应的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
        一旦模型至少回应过一次音频后就无法更改。
        自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
        我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

    Controls which conversation the response is added to. Currently supports
    `auto` 和 `none`, with `auto` 作为默认值。该 `auto` 值
    表示响应的内容将被添加到默认
    对话中。将其设置为 `none` 以创建一个带外响应，该响应
    不会向默认对话添加项。

    - `string`

    - `"auto" or "none"`

      Controls which conversation the response is added to. Currently supports
      `auto` 和 `none`, with `auto` 作为默认值。该 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个带外响应，该响应
      不会向默认对话添加项。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    包含在模型提示中的输入项。使用此字段
    会为本次 Response 创建一个新上下文，而不是使用默认的
    对话。空数组 `[]` 将清除本次 Response 的上下文。
    注意，这里可以包含对会话中先前出现过的项的引用
    通过它们的 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型给出期望的响应。可以指示模型关于响应内容和格式（例如，“保持极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。这些指令不保证被模型遵循，但它们为模型期望的行为提供指导。
    注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token
    数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API
    或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅有
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    output 设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅支持
    推理 Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

    模型如何选择工具。提供以下字符串模式之一，或强制指定某个
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可以强制模型调用特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何
        调用它的指引，以及调用时告诉用户什么的
        （指引（如果有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

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

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
        MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已于 2026/09/01 之后发布的模型弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
        通过安全 MCP 通道连接。

        当前支持的 `connector_id` 值包括：

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头，用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，也可以是与工具关联的过滤对象
          需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值之一为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime Response Status

- `RealtimeResponseStatus object { error, reason, type }`

  关于该状态的更多详情。

  - `error: optional object { code, type }`

    导致响应失败的错误描述，
    在以下情况时填充： `status` 为 `failed`.

    - `code: optional string`

      错误代码（如果有）。

    - `type: optional string`

      错误类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    Response 未完成的原因。对于 `cancelled` Response，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致响应失败的错误类型，对应
    字段（ `status` 字段的值。`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime Response Usage

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  Response 的使用统计信息，将用于计费。一个
  Realtime API 会话将维护对话上下文，并将新的
  项追加到对话中，因此先前轮次（文本与
  音频 token）的输出将作为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    Response 中使用的输入 token 详情。缓存 token 来自对话中先前轮次、作为当前响应上下文被包含的 token。此处的缓存 token 计入输入 token 的子集，即输入 token 包括缓存与未缓存的 token。

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

  Response 中使用的输入 token 详情。缓存 token 来自对话中先前轮次、作为当前响应上下文被包含的 token。此处的缓存 token 计入输入 token 的子集，即输入 token 包括缓存与未缓存的 token。

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

    在对话创建时返回。会话创建完成后立即发出。

    - `conversation: object { id, object }`

      对话资源。

      - `id: optional string`

        对话的唯一 ID。

      - `object: optional string`

        对象类型，必须为 `realtime.conversation`.

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "conversation.created"`

      事件类型，必须为 `conversation.created`.

      - `"conversation.created"`

  - `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

    在创建对话项时返回。存在多种触发此事件的情形：

    - 服务端正在生成 Response，如果成功，将产生
      一个或两个 Item，类型为 `message`
      （role `assistant`) 或类型 `function_call`.
    - 输入音频缓冲区已被提交，提交方可以是客户端，也可以是
      服务端（处于 `server_vad` 模式）。服务端将获取输入音频缓冲区的内容，
      并将其添加到一条新的用户消息 Item 中。
    - 客户端发送了 `conversation.item.create` 事件以添加新的 Item
      到该 Conversation。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的一个 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          该请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

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

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数，格式为 JSON 字符串。

        - `name: string`

          已运行工具的名称。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.created"`

      事件类型，必须为 `conversation.item.created`.

      - `"conversation.item.created"`

    - `previous_item_id: optional string or null`

      Conversation 上下文中前一个项的 ID，便于
      客户端理解对话的顺序。若该 Item 没有前驱项，可以为 `null` 。
      如果该 item 没有前驱项。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当会话中的某个条目由客户端通过以下方式删除时返回：
    `conversation.item.delete` 事件。此事件用于同步服务端对会话历史的理解与客户端的视图。
    服务端对会话历史的理解与客户端的视图保持一致。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被删除的条目 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    此事件是写入用户音频缓冲区后，音频转写的输出。
    当客户端或服务端（启用 VAD 时）提交输入音频缓冲区时，
    转写便会开始。转写与 Response 创建是异步执行的，
    因此此事件可能早于或晚于 Response 事件到达。
    the Response events.

    Realtime API 模型原生支持音频，因此输入转写是
    由单独的 ASR（自动语音识别）模型运行的独立过程。
    转写文本可能与模型的解读存在一定偏差，
    应被视为大致参考。

    - `content_index: number`

      包含音频的内容分段的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在被转写的、包含音频的项的 ID。

    - `transcript: string`

      转写后的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      该转写的用量统计，按 ASR 模型的定价计费，而非 realtime 模型的定价。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 用量计费的模型的用量统计。

        - `input_tokens: number`

          本次请求计费的输入 token 数。

        - `output_tokens: number`

          生成的输出 token 数。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          usage 对象的类型。对于此变体， `tokens` 始终为 tokens。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          本次请求计费的输入 token 的详细信息。

          - `audio_tokens: optional number`

            本次请求计费的音频 token 数量。

          - `text_tokens: optional number`

            本次请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的使用统计信息。

        - `seconds: number`

          输入音频的时长，单位为秒。

        - `type: "duration"`

          usage 对象的类型。对于此变体， `duration` 始终为 tokens。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测出任何语言。

      - `code: string`

        在音频中检测到的语言代码。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

    当输入音频转录内容部分的文本值使用增量转录结果更新时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在被转写的、包含音频的项的 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      该内容部分在项目内容数组中的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。可通过将会话配置为 `"include": ["item.input_audio_transcription.logprobs"]`。来启用。数组中的每个条目对应此段转录所选词元的对数概率。这有助于判断给定转录片段是否存在多个有效选项。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    在配置了输入音频转写，且用户消息的转写
    请求失败时返回。这些事件与其他事件分开，以便客户端可以识别相关的 Item。
    `error` 事件，以便客户端识别相关的 Item。

    - `content_index: number`

      包含音频的内容分段的索引。

    - `error: object { code, message, param, type }`

      转写错误的详细信息。

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

      用户消息项的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    在使用以下方式检索某个会话条目时返回 `conversation.item.retrieve`。这提供了一种获取服务端对该条目表示形式的方法，例如在噪声消除和 VAD 之后获取经后处理的音频数据。它包含该条目的完整内容，包括音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当早先的助手音频消息项被客户端截断时返回，包含一个
    事件。此事件用于 `conversation.item.truncate` 事件。此事件用于
    使服务端对音频的理解与客户端的播放保持同步。

    此操作将截断音频并移除 服务端 文本转录，
    以确保上下文中不存在用户尚未听到的文本。

    - `audio_end_ms: number`

      音频被截断的时长，单位为毫秒。

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

    在发生错误时返回，错误可能是客户端问题或服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认监控和记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误的类型（例如 "invalid_request_error"、"server_error"）。

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

    当输入音频缓冲区由客户端通过以下方式清除时返回：a
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    当输入音频缓冲区被提交时返回，无论是客户端主动提交，还是
    在服务端 VAD 模式下自动提交。item_id 属性即为即将创建的用户 `item_id` 消息项的 ID，因此随后还会向客户端发送一条 response.created
    事件，以通知该用户消息项已创建。 `conversation.item.created` 事件
    也会发送给客户端。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      即将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项将插入其后的前一项的 ID。
      如果该项没有前项，可以为 `null` 。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一种表示电话键盘按键（0–9、*、#、A–D）的消息。
    属性是用户按下的键盘按键。 `event` 属性
    是用户按下的键盘按键。 `received_at` 是服务器接收到该事件的 UTC Unix 时间戳。
    是服务器接收到该事件的时间。

    - `event: string`

      用户按下的电话键盘按键。

    - `received_at: number`

      服务器接收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    由服务端在处于 `server_vad` 模式时发送，以表明已在音频缓冲区中检测到语音。只要有音频被添加到
    缓冲区，就可能发生此事件（除非已经检测到语音）。客户端可能希望使用此
    事件来中断音频播放或向用户提供视觉反馈。
    客户端应预期在语音停止时会收到一个。

    事件。 `input_audio_buffer.speech_stopped` 事件
    。该 `item_id` 属性是将在语音停止时创建的用户消息项的 ID，
    该 ID 也会包含在
    `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间
    手动提交音频缓冲区）。

    - `audio_start_ms: number`

      从本次会话中首次检测到语音时起，所有写入缓冲区的音频的起始时间（毫秒）。这对应于发送给模型的音频起始位置，因此包含
      在 Session 中配置的
      （前缀指令）。
      `prefix_padding_ms` 。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将在语音停止时创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    当服务端检测到音频缓冲区 `server_vad` 中的语音结束时返回。服务端还会发送一个
    在音频缓冲区中检测到语音结束时触发。 `conversation.item.created`
    事件与从音频缓冲区创建的用户消息条目一起提供。

    - `audio_end_ms: number`

      自会话开始至语音停止时的毫秒数。此值将
      对应于发送给模型的音频结束时刻，因此包含
      `min_silence_duration_ms` 。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      即将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示更新后的速率限制。
    创建 Response 时，会为输出“预留”部分 token；
    此处显示的速率限制反映了该预留情况，并在 Response
    完成后进行相应调整。

    - `event_id: string`

      服务端事件的唯一 ID。

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

        速率限制重置之前的秒数。

    - `type: "rate_limits.updated"`

      事件类型，必须为 `rate_limits.updated`.

      - `"rate_limits.updated"`

  - `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

    当模型生成的音频更新时返回。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `delta: string`

      Base64 编码的音频数据增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.delta"`

      事件类型，必须为 `response.output_audio.delta`.

      - `"response.output_audio.delta"`

  - `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

    当模型生成的音频完成时返回。当一个 Response
    被中断、未完成或被取消时也会触发。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.done"`

      事件类型，必须为 `response.output_audio.done`.

      - `"response.output_audio.done"`

  - `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

    当模型对音频输出生成的转写更新时返回。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `delta: string`

      转写增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio_transcript.delta"`

      事件类型，必须为 `response.output_audio_transcript.delta`.

      - `"response.output_audio_transcript.delta"`

  - `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

    当模型对音频输出生成的转写完成时返回。
    流式传输。当一个 Response 被中断、未完成或被取消时也会触发。
    取消时也会触发。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `transcript: string`

      该音频的最终转写文本。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    在响应生成过程中向助手消息条目添加新的内容部分时返回。
    响应生成。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      添加了内容部分的条目 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `part: object { audio, text, transcript, type }`

      已添加的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果类型是 "audio"）。

      - `text: optional string`

        文本内容（如果类型是 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果类型是 "audio"）。

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

    当 assistant 消息条目中的某个内容部分流式传输完成时返回。
    也会在 Response 被中断、未完成或被取消时发出。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `part: object { audio, text, transcript, type }`

      已完成的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果类型是 "audio"）。

      - `text: optional string`

        文本内容（如果类型是 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果类型是 "audio"）。

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

    在创建新的 Response 时返回。这是响应创建的第一个事件，
    此时响应处于初始状态 `in_progress`.

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

      - `id: optional string`

        响应的唯一 ID，格式类似 `resp_1234`.

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

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少回复过一次音频，
              会话期间就无法再更改声音。可用的
              声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

        响应被添加到的会话，由 `conversation`
        字段在 `response.create` 事件中决定。如果 `auto`，响应将被添加到
        默认会话，且 `conversation_id` 的值将是类似
        `conv_1234`。如果 `none`，的 ID，响应不会被添加到任何会话，且
        的值 `conversation_id` 将是 `null`。如果响应是由
        VAD 自动产生的，则响应将被添加到默认会话

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        ，包含本次响应中使用的工具调用。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 组键值对。可用于
        以结构化格式存储对象的附加信息，并通过 API
        或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一个函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一个函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的一个 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime item。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前可能的取值仅有
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        output 设置为 mode `text` 将禁用模型的音频输出。

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

        关于该状态的更多详情。

        - `error: optional object { code, type }`

          导致响应失败的错误描述，
          在以下情况时填充： `status` 为 `failed`.

          - `code: optional string`

            错误代码（如果有）。

          - `type: optional string`

            错误类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          Response 未完成的原因。对于 `cancelled` Response，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致响应失败的错误类型，对应
          字段（ `status` 字段的值。`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        Response 的使用统计信息，将用于计费。一个
        Realtime API 会话将维护对话上下文，并将新的
        项追加到对话中，因此先前轮次（文本与
        音频 token）的输出将作为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          Response 中使用的输入 token 详情。缓存 token 来自对话中先前轮次、作为当前响应上下文被包含的 token。此处的缓存 token 计入输入 token 的子集，即输入 token 包括缓存与未缓存的 token。

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
    该事件始终会发出。该事件中包含的 Response `response.done` 对象将
    包含 Response 中的所有输出 Item，但会省略原始音频数据。

    客户端应检查 Response 的 `status` 字段以确定是否成功（
    (`completed`) 或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

    响应将包含在该响应过程中生成的全部输出项，不包括
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

      以 JSON 字符串表示的参数增量。

    - `event_id: string`

      服务端事件的唯一 ID。

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
    也会在 Response 被中断、未完成或被取消时发出。

    - `arguments: string`

      作为 JSON 字符串的最终参数。

    - `call_id: string`

      函数调用的 ID。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `name: string`

      被调用的函数的名称。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.function_call_arguments.done"`

      事件类型，必须为 `response.function_call_arguments.done`.

      - `"response.function_call_arguments.done"`

  - `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

    在 Response 生成过程中创建新的 Item 时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      Response 中输出项的索引。

    - `response_id: string`

      该项所属 Response 的 ID。

    - `type: "response.output_item.added"`

      事件类型，必须为 `response.output_item.added`.

      - `"response.output_item.added"`

  - `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

    当一个 Item 完成流式传输时返回。在 Response 被
    中断、未完成或取消时也会发出。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      Response 中输出项的索引。

    - `response_id: string`

      该项所属 Response 的 ID。

    - `type: "response.output_item.done"`

      事件类型，必须为 `response.output_item.done`.

      - `"response.output_item.done"`

  - `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

    当 "output_text" 内容部分的文本值更新时返回。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `delta: string`

      文本增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_text.delta"`

      事件类型，必须为 `response.output_text.delta`.

      - `"response.output_text.delta"`

  - `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

    当 "output_text" 内容部分的文本值完成流式传输时返回。
    在 Response 被中断、未完成或取消时也会发出。

    - `content_index: number`

      该内容部分在项目内容数组中的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

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

    当创建 Session 时返回。在建立新
    连接时作为第一个服务端事件自动发出。该事件将包含
    默认的 Session 配置。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        一个 Realtime 会话配置对象。

        - `id: string`

          会话的唯一标识符，形如 `sess_1234567890abcdef`.

        - `object: "realtime.session"`

          对象类型。始终为 `realtime.session`.

          - `"realtime.session"`

        - `type: "realtime"`

          要创建的会话类型。Realtime 始终为 `realtime` 。API。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }  or null`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }  or null`

              输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

              - `language: optional string or null`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                为输入音频转录配置的提示词（如果存在）。

            - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

              轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                  如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  可选超时时间，超时后将自动触发模型响应。该参数
                  在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                  当前上下文有效地提示用户继续对话。
                  当前上下文。

                  该超时值将在最后一次模型响应的音频播放完成后开始计时，
                  即它的设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与该 Response 相关的事件）在到达超时时会被发出。
                  空闲超时当前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否自动中断（取消）向默认
                  对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                  为毫秒）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                  为 500ms。该值越小，模型响应越快，
                  但可能会在用户短暂的停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                  更高的阈值要求更响亮的音频才能激活模型，
                  因此在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD 停止事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当 VAD 开始事件发生时，是否使用输出自动中断默认
                  对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应的速度，为原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

              该参数是对生成后音频的后处理调整，也
              可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少回复过一次音频，
              会话期间就无法再更改声音。可用的
              声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复的声音。一旦模型至少回复过一次音频，
                会话期间就无法再更改声音。可用的
                声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

          会话的过期时间戳，以自 Unix 纪元起的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs" or null`

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

          注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
          模型将响应音频以及转录文本。 `["text"]` 可用于让
          模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            可选的映射值，用于替换你
            提示中的变量。替换值可以是字符串，也可以是其他
            响应输入类型，例如图像或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

              - `text: string`

                发送给模型的文本输入。

              - `type: "input_text"`

                输入项的类型，始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

              - `detail: ImageDetail`

                发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                输入项的类型，始终为 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                发送给模型的文件 ID。

              - `image_url: optional string or null`

                发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型，始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                发送给模型的文件内容。

              - `file_id: optional string or null`

                发送给模型的文件 ID。

              - `file_url: optional string`

                发送给模型的文件的 URL。

              - `filename: optional string`

                发送给模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

          模型如何选择工具。提供以下字符串模式之一，或强制指定某个
          函数/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪些工具（如果有）。

            `none` 表示模型将不调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息或调用一个或
            多个工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项可以强制模型调用特定的函数。

            - `name: string`

              要调用的函数名称。

            - `type: "function"`

              对于函数调用，类型始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

            - `server_label: string`

              要使用的 MCP 服务器的标签。

            - `type: "mcp"`

              对于 MCP 工具，类型始终为 `mcp`.

              - `"mcp"`

            - `name: optional string or null`

              要在服务器上调用的工具名称。

        - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

            - `description: optional string`

              函数的描述，包括何时以及如何
              调用它的指引，以及调用时告诉用户什么的
              （指引（如果有）。

            - `name: optional string`

              函数的名称。

            - `parameters: optional unknown`

              以 JSON Schema 表示的函数参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

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

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
              MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段已于 2026/09/01 之后发布的模型弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
              通过安全 MCP 通道连接。

              当前支持的 `connector_id` 值包括：

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

              此 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 头，用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`，也可以是与工具关联的过滤对象
                需要审批的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果某个
                    MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    与此过滤器的标注，则它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果某个
                    MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    与此过滤器的标注，则它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值之一为 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
          为会话启用 追踪，配置便不可修改。

          `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
          工作流 名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            对 追踪 的细粒度配置。

            - `group_id: optional string`

              附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
              筛选。

            - `workflow_name: optional string`

              附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
              命名 追踪。

        - `truncation: optional RealtimeTruncation`

          当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

          客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

          截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

          截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

            - `retention_ratio: number`

              当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

            - `type: "retention_ratio"`

              使用按比例保留的截断方式。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

              - `post_instructions: optional number`

                指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

            - `noise_reduction: optional object { type }  or null`

              输入音频降噪配置。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }  or null`

              转录模型的配置。

              - `language: optional string or null`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                为输入音频转录配置的提示词（如果存在）。

            - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

              轮次检测的配置。可设置为 `null` 以关闭。服务端
              VAD 意味着模型将根据
              音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                在 VAD 检测到的语音之前要包含的音频量（以
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                用于检测语音停止的静音时长（以毫秒为单位）。默认
                为 500ms。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
                更高的阈值要求更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

              - `type: optional string`

                轮次检测的类型，仅限 `server_vad` 当前受支持。

        - `expires_at: optional number`

          会话的过期时间戳，以自 Unix 纪元起的秒数表示。

        - `include: optional array of "item.input_audio_transcription.logprobs" or null`

          要在服务端输出中包含的额外字段。

          - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话因某个事件而更新时返回， `session.update` 事件更新，
    除非出现错误。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        一个 Realtime 会话配置对象。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        一个 Realtime 转录会话配置对象。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `OutputAudioBufferStarted object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端开始向客户端流式传输音频时触发。此事件在
    音频内容部分已添加后触发（`response.content_part.added`)
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

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被完全清空时触发，
    并且不再有更多音频产生。此事件在完整响应
    数据已发送给客户端之后触发（`response.done`).
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被清空时触发。这种情况可能发生在 VAD
    模式下用户中断时（`input_audio_buffer.speech_started`),
    ，或者当客户端触发了 `output_audio_buffer.clear` 事件以手动
    截断当前的音频响应。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当 Item 被添加到默认会话时由服务端发送。这种情况可能出现在以下几种情形中：

    - 当客户端发送一个 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。此时该 Item 将是一条包含缓冲区音频内容的用户消息。
    - 当模型正在生成 Response 时。此时 `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时还没有任何内容（且 `status` 将是 `in_progress`).

    该事件将包含 Item 的完整内容（模型正在生成 Response 时除外），但不包括音频数据；如有必要，音频数据可以通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
      在插入 Item 时保持顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    当某个对话 item 完成时返回。

    该事件将包含 Item 的完整内容，但音频数据除外，如需可以单独通过一个 `conversation.item.retrieve` 事件获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
      在插入 Item 时保持顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    当输入音频缓冲区触发 Server VAD 超时时返回。该超时通过会话设置进行配置，表示
    通过 `idle_timeout_ms` 在 `turn_detection` 会话的设置中进行配置，并表示
    在配置的时长内未检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段表示自上一次
    模型响应之后到触发时间为止的音频片段，以写入输入音频缓冲区的音频起点为偏移量。这意味着它标定了那段保持静默的音频
    片段，并且
    起始值与结束值之差大致等于所配置的超时时长。

    空音频将作为一个 `input_audio` 项提交到对话中（将会产生
    `input_audio_buffer.committed` 事件），并生成模型响应。可能存在没有触发 VAD 但仍被模型检测到的语音，因此模型可能以
    与对话相关的内容或提示继续说话的回复作出响应。
    与对话相关的内容或提示继续说话的回复。

    - `audio_end_ms: number`

      触发超时时刻已写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      写入输入音频缓冲区中、位于最后一个模型响应的播放时间之后的音频的毫秒偏移量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      与此分段关联的项的 ID。

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

      片段的结束时间（以秒为单位）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含输入音频内容的 item 的 ID。

    - `speaker: string`

      该片段检测到的说话人标签。

    - `start: number`

      片段的开始时间（以秒为单位）。

    - `text: string`

      该片段对应的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    在为某个条目列出 MCP 工具时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列表工具项的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    当某个项目的 MCP 工具列表已列出时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列表工具项的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    当列出某个项目的 MCP 工具失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列表工具项的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    在响应生成期间更新 MCP 工具调用参数时返回。

    - `delta: string`

      JSON 编码的参数增量。

    - `event_id: string`

      服务端事件的唯一 ID。

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

      如果存在，则表示增量文本经过混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成过程中，MCP 工具调用参数被最终确定时返回。

    - `arguments: string`

      最终的 JSON 编码参数字符串。

    - `event_id: string`

      服务端事件的唯一 ID。

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

    在 MCP 工具调用已成功完成时返回。

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

### Realtime Session

- `RealtimeSession object { id, expires_at, include, 17 more }`

  用于 beta 接口的 Realtime 会话对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输入音频必须为 16 位 PCM、24kHz 采样率、
    单声道（mono），且采用小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

    - `language: optional string or null`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      为输入音频转录配置的提示词（如果存在）。

  - `instructions: optional string`

    默认的系统指令（即系统消息），会拼接到模型调用
    之前。该字段允许客户端引导模型输出期望的
    响应。可以指示模型回复的内容和格式，
    （例如“极其简洁”、“表现得友好”、“下面是一些好的
    回复示例”）以及音频行为（例如“语速快一些”、“在声音
    中加入情感”、“经常大笑”）。这些指令
    不保证会被模型遵循，但可为模型提供期望行为
    方面的指导。

    请注意，服务端会设置默认指令，在未设置该
    字段时使用，这些默认指令可在 `session.created` 事件的会话开头
    处查看。

  - `max_response_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token
    数。默认为 `inf`.

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

    输出音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输出音频采样率为 24kHz。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音响应的速度。1.0 是默认速度。0.25 是
    最低速度。1.5 是最高速度。此值只能在
    模型轮次之间更改，不能在响应进行中更改。

  - `temperature: optional number`

    模型的采样温度，限定在 [0.6, 1.2] 范围内。对于音频模型，强烈建议使用 0.8 的温度以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。选项有 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指引，以及调用时告诉用户什么的
      （指引（如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    用于配置追踪的选项。设为 null 以禁用追踪。一旦
    为会话启用 追踪，配置便不可修改。

    `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
    工作流 名称、组 ID 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
        在追踪面板中进行分组。

      - `metadata: optional unknown`

        附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
        在追踪面板中进行筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
        在追踪面板中为追踪命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

        如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选超时时间，超时后将自动触发模型响应。该参数
        在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
        当前上下文有效地提示用户继续对话。
        当前上下文。

        该超时值将在最后一次模型响应的音频播放完成后开始计时，
        即它的设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与该 Response 相关的事件）在到达超时时会被发出。
        空闲超时当前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否自动中断（取消）向默认
        对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
        为 500ms。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        更高的阈值要求更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD 停止事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否使用输出自动中断默认
        对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复的声音。一旦模型至少回复过一次音频，
    会话期间就无法再更改声音。可用的
    声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复的声音。一旦模型至少回复过一次音频，
      会话期间就无法再更改声音。可用的
      声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    要创建的会话类型。Realtime 始终为 `realtime` 。API。

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
        降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

          用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。使用
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          可提升准确率并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
          对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
          Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，超时后将自动触发模型响应。该参数
            在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            当前上下文。

            该超时值将在最后一次模型响应的音频播放完成后开始计时，
            即它的设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与该 Response 相关的事件）在到达超时时会被发出。
            空闲超时当前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）向默认
            对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
            为 500ms。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            更高的阈值要求更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否使用输出自动中断默认
            对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应的速度，为原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

        该参数是对生成后音频的后处理调整，也
        可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回应的声音。支持的内置声音包括
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
        一旦模型至少回应过一次音频后就无法更改。
        自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
        我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

    注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
    模型将响应音频以及转录文本。 `["text"]` 可用于让
    模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅支持
    推理 Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

    模型如何选择工具。提供以下字符串模式之一，或强制指定某个
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可以强制模型调用特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional RealtimeToolsConfig`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何
        调用它的指引，以及调用时告诉用户什么的
        （指引（如果有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

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

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
        MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已于 2026/09/01 之后发布的模型弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
        通过安全 MCP 通道连接。

        当前支持的 `connector_id` 值包括：

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头，用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，也可以是与工具关联的过滤对象
          需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值之一为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
    为会话启用 追踪，配置便不可修改。

    `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
    工作流 名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
        筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
        命名 追踪。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

    客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

    截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

    截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

      - `retention_ratio: number`

        当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

      - `type: "retention_ratio"`

        使用按比例保留的截断方式。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

        - `post_instructions: optional number`

          指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型如何选择工具。提供以下字符串模式之一，或强制指定某个
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或
    多个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可以强制模型调用特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

### Realtime Tools Config

- `RealtimeToolsConfig = array of RealtimeToolsConfigUnion`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指引，以及调用时告诉用户什么的
      （指引（如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

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

          指示工具是否修改数据或是否为只读。如果某个
          MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          与此过滤器的标注，则它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
      MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已于 2026/09/01 之后发布的模型弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
      通过安全 MCP 通道连接。

      当前支持的 `connector_id` 值包括：

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

      此 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头，用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的过滤对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol
  (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指引，以及调用时告诉用户什么的
      （指引（如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

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

          指示工具是否修改数据或是否为只读。如果某个
          MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          与此过滤器的标注，则它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
      MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已于 2026/09/01 之后发布的模型弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
      通过安全 MCP 通道连接。

      当前支持的 `connector_id` 值包括：

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

      此 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头，用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的过滤对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Realtime Tracing Config

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
  为会话启用 追踪，配置便不可修改。

  `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
  工作流 名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
      筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
      命名 追踪。

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
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

        用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提升准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时时间，超时后将自动触发模型响应。该参数
          在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
          当前上下文有效地提示用户继续对话。
          当前上下文。

          该超时值将在最后一次模型响应的音频播放完成后开始计时，
          即它的设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与该 Response 相关的事件）在到达超时时会被发出。
          空闲超时当前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）向默认
          对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
          为 500ms。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          更高的阈值要求更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否使用输出自动中断默认
          对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

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
    降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

      用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。使用
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      可提升准确率并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
      对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
      Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

        如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        可选超时时间，超时后将自动触发模型响应。该参数
        在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
        当前上下文有效地提示用户继续对话。
        当前上下文。

        该超时值将在最后一次模型响应的音频播放完成后开始计时，
        即它的设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与该 Response 相关的事件）在到达超时时会被发出。
        空闲超时当前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否自动中断（取消）向默认
        对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
        为 500ms。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        更高的阈值要求更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD 停止事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当 VAD 开始事件发生时，是否使用输出自动中断默认
        对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

  服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

      如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      可选超时时间，超时后将自动触发模型响应。该参数
      在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
      当前上下文有效地提示用户继续对话。
      当前上下文。

      该超时值将在最后一次模型响应的音频播放完成后开始计时，
      即它的设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与该 Response 相关的事件）在到达超时时会被发出。
      空闲超时当前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否自动中断（取消）向默认
      对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

      如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
      为 500ms。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      更高的阈值要求更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD 停止事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当 VAD 开始事件发生时，是否使用输出自动中断默认
      对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

### Realtime Transcription Session Create Request

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转写会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。Realtime 始终为 `transcription` 用于转写会话。

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
        降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

          用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。使用
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          可提升准确率并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
          对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
          Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，超时后将自动触发模型响应。该参数
            在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            当前上下文。

            该超时值将在最后一次模型响应的音频播放完成后开始计时，
            即它的设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与该 Response 相关的事件）在到达超时时会被发出。
            空闲超时当前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）向默认
            对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
            为 500ms。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            更高的阈值要求更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否使用输出自动中断默认
            对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  Realtime 翻译客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。Translation
    会话支持更新以下字段： `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 创建时设置
      ，且无法通过 `session.update`.

      - `audio: optional object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 以禁用。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍然基于
            输入音频流进行。

            - `model: string`

              用于源转录增量文本的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量文本的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件可将音频字节追加到翻译会话的输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 mono
    little-endian 原始音频字节。不受支持的 websocket 音频格式会返回
    校验错误，因为质量较低的音频会显著降低翻译
    质量。

    翻译以 200 ms 的引擎帧进行消费。为获得最佳的实时表现，请
    audio in 200 ms chunks. If a chunk is shorter, the server buffers it until it
    has enough audio for one frame. If a chunk is longer, the server splits it into
    200 ms frames and enqueues them back-to-back.

    Keep appending silence while the session is active. If a client stops sending
    audio and later resumes, model time treats the resumed audio as contiguous with
    the previous audio rather than as a real-world pause.

    - `audio: string`

      Base64 编码的 24 kHz PCM16 单声道音频字节。

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    Gracefully close the realtime translation session. The server flushes pending
    input audio and emits any remaining translated output before closing the
    session.

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成的 ID。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建一个翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话持续流式传入源语言音频，
    并持续流式输出翻译后的音频以及转录增量。

    - `model: string`

      此会话使用的 Realtime 翻译模型。

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流进行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥的过期配置。过期指的是在此时间之后
    客户端密钥将无法再用于创建会话的时间点。已开始
    的会话在该时间之后仍可继续进行。在到期之前，一个密钥
    可用于创建多个会话。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点，意味着 `seconds` 将被添加到 `created_at` 客户端密钥的时间上以生成过期时间戳。仅 `created_at` 当前受支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点到过期的秒数。选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

### Realtime Translation Client Secret Create Response

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续将输入音频
    翻译为所配置的目标语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流进行。

          - `model: string`

            用于源转写增量数据的转写模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话，始终为 `translation` 。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation 输入音频缓冲区追加事件

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件可将音频字节追加到翻译会话的输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 mono
  little-endian 原始音频字节。不受支持的 websocket 音频格式会返回
  校验错误，因为质量较低的音频会显著降低翻译
  质量。

  翻译以 200 ms 的引擎帧进行消费。为获得最佳的实时表现，请
  audio in 200 ms chunks. If a chunk is shorter, the server buffers it until it
  has enough audio for one frame. If a chunk is longer, the server splits it into
  200 ms frames and enqueues them back-to-back.

  Keep appending silence while the session is active. If a client stops sending
  audio and later resumes, model time treats the resumed audio as contiguous with
  the previous audio rather than as a real-world pause.

  - `audio: string`

    Base64 编码的 24 kHz PCM16 单声道音频字节。

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### Realtime Translation 输入转录增量事件

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当存在可选的源语言转写文本时返回。该事件
  仅在 `audio.input.transcription` 已配置时触发。

  转写增量是仅追加的文本片段。客户端不应在增量之间
  插入无条件空格。

  - `delta: string`

    仅追加的源语言转写文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，在可用时由翻译帧
    推导得出。它以 200 毫秒为增量递增，但多个转写
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转写增量标识符。

### 实时翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  当翻译后的输出音频可用时返回。该 `delta` 包含一个
  PCM16 音频分块，其长度可变。客户端应对完整 delta 进行解码和排队，而不是假设固定的字节或采样数。
  complete delta instead of assuming a fixed byte or sample count.

  - `delta: string`

    Base64 编码的翻译音频数据。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_audio.delta"`

    事件类型，必须为 `session.output_audio.delta`.

    - `"session.output_audio.delta"`

  - `channels: optional number`

    音频声道数。

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，在可用时由翻译帧
    （当可用时）。请将 `elapsed_ms` 视为对齐元数据，而非唯一
    事件标识符。

  - `format: optional "pcm16"`

    音频编码格式，针对 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频 delta 的采样率。

### 实时翻译输出转录增量事件

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当翻译后的转录文本可用时返回。

  转写增量是仅追加的文本片段。客户端不应在增量之间
  插入无条件空格。

  - `delta: string`

    翻译后输出音频的仅追加转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，在可用时由翻译帧
    推导得出。它以 200 毫秒为增量递增，但多个转写
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转写增量标识符。

### Realtime Translation Server Event

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  Realtime 翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能是客户端问题或服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认监控和记录错误消息。

    - `error: RealtimeError`

      错误的详细信息。

      - `message: string`

        人类可读的错误消息。

      - `type: string`

        错误的类型（例如 "invalid_request_error"、"server_error"）。

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

    在创建翻译会话时返回。以下情况会自动发出该事件：
    新连接会作为第一个服务端事件建立，该事件包含
    默认的翻译会话配置。

    - `event_id: string`

      服务端事件的唯一 ID。

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

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍然基于
            输入音频流进行。

            - `model: string`

              用于源转写增量数据的转写模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量文本的目标语言。

      - `expires_at: number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `model: string`

        本次会话使用的 Realtime 翻译模型。此字段在
        会话创建时设置，无法通过 `session.update`.

      - `type: "translation"`

        会话类型。对于 Realtime 翻译会话，始终为 `translation` 。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    当翻译会话使用某项更新时返回， `session.update` 事件，
    除非发生错误。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `RealtimeTranslationSessionClosedEvent object { event_id, type }`

    当实时翻译会话关闭时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.closed"`

      事件类型，必须为 `session.closed`.

      - `"session.closed"`

  - `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当存在可选的源语言转写文本时返回。该事件
    仅在 `audio.input.transcription` 已配置时触发。

    转写增量是仅追加的文本片段。客户端不应在增量之间
    插入无条件空格。

    - `delta: string`

      仅追加的源语言转写文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，在可用时由翻译帧
      推导得出。它以 200 毫秒为增量递增，但多个转写
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转写增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当翻译后的转录文本可用时返回。

    转写增量是仅追加的文本片段。客户端不应在增量之间
    插入无条件空格。

    - `delta: string`

      翻译后输出音频的仅追加转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，在可用时由翻译帧
      推导得出。它以 200 毫秒为增量递增，但多个转写
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转写增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    当翻译后的输出音频可用时返回。该 `delta` 包含一个
    PCM16 音频分块，其长度可变。客户端应对完整 delta 进行解码和排队，而不是假设固定的字节或采样数。
    complete delta instead of assuming a fixed byte or sample count.

    - `delta: string`

      Base64 编码的翻译音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_audio.delta"`

      事件类型，必须为 `session.output_audio.delta`.

      - `"session.output_audio.delta"`

    - `channels: optional number`

      音频声道数。

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，在可用时由翻译帧
      （当可用时）。请将 `elapsed_ms` 视为对齐元数据，而非唯一
      事件标识符。

    - `format: optional "pcm16"`

      音频编码格式，针对 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频 delta 的采样率。

### 实时翻译会话

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  一个 Realtime 翻译会话。翻译会话会持续将输入音频
  翻译为所配置的目标语言。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流进行。

        - `model: string`

          用于源转写增量数据的转写模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

  - `expires_at: number`

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `model: string`

    本次会话使用的 Realtime 翻译模型。此字段在
    会话创建时设置，无法通过 `session.update`.

  - `type: "translation"`

    会话类型。对于 Realtime 翻译会话，始终为 `translation` 。

    - `"translation"`

### 实时翻译会话关闭事件

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  Gracefully close the realtime translation session. The server flushes pending
  input audio and emits any remaining translated output before closing the
  session.

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 实时翻译会话已关闭事件

- `RealtimeTranslationSessionClosedEvent object { event_id, type }`

  当实时翻译会话关闭时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.closed"`

    事件类型，必须为 `session.closed`.

    - `"session.closed"`

### 实时翻译会话创建请求

- `RealtimeTranslationSessionCreateRequest object { model, audio }`

  Realtime 翻译会话配置。翻译会话持续流式传入源语言音频，
  并持续流式输出翻译后的音频以及转录增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流进行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

### 实时翻译会话已创建事件

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在创建翻译会话时返回。以下情况会自动发出该事件：
  新连接会作为第一个服务端事件建立，该事件包含
  默认的翻译会话配置。

  - `event_id: string`

    服务端事件的唯一 ID。

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

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流进行。

          - `model: string`

            用于源转写增量数据的转写模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话，始终为 `translation` 。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 实时翻译会话更新事件

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。Translation
  会话支持更新以下字段： `audio.output.language`, `audio.input.transcription`,
  和 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 和 `model` 创建时设置
    ，且无法通过 `session.update`.

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流进行。

          - `model: string`

            用于源转录增量文本的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 实时翻译会话更新请求

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可使用以下方式更新的实时翻译会话字段 `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流进行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

### Realtime Translation Session Updated Event

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  当翻译会话使用某项更新时返回， `session.update` 事件，
  除非发生错误。

  - `event_id: string`

    服务端事件的唯一 ID。

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

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流进行。

          - `model: string`

            用于源转写增量数据的转写模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话，始终为 `translation` 。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime Truncation

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

  截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

  截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

    - `retention_ratio: number`

      当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

      - `post_instructions: optional number`

        指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Response Audio Delta Event

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频更新时返回。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `delta: string`

    Base64 编码的音频数据增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.delta"`

    事件类型，必须为 `response.output_audio.delta`.

    - `"response.output_audio.delta"`

### Response Audio Done Event

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  当模型生成的音频完成时返回。当一个 Response
  被中断、未完成或被取消时也会触发。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.done"`

    事件类型，必须为 `response.output_audio.done`.

    - `"response.output_audio.done"`

### Response Audio Transcript Delta Event

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型对音频输出生成的转写更新时返回。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `delta: string`

    转写增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio_transcript.delta"`

    事件类型，必须为 `response.output_audio_transcript.delta`.

    - `"response.output_audio_transcript.delta"`

### Response Audio Transcript Done Event

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  当模型对音频输出生成的转写完成时返回。
  流式传输。当一个 Response 被中断、未完成或被取消时也会触发。
  取消时也会触发。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `transcript: string`

    该音频的最终转写文本。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### Response Cancel Event

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件以取消正在进行的响应。服务端会响应
  一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果
  没有可取消的响应，服务端将返回错误。即使没有响应正在进行，也可以安全地
  调用 `response.cancel` ，此时会返回错误，
  会话不会受到影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

  - `response_id: optional string`

    要取消的特定响应 ID——如果未提供，则取消
    默认对话中正在进行的响应。

### Response Content Part Added Event

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  在响应生成过程中向助手消息条目添加新的内容部分时返回。
  响应生成。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    添加了内容部分的条目 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `part: object { audio, text, transcript, type }`

    已添加的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果类型是 "audio"）。

    - `text: optional string`

      文本内容（如果类型是 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果类型是 "audio"）。

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

  当 assistant 消息条目中的某个内容部分流式传输完成时返回。
  也会在 Response 被中断、未完成或被取消时发出。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `part: object { audio, text, transcript, type }`

    已完成的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果类型是 "audio"）。

    - `text: optional string`

      文本内容（如果类型是 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果类型是 "audio"）。

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

  此事件指示服务端创建一个 Response，即触发
  模型推理。在 Server VAD 模式下，服务端会自动创建 Responses
  。

  一个 Response 至少包含一个 Item，也可能有两个，此时第二个
  将是函数调用。这些 Item 默认会追加到
  对话历史中。

  服务端将使用一个进行响应 `response.created` 事件、已创建 Item 的事件
  和内容的事件，最后是一个 `response.done` 事件，用于指示
  Response is complete.

  该 `response.create` event includes inference configuration like
  `instructions` 和 `tools`. If these are set, they will override the Session's
  configuration for this Response only.

  Responses can be created out-of-band of the default Conversation, meaning that they can
  have arbitrary input, and it's possible to disable writing the output to the Conversation.
  Only one Response can write to the default Conversation at a time, but otherwise multiple
  Responses can be created in parallel. The `metadata` field is a good way to disambiguate
  multiple simultaneous Responses.

  Clients can set `conversation` to `none` to create a Response that does not write to the default
  Conversation. Arbitrary input can be provided with the `input` field, which is an array accepting
  raw Items and references to existing Items.

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

  - `response: optional RealtimeResponseCreateParams`

    Create a new Realtime response with these parameters

    - `audio: optional RealtimeResponseCreateAudioOutput`

      Configuration for audio input and output.

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

          模型用于回应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
          一旦模型至少回应过一次音频后就无法更改。
          自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
          我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

      Controls which conversation the response is added to. Currently supports
      `auto` 和 `none`, with `auto` 作为默认值。该 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个带外响应，该响应
      不会向默认对话添加项。

      - `string`

      - `"auto" or "none"`

        Controls which conversation the response is added to. Currently supports
        `auto` 和 `none`, with `auto` 作为默认值。该 `auto` 值
        表示响应的内容将被添加到默认
        对话中。将其设置为 `none` 以创建一个带外响应，该响应
        不会向默认对话添加项。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      包含在模型提示中的输入项。使用此字段
      会为本次 Response 创建一个新上下文，而不是使用默认的
      对话。空数组 `[]` 将清除本次 Response 的上下文。
      注意，这里可以包含对会话中先前出现过的项的引用
      通过它们的 id。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的一个 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          该请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

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

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数，格式为 JSON 字符串。

        - `name: string`

          已运行工具的名称。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `instructions: optional string`

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型给出期望的响应。可以指示模型关于响应内容和格式（例如，“保持极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。这些指令不保证被模型遵循，但它们为模型期望的行为提供指导。
      注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大 token
      数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过 API
      或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅有
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      output 设置为 mode `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅支持
      推理 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射值，用于替换你
        提示中的变量。替换值可以是字符串，也可以是其他
        响应输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

      模型如何选择工具。提供以下字符串模式之一，或强制指定某个
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可以强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何
          调用它的指引，以及调用时告诉用户什么的
          （指引（如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

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

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
          MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已于 2026/09/01 之后发布的模型弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
          通过安全 MCP 通道连接。

          当前支持的 `connector_id` 值包括：

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 头，用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，也可以是与工具关联的过滤对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值之一为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

### Response Created Event

- `ResponseCreatedEvent object { event_id, response, type }`

  在创建新的 Response 时返回。这是响应创建的第一个事件，
  此时响应处于初始状态 `in_progress`.

  - `event_id: string`

    服务端事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式类似 `resp_1234`.

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

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话期间就无法再更改声音。可用的
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

      响应被添加到的会话，由 `conversation`
      字段在 `response.create` 事件中决定。如果 `auto`，响应将被添加到
      默认会话，且 `conversation_id` 的值将是类似
      `conv_1234`。如果 `none`，的 ID，响应不会被添加到任何会话，且
      的值 `conversation_id` 将是 `null`。如果响应是由
      VAD 自动产生的，则响应将被添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      ，包含本次响应中使用的工具调用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过 API
      或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的一个 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          该请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

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

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数，格式为 JSON 字符串。

        - `name: string`

          已运行工具的名称。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅有
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      output 设置为 mode `text` 将禁用模型的音频输出。

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

      关于该状态的更多详情。

      - `error: optional object { code, type }`

        导致响应失败的错误描述，
        在以下情况时填充： `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于 `cancelled` Response，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段（ `status` 字段的值。`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的使用统计信息，将用于计费。一个
      Realtime API 会话将维护对话上下文，并将新的
      项追加到对话中，因此先前轮次（文本与
      音频 token）的输出将作为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 中使用的输入 token 详情。缓存 token 来自对话中先前轮次、作为当前响应上下文被包含的 token。此处的缓存 token 计入输入 token 的子集，即输入 token 包括缓存与未缓存的 token。

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
  该事件始终会发出。该事件中包含的 Response `response.done` 对象将
  包含 Response 中的所有输出 Item，但会省略原始音频数据。

  客户端应检查 Response 的 `status` 字段以确定是否成功（
  (`completed`) 或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  响应将包含在该响应过程中生成的全部输出项，不包括
  任何音频内容。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `response: RealtimeResponse`

    响应资源。

    - `id: optional string`

      响应的唯一 ID，格式类似 `resp_1234`.

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

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话期间就无法再更改声音。可用的
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

      响应被添加到的会话，由 `conversation`
      字段在 `response.create` 事件中决定。如果 `auto`，响应将被添加到
      默认会话，且 `conversation_id` 的值将是类似
      `conv_1234`。如果 `none`，的 ID，响应不会被添加到任何会话，且
      的值 `conversation_id` 将是 `null`。如果响应是由
      VAD 自动产生的，则响应将被添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      ，包含本次响应中使用的工具调用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过 API
      或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 审批请求的一个 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          该请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

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

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数，格式为 JSON 字符串。

        - `name: string`

          已运行工具的名称。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发起请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          条目的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅有
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      output 设置为 mode `text` 将禁用模型的音频输出。

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

      关于该状态的更多详情。

      - `error: optional object { code, type }`

        导致响应失败的错误描述，
        在以下情况时填充： `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于 `cancelled` Response，取值为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取值为 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段（ `status` 字段的值。`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的使用统计信息，将用于计费。一个
      Realtime API 会话将维护对话上下文，并将新的
      项追加到对话中，因此先前轮次（文本与
      音频 token）的输出将作为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 中使用的输入 token 详情。缓存 token 来自对话中先前轮次、作为当前响应上下文被包含的 token。此处的缓存 token 计入输入 token 的子集，即输入 token 包括缓存与未缓存的 token。

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

  在模型生成的函数调用参数被更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    以 JSON 字符串表示的参数增量。

  - `event_id: string`

    服务端事件的唯一 ID。

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
  也会在 Response 被中断、未完成或被取消时发出。

  - `arguments: string`

    作为 JSON 字符串的最终参数。

  - `call_id: string`

    函数调用的 ID。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `name: string`

    被调用的函数的名称。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.done"`

    事件类型，必须为 `response.function_call_arguments.done`.

    - `"response.function_call_arguments.done"`

### Response Mcp Call Arguments Delta

- `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

  在响应生成期间更新 MCP 工具调用参数时返回。

  - `delta: string`

    JSON 编码的参数增量。

  - `event_id: string`

    服务端事件的唯一 ID。

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

    如果存在，则表示增量文本经过混淆处理。

### Response Mcp Call Arguments Done

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成过程中，MCP 工具调用参数被最终确定时返回。

  - `arguments: string`

    最终的 JSON 编码参数字符串。

  - `event_id: string`

    服务端事件的唯一 ID。

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

  在 MCP 工具调用已成功完成时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `type: "response.mcp_call.completed"`

    事件类型，必须为 `response.mcp_call.completed`.

    - `"response.mcp_call.completed"`

### Response Mcp Call Failed

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

### Response Mcp Call In Progress

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

### Response Output Item Added Event

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  在 Response 生成过程中创建新的 Item 时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    Response 中输出项的索引。

  - `response_id: string`

    该项所属 Response 的 ID。

  - `type: "response.output_item.added"`

    事件类型，必须为 `response.output_item.added`.

    - `"response.output_item.added"`

### Response 输出项完成事件

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  当一个 Item 完成流式传输时返回。在 Response 被
  中断、未完成或取消时也会发出。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话的任意时刻添加。对于对话行为的重大修改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录文本（针对 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

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

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

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

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的一个 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

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

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    Response 中输出项的索引。

  - `response_id: string`

    该项所属 Response 的 ID。

  - `type: "response.output_item.done"`

    事件类型，必须为 `response.output_item.done`.

    - `"response.output_item.done"`

### Response 文本增量事件

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  当 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `delta: string`

    文本增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_text.delta"`

    事件类型，必须为 `response.output_text.delta`.

    - `"response.output_text.delta"`

### Response 文本完成事件

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  当 "output_text" 内容部分的文本值完成流式传输时返回。
  在 Response 被中断、未完成或取消时也会发出。

  - `content_index: number`

    该内容部分在项目内容数组中的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `response_id: string`

    响应的 ID。

  - `text: string`

    最终的文本内容。

  - `type: "response.output_text.done"`

    事件类型，必须为 `response.output_text.done`.

    - `"response.output_text.done"`

### 会话创建事件

- `SessionCreatedEvent object { event_id, session, type }`

  当创建 Session 时返回。在建立新
  连接时作为第一个服务端事件自动发出。该事件将包含
  默认的 Session 配置。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。Realtime 始终为 `realtime` 。API。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超时后将自动触发模型响应。该参数
                在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                该超时值将在最后一次模型响应的音频播放完成后开始计时，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与该 Response 相关的事件）在到达超时时会被发出。
                空闲超时当前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                为 500ms。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                更高的阈值要求更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动中断默认
                对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，为原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

            该参数是对生成后音频的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少回复过一次音频，
              会话期间就无法再更改声音。可用的
              声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

        注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
        模型将响应音频以及转录文本。 `["text"]` 可用于让
        模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射值，用于替换你
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

        模型如何选择工具。提供以下字符串模式之一，或强制指定某个
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何
            调用它的指引，以及调用时告诉用户什么的
            （指引（如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

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

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已于 2026/09/01 之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
            通过安全 MCP 通道连接。

            当前支持的 `connector_id` 值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用 追踪，配置便不可修改。

        `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
        工作流 名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
            命名 追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

        截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

        截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

          - `retention_ratio: number`

            当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到的语音之前要包含的音频量（以
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静音时长（以毫秒为单位）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
              更高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅限 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 会话更新事件

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新任何字段
  除了 `voice` 和 `model`. `voice` 只能在没有其他音频输出的情况下更新。

  当服务器收到 `session.update`，时，它会响应
  一个 `session.updated` 事件，显示完整且生效的配置。
  只有出现在 `session.update` 中的字段会被更新。要清除像
  `instructions`,传递一个空字符串。要清除类似 `tools`，的字段,传递一个空数组。
  要清除类似 `turn_detection`，的字段,传递 `null`.

  要关闭输入音频降噪,请发送以下 Realtime 事件:

  ```json
  {"type":"session.update","session":{"type":"realtime","audio":{"input":{"noise_reduction":null}}}}
  ```

  对于转录会话,请使用 `"type":"transcription"` 放在 `session`.
  从更新中省略 `audio.input.noise_reduction` 会保留其当前设置不变。

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。选择实时
    session 或 transcription 会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。Realtime 始终为 `realtime` 。API。

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
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

              用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。使用
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
              可提升准确率并降低延迟。

            - `languages: optional array of string`

              输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
              对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
              Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超时后将自动触发模型响应。该参数
                在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                该超时值将在最后一次模型响应的音频播放完成后开始计时，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与该 Response 相关的事件）在到达超时时会被发出。
                空闲超时当前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                为 500ms。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                更高的阈值要求更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动中断默认
                对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，为原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

            该参数是对生成后音频的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于回应的声音。支持的内置声音包括
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
            一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
            一旦模型至少回应过一次音频后就无法更改。
            自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
            我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

        注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
        模型将响应音频以及转录文本。 `["text"]` 可用于让
        模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以并行调用多个工具。仅支持
        推理 Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射值，用于替换你
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

        模型如何选择工具。提供以下字符串模式之一，或强制指定某个
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional RealtimeToolsConfig`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何
            调用它的指引，以及调用时告诉用户什么的
            （指引（如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

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

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已于 2026/09/01 之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
            通过安全 MCP 通道连接。

            当前支持的 `connector_id` 值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用 追踪，配置便不可修改。

        `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
        工作流 名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
            命名 追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

        截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

        截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

          - `retention_ratio: number`

            当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转写会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。Realtime 始终为 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超时后将自动触发模型响应。该参数
                在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                该超时值将在最后一次模型响应的音频播放完成后开始计时，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与该 Response 相关的事件）在到达超时时会被发出。
                空闲超时当前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                为 500ms。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                更高的阈值要求更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动中断默认
                对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    由客户端生成的可选 ID，用于标识此事件。这是一个客户端可以自行指定的任意字符串。如果该事件发生错误，它会被传回，但对应的 `session.updated` 事件将不会包含它。

### 会话已更新事件

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话因某个事件而更新时返回， `session.update` 事件更新，
  除非出现错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。Realtime 始终为 `realtime` 。API。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超时后将自动触发模型响应。该参数
                在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                该超时值将在最后一次模型响应的音频播放完成后开始计时，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与该 Response 相关的事件）在到达超时时会被发出。
                空闲超时当前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                为 500ms。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                更高的阈值要求更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动中断默认
                对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，为原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

            该参数是对生成后音频的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少回复过一次音频，
              会话期间就无法再更改声音。可用的
              声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

        注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
        模型将响应音频以及转录文本。 `["text"]` 可用于让
        模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射值，用于替换你
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

        模型如何选择工具。提供以下字符串模式之一，或强制指定某个
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何
            调用它的指引，以及调用时告诉用户什么的
            （指引（如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

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

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已于 2026/09/01 之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
            通过安全 MCP 通道连接。

            当前支持的 `connector_id` 值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用 追踪，配置便不可修改。

        `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
        工作流 名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
            命名 追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

        截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

        截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

          - `retention_ratio: number`

            当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到的语音之前要包含的音频量（以
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静音时长（以毫秒为单位）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
              更高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅限 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### 转录会话更新

- `TranscriptionSessionUpdate object { session, type, event_id }`

  发送此事件以更新转写会话。

  - `session: object { include, input_audio_format, input_audio_noise_reduction, 2 more }`

    实时转写会话对象配置。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在转写中的项目集。当前可用的项目包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`，输入音频必须为 16 位 PCM、24kHz 采样率、
      单声道（mono），且采用小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转写的配置。客户端可以选择性地设置转写的语言和提示，这些为转写服务提供了额外的指导。

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

        用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提升准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到的语音之前要包含的音频量（以
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        用于检测语音停止的静音时长（以毫秒为单位）。默认
        为 500ms。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
        更高的阈值要求更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

      - `type: optional "server_vad"`

        轮次检测类型。仅 `server_vad` 目前支持用于转写会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成的 ID。

### 转录会话更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  当转写会话被更新时返回，伴随一个 `transcription_session.update` 事件更新，
  除非出现错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    新的 Realtime 转写会话配置。

    当会话通过 REST API 在服务端创建时，会话对象
    还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
    属性在通过 WebSocket API 更新会话时不会出现。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅在会话通过 REST
      API 在服务端创建时出现。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌在
        一分钟后过期。

      - `value: string`

        可在客户端环境中用于认证连接到 Realtime
        API 的临时密钥。请在客户端环境中使用它，而不是
        标准 API 令牌，后者应仅在 服务端 使用。

    - `input_audio_format: optional string`

      输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string or null`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        为输入音频转录配置的提示词（如果存在）。

    - `modalities: optional array of "text" or "audio"`

      模型可以响应的模态集合。若要禁用音频，
      请将其设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测的配置。可设置为 `null` 以关闭。服务端
      VAD 意味着模型将根据
      用户语音结束时的音量和响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到的语音之前要包含的音频量（以
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        用于检测语音停止的静音时长（以毫秒为单位）。默认
        为 500ms。该值越小，模型响应越快，
        但可能会在用户短暂的停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
        更高的阈值要求更响亮的音频才能激活模型，
        因此在嘈杂环境中可能表现更好。

      - `type: optional string`

        轮次检测的类型，仅限 `server_vad` 当前受支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 通话

## 接听通话

**post** `/realtime/calls/{call_id}/accept`

接收来电 SIP 通话，并配置用于
处理它的实时会话。

### 路径参数

- `call_id: string`

### 请求参数

- `type: "realtime"`

  要创建的会话类型。Realtime 始终为 `realtime` 。API。

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
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

        用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。使用
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        可提升准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
        Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          可选超时时间，超时后将自动触发模型响应。该参数
          在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
          当前上下文有效地提示用户继续对话。
          当前上下文。

          该超时值将在最后一次模型响应的音频播放完成后开始计时，
          即它的设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与该 Response 相关的事件）在到达超时时会被发出。
          空闲超时当前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否自动中断（取消）向默认
          对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
          为 500ms。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          更高的阈值要求更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD 停止事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当 VAD 开始事件发生时，是否使用输出自动中断默认
          对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应的速度，为原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

      该参数是对生成后音频的后处理调整，也
      可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音包括
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
      一旦模型至少回应过一次音频后就无法更改。
      自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
      我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

  要在服务端输出中包含的额外字段。

  `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

  注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
  模型将响应音频以及转录文本。 `["text"]` 可用于让
  模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅支持
  推理 Realtime 模型，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的映射值，用于替换你
    提示中的变量。替换值可以是字符串，也可以是其他
    响应输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型，始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型，始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件 ID。

      - `image_url: optional string or null`

        发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型，始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送给模型的文件内容。

      - `file_id: optional string or null`

        发送给模型的文件 ID。

      - `file_url: optional string`

        发送给模型的文件的 URL。

      - `filename: optional string`

        发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

  模型如何选择工具。提供以下字符串模式之一，或强制指定某个
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪些工具（如果有）。

    `none` 表示模型将不调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或
    多个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可以强制模型调用特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指引，以及调用时告诉用户什么的
      （指引（如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol
    (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

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

          指示工具是否修改数据或是否为只读。如果某个
          MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          与此过滤器的标注，则它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
      MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段已于 2026/09/01 之后发布的模型弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
      通过安全 MCP 通道连接。

      当前支持的 `connector_id` 值包括：

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

      此 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头，用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，也可以是与工具关联的过滤对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
  为会话启用 追踪，配置便不可修改。

  `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
  工作流 名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
      筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
      命名 追踪。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

  截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

  截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

    - `retention_ratio: number`

      当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

      - `post_instructions: optional number`

        指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

通过 WebRTC 创建一个新的 Realtime API 调用，并接收完成对等连接所需的 SDP 应答
。

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

结束一次活动的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 方法将进行中的 SIP 通话转接到新目标。

### 路径参数

- `call_id: string`

### 请求参数

- `target_uri: string`

  应出现在 SIP Refer-To 头中的 URI。支持类似
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

通过向主叫方返回 SIP 状态码来拒绝来电 SIP。

### 路径参数

- `call_id: string`

### 请求参数

- `status_code: optional number`

  发送回调用方的 SIP 响应代码。默认值为 `603` （486（Decline）
  （当未提供时）。

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

# Client Secrets

## Create client secret

**post** `/realtime/client_secrets`

创建一个 Realtime 客户端密钥，并附带会话配置。

客户端密钥是一种短期有效的令牌，可以传递给客户端应用，
例如网页前端或移动客户端，用于授予访问 Realtime API 的权限，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义 TTL。
leaking your main 接口 key. You can configure a custom TTL for each client secret.

你也可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的所有会话，但这些选项也可以被
客户端连接覆盖。

[了解如何通过 WebRTC 使用客户端密钥进行身份验证](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，格式如下： `ek_1234`.

### 请求参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥的过期配置。过期指的是在此时间之后
  客户端密钥将无法再用于创建会话的时间点。已开始
  的会话在该时间之后仍可继续进行。在到期之前，一个密钥
  可用于创建多个会话。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，意味着 `seconds` 将被添加到 `created_at` 客户端密钥的时间上以生成过期时间戳。仅 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择 realtime
  session 或 transcription 会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。Realtime 始终为 `realtime` 。API。

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
          降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

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

            用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。使用
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            可提升准确率并降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
            对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
            Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，超时后将自动触发模型响应。该参数
              在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              当前上下文。

              该超时值将在最后一次模型响应的音频播放完成后开始计时，
              即它的设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与该 Response 相关的事件）在到达超时时会被发出。
              空闲超时当前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）向默认
              对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              更高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否使用输出自动中断默认
              对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应的速度，为原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

          该参数是对生成后音频的后处理调整，也
          可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，例如通过
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
          一旦模型至少回应过一次音频后就无法更改。
          自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。
          我们建议 `marin` 和 `cedar` 以获得最佳质量。

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

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

      注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
      模型将响应音频以及转录文本。 `["text"]` 可用于让
      模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅支持
      推理 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射值，用于替换你
        提示中的变量。替换值可以是字符串，也可以是其他
        响应输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

      模型如何选择工具。提供以下字符串模式之一，或强制指定某个
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可以强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional RealtimeToolsConfig`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何
          调用它的指引，以及调用时告诉用户什么的
          （指引（如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

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

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
          MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已于 2026/09/01 之后发布的模型弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
          通过安全 MCP 通道连接。

          当前支持的 `connector_id` 值包括：

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 头，用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，也可以是与工具关联的过滤对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值之一为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
      为会话启用 追踪，配置便不可修改。

      `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
      工作流 名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
          命名 追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

      截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

      截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

        - `retention_ratio: number`

          当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

        - `type: "retention_ratio"`

          使用按比例保留的截断方式。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

          - `post_instructions: optional number`

            指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转写会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。Realtime 始终为 `transcription` 用于转写会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，超时后将自动触发模型响应。该参数
              在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              当前上下文。

              该超时值将在最后一次模型响应的音频播放完成后开始计时，
              即它的设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与该 Response 相关的事件）在到达超时时会被发出。
              空闲超时当前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）向默认
              对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              更高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否使用输出自动中断默认
              对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回

- `expires_at: number`

  客户端密钥的过期时间戳，以自 Unix 纪元起的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  用于实时会话或转录会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    一个 Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。Realtime 始终为 `realtime` 。API。

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

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }  or null`

          输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词（如果存在）。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，超时后将自动触发模型响应。该参数
              在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              当前上下文。

              该超时值将在最后一次模型响应的音频播放完成后开始计时，
              即它的设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与该 Response 相关的事件）在到达超时时会被发出。
              空闲超时当前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否自动中断（取消）向默认
              对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              更高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当 VAD 开始事件发生时，是否使用输出自动中断默认
              对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应的速度，为原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

          该参数是对生成后音频的后处理调整，也
          可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话期间就无法再更改声音。可用的
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

      注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
      模型将响应音频以及转录文本。 `["text"]` 可用于让
      模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射值，用于替换你
        提示中的变量。替换值可以是字符串，也可以是其他
        响应输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

      模型如何选择工具。提供以下字符串模式之一，或强制指定某个
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪些工具（如果有）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        多个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可以强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何
          调用它的指引，以及调用时告诉用户什么的
          （指引（如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol
        (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

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

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
          MCP 服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段已于 2026/09/01 之后发布的模型弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
          通过安全 MCP 通道连接。

          当前支持的 `connector_id` 值包括：

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

          此 MCP 工具是否为延迟加载，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 头，用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，也可以是与工具关联的过滤对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值之一为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
      为会话启用 追踪，配置便不可修改。

      `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
      工作流 名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
          命名 追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

      截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

      截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

        - `retention_ratio: number`

          当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

        - `type: "retention_ratio"`

          使用按比例保留的截断方式。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

          - `post_instructions: optional number`

            指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }  or null`

          转录模型的配置。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词（如果存在）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测的配置。可设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据
          音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到的语音之前要包含的音频量（以
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            用于检测语音停止的静音时长（以毫秒为单位）。默认
            为 500ms。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
            更高的阈值要求更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测的类型，仅限 `server_vad` 当前受支持。

    - `expires_at: optional number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      要在服务端输出中包含的额外字段。

      - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

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
          "type": "server_vad"
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

## 域类型

### Client Secret 创建响应

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    用于实时会话或转录会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。Realtime 始终为 `realtime` 。API。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，超时后将自动触发模型响应。该参数
                在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                该超时值将在最后一次模型响应的音频播放完成后开始计时，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与该 Response 相关的事件）在到达超时时会被发出。
                空闲超时当前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否自动中断（取消）向默认
                对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
                为 500ms。该值越小，模型响应越快，
                但可能会在用户短暂的停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                更高的阈值要求更响亮的音频才能激活模型，
                因此在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当 VAD 开始事件发生时，是否使用输出自动中断默认
                对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应的速度，为原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

            该参数是对生成后音频的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话期间就无法再更改声音。可用的
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的声音。一旦模型至少回复过一次音频，
              会话期间就无法再更改声音。可用的
              声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

        注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
        模型将响应音频以及转录文本。 `["text"]` 可用于让
        模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          可选的映射值，用于替换你
          提示中的变量。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

        模型如何选择工具。提供以下字符串模式之一，或强制指定某个
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪些工具（如果有）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          多个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括何时以及如何
            调用它的指引，以及调用时告诉用户什么的
            （指引（如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

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

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                与此过滤器的标注，则它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
            MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段已于 2026/09/01 之后发布的模型弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
            通过安全 MCP 通道连接。

            当前支持的 `connector_id` 值包括：

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

            此 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头，用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，也可以是与工具关联的过滤对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  与此过滤器的标注，则它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
        为会话启用 追踪，配置便不可修改。

        `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
        工作流 名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
            命名 追踪。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

        截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

        截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

          - `retention_ratio: number`

            当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

          - `type: "retention_ratio"`

            使用按比例保留的截断方式。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到的语音之前要包含的音频量（以
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静音时长（以毫秒为单位）。默认
              为 500ms。该值越小，模型响应越快，
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
              更高的阈值要求更响亮的音频才能激活模型，
              因此在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅限 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，以自 Unix 纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Session Create Response

- `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

  一个 Realtime 会话配置对象。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `object: "realtime.session"`

    对象类型。始终为 `realtime.session`.

    - `"realtime.session"`

  - `type: "realtime"`

    要创建的会话类型。Realtime 始终为 `realtime` 。API。

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪的配置。可设置为 `null` 以关闭。
        降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        输入音频转写的配置，默认为关闭，可以设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写的语言和 prompt，这些为转写服务提供了额外的指引。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果存在）。

      - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

        轮次检测的配置，可以是服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，这种情况下客户端必须手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        语义 VAD 更为先进，它使用轮次检测模型（结合 VAD）来语义化地估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的语音以“嗯……”逐渐减弱，模型将给出较低的轮次结束概率评分，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静音一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已在响应时设置可能会导致创建响应失败。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，超时后将自动触发模型响应。该参数
            在用户出现较长停顿属于异常情况的场景下非常有用，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            当前上下文。

            该超时值将在最后一次模型响应的音频播放完成后开始计时，
            即它的设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与该 Response 相关的事件）在到达超时时会被发出。
            空闲超时当前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否自动中断（取消）向默认
            对话（即。 `conversation` 的 `auto`）发出的任何进行中的响应。如果 `true` 则响应将被取消，否则会继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 均设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（单位
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于判断语音停止的静音时长（单位毫秒）。默认
            为 500ms。该值越小，模型响应越快，
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            更高的阈值要求更响亮的音频才能激活模型，
            因此在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型回应的积极程度。 `low` 会等待更长时间，以便用户继续说话， `high` 会更快地回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时时间分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当 VAD 开始事件发生时，是否使用输出自动中断默认
            对话（即。 `conversation` 的 `auto`) 的任何正在进行的回应。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应的速度，为原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此参数只能在模型轮次之间更改，不能在回应进行时更改。

        该参数是对生成后音频的后处理调整，也
        可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的声音。一旦模型至少回复过一次音频，
        会话期间就无法再更改声音。可用的
        声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话期间就无法再更改声音。可用的
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
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

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“语气友好”、“以下是优秀响应的示例”），以及音频行为上的偏好（例如“语速较快”、“在声音中加入情感”、“经常笑”）。这些指令不保证会被模型遵循，但它们为模型期望的行为提供了引导。

    注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token
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
    模型将响应音频以及转录文本。 `["text"]` 可用于让
    模型仅以文本形式响应。无法同时请求两种输出 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

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

    模型如何选择工具。提供以下字符串模式之一，或强制指定某个
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪些工具（如果有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可以强制模型调用特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可以强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括何时以及如何
        调用它的指引，以及调用时告诉用户什么的
        （指引（如果有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器为模型提供对其他工具的访问权限。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

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

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            与此过滤器的标注，则它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义
        MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段已于 2026/09/01 之后发布的模型弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或者 `tunnel_id` to
        通过安全 MCP 通道连接。

        当前支持的 `connector_id` 值包括：

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

        此 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头，用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，也可以是与工具关联的过滤对象
          需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器使用了 [标注，则它将匹配此过滤器。 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              与此过滤器的标注，则它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值之一为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可选值之一为 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。可选值之一为
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦
    为会话启用 追踪，配置便不可修改。

    `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
    工作流 名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用 追踪，并设置 追踪 配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
        筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
        命名 追踪。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

    客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

    截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

    截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

      - `retention_ratio: number`

        当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

      - `type: "retention_ratio"`

        使用按比例保留的截断方式。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

        - `post_instructions: optional number`

          指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        转录模型的配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果存在）。

      - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

        轮次检测的配置。可设置为 `null` 以关闭。服务端
        VAD 意味着模型将根据
        音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          在 VAD 检测到的语音之前要包含的音频量（以
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          用于检测语音停止的静音时长（以毫秒为单位）。默认
          为 500ms。该值越小，模型响应越快，
          但可能会在用户短暂的停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
          更高的阈值要求更响亮的音频才能激活模型，
          因此在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测的类型，仅限 `server_vad` 当前受支持。

  - `expires_at: optional number`

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  音频音量检测语音的开始与结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，此项必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到的语音之前要包含的音频量（以
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静音时长（以毫秒为单位）。默认
    为 500ms。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
    更高的阈值要求更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前受支持。

# Sessions

## Create session

**post** `/realtime/sessions`

创建一个用于客户端应用的临时 API 令牌，配合
Realtime API 使用。可使用与
`session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` key，其中包含
一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以使用 Realtime API。

返回所创建的 Realtime 会话对象，以及一个临时密钥。

### 请求参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于认证连接到 Realtime
    API 的临时密钥。请在客户端环境中使用它，而不是
    标准 API 令牌，后者应仅在 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，可以设
  设置为 `null` 置为开启后关闭。输入音频转录并非模型原生支持，因为模型直接消费音频。转录会异步进行，应作为粗略参考而非模型理解的结果来处理。
  to turn off once on. Input audio transcription is not native
  to the model, since the model consumes audio directly. Transcription runs
  asynchronously and should be treated as rough guidance。

  - `model: optional string`

    rather than the representation understood by the model.

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端指导模型给出期望的响应。可以指示模型关于响应内容和格式（例如，“保持极其简洁”、“表现友好”、“以下是良好响应的示例”），以及音频行为（例如“快速说话”、“在声音中注入情感”、“经常笑”）。这些指令不保证被模型遵循，但它们为模型期望的行为提供指导。
  注意，如果未设置此字段，服务端会设置将在会话开始时 `session.created` 事件中可见的默认指令。

- `max_response_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大 token
  数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的映射值，用于替换你
    提示中的变量。替换值可以是字符串，也可以是其他
    响应输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型，始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的详细程度。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型，始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件 ID。

      - `image_url: optional string or null`

        发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型，始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的详细程度。使用 `auto` 以让系统选择详细程度；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 进行低开销渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送给模型的文件内容。

      - `file_id: optional string or null`

        发送给模型的文件 ID。

      - `file_url: optional string`

        发送给模型的文件的 URL。

      - `filename: optional string`

        发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音响应的速度。1.0 是默认速度。0.25 是
  最低速度。1.5 是最高速度。此值只能在
  模型轮次之间更改，不能在响应进行中更改。

- `temperature: optional number`

  模型的采样温度，范围限制为 [0.6, 1.2]，默认值为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。选项有 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何
    调用它的指引，以及调用时告诉用户什么的
    （指引（如果有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  用于配置追踪的选项。设为 null 以禁用追踪。一旦
  为会话启用 追踪，配置便不可修改。

  `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
  工作流 名称、组 ID 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
      在追踪面板中进行分组。

    - `metadata: optional unknown`

      附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
      在追踪面板中进行筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
      在追踪面板中为追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，意味着从最早的消息开始将不会纳入模型的上下文。上下文为 32k、最大输出 token 为 4,096 的模型，在发生截断前上下文中最多只能包含 28,224 个 token。

  客户端可以配置截断行为，使用较低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方法。

  截断会减少下一轮中的已缓存 token 数量（导致缓存失效），因为消息会从上下文开头被丢弃。但客户端也可以将截断配置为在达到最大上下文大小的一定比例之前都保留消息，这能减少后续截断的次数，从而提升缓存命中率。

  截断也可以被完全禁用，这意味着服务端永远不会进行截断，而是当会话超出模型输入 token 上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在会话超出输入 token 上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当会话超出输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多轮中，有助于提升已缓存 token 的利用率。

    - `retention_ratio: number`

      当会话超出输入 token 上限时保留的指令后会话 token 比例（`0.0` - `1.0`）。将该值设为 `0.8` 表示会不断丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断发生频率，并提升缓存命中率。

    - `type: "retention_ratio"`

      使用按比例保留的截断方式。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

      - `post_instructions: optional number`

        指令之后会话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超出 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  用户语音结束时的音量和响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到的语音之前要包含的音频量（以
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静音时长（以毫秒为单位）。默认
    为 500ms。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
    更高的阈值要求更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前受支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型用于回应的声音。支持的内置声音包括
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`。你也可以提供一个包含任意
  `id`，例如 `{ "id": "voice_1234" }`。的自定义 voice 对象。语音在会话中一旦让模型
  至少响应过一次音频后，便无法再更改。
  自定义声音必须由音频样本创建。仅在 Live 中支持通过文本提示创建声音。

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

### 返回

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

    - `noise_reduction: optional object { type }  or null`

      输入音频降噪配置。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转录的配置。

      - `language: optional string or null`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        为输入音频转录配置的提示词（如果存在）。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

      轮次检测的配置。

      - `prefix_padding_ms: optional number`

      - `silence_duration_ms: optional number`

      - `threshold: optional number`

      - `type: optional string`

        轮次检测的类型，仅限 `server_vad` 当前受支持。

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

  会话的过期时间戳，以自 Unix 纪元起的秒数表示。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的额外字段。

  - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  默认的系统指令（即系统消息），会拼接到模型调用
  之前。该字段允许客户端引导模型输出期望的
  响应。可以指示模型回复的内容和格式，
  （例如“极其简洁”、“表现得友好”、“下面是一些好的
  回复示例”）以及音频行为（例如“语速快一些”、“在声音
  变成你的声音"、"经常笑"）。这些指示不一定保证被模型遵循，但会引导模型
  to be followed by the model, but they provide guidance to the model on the
  desired behavior.

  请注意，服务端会设置默认指令，在未设置该
  字段时使用，这些默认指令可在 `session.created` 事件的会话开头
  处查看。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大 token
  数。默认为 `inf`.

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

  模型选择工具的方式。选项有 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括何时以及如何
    调用它的指引，以及调用时告诉用户什么的
    （指引（如果有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  用于配置追踪的选项。设为 null 以禁用追踪。一旦
  为会话启用 追踪，配置便不可修改。

  `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
  工作流 名称、组 ID 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对 追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
      在追踪面板中进行分组。

    - `metadata: optional unknown`

      附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
      在追踪面板中进行筛选。

    - `workflow_name: optional string`

      附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
      在追踪面板中为追踪命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  用户语音结束时的音量和响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到的语音之前要包含的音频量（以
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静音时长（以毫秒为单位）。默认
    为 500ms。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
    更高的阈值要求更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前受支持。

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

## 域类型

### Session Create Response

- `SessionCreateResponse object { id, audio, expires_at, 10 more }`

  一个 Realtime 会话配置对象。

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果存在）。

      - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

        轮次检测的配置。

        - `prefix_padding_ms: optional number`

        - `silence_duration_ms: optional number`

        - `threshold: optional number`

        - `type: optional string`

          轮次检测的类型，仅限 `server_vad` 当前受支持。

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

    会话的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    默认的系统指令（即系统消息），会拼接到模型调用
    之前。该字段允许客户端引导模型输出期望的
    响应。可以指示模型回复的内容和格式，
    （例如“极其简洁”、“表现得友好”、“下面是一些好的
    回复示例”）以及音频行为（例如“语速快一些”、“在声音
    变成你的声音"、"经常笑"）。这些指示不一定保证被模型遵循，但会引导模型
    to be followed by the model, but they provide guidance to the model on the
    desired behavior.

    请注意，服务端会设置默认指令，在未设置该
    字段时使用，这些默认指令可在 `session.created` 事件的会话开头
    处查看。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token
    数。默认为 `inf`.

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

    模型选择工具的方式。选项有 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括何时以及如何
      调用它的指引，以及调用时告诉用户什么的
      （指引（如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    用于配置追踪的选项。设为 null 以禁用追踪。一旦
    为会话启用 追踪，配置便不可修改。

    `auto` 将为该会话创建一个 追踪，并使用以下项的默认值：
    工作流 名称、组 ID 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此 追踪 的组 ID，用于在追踪仪表板中进行筛选和
        在追踪面板中进行分组。

      - `metadata: optional unknown`

        附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
        在追踪面板中进行筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的 工作流 名称，用于在追踪仪表板中
        在追踪面板中为追踪命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

    轮次检测的配置。可设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据
    用户语音结束时的音量和响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到的语音之前要包含的音频量（以
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      用于检测语音停止的静音时长（以毫秒为单位）。默认
      为 500ms。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
      更高的阈值要求更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅限 `server_vad` 当前受支持。

# 转录会话

## 创建转录会话

**post** `/realtime/transcription_sessions`

创建一个用于客户端应用的临时 API 令牌，配合
专为实时转录设计的 Realtime API。
可使用与以下相同的会话参数进行配置： `transcription_session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` key，其中包含
一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以使用 Realtime API。

返回已创建的 Realtime 转录会话对象以及一个临时密钥。

### 请求参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要包含在转写中的项目集。当前可用的项目包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`，输入音频必须为 16 位 PCM、24kHz 采样率、
  单声道（mono），且采用小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可设置为 `null` 以关闭。
  降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
  对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转写的配置。客户端可以选择性地设置转写的语言和提示，这些为转写服务提供了额外的指导。

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

    用于引导输入音频转录的单词或短语。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。使用
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    可提升准确率并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持的语言为 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
    对于 `whisper-1`，则 [prompt 是关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 是一个自由文本字符串，例如 "expect words related to technology"。
    Prompt 不支持 `gpt-realtime-whisper` GA Realtime 会话中支持。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到的语音之前要包含的音频量（以
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静音时长（以毫秒为单位）。默认
    为 500ms。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
    更高的阈值要求更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional "server_vad"`

    轮次检测类型。仅 `server_vad` 目前支持用于转写会话。

    - `"server_vad"`

### 返回

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅在会话通过 REST
  API 在服务端创建时出现。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于认证连接到 Realtime
    API 的临时密钥。请在客户端环境中使用它，而不是
    标准 API 令牌，后者应仅在 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string or null`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    为输入音频转录配置的提示词（如果存在）。

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  用户语音结束时的音量和响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到的语音之前要包含的音频量（以
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静音时长（以毫秒为单位）。默认
    为 500ms。该值越小，模型响应越快，
    但可能会在用户短暂的停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
    更高的阈值要求更响亮的音频才能激活模型，
    因此在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅限 `server_vad` 当前受支持。

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
  "client_secret": {
    "value": "ek_abc123",
    "expires_at": 1742188264
  }
}
```

## 域类型

### 转录会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  新的 Realtime 转写会话配置。

  当会话通过 REST API 在服务端创建时，会话对象
  还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
  属性在通过 WebSocket API 更新会话时不会出现。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅在会话通过 REST
    API 在服务端创建时出现。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌在
      一分钟后过期。

    - `value: string`

      可在客户端环境中用于认证连接到 Realtime
      API 的临时密钥。请在客户端环境中使用它，而不是
      标准 API 令牌，后者应仅在 服务端 使用。

  - `input_audio_format: optional string`

    输入音频的格式。可选项包括 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string or null`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可用输入音频语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      为输入音频转录配置的提示词（如果存在）。

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频，
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测的配置。可设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据
    用户语音结束时的音量和响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到的语音之前要包含的音频量（以
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      用于检测语音停止的静音时长（以毫秒为单位）。默认
      为 500ms。该值越小，模型响应越快，
      但可能会在用户短暂的停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。更
      更高的阈值要求更响亮的音频才能激活模型，
      因此在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅限 `server_vad` 当前受支持。

# 翻译

# Client Secrets

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并附带翻译会话配置。

客户端密钥是一种短期有效的令牌，可以传递给客户端应用，
例如网页前端或移动客户端，可用于访问 Realtime
Translation API 而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义
TTL。

返回已创建的客户端密钥以及生效的翻译会话对象。
客户端密钥是一个形如以下的字符串： `ek_1234`.

### 请求参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话持续流式传入源语言音频，
  并持续流式输出翻译后的音频以及转录增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流进行。

        - `model: string`

          用于源转录增量文本的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量文本的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥的过期配置。过期指的是在此时间之后
  客户端密钥将无法再用于创建会话的时间点。已开始
  的会话在该时间之后仍可继续进行。在到期之前，一个密钥
  可用于创建多个会话。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，意味着 `seconds` 将被添加到 `created_at` 客户端密钥的时间上以生成过期时间戳。仅 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认为 600 秒（10 分钟）。

### 返回

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自 Unix 纪元起的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续将输入音频
    翻译为所配置的目标语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流进行。

          - `model: string`

            用于源转写增量数据的转写模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，以自 Unix 纪元起的秒数表示。

    - `model: string`

      本次会话使用的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话，始终为 `translation` 。

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
