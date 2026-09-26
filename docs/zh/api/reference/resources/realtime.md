# Realtime

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 域名类型

### 音频转录

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转录文本之前等待的时间。
    较高的值可以提高转录准确率，但会增加延迟。
    仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
    可提高准确率和降低延迟。

  - `languages: optional array of string`

    输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续上一段音频的可选文本
    片段。
    对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
    提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

### 会话创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  在会话创建时返回。会话创建之后立即发出。

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

### 会话条目

- `ConversationItem = RealtimeConversationItemSystemMessage or RealtimeConversationItemUserMessage or RealtimeConversationItemAssistantMessage or 6 more`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容的类型。始终为 `input_text` （针对系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

        Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

      条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息 item。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用 item。

    - `arguments: string`

      函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出 item。

    - `call_id: string`

      该输出所对应函数调用的 ID。

    - `output: string`

      函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 批准请求的一条 Realtime item。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    用于列出 MCP 服务器上可用工具的 Realtime item。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注释。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    表示在 MCP 服务器上调用工具的 Realtime item。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给工具的参数 JSON 字符串。

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

      工具调用的错误（如果有）。

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

    请求人工批准工具调用的 Realtime item。

    - `id: string`

      批准请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具的名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

### 对话项已添加

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当有 Item 被添加到默认的 Conversation 时由服务端发送。以下几种情况都会触发该事件：

  - 当客户端发送 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。在这种情况下，该 item 将是一条用户消息，其中包含来自缓冲区的音频。
  - 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时还没有任何内容（且 `status` 将为 `in_progress`).

  该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），但音频数据除外，必要时可以通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    位于此项之前的 item 的 ID（如果有）。该字段用于
    在插入 item 时保持顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向会话的上下文中添加一个新 Item，包括消息、函数
  调用和函数调用响应。该事件既可用于填充会话的
  "历史记录"，也可在流式过程中添加新 Item，但当前存在
  无法填充助手音频消息的限制。

  如果成功，服务端将发出一个 `conversation.item.added` 事件，并且，
  在该 Item 完成时，发出一个 `conversation.item.done` event。否则，将发送一个
  `error` event。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    可选的、由客户端生成的 ID，用于标识此 event。

  - `previous_item_id: optional string`

    前置 item 的 ID，新 item 将插入到该项之后。如果未设置，新 item 将追加到对话末尾。

    如果设置为 `root`，新 item 将添加到对话开头。

    如果设置为某个已存在的 ID，则可在对话中间插入一个 item。如果找不到该 ID，将返回错误，且不会添加该 item。

### 对话项创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在对话条目创建时返回。存在以下几种会触发此事件的场景：

  - 服务端正在生成一个 Response，如果成功将生成
    一个或两个 Item，其类型为 `message`
    (role `assistant`)或类型 `function_call`.
  - 输入音频缓冲区已被提交，由客户端或
    服务端(在 `server_vad` 模式下)提交。服务端将获取
    输入音频缓冲区的内容，并将其添加到一个新的用户消息 Item 中。
  - 客户端已发送一个 `conversation.item.create` 事件以添加新的 Item
    到该 Conversation。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    Conversation 上下文中前一个条目的 ID，便于
    客户端了解对话顺序。可以为 `null` ，如果该
    条目没有前驱项。

### 会话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你想从会话中移除任何条目时，发送此事件
  历史记录。服务器将以 `conversation.item.deleted` 事件作出响应，
  除非该条目不存在于会话历史记录中，在这种情况下，
  服务器将返回错误。

  - `item_id: string`

    要删除的条目 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### 对话项删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当对话中的某个项目被客户端通过以下方式删除时返回：
  `conversation.item.delete` 事件。此事件用于将
  服务端对对话历史的理解与客户端的视图保持一致。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被删除项目的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话项完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  在对话项被定稿时返回。

  该事件将包含该项的完整内容，但音频数据除外——如有需要，可通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    位于此项之前的 item 的 ID（如果有）。该字段用于
    在插入 item 时保持顺序。

### Conversation Item Input Audio Transcription Completed Event

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  该事件是写入用户音频缓冲区的音频转录输出，
  音频转录在输入音频缓冲区由客户端或服务端
  提交时开始（启用 VAD 时）。转录与 Response 创建
  异步运行，因此该事件可能早于或晚于
  Response 事件到达。

  Realtime API 模型原生支持音频，因此输入转录是
  在单独的 ASR（自动语音识别）模型上运行的独立流程。
  转录文本可能与模型的解读存在一定差异，
  应被视为粗略参考。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在被转录的、包含音频的条目的 ID。

  - `transcript: string`

    转录得到的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    该转录的使用统计信息，计费依据 ASR 模型的定价，而非 realtime 模型的定价。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 使用量计费的模型的使用统计信息。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        usage 对象的类型。对于此变体始终为 `tokens` 。

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

        usage 对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

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

    正在被转录的、包含音频的条目的 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    条目内容数组中内容部分的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。可通过使用以下配置会话启用 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于此转录片段可能被选中的 token 的对数概率。这有助于判断在给定的转录片段中是否可能存在多个有效选项。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  在已配置输入音频转写且用户消息的转写
  请求失败时返回。这些事件与其他事件分开，以便客户端可以识别相关的 Item。
  `error` 事件，以便客户端可以识别相关的 Item。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `error: object { code, message, param, type }`

    转写错误的详细信息。

    - `code: optional string`

      错误代码（如果有）。

    - `message: optional string`

      人类可读的错误消息。

    - `param: optional string`

      与错误相关的参数（如果有）。

    - `type: optional string`

      错误的类型。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    用户消息 Item 的 ID。

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

    在该 item 中输入音频内容部分的索引。

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

    该片段的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### 会话项检索事件

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你想要检索服务端在会话历史中针对某个特定 item 的表示时，发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
  服务端将返回一个 `conversation.item.retrieved` 事件作出响应，
  除非该条目不存在于会话历史记录中，在这种情况下，
  服务器将返回错误。

  - `item_id: string`

    要检索的 item 的 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件以截断之前助手消息的音频。服务端
  会以快于实时的速度生成音频，因此当用户
  中断以截断已发送到客户端但尚未播放
  的音频时，此事件非常有用。这将使服务端对音频的理解与
  客户端的播放保持同步。

  截断音频将删除 服务端 文本转录内容，以确保上下文中
  不存在用户尚未听到的文本。

  如果成功，服务端将响应一个 `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    音频截断的截止时长（包含该值），单位为毫秒。如果
    audio_end_ms 大于实际音频时长，服务端
    将返回错误。

  - `content_index: number`

    要截断的内容部分索引。将其设置为 `0`.

  - `item_id: string`

    要截断的助手消息项的 ID。只有助手消息
    项可以被截断。

  - `type: "conversation.item.truncate"`

    事件类型，必须为 `conversation.item.truncate`.

    - `"conversation.item.truncate"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### 对话项截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当更早的助手音频消息项被客户端通过以下方式截断时返回：
  通过 `conversation.item.truncate` 事件。此事件用于
  使服务端对音频的理解与客户端的播放保持同步。

  此操作将截断音频并移除 服务端 文本转录内容
  以确保上下文中不存在用户尚未听到的文本。

  - `audio_end_ms: number`

    音频截断的时长，以毫秒为单位。

  - `content_index: number`

    被截断的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被截断的助手消息项的 ID。

  - `type: "conversation.item.truncated"`

    事件类型，必须为 `conversation.item.truncated`.

    - `"conversation.item.truncated"`

### 带有引用的会话项

- `ConversationItemWithReference object { id, arguments, call_id, 7 more }`

  要添加到对话中的条目。

  - `id: optional string`

    对于类型为 ( 的条目（`message` | `function_call` | `function_call_output`)
    此字段允许客户端分配该条目的唯一 ID。它
    不是必需的，因为如果未提供，服务器会生成一个。

    对于类型为 `item_reference`，的条目，此字段是必需的，并且是对话中先前存在
    的任意条目的引用。

  - `arguments: optional string`

    函数调用的参数（针对 `function_call` 条目）。

  - `call_id: optional string`

    函数调用的 ID（针对 `function_call` 和
    `function_call_output` 条目）。如果传入到 `function_call_output`
    条目，服务器会检查对话历史中是否存在具有相同 `function_call` ID 的条目。
    ID 的条目。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 条目。

    - 角色为 `system` 的消息条目仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` content。

    - `id: optional string`

      引用的先前对话项的 ID（适用于 `item_reference`
      中的 content 类型 `response.create` 事件）。这些项可以同时引用
      客户端和服务端创建的项。

    - `audio: optional string`

      Base64 编码的音频字节，用于 `input_audio` content 类型。

    - `text: optional string`

      文本内容，用于 `input_text` 和 `text` content 类型。

    - `transcript: optional string`

      音频的转录文本，用于 `input_audio` content 类型。

    - `type: optional "input_audio" or "input_text" or "item_reference" or "text"`

      内容类型（`input_text`, `input_audio`, `item_reference`, `text`).

      - `"input_audio"`

      - `"input_text"`

      - `"item_reference"`

      - `"text"`

  - `name: optional string`

    正在调用的函数名称（适用于 `function_call` 条目）。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符——始终为 `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    函数调用的输出（适用于 `function_call_output` 条目）。

  - `role: optional "user" or "assistant" or "system"`

    消息发送者的角色（`user`, `assistant`, `system`），仅
    适用于 `message` 条目。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    项的状态（`completed`, `incomplete`, `in_progress`）。这些状态对对话
    没有影响，但为了与
    `conversation.item.created` 事件时。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

  - `type: optional "message" or "function_call" or "function_call_output"`

    该项的类型（`message`, `function_call`, `function_call_output`, `item_reference`).

    - `"message"`

    - `"function_call"`

    - `"function_call_output"`

### 输入音频缓冲区追加事件

- `InputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到输入音频缓冲区。该音频
  缓冲区是你可以写入的临时存储，之后可以提交。"提交"将根据缓冲区内容在
  对话历史中创建一条新的用户消息条目，并清空缓冲区。
  如果启用了输入音频转录，将在缓冲区提交时生成转录文本。

  如果启用了 VAD，音频缓冲区会用于检测语音，并由服务端决定
  何时提交。当禁用服务端 VAD 时，你必须手动提交音频缓冲区。
  输入音频降噪作用于对音频缓冲区的写入操作。

  客户端可以选择每个事件中放入多少音频，最大不超过
  15 MiB；例如从客户端流式传输较小的音频块可能有助于 VAD
  更快地响应。与大多数其他客户端事件不同，服务端
  不会针对此事件发送确认响应。

  - `audio: string`

    Base64 编码的音频字节。必须采用会话配置中指定的
    `input_audio_format` 字段所对应的格式。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### Input Audio Buffer Clear Event

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务端将
  作出相应响应 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### 输入音频缓冲区已清除事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  Returned when the input audio buffer is cleared by the client with a
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### Input Audio Buffer Commit 事件

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会从模型创建响应。服务端将返回一个 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### Input Audio Buffer Committed Event

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  在输入音频缓冲区被提交时返回，无论是客户端提交，还是
  在服务端 VAD 模式下自动提交。该 `item_id` 属性为将创建的用户
  消息项的 ID，因此也会向客户端发送一个 `conversation.item.created` event
  事件。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项插入位置前一项的 ID。
    如果该项 `null` 没有前一项，则可以为 null。

### Input Audio Buffer Dtmf Event Received Event

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一种表示
  电话键盘按键（0–9、*、#、A–D）的消息。 `event` 属性
  是用户按下的按键。 `received_at` 是服务器收到事件的
  UTC Unix 时间戳。

  - `event: string`

    用户按下的电话键盘按键。

  - `received_at: number`

    服务器收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### Input Audio Buffer Speech Started 事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  由服务器在处于 `server_vad` 模式时发送，用于指示已在音频缓冲区中检测到语音。只要音频被添加到
  缓冲区（除非已经检测到语音），就可能发生这种情况。客户端可能希望使用此
  事件来中断音频播放或向用户提供视觉反馈。
  客户端应该预期在语音停止时收到一个。

  客户端应该预期在语音停止时收到一个 `input_audio_buffer.speech_stopped` event
  当语音停止时的事件。 `item_id` 属性是用户消息项的 ID，
  该消息项将在语音停止时创建，并也会包含在
  `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
  音频缓冲区）。

  - `audio_start_ms: number`

    从会话期间写入缓冲区的所有音频开始到首次检测到语音时的毫秒数。这将对应于
    发送给模型的音频开头，因此包括
    发送给模型的音频开头，因此包括在会话中
    `prefix_padding_ms` 配置的。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    语音停止时将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  在以下情况下返回 `server_vad` 模式：当服务端在音频缓冲区中检测到语音结束时，服务端还会发送一个
  包含由音频缓冲区生成的用户消息项的事件。 `conversation.item.created`
  包含由音频缓冲区生成的用户消息项的事件。

  - `audio_end_ms: number`

    自会话开始到语音停止时的毫秒数。该值将
    对应于发送给模型的音频末尾，因此包含了
    `min_silence_duration_ms` 配置的。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  当输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话的设置中配置，表示
  在 `idle_timeout_ms` 会话的 `turn_detection` 设置中配置，表示在配置的时长内没有检测到任何语音。
  在配置的时长内没有检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段表示最后一次模型响应之后到触发时刻之间的音频片段，以写入输入音频缓冲区的
  音频起始位置的偏移量表示。这意味着它标定了处于静音状态的音频片段，且起始值与结束值之差
  写入输入音频缓冲区的音频起始偏移量。它标定了处于静音状态的音频片段，起始值与结束值之差大
  与结束值之差大致与所配置的超时时长一致。

  这段静音音频会作为一个 `input_audio` item 提交到对话中（会同时触发
  `input_audio_buffer.committed` 事件），并生成一次模型响应。由于可能存在未被 VAD 触发但仍被模型检测到的语音，因此模型可能会
  有未被 VAD 触发但仍被模型检测到的语音，因此模型可能会回复与对话相关的内容，或给出提示以
  回复与对话相关的内容，或给出提示以继续说话。

  - `audio_end_ms: number`

    触发超时时刻已写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    在最后一次模型响应的播放时间之后，已写入输入音频缓冲区的音频的毫秒偏移量。

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

  在某个 item 上列出 MCP 工具完成时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具 item 的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp List Tools Failed

- `McpListToolsFailed object { event_id, item_id, type }`

  在列出某个项目的 MCP 工具失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具 item 的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp 工具列表进行中

- `McpListToolsInProgress object { event_id, item_id, type }`

  在列出某一项的 MCP 工具过程中返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具 item 的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 降噪类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### 输出音频缓冲区清除事件

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP：** Emit 用于切断当前的音频响应。这将触发服务端
  停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
  事件之前应有一个 `response.cancel` 客户端事件，用于停止
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
  当创建一个 Response 时，部分 token 会被为输出而“预留”
  ，此处显示的速率限制反映了该预留情况，并在
  Response 完成后进行相应调整。

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
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
      对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
        可提高准确率和降低延迟。

      - `languages: optional array of string`

        输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频的可选文本
        片段。
        对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
        提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
          出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
          提示用户继续对话，基于当前上下文
          。

          超时值将在上一次模型响应的音频播放完毕后应用，
          即设置为响应 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          与 Response 关联）在达到超时时将被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）正在向默认
          对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。使用较短的值时，模型会响应得更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更大的音频音量才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在默认输出有内容时自动打断任何正在进行的响应，
          对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，是原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

      该参数是对生成后音频的后处理调整，
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于响应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
      一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
      一旦模型至少响应过一次音频。
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

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
    对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转录文本之前等待的时间。
      较高的值可以提高转录准确率，但会增加延迟。
      仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
      可提高准确率和降低延迟。

    - `languages: optional array of string`

      输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续上一段音频的可选文本
      片段。
      对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
      提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
        出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
        提示用户继续对话，基于当前上下文
        。

        超时值将在上一次模型响应的音频播放完毕后应用，
        即设置为响应 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        与 Response 关联）在达到超时时将被发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）正在向默认
        对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
        500ms。使用较短的值时，模型会响应得更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更大的音频音量才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在默认输出有内容时自动打断任何正在进行的响应，
        对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

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

    模型语音响应的速度，是原始速度的倍数。
    1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

    该参数是对生成后音频的后处理调整，
    也可以通过提示让模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于响应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
    一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
    一旦模型至少响应过一次音频。
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

  轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
      出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
      提示用户继续对话，基于当前上下文
      。

      超时值将在上一次模型响应的音频播放完毕后应用，
      即设置为响应 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
      与 Response 关联）在达到超时时将被发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）正在向默认
      对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
      500ms。使用较短的值时，模型会响应得更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值需要更大的音频音量才能激活模型，因此
      在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      是否在默认输出有内容时自动打断任何正在进行的响应，
      对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

