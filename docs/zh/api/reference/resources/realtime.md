# Realtime

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页的 Markdown 版本。

## 域类型

### 音频转录

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本之前等待的时间。
    较高的值可以提高转写准确率，但会增加延迟。
    仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
    将提高准确率和延迟表现。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
    对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
    Prompt 不支持用于 `gpt-realtime-whisper` 。

### 会话创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  在创建会话时返回。会话创建后立即发出。

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

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` ，适用于系统消息。

        - `"input_text"`

    - `role: "system"`

      消息发送方的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（用于 `input_text`).

      - `transcript: optional string`

        音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

      条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送方的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一项函数调用项。

    - `arguments: string`

      函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用的函数名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

    Realtime 对话中的一项函数调用输出项。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可由客户端提供，也可由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    用于响应 MCP 审批请求的 Realtime 项。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      被回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      可选的决策原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        有关该工具的附加注释。

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

    请求人工审批工具调用的 Realtime 项。

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

### 会话项已添加

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当有 Item 被添加到默认 Conversation 时由服务端发送。以下几种情况都可能触发该事件：

  - 当客户端发送 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。此时该 item 将是一条用户消息，其中包含缓冲区中的音频。
  - 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此此时它还没有任何内容（且 `status` 将是 `in_progress`).

  该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），但音频数据除外，必要时可通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    位于此项之前的 item 的 ID（如果有）。用于在
    插入 item 时保持顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向对话上下文添加新的 Item，包括消息、函数
  调用以及函数调用响应。该事件既可用于填充对话
  “的“历史记录”，也可在流式过程中添加新 item，但存在一个
  当前限制：它无法填充助手音频消息。

  如果成功，服务端将发出一个 `conversation.item.added` 事件，以及，
  在该 item 完成时发出一个 `conversation.item.done` 事件。否则将发送一个
  `error` 事件。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    可选的客户端生成的 ID，用于标识此事件。

  - `previous_item_id: optional string`

    新 item 将插入其后的前一个 item 的 ID。如果未设置，新 item 将追加到对话末尾。

    如果设置为 `root`，新 item 将被添加到对话开头。

    如果设置为现有的某个 ID，则可在对话中间插入一个 item。如果找不到该 ID，将返回错误，并且不会添加该 item。

### 会话项创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在创建对话项时返回。产生此事件的情况有以下几种：

  - 服务端正在生成 Response，如果成功将产生
    一个或两个 Item，它们的类型为 `message`
    (role `assistant`) 或类型 `function_call`.
  - 输入音频缓冲区已被提交，由客户端或
    服务端（处于 `server_vad` 模式）提交。服务端将获取
    输入音频缓冲区的内容，并将其添加到新的用户消息 Item 中。
  - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
    到该 Conversation。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    在 Conversation 上下文中前一个 Item 的 ID，用于让
    客户端了解对话的顺序。可以为 `null` ，如果该
    Item 没有前驱项。

### 对话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你想要从会话中移除某个条目时，发送此事件
  历史。服务端会响应一个 `conversation.item.deleted` 事件，
  除非该条目不存在于会话历史中，在这种情况下，
  服务端将返回错误。

  - `item_id: string`

    要删除的条目 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 对话项已删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当会话中的某个条目被客户端通过某个事件删除时返回。
  `conversation.item.delete` event. 此事件用于同步
  服务端对会话历史的理解与客户端的视图。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    已删除条目的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话项已完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  在某个对话项被定稿时返回。

  该事件会包含该项的完整内容，但音频数据除外；如需获取音频数据，可以使用 `conversation.item.retrieve` 事件。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    位于此项之前的 item 的 ID（如果有）。用于在
    插入 item 时保持顺序。

### 对话项输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  此事件是写入到用户音频缓冲区的音频转录输出
  用户音频缓冲区时启动的转录过程。
  由客户端或服务端在启用 VAD 时提交输入音频缓冲区后，转录即开始。转录过程
  与 Response 创建异步进行，因此此事件可能早于或晚于
  Response 事件到达。

  Realtime API 模型原生支持音频，因此输入转录是一个
  由单独的 ASR（自动语音识别）模型运行的独立过程。
  转录文本可能与模型的解释存在一定差异，
  应被视为大致参考。

  - `content_index: number`

    包含音频的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含正在转录的音频的条目的 ID。

  - `transcript: string`

    转录的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    转录的使用情况统计，按 ASR 模型的定价计费，而非 Realtime 模型的定价。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 使用量计费的模型的使用情况统计。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        使用情况对象的类型。对于此变体始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费输入 token 的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费的模型的使用情况统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        使用情况对象的类型。对于此变体始终为 `duration` 。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

    - `code: string`

      音频中检测到的某种语言的代码。

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

  当输入音频转录内容部分的文本值随增量转录结果更新时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含正在转录的音频的条目的 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    该项 content 数组中内容部分的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。可通过为会话配置 `"include": ["item.input_audio_transcription.logprobs"]`。来启用。数组中的每个条目对应于该转录片段可能选中的某个 token 的对数概率。这有助于判断在给定的转录片段中是否可能存在多个有效选项。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  在配置了输入音频转录、且用户消息的转录请求失败时返回。这些事件与其他事件是分开的，以便客户端可以识别相关的 Item。
  events so that the client can identify the related Item.
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

      错误的类型。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    用户消息条目的 ID。

  - `type: "conversation.item.input_audio_transcription.failed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.failed`.

    - `"conversation.item.input_audio_transcription.failed"`

### 会话项输入音频转录片段

- `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

  当为某个 item 识别出输入音频转写片段时返回。

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

### Conversation Item Retrieve Event

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你想检索服务器对会话历史中某个特定条目的表示时，发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
  服务器将响应一个 `conversation.item.retrieved` 事件，
  除非该条目不存在于会话历史中，在这种情况下，
  服务端将返回错误。

  - `item_id: string`

    要检索的条目 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件以截断之前的助手消息音频。服务端
  生成音频的速度快于实时，因此当用户
  中断以截断已发送到客户端但尚未
  播放的音频时，此事件非常有用。这会将服务端对音频的理解与
  客户端的播放保持一致。

  截断音频会删除 服务端 文本转录，以确保上下文中
  不会出现用户尚未听到的文本。

  如果成功，服务端将响应一个 `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    音频被截断的包含性时长（毫秒）。如果
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

    可选的客户端生成的 ID，用于标识此事件。

### 对话项目截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当较早的助手音频消息项被以下方式截断时返回：
  客户端通过 `conversation.item.truncate` 事件。此事件用于
  使服务端对音频的理解与客户端的播放保持同步。

  此操作将截断音频并移除 服务端 文本转录，
  以确保上下文中不存在用户尚未听到的文本。

  - `audio_end_ms: number`

    音频被截断的持续时长，单位为毫秒。

  - `content_index: number`

    被截断的内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被截断的助手消息项的 ID。

  - `type: "conversation.item.truncated"`

    事件类型，必须为 `conversation.item.truncated`.

    - `"conversation.item.truncated"`

### Conversation Item With Reference

- `ConversationItemWithReference object { id, arguments, call_id, 7 more }`

  要添加到对话中的项。

  - `id: optional string`

    对于类型为 (`message` | `function_call` | `function_call_output`)
    的项，此字段允许客户端分配该项的唯一 ID。它
    不是必需的，因为如果未提供，服务端会生成一个。

    对于类型为 `item_reference`，的项，此字段是必需的，并且是对该对话中先前存在的任意项的
    引用。

  - `arguments: optional string`

    函数调用的参数（适用于 `function_call` 项）。

  - `call_id: optional string`

    函数调用的 ID（适用于 `function_call` 和
    `function_call_output` 项）。如果在 `function_call_output`
    项上传递，服务端将检查对话历史中是否存在具有相同 `function_call` ID 的
    项。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 项。

    - 角色为 `system` 的消息项仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` 内容。

    - `id: optional string`

      要引用的先前对话项的 ID（用于 `item_reference`
      内容类型）在 `response.create` 事件中）。这些可以引用
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

    被调函数的名称（用于 `function_call` 项）。

  - `object: optional "realtime.item"`

    正在返回的 API 对象的标识符，始终为 `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    函数调用的输出（用于 `function_call_output` 项）。

  - `role: optional "user" or "assistant" or "system"`

    消息发送者的角色（`user`, `assistant`, `system`），仅
    适用于 `message` 项。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    项的状态（`completed`, `incomplete`, `in_progress`）。这些对对话没有影响
    ，但为了与以下内容保持一致而被接受
    `conversation.item.created` 事件时。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

  - `type: optional "message" or "function_call" or "function_call_output"`

    条目的类型（`message`, `function_call`, `function_call_output`, `item_reference`).

    - `"message"`

    - `"function_call"`

    - `"function_call_output"`

### Input Audio Buffer Append Event

- `InputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到输入音频缓冲区。该音频
  缓冲区是一种临时存储，你可以向其中写入内容并在稍后提交。“提交”会根据缓冲区内容新建一个
  用户消息项加入会话历史，并清空缓冲区。
  输入音频转录（如果启用）将在缓冲区被提交时生成。

  如果启用了 VAD，则会使用音频缓冲区来检测语音，并由服务端决定
  何时提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
  输入音频降噪作用于对音频缓冲区的写入操作。

  客户端可以自行决定每个事件放入多少音频，但每次最多
  15 MiB，例如从客户端流式传输较小的数据块可以让
  VAD 的响应更加及时。与大多数其他客户端事件不同，服务端
  不会针对此事件发送确认响应。

  - `audio: string`

    经过 Base64 编码的音频字节。其格式必须与会话配置中
    `input_audio_format` 字段所指定的格式一致。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区清除事件

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务端将
  响应一个 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区已清空事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  当客户端清除输入音频缓冲区时返回，伴随一个
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### Input Audio Buffer Commit Event

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端将自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会创建来自模型的响应。服务端将响应一个 `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### Input Audio Buffer Committed Event

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  当输入音频缓冲区被提交时返回，提交方可以是客户端，也可以是
  在服务端 VAD 模式下自动完成。item_id `item_id` 属性是将要创建的用户
  消息项的 ID，因此随后也会向 `conversation.item.created` 客户端发送
  一个 conversation.item.created 事件。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项将要插入到其之后的那个前导项的 ID。
    若该项没有 `null` 前导项，则可以为空。

