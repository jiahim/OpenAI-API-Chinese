# Realtime

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 域名类型

### 音频转录

- `AudioTranscription object { delay, keywords, language, 3 more }`

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在发出转录文本之前等待的时间。
    较高的值可以提高转录准确率，但会增加延迟。
    仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。以
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    提供可提高准确率并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续先前音频片段的可选文本。
    片段。
    对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
    以下模型不支持 prompt： `gpt-realtime-whisper` 。

### 对话创建事件

- `ConversationCreatedEvent object { conversation, event_id, type }`

  在对话创建时返回。在会话创建后立即发出。

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

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。对于系统消息始终为 `input_text` 。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。对于系统消息始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。对于系统消息始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（用于 `input_text`).

      - `transcript: optional string`

        音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。对于系统消息始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。对于系统消息始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的助手消息项。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录；如果输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。对于系统消息始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。对于系统消息始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的函数调用项。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。对于系统消息始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的函数调用输出项。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。对于系统消息始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

      所回答的审批请求的 ID。

    - `approve: boolean`

      请求是否被批准。

    - `type: "mcp_approval_response"`

      条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

        有关该工具的附加注解。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。对于系统消息始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数对应的 JSON 字符串。

    - `name: string`

      所运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。对于系统消息始终为 `mcp_call`.

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

      条目的类型。对于系统消息始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

### 对话项已添加

- `ConversationItemAdded object { event_id, item, type, previous_item_id }`

  当 Item 被添加到默认对话时由服务端发送。以下几种情况会触发该事件：

  - 当客户端发送一个 `conversation.item.create` 事件时。
  - 当输入音频缓冲区被提交时。此时该 item 将是一条用户消息，其中包含缓冲区中的音频。
  - 当模型正在生成 Response 时。此时 `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此此时还没有任何内容（且 `status` 将为 `in_progress`).

  该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），但音频数据除外，音频数据可在需要时通过 `conversation.item.retrieve` 事件单独获取。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.added"`

    事件类型，必须为 `conversation.item.added`.

    - `"conversation.item.added"`

  - `previous_item_id: optional string or null`

    位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
    在插入 Item 时维持顺序。

### 对话项创建事件

- `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

  向会话上下文添加新的 Item，包括消息、函数
  调用和函数调用响应。此事件既可用于填充会话
  "历史记录"，也可用于在流式过程中添加新的项，但当前存在
  的限制是无法填充助手音频消息。

  如果成功，服务器将以 `conversation.item.created`
  事件进行响应，否则以 `error` 事件将被发送。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.create"`

    事件类型，必须为 `conversation.item.create`.

    - `"conversation.item.create"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

  - `previous_item_id: optional string`

    前置条目插入位置的 ID，新条目将插入到该条目之后。若未设置，新条目将追加到对话末尾。

    若设置为 `root`，新条目将添加到对话开头。

    若设置为现有 ID，则可在对话中间插入条目。若找不到该 ID，将返回错误，并且不会添加该条目。

### 对话项创建事件

- `ConversationItemCreatedEvent object { event_id, item, type, previous_item_id }`

  在创建对话项时返回。产生此事件的情况有以下几种：

  - 服务器正在生成 Response，如果成功将产生
    一个或两个 Item，类型为 `message`
    (role `assistant`) 或类型 `function_call`.
  - 输入音频缓冲区已被提交，由客户端或
    服务器（在 `server_vad` 模式下）提交。服务器将获取
    输入音频缓冲区的内容并将其添加到新的用户消息 Item 中。
  - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
    到 Conversation。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.created"`

    事件类型，必须为 `conversation.item.created`.

    - `"conversation.item.created"`

  - `previous_item_id: optional string or null`

    Conversation 上下文中前一个项的 ID，用于让
    客户端理解对话顺序。可以是 `null` ，如果该
    项没有前驱项。

### 对话项删除事件

- `ConversationItemDeleteEvent object { item_id, type, event_id }`

  当你想要从对话历史中移除某个条目时，发送此事件
  。服务端将响应一个 `conversation.item.deleted` 事件，
  除非该条目不存在于对话历史中，此时
  服务端将响应一个错误。

  - `item_id: string`

    要删除的条目的 ID。

  - `type: "conversation.item.delete"`

    事件类型，必须为 `conversation.item.delete`.

    - `"conversation.item.delete"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 对话项删除事件

- `ConversationItemDeletedEvent object { event_id, item_id, type }`

  当会话中的某个条目被客户端通过一个
  `conversation.item.delete` 事件删除时返回。该事件用于同步
  服务端对会话历史的理解与客户端的视图。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被删除条目的 ID。

  - `type: "conversation.item.deleted"`

    事件类型，必须为 `conversation.item.deleted`.

    - `"conversation.item.deleted"`

### 对话项已完成

- `ConversationItemDone object { event_id, item, type, previous_item_id }`

  在对话项被最终化时返回。

  该事件将包含该 Item 的完整内容，音频数据除外，音频数据如有需要可通过以下事件单独获取： `conversation.item.retrieve` 事件（如有需要）。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `type: "conversation.item.done"`

    事件类型，必须为 `conversation.item.done`.

    - `"conversation.item.done"`

  - `previous_item_id: optional string or null`

    位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
    在插入 Item 时维持顺序。

### 对话项输入音频转录完成事件

- `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

  该事件是为用户音频执行音频转写后写入用户音频缓冲区的输出，转写在
  用户音频缓冲区由客户端或服务端提交时启动（启用 VAD 时由服务端提交）。转写
  与 Response 创建异步进行，因此该事件可能先于也可能晚于
  Response 事件到达。Realtime API 模型原生支持音
  频，因此输入转写是由独立的 ASR（自动语音识别）模型运行的单独过程。

  接口 模型原生支持音频，因此输入转写是由独立的 ASR（自动语音识别）模型
  运行的单独过程。转写文本可能与模型的解读略有差异，应作为大致参考。
  转写文本可能与模型的解读
  略有差异，应作为大致参考。

  - `content_index: number`

    包含该音频的内容分块的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在被转录的音频所在条目的 ID。

  - `transcript: string`

    转录后的文本。

  - `type: "conversation.item.input_audio_transcription.completed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.completed`.

    - `"conversation.item.input_audio_transcription.completed"`

  - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    转录的使用统计，按 ASR 模型的价格计费，而不是 realtime 模型的价格。

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      按 token 使用量计费的模型的使用统计。

      - `input_tokens: number`

        本次请求计费的输入 token 数。

      - `output_tokens: number`

        生成的输出 token 数。

      - `total_tokens: number`

        使用的 token 总数（输入 + 输出）。

      - `type: "tokens"`

        使用对象的类型。对于此变体，始终为 `tokens` 。

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        本次请求计费的输入 token 的详细信息。

        - `audio_tokens: optional number`

          本次请求计费的音频 token 数量。

        - `text_tokens: optional number`

          本次请求计费的文本 token 数量。

    - `Duration object { seconds, type }`

      按音频输入时长计费模型的用量统计。

      - `seconds: number`

        输入音频的时长（以秒为单位）。

      - `type: "duration"`

        使用对象的类型。对于此变体，始终为 `duration` 。

        - `"duration"`

  - `languages: optional array of TranscriptionLanguage`

    音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠检测到任何语言。

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

### 对话项输入音频转录增量事件

- `ConversationItemInputAudioTranscriptionDeltaEvent object { event_id, item_id, type, 3 more }`

  当输入音频转录内容部分的文本值通过增量转录结果更新时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    正在被转录的音频所在条目的 ID。

  - `type: "conversation.item.input_audio_transcription.delta"`

    事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

    - `"conversation.item.input_audio_transcription.delta"`

  - `content_index: optional number`

    项目内容数组中内容部分的索引。

  - `delta: optional string`

    文本增量。

  - `logprobs: optional array of LogProbProperties or null`

    转录的对数概率。可通过配置会话启用 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于为这段转录选择的 token 的对数概率。这有助于判断在给定转录片段中是否存在多个有效选项。

    - `token: string`

      用于生成该对数概率的 token。

    - `bytes: array of number`

      用于生成该对数概率的字节。

    - `logprob: number`

      该 token 的对数概率。

### 对话项输入音频转录失败事件

- `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

  当配置了输入音频转录，且针对用户消息的转录
  请求失败时返回。这些事件与其他事件是分开的，以便客户端识别相关的 Item。
  `error` 以便客户端能够识别相关的 Item。

  - `content_index: number`

    包含该音频的内容分块的索引。

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

    用户消息项的 ID。

  - `type: "conversation.item.input_audio_transcription.failed"`

    事件类型，必须为
    `conversation.item.input_audio_transcription.failed`.

    - `"conversation.item.input_audio_transcription.failed"`

### 对话项输入音频转录片段

- `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

  当某个项目识别出输入音频转录片段时返回。

  - `id: string`

    片段标识符。

  - `content_index: number`

    输入音频内容部分在项目中的索引。

  - `end: number`

    片段的结束时间，单位为秒。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    包含输入音频内容的项目 ID。

  - `speaker: string`

    此片段的已检测说话人标签。

  - `start: number`

    片段的开始时间，单位为秒。

  - `text: string`

    此片段的文本。

  - `type: "conversation.item.input_audio_transcription.segment"`

    事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

    - `"conversation.item.input_audio_transcription.segment"`

### 对话项检索事件

- `ConversationItemRetrieveEvent object { item_id, type, event_id }`

  当你想要获取服务器对会话历史中特定条目的表示时发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
  服务器将使用一个 `conversation.item.retrieved` 事件，
  除非该条目不存在于对话历史中，此时
  服务端将响应一个错误。

  - `item_id: string`

    要检索的条目 ID。

  - `type: "conversation.item.retrieve"`

    事件类型，必须为 `conversation.item.retrieve`.

    - `"conversation.item.retrieve"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 对话项截断事件

- `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

  发送此事件可截断之前助手消息的音频。服务端
  生成音频的速度快于实时，因此当用户
  进行打断以截断已发送到客户端但尚未
  播放的音频时，该事件非常有用。这将使服务端对
  音频的理解与客户端的播放保持同步。

  截断音频将删除服务端的文本转录，以确保
  上下文中不存在用户尚未听到的文本。

  如果成功，服务器将以 `conversation.item.truncated`
  事件时。

  - `audio_end_ms: number`

    音频被截断所包含的最大时长，单位为毫秒。如果
    audio_end_ms 大于实际音频时长，服务端
    将返回错误。

  - `content_index: number`

    要截断的内容部分的索引。将此值设置为 `0`.

  - `item_id: string`

    要截断的助手消息项的 ID。只有助手消息
    项可以被截断。

  - `type: "conversation.item.truncate"`

    事件类型，必须为 `conversation.item.truncate`.

    - `"conversation.item.truncate"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 对话项截断事件

- `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

  当较早的助手音频消息项被
  客户端通过 `conversation.item.truncate` 事件截断时返回。该事件用于
  使服务端对音频的理解与客户端的播放保持同步。

  此操作将截断音频并移除 服务端 文本转录
  以确保上下文中的文本都是用户已经听过的。

  - `audio_end_ms: number`

    音频被截断的时长（毫秒）。

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
    该字段允许客户端为该项分配唯一 ID。它
    不是必需的，因为如果未提供，服务端将生成一个。

    对于类型为 `item_reference`，的项，该字段是必需的，是一个
    对先前已存在于对话中的任何项的引用。

  - `arguments: optional string`

    函数调用的参数（对于 `function_call` 项）。

  - `call_id: optional string`

    函数调用的 ID（对于 `function_call` 和
    `function_call_output` 项）。如果传递到 `function_call_output`
    项，服务端将检查具有相同 `function_call` 项
    ID 是否存在于对话历史中。

  - `content: optional array of object { id, audio, text, 2 more }`

    消息的内容，适用于 `message` 项。

    - 角色为 `system` 的消息项仅支持 `input_text` 内容
    - 角色为 `user` 支持 `input_text` 和 `input_audio`
      内容
    - 角色为 `assistant` 支持 `text` 内容。

    - `id: optional string`

      用于引用的先前对话项的 ID（适用于 `item_reference`
      内容类型，位于 `response.create` 事件）。这些可以引用
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

    正在调用的函数名称（适用于 `function_call` 项）。

  - `object: optional "realtime.item"`

    返回的 API 对象的标识符——始终为 `realtime.item`.

    - `"realtime.item"`

  - `output: optional string`

    函数调用的输出（适用于 `function_call_output` 项）。

  - `role: optional "user" or "assistant" or "system"`

    消息发送者的角色（`user`, `assistant`, `system`），仅
    适用于 `message` 项。

    - `"user"`

    - `"assistant"`

    - `"system"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    项的状态（`completed`, `incomplete`, `in_progress`）。这些对对话没有影响，
    但为了与
    `conversation.item.created` 事件时。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

  - `type: optional "message" or "function_call" or "function_call_output"`

    条目的类型（`message`, `function_call`, `function_call_output`, `item_reference`).

    - `"message"`

    - `"function_call"`

    - `"function_call_output"`

### 输入音频缓冲区追加事件

- `InputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到输入音频缓冲区。该音频
  缓冲区是临时存储，你可以向其写入数据并在稍后提交。"提交"将根据缓冲区内容在会话历史中创建一个新的
  用户消息条目，并清空缓冲区。
  输入音频转录（如果启用）将在缓冲区提交时生成。

  如果启用了 VAD，音频缓冲区用于检测语音，并由服务端决定何时提交。当禁用 Server VAD 时，你必须手动提交音频缓冲区。
  手动提交音频缓冲区。输入音频降噪会在向音频缓冲区的写入操作上生效。
  手动提交音频缓冲区。输入音频降噪会在向音频缓冲区的写入操作上生效。

  客户端可以选择在每个事件中放入多少音频，最大为
  15 MiB，例如从客户端流式传输较小的块可能使
  VAD 响应更及时。与大多数其他客户端事件不同，服务端不会
  针对此事件发送确认响应。

  - `audio: string`

    Base64 编码的音频字节。格式必须与会话配置中的
    `input_audio_format` 字段所指定的格式一致。

  - `type: "input_audio_buffer.append"`

    事件类型，必须为 `input_audio_buffer.append`.

    - `"input_audio_buffer.append"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### Input Audio Buffer Clear Event

- `InputAudioBufferClearEvent object { type, event_id }`

  发送此事件以清除缓冲区中的音频字节。服务器将
  响应一个 `input_audio_buffer.cleared` 事件时。

  - `type: "input_audio_buffer.clear"`

    事件类型，必须为 `input_audio_buffer.clear`.

    - `"input_audio_buffer.clear"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 输入音频缓冲区已清除事件

- `InputAudioBufferClearedEvent object { event_id, type }`

  当输入音频缓冲区由客户端通过以下方式清除时返回：
  `input_audio_buffer.clear` 事件时。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "input_audio_buffer.cleared"`

    事件类型，必须为 `input_audio_buffer.cleared`.

    - `"input_audio_buffer.cleared"`

### 输入音频缓冲区提交事件

- `InputAudioBufferCommitEvent object { type, event_id }`

  发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息条目。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端将自动提交音频缓冲区。

  提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会从模型创建响应。服务端将使用以下内容进行响应： `input_audio_buffer.committed` 事件时。

  - `type: "input_audio_buffer.commit"`

    事件类型，必须为 `input_audio_buffer.commit`.

    - `"input_audio_buffer.commit"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### Input Audio Buffer Committed Event

- `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

  在输入音频缓冲区被提交时返回，可以由客户端提交，也可以由
  服务端 VAD 模式自动提交。 `item_id` 属性是用户消息项的 ID，
  因此将创建一个 `conversation.item.created` 事件
  并发送给客户端。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.committed"`

    事件类型，必须为 `input_audio_buffer.committed`.

    - `"input_audio_buffer.committed"`

  - `previous_item_id: optional string or null`

    新项将插入到其前面的项的 ID。
    如果该项没有前项，可以为 `null` 。

### 输入音频缓冲区收到 DTMF 事件

- `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

  **仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示
  电话键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
  是用户按下的键盘按键。该 `received_at` 是服务器接收到事件的 UTC Unix 时间戳
  。

  - `event: string`

    用户按下的电话按键。

  - `received_at: number`

    服务端收到 DTMF 事件时的 UTC Unix 时间戳。

  - `type: "input_audio_buffer.dtmf_event_received"`

    事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

    - `"input_audio_buffer.dtmf_event_received"`

### Input Audio Buffer Speech Started 事件

- `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

  由服务端在 `server_vad` 模式下发送，用于指示已在音频缓冲区中检测到语音。
  每当音频被添加到
  缓冲区时都可能发生此事件（除非已经检测到语音）。客户端可能希望使用此
  事件来中断音频播放或向用户提供视觉反馈。

  客户端应当预期会收到一个 `input_audio_buffer.speech_stopped` 事件
  ，当语音停止时触发。该 `item_id` 属性的值是当语音停止时将创建的用户消息条目的 ID，并且也会包含在
  事件中（除非客户端在 VAD 激活期间手动提交
  `input_audio_buffer.speech_stopped` 音频缓冲区）。
  在 VAD 激活期间手动提交音频缓冲区)。

  - `audio_start_ms: number`

    从会话期间写入缓冲区的所有音频开始起，到首次检测到语音时的毫秒数。该值对应于发送给模型的
    音频的起始位置，因此包含了在 Session 中配置的
    发送给模型的音频的起始位置，因此包含了在 Session 中配置的
    `prefix_padding_ms` 。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    当语音停止时将创建的用户消息条目的 ID。

  - `type: "input_audio_buffer.speech_started"`

    事件类型，必须为 `input_audio_buffer.speech_started`.

    - `"input_audio_buffer.speech_started"`

### 输入音频缓冲区语音停止事件

- `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

  在 `server_vad` 当服务端检测到音频缓冲区中的语音结束时返回。服务端还会发送一个
  语音结束事件。服务端还会发送一个 `conversation.item.created`
  事件以及从音频缓冲区创建的用户消息条目。

  - `audio_end_ms: number`

    从会话开始到语音停止的毫秒数。此值将
    对应于发送给模型的音频的结束，因此包含
    `min_silence_duration_ms` 。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    将创建的用户消息项的 ID。

  - `type: "input_audio_buffer.speech_stopped"`

    事件类型，必须为 `input_audio_buffer.speech_stopped`.

    - `"input_audio_buffer.speech_stopped"`

### 输入音频缓冲区超时已触发

- `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

  在输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话设置中配置，表示
  with `idle_timeout_ms` 在 `turn_detection` 会话设置中进行配置，它表示
  在配置的持续时间内未检测到任何语音。

  该 `audio_start_ms` 和 `audio_end_ms` 字段表示从写入输入音频缓冲区的音频开头偏移的、最后一次
  模型响应之后到触发时刻的音频片段。这意味着它划定了处于静音状态的
  音频片段，而起始值与结束值之间的差值大致等于所配置的超时时间。
  音频片段的差值将与所配置的超时时间大致一致。

  空音频将作为一个 `input_audio` 项提交到对话中（将会有一个
  `input_audio_buffer.committed` 事件），并生成模型响应。可能存在一些
  未能触发 VAD 但仍被模型检测到的语音，因此模型可能会响应与对话
  相关的内容，或提示你继续说话。

  - `audio_end_ms: number`

    触发超时时已写入输入音频缓冲区的音频的毫秒偏移量。

  - `audio_start_ms: number`

    在最后一次模型响应的播放时间之后写入输入音频缓冲区的音频的毫秒偏移量。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    与此片段关联的项的 ID。

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

### Mcp 列出工具已完成

- `McpListToolsCompleted object { event_id, item_id, type }`

  在列出某个项目的 MCP 工具完成后返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具项的 ID。

  - `type: "mcp_list_tools.completed"`

    事件类型，必须为 `mcp_list_tools.completed`.

    - `"mcp_list_tools.completed"`

### Mcp List Tools Failed

- `McpListToolsFailed object { event_id, item_id, type }`

  在列出某个项目的 MCP 工具失败时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具项的 ID。

  - `type: "mcp_list_tools.failed"`

    事件类型，必须为 `mcp_list_tools.failed`.

    - `"mcp_list_tools.failed"`

### Mcp List Tools In Progress

- `McpListToolsInProgress object { event_id, item_id, type }`

  当某个项目的 MCP 工具列表正在获取时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 列出工具项的 ID。

  - `type: "mcp_list_tools.in_progress"`

    事件类型，必须为 `mcp_list_tools.in_progress`.

    - `"mcp_list_tools.in_progress"`

### 降噪类型

- `NoiseReductionType = "near_field" or "far_field"`

  降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

  - `"near_field"`

  - `"far_field"`

### Output Audio Buffer Clear Event