### 实时客户端事件

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向会话的上下文中添加一个新 Item，包括消息、函数
    调用和函数调用响应。该事件既可用于填充会话的
    "历史记录"，也可在流式过程中添加新 Item，但当前存在
    无法填充助手音频消息的限制。

    如果成功，服务端将发出一个 `conversation.item.added` 事件，并且，
    在该 Item 完成时，发出一个 `conversation.item.done` event。否则，将发送一个
    `error` event。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容的类型。始终为 `input_text` （针对系统消息）。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息 item。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一条函数调用 item。

        - `arguments: string`

          函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一条函数调用输出 item。

        - `call_id: string`

          该输出所对应函数调用的 ID。

        - `output: string`

          函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 批准请求的一条 Realtime item。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        用于列出 MCP 服务器上可用工具的 Realtime item。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数 JSON 字符串。

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

          工具调用的错误（如果有）。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

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

      可选的、由客户端生成的 ID，用于标识此 event。

    - `previous_item_id: optional string`

      前置 item 的 ID，新 item 将插入到该项之后。如果未设置，新 item 将追加到对话末尾。

      如果设置为 `root`，新 item 将添加到对话开头。

      如果设置为某个已存在的 ID，则可在对话中间插入一个 item。如果找不到该 ID，将返回错误，且不会添加该 item。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你想从会话中移除任何条目时，发送此事件
    历史记录。服务器将以 `conversation.item.deleted` 事件作出响应，
    除非该条目不存在于会话历史记录中，在这种情况下，
    服务器将返回错误。

    - `item_id: string`

      要删除的条目 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你想要检索服务端在会话历史中针对某个特定 item 的表示时，发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
    服务端将返回一个 `conversation.item.retrieved` 事件作出响应，
    除非该条目不存在于会话历史记录中，在这种情况下，
    服务器将返回错误。

    - `item_id: string`

      要检索的 item 的 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件以截断之前助手消息的音频。服务端
    会以快于实时的速度生成音频，因此当用户
    中断以截断已发送到客户端但尚未播放
    的音频时，此事件非常有用。这将使服务端对音频的理解与
    客户端的播放保持同步。

    截断音频将删除 服务端 文本转录内容，以确保上下文中
    不存在用户尚未听到的文本。

    如果成功，服务端将响应一个 `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      音频截断的截止时长（包含该值），单位为毫秒。如果
      audio_end_ms 大于实际音频时长，服务端
      将返回错误。

    - `content_index: number`

      要截断的内容部分索引。将其设置为 `0`.

    - `item_id: string`

      要截断的助手消息项的 ID。只有助手消息
      项可以被截断。

    - `type: "conversation.item.truncate"`

      事件类型，必须为 `conversation.item.truncate`.

      - `"conversation.item.truncate"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到输入音频缓冲区。该音频
    缓冲区是你可以写入的临时存储，之后可以提交。"提交"将根据缓冲区内容在
    对话历史中创建一条新的用户消息条目，并清空缓冲区。
    如果启用了输入音频转录，将在缓冲区提交时生成转录文本。

    如果启用了 VAD，音频缓冲区会用于检测语音，并由服务端决定
    何时提交。当禁用服务端 VAD 时，你必须手动提交音频缓冲区。
    输入音频降噪作用于对音频缓冲区的写入操作。

    客户端可以选择每个事件中放入多少音频，最大不超过
    15 MiB；例如从客户端流式传输较小的音频块可能有助于 VAD
    更快地响应。与大多数其他客户端事件不同，服务端
    不会针对此事件发送确认响应。

    - `audio: string`

      Base64 编码的音频字节。必须采用会话配置中指定的
      `input_audio_format` 字段所对应的格式。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务端将
    作出相应响应 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP：** Emit 用于切断当前的音频响应。这将触发服务端
    停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
    事件之前应有一个 `response.cancel` 客户端事件，用于停止
    当前响应的生成。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端会自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会从模型创建响应。服务端将返回一个 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消进行中的响应。服务器将响应
    一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果没有可取消的响应，服务器将返回错误。即使没有正在进行的响应，
    调用该事件也是安全的；即使没有正在进行的响应，调用后也会返回错误。
    调用 `response.cancel` 也是安全的，即使没有响应正在进行，也会返回错误，会话将
    返回错误，会话将不受影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

    - `response_id: optional string`

      要取消的特定响应 ID — 如果未提供，将取消默认会话中
      进行中的响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务器创建一个 Response，这意味着触发模型推理。在 Server VAD 模式下，服务器将自动创建
    Responses。
    自动创建。

    一个 Response 将包含至少一个 Item，可能包含两个，其中第二个将是函数调用。这些 Item 默认会追加到
    会话历史记录中。
    会话历史记录中。

    服务端将返回一个 `response.created` 事件、针对 Item 的事件以及已创建内容的
    事件，最后是一个 `response.done` 事件以指示
    Response 已完成。

    该 `response.create` 事件包含推理配置，例如
    `instructions` 和 `tools`。如果设置了这些参数，它们将仅在本次 Response 中覆盖 Session 的
    配置。

    可以在默认 Conversation 之外创建 Response，这意味着它们可
    以使用任意输入，并且可以禁止将输出写入 Conversation。
    同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行创建多个
    Response。 `metadata` 字段是区分多个同时进行的 Response 的好方法。
    多个同时进行的 Response。

    客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认
    Conversation 的 Response。可以使用 `input` 字段提供任意输入，该字段是一个接受
    原始 Item 和对现有 Item 引用的数组。

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

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

            模型用于响应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
            一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
            一旦模型至少响应过一次音频。
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

        控制将 response 添加到哪个对话。目前支持
        `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
        意味着响应的内容将被添加到默认
        会话中。将其设置为 `none` 可创建一个不
        会向默认会话添加条目的响应。

        - `string`

        - `"auto" or "none"`

          控制将 response 添加到哪个对话。目前支持
          `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
          意味着响应的内容将被添加到默认
          会话中。将其设置为 `none` 可创建一个不
          会向默认会话添加条目的响应。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        在模型的提示中包含的输入条目。使用此字段
        会为该响应创建一个新的上下文，而不是使用默认的
        会话。空数组 `[]` 将清除该响应的上下文。
        注意，其中可以包含对会话中先前出现过的条目的引用
        通过它们的 id。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息 item。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一条函数调用 item。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一条函数调用输出 item。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 批准请求的一条 Realtime item。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          用于列出 MCP 服务器上可用工具的 Realtime item。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示在 MCP 服务器上调用工具的 Realtime item。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime item。

      - `instructions: optional string`

        添加到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是一些良好响应的示例”），以及音频行为（例如“说话要快”、“在声音中加入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
        注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出 token 数，
        包含工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
        给定模型的默认值。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。可用于
        以结构化形式存储有关对象的附加信息
        格式，以及通过 API 或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的取值是
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        输出设置为 mode `text` 将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以并行调用多个工具。仅支持
        reasoning Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的中替换变量值的可选映射，
          提示中。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制具备推理能力的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制由模型调用哪些工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间做出选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

          - `server_label: string`

            要使用的 MCP 服务的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在该服务上调用的工具的名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            该函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时应如何向用户说明的
            （指导（若有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
          （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
            `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新任何字段
    除外 `voice` 和 `model`. `voice` 仅在没有其他音频输出的情况下才能更新。

    当服务器收到一个 `session.update`，时，它会响应
    一个 `session.updated` 事件，显示完整且生效的配置。
    仅更新 `session.update` 中存在的字段。要清除某个字段，例如
    `instructions`，传入一个空字符串。若要清除类似 `tools`，的字段，传入一个空数组。
    若要清除类似 `turn_detection`，的字段，传入 `null`.

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。可在 realtime 会话和转录会话之间选择。
      realtime 会话和转录会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
              对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在输出转录文本之前等待的时间。
                较高的值可以提高转录准确率，但会增加延迟。
                仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。在
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
                可提高准确率和降低延迟。

              - `languages: optional array of string`

                输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                用于引导模型风格或延续上一段音频的可选文本
                片段。
                对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
                提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                  出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                  提示用户继续对话，基于当前上下文
                  。

                  超时值将在上一次模型响应的音频播放完毕后应用，
                  即设置为响应 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  与 Response 关联）在达到超时时将被发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                  对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                  500ms。使用较短的值时，模型会响应得更快，
                  但可能会在用户短暂停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更大的音频音量才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在默认输出有内容时自动打断任何正在进行的响应，
                  对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音响应的速度，是原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

              该参数是对生成后音频的后处理调整，
              也可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型用于响应的声音。支持的内置声音有
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
              一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
              一旦模型至少响应过一次音频。
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

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

          注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

        - `max_output_tokens: optional number or "inf"`

          单个助手响应的最大输出 token 数，
          包含工具调用。请提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
          给定模型的默认值。默认为 `inf`.

          - `number`

          - `"inf"`

            - `"inf"`

        - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          用于此会话的 Realtime 模型。

          - `string`

          - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

            用于此会话的 Realtime 模型。

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
          模型将以音频加上转录文本来响应。 `["text"]` 可用于让
          模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可以并行调用多个工具。仅支持
          reasoning Realtime 模型，例如 `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `reasoning: optional RealtimeReasoning`

          面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
          函数/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制由模型调用哪些工具（若有）。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息与调用一个或
            多个工具之间做出选择。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项可以强制模型调用某个特定的函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

        - `tools: optional RealtimeToolsConfig`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
            （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
              服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
              `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
              通过安全 MCP 隧道进行连接。

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤器对象
                需要审批的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，则会匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，则会匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的审批策略。可选值为 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其中之一。

            - `tunnel_id: optional string`

              用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
          追踪 在某个会话中启用，则无法再修改该配置。

          `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
          工作流 名称、group id 和元数据。

          - `Auto = "auto"`

            启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            对追踪 的细粒度配置。

            - `group_id: optional string`

              附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪 的任意元数据，用于启用
              在追踪面板中筛选。

            - `workflow_name: optional string`

              要附加到此追踪的工作流的名称。这用于
              在追踪面板中为追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

          客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

          截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

          截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

          - `"auto" or "disabled"`

            用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

            - `retention_ratio: number`

              指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

              - `post_instructions: optional number`

                指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转写会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。对于 Realtime API，该值始终为 `transcription` 用于转写会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
              对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                  出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                  提示用户继续对话，基于当前上下文
                  。

                  超时值将在上一次模型响应的音频播放完毕后应用，
                  即设置为响应 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  与 Response 关联）在达到超时时将被发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                  对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                  500ms。使用较短的值时，模型会响应得更快，
                  但可能会在用户短暂停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更大的音频音量才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在默认输出有内容时自动打断任何正在进行的响应，
                  对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      客户端生成的可选 ID，用于标识此事件。这是由客户端自行指定的任意字符串。如果该事件发生错误，它会随响应一并返回，但对应的 `session.updated` 事件中不会包含它。

### Realtime 对话项目助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  Realtime 对话中的一条助手消息 item。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

    - `text: optional string`

      文本内容。

    - `transcript: optional string`

      音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

    - `type: optional "output_text" or "output_audio"`

      内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

      - `"output_text"`

      - `"output_audio"`

  - `role: "assistant"`

    消息发送者的角色。始终为 `assistant`.

    - `"assistant"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项目函数调用

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  Realtime 对话中的一条函数调用 item。

  - `arguments: string`

    函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    被调用函数的名称。

  - `type: "function_call"`

    条目的类型。始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项目函数调用输出

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  Realtime 对话中的一条函数调用输出 item。

  - `call_id: string`

    该输出所对应函数调用的 ID。

  - `output: string`

    函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

  - `type: "function_call_output"`

    条目的类型。始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项目系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容的类型。始终为 `input_text` （针对系统消息）。

      - `"input_text"`

  - `role: "system"`

    消息发送者的角色。始终为 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项目用户消息

- `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

  Realtime 对话中的用户消息条目。

  - `content: array of object { audio, detail, image_url, 3 more }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

    - `detail: optional "auto" or "low" or "high"`

      图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

    - `text: optional string`

      文本内容（针对 `input_text`).

    - `transcript: optional string`

      音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

    条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

    导致该错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如果有）。

### Realtime 错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  在发生错误时返回，错误可能源于客户端或服务端
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

      导致该错误的客户端事件的 event_id（如果适用）。

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

    该函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时应如何向用户说明的
    （指导（若有）。

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

    批准请求的唯一 ID。

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

  响应 MCP 批准请求的一条 Realtime item。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    正在回复的审批请求的 ID。

  - `approve: boolean`

    请求是否已批准。

  - `type: "mcp_approval_response"`

    条目的类型。始终为 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    可选的决策原因。

### Realtime Mcp List Tools

- `RealtimeMcpListTools object { server_label, tools, type, id }`

  用于列出 MCP 服务器上可用工具的 Realtime item。

  - `server_label: string`

    MCP 服务器的标签。

  - `tools: array of object { input_schema, name, annotations, description }`

    服务器上可用的工具。

    - `input_schema: unknown`

      描述该工具输入的 JSON schema。

    - `name: string`

      工具的名称。

    - `annotations: optional unknown or null`

      关于该工具的附加注释。

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

  表示在 MCP 服务器上调用工具的 Realtime item。

  - `id: string`

    工具调用的唯一 ID。

  - `arguments: string`

    传递给工具的参数 JSON 字符串。

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

    工具调用的错误（如果有）。

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

  面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制具备推理能力的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

### Realtime Reasoning Effort

- `RealtimeReasoningEffort = "minimal" or "low" or "medium" or 2 more`

  限制具备推理能力的 Realtime 模型（例如
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

        模型用于回复的语音。一旦模型已至少回复过一次音频，在
        会话过程中语音便无法更改。当前
        可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳音质。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型已至少回复过一次音频，在
          会话过程中语音便无法更改。当前
          可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳音质。

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

    响应被添加到的对话，由 `conversation`
    事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到
    默认对话，且 `conversation_id` 的值将是一个类似于
    `conv_1234`。如果没有可取消的响应，服务器将返回错误。即使没有正在进行的响应， `none`，的 ID，响应将不会被添加到任何对话，并且
    的值将 `conversation_id` 将为 `null`。如果响应是由 VAD
    自动触发的，那么响应将被添加到默认对话

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出 token 数，
    中，包含本次响应中使用的所有工具调用。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化形式存储有关对象的附加信息
    格式，以及通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    由响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    模型用于响应的模态集合，目前唯一可能的取值是
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
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

    有关状态的更多详细信息。

    - `error: optional object { code, type }`

      导致响应失败的错误描述，
      在 `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误的类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      Response 未完成的原因。对于 `cancelled` Response，取以下之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取以下之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器被触发并截断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      字段（ `status` ）。`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    响应的用量统计，将用于计费。
    Realtime API 会话将维护对话上下文，并将新的
    Items 追加到该会话中，因此先前轮次的输出（文本和
    音频 tokens）将作为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      响应用于输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次并作为当前响应上下文包含的 tokens。此处的 Cached tokens 被计为 Input tokens 的一个子集，意味着 Input tokens 包含 Cached tokens 和 Uncached tokens。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数。

      - `cached_tokens: optional number`

        用作 Response 输入的缓存 token 数。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        用作 Response 输入的缓存 token 详细信息。

        - `audio_tokens: optional number`

          用作 Response 输入的缓存音频 token 数。

        - `image_tokens: optional number`

          用作 Response 输入的缓存图像 token 数。

        - `text_tokens: optional number`

          用作 Response 输入的缓存文本 token 数。

      - `image_tokens: optional number`

        用作 Response 输入的图像 token 数。

      - `text_tokens: optional number`

        用作 Response 输入的文本 token 数。

    - `input_tokens: optional number`

      Response 中使用的输入 token 数,包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      Response 中使用的输出 token 详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数,包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中的 token 总数,包括输入和输出
      文本和音频 token。

### Realtime Response Create 音频输出

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

      模型用于响应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
      一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
      一旦模型至少响应过一次音频。
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

### Realtime Response Create 参数

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

        模型用于响应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
        一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
        一旦模型至少响应过一次音频。
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

    控制将 response 添加到哪个对话。目前支持
    `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
    意味着响应的内容将被添加到默认
    会话中。将其设置为 `none` 可创建一个不
    会向默认会话添加条目的响应。

    - `string`

    - `"auto" or "none"`

      控制将 response 添加到哪个对话。目前支持
      `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
      意味着响应的内容将被添加到默认
      会话中。将其设置为 `none` 可创建一个不
      会向默认会话添加条目的响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    在模型的提示中包含的输入条目。使用此字段
    会为该响应创建一个新的上下文，而不是使用默认的
    会话。空数组 `[]` 将清除该响应的上下文。
    注意，其中可以包含对会话中先前出现过的条目的引用
    通过它们的 id。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    添加到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是一些良好响应的示例”），以及音频行为（例如“说话要快”、“在声音中加入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
    注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出 token 数，
    包含工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
    给定模型的默认值。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化形式存储有关对象的附加信息
    格式，以及通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的取值是
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    输出设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅支持
    reasoning Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的中替换变量值的可选映射，
      提示中。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制具备推理能力的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制由模型调用哪些工具（若有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间做出选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可以强制模型调用某个特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

      - `server_label: string`

        要使用的 MCP 服务的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在该服务上调用的工具的名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        该函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时应如何向用户说明的
        （指导（若有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
      （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
        服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
        `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的值为：

        - Dropbox: `connector_dropbox`
        - Gmail: `connector_gmail`
        - Google Calendar: `connector_googlecalendar`
        - Google Drive: `connector_googledrive`
        - Microsoft Teams: `connector_microsoftteams`
        - Outlook Calendar: `connector_outlookcalendar`
        - Outlook Email: `connector_outlookemail`
        - SharePoint: `connector_sharepoint`

        - `"connector_dropbox"`

        - `"connector_gmail"`

        - `"connector_googlecalendar"`

        - `"connector_googledrive"`

        - `"connector_microsoftteams"`

        - `"connector_outlookcalendar"`

        - `"connector_outlookemail"`

        - `"connector_sharepoint"`

      - `defer_loading: optional boolean`

        此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤器对象
          需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一的审批策略。可选值为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