### Input Audio Buffer Dtmf Event Received Event

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一种表示
  电话键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
  是用户按下的键盘按键。该 `received_at` 是 UTC Unix 时间戳
  ，表示服务器收到事件的时间。

  - `event: string`

    用户按下的电话键盘按键。

  - `received_at: number`

    服务器收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### 输入音频缓冲区语音开始事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  在以下情况下由服务端发送 `server_vad` 模式下，表示已在音频缓冲区中检测到语音。
  buffer (unless speech is already detected). The client may want to use this
  buffer (unless speech is already detected). The client may want to use this
  event to interrupt audio playback or provide visual feedback to the user.

  客户端应预期收到 `input_audio_buffer.speech_stopped` 客户端发送
  事件，当语音停止时。 `item_id` 属性是将在语音停止时创建的用户消息项的 ID
  并且也会包含在
  `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
  音频缓冲区）。

  - `audio_start_ms: number`

    自会话期间所有写入缓冲区的音频开始起，到首次检测到语音时的毫秒数。
    此值对应于发送给模型的音频的起始位置，因此包括
    发送给模型的音频的起始位置，因此包括
    `prefix_padding_ms` 在 Session 中配置的。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将在语音停止时创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  在以下情况下以 `server_vad` 模式返回：当服务端在
  音频缓冲区中检测到语音结束时，服务端还会发送一个包含由音频缓冲区创建的 `conversation.item.created`
  用户消息条目的事件。

  - `audio_end_ms: number`

    自会话开始起，语音停止时的毫秒数。该值
    对应发送给模型的音频结束时刻，因此包括
    `min_silence_duration_ms` 在 Session 中配置的。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将要创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  当输入音频缓冲区触发 Server VAD 超时时返回。该超时通过会话设置进行配置，并表示
  通过 `idle_timeout_ms` 在会话的 `turn_detection` 设置中进行配置，用于表示在配置的持续时间内
  未检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段用于表示从最后一次模型响应之后到触发时刻的音频片段，以写入输入音频缓冲区的音频起始位置为偏移量。
  也就是说，它标定了处于静音状态的音频片段，并且起始值与结束值之间的差值大致等于所配置的超时时长。
  也就是说，它标定了处于静音状态的音频片段，且起始值与结束值之间的差值大致等于所配置的超时时长。
  起始值与结束值之间的差值将大致匹配所配置的超时时长。

  空音频将作为 `input_audio` item 提交到对话中（会生成一个
  `input_audio_buffer.committed` event），并生成模型回复。可能存在未被 VAD 触发但仍被模型检测到的语音，因此模型可能会根据对话内容做出相关回应，或提示用户继续发言。
  something relevant to the conversation or a prompt to continue speaking.
  something relevant to the conversation or a prompt to continue speaking.

  - `audio_end_ms: number`

    触发超时时刻写入输入音频缓冲区的音频偏移量（毫秒）。

  - `audio_start_ms: number`

    写入输入音频缓冲区中、晚于上一次模型回复播放时间的音频偏移量（毫秒）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    与此音频段关联的 item 的 ID。

  - `type: "input_audio_buffer.timeout_triggered"`

    事件类型，必须为 `input_audio_buffer.timeout_triggered`.

    - `"input_audio_buffer.timeout_triggered"`

### 对数概率属性

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

  在某个项目上完成 MCP 工具列表列举时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列表工具项目的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp List Tools Failed

- `McpListToolsFailed object { event_id, item_id, type }`

  在列出某个项目的 MCP 工具失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列表工具项目的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp List Tools In Progress

- `McpListToolsInProgress object { event_id, item_id, type }`

  当某个项目的 MCP 工具列表正在获取时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列表工具项目的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 噪声抑制类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### Output Audio Buffer Clear Event

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP:** 发送以中断当前的音频响应。这将触发服务端
  停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
  事件应由一个 `response.cancel` 客户端事件触发，以停止当前
  响应的生成。
  [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### Rate Limits Updated Event

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，用于指示更新后的速率限制。
  创建 Response 时，会为输出“预留”一些 token
  ，此处显示的速率限制反映了该预留情况，随后会在
  Response 完成后相应地进行调整。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

    速率限制信息列表。

    - `limit: optional number`

      速率限制所允许的最大值。

    - `name: optional "requests" or "tokens"`

      速率限制的名称（`requests`, `tokens`).

      - `"requests"`

      - `"tokens"`

    - `remaining: optional number`

      达到限制之前的剩余值。

    - `reset_seconds: optional number`

      距离速率限制重置的秒数。

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
      降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时间。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
        将提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
        Prompt 不支持用于 `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      set to `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超时后将自动触发模型响应。这在
          用户长时间停顿属于异常情况的场景中很有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文。

          超时值将在上一次模型响应的音频播放完成后开始计算，
          即它的设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
          conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500ms。使用较小的值时，模型响应会更快，
          但可能会在用户短时停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值会要求更响亮的音频才能激活模型，因此在
          嘈杂环境下可能会有更好的表现。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当默认
          conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应速度相对于原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

      此参数是对生成后音频的后处理调整，也
      可以通过提示让模型说话更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
      一旦模型至少响应过一次音频后就不能更改。
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

          自定义语音 ID，例如。 `voice_1234`.

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
    降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本之前等待的时间。
      较高的值可以提高转写准确率，但会增加延迟。
      仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
      将提高准确率和延迟表现。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
      对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
      Prompt 不支持用于 `gpt-realtime-whisper` 。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    set to `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超时后将自动触发模型响应。这在
        用户长时间停顿属于异常情况的场景中很有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话，
        基于当前上下文。

        超时值将在上一次模型响应的音频播放完成后开始计算，
        即它的设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
        conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
        为 500ms。使用较小的值时，模型响应会更快，
        但可能会在用户短时停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值会要求更响亮的音频才能激活模型，因此在
        嘈杂环境下可能会有更好的表现。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来确定用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当默认
        conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

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

    模型语音回应速度相对于原始速度的倍数。
    1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

    此参数是对生成后音频的后处理调整，也
    可以通过提示让模型说话更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于回应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
    一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
    一旦模型至少响应过一次音频后就不能更改。
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

        自定义语音 ID，例如。 `voice_1234`.

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

  轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

  服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  set to `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

    - `type: "server_vad"`

      轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超时后将自动触发模型响应。这在
      用户长时间停顿属于异常情况的场景中很有用，例如电话
      通话。模型将根据当前上下文有效地提示用户继续对话，
      基于当前上下文。

      超时值将在上一次模型响应的音频播放完成后开始计算，
      即它的设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
      conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
      为 500ms。使用较小的值时，模型响应会更快，
      但可能会在用户短时停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值会要求更响亮的音频才能激活模型，因此在
      嘈杂环境下可能会有更好的表现。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来确定用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当默认
      conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

### 实时客户端事件

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向对话上下文添加新的 Item，包括消息、函数
    调用以及函数调用响应。该事件既可用于填充对话
    “的“历史记录”，也可在流式过程中添加新 item，但存在一个
    当前限制：它无法填充助手音频消息。

    如果成功，服务端将发出一个 `conversation.item.added` 事件，以及，
    在该 item 完成时发出一个 `conversation.item.done` 事件。否则将发送一个
    `error` 事件。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，适用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录，当输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        Realtime 对话中的一项函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        用于响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          被回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            有关该工具的附加注释。

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

        请求人工审批工具调用的 Realtime 项。

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

      可选的客户端生成的 ID，用于标识此事件。

    - `previous_item_id: optional string`

      新 item 将插入其后的前一个 item 的 ID。如果未设置，新 item 将追加到对话末尾。

      如果设置为 `root`，新 item 将被添加到对话开头。

      如果设置为现有的某个 ID，则可在对话中间插入一个 item。如果找不到该 ID，将返回错误，并且不会添加该 item。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你想要从会话中移除某个条目时，发送此事件
    历史。服务端会响应一个 `conversation.item.deleted` 事件，
    除非该条目不存在于会话历史中，在这种情况下，
    服务端将返回错误。

    - `item_id: string`

      要删除的条目 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你想检索服务器对会话历史中某个特定条目的表示时，发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
    服务器将响应一个 `conversation.item.retrieved` 事件，
    除非该条目不存在于会话历史中，在这种情况下，
    服务端将返回错误。

    - `item_id: string`

      要检索的条目 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件以截断之前的助手消息音频。服务端
    生成音频的速度快于实时，因此当用户
    中断以截断已发送到客户端但尚未
    播放的音频时，此事件非常有用。这会将服务端对音频的理解与
    客户端的播放保持一致。

    截断音频会删除 服务端 文本转录，以确保上下文中
    不会出现用户尚未听到的文本。

    如果成功，服务端将响应一个 `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      音频被截断的包含性时长（毫秒）。如果
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

      可选的客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到输入音频缓冲区。该音频
    缓冲区是一种临时存储，你可以向其中写入内容并在稍后提交。“提交”会根据缓冲区内容新建一个
    用户消息项加入会话历史，并清空缓冲区。
    输入音频转录（如果启用）将在缓冲区被提交时生成。

    如果启用了 VAD，则会使用音频缓冲区来检测语音，并由服务端决定
    何时提交。当服务端 VAD 被禁用时，你必须手动提交音频缓冲区。
    输入音频降噪作用于对音频缓冲区的写入操作。

    客户端可以自行决定每个事件放入多少音频，但每次最多
    15 MiB，例如从客户端流式传输较小的数据块可以让
    VAD 的响应更加及时。与大多数其他客户端事件不同，服务端
    不会针对此事件发送确认响应。

    - `audio: string`

      经过 Base64 编码的音频字节。其格式必须与会话配置中
      `input_audio_format` 字段所指定的格式一致。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务端将
    响应一个 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP:** 发送以中断当前的音频响应。这将触发服务端
    停止生成音频并发出一个 `output_audio_buffer.cleared` 事件。该
    事件应由一个 `response.cancel` 客户端事件触发，以停止当前
    响应的生成。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息项。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端将自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会创建来自模型的响应。服务端将响应一个 `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消进行中的响应。服务端将返回
    一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使没有
    响应正在进行，调用该事件也是安全的，即使没有响应正在进行也会返回错误，会话将保持不受影响。
    进行中的响应，调用也是安全的 `response.cancel` ，即使没有响应正在进行，也会返回错误，
    会话将保持不受影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

    - `response_id: optional string`

      要取消的特定响应 ID —— 如果未提供，则会取消默认对话中
      正在进行中的响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务端创建一个 Response，这意味着会触发模型推理。在 Server VAD 模式下，服务端将自动创建 Response。
    model inference. When in Server VAD mode, the server will create Responses
    automatically.

    一个 Response 至少包含一个 Item，也可能有两个，此时第二个是函数调用。默认情况下，这些 Item 会被追加到对话历史中。
    the second will be a function call. These Items will be appended to the
    conversation history by default.

    服务器将响应一个 `response.created` 事件，以及为创建的 Item
    和内容生成的事件，最后是一个 `response.done` 事件以表示
    Response 已完成。

    该 `response.create` 事件包含如下推理配置
    `instructions` 和 `tools`。如果设置了这些参数，它们将覆盖 Session 的
    配置，仅对本次 Response 生效。

    可以在默认 Conversation 之外创建 Response，这意味着 Response 可以
    接收任意输入，并且可以禁止将输出写入 Conversation。
    同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行
    创建多个 Response。 `metadata` 字段是区分同时运行的多个
    Response 的好方法。

    客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认
    Conversation 的 Response。可以使用 `input` 字段提供任意输入，该字段是一个数组，接受
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

            模型用于回应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
            一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
            一旦模型至少响应过一次音频后就不能更改。
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

                自定义语音 ID，例如。 `voice_1234`.

      - `conversation: optional string or "auto" or "none"`

        控制 response 被添加到哪个 conversation。目前支持
        `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
        表示响应的内容将添加到默认
        会话中。将其设置为 `none` 以创建一个不会
        向默认会话添加条目的带外响应。

        - `string`

        - `"auto" or "none"`

          控制 response 被添加到哪个 conversation。目前支持
          `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
          表示响应的内容将添加到默认
          会话中。将其设置为 `none` 以创建一个不会
          向默认会话添加条目的带外响应。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        包含在模型提示中的输入条目。使用此字段
        会为本次 Response 创建一个新上下文，而不是使用默认
        会话。空数组 `[]` 将清除本次 Response 的上下文。
        请注意，这可以包含对之前在会话中出现过的条目的引用，
        通过它们的 id 引用。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一项函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一项函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          用于响应 MCP 审批请求的 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工审批工具调用的 Realtime 项。

      - `instructions: optional string`

        在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“说话快速”、“在声音中注入情感”、“经常笑”）。模型不保证会遵循这些指令，但它们为模型期望的行为提供了指导。
        请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
        。 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        一组 16 个键值对，可以附加到对象上。这可以
        用于以结构化格式存储关于对象的附加信息，并通过
        API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串
        最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的值是
        `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
        输出设置为 mode `text` 将禁用模型的音频输出。

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

          用于替换提示中变量的可选值映射
          提示。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的一段文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          对支持推理的 Realtime 模型（如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间自行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

            该函数的描述，包括在何时以及如何调用它的指引，
            以及关于在调用时应向用户说明哪些内容的指引
            （若有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

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

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
            MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
            程序必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要获得批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一： `always` 或
              `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
              set to `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新任何字段
    除 `voice` 和 `model`. `voice` 只能在尚未产生其他音频输出时更新。

    当服务器收到 `session.update`，时，它会响应
    一个 `session.updated` 事件，显示完整且生效的配置。
    只有出现在 `session.update` 中的字段才会被更新。若要清除某个字段，例如
    `instructions`，传入一个空字符串。若要清除类似字段，请 `tools`，传入一个空数组。
    若要清除类似字段，请 `turn_detection`，传入 `null`.

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。选择 realtime
      会话或转录会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。Realtime API 始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在输出转写文本之前等待的时间。
                较高的值可以提高转写准确率，但会增加延迟。
                仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。在
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
                将提高准确率和延迟表现。

              - `languages: optional array of string`

                输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
                对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
                Prompt 不支持用于 `gpt-realtime-whisper` 。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              set to `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超时后将自动触发模型响应。这在
                  用户长时间停顿属于异常情况的场景中很有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话，
                  基于当前上下文。

                  超时值将在上一次模型响应的音频播放完成后开始计算，
                  即它的设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                  conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                  为 500ms。使用较小的值时，模型响应会更快，
                  但可能会在用户短时停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值会要求更响亮的音频才能激活模型，因此在
                  嘈杂环境下可能会有更好的表现。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来确定用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当默认
                  conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应速度相对于原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

              此参数是对生成后音频的后处理调整，也
              可以通过提示让模型说话更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型用于回应的声音。支持的内置声音有
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
              一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
              一旦模型至少响应过一次音频后就不能更改。
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

                  自定义语音 ID，例如。 `voice_1234`.

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          在服务端输出中包含的其他字段。

          `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

          请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。提供介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
          。 `inf`.

          - `number`

          - `"inf"`

            - `"inf"`

        - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          本次会话使用的 Realtime 模型。

          - `string`

          - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

            本次会话使用的 Realtime 模型。

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

          模型可以响应的模态集合。其默认值为 `["audio"]`，表示
          模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
          模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可以并行调用多个工具。仅支持
          推理 Realtime 模型，例如 `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `reasoning: optional RealtimeReasoning`

          适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
          函数/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个工具（若有）。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息与调用一个或
            多个工具之间自行选择。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项以强制模型调用某个特定的函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

        - `tools: optional RealtimeToolsConfig`

          模型可用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
            (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型，始终为 `mcp`.

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

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
              MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
              程序必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
              安全 MCP 隧道进行连接。

              当前支持 `connector_id` 的取值包括：

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

              此 MCP 工具是否为延迟加载并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要获得批准。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤器对象
                ，这些工具需要审批。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用的工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果一个
                    MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用的工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果一个
                    MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值之一： `always` 或
                `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
                set to `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
              `tunnel_id` 之一。

            - `tunnel_id: optional string`

              用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 之一。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
          追踪在会话中启用，相关配置将无法修改。

          `auto` 将为该会话创建一个追踪，并使用默认值作为
          工作流名称、group id 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            追踪的细粒度配置。

            - `group_id: optional string`

              附加到此追踪的 group id，用于在
              Traces Dashboard 中进行筛选和分组。

            - `metadata: optional unknown`

              附加到此追踪的任意元数据，用于在
              Traces Dashboard 中进行筛选。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称，用于
              在 Traces Dashboard 中为该追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

          客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

          截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

          也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

            - `retention_ratio: number`

              在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

              - `post_instructions: optional number`

                指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转录会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。Realtime API 始终为 `transcription` 用于转录会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              set to `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超时后将自动触发模型响应。这在
                  用户长时间停顿属于异常情况的场景中很有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话，
                  基于当前上下文。

                  超时值将在上一次模型响应的音频播放完成后开始计算，
                  即它的设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                  conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                  为 500ms。使用较小的值时，模型响应会更快，
                  但可能会在用户短时停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值会要求更响亮的音频才能激活模型，因此在
                  嘈杂环境下可能会有更好的表现。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来确定用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当默认
                  conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          在服务端输出中包含的其他字段。

          `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      由客户端生成的可选 ID，用于标识此事件。这是一个客户端可自行指定的任意字符串。如果该事件发生错误，该 ID 会被传回，但对应的 `session.updated` 事件将不会包含它。

### 实时对话项助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  Realtime 对话中的一条助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

    - `text: optional string`

      文本内容。

    - `transcript: optional string`

      音频内容的文字记录，当输出类型为 `audio`.

    - `type: optional "output_text" or "output_audio"`

      内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

      - `"output_text"`

      - `"output_audio"`

  - `role: "assistant"`

    消息发送方的角色。始终为 `assistant`.

    - `"assistant"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。这可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### 实时对话项函数调用

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  Realtime 对话中的一项函数调用项。

  - `arguments: string`

    函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    被调用的函数名称。

  - `type: "function_call"`

    条目的类型。始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

### 实时对话项函数调用输出

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  Realtime 对话中的一项函数调用输出项。

  - `call_id: string`

    此输出对应的函数调用的 ID。

  - `output: string`

    函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

  - `type: "function_call_output"`

    条目的类型。始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。这可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### 实时对话项系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。始终为 `input_text` ，适用于系统消息。

      - `"input_text"`

  - `role: "system"`

    消息发送方的角色。始终为 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。这可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### 实时对话项用户消息

- `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

  Realtime 对话中的用户消息条目。

  - `content: array of object { audio, detail, image_url, 3 more }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

    - `detail: optional "auto" or "low" or "high"`

      图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

    - `text: optional string`

      文本内容（用于 `input_text`).

    - `transcript: optional string`

      音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

    条目的唯一 ID。这可由客户端提供，也可由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### 实时错误

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

  在发生错误时返回，错误可能源自客户端问题，也可能源自服务端
  问题。大多数错误都是可恢复的，会话将保持打开状态，我们
  建议实现者默认对错误消息进行监控和记录。

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

    该函数的描述，包括在何时以及如何调用它的指引，
    以及关于在调用时应向用户说明哪些内容的指引
    （若有）。

  - `name: optional string`

    函数名称。

  - `parameters: optional unknown`

    使用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

### Realtime Mcp Approval Request