- `OutputAudioBufferClearEvent object { type, event_id }`

  **仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
  停止生成音频并发出 `output_audio_buffer.cleared` 事件。此
  事件应之前伴随一个 `response.cancel` 客户端事件，以停止
  当前响应的生成。
  [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

  - `type: "output_audio_buffer.clear"`

    事件类型，必须为 `output_audio_buffer.clear`.

    - `"output_audio_buffer.clear"`

  - `event_id: optional string`

    用于错误处理的客户端事件的唯一 ID。

### 速率限制更新事件

- `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

  在 Response 开始时发出，用于指示已更新的速率限制。
  创建 Response 时，会为输出“预留”部分 token
  ，此处显示的速率限制反映了该预留量，随后会在 Response
  完成时相应地进行调整。

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

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在发出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。以
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        提供可提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频片段的可选文本。
        片段。
        对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
        以下模型不支持 prompt： `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。此设置
          适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
          当前上下文有效地提示用户继续对话。
          当前上下文。

          超时时间将在最后一个模型响应的音频播放完成后生效，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 相关联）将在达到超时阈值时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）默认
          会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
          500ms。值越小，模型响应越快，
          但可能会在用户短句停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时已说完。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当向默认
          会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，相对于原始速度的倍数。
      1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

      此参数是对生成后音频的后处理调整，也可以
      通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
      使用音频回应过至少一次，会话期间就无法再更改声音。
      我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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
    降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
    对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在发出转录文本之前等待的时间。
      较高的值可以提高转录准确率，但会增加延迟。
      仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。以
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      提供可提高准确率并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续先前音频片段的可选文本。
      片段。
      对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
      以下模型不支持 prompt： `gpt-realtime-whisper` 。

  - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

    轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。此设置
        适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
        当前上下文有效地提示用户继续对话。
        当前上下文。

        超时时间将在最后一个模型响应的音频播放完成后生效，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 相关联）将在达到超时阈值时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）默认
        会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
        500ms。值越小，模型响应越快，
        但可能会在用户短句停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时已说完。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当向默认
        会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

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

    模型语音响应的速度，相对于原始速度的倍数。
    1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

    此参数是对生成后音频的后处理调整，也可以
    通过提示让模型说得更快或更慢。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于回应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
    `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
    一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
    使用音频回应过至少一次，会话期间就无法再更改声音。
    我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

  轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超过该时间后将自动触发模型响应。此设置
      适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
      当前上下文有效地提示用户继续对话。
      当前上下文。

      超时时间将在最后一个模型响应的音频播放完成后生效，
      即设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与 Response 相关联）将在达到超时阈值时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）默认
      会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
      500ms。值越小，模型响应越快，
      但可能会在用户短句停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值需要更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来判断用户何时已说完。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当向默认
      会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

### Realtime Client Event

- `RealtimeClientEvent = ConversationItemCreateEvent or ConversationItemDeleteEvent or ConversationItemRetrieveEvent or 8 more`

  一个实时客户端事件。

  - `ConversationItemCreateEvent object { item, type, event_id, previous_item_id }`

    向会话上下文添加新的 Item，包括消息、函数
    调用和函数调用响应。此事件既可用于填充会话
    "历史记录"，也可用于在流式过程中添加新的项，但当前存在
    的限制是无法填充助手音频消息。

    如果成功，服务器将以 `conversation.item.created`
    事件进行响应，否则以 `error` 事件将被发送。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。对于系统消息始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。对于系统消息始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。对于系统消息始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。对于系统消息始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。对于系统消息始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

            有关该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。对于系统消息始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数对应的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。对于系统消息始终为 `mcp_call`.

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

          条目的类型。对于系统消息始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.create"`

      事件类型，必须为 `conversation.item.create`.

      - `"conversation.item.create"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

    - `previous_item_id: optional string`

      前置条目插入位置的 ID，新条目将插入到该条目之后。若未设置，新条目将追加到对话末尾。

      若设置为 `root`，新条目将添加到对话开头。

      若设置为现有 ID，则可在对话中间插入条目。若找不到该 ID，将返回错误，并且不会添加该条目。

  - `ConversationItemDeleteEvent object { item_id, type, event_id }`

    当你想要从对话历史中移除某个条目时，发送此事件
    。服务端将响应一个 `conversation.item.deleted` 事件，
    除非该条目不存在于对话历史中，此时
    服务端将响应一个错误。

    - `item_id: string`

      要删除的条目的 ID。

    - `type: "conversation.item.delete"`

      事件类型，必须为 `conversation.item.delete`.

      - `"conversation.item.delete"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `ConversationItemRetrieveEvent object { item_id, type, event_id }`

    当你想要获取服务器对会话历史中特定条目的表示时发送此事件。例如，可用于在降噪和 VAD 之后检查用户音频。
    服务器将使用一个 `conversation.item.retrieved` 事件，
    除非该条目不存在于对话历史中，此时
    服务端将响应一个错误。

    - `item_id: string`

      要检索的条目 ID。

    - `type: "conversation.item.retrieve"`

      事件类型，必须为 `conversation.item.retrieve`.

      - `"conversation.item.retrieve"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `ConversationItemTruncateEvent object { audio_end_ms, content_index, item_id, 2 more }`

    发送此事件可截断之前助手消息的音频。服务端
    生成音频的速度快于实时，因此当用户
    进行打断以截断已发送到客户端但尚未
    播放的音频时，该事件非常有用。这将使服务端对
    音频的理解与客户端的播放保持同步。

    截断音频将删除服务端的文本转录，以确保
    上下文中不存在用户尚未听到的文本。

    如果成功，服务器将以 `conversation.item.truncated`
    事件时。

    - `audio_end_ms: number`

      音频被截断所包含的最大时长，单位为毫秒。如果
      audio_end_ms 大于实际音频时长，服务端
      将返回错误。

    - `content_index: number`

      要截断的内容部分的索引。将此值设置为 `0`.

    - `item_id: string`

      要截断的助手消息项的 ID。只有助手消息
      项可以被截断。

    - `type: "conversation.item.truncate"`

      事件类型，必须为 `conversation.item.truncate`.

      - `"conversation.item.truncate"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到输入音频缓冲区。该音频
    缓冲区是临时存储，你可以向其写入数据并在稍后提交。"提交"将根据缓冲区内容在会话历史中创建一个新的
    用户消息条目，并清空缓冲区。
    输入音频转录（如果启用）将在缓冲区提交时生成。

    如果启用了 VAD，音频缓冲区用于检测语音，并由服务端决定何时提交。当禁用 Server VAD 时，你必须手动提交音频缓冲区。
    手动提交音频缓冲区。输入音频降噪会在向音频缓冲区的写入操作上生效。
    手动提交音频缓冲区。输入音频降噪会在向音频缓冲区的写入操作上生效。

    客户端可以选择在每个事件中放入多少音频，最大为
    15 MiB，例如从客户端流式传输较小的块可能使
    VAD 响应更及时。与大多数其他客户端事件不同，服务端不会
    针对此事件发送确认响应。

    - `audio: string`

      Base64 编码的音频字节。格式必须与会话配置中的
      `input_audio_format` 字段所指定的格式一致。

    - `type: "input_audio_buffer.append"`

      事件类型，必须为 `input_audio_buffer.append`.

      - `"input_audio_buffer.append"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `InputAudioBufferClearEvent object { type, event_id }`

    发送此事件以清除缓冲区中的音频字节。服务器将
    响应一个 `input_audio_buffer.cleared` 事件时。

    - `type: "input_audio_buffer.clear"`

      事件类型，必须为 `input_audio_buffer.clear`.

      - `"input_audio_buffer.clear"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `OutputAudioBufferClearEvent object { type, event_id }`

    **仅限 WebRTC/SIP：** Emit 用于截断当前的音频响应。这将触发服务端
    停止生成音频并发出 `output_audio_buffer.cleared` 事件。此
    事件应之前伴随一个 `response.cancel` 客户端事件，以停止
    当前响应的生成。
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `type: "output_audio_buffer.clear"`

      事件类型，必须为 `output_audio_buffer.clear`.

      - `"output_audio_buffer.clear"`

    - `event_id: optional string`

      用于错误处理的客户端事件的唯一 ID。

  - `InputAudioBufferCommitEvent object { type, event_id }`

    发送此事件以提交用户输入音频缓冲区，这将在对话中创建一个新的用户消息条目。如果输入音频缓冲区为空，此事件将产生错误。在 Server VAD 模式下，客户端无需发送此事件，服务端将自动提交音频缓冲区。

    提交输入音频缓冲区将触发输入音频转录（如果在会话配置中启用），但不会从模型创建响应。服务端将使用以下内容进行响应： `input_audio_buffer.committed` 事件时。

    - `type: "input_audio_buffer.commit"`

      事件类型，必须为 `input_audio_buffer.commit`.

      - `"input_audio_buffer.commit"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `ResponseCancelEvent object { type, event_id, response_id }`

    发送此事件以取消进行中的响应。服务端会响应一个
    状态为 `response.done` 的事件。如果 `response.status=cancelled`。没有可取消的响应，服务端会返回错误。即使
    没有响应正在进行，调用
    也是安全的，错误会被返回，会话不会受到影响。 `response.cancel` 即使没有响应正在进行，错误也会被返回，
    会话将保持不受影响。

    - `type: "response.cancel"`

      事件类型，必须为 `response.cancel`.

      - `"response.cancel"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

    - `response_id: optional string`

      要取消的特定响应 ID - 如果未提供，将取消一个
      默认对话中的进行中响应。

  - `ResponseCreateEvent object { type, event_id, response }`

    此事件指示服务器创建 Response，即触发
    模型推理。在 Server VAD 模式下，服务器将自动创建 Responses
    。

    Response 将至少包含一个 Item，也可能包含两个；在此情况下，
    第二个将是函数调用。默认情况下，这些 Item 将附加到
    对话历史记录。

    服务器将使用一个 `response.created` 事件、针对 Items
    和已创建内容的事件，以及最后的 `response.done` 事件，用于指示
    响应已完成。

    该 `response.create` 事件包含推理配置，例如
    `instructions` 和 `tools`。如果设置了这些参数，它们将仅针对本次响应覆盖 Session 的
    配置。

    响应可以在默认 Conversation 之外创建，这意味着它们可以
    接收任意输入，并且可以选择不将输出写入该 Conversation。
    同一时间只能有一个响应写入默认 Conversation，但除此之外，多个
    响应可以并行创建。 `metadata` 字段非常适合用来区分
    多个同时进行的响应。

    客户端可以设置 `conversation` 为 `none` 来创建一个不写入默认
    Conversation 的响应。可以通过 `input` 字段提供任意输入，该字段是一个接受
    原始 Item 和对已有 Item 引用的数组。

    - `type: "response.create"`

      事件类型，必须为 `response.create`.

      - `"response.create"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

    - `response: optional RealtimeResponseCreateParams`

      使用以下参数创建一个新的 Realtime 响应

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
            `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
            一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
            使用音频回应过至少一次，会话期间就无法再更改声音。
            我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

        控制响应被添加到的对话。当前支持
        `auto` 和 `none`，以及 `auto` 作为默认值。该 `auto` 值
        表示响应的内容将被添加到默认
        对话中。将其设置为 `none` 以创建一个不会将项目添加到默认对话的
        带外响应。

        - `string`

        - `"auto" or "none"`

          控制响应被添加到的对话。当前支持
          `auto` 和 `none`，以及 `auto` 作为默认值。该 `auto` 值
          表示响应的内容将被添加到默认
          对话中。将其设置为 `none` 以创建一个不会将项目添加到默认对话的
          带外响应。

          - `"auto"`

          - `"none"`

      - `input: optional array of ConversationItem`

        在模型提示中包含的输入项。使用此字段
        会为该 Response 创建一个新的上下文，而不是使用默认
        对话。空数组 `[]` 将清除该 Response 的上下文。
        注意，这可以包含对之前在会话中出现的项目的引用，
        通过其 id 进行引用。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime 项。

      - `instructions: optional string`

        默认的系统指令（即系统消息）会预置到模型调用之前。此字段允许客户端引导模型输出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“语速较快”、“在声音中注入情感”、“经常笑”）。指令不一定被模型遵循，但它们为模型期望的行为提供了指导。
        注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大
        token 数。默认为 `inf`.

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前可能的取值仅为
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        output 设置为 mode `text` 将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以在并行调用多个工具。仅由
        推理 Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          要在你的
          提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（如果有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或多
          个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时如何告知用户的指导
            （如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
          （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
            URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
            必须处理 OAuth 授权流程，并在此提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. 当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

  - `SessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新会话的配置。
    客户端可以随时发送此事件以更新任何字段
    除 `voice` 和 `model`. `voice` 外，只能在尚未产生其他音频输出时更新。

    当服务器收到 `session.update`，时，它会响应
    状态为 `session.updated` 事件，显示完整的有效配置。
    只有 `session.update` 中存在的字段才会被更新。要清空类似
    `instructions`，的字段，请传递空字符串。要清空类似 `tools`，的字段，请传递空数组。
    要清空类似 `turn_detection`，的字段，请传递 `null`.

    - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

      更新 Realtime 会话。选择 realtime
      会话或转录会话。

      - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

        Realtime 会话对象配置。

        - `type: "realtime"`

          要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional RealtimeAudioConfig`

          输入和输出音频的配置。

          - `input: optional RealtimeAudioConfigInput`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
              对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

              - `delay: optional "minimal" or "low" or "medium" or 2 more`

                控制模型在发出转录文本之前等待的时间。
                较高的值可以提高转录准确率，但会增加延迟。
                仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

                - `"minimal"`

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"xhigh"`

              - `keywords: optional array of string`

                用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `language: optional string`

                输入音频的语言。以
                [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
                提供可提高准确率并降低延迟。

              - `languages: optional array of string`

                输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

              - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                - `string`

                - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                  用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                  - `"whisper-1"`

                  - `"gpt-transcribe"`

                  - `"gpt-live-transcribe"`

                  - `"gpt-4o-mini-transcribe"`

                  - `"gpt-4o-mini-transcribe-2025-12-15"`

                  - `"gpt-4o-transcribe"`

                  - `"gpt-4o-transcribe-diarize"`

                  - `"gpt-realtime-whisper"`

              - `prompt: optional string`

                用于引导模型风格或延续先前音频片段的可选文本。
                片段。
                对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
                对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
                以下模型不支持 prompt： `gpt-realtime-whisper` 。

            - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

              轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。此设置
                  适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                  当前上下文有效地提示用户继续对话。
                  当前上下文。

                  超时时间将在最后一个模型响应的音频播放完成后生效，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 相关联）将在达到超时阈值时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）默认
                  会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                  为毫秒）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                  500ms。值越小，模型响应越快，
                  但可能会在用户短句停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更响亮的音频才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时已说完。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当向默认
                  会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

          - `output: optional RealtimeAudioConfigOutput`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音响应的速度，相对于原始速度的倍数。
              1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

              此参数是对生成后音频的后处理调整，也可以
              通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

              模型用于回应的声音。支持的内置声音有
              `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
              `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
              一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
              使用音频回应过至少一次，会话期间就无法再更改声音。
              我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

          在服务端输出中包含的附加字段。

          `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

          注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。提供 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 表示给定模型可用的最大
          token 数。默认为 `inf`.

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

          模型可以响应的模态集合。默认值为 `["audio"]`，表示
          模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
          模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `parallel_tool_calls: optional boolean`

          模型是否可以在并行调用多个工具。仅由
          推理 Realtime 模型，例如 `gpt-realtime-2`.

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `reasoning: optional RealtimeReasoning`

          用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `tool_choice: optional RealtimeToolChoiceConfig`

          模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个工具（如果有）。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息与调用一个或多
            个工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

          - `ToolChoiceFunction object { name, type }`

            使用此选项可强制模型调用特定函数。

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `tools: optional RealtimeToolsConfig`

          模型可使用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
            （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

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

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
              URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
              必须处理 OAuth 授权流程，并在此提供该令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
              关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

              当前支持 `connector_id` 的取值包括：

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

              此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，也可以是与需要审批的工具关联的筛选对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤条件。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤条件。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`. 当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其中一个。

            - `tunnel_id: optional string`

              要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

        - `tracing: optional RealtimeTracingConfig or null`

          Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
          追踪，就无法再修改该配置。

          `auto` 将为会话创建一个使用默认值的追踪，用于
          工作流名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            追踪的细粒度配置。

            - `group_id: optional string`

              附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
              筛选。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称。这用于
              在 Traces Dashboard 中命名该追踪。

        - `truncation: optional RealtimeTruncation`

          当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

          客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

          截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

          截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

          - `"auto" or "disabled"`

            该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

            - `retention_ratio: number`

              在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

              - `post_instructions: optional number`

                指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

      - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

        实时转录会话对象配置。

        - `type: "transcription"`

          要创建的会话类型。对于 Realtime API 始终为 `transcription` 用于转录会话。

          - `"transcription"`

        - `audio: optional RealtimeTranscriptionSessionAudio`

          输入和输出音频的配置。

          - `input: optional RealtimeTranscriptionSessionAudioInput`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
              对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional AudioTranscription`

              输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

            - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

              轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。此设置
                  适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                  当前上下文有效地提示用户继续对话。
                  当前上下文。

                  超时时间将在最后一个模型响应的音频播放完成后生效，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 相关联）将在达到超时阈值时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）默认
                  会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                  为毫秒）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                  500ms。值越小，模型响应越快，
                  但可能会在用户短句停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更响亮的音频才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时已说完。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当向默认
                  会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          在服务端输出中包含的附加字段。

          `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      用于标识此事件的可选客户端生成 ID。这是由客户端自行指定的任意字符串。如果事件发生错误，它将被传回，但对应的 `session.updated` 事件将不会包含它。

### Realtime 对话项助手消息

- `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

  Realtime 对话中的助手消息项。

  - `content: array of object { audio, text, transcript, type }`

    消息的内容。

    - `audio: optional string`

      Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

    - `text: optional string`

      文本内容。

    - `transcript: optional string`

      音频内容的文字记录；如果输出类型为 `audio`.

    - `type: optional "output_text" or "output_audio"`

      内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

      - `"output_text"`

      - `"output_audio"`

  - `role: "assistant"`

    消息发送者的角色。对于系统消息始终为 `assistant`.

    - `"assistant"`

  - `type: "message"`

    条目的类型。对于系统消息始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项函数调用

- `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

  Realtime 对话中的函数调用项。

  - `arguments: string`

    函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

  - `name: string`

    被调用函数的名称。

  - `type: "function_call"`

    条目的类型。对于系统消息始终为 `function_call`.

    - `"function_call"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

  - `call_id: optional string`

    函数调用的 ID。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项函数调用输出

- `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

  Realtime 对话中的函数调用输出项。

  - `call_id: string`

    此输出对应的函数调用的 ID。

  - `output: string`

    函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

  - `type: "function_call_output"`

    条目的类型。对于系统消息始终为 `function_call_output`.

    - `"function_call_output"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

    - `"realtime.item"`

  - `status: optional "completed" or "incomplete" or "in_progress"`

    条目的状态。对对话没有影响。

    - `"completed"`

    - `"incomplete"`

    - `"in_progress"`

### Realtime 对话项系统消息

- `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

  Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

  - `content: array of object { text, type }`

    消息的内容。

    - `text: optional string`

      文本内容。

    - `type: optional "input_text"`

      内容类型。对于系统消息始终为 `input_text` 。

      - `"input_text"`

  - `role: "system"`

    消息发送者的角色。对于系统消息始终为 `system`.

    - `"system"`

  - `type: "message"`

    条目的类型。对于系统消息始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

      Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

    - `detail: optional "auto" or "low" or "high"`

      图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `image_url: optional string`

      Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

    - `text: optional string`

      文本内容（用于 `input_text`).

    - `transcript: optional string`

      音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

    - `type: optional "input_text" or "input_audio" or "input_image"`

      内容类型（`input_text`, `input_audio`，或 `input_image`).

      - `"input_text"`

      - `"input_audio"`

      - `"input_image"`

  - `role: "user"`

    消息发送者的角色。对于系统消息始终为 `user`.

    - `"user"`

  - `type: "message"`

    条目的类型。对于系统消息始终为 `message`.

    - `"message"`

  - `id: optional string`

    条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

  - `object: optional "realtime.item"`

    所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

### 实时错误事件

- `RealtimeErrorEvent object { error, event_id, type }`

  在发生错误时返回，错误可能是客户端问题或服务端
  问题。大多数错误是可恢复的，会话将保持打开状态，我们
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

    函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时如何告知用户的指导
    （如果有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

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

    条目的类型。对于系统消息始终为 `mcp_approval_request`.

    - `"mcp_approval_request"`

### Realtime Mcp Approval Response

- `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

  响应 MCP 审批请求的 Realtime 项。

  - `id: string`

    审批响应的唯一 ID。

  - `approval_request_id: string`

    所回答的审批请求的 ID。

  - `approve: boolean`

    请求是否被批准。

  - `type: "mcp_approval_response"`

    条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

      有关该工具的附加注解。

    - `description: optional string or null`

      工具的描述。

  - `type: "mcp_list_tools"`

    条目的类型。对于系统消息始终为 `mcp_list_tools`.

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

    传递给该工具的参数对应的 JSON 字符串。

  - `name: string`

    所运行工具的名称。

  - `server_label: string`

    运行该工具的 MCP 服务器的标签。

  - `type: "mcp_call"`

    条目的类型。对于系统消息始终为 `mcp_call`.

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

  用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

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

        模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
        会话中更改语音。当前
        可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
          会话中更改语音。当前
          可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    响应将添加到哪个会话，由 `conversation`
    事件中的 `response.create` 字段决定。如果 `auto`，响应将添加到
    默认会话，并且 `conversation_id` 的值将是类似
    `conv_1234`。没有可取消的响应，服务端会返回错误。即使 `none`，的 ID；如果为该值，响应不会添加到任何会话，并且
    的值 `conversation_id` 将为 `null`。如果响应是由 VAD
    自动触发的，则该响应将添加到默认会话

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    中，包括本次响应中使用的工具调用。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。这可以
    以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    response 生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅为
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    output 设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `status: optional "completed" or "cancelled" or "failed" or 2 more`

    response 的最终状态（`completed`, `cancelled`, `failed`，或
    `incomplete`, `in_progress`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

    - `"in_progress"`

  - `status_details: optional RealtimeResponseStatus`

    关于该状态的更多详细信息。

    - `error: optional object { code, type }`

      导致 response 失败的错误描述，
      当该字段被填充时， `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误的类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      Response 未完成的原因。对于一个 `cancelled` Response，可能为以下值之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于一个  `incomplete` Response，可能为以下值之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了 response）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致 response 失败的错误类型，对应
      于 `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    Response 的使用统计信息，对应计费。一次
    Realtime API 会话将维护一个对话上下文，并将新的
    Items 追加到该对话中，因此先前轮次的输出（文本和
    音频 tokens）将成为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      Response 中使用的输入 tokens 的详细信息。Cached tokens 是指对话中先前轮次作为当前响应的上下文而被包含的 tokens。此处的 cached tokens 计为 input tokens 的一个子集，也就是说 input tokens 包含 cached tokens 与未缓存的 tokens。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数。

      - `cached_tokens: optional number`

        用作 Response 输入的缓存 token 数。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        有关用作 Response 输入的缓存 token 的详细信息。

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

      Response 中使用的输入 token 数，包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      有关 Response 中使用的输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数，包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中包括输入和输出在内的 token 总数，包括
      文本和音频 token。

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
      `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
      使用音频回应过至少一次，会话期间就无法再更改声音。
      我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

  使用以下参数创建一个新的 Realtime 响应

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
        `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
        一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
        使用音频回应过至少一次，会话期间就无法再更改声音。
        我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

    控制响应被添加到的对话。当前支持
    `auto` 和 `none`，以及 `auto` 作为默认值。该 `auto` 值
    表示响应的内容将被添加到默认
    对话中。将其设置为 `none` 以创建一个不会将项目添加到默认对话的
    带外响应。

    - `string`

    - `"auto" or "none"`

      控制响应被添加到的对话。当前支持
      `auto` 和 `none`，以及 `auto` 作为默认值。该 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个不会将项目添加到默认对话的
      带外响应。

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    在模型提示中包含的输入项。使用此字段
    会为该 Response 创建一个新的上下文，而不是使用默认
    对话。空数组 `[]` 将清除该 Response 的上下文。
    注意，这可以包含对之前在会话中出现的项目的引用，
    通过其 id 进行引用。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    默认的系统指令（即系统消息）会预置到模型调用之前。此字段允许客户端引导模型输出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“语速较快”、“在声音中注入情感”、“经常笑”）。指令不一定被模型遵循，但它们为模型期望的行为提供了指导。
    注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大
    token 数。默认为 `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。这可以
    以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前可能的取值仅为
    `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
    output 设置为 mode `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以在并行调用多个工具。仅由
    推理 Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      要在你的
      提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或多
      个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可使用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时如何告知用户的指导
        （如果有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
      （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

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

          允许使用的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
        URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
        必须处理 OAuth 授权流程，并在此提供该令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
        关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持 `connector_id` 的取值包括：

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

        此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，也可以是与需要审批的工具关联的筛选对象
          。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`. 当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

### Realtime Response Status

- `RealtimeResponseStatus object { error, reason, type }`

  关于该状态的更多详细信息。

  - `error: optional object { code, type }`

    导致 response 失败的错误描述，
    当该字段被填充时， `status` 为 `failed`.

    - `code: optional string`

      错误代码（如果有）。

    - `type: optional string`

      错误的类型。

  - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

    Response 未完成的原因。对于一个 `cancelled` Response，可能为以下值之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于一个  `incomplete` Response，可能为以下值之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了 response）。

    - `"turn_detected"`

    - `"client_cancelled"`

    - `"max_output_tokens"`

    - `"content_filter"`

  - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

    导致 response 失败的错误类型，对应
    于 `status` 字段（`completed`, `cancelled`, `incomplete`,
    `failed`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

### Realtime Response Usage

- `RealtimeResponseUsage object { input_token_details, input_tokens, output_token_details, 2 more }`

  Response 的使用统计信息，对应计费。一次
  Realtime API 会话将维护一个对话上下文，并将新的
  Items 追加到该对话中，因此先前轮次的输出（文本和
  音频 tokens）将成为后续轮次的输入。

  - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

    Response 中使用的输入 tokens 的详细信息。Cached tokens 是指对话中先前轮次作为当前响应的上下文而被包含的 tokens。此处的 cached tokens 计为 input tokens 的一个子集，也就是说 input tokens 包含 cached tokens 与未缓存的 tokens。

    - `audio_tokens: optional number`

      用作 Response 输入的音频 token 数。

    - `cached_tokens: optional number`

      用作 Response 输入的缓存 token 数。

    - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

      有关用作 Response 输入的缓存 token 的详细信息。

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

    Response 中使用的输入 token 数，包括文本和
    音频 token。

  - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

    有关 Response 中使用的输出 token 的详细信息。

    - `audio_tokens: optional number`

      Response 中使用的音频 token 数。

    - `text_tokens: optional number`

      Response 中使用的文本 token 数。

  - `output_tokens: optional number`

    Response 中发送的输出 token 数，包括文本和
    音频 token。

  - `total_tokens: optional number`

    Response 中包括输入和输出在内的 token 总数，包括
    文本和音频 token。

### Realtime Response Usage Input Token Details

- `RealtimeResponseUsageInputTokenDetails object { audio_tokens, cached_tokens, cached_tokens_details, 2 more }`

  Response 中使用的输入 tokens 的详细信息。Cached tokens 是指对话中先前轮次作为当前响应的上下文而被包含的 tokens。此处的 cached tokens 计为 input tokens 的一个子集，也就是说 input tokens 包含 cached tokens 与未缓存的 tokens。

  - `audio_tokens: optional number`

    用作 Response 输入的音频 token 数。

  - `cached_tokens: optional number`

    用作 Response 输入的缓存 token 数。

  - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

    有关用作 Response 输入的缓存 token 的详细信息。

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

### Realtime Response Usage Output Token Details

- `RealtimeResponseUsageOutputTokenDetails object { audio_tokens, text_tokens }`

  有关 Response 中使用的输出 token 的详细信息。

  - `audio_tokens: optional number`

    Response 中使用的音频 token 数。

  - `text_tokens: optional number`

    Response 中使用的文本 token 数。

### Realtime Server Event

- `RealtimeServerEvent = ConversationCreatedEvent or ConversationItemCreatedEvent or ConversationItemDeletedEvent or 43 more`

  实时服务端事件。

  - `ConversationCreatedEvent object { conversation, event_id, type }`

    在对话创建时返回。在会话创建后立即发出。

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

    在创建对话项时返回。产生此事件的情况有以下几种：

    - 服务器正在生成 Response，如果成功将产生
      一个或两个 Item，类型为 `message`
      (role `assistant`) 或类型 `function_call`.
    - 输入音频缓冲区已被提交，由客户端或
      服务器（在 `server_vad` 模式下）提交。服务器将获取
      输入音频缓冲区的内容并将其添加到新的用户消息 Item 中。
    - 客户端已发送 `conversation.item.create` 事件以添加新的 Item
      到 Conversation。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。对于系统消息始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。对于系统消息始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。对于系统消息始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。对于系统消息始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。对于系统消息始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

            有关该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。对于系统消息始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数对应的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。对于系统消息始终为 `mcp_call`.

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

          条目的类型。对于系统消息始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `type: "conversation.item.created"`

      事件类型，必须为 `conversation.item.created`.

      - `"conversation.item.created"`

    - `previous_item_id: optional string or null`

      Conversation 上下文中前一个项的 ID，用于让
      客户端理解对话顺序。可以是 `null` ，如果该
      项没有前驱项。

  - `ConversationItemDeletedEvent object { event_id, item_id, type }`

    当会话中的某个条目被客户端通过一个
    `conversation.item.delete` 事件删除时返回。该事件用于同步
    服务端对会话历史的理解与客户端的视图。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被删除条目的 ID。

    - `type: "conversation.item.deleted"`

      事件类型，必须为 `conversation.item.deleted`.

      - `"conversation.item.deleted"`

  - `ConversationItemInputAudioTranscriptionCompletedEvent object { content_index, event_id, item_id, 5 more }`

    该事件是为用户音频执行音频转写后写入用户音频缓冲区的输出，转写在
    用户音频缓冲区由客户端或服务端提交时启动（启用 VAD 时由服务端提交）。转写
    与 Response 创建异步进行，因此该事件可能先于也可能晚于
    Response 事件到达。Realtime API 模型原生支持音
    频，因此输入转写是由独立的 ASR（自动语音识别）模型运行的单独过程。

    接口 模型原生支持音频，因此输入转写是由独立的 ASR（自动语音识别）模型
    运行的单独过程。转写文本可能与模型的解读略有差异，应作为大致参考。
    转写文本可能与模型的解读
    略有差异，应作为大致参考。

    - `content_index: number`

      包含该音频的内容分块的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在被转录的音频所在条目的 ID。

    - `transcript: string`

      转录后的文本。

    - `type: "conversation.item.input_audio_transcription.completed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.completed`.

      - `"conversation.item.input_audio_transcription.completed"`

    - `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      转录的使用统计，按 ASR 模型的价格计费，而不是 realtime 模型的价格。

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        按 token 使用量计费的模型的使用统计。

        - `input_tokens: number`

          本次请求计费的输入 token 数。

        - `output_tokens: number`

          生成的输出 token 数。

        - `total_tokens: number`

          使用的 token 总数（输入 + 输出）。

        - `type: "tokens"`

          使用对象的类型。对于此变体，始终为 `tokens` 。

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          本次请求计费的输入 token 的详细信息。

          - `audio_tokens: optional number`

            本次请求计费的音频 token 数量。

          - `text_tokens: optional number`

            本次请求计费的文本 token 数量。

      - `Duration object { seconds, type }`

        按音频输入时长计费模型的用量统计。

        - `seconds: number`

          输入音频的时长（以秒为单位）。

        - `type: "duration"`

          使用对象的类型。对于此变体，始终为 `duration` 。

          - `"duration"`

    - `languages: optional array of TranscriptionLanguage`

      音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示无法可靠检测到任何语言。

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

    当输入音频转录内容部分的文本值通过增量转录结果更新时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      正在被转录的音频所在条目的 ID。

    - `type: "conversation.item.input_audio_transcription.delta"`

      事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

      - `"conversation.item.input_audio_transcription.delta"`

    - `content_index: optional number`

      项目内容数组中内容部分的索引。

    - `delta: optional string`

      文本增量。

    - `logprobs: optional array of LogProbProperties or null`

      转录的对数概率。可通过配置会话启用 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于为这段转录选择的 token 的对数概率。这有助于判断在给定转录片段中是否存在多个有效选项。

      - `token: string`

        用于生成该对数概率的 token。

      - `bytes: array of number`

        用于生成该对数概率的字节。

      - `logprob: number`

        该 token 的对数概率。

  - `ConversationItemInputAudioTranscriptionFailedEvent object { content_index, error, event_id, 2 more }`

    当配置了输入音频转录，且针对用户消息的转录
    请求失败时返回。这些事件与其他事件是分开的，以便客户端识别相关的 Item。
    `error` 以便客户端能够识别相关的 Item。

    - `content_index: number`

      包含该音频的内容分块的索引。

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

      用户消息项的 ID。

    - `type: "conversation.item.input_audio_transcription.failed"`

      事件类型，必须为
      `conversation.item.input_audio_transcription.failed`.

      - `"conversation.item.input_audio_transcription.failed"`

  - `ConversationItemRetrieved object { event_id, item, type }`

    当通过以下方式检索对话项时返回： `conversation.item.retrieve`。提供该事件是为了获取服务端对项的表示，例如在噪声消除和 VAD 之后访问经过后处理的音频数据。它包含该项的完整内容，包括音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.retrieved"`

      事件类型，必须为 `conversation.item.retrieved`.

      - `"conversation.item.retrieved"`

  - `ConversationItemTruncatedEvent object { audio_end_ms, content_index, event_id, 2 more }`

    当较早的助手音频消息项被
    客户端通过 `conversation.item.truncate` 事件截断时返回。该事件用于
    使服务端对音频的理解与客户端的播放保持同步。

    此操作将截断音频并移除 服务端 文本转录
    以确保上下文中的文本都是用户已经听过的。

    - `audio_end_ms: number`

      音频被截断的时长（毫秒）。

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
    问题。大多数错误是可恢复的，会话将保持打开状态，我们
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

    当输入音频缓冲区由客户端通过以下方式清除时返回：
    `input_audio_buffer.clear` 事件时。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "input_audio_buffer.cleared"`

      事件类型，必须为 `input_audio_buffer.cleared`.

      - `"input_audio_buffer.cleared"`

  - `InputAudioBufferCommittedEvent object { event_id, item_id, type, previous_item_id }`

    在输入音频缓冲区被提交时返回，可以由客户端提交，也可以由
    服务端 VAD 模式自动提交。 `item_id` 属性是用户消息项的 ID，
    因此将创建一个 `conversation.item.created` 事件
    并发送给客户端。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.committed"`

      事件类型，必须为 `input_audio_buffer.committed`.

      - `"input_audio_buffer.committed"`

    - `previous_item_id: optional string or null`

      新项将插入到其前面的项的 ID。
      如果该项没有前项，可以为 `null` 。

  - `InputAudioBufferDtmfEventReceivedEvent object { event, received_at, type }`

    **仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示
    电话键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
    是用户按下的键盘按键。该 `received_at` 是服务器接收到事件的 UTC Unix 时间戳
    。

    - `event: string`

      用户按下的电话按键。

    - `received_at: number`

      服务端收到 DTMF 事件时的 UTC Unix 时间戳。

    - `type: "input_audio_buffer.dtmf_event_received"`

      事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

      - `"input_audio_buffer.dtmf_event_received"`

  - `InputAudioBufferSpeechStartedEvent object { audio_start_ms, event_id, item_id, type }`

    由服务端在 `server_vad` 模式下发送，用于指示已在音频缓冲区中检测到语音。
    每当音频被添加到
    缓冲区时都可能发生此事件（除非已经检测到语音）。客户端可能希望使用此
    事件来中断音频播放或向用户提供视觉反馈。

    客户端应当预期会收到一个 `input_audio_buffer.speech_stopped` 事件
    ，当语音停止时触发。该 `item_id` 属性的值是当语音停止时将创建的用户消息条目的 ID，并且也会包含在
    事件中（除非客户端在 VAD 激活期间手动提交
    `input_audio_buffer.speech_stopped` 音频缓冲区）。
    在 VAD 激活期间手动提交音频缓冲区)。

    - `audio_start_ms: number`

      从会话期间写入缓冲区的所有音频开始起，到首次检测到语音时的毫秒数。该值对应于发送给模型的
      音频的起始位置，因此包含了在 Session 中配置的
      发送给模型的音频的起始位置，因此包含了在 Session 中配置的
      `prefix_padding_ms` 。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      当语音停止时将创建的用户消息条目的 ID。

    - `type: "input_audio_buffer.speech_started"`

      事件类型，必须为 `input_audio_buffer.speech_started`.

      - `"input_audio_buffer.speech_started"`

  - `InputAudioBufferSpeechStoppedEvent object { audio_end_ms, event_id, item_id, type }`

    在 `server_vad` 当服务端检测到音频缓冲区中的语音结束时返回。服务端还会发送一个
    语音结束事件。服务端还会发送一个 `conversation.item.created`
    事件以及从音频缓冲区创建的用户消息条目。

    - `audio_end_ms: number`

      从会话开始到语音停止的毫秒数。此值将
      对应于发送给模型的音频的结束，因此包含
      `min_silence_duration_ms` 。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      将创建的用户消息项的 ID。

    - `type: "input_audio_buffer.speech_stopped"`

      事件类型，必须为 `input_audio_buffer.speech_stopped`.

      - `"input_audio_buffer.speech_stopped"`

  - `RateLimitsUpdatedEvent object { event_id, rate_limits, type }`

    在 Response 开始时发出，用于指示已更新的速率限制。
    创建 Response 时，会为输出“预留”部分 token
    ，此处显示的速率限制反映了该预留量，随后会在 Response
    完成时相应地进行调整。

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

        达到限制前的剩余值。

      - `reset_seconds: optional number`

        速率限制重置前的秒数。

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

    当模型生成的音频完成时返回。当某个 Response
    被中断、未完成或取消时，也会发出该事件。

    - `content_index: number`

      项目内容数组中内容部分的索引。

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

    在音频输出的模型生成转录更新时返回。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `delta: string`

      转录的增量。

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

    在音频输出的模型生成转录完成时返回
    流式输出。在 Response 被中断、未完成或被取消时也会发送。
    被取消时也会发送。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

    - `transcript: string`

      音频的最终转录文本。

    - `type: "response.output_audio_transcript.done"`

      事件类型，必须为 `response.output_audio_transcript.done`.

      - `"response.output_audio_transcript.done"`

  - `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

    在响应生成过程中，向 assistant 消息项添加新的内容部分时返回。
    响应生成时返回。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      被添加内容部分的项的 ID。

    - `output_index: number`

      响应中输出项的索引。

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

    当助手消息项中的内容部分完成流式传输时返回。
    当 Response 中断、不完整或取消时也会触发。

    - `content_index: number`

      项目内容数组中内容部分的索引。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      该项的 ID。

    - `output_index: number`

      响应中输出项的索引。

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

    创建新的 Response 时返回。这是创建 Response 时触发的第一个事件，
    此时 Response 处于初始状态 `in_progress`.

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

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
              会话中更改语音。当前
              可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

        响应将添加到哪个会话，由 `conversation`
        事件中的 `response.create` 字段决定。如果 `auto`，响应将添加到
        默认会话，并且 `conversation_id` 的值将是类似
        `conv_1234`。没有可取消的响应，服务端会返回错误。即使 `none`，的 ID；如果为该值，响应不会添加到任何会话，并且
        的值 `conversation_id` 将为 `null`。如果响应是由 VAD
        自动触发的，则该响应将添加到默认会话

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        中，包括本次响应中使用的工具调用。

        - `number`

        - `"inf"`

          - `"inf"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        ，最大长度为 512 个字符。

      - `object: optional "realtime.response"`

        对象类型，必须为 `realtime.response`.

        - `"realtime.response"`

      - `output: optional array of ConversationItem`

        response 生成的输出项列表。

        - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

          Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

          Realtime 对话中的用户消息条目。

        - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

          Realtime 对话中的助手消息项。

        - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

          Realtime 对话中的函数调用项。

        - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

          Realtime 对话中的函数调用输出项。

        - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

          响应 MCP 审批请求的 Realtime 项。

        - `RealtimeMcpListTools object { server_label, tools, type, id }`

          一个 Realtime 项，列出 MCP 服务器上可用的工具。

        - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

          一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

          请求人工批准工具调用的 Realtime 项。

      - `output_modalities: optional array of "text" or "audio"`

        模型用于响应的模态集合，目前可能的取值仅为
        `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
        output 设置为 mode `text` 将禁用模型的音频输出。

        - `"text"`

        - `"audio"`

      - `status: optional "completed" or "cancelled" or "failed" or 2 more`

        response 的最终状态（`completed`, `cancelled`, `failed`，或
        `incomplete`, `in_progress`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

        - `"in_progress"`

      - `status_details: optional RealtimeResponseStatus`

        关于该状态的更多详细信息。

        - `error: optional object { code, type }`

          导致 response 失败的错误描述，
          当该字段被填充时， `status` 为 `failed`.

          - `code: optional string`

            错误代码（如果有）。

          - `type: optional string`

            错误的类型。

        - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

          Response 未完成的原因。对于一个 `cancelled` Response，可能为以下值之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于一个  `incomplete` Response，可能为以下值之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了 response）。

          - `"turn_detected"`

          - `"client_cancelled"`

          - `"max_output_tokens"`

          - `"content_filter"`

        - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

          导致 response 失败的错误类型，对应
          于 `status` 字段（`completed`, `cancelled`, `incomplete`,
          `failed`).

          - `"completed"`

          - `"cancelled"`

          - `"failed"`

          - `"incomplete"`

      - `usage: optional RealtimeResponseUsage`

        Response 的使用统计信息，对应计费。一次
        Realtime API 会话将维护一个对话上下文，并将新的
        Items 追加到该对话中，因此先前轮次的输出（文本和
        音频 tokens）将成为后续轮次的输入。

        - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

          Response 中使用的输入 tokens 的详细信息。Cached tokens 是指对话中先前轮次作为当前响应的上下文而被包含的 tokens。此处的 cached tokens 计为 input tokens 的一个子集，也就是说 input tokens 包含 cached tokens 与未缓存的 tokens。

          - `audio_tokens: optional number`

            用作 Response 输入的音频 token 数。

          - `cached_tokens: optional number`

            用作 Response 输入的缓存 token 数。

          - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

            有关用作 Response 输入的缓存 token 的详细信息。

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

          Response 中使用的输入 token 数，包括文本和
          音频 token。

        - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

          有关 Response 中使用的输出 token 的详细信息。

          - `audio_tokens: optional number`

            Response 中使用的音频 token 数。

          - `text_tokens: optional number`

            Response 中使用的文本 token 数。

        - `output_tokens: optional number`

          Response 中发送的输出 token 数，包括文本和
          音频 token。

        - `total_tokens: optional number`

          Response 中包括输入和输出在内的 token 总数，包括
          文本和音频 token。

    - `type: "response.created"`

      事件类型，必须为 `response.created`.

      - `"response.created"`

  - `ResponseDoneEvent object { event_id, response, type }`

    Response 完成流式传输时返回。无论最终状态如何，都会触发，
    事件中包含的 Response 对象将 `response.done` 包含 Response 中的所有输出项，但会省略原始音频数据。
    包含 Response 中的所有输出项，但会省略原始音频数据。

    客户端应检查 Response 的 `status` 字段，以确定是否成功
    (`completed`）或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

    Response 将包含生成期间产生的所有输出项，但不包括
    任何音频内容。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response: RealtimeResponse`

      响应资源。

    - `type: "response.done"`

      事件类型，必须为 `response.done`.

      - `"response.done"`

  - `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

    模型生成的函数调用参数更新时返回。

    - `call_id: string`

      函数调用的 ID。

    - `delta: string`

      作为 JSON 字符串的增量参数。

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

    当模型生成的函数调用参数完成流式传输时返回。
    当 Response 中断、不完整或取消时也会触发。

    - `arguments: string`

      最终参数，为 JSON 字符串。

    - `call_id: string`

      函数调用的 ID。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      函数调用项的 ID。

    - `name: string`

      被调用的函数的名称。

    - `output_index: number`

      响应中输出项的索引。

    - `response_id: string`

      响应的 ID。

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

      Response 中输出项的索引。

    - `response_id: string`

      该 Item 所属 Response 的 ID。

    - `type: "response.output_item.added"`

      事件类型，必须为 `response.output_item.added`.

      - `"response.output_item.added"`

  - `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

    当 Item 完成流式传输时返回。在 Response 被
    中断、未完成或取消时也会发出。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `output_index: number`

      Response 中输出项的索引。

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

    当 "output_text" 内容部分的文本值完成流式传输时返回。在 Response 被
    中断、未完成或取消时也会发出。

    - `content_index: number`

      项目内容数组中内容部分的索引。

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

    当 Session 被创建时返回。建立新
    连接时，作为首个服务端事件自动发出。该事件将包含
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

          要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

          - `"realtime"`

        - `audio: optional object { input, output }`

          输入和输出音频的配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              输入音频的格式。

            - `noise_reduction: optional object { type }`

              输入音频降噪的配置。可设置为 `null` 以关闭。
              降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
              对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

                - `"near_field"`

                - `"far_field"`

            - `transcription: optional object { language, languages, model, prompt }`

              输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

                为输入音频转录配置的提示词（若存在）。

            - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

              轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

              Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

              Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

              对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
              设置为 `null`；不支持 VAD。

              - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

                服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

                - `type: "server_vad"`

                  轮次检测类型， `server_vad` 以开启简单 Server VAD。

                  - `"server_vad"`

                - `create_response: optional boolean`

                  在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

                - `idle_timeout_ms: optional number or null`

                  可选的超时时间，超过该时间后将自动触发模型响应。此设置
                  适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                  当前上下文有效地提示用户继续对话。
                  当前上下文。

                  超时时间将在最后一个模型响应的音频播放完成后生效，
                  即设置为 `response.done` 时间加上音频播放时长。

                  一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                  与 Response 相关联）将在达到超时阈值时发出。
                  空闲超时目前仅支持 `server_vad` 模式。

                - `interrupt_response: optional boolean`

                  当 VAD start 事件发生时，是否自动中断（取消）默认
                  会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                  如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

                - `prefix_padding_ms: optional number`

                  仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                  为毫秒）。默认为 300ms。

                - `silence_duration_ms: optional number`

                  仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                  500ms。值越小，模型响应越快，
                  但可能会在用户短句停顿时插话。

                - `threshold: optional number`

                  仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                  高的阈值需要更响亮的音频才能激活模型，因此
                  在嘈杂环境中可能表现更好。

              - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

                服务端语义轮次检测，使用模型来判断用户何时已说完。

                - `type: "semantic_vad"`

                  轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                  - `"semantic_vad"`

                - `create_response: optional boolean`

                  当 VAD stop 事件发生时，是否自动生成响应。

                - `eagerness: optional "low" or "medium" or "high" or "auto"`

                  仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                  - `"low"`

                  - `"medium"`

                  - `"high"`

                  - `"auto"`

                - `interrupt_response: optional boolean`

                  当向默认
                  会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

          - `output: optional object { format, speed, voice }`

            - `format: optional RealtimeAudioFormats`

              输出音频的格式。

            - `speed: optional number`

              模型语音响应的速度，相对于原始速度的倍数。
              1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

              此参数是对生成后音频的后处理调整，也可以
              通过提示让模型说得更快或更慢。

            - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
              会话中更改语音。当前
              可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
              `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
              最佳质量。

              - `string`

              - `"alloy" or "ash" or "ballad" or 7 more`

                模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
                会话中更改语音。当前
                可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

          会话的过期时间戳，自 epoch 起以秒为单位。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          在服务端输出中包含的附加字段。

          `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

        - `instructions: optional string`

          预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

          注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

        - `max_output_tokens: optional number or "inf"`

          单次助手响应的最大输出 token 数，
          包括工具调用。提供 1 到 4096 之间的整数以
          限制输出 token，或 `inf` 表示给定模型可用的最大
          token 数。默认为 `inf`.

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

          模型可以响应的模态集合。默认值为 `["audio"]`，表示
          模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
          模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

          - `"text"`

          - `"audio"`

        - `prompt: optional ResponsePrompt or null`

          对提示模板及其变量的引用。
          [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

          - `id: string`

            要使用的提示模板的唯一标识符。

          - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

            要在你的
            提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
            响应输入类型，例如图片或文件。

            - `string`

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

              - `text: string`

                模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

                发送给模型的文件 ID。

              - `image_url: optional string or null`

                发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

                标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

          - `version: optional string or null`

            提示模板的可选版本。

        - `reasoning: optional RealtimeReasoning`

          用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

          - `effort: optional RealtimeReasoningEffort`

            限制支持推理的 Realtime 模型（例如
            `gpt-realtime-2`.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

        - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

          模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
          function/MCP 工具。

          - `ToolChoiceOptions = "none" or "auto" or "required"`

            控制模型调用哪个工具（如果有）。

            `none` 表示模型不会调用任何工具，而是生成一条消息。

            `auto` 表示模型可以在生成消息与调用一个或多
            个工具之间进行选择。

            `required` 表示模型必须调用一个或多个工具。

            - `"none"`

            - `"auto"`

            - `"required"`

          - `ToolChoiceFunction object { name, type }`

            使用此选项可强制模型调用特定函数。

            - `name: string`

              要调用的函数名称。

            - `type: "function"`

              对于函数调用，类型始终为 `function`.

              - `"function"`

          - `ToolChoiceMcp object { server_label, type, name }`

            使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

            - `server_label: string`

              要使用的 MCP 服务器的标签。

            - `type: "mcp"`

              对于 MCP 工具，类型始终为 `mcp`.

              - `"mcp"`

            - `name: optional string or null`

              要在服务器上调用的工具名称。

        - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

          模型可使用的工具。

          - `RealtimeFunctionTool object { description, name, parameters, type }`

            - `description: optional string`

              函数的描述，包括关于何时以及如何
              调用它的指导，以及关于调用时如何告知用户的指导
              （如果有）。

            - `name: optional string`

              函数的名称。

            - `parameters: optional unknown`

              以 JSON Schema 表示的函数参数。

            - `type: optional "function"`

              工具的类型，即 `function`.

              - `"function"`

          - `McpTool object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
            （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

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

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
              URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
              必须处理 OAuth 授权流程，并在此提供该令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
              关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

              当前支持 `connector_id` 的取值包括：

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

              此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，也可以是与需要审批的工具关联的筛选对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤条件。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示工具是否会修改数据或是否为只读。如果某个 MCP
                    服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤条件。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`. 当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其中一个。

            - `tunnel_id: optional string`

              要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

        - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

          Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
          追踪，就无法再修改该配置。

          `auto` 将为会话创建一个使用默认值的追踪，用于
          工作流名称、组 ID 和元数据。

          - `Auto = "auto"`

            启用追踪并设置追踪配置选项的默认值。始终 `auto`.

            - `"auto"`

          - `TracingConfiguration object { group_id, metadata, workflow_name }`

            追踪的细粒度配置。

            - `group_id: optional string`

              附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
              分组。

            - `metadata: optional unknown`

              附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
              筛选。

            - `workflow_name: optional string`

              附加到此追踪的工作流名称。这用于
              在 Traces Dashboard 中命名该追踪。

        - `truncation: optional RealtimeTruncation`

          当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

          客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

          截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

          截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

          - `"auto" or "disabled"`

            该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

            - `"auto"`

            - `"disabled"`

          - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

            当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

            - `retention_ratio: number`

              在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

            - `type: "retention_ratio"`

              使用保留比例截断。

              - `"retention_ratio"`

            - `token_limits: optional object { post_instructions }`

              此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

              - `post_instructions: optional number`

                指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        实时转录会话的配置对象。

        - `id: string`

          会话的唯一标识符，形如 `sess_1234567890abcdef`.

        - `object: string`

          对象类型。始终为 `realtime.transcription_session`.

        - `type: "transcription"`

          会话的类型，始终为 `transcription` 用于转录会话。

          - `"transcription"`

        - `audio: optional object { input }`

          会话的输入音频配置。

          - `input: optional object { format, noise_reduction, transcription, turn_detection }`

            - `format: optional RealtimeAudioFormats`

              PCM 音频格式。仅支持 24kHz 采样率。

            - `noise_reduction: optional object { type }`

              输入音频降噪配置。

              - `type: optional NoiseReductionType`

                降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

            - `transcription: optional object { language, languages, model, prompt }`

              转录模型的配置。

              - `language: optional string`

                输入音频的语言。

              - `languages: optional array of string`

                为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

                为输入音频转录配置的提示词（若存在）。

            - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

              轮次检测配置。可设置为 `null` 以关闭。服务端
              VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
              音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

              - `prefix_padding_ms: optional number`

                在 VAD 检测到语音之前要包含的音频量（单位为
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                检测语音停止的静音持续时间（单位为毫秒）。默认值
                500ms。值越小，模型响应越快，
                但可能会在用户短句停顿时插话。

              - `threshold: optional number`

                VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
                高的阈值需要更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

              - `type: optional string`

                轮次检测的类型，仅 `server_vad` 当前受支持。

        - `expires_at: optional number`

          会话的过期时间戳，自 epoch 起以秒为单位。

        - `include: optional array of "item.input_audio_transcription.logprobs"`

          在服务端输出中包含的附加字段。

          - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

          - `"item.input_audio_transcription.logprobs"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `SessionUpdatedEvent object { event_id, session, type }`

    当会话通过 `session.update` 事件更新时返回，除非
    出现错误。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

      会话配置。

      - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

        Realtime 会话配置对象。

      - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

        实时转录会话的配置对象。

    - `type: "session.updated"`

      事件类型，必须为 `session.updated`.

      - `"session.updated"`

  - `OutputAudioBufferStarted object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端开始向客户端流式传输音频时触发。该事件在音频内容部分已添加（
    ）之后发出，`response.content_part.added`)
    进入响应。
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.started"`

      事件类型，必须为 `output_audio_buffer.started`.

      - `"output_audio_buffer.started"`

  - `OutputAudioBufferStopped object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当服务端上的输出音频缓冲区已完全耗尽时触发，
    并且不会再有音频产生。该事件在完整响应数据已发送到客户端（
    ）之后发出。`response.done`).
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.stopped"`

      事件类型，必须为 `output_audio_buffer.stopped`.

      - `"output_audio_buffer.stopped"`

  - `OutputAudioBufferCleared object { event_id, response_id, type }`

    **仅限 WebRTC/SIP：** 当输出音频缓冲区被清除时触发。这发生在 VAD
    模式下用户中断时（`input_audio_buffer.speech_started`),
    ），或当客户端发出了 `output_audio_buffer.clear` 事件以手动
    截断当前音频响应时。
    [了解更多](/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

    - `event_id: string`

      服务端事件的唯一 ID。

    - `response_id: string`

      生成该音频的响应的唯一 ID。

    - `type: "output_audio_buffer.cleared"`

      事件类型，必须为 `output_audio_buffer.cleared`.

      - `"output_audio_buffer.cleared"`

  - `ConversationItemAdded object { event_id, item, type, previous_item_id }`

    当 Item 被添加到默认对话时由服务端发送。以下几种情况会触发该事件：

    - 当客户端发送一个 `conversation.item.create` 事件时。
    - 当输入音频缓冲区被提交时。此时该 item 将是一条用户消息，其中包含缓冲区中的音频。
    - 当模型正在生成 Response 时。此时 `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此此时还没有任何内容（且 `status` 将为 `in_progress`).

    该事件将包含 Item 的完整内容（模型正在生成 Response 的情况除外），但音频数据除外，音频数据可在需要时通过 `conversation.item.retrieve` 事件单独获取。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.added"`

      事件类型，必须为 `conversation.item.added`.

      - `"conversation.item.added"`

    - `previous_item_id: optional string or null`

      位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
      在插入 Item 时维持顺序。

  - `ConversationItemDone object { event_id, item, type, previous_item_id }`

    在对话项被最终化时返回。

    该事件将包含该 Item 的完整内容，音频数据除外，音频数据如有需要可通过以下事件单独获取： `conversation.item.retrieve` 事件（如有需要）。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item: ConversationItem`

      Realtime 对话中的单个条目。

    - `type: "conversation.item.done"`

      事件类型，必须为 `conversation.item.done`.

      - `"conversation.item.done"`

    - `previous_item_id: optional string or null`

      位于此 Item 之前的 Item 的 ID（如果有）。该字段用于
      在插入 Item 时维持顺序。

  - `InputAudioBufferTimeoutTriggered object { audio_end_ms, audio_start_ms, event_id, 2 more }`

    在输入音频缓冲区触发 Server VAD 超时时返回。该超时在会话设置中配置，表示
    with `idle_timeout_ms` 在 `turn_detection` 会话设置中进行配置，它表示
    在配置的持续时间内未检测到任何语音。

    该 `audio_start_ms` 和 `audio_end_ms` 字段表示从写入输入音频缓冲区的音频开头偏移的、最后一次
    模型响应之后到触发时刻的音频片段。这意味着它划定了处于静音状态的
    音频片段，而起始值与结束值之间的差值大致等于所配置的超时时间。
    音频片段的差值将与所配置的超时时间大致一致。

    空音频将作为一个 `input_audio` 项提交到对话中（将会有一个
    `input_audio_buffer.committed` 事件），并生成模型响应。可能存在一些
    未能触发 VAD 但仍被模型检测到的语音，因此模型可能会响应与对话
    相关的内容，或提示你继续说话。

    - `audio_end_ms: number`

      触发超时时已写入输入音频缓冲区的音频的毫秒偏移量。

    - `audio_start_ms: number`

      在最后一次模型响应的播放时间之后写入输入音频缓冲区的音频的毫秒偏移量。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      与此片段关联的项的 ID。

    - `type: "input_audio_buffer.timeout_triggered"`

      事件类型，必须为 `input_audio_buffer.timeout_triggered`.

      - `"input_audio_buffer.timeout_triggered"`

  - `ConversationItemInputAudioTranscriptionSegment object { id, content_index, end, 6 more }`

    当某个项目识别出输入音频转录片段时返回。

    - `id: string`

      片段标识符。

    - `content_index: number`

      输入音频内容部分在项目中的索引。

    - `end: number`

      片段的结束时间，单位为秒。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      包含输入音频内容的项目 ID。

    - `speaker: string`

      此片段的已检测说话人标签。

    - `start: number`

      片段的开始时间，单位为秒。

    - `text: string`

      此片段的文本。

    - `type: "conversation.item.input_audio_transcription.segment"`

      事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

      - `"conversation.item.input_audio_transcription.segment"`

  - `McpListToolsInProgress object { event_id, item_id, type }`

    当某个项目的 MCP 工具列表正在获取时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具项的 ID。

    - `type: "mcp_list_tools.in_progress"`

      事件类型，必须为 `mcp_list_tools.in_progress`.

      - `"mcp_list_tools.in_progress"`

  - `McpListToolsCompleted object { event_id, item_id, type }`

    在列出某个项目的 MCP 工具完成后返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具项的 ID。

    - `type: "mcp_list_tools.completed"`

      事件类型，必须为 `mcp_list_tools.completed`.

      - `"mcp_list_tools.completed"`

  - `McpListToolsFailed object { event_id, item_id, type }`

    在列出某个项目的 MCP 工具失败时返回。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `item_id: string`

      MCP 列出工具项的 ID。

    - `type: "mcp_list_tools.failed"`

      事件类型，必须为 `mcp_list_tools.failed`.

      - `"mcp_list_tools.failed"`

  - `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

    在响应生成期间 MCP 工具调用参数被更新时返回。

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

      如果存在，表示增量文本经过了混淆处理。

  - `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

    在响应生成期间，当 MCP 工具调用的参数被最终确定时返回。

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

    当 MCP 工具调用已开始且正在进行中时返回。

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

  beta 接口的 Realtime 会话对象。

  - `id: optional string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `expires_at: optional number`

    会话的过期时间戳，自 epoch 起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs" or null`

    在服务端输出中包含的附加字段。

    - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

    输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输入音频必须为 16 位 PCM、24kHz 采样率，
    单声道，并采用小端字节序。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `input_audio_noise_reduction: optional object { type }`

    输入音频降噪的配置。可设置为 `null` 以关闭。
    降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
    对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `input_audio_transcription: optional object { language, languages, model, prompt }  or null`

    输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](https://platform.openai.com/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

      为输入音频转录配置的提示词（若存在）。

  - `instructions: optional string`

    默认的系统指令（即系统消息），会被添加到模型调用的
    前面。该字段允许客户端引导模型给出期望的
    响应。可指示模型采用特定的响应内容和格式，
    （例如“极其简洁”、“表现得友好”、“下面是一些良好的
    响应示例”），也可以指示音频行为（例如“语速快一些”、“在声音
    中注入情感”、“经常大笑”）。这些指令
    并不保证会被模型遵循，但它们为模型提供了关于期望行为的
    指导。

    请注意，服务端会设置默认指令，如果该字段未设置将
    使用这些默认指令，并且可以在 `session.created` 事件中看到，它出现在
    会话开始时。

  - `max_response_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大
    token 数。默认为 `inf`.

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

    输出音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
    对于 `pcm16`，输出音频以 24kHz 的采样率进行采样。

    - `"pcm16"`

    - `"g711_ulaw"`

    - `"g711_alaw"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      要在你的
      提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `speed: optional number`

    模型语音响应的速度。1.0 为默认速度。0.25 为
    最低速度，1.5 为最高速度。此值只能在模型轮次之间更改，
    不能在响应进行中更改。

  - `temperature: optional number`

    模型的采样温度，范围限制在 [0.6, 1.2]。对于音频模型，强烈建议使用 0.8 的温度以获得最佳性能。

  - `tool_choice: optional string`

    模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
    指定函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时如何告知用户的指导
      （如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    追踪 的配置选项。设为 null 以禁用 追踪。一旦
    追踪，就无法再修改该配置。

    `auto` 将为会话创建一个使用默认值的追踪，用于
    工作流名称、组 ID 和元数据。

    - `"auto"`

      会话的默认 追踪 模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
        在追踪仪表板中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在追踪仪表板中为 追踪 命名。

  - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

    轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。此设置
        适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
        当前上下文有效地提示用户继续对话。
        当前上下文。

        超时时间将在最后一个模型响应的音频播放完成后生效，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 相关联）将在达到超时阈值时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）默认
        会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
        500ms。值越小，模型响应越快，
        但可能会在用户短句停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时已说完。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当向默认
        会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

  - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

    模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
    会话中更改语音。当前
    可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
    `shimmer`，以及 `verse`.

    - `string`

    - `"alloy" or "ash" or "ballad" or 7 more`

      模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
      会话中更改语音。当前
      可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
        降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在发出转录文本之前等待的时间。
          较高的值可以提高转录准确率，但会增加延迟。
          仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。以
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          提供可提高准确率并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续先前音频片段的可选文本。
          片段。
          对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
          以下模型不支持 prompt： `gpt-realtime-whisper` 。

      - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

        轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。此设置
            适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            当前上下文。

            超时时间将在最后一个模型响应的音频播放完成后生效，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 相关联）将在达到超时阈值时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）默认
            会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
            500ms。值越小，模型响应越快，
            但可能会在用户短句停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时已说完。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当向默认
            会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

    - `output: optional RealtimeAudioConfigOutput`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应的速度，相对于原始速度的倍数。
        1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

        此参数是对生成后音频的后处理调整，也可以
        通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        模型用于回应的声音。支持的内置声音有
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
        一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
        使用音频回应过至少一次，会话期间就无法再更改声音。
        我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

    在服务端输出中包含的附加字段。

    `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

    注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大
    token 数。默认为 `inf`.

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

    模型可以响应的模态集合。默认值为 `["audio"]`，表示
    模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
    模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    模型是否可以在并行调用多个工具。仅由
    推理 Realtime 模型，例如 `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      要在你的
      提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional RealtimeToolChoiceConfig`

    模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或多
      个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional RealtimeToolsConfig`

    模型可使用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时如何告知用户的指导
        （如果有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
      （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

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

          允许使用的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
        URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
        必须处理 OAuth 授权流程，并在此提供该令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
        关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持 `connector_id` 的取值包括：

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

        此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，也可以是与需要审批的工具关联的筛选对象
          。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`. 当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

  - `tracing: optional RealtimeTracingConfig or null`

    Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
    追踪，就无法再修改该配置。

    `auto` 将为会话创建一个使用默认值的追踪，用于
    工作流名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
        筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在 Traces Dashboard 中命名该追踪。

  - `truncation: optional RealtimeTruncation`

    当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

    截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

    截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

    - `"auto" or "disabled"`

      该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

      - `retention_ratio: number`

        在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

        - `post_instructions: optional number`

          指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

### Realtime Tool Choice Config

- `RealtimeToolChoiceConfig = ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

  模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（如果有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或多
    个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用特定函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

### Realtime Tools Config

- `RealtimeToolsConfig = array of RealtimeToolsConfigUnion`

  模型可使用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时如何告知用户的指导
      （如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
    （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

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

        允许使用的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个 MCP
          服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤条件。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
      URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
      必须处理 OAuth 授权流程，并在此提供该令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
      关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持 `connector_id` 的取值包括：

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

      此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，也可以是与需要审批的工具关联的筛选对象
        。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`. 当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中一个。

    - `tunnel_id: optional string`

      要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

### Realtime Tools Config Union

- `RealtimeToolsConfigUnion = RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

  通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
  （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时如何告知用户的指导
      （如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
    （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

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

        允许使用的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个 MCP
          服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤条件。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
      URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
      必须处理 OAuth 授权流程，并在此提供该令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
      关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持 `connector_id` 的取值包括：

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

      此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，也可以是与需要审批的工具关联的筛选对象
        。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`. 当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中一个。

    - `tunnel_id: optional string`

      要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

### Realtime 追踪 Config

- `RealtimeTracingConfig = "auto" or object { group_id, metadata, workflow_name }`

  Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
  追踪，就无法再修改该配置。

  `auto` 将为会话创建一个使用默认值的追踪，用于
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
      筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在 Traces Dashboard 中命名该追踪。

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
      降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在发出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。以
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        提供可提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频片段的可选文本。
        片段。
        对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
        以下模型不支持 prompt： `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。此设置
          适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
          当前上下文有效地提示用户继续对话。
          当前上下文。

          超时时间将在最后一个模型响应的音频播放完成后生效，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 相关联）将在达到超时阈值时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）默认
          会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
          500ms。值越小，模型响应越快，
          但可能会在用户短句停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时已说完。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当向默认
          会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

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
    降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
    对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

    - `type: optional NoiseReductionType`

      降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

      - `"near_field"`

      - `"far_field"`

  - `transcription: optional AudioTranscription`

    输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

    - `delay: optional "minimal" or "low" or "medium" or 2 more`

      控制模型在发出转录文本之前等待的时间。
      较高的值可以提高转录准确率，但会增加延迟。
      仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

    - `keywords: optional array of string`

      用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `language: optional string`

      输入音频的语言。以
      [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
      提供可提高准确率并降低延迟。

    - `languages: optional array of string`

      输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

    - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `string`

      - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `"whisper-1"`

        - `"gpt-transcribe"`

        - `"gpt-live-transcribe"`

        - `"gpt-4o-mini-transcribe"`

        - `"gpt-4o-mini-transcribe-2025-12-15"`

        - `"gpt-4o-transcribe"`

        - `"gpt-4o-transcribe-diarize"`

        - `"gpt-realtime-whisper"`

    - `prompt: optional string`

      用于引导模型风格或延续先前音频片段的可选文本。
      片段。
      对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
      对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
      以下模型不支持 prompt： `gpt-realtime-whisper` 。

  - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

    轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

    Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

    Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

    对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
    设置为 `null`；不支持 VAD。

    - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

      服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

      - `type: "server_vad"`

        轮次检测类型， `server_vad` 以开启简单 Server VAD。

        - `"server_vad"`

      - `create_response: optional boolean`

        在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

      - `idle_timeout_ms: optional number or null`

        可选的超时时间，超过该时间后将自动触发模型响应。此设置
        适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
        当前上下文有效地提示用户继续对话。
        当前上下文。

        超时时间将在最后一个模型响应的音频播放完成后生效，
        即设置为 `response.done` 时间加上音频播放时长。

        一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
        与 Response 相关联）将在达到超时阈值时发出。
        空闲超时目前仅支持 `server_vad` 模式。

      - `interrupt_response: optional boolean`

        当 VAD start 事件发生时，是否自动中断（取消）默认
        会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

        如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

      - `prefix_padding_ms: optional number`

        仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
        500ms。值越小，模型响应越快，
        但可能会在用户短句停顿时插话。

      - `threshold: optional number`

        仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
        高的阈值需要更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

    - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

      服务端语义轮次检测，使用模型来判断用户何时已说完。

      - `type: "semantic_vad"`

        轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

        - `"semantic_vad"`

      - `create_response: optional boolean`

        当 VAD stop 事件发生时，是否自动生成响应。

      - `eagerness: optional "low" or "medium" or "high" or "auto"`

        仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `interrupt_response: optional boolean`

        当向默认
        会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

### Realtime Transcription Session Audio Input Turn Detection

- `RealtimeTranscriptionSessionAudioInputTurnDetection = object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }`

  轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

  Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

  对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
  设置为 `null`；不支持 VAD。

  - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

    服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

    - `type: "server_vad"`

      轮次检测类型， `server_vad` 以开启简单 Server VAD。

      - `"server_vad"`

    - `create_response: optional boolean`

      在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

    - `idle_timeout_ms: optional number or null`

      可选的超时时间，超过该时间后将自动触发模型响应。此设置
      适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
      当前上下文有效地提示用户继续对话。
      当前上下文。

      超时时间将在最后一个模型响应的音频播放完成后生效，
      即设置为 `response.done` 时间加上音频播放时长。

      一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
      与 Response 相关联）将在达到超时阈值时发出。
      空闲超时目前仅支持 `server_vad` 模式。

    - `interrupt_response: optional boolean`

      当 VAD start 事件发生时，是否自动中断（取消）默认
      会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

      如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

    - `prefix_padding_ms: optional number`

      仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
      500ms。值越小，模型响应越快，
      但可能会在用户短句停顿时插话。

    - `threshold: optional number`

      仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
      高的阈值需要更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

  - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

    服务端语义轮次检测，使用模型来判断用户何时已说完。

    - `type: "semantic_vad"`

      轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

      - `"semantic_vad"`

    - `create_response: optional boolean`

      当 VAD stop 事件发生时，是否自动生成响应。

    - `eagerness: optional "low" or "medium" or "high" or "auto"`

      仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `interrupt_response: optional boolean`

      当向默认
      会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

### Realtime Transcription Session Create Request

- `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

  实时转录会话对象配置。

  - `type: "transcription"`

    要创建的会话类型。对于 Realtime API 始终为 `transcription` 用于转录会话。

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
        降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional AudioTranscription`

        输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

        - `delay: optional "minimal" or "low" or "medium" or 2 more`

          控制模型在发出转录文本之前等待的时间。
          较高的值可以提高转录准确率，但会增加延迟。
          仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `keywords: optional array of string`

          用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `language: optional string`

          输入音频的语言。以
          [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
          提供可提高准确率并降低延迟。

        - `languages: optional array of string`

          输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          用于引导模型风格或延续先前音频片段的可选文本。
          片段。
          对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
          对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
          以下模型不支持 prompt： `gpt-realtime-whisper` 。

      - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

        轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。此设置
            适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            当前上下文。

            超时时间将在最后一个模型响应的音频播放完成后生效，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 相关联）将在达到超时阈值时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）默认
            会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
            500ms。值越小，模型响应越快，
            但可能会在用户短句停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时已说完。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当向默认
            会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的附加字段。

    `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Translation Client Event

- `RealtimeTranslationClientEvent = RealtimeTranslationSessionUpdateEvent or RealtimeTranslationInputAudioBufferAppendEvent or RealtimeTranslationSessionCloseEvent`

  Realtime 翻译的客户端事件。

  - `RealtimeTranslationSessionUpdateEvent object { session, type, event_id }`

    发送此事件以更新翻译会话配置。翻译
    会话支持对以下字段的更新： `audio.output.language`, `audio.input.transcription`,
    和 `audio.input.noise_reduction`.

    - `session: RealtimeTranslationSessionUpdateRequest`

      要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置
      的参数无法通过 `session.update`.

      - `audio: optional object { input, output }`

        翻译输入和输出音频的配置。

        - `input: optional object { noise_reduction, transcription }`

          - `noise_reduction: optional object { type }  or null`

            可选的输入降噪。设置为 `null` 以禁用该功能。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

            翻译后输出音频和转录增量文本的目标语言。

    - `type: "session.update"`

      事件类型，必须为 `session.update`.

      - `"session.update"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

    发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

    WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
    小端原始音频字节。不支持的 websocket 音频格式会返回
    校验错误，因为低质量音频会显著降低翻译
    质量。

    翻译按 200 ms 引擎帧消费音频。为获得最佳实时效果，请按
    以 200 毫秒为一块的音频。如果一块更短，服务端会缓存，直到凑齐一帧所需音频为止。如果一块更长，服务端会将其拆分为
    200 毫秒的帧，并按顺序依次入队。
    200 毫秒的帧，并按顺序依次入队。

    在会话处于活跃状态时持续追加静音。如果客户端停止发送
    音频后又恢复发送，模型侧会将恢复后的音频视为与先前音频连续，而不是视为真实世界中的停顿。
    音频后又恢复发送，模型侧会将恢复后的音频视为与先前音频连续，而不是视为真实世界中的停顿。

    - `audio: string`

      Base64 编码的 24 kHz PCM16 单声道音频字节。

    - `type: "session.input_audio_buffer.append"`

      事件类型，必须为 `session.input_audio_buffer.append`.

      - `"session.input_audio_buffer.append"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

  - `RealtimeTranslationSessionCloseEvent object { type, event_id }`

    优雅地关闭实时翻译会话。服务端会刷新待处理的
    输入音频，并在关闭前输出所有剩余的翻译结果
    会话。

    - `type: "session.close"`

      事件类型，必须为 `session.close`.

      - `"session.close"`

    - `event_id: optional string`

      可选的、由客户端生成的 ID，用于标识此事件。

### Realtime Translation Client Secret Create Request

- `RealtimeTranslationClientSecretCreateRequest object { session, expires_after }`

  为 Realtime API 创建一个翻译会话和客户端密钥。

  - `session: RealtimeTranslationSessionCreateRequest`

    Realtime 翻译会话配置。翻译会话持续流式传入源音频，
    并持续流式输出翻译后的音频以及转录增量。

    - `model: string`

      此会话使用的 Realtime 翻译模型。

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用该功能。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

          翻译后输出音频和转录增量文本的目标语言。

  - `expires_after: optional object { anchor, seconds }`

    客户端密钥过期配置。过期时间指的是此后客户端密钥
    将无法再用于创建会话的时间点。会话本身一旦开始，即使过了
    该时间点仍可能继续运行。一个密钥在其过期之前可以用于创建多个会话，
    直到它过期为止。

    - `anchor: optional "created_at"`

      客户端密钥过期的锚点，指的是 `seconds` 将叠加到 `created_at` 客户端密钥的时间上，从而生成过期时间戳。仅 `created_at` 当前受支持。

      - `"created_at"`

    - `seconds: optional number`

      从锚点到过期的秒数。取值范围在 `10` 和 `7200` （2 小时）之间。如果未指定，默认值为 600 秒（10 分钟）。

### Realtime Translation Client Secret Create Response

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元起的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续将输入
    音频翻译为配置好的输出语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪设置。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 epoch 起以秒为单位。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

      - `"translation"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Translation Input Audio Buffer Append Event

- `RealtimeTranslationInputAudioBufferAppendEvent object { audio, type, event_id }`

  发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

  WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
  小端原始音频字节。不支持的 websocket 音频格式会返回
  校验错误，因为低质量音频会显著降低翻译
  质量。

  翻译按 200 ms 引擎帧消费音频。为获得最佳实时效果，请按
  以 200 毫秒为一块的音频。如果一块更短，服务端会缓存，直到凑齐一帧所需音频为止。如果一块更长，服务端会将其拆分为
  200 毫秒的帧，并按顺序依次入队。
  200 毫秒的帧，并按顺序依次入队。

  在会话处于活跃状态时持续追加静音。如果客户端停止发送
  音频后又恢复发送，模型侧会将恢复后的音频视为与先前音频连续，而不是视为真实世界中的停顿。
  音频后又恢复发送，模型侧会将恢复后的音频视为与先前音频连续，而不是视为真实世界中的停顿。

  - `audio: string`

    Base64 编码的 24 kHz PCM16 单声道音频字节。

  - `type: "session.input_audio_buffer.append"`

    事件类型，必须为 `session.input_audio_buffer.append`.

    - `"session.input_audio_buffer.append"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### Realtime Translation Input Transcript Delta Event

- `RealtimeTranslationInputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当可选的源语言转录文本可用时返回。该事件
  仅在 `audio.input.transcription` 已配置时发出。

  转录增量是仅追加的文本片段。客户端不应在增量之间
  插入固定空格。

  - `delta: string`

    仅追加的源语言转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.input_transcript.delta"`

    事件类型，必须为 `session.input_transcript.delta`.

    - `"session.input_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，在可用时取自翻译帧，
    以 200 毫秒为步长递增，但多个转录
    增量可能共享同一 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转录增量标识符。

### 实时翻译输出音频增量事件

- `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

  在翻译后的输出音频可用时返回。该 `delta` 包含一个
  PCM16 音频块，其长度可能会有所不同。客户端应解码并按顺序排列
  完整的 delta，而不是假设固定的字节数或采样数。

  - `delta: string`

    经过 Base64 编码的翻译后的音频数据。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_audio.delta"`

    事件类型，必须为 `session.output_audio.delta`.

    - `"session.output_audio.delta"`

  - `channels: optional number`

    音频声道数。

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，在可用时取自翻译帧，
    （在可用时）。请将 `elapsed_ms` 视为对齐元数据，而不是唯一
    事件标识符。

  - `format: optional "pcm16"`

    音频编码格式为 `delta`.

    - `"pcm16"`

  - `sample_rate: optional number`

    音频 delta 的采样率。

### Realtime Translation Output Transcript Delta Event

- `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

  当翻译后的转录文本可用时返回。

  转录增量是仅追加的文本片段。客户端不应在增量之间
  插入固定空格。

  - `delta: string`

    翻译后输出音频的仅追加转录文本。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.output_transcript.delta"`

    事件类型，必须为 `session.output_transcript.delta`.

    - `"session.output_transcript.delta"`

  - `elapsed_ms: optional number or null`

    用于流对齐的时间元数据，在可用时取自翻译帧，
    以 200 毫秒为步长递增，但多个转录
    增量可能共享同一 `elapsed_ms`。请将其视为对齐元数据，
    而非唯一的转录增量标识符。

### Realtime Translation Server Event

- `RealtimeTranslationServerEvent = RealtimeErrorEvent or RealtimeTranslationSessionCreatedEvent or RealtimeTranslationSessionUpdatedEvent or 4 more`

  实时翻译服务端事件。

  - `RealtimeErrorEvent object { error, event_id, type }`

    在发生错误时返回，错误可能是客户端问题或服务端
    问题。大多数错误是可恢复的，会话将保持打开状态，我们
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

    在创建翻译会话时返回。新连接建立后自动作为首个服务端事件发出。
    该事件包含默认的翻译会话配置。
    翻译会话配置。

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

            可选的输入降噪设置。

            - `type: NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

            翻译后输出音频和转录增量文本的目标语言。

      - `expires_at: number`

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `model: string`

        用于本次会话的 Realtime 翻译模型。此字段在
        会话创建时设置，无法通过 `session.update`.

      - `type: "translation"`

        会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

        - `"translation"`

    - `type: "session.created"`

      事件类型，必须为 `session.created`.

      - `"session.created"`

  - `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

    在通过以下方式更新翻译会话时返回 `session.update` 事件，
    除非发生错误。

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
    插入固定空格。

    - `delta: string`

      仅追加的源语言转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.input_transcript.delta"`

      事件类型，必须为 `session.input_transcript.delta`.

      - `"session.input_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，在可用时取自翻译帧，
      以 200 毫秒为步长递增，但多个转录
      增量可能共享同一 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputTranscriptDeltaEvent object { delta, event_id, type, elapsed_ms }`

    当翻译后的转录文本可用时返回。

    转录增量是仅追加的文本片段。客户端不应在增量之间
    插入固定空格。

    - `delta: string`

      翻译后输出音频的仅追加转录文本。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_transcript.delta"`

      事件类型，必须为 `session.output_transcript.delta`.

      - `"session.output_transcript.delta"`

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，在可用时取自翻译帧，
      以 200 毫秒为步长递增，但多个转录
      增量可能共享同一 `elapsed_ms`。请将其视为对齐元数据，
      而非唯一的转录增量标识符。

  - `RealtimeTranslationOutputAudioDeltaEvent object { delta, event_id, type, 4 more }`

    在翻译后的输出音频可用时返回。该 `delta` 包含一个
    PCM16 音频块，其长度可能会有所不同。客户端应解码并按顺序排列
    完整的 delta，而不是假设固定的字节数或采样数。

    - `delta: string`

      经过 Base64 编码的翻译后的音频数据。

    - `event_id: string`

      服务端事件的唯一 ID。

    - `type: "session.output_audio.delta"`

      事件类型，必须为 `session.output_audio.delta`.

      - `"session.output_audio.delta"`

    - `channels: optional number`

      音频声道数。

    - `elapsed_ms: optional number or null`

      用于流对齐的时间元数据，在可用时取自翻译帧，
      （在可用时）。请将 `elapsed_ms` 视为对齐元数据，而不是唯一
      事件标识符。

    - `format: optional "pcm16"`

      音频编码格式为 `delta`.

      - `"pcm16"`

    - `sample_rate: optional number`

      音频 delta 的采样率。

### 实时翻译会话

- `RealtimeTranslationSession object { id, audio, expires_at, 2 more }`

  一个 Realtime 翻译会话。翻译会话会持续将输入
  音频翻译为配置好的输出语言。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪设置。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

        翻译后输出音频和转录增量文本的目标语言。

  - `expires_at: number`

    会话的过期时间戳，自 epoch 起以秒为单位。

  - `model: string`

    用于本次会话的 Realtime 翻译模型。此字段在
    会话创建时设置，无法通过 `session.update`.

  - `type: "translation"`

    会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

    - `"translation"`

### 实时翻译会话关闭事件

- `RealtimeTranslationSessionCloseEvent object { type, event_id }`

  优雅地关闭实时翻译会话。服务端会刷新待处理的
  输入音频，并在关闭前输出所有剩余的翻译结果
  会话。

  - `type: "session.close"`

    事件类型，必须为 `session.close`.

    - `"session.close"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 实时翻译会话已关闭事件

- `RealtimeTranslationSessionClosedEvent object { event_id, type }`

  在实时翻译会话关闭时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `type: "session.closed"`

    事件类型，必须为 `session.closed`.

    - `"session.closed"`

### 实时翻译会话创建请求

- `RealtimeTranslationSessionCreateRequest object { model, audio }`

  Realtime 翻译会话配置。翻译会话持续流式传入源音频，
  并持续流式输出翻译后的音频以及转录增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用该功能。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

        翻译后输出音频和转录增量文本的目标语言。

### 实时翻译会话已创建事件

- `RealtimeTranslationSessionCreatedEvent object { event_id, session, type }`

  在创建翻译会话时返回。新连接建立后自动作为首个服务端事件发出。
  该事件包含默认的翻译会话配置。
  翻译会话配置。

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

          可选的输入降噪设置。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 epoch 起以秒为单位。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

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

    要更新的翻译会话字段。会话 `type` 和 `model` 在创建时设置
    的参数无法通过 `session.update`.

    - `audio: optional object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪。设置为 `null` 以禁用该功能。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

          翻译后输出音频和转录增量文本的目标语言。

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 实时翻译会话更新请求

- `RealtimeTranslationSessionUpdateRequest object { audio }`

  可通过以下方式更新的实时翻译会话字段 `session.update`.

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用该功能。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

        翻译后输出音频和转录增量文本的目标语言。

### Realtime 翻译会话更新事件

- `RealtimeTranslationSessionUpdatedEvent object { event_id, session, type }`

  在通过以下方式更新翻译会话时返回 `session.update` 事件，
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

          可选的输入降噪设置。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 epoch 起以秒为单位。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

    - `type: "translation"`

      会话类型。始终为 `translation` ，表示 Realtime 翻译会话。

      - `"translation"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### Realtime 截断

- `RealtimeTruncation = "auto" or "disabled" or object { retention_ratio, type, token_limits }`

  当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

  截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

  截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

  - `"auto" or "disabled"`

    该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

    - `retention_ratio: number`

      在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

### Response 音频增量事件

- `ResponseAudioDeltaEvent object { content_index, delta, event_id, 4 more }`

  当模型生成的音频更新时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

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

### Response 音频完成事件

- `ResponseAudioDoneEvent object { content_index, event_id, item_id, 3 more }`

  当模型生成的音频完成时返回。当某个 Response
  被中断、未完成或取消时，也会发出该事件。

  - `content_index: number`

    项目内容数组中内容部分的索引。

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

### Response 音频转录增量事件

- `ResponseAudioTranscriptDeltaEvent object { content_index, delta, event_id, 4 more }`

  在音频输出的模型生成转录更新时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `delta: string`

    转录的增量。

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

### Response 音频转录完成事件

- `ResponseAudioTranscriptDoneEvent object { content_index, event_id, item_id, 4 more }`

  在音频输出的模型生成转录完成时返回
  流式输出。在 Response 被中断、未完成或被取消时也会发送。
  被取消时也会发送。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `transcript: string`

    音频的最终转录文本。

  - `type: "response.output_audio_transcript.done"`

    事件类型，必须为 `response.output_audio_transcript.done`.

    - `"response.output_audio_transcript.done"`

### Response 取消事件

- `ResponseCancelEvent object { type, event_id, response_id }`

  发送此事件以取消进行中的响应。服务端会响应一个
  状态为 `response.done` 的事件。如果 `response.status=cancelled`。没有可取消的响应，服务端会返回错误。即使
  没有响应正在进行，调用
  也是安全的，错误会被返回，会话不会受到影响。 `response.cancel` 即使没有响应正在进行，错误也会被返回，
  会话将保持不受影响。

  - `type: "response.cancel"`

    事件类型，必须为 `response.cancel`.

    - `"response.cancel"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

  - `response_id: optional string`

    要取消的特定响应 ID - 如果未提供，将取消一个
    默认对话中的进行中响应。

### Response 内容部分添加事件

- `ResponseContentPartAddedEvent object { content_index, event_id, item_id, 4 more }`

  在响应生成过程中，向 assistant 消息项添加新的内容部分时返回。
  响应生成时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    被添加内容部分的项的 ID。

  - `output_index: number`

    响应中输出项的索引。

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

### Response 内容部分完成事件

- `ResponseContentPartDoneEvent object { content_index, event_id, item_id, 4 more }`

  当助手消息项中的内容部分完成流式传输时返回。
  当 Response 中断、不完整或取消时也会触发。

  - `content_index: number`

    项目内容数组中内容部分的索引。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    该项的 ID。

  - `output_index: number`

    响应中输出项的索引。

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

### Response 创建事件

- `ResponseCreateEvent object { type, event_id, response }`

  此事件指示服务器创建 Response，即触发
  模型推理。在 Server VAD 模式下，服务器将自动创建 Responses
  。

  Response 将至少包含一个 Item，也可能包含两个；在此情况下，
  第二个将是函数调用。默认情况下，这些 Item 将附加到
  对话历史记录。

  服务器将使用一个 `response.created` 事件、针对 Items
  和已创建内容的事件，以及最后的 `response.done` 事件，用于指示
  响应已完成。

  该 `response.create` 事件包含推理配置，例如
  `instructions` 和 `tools`。如果设置了这些参数，它们将仅针对本次响应覆盖 Session 的
  配置。

  响应可以在默认 Conversation 之外创建，这意味着它们可以
  接收任意输入，并且可以选择不将输出写入该 Conversation。
  同一时间只能有一个响应写入默认 Conversation，但除此之外，多个
  响应可以并行创建。 `metadata` 字段非常适合用来区分
  多个同时进行的响应。

  客户端可以设置 `conversation` 为 `none` 来创建一个不写入默认
  Conversation 的响应。可以通过 `input` 字段提供任意输入，该字段是一个接受
  原始 Item 和对已有 Item 引用的数组。

  - `type: "response.create"`

    事件类型，必须为 `response.create`.

    - `"response.create"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

  - `response: optional RealtimeResponseCreateParams`

    使用以下参数创建一个新的 Realtime 响应

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
          `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
          一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
          使用音频回应过至少一次，会话期间就无法再更改声音。
          我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

      控制响应被添加到的对话。当前支持
      `auto` 和 `none`，以及 `auto` 作为默认值。该 `auto` 值
      表示响应的内容将被添加到默认
      对话中。将其设置为 `none` 以创建一个不会将项目添加到默认对话的
      带外响应。

      - `string`

      - `"auto" or "none"`

        控制响应被添加到的对话。当前支持
        `auto` 和 `none`，以及 `auto` 作为默认值。该 `auto` 值
        表示响应的内容将被添加到默认
        对话中。将其设置为 `none` 以创建一个不会将项目添加到默认对话的
        带外响应。

        - `"auto"`

        - `"none"`

    - `input: optional array of ConversationItem`

      在模型提示中包含的输入项。使用此字段
      会为该 Response 创建一个新的上下文，而不是使用默认
      对话。空数组 `[]` 将清除该 Response 的上下文。
      注意，这可以包含对之前在会话中出现的项目的引用，
      通过其 id 进行引用。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。对于系统消息始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。对于系统消息始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。对于系统消息始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。对于系统消息始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。对于系统消息始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

            有关该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。对于系统消息始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数对应的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。对于系统消息始终为 `mcp_call`.

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

          条目的类型。对于系统消息始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `instructions: optional string`

      默认的系统指令（即系统消息）会预置到模型调用之前。此字段允许客户端引导模型输出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“语速较快”、“在声音中注入情感”、“经常笑”）。指令不一定被模型遵循，但它们为模型期望的行为提供了指导。
      注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大
      token 数。默认为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅为
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      output 设置为 mode `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以在并行调用多个工具。仅由
      推理 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        要在你的
        提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
        响应输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或多
        个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时如何告知用户的指导
          （如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
        （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

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

            允许使用的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
          URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
          必须处理 OAuth 授权流程，并在此提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
          关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持 `connector_id` 的取值包括：

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

          此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，也可以是与需要审批的工具关联的筛选对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`. 当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

### Response 已创建事件

- `ResponseCreatedEvent object { event_id, response, type }`

  创建新的 Response 时返回。这是创建 Response 时触发的第一个事件，
  此时 Response 处于初始状态 `in_progress`.

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

          模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
          会话中更改语音。当前
          可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

      响应将添加到哪个会话，由 `conversation`
      事件中的 `response.create` 字段决定。如果 `auto`，响应将添加到
      默认会话，并且 `conversation_id` 的值将是类似
      `conv_1234`。没有可取消的响应，服务端会返回错误。即使 `none`，的 ID；如果为该值，响应不会添加到任何会话，并且
      的值 `conversation_id` 将为 `null`。如果响应是由 VAD
      自动触发的，则该响应将添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      中，包括本次响应中使用的工具调用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      response 生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。对于系统消息始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。对于系统消息始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。对于系统消息始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。对于系统消息始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。对于系统消息始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

            有关该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。对于系统消息始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数对应的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。对于系统消息始终为 `mcp_call`.

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

          条目的类型。对于系统消息始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅为
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      output 设置为 mode `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `status: optional "completed" or "cancelled" or "failed" or 2 more`

      response 的最终状态（`completed`, `cancelled`, `failed`，或
      `incomplete`, `in_progress`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

      - `"in_progress"`

    - `status_details: optional RealtimeResponseStatus`

      关于该状态的更多详细信息。

      - `error: optional object { code, type }`

        导致 response 失败的错误描述，
        当该字段被填充时， `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于一个 `cancelled` Response，可能为以下值之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于一个  `incomplete` Response，可能为以下值之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了 response）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致 response 失败的错误类型，对应
        于 `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的使用统计信息，对应计费。一次
      Realtime API 会话将维护一个对话上下文，并将新的
      Items 追加到该对话中，因此先前轮次的输出（文本和
      音频 tokens）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 中使用的输入 tokens 的详细信息。Cached tokens 是指对话中先前轮次作为当前响应的上下文而被包含的 tokens。此处的 cached tokens 计为 input tokens 的一个子集，也就是说 input tokens 包含 cached tokens 与未缓存的 tokens。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数。

        - `cached_tokens: optional number`

          用作 Response 输入的缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          有关用作 Response 输入的缓存 token 的详细信息。

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

        Response 中使用的输入 token 数，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        有关 Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中包括输入和输出在内的 token 总数，包括
        文本和音频 token。

  - `type: "response.created"`

    事件类型，必须为 `response.created`.

    - `"response.created"`

### Response 完成事件

- `ResponseDoneEvent object { event_id, response, type }`

  Response 完成流式传输时返回。无论最终状态如何，都会触发，
  事件中包含的 Response 对象将 `response.done` 包含 Response 中的所有输出项，但会省略原始音频数据。
  包含 Response 中的所有输出项，但会省略原始音频数据。

  客户端应检查 Response 的 `status` 字段，以确定是否成功
  (`completed`）或是否出现了其他结果： `cancelled`, `failed`，或 `incomplete`.

  Response 将包含生成期间产生的所有输出项，但不包括
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

          模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
          会话中更改语音。当前
          可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

      响应将添加到哪个会话，由 `conversation`
      事件中的 `response.create` 字段决定。如果 `auto`，响应将添加到
      默认会话，并且 `conversation_id` 的值将是类似
      `conv_1234`。没有可取消的响应，服务端会返回错误。即使 `none`，的 ID；如果为该值，响应不会添加到任何会话，并且
      的值 `conversation_id` 将为 `null`。如果响应是由 VAD
      自动触发的，则该响应将添加到默认会话

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      中，包括本次响应中使用的工具调用。

      - `number`

      - `"inf"`

        - `"inf"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

    - `object: optional "realtime.response"`

      对象类型，必须为 `realtime.response`.

      - `"realtime.response"`

    - `output: optional array of ConversationItem`

      response 生成的输出项列表。

      - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

        Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

        - `content: array of object { text, type }`

          消息的内容。

          - `text: optional string`

            文本内容。

          - `type: optional "input_text"`

            内容类型。对于系统消息始终为 `input_text` 。

            - `"input_text"`

        - `role: "system"`

          消息发送者的角色。对于系统消息始终为 `system`.

          - `"system"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

            Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

          - `detail: optional "auto" or "low" or "high"`

            图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `image_url: optional string`

            Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

          - `text: optional string`

            文本内容（用于 `input_text`).

          - `transcript: optional string`

            音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

          - `type: optional "input_text" or "input_audio" or "input_image"`

            内容类型（`input_text`, `input_audio`，或 `input_image`).

            - `"input_text"`

            - `"input_audio"`

            - `"input_image"`

        - `role: "user"`

          消息发送者的角色。对于系统消息始终为 `user`.

          - `"user"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

        Realtime 对话中的助手消息项。

        - `content: array of object { audio, text, transcript, type }`

          消息的内容。

          - `audio: optional string`

            Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

          - `text: optional string`

            文本内容。

          - `transcript: optional string`

            音频内容的文字记录；如果输出类型为 `audio`.

          - `type: optional "output_text" or "output_audio"`

            内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

            - `"output_text"`

            - `"output_audio"`

        - `role: "assistant"`

          消息发送者的角色。对于系统消息始终为 `assistant`.

          - `"assistant"`

        - `type: "message"`

          条目的类型。对于系统消息始终为 `message`.

          - `"message"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

        Realtime 对话中的函数调用项。

        - `arguments: string`

          函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

        - `name: string`

          被调用函数的名称。

        - `type: "function_call"`

          条目的类型。对于系统消息始终为 `function_call`.

          - `"function_call"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `call_id: optional string`

          函数调用的 ID。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

          - `"realtime.item"`

        - `status: optional "completed" or "incomplete" or "in_progress"`

          条目的状态。对对话没有影响。

          - `"completed"`

          - `"incomplete"`

          - `"in_progress"`

      - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

        Realtime 对话中的函数调用输出项。

        - `call_id: string`

          此输出对应的函数调用的 ID。

        - `output: string`

          函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

        - `type: "function_call_output"`

          条目的类型。对于系统消息始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string`

          条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

        - `object: optional "realtime.item"`

          所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          所回答的审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

            有关该工具的附加注解。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          条目的类型。对于系统消息始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `id: optional string`

          该列表的唯一 ID。

      - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

        一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数对应的 JSON 字符串。

        - `name: string`

          所运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          条目的类型。对于系统消息始终为 `mcp_call`.

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

          条目的类型。对于系统消息始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

    - `output_modalities: optional array of "text" or "audio"`

      模型用于响应的模态集合，目前可能的取值仅为
      `[\"audio\"]`, `[\"text\"]`。音频输出始终包含文本转录。将
      output 设置为 mode `text` 将禁用模型的音频输出。

      - `"text"`

      - `"audio"`

    - `status: optional "completed" or "cancelled" or "failed" or 2 more`

      response 的最终状态（`completed`, `cancelled`, `failed`，或
      `incomplete`, `in_progress`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

      - `"in_progress"`

    - `status_details: optional RealtimeResponseStatus`

      关于该状态的更多详细信息。

      - `error: optional object { code, type }`

        导致 response 失败的错误描述，
        当该字段被填充时， `status` 为 `failed`.

        - `code: optional string`

          错误代码（如果有）。

        - `type: optional string`

          错误的类型。

      - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

        Response 未完成的原因。对于一个 `cancelled` Response，可能为以下值之一 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了 cancel 事件）。对于一个  `incomplete` Response，可能为以下值之一 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了 response）。

        - `"turn_detected"`

        - `"client_cancelled"`

        - `"max_output_tokens"`

        - `"content_filter"`

      - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

        导致 response 失败的错误类型，对应
        于 `status` 字段（`completed`, `cancelled`, `incomplete`,
        `failed`).

        - `"completed"`

        - `"cancelled"`

        - `"failed"`

        - `"incomplete"`

    - `usage: optional RealtimeResponseUsage`

      Response 的使用统计信息，对应计费。一次
      Realtime API 会话将维护一个对话上下文，并将新的
      Items 追加到该对话中，因此先前轮次的输出（文本和
      音频 tokens）将成为后续轮次的输入。

      - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

        Response 中使用的输入 tokens 的详细信息。Cached tokens 是指对话中先前轮次作为当前响应的上下文而被包含的 tokens。此处的 cached tokens 计为 input tokens 的一个子集，也就是说 input tokens 包含 cached tokens 与未缓存的 tokens。

        - `audio_tokens: optional number`

          用作 Response 输入的音频 token 数。

        - `cached_tokens: optional number`

          用作 Response 输入的缓存 token 数。

        - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

          有关用作 Response 输入的缓存 token 的详细信息。

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

        Response 中使用的输入 token 数，包括文本和
        音频 token。

      - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

        有关 Response 中使用的输出 token 的详细信息。

        - `audio_tokens: optional number`

          Response 中使用的音频 token 数。

        - `text_tokens: optional number`

          Response 中使用的文本 token 数。

      - `output_tokens: optional number`

        Response 中发送的输出 token 数，包括文本和
        音频 token。

      - `total_tokens: optional number`

        Response 中包括输入和输出在内的 token 总数，包括
        文本和音频 token。

  - `type: "response.done"`

    事件类型，必须为 `response.done`.

    - `"response.done"`

### Response 函数调用参数增量事件

- `ResponseFunctionCallArgumentsDeltaEvent object { call_id, delta, event_id, 4 more }`

  模型生成的函数调用参数更新时返回。

  - `call_id: string`

    函数调用的 ID。

  - `delta: string`

    作为 JSON 字符串的增量参数。

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

### Response 函数调用参数完成事件

- `ResponseFunctionCallArgumentsDoneEvent object { arguments, call_id, event_id, 5 more }`

  当模型生成的函数调用参数完成流式传输时返回。
  当 Response 中断、不完整或取消时也会触发。

  - `arguments: string`

    最终参数，为 JSON 字符串。

  - `call_id: string`

    函数调用的 ID。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    函数调用项的 ID。

  - `name: string`

    被调用的函数的名称。

  - `output_index: number`

    响应中输出项的索引。

  - `response_id: string`

    响应的 ID。

  - `type: "response.function_call_arguments.done"`

    事件类型，必须为 `response.function_call_arguments.done`.

    - `"response.function_call_arguments.done"`

### Response Mcp 调用参数增量

- `ResponseMcpCallArgumentsDelta object { delta, event_id, item_id, 4 more }`

  在响应生成期间 MCP 工具调用参数被更新时返回。

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

    如果存在，表示增量文本经过了混淆处理。

### Response Mcp 调用参数完成

- `ResponseMcpCallArgumentsDone object { arguments, event_id, item_id, 3 more }`

  在响应生成期间，当 MCP 工具调用的参数被最终确定时返回。

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

### Response Mcp 调用已完成

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

### Response Mcp 调用失败

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

### Response Mcp 调用进行中

- `ResponseMcpCallInProgress object { event_id, item_id, output_index, type }`

  当 MCP 工具调用已开始且正在进行中时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item_id: string`

    MCP 工具调用项的 ID。

  - `output_index: number`

    响应中输出项的索引。

  - `type: "response.mcp_call.in_progress"`

    事件类型，必须为 `response.mcp_call.in_progress`.

    - `"response.mcp_call.in_progress"`

### Response 输出项添加事件

- `ResponseOutputItemAddedEvent object { event_id, item, output_index, 2 more }`

  在 Response 生成过程中创建新 Item 时返回。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    Response 中输出项的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.added"`

    事件类型，必须为 `response.output_item.added`.

    - `"response.output_item.added"`

### Response 输出项完成事件

- `ResponseOutputItemDoneEvent object { event_id, item, output_index, 2 more }`

  当 Item 完成流式传输时返回。在 Response 被
  中断、未完成或取消时也会发出。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `item: ConversationItem`

    Realtime 对话中的单个条目。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但又有所不同，因为系统消息可以在对话中的任意时刻添加。对于对话行为的重大更改，请使用 instructions，而对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。对于系统消息始终为 `input_text` 。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。对于系统消息始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

          Base64 编码的音频字节（对于 `input_audio`），将根据会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（对于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（对于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（用于 `input_text`).

        - `transcript: optional string`

          音频的文字记录（用于 `input_audio`）。这些内容不会发送给模型，但会附加到消息项中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。对于系统消息始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的助手消息项。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录；如果输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。对于系统消息始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。对于系统消息始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的函数调用项。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。对于系统消息始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的函数调用输出项。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意自由文本，可以包含任何信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。对于系统消息始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。可以由客户端提供，也可以由服务端生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符，对于系统消息始终为 `realtime.item`。在创建新条目时为可选。

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

        所回答的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        条目的类型。对于系统消息始终为 `mcp_approval_response`.

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

          有关该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。对于系统消息始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 项，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数对应的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。对于系统消息始终为 `mcp_call`.

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

        条目的类型。对于系统消息始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_index: number`

    Response 中输出项的索引。

  - `response_id: string`

    该 Item 所属 Response 的 ID。

  - `type: "response.output_item.done"`

    事件类型，必须为 `response.output_item.done`.

    - `"response.output_item.done"`

### Response 文本增量事件

- `ResponseTextDeltaEvent object { content_index, delta, event_id, 4 more }`

  当 "output_text" 内容部分的文本值更新时返回。

  - `content_index: number`

    项目内容数组中内容部分的索引。

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

  当 "output_text" 内容部分的文本值完成流式传输时返回。在 Response 被
  中断、未完成或取消时也会发出。

  - `content_index: number`

    项目内容数组中内容部分的索引。

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

  当 Session 被创建时返回。建立新
  连接时，作为首个服务端事件自动发出。该事件将包含
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

        要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
            降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

              为输入音频转录配置的提示词（若存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。此设置
                适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                超时时间将在最后一个模型响应的音频播放完成后生效，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 相关联）将在达到超时阈值时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短句停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已说完。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当向默认
                会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，相对于原始速度的倍数。
            1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            此参数是对生成后音频的后处理调整，也可以
            通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
              会话中更改语音。当前
              可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大
        token 数。默认为 `inf`.

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

        模型可以响应的模态集合。默认值为 `["audio"]`，表示
        模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
        模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          要在你的
          提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（如果有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或多
          个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时如何告知用户的指导
            （如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
          （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
            URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
            必须处理 OAuth 授权流程，并在此提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. 当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
        追踪，就无法再修改该配置。

        `auto` 将为会话创建一个使用默认值的追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
            筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中命名该追踪。

      - `truncation: optional RealtimeTruncation`

        当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

        截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

        截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

        - `"auto" or "disabled"`

          该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

          - `retention_ratio: number`

            在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      实时转录会话的配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型，始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

              为输入音频转录配置的提示词（若存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
            音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前要包含的音频量（单位为
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（单位为毫秒）。默认值
              500ms。值越小，模型响应越快，
              但可能会在用户短句停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.created"`

    事件类型，必须为 `session.created`.

    - `"session.created"`

### 会话更新事件

- `SessionUpdateEvent object { session, type, event_id }`

  发送此事件以更新会话的配置。
  客户端可以随时发送此事件以更新任何字段
  除 `voice` 和 `model`. `voice` 外，只能在尚未产生其他音频输出时更新。

  当服务器收到 `session.update`，时，它会响应
  状态为 `session.updated` 事件，显示完整的有效配置。
  只有 `session.update` 中存在的字段才会被更新。要清空类似
  `instructions`，的字段，请传递空字符串。要清空类似 `tools`，的字段，请传递空数组。
  要清空类似 `turn_detection`，的字段，请传递 `null`.

  - `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

    更新 Realtime 会话。选择 realtime
    会话或转录会话。

    - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

      Realtime 会话对象配置。

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
            降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

            - `delay: optional "minimal" or "low" or "medium" or 2 more`

              控制模型在发出转录文本之前等待的时间。
              较高的值可以提高转录准确率，但会增加延迟。
              仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

            - `keywords: optional array of string`

              用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `language: optional string`

              输入音频的语言。以
              [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
              提供可提高准确率并降低延迟。

            - `languages: optional array of string`

              输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              用于引导模型风格或延续先前音频片段的可选文本。
              片段。
              对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
              对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
              以下模型不支持 prompt： `gpt-realtime-whisper` 。

          - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。此设置
                适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                超时时间将在最后一个模型响应的音频播放完成后生效，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 相关联）将在达到超时阈值时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短句停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已说完。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当向默认
                会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

        - `output: optional RealtimeAudioConfigOutput`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，相对于原始速度的倍数。
            1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            此参数是对生成后音频的后处理调整，也可以
            通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

            模型用于回应的声音。支持的内置声音有
            `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
            `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
            一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
            使用音频回应过至少一次，会话期间就无法再更改声音。
            我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

        在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大
        token 数。默认为 `inf`.

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

        模型可以响应的模态集合。默认值为 `["audio"]`，表示
        模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
        模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `parallel_tool_calls: optional boolean`

        模型是否可以在并行调用多个工具。仅由
        推理 Realtime 模型，例如 `gpt-realtime-2`.

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          要在你的
          提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional RealtimeToolChoiceConfig`

        模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（如果有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或多
          个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional RealtimeToolsConfig`

        模型可使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时如何告知用户的指导
            （如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
          （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
            URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
            必须处理 OAuth 授权流程，并在此提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. 当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

      - `tracing: optional RealtimeTracingConfig or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
        追踪，就无法再修改该配置。

        `auto` 将为会话创建一个使用默认值的追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
            筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中命名该追踪。

      - `truncation: optional RealtimeTruncation`

        当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

        截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

        截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

        - `"auto" or "disabled"`

          该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

          - `retention_ratio: number`

            在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

    - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

      实时转录会话对象配置。

      - `type: "transcription"`

        要创建的会话类型。对于 Realtime API 始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional RealtimeTranscriptionSessionAudio`

        输入和输出音频的配置。

        - `input: optional RealtimeTranscriptionSessionAudioInput`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。可设置为 `null` 以关闭。
            降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional AudioTranscription`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

          - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。此设置
                适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                超时时间将在最后一个模型响应的音频播放完成后生效，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 相关联）将在达到超时阈值时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短句停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已说完。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当向默认
                会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.update"`

    事件类型，必须为 `session.update`.

    - `"session.update"`

  - `event_id: optional string`

    用于标识此事件的可选客户端生成 ID。这是由客户端自行指定的任意字符串。如果事件发生错误，它将被传回，但对应的 `session.updated` 事件将不会包含它。

### 会话已更新事件

- `SessionUpdatedEvent object { event_id, session, type }`

  当会话通过 `session.update` 事件更新时返回，除非
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

        要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
            降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

              为输入音频转录配置的提示词（若存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。此设置
                适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                超时时间将在最后一个模型响应的音频播放完成后生效，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 相关联）将在达到超时阈值时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短句停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已说完。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当向默认
                会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，相对于原始速度的倍数。
            1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            此参数是对生成后音频的后处理调整，也可以
            通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
              会话中更改语音。当前
              可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大
        token 数。默认为 `inf`.

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

        模型可以响应的模态集合。默认值为 `["audio"]`，表示
        模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
        模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          要在你的
          提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（如果有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或多
          个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时如何告知用户的指导
            （如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
          （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
            URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
            必须处理 OAuth 授权流程，并在此提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. 当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
        追踪，就无法再修改该配置。

        `auto` 将为会话创建一个使用默认值的追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
            筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中命名该追踪。

      - `truncation: optional RealtimeTruncation`

        当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

        截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

        截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

        - `"auto" or "disabled"`

          该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

          - `retention_ratio: number`

            在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      实时转录会话的配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型，始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

              为输入音频转录配置的提示词（若存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
            音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前要包含的音频量（单位为
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（单位为毫秒）。默认值
              500ms。值越小，模型响应越快，
              但可能会在用户短句停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `type: "session.updated"`

    事件类型，必须为 `session.updated`.

    - `"session.updated"`

### 转录会话更新

- `TranscriptionSessionUpdate object { session, type, event_id }`

  发送此事件以更新转录会话。

  - `session: object { include, input_audio_format, input_audio_noise_reduction, 2 more }`

    实时转录会话对象配置。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      转录中要包含的项目集合。当前可用的项目包括：
      `item.input_audio_transcription.logprobs`

      - `"item.input_audio_transcription.logprobs"`

    - `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

      输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
      对于 `pcm16`，输入音频必须为 16 位 PCM、24kHz 采样率，
      单声道，并采用小端字节序。

      - `"pcm16"`

      - `"g711_ulaw"`

      - `"g711_alaw"`

    - `input_audio_noise_reduction: optional object { type }`

      输入音频降噪的配置。可设置为 `null` 以关闭。
      降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `input_audio_transcription: optional AudioTranscription`

      输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，为转录服务提供额外的引导。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在发出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。以
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        提供可提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频片段的可选文本。
        片段。
        对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
        以下模型不支持 prompt： `gpt-realtime-whisper` 。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前要包含的音频量（单位为
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静音持续时间（单位为毫秒）。默认值
        500ms。值越小，模型响应越快，
        但可能会在用户短句停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值需要更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

      - `type: optional "server_vad"`

        轮次检测类型。目前仅 `server_vad` 支持用于转录会话。

        - `"server_vad"`

  - `type: "transcription_session.update"`

    事件类型，必须为 `transcription_session.update`.

    - `"transcription_session.update"`

  - `event_id: optional string`

    可选的、由客户端生成的 ID，用于标识此事件。

### 转写会话更新事件

- `TranscriptionSessionUpdatedEvent object { event_id, session, type }`

  当转录会话更新时返回 `transcription_session.update` 事件更新时返回，除非
  出现错误。

  - `event_id: string`

    服务端事件的唯一 ID。

  - `session: object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

    新的实时转录会话配置。

    当通过 REST API 在服务端创建会话时，会话对象
    还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
    当通过 WebSocket API 更新会话时，不包含此属性。

    - `client_secret: object { expires_at, value }`

      由 API 返回的临时密钥。仅在通过 REST 接口 创建
      通过 REST API 在服务端创建。

      - `expires_at: number`

        令牌的过期时间戳。目前，所有令牌均会在
        一分钟后过期。

      - `value: string`

        可在客户端环境中用于验证连接身份的临时密钥
        到 Realtime API 的连接。在客户端环境中使用此密钥，而不是使用
        标准 API 令牌；标准令牌只能在 服务端使用。

    - `input_audio_format: optional string`

      输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

    - `input_audio_transcription: optional object { language, languages, model, prompt }`

      转录模型的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

        为输入音频转录配置的提示词（若存在）。

    - `modalities: optional array of "text" or "audio"`

      模型可以响应的模态集合。若要禁用音频，
      请将其设置为 ["text"]。

      - `"text"`

      - `"audio"`

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

      轮次检测配置。可设置为 `null` 以关闭。服务端
      VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
      音频音量，并在用户语音结束时作出响应。

      - `prefix_padding_ms: optional number`

        在 VAD 检测到语音之前要包含的音频量（单位为
        为毫秒）。默认为 300ms。

      - `silence_duration_ms: optional number`

        检测语音停止的静音持续时间（单位为毫秒）。默认值
        500ms。值越小，模型响应越快，
        但可能会在用户短句停顿时插话。

      - `threshold: optional number`

        VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
        高的阈值需要更响亮的音频才能激活模型，因此
        在嘈杂环境中可能表现更好。

      - `type: optional string`

        轮次检测的类型，仅 `server_vad` 当前受支持。

  - `type: "transcription_session.updated"`

    事件类型，必须为 `transcription_session.updated`.

    - `"transcription_session.updated"`

# 通话

## 接听通话

**post** `/realtime/calls/{call_id}/accept`

接听来电 SIP 呼叫并配置将用于处理该呼叫的实时会话
的实时会话。

### 路径参数

- `call_id: string`

### 请求体参数

- `type: "realtime"`

  要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
      降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
      对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

      - `type: optional NoiseReductionType`

        降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional AudioTranscription`

      输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

      - `delay: optional "minimal" or "low" or "medium" or 2 more`

        控制模型在发出转录文本之前等待的时间。
        较高的值可以提高转录准确率，但会增加延迟。
        仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

      - `keywords: optional array of string`

        用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `language: optional string`

        输入音频的语言。以
        [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
        提供可提高准确率并降低延迟。

      - `languages: optional array of string`

        输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

      - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

        用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

        - `string`

        - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

          - `"whisper-1"`

          - `"gpt-transcribe"`

          - `"gpt-live-transcribe"`

          - `"gpt-4o-mini-transcribe"`

          - `"gpt-4o-mini-transcribe-2025-12-15"`

          - `"gpt-4o-transcribe"`

          - `"gpt-4o-transcribe-diarize"`

          - `"gpt-realtime-whisper"`

      - `prompt: optional string`

        用于引导模型风格或延续先前音频片段的可选文本。
        片段。
        对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
        对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
        以下模型不支持 prompt： `gpt-realtime-whisper` 。

    - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

      轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

      Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

      Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

      对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
      设置为 `null`；不支持 VAD。

      - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

        服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

        - `type: "server_vad"`

          轮次检测类型， `server_vad` 以开启简单 Server VAD。

          - `"server_vad"`

        - `create_response: optional boolean`

          在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `idle_timeout_ms: optional number or null`

          可选的超时时间，超过该时间后将自动触发模型响应。此设置
          适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
          当前上下文有效地提示用户继续对话。
          当前上下文。

          超时时间将在最后一个模型响应的音频播放完成后生效，
          即设置为 `response.done` 时间加上音频播放时长。

          一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
          与 Response 相关联）将在达到超时阈值时发出。
          空闲超时目前仅支持 `server_vad` 模式。

        - `interrupt_response: optional boolean`

          当 VAD start 事件发生时，是否自动中断（取消）默认
          会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

          如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

        - `prefix_padding_ms: optional number`

          仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
          500ms。值越小，模型响应越快，
          但可能会在用户短句停顿时插话。

        - `threshold: optional number`

          仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
          高的阈值需要更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

      - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

        服务端语义轮次检测，使用模型来判断用户何时已说完。

        - `type: "semantic_vad"`

          轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

          - `"semantic_vad"`

        - `create_response: optional boolean`

          当 VAD stop 事件发生时，是否自动生成响应。

        - `eagerness: optional "low" or "medium" or "high" or "auto"`

          仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `interrupt_response: optional boolean`

          当向默认
          会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

  - `output: optional RealtimeAudioConfigOutput`

    - `format: optional RealtimeAudioFormats`

      输出音频的格式。

    - `speed: optional number`

      模型语音响应的速度，相对于原始速度的倍数。
      1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

      此参数是对生成后音频的后处理调整，也可以
      通过提示让模型说得更快或更慢。

    - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

      模型用于回应的声音。支持的内置声音有
      `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
      `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
      一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
      使用音频回应过至少一次，会话期间就无法再更改声音。
      我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

  在服务端输出中包含的附加字段。

  `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

  注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大
  token 数。默认为 `inf`.

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

  模型可以响应的模态集合。默认值为 `["audio"]`，表示
  模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
  模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

  - `"text"`

  - `"audio"`

- `parallel_tool_calls: optional boolean`

  模型是否可以在并行调用多个工具。仅由
  推理 Realtime 模型，例如 `gpt-realtime-2`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    要在你的
    提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
    响应输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

        发送给模型的文件 ID。

      - `image_url: optional string or null`

        发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `reasoning: optional RealtimeReasoning`

  用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

  - `effort: optional RealtimeReasoningEffort`

    限制支持推理的 Realtime 模型（例如
    `gpt-realtime-2`.

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

- `tool_choice: optional RealtimeToolChoiceConfig`

  模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
  function/MCP 工具。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（如果有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或多
    个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用特定函数。

    - `name: string`

      要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具名称。

- `tools: optional RealtimeToolsConfig`

  模型可使用的工具。

  - `RealtimeFunctionTool object { description, name, parameters, type }`

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时如何告知用户的指导
      （如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `McpTool object { server_label, type, allowed_callers, 9 more }`

    通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
    （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

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

        允许使用的工具名称的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个 MCP
          服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤条件。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
      URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
      必须处理 OAuth 授权流程，并在此提供该令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
      关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

      当前支持 `connector_id` 的取值包括：

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

      此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，也可以是与需要审批的工具关联的筛选对象
        。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`. 当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中一个。

    - `tunnel_id: optional string`

      要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

- `tracing: optional RealtimeTracingConfig or null`

  Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
  追踪，就无法再修改该配置。

  `auto` 将为会话创建一个使用默认值的追踪，用于
  工作流名称、组 ID 和元数据。

  - `Auto = "auto"`

    启用追踪并设置追踪配置选项的默认值。始终 `auto`.

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
      分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
      筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在 Traces Dashboard 中命名该追踪。

- `truncation: optional RealtimeTruncation`

  当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

  截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

  截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

  - `"auto" or "disabled"`

    该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

    - `retention_ratio: number`

      在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

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

结束一个活跃的 Realtime API 调用，无论该调用是通过 SIP 还是
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

使用 SIP REFER 方法将进行中的 SIP 通话转接到新的目标方。

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

通过向来电方返回 SIP 状态码来拒绝来电 SIP 通话。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  发送回主叫方的 SIP 响应码。默认为 `603` (Decline)
  （省略时）。

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

创建一个 Realtime 客户端密钥，并附带关联的会话配置。

客户端密钥是短期有效的令牌，可以传递给客户端应用，
例如 Web 前端或移动客户端，从而获得对 Realtime API 的访问权限，而不会泄露你的主 API 密钥。
你可以为每个客户端密钥配置自定义 TTL。

你还可以在客户端密钥上附加会话配置选项，这些选项将应用于使用该客户端密钥创建的所有会话，但也可以被
客户端连接覆盖。
由客户端连接覆盖。

[了解有关通过 WebRTC 使用客户端密钥进行身份验证的更多信息](/docs/guides/realtime-webrtc).

返回创建的客户端密钥以及有效的会话对象。客户端密钥是一个字符串，形如 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期时间指的是此后客户端密钥
  将无法再用于创建会话的时间点。会话本身一旦开始，即使过了
  该时间点仍可能继续运行。一个密钥在其过期之前可以用于创建多个会话，
  直到它过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，指的是 `seconds` 将叠加到 `created_at` 客户端密钥的时间上，从而生成过期时间戳。仅 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。取值范围在 `10` 和 `7200` （2 小时）之间。如果未指定，默认值为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择任一实时
  会话或转录会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime 会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在发出转录文本之前等待的时间。
            较高的值可以提高转录准确率，但会增加延迟。
            仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。以
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            提供可提高准确率并降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续先前音频片段的可选文本。
            片段。
            对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
            以下模型不支持 prompt： `gpt-realtime-whisper` 。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。此设置
              适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              当前上下文。

              超时时间将在最后一个模型响应的音频播放完成后生效，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 相关联）将在达到超时阈值时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短句停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时已说完。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当向默认
              会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，相对于原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          此参数是对生成后音频的后处理调整，也可以
          通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于回应的声音。支持的内置声音有
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以使用以下方式提供自定义声音对象
          一个 `id`，例如 `{ "id": "voice_1234" }`。一旦模型已经
          使用音频回应过至少一次，会话期间就无法再更改声音。
          我们推荐使用 `marin` 和 `cedar` 以获得最佳质量。

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

      在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

      注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大
      token 数。默认为 `inf`.

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

      模型可以响应的模态集合。默认值为 `["audio"]`，表示
      模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
      模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      模型是否可以在并行调用多个工具。仅由
      推理 Realtime 模型，例如 `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        要在你的
        提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
        响应输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或多
        个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional RealtimeToolsConfig`

      模型可使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时如何告知用户的指导
          （如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
        （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

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

            允许使用的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
          URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
          必须处理 OAuth 授权流程，并在此提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
          关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持 `connector_id` 的取值包括：

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

          此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，也可以是与需要审批的工具关联的筛选对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`. 当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
      追踪，就无法再修改该配置。

      `auto` 将为会话创建一个使用默认值的追踪，用于
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
          筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。这用于
          在 Traces Dashboard 中命名该追踪。

    - `truncation: optional RealtimeTruncation`

      当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

      截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

      截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

      - `"auto" or "disabled"`

        该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

        - `retention_ratio: number`

          在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

          - `post_instructions: optional number`

            指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API 始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可设置为 `null` 以关闭。
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。此设置
              适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              当前上下文。

              超时时间将在最后一个模型响应的音频播放完成后生效，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 相关联）将在达到超时阈值时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短句停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时已说完。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当向默认
              会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### Returns

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元起的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  用于实时或转写会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
          降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

            为输入音频转录配置的提示词（若存在）。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              轮次检测类型， `server_vad` 以开启简单 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发模型响应。此设置
              适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
              当前上下文有效地提示用户继续对话。
              当前上下文。

              超时时间将在最后一个模型响应的音频播放完成后生效，
              即设置为 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
              与 Response 相关联）将在达到超时阈值时发出。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当 VAD start 事件发生时，是否自动中断（取消）默认
              会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
              500ms。值越小，模型响应越快，
              但可能会在用户短句停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
              高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用模型来判断用户何时已说完。

            - `type: "semantic_vad"`

              轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD stop 事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当向默认
              会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音响应的速度，相对于原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          此参数是对生成后音频的后处理调整，也可以
          通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
          会话中更改语音。当前
          可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

      会话的过期时间戳，自 epoch 起以秒为单位。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      在服务端输出中包含的附加字段。

      `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

      注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包括工具调用。提供 1 到 4096 之间的整数以
      限制输出 token，或 `inf` 表示给定模型可用的最大
      token 数。默认为 `inf`.

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

      模型可以响应的模态集合。默认值为 `["audio"]`，表示
      模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
      模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        要在你的
        提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
        响应输入类型，例如图片或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或多
        个工具之间进行选择。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用特定函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可使用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括关于何时以及如何
          调用它的指导，以及关于调用时如何告知用户的指导
          （如果有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          以 JSON Schema 表示的函数参数。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
        （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

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

            允许使用的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
          URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
          必须处理 OAuth 授权流程，并在此提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
          关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

          当前支持 `connector_id` 的取值包括：

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

          此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`，也可以是与需要审批的工具关联的筛选对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`. 当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供其中一个。

        - `tunnel_id: optional string`

          要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
      追踪，就无法再修改该配置。

      `auto` 将为会话创建一个使用默认值的追踪，用于
      工作流名称、组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        追踪的细粒度配置。

        - `group_id: optional string`

          附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
          筛选。

        - `workflow_name: optional string`

          附加到此追踪的工作流名称。这用于
          在 Traces Dashboard 中命名该追踪。

    - `truncation: optional RealtimeTruncation`

      当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

      截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

      截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

      - `"auto" or "disabled"`

        该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

        - `retention_ratio: number`

          在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

          - `post_instructions: optional number`

            指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    实时转录会话的配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话的类型，始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional object { input }`

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

            为输入音频转录配置的提示词（若存在）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测配置。可设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
          音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前要包含的音频量（单位为
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间（单位为毫秒）。默认值
            500ms。值越小，模型响应越快，
            但可能会在用户短句停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
            高的阈值需要更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

          - `type: optional string`

            轮次检测的类型，仅 `server_vad` 当前受支持。

    - `expires_at: optional number`

      会话的过期时间戳，自 epoch 起以秒为单位。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      在服务端输出中包含的附加字段。

      - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

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

## 域名类型

### Client Secret 创建响应

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元起的秒数表示。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    用于实时或转写会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
            降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
            对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

              为输入音频转录配置的提示词（若存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                轮次检测类型， `server_vad` 以开启简单 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `idle_timeout_ms: optional number or null`

                可选的超时时间，超过该时间后将自动触发模型响应。此设置
                适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
                当前上下文有效地提示用户继续对话。
                当前上下文。

                超时时间将在最后一个模型响应的音频播放完成后生效，
                即设置为 `response.done` 时间加上音频播放时长。

                一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
                与 Response 相关联）将在达到超时阈值时发出。
                空闲超时目前仅支持 `server_vad` 模式。

              - `interrupt_response: optional boolean`

                当 VAD start 事件发生时，是否自动中断（取消）默认
                会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

              - `prefix_padding_ms: optional number`

                仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
                为毫秒）。默认为 300ms。

              - `silence_duration_ms: optional number`

                仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
                500ms。值越小，模型响应越快，
                但可能会在用户短句停顿时插话。

              - `threshold: optional number`

                仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
                高的阈值需要更响亮的音频才能激活模型，因此
                在嘈杂环境中可能表现更好。

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，使用模型来判断用户何时已说完。

              - `type: "semantic_vad"`

                轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD stop 事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当向默认
                会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型语音响应的速度，相对于原始速度的倍数。
            1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            此参数是对生成后音频的后处理调整，也可以
            通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
            会话中更改语音。当前
            可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
              会话中更改语音。当前
              可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

        注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

      - `max_output_tokens: optional number or "inf"`

        单次助手响应的最大输出 token 数，
        包括工具调用。提供 1 到 4096 之间的整数以
        限制输出 token，或 `inf` 表示给定模型可用的最大
        token 数。默认为 `inf`.

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

        模型可以响应的模态集合。默认值为 `["audio"]`，表示
        模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
        模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        对提示模板及其变量的引用。
        [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          要使用的提示模板的唯一标识符。

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          要在你的
          提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
          响应输入类型，例如图片或文件。

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          提示模板的可选版本。

      - `reasoning: optional RealtimeReasoning`

        用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（如果有）。

          `none` 表示模型不会调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息与调用一个或多
          个工具之间进行选择。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用特定函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

          - `server_label: string`

            要使用的 MCP 服务器的标签。

          - `type: "mcp"`

            对于 MCP 工具，类型始终为 `mcp`.

            - `"mcp"`

          - `name: optional string or null`

            要在服务器上调用的工具名称。

      - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

        模型可使用的工具。

        - `RealtimeFunctionTool object { description, name, parameters, type }`

          - `description: optional string`

            函数的描述，包括关于何时以及如何
            调用它的指导，以及关于调用时如何告知用户的指导
            （如果有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            以 JSON Schema 表示的函数参数。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
          （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤条件。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
            URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
            必须处理 OAuth 授权流程，并在此提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持 `connector_id` 的取值包括：

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

            此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，也可以是与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个 MCP
                  服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤条件。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. 当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中一个。

          - `tunnel_id: optional string`

            要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
        追踪，就无法再修改该配置。

        `auto` 将为会话创建一个使用默认值的追踪，用于
        工作流名称、组 ID 和元数据。

        - `Auto = "auto"`

          启用追踪并设置追踪配置选项的默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          追踪的细粒度配置。

          - `group_id: optional string`

            附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
            筛选。

          - `workflow_name: optional string`

            附加到此追踪的工作流名称。这用于
            在 Traces Dashboard 中命名该追踪。

      - `truncation: optional RealtimeTruncation`

        当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

        截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

        截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

        - `"auto" or "disabled"`

          该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

          - `retention_ratio: number`

            在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

            - `post_instructions: optional number`

              指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      实时转录会话的配置对象。

      - `id: string`

        会话的唯一标识符，形如 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话的类型，始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

              为输入音频转录配置的提示词（若存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
            音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              在 VAD 检测到语音之前要包含的音频量（单位为
              为毫秒）。默认为 300ms。

            - `silence_duration_ms: optional number`

              检测语音停止的静音持续时间（单位为毫秒）。默认值
              500ms。值越小，模型响应越快，
              但可能会在用户短句停顿时插话。

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
              高的阈值需要更响亮的音频才能激活模型，因此
              在嘈杂环境中可能表现更好。

            - `type: optional string`

              轮次检测的类型，仅 `server_vad` 当前受支持。

      - `expires_at: optional number`

        会话的过期时间戳，自 epoch 起以秒为单位。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        在服务端输出中包含的附加字段。

        - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

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

    要创建的会话类型。对于 Realtime API 始终为 `realtime` 。

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
        降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
        对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置，默认关闭，可设置为 `null` 以在开启后关闭。输入音频转录并非模型原生功能，因为模型直接消费音频。转录通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应视为对输入音频内容的指引，而非模型所听到内容的精确转录。客户端可以选择性地设置转录的语言和提示，以为转录服务提供额外指引。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

          为输入音频转录配置的提示词（若存在）。

      - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

        轮次检测的配置，可以是 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于该概率动态设置超时时间。例如，如果用户的音频以 "uhhm" 结尾，模型将为轮次结束打出较低的概率评分，并等待更长时间以便用户继续说话。这有助于实现更自然的对话，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` 转录会话中，轮次检测必须为
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            轮次检测类型， `server_vad` 以开启简单 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            在 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 被设置为 `false` ，当模型已经在响应时，可能会导致无法生成响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

          - `idle_timeout_ms: optional number or null`

            可选的超时时间，超过该时间后将自动触发模型响应。此设置
            适用于用户出现较长停顿属于异常情况的场景，例如电话通话。模型将根据
            当前上下文有效地提示用户继续对话。
            当前上下文。

            超时时间将在最后一个模型响应的音频播放完成后生效，
            即设置为 `response.done` 时间加上音频播放时长。

            一个 `input_audio_buffer.timeout_triggered` 事件（以及事件
            与 Response 相关联）将在达到超时阈值时发出。
            空闲超时目前仅支持 `server_vad` 模式。

          - `interrupt_response: optional boolean`

            当 VAD start 事件发生时，是否自动中断（取消）默认
            会话（即。 `conversation` 的 `auto`）正在进行的任何带有输出的响应。如果 `true` 为 true，则该响应将被取消，否则它将一直继续直到完成。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但 VAD 事件仍会发出。

          - `prefix_padding_ms: optional number`

            仅用于 `server_vad` 模式。在 VAD 检测到语音之前要包含的音频量（单位
            为毫秒）。默认为 300ms。

          - `silence_duration_ms: optional number`

            仅用于 `server_vad` 模式。检测语音停止的静默时长（单位为毫秒）。默认为
            500ms。值越小，模型响应越快，
            但可能会在用户短句停顿时插话。

          - `threshold: optional number`

            仅用于 `server_vad` 模式。VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较
            高的阈值需要更响亮的音频才能激活模型，因此
            在嘈杂环境中可能表现更好。

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，使用模型来判断用户何时已说完。

          - `type: "semantic_vad"`

            轮次检测类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD stop 事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            仅用于 `semantic_vad` 模式。模型的响应积极性。 `low` 会等待更长时间以便用户继续说话， `high` 会更快地做出响应。 `auto` 为默认值，等同于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当向默认
            会话（即。 `conversation` 的 `auto`）发送输出时，是否自动中断任何正在进行的响应，发生 VAD start 事件时。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型语音响应的速度，相对于原始速度的倍数。
        1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

        此参数是对生成后音频的后处理调整，也可以
        通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
        会话中更改语音。当前
        可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的语音。一旦模型至少回复过一次音频，就无法在
          会话中更改语音。当前
          可用的语音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    会话的过期时间戳，自 epoch 起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的附加字段。

    `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预置到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型生成所需的响应。可以指示模型的响应内容和格式（例如“极其简洁”、“表现得友好”、“以下是良好响应的示例”），以及音频行为（例如“语速快”、“在声音中注入情感”、“经常大笑”）。这些指令不一定会被模型遵循，但它们为模型提供了所需行为的指导。

    注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大
    token 数。默认为 `inf`.

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

    模型可以响应的模态集合。默认值为 `["audio"]`，表示
    模型将以音频加转录的形式进行响应。 `["text"]` 可用于使
    模型仅以文本形式进行响应。无法同时请求两者 `text` 和 `audio` 。

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      要在你的
      提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
      响应输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

        - `text: string`

          模型的文本输入。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

        - `type: "input_file"`

          输入项的类型。始终为 `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      提示模板的可选版本。

  - `reasoning: optional RealtimeReasoning`

    用于支持推理的 Realtime 模型（例如 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。可提供下述字符串模式之一，或强制使用特定工具。
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有）。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或多
      个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用特定函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    模型可使用的工具。

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        函数的描述，包括关于何时以及如何
        调用它的指导，以及关于调用时如何告知用户的指导
        （如果有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        以 JSON Schema 表示的函数参数。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol (MCP) 服务器为模型提供对其他工具的访问权限。
      （服务器。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

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

          允许使用的工具名称的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个 MCP
            服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤条件。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合自定义 MCP 服务器
        URL 或服务连接器使用。你的应用程序必须处理 OAuth 授权流程，并在此提供该令牌。
        必须处理 OAuth 授权流程，并在此提供该令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
        关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持 `connector_id` 的取值包括：

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

        此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头。可用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，也可以是与需要审批的工具关联的筛选对象
          。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤条件。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`. 当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中一个。

      - `tunnel_id: optional string`

        要使用的 Secure MCP Tunnel ID，而不是直接使用服务器 URL。
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中一个。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入到 [Traces Dashboard](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用追踪。一旦为会话启用了
    追踪，就无法再修改该配置。

    `auto` 将为会话创建一个使用默认值的追踪，用于
    工作流名称、组 ID 和元数据。

    - `Auto = "auto"`

      启用追踪并设置追踪配置选项的默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
        筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在 Traces Dashboard 中命名该追踪。

  - `truncation: optional RealtimeTruncation`

    当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

    截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

    截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

    - `"auto" or "disabled"`

      该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

      - `retention_ratio: number`

        在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

        - `post_instructions: optional number`

          指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

### Realtime Transcription Session Create Response

- `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

  实时转录会话的配置对象。

  - `id: string`

    会话的唯一标识符，形如 `sess_1234567890abcdef`.

  - `object: string`

    对象类型。始终为 `realtime.transcription_session`.

  - `type: "transcription"`

    会话的类型，始终为 `transcription` 用于转录会话。

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

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        转录模型的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

          为输入音频转录配置的提示词（若存在）。

      - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

        轮次检测配置。可设置为 `null` 以关闭。服务端
        VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
        音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          在 VAD 检测到语音之前要包含的音频量（单位为
          为毫秒）。默认为 300ms。

        - `silence_duration_ms: optional number`

          检测语音停止的静音持续时间（单位为毫秒）。默认值
          500ms。值越小，模型响应越快，
          但可能会在用户短句停顿时插话。

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
          高的阈值需要更响亮的音频才能激活模型，因此
          在嘈杂环境中可能表现更好。

        - `type: optional string`

          轮次检测的类型，仅 `server_vad` 当前受支持。

  - `expires_at: optional number`

    会话的过期时间戳，自 epoch 起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的附加字段。

    - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
  音频音量作出响应，并在用户语音结束时作出回应。对于 `gpt-realtime-whisper`，这必须为 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前要包含的音频量（单位为
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（单位为毫秒）。默认值
    500ms。值越小，模型响应越快，
    但可能会在用户短句停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 当前受支持。

# Sessions

## Create session

**post** `/realtime/sessions`

创建一个用于客户端应用的临时 API 令牌，配合
Realtime API 使用。可使用与会话相同的会话参数进行配置，
`session.update` 客户端事件。

其响应为一个会话对象，以及一个 `client_secret` 密钥，其中包含
一个可用的临时 API 令牌，可用于浏览器客户端鉴权
Realtime API。

返回创建的 Realtime 会话对象以及一个临时密钥。

### 请求体参数

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。

  - `expires_at: number`

    令牌的过期时间戳。目前，所有令牌均会在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于验证连接身份的临时密钥
    到 Realtime API 的连接。在客户端环境中使用此密钥，而不是使用
    标准 API 令牌；标准令牌只能在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { model }`

  输入音频转录的配置，默认关闭，可在
  设置为 `null` 开启后关闭。输入音频转录并非模型原生
  支持的功能，因为模型直接处理音频。转录异步
  异步执行，应视为粗略参考
  而非模型所理解的表示。

  - `model: optional string`

    用于转录的模型。

- `instructions: optional string`

  默认的系统指令（即系统消息）会预置到模型调用之前。此字段允许客户端引导模型输出期望的响应。可以指示模型响应的内容和格式（例如“极其简洁”、“表现得友好”、“以下是优秀响应的示例”），以及音频行为（例如“语速较快”、“在声音中注入情感”、“经常笑”）。指令不一定被模型遵循，但它们为模型期望的行为提供了指导。
  注意，服务器会设置默认指令，如果未设置此字段则会使用该默认指令，并且默认指令在会话开始时的 `session.created` 事件中可见。

- `max_response_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大
  token 数。默认为 `inf`.

  - `number`

  - `"inf"`

    - `"inf"`

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `output_audio_format: optional string`

  输出音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    要在你的
    提示中替换的变量的可选值映射。替换值可以是字符串，也可以是其他
    响应输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

      - `text: string`

        模型的文本输入。

      - `type: "input_text"`

        输入项的类型。始终为 `input_text`.

        - `"input_text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      发送给模型的图像输入。了解关于 [图像输入](/docs/guides/vision).

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

        发送给模型的文件 ID。

      - `image_url: optional string or null`

        发送给模型的图像 URL。可以是完整的 URL，也可以是 data URL 中 base64 编码的图像。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      发送给模型的文件输入。

      - `type: "input_file"`

        输入项的类型。始终为 `input_file`.

        - `"input_file"`

      - `detail: optional "auto" or "low" or "high"`

        发送给模型的文件的细节级别。使用 `auto` 以让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可获得更低成本的渲染，或者 `high` 以更高质量渲染文件。默认值为 `auto`.

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

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；该边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `version: optional string or null`

    提示模板的可选版本。

- `speed: optional number`

  模型语音响应的速度。1.0 为默认速度。0.25 为
  最低速度，1.5 为最高速度。此值只能在模型轮次之间更改，
  不能在响应进行中更改。

- `temperature: optional number`

  模型的采样温度，范围限制为 [0.6, 1.2]。默认为 0.8。

- `tool_choice: optional string`

  模型选择工具的方式。可选项为 `auto`, `none`, `required`，或
  指定函数。

- `tools: optional array of object { description, name, parameters, type }`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时如何告知用户的指导
    （如果有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪 的配置选项。设为 null 以禁用 追踪。一旦
  追踪，就无法再修改该配置。

  `auto` 将为会话创建一个使用默认值的追踪，用于
  工作流名称、组 ID 和元数据。

  - `"auto"`

    会话的默认 追踪 模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
      在追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在追踪仪表板中为 追踪 命名。

- `truncation: optional RealtimeTruncation`

  当会话中的 token 数超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）不会被纳入模型的上下文。拥有 32k 上下文和 4,096 最大输出 token 的模型，在发生截断之前其上下文中只能包含 28,224 个 token。

  客户端可以配置截断行为，使用更低的最大 token 上限进行截断，这是控制 token 用量和成本的有效方式。

  截断会减少下一轮中被缓存的 token 数量（导致缓存失效），因为消息是从上下文的开头开始丢弃的。不过，客户端也可以将截断配置为在达到最大上下文大小的某个比例时仍保留消息，从而减少未来截断的次数，进而提高缓存命中率。

  截断功能可以被完全禁用，这意味着服务端永远不会进行截断，但如果会话超过模型的输入 token 上限，将改为返回错误。

  - `"auto" or "disabled"`

    该会话使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在会话超过输入 token 上限时返回错误。

    - `"auto"`

    - `"disabled"`

  - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

    当会话超过输入 token 上限时，保留一定比例的会话 token。这允许你将截断分摊到多个轮次中，有助于提升缓存 token 的使用效率。

    - `retention_ratio: number`

      在会话超过输入 token 上限时，需保留的指令后会话 token 的比例（`0.0` - `1.0`）。将此值设置为 `0.8` 意味着将丢弃消息，直到剩余 token 占最大允许 token 数的 80%。这有助于降低截断频率并提高缓存命中率。

    - `type: "retention_ratio"`

      使用保留比例截断。

      - `"retention_ratio"`

    - `token_limits: optional object { post_instructions }`

      此截断策略的可选自定义令牌限制。如果未提供，将使用模型的默认令牌限制。

      - `post_instructions: optional number`

        指令之后会话中允许的最大令牌数（包括工具定义）。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 个令牌时将发生截断。此值不能高于模型上下文窗口大小减去最大输出令牌数。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
  音频音量，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前要包含的音频量（单位为
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（单位为毫秒）。默认值
    500ms。值越小，模型响应越快，
    但可能会在用户短句停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional string`

    轮次检测的类型，仅 `server_vad` 当前受支持。

- `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  模型用于回应的声音。支持的内置声音有
  `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
  `marin`，以及 `cedar`。你也可以提供一个包含音频转录字段的自定义 voice 对象，
  `id`，例如 `{ "id": "voice_1234" }`。语音在会话期间无法更改，
  一旦模型至少响应过一次音频后便不能更改。

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

        降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

        - `"near_field"`

        - `"far_field"`

    - `transcription: optional object { language, languages, model, prompt }`

      输入音频转录的配置。

      - `language: optional string`

        输入音频的语言。

      - `languages: optional array of string`

        为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

        为输入音频转录配置的提示词（若存在）。

    - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

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

  会话的过期时间戳，自 epoch 起以秒为单位。

- `include: optional array of "item.input_audio_transcription.logprobs"`

  在服务端输出中包含的附加字段。

  - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

  - `"item.input_audio_transcription.logprobs"`

- `instructions: optional string`

  默认的系统指令（即系统消息），会被添加到模型调用的
  前面。该字段允许客户端引导模型给出期望的
  响应。可指示模型采用特定的响应内容和格式，
  （例如“极其简洁”、“表现得友好”、“下面是一些良好的
  响应示例”），也可以指示音频行为（例如“语速快一些”、“在声音
  到你的声音中","经常笑")。这些指令不保证
  会被模型遵循，但它们为模型提供期望行为的
  指导。

  请注意，服务端会设置默认指令，如果该字段未设置将
  使用这些默认指令，并且可以在 `session.created` 事件中看到，它出现在
  会话开始时。

- `max_output_tokens: optional number or "inf"`

  单次助手响应的最大输出 token 数，
  包括工具调用。提供 1 到 4096 之间的整数以
  限制输出 token，或 `inf` 表示给定模型可用的最大
  token 数。默认为 `inf`.

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
  指定函数。

- `tools: optional array of RealtimeFunctionTool`

  模型可用的工具（函数）。

  - `description: optional string`

    函数的描述，包括关于何时以及如何
    调用它的指导，以及关于调用时如何告知用户的指导
    （如果有）。

  - `name: optional string`

    函数的名称。

  - `parameters: optional unknown`

    以 JSON Schema 表示的函数参数。

  - `type: optional "function"`

    工具的类型，即 `function`.

    - `"function"`

- `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

  追踪 的配置选项。设为 null 以禁用 追踪。一旦
  追踪，就无法再修改该配置。

  `auto` 将为会话创建一个使用默认值的追踪，用于
  工作流名称、组 ID 和元数据。

  - `"auto"`

    会话的默认 追踪 模式。

    - `"auto"`

  - `TracingConfiguration object { group_id, metadata, workflow_name }`

    追踪的细粒度配置。

    - `group_id: optional string`

      附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
      在追踪仪表板中进行分组。

    - `metadata: optional unknown`

      附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
      在追踪仪表板中进行筛选。

    - `workflow_name: optional string`

      附加到此追踪的工作流名称。这用于
      在追踪仪表板中为 追踪 命名。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
  音频音量，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前要包含的音频量（单位为
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（单位为毫秒）。默认值
    500ms。值越小，模型响应越快，
    但可能会在用户短句停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

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

## 域名类型

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

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转录的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

          为输入音频转录配置的提示词（若存在）。

      - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

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

    会话的过期时间戳，自 epoch 起以秒为单位。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    在服务端输出中包含的附加字段。

    - `item.input_audio_transcription.logprobs`：在输入音频转录中包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    默认的系统指令（即系统消息），会被添加到模型调用的
    前面。该字段允许客户端引导模型给出期望的
    响应。可指示模型采用特定的响应内容和格式，
    （例如“极其简洁”、“表现得友好”、“下面是一些良好的
    响应示例”），也可以指示音频行为（例如“语速快一些”、“在声音
    到你的声音中","经常笑")。这些指令不保证
    会被模型遵循，但它们为模型提供期望行为的
    指导。

    请注意，服务端会设置默认指令，如果该字段未设置将
    使用这些默认指令，并且可以在 `session.created` 事件中看到，它出现在
    会话开始时。

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    包括工具调用。提供 1 到 4096 之间的整数以
    限制输出 token，或 `inf` 表示给定模型可用的最大
    token 数。默认为 `inf`.

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
    指定函数。

  - `tools: optional array of RealtimeFunctionTool`

    模型可用的工具（函数）。

    - `description: optional string`

      函数的描述，包括关于何时以及如何
      调用它的指导，以及关于调用时如何告知用户的指导
      （如果有）。

    - `name: optional string`

      函数的名称。

    - `parameters: optional unknown`

      以 JSON Schema 表示的函数参数。

    - `type: optional "function"`

      工具的类型，即 `function`.

      - `"function"`

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }`

    追踪 的配置选项。设为 null 以禁用 追踪。一旦
    追踪，就无法再修改该配置。

    `auto` 将为会话创建一个使用默认值的追踪，用于
    工作流名称、组 ID 和元数据。

    - `"auto"`

      会话的默认 追踪 模式。

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      追踪的细粒度配置。

      - `group_id: optional string`

        附加到此追踪的组 ID，用于在 Traces Dashboard 中进行筛选和
        在追踪仪表板中进行分组。

      - `metadata: optional unknown`

        附加到此追踪的任意元数据，用于在 Traces Dashboard 中启用
        在追踪仪表板中进行筛选。

      - `workflow_name: optional string`

        附加到此追踪的工作流名称。这用于
        在追踪仪表板中为 追踪 命名。

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
    音频音量，并在用户语音结束时作出响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前要包含的音频量（单位为
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静音持续时间（单位为毫秒）。默认值
      500ms。值越小，模型响应越快，
      但可能会在用户短句停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值需要更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 当前受支持。

# Transcription Sessions

## Create transcription session

**post** `/realtime/transcription_sessions`

创建一个用于客户端应用的临时 API 令牌，配合
专用于实时转写的 Realtime API。
可使用与 `transcription_session.update` 客户端事件。

其响应为一个会话对象，以及一个 `client_secret` 密钥，其中包含
一个可用的临时 API 令牌，可用于浏览器客户端鉴权
Realtime API。

返回已创建的 Realtime 转写会话对象以及一个临时密钥。

### 请求体参数

- `include: optional array of "item.input_audio_transcription.logprobs"`

  转录中要包含的项目集合。当前可用的项目包括：
  `item.input_audio_transcription.logprobs`

  - `"item.input_audio_transcription.logprobs"`

- `input_audio_format: optional "pcm16" or "g711_ulaw" or "g711_alaw"`

  输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.
  对于 `pcm16`，输入音频必须为 16 位 PCM、24kHz 采样率，
  单声道，并采用小端字节序。

  - `"pcm16"`

  - `"g711_ulaw"`

  - `"g711_alaw"`

- `input_audio_noise_reduction: optional object { type }`

  输入音频降噪的配置。可设置为 `null` 以关闭。
  降噪会在音频发送到 VAD 和模型之前，对添加到输入音频缓冲区中的音频进行过滤。
  对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报）以及模型性能。

  - `type: optional NoiseReductionType`

    降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

    - `"near_field"`

    - `"far_field"`

- `input_audio_transcription: optional AudioTranscription`

  输入音频转录的配置。客户端可以选择性地设置转录的语言和提示，为转录服务提供额外的引导。

  - `delay: optional "minimal" or "low" or "medium" or 2 more`

    控制模型在发出转录文本之前等待的时间。
    较高的值可以提高转录准确率，但会增加延迟。
    仅在 GA Realtime 会话中支持 `gpt-realtime-whisper` 。

    - `"minimal"`

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

  - `keywords: optional array of string`

    用于引导输入音频转录的词或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `language: optional string`

    输入音频的语言。以
    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
    提供可提高准确率并降低延迟。

  - `languages: optional array of string`

    输入音频可能的语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式提供。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

  - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

    用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

    - `string`

    - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

      用于转录的模型。当前可选项为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。当你需要带说话人标签的说话人分离时，请使用 `gpt-4o-transcribe-diarize` 。

      - `"whisper-1"`

      - `"gpt-transcribe"`

      - `"gpt-live-transcribe"`

      - `"gpt-4o-mini-transcribe"`

      - `"gpt-4o-mini-transcribe-2025-12-15"`

      - `"gpt-4o-transcribe"`

      - `"gpt-4o-transcribe-diarize"`

      - `"gpt-realtime-whisper"`

  - `prompt: optional string`

    用于引导模型风格或延续先前音频片段的可选文本。
    片段。
    对于 `whisper-1`，则 [prompt 为关键词列表](/docs/guides/speech-to-text#prompting).
    对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为自由文本字符串，例如“expect words related to technology”。
    以下模型不支持 prompt： `gpt-realtime-whisper` 。

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端 VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前要包含的音频量（单位为
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（单位为毫秒）。默认值
    500ms。值越小，模型响应越快，
    但可能会在用户短句停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

  - `type: optional "server_vad"`

    轮次检测类型。目前仅 `server_vad` 支持用于转录会话。

    - `"server_vad"`

### Returns

- `client_secret: object { expires_at, value }`

  由 API 返回的临时密钥。仅在通过 REST 接口 创建
  通过 REST API 在服务端创建。

  - `expires_at: number`

    令牌的过期时间戳。目前，所有令牌均会在
    一分钟后过期。

  - `value: string`

    可在客户端环境中用于验证连接身份的临时密钥
    到 Realtime API 的连接。在客户端环境中使用此密钥，而不是使用
    标准 API 令牌；标准令牌只能在 服务端使用。

- `input_audio_format: optional string`

  输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

- `input_audio_transcription: optional object { language, languages, model, prompt }`

  转录模型的配置。

  - `language: optional string`

    输入音频的语言。

  - `languages: optional array of string`

    为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

    为输入音频转录配置的提示词（若存在）。

- `modalities: optional array of "text" or "audio"`

  模型可以响应的模态集合。若要禁用音频，
  请将其设置为 ["text"]。

  - `"text"`

  - `"audio"`

- `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
  音频音量，并在用户语音结束时作出响应。

  - `prefix_padding_ms: optional number`

    在 VAD 检测到语音之前要包含的音频量（单位为
    为毫秒）。默认为 300ms。

  - `silence_duration_ms: optional number`

    检测语音停止的静音持续时间（单位为毫秒）。默认值
    500ms。值越小，模型响应越快，
    但可能会在用户短句停顿时插话。

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
    高的阈值需要更响亮的音频才能激活模型，因此
    在嘈杂环境中可能表现更好。

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

## 域名类型

### 转录会话创建响应

- `TranscriptionSessionCreateResponse object { client_secret, input_audio_format, input_audio_transcription, 2 more }`

  新的实时转录会话配置。

  当通过 REST API 在服务端创建会话时，会话对象
  还包含一个临时密钥。密钥的默认 TTL 为 10 分钟。此
  当通过 WebSocket API 更新会话时，不包含此属性。

  - `client_secret: object { expires_at, value }`

    由 API 返回的临时密钥。仅在通过 REST 接口 创建
    通过 REST API 在服务端创建。

    - `expires_at: number`

      令牌的过期时间戳。目前，所有令牌均会在
      一分钟后过期。

    - `value: string`

      可在客户端环境中用于验证连接身份的临时密钥
      到 Realtime API 的连接。在客户端环境中使用此密钥，而不是使用
      标准 API 令牌；标准令牌只能在 服务端使用。

  - `input_audio_format: optional string`

    输入音频的格式。可选项为 `pcm16`, `g711_ulaw`，或 `g711_alaw`.

  - `input_audio_transcription: optional object { language, languages, model, prompt }`

    转录模型的配置。

    - `language: optional string`

      输入音频的语言。

    - `languages: optional array of string`

      为转录配置的可选输入音频语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

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

      为输入音频转录配置的提示词（若存在）。

  - `modalities: optional array of "text" or "audio"`

    模型可以响应的模态集合。若要禁用音频，
    请将其设置为 ["text"]。

    - `"text"`

    - `"audio"`

  - `turn_detection: optional object { prefix_padding_ms, silence_duration_ms, threshold, type }`

    轮次检测配置。可设置为 `null` 以关闭。服务端
    VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于
    音频音量，并在用户语音结束时作出响应。

    - `prefix_padding_ms: optional number`

      在 VAD 检测到语音之前要包含的音频量（单位为
      为毫秒）。默认为 300ms。

    - `silence_duration_ms: optional number`

      检测语音停止的静音持续时间（单位为毫秒）。默认值
      500ms。值越小，模型响应越快，
      但可能会在用户短句停顿时插话。

    - `threshold: optional number`

      VAD 的激活阈值（0.0 到 1.0），默认值为 0.5。
      高的阈值需要更响亮的音频才能激活模型，因此
      在嘈杂环境中可能表现更好。

    - `type: optional string`

      轮次检测的类型，仅 `server_vad` 当前受支持。

# 翻译

# 客户端密钥

## 创建翻译客户端密钥

**post** `/realtime/translations/client_secrets`

创建一个 Realtime 翻译客户端密钥，并附带相应的翻译会话配置。

客户端密钥是短期有效的令牌，可以传递给客户端应用，
例如网页前端或移动客户端，授予其访问 Realtime
Translation API 的权限，而不会泄露你的主 API 密钥。你可以为每个客户端密钥配置自定义
TTL。

返回已创建的客户端密钥以及生效的翻译会话对象。
客户端密钥是一个形如以下的字符串： `ek_1234`.

### 请求体参数

- `session: RealtimeTranslationSessionCreateRequest`

  Realtime 翻译会话配置。翻译会话持续流式传入源音频，
  并持续流式输出翻译后的音频以及转录增量。

  - `model: string`

    此会话使用的 Realtime 翻译模型。

  - `audio: optional object { input, output }`

    翻译输入和输出音频的配置。

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        可选的输入降噪。设置为 `null` 以禁用该功能。

        - `type: NoiseReductionType`

          降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

        翻译后输出音频和转录增量文本的目标语言。

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期配置。过期时间指的是此后客户端密钥
  将无法再用于创建会话的时间点。会话本身一旦开始，即使过了
  该时间点仍可能继续运行。一个密钥在其过期之前可以用于创建多个会话，
  直到它过期为止。

  - `anchor: optional "created_at"`

    客户端密钥过期的锚点，指的是 `seconds` 将叠加到 `created_at` 客户端密钥的时间上，从而生成过期时间戳。仅 `created_at` 当前受支持。

    - `"created_at"`

  - `seconds: optional number`

    从锚点到过期的秒数。取值范围在 `10` 和 `7200` （2 小时）之间。如果未指定，默认值为 600 秒（10 分钟）。

### Returns

- `RealtimeTranslationClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建翻译会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元起的秒数表示。

  - `session: RealtimeTranslationSession`

    一个 Realtime 翻译会话。翻译会话会持续将输入
    音频翻译为配置好的输出语言。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `audio: object { input, output }`

      翻译输入和输出音频的配置。

      - `input: optional object { noise_reduction, transcription }`

        - `noise_reduction: optional object { type }  or null`

          可选的输入降噪设置。

          - `type: NoiseReductionType`

            降噪类型。 `near_field` 用于近讲麦克风，例如耳机， `far_field` 用于远场麦克风，例如笔记本或会议室麦克风。

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

          翻译后输出音频和转录增量文本的目标语言。

    - `expires_at: number`

      会话的过期时间戳，自 epoch 起以秒为单位。

    - `model: string`

      用于本次会话的 Realtime 翻译模型。此字段在
      会话创建时设置，无法通过 `session.update`.

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