### Realtime Response 状态

- `RealtimeResponseStatus object { error, reason, type }`

  有关状态的更多详细信息。

  - `error: optional object { code, type }`

    导致响应失败的错误描述，
    在 `status` 为 `failed`.

    - `code: optional string`

      错误代码（如果有）。

    - `type: optional string`

      错误的类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    Response 未完成的原因。对于 `cancelled` Response，取以下之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取以下之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器被触发并截断了响应）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致响应失败的错误类型，对应
    字段（ `status` ）。`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime Response 使用情况

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  响应的用量统计，将用于计费。
  Realtime API 会话将维护对话上下文，并将新的
  Items 追加到该会话中，因此先前轮次的输出（文本和
  音频 tokens）将作为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    响应用于输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次并作为当前响应上下文包含的 tokens。此处的 Cached tokens 被计为 Input tokens 的一个子集，意味着 Input tokens 包含 Cached tokens 和 Uncached tokens。

    - `audio_tokens: optional number`

      用作 Response 输入的音频 token 数。

    - `cached_tokens: optional number`

      用作 Response 输入的缓存 token 数。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      用作 Response 输入的缓存 token 详细信息。

      - `audio_tokens: optional number`

        用作 Response 输入的缓存音频 token 数。

      - `image_tokens: optional number`

        用作 Response 输入的缓存图像 token 数。

      - `text_tokens: optional number`

        用作 Response 输入的缓存文本 token 数。

    - `image_tokens: optional number`

      用作 Response 输入的图像 token 数。

    - `text_tokens: optional number`

      用作 Response 输入的文本 token 数。

  - `input_tokens: optional number`

    Response 中使用的输入 token 数,包括文本和
    音频 token。

  - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

    Response 中使用的输出 token 详细信息。

    - `audio_tokens: optional number`

      Response 中使用的音频 token 数。

    - `text_tokens: optional number`

      Response 中使用的文本 token 数。

  - `output_tokens: optional number`

    Response 中发送的输出 token 数,包括文本和
    音频 token。

  - `total_tokens: optional number`

    Response 中的 token 总数,包括输入和输出
    文本和音频 token。

### Realtime Response 使用情况输入令牌详情

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  响应用于输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次并作为当前响应上下文包含的 tokens。此处的 Cached tokens 被计为 Input tokens 的一个子集，意味着 Input tokens 包含 Cached tokens 和 Uncached tokens。

  - `audio_tokens: optional number`

    用作 Response 输入的音频 token 数。

  - `cached_tokens: optional number`

    用作 Response 输入的缓存 token 数。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    用作 Response 输入的缓存 token 详细信息。

    - `audio_tokens: optional number`

      用作 Response 输入的缓存音频 token 数。

    - `image_tokens: optional number`

      用作 Response 输入的缓存图像 token 数。

    - `text_tokens: optional number`

      用作 Response 输入的缓存文本 token 数。

  - `image_tokens: optional number`

    用作 Response 输入的图像 token 数。

  - `text_tokens: optional number`

    用作 Response 输入的文本 token 数。

### Realtime Response 使用情况输出令牌详情

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  Response 中使用的输出 token 详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数。

### Realtime 服务器事件

- `RealtimeServerEvent = ConversationCreatedEvent or ConversationItemCreatedEvent or ConversationItemDeletedEvent or 43 more`

  实时服务端事件。

  - `ConversationCreatedEvent object { conversation, event_id, type }`

    在会话创建时返回。会话创建之后立即发出。

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

    在对话条目创建时返回。存在以下几种会触发此事件的场景：

    - 服务端正在生成一个 Response，如果成功将生成
      一个或两个 Item，其类型为 `message`
      (role `assistant`)或类型 `function_call`.
    - 输入音频缓冲区已被提交，由客户端或
      服务端(在 `server_vad` 模式下)提交。服务端将获取
      输入音频缓冲区的内容，并将其添加到一个新的用户消息 Item 中。
    - 客户端已发送一个 `conversation.item.create` 事件以添加新的 Item
      到该 Conversation。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容的类型。始终为 `input_text` （针对系统消息）。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息 item。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一条函数调用 item。

        - `arguments: string`

          函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一条函数调用输出 item。

        - `call_id: string`

          该输出所对应函数调用的 ID。

        - `output: string`

          函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 批准请求的一条 Realtime item。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        用于列出 MCP 服务器上可用工具的 Realtime item。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数 JSON 字符串。

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

          工具调用的错误（如果有）。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

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

      Conversation 上下文中前一个条目的 ID，便于
      客户端了解对话顺序。可以为 `null` ，如果该
      条目没有前驱项。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当对话中的某个项目被客户端通过以下方式删除时返回：
    `conversation.item.delete` 事件。此事件用于将
    服务端对对话历史的理解与客户端的视图保持一致。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被删除项目的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    该事件是写入用户音频缓冲区的音频转录输出，
    音频转录在输入音频缓冲区由客户端或服务端
    提交时开始（启用 VAD 时）。转录与 Response 创建
    异步运行，因此该事件可能早于或晚于
    Response 事件到达。

    Realtime API 模型原生支持音频，因此输入转录是
    在单独的 ASR（自动语音识别）模型上运行的独立流程。
    转录文本可能与模型的解读存在一定差异，
    应被视为粗略参考。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在被转录的、包含音频的条目的 ID。

    - `transcript: string`

      转录得到的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      该转录的使用统计信息，计费依据 ASR 模型的定价，而非 realtime 模型的定价。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 使用量计费的模型的使用统计信息。

        - `input_tokens: number`

          本次请求计费的输入 token 数。

        - `output_tokens: number`

          生成的输出 token 数。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          usage 对象的类型。对于此变体始终为 `tokens` 。

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

          usage 对象的类型。对于此变体始终为 `duration` 。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

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

      正在被转录的、包含音频的条目的 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      条目内容数组中内容部分的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。可通过使用以下配置会话启用 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于此转录片段可能被选中的 token 的对数概率。这有助于判断在给定的转录片段中是否可能存在多个有效选项。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    在已配置输入音频转写且用户消息的转写
    请求失败时返回。这些事件与其他事件分开，以便客户端可以识别相关的 Item。
    `error` 事件，以便客户端可以识别相关的 Item。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `error: object { code, message, param, type }`

      转写错误的详细信息。

      - `code: optional string`

        错误代码（如果有）。

      - `message: optional string`

        人类可读的错误消息。

      - `param: optional string`

        与错误相关的参数（如果有）。

      - `type: optional string`

        错误的类型。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      用户消息 Item 的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    当使用以下方式检索某个对话条目时返回 `conversation.item.retrieve`。提供此事件作为获取服务端对条目表示的一种方式，例如用于在降噪和 VAD 之后访问经过后处理的音频数据。它包含该条目的完整内容，包括音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当更早的助手音频消息项被客户端通过以下方式截断时返回：
    通过 `conversation.item.truncate` 事件。此事件用于
    使服务端对音频的理解与客户端的播放保持同步。

    此操作将截断音频并移除 服务端 文本转录内容
    以确保上下文中不存在用户尚未听到的文本。

    - `audio_end_ms: number`

      音频截断的时长，以毫秒为单位。

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

    在发生错误时返回，错误可能源于客户端或服务端
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

        导致该错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如果有）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `InputAudioBufferClearedEvent object { event_id, type }`

    Returned when the input audio buffer is cleared by the client with a
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    在输入音频缓冲区被提交时返回，无论是客户端提交，还是
    在服务端 VAD 模式下自动提交。该 `item_id` 属性为将创建的用户
    消息项的 ID，因此也会向客户端发送一个 `conversation.item.created` event
    事件。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项插入位置前一项的 ID。
      如果该项 `null` 没有前一项，则可以为 null。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一种表示
    电话键盘按键（0–9、*、#、A–D）的消息。 `event` 属性
    是用户按下的按键。 `received_at` 是服务器收到事件的
    UTC Unix 时间戳。

    - `event: string`

      用户按下的电话键盘按键。

    - `received_at: number`

      服务器收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    由服务器在处于 `server_vad` 模式时发送，用于指示已在音频缓冲区中检测到语音。只要音频被添加到
    缓冲区（除非已经检测到语音），就可能发生这种情况。客户端可能希望使用此
    事件来中断音频播放或向用户提供视觉反馈。
    客户端应该预期在语音停止时收到一个。

    客户端应该预期在语音停止时收到一个 `input_audio_buffer.speech_stopped` event
    当语音停止时的事件。 `item_id` 属性是用户消息项的 ID，
    该消息项将在语音停止时创建，并也会包含在
    `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
    音频缓冲区）。

    - `audio_start_ms: number`

      从会话期间写入缓冲区的所有音频开始到首次检测到语音时的毫秒数。这将对应于
      发送给模型的音频开头，因此包括
      发送给模型的音频开头，因此包括在会话中
      `prefix_padding_ms` 配置的。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      语音停止时将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    在以下情况下返回 `server_vad` 模式：当服务端在音频缓冲区中检测到语音结束时，服务端还会发送一个
    包含由音频缓冲区生成的用户消息项的事件。 `conversation.item.created`
    包含由音频缓冲区生成的用户消息项的事件。

    - `audio_end_ms: number`

      自会话开始到语音停止时的毫秒数。该值将
      对应于发送给模型的音频末尾，因此包含了
      `min_silence_duration_ms` 配置的。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示已更新的速率限制。
    当创建一个 Response 时，部分 token 会被为输出而“预留”
    ，此处显示的速率限制反映了该预留情况，并在
    Response 完成后进行相应调整。

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

        速率限制重置前的剩余秒数。

    - `type: "rate_limits.updated"`

      事件类型，必须为 `rate_limits.updated`.

      - `"rate_limits.updated"`

  - `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

    当模型生成的音频更新时返回。

    - `content_index: number`

      条目内容数组中内容部分的索引。

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

    当模型生成的音频完成时返回。在某个 Response
    被中断、未完成或被取消时也会发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

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

    当模型生成的音频输出转写文本更新时返回。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `delta: string`

      转写文本增量。

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

    当模型生成的音频输出转写文本完成时返回
    流式输出。当某个 Response 被中断、未完成或
    被取消时也会发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

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

    当新的内容部分被添加到助手消息条目时返回，发生于
    响应生成过程中。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被添加内容部分的条目 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `part: object { audio, text, transcript, type }`

      被添加的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果 type 是 "audio"）。

      - `text: optional string`

        文本内容（如果 type 是 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果 type 是 "audio"）。

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

    在 assistant 消息条目中，当一个内容部分完成流式传输时返回。
    当 Response 被中断、未完成或被取消时也会发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该条目的 ID。

    - `output_index: number`

      响应中输出条目的索引。

    - `part: object { audio, text, transcript, type }`

      已完成的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果 type 是 "audio"）。

      - `text: optional string`

        文本内容（如果 type 是 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果 type 是 "audio"）。

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

    在创建新的 Response 时返回。Response 创建的第一个事件，
    此时 Response 处于初始状态， `in_progress`.

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

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型已至少回复过一次音频，在
              会话过程中语音便无法更改。当前
              可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳音质。

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

        响应被添加到的对话，由 `conversation`
        事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到
        默认对话，且 `conversation_id` 的值将是一个类似于
        `conv_1234`。如果没有可取消的响应，服务器将返回错误。即使没有正在进行的响应， `none`，的 ID，响应将不会被添加到任何对话，并且
        的值将 `conversation_id` 将为 `null`。如果响应是由 VAD
        自动触发的，那么响应将被添加到默认对话

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出 token 数，
        中，包含本次响应中使用的所有工具调用。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。可用于
        以结构化形式存储有关对象的附加信息
        格式，以及通过 API 或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        由响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息 item。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一条函数调用 item。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一条函数调用输出 item。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 批准请求的一条 Realtime item。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          用于列出 MCP 服务器上可用工具的 Realtime item。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          表示在 MCP 服务器上调用工具的 Realtime item。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime item。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的取值是
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
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

        有关状态的更多详细信息。

        - `error: optional object { code, type }`

          导致响应失败的错误描述，
          在 `status` 为 `failed`.

          - `code: optional string`

            错误代码（如果有）。

          - `type: optional string`

            错误的类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          Response 未完成的原因。对于 `cancelled` Response，取以下之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取以下之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器被触发并截断了响应）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致响应失败的错误类型，对应
          字段（ `status` ）。`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        响应的用量统计，将用于计费。
        Realtime API 会话将维护对话上下文，并将新的
        Items 追加到该会话中，因此先前轮次的输出（文本和
        音频 tokens）将作为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          响应用于输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次并作为当前响应上下文包含的 tokens。此处的 Cached tokens 被计为 Input tokens 的一个子集，意味着 Input tokens 包含 Cached tokens 和 Uncached tokens。

          - `audio_tokens: optional number`

            用作 Response 输入的音频 token 数。

          - `cached_tokens: optional number`

            用作 Response 输入的缓存 token 数。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            用作 Response 输入的缓存 token 详细信息。

            - `audio_tokens: optional number`

              用作 Response 输入的缓存音频 token 数。

            - `image_tokens: optional number`

              用作 Response 输入的缓存图像 token 数。

            - `text_tokens: optional number`

              用作 Response 输入的缓存文本 token 数。

          - `image_tokens: optional number`

            用作 Response 输入的图像 token 数。

          - `text_tokens: optional number`

            用作 Response 输入的文本 token 数。

        - `input_tokens: optional number`

          Response 中使用的输入 token 数,包括文本和
          音频 token。

        - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

          Response 中使用的输出 token 详细信息。

          - `audio_tokens: optional number`

            Response 中使用的音频 token 数。

          - `text_tokens: optional number`

            Response 中使用的文本 token 数。

        - `output_tokens: optional number`

          Response 中发送的输出 token 数,包括文本和
          音频 token。

        - `total_tokens: optional number`

          Response 中的 token 总数,包括输入和输出
          文本和音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    在 Response 完成流式传输时返回。无论最终状态如何，
    始终会发出。该事件中包含的 Response 对象 `response.done` 将
    包含 Response 中的所有输出 Items，但会省略原始音频数据。

    客户端应当检查 Response 的 `status` 字段以判断是否成功
    (`completed`) 或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

    一个 response 将包含在 response 期间生成的所有输出项，但不包含
    任何音频内容。

    - `event_id: string`

      服务端事件的唯一 ID。

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

      作为 JSON 字符串的参数增量。

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

    在模型生成的函数调用参数流式传输完成时返回。
    当 Response 被中断、未完成或被取消时也会发出。

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

    在 Response 生成期间创建新 Item 时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      在 Response 中输出项的索引。

    - `response_id: string`

      该项所属 Response 的 ID。

    - `type: "response.output_item.added"`

      事件类型，必须为 `response.output_item.added`.

      - `"response.output_item.added"`

  - `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

    在 Item 流式传输完成时返回。也会在 Response 被
    中断、未完成或取消时发出。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      在 Response 中输出项的索引。

    - `response_id: string`

      该项所属 Response 的 ID。

    - `type: "response.output_item.done"`

      事件类型，必须为 `response.output_item.done`.

      - `"response.output_item.done"`

  - `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

    在 "output_text" 内容部分的文本值更新时返回。

    - `content_index: number`

      条目内容数组中内容部分的索引。

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

    在 "output_text" 内容部分的文本值流式传输完成时返回。也会
    在 Response 被中断、未完成或取消时发出。

    - `content_index: number`

      条目内容数组中内容部分的索引。

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

    在创建 Session 时返回。在新
    连接建立后，作为首个服务端事件自动发出。此事件将包含
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

          要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
              对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }`

              输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

              轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `idle_timeout_ms: optional number or null`

                  在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                  出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                  提示用户继续对话，基于当前上下文
                  。

                  超时值将在上一次模型响应的音频播放完毕后应用，
                  即设置为响应 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                  与 Response 关联）在达到超时时将被发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                  对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                  500ms。使用较短的值时，模型会响应得更快，
                  但可能会在用户短暂停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更大的音频音量才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  是否在默认输出有内容时自动打断任何正在进行的响应，
                  对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音响应的速度，是原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

              该参数是对生成后音频的后处理调整，
              也可以通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型已至少回复过一次音频，在
              会话过程中语音便无法更改。当前
              可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳音质。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复的语音。一旦模型已至少回复过一次音频，在
                会话过程中语音便无法更改。当前
                可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
                最佳音质。

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

          会话的过期时间戳，自 Unix 纪元起的秒数。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的额外字段。

          `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

          注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

        - `max_output_tokens: optional number or "inf"`

          单个助手响应的最大输出 token 数，
          包含工具调用。请提供一个介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
          给定模型的默认值。默认为 `inf`.

          - `number`

          - `"inf"`

            - `"inf"`

        - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          用于此会话的 Realtime 模型。

          - `string`

          - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

            用于此会话的 Realtime 模型。

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
          模型将以音频加上转录文本来响应。 `["text"]` 可用于让
          模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            用于在你的中替换变量值的可选映射，
            提示中。替换值可以是字符串，也可以是其他
            Response 输入类型，例如图像或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

              - `text: string`

                发送给模型的文本输入。

              - `type: "input_text"`

                输入项的类型，始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

              - `detail: ImageDetail`

                发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                输入项的类型，始终为 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                发送给模型的文件的 ID。

              - `image_url: optional string or null`

                发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型，始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                发送给模型的文件内容。

              - `file_id: optional string or null`

                发送给模型的文件的 ID。

              - `file_url: optional string`

                发送给模型的文件的 URL。

              - `filename: optional string`

                发送给模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

          - `version: optional string or null`

            提示模板的可选版本。

        - `reasoning: optional RealtimeReasoning`

          面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

          - `effort: optional RealtimeReasoningEffort`

            限制具备推理能力的 Realtime 模型（例如
            `gpt-realtime-2`.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

        - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

          模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
          函数/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制由模型调用哪些工具（若有）。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息与调用一个或
            多个工具之间做出选择。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项可以强制模型调用某个特定的函数。

            - `name: string`

              要调用的函数名称。

            - `type: "function"`

              对于函数调用，类型始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

            - `server_label: string`

              要使用的 MCP 服务的标签。

            - `type: "mcp"`

              对于 MCP 工具，类型始终为 `mcp`.

              - `"mcp"`

            - `name: optional string or null`

              要在该服务上调用的工具的名称。

        - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

            - `description: optional string`

              该函数的描述，包括关于何时以及如何
              调用它的指导，以及关于调用时应如何向用户说明的
              （指导（若有）。

            - `name: optional string`

              函数的名称。

            - `parameters: optional unknown`

              以 JSON Schema 表示的函数参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
            （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
              服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
              `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
              通过安全 MCP 隧道进行连接。

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤器对象
                需要审批的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，则会匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    进行了标注，则会匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的审批策略。可选值为 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其中之一。

            - `tunnel_id: optional string`

              用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
          追踪 在某个会话中启用，则无法再修改该配置。

          `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
          工作流 名称、group id 和元数据。

          - `Auto = "auto"`

            启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            对追踪 的细粒度配置。

            - `group_id: optional string`

              附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪 的任意元数据，用于启用
              在追踪面板中筛选。

            - `workflow_name: optional string`

              要附加到此追踪的工作流的名称。这用于
              在追踪面板中为追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

          客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

          截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

          截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

          - `"auto" or "disabled"`

            用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

            - `retention_ratio: number`

              指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

              - `post_instructions: optional number`

                指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

                降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }`

              转录模型的配置。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
              VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
              语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                检测语音停止的静默时长（以毫秒为单位）。默认
                500ms。使用较短的值时，模型会响应得更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
                高的阈值需要更大的音频音量才能激活模型，因此
                在嘈杂环境中可能表现更好。

              - `type: optional string`

                轮次检测类型，仅限 `server_vad` 当前受支持。

        - `expires_at: optional number`

          会话的过期时间戳，自 Unix 纪元起的秒数。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          要在服务端输出中包含的额外字段。

          - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话通过某个事件更新时返回，除非 `session.update` 事件，除非
    出现错误。

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

    **仅限 WebRTC/SIP：** 在服务端开始向客户端流式传输音频时发出。该事件在向响应中添加音频内容部分后发出（
    在向响应中添加音频内容部分后发出（`response.content_part.added`)
    到响应后）。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区已在服务端完全清空时发出，并且不会再有音频产生。该事件在完整的响应，
    数据已全部发送到客户端后发出（
    数据已发送给客户端后（`response.done`).
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被清空时发出。这种情况发生在 VAD
    模式下用户中断时（`input_audio_buffer.speech_started`),
    时），或者客户端已发出 `output_audio_buffer.clear` 事件以手动
    截断当前音频响应。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当有 Item 被添加到默认的 Conversation 时由服务端发送。以下几种情况都会触发该事件：

    - 当客户端发送 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。在这种情况下，该 item 将是一条用户消息，其中包含来自缓冲区的音频。
    - 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它此时还没有任何内容（且 `status` 将为 `in_progress`).

    该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），但音频数据除外，必要时可以通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      位于此项之前的 item 的 ID（如果有）。该字段用于
      在插入 item 时保持顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    在对话项被定稿时返回。

    该事件将包含该项的完整内容，但音频数据除外——如有需要，可通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      位于此项之前的 item 的 ID（如果有）。该字段用于
      在插入 item 时保持顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    当输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话的设置中配置，表示
    在 `idle_timeout_ms` 会话的 `turn_detection` 设置中配置，表示在配置的时长内没有检测到任何语音。
    在配置的时长内没有检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段表示最后一次模型响应之后到触发时刻之间的音频片段，以写入输入音频缓冲区的
    音频起始位置的偏移量表示。这意味着它标定了处于静音状态的音频片段，且起始值与结束值之差
    写入输入音频缓冲区的音频起始偏移量。它标定了处于静音状态的音频片段，起始值与结束值之差大
    与结束值之差大致与所配置的超时时长一致。

    这段静音音频会作为一个 `input_audio` item 提交到对话中（会同时触发
    `input_audio_buffer.committed` 事件），并生成一次模型响应。由于可能存在未被 VAD 触发但仍被模型检测到的语音，因此模型可能会
    有未被 VAD 触发但仍被模型检测到的语音，因此模型可能会回复与对话相关的内容，或给出提示以
    回复与对话相关的内容，或给出提示以继续说话。

    - `audio_end_ms: number`

      触发超时时刻已写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      在最后一次模型响应的播放时间之后，已写入输入音频缓冲区的音频的毫秒偏移量。

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

      在该 item 中输入音频内容部分的索引。

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

      该片段的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    在列出某一项的 MCP 工具过程中返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具 item 的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    在某个 item 上列出 MCP 工具完成时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具 item 的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    在列出某个项目的 MCP 工具失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具 item 的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    在响应生成过程中 MCP 工具调用参数被更新时返回。

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

      如果存在，则表示该增量文本经过混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成期间，MCP 工具调用参数被最终确定时返回。

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

    当 MCP 工具调用已开始且正在进行时返回。

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

    当 MCP 工具调用已成功完成时返回。

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

    当 MCP 工具调用失败时返回。

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

  beta 接口的实时会话对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，自 Unix 纪元起的秒数。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`, 输入音频必须为 16 位 PCM,采样率 24kHz,
    单声道( mono ),小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
    对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

    默认系统指令(即系统消息),会被前置添加到模型
    调用中。该字段允许客户端引导模型给出期望的
    响应。可以指示模型响应的内容和格式,
    (例如 “极度简洁”、“表现得友好”、“以下是较好的
    响应的示例”),以及音频行为(例如 “说话快一些”、“在声音中
    注入情感”、“经常大笑”)。这些指令
    不一定会被模型遵循,但它们为模型提供了期望行为
    方面的指导。

    注意,服务端会设置默认指令,如果该字段
    未设置,则会使用这些默认指令,它们可在 `session.created` 事件的会话开头处看到,该事件位于
    会话开始时。

  - `max_response_output_tokens: optional number or "inf"`

    单个助手响应的最大输出 token 数，
    包含工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
    给定模型的默认值。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `modalities: optional array of "text" or "audio"`

    模型可用来响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2025-08-28" or 13 more`

    用于此会话的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2025-08-28" or 13 more`

      用于此会话的 Realtime 模型。

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

    输出音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`, 输出音频采样率为 24kHz。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的中替换变量值的可选映射，
      提示中。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音响应的速度。1.0 为默认速度。0.25 为
    最低速度。1.5 为最高速度。此值只能在
    模型轮次之间更改，不能在响应进行中更改。

  - `temperature: optional number`

    模型的采样温度，限制在 [0.6, 1.2] 范围内。对于音频模型，强烈建议使用 0.8 的温度以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。可选项包括 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      该函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时应如何向用户说明的
      （指导（若有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    用于追踪的配置选项。设置为 null 以禁用追踪。一旦
    追踪 在某个会话中启用，则无法再修改该配置。

    `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
    工作流 名称、group id 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        在追踪仪表板中的分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意元数据，用于启用
        在追踪仪表板中的筛选。

      - `workflow_name: optional string`

        要附加到此追踪的工作流的名称。这用于
        在追踪仪表板中为该追踪命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
        出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
        提示用户继续对话，基于当前上下文
        。

        超时值将在上一次模型响应的音频播放完毕后应用，
        即设置为响应 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        与 Response 关联）在达到超时时将被发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）正在向默认
        对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
        500ms。使用较短的值时，模型会响应得更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更大的音频音量才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在默认输出有内容时自动打断任何正在进行的响应，
        对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复的语音。一旦模型已至少回复过一次音频，在
    会话过程中语音便无法更改。当前
    可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复的语音。一旦模型已至少回复过一次音频，在
      会话过程中语音便无法更改。当前
      可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
        降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
        对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转录文本之前等待的时间。
          较高的值可以提高转录准确率，但会增加延迟。
          仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
          可提高准确率和降低延迟。

        - `languages: optional array of string`

          输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续上一段音频的可选文本
          片段。
          对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
          提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
            出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
            提示用户继续对话，基于当前上下文
            。

            超时值将在上一次模型响应的音频播放完毕后应用，
            即设置为响应 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            与 Response 关联）在达到超时时将被发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）正在向默认
            对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。使用较短的值时，模型会响应得更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更大的音频音量才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在默认输出有内容时自动打断任何正在进行的响应，
            对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应的速度，是原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

        该参数是对生成后音频的后处理调整，
        也可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于响应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
        一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
        一旦模型至少响应过一次音频。
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

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

    注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出 token 数，
    包含工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
    给定模型的默认值。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    用于此会话的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      用于此会话的 Realtime 模型。

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
    模型将以音频加上转录文本来响应。 `["text"]` 可用于让
    模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以并行调用多个工具。仅支持
    reasoning Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的中替换变量值的可选映射，
      提示中。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制具备推理能力的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional RealtimeToolChoiceConfig`

    模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制由模型调用哪些工具（若有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间做出选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可以强制模型调用某个特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

      - `server_label: string`

        要使用的 MCP 服务的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在该服务上调用的工具的名称。

  - `tools: optional RealtimeToolsConfig`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        该函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时应如何向用户说明的
        （指导（若有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
      （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
        服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
        `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的值为：

        - Dropbox: `connector_dropbox`
        - Gmail: `connector_gmail`
        - Google Calendar: `connector_googlecalendar`
        - Google Drive: `connector_googledrive`
        - Microsoft Teams: `connector_microsoftteams`
        - Outlook Calendar: `connector_outlookcalendar`
        - Outlook Email: `connector_outlookemail`
        - SharePoint: `connector_sharepoint`

        - `"connector_dropbox"`

        - `"connector_gmail"`

        - `"connector_googlecalendar"`

        - `"connector_googledrive"`

        - `"connector_microsoftteams"`

        - `"connector_outlookcalendar"`

        - `"connector_outlookemail"`

        - `"connector_sharepoint"`

      - `defer_loading: optional boolean`

        此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤器对象
          需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一的审批策略。可选值为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
    追踪 在某个会话中启用，则无法再修改该配置。

    `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
    工作流 名称、group id 和元数据。

    - `Auto = "auto"`

      启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意元数据，用于启用
        在追踪面板中筛选。

      - `workflow_name: optional string`

        要附加到此追踪的工作流的名称。这用于
        在追踪面板中为追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

    客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

    截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

    截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

    - `"auto" or "disabled"`

      用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

      - `retention_ratio: number`

        指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

        - `post_instructions: optional number`

          指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制由模型调用哪些工具（若有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或
    多个工具之间做出选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可以强制模型调用某个特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

    - `server_label: string`

      要使用的 MCP 服务的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在该服务上调用的工具的名称。

### Realtime Tools Config

- `RealtimeToolsConfig = array of RealtimeToolsConfigUnion`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      该函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时应如何向用户说明的
      （指导（若有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
    （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          进行了标注，则会匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
      服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
      `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持 `connector_id` 的值为：

      - Dropbox: `connector_dropbox`
      - Gmail: `connector_gmail`
      - Google Calendar: `connector_googlecalendar`
      - Google Drive: `connector_googledrive`
      - Microsoft Teams: `connector_microsoftteams`
      - Outlook Calendar: `connector_outlookcalendar`
      - Outlook Email: `connector_outlookemail`
      - SharePoint: `connector_sharepoint`

      - `"connector_dropbox"`

      - `"connector_gmail"`

      - `"connector_googlecalendar"`

      - `"connector_googledrive"`

      - `"connector_microsoftteams"`

      - `"connector_outlookcalendar"`

      - `"connector_outlookemail"`

      - `"connector_sharepoint"`

    - `defer_loading: optional boolean`

      此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一的审批策略。可选值为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中之一。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
  （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      该函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时应如何向用户说明的
      （指导（若有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
    （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          进行了标注，则会匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
      服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
      `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持 `connector_id` 的值为：

      - Dropbox: `connector_dropbox`
      - Gmail: `connector_gmail`
      - Google Calendar: `connector_googlecalendar`
      - Google Drive: `connector_googledrive`
      - Microsoft Teams: `connector_microsoftteams`
      - Outlook Calendar: `connector_outlookcalendar`
      - Outlook Email: `connector_outlookemail`
      - SharePoint: `connector_sharepoint`

      - `"connector_dropbox"`

      - `"connector_gmail"`

      - `"connector_googlecalendar"`

      - `"connector_googledrive"`

      - `"connector_microsoftteams"`

      - `"connector_outlookcalendar"`

      - `"connector_outlookemail"`

      - `"connector_sharepoint"`

    - `defer_loading: optional boolean`

      此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一的审批策略。可选值为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中之一。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

### Realtime Tracing Config

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
  追踪 在某个会话中启用，则无法再修改该配置。

  `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
  工作流 名称、group id 和元数据。

  - `Auto = "auto"`

    启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意元数据，用于启用
      在追踪面板中筛选。

    - `workflow_name: optional string`

      要附加到此追踪的工作流的名称。这用于
      在追踪面板中为追踪命名。

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
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
      对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
        可提高准确率和降低延迟。

      - `languages: optional array of string`

        输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频的可选文本
        片段。
        对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
        提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
          出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
          提示用户继续对话，基于当前上下文
          。

          超时值将在上一次模型响应的音频播放完毕后应用，
          即设置为响应 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          与 Response 关联）在达到超时时将被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）正在向默认
          对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。使用较短的值时，模型会响应得更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更大的音频音量才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在默认输出有内容时自动打断任何正在进行的响应，
          对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

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
    降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
    对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转录文本之前等待的时间。
      较高的值可以提高转录准确率，但会增加延迟。
      仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
      可提高准确率和降低延迟。

    - `languages: optional array of string`

      输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续上一段音频的可选文本
      片段。
      对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
      提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `idle_timeout_ms: optional number or null`

        在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
        出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
        提示用户继续对话，基于当前上下文
        。

        超时值将在上一次模型响应的音频播放完毕后应用，
        即设置为响应 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
        与 Response 关联）在达到超时时将被发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）正在向默认
        对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
        500ms。使用较短的值时，模型会响应得更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更大的音频音量才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        是否在默认输出有内容时自动打断任何正在进行的响应，
        对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `idle_timeout_ms: optional number or null`

      在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
      出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
      提示用户继续对话，基于当前上下文
      。

      超时值将在上一次模型响应的音频播放完毕后应用，
      即设置为响应 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
      与 Response 关联）在达到超时时将被发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）正在向默认
      对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
      500ms。使用较短的值时，模型会响应得更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值需要更大的音频音量才能激活模型，因此
      在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来判断用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      是否在默认输出有内容时自动打断任何正在进行的响应，
      对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