- `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

  请求人工审批工具调用的 Realtime 项。

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

  用于响应 MCP 审批请求的 Realtime 项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    被回复的审批请求的 ID。

  - `approve: boolean`

    请求是否已批准。

  - `type: "mcp_approval_response"`

    条目的类型。始终为 `mcp_approval_response`.

    - `"mcp_approval_response"`

  - `reason: optional string or null`

    可选的决策原因。

### Realtime Mcp List Tools

- `RealtimeMcpListTools object { server_label, tools, type, id }`

  一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

  - `server_label: string`

    MCP 服务器的标签。

  - `tools: array of object { input_schema, name, annotations, description }`

    服务器上可用的工具。

    - `input_schema: unknown`

      描述该工具输入的 JSON schema。

    - `name: string`

      工具的名称。

    - `annotations: optional unknown or null`

      有关该工具的附加注释。

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

  适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    对支持推理的 Realtime 模型（如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

### Realtime Reasoning Effort

- `RealtimeReasoningEffort = "minimal" or "low" or "medium" or 2 more`

  对支持推理的 Realtime 模型（如
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

        模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
        语音选项包括
        。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
        最佳音质。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
          语音选项包括
          。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

    响应被添加到哪个会话，由 `conversation`
    事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到默认会话，且
    的值将是一个类似 `conversation_id` 的 ID。如果
    `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有 `none`，响应将不会被添加到任何会话，且
    的值为 `conversation_id` 将是 `null`。如果响应是由 VAD
    自动触发的，则响应将被添加到默认会话

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    （包含工具调用），该会话用于本次响应。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    一组 16 个键值对，可以附加到对象上。这可以
    用于以结构化格式存储关于对象的附加信息，并通过
    API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    模型用于响应的模态集合，目前唯一可能的值是
    `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
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

    关于状态的更多详细信息。

    - `error: optional object { code, type }`

      导致响应失败的错误描述，
      在响应状态为 `status` 时填充。 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误的类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      Response 未完成的原因。对于 `cancelled` Response，值为以下之一： `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      字段 ( `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    Response 的用量统计信息，将用于计费。一个
    Realtime API 会话会维护对话上下文，并将新的
    Items 追加到该会话中，因此先前轮次的输出（文本和
    音频 tokens）将成为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      Response 所使用的输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次的 tokens，会作为上下文包含在当前响应中。这里的 Cached tokens 计入输入 tokens 的子集，也就是说，输入 tokens 包含了已缓存和未缓存的 tokens。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数量。

      - `cached_tokens: optional number`

        用作 Response 输入的已缓存 token 数量。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        有关用作 Response 输入的已缓存 token 的详细信息。

        - `audio_tokens: optional number`

          用作 Response 输入的已缓存音频 token 数量。

        - `image_tokens: optional number`

          用作 Response 输入的已缓存图像 token 数量。

        - `text_tokens: optional number`

          用作 Response 输入的已缓存文本 token 数量。

      - `image_tokens: optional number`

        用作 Response 输入的图像 token 数量。

      - `text_tokens: optional number`

        用作 Response 输入的文本 token 数量。

    - `input_tokens: optional number`

      Response 中使用的输入 token 数量，包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      有关 Response 中使用的输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数量。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数量。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数量，包括文本和
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

      模型用于回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
      一旦模型至少响应过一次音频后就不能更改。
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

          自定义语音 ID，例如。 `voice_1234`.

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

        模型用于回应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
        一旦模型至少响应过一次音频后就不能更改。
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

            自定义语音 ID，例如。 `voice_1234`.

  - `conversation: optional string or "auto" or "none"`

    控制 response 被添加到哪个 conversation。目前支持
    `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
    表示响应的内容将添加到默认
    会话中。将其设置为 `none` 以创建一个不会
    向默认会话添加条目的带外响应。

    - `string`

    - `"auto" or "none"`

      控制 response 被添加到哪个 conversation。目前支持
      `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
      表示响应的内容将添加到默认
      会话中。将其设置为 `none` 以创建一个不会
      向默认会话添加条目的带外响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    包含在模型提示中的输入条目。使用此字段
    会为本次 Response 创建一个新上下文，而不是使用默认
    会话。空数组 `[]` 将清除本次 Response 的上下文。
    请注意，这可以包含对之前在会话中出现过的条目的引用，
    通过它们的 id 引用。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“说话快速”、“在声音中注入情感”、“经常笑”）。模型不保证会遵循这些指令，但它们为模型期望的行为提供了指导。
    请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
    。 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    一组 16 个键值对，可以附加到对象上。这可以
    用于以结构化格式存储关于对象的附加信息，并通过
    API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的值是
    `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
    输出设置为 mode `text` 将禁用模型的音频输出。

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

      用于替换提示中变量的可选值映射
      提示。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的一段文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      对支持推理的 Realtime 模型（如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（若有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间自行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项以强制模型调用某个特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

        该函数的描述，包括在何时以及如何调用它的指引，
        以及关于在调用时应向用户说明哪些内容的指引
        （若有）。

      - `name: optional string`

        函数名称。

      - `parameters: optional unknown`

        使用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

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

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
        MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
        程序必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
        安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的取值包括：

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

        此 MCP 工具是否为延迟加载并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要获得批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤器对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值之一： `always` 或
          `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
          set to `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Realtime Response Status

- `RealtimeResponseStatus object { error, reason, type }`

  关于状态的更多详细信息。

  - `error: optional object { code, type }`

    导致响应失败的错误描述，
    在响应状态为 `status` 时填充。 `failed`.

    - `code: optional string`

      错误代码（如果有）。

    - `type: optional string`

      错误的类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    Response 未完成的原因。对于 `cancelled` Response，值为以下之一： `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致响应失败的错误类型，对应
    字段 ( `status` 字段（`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime Response Usage

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  Response 的用量统计信息，将用于计费。一个
  Realtime API 会话会维护对话上下文，并将新的
  Items 追加到该会话中，因此先前轮次的输出（文本和
  音频 tokens）将成为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    Response 所使用的输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次的 tokens，会作为上下文包含在当前响应中。这里的 Cached tokens 计入输入 tokens 的子集，也就是说，输入 tokens 包含了已缓存和未缓存的 tokens。

    - `audio_tokens: optional number`

      用作 Response 输入的音频 token 数量。

    - `cached_tokens: optional number`

      用作 Response 输入的已缓存 token 数量。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      有关用作 Response 输入的已缓存 token 的详细信息。

      - `audio_tokens: optional number`

        用作 Response 输入的已缓存音频 token 数量。

      - `image_tokens: optional number`

        用作 Response 输入的已缓存图像 token 数量。

      - `text_tokens: optional number`

        用作 Response 输入的已缓存文本 token 数量。

    - `image_tokens: optional number`

      用作 Response 输入的图像 token 数量。

    - `text_tokens: optional number`

      用作 Response 输入的文本 token 数量。

  - `input_tokens: optional number`

    Response 中使用的输入 token 数量，包括文本和
    音频 token。

  - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

    有关 Response 中使用的输出 token 的详细信息。

    - `audio_tokens: optional number`

      Response 中使用的音频 token 数量。

    - `text_tokens: optional number`

      Response 中使用的文本 token 数量。

  - `output_tokens: optional number`

    Response 中发送的输出 token 数量，包括文本和
    音频 token。

  - `total_tokens: optional number`

    Response 中的 token 总数，包括输入和输出
    文本及音频 token。

### Realtime Response Usage Input Token Details

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  Response 所使用的输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次的 tokens，会作为上下文包含在当前响应中。这里的 Cached tokens 计入输入 tokens 的子集，也就是说，输入 tokens 包含了已缓存和未缓存的 tokens。

  - `audio_tokens: optional number`

    用作 Response 输入的音频 token 数量。

  - `cached_tokens: optional number`

    用作 Response 输入的已缓存 token 数量。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    有关用作 Response 输入的已缓存 token 的详细信息。

    - `audio_tokens: optional number`

      用作 Response 输入的已缓存音频 token 数量。

    - `image_tokens: optional number`

      用作 Response 输入的已缓存图像 token 数量。

    - `text_tokens: optional number`

      用作 Response 输入的已缓存文本 token 数量。

  - `image_tokens: optional number`

    用作 Response 输入的图像 token 数量。

  - `text_tokens: optional number`

    用作 Response 输入的文本 token 数量。

### Realtime Response Usage Output Token Details

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  有关 Response 中使用的输出 token 的详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数量。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数量。

### Realtime Server Event

- `RealtimeServerEvent = ConversationCreatedEvent or ConversationItemCreatedEvent or ConversationItemDeletedEvent or 43 more`

  一个实时服务端事件。

  - `ConversationCreatedEvent object { conversation, event_id, type }`

    在创建会话时返回。会话创建后立即发出。

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

    - 服务端正在生成 Response，如果成功将产生
      一个或两个 Item，它们的类型为 `message`
      (role `assistant`) 或类型 `function_call`.
    - 输入音频缓冲区已被提交，由客户端或
      服务端（处于 `server_vad` 模式）提交。服务端将获取
      输入音频缓冲区的内容，并将其添加到新的用户消息 Item 中。
    - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
      到该 Conversation。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，适用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录，当输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        Realtime 对话中的一项函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        用于响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          被回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            有关该工具的附加注释。

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

        请求人工审批工具调用的 Realtime 项。

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

      在 Conversation 上下文中前一个 Item 的 ID，用于让
      客户端了解对话的顺序。可以为 `null` ，如果该
      Item 没有前驱项。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当会话中的某个条目被客户端通过某个事件删除时返回。
    `conversation.item.delete` event. 此事件用于同步
    服务端对会话历史的理解与客户端的视图。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      已删除条目的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    此事件是写入到用户音频缓冲区的音频转录输出
    用户音频缓冲区时启动的转录过程。
    由客户端或服务端在启用 VAD 时提交输入音频缓冲区后，转录即开始。转录过程
    与 Response 创建异步进行，因此此事件可能早于或晚于
    Response 事件到达。

    Realtime API 模型原生支持音频，因此输入转录是一个
    由单独的 ASR（自动语音识别）模型运行的独立过程。
    转录文本可能与模型的解释存在一定差异，
    应被视为大致参考。

    - `content_index: number`

      包含音频的内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含正在转录的音频的条目的 ID。

    - `transcript: string`

      转录的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      转录的使用情况统计，按 ASR 模型的定价计费，而非 Realtime 模型的定价。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 使用量计费的模型的使用情况统计。

        - `input_tokens: number`

          本次请求计费的输入 token 数。

        - `output_tokens: number`

          生成的输出 token 数。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          使用情况对象的类型。对于此变体始终为 `tokens` 。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          本次请求计费输入 token 的详细信息。

          - `audio_tokens: optional number`

            本次请求计费的音频 token 数量。

          - `text_tokens: optional number`

            本次请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费的模型的使用情况统计。

        - `seconds: number`

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          使用情况对象的类型。对于此变体始终为 `duration` 。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

      - `code: string`

        音频中检测到的某种语言的代码。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

    当输入音频转录内容部分的文本值随增量转录结果更新时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含正在转录的音频的条目的 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      该项 content 数组中内容部分的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。可通过为会话配置 `"include": ["item.input_audio_transcription.logprobs"]`。来启用。数组中的每个条目对应于该转录片段可能选中的某个 token 的对数概率。这有助于判断在给定的转录片段中是否可能存在多个有效选项。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    在配置了输入音频转录、且用户消息的转录请求失败时返回。这些事件与其他事件是分开的，以便客户端可以识别相关的 Item。
    events so that the client can identify the related Item.
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

        错误的类型。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      用户消息条目的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    在使用以下方式检索会话项时返回： `conversation.item.retrieve`。这是获取服务端对项的表示的一种方式，例如用于在噪声消除和 VAD 之后访问经过后处理的音频数据。它包含该项的完整内容，包括音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当较早的助手音频消息项被以下方式截断时返回：
    客户端通过 `conversation.item.truncate` 事件。此事件用于
    使服务端对音频的理解与客户端的播放保持同步。

    此操作将截断音频并移除 服务端 文本转录，
    以确保上下文中不存在用户尚未听到的文本。

    - `audio_end_ms: number`

      音频被截断的持续时长，单位为毫秒。

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

    在发生错误时返回，错误可能源自客户端问题，也可能源自服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认对错误消息进行监控和记录。

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

    当客户端清除输入音频缓冲区时返回，伴随一个
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    当输入音频缓冲区被提交时返回，提交方可以是客户端，也可以是
    在服务端 VAD 模式下自动完成。item_id `item_id` 属性是将要创建的用户
    消息项的 ID，因此随后也会向 `conversation.item.created` 客户端发送
    一个 conversation.item.created 事件。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项将要插入到其之后的那个前导项的 ID。
      若该项没有 `null` 前导项，则可以为空。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅限 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一种表示
    电话键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
    是用户按下的键盘按键。该 `received_at` 是 UTC Unix 时间戳
    ，表示服务器收到事件的时间。

    - `event: string`

      用户按下的电话键盘按键。

    - `received_at: number`

      服务器收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    在以下情况下由服务端发送 `server_vad` 模式下，表示已在音频缓冲区中检测到语音。
    buffer (unless speech is already detected). The client may want to use this
    buffer (unless speech is already detected). The client may want to use this
    event to interrupt audio playback or provide visual feedback to the user.

    客户端应预期收到 `input_audio_buffer.speech_stopped` 客户端发送
    事件，当语音停止时。 `item_id` 属性是将在语音停止时创建的用户消息项的 ID
    并且也会包含在
    `input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
    音频缓冲区）。

    - `audio_start_ms: number`

      自会话期间所有写入缓冲区的音频开始起，到首次检测到语音时的毫秒数。
      此值对应于发送给模型的音频的起始位置，因此包括
      发送给模型的音频的起始位置，因此包括
      `prefix_padding_ms` 在 Session 中配置的。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将在语音停止时创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    在以下情况下以 `server_vad` 模式返回：当服务端在
    音频缓冲区中检测到语音结束时，服务端还会发送一个包含由音频缓冲区创建的 `conversation.item.created`
    用户消息条目的事件。

    - `audio_end_ms: number`

      自会话开始起，语音停止时的毫秒数。该值
      对应发送给模型的音频结束时刻，因此包括
      `min_silence_duration_ms` 在 Session 中配置的。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将要创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示更新后的速率限制。
    创建 Response 时，会为输出“预留”一些 token
    ，此处显示的速率限制反映了该预留情况，随后会在
    Response 完成后相应地进行调整。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `rate_limits: array of object { limit, name, remaining, reset_seconds }`

      速率限制信息列表。

      - `limit: optional number`

        速率限制所允许的最大值。

      - `name: optional "requests" or "tokens"`

        速率限制的名称（`requests`, `tokens`).

        - `"requests"`

        - `"tokens"`

      - `remaining: optional number`

        达到限制之前的剩余值。

      - `reset_seconds: optional number`

        距离速率限制重置的秒数。

    - `type: "rate_limits.updated"`

      事件类型，必须为 `rate_limits.updated`.

      - `"rate_limits.updated"`

  - `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

    在模型生成的音频更新时返回。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `delta: string`

      Base64 编码的音频数据增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.delta"`

      事件类型，必须为 `response.output_audio.delta`.

      - `"response.output_audio.delta"`

  - `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

    在模型生成的音频完成时返回。在 Response
    被中断、未完成或取消时也会发出。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio.done"`

      事件类型，必须为 `response.output_audio.done`.

      - `"response.output_audio.done"`

  - `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

    在模型生成的音频输出转写更新时返回。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `delta: string`

      转写增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_audio_transcript.delta"`

      事件类型，必须为 `response.output_audio_transcript.delta`.

      - `"response.output_audio_transcript.delta"`

  - `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

    在模型生成的音频输出转写完成时返回。流式
    转写结束时也会发出。在 Response 被中断、未完成或
    取消时也会发出。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `transcript: string`

      音频的最终转写文本。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    在响应生成过程中，向助手消息项添加新的内容部分时返回。
    响应生成。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      添加内容部分的项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `part: object { audio, text, transcript, type }`

      已添加的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果 type 为 "audio"）。

      - `text: optional string`

        文本内容（如果 type 为 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果 type 为 "audio"）。

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

    在助手消息项中，当某个内容部分流式传输完成时返回。
    也会在 Response 被中断、未完成或取消时发出。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `part: object { audio, text, transcript, type }`

      已完成的内容部分。

      - `audio: optional string`

        Base64 编码的音频数据（如果 type 为 "audio"）。

      - `text: optional string`

        文本内容（如果 type 为 "text"）。

      - `transcript: optional string`

        音频的转录文本（如果 type 为 "audio"）。

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

    在创建新的 Response 时返回。Response 创建过程中的第一个事件，
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

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
              语音选项包括
              。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

        响应被添加到哪个会话，由 `conversation`
        事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到默认会话，且
        的值将是一个类似 `conversation_id` 的 ID。如果
        `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有 `none`，响应将不会被添加到任何会话，且
        的值为 `conversation_id` 将是 `null`。如果响应是由 VAD
        自动触发的，则响应将被添加到默认会话

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        （包含工具调用），该会话用于本次响应。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        一组 16 个键值对，可以附加到对象上。这可以
        用于以结构化格式存储关于对象的附加信息，并通过
        API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串
        最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        响应生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的一条助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的一项函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的一项函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          用于响应 MCP 审批请求的 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工审批工具调用的 Realtime 项。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前唯一可能的值是
        `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
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

        关于状态的更多详细信息。

        - `error: optional object { code, type }`

          导致响应失败的错误描述，
          在响应状态为 `status` 时填充。 `failed`.

          - `code: optional string`

            错误代码（如果有）。

          - `type: optional string`

            错误的类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          Response 未完成的原因。对于 `cancelled` Response，值为以下之一： `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致响应失败的错误类型，对应
          字段 ( `status` 字段（`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        Response 的用量统计信息，将用于计费。一个
        Realtime API 会话会维护对话上下文，并将新的
        Items 追加到该会话中，因此先前轮次的输出（文本和
        音频 tokens）将成为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          Response 所使用的输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次的 tokens，会作为上下文包含在当前响应中。这里的 Cached tokens 计入输入 tokens 的子集，也就是说，输入 tokens 包含了已缓存和未缓存的 tokens。

          - `audio_tokens: optional number`

            用作 Response 输入的音频 token 数量。

          - `cached_tokens: optional number`

            用作 Response 输入的已缓存 token 数量。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            有关用作 Response 输入的已缓存 token 的详细信息。

            - `audio_tokens: optional number`

              用作 Response 输入的已缓存音频 token 数量。

            - `image_tokens: optional number`

              用作 Response 输入的已缓存图像 token 数量。

            - `text_tokens: optional number`

              用作 Response 输入的已缓存文本 token 数量。

          - `image_tokens: optional number`

            用作 Response 输入的图像 token 数量。

          - `text_tokens: optional number`

            用作 Response 输入的文本 token 数量。

        - `input_tokens: optional number`

          Response 中使用的输入 token 数量，包括文本和
          音频 token。

        - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

          有关 Response 中使用的输出 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中使用的音频 token 数量。

          - `text_tokens: optional number`

            Response 中使用的文本 token 数量。

        - `output_tokens: optional number`

          Response 中发送的输出 token 数量，包括文本和
          音频 token。

        - `total_tokens: optional number`

          Response 中的 token 总数，包括输入和输出
          文本及音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    在 Response 流式传输完成时返回。无论最终的
    状态如何，都始终会发出该事件。该事件中包含的 Response 对象 `response.done` 将
    包含 Response 中所有的输出项，但会省略原始音频数据。

    客户端应检查 Response 的 `status` 字段以判断 Response 是否成功
    (`completed`）或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

    Response 将包含在响应过程中生成的所有输出项，不包括
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

      参数增量，以 JSON 字符串表示。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.function_call_arguments.delta"`

      事件类型，必须为 `response.function_call_arguments.delta`.

      - `"response.function_call_arguments.delta"`

  - `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

    当模型生成的函数调用参数流式传输完成时返回。
    也会在 Response 被中断、未完成或取消时发出。

    - `arguments: string`

      最终参数，以 JSON 字符串形式呈现。

    - `call_id: string`

      函数调用的 ID。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `name: string`

      被调用的函数名称。

    - `output_index: number`

      响应中输出项的索引。

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

    当 Item 流式传输完成时返回。当 Response 被
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

      该项 content 数组中内容部分的索引。

    - `delta: string`

      文本增量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.output_text.delta"`

      事件类型，必须为 `response.output_text.delta`.

      - `"response.output_text.delta"`

  - `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

    当 "output_text" 内容部分的文本值流式传输完成时返回。当
    Response 被中断、未完成或取消时也会发出。

    - `content_index: number`

      该项 content 数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `text: string`

      最终的文本内容。

    - `type: "response.output_text.done"`

      事件类型，必须为 `response.output_text.done`.

      - `"response.output_text.done"`

  - `SessionCreatedEvent object { event_id, session, type }`

    创建 Session 时返回。在新
    连接建立时，作为首个服务端事件自动发出。该事件将包含
    默认的 Session 配置。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        一个 Realtime 会话配置对象。

        - `id: string`

          会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

        - `object: "realtime.session"`

          对象类型。始终为 `realtime.session`.

          - `"realtime.session"`

        - `type: "realtime"`

          要创建的会话类型。Realtime API 始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }  or null`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
              对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }  or null`

              输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

              - `language: optional string or null`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

              轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

              服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
              set to `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超时后将自动触发模型响应。这在
                  用户长时间停顿属于异常情况的场景中很有用，例如电话
                  通话。模型将根据当前上下文有效地提示用户继续对话，
                  基于当前上下文。

                  超时值将在上一次模型响应的音频播放完成后开始计算，
                  即它的设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                  conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                  如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                  毫秒为单位）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                  为 500ms。使用较小的值时，模型响应会更快，
                  但可能会在用户短时停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值会要求更响亮的音频才能激活模型，因此在
                  嘈杂环境下可能会有更好的表现。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来确定用户何时结束说话。

                - `type: "semantic_vad"`

                  轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当默认
                  conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音回应速度相对于原始速度的倍数。
              1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

              此参数是对生成后音频的后处理调整，也
              可以通过提示让模型说话更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
              语音选项包括
              。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
              最佳音质。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
                语音选项包括
                。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
                `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

          会话的过期时间戳，自纪元起以秒为单位。

        - `include: optional array of "item.input_audio_transcription.logprobs" or null`

          在服务端输出中包含的其他字段。

          `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

          请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。提供介于 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
          。 `inf`.

          - `number`

          - `"inf"`

            - `"inf"`

        - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          本次会话使用的 Realtime 模型。

          - `string`

          - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

            本次会话使用的 Realtime 模型。

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

          模型可以响应的模态集合。其默认值为 `["audio"]`，表示
          模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
          模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            用于替换提示中变量的可选值映射
            提示。替换值可以是字符串，也可以是其他
            响应输入类型，例如图像或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的一段文本输入。

              - `text: string`

                模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

              - `detail: ImageDetail`

                发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                输入项的类型。始终为 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                发送给模型的文件的 ID。

              - `image_url: optional string or null`

                发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

                标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

          - `version: optional string or null`

            提示模板的可选版本。

        - `reasoning: optional RealtimeReasoning`

          适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

          - `effort: optional RealtimeReasoningEffort`

            对支持推理的 Realtime 模型（如
            `gpt-realtime-2`.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

        - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

          模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
          函数/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个工具（若有）。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息与调用一个或
            多个工具之间自行选择。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项以强制模型调用某个特定的函数。

            - `name: string`

              要调用的函数名称。

            - `type: "function"`

              对于函数调用，类型始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

              该函数的描述，包括在何时以及如何调用它的指引，
              以及关于在调用时应向用户说明哪些内容的指引
              （若有）。

            - `name: optional string`

              函数名称。

            - `parameters: optional unknown`

              使用 JSON Schema 表示的函数参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
            (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型，始终为 `mcp`.

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

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
              MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
              程序必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
              使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
              安全 MCP 隧道进行连接。

              当前支持 `connector_id` 的取值包括：

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

              此 MCP 工具是否为延迟加载并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要获得批准。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤器对象
                ，这些工具需要审批。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用的工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果一个
                    MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用的工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或是否为只读。如果一个
                    MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值之一： `always` 或
                `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
                set to `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
              `tunnel_id` 之一。

            - `tunnel_id: optional string`

              用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 之一。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
          追踪在会话中启用，相关配置将无法修改。

          `auto` 将为该会话创建一个追踪，并使用默认值作为
          工作流名称、group id 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            追踪的细粒度配置。

            - `group_id: optional string`

              附加到此追踪的 group id，用于在
              Traces Dashboard 中进行筛选和分组。

            - `metadata: optional unknown`

              附加到此追踪的任意元数据，用于在
              Traces Dashboard 中进行筛选。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称，用于
              在 Traces Dashboard 中为该追踪命名。

        - `truncation: optional RealtimeTruncation`

          当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

          客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

          截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

          也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

          - `"auto" or "disabled"`

            用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

            - `retention_ratio: number`

              在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

              - `post_instructions: optional number`

                指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        一个 Realtime 转录会话配置对象。

        - `id: string`

          会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

        - `object: string`

          对象类型。始终为 `realtime.transcription_session`.

        - `type: "transcription"`

          会话的类型。始终为 `transcription` 用于转录会话。

          - `"transcription"`

        - `audio: optional object { input }`

          该会话的输入音频配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }  or null`

              输入音频降噪配置。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }  or null`

              转录模型的配置。

              - `language: optional string or null`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
              VAD 意味着模型将基于
              音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                VAD 检测到的语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                用于检测语音停止的静默持续时间（以毫秒为单位）。默认
                为 500ms。使用较小的值时，模型响应会更快，
                但可能会在用户短时停顿时插话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                高的阈值会要求更响亮的音频才能激活模型，因此在
                嘈杂环境下可能会有更好的表现。

              - `type: optional string`

                轮次检测的类型，仅 `server_vad` 当前受支持。

        - `expires_at: optional number`

          会话的过期时间戳，自纪元起以秒为单位。

        - `include: optional array of "item.input_audio_transcription.logprobs" or null`

          在服务端输出中包含的其他字段。

          - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话通过以下事件更新时返回， `session.update` 事件，除非出现
    错误。

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

    **仅限 WebRTC/SIP:** 在服务器开始向客户端流式传输音频时发出。此事件在向响应中添加音频内容部分（
    ）之后发出。`response.content_part.added`)
    到响应后发出。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅限 WebRTC/SIP:** 在服务端上的输出音频缓冲区已完全清空、不再产生音频时发出。此事件在完整响应数据全部发送到客户端（
    ）之后发出。
    ）之后发出。`response.done`).
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP:** 当输出音频缓冲区被清空时发出。这发生在 VAD 模式下用户中断（
    ）时，或者当客户端发出（`input_audio_buffer.speech_started`),
    事件以手动 `output_audio_buffer.clear` 截断当前音频响应时。
    时。
    [了解更多](/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当有 Item 被添加到默认 Conversation 时由服务端发送。以下几种情况都可能触发该事件：

    - 当客户端发送 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。此时该 item 将是一条用户消息，其中包含缓冲区中的音频。
    - 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此此时它还没有任何内容（且 `status` 将是 `in_progress`).

    该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），但音频数据除外，必要时可通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      位于此项之前的 item 的 ID（如果有）。用于在
      插入 item 时保持顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    在某个对话项被定稿时返回。

    该事件会包含该项的完整内容，但音频数据除外；如需获取音频数据，可以使用 `conversation.item.retrieve` 事件。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      位于此项之前的 item 的 ID（如果有）。用于在
      插入 item 时保持顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    当输入音频缓冲区触发 Server VAD 超时时返回。该超时通过会话设置进行配置，并表示
    通过 `idle_timeout_ms` 在会话的 `turn_detection` 设置中进行配置，用于表示在配置的持续时间内
    未检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段用于表示从最后一次模型响应之后到触发时刻的音频片段，以写入输入音频缓冲区的音频起始位置为偏移量。
    也就是说，它标定了处于静音状态的音频片段，并且起始值与结束值之间的差值大致等于所配置的超时时长。
    也就是说，它标定了处于静音状态的音频片段，且起始值与结束值之间的差值大致等于所配置的超时时长。
    起始值与结束值之间的差值将大致匹配所配置的超时时长。

    空音频将作为 `input_audio` item 提交到对话中（会生成一个
    `input_audio_buffer.committed` event），并生成模型回复。可能存在未被 VAD 触发但仍被模型检测到的语音，因此模型可能会根据对话内容做出相关回应，或提示用户继续发言。
    something relevant to the conversation or a prompt to continue speaking.
    something relevant to the conversation or a prompt to continue speaking.

    - `audio_end_ms: number`

      触发超时时刻写入输入音频缓冲区的音频偏移量（毫秒）。

    - `audio_start_ms: number`

      写入输入音频缓冲区中、晚于上一次模型回复播放时间的音频偏移量（毫秒）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      与此音频段关联的 item 的 ID。

    - `type: "input_audio_buffer.timeout_triggered"`

      事件类型，必须为 `input_audio_buffer.timeout_triggered`.

      - `"input_audio_buffer.timeout_triggered"`

  - `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

    当为某个 item 识别出输入音频转写片段时返回。

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

    当某个项目的 MCP 工具列表正在获取时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列表工具项目的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    在某个项目上完成 MCP 工具列表列举时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列表工具项目的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    在列出某个项目的 MCP 工具失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列表工具项目的 ID。

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

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `type: "response.mcp_call_arguments.delta"`

      事件类型，必须为 `response.mcp_call_arguments.delta`.

      - `"response.mcp_call_arguments.delta"`

    - `obfuscation: optional string or null`

      如果存在，表示该增量文本经过混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成过程中 MCP 工具调用参数最终确定时返回。

    - `arguments: string`

      最终的 JSON 编码参数字符串。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 工具调用项的 ID。

    - `output_index: number`

      响应中输出项的索引。

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

      响应中输出项的索引。

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

      响应中输出项的索引。

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

      响应中输出项的索引。

    - `type: "response.mcp_call.failed"`

      事件类型，必须为 `response.mcp_call.failed`.

      - `"response.mcp_call.failed"`

### Realtime Session

- `RealtimeSession object { id, expires_at, include, 17 more }`

  用于 beta 接口的 Realtime 会话对象。

  - `id: optional string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，自纪元起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    在服务端输出中包含的其他字段。

    - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`,输入音频必须为 16 位 PCM,采样率为 24kHz,
    单声道(单轨),并且采用小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

    - `language: optional string or null`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

    在模型调用之前添加的默认系统指令(即系统消息)
    。此字段允许客户端指导模型给出所需的
    响应。可以指示模型回复的内容和格式,
    (例如 "极其简洁"、"表现得友好"、"以下是好回复的
    示例"),以及音频行为(例如 "说话快一点"、"在声音中
    注入情感"、"经常大笑")。这些指令并不会被
    模型严格遵循,但它们为模型提供了关于期望行为的
    指导。

    注意,服务端会设置默认指令,如果该
    字段未设置,则会使用这些默认指令,它们会在 `session.created` 事件的会话开始时
    显示。

  - `max_response_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
    。 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2025-08-28" or 13 more`

    本次会话使用的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2025-08-28" or 13 more`

      本次会话使用的 Realtime 模型。

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

    输出音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`,输出音频的采样率为 24kHz。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于替换提示中变量的可选值映射
      提示。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的一段文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音回复的语速。1.0 为默认语速，0.25 是
    最低语速，1.5 是最高语速。该值只能在模型轮次之间更改，不能在响应进行中修改。
    在响应进行中时无法更改。

  - `temperature: optional number`

    模型的采样温度，限定范围为 [0.6, 1.2]。对于音频模型，强烈建议将温度设为 0.8 以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      该函数的描述，包括在何时以及如何调用它的指引，
      以及关于在调用时应向用户说明哪些内容的指引
      （若有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    追踪 的配置选项。设为 null 可禁用追踪。一旦
    追踪在会话中启用，相关配置将无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值作为
    工作流名称、group id 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的 group id，用于在
        在追踪面板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在
        在追踪面板中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称，用于
        在追踪面板中为追踪命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    set to `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超时后将自动触发模型响应。这在
        用户长时间停顿属于异常情况的场景中很有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话，
        基于当前上下文。

        超时值将在上一次模型响应的音频播放完成后开始计算，
        即它的设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
        conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
        为 500ms。使用较小的值时，模型响应会更快，
        但可能会在用户短时停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值会要求更响亮的音频才能激活模型，因此在
        嘈杂环境下可能会有更好的表现。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来确定用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当默认
        conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
    语音选项包括
    。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
      语音选项包括
      。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    要创建的会话类型。Realtime API 始终为 `realtime` 。

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
        降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本之前等待的时间。
          较高的值可以提高转写准确率，但会增加延迟。
          仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
          将提高准确率和延迟表现。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
          对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
          Prompt 不支持用于 `gpt-realtime-whisper` 。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        set to `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超时后将自动触发模型响应。这在
            用户长时间停顿属于异常情况的场景中很有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话，
            基于当前上下文。

            超时值将在上一次模型响应的音频播放完成后开始计算，
            即它的设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
            conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500ms。使用较小的值时，模型响应会更快，
            但可能会在用户短时停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值会要求更响亮的音频才能激活模型，因此在
            嘈杂环境下可能会有更好的表现。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来确定用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当默认
            conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应速度相对于原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

        此参数是对生成后音频的后处理调整，也
        可以通过提示让模型说话更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
        一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
        一旦模型至少响应过一次音频后就不能更改。
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

            自定义语音 ID，例如。 `voice_1234`.

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的其他字段。

    `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

    请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
    。 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    本次会话使用的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      本次会话使用的 Realtime 模型。

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

    模型可以响应的模态集合。其默认值为 `["audio"]`，表示
    模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
    模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

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

      用于替换提示中变量的可选值映射
      提示。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的一段文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      对支持推理的 Realtime 模型（如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional RealtimeToolChoiceConfig`

    模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（若有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间自行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项以强制模型调用某个特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

        该函数的描述，包括在何时以及如何调用它的指引，
        以及关于在调用时应向用户说明哪些内容的指引
        （若有）。

      - `name: optional string`

        函数名称。

      - `parameters: optional unknown`

        使用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

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

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
        MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
        程序必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
        安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的取值包括：

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

        此 MCP 工具是否为延迟加载并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要获得批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤器对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值之一： `always` 或
          `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
          set to `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
    追踪在会话中启用，相关配置将无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值作为
    工作流名称、group id 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的 group id，用于在
        Traces Dashboard 中进行筛选和分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在
        Traces Dashboard 中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称，用于
        在 Traces Dashboard 中为该追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

    客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

    截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

    也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

      - `retention_ratio: number`

        在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

        - `post_instructions: optional number`

          指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（若有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或
    多个工具之间自行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项以强制模型调用某个特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

      该函数的描述，包括在何时以及如何调用它的指引，
      以及关于在调用时应向用户说明哪些内容的指引
      （若有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

    - `type: "mcp"`

      MCP 工具的类型，始终为 `mcp`.

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

        用于指定允许使用的工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或是否为只读。如果一个
          MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
      MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
      程序必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
      安全 MCP 隧道进行连接。

      当前支持 `connector_id` 的取值包括：

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

      此 MCP 工具是否为延迟加载并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要获得批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一： `always` 或
        `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
        set to `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
  (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      该函数的描述，包括在何时以及如何调用它的指引，
      以及关于在调用时应向用户说明哪些内容的指引
      （若有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

    - `type: "mcp"`

      MCP 工具的类型，始终为 `mcp`.

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

        用于指定允许使用的工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或是否为只读。如果一个
          MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
      MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
      程序必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
      安全 MCP 隧道进行连接。

      当前支持 `connector_id` 的取值包括：

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

      此 MCP 工具是否为延迟加载并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要获得批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一： `always` 或
        `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
        set to `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Realtime Tracing Config

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
  追踪在会话中启用，相关配置将无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值作为
  工作流名称、group id 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的 group id，用于在
      Traces Dashboard 中进行筛选和分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在
      Traces Dashboard 中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称，用于
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

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时间。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
        将提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
        Prompt 不支持用于 `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      set to `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超时后将自动触发模型响应。这在
          用户长时间停顿属于异常情况的场景中很有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文。

          超时值将在上一次模型响应的音频播放完成后开始计算，
          即它的设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
          conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500ms。使用较小的值时，模型响应会更快，
          但可能会在用户短时停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值会要求更响亮的音频才能激活模型，因此在
          嘈杂环境下可能会有更好的表现。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当默认
          conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

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
    降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
    对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在输出转写文本之前等待的时间。
      较高的值可以提高转写准确率，但会增加延迟。
      仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。在
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
      将提高准确率和延迟表现。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
      对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
      Prompt 不支持用于 `gpt-realtime-whisper` 。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

    服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
    set to `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超时后将自动触发模型响应。这在
        用户长时间停顿属于异常情况的场景中很有用，例如电话
        通话。模型将根据当前上下文有效地提示用户继续对话，
        基于当前上下文。

        超时值将在上一次模型响应的音频播放完成后开始计算，
        即它的设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
        conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

        如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
        为 500ms。使用较小的值时，模型响应会更快，
        但可能会在用户短时停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值会要求更响亮的音频才能激活模型，因此在
        嘈杂环境下可能会有更好的表现。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来确定用户何时结束说话。

      - `type: "semantic_vad"`

        轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当默认
        conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

  服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
  set to `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

    - `type: "server_vad"`

      轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超时后将自动触发模型响应。这在
      用户长时间停顿属于异常情况的场景中很有用，例如电话
      通话。模型将根据当前上下文有效地提示用户继续对话，
      基于当前上下文。

      超时值将在上一次模型响应的音频播放完成后开始计算，
      即它的设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
      conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

      如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
      为 500ms。使用较小的值时，模型响应会更快，
      但可能会在用户短时停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值会要求更响亮的音频才能激活模型，因此在
      嘈杂环境下可能会有更好的表现。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来确定用户何时结束说话。

    - `type: "semantic_vad"`

      轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当默认
      conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

### Realtime Transcription Session Create Request

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转录会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。Realtime API 始终为 `transcription` 用于转录会话。

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
        降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在输出转写文本之前等待的时间。
          较高的值可以提高转写准确率，但会增加延迟。
          仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。在
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
          将提高准确率和延迟表现。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
          对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
          Prompt 不支持用于 `gpt-realtime-whisper` 。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        set to `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超时后将自动触发模型响应。这在
            用户长时间停顿属于异常情况的场景中很有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话，
            基于当前上下文。

            超时值将在上一次模型响应的音频播放完成后开始计算，
            即它的设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
            conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500ms。使用较小的值时，模型响应会更快，
            但可能会在用户短时停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值会要求更响亮的音频才能激活模型，因此在
            嘈杂环境下可能会有更好的表现。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来确定用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当默认
            conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的其他字段。

    `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  Realtime 翻译的客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。翻译
    会话支持对以下字段进行更新： `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置
      的参数无法通过 `session.update`.

      - `audio: optional object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 可将其禁用。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍然基于
            输入音频流运行。

            - `model: string`

              用于源转录增量（deltas）的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译后输出音频和转录增量的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端原始音频字节。不受支持的 websocket 音频格式会返回
    验证错误，因为质量较低的音频会显著降低翻译
    质量。

    翻译消耗 200 ms 的引擎帧。为获得最佳实时表现，请按
    音频以 200 ms 为一块。如果一个块更短，服务端会缓存它，直到攒满一帧的音频。如果一个块更长，服务端会将其拆分为
    200 ms 的帧，并将它们按顺序入队。
    200 ms 的帧，并将它们按顺序入队。

    在会话处于活跃状态期间，持续追加静音。如果客户端停止发送
    音频后再恢复，模型会将恢复后的音频视为与先前音频连续，
    而不是视为实际发生的停顿。

    - `audio: string`

      Base64 编码的 24 kHz PCM16 单声道音频字节。

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    优雅地关闭实时翻译会话。服务端会刷新待处理的
    输入音频，并在关闭前发出所有剩余的翻译输出。
    会话。

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      可选的客户端生成的 ID，用于标识此事件。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建一个翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话持续流式传入源语言音频
    并持续流式输出翻译后的音频以及转录文本增量。

    - `model: string`

      此会话所使用的 Realtime 翻译模型。

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 可将其禁用。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流运行。

          - `model: string`

            用于源转录增量（deltas）的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥的过期配置。过期时间指的是在此之后
    客户端密钥将不再可用于创建会话的时间点。已创建的会话在
    该时间之后开始后仍可继续运行。在到期之前，一个密钥可用于创建多个会话
    。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点时间，表示将把一个偏移量 `seconds` 加到客户端密钥的 `created_at` 时间上以生成过期时间戳。仅 `created_at` 当前受支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点时间到过期的秒数。可选择的取值范围介于 `10` 和 `7200` （2 小时）之间。若未指定，默认值为 600 秒（10 分钟）。

### Realtime Translation Client Secret Create Response

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  通过为 Realtime API 创建翻译会话和客户端密钥所返回的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续地将输入
    音频翻译成所配置的目标语言。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自纪元起以秒为单位。

    - `model: string`

      此会话所使用的 Realtime 翻译模型。该字段在
      会话创建时设定，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话始终为 `translation` 。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation Input Audio Buffer Append Event

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端原始音频字节。不受支持的 websocket 音频格式会返回
  验证错误，因为质量较低的音频会显著降低翻译
  质量。

  翻译消耗 200 ms 的引擎帧。为获得最佳实时表现，请按
  音频以 200 ms 为一块。如果一个块更短，服务端会缓存它，直到攒满一帧的音频。如果一个块更长，服务端会将其拆分为
  200 ms 的帧，并将它们按顺序入队。
  200 ms 的帧，并将它们按顺序入队。

  在会话处于活跃状态期间，持续追加静音。如果客户端停止发送
  音频后再恢复，模型会将恢复后的音频视为与先前音频连续，
  而不是视为实际发生的停顿。

  - `audio: string`

    Base64 编码的 24 kHz PCM16 单声道音频字节。

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### Realtime Translation Input Transcript Delta Event

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当可选的源语言转录文本可用时返回。该事件
  仅在配置了 `audio.input.transcription` 时才会发出。

  转录增量是仅追加的文本片段。客户端不应在增量之间
  插入无条件的空格。

  - `delta: string`

    仅追加的源语言转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的计时元数据，源自翻译帧
    （当可用时）。该计时以 200 毫秒为增量递增，但多个转录
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转录增量标识符。

### Realtime 翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  在翻译后的输出音频可用时返回。该 `delta` 包含一个
  PCM16 音频块，其长度可能会有所不同。客户端应对完整的
  增量进行解码并排队处理，而不是假定固定的字节数或采样数。

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

    用于流对齐的计时元数据，源自翻译帧
    在可用时提供。将 `elapsed_ms` 视为对齐元数据，而非唯一的
    事件标识符。

  - `format: optional "pcm16"`

    音频的编码格式 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频增量的采样率。

### Realtime Translation Output Transcript Delta Event

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当翻译后的转写文本可用时返回。

  转录增量是仅追加的文本片段。客户端不应在增量之间
  插入无条件的空格。

  - `delta: string`

    翻译后输出音频的仅追加转写文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的计时元数据，源自翻译帧
    （当可用时）。该计时以 200 毫秒为增量递增，但多个转录
    增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转录增量标识符。

### Realtime Translation Server Event

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  Realtime 翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能源自客户端问题，也可能源自服务端
    问题。大多数错误都是可恢复的，会话将保持打开状态，我们
    建议实现者默认对错误消息进行监控和记录。

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

    在创建翻译会话时返回。在建立
    新连接时作为第一个服务端事件自动发出。该事件包含
    默认的翻译会话配置。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeTranslationSession`

      翻译会话配置。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `audio: object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { model }  or null`

            可选的源语言转录。配置后，服务端会发出
            `session.input_transcript.delta` 事件。翻译本身仍然基于
            输入音频流运行。

            - `model: string`

              用于源转录增量数据的转录模型。

        - `output: optional object { language }`

          - `language: optional string`

            翻译后输出音频和转录增量的目标语言。

      - `expires_at: number`

        会话的过期时间戳，自纪元起以秒为单位。

      - `model: string`

        此会话所使用的 Realtime 翻译模型。该字段在
        会话创建时设定，且无法通过 `session.update`.

      - `type: "translation"`

        会话类型。对于 Realtime 翻译会话始终为 `translation` 。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    在翻译会话通过 `session.update` 事件，
    更新时返回，除非发生错误。

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
    仅在配置了 `audio.input.transcription` 时才会发出。

    转录增量是仅追加的文本片段。客户端不应在增量之间
    插入无条件的空格。

    - `delta: string`

      仅追加的源语言转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的计时元数据，源自翻译帧
      （当可用时）。该计时以 200 毫秒为增量递增，但多个转录
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当翻译后的转写文本可用时返回。

    转录增量是仅追加的文本片段。客户端不应在增量之间
    插入无条件的空格。

    - `delta: string`

      翻译后输出音频的仅追加转写文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的计时元数据，源自翻译帧
      （当可用时）。该计时以 200 毫秒为增量递增，但多个转录
      增量可能共享相同的 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    在翻译后的输出音频可用时返回。该 `delta` 包含一个
    PCM16 音频块，其长度可能会有所不同。客户端应对完整的
    增量进行解码并排队处理，而不是假定固定的字节数或采样数。

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

      用于流对齐的计时元数据，源自翻译帧
      在可用时提供。将 `elapsed_ms` 视为对齐元数据，而非唯一的
      事件标识符。

    - `format: optional "pcm16"`

      音频的编码格式 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频增量的采样率。