### Realtime Transcription Session Create Request

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转写会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。对于 Realtime API，该值始终为 `transcription` 用于转写会话。

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
        降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
        对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转录文本之前等待的时间。
          较高的值可以提高转录准确率，但会增加延迟。
          仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
          可提高准确率和降低延迟。

        - `languages: optional array of string`

          输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续上一段音频的可选文本
          片段。
          对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
          提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
            出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
            提示用户继续对话，基于当前上下文
            。

            超时值将在上一次模型响应的音频播放完毕后应用，
            即设置为响应 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            与 Response 关联）在达到超时时将被发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）正在向默认
            对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。使用较短的值时，模型会响应得更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更大的音频音量才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在默认输出有内容时自动打断任何正在进行的响应，
            对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  一个 Realtime 翻译客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。翻译
    会话支持对以下字段的更新： `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置
      ，无法通过 `session.update`.

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

            可选的源语言转录。配置后，服务器会发出
            `session.input_transcript.delta` 事件。翻译本身仍然从
            输入音频流运行。

            - `model: string`

              用于源转录增量的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端原始音频字节。不受支持的 websocket 音频格式会返回
    验证错误，因为低质量音频会显著降低翻译
    质量。

    翻译以 200 ms 引擎帧为粒度进行消费。为获得最佳实时效果，请追加
    audio in 200 ms chunks. If a chunk is shorter, the server buffers it until it
    has enough audio for one frame. If a chunk is longer, the server splits it into
    200 ms frames and enqueues them back-to-back.

    Keep appending silence while the session is active. If a client stops sending
    audio and later resumes, model time treats the resumed audio as contiguous with
    the previous audio rather than as a real-world pause.

    - `audio: string`

      Base64-encoded 24 kHz PCM16 mono audio bytes.

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    Gracefully close the realtime translation session. The server flushes pending
    input audio and emits any remaining translated output before closing the
    session.

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此 event。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话会持续流式传入源语言
    音频，并持续流式输出翻译后的音频以及转录文本增量。

    - `model: string`

      此会话所使用的 Realtime 翻译模型。

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

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥的过期配置。过期时间指的是在此之后，
    客户端密钥将不再可用于创建会话的时间点。会话本身在该时间之后
    一旦启动即可继续进行。一个密钥在过期之前可用于创建多个会话，
    直到过期为止。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点，表示该值 `seconds` 将被加到客户端密钥 `created_at` 的创建时间上以生成过期时间戳。仅接受 `created_at` 当前受支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点到过期时间之间的秒数。请选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，则默认为 600 秒（10 分钟）。

### Realtime Translation Client Secret Create Response

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  通过创建翻译会话和客户端密钥返回 Realtime API 的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续将输入
    音频翻译为配置的目标语言。

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

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 Unix 纪元起的秒数。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation Input Audio Buffer Append Event

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端原始音频字节。不受支持的 websocket 音频格式会返回
  验证错误，因为低质量音频会显著降低翻译
  质量。

  翻译以 200 ms 引擎帧为粒度进行消费。为获得最佳实时效果，请追加
  audio in 200 ms chunks. If a chunk is shorter, the server buffers it until it
  has enough audio for one frame. If a chunk is longer, the server splits it into
  200 ms frames and enqueues them back-to-back.

  Keep appending silence while the session is active. If a client stops sending
  audio and later resumes, model time treats the resumed audio as contiguous with
  the previous audio rather than as a real-world pause.

  - `audio: string`

    Base64-encoded 24 kHz PCM16 mono audio bytes.

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### Realtime Translation Input Transcript Delta Event

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当可选的源语言转录文本可用时返回。此事件
  仅在配置 `audio.input.transcription` 时发出。

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

    用于流对齐的时间元数据，在可用时源自
    翻译帧。它以 200 毫秒为增量递增，但多个转录
    增量可能共享同一 `elapsed_ms`。将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  当翻译后的输出音频可用时返回。该 `delta` 包含一个
  PCM16 音频块，其长度可能不同。客户端应对完整的
  delta 进行解码并排队，而不是假定固定的字节数或采样数。

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

    用于流对齐的时间元数据，在可用时源自
    可用时使用。请将 `elapsed_ms` 视为对齐元数据，而非唯一的
    事件标识符。

  - `format: optional "pcm16"`

    音频的音频编码 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频 delta 的采样率。

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

    用于流对齐的时间元数据，在可用时源自
    翻译帧。它以 200 毫秒为增量递增，但多个转录
    增量可能共享同一 `elapsed_ms`。将其视为对齐元数据，
    而非唯一的转录增量标识符。

### Realtime 翻译服务端事件

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  Realtime 翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能源于客户端或服务端
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

        导致该错误的客户端事件的 event_id（如果适用）。

      - `param: optional string or null`

        与错误相关的参数（如果有）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "error"`

      事件类型，必须为 `error`.

      - `"error"`

  - `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

    在翻译会话创建时返回。在建立
    新连接时作为第一个服务端事件自动发出。该事件包含
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

            可选的源语言转录。配置后，服务器会发出
            `session.input_transcript.delta` 事件。翻译本身仍然从
            输入音频流运行。

            - `model: string`

              用于源转录增量的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译输出音频和转录增量的目标语言。

      - `expires_at: number`

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `model: string`

        用于此会话的 Realtime 翻译模型。此字段在
        会话创建时设置，无法通过 `session.update`.

      - `type: "translation"`

        会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    当使用 `session.update` 事件作出响应，
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

    当可选的源语言转录文本可用时返回。此事件
    仅在配置 `audio.input.transcription` 时发出。

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

      用于流对齐的时间元数据，在可用时源自
      翻译帧。它以 200 毫秒为增量递增，但多个转录
      增量可能共享同一 `elapsed_ms`。将其视为对齐元数据，
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

      用于流对齐的时间元数据，在可用时源自
      翻译帧。它以 200 毫秒为增量递增，但多个转录
      增量可能共享同一 `elapsed_ms`。将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    当翻译后的输出音频可用时返回。该 `delta` 包含一个
    PCM16 音频块，其长度可能不同。客户端应对完整的
    delta 进行解码并排队，而不是假定固定的字节数或采样数。

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

      用于流对齐的时间元数据，在可用时源自
      可用时使用。请将 `elapsed_ms` 视为对齐元数据，而非唯一的
      事件标识符。

    - `format: optional "pcm16"`

      音频的音频编码 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频 delta 的采样率。

### Realtime Translation Session

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  一个 Realtime 翻译会话。翻译会话会持续将输入
  音频翻译为配置的目标语言。

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

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

  - `expires_at: number`

    会话的过期时间戳，自 Unix 纪元起的秒数。

  - `model: string`

    用于此会话的 Realtime 翻译模型。此字段在
    会话创建时设置，无法通过 `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

    - `"translation"`

### Realtime Translation Session Close Event

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  Gracefully close the realtime translation session. The server flushes pending
  input audio and emits any remaining translated output before closing the
  session.

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

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

  Realtime 翻译会话配置。翻译会话会持续流式传入源语言
  音频，并持续流式输出翻译后的音频以及转录文本增量。

  - `model: string`

    此会话所使用的 Realtime 翻译模型。

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

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

### Realtime Translation Session Created Event

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在翻译会话创建时返回。在建立
  新连接时作为第一个服务端事件自动发出。该事件包含
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

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 Unix 纪元起的秒数。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Realtime Translation Session Update Event

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。翻译
  会话支持对以下字段的更新： `audio.output.language`, `audio.input.transcription`,
  和 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置
    ，无法通过 `session.update`.

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

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### Realtime Translation Session Update Request

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可通过以下方式更新的实时翻译会话字段 `session.update`.

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

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

### Realtime Translation Session Updated Event

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  当使用 `session.update` 事件作出响应，
  更新翻译会话时返回，除非出现错误。

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

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 Unix 纪元起的秒数。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime Truncation

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

  客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

  截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

  - `"auto" or "disabled"`

    用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

      - `post_instructions: optional number`

        指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

### Response Audio Delta Event

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频更新时返回。

  - `content_index: number`

    条目内容数组中内容部分的索引。

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

  当模型生成的音频完成时返回。在某个 Response
  被中断、未完成或被取消时也会发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

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

  当模型生成的音频输出转写文本更新时返回。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `delta: string`

    转写文本增量。

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

  当模型生成的音频输出转写文本完成时返回
  流式输出。当某个 Response 被中断、未完成或
  被取消时也会发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

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

  发送此事件以取消进行中的响应。服务器将响应
  一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果没有可取消的响应，服务器将返回错误。即使没有正在进行的响应，
  调用该事件也是安全的；即使没有正在进行的响应，调用后也会返回错误。
  调用 `response.cancel` 也是安全的，即使没有响应正在进行，也会返回错误，会话将
  返回错误，会话将不受影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

  - `response_id: optional string`

    要取消的特定响应 ID — 如果未提供，将取消默认会话中
    进行中的响应。

### Response Content Part Added Event

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  当新的内容部分被添加到助手消息条目时返回，发生于
  响应生成过程中。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被添加内容部分的条目 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `part: object { audio, text, transcript, type }`

    被添加的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果 type 是 "audio"）。

    - `text: optional string`

      文本内容（如果 type 是 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果 type 是 "audio"）。

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

  在 assistant 消息条目中，当一个内容部分完成流式传输时返回。
  当 Response 被中断、未完成或被取消时也会发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该条目的 ID。

  - `output_index: number`

    响应中输出条目的索引。

  - `part: object { audio, text, transcript, type }`

    已完成的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果 type 是 "audio"）。

    - `text: optional string`

      文本内容（如果 type 是 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果 type 是 "audio"）。

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

  此事件指示服务器创建一个 Response，这意味着触发模型推理。在 Server VAD 模式下，服务器将自动创建
  Responses。
  自动创建。

  一个 Response 将包含至少一个 Item，可能包含两个，其中第二个将是函数调用。这些 Item 默认会追加到
  会话历史记录中。
  会话历史记录中。

  服务端将返回一个 `response.created` 事件、针对 Item 的事件以及已创建内容的
  事件，最后是一个 `response.done` 事件以指示
  Response 已完成。

  该 `response.create` 事件包含推理配置，例如
  `instructions` 和 `tools`。如果设置了这些参数，它们将仅在本次 Response 中覆盖 Session 的
  配置。

  可以在默认 Conversation 之外创建 Response，这意味着它们可
  以使用任意输入，并且可以禁止将输出写入 Conversation。
  同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行创建多个
  Response。 `metadata` 字段是区分多个同时进行的 Response 的好方法。
  多个同时进行的 Response。

  客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认
  Conversation 的 Response。可以使用 `input` 字段提供任意输入，该字段是一个接受
  原始 Item 和对现有 Item 引用的数组。

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

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

          模型用于响应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
          一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
          一旦模型至少响应过一次音频。
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

      控制将 response 添加到哪个对话。目前支持
      `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
      意味着响应的内容将被添加到默认
      会话中。将其设置为 `none` 可创建一个不
      会向默认会话添加条目的响应。

      - `string`

      - `"auto" or "none"`

        控制将 response 添加到哪个对话。目前支持
        `auto` 和 `none`，以及 `auto` 作为默认值。 `auto` 值
        意味着响应的内容将被添加到默认
        会话中。将其设置为 `none` 可创建一个不
        会向默认会话添加条目的响应。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      在模型的提示中包含的输入条目。使用此字段
      会为该响应创建一个新的上下文，而不是使用默认的
      会话。空数组 `[]` 将清除该响应的上下文。
      注意，其中可以包含对会话中先前出现过的条目的引用
      通过它们的 id。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容的类型。始终为 `input_text` （针对系统消息）。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息 item。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一条函数调用 item。

        - `arguments: string`

          函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一条函数调用输出 item。

        - `call_id: string`

          该输出所对应函数调用的 ID。

        - `output: string`

          函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 批准请求的一条 Realtime item。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        用于列出 MCP 服务器上可用工具的 Realtime item。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数 JSON 字符串。

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

          工具调用的错误（如果有）。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

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

      添加到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是一些良好响应的示例”），以及音频行为（例如“说话要快”、“在声音中加入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
      注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      包含工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
      给定模型的默认值。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。可用于
      以结构化形式存储有关对象的附加信息
      格式，以及通过 API 或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的取值是
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      输出设置为 mode `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅支持
      reasoning Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的中替换变量值的可选映射，
        提示中。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制由模型调用哪些工具（若有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        多个工具之间做出选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可以强制模型调用某个特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

        - `server_label: string`

          要使用的 MCP 服务的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在该服务上调用的工具的名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          该函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时应如何向用户说明的
          （指导（若有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
        （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
          服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
          `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的值为：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook Calendar: `connector_outlookcalendar`
          - Outlook Email: `connector_outlookemail`
          - SharePoint: `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

### Response Created Event