### Realtime Translation Session

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  一个 Realtime 翻译会话。翻译会话会持续地将输入
  音频翻译成所配置的目标语言。

  - `id: string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流运行。

        - `model: string`

          用于源转录增量数据的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量的目标语言。

  - `expires_at: number`

    会话的过期时间戳，自纪元起以秒为单位。

  - `model: string`

    此会话所使用的 Realtime 翻译模型。该字段在
    会话创建时设定，且无法通过 `session.update`.

  - `type: "translation"`

    会话类型。对于 Realtime 翻译会话始终为 `translation` 。

    - `"translation"`

### Realtime Translation Session Close Event

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  优雅地关闭实时翻译会话。服务端会刷新待处理的
  输入音频，并在关闭前发出所有剩余的翻译输出。
  会话。

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

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

  Realtime 翻译会话配置。翻译会话持续流式传入源语言音频
  并持续流式输出翻译后的音频以及转录文本增量。

  - `model: string`

    此会话所使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 可将其禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流运行。

        - `model: string`

          用于源转录增量（deltas）的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量的目标语言。

### Realtime Translation Session Created Event

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在创建翻译会话时返回。在建立
  新连接时作为第一个服务端事件自动发出。该事件包含
  默认的翻译会话配置。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeTranslationSession`

    翻译会话配置。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自纪元起以秒为单位。

    - `model: string`

      此会话所使用的 Realtime 翻译模型。该字段在
      会话创建时设定，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话始终为 `translation` 。

      - `"translation"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### Realtime Translation Session Update Event

- `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新翻译会话配置。翻译
  会话支持对以下字段进行更新： `audio.output.language`, `audio.input.transcription`,
  和 `audio.input.noise_reduction`.

  - `session: RealtimeTranslationSessionUpdateRequest`

    要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置
    的参数无法通过 `session.update`.

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 可将其禁用。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流运行。

          - `model: string`

            用于源转录增量（deltas）的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### Realtime Translation Session Update Request

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可使用以下方式更新的实时翻译会话字段 `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 可将其禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流运行。

        - `model: string`

          用于源转录增量（deltas）的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量的目标语言。

### Realtime Translation Session Updated 事件

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  在翻译会话通过 `session.update` 事件，
  更新时返回，除非发生错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeTranslationSession`

    翻译会话配置。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自纪元起以秒为单位。

    - `model: string`

      此会话所使用的 Realtime 翻译模型。该字段在
      会话创建时设定，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话始终为 `translation` 。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime Truncation

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

  客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

  截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

  也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

      - `post_instructions: optional number`

        指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Response Audio Delta 事件

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  在模型生成的音频更新时返回。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `delta: string`

    Base64 编码的音频数据增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.delta"`

    事件类型，必须为 `response.output_audio.delta`.

    - `"response.output_audio.delta"`