- `ResponseCreatedEvent object { event_id, response, type }`

  在创建新的 Response 时返回。Response 创建的第一个事件，
  此时 Response 处于初始状态， `in_progress`.

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

          模型用于回复的语音。一旦模型已至少回复过一次音频，在
          会话过程中语音便无法更改。当前
          可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳音质。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

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

      响应被添加到的对话，由 `conversation`
      事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到
      默认对话，且 `conversation_id` 的值将是一个类似于
      `conv_1234`。如果没有可取消的响应，服务器将返回错误。即使没有正在进行的响应， `none`，的 ID，响应将不会被添加到任何对话，并且
      的值将 `conversation_id` 将为 `null`。如果响应是由 VAD
      自动触发的，那么响应将被添加到默认对话

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      中，包含本次响应中使用的所有工具调用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。可用于
      以结构化形式存储有关对象的附加信息
      格式，以及通过 API 或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      由响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容的类型。始终为 `input_text` （针对系统消息）。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息 item。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一条函数调用 item。

        - `arguments: string`

          函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一条函数调用输出 item。

        - `call_id: string`

          该输出所对应函数调用的 ID。

        - `output: string`

          函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 批准请求的一条 Realtime item。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        用于列出 MCP 服务器上可用工具的 Realtime item。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数 JSON 字符串。

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

          工具调用的错误（如果有）。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

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

      模型用于响应的模态集合，目前唯一可能的取值是
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
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

      有关状态的更多详细信息。

      - `error: optional object { code, type }`

        导致响应失败的错误描述，
        在 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于 `cancelled` Response，取以下之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取以下之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器被触发并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段（ `status` ）。`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的用量统计，将用于计费。
      Realtime API 会话将维护对话上下文，并将新的
      Items 追加到该会话中，因此先前轮次的输出（文本和
      音频 tokens）将作为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        响应用于输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次并作为当前响应上下文包含的 tokens。此处的 Cached tokens 被计为 Input tokens 的一个子集，意味着 Input tokens 包含 Cached tokens 和 Uncached tokens。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数。

        - `cached_tokens: optional number`

          用作 Response 输入的缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          用作 Response 输入的缓存 token 详细信息。

          - `audio_tokens: optional number`

            用作 Response 输入的缓存音频 token 数。

          - `image_tokens: optional number`

            用作 Response 输入的缓存图像 token 数。

          - `text_tokens: optional number`

            用作 Response 输入的缓存文本 token 数。

        - `image_tokens: optional number`

          用作 Response 输入的图像 token 数。

        - `text_tokens: optional number`

          用作 Response 输入的文本 token 数。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数,包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        Response 中使用的输出 token 详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数,包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的 token 总数,包括输入和输出
        文本和音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### Response Done Event

- `ResponseDoneEvent object { event_id, response, type }`

  在 Response 完成流式传输时返回。无论最终状态如何，
  始终会发出。该事件中包含的 Response 对象 `response.done` 将
  包含 Response 中的所有输出 Items，但会省略原始音频数据。

  客户端应当检查 Response 的 `status` 字段以判断是否成功
  (`completed`) 或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  一个 response 将包含在 response 期间生成的所有输出项，但不包含
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

          模型用于回复的语音。一旦模型已至少回复过一次音频，在
          会话过程中语音便无法更改。当前
          可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳音质。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

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

      响应被添加到的对话，由 `conversation`
      事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到
      默认对话，且 `conversation_id` 的值将是一个类似于
      `conv_1234`。如果没有可取消的响应，服务器将返回错误。即使没有正在进行的响应， `none`，的 ID，响应将不会被添加到任何对话，并且
      的值将 `conversation_id` 将为 `null`。如果响应是由 VAD
      自动触发的，那么响应将被添加到默认对话

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      中，包含本次响应中使用的所有工具调用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。可用于
      以结构化形式存储有关对象的附加信息
      格式，以及通过 API 或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      由响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容的类型。始终为 `input_text` （针对系统消息）。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

            Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

          - `text: optional string`

            文本内容（针对 `input_text`).

          - `transcript: optional string`

            音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的一条助手消息 item。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一条函数调用 item。

        - `arguments: string`

          函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的一条函数调用输出 item。

        - `call_id: string`

          该输出所对应函数调用的 ID。

        - `output: string`

          函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        响应 MCP 批准请求的一条 Realtime item。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          正在回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        用于列出 MCP 服务器上可用工具的 Realtime item。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于该工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        表示在 MCP 服务器上调用工具的 Realtime item。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数 JSON 字符串。

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

          工具调用的错误（如果有）。

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

        请求人工批准工具调用的 Realtime item。

        - `id: string`

          批准请求的唯一 ID。

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

      模型用于响应的模态集合，目前唯一可能的取值是
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
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

      有关状态的更多详细信息。

      - `error: optional object { code, type }`

        导致响应失败的错误描述，
        在 `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于 `cancelled` Response，取以下之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于  `incomplete` Response，取以下之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器被触发并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段（ `status` ）。`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      响应的用量统计，将用于计费。
      Realtime API 会话将维护对话上下文，并将新的
      Items 追加到该会话中，因此先前轮次的输出（文本和
      音频 tokens）将作为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        响应用于输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次并作为当前响应上下文包含的 tokens。此处的 Cached tokens 被计为 Input tokens 的一个子集，意味着 Input tokens 包含 Cached tokens 和 Uncached tokens。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数。

        - `cached_tokens: optional number`

          用作 Response 输入的缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          用作 Response 输入的缓存 token 详细信息。

          - `audio_tokens: optional number`

            用作 Response 输入的缓存音频 token 数。

          - `image_tokens: optional number`

            用作 Response 输入的缓存图像 token 数。

          - `text_tokens: optional number`

            用作 Response 输入的缓存文本 token 数。

        - `image_tokens: optional number`

          用作 Response 输入的图像 token 数。

        - `text_tokens: optional number`

          用作 Response 输入的文本 token 数。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数,包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        Response 中使用的输出 token 详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数,包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的 token 总数,包括输入和输出
        文本和音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### Response Function Call Arguments Delta Event

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  当模型生成的函数调用参数被更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    作为 JSON 字符串的参数增量。

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

  在模型生成的函数调用参数流式传输完成时返回。
  当 Response 被中断、未完成或被取消时也会发出。

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

  在响应生成过程中 MCP 工具调用参数被更新时返回。

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

    如果存在，则表示该增量文本经过混淆处理。

### Response Mcp Call Arguments Done

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成期间，MCP 工具调用参数被最终确定时返回。

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

  当 MCP 工具调用已成功完成时返回。

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

  当 MCP 工具调用失败时返回。

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

  当 MCP 工具调用已开始且正在进行时返回。

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

  在 Response 生成期间创建新 Item 时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    在 Response 中输出项的索引。

  - `response_id: string`

    该项所属 Response 的 ID。

  - `type: "response.output_item.added"`

    事件类型，必须为 `response.output_item.added`.

    - `"response.output_item.added"`

### Response Output Item Done Event

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  在 Item 流式传输完成时返回。也会在 Response 被
  中断、未完成或取消时发出。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但有所不同，因为系统消息可以在对话中的任何时刻添加。对于对话行为上的重大更改，请使用 instructions；但对于较小的更新（例如“用户现在正在询问另一个话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容的类型。始终为 `input_text` （针对系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

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

          Base64 编码的音频字节（针对 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的细节级别（针对 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（针对 `input_image`）作为 data URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式包括 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的转录（针对 `input_audio`）。这些内容不会发送给模型，但会附加到 message item 上以供参考。

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

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息 item。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，将按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认格式为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的转录文本，当输出类型为时该字段始终存在 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用 item。

      - `arguments: string`

        函数调用的参数。这是一个经过 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出 item。

      - `call_id: string`

        该输出所对应函数调用的 ID。

      - `output: string`

        函数调用的输出，是自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。该 ID 可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`。创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 批准请求的一条 Realtime item。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      用于列出 MCP 服务器上可用工具的 Realtime item。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      表示在 MCP 服务器上调用工具的 Realtime item。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数 JSON 字符串。

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

        工具调用的错误（如果有）。

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

      请求人工批准工具调用的 Realtime item。

      - `id: string`

        批准请求的唯一 ID。

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

    在 Response 中输出项的索引。

  - `response_id: string`

    该项所属 Response 的 ID。

  - `type: "response.output_item.done"`

    事件类型，必须为 `response.output_item.done`.

    - `"response.output_item.done"`

### Response Text Delta Event

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  在 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    条目内容数组中内容部分的索引。

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

### Response Text Done Event

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  在 "output_text" 内容部分的文本值流式传输完成时返回。也会
  在 Response 被中断、未完成或取消时发出。

  - `content_index: number`

    条目内容数组中内容部分的索引。

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

### Session Created Event

- `SessionCreatedEvent object { event_id, session, type }`

  在创建 Session 时返回。在新
  连接建立后，作为首个服务端事件自动发出。此事件将包含
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

        要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
            对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

            轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                提示用户继续对话，基于当前上下文
                。

                超时值将在上一次模型响应的音频播放完毕后应用，
                即设置为响应 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                与 Response 关联）在达到超时时将被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。使用较短的值时，模型会响应得更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更大的音频音量才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在默认输出有内容时自动打断任何正在进行的响应，
                对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型已至少回复过一次音频，在
              会话过程中语音便无法更改。当前
              可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳音质。

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

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出 token 数，
        包含工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
        给定模型的默认值。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          用于此会话的 Realtime 模型。

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
        模型将以音频加上转录文本来响应。 `["text"]` 可用于让
        模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的中替换变量值的可选映射，
          提示中。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制具备推理能力的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制由模型调用哪些工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间做出选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

          - `server_label: string`

            要使用的 MCP 服务的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在该服务上调用的工具的名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            该函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时应如何向用户说明的
            （指导（若有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
          （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
            `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        追踪 在某个会话中启用，则无法再修改该配置。

        `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
        工作流 名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意元数据，用于启用
            在追踪面板中筛选。

          - `workflow_name: optional string`

            要附加到此追踪的工作流的名称。这用于
            在追踪面板中为追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
            VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
            语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静默时长（以毫秒为单位）。默认
              500ms。使用较短的值时，模型会响应得更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              高的阈值需要更大的音频音量才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅限 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Session Update Event

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新任何字段
  除外 `voice` 和 `model`. `voice` 仅在没有其他音频输出的情况下才能更新。

  当服务器收到一个 `session.update`，时，它会响应
  一个 `session.updated` 事件，显示完整且生效的配置。
  仅更新 `session.update` 中存在的字段。要清除某个字段，例如
  `instructions`，传入一个空字符串。若要清除类似 `tools`，的字段，传入一个空数组。
  若要清除类似 `turn_detection`，的字段，传入 `null`.

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。可在 realtime 会话和转录会话之间选择。
    realtime 会话和转录会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
            对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在输出转录文本之前等待的时间。
              较高的值可以提高转录准确率，但会增加延迟。
              仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。在
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
              可提高准确率和降低延迟。

            - `languages: optional array of string`

              输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              用于引导模型风格或延续上一段音频的可选文本
              片段。
              对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
              提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                提示用户继续对话，基于当前上下文
                。

                超时值将在上一次模型响应的音频播放完毕后应用，
                即设置为响应 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                与 Response 关联）在达到超时时将被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。使用较短的值时，模型会响应得更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更大的音频音量才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在默认输出有内容时自动打断任何正在进行的响应，
                对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于响应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
            一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
            一旦模型至少响应过一次音频。
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

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出 token 数，
        包含工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
        给定模型的默认值。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          用于此会话的 Realtime 模型。

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
        模型将以音频加上转录文本来响应。 `["text"]` 可用于让
        模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以并行调用多个工具。仅支持
        reasoning Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的中替换变量值的可选映射，
          提示中。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制具备推理能力的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional RealtimeToolChoiceConfig`

        模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制由模型调用哪些工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间做出选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

          - `server_label: string`

            要使用的 MCP 服务的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在该服务上调用的工具的名称。

      - `tools: optional RealtimeToolsConfig`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            该函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时应如何向用户说明的
            （指导（若有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
          （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
            `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        追踪 在某个会话中启用，则无法再修改该配置。

        `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
        工作流 名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意元数据，用于启用
            在追踪面板中筛选。

          - `workflow_name: optional string`

            要附加到此追踪的工作流的名称。这用于
            在追踪面板中为追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转写会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。对于 Realtime API，该值始终为 `transcription` 用于转写会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
            对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                提示用户继续对话，基于当前上下文
                。

                超时值将在上一次模型响应的音频播放完毕后应用，
                即设置为响应 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                与 Response 关联）在达到超时时将被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。使用较短的值时，模型会响应得更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更大的音频音量才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在默认输出有内容时自动打断任何正在进行的响应，
                对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    客户端生成的可选 ID，用于标识此事件。这是由客户端自行指定的任意字符串。如果该事件发生错误，它会随响应一并返回，但对应的 `session.updated` 事件中不会包含它。

### Session Updated Event

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话通过某个事件更新时返回，除非 `session.update` 事件，除非
  出现错误。

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

        要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
            对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

            轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                提示用户继续对话，基于当前上下文
                。

                超时值将在上一次模型响应的音频播放完毕后应用，
                即设置为响应 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                与 Response 关联）在达到超时时将被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。使用较短的值时，模型会响应得更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更大的音频音量才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在默认输出有内容时自动打断任何正在进行的响应，
                对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型已至少回复过一次音频，在
              会话过程中语音便无法更改。当前
              可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳音质。

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

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出 token 数，
        包含工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
        给定模型的默认值。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          用于此会话的 Realtime 模型。

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
        模型将以音频加上转录文本来响应。 `["text"]` 可用于让
        模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的中替换变量值的可选映射，
          提示中。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制具备推理能力的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制由模型调用哪些工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间做出选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

          - `server_label: string`

            要使用的 MCP 服务的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在该服务上调用的工具的名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            该函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时应如何向用户说明的
            （指导（若有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
          （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
            `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        追踪 在某个会话中启用，则无法再修改该配置。

        `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
        工作流 名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意元数据，用于启用
            在追踪面板中筛选。

          - `workflow_name: optional string`

            要附加到此追踪的工作流的名称。这用于
            在追踪面板中为追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
            VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
            语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静默时长（以毫秒为单位）。默认
              500ms。使用较短的值时，模型会响应得更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              高的阈值需要更大的音频音量才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅限 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Transcription Session Update

- `TranscriptionSessionUpdate object { session, type, event_id }`

  发送此事件以更新转写会话。

  - `session: object { include, input_audio_format, input_audio_noise_reduction, 2 more }`

    实时转写会话对象配置。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      转写中要包含的项集合。当前可用的项包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`, 输入音频必须为 16 位 PCM,采样率 24kHz,
      单声道( mono ),小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
      对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转写的配置。客户端可以选择性地设置转写的语言和提示词，这些为转写服务提供了额外指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
        可提高准确率和降低延迟。

      - `languages: optional array of string`

        输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频的可选文本
        片段。
        对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
        提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静默时长（以毫秒为单位）。默认
        500ms。使用较短的值时，模型会响应得更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
        高的阈值需要更大的音频音量才能激活模型，因此
        在嘈杂环境中可能表现更好。

      - `type: optional "server_vad"`

        轮次检测类型。目前仅 `server_vad` 在转写会话中受支持。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此 event。

### 转写会话更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  在通过以下方式更新转写会话时返回 `transcription_session.update` 事件，除非
  出现错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    新的 Realtime 转写会话配置。

    当通过 REST API 在服务端创建会话时，会话对象
    还会包含一个临时密钥。密钥的默认 TTL 为 10 分钟。当
    会话是通过 WebSocket API 更新时，则不会包含此属性。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅当会话是
      通过 REST API 在服务端创建时存在。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌都会过期
        一分钟后失效。

      - `value: string`

        可在客户端环境中用于鉴权连接的临时密钥，
        用于连接 Realtime API。请在客户端环境中使用此密钥，而不是
        标准的 API 令牌，后者只能在 服务端 使用。

    - `input_audio_format: optional string`

      输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

      模型可用来响应的模态集合。若要禁用音频,
      请将其设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端
      VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
      调整音量并在用户语音结束时进行回应。

      - `prefix_padding_ms: optional number`

        VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静默时长（以毫秒为单位）。默认
        500ms。使用较短的值时，模型会响应得更快，
        但可能会在用户短暂停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
        高的阈值需要更大的音频音量才能激活模型，因此
        在嘈杂环境中可能表现更好。

      - `type: optional string`

        轮次检测类型，仅限 `server_vad` 当前受支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 通话