### Response Audio Done 事件

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  在模型生成的音频完成时返回。在 Response
  被中断、未完成或取消时也会发出。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio.done"`

    事件类型，必须为 `response.output_audio.done`.

    - `"response.output_audio.done"`

### Response Audio Transcript Delta 事件

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  在模型生成的音频输出转写更新时返回。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `delta: string`

    转写增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_audio_transcript.delta"`

    事件类型，必须为 `response.output_audio_transcript.delta`.

    - `"response.output_audio_transcript.delta"`

### Response Audio Transcript Done 事件

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  在模型生成的音频输出转写完成时返回。流式
  转写结束时也会发出。在 Response 被中断、未完成或
  取消时也会发出。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `transcript: string`

    音频的最终转写文本。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### Response Cancel 事件

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件以取消进行中的响应。服务端将返回
  一个 `response.done` 事件，其状态为 `response.status=cancelled`。如果没有可取消的响应，服务端将返回错误。即使没有
  响应正在进行，调用该事件也是安全的，即使没有响应正在进行也会返回错误，会话将保持不受影响。
  进行中的响应，调用也是安全的 `response.cancel` ，即使没有响应正在进行，也会返回错误，
  会话将保持不受影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

  - `response_id: optional string`

    要取消的特定响应 ID —— 如果未提供，则会取消默认对话中
    正在进行中的响应。

### Response Content Part Added 事件

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  在响应生成过程中，向助手消息项添加新的内容部分时返回。
  响应生成。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    添加内容部分的项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `part: object { audio, text, transcript, type }`

    已添加的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果 type 为 "audio"）。

    - `text: optional string`

      文本内容（如果 type 为 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果 type 为 "audio"）。

    - `type: optional "audio" or "text"`

      内容类型（"text"、"audio"）。

      - `"audio"`

      - `"text"`

  - `response_id: string`

    响应的 ID。

  - `type: "response.content_part.added"`

    事件类型，必须为 `response.content_part.added`.

    - `"response.content_part.added"`

### Response Content Part Done 事件

- `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

  在助手消息项中，当某个内容部分流式传输完成时返回。
  也会在 Response 被中断、未完成或取消时发出。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `part: object { audio, text, transcript, type }`

    已完成的内容部分。

    - `audio: optional string`

      Base64 编码的音频数据（如果 type 为 "audio"）。

    - `text: optional string`

      文本内容（如果 type 为 "text"）。

    - `transcript: optional string`

      音频的转录文本（如果 type 为 "audio"）。

    - `type: optional "audio" or "text"`

      内容类型（"text"、"audio"）。

      - `"audio"`

      - `"text"`

  - `response_id: string`

    响应的 ID。

  - `type: "response.content_part.done"`

    事件类型，必须为 `response.content_part.done`.

    - `"response.content_part.done"`

### Response Create 事件

- `ResponseCreateEvent object { type, event_id, response }`

  此事件指示服务端创建一个 Response，这意味着会触发模型推理。在 Server VAD 模式下，服务端将自动创建 Response。
  model inference. When in Server VAD mode, the server will create Responses
  automatically.

  一个 Response 至少包含一个 Item，也可能有两个，此时第二个是函数调用。默认情况下，这些 Item 会被追加到对话历史中。
  the second will be a function call. These Items will be appended to the
  conversation history by default.

  服务器将响应一个 `response.created` 事件，以及为创建的 Item
  和内容生成的事件，最后是一个 `response.done` 事件以表示
  Response 已完成。

  该 `response.create` 事件包含如下推理配置
  `instructions` 和 `tools`。如果设置了这些参数，它们将覆盖 Session 的
  配置，仅对本次 Response 生效。

  可以在默认 Conversation 之外创建 Response，这意味着 Response 可以
  接收任意输入，并且可以禁止将输出写入 Conversation。
  同一时间只能有一个 Response 写入默认 Conversation，但除此之外可以并行
  创建多个 Response。 `metadata` 字段是区分同时运行的多个
  Response 的好方法。

  客户端可以设置 `conversation` 为 `none` 以创建一个不写入默认
  Conversation 的 Response。可以使用 `input` 字段提供任意输入，该字段是一个数组，接受
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

          模型用于回应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
          一旦模型至少响应过一次音频后就不能更改。
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

              自定义语音 ID，例如。 `voice_1234`.

    - `conversation: optional string or "auto" or "none"`

      控制 response 被添加到哪个 conversation。目前支持
      `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
      表示响应的内容将添加到默认
      会话中。将其设置为 `none` 以创建一个不会
      向默认会话添加条目的带外响应。

      - `string`

      - `"auto" or "none"`

        控制 response 被添加到哪个 conversation。目前支持
        `auto` 和 `none`，其中 `auto` 作为默认值。该 `auto` 值
        表示响应的内容将添加到默认
        会话中。将其设置为 `none` 以创建一个不会
        向默认会话添加条目的带外响应。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      包含在模型提示中的输入条目。使用此字段
      会为本次 Response 创建一个新上下文，而不是使用默认
      会话。空数组 `[]` 将清除本次 Response 的上下文。
      请注意，这可以包含对之前在会话中出现过的条目的引用，
      通过它们的 id 引用。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，适用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录，当输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        Realtime 对话中的一项函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        用于响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          被回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            有关该工具的附加注释。

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

        请求人工审批工具调用的 Realtime 项。

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

      在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“说话快速”、“在声音中注入情感”、“经常笑”）。模型不保证会遵循这些指令，但它们为模型期望的行为提供了指导。
      请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
      。 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      一组 16 个键值对，可以附加到对象上。这可以
      用于以结构化格式存储关于对象的附加信息，并通过
      API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串
      最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前唯一可能的值是
      `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
      输出设置为 mode `text` 将禁用模型的音频输出。

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

        用于替换提示中变量的可选值映射
        提示。替换值可以是字符串，也可以是其他
        响应输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的一段文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（若有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        多个工具之间自行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项以强制模型调用某个特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

          该函数的描述，包括在何时以及如何调用它的指引，
          以及关于在调用时应向用户说明哪些内容的指引
          （若有）。

        - `name: optional string`

          函数名称。

        - `parameters: optional unknown`

          使用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

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

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
          MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
          程序必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值包括：

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

          此 MCP 工具是否为延迟加载并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要获得批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值之一： `always` 或
            `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
            set to `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

### Response Created 事件

- `ResponseCreatedEvent object { event_id, response, type }`

  在创建新的 Response 时返回。Response 创建过程中的第一个事件，
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

          模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
          语音选项包括
          。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
          最佳音质。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

      响应被添加到哪个会话，由 `conversation`
      事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到默认会话，且
      的值将是一个类似 `conversation_id` 的 ID。如果
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有 `none`，响应将不会被添加到任何会话，且
      的值为 `conversation_id` 将是 `null`。如果响应是由 VAD
      自动触发的，则响应将被添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      （包含工具调用），该会话用于本次响应。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      一组 16 个键值对，可以附加到对象上。这可以
      用于以结构化格式存储关于对象的附加信息，并通过
      API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串
      最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，适用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录，当输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        Realtime 对话中的一项函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        用于响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          被回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            有关该工具的附加注释。

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

        请求人工审批工具调用的 Realtime 项。

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

      模型用于响应的模态集合，目前唯一可能的值是
      `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
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

      关于状态的更多详细信息。

      - `error: optional object { code, type }`

        导致响应失败的错误描述，
        在响应状态为 `status` 时填充。 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于 `cancelled` Response，值为以下之一： `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段 ( `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的用量统计信息，将用于计费。一个
      Realtime API 会话会维护对话上下文，并将新的
      Items 追加到该会话中，因此先前轮次的输出（文本和
      音频 tokens）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 所使用的输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次的 tokens，会作为上下文包含在当前响应中。这里的 Cached tokens 计入输入 tokens 的子集，也就是说，输入 tokens 包含了已缓存和未缓存的 tokens。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数量。

        - `cached_tokens: optional number`

          用作 Response 输入的已缓存 token 数量。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          有关用作 Response 输入的已缓存 token 的详细信息。

          - `audio_tokens: optional number`

            用作 Response 输入的已缓存音频 token 数量。

          - `image_tokens: optional number`

            用作 Response 输入的已缓存图像 token 数量。

          - `text_tokens: optional number`

            用作 Response 输入的已缓存文本 token 数量。

        - `image_tokens: optional number`

          用作 Response 输入的图像 token 数量。

        - `text_tokens: optional number`

          用作 Response 输入的文本 token 数量。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数量，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        有关 Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数量。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数量。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数量，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的 token 总数，包括输入和输出
        文本及音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### Response Done 事件