## 接听通话

**post** `/realtime/calls/{call_id}/accept`

接听来电 SIP 呼叫并配置将用于
处理它的实时会话。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
      降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
      对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
        可提高准确率和降低延迟。

      - `languages: optional array of string`

        输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续上一段音频的可选文本
        片段。
        对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
        提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `idle_timeout_ms: optional number or null`

          在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
          出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
          提示用户继续对话，基于当前上下文
          。

          超时值将在上一次模型响应的音频播放完毕后应用，
          即设置为响应 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
          与 Response 关联）在达到超时时将被发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）正在向默认
          对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
          500ms。使用较短的值时，模型会响应得更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更大的音频音量才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          是否在默认输出有内容时自动打断任何正在进行的响应，
          对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，是原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

      该参数是对生成后音频的后处理调整，
      也可以通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于响应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
      一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
      一旦模型至少响应过一次音频。
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

  要在服务端输出中包含的额外字段。

  `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

  注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出 token 数，
  包含工具调用。请提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
  给定模型的默认值。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

  用于此会话的 Realtime 模型。

  - `string`

  - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    用于此会话的 Realtime 模型。

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
  模型将以音频加上转录文本来响应。 `["text"]` 可用于让
  模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以并行调用多个工具。仅支持
  reasoning Realtime 模型，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于在你的中替换变量值的可选映射，
    提示中。替换值可以是字符串，也可以是其他
    Response 输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型，始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型，始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `image_url: optional string or null`

        发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型，始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送给模型的文件内容。

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `file_url: optional string`

        发送给模型的文件的 URL。

      - `filename: optional string`

        发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制具备推理能力的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制由模型调用哪些工具（若有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或
    多个工具之间做出选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可以强制模型调用某个特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

    - `server_label: string`

      要使用的 MCP 服务的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在该服务上调用的工具的名称。

- `tools: optional RealtimeToolsConfig`

  模型可用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      该函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时应如何向用户说明的
      （指导（若有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
    （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

    - `type: "mcp"`

      MCP 工具的类型。始终为 `mcp`.

      - `"mcp"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

      允许使用的工具名称列表或过滤对象。

      - `McpAllowedTools = array of string`

        允许使用的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许使用哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          进行了标注，则会匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
      服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
      `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
      通过安全 MCP 隧道进行连接。

      当前支持 `connector_id` 的值为：

      - Dropbox: `connector_dropbox`
      - Gmail: `connector_gmail`
      - Google Calendar: `connector_googlecalendar`
      - Google Drive: `connector_googledrive`
      - Microsoft Teams: `connector_microsoftteams`
      - Outlook Calendar: `connector_outlookcalendar`
      - Outlook Email: `connector_outlookemail`
      - SharePoint: `connector_sharepoint`

      - `"connector_dropbox"`

      - `"connector_gmail"`

      - `"connector_googlecalendar"`

      - `"connector_googledrive"`

      - `"connector_microsoftteams"`

      - `"connector_outlookcalendar"`

      - `"connector_outlookemail"`

      - `"connector_sharepoint"`

    - `defer_loading: optional boolean`

      此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器的哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器的哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        需要审批的工具。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定单一的审批策略。可选值为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中之一。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
  追踪 在某个会话中启用，则无法再修改该配置。

  `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
  工作流 名称、group id 和元数据。

  - `Auto = "auto"`

    启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意元数据，用于启用
      在追踪面板中筛选。

    - `workflow_name: optional string`

      要附加到此追踪的工作流的名称。这用于
      在追踪面板中为追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

  客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

  截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

  - `"auto" or "disabled"`

    用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

      - `post_instructions: optional number`

        指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

通过 WebRTC 创建新的 Realtime API 调用，并接收完成对等连接所需的 SDP 应答
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

结束一个处于活动状态的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 方法将正在进行的 SIP 通话转接到新的目的地。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应在 SIP Refer-To 头中出现的 URI。支持以下值
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

## Reject call

**post** `/realtime/calls/{call_id}/reject`

通过向主叫方返回 SIP 状态码来拒接来电 SIP 呼叫。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  发送回主叫方的 SIP 响应代码。默认为 `603` (Decline)
  如果省略。

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

客户端密钥是短期有效的令牌，可以传递给客户端应用，
例如 Web 前端或移动客户端，以授予对 Realtime API 的访问权限，而不会泄露你的主
API 密钥。你可以为每个客户端密钥配置自定义 TTL。

你还可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的所有会话，但这些选项也可以被
客户端连接覆盖。

[详细了解通过 WebRTC 使用客户端密钥进行身份验证](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，形如 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥的过期配置。过期时间指的是在此之后，
  客户端密钥将不再可用于创建会话的时间点。会话本身在该时间之后
  一旦启动即可继续进行。一个密钥在过期之前可用于创建多个会话，
  直到过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，表示该值 `seconds` 将被加到客户端密钥 `created_at` 的创建时间上以生成过期时间戳。仅接受 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期时间之间的秒数。请选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，则默认为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择 realtime 或
  realtime 会话和转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
          降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转录文本之前等待的时间。
            较高的值可以提高转录准确率，但会增加延迟。
            仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
            可提高准确率和降低延迟。

          - `languages: optional array of string`

            输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续上一段音频的可选文本
            片段。
            对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
            提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
              出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
              提示用户继续对话，基于当前上下文
              。

              超时值将在上一次模型响应的音频播放完毕后应用，
              即设置为响应 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              与 Response 关联）在达到超时时将被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）正在向默认
              对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。使用较短的值时，模型会响应得更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更大的音频音量才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认输出有内容时自动打断任何正在进行的响应，
              对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，是原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          该参数是对生成后音频的后处理调整，
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于响应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以使用自定义声音对象，例如
          一个 `id`，比如 `{ "id": "voice_1234" }`。声音无法在会话中更改，
          一旦模型至少响应过一次音频。
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

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

      注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      包含工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
      给定模型的默认值。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      用于此会话的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

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
      模型将以音频加上转录文本来响应。 `["text"]` 可用于让
      模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以并行调用多个工具。仅支持
      reasoning Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的中替换变量值的可选映射，
        提示中。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制由模型调用哪些工具（若有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        多个工具之间做出选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可以强制模型调用某个特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

        - `server_label: string`

          要使用的 MCP 服务的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在该服务上调用的工具的名称。

    - `tools: optional RealtimeToolsConfig`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          该函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时应如何向用户说明的
          （指导（若有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
        （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
          服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
          `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的值为：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook Calendar: `connector_outlookcalendar`
          - Outlook Email: `connector_outlookemail`
          - SharePoint: `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
      追踪 在某个会话中启用，则无法再修改该配置。

      `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
      工作流 名称、group id 和元数据。

      - `Auto = "auto"`

        启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪 的任意元数据，用于启用
          在追踪面板中筛选。

        - `workflow_name: optional string`

          要附加到此追踪的工作流的名称。这用于
          在追踪面板中为追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

      客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

      截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

      截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

      - `"auto" or "disabled"`

        用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

        - `retention_ratio: number`

          指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

          - `post_instructions: optional number`

            指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转写会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API，该值始终为 `transcription` 用于转写会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
              出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
              提示用户继续对话，基于当前上下文
              。

              超时值将在上一次模型响应的音频播放完毕后应用，
              即设置为响应 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              与 Response 关联）在达到超时时将被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）正在向默认
              对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。使用较短的值时，模型会响应得更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更大的音频音量才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认输出有内容时自动打断任何正在进行的响应，
              对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### 返回值

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

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

      要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
          降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
          对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

          轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
              出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
              提示用户继续对话，基于当前上下文
              。

              超时值将在上一次模型响应的音频播放完毕后应用，
              即设置为响应 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
              与 Response 关联）在达到超时时将被发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）正在向默认
              对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
              500ms。使用较短的值时，模型会响应得更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更大的音频音量才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              是否在默认输出有内容时自动打断任何正在进行的响应，
              对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，是原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          该参数是对生成后音频的后处理调整，
          也可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型已至少回复过一次音频，在
          会话过程中语音便无法更改。当前
          可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳音质。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

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

      会话的过期时间戳，自 Unix 纪元起的秒数。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

      `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

      注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出 token 数，
      包含工具调用。请提供一个介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
      给定模型的默认值。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      用于此会话的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

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
      模型将以音频加上转录文本来响应。 `["text"]` 可用于让
      模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于在你的中替换变量值的可选映射，
        提示中。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型，始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型，始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型，始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制由模型调用哪些工具（若有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        多个工具之间做出选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可以强制模型调用某个特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

        - `server_label: string`

          要使用的 MCP 服务的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在该服务上调用的工具的名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          该函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时应如何向用户说明的
          （指导（若有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
        （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许使用的工具名称列表或过滤对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称组成的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
          服务器 URL 或服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
          `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
          通过安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的值为：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook Calendar: `connector_outlookcalendar`
          - Outlook Email: `connector_outlookemail`
          - SharePoint: `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            需要审批的工具。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
      追踪 在某个会话中启用，则无法再修改该配置。

      `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
      工作流 名称、group id 和元数据。

      - `Auto = "auto"`

        启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪 的任意元数据，用于启用
          在追踪面板中筛选。

        - `workflow_name: optional string`

          要附加到此追踪的工作流的名称。这用于
          在追踪面板中为追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

      客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

      截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

      截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

      - `"auto" or "disabled"`

        用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

        - `retention_ratio: number`

          指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

          - `post_instructions: optional number`

            指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

            降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
          VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
          语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静默时长（以毫秒为单位）。默认
            500ms。使用较短的值时，模型会响应得更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            高的阈值需要更大的音频音量才能激活模型，因此
            在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测类型，仅限 `server_vad` 当前受支持。

    - `expires_at: optional number`

      会话的过期时间戳，自 Unix 纪元起的秒数。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在服务端输出中包含的额外字段。

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

## 域名类型

### Client Secret Create Response

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

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

        要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
            降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
            对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

            轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
                出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
                提示用户继续对话，基于当前上下文
                。

                超时值将在上一次模型响应的音频播放完毕后应用，
                即设置为响应 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
                与 Response 关联）在达到超时时将被发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）正在向默认
                对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
                500ms。使用较短的值时，模型会响应得更快，
                但可能会在用户短暂停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更大的音频音量才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                是否在默认输出有内容时自动打断任何正在进行的响应，
                对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，是原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            该参数是对生成后音频的后处理调整，
            也可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型已至少回复过一次音频，在
            会话过程中语音便无法更改。当前
            可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型已至少回复过一次音频，在
              会话过程中语音便无法更改。当前
              可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳音质。

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

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

        `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出 token 数，
        包含工具调用。请提供一个介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
        给定模型的默认值。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        用于此会话的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          用于此会话的 Realtime 模型。

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
        模型将以音频加上转录文本来响应。 `["text"]` 可用于让
        模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于在你的中替换变量值的可选映射，
          提示中。替换值可以是字符串，也可以是其他
          Response 输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型，始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型，始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型，始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string`

              发送给模型的文件的 URL。

            - `filename: optional string`

              发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制具备推理能力的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制由模型调用哪些工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间做出选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

          - `server_label: string`

            要使用的 MCP 服务的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在该服务上调用的工具的名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            该函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时应如何向用户说明的
            （指导（若有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
          （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                进行了标注，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
            服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
            `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
            通过安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              需要审批的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  进行了标注，则会匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
        追踪 在某个会话中启用，则无法再修改该配置。

        `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
        工作流 名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪 的任意元数据，用于启用
            在追踪面板中筛选。

          - `workflow_name: optional string`

            要附加到此追踪的工作流的名称。这用于
            在追踪面板中为追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

        截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

        截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

        - `"auto" or "disabled"`

          用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

            - `post_instructions: optional number`

              指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

              降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
            VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
            语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静默时长（以毫秒为单位）。默认
              500ms。使用较短的值时，模型会响应得更快，
              但可能会在用户短暂停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
              高的阈值需要更大的音频音量才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测类型，仅限 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自 Unix 纪元起的秒数。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要在服务端输出中包含的额外字段。

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

    要创建的会话类型。对于 Realtime API，该值始终为 `realtime` 接口，该值始终为。

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
        降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
        对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转写的配置，默认为关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指导，而非模型听到的确切内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指导。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

        轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）来语义化地估计用户是否已说完，然后根据该概率动态设置超时。例如，如果用户的声音以 "uhhm" 逐渐减弱，模型将对轮次结束给出较低的概率，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单的服务端 VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时，可能会无法创建新的响应。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            在多长时间后自动触发模型响应的可选超时。这在以下场景中很有用：
            出现意外的长时停顿，例如电话通话。模型会根据当前上下文有效地
            提示用户继续对话，基于当前上下文
            。

            超时值将在上一次模型响应的音频播放完毕后应用，
            即设置为响应 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（加上事件
            与 Response 关联）在达到超时时将被发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）正在向默认
            对话（即。 `conversation` 的 `auto`）输出的进行中 Response。如果 `true` 为 true 则 Response 将被取消，否则它将一直持续到完成。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频时长（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（以毫秒为单位）。默认为
            500ms。使用较短的值时，模型会响应得更快，
            但可能会在用户短暂停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更大的音频音量才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 来开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` mode。模型响应的积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8s、4s 和 2s。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            是否在默认输出有内容时自动打断任何正在进行的响应，
            对话（即。 `conversation` 的 `auto`) 发生 VAD start 事件时使用。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应的速度，是原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

        该参数是对生成后音频的后处理调整，
        也可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的语音。一旦模型已至少回复过一次音频，在
        会话过程中语音便无法更改。当前
        可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳音质。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型已至少回复过一次音频，在
          会话过程中语音便无法更改。当前
          可选的语音有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳音质。

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

    会话的过期时间戳，自 Unix 纪元起的秒数。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用前默认添加的系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的表现（例如"非常简洁"、"保持友好"、"以下是优秀响应的示例"），以及在音频行为上的表现（例如"说得快一些"、"在声音中加入情感"、"经常大笑"）。这些指令不一定被模型严格遵循，但它们为模型提供了期望行为的指导。

    注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出 token 数，
    包含工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
    给定模型的默认值。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    用于此会话的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      用于此会话的 Realtime 模型。

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
    模型将以音频加上转录文本来响应。 `["text"]` 可用于让
    模型仅以文本进行响应。同时请求两者 `text` 和 `audio` 是不可能的。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于在你的中替换变量值的可选映射，
      提示中。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

        - `text: string`

          发送给模型的文本输入。

        - `type: "input_text"`

          输入项的类型，始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型，始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型，始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `file_url: optional string`

          发送给模型的文件的 URL。

        - `filename: optional string`

          发送给模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    面向具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制具备推理能力的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型选择工具的方式。提供某个字符串模式，或强制使用某个特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制由模型调用哪些工具（若有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间做出选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可以强制模型调用某个特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可以强制模型在远程 MCP 服务上调用某个特定的工具。

      - `server_label: string`

        要使用的 MCP 服务的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在该服务上调用的工具的名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        该函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时应如何向用户说明的
        （指导（若有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议（Model Context Protocol）为模型提供对其他工具的访问
      （MCP）服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        用于标识此 MCP 服务器的标签，在工具调用中用于识别它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许使用的工具名称列表或过滤对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            进行了标注，则会匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP
        服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。其
        `server_url`, `connector_id`，或 `tunnel_id` 之一必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        对于 2026 年 9 月 1 日之后发布的模型，此字段已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或 `tunnel_id` 为
        通过安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的值为：

        - Dropbox: `connector_dropbox`
        - Gmail: `connector_gmail`
        - Google Calendar: `connector_googlecalendar`
        - Google Drive: `connector_googledrive`
        - Microsoft Teams: `connector_microsoftteams`
        - Outlook Calendar: `connector_outlookcalendar`
        - Outlook Email: `connector_outlookemail`
        - SharePoint: `connector_sharepoint`

        - `"connector_dropbox"`

        - `"connector_gmail"`

        - `"connector_googlecalendar"`

        - `"connector_googledrive"`

        - `"connector_microsoftteams"`

        - `"connector_outlookcalendar"`

        - `"connector_outlookemail"`

        - `"connector_sharepoint"`

      - `defer_loading: optional boolean`

        此 MCP 工具是否为延迟发现，并通过工具搜索进行发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤器对象
          需要审批的工具。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP 服务器使用 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              进行了标注，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一的审批策略。可选值为 `always` 或
          `never`。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。可提供以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的 Secure MCP Tunnel ID。可提供以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces). 设为 null 可禁用追踪。一旦
    追踪 在某个会话中启用，则无法再修改该配置。

    `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
    工作流 名称、group id 和元数据。

    - `Auto = "auto"`

      启用追踪 并设置追踪 配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意元数据，用于启用
        在追踪面板中筛选。

      - `workflow_name: optional string`

        要附加到此追踪的工作流的名称。这用于
        在追踪面板中为追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

    客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

    截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

    截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

    - `"auto" or "disabled"`

      用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

      - `retention_ratio: number`

        指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

        - `post_instructions: optional number`

          指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

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

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        转录模型的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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
        VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
        语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          检测语音停止的静默时长（以毫秒为单位）。默认
          500ms。使用较短的值时，模型会响应得更快，
          但可能会在用户短暂停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
          高的阈值需要更大的音频音量才能激活模型，因此
          在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测类型，仅限 `server_vad` 当前受支持。

  - `expires_at: optional number`

    会话的过期时间戳，自 Unix 纪元起的秒数。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
  语音结束时作出响应。对于 `gpt-realtime-whisper`，必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静默时长（以毫秒为单位）。默认
    500ms。使用较短的值时，模型会响应得更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
    高的阈值需要更大的音频音量才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅限 `server_vad` 当前受支持。

# Sessions

## Create session

**post** `/realtime/sessions`

创建一个用于客户端应用的临时 API 令牌，用于
Realtime API。可使用与
`session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 密钥，其中包含
一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以便接入 Realtime API。

返回创建的 Realtime 会话对象以及一个临时密钥。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会过期
    一分钟后失效。

  - `value: string`

    可在客户端环境中用于鉴权连接的临时密钥，
    用于连接 Realtime API。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，后者只能在 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，可以
  设置为 `null` 开启后再关闭。输入音频转录并非模型
  原生支持，因为模型直接消费音频。转录会
  异步执行，应将其视为粗略参考，
  而非模型所理解的表示。

  - `model: optional string`

    用于转录的模型。

- `instructions: optional string`

  添加到模型调用前的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是一些良好响应的示例”），以及音频行为（例如“说话要快”、“在声音中加入情感”、“经常笑”）。这些指令不一定会被模型遵循，但它们为模型提供了关于期望行为的指引。
  注意，服务器会设置默认指令，如果未设置此字段则会使用这些默认指令，并可在会话开头的 `session.created` 事件中查看。

- `max_response_output_tokens: optional number or "inf"`

  单个助手响应的最大输出 token 数，
  包含工具调用。请提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
  给定模型的默认值。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可用来响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于在你的中替换变量值的可选映射，
    提示中。替换值可以是字符串，也可以是其他
    Response 输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      发送给模型的文本输入。

      - `text: string`

        发送给模型的文本输入。

      - `type: "input_text"`

        输入项的类型，始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型，始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `image_url: optional string or null`

        发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型，始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的用量。使用 `low` 可以使用更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `file_data: optional string`

        发送给模型的文件内容。

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `file_url: optional string`

        发送给模型的文件的 URL。

      - `filename: optional string`

        发送给模型的文件的名称。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点从请求中继承其 TTL： `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音响应的速度。1.0 为默认速度。0.25 为
  最低速度。1.5 为最高速度。此值只能在
  模型轮次之间更改，不能在响应进行中更改。

- `temperature: optional number`

  模型的采样温度，限制在 [0.6, 1.2] 范围内，默认为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。可选项包括 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  模型可用的工具（函数）。

  - `description: optional string`

    该函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时应如何向用户说明的
    （指导（若有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  用于追踪的配置选项。设置为 null 以禁用追踪。一旦
  追踪 在某个会话中启用，则无法再修改该配置。

  `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
  工作流 名称、group id 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      在追踪仪表板中的分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意元数据，用于启用
      在追踪仪表板中的筛选。

    - `workflow_name: optional string`

      要附加到此追踪的工作流的名称。这用于
      在追踪仪表板中为该追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数量超过模型的输入令牌限制时，对话将被截断，这意味着最早的消息将不会包含在模型的上下文中。具有 4,096 个最大输出令牌的 32k 上下文模型在发生截断之前，上下文只能包含 28,224 个令牌。

  客户端可以配置截断行为，使用更小的最大令牌限制进行截断，这是控制令牌使用和成本的有效方法。

  截断会减少下一轮中已缓存的令牌数量（破坏缓存），因为消息会从上下文的开头被丢弃。然而，客户端也可以配置截断，以保留最多达到最大上下文大小一定比例的消息，这会减少未来截断的需要，从而提高缓存命中率。

  截断可以被完全禁用，这意味着服务端永远不会截断，但如果对话超过模型的输入令牌限制，则会返回错误。

  - `"auto" or "disabled"`

    用于会话的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌限制时发出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超过输入 token 上限时，保留一定比例的对话 token。这样可以在多轮对话之间分摊截断开销，有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      指令之后对话 token 的保留比例（`0.0` - `1.0`），当对话超过输入 token 上限时生效。将其设置为 `0.8` 时，会丢弃消息直至已使用最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      该截断策略的可选自定义 token 上限。如果未提供，则使用模型默认的 token 上限。

      - `post_instructions: optional number`

        指令之后（含工具定义）对话中允许的最大 token 数。例如，将其设置为 5,000 表示当指令之后对话超过 5,000 token 时将触发截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
  调整音量并在用户语音结束时进行回应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静默时长（以毫秒为单位）。默认
    500ms。使用较短的值时，模型会响应得更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
    高的阈值需要更大的音频音量才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅限 `server_vad` 当前受支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型用于响应的声音。支持的内置声音有
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`。你也可以提供一个自定义的语音对象，其中包含
  `id`，比如 `{ "id": "voice_1234" }`。语音无法在会话期间更改，
  一旦模型至少响应过一次音频后便无法更改。

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

### 返回值

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

        降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转录的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

        轮次检测类型，仅限 `server_vad` 当前受支持。

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

  会话的过期时间戳，自 Unix 纪元起的秒数。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在服务端输出中包含的额外字段。

  - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  默认系统指令(即系统消息),会被前置添加到模型
  调用中。该字段允许客户端引导模型给出期望的
  响应。可以指示模型响应的内容和格式,
  (例如 “极度简洁”、“表现得友好”、“以下是较好的
  响应的示例”),以及音频行为(例如 “说话快一些”、“在声音中
  用你的声音”，"经常笑"）。这些指令不保证
  会被模型遵循，但它们会为模型提供期望行为的
  指导。

  注意,服务端会设置默认指令,如果该字段
  未设置,则会使用这些默认指令,它们可在 `session.created` 事件的会话开头处看到,该事件位于
  会话开始时。

- `max_output_tokens: optional number or "inf"`

  单个助手响应的最大输出 token 数，
  包含工具调用。请提供一个介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
  给定模型的默认值。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string`

  用于此会话的 Realtime 模型。

- `object: optional string`

  对象类型。始终为 `realtime.session`.

- `output_modalities: optional array of "text" or "audio"`

  模型可用来响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `tool_choice: optional string`

  模型选择工具的方式。可选项包括 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  模型可用的工具（函数）。

  - `description: optional string`

    该函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时应如何向用户说明的
    （指导（若有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  用于追踪的配置选项。设置为 null 以禁用追踪。一旦
  追踪 在某个会话中启用，则无法再修改该配置。

  `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
  工作流 名称、group id 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    对追踪 的细粒度配置。

    - `group_id: optional string`

      附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
      在追踪仪表板中的分组。

    - `metadata: optional unknown`

      附加到此追踪 的任意元数据，用于启用
      在追踪仪表板中的筛选。

    - `workflow_name: optional string`

      要附加到此追踪的工作流的名称。这用于
      在追踪仪表板中为该追踪命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
  调整音量并在用户语音结束时进行回应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静默时长（以毫秒为单位）。默认
    500ms。使用较短的值时，模型会响应得更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
    高的阈值需要更大的音频音量才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅限 `server_vad` 当前受支持。

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

## 域名类型

### 会话创建响应

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

          降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

          轮次检测类型，仅限 `server_vad` 当前受支持。

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

    会话的过期时间戳，自 Unix 纪元起的秒数。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要在服务端输出中包含的额外字段。

    - `item.input_audio_transcription.logprobs`: 为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    默认系统指令(即系统消息),会被前置添加到模型
    调用中。该字段允许客户端引导模型给出期望的
    响应。可以指示模型响应的内容和格式,
    (例如 “极度简洁”、“表现得友好”、“以下是较好的
    响应的示例”),以及音频行为(例如 “说话快一些”、“在声音中
    用你的声音”，"经常笑"）。这些指令不保证
    会被模型遵循，但它们会为模型提供期望行为的
    指导。

    注意,服务端会设置默认指令,如果该字段
    未设置,则会使用这些默认指令,它们可在 `session.created` 事件的会话开头处看到,该事件位于
    会话开始时。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出 token 数，
    包含工具调用。请提供一个介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 以使用指定模型的最大可用 token 数。默认值为
    给定模型的默认值。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string`

    用于此会话的 Realtime 模型。

  - `object: optional string`

    对象类型。始终为 `realtime.session`.

  - `output_modalities: optional array of "text" or "audio"`

    模型可用来响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `tool_choice: optional string`

    模型选择工具的方式。可选项包括 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      该函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时应如何向用户说明的
      （指导（若有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    用于追踪的配置选项。设置为 null 以禁用追踪。一旦
    追踪 在某个会话中启用，则无法再修改该配置。

    `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
    工作流 名称、group id 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此追踪 的 group id，用于在追踪仪表板中进行筛选和
        在追踪仪表板中的分组。

      - `metadata: optional unknown`

        附加到此追踪 的任意元数据，用于启用
        在追踪仪表板中的筛选。

      - `workflow_name: optional string`

        要附加到此追踪的工作流的名称。这用于
        在追踪仪表板中为该追踪命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
    调整音量并在用户语音结束时进行回应。

    - `prefix_padding_ms: optional number`

      VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静默时长（以毫秒为单位）。默认
      500ms。使用较短的值时，模型会响应得更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
      高的阈值需要更大的音频音量才能激活模型，因此
      在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测类型，仅限 `server_vad` 当前受支持。

# 转录会话

## 创建转录会话

**post** `/realtime/transcription_sessions`

创建一个用于客户端应用的临时 API 令牌，用于
专为实时转录设计的 Realtime API。
可使用与以下相同的会话参数进行配置： `transcription_session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 密钥，其中包含
一个可用的临时 API 令牌，可用于对浏览器客户端进行身份验证，
以便接入 Realtime API。

返回已创建的 Realtime 转录会话对象以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  转写中要包含的项集合。当前可用的项包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`, 输入音频必须为 16 位 PCM,采样率 24kHz,
  单声道( mono ),小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可设置为 `null` 以关闭。
  降噪会在输入音频被发送到 VAD 和模型之前，对添加到输入音频缓冲区的音频进行过滤。
  对音频进行过滤可以提升 VAD 和轮次检测的准确率（减少误报），并通过改善对输入音频的感知来提升模型表现。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近讲麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转写的配置。客户端可以选择性地设置转写的语言和提示词，这些为转写服务提供了额外指导。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转录文本之前等待的时间。
    较高的值可以提高转录准确率，但会增加延迟。
    仅在 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转录的单词或短语。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (例如。 `en`)格式
    可提高准确率和降低延迟。

  - `languages: optional array of string`

    输入音频可能使用的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。受 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要使用说话人标签进行说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续上一段音频的可选文本
    片段。
    对于 `whisper-1`，该 [提示是关键字列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），提示是自由文本字符串，例如 "expect words related to technology"。
    提示不支持 `gpt-realtime-whisper` 的 GA Realtime 会话中支持。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静默时长（以毫秒为单位）。默认
    500ms。使用较短的值时，模型会响应得更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
    高的阈值需要更大的音频音量才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional "server_vad"`

    轮次检测类型。目前仅 `server_vad` 在转写会话中受支持。

    - `"server_vad"`

### 返回值

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅当会话是
  通过 REST API 在服务端创建时存在。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会过期
    一分钟后失效。

  - `value: string`

    可在客户端环境中用于鉴权连接的临时密钥，
    用于连接 Realtime API。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，后者只能在 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

  模型可用来响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
  调整音量并在用户语音结束时进行回应。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静默时长（以毫秒为单位）。默认
    500ms。使用较短的值时，模型会响应得更快，
    但可能会在用户短暂停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
    高的阈值需要更大的音频音量才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测类型，仅限 `server_vad` 当前受支持。

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

## 域名类型

### 转录会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  新的 Realtime 转写会话配置。

  当通过 REST API 在服务端创建会话时，会话对象
  还会包含一个临时密钥。密钥的默认 TTL 为 10 分钟。当
  会话是通过 WebSocket API 更新时，则不会包含此属性。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅当会话是
    通过 REST API 在服务端创建时存在。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌都会过期
      一分钟后失效。

    - `value: string`

      可在客户端环境中用于鉴权连接的临时密钥，
      用于连接 Realtime API。请在客户端环境中使用此密钥，而不是
      标准的 API 令牌，后者只能在 服务端 使用。

  - `input_audio_format: optional string`

    输入音频的格式。可选值为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可用输入音频语言， [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

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

    模型可用来响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 表示模型将根据音频音量检测语音的开始与结束，并在用户
    调整音量并在用户语音结束时进行回应。

    - `prefix_padding_ms: optional number`

      VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静默时长（以毫秒为单位）。默认
      500ms。使用较短的值时，模型会响应得更快，
      但可能会在用户短暂停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
      高的阈值需要更大的音频音量才能激活模型，因此
      在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测类型，仅限 `server_vad` 当前受支持。

# 翻译

# 客户端密钥

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并关联相应的翻译会话配置。

客户端密钥是短期有效的令牌，可以传递给客户端应用，
例如 Web 前端或移动客户端，从而获得对 Realtime
翻译 API 的访问权限，而无需泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义
TTL。

返回已创建的客户端密钥以及生效的翻译会话对象。
该客户端密钥是一个字符串，格式类似 `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话会持续流式传入源语言
  音频，并持续流式输出翻译后的音频以及转录文本增量。

  - `model: string`

    此会话所使用的 Realtime 翻译模型。

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

        可选的源语言转录。配置后，服务器会发出
        `session.input_transcript.delta` 事件。翻译本身仍然从
        输入音频流运行。

        - `model: string`

          用于源转录增量的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译输出音频和转录增量的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥的过期配置。过期时间指的是在此之后，
  客户端密钥将不再可用于创建会话的时间点。会话本身在该时间之后
  一旦启动即可继续进行。一个密钥在过期之前可用于创建多个会话，
  直到过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，表示该值 `seconds` 将被加到客户端密钥 `created_at` 的创建时间上以生成过期时间戳。仅接受 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期时间之间的秒数。请选择介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，则默认为 600 秒（10 分钟）。

### 返回值

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  通过创建翻译会话和客户端密钥返回 Realtime API 的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续将输入
    音频翻译为配置的目标语言。

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

          可选的源语言转录。配置后，服务器会发出
          `session.input_transcript.delta` 事件。翻译本身仍然从
          输入音频流运行。

          - `model: string`

            用于源转录增量的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 Unix 纪元起的秒数。

    - `model: string`

      用于此会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，用于 Realtime 翻译会话。

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