- `ResponseDoneEvent object { event_id, response, type }`

  在 Response 流式传输完成时返回。无论最终的
  状态如何，都始终会发出该事件。该事件中包含的 Response 对象 `response.done` 将
  包含 Response 中所有的输出项，但会省略原始音频数据。

  客户端应检查 Response 的 `status` 字段以判断 Response 是否成功
  (`completed`）或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  Response 将包含在响应过程中生成的所有输出项，不包括
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

          模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
          语音选项包括
          。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
          最佳音质。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

      响应被添加到哪个会话，由 `conversation`
      事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到默认会话，且
      的值将是一个类似 `conversation_id` 的 ID。如果
      `conv_1234`。如果没有可取消的响应，服务端将返回错误。即使没有 `none`，响应将不会被添加到任何会话，且
      的值为 `conversation_id` 将是 `null`。如果响应是由 VAD
      自动触发的，则响应将被添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      （包含工具调用），该会话用于本次响应。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      一组 16 个键值对，可以附加到对象上。这可以
      用于以结构化格式存储关于对象的附加信息，并通过
      API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串
      最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      响应生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。始终为 `input_text` ，适用于系统消息。

            - `"input_text"`

        - `role: "system"`

          消息发送方的角色。始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

            经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录，当输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送方的角色。始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的一项函数调用项。

        - `arguments: string`

          函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用的函数名称。

        - `type: "function_call"`

          条目的类型。始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

        Realtime 对话中的一项函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

        - `type: "function_call_output"`

          条目的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。这可由客户端提供，也可由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

        用于响应 MCP 审批请求的 Realtime 项。

        - `id: string`

          审批响应的唯一 ID。

        - `approval_request_id: string`

          被回复的审批请求的 ID。

        - `approve: boolean`

          请求是否已批准。

        - `type: "mcp_approval_response"`

          条目的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `reason: optional string or null`

          可选的决策原因。

      - `RealtimeMcpListTools object { server_label, tools, type, id }`

        一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述该工具输入的 JSON schema。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            有关该工具的附加注释。

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

        请求人工审批工具调用的 Realtime 项。

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

      模型用于响应的模态集合，目前唯一可能的值是
      `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
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

      关于状态的更多详细信息。

      - `error: optional object { code, type }`

        导致响应失败的错误描述，
        在响应状态为 `status` 时填充。 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于 `cancelled` Response，值为以下之一： `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一 `max_output_tokens` 或 `content_filter`  （服务端安全过滤器被触发并截断了响应）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致响应失败的错误类型，对应
        字段 ( `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的用量统计信息，将用于计费。一个
      Realtime API 会话会维护对话上下文，并将新的
      Items 追加到该会话中，因此先前轮次的输出（文本和
      音频 tokens）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 所使用的输入 tokens 的详细信息。Cached tokens 是来自对话先前轮次的 tokens，会作为上下文包含在当前响应中。这里的 Cached tokens 计入输入 tokens 的子集，也就是说，输入 tokens 包含了已缓存和未缓存的 tokens。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数量。

        - `cached_tokens: optional number`

          用作 Response 输入的已缓存 token 数量。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          有关用作 Response 输入的已缓存 token 的详细信息。

          - `audio_tokens: optional number`

            用作 Response 输入的已缓存音频 token 数量。

          - `image_tokens: optional number`

            用作 Response 输入的已缓存图像 token 数量。

          - `text_tokens: optional number`

            用作 Response 输入的已缓存文本 token 数量。

        - `image_tokens: optional number`

          用作 Response 输入的图像 token 数量。

        - `text_tokens: optional number`

          用作 Response 输入的文本 token 数量。

      - `input_tokens: optional number`

        Response 中使用的输入 token 数量，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        有关 Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数量。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数量。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数量，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中的 token 总数，包括输入和输出
        文本及音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### Response Function Call Arguments Delta 事件

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  在模型生成的函数调用参数被更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    参数增量，以 JSON 字符串表示。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.delta"`

    事件类型，必须为 `response.function_call_arguments.delta`.

    - `"response.function_call_arguments.delta"`

### Response Function Call Arguments Done 事件

- `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

  当模型生成的函数调用参数流式传输完成时返回。
  也会在 Response 被中断、未完成或取消时发出。

  - `arguments: string`

    最终参数，以 JSON 字符串形式呈现。

  - `call_id: string`

    函数调用的 ID。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `name: string`

    被调用的函数名称。

  - `output_index: number`

    响应中输出项的索引。

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

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.mcp_call_arguments.delta"`

    事件类型，必须为 `response.mcp_call_arguments.delta`.

    - `"response.mcp_call_arguments.delta"`

  - `obfuscation: optional string or null`

    如果存在，表示该增量文本经过混淆处理。

### Response Mcp Call Arguments Done

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成过程中 MCP 工具调用参数最终确定时返回。

  - `arguments: string`

    最终的 JSON 编码参数字符串。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出项的索引。

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

    响应中输出项的索引。

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

    响应中输出项的索引。

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

    响应中输出项的索引。

  - `type: "response.mcp_call.in_progress"`

    事件类型，必须为 `response.mcp_call.in_progress`.

    - `"response.mcp_call.in_progress"`

### Response Output Item Added 事件

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  在 Response 生成过程中创建新的 Item 时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

  当 Item 流式传输完成时返回。当 Response 被
  中断、未完成或取消时也会发出。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。它与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大修改，请使用 instructions；而对于较小的更新（例如“用户现在正在询问不同的话题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` ，适用于系统消息。

          - `"input_text"`

      - `role: "system"`

        消息发送方的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道格式。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`），以 data URI 形式提供。例如： `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。该内容不会发送给模型，但会附加到消息项中以供参考。

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

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

          经过 Base64 编码的音频字节，将按会话输出音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 时取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送方的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一项函数调用项。

      - `arguments: string`

        函数调用的参数。这是一段 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用的函数名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

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

      Realtime 对话中的一项函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，也可以包含任何信息或为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可由客户端提供，也可由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符——始终为 `realtime.item`. 创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      用于响应 MCP 审批请求的 Realtime 项。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        被回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 项，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的附加注释。

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

      请求人工审批工具调用的 Realtime 项。

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

    该项 content 数组中内容部分的索引。

  - `delta: string`

    文本增量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.output_text.delta"`

    事件类型，必须为 `response.output_text.delta`.

    - `"response.output_text.delta"`

### Response 文本完成事件

- `ResponseTextDoneEvent object { content_index, event_id, item_id, 4 more }`

  当 "output_text" 内容部分的文本值流式传输完成时返回。当
  Response 被中断、未完成或取消时也会发出。

  - `content_index: number`

    该项 content 数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `text: string`

    最终的文本内容。

  - `type: "response.output_text.done"`

    事件类型，必须为 `response.output_text.done`.

    - `"response.output_text.done"`

### 会话创建事件

- `SessionCreatedEvent object { event_id, session, type }`

  创建 Session 时返回。在新
  连接建立时，作为首个服务端事件自动发出。该事件将包含
  默认的 Session 配置。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。Realtime API 始终为 `realtime` 。

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
            降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

            轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            set to `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超时后将自动触发模型响应。这在
                用户长时间停顿属于异常情况的场景中很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文。

                超时值将在上一次模型响应的音频播放完成后开始计算，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500ms。使用较小的值时，模型响应会更快，
                但可能会在用户短时停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值会要求更响亮的音频才能激活模型，因此在
                嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认
                conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

            此参数是对生成后音频的后处理调整，也
            可以通过提示让模型说话更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
              语音选项包括
              。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        在服务端输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
        。 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        本次会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          本次会话使用的 Realtime 模型。

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

        模型可以响应的模态集合。其默认值为 `["audio"]`，表示
        模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于替换提示中变量的可选值映射
          提示。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的一段文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          对支持推理的 Realtime 模型（如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间自行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

            该函数的描述，包括在何时以及如何调用它的指引，
            以及关于在调用时应向用户说明哪些内容的指引
            （若有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

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

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
            MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
            程序必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要获得批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一： `always` 或
              `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
              set to `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        追踪在会话中启用，相关配置将无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值作为
        工作流名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的 group id，用于在
            Traces Dashboard 中进行筛选和分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在
            Traces Dashboard 中进行筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称，用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

        截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

        也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      一个 Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型。始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        该会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
            VAD 意味着模型将基于
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到的语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默持续时间（以毫秒为单位）。默认
              为 500ms。使用较小的值时，模型响应会更快，
              但可能会在用户短时停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值会要求更响亮的音频才能激活模型，因此在
              嘈杂环境下可能会有更好的表现。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        在服务端输出中包含的其他字段。

        - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 会话更新事件

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新任何字段
  除 `voice` 和 `model`. `voice` 只能在尚未产生其他音频输出时更新。

  当服务器收到 `session.update`，时，它会响应
  一个 `session.updated` 事件，显示完整且生效的配置。
  只有出现在 `session.update` 中的字段才会被更新。若要清除某个字段，例如
  `instructions`，传入一个空字符串。若要清除类似字段，请 `tools`，传入一个空数组。
  若要清除类似字段，请 `turn_detection`，传入 `null`.

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。选择 realtime
    会话或转录会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。Realtime API 始终为 `realtime` 。

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
            降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在输出转写文本之前等待的时间。
              较高的值可以提高转写准确率，但会增加延迟。
              仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。在
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
              将提高准确率和延迟表现。

            - `languages: optional array of string`

              输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
              对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
              Prompt 不支持用于 `gpt-realtime-whisper` 。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            set to `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超时后将自动触发模型响应。这在
                用户长时间停顿属于异常情况的场景中很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文。

                超时值将在上一次模型响应的音频播放完成后开始计算，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500ms。使用较小的值时，模型响应会更快，
                但可能会在用户短时停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值会要求更响亮的音频才能激活模型，因此在
                嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认
                conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

            此参数是对生成后音频的后处理调整，也
            可以通过提示让模型说话更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于回应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
            一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
            一旦模型至少响应过一次音频后就不能更改。
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

                自定义语音 ID，例如。 `voice_1234`.

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
        。 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        本次会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          本次会话使用的 Realtime 模型。

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

        模型可以响应的模态集合。其默认值为 `["audio"]`，表示
        模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

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

          用于替换提示中变量的可选值映射
          提示。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的一段文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          对支持推理的 Realtime 模型（如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional RealtimeToolChoiceConfig`

        模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间自行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

            该函数的描述，包括在何时以及如何调用它的指引，
            以及关于在调用时应向用户说明哪些内容的指引
            （若有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

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

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
            MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
            程序必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要获得批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一： `always` 或
              `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
              set to `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        追踪在会话中启用，相关配置将无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值作为
        工作流名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的 group id，用于在
            Traces Dashboard 中进行筛选和分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在
            Traces Dashboard 中进行筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称，用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

        截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

        也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转录会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。Realtime API 始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            set to `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超时后将自动触发模型响应。这在
                用户长时间停顿属于异常情况的场景中很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文。

                超时值将在上一次模型响应的音频播放完成后开始计算，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500ms。使用较小的值时，模型响应会更快，
                但可能会在用户短时停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值会要求更响亮的音频才能激活模型，因此在
                嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认
                conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    由客户端生成的可选 ID，用于标识此事件。这是一个客户端可自行指定的任意字符串。如果该事件发生错误，该 ID 会被传回，但对应的 `session.updated` 事件将不会包含它。

### 会话已更新事件

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话通过以下事件更新时返回， `session.update` 事件，除非出现
  错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。Realtime API 始终为 `realtime` 。

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
            降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

            轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            set to `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超时后将自动触发模型响应。这在
                用户长时间停顿属于异常情况的场景中很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文。

                超时值将在上一次模型响应的音频播放完成后开始计算，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500ms。使用较小的值时，模型响应会更快，
                但可能会在用户短时停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值会要求更响亮的音频才能激活模型，因此在
                嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认
                conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

            此参数是对生成后音频的后处理调整，也
            可以通过提示让模型说话更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
              语音选项包括
              。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        在服务端输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
        。 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        本次会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          本次会话使用的 Realtime 模型。

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

        模型可以响应的模态集合。其默认值为 `["audio"]`，表示
        模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于替换提示中变量的可选值映射
          提示。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的一段文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          对支持推理的 Realtime 模型（如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间自行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

            该函数的描述，包括在何时以及如何调用它的指引，
            以及关于在调用时应向用户说明哪些内容的指引
            （若有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

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

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
            MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
            程序必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要获得批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一： `always` 或
              `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
              set to `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        追踪在会话中启用，相关配置将无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值作为
        工作流名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的 group id，用于在
            Traces Dashboard 中进行筛选和分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在
            Traces Dashboard 中进行筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称，用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

        截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

        也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      一个 Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型。始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        该会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
            VAD 意味着模型将基于
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到的语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默持续时间（以毫秒为单位）。默认
              为 500ms。使用较小的值时，模型响应会更快，
              但可能会在用户短时停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值会要求更响亮的音频才能激活模型，因此在
              嘈杂环境下可能会有更好的表现。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        在服务端输出中包含的其他字段。

        - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### 转写会话更新

- `TranscriptionSessionUpdate object { session, type, event_id }`

  发送此事件以更新转写会话。

  - `session: object { include, input_audio_format, input_audio_noise_reduction, 2 more }`

    实时转录会话对象配置。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要在转写中包含的项目集合。当前可用的项目包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`,输入音频必须为 16 位 PCM,采样率为 24kHz,
      单声道(单轨),并且采用小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转写的配置。客户端可以选择性地设置转写的语言和 prompt，这些为转写服务提供了额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时间。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
        将提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
        Prompt 不支持用于 `gpt-realtime-whisper` 。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        VAD 检测到的语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        用于检测语音停止的静默持续时间（以毫秒为单位）。默认
        为 500ms。使用较小的值时，模型响应会更快，
        但可能会在用户短时停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值会要求更响亮的音频才能激活模型，因此在
        嘈杂环境下可能会有更好的表现。

      - `type: optional "server_vad"`

        轮次检测类型。仅 `server_vad` 目前支持用于转写会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    可选的客户端生成的 ID，用于标识此事件。

### 转录会话更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  当转录会话更新时返回，带有 a `transcription_session.update` 事件，除非出现
  错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    一个新的 Realtime 转录会话配置。

    当会话通过 REST API 在服务端创建时，会话对象
    还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
    属性在通过 WebSocket API 更新会话时不存在。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅在会话是通过
      REST API 在服务端创建时存在。

      - `expires_at: number`

        令牌过期的时间戳。目前，所有令牌都会过期
        一分钟之后。

      - `value: string`

        可在客户端环境中用于对连接进行身份验证的临时密钥
        连接到 Realtime API。请在客户端环境中使用此密钥，而不是
        标准的 API 令牌，标准令牌只能在 服务端 使用。

    - `input_audio_format: optional string`

      输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string or null`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
      VAD 意味着模型将基于
      在用户语音结束时调整音量并做出响应。

      - `prefix_padding_ms: optional number`

        VAD 检测到的语音之前要包含的音频量（以
        毫秒为单位）。默认为 300ms。

      - `silence_duration_ms: optional number`

        用于检测语音停止的静默持续时间（以毫秒为单位）。默认
        为 500ms。使用较小的值时，模型响应会更快，
        但可能会在用户短时停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值会要求更响亮的音频才能激活模型，因此在
        嘈杂环境下可能会有更好的表现。

      - `type: optional string`

        轮次检测的类型，仅 `server_vad` 当前受支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# Calls

## 接听通话

**post** `/realtime/calls/{call_id}/accept`

接受传入的 SIP 电话，并配置将用于
处理该电话的实时会话。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。Realtime API 始终为 `realtime` 。

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
      降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
      对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在输出转写文本之前等待的时间。
        较高的值可以提高转写准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。在
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
        将提高准确率和延迟表现。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
        对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
        Prompt 不支持用于 `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

      服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
      set to `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超时后将自动触发模型响应。这在
          用户长时间停顿属于异常情况的场景中很有用，例如电话
          通话。模型将根据当前上下文有效地提示用户继续对话，
          基于当前上下文。

          超时值将在上一次模型响应的音频播放完成后开始计算，
          即它的设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
          conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

          如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
          为 500ms。使用较小的值时，模型响应会更快，
          但可能会在用户短时停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值会要求更响亮的音频才能激活模型，因此在
          嘈杂环境下可能会有更好的表现。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来确定用户何时结束说话。

        - `type: "semantic_vad"`

          轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当默认
          conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音回应速度相对于原始速度的倍数。
      1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

      此参数是对生成后音频的后处理调整，也
      可以通过提示让模型说话更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
      一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
      一旦模型至少响应过一次音频后就不能更改。
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

          自定义语音 ID，例如。 `voice_1234`.

- `include: optional array of "item.input_audio_transcription.logprobs"`

  在服务端输出中包含的其他字段。

  `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

  请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
  。 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

  本次会话使用的 Realtime 模型。

  - `string`

  - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    本次会话使用的 Realtime 模型。

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

  模型可以响应的模态集合。其默认值为 `["audio"]`，表示
  模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
  模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

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

    用于替换提示中变量的可选值映射
    提示。替换值可以是字符串，也可以是其他
    响应输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的一段文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型。始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `image_url: optional string or null`

        发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    对支持推理的 Realtime 模型（如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
  函数/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（若有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或
    多个工具之间自行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项以强制模型调用某个特定的函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

      该函数的描述，包括在何时以及如何调用它的指引，
      以及关于在调用时应向用户说明哪些内容的指引
      （若有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
    (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中标识它。

    - `type: "mcp"`

      MCP 工具的类型，始终为 `mcp`.

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

        用于指定允许使用的工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否修改数据或是否为只读。如果一个
          MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
      MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
      程序必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
      关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

      此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
      使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
      安全 MCP 隧道进行连接。

      当前支持 `connector_id` 的取值包括：

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

      此 MCP 工具是否为延迟加载并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要获得批准。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与工具关联的过滤器对象
        ，这些工具需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一： `always` 或
        `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
        set to `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
      `tunnel_id` 之一。

    - `tunnel_id: optional string`

      用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
      `server_url`, `connector_id`，或 `tunnel_id` 之一。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
  追踪在会话中启用，相关配置将无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值作为
  工作流名称、group id 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的 group id，用于在
      Traces Dashboard 中进行筛选和分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在
      Traces Dashboard 中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称，用于
      在 Traces Dashboard 中为该追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

  客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

  截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

  也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

      - `post_instructions: optional number`

        指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

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

通过 WebRTC 创建新的 Realtime API 调用，并接收完成
对等连接所需的 SDP answer。

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

结束一个活动的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 方法将正在进行的 SIP 通话转接到新的目标。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 头中的 URI。支持类似如下的值：
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

通过向主叫方返回 SIP 状态码来拒绝来电 SIP 通话。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  发送回给调用方的 SIP 响应码。默认为 `603` （Decline）
  （未指定时）。

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

客户端密钥是一种短期令牌，可传递给客户端应用，
例如 Web 前端或移动客户端，从而获得对 Realtime API 的访问权限，而不会泄露你的主 API 密钥。
leaking your main 接口 key. You can configure a custom TTL for each client secret.

你还可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的所有会话，但这些配置也可以被
客户端连接覆盖。

[了解更多关于通过 WebRTC 使用客户端密钥进行身份验证的信息](/api/docs/guides/realtime-webrtc).

返回已创建的客户端密钥以及生效的会话对象。客户端密钥是一个字符串，类似于 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥的过期配置。过期时间指的是在此之后
  客户端密钥将不再可用于创建会话的时间点。已创建的会话在
  该时间之后开始后仍可继续运行。在到期之前，一个密钥可用于创建多个会话
  。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点时间，表示将把一个偏移量 `seconds` 加到客户端密钥的 `created_at` 时间上以生成过期时间戳。仅 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点时间到过期的秒数。可选择的取值范围介于 `10` 和 `7200` （2 小时）之间。若未指定，默认值为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择一个 realtime
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。Realtime API 始终为 `realtime` 。

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
          降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转写文本之前等待的时间。
            较高的值可以提高转写准确率，但会增加延迟。
            仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
            将提高准确率和延迟表现。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
            对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
            Prompt 不支持用于 `gpt-realtime-whisper` 。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          set to `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超时后将自动触发模型响应。这在
              用户长时间停顿属于异常情况的场景中很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话，
              基于当前上下文。

              超时值将在上一次模型响应的音频播放完成后开始计算，
              即它的设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
              conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
              为 500ms。使用较小的值时，模型响应会更快，
              但可能会在用户短时停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值会要求更响亮的音频才能激活模型，因此在
              嘈杂环境下可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来确定用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当默认
              conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应速度相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

          此参数是对生成后音频的后处理调整，也
          可以通过提示让模型说话更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以提供自定义声音对象，方法是
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音在会话期间无法更改，
          一旦模型至少响应过一次音频后就不能更改。
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

              自定义语音 ID，例如。 `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      在服务端输出中包含的其他字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
      。 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      本次会话使用的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        本次会话使用的 Realtime 模型。

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

      模型可以响应的模态集合。其默认值为 `["audio"]`，表示
      模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
      模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

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

        用于替换提示中变量的可选值映射
        提示。替换值可以是字符串，也可以是其他
        响应输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的一段文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（若有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        多个工具之间自行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项以强制模型调用某个特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

          该函数的描述，包括在何时以及如何调用它的指引，
          以及关于在调用时应向用户说明哪些内容的指引
          （若有）。

        - `name: optional string`

          函数名称。

        - `parameters: optional unknown`

          使用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

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

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
          MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
          程序必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值包括：

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

          此 MCP 工具是否为延迟加载并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要获得批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值之一： `always` 或
            `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
            set to `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
      追踪在会话中启用，相关配置将无法修改。

      `auto` 将为该会话创建一个追踪，并使用默认值作为
      工作流名称、group id 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的 group id，用于在
          Traces Dashboard 中进行筛选和分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于在
          Traces Dashboard 中进行筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称，用于
          在 Traces Dashboard 中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

      客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

      截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

      也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

        - `retention_ratio: number`

          在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。Realtime API 始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          set to `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超时后将自动触发模型响应。这在
              用户长时间停顿属于异常情况的场景中很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话，
              基于当前上下文。

              超时值将在上一次模型响应的音频播放完成后开始计算，
              即它的设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
              conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
              为 500ms。使用较小的值时，模型响应会更快，
              但可能会在用户短时停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值会要求更响亮的音频才能激活模型，因此在
              嘈杂环境下可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来确定用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当默认
              conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      在服务端输出中包含的其他字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### Returns

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元以来的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  实时会话或转录会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    一个 Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。Realtime API 始终为 `realtime` 。

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
          降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
          对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }  or null`

          输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

          轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

          服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
          set to `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超时后将自动触发模型响应。这在
              用户长时间停顿属于异常情况的场景中很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话，
              基于当前上下文。

              超时值将在上一次模型响应的音频播放完成后开始计算，
              即它的设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
              conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

              如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
              为 500ms。使用较小的值时，模型响应会更快，
              但可能会在用户短时停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值会要求更响亮的音频才能激活模型，因此在
              嘈杂环境下可能会有更好的表现。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来确定用户何时结束说话。

            - `type: "semantic_vad"`

              轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当默认
              conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回应速度相对于原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

          此参数是对生成后音频的后处理调整，也
          可以通过提示让模型说话更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
          语音选项包括
          。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
          最佳音质。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

      会话的过期时间戳，自纪元起以秒为单位。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      在服务端输出中包含的其他字段。

      `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供介于 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
      。 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      本次会话使用的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        本次会话使用的 Realtime 模型。

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

      模型可以响应的模态集合。其默认值为 `["audio"]`，表示
      模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
      模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        用于替换提示中变量的可选值映射
        提示。替换值可以是字符串，也可以是其他
        响应输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的一段文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        对支持推理的 Realtime 模型（如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（若有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        多个工具之间自行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项以强制模型调用某个特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

          该函数的描述，包括在何时以及如何调用它的指引，
          以及关于在调用时应向用户说明哪些内容的指引
          （若有）。

        - `name: optional string`

          函数名称。

        - `parameters: optional unknown`

          使用 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
        (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

        - `type: "mcp"`

          MCP 工具的类型，始终为 `mcp`.

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

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
          MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
          程序必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
          关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
          使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
          安全 MCP 隧道进行连接。

          当前支持 `connector_id` 的取值包括：

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

          此 MCP 工具是否为延迟加载并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要获得批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，或与工具关联的过滤器对象
            ，这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值之一： `always` 或
            `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
            set to `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 之一。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 之一。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
      追踪在会话中启用，相关配置将无法修改。

      `auto` 将为该会话创建一个追踪，并使用默认值作为
      工作流名称、group id 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的 group id，用于在
          Traces Dashboard 中进行筛选和分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于在
          Traces Dashboard 中进行筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称，用于
          在 Traces Dashboard 中为该追踪命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

      客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

      截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

      也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

      - `"auto" or "disabled"`

        用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

        - `retention_ratio: number`

          在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    一个 Realtime 转录会话配置对象。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话的类型。始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional object { input }`

      该会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }  or null`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }  or null`

          转录模型的配置。

          - `language: optional string or null`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
          VAD 意味着模型将基于
          音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            VAD 检测到的语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            用于检测语音停止的静默持续时间（以毫秒为单位）。默认
            为 500ms。使用较小的值时，模型响应会更快，
            但可能会在用户短时停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            高的阈值会要求更响亮的音频才能激活模型，因此在
            嘈杂环境下可能会有更好的表现。

          - `type: optional string`

            轮次检测的类型，仅 `server_vad` 当前受支持。

    - `expires_at: optional number`

      会话的过期时间戳，自纪元起以秒为单位。

    - `include: optional array of "item.input_audio_transcription.logprobs" or null`

      在服务端输出中包含的其他字段。

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

### Client Secret Create Response

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    实时会话或转录会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      一个 Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。Realtime API 始终为 `realtime` 。

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
            降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
            对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }  or null`

            输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

            轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

            服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
            set to `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超时后将自动触发模型响应。这在
                用户长时间停顿属于异常情况的场景中很有用，例如电话
                通话。模型将根据当前上下文有效地提示用户继续对话，
                基于当前上下文。

                超时值将在上一次模型响应的音频播放完成后开始计算，
                即它的设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
                conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

                如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
                毫秒为单位）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
                为 500ms。使用较小的值时，模型响应会更快，
                但可能会在用户短时停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值会要求更响亮的音频才能激活模型，因此在
                嘈杂环境下可能会有更好的表现。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来确定用户何时结束说话。

              - `type: "semantic_vad"`

                轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当默认
                conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音回应速度相对于原始速度的倍数。
            1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

            此参数是对生成后音频的后处理调整，也
            可以通过提示让模型说话更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
            语音选项包括
            。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
            最佳音质。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
              语音选项包括
              。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        在服务端输出中包含的其他字段。

        `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供介于 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
        。 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        本次会话使用的 Realtime 模型。

        - `string`

        - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

          本次会话使用的 Realtime 模型。

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

        模型可以响应的模态集合。其默认值为 `["audio"]`，表示
        模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
        模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          用于替换提示中变量的可选值映射
          提示。替换值可以是字符串，也可以是其他
          响应输入类型，例如图像或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的一段文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

              标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          对支持推理的 Realtime 模型（如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
        函数/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（若有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或
          多个工具之间自行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项以强制模型调用某个特定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

            该函数的描述，包括在何时以及如何调用它的指引，
            以及关于在调用时应向用户说明哪些内容的指引
            （若有）。

          - `name: optional string`

            函数名称。

          - `parameters: optional unknown`

            使用 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
          (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

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

              用于指定允许使用的工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果一个
                MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
            MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
            程序必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要获得批准。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用的工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果一个
                  MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一： `always` 或
              `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
              set to `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
        追踪在会话中启用，相关配置将无法修改。

        `auto` 将为该会话创建一个追踪，并使用默认值作为
        工作流名称、group id 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的 group id，用于在
            Traces Dashboard 中进行筛选和分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在
            Traces Dashboard 中进行筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称，用于
            在 Traces Dashboard 中为该追踪命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

        客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

        截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

        也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

        - `"auto" or "disabled"`

          用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

          - `retention_ratio: number`

            在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      一个 Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型。始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        该会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }  or null`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }  or null`

            转录模型的配置。

            - `language: optional string or null`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
            VAD 意味着模型将基于
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到的语音之前要包含的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默持续时间（以毫秒为单位）。默认
              为 500ms。使用较小的值时，模型响应会更快，
              但可能会在用户短时停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值会要求更响亮的音频才能激活模型，因此在
              嘈杂环境下可能会有更好的表现。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自纪元起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs" or null`

        在服务端输出中包含的其他字段。

        - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Session Create Response

- `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

  一个 Realtime 会话配置对象。

  - `id: string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `object: "realtime.session"`

    对象类型。始终为 `realtime.session`.

    - `"realtime.session"`

  - `type: "realtime"`

    要创建的会话类型。Realtime API 始终为 `realtime` 。

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
        降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
        对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        输入音频转写的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步运行，应将其视为对输入音频内容的指引，而非模型实际听到的内容。客户端可以选择性地设置转写的语言和提示，以为转写服务提供额外的指引。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

        轮次检测的配置，可使用服务端 VAD 或语义 VAD。可设置为 `null` 以关闭，此时必须由客户端手动触发模型响应。

        服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        语义 VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已结束发言，并根据该概率动态设置超时时间。例如，如果用户的音频以“嗯……”收尾，模型会给出较低的轮次结束概率评分，并等待更长时间以让用户继续发言。这对于更自然的对话非常有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转写会话中，轮次检测必须为
        set to `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测的类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，当模型已经在响应时可能会创建响应失败。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超时后将自动触发模型响应。这在
            用户长时间停顿属于异常情况的场景中很有用，例如电话
            通话。模型将根据当前上下文有效地提示用户继续对话，
            基于当前上下文。

            超时值将在上一次模型响应的音频播放完成后开始计算，
            即它的设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            当达到超时时，将发送与该 Response 关联的 conversation.cancelled 事件。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）默认对话（即
            conversation 的。 `conversation` of `auto`) 的任何正在进行的响应。如果设置为 true， `true` 则响应将被取消，否则它将继续直到完成。

            如果同时 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍然会发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。VAD 检测到语音之前要包含的音频量（以
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。用于检测语音停止的静音持续时间（以毫秒为单位）。默认
            为 500ms。使用较小的值时，模型响应会更快，
            但可能会在用户短时停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值会要求更响亮的音频才能激活模型，因此在
            嘈杂环境下可能会有更好的表现。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来确定用户何时结束说话。

          - `type: "semantic_vad"`

            轮次检测的类型， `semantic_vad` 来开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型回应的积极程度。 `low` 会更长时间等待用户继续说话， `high` 会更快回应。 `auto` 是默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当默认
            conversation 的。 `conversation` of `auto`) 时，是否自动中断任何正在进行的回应输出。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音回应速度相对于原始速度的倍数。
        1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。此值只能在模型轮次之间更改，不能在回应进行中修改。

        此参数是对生成后音频的后处理调整，也
        可以通过提示让模型说话更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
        语音选项包括
        。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
        最佳音质。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复所使用的语音。一旦模型至少回复过一次音频后，会话内的语音就无法更改。当前
          语音选项包括
          。我们推荐 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。用于 `marin` 和 `cedar` 以获得
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

    会话的过期时间戳，自纪元起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    在服务端输出中包含的其他字段。

    `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的响应。可以指示模型在响应内容和格式上的行为（例如“极其简洁”、“表现得友好”、“以下是良好的响应示例”），以及在音频行为上的表现（例如“说话快一些”、“在声音中注入情绪”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了期望行为的指导。

    请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
    。 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

    本次会话使用的 Realtime 模型。

    - `string`

    - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      本次会话使用的 Realtime 模型。

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

    模型可以响应的模态集合。其默认值为 `["audio"]`，表示
    模型将以音频加文字转录的形式进行响应。 `["text"]` 可用于让
    模型仅以文本形式进行响应。无法同时请求这两种 `text` 和 `audio` 形式。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      用于替换提示中变量的可选值映射
      提示。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的一段文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          输入项的类型。始终为 `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件的 ID。

        - `image_url: optional string or null`

          发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

          标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    适用于支持推理的 Realtime 模型（如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      对支持推理的 Realtime 模型（如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。使用某个字符串模式，或强制调用某个特定的
    函数/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（若有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间自行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项以强制模型调用某个特定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项以强制模型调用远程 MCP 服务器上的某个特定工具。

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

        该函数的描述，包括在何时以及如何调用它的指引，
        以及关于在调用时应向用户说明哪些内容的指引
        （若有）。

      - `name: optional string`

        函数名称。

      - `parameters: optional unknown`

        使用 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器授予模型对其他工具的访问权限。
      (MCP) 服务器。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

      - `type: "mcp"`

        MCP 工具的类型，始终为 `mcp`.

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

          用于指定允许使用的工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果一个
            MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以与自定义
        MCP 服务器 URL 配合使用，也可以与服务连接器配合使用。你的应用
        程序必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
        关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
        使用 `server_url` 连接到远程 MCP 服务器，或通过 `tunnel_id` 为
        安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的取值包括：

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

        此 MCP 工具是否为延迟加载并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 请求头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要获得批准。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与工具关联的过滤器对象
          ，这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用的工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果一个
              MCP 服务器被 [标注， `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值之一： `always` 或
          `never`。当设置为 `always`，时，所有工具都将需要审批。当设置为
          set to `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 之一。

      - `tunnel_id: optional string`

        用于代替直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 之一。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces). 设为 null 以禁用追踪。一旦
    追踪在会话中启用，相关配置将无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值作为
    工作流名称、group id 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的 group id，用于在
        Traces Dashboard 中进行筛选和分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在
        Traces Dashboard 中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称，用于
        在 Traces Dashboard 中为该追踪命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

    客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

    截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

    也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

    - `"auto" or "disabled"`

      用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

      - `retention_ratio: number`

        在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

        - `post_instructions: optional number`

          指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

### Realtime Transcription Session Create Response

- `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

  一个 Realtime 转录会话配置对象。

  - `id: string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

  - `object: string`

    对象类型。始终为 `realtime.transcription_session`.

  - `type: "transcription"`

    会话的类型。始终为 `transcription` 用于转录会话。

    - `"transcription"`

  - `audio: optional object { input }`

    该会话的输入音频配置。

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

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }  or null`

        转录模型的配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
        VAD 意味着模型将基于
        音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          VAD 检测到的语音之前要包含的音频量（以
          毫秒为单位）。默认为 300ms。

        - `silence_duration_ms: optional number`

          用于检测语音停止的静默持续时间（以毫秒为单位）。默认
          为 500ms。使用较小的值时，模型响应会更快，
          但可能会在用户短时停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          高的阈值会要求更响亮的音频才能激活模型，因此在
          嘈杂环境下可能会有更好的表现。

        - `type: optional string`

          轮次检测的类型，仅 `server_vad` 当前受支持。

  - `expires_at: optional number`

    会话的过期时间戳，自纪元起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    在服务端输出中包含的其他字段。

    - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将基于
  音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    VAD 检测到的语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默持续时间（以毫秒为单位）。默认
    为 500ms。使用较小的值时，模型响应会更快，
    但可能会在用户短时停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更响亮的音频才能激活模型，因此在
    嘈杂环境下可能会有更好的表现。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 当前受支持。

# 会话

## 创建会话

**post** `/realtime/sessions`

创建一个用于客户端应用的临时 API 令牌，配合
Realtime API 使用。可使用与
`session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 其中包含可用于浏览器客户端认证的
可用临时 API 令牌的 key
以用于 Realtime API。

返回已创建的 Realtime 会话对象，以及一个临时密钥。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会过期
    一分钟之后。

  - `value: string`

    可在客户端环境中用于对连接进行身份验证的临时密钥
    连接到 Realtime API。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，标准令牌只能在 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，可以
  set to `null` 用于在开启后再关闭。输入音频转录并非模型
  原生功能，因为模型直接消费音频。转录以
  异步方式运行，应视为大致参考
  而非模型理解的表示。

  - `model: optional string`

    用于转录的模型。

- `instructions: optional string`

  在模型调用前添加的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“说话快速”、“在声音中注入情感”、“经常笑”）。模型不保证会遵循这些指令，但它们为模型期望的行为提供了指导。
  请注意，服务端会设置默认指令，如果未设置此字段则将使用这些默认指令，它们在会话开始时的 `session.created` 事件中可见。

- `max_response_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
  。 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    用于替换提示中变量的可选值映射
    提示。替换值可以是字符串，也可以是其他
    响应输入类型，例如图像或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的一段文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

      - `detail: ImageDetail`

        发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

        - `"low"`

        - `"high"`

        - `"auto"`

        - `"original"`

      - `type: "input_image"`

        输入项的类型。始终为 `input_image`.

        - `"input_image"`

      - `file_id: optional string or null`

        发送给模型的文件的 ID。

      - `image_url: optional string or null`

        发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或 `high` 可以以更高质量渲染文件。默认为 `auto`.

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

        标记可复用提示前缀的确切结束位置。该断点从请求的 `prompt_cache_options.ttl`；该边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音回复的语速。1.0 为默认语速，0.25 是
  最低语速，1.5 是最高语速。该值只能在模型轮次之间更改，不能在响应进行中修改。
  在响应进行中时无法更改。

- `temperature: optional number`

  模型的采样温度，限制在 [0.6, 1.2] 范围内，默认值为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of object { description, name, parameters, type }`

  模型可用的工具（函数）。

  - `description: optional string`

    该函数的描述，包括在何时以及如何调用它的指引，
    以及关于在调用时应向用户说明哪些内容的指引
    （若有）。

  - `name: optional string`

    函数名称。

  - `parameters: optional unknown`

    使用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪 的配置选项。设为 null 可禁用追踪。一旦
  追踪在会话中启用，相关配置将无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值作为
  工作流名称、group id 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的 group id，用于在
      在追踪面板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在
      在追踪面板中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称，用于
      在追踪面板中为追踪命名。

- `truncation: optional RealtimeTruncation`

  当对话中的令牌数超过模型的输入令牌上限时，对话将被截断，即最早的消息不会纳入模型的上下文。一个 32k 上下文、最大输出 4,096 个令牌的模型在发生截断前，上下文最多只能包含 28,224 个令牌。

  客户端可以配置截断行为，使用更低的最大令牌上限进行截断，这是控制令牌使用量和成本的有效方法。

  截断会减少下一轮中缓存的令牌数量（导致缓存失效），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为最多保留到最大上下文大小一定比例的消息，从而减少后续截断的需求，进而提高缓存命中率。

  也可以完全禁用截断，这意味着服务端永远不会进行截断，而是在对话超过模型输入令牌上限时返回错误。

  - `"auto" or "disabled"`

    用于该会话的截断策略。 `auto` 为默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入令牌上限时抛出错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当对话超出输入 token 上限时，保留一定比例的对话 token。这允许你将截断分摊到多轮，从而有助于提升缓存 token 的使用率。

    - `retention_ratio: number`

      在超出输入 token 上限时，需保留的指令后对话 token 比例（`0.0` - `1.0`），当对话超出输入 token 上限。将其设置为 `0.8` ，表示消息将被丢弃直至使用到最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义 token 上限。若未提供，将使用模型的默认 token 上限。

      - `post_instructions: optional number`

        指令后对话中允许的最大 token 数（包括工具定义）。例如，将其设置为 5,000 意味着当指令后对话超过 5,000 token 时将发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将基于
  在用户语音结束时调整音量并做出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到的语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默持续时间（以毫秒为单位）。默认
    为 500ms。使用较小的值时，模型响应会更快，
    但可能会在用户短时停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更响亮的音频才能激活模型，因此在
    嘈杂环境下可能会有更好的表现。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 当前受支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型用于回应的声音。支持的内置声音有
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`。你也可以提供一个自定义语音对象，并附带
  `id`，例如 `{ "id": "voice_1234" }`。在模型至少响应过一次音频之后，
  会话期间无法再更改语音。

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

      自定义语音 ID，例如。 `voice_1234`.

### Returns

- `id: optional string`

  会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

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

    - `noise_reduction: optional object { type }  or null`

      输入音频降噪配置。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转录的配置。

      - `language: optional string or null`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

      轮次检测的配置。

      - `prefix_padding_ms: optional number`

      - `silence_duration_ms: optional number`

      - `threshold: optional number`

      - `type: optional string`

        轮次检测的类型，仅 `server_vad` 当前受支持。

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

  会话的过期时间戳，自纪元起以秒为单位。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  在服务端输出中包含的其他字段。

  - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  在模型调用之前添加的默认系统指令(即系统消息)
  。此字段允许客户端指导模型给出所需的
  响应。可以指示模型回复的内容和格式,
  (例如 "极其简洁"、"表现得友好"、"以下是好回复的
  示例"),以及音频行为(例如 "说话快一点"、"在声音中
  到你的声音中","频繁地笑"）。这些指令不保证
  会被模型遵循，但它们为模型提供有关
  期望行为的指导。

  注意,服务端会设置默认指令,如果该
  字段未设置,则会使用这些默认指令,它们会在 `session.created` 事件的会话开始时
  显示。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供介于 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
  。 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `model: optional string`

  本次会话使用的 Realtime 模型。

- `object: optional string`

  对象类型。始终为 `realtime.session`.

- `output_modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频,
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `tool_choice: optional string`

  模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
  指定一个函数。

- `tools: optional array of RealtimeFunctionTool`

  模型可用的工具（函数）。

  - `description: optional string`

    该函数的描述，包括在何时以及如何调用它的指引，
    以及关于在调用时应向用户说明哪些内容的指引
    （若有）。

  - `name: optional string`

    函数名称。

  - `parameters: optional unknown`

    使用 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪 的配置选项。设为 null 可禁用追踪。一旦
  追踪在会话中启用，相关配置将无法修改。

  `auto` 将为该会话创建一个追踪，并使用默认值作为
  工作流名称、group id 和元数据。

  - `"auto"`

    会话的默认追踪模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的 group id，用于在
      在追踪面板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在
      在追踪面板中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称，用于
      在追踪面板中为追踪命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将基于
  在用户语音结束时调整音量并做出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到的语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默持续时间（以毫秒为单位）。默认
    为 500ms。使用较小的值时，模型响应会更快，
    但可能会在用户短时停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更响亮的音频才能激活模型，因此在
    嘈杂环境下可能会有更好的表现。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 当前受支持。

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

### 会话创建响应

- `SessionCreateResponse object { id, audio, expires_at, 10 more }`

  一个 Realtime 会话配置对象。

  - `id: optional string`

    会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

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

      - `noise_reduction: optional object { type }  or null`

        输入音频降噪配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置。

        - `language: optional string or null`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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

      - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

        轮次检测的配置。

        - `prefix_padding_ms: optional number`

        - `silence_duration_ms: optional number`

        - `threshold: optional number`

        - `type: optional string`

          轮次检测的类型，仅 `server_vad` 当前受支持。

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

    会话的过期时间戳，自纪元起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的其他字段。

    - `item.input_audio_transcription.logprobs`: 在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    在模型调用之前添加的默认系统指令(即系统消息)
    。此字段允许客户端指导模型给出所需的
    响应。可以指示模型回复的内容和格式,
    (例如 "极其简洁"、"表现得友好"、"以下是好回复的
    示例"),以及音频行为(例如 "说话快一点"、"在声音中
    到你的声音中","频繁地笑"）。这些指令不保证
    会被模型遵循，但它们为模型提供有关
    期望行为的指导。

    注意,服务端会设置默认指令,如果该
    字段未设置,则会使用这些默认指令,它们会在 `session.created` 事件的会话开始时
    显示。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供介于 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大 token 数。默认为
    。 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `model: optional string`

    本次会话使用的 Realtime 模型。

  - `object: optional string`

    对象类型。始终为 `realtime.session`.

  - `output_modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频,
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `tool_choice: optional string`

    模型选择工具的方式。选项包括 `auto`, `none`, `required`，或
    指定一个函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      该函数的描述，包括在何时以及如何调用它的指引，
      以及关于在调用时应向用户说明哪些内容的指引
      （若有）。

    - `name: optional string`

      函数名称。

    - `parameters: optional unknown`

      使用 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    追踪 的配置选项。设为 null 可禁用追踪。一旦
    追踪在会话中启用，相关配置将无法修改。

    `auto` 将为该会话创建一个追踪，并使用默认值作为
    工作流名称、group id 和元数据。

    - `"auto"`

      会话的默认追踪模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的 group id，用于在
        在追踪面板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在
        在追踪面板中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称，用于
        在追踪面板中为追踪命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }  or null`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 意味着模型将基于
    在用户语音结束时调整音量并做出响应。

    - `prefix_padding_ms: optional number`

      VAD 检测到的语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      用于检测语音停止的静默持续时间（以毫秒为单位）。默认
      为 500ms。使用较小的值时，模型响应会更快，
      但可能会在用户短时停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值会要求更响亮的音频才能激活模型，因此在
      嘈杂环境下可能会有更好的表现。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 当前受支持。

# 转录会话

## 创建转录会话

**post** `/realtime/transcription_sessions`

创建一个用于客户端应用的临时 API 令牌，配合
专门用于实时转录的 Realtime API。
可使用与以下相同的会话参数进行配置： `transcription_session.update` 客户端事件相同的会话参数进行配置。

它会返回一个会话对象，以及一个 `client_secret` 其中包含可用于浏览器客户端认证的
可用临时 API 令牌的 key
以用于 Realtime API。

返回已创建的 Realtime 转录会话对象，以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  要在转写中包含的项目集合。当前可用的项目包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`,输入音频必须为 16 位 PCM,采样率为 24kHz,
  单声道(单轨),并且采用小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可设置为 `null` 以关闭。
  降噪会在输入音频发送到 VAD 和模型之前，对其加入的音频进行过滤。
  对音频进行过滤可以提高 VAD 和轮次检测的准确性（减少误报），并通过改善对输入音频的感知来提升模型性能。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转写的配置。客户端可以选择性地设置转写的语言和 prompt，这些为转写服务提供了额外指引。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在输出转写文本之前等待的时间。
    较高的值可以提高转写准确率，但会增加延迟。
    仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。在
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式中提供输入语言
    将提高准确率和延迟表现。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转写的模型。当前可选项包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

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
    对于 `whisper-1`，则 [prompt 是一个关键词列表](/api/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），则 prompt 是一段自由文本，例如“期待与科技相关的词汇”。
    Prompt 不支持用于 `gpt-realtime-whisper` 。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到的语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默持续时间（以毫秒为单位）。默认
    为 500ms。使用较小的值时，模型响应会更快，
    但可能会在用户短时停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更响亮的音频才能激活模型，因此在
    嘈杂环境下可能会有更好的表现。

  - `type: optional "server_vad"`

    轮次检测类型。仅 `server_vad` 目前支持用于转写会话。

    - `"server_vad"`

### Returns

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅在会话是通过
  REST API 在服务端创建时存在。

  - `expires_at: number`

    令牌过期的时间戳。目前，所有令牌都会过期
    一分钟之后。

  - `value: string`

    可在客户端环境中用于对连接进行身份验证的临时密钥
    连接到 Realtime API。请在客户端环境中使用此密钥，而不是
    标准的 API 令牌，标准令牌只能在 服务端 使用。

- `input_audio_format: optional string`

  输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string or null`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
  VAD 意味着模型将基于
  在用户语音结束时调整音量并做出响应。

  - `prefix_padding_ms: optional number`

    VAD 检测到的语音之前要包含的音频量（以
    毫秒为单位）。默认为 300ms。

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默持续时间（以毫秒为单位）。默认
    为 500ms。使用较小的值时，模型响应会更快，
    但可能会在用户短时停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值会要求更响亮的音频才能激活模型，因此在
    嘈杂环境下可能会有更好的表现。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 当前受支持。

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

## 域类型

### Transcription Session Create Response

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  一个新的 Realtime 转录会话配置。

  当会话通过 REST API 在服务端创建时，会话对象
  还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
  属性在通过 WebSocket API 更新会话时不存在。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅在会话是通过
    REST API 在服务端创建时存在。

    - `expires_at: number`

      令牌过期的时间戳。目前，所有令牌都会过期
      一分钟之后。

    - `value: string`

      可在客户端环境中用于对连接进行身份验证的临时密钥
      连接到 Realtime API。请在客户端环境中使用此密钥，而不是
      标准的 API 令牌，标准令牌只能在 服务端 使用。

  - `input_audio_format: optional string`

    输入音频的格式。选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string or null`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可能的输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

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
    VAD 意味着模型将基于
    在用户语音结束时调整音量并做出响应。

    - `prefix_padding_ms: optional number`

      VAD 检测到的语音之前要包含的音频量（以
      毫秒为单位）。默认为 300ms。

    - `silence_duration_ms: optional number`

      用于检测语音停止的静默持续时间（以毫秒为单位）。默认
      为 500ms。使用较小的值时，模型响应会更快，
      但可能会在用户短时停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值会要求更响亮的音频才能激活模型，因此在
      嘈杂环境下可能会有更好的表现。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 当前受支持。

# Translations

# 客户端密钥

## Create translation client secret

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并附带翻译会话配置。

客户端密钥是一种短期令牌，可传递给客户端应用，
例如网页前端或移动客户端，从而获得对 Realtime 翻译的访问权限
Translation API，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义的
TTL。

返回已创建的客户端密钥以及生效的翻译会话对象。
客户端密钥是一个字符串，形式如下 `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话持续流式传入源语言音频
  并持续流式输出翻译后的音频以及转录文本增量。

  - `model: string`

    此会话所使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 可将其禁用。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        可选的源语言转录。配置后，服务端会发出
        `session.input_transcript.delta` 事件。翻译本身仍然基于
        输入音频流运行。

        - `model: string`

          用于源转录增量（deltas）的转录模型。

    - `output: optional object { language }`

      - `language: optional string`

        翻译后输出音频和转录增量的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥的过期配置。过期时间指的是在此之后
  客户端密钥将不再可用于创建会话的时间点。已创建的会话在
  该时间之后开始后仍可继续运行。在到期之前，一个密钥可用于创建多个会话
  。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点时间，表示将把一个偏移量 `seconds` 加到客户端密钥的 `created_at` 时间上以生成过期时间戳。仅 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点时间到过期的秒数。可选择的取值范围介于 `10` 和 `7200` （2 小时）之间。若未指定，默认值为 600 秒（10 分钟）。

### Returns

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  通过为 Realtime API 创建翻译会话和客户端密钥所返回的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元以来的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续地将输入
    音频翻译成所配置的目标语言。

    - `id: string`

      会话的唯一标识符，格式类似于 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 适用于近讲麦克风，例如头戴式耳机， `far_field` 适用于远场麦克风，例如笔记本电脑或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { model }  or null`

          可选的源语言转录。配置后，服务端会发出
          `session.input_transcript.delta` 事件。翻译本身仍然基于
          输入音频流运行。

          - `model: string`

            用于源转录增量数据的转录模型。

      - `output: optional object { language }`

        - `language: optional string`

          翻译后输出音频和转录增量的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自纪元起以秒为单位。

    - `model: string`

      此会话所使用的 Realtime 翻译模型。该字段在
      会话创建时设定，且无法通过 `session.update`.

    - `type: "translation"`

      会话类型。对于 Realtime 翻译会话始终为 `translation` 。

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
